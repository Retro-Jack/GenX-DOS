/* frontend_sdl.c — GenX-DOS WASM port of VirtualT.
 *
 * The browser front end. VirtualT's emulate() is a blocking loop that calls
 * maint() every gMaintCount instructions; we hook gx_frame() into maint()
 * (one added call in m100emu.c) so that, periodically, we:
 *   - blit the headless 240x64 LCD framebuffer to an SDL2 texture,
 *   - pump SDL keyboard events into io.c's gKeyStates[], and
 *   - emscripten_sleep() to yield to the browser (ASYNCIFY) and pace the run.
 *
 * m100emu.c's own main() stays the entry point; SDL is lazily initialised on
 * the first gx_frame() call.
 */

#include <SDL2/SDL.h>
#include <emscripten.h>
#include <string.h>
#include <stdio.h>
#include <stdlib.h>

extern const unsigned char *get_framebuffer(void);   /* display_headless.c */
extern int display_width(void);
extern int display_height(void);
extern unsigned char gKeyStates[128];                /* io.c: char keys, active-high */
extern unsigned long gSpecialKeys;                   /* io.c: special keys, active-LOW */
extern void update_keys(void);                       /* io.c: rebuilds keyscan[] from the above */

/* --- Battery backup. The real Model 100 has battery-backed RAM; here play.html
   persists the 32 KB of base RAM (0x8000-0xFFFF) to browser storage for the
   Startup Menu, so files survive between sessions. It reads the live RAM via
   gx_ram_ptr()/gx_ram_size(), then (on restore) writes a saved image back over
   it and calls gx_warm_reset() — jump_to_zero() is a warm reboot that keeps RAM,
   so the ROM re-scans the restored directory and the files reappear. --- */
extern unsigned char gBaseMemory[];                  /* memory.c: full 64 KB map */
extern void jump_to_zero(void);                      /* m100emu.c: warm reset (PC=0, RAM kept) */
EMSCRIPTEN_KEEPALIVE unsigned char *gx_ram_ptr(void)  { return &gBaseMemory[0x8000]; }
EMSCRIPTEN_KEEPALIVE int            gx_ram_size(void) { return 0x8000; }
EMSCRIPTEN_KEEPALIVE void           gx_warm_reset(void) { jump_to_zero(); }

/* Special-key masks (io.h). gSpecialKeys is active-low: press = clear bit,
 * release = set bit (init 0xFFFFFFFF = nothing pressed). */
#define MT_SHIFT 0x00000001UL
#define MT_CTRL  0x00000002UL
#define MT_GRAPH 0x00000004UL
#define MT_CODE  0x00000008UL
#define MT_NUM   0x00000010UL
#define MT_CAPS  0x00000020UL
#define MT_PAUSE 0x00000080UL
#define MT_F1    0x00000100UL
#define MT_F2    0x00000200UL
#define MT_F3    0x00000400UL
#define MT_F4    0x00000800UL
#define MT_F5    0x00001000UL
#define MT_F6    0x00002000UL
#define MT_F7    0x00004000UL
#define MT_F8    0x00008000UL
#define MT_SPACE 0x00010000UL
#define MT_BKSP  0x00020000UL
#define MT_TAB   0x00040000UL
#define MT_ESC   0x00080000UL
#define MT_PASTE 0x00100000UL
#define MT_LABEL 0x00200000UL
#define MT_ENTER 0x00800000UL
#define MT_LEFT  0x10000000UL
#define MT_RIGHT 0x20000000UL
#define MT_UP    0x40000000UL
#define MT_DOWN  0x80000000UL

#define SCALE 3                       /* 240x64 -> 720x192 */

static SDL_Window   *win = NULL;
static SDL_Renderer *ren = NULL;
static SDL_Texture  *tex = NULL;
static int W = 240, H = 64;
static Uint32 *pixels = NULL;         /* ARGB8888 upload buffer */

/* Map an SDL keysym to the CHARACTER-key index gKeyStates[] uses (the base
 * lowercase char the key produces). Shift/Ctrl/etc. are handled separately via
 * gSpecialKeys, and the M100 firmware composes shifted characters itself, so we
 * only ever send the base key. Special/non-character keys return -1. */
static int sdl_to_char(SDL_Keycode k)
{
    if (k >= SDLK_a && k <= SDLK_z) return 'a' + (k - SDLK_a);
    if (k >= SDLK_0 && k <= SDLK_9) return '0' + (k - SDLK_0);
    switch (k) {
        case SDLK_MINUS:        return '-';
        case SDLK_EQUALS:       return '=';
        case SDLK_SEMICOLON:    return ';';
        case SDLK_QUOTE:        return '\'';
        case SDLK_COMMA:        return ',';
        case SDLK_PERIOD:       return '.';
        case SDLK_SLASH:        return '/';
        case SDLK_LEFTBRACKET:  return '[';
        case SDLK_RIGHTBRACKET: return ']';
        case SDLK_BACKSLASH:    return '\\';
        default: return -1;
    }
}

