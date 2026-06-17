/* Minimal emscripten/SDL2 libretro frontend for o2em (Odyssey²).
 *
 * Drives the standard libretro API from a tiny main loop. Pixel format
 * is RGB565 (what o2em sets via SET_PIXEL_FORMAT); we convert to
 * ARGB8888 for the SDL texture. Audio is 16-bit signed stereo, queued
 * straight from the core's audio_batch callback. Keyboard input maps
 * the PC keyboard to the libretro RETRO_DEVICE_KEYBOARD interface that
 * o2em uses for both the joystick (arrow keys / space) and the
 * Odyssey²'s built-in keyboard.
 */
#include <SDL.h>
#include <emscripten.h>
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <string.h>

#include "libretro.h"

#define MAX_TEX_W 384
#define MAX_TEX_H 269

static SDL_Window      *win;
static SDL_Renderer    *rend;
static SDL_Texture     *tex;
static SDL_AudioDeviceID adev;

static int sample_rate = 44100;
static unsigned tex_w  = MAX_TEX_W;
static unsigned tex_h  = MAX_TEX_H;

/* SDL keysym → key state (indexed by SDL_GetScancodeFromKey value 0..511). */
static int16_t keystate[512];

/* libretro callbacks ----------------------------------------------------- */

static void cb_video(const void *data, unsigned w, unsigned h, size_t pitch) {
    if (!data || !tex) return;
    const uint16_t *src = (const uint16_t *)data;
    static uint32_t pixels[MAX_TEX_W * MAX_TEX_H];
    if (w > MAX_TEX_W) w = MAX_TEX_W;
    if (h > MAX_TEX_H) h = MAX_TEX_H;
    /* RGB565 → ARGB8888 */
    for (unsigned y = 0; y < h; y++) {
        const uint16_t *row = (const uint16_t *)((const uint8_t *)src + y * pitch);
        uint32_t *out = pixels + y * w;
        for (unsigned x = 0; x < w; x++) {
            uint16_t p = row[x];
            uint32_t r = (p >> 11) & 0x1F;
            uint32_t g = (p >> 5)  & 0x3F;
            uint32_t b =  p        & 0x1F;
            r = (r << 3) | (r >> 2);
            g = (g << 2) | (g >> 4);
            b = (b << 3) | (b >> 2);
            out[x] = 0xFF000000u | (r << 16) | (g << 8) | b;
        }
    }
    if (w != tex_w || h != tex_h) {
        SDL_DestroyTexture(tex);
        tex = SDL_CreateTexture(rend, SDL_PIXELFORMAT_ARGB8888,
                                SDL_TEXTUREACCESS_STREAMING, w, h);
        tex_w = w; tex_h = h;
    }
    SDL_UpdateTexture(tex, NULL, pixels, w * sizeof(uint32_t));
}

static size_t cb_audio_batch(const int16_t *data, size_t frames) {
    if (adev) SDL_QueueAudio(adev, data, frames * 4);
    return frames;
}
static void cb_audio_sample(int16_t l, int16_t r) {
    int16_t s[2] = { l, r };
    if (adev) SDL_QueueAudio(adev, s, 4);
}

static void cb_input_poll(void) {
    /* Polled in main loop via SDL_PollEvent. */
}

static int16_t cb_input_state(unsigned port, unsigned device,
                              unsigned index, unsigned id) {
    if (port != 0) return 0;
    if (device == RETRO_DEVICE_KEYBOARD) {
        if (id < 512) return keystate[id];
        return 0;
    }
    if (device == RETRO_DEVICE_JOYPAD) {
        /* o2em uses keyboard for everything; provide minimal joypad map
         * from arrow keys + space (action) for convenience. */
        switch (id) {
            case RETRO_DEVICE_ID_JOYPAD_UP:    return keystate[RETROK_UP];
            case RETRO_DEVICE_ID_JOYPAD_DOWN:  return keystate[RETROK_DOWN];
            case RETRO_DEVICE_ID_JOYPAD_LEFT:  return keystate[RETROK_LEFT];
            case RETRO_DEVICE_ID_JOYPAD_RIGHT: return keystate[RETROK_RIGHT];
            case RETRO_DEVICE_ID_JOYPAD_B:     return keystate[RETROK_SPACE];
            case RETRO_DEVICE_ID_JOYPAD_START: return keystate[RETROK_RETURN];
            case RETRO_DEVICE_ID_JOYPAD_SELECT:return keystate[RETROK_TAB];
        }
    }
    return 0;
}

