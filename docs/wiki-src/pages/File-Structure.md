A tour of where things live in the repo. The shape is deliberately flat — no `src/` vs `dist/` distinction, no build outputs, no node_modules. Everything you see is what gets served.

```
genx-dos/
├── README.md                 one-page entry point
├── CHANGELOG.md
├── ATTRIBUTION.md            canonical record of every bundled third-party asset
├── LICENSE.TXT               CC BY-NC 4.0 for the original work (third-party excluded)
├── SECURITY.md               scope + private vulnerability reporting
├── CONTRIBUTING.md           local setup + PR ground rules
├── CODE_OF_CONDUCT.md        Contributor Covenant 2.1
├── GenX-DOS.sh / GenX-DOS.bat    local dev server (Linux / Windows), opens the landing page
├── index.html                landing page (intro, spec sheet, links) → prompt/
├── favicon.ico
├── package.json / index.js   the npm package (@retro-jack/genx-dos)
├── Dockerfile                the ghcr.io container image (site served by nginx)
├── .github/                  publish-package workflow (release → ghcr + npm), Dependabot config, issue/PR templates
│
├── docs/                     front-facing documentation (served)
│   ├── article/             the feature article (index.html)
│   ├── wiki/                self-hosted wiki (generated from wiki-src/)
│   ├── wiki-src/            wiki markdown source + build.py generator
│   ├── badges/             local README badge copies (no runtime network)
│   ├── games/              per-game instruction pages — <platform>/<key>.html
│   └── images/             landing/README screenshots + social card (genx-social.png)
│
├── prompt/                   the DOS terminal
│   ├── index.html
│   ├── favicon.ico
│   ├── animated_favicon1.gif
│   ├── javascript/
│   │   ├── globals.js        shared state (palette, paths, flags)
│   │   ├── goFontGo.js       builds the 256 CSS rules
│   │   ├── classUtils.js     add/remove/test class helpers
│   │   ├── keyboard.js       keypress / keydown handlers
│   │   ├── terminal.js       echo, executeBatch, prompt rendering
│   │   ├── fs.js             the virtual C: drive
│   │   ├── commands-core.js  dir, cd, type, find, attemptExec, handleCmd
│   │   ├── commands.js       echo, cls, setcol, help
│   │   └── init.js           entry point + AMIBIOS POST animation
│   └── img/
│       └── ami-logo.png      AMIBIOS POST logo   (f12.* sheets now live in systems/_shared/styles/VGA_font/)
│
└── systems/
    ├── _shared/             shared JS + CSS + assets for every gamedoc + controls.html (360 pages) + play.html
    │   ├── genx-*.js        controls-link, game-loader, numlock-warn, vice-softkeys,
    │   │                    savestate(-std), bbc-copykey, trs80-softkeys, gamepad-keys, repo-link
    │   ├── styles/          all shared CSS (genx-controls/frame/noscript/savestate/controls-link.css)
    │   │   └── VGA_font/    DOS-prompt CP437 sheets f12.<0-15>.png + make_fonts.py generator
    │   ├── bezels/          PNG monitor frames (every platform now bezeled)
    │   ├── textures/        70s wallpaper tile (sitewide body background)
    │   └── favicon.ico / animated_favicon1.gif   site favicon, linked by every page
    ├── _shared-ejs/         shared EmulatorJS framework + 4 VICE cores + gearcoleco + FCEUmm + Stella + gambatte + handy + genesis_plus_gx + prosystem cores
    │                        (14 bundles share; saves ~25 MB vs per-bundle copies)
    ├── apple1/              Apple I            (copied from scullin/apple1js)
    ├── apple2/              Apple ][+          (copied from whscullin/apple2js)
    ├── bbcmicro/            BBC Micro          (jsbeeb, Model B — copied from mattgodbolt/jsbeeb)
    ├── bbcmaster/           BBC Master 128     (jsbeeb, model=Master — full copy of the same build)
    ├── electron/            Acorn Electron     (copied from dmcoles/elkjs)
    ├── jsnes/               NES                (EmulatorJS + FCEUmm libretro core)
    ├── stella/              Atari 2600         (EmulatorJS + Stella, stella2014 core)
    ├── js7800/              Atari 7800         (EmulatorJS + ProSystem, shared _shared-ejs/)
    ├── gbc/                 Game Boy / Color   (EmulatorJS + gambatte — handheld)
    ├── lynx/                Atari Lynx         (EmulatorJS + handy + boot ROM — handheld)
    ├── gamegear/            Sega Game Gear     (EmulatorJS + genesis_plus_gx — handheld)
    ├── msx1/                MSX1               (mirror of ppeccin/WebMSX, boots M=MSX1)
    ├── msx2/                MSX2               (full copy of the same WebMSX engine, boots M=MSX2)
    ├── sms/                 Sega Master System (EmulatorJS + genesis_plus_gx)
    ├── jsspeccy/            Sinclair Spectrum  (copied from gasman/JSSpeccy 3)
    ├── jtyone/              Sinclair ZX81      (copied from JtyOne)
    ├── xroar/               Tandy CoCo         (copied from 6809.org.uk/xroar)
    ├── trs80/               Tandy TRS-80 Model I (sdltrs, built from source to WASM)
    ├── m100/                Tandy TRS-80 Model 100 (VirtualT core-only build → WASM)
    ├── js99er/              TI-99/4A           (copied from Rasmus-M/js99er — vanilla-JS build)
    ├── atari400/            Atari 400          (atari800 WASM, boots OS-B)
    ├── atari800/            Atari 800XL        (atari800 WASM, boots OS-XL — same build)
    ├── pet/                 Commodore PET      (Thomas Skibo's pet2001 — vanilla JS)
    ├── vic20/               Commodore VIC-20   (EmulatorJS + VICE xvic)
    ├── max/                 Commodore MAX      (EmulatorJS + VICE x64 in Ultimax mode)
    ├── c64/                 Commodore 64       (EmulatorJS + VICE x64)
    ├── c16/                 Commodore 16       (EmulatorJS + VICE xplus4 in c16pal mode)
    ├── plus4/               Commodore Plus/4   (EmulatorJS + VICE xplus4)
    ├── c128/                Commodore 128      (EmulatorJS + VICE x128 native mode)
    ├── coleco/              ColecoVision       (EmulatorJS + gearcoleco + BIOS)
    ├── intv/                Intellivision      (jzIntv WASM + custom loader + BIOS)
    ├── odyssey2/            Magnavox Odyssey²  (libretro-o2em + custom SDL2 frontend + BIOS)
    └── cpc/                 Amstrad CPC        (floooh/chips-test tiny8bit CPC WASM)
```

