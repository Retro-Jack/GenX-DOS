GenX-DOS is a static page that recreates a 1990s DOS prompt in the browser. Visitors land on a fake AMIBIOS POST screen, get dropped into a `C:\>` prompt, and navigate numbered menus to launch emulated games — all running locally in the page.

There's no server, no build step, no framework. The whole thing is HTML and JavaScript that runs straight out of GitHub Pages.

## The boot flow

When the page loads:

1. `index.html` is the landing page — an intro, a CP437 spec sheet, the screenshots and links, and an **Enter the museum** button into `prompt/` (touch devices get a keyboard-required graphic instead). The POST animation lives inside the prompt page.
2. `prompt/index.html` is the DOS terminal. On load, `init()`:
   - renders the AMIBIOS POST — AMI logo, AMIBIOS header, CPU/coprocessor/memory test with animated 0000 → 8064 KB count, six device-detection lines streamed at 500 ms each, footer with BIOS ID
   - pauses 5 seconds with the full POST on screen. The `Hit <DEL> if you want to run SETUP` line is period set dressing — nothing is wired to it.
   - clears, renders the System Configuration table
   - prints `Starting GenX-DOS . . .` and `Type "help" <enter> for assistance.`
   - calls `initTerminal()` which wires up the keyboard and runs `AUTOEXEC.BAT`
3. `AUTOEXEC.BAT` runs `menu`. The root `menu.bat` does `cd systems\menu`, dropping the user straight into the EMULATOR LAUNCHER.
4. The user types a number (or a command name) to navigate.
5. Selecting a game opens the emulator in a new tab via `window.open`.

## How it's built

Pure HTML + JavaScript. No build step, no frameworks, no dependencies.

Every visible character is its own `<div>`, styled with a CSS background-position into a 12×12 CP437 sprite sheet. The virtual filesystem is a JS object tree in `prompt/javascript/fs.js`. When the user types `dir`, the prompt walks that tree and renders the result through the sprite font.

## Save / load state

Most bundles carry **save** / **load** controls (bottom-left); each opens a drop-up menu of **five save slots per game** — an instant in-browser snapshot of the running machine, held in memory and persisted to **IndexedDB** (keyed `platform:game:slot`) so the slots survive a reload, and different games are kept independent. The 14 EmulatorJS bundles drive the libretro cores' state API via `_shared/genx-savestate.js`; the standalone engines that expose a reachable save-state — TI-99/4A, BBC Micro/Master (mid-game, even Elite), MSX, CoCo, Odyssey², Atari 8-bit and Amstrad CPC — register a per-bundle `GenXStateAdapter` that `_shared/genx-savestate-std.js` wires to the same menus. Each engine reaches it differently (`processor.snapshotState()`, `WMSX.room.machine.saveState()`, XRoar's `write_snapshot`, the o2em `retro_serialize` rebuild, atari800's deferred `StateSav_*`, the cpc `cpc_save_snapshot` rebuild…), documented per page. Three (Odyssey², Atari 8-bit, Amstrad CPC) needed a WASM rebuild to expose state the stock build hid. The engines with no reachable state API (Apple, Electron, Spectrum, ZX81, Intellivision, PET) — plus the TRS-80, whose sdltrs has a built-in but unwired save-state, and the Model 100, which persists its battery-backed RAM to browser storage instead — have no buttons.

See **[Your Data](Your-Data)** for the complete list of what GenX-DOS writes to your browser's local storage — save-states, the Model 100's battery RAM, in-game cartridge saves and emulator settings — and exactly when.

## The scope rule: 8-bit feel

Every shipped system has the *feel* of an 8-bit machine — sprite-based, chiptune, low-res. The test is the aesthetic, not the calendar year or strict CPU bit-width. (Updated 14/06/2026 from the earlier "8-bit era, ~1975-1990" framing.) Intellivision (CP1610, 16-bit ALU) is in because it plays like an 8-bit-era console. The 8-bit-feel handhelds — Game Boy / GBC, Game Gear, Lynx — are in even where they run into the late 90s (a colour GBC game from 2002 still feels 8-bit). Sega Genesis (1988) is out: it defined the 16-bit look-and-sound leap, even though the calendar year overlaps.

DOS is the prompt host. See [[Roadmap]] for the full in/out list and what's still on the slate.

## The lineup

19 emulators ship under `systems/`, driving 33 sub-systems:

- Consoles: Atari 2600, Atari 7800, ColecoVision, Intellivision, NES, Magnavox Odyssey², Sega Master System
- Handheld: Game Boy / Game Boy Color, Atari Lynx, Sega Game Gear
- Apple: Apple I, Apple ][+
- Acorn: BBC Micro, BBC Master 128 (same jsbeeb engine, shipped as two bundles — `bbcmicro/` boots Model B, `bbcmaster/` boots `?model=Master`), Electron
- Atari home: Atari 400, Atari 800XL (same atari800 engine, shipped as two bundles — `atari400/` boots OS-B, `atari800/` boots OS-XL)
- Commodore: VIC-20, MAX, C64, C16, Plus/4, C128 (six sub-systems off four VICE libretro cores); PET on its own (Thomas Skibo's pet2001, vanilla JS)
- Sinclair: ZX81, ZX Spectrum
- Amstrad: CPC
- Tandy: CoCo, TRS-80 Model I, TRS-80 Model 100
- Texas Instruments: TI-99/4A
- MSX: MSX1, MSX2

Fourteen of these (the six VICE bundles, ColecoVision, NES, the Atari 2600, the Atari 7800, the Sega Master System, and the three handhelds — Game Boy/GBC, Lynx, Game Gear) share one copy of the EmulatorJS framework via `systems/_shared-ejs/`. Intellivision, Electron, Odyssey², and the PET stand alone — jzIntv, ElkJS, libretro-o2em, and Skibo's pet2001 respectively, each with its own custom loader.

See [[Emulators]] for the index and individual integration stories.