static bool cb_environ(unsigned cmd, void *data) {
    switch (cmd) {
        case RETRO_ENVIRONMENT_GET_SYSTEM_DIRECTORY: {
            *(const char **)data = "/";
            return true;
        }
        case RETRO_ENVIRONMENT_GET_SAVE_DIRECTORY: {
            *(const char **)data = "/";
            return true;
        }
        case RETRO_ENVIRONMENT_SET_PIXEL_FORMAT: {
            enum retro_pixel_format *fmt = (enum retro_pixel_format *)data;
            return *fmt == RETRO_PIXEL_FORMAT_RGB565;
        }
        case RETRO_ENVIRONMENT_GET_VARIABLE: {
            struct retro_variable *var = (struct retro_variable *)data;
            var->value = NULL;
            return false;
        }
        case RETRO_ENVIRONMENT_GET_VARIABLE_UPDATE: {
            *(bool *)data = false;
            return true;
        }
        case RETRO_ENVIRONMENT_SET_VARIABLES:
        case RETRO_ENVIRONMENT_SET_CORE_OPTIONS:
        case RETRO_ENVIRONMENT_SET_CORE_OPTIONS_V2:
        case RETRO_ENVIRONMENT_SET_CORE_OPTIONS_V2_INTL:
        case RETRO_ENVIRONMENT_SET_INPUT_DESCRIPTORS:
        case RETRO_ENVIRONMENT_SET_CONTROLLER_INFO:
        case RETRO_ENVIRONMENT_SET_GEOMETRY:
        case RETRO_ENVIRONMENT_SET_AUDIO_BUFFER_STATUS_CALLBACK:
        case RETRO_ENVIRONMENT_SET_MINIMUM_AUDIO_LATENCY:
            return true;
        case RETRO_ENVIRONMENT_GET_LOG_INTERFACE:
            return false;
        case RETRO_ENVIRONMENT_GET_INPUT_BITMASKS:
            return false;
    }
    return false;
}

/* SDL → libretro key translation. SDL2 SDL_Keycode values for letters
 * (a..z) match RETROK_a..RETROK_z (lowercase ASCII), and so do
 * digits/most symbols. Special keys need explicit mapping. */
static int sdl_to_retro_key(SDL_Keycode k) {
    if (k >= SDLK_a && k <= SDLK_z) return RETROK_a + (k - SDLK_a);
    if (k >= SDLK_0 && k <= SDLK_9) return RETROK_0 + (k - SDLK_0);
    switch (k) {
        case SDLK_SPACE:    return RETROK_SPACE;
        case SDLK_RETURN:   return RETROK_RETURN;
        case SDLK_TAB:      return RETROK_TAB;
        case SDLK_ESCAPE:   return RETROK_ESCAPE;
        case SDLK_BACKSPACE:return RETROK_BACKSPACE;
        case SDLK_LEFT:     return RETROK_LEFT;
        case SDLK_RIGHT:    return RETROK_RIGHT;
        case SDLK_UP:       return RETROK_UP;
        case SDLK_DOWN:     return RETROK_DOWN;
        case SDLK_PERIOD:   return RETROK_PERIOD;
        case SDLK_COMMA:    return RETROK_COMMA;
        case SDLK_MINUS:    return RETROK_MINUS;
        case SDLK_EQUALS:   return RETROK_EQUALS;
        case SDLK_SLASH:    return RETROK_SLASH;
        case SDLK_F5:       return RETROK_F5;
        case SDLK_LSHIFT:   return RETROK_LSHIFT;
        case SDLK_RSHIFT:   return RETROK_RSHIFT;
    }
    return 0;
}

static void frame(void) {
    SDL_Event e;
    while (SDL_PollEvent(&e)) {
        if (e.type == SDL_KEYDOWN || e.type == SDL_KEYUP) {
            int rk = sdl_to_retro_key(e.key.keysym.sym);
            if (rk > 0 && rk < 512)
                keystate[rk] = (e.type == SDL_KEYDOWN) ? 1 : 0;
        }
    }
    retro_run();
    if (tex) {
        SDL_RenderClear(rend);
        SDL_RenderCopy(rend, tex, NULL, NULL);
        SDL_RenderPresent(rend);
    }
}

static long load_file(const char *path, uint8_t **out) {
    FILE *f = fopen(path, "rb");
    if (!f) { fprintf(stderr, "open %s failed\n", path); return 0; }
    fseek(f, 0, SEEK_END);
    long sz = ftell(f);
    fseek(f, 0, SEEK_SET);
    *out = malloc(sz);
    fread(*out, 1, sz, f);
    fclose(f);
    return sz;
}

