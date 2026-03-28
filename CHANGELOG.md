# Changelog

## [Unreleased]

### Changed
- `prompt/javascript/fs.js`: Removed all directories and menu entries where no emulator is available

#### CONSOLE section
- ATARI: removed JAGUAR directory and its `[no emu]` menu entry
- NINTENDO: removed SNES, GB, GBC, VB, N64 directories and their `[no emu]` menu entries; menu now shows NES only
- SEGA: removed SCD and SATURN directories and their `[no emu]` menu entries
- NEC: removed PCFX directory and its `[no emu]` menu entry
- Removed entire SNK block (NEOGEO — no emulator available)
- Removed entire PHILIPS block (CDI — no emulator available)
- Removed entire 3DO block (3DO Interactive — no emulator available)
- CONSOLE top-level menu renumbered: SNK (5), PHILIPS (9), 3DO (10) removed; MATTEL is now 5, COLECO 6, MAGNAVOX 7, BANDAI 8

#### HOMECOMP section
- COMMODORE: removed VIC20 directory and its `[no emu]` menu entry; C64 is now entry 1
- Removed entire ACORN block (BBC, Electron, Archimedes — no emulators available)
- Removed entire MSX block (MSX1/2/2+ — no emulators available)
- TANDY: removed TRS80 directory and its `[no emu]` menu entry; COCO is now entry 1
- Removed entire NEC (home computers) block (PC6001, PC88, PC98 — no emulators available)
- SHARP: removed MZ directory and its `[no emu]` menu entry; X68K is now entry 1
- Removed entire FUJITSU block (FM7, FM77, FM Towns — no emulators available)
- Removed entire THOMSON block (TO7, MO5, TO8, MO6 — no emulators available)
- Removed entire ORIC block (Oric-1, Atmos, Oric-16 — no emulators available)
- HOMECOMP top-level menu renumbered: ACORN (6), MSX (7), NEC (10), FUJITSU (12), THOMSON (13), ORIC (14) removed; TANDY is now 6, TI is 7, SHARP is 8
- Removed intermediate [LAUNCH] step from all 7 console systems with GAMES submenus (2600, 5200, 7800, NES, INTV, CVISION, ODYSSEY2): selecting a system now navigates directly to its GAMES menu; system-level nav files (menu.bat, launch.exe, 0/1/2.bat) removed from each system's files array; parent .bat files updated to `cd SYSTEM\ncd games\nmenu\n`; GAMES/0.bat updated to go back two levels; menu labels updated from [LAUNCH] to [GAMES]
