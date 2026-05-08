# Changelog

## [Unreleased]

### Removed
- SHAREWRE submenu under MS-DOS — the 6 sub-categories (FPS, PLATFORM, ACTION, ADVENTURE, PUZZLE, STRATEGY) covering 208 classicdosgames.com links. The MS-DOS menu was rebuilt fresh from scratch under the standard self-host recipe (see Added below); the Shareware Library did not return.

### Changed
- Trimmed each platform's GAMES menu to top-10 most popular titles. NES dropped Mega Man 1, Excitebike, Pac-Man, Bomberman, 1942, Battle City, Ninja Gaiden, Double Dragon (18→10). Genesis dropped Streets of Rage 1, Altered Beast, Shinobi III, ToeJam & Earl, Vectorman (15→10). BBC dropped Repton 2, Zalaga, Hopper, Stryker's Run, Castle Quest (15→10). Atari 2600 dropped Defender, Donkey Kong, Frogger, Kaboom!, Seaquest, Enduro, Berzerk, Q*Bert (18→10). Corresponding `roms/`/`discs/` files and `games.json` entries removed.
- Added `PROMPT` entry (item 11) to BBC GAMES menu — links to `../emulators/jsbeeb/dist/` with no `disc1`/`autoboot`, drops the user at the bare BASIC `>` prompt. Other home computers will get the same option as they're self-hosted.
- Optimised `emulators/jsbeeb/`: 71 MB → 27 MB. Removed upstream dev infrastructure not used at runtime: `src/` (12 MB), `public/` (27 MB; already copied into `dist/`), `tests/` (2 MB), `tools/`, `docs/`, `docker/`, `Dockerfile`, `Makefile`, `run-container.sh`, `.husky/`, `.idea/`, `.vscode/`, `.github/`, `eslint.config.js`, `vite.config.js`, `release-please-config.json`, `.release-please-manifest.json`, `tsconfig.json`, `jsconfig.json`, `package-lock.json`, `bench.js`, upstream's `CLAUDE.md`/`CHANGELOG.md`/`index.html`, and various dotfiles. `dist/` is fully self-contained.
- Pruned 18 upstream sample/test discs from `emulators/jsbeeb/dist/discs/` root (`Welcome.ssd`, `elite.ssd`, `frogman.ssd`, `bcdtest.ssd`, etc.) — not referenced by our menus.
- Removed `emulators/genesis/Genesis.htm.upstream-reference` (lrusso demo HTML kept for development reference; no longer needed).

