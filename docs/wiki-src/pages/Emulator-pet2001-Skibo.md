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

Thomas Skibo published a vanilla JS PET 2001 emulator in 2012, BSD-2-Clause licensed. Pure JavaScript — no WASM, no libretro, no EmulatorJS. Nine files, 319 KB total (223 KB of which is ROM data baked into a JS array). The emulator targets the original PET 2001, not the 3032/4032 — but the 2001 hardware is a strict subset of the 3032 (same 6502, same 40-column screen, same Graphics keyboard), and the only thing we lose is BASIC 4 (which only matters for `DLOAD` / `DIRECTORY` shortcuts that no game in the bundle uses).

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

`Pet2001` defaults to an 8 KB PET 2001 — what the very first 1977 units shipped with. Adventureland, Frog, and most other titles in our bundle were authored against 32 KB 3032s and overrun BASIC's zero-page pointers when LOADed into 8 KB. The symptom is silent — `LOAD` completes, `READY.` appears, then the cursor stops blinking and the keyboard is dead. There's no error, just a wedged CPU.

The fix is one line:

```js
pet2001.setRamSize(32 * 1024);
```

This must run *before* the PRG is queued onto the IEEE bus, because `setRamSize` triggers a reset that wipes RAM. The bundle calls it immediately after construction.

## The undeclared `via_t2ll` bug

Frog — P.J. Fellner's frog-crossing game, which the menu once listed as Frogger — hangs on boot with:

```
Uncaught ReferenceError: via_t2ll is not defined
    at PetIO.cycle (pet2001io.js:679:13)
```

The VIA chip's Timer 2 latch low register (`via_t2ll`) is read at line 679 of `pet2001io.js` and written at line 552, but never declared with `var`. In sloppy mode the write at 552 would create an implicit global on first execution — but Frog reads the register *before* writing to it, so the read crashes. None of the other titles in the bundle exercise this code path early enough to trigger the bug.

The fix declares it (it lives in our fork now; see *Where the changes live* below):

```js
var via_t1ll = 0xff;
var via_t1lh = 0xff;
var via_t2ll = 0xff;   // ← added
var via_t2cl = 0xff;
var via_t2ch = 0xff;
```

Plus the matching line in the reset routine. Two lines total, fixes Frog and any future title that reads T2 before writing.

## Timers that were strings

Skibo's emulator scheduled its timers the old way, handing `setTimeout` a string of code: `setTimeout("petkeyKeypressTimeout()", …)` releases each key a moment after it is pressed, and `setTimeout("blankTimeoutFunc()", 100)` blanks the display. A browser has to compile that string, and the site's Content-Security-Policy allows WebAssembly compilation but not string evaluation. So the timers never fired — silently. The PET booted to `READY.` and the autostart's `load"*",8` and `run` sat in the keyboard queue, every key pressed and none released; anything typed would have gone the same way.

Each string became a function making the same call — `setTimeout(function () { petkeyKeypressTimeout(); }, …)` — which reaches the same global function, and `play.html`'s own autostart timer does the same. That let the PET drop `'unsafe-eval'` from its policy.

## Where the changes live