## Per-emulator layout

Every emulator-specific page can be told in one row. Where there's an integration story behind the layout, the engine article on the [[Emulators]] index goes into the detail.

| Emulator | Runtime | Wrapper | Game files |
|----------|---------|---------|------------|
| `bbcmicro/`, `bbcmaster/` | `dist/` (Vite build; a full copy in each) | the dist's own `index.html` (URL-driven; Master adds `?model=Master`) | `dist/discs/<publisher>/*.ssd` |
| `electron/` | ElkJS pure-JS + jQuery | `play.html` (`?game=<key>`) | 6× `.uef` snapshots (from the set ElkJS ships) |
| `apple1/` | apple1js pure-JS | `play.html` (`?game=<key>`) | `tapes/*.js` |
| `apple2/` | apple2js webpack dist | `play.html` (rewrites `?game=` → apple2js `?disk=`) | `json/disks/*.json` |
| `jsnes/`  | EmulatorJS + FCEUmm libretro core | `play.html` (`?game=<key>`) | `roms/*.nes` |
| `stella/` | EmulatorJS (shared `_shared-ejs/`) | `play.html` | `roms/*.a26` |
| `js7800/` | EmulatorJS (shared `_shared-ejs/`) | `play.html` | `roms/*.a78` |
| `gbc/` | EmulatorJS + gambatte (shared `_shared-ejs/`) | `play.html` | `roms/*.gb`/`*.gbc` |
| `lynx/` | EmulatorJS + handy + `lynxboot.img` | `play.html` | `roms/*.lnx` |
| `gamegear/` | EmulatorJS + genesis_plus_gx | `play.html` | `roms/*.gg` |
| `msx1/`, `msx2/` | stock `wmsx.js` engine + our wrapper `index.html` (a full copy in each) | the bundle's own `index.html` (URL-driven; `&M=MSX1` / `&M=MSX2`) | `games/*.zip` |
| `sms/` | EmulatorJS + genesis_plus_gx | `play.html` (`?game=<key>`) | `roms/*.sms` |
| `jsspeccy/` | `jsspeccy/jsspeccy.js` + WASM Z80 in Web Worker | `play.html` | `games/*.z80`/`*.tap` |
| `jtyone/` | `zx81_emu.js` + `roms/zx81.rom` | `play.html` | `tapes/*.p` |
| `xroar/` | `xroar.js` + `xroar.wasm` + 9 system ROMs | `play.html` | `roms/*.ccc` |
| `trs80/` | `sdltrs.js` + `sdltrs.wasm` (Level II ROM embedded) | `play.html` | `games/*.cmd` |
| `m100/` | `virtualt.js` + `virtualt.wasm` (M100 ROM embedded) + `src/` (build source) | `play.html` | `games/*.ba` |
| `js99er/` | vanilla-JS modules + `lib/` (jQuery + zip.js) | `play.html` (`.rpk` first, `.bin` fallback) | `carts/*.rpk` |
| `atari400/`, `atari800/` | `atari800.js` + `atari800.wasm` (AltirraOS baked in; a full copy in each) | `play.html` (`?game=<key>`; 400 boots OS-B, 800XL boots OS-XL) | `roms/*.atr` + `*.rom` |
| `pet/` | Thomas Skibo's pet2001 (vanilla JS, `pet2001/` modules) | `play.html` (`?game=<key>`, IEEE-488 PRG injection) | `games/*.prg` |
| `vic20`, `max`, `c64`, `c16`, `plus4`, `c128` | EmulatorJS framework + VICE libretro core (shared) | `play.html` (per-game `model`/`video` overrides) | `games/*.prg`/`*.d64`/`*.crt` |
| `coleco/` | EmulatorJS + gearcoleco + `colecovision.rom` BIOS | `play.html` (`EJS_defaultControls` numpad remap) | `games/*.col` |
| `cpc/` | floooh/tiny8bit CPC WASM | `play.html` (URL rewrite to sokol_args `?file=&input=`) | `games/*.dsk` |
| `intv/` | jzIntv WASM + `exec.bin` + `grom.bin` BIOS | `play.html` (calls `Module.launchJzintv()`) | `games/*.int` |
| `odyssey2/` | libretro-o2em + custom SDL2 frontend + `o2rom.bin` BIOS | `play.html` (uses shared `genxLoadGame()`) | `games/*.bin` |