### Documentation
- Added top-level `README.md` describing the site layout, emulator integration recipe, menu structure, and jsbeeb disc URL semantics.
- Added an extended-ASCII boot configuration table above the root `DOS  EMULATOR  LAUNCHER` menu — 80-col double-rule outer border (matching the rest of the site's menu style), single-rule column divider, two-column hardware fields styled after a 486-era POST screen.

### Added
- Self-hosted MS-DOS emulator (caiiiycuk/js-dos v8.3.20, GPL-2.0) at `emulators/jsdos/` — `js-dos.js` (~310 KB) + `js-dos.css` + `emulators/wdosbox.{js,wasm}` (~1.6 MB) + `wlibzip.{js,wasm}` (~190 KB) + `emulators.js` (~72 KB). Skipped `wdosbox-x.{js,wasm}` (~7 MB DOSBox-X variant) — the standard wdosbox handles all 10 catalogue games. `play.html` reads `?game=<key>`, looks up `{title, bundle}` in `games.json`, and calls `Dos(div, { url: bundle })`.
- `emulators/jsdos/games.json`: 10-entry MS-DOS catalogue mapping keys to local `.jsdos` bundle paths.
- `emulators/jsdos/bundles/`: 10 `.jsdos` bundles (~22 MB total, sourced from archive.org). Each bundle is a zip of the original DOS files plus `.jsdos/dosbox.conf` containing the `[autoexec]` (`cd <subdir>` then run the `.exe`). Catalogue: Doom (1993, floppy, 3 episodes), Duke Nukem (1991), Zork I (frotz interpreter), Commander Keen 1 "Marooned on Mars", Out of This World, Epic Pinball, Tyrian (1995, freeware), SimCity (1989), Wolfenstein 3D, Prince of Persia (1989). Picked the first game in each franchise (Duke 1 not Duke II, Keen 1 not Keen 4, SimCity not SimCity 2000) and the floppy release where both formats existed (Doom 1993 not Ultimate Doom 1995 CD).
- `prompt/javascript/fs.js`: Re-introduced `c/EMULATORS/DOS/` directory with a flat 10-entry menu linking each game to `../emulators/jsdos/play.html?game=<key>`. `EMULATOR LAUNCHER` parent menu lists `1. DOS`, `2. CONSOLE`, `3. HOMECOMP` again with `*.bat` renumbered accordingly.
- Self-hosted Javatari emulator (ppeccin/javatari.js v5.0.4, AGPL-3.0, pure-JS Atari 2600) at `emulators/javatari/` — `javatari.js` (~700 KB) plus `play.html` wrapper that reads `?game=<key>`, looks up `{title, rom}` in `games.json`, sets `?ROM=<path>` on the URL, and injects `javatari.js` (which reads its config from URL params at script load).
- `emulators/javatari/games.json`: 10-entry Atari 2600 catalogue mapping keys to local ROM paths.
- `emulators/javatari/roms/`: 10 Atari 2600 ROMs (~52 KB total, extracted from `.zip` archives in archive.org item `cylums-atari-2600-rom-collection`); covers Adventure, Asteroids, Pac-Man, Pitfall!, Space Invaders, Missile Command, Breakout, Yars' Revenge, River Raid, Centipede.
- `prompt/javascript/fs.js`: Repointed all 10 Atari 2600 game links from `https://www.virtualatari.org/soft.php?soft=*` to `../emulators/javatari/play.html?game=<key>`. Menu rebuilt at 10 entries (renumbered 1–10) to match the trim done on other platforms.
- Self-hosted lrusso/Genesis emulator (Emscripten port of PicoDrive, pure-JS) at `emulators/genesis/` — `Genesis.min.js` (~2.1 MB) plus `play.html` wrapper that reads `?game=<key>`, looks up `{title, rom}` in `games.json`, fetches the ROM via XHR, and boots via `embedGenesis(...)`
- `emulators/genesis/games.json`: 15-entry Genesis catalogue mapping keys to local ROM paths
- `emulators/genesis/roms/`: 15 Genesis ROMs (~23 MB total, extracted from `.zip` archives at archive.org item `sega-genesis-romset-ultra-usa`); covers Sonic 1/2/3, Streets of Rage 1/2, Altered Beast, Phantasy Star IV, Gunstar Heroes, Ecco the Dolphin, Comix Zone, Shinobi III, ToeJam & Earl, Vectorman, Earthworm Jim, Mortal Kombat
- `prompt/javascript/fs.js`: Re-introduced SEGA branch — CONSOLE → SEGA → GENESIS → GAMES with 15 numbered entries; CONSOLE top-level menu renumbered to insert SEGA at position 3 (1.ATARI, 2.NINTENDO, 3.SEGA, 4.MATTEL, 5.COLECO, 6.MAGNAVOX); each game `.bat` links to `../emulators/genesis/play.html?game=<key>`
- Self-hosted JSBeeb emulator at `emulators/jsbeeb/` (v1.12.0); built `dist/` produced via `npm run build`
- `prompt/javascript/fs.js`: Repointed all 15 BBC Micro game links from `https://bbc.xania.org/?...` to `../emulators/jsbeeb/dist/?...`
- `emulators/jsbeeb/dist/discs/`: Bundled 15 BBC Micro disc images locally (~3.4 MB) so jsbeeb no longer fetches from `stairwaytohell.com` at runtime. Originally bundled the .zip files but jsbeeb's default-schema disc loader (`disc.load("discs/" + path)`) doesn't unzip — only the `sth:`/`http:`/`https:` branches do. Switched to extracting the inner `.ssd` from each zip and serving those directly, so URLs are now `?disc1=<path>.ssd&autoboot` instead of `?disc1=<path>.zip&autoboot`. Six STH paths corrected during the move: ChuckieEgg `AF/`→`AnF/`, Zalaga `Acornsoft/`→`Aardvark/`, Snapper `Acornsoft/Snapper`→`Acornsoft/Snapper-v1-alt`, ManicMiner `Tynesoft/`→`SoftwareProjects/`, CastleQuest `Superior/`→`Micropower/`, Uridium `Superior/`→`Hewson/`
- Self-hosted JSNES emulator at `emulators/jsnes/` (v2.1.0); copied published bundle `dist/jsnes.min.js` from npm (~136 KB)
- `emulators/jsnes/play.html`: Static wrapper that reads `?game=<key>`, looks up `{title, rom}` in `games.json`, and boots the ROM via `jsnes.Browser`
- `emulators/jsnes/games.json`: 18-entry NES catalogue mapping keys (matching the `.bat` names in `fs.js`) to local ROM paths under `roms/`
- `emulators/jsnes/roms/`: 18 NES ROMs (~2.5 MB total) sourced from archive.org item `nintendo-entertainment-system-nes-roms-europeusa`; bundled locally because archive.org doesn't set CORS headers for direct browser fetch
- `prompt/javascript/fs.js`: Repointed all 18 NES game links from `https://www.retrogames.cc/nes-games/...` to `../emulators/jsnes/play.html?game=<key>`

  (EmulatorJS was attempted first under `emulators/emulatorjs/` and dropped — its loader's `"../"` path-prepend logic conflicted with relative `EJS_pathtodata` config and rendered a blank screen even after switching to absolute paths. JSNES has a simpler embed API and worked first try.)

### Removed
- `emulators/jsbeeb/index.html`: Stripped upstream Google Analytics (`gtag` snippet for `G-Z9ZN3S7XRE`) and tightened CSP to drop `*.google-analytics.com` / `*.google.com` allowances; rebuilt `dist/`
- `emulators/jsbeeb/node_modules/` and `emulators/jsbeeb/.git/` excluded from the repo (regenerable; the inner `.git` was the upstream's separate history)
- Added top-level `.gitignore` for `emulators/*/node_modules/`

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
- Removed all `[LAUNCH]` entries (archive.org library launchers with no individual game emulators) across all platforms
- CONSOLE: removed ATARI LYNX, SEGA (SMS, GENESIS, 32X, GG), NEC (TurboGrafx-16), BANDAI (WonderSwan, WonderSwan Color); removed entire SEGA, NEC, and BANDAI blocks; ATARI CONSOLES now shows 2600, 5200, 7800 only; CONSOLE SYSTEMS renumbered to 5 entries (ATARI, NINTENDO, MATTEL, COLECO, MAGNAVOX)
- HOMECOMP: removed entire block (COMMODORE, ATARI HOME, SINCLAIR, AMSTRAD, APPLE, TANDY, TI, SHARP — all `[LAUNCH]`-only)
- EMULATOR LAUNCHER menu: removed HOMECOMP (3) entry; now shows DOS and CONSOLE only
- All 36 `menu.bat` files audited and standardised against the DOS/FPS gold standard: single-digit item rows now use 3 spaces before the number (was 2 in console parent menus, home computer menus, shareware library, and emulator launcher menus); all menus verified at 45-char inner width, with correct Back placement, footer, and `echo on` terminator
- Added new HOMECOMP section: `HOMECOMP → ACORN → BBC → GAMES` with 15 BBC Micro titles via JSBeeb (bbc.xania.org STH archive); individual game link files for Elite, Chuckie Egg, Repton, Repton 2, Zalaga, Snapper, Hopper, Manic Miner, Jet Set Willy, Citadel, Stryker's Run, Exile, Thrust, Castle Quest, Uridium; all menu item widths verified at 45 chars
- EMULATOR LAUNCHER menu: added `HOMECOMP    Home Computers` as entry 3; added `3.bat` (`cd homecomp\nmenu`); now shows DOS, CONSOLE, and HOMECOMP
- Expanded HOMECOMP with 4 additional manufacturers: COMMODORE (C64, 15 games via c64online.com), ATARI (800XL, 15 games via archive.org a8b collection), SINCLAIR (ZX Spectrum, 15 games via archive.org zx collection), TANDY (CoCo, 15 cartridge games via colorcomputerarchive.com XRoar); HOME COMPUTERS menu updated to 5 entries; all menu widths verified at 45 chars
- Added Atari ST as second system under ATARI manufacturer: 15 games (Dungeon Master, Monkey Island, North & South, Defender of the Crown, Bubble Bobble, Maniac Mansion, Zak McKracken, California Games, Out Run, Double Dragon, Altered Beast, Ghosts 'n Goblins, Star Wars: Jedi, Ultima IV, Pac-Mania) via archive.org; ATARI COMPUTERS menu updated to 2 entries
- Added Sinclair ZX81 as second system under SINCLAIR manufacturer: 15 games (3D Monster Maze, Mazogs, Space Invaders, Chess, Asteroids, Frogger, Night Gunner, Galaxians, Invaders, Centipede, Black Crystal, 3D Grand Prix, Scramble, Maze Death Race, City of Xon) via zx81stuff.org.uk; SINCLAIR COMPUTERS menu updated to 2 entries
- Note: Acorn Archimedes omitted — no browser emulator available; TRS-80 Model I/III omitted — no per-game URL support
