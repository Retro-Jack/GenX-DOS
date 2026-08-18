# VirtualT — Tandy TRS-80 Model 100

The Model 100 is the fourth GenX-DOS bundle compiled from source to WASM (after [[Emulator-atari800]], [[Emulator-sdltrs-TRS-80]] and [[Emulator-libretro-o2em-Odyssey2]]), and the first driven by **VirtualT** — Stephen Hurd & Ken Pettit's Model 100 / 102 / 200 emulator, BSD-2-Clause, on SourceForge since 2004.

It exists because a user, **dplassgit**, opened [discussion #2, "Tandy 100?"](https://github.com/Retro-Jack/GenX-DOS/discussions/2): *"Based on the Intel 8085 CPU, it was one of the early portable/laptops. It definitely has the 8-bit feel."* The reply set the bar — *"I'd need 10 easily accessible software titles before continuing"* — which is why the lineup ships exactly ten games.

## An extraction, not a fork

VirtualT isn't a small emulator — it's a full **FLTK desktop application**: the machine, plus an IDE, a disassembler, a debugger, memory editors, a peripheral monitor. Forking all of that to strip it back would be dishonest about how little we kept. So the Model 100 bundle is an **acknowledgement, not a fork**: we compile only VirtualT's FLTK-free portable core — the 8085 CPU, memory + banking, the HD44102 LCD controllers, the keyboard scan, the ROM images, sound and serial — and never compile the ~40 FLTK GUI/IDE/debugger files at all.

What the core still *calls into* from that dropped layer, five small headless units supply. They live in `systems/m100/src/` with a reproducible `build.sh` and `BUILDING-WASM.md`:

| Unit | Stands in for |
| --- | --- |
| `frontend_sdl.c` | display.cpp's window + event loop — our browser front end |
| `display_headless.c` | display.cpp's LCD drawing — the 240×64 framebuffer |
| `file_headless.c` | file.cpp's loader (FLTK file-chooser → host filenames) |
| `clock_headless.c` | clock.cpp's uPD1990AC RTC (config UI + prefs dropped) |
| `stubs.c` | no-op peripherals (T200 RTC, printer, TPDD dock, remote debug) |

`frontend_sdl.c` hooks a single `gx_frame()` into the core's `maint()` (one added call in `m100emu.c`); every frame it blits the LCD to an SDL2 texture, pumps keys into io.c, and `emscripten_sleep()`s to yield.

## `-sASYNCIFY` and the throttle deadlock

VirtualT's `emulate()` is a blocking `while (!gExitApp)` loop, so `-sASYNCIFY` is non-optional — the same shape as atari800 and sdltrs. But the first builds **hung after ~30,000 instructions**, stone dead.

The culprit wasn't ASYNCIFY. VirtualT's `throttle()` calls `sem_wait(&gThrottleEvent)`, waiting on a background timer thread that doesn't exist in single-threaded WASM — so it blocks forever. The fix is one line in `gx_frame`: **`fullspeed = 3`**, VirtualT's own "run unthrottled" mode, which still counts cycles but skips the blocking `while`/`sem_wait` entirely. Pacing is done instead by `emscripten_sleep(16)` once per frame.

## The traps that aren't link errors

Two classes of bug cost real time here, both because emscripten turns C sloppiness into *runtime* wasm traps:

- **Signature mismatches.** An implicitly-declared function is assumed `int()`; if the real definition is `void()`, the indirect call traps at runtime — it is **not** a link error. clang even phrases it "call to undeclared function", not "implicit declaration". Every stub in `stubs.c` had to match its header's signature exactly (e.g. `get_model_time` is `void`, not `long`; `tdock_read` is `unsigned char(void)`).
- **Data symbols stubbed as functions.** `setup`, `mem_setup`, `clock_serial_out` are *variables*, not functions — stubbing them as functions gives a wasm-ld "symbol type mismatch". They're defined as zero-init variables via `#include "setup.h"`.

## The ROM is a file

The core opens the Model 100 ROM as `ROMs/M100rom.bin` (32 KB) — VirtualT tracks it in its own repo — so it's `--embed-file`'d into MEMFS rather than linked, even though `m100rom.c` (the ROM as a C array) is also compiled in. The early "No ROM file for m100" errors were exactly this: the ROM is loaded as a file, not from the array.

## The clock — live, and Y2K-fine

The RTC was first stubbed to a no-op, and that quietly broke more than clocks: `TIME$` sat at `00:00:00`, which kills game timers **and** the ubiquitous `FOR N=1 TO VAL(RIGHT$(TIME$,2))` RND-seeding idiom — so every launch dealt the same cards and drew the same maze.

`clock_headless.c` extracts the uPD1990AC chip (`pd1990ac_chip_cmd` / `pd1990ac_clk_pulse`) from clock.cpp, FLTK-free, and reports the **real host wall-clock time** so `TIME$` advances. The year is separate: the chip has no year register (the M100 keeps the year in RAM), so we poke today's year into `gStdRomDesc->sYear` once. The 1983 ROM handles it gracefully — the menu reads **`Jly 07,2026`** ("Jly" is the ROM's own abbreviation for July, not a bug).

