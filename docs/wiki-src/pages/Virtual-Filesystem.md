The simulated `C:` drive lives in `prompt/javascript/fs.js` as a JS object tree. Every directory and file the user can `dir` is defined there. It's editable: change the file, hard-refresh, the prompt sees the new tree.

## Top-level layout

```
C:\
├── AUTOEXEC.BAT          runs on boot — calls `menu`
├── menu.bat              `cd systems\nmenu` (drops straight into the EMULATOR LAUNCHER)
└── SYSTEMS\              EMULATOR LAUNCHER: 1 HOMECOMP / 2 CONSOLE / 3 HANDHELD / 4 WIKI / 0 Exit
    ├── HOMECOMP\         ACORN (BBC / ELECTRON / MASTER) / AMSTRAD (CPC) /
    │                     APPLE (APPLE1 / APPLEII) / ATARI (400 / 800XL) /
    │                     COMMODRE (PET / VIC20 / MAX / C64 / C16 / PLUS4) /
    │                     MSX (MSX1 / MSX2) / SINCLAIR (SPECTRUM / ZX81) /
    │                     TANDY (TRS80 / COCO) / TI99
    ├── CONSOLE\          ATARI (2600 / 7800) / CVISION / INTV / NES /
    │                     ODYSSEY2 / SMS
    └── HANDHELD\         GAMEBOY (Game Boy / Color) / LYNX / GAMEGEAR
```

## Which menus map to which emulators

All 32 bundled sub-systems run their games locally — every byte of game data is on the same origin.

| Menu path | Backing emulator | Notes |
|---|---|---|
| CONSOLE → NES | EmulatorJS + FCEUmm | dir name is `jsnes/` for legacy reasons |
| CONSOLE → ATARI → 2600 | EmulatorJS + Stella | |
| CONSOLE → ATARI → 7800 | EmulatorJS + ProSystem | dir name is `js7800/` for legacy reasons |
| CONSOLE → SMS | EmulatorJS + genesis_plus_gx | Sega Master System |
| CONSOLE → CVISION | EmulatorJS + gearcoleco | colecovision.rom BIOS bundled |
| CONSOLE → INTV | jzIntv WASM | exec.bin + grom.bin BIOS bundled |
| CONSOLE → ODYSSEY2 | libretro-o2em → WASM + custom SDL2 frontend | o2rom.bin BIOS bundled |
| HANDHELD → GAMEBOY | EmulatorJS + gambatte (nightly) | Game Boy + Game Boy Color, one `gbc/` menu |
| HANDHELD → LYNX | EmulatorJS + handy | lynxboot.img bundled |
| HANDHELD → GAMEGEAR | EmulatorJS + genesis_plus_gx | |
| HOMECOMP → ACORN → BBC | jsbeeb | |
| HOMECOMP → ACORN → ELECTRON | ElkJS | UEF snapshots |
| HOMECOMP → ACORN → MASTER | jsbeeb (`?model=Master`) | Elite uses DSD for drive 2 |
| HOMECOMP → AMSTRAD → CPC | floooh tiny8bit CPC WASM | sokol_args URL params |
| HOMECOMP → APPLE → APPLE1 | apple1js | tapes + Woz Monitor |
| HOMECOMP → APPLE → APPLEII | apple2js | `.dsk` images converted to JSON |
| HOMECOMP → ATARI → 400 | `atari400/` bundle — atari800 WASM (genuine Atari OS-B) | |
| HOMECOMP → ATARI → 800XL | `atari800/` bundle — atari800 WASM (genuine Atari XL/XE OS Rev 2) | full copy of the same build |
| HOMECOMP → COMMODRE → PET | Thomas Skibo's pet2001 (vanilla JS) | PET 2001 / BASIC 2 / 32 K |
| HOMECOMP → COMMODRE → VIC20 | EmulatorJS + VICE xvic | `memory_expansions='all'` |
| HOMECOMP → COMMODRE → MAX | EmulatorJS + VICE x64 (Ultimax mode) | Japan-only 1982 console |
| HOMECOMP → COMMODRE → C64 | EmulatorJS + VICE x64 | real-time IEC loading |
| HOMECOMP → COMMODRE → C16 | EmulatorJS + VICE xplus4 (C16 mode) | |
| HOMECOMP → COMMODRE → PLUS4 | EmulatorJS + VICE xplus4 | |
| HOMECOMP → MSX → MSX1 / MSX2 | WebMSX — `msx1/` (`?M=MSX1`) + `msx2/` (`?M=MSX2`) bundles | full copy of the engine in each |
| HOMECOMP → SINCLAIR → SPECTRUM | JSSpeccy 3 | |
| HOMECOMP → SINCLAIR → ZX81 | JtyOne | |
| HOMECOMP → TANDY → TRS80 | sdltrs (our own WASM build) | Model III; ROM fetched into MEMFS at boot |
| HOMECOMP → TANDY → M100 | VirtualT (our core-only WASM build) | Model 100; live clock + battery-backed RAM |
| HOMECOMP → TANDY → COCO | XRoar | Tandy Color Computer |
| HOMECOMP → TI99 | js99er (vanilla JS build) | |

Each system menu lists 10 games (the Acorn Electron is the exception, with 6 — from the set ElkJS ships). Command-line machines add an 11th entry that boots a clean `PROMPT` / `BASIC`. MSX has 10 + 10 (MSX1 + MSX2 sub-menus). On the ZX81, the **1K Chess** slot opens a small sub-menu to pick the computer's opening — king's pawn or queen's pawn — the first per-game sub-menu in the tree.

For the integration stories per emulator, see [[Emulators]].

## The per-system menu pattern

A typical `<SYSTEM>\GAMES\` directory looks like:

```
GAMES\
├── menu.bat              numbered title list (45-char wide box-drawn menu)
├── 0.bat                 cd .. / cd .. / menu (back two levels)
├── 1.bat .. N.bat        each runs a named .bat
└── <key>.bat             one per title, with link: → emulator URL
```

How a user gets from the prompt to a game (NES example):

```
1   → cd systems / menu        (EMULATOR LAUNCHER → CONSOLE / HOMECOMP)
2   → cd console / menu          (CONSOLE SYSTEMS)
2   → cd nes / menu              (NES GAMES — auto-cd into games)
3   → contra                     (opens systems/jsnes/play.html?game=contra)
0   → cd .. / cd .. / menu       (back to CONSOLE menu)
```

## The file-object schema

A node in `fs.js` is `{ name, directories?, files? }` for directories, or one of these for files:

| Field on a file | Meaning |
|-----------------|---------|
| `data: '<batch>'` | Treats the "file" as a batch script — each `\n`-separated line is dispatched as a command |
| `link: '<url>'` | Treats the file as a launcher — `window.open(link, "_blank")` |
| `hidden: true` | Hidden from `dir` output (still navigable via `cd`) |

Game `.bat` files use `link:`. `menu.bat` and numbered launchers use `data:`.

## The no-`.html`-files rule

The virtual filesystem only lists `.bat` files — game launchers, menu scripts, and the numbered shortcuts that route between them. Auxiliary HTML pages (each emulator's `controls.html`, future bezels, etc.) live on disk under `systems/<name>/` but are reached from inside the emulator's entry HTML via the top-corner links, not from the DOS prompt.

This is period-correct: a DOS user typing `dir` shouldn't see `.html`.

See [[Customising the Filesystem]] for worked examples of adding entries.
