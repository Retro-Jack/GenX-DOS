/* display_headless.c — GenX-DOS WASM port of VirtualT.
 *
 * Replaces the FLTK T100_Disp with a headless implementation of the C
 * interface the emulator core calls (display.h). It keeps the Model 100's
 * LCD RAM and exposes a 240x64 1-byte-per-pixel framebuffer for the SDL2
 * frontend to blit. All geometry is lifted verbatim from the original
 * display.cpp T100_Disp::SetByte / ::Command so rendering matches upstream.
 */

#include <string.h>
#include <stdio.h>

typedef unsigned char uchar;

/* Model 100 LCD: 10 HD44102 driver chips, 240x64 pixels. */
#define LCD_W 240
#define LCD_H 64

static uchar lcd[10][256];      /* per-driver LCD RAM (as in T100_Disp) */
static uchar top_row[10];       /* per-driver display-start-line (vertical scroll) */
static uchar framebuffer[LCD_W * LCD_H];   /* 1 byte/pixel, 0 or 1 */

const unsigned char *get_framebuffer(void);   /* forward decl */

void init_display(void)
{
    memset(lcd, 0, sizeof(lcd));
    memset(top_row, 0, sizeof(top_row));
    memset(framebuffer, 0, sizeof(framebuffer));
}

void deinit_display(void) {}

/* An LCD data byte written by the emulated I/O. Storage only — the
 * driver/column -> pixel geometry is applied in get_framebuffer(). */
void drawbyte(int driver, int column, int value)
{
    if (driver < 0 || driver >= 10)
        return;
    lcd[driver][column & 0xFF] = (uchar)value;
}

/* An LCD controller command. The only one that affects what we render is
 * 0x3E = "set display start line", which sets the driver's top_row. */
void lcdcommand(int driver, int value)
{
    if (driver < 0 || driver >= 10)
        return;
    if ((value & 0x3F) == 0x3E)
        top_row[driver] = (uchar)(value >> 6);
}

/* Rebuild and return the 240x64 framebuffer from LCD RAM.
 * Geometry is exactly T100_Disp::SetByte's:
 *   x = (driver % 5) * 50 + (col & 0x3F)
 *   y = (((col&0xC0)>>6) - top_row[driver] + 4) % 4 * 8   (+32 for drivers 5-9)
 *   byte bit b -> pixel (x, y+b)
 * Columns with (col & 0x3F) > 49 are command space, not pixels. The internal
 * model is 250 wide (5*50); the physical panel is 240, so x >= 240 is clipped
 * exactly as the upstream 240-wide widget clips it. */
const unsigned char *get_framebuffer(void)
{
    int driver, col, b;

    memset(framebuffer, 0, sizeof(framebuffer));

    for (driver = 0; driver < 10; driver++) {
        for (col = 0; col < 256; col++) {
            uchar value = lcd[driver][col];
            int x, y;

            if ((col & 0x3F) > 49)
                continue;

            x = (driver % 5) * 50 + (col & 0x3F);
            if (x >= LCD_W)
                continue;

            y = ((((col & 0xC0) >> 6) - top_row[driver] + 4) % 4) * 8;
            if (driver > 4)
                y += 32;

            for (b = 0; b < 8; b++) {
                int yy = y + b;
                if (yy < 0 || yy >= LCD_H)
                    continue;
                framebuffer[yy * LCD_W + x] = (value >> b) & 1;
            }
        }
    }
    return framebuffer;
}

int display_width(void)  { return LCD_W; }
int display_height(void) { return LCD_H; }

/* --- Remaining display.h C entry points the core references: headless no-ops. --- */
void display_cpu_speed(void) {}
void display_map_mode(char *str) { (void)str; }
void show_error(const char *msg) { if (msg) fprintf(stderr, "VirtualT: %s\n", msg); }
void power_down(void) {}
void process_windows_event(void) {}
void handle_simkey(void) {}
void handle_wheel_keys(void) {}
void switch_model(int model) { (void)model; }
void init_pref(void) {}
void init_other_windows(void) {}
void enable_tpdd_log_menu(int bEnabled) { (void)bEnabled; }

/* T200-only display (Model 100 never calls these, but the core links them). */
void t200_command(unsigned char ir, unsigned char data) { (void)ir; (void)data; }
unsigned char t200_readport(unsigned char port) { (void)port; return 0; }