/* Map an SDL keysym to a gSpecialKeys mask, or 0 if it isn't a special key. */
static unsigned long sdl_to_special(SDL_Keycode k)
{
    switch (k) {
        case SDLK_RETURN: case SDLK_RETURN2: case SDLK_KP_ENTER: return MT_ENTER;
        case SDLK_SPACE:     return MT_SPACE;
        case SDLK_BACKSPACE: return MT_BKSP;
        case SDLK_TAB:       return MT_TAB;
        case SDLK_ESCAPE:    return MT_ESC;
        case SDLK_LEFT:      return MT_LEFT;
        case SDLK_RIGHT:     return MT_RIGHT;
        case SDLK_UP:        return MT_UP;
        case SDLK_DOWN:      return MT_DOWN;
        case SDLK_LSHIFT: case SDLK_RSHIFT: return MT_SHIFT;
        case SDLK_LCTRL:  case SDLK_RCTRL:  return MT_CTRL;
        case SDLK_LALT:      return MT_GRAPH;
        case SDLK_RALT:      return MT_CODE;
        case SDLK_F1: return MT_F1;  case SDLK_F2: return MT_F2;
        case SDLK_F3: return MT_F3;  case SDLK_F4: return MT_F4;
        case SDLK_F5: return MT_F5;  case SDLK_F6: return MT_F6;
        case SDLK_F7: return MT_F7;  case SDLK_F8: return MT_F8;
        /* Model 100 command keys the PC keyboard has no direct match for.
           F11/F12 are avoided (browser fullscreen / dev-tools). */
        case SDLK_INSERT:    return MT_PASTE;  /* PASTE — insert Copy/Cut text */
        case SDLK_PAUSE:     return MT_PAUSE;  /* PAUSE; Shift+Pause = BREAK (stop a program) */
        case SDLK_F9:        return MT_LABEL;  /* LABEL — show the F-key definitions */
        default: return 0;
    }
}

static void ensure_init(void)
{
    if (win) return;
    W = display_width();
    H = display_height();
    SDL_Init(SDL_INIT_VIDEO);
    win = SDL_CreateWindow("Model 100", SDL_WINDOWPOS_UNDEFINED,
                           SDL_WINDOWPOS_UNDEFINED, W * SCALE, H * SCALE, 0);
    ren = SDL_CreateRenderer(win, -1, 0);
    tex = SDL_CreateTexture(ren, SDL_PIXELFORMAT_ARGB8888,
                            SDL_TEXTUREACCESS_STREAMING, W, H);
    pixels = (Uint32 *)malloc(sizeof(Uint32) * W * H);
}

static void pump_input(void)
{
    SDL_Event e;
    int changed = 0;
    while (SDL_PollEvent(&e)) {
        if (e.type == SDL_KEYDOWN || e.type == SDL_KEYUP) {
            int down = (e.type == SDL_KEYDOWN);
            SDL_Keycode sym = e.key.keysym.sym;
            if (sym == SDLK_CAPSLOCK) {
                /* CAPS LOCK is a toggle (the MT_CAP_LOCK bit, 0x20, which io.c's
                   update_keys reads), not a held key — VirtualT's GUI XOR'd it on
                   each press. Flip it on key-down and ignore key-up. */
                if (down) { gSpecialKeys ^= MT_CAPS; changed = 1; }
                continue;
            }
            unsigned long mask = sdl_to_special(sym);
            if (mask) {
                /* active-low: press clears the bit, release sets it */
                if (down) gSpecialKeys &= ~mask;
                else      gSpecialKeys |=  mask;
                changed = 1;
            } else {
                int idx = sdl_to_char(sym);
                if (idx >= 0 && idx < 128) {
                    gKeyStates[idx] = down ? 1 : 0;
                    changed = 1;
                }
            }
        }
    }
    /* Rebuild io.c's keyscan[] from the states we just changed — the FLTK build
       did this from its key handler (display.cpp); headless we must do it. */
    if (changed)
        update_keys();
}

static void render(void)
{
    const unsigned char *fb = get_framebuffer();
    int i, n = W * H;
    /* M100 LCD: dark pixels on the classic blue-green background. */
    for (i = 0; i < n; i++)
        pixels[i] = fb[i] ? 0xFF1A1A1A : 0xFF8FB89A;
    SDL_UpdateTexture(tex, NULL, pixels, W * sizeof(Uint32));
    SDL_RenderClear(ren);
    SDL_RenderCopy(ren, tex, NULL, NULL);
    SDL_RenderPresent(ren);
}

