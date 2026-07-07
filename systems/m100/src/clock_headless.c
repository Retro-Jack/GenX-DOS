/*
 * clock_headless.c — the Model 100's uPD1990AC real-time-clock chip, extracted
 * from VirtualT's clock.cpp with the FLTK config UI and prefs persistence
 * dropped. Without a live clock the RTC reads back zero, so TIME$ never
 * advances — which breaks not just game timers but the ubiquitous
 * `FOR N=1 TO VAL(RIGHT$(TIME$,2))` RND-seeding idiom, making every launch deal
 * the same cards / draw the same maze. Here the chip reflects the host wall
 * clock, exactly as the desktop build does.
 *
 * The uPD1990AC is accessed as a 40-bit serial shift register (clock_sr). io.c
 * routes the clock I/O ports to pd1990ac_chip_cmd() / pd1990ac_clk_pulse(). The
 * one difference from clock.cpp: the gStdRomDesc year-poke (models with an
 * unset year in RAM) is omitted — TIME$/DATE$ time-of-day works without it and
 * it would drag in the ROM-descriptor globals.
 */
#include <time.h>
#include "VirtualT.h"
#include "roms.h"
#include "memory.h"

/* The M100 keeps its 2-digit year in RAM (the uPD1990AC chip has no year
   register); gStdRomDesc->sYear points at it. Poked once in the clock read. */
extern RomDescription_t *gStdRomDesc;

static uchar    gClockMode = 255;
static time_t   clock_time = 0;
static time_t   last_clock_time = 1;
static time_t   gStartTime = 0;
static time_t   gRefTime = 0;
static uchar    clock_sr[5];        /* 40-bit shift register */
static uchar    clock_sr_save[5];   /* backup storage */
static struct tm *mytime;
uchar           clock_serial_out = 0;   /* read by io.c */

void init_clock(void) {}

/* Handle commands strobed to the uPD1990AC clock chip. */
void pd1990ac_chip_cmd(uchar val)
{
    time_t      time_delta;
    struct tm   when;
    int         x;

    gClockMode = val & 0x07;

    switch (gClockMode)
    {
    case 0:     /* NOP */
        break;
    case 1:     /* Serial Shift */
        clock_serial_out = clock_sr[0] & 0x01;
        break;
    case 2:     /* Write Clock chip — set the reference time from the register */
        gStartTime = time(&gStartTime);
        mytime = localtime(&gStartTime);
        when.tm_sec  = (clock_sr[0] & 0x0F) + (clock_sr[0] >> 4) * 10;
        when.tm_min  = (clock_sr[1] & 0x0F) + (clock_sr[1] >> 4) * 10;
        when.tm_hour = (clock_sr[2] & 0x0F) + (clock_sr[2] >> 4) * 10;
        when.tm_mday = (clock_sr[3] & 0x0F) + (clock_sr[3] >> 4) * 10;
        when.tm_wday = clock_sr[4] & 0x0F;
        when.tm_mon  = (clock_sr[4] >> 4) - 1;
        when.tm_isdst = -1;
        when.tm_year = mytime->tm_year;
        gRefTime = mktime(&when);
        for (x = 0; x < 5; x++)
            clock_sr_save[x] = clock_sr[x];
        break;
    case 3:     /* Read clock chip — report the real host date/time. A fresh
                   browser launch has no battery-backed clock, so rather than
                   echo back whatever default the M100 wrote at boot, we always
                   hand it the host's actual wall-clock time. */
        for (x = 0; x < 5; x++)
            clock_sr[x] = clock_sr_save[x];
        clock_time = time(&clock_time);
        if (clock_time == last_clock_time)
            break;
        last_clock_time = clock_time;
        mytime = localtime(&clock_time);
        clock_sr[0] = mytime->tm_sec % 10;
        clock_sr[0] |= (mytime->tm_sec / 10) << 4;
        clock_sr[1] = mytime->tm_min % 10;
        clock_sr[1] |= (mytime->tm_min / 10) << 4;
        clock_sr[2] = mytime->tm_hour % 10;
        clock_sr[2] |= (mytime->tm_hour / 10) << 4;
        clock_sr[3] = mytime->tm_mday % 10;
        clock_sr[3] |= (mytime->tm_mday / 10) << 4;
        clock_sr[4] = (mytime->tm_wday) % 10;
        clock_sr[4] |= (mytime->tm_mon + 1) << 4;
        for (x = 0; x < 5; x++)
            clock_sr_save[x] = clock_sr[x];
        /* Poke today's 2-digit year into RAM once, while it's still unset, so
           the menu's date line shows the real year and not the boot default. */
        if (gStdRomDesc != NULL
            && get_memory8(gStdRomDesc->sYear + 1) == 0
            && get_memory8(gStdRomDesc->sYear) == 0)
        {
            set_memory8(gStdRomDesc->sYear, (unsigned char)(mytime->tm_year % 10));
            set_memory8(gStdRomDesc->sYear + 1, (unsigned char)((mytime->tm_year % 100) / 10));
        }
        break;
    }
}

/* One serial clock pulse: shift the 40-bit register right one bit. */
void pd1990ac_clk_pulse(uchar val)
{
    if (gClockMode == 1)
    {
        clock_sr[0] >>= 1;
        clock_sr[0] |= clock_sr[1] & 1 ? 0x80 : 0;
        clock_sr[1] >>= 1;
        clock_sr[1] |= clock_sr[2] & 1 ? 0x80 : 0;
        clock_sr[2] >>= 1;
        clock_sr[2] |= clock_sr[3] & 1 ? 0x80 : 0;
        clock_sr[3] >>= 1;
        clock_sr[3] |= clock_sr[4] & 1 ? 0x80 : 0;
        clock_sr[4] >>= 1;
        clock_sr[4] |= val & 0x10 ? 0x80 : 0;
        clock_serial_out = clock_sr[0] & 1;
    }
}
