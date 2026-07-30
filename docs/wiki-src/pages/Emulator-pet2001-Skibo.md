# Skibo's pet2001 — Commodore PET

The PET originally shipped as the seventh member of the [[Emulator-VICE-family|VICE-family bundle]] under EmulatorJS. Every other VICE machine worked fine, but the PET sub-system's keyboard was unusable — pressing `Enter` produced `P`, letters scrambled, keys stuck, and there was a noticeable input delay. We migrated to Thomas Skibo's standalone [pet2001](http://www.skibo.net/6502/) emulator in June 2026 and the keyboard became boring (in a good way).

## Why we abandoned vice_xpet

libretro-vice's `vice_xpet` build has a fundamentally broken keyboard layer. VICE proper supports five PET keymap variants (`buuk`, `buus`, `bude`, `bujp`, `grus`) selectable via the `KeyboardMapping` resource, and a separate `KeymapIndex` toggling between positional and symbolic mapping. Both resources are read on every boot — except the libretro wrapper hard-codes Business UK (`buuk`) regardless of what's set in `vicerc` or what `vice_pet_model` selects.

We proved this conclusively before abandoning ship. After two days of debugging:

1. Wrote a `vicerc` to the Emscripten FS with every relevant resource set (`KeymapIndex=0`, `KeyboardType=4`, `KeyboardMapping=4`, plus all four `Keymap*File` paths pointing at `sdl_grus_*.vkm`).
2. Confirmed via the libretro debug log that VICE read every line: `Read resource: KeymapIndex => 0`, etc.
3. Confirmed via `vicerc-dump-PET` that the resources stuck — `KeyboardMapping=4` was in the dump.
4. Pressed `Enter`. Got `P`.

The keymap files aren't even bundled in the WASM data segment; they're hardcoded inside the libretro mapper as a single table that assumes Business UK. No amount of resource tweaking reaches that table. Other VICE machines (`vice_x64`, `vice_xvic`, etc.) use the same libretro mapper but their hardcoded keysym→matrix table happens to be correct — only `vice_xpet` ships with the wrong assumption.

The fix would be either to recompile the libretro core (multi-hour rabbit hole with toolchain setup, build flags, and no guarantee the upstream issue is reproducible) or replace the emulator. We replaced.

## What Skibo gives us

Thomas Skibo published a vanilla JS PET 2001 emulator in 2012, BSD-2-Clause licensed. Pure JavaScript — no WASM, no libretro, no EmulatorJS. Nine files, 285 KB total (215 KB of which is ROM data baked into a JS array). The emulator targets the original PET 2001, not the 3032/4032 — but the 2001 hardware is a strict subset of the 3032 (same 6502, same 40-column screen, same Graphics keyboard), and the only thing we lose is BASIC 4 (which only matters for `DLOAD` / `DIRECTORY` shortcuts that no game in the bundle uses).

The integration shape is unrecognisable next to EmulatorJS:

```js
const ctx = document.getElementById('petscreen').getContext('2d');
const pet2001 = new Pet2001(ctx);
pet2001.setRamSize(32 * 1024);
setInterval(() => pet2001.cycle(50000), 50);
window.onkeydown = petkeyOnKeyDown;
window.onkeypress = petkeyOnKeyPress;
```

Five lines for the whole runtime. Compare to the seventy lines of `EJS_*` globals + framework boot we needed under EmulatorJS.

## The 32 K bump

`Pet2001` defaults to an 8 KB PET 2001 — what the very first 1977 units shipped with. Adventureland, Frogger, and most other titles in our bundle were authored against 32 KB 3032s and overrun BASIC's zero-page pointers when LOADed into 8 KB. The symptom is silent — `LOAD` completes, `READY.` appears, then the cursor stops blinking and the keyboard is dead. There's no error, just a wedged CPU.

The fix is one line:

```js
pet2001.setRamSize(32 * 1024);
```

This must run *before* the PRG is queued onto the IEEE bus, because `setRamSize` triggers a reset that wipes RAM. The bundle calls it immediately after construction.

## The undeclared `via_t2ll` bug

Frogger hangs on boot with:

```
Uncaught ReferenceError: via_t2ll is not defined
    at PetIO.cycle (pet2001io.js:679:13)
```

The VIA chip's Timer 2 latch low register (`via_t2ll`) is read at line 679 of `pet2001io.js` and written at line 552, but never declared with `var`. In sloppy mode the write at 552 would create an implicit global on first execution — but Frogger reads the register *before* writing to it, so the read crashes. None of the other titles in the bundle exercise this code path early enough to trigger the bug.

We patched the upstream file in place:

```js
var via_t1ll = 0xff;
var via_t1lh = 0xff;
var via_t2ll = 0xff;   // ← added
var via_t2cl = 0xff;
var via_t2ch = 0xff;
```

Plus the matching line in the reset routine. Two lines total, fixes Frogger and any future title that reads T2 before writing.

## The lowercase-letters gotcha

The PET keyboard has no shift-lock equivalent for ASCII case — pressing the key labelled `L` always produces character code 76 ("L"). Skibo's keyboard table in `petkeys-600.js` only maps PC ASCII codes 97–122 (`a`–`z`) to PET key matrix positions; codes 65–90 (`A`–`Z`) all map to `-1` and are silently dropped.

This caught us when we wrote the autostart sequence as `LOAD"*",8\r RUN\r` and the PET showed only `"*",8` — the four uppercase letters of `LOAD` got dropped, the punctuation went through, and BASIC threw `?SYNTAX ERROR`. Fix is to lowercase the autostart strings: `load"*",8\r run\r`. The PET still displays them as uppercase because the chargen has no lowercase glyphs in graphics mode.

## Autostart pattern

After the PRG fetches and queues, the bundle schedules two synthesised keystroke sequences via `petkeyKeyQueue`:

```js
var BOOT_MS = 1500;
var LOAD_WAIT_MS = 6000;
setTimeout(() => queueChars('load"*",8\r'), BOOT_MS);
setTimeout(() => queueChars(game.autostart || 'run\r'), BOOT_MS + LOAD_WAIT_MS);
```

The 1.5 s boot wait covers PET RAM-clear and the BASIC banner; the 6 s LOAD wait covers an 18 KB PRG injection (the largest title in the bundle is Adventureland at 18 136 bytes). Per-game `autostart` overrides in `games.json` allow machine-code titles to use `sys768\r` or similar in place of `run\r`.

## Why PETSCII Robots isn't included

[PETSCII Robots](https://www.the8bitguy.com/product/petscii-robots/) is the 2022 survival/strategy title by Dave Murray ("The 8-Bit Guy") — a remarkable demonstration that the 32 K PET still attracts commercial-grade game development 45 years after launch. We carried it as the headline modern title in the original VICE-family PET bundle. After the migration to Skibo, we had to drop it. Three hard blockers stack:

1. **`.d64` disk image, not PRG.** Skibo's emulator only handles single-PRG injection through a simulated IEEE-488 bus. There's no 1541 drive emulation at all — no track/sector reads, no disk catalog, no file system. The official PETSCII Robots release ships as a 175 KB `.d64`, and no PRG extract exists because…
2. **PETSCII Robots targets BASIC 4 / PET 4032.** Skibo only ships BASIC 1 and BASIC 2 ROMs (the original 1977 / 1978 PET 2001 firmware). The 4032's BASIC 4 Editor ROM with 40-column / Business-keyboard layout isn't present and isn't trivially droppable in.
3. **Multi-file runtime loader.** Even if we extracted just the boot PRG from the disk image, the game LOADs tile assets, level data, and music drivers off the disk during play. With no disk emulation, those LOAD calls hit empty IEEE and the game wedges on the first level transition.

None of these are solvable in the Skibo emulator without writing significant new emulator code (a full 1541 drive, a BASIC 4 ROM, a multi-file IEEE handler). The combined work is comparable to porting a separate emulator from scratch.

The trade-off felt worth it: we lose the one modern PET title in exchange for a working keyboard on every other game. PETSCII Robots also has a C64 build, so adding it to the C64 bundle is a possible future move — but we don't ship it on any sub-system today.

If anyone ports PETSCII Robots back to PET 2001 (BASIC 2, 32 K, single PRG, no disk), we'll add it.

## What the bundle ships

10 PRG titles spanning 1977–1982, plus an empty stub for the BASIC prompt:

- Star Trek (1977) — Mike Mayfield's BASIC original, the defining game of the era
- Android NIM (1979) — Leo Christopherson's animated NIM with shifting LED faces
- Lunar Lander (1979)
- Adventureland (1979) — Scott Adams' first text adventure
- Hangman (1980), Space Invaders (1980)
- Crazy Balloon (1981), ComputerSpace 2001 (1981), Frogger (1981)
- Pac-Man (1982)

All eleven entries auto-LOAD and auto-RUN from BASIC. Total bundle size including the emulator is under 400 KB.

## Bundle layout

```
systems/pet/
├── play.html          ← ~90 lines; constructs Pet2001, drives keys + cycle loop
├── controls.html
├── games.json         ← 11 entries, optional autostart override
├── games/             ← *.prg files
└── pet2001/           ← Skibo's 9-file emulator (BSD-2-Clause)
    ├── cpu6502.js
    ├── petkeys-600.js
    ├── pet2001roms.js
    ├── pet2001hw.js
    ├── pet2001ieee.js
    ├── pet2001io.js
    ├── pet2001video-mod.js
    ├── pet2001.js
    └── pet2001main.js (unused — replaced by play.html boot logic)
```

## Related

- [[Emulator-VICE-family]] — six sub-systems still on EmulatorJS (PET migrated out)
- [[Emulators]] — index