## PEEK collisions and the screen mirror

Several BASIC games detect collisions by **`PEEK`ing the LCD's RAM mirror** — locations 32959–33279, which the ROM keeps in sync with the display. Because we run the real ROM and emulate that RAM, the mirror is maintained exactly, so PEEK-based games (Road Rally, Skydiver, Worm Hole) work. This was an open question until Road Rally's crash-detection fired correctly.

## The keyboard — and Caps Lock

Only **two** keys differ from a PC keyboard: **GRPH → Left Alt** and **CODE → Right Alt**. Everything else (Enter, Shift, Ctrl, Tab, Esc, Backspace, arrows, F1–F8) maps 1:1. The FLTK build rebuilt io.c's `keyscan[]` from its own key handler; headless, `pump_input` calls `update_keys()`.

The command keys io.c actually reads — **PASTE** (Insert), **LABEL** (F9), **BREAK** (Shift+Pause) — are momentary and wire up normally. **Caps Lock does not.** It's `MT_CAP_LOCK`, bit `0x20`, and io.c reads it — but it's a **toggle**: desktop VirtualT does `gSpecialKeys ^= MT_CAP_LOCK` on key-down, whereas a naïve frontend treats it as a held key, so it flips on and instantly off ("no effect"). Porting the toggle into `pump_input` — flip on key-down, ignore key-up — fixed it. It's the *only* toggle key in VirtualT's handler; NUM (`0x10`) is marked "Not used" upstream.

## The games — a book, not a fork

The lineup is ten **type-in BASIC games**, and getting them clean was its own saga.

The pre-book source was **club100**: its pre-tokenized `.BA` files load fine (Four Seasons Solitaire, ELIZA — both kept), but its ASCII listings are word-wrapped at ~40 columns with `\r\r\n` separators, so the emulator's load-time tokeniser corrupts them. A custom un-wrapper (rejoin any physical line that doesn't start with an ascending line number) got *close* but stayed flaky on bigger listings.

The fix was to change **source**, not tooling: **David Busch's *25 Games for your TRS-80 Model 100*** (TAB Books, 1984). Eight games are **hand-transcribed** from its scanned listings into clean single-CR-line `.ba` files we fully control — which load reliably, with no wrapping roulette, and the book's chapters double as the gamedocs. Games that quit to the BASIC `Ok` prompt are adapted to call `MENU` instead so you land back on the machine's own menu.

## Battery backup — persistence, done authentically

Rather than a full CPU/IO save-state, the Model 100 gets what the real machine has: **battery-backed RAM**. `save_ram` shows the whole persistent state is just the 32 KB of base RAM (`gBaseMemory+RAMSTART`), so `play.html` persists exactly that to `localStorage` for the bare **Startup Menu** and restores it on load (`HEAPU8.set` over `gx_ram_ptr()`, then `gx_warm_reset()` = `jump_to_zero()`, a warm reboot that keeps RAM so the restored directory re-scans). Your files, notes and typed-in programs survive between visits — browser-contingent, and games stay ephemeral.

On a first, blank-RAM boot, empty `ADRS.DO` / `NOTE.DO` are seeded so **ADDRSS** and **SCHEDL** open instead of erroring.

## Bundle layout

```
systems/m100/
├── play.html
├── controls.html          ← sourced from the owner's manual
├── virtualt.js
├── virtualt.wasm          ← M100 ROM embedded here
├── adrs.do, note.do       ← empty seeds for ADDRSS/SCHEDL
├── games/                 ← 10 .ba games
└── src/                   ← the 5 headless units + build.sh + LICENSE
```

## Related

- [[Emulators]] — index of all engines
- [[Emulator-sdltrs-TRS-80]] — the other from-source Tandy build (Model III)
- [[Emulator-XRoar-CoCo]] — the third Tandy machine
- [[Emulator-atari800]] — the other 8-bit ASYNCIFY emscripten build
