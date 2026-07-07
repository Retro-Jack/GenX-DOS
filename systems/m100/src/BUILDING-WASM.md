# Building the Model 100 (VirtualT) WASM engine

`virtualt.js` / `virtualt.wasm` in the bundle are VirtualT's FLTK-free core
compiled to WebAssembly behind a small headless SDL2 frontend. With an activated
[emsdk](https://emscripten.org/) on your PATH, run:

```sh
./build.sh
```

It clones upstream VirtualT (`git.code.sf.net/p/virtualt/code` — which also
tracks the 32 KB M100 ROM), compiles the core plus the five units in this
directory, and drops `virtualt.js` + `virtualt.wasm` into `systems/m100/`.

This is an **acknowledgement of VirtualT, not a fork.** VirtualT is a full FLTK
desktop app — emulator *plus* an IDE and debugger. We keep only its portable
8085 / memory / HD44102-LCD / keyboard-scan core and never compile the ~40 FLTK
GUI/IDE/debugger files. Because so much is stripped away, the extraction lives
here rather than as a fork of VirtualT. VirtualT's BSD licence is in `LICENSE`.

## The headless units (what stands in for the FLTK layer)

| File | Role |
| --- | --- |
| `frontend_sdl.c` | The browser front end. Hooks `gx_frame()` into the core's `maint()` (one added call in `m100emu.c`): blits the 240×64 LCD to an SDL2 texture, pumps SDL key events into io.c's key state, loads the `?game=` `.ba` and auto-boots it, and `emscripten_sleep()`s to yield to the browser (ASYNCIFY). Also exports the battery-backup hooks (`gx_ram_ptr`/`gx_ram_size`/`gx_warm_reset`). Replaces display.cpp's window + event handling. |
| `display_headless.c` | The LCD. Stores the ten HD44102 drivers' bytes and assembles the 240×64 framebuffer `get_framebuffer()` reads. Replaces display.cpp's FLTK drawing. |
| `file_headless.c` | The game/file loader — the relocate / tokenize / directory-maintenance / `remote_load_from_host` functions lifted from file.cpp, with the FLTK file-chooser calls reduced to plain host-filename loads. |
| `clock_headless.c` | The uPD1990AC RTC chip from clock.cpp (its FLTK config UI + prefs dropped). Reports real host date/time so `TIME$` advances — needed for game timers *and* the `FOR N=1 TO VAL(RIGHT$(TIME$,2))` RND-seed idiom — and pokes today's year into RAM. |
| `stubs.c` | No-op stubs for peripherals we don't emulate (T200 RTC, parallel printer, TPDD/serial dock, remote-debug server) plus the `setup` / `mem_setup` config structs. |

## Gotchas worth knowing

- **The throttle deadlock.** VirtualT's `throttle()` `sem_wait()`s on a
  background thread that doesn't exist single-threaded in WASM — after ~30 K
  instructions it hangs forever. Fixed by setting `fullspeed = 3` in `gx_frame`
  (VirtualT's "run unthrottled" mode; still counts cycles, skips the blocking wait).
- **Signature-mismatch traps.** An implicitly-declared function gets an `int()`
  signature; a mismatch with the real `void()` definition is a *runtime* wasm
  trap, not a link error (clang calls it "call to undeclared function"). Every
  stub's signature must match its header exactly.
- **The ROM is a file.** The core opens the ROM as `ROMs/M100rom.bin`, so it's
  `--embed-file`'d into MEMFS (even though `m100rom.c` is also compiled in).
- **`update_keys()` from the frontend.** The FLTK build rebuilt io.c's
  `keyscan[]` from its own key handler; headless, `pump_input` calls
  `update_keys()`. **CAPS LOCK is a toggle** (`gSpecialKeys ^= MT_CAP_LOCK`, bit
  `0x20`), not a held key — special-cased in `pump_input`. NUM (`0x10`) is "Not
  used" upstream. Only GRPH (Left Alt) and CODE (Right Alt) differ from the PC.
- **PEEK collisions** work because the core maintains the LCD's RAM mirror
  (32959–33279) exactly as the ROM does; PEEK-based games (Road Rally, Skydiver,
  Worm Hole) rely on it.
- **Battery backup** persists just the 32 KB of base RAM (0x8000–0xFFFF — what
  `save_ram` writes) to browser storage; `gx_warm_reset()` = `jump_to_zero()`, a
  warm reboot that keeps RAM so the restored directory re-scans.
- **Big stack.** `file_headless.c`'s `cb_LoadFromHost` has ~294 KB of stack
  locals → `-sSTACK_SIZE=8388608`.