Every change to Skibo's code is carried in our fork, [`Retro-Jack/pet2001`](https://github.com/Retro-Jack/pet2001), on its `genx` branch, with the reasons written out in `GENX-CHANGES.md`. Skibo publishes the emulator in the repository behind his website, [`skibo/skibo.github.io`](https://github.com/skibo/skibo.github.io); the `genx` branch starts from his March 2021 commit `55d18e4`, which is the version we copied, and adds its changes on top: the `via_t2ll` declaration, a typo in the VIA reset (`var_t1_undf` for `via_t1_undf`, which left timer 1's underflow flag uncleared), the string timers, a choice of character ROM for text mode (the original PET 2001 ROM and the later one show upper and lower case the other way round, so each game gets the one it was written for — `newCharRom` in `games.json`), a held-key mode in which a key stays down on the PET for as long as it is held and either Shift key presses the PET's SHIFT on its own (`heldKeys`), a `.d64` disk image in drive 8 so a game can load its own files (`disk`), Escape as RUN/STOP, Shift+comma and Shift+full stop as the PET's `<` and `>` in held-key mode, and our two presentation choices (a green phosphor for the screen, and the on-screen keyboard picture's click areas scaled for 600 pixels, which the bundle does not currently show). The files in `systems/pet/pet2001/` are copied from that branch unchanged. The three general fixes were offered back to Skibo as [skibo/skibo.github.io#1](https://github.com/skibo/skibo.github.io/pull/1).

## The lowercase-letters gotcha

The PET keyboard has no shift-lock equivalent for ASCII case — pressing the key labelled `L` always produces character code 76 ("L"). Skibo's keyboard table in `petkeys.js` only maps PC ASCII codes 97–122 (`a`–`z`) to PET key matrix positions; codes 65–90 (`A`–`Z`) all map to `-1` and are silently dropped.

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

## PETSCII Robots, from its disk

[Attack of the PETSCII Robots](https://www.the8bitguy.com/product/petscii-robots/) is David Murray's ("The 8-Bit Guy") 2021 action-strategy game, and the PET is the machine it was written on. We carried it in the old VICE-family PET bundle and dropped it in the move to Skibo, listing three blockers: it comes on a `.d64` disk image, it "needs BASIC 4", and it loads more files as it runs. We use the free shareware release, which its author distributes as a `.d64`.

Taking the program apart showed that only one of those was real:

1. **BASIC 4 isn't required.** At start-up the program checks a byte of the BASIC ROM, and on a BASIC 2 machine it rewrites its own calls to the ROM's LOAD routine (`$F322` rather than BASIC 4's `$F356`) and prints *BASIC V2 DETECTED!*. Its interrupt hook chains to whatever vector it found, so nothing else is tied to BASIC 4. Its stated requirement is 32 KB — "a 4032 or a Mini-PET" — which our PET already has.
2. **The extra files load through the ROM, by name.** It asks drive 8 for `TILESET.PET`, then `LEVEL-A` or `LEVEL-B` for the chosen map, with the same LOAD that BASIC uses. Skibo's drive answered every LOAD with the same program, whatever it was asked for.
3. **So the disk image was the whole job.** Our fork's drive 8 now reads a `.d64`: it walks the directory on track 18 and follows the named file's sector chain. `*` and `?` match as they do on a real drive. That's about ninety lines, and `games.json` gives the game a `disk` in place of a `rom`.

Two keyboard changes came with it. The PET's RUN/STOP had no PC key, and the game pauses on it, so **Escape is now RUN/STOP** everywhere on the PET. The game also switches weapons and items with the PET's own `<` and `>` keys. In held-key mode, Shift arrived on the PET as SHIFT, so Shift+comma became a graphics character. **Shift+comma and Shift+full stop now press `<` and `>`**, with SHIFT let go.

A name that matches nothing on the disk gets no reply. BASIC 2's LOAD then keeps waiting, as it would with a real drive, until RUN/STOP (Escape) breaks in. The game plays without sound, like every PET title here.

## What the bundle ships

9 PRG titles from 1978 to 1982, one disk-image title from 2021, and an empty stub for the BASIC prompt:

- Star Trek (1978) — Version 17 of the BASIC space-strategy classic, with one-letter commands
- Android NIM (1979) — Don Dennis's Nim against three talking executioner androids
- Lunar Lander (1979)
- Adventureland (1979) — Scott Adams' first text adventure
- Hangman (1980), Space Invaders (1980)
- Crazy Balloon (1981), Frog (1981, year unverified)
- PET-MAN (1982) — Paul Gummersall's maze game, with coding changes by Jim Butterfield
- Attack of the PETSCII Robots (2021) — David Murray's shareware release, loaded from its own disk image

All eleven entries auto-LOAD and auto-RUN from BASIC. Total bundle size including the emulator is under 600 KB.

## Bundle layout

```
systems/pet/
├── play.html          ← ~90 lines; constructs Pet2001, drives keys + cycle loop
├── controls.html
├── games.json         ← 11 entries, optional autostart override
├── games/             ← *.prg files, and petrobot.d64
└── pet2001/           ← Skibo's 9-file emulator (BSD-2-Clause), copied from Retro-Jack/pet2001
    ├── cpu6502.js
    ├── petkeys.js
    ├── pet2001roms.js
    ├── pet2001hw.js
    ├── pet2001ieee.js
    ├── pet2001io.js
    ├── pet2001video.js
    ├── pet2001.js
    └── pet2001main.js (unused — replaced by play.html boot logic)
```

## Related

- [[Emulator-VICE-family]] — six sub-systems still on EmulatorJS (PET migrated out)
- [[Emulators]] — index