/* GenX save / load state -------------------------------------------------
 * The o2em libretro core implements retro_serialize/unserialize, but nothing
 * else here called them, so they were dead-code-eliminated. These KEEPALIVE
 * wrappers expose them to JS (systems/odyssey2/play.html). The serialized
 * blob is owned by gx_buf so JS never needs _malloc/_free:
 *   save: ptr = _gx_state_save(); size = _gx_state_size(); read HEAPU8[ptr..]
 *   load: ptr = _gx_state_buffer(size); fill HEAPU8[ptr..]; _gx_state_load(size)
 */
static unsigned char *gx_buf = NULL;
static size_t gx_buf_size = 0;

EMSCRIPTEN_KEEPALIVE
int gx_state_save(void) {
    size_t sz = retro_serialize_size();
    if (sz == 0) return 0;
    unsigned char *nb = (unsigned char *)realloc(gx_buf, sz);
    if (!nb) return 0;
    gx_buf = nb;
    if (!retro_serialize(gx_buf, sz)) { gx_buf_size = 0; return 0; }
    gx_buf_size = sz;
    return (int)(intptr_t)gx_buf;   /* HEAP offset of the serialized state */
}

EMSCRIPTEN_KEEPALIVE
int gx_state_size(void) { return (int)gx_buf_size; }

EMSCRIPTEN_KEEPALIVE
int gx_state_buffer(int size) {     /* (re)alloc gx_buf for JS to fill before load */
    unsigned char *nb = (unsigned char *)realloc(gx_buf, (size_t)size);
    if (!nb) return 0;
    gx_buf = nb; gx_buf_size = (size_t)size;
    return (int)(intptr_t)gx_buf;
}

EMSCRIPTEN_KEEPALIVE
int gx_state_load(int size) {       /* restore from gx_buf (JS just filled it) */
    return retro_unserialize(gx_buf, (size_t)size) ? 1 : 0;
}

int main(int argc, char **argv) {
    /* Default paths (preloaded by emcc --preload-file at /). */
    const char *bios_path = "/o2rom.bin";
    const char *game_path = "/game.bin";

    SDL_Init(SDL_INIT_VIDEO | SDL_INIT_AUDIO);

    win  = SDL_CreateWindow("Odyssey²", SDL_WINDOWPOS_CENTERED,
                            SDL_WINDOWPOS_CENTERED, 640, 480, 0);
    rend = SDL_CreateRenderer(win, -1, 0);
    tex  = SDL_CreateTexture(rend, SDL_PIXELFORMAT_ARGB8888,
                             SDL_TEXTUREACCESS_STREAMING, MAX_TEX_W, MAX_TEX_H);

    SDL_AudioSpec want = {0}, have;
    want.freq = sample_rate;
    want.format = AUDIO_S16SYS;
    want.channels = 2;
    want.samples = 1024;
    adev = SDL_OpenAudioDevice(NULL, 0, &want, &have, 0);
    if (adev) SDL_PauseAudioDevice(adev, 0);

    retro_set_environment(cb_environ);
    retro_set_video_refresh(cb_video);
    retro_set_audio_sample(cb_audio_sample);
    retro_set_audio_sample_batch(cb_audio_batch);
    retro_set_input_poll(cb_input_poll);
    retro_set_input_state(cb_input_state);

    retro_init();

    struct retro_game_info info = {0};
    info.path = game_path;
    info.size = load_file(game_path, (uint8_t **)&info.data);
    if (info.size <= 0) {
        fprintf(stderr, "no game ROM at %s\n", game_path);
        return 1;
    }
    if (!retro_load_game(&info)) {
        fprintf(stderr, "retro_load_game failed (check BIOS at %s)\n", bios_path);
        return 1;
    }

    struct retro_system_av_info av;
    retro_get_system_av_info(&av);
    sample_rate = (int)av.timing.sample_rate;

    /* Reopen audio at the core's preferred rate if needed. */
    if (sample_rate != (int)have.freq) {
        SDL_CloseAudioDevice(adev);
        want.freq = sample_rate;
        adev = SDL_OpenAudioDevice(NULL, 0, &want, &have, 0);
        if (adev) SDL_PauseAudioDevice(adev, 0);
    }

    emscripten_set_main_loop(frame, (int)av.timing.fps, 1);
    return 0;
}