/* m100emu.c: fullspeed=3 runs the core unthrottled — skips the blocking
   sem_wait in throttle() that waits on a background thread we don't have in
   single-threaded WASM. We pace to real time here instead. */
extern int fullspeed;
extern volatile unsigned long long cycles;   /* m100emu.c: 8085 cycle counter */

/* M100 8085 clock ≈ 2.4576 MHz; one 60 Hz frame ≈ 40960 cycles. */
#define FRAME_CYCLES 40960

/* Called from m100emu.c maint() each maintenance pass (~every 1024 instrs).
   We let the core run flat-out until ~one frame of emulated time has elapsed,
   then render + pump input + sleep ~16 ms — so the average speed tracks real
   time while the display refreshes at ~60 Hz. */
extern int remote_load_from_host(const char *filename);   /* file_headless.c */

/* --- Auto-run: script a keystroke sequence after the game loads. Control
   codes in the sequence: 1=Down 2=Right 3=Left 4=Up, '\r'=Enter; any other
   byte is a literal character key. Each key is held a few frames then released
   so the M100's keyboard scan catches it. --- */
static const char *gx_seq = NULL;
static int gx_seq_hold = 0, gx_seq_pressed = 0;

static void seq_key(char c, int down)
{
    unsigned long mask = 0; int idx = -1;
    switch (c) {
        case 1: mask = MT_DOWN;  break;
        case 2: mask = MT_RIGHT; break;
        case 3: mask = MT_LEFT;  break;
        case 4: mask = MT_UP;    break;
        case '\r': mask = MT_ENTER; break;
        default: idx = (c >= 'A' && c <= 'Z') ? c + 32 : c; break;
    }
    if (mask) { if (down) gSpecialKeys &= ~mask; else gSpecialKeys |= mask; }
    else if (idx >= 0 && idx < 128) gKeyStates[idx] = down ? 1 : 0;
    update_keys();
}

static void autotype_step(void)
{
    if (!gx_seq) return;
    if (gx_seq_hold > 0) { gx_seq_hold--; return; }
    if (!*gx_seq) { gx_seq = NULL; return; }
    if (!gx_seq_pressed) { seq_key(*gx_seq, 1); gx_seq_pressed = 1; gx_seq_hold = 4; }
    else                 { seq_key(*gx_seq, 0); gx_seq_pressed = 0; gx_seq_hold = 3; gx_seq++; }
}

void gx_frame(void)
{
    static unsigned long long last_frame = 0, load_cycle = 0;
    static int loaded = 0, autorun = 0;
    fullspeed = 3;
    if (cycles - last_frame < FRAME_CYCLES)
        return;
    last_frame = cycles;

    /* The bundle's play.html fetches games/<name>.ba (from ?game=) and writes it
       to /game.ba in MEMFS before main() runs. Once the RAM directory is ready
       (~3M cycles), load + auto-run it if present; if there's no /game.ba (the
       bare-boot menu entry) leave the plain Model 100 menu. The loader resets
       the CPU, so a quick warm reboot follows. */
    static int have_game = 0;
    if (!loaded && cycles > 3000000) {
        loaded = 1;
        load_cycle = cycles;
        FILE *gf = fopen("/game.ba", "rb");
        if (gf) { fclose(gf); have_game = 1; remote_load_from_host("/game.ba"); }
    }
    /* Bare boot (Startup Menu): seed ADRS.DO then NOTE.DO — one warm reboot each,
       spaced out — so ADDRSS and SCHEDL open instead of erroring on blank RAM. */
    static int seed = 0;
    if (loaded && !have_game && seed < 2) {
        if (seed == 0 && cycles > 4000000) {
            seed = 1;
            FILE *f = fopen("/adrs.do", "rb");
            if (f) { fclose(f); remote_load_from_host("/adrs.do"); }
        } else if (seed == 1 && cycles > 7000000) {
            seed = 2;
            FILE *f = fopen("/note.do", "rb");
            if (f) { fclose(f); remote_load_from_host("/note.do"); }
        }
    }
    /* After the warm reboot redraws the menu, auto-select the sole user file:
       Down, Right → it; Enter loads AND runs the .BA. */
    if (have_game && !autorun && cycles > load_cycle + 3000000) {
        autorun = 1;
        gx_seq = "\x01\x02\r";
    }

    ensure_init();
    pump_input();
    autotype_step();
    render();
    emscripten_sleep(16);
}