Each `play.html`-based emulator has a `games.json` mapping `<key>` → `{title, rom}` (or `{title, bundle}`). The URL-driven emulators (bbcmicro, bbcmaster, msx1, msx2) take all their config via query string or hash and need no per-site wrapper.

## Notes on individual files

| File | Purpose |
|------|---------|
| `index.html` (repo root) | the landing page — intro, CP437 spec sheet, screenshots and links, with the way into `prompt/`; touch devices get a keyboard-required graphic instead |
| `prompt/index.html` | Loads the JS modules in order, hosts the terminal `<div>` |
| `prompt/img/ami-logo.png` | AMIBIOS POST splash logo |
| `systems/_shared/styles/VGA_font/f12.7.png` | 192×192 px, 16×16 grid of 12×12 px CP437 glyphs (light grey) |
| `systems/_shared/styles/VGA_font/f12.<N>.png` | Pre-tinted variant for CGA palette index N |
| `systems/_shared/styles/VGA_font/make_fonts.py` | One-shot PIL script that tints `f12.7.png` into the other variants (run it from beside the sheets) |
| `GenX-DOS.sh` / `GenX-DOS.bat` | Local dev server for Linux / Windows — `python3 -m http.server` wrapper that finds a free port, opens the landing page, and stops when the browser window closes |
