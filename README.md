# GenX-DOS

A browser DOS prompt that boots emulators from numbered menus, with bundled ROMs. Drop into a fake AMIBIOS POST, get a `C:\>` cursor, type a number, play a game. Everything runs on the page — no server, no network calls at runtime.

We bundle 19 emulator engines covering 31 sub-systems between them, from the Apple I to the Sega Game Gear.

**Scope:** 8-bit *feel* — anything with the look and sound of an 8-bit machine (sprite-based, chiptune, low-res), including the 8-bit-feel handhelds (Game Boy/GBC, Game Gear, Lynx) even where they run into the late 90s. The cutoff is the *aesthetic*, not the calendar or strict CPU width; 16-bit home consoles/computers (Genesis, SNES, Amiga, ST) stay out. See the [Roadmap](https://github.com/Retro-Jack/GenX-DOS/wiki/Roadmap) for what's shipped, planned, and rejected.

## Quick start

```sh
./serve.sh
```

Or directly:

```sh
python3 -m http.server 8765
```

Open <http://127.0.0.1:8765/prompt/>.

## What you'll find in the repo

```
index.html                fake BIOS POST screen, redirects to prompt/
serve.sh                  starts the local server
CHANGELOG.md              release notes
ATTRIBUTION.md            canonical record of every bundled third-party asset
prompt/                   the DOS terminal (HTML + JS, no build)
  index.html
  javascript/             terminal logic + virtual filesystem (fs.js)
  img/                    bitmap font sprite sheets + AMIBIOS logo
gamedocs/                 per-game instruction pages (gamedocs/<platform>/<key>.html)
systems/
  _shared/                shared CSS + helpers (NumLock warn, RUN/STOP softkey, ...)
  _shared-ejs/            shared EmulatorJS framework + 4 VICE cores + gearcoleco + FCEUmm + Stella + gambatte + handy + genesis_plus_gx
                          (12 bundles share one ~3 MB framework; saves ~25 MB vs per-bundle copies)
  apple1/                 Apple I             — apple1js + 10 cassette tapes
  jsbeeb/                 BBC Micro + Master  — Vite-built dist + BBC + Master-enhanced disks
  electron/               Acorn Electron      — ElkJS + 10 UEF snapshots
  apple2/                 Apple ][+           — apple2js webpack dist + 10 .dsk images
  jsnes/                  NES                 — EmulatorJS + FCEUmm + 10 .nes ROMs
  stella/                 Atari 2600          — EmulatorJS + Stella (stella2014) + 10 .a26 ROMs
  gbc/                    Game Boy / GBC      — EmulatorJS + gambatte + 10 GB/GBC ROMs (handheld)
  lynx/                   Atari Lynx          — EmulatorJS + handy + boot ROM + 10 .lnx ROMs (handheld)
  gamegear/               Sega Game Gear      — EmulatorJS + genesis_plus_gx + 10 .gg ROMs (handheld)
  js7800/                 Atari 7800          — JS7800 + 10 .a78 carts
  webmsx/                 MSX1 + MSX2         — WebMSX single-file bundle + 10 + 10 titles
  jsvecx/                 GCE Vectrex         — JSVecX + 24 commercial + ~470 homebrew ROMs
  jsspeccy/               Sinclair Spectrum   — JSSpeccy 3.2 + 10 .z80 snapshots
  jtyone/                 Sinclair ZX81       — JtyOne + 10 .p tapes
  xroar/                  Tandy CoCo          — XRoar WASM + 10 .ccc carts
  js99er/                 TI-99/4A            — vanilla-JS js99er + 10 .rpk carts
  atari800/               Atari 400 + 800XL   — atari800 built from source to WASM
  pet/                    Commodore PET       — Thomas Skibo's pet2001 (vanilla JS) + 10 .prg
  vic20/                  Commodore VIC-20    — EmulatorJS + VICE xvic + 10 cart .prg
  max/                    Commodore MAX       — EmulatorJS + VICE x64 in Ultimax mode + 10 .crt
  c64/                    Commodore 64        — EmulatorJS + VICE x64 + 10 .d64
  c16/                    Commodore 16        — EmulatorJS + VICE xplus4 C16 mode + 10 .prg
  plus4/                  Commodore Plus/4    — EmulatorJS + VICE xplus4 + 10 .prg
  c128/                   Commodore 128       — EmulatorJS + VICE x128 native mode + 10 titles
  coleco/                 ColecoVision        — EmulatorJS + gearcoleco + 10 launch-era .col carts
  intellivision/          Mattel Intellivision — jzIntv WASM (custom loader) + 10 carts
  amstradcpc/             Amstrad CPC         — floooh tiny8bit CPC WASM + 10 .dsk titles
  odyssey2/               Magnavox Odyssey²   — libretro-o2em + custom SDL2 frontend + 10 carts
```

## Where the readable source is

The hand-written GenX-DOS code lives in `prompt/javascript/`, `systems/_shared/`, `systems/_shared-ejs/`, and each emulator's `play.html` wrapper — all formatted for reading.

Everything else under `systems/<name>/` is upstream: emscripten WASM glue (`xroar.js`, `atari800.js`, `o2em.js`, `jzintv.js`), webpack production bundles (`apple1.js`, `apple2/dist/*.bundle.js`, `jsspeccy.js`), single-file inlined deploys (`webmsx/index.html`, `jsvecx/index.html`), or hand-written JS from the upstream project (ElkJS, js99er's `emu/`). For the readable source of those, follow the upstream link in [ATTRIBUTION.md](ATTRIBUTION.md) or the per-engine integration story on the [wiki](https://github.com/Retro-Jack/GenX-DOS/wiki/Emulators).

## The emulator lineup

Each engine has its own story page on the wiki — the gotchas we hit, the workarounds we shipped, the dead ends we ruled out. The table below is the quick-reference; click through to [Emulators](https://github.com/Retro-Jack/GenX-DOS/wiki/Emulators) for the index.

| System    | Copied from                          | URL pattern                              |
|-----------|--------------------------------------|------------------------------------------|
| Apple I   | scullin/apple1js                     | `play.html?tape=<key>`                   |
| BBC Micro | mattgodbolt/jsbeeb                   | `?disc1=<path>.ssd&autoboot`             |
| BBC Master | mattgodbolt/jsbeeb (same build)     | `?model=Master&disc1=<path>.ssd&autoboot` |
| Acorn Electron | dmcoles/elkjs                   | `play.html?game=<key>`                   |
| Apple ][+ | whscullin/apple2js                   | `play.html?game=<key>`                   |
| NES       | EmulatorJS + FCEUmm libretro core    | `play.html?game=<key>`                   |
| 2600      | EmulatorJS + Stella (stella2014 core) | `play.html?game=<key>`                  |
| 7800      | raz0red/JS7800                       | `play.html?game=<key>`                   |
| MSX       | ppeccin/WebMSX                       | `?ROM=games/<sub>/<name>.zip[&M=MSX1]`   |
| Vectrex   | DrSnuggles/jsvecx                    | `index.html?rom=<dir>/<title>&game=<key>` |
| Spectrum  | gasman/JSSpeccy 3                    | `play.html?game=<key>`                   |
| ZX81      | JtyOne                               | `play.html?game=<key>`                   |
| Tandy CoCo| Ciaran Anscomb/XRoar                 | `play.html?game=<key>`                   |
| TI-99/4A  | Rasmus-M/js99er (vanilla-JS build)   | `play.html?game=<key>`                   |
| Atari 400 / 800XL | atari800/atari800 (our own WASM build) | `play.html?game=<key>[&machine=…]` |
| VIC-20 / MAX / C64 / C16 / Plus/4 / C128 | EmulatorJS + VICE libretro family | `play.html?game=<key>` |
| PET       | Thomas Skibo's pet2001 (vanilla JS)  | `play.html?game=<key>`                   |
| ColecoVision | EmulatorJS + gearcoleco (Drhelius) libretro | `play.html?game=<key>` |
| Intellivision | jzIntv (Joe Zbiciak) WASM, custom emscripten loader | `play.html?game=<key>` |
| Amstrad CPC   | floooh/chips-test tiny8bit CPC WASM (Andre Weissflog) | `play.html?game=<key>` (rewrites to `?file=&input=` for sokol_args) |
| Magnavox Odyssey² | libretro/libretro-o2em + custom SDL2/emscripten frontend | `play.html?game=<key>` |

ROMs are bundled locally — nothing is fetched at runtime.

The six VICE-family bundles (VIC-20, MAX, C64, C16, Plus/4, C128) share a unified input config (`keyboardInput` enabled + `vice_joyport_type='1'` Numpad) so typing and joystick coexist. Numpad 8/4/6/2 = joystick directions, 0/5 = fire, everything else types. Esc is browser-captured (exits pointer-lock/fullscreen) so we remap RUN/STOP to **Scroll Lock** + **Pause/Break** + a top-left clickable button via `systems/_shared/genx-vice-softkeys.js`. The PET sits separately on Thomas Skibo's pet2001 (vanilla JS, BSD-2-Clause) — keyboard-only and unrelated to the VICE plumbing; see the wiki for the migration story.

## Documentation

See the [wiki](https://github.com/Retro-Jack/GenX-DOS/wiki) for the long form. Each engine's integration story is its own page.

- **[Project Overview](https://github.com/Retro-Jack/GenX-DOS/wiki/Project-Overview)** — what the site does and how it's structured
- **[Virtual Filesystem](https://github.com/Retro-Jack/GenX-DOS/wiki/Virtual-Filesystem)** — the simulated `C:` drive and menu layout
- **[Commands](https://github.com/Retro-Jack/GenX-DOS/wiki/Commands)** — the DOS commands the prompt understands
- **[Font System](https://github.com/Retro-Jack/GenX-DOS/wiki/Font-System)** — how we draw the 12×12 CP437 glyphs
- **[Emulators](https://github.com/Retro-Jack/GenX-DOS/wiki/Emulators)** — index of every engine, each with its own page
- **[Customising the Filesystem](https://github.com/Retro-Jack/GenX-DOS/wiki/Customising-the-Filesystem)** — adding entries, batches, menus

## License

Summary below; see [ATTRIBUTION.md](ATTRIBUTION.md) for the canonical record including source URLs, authors, BIOS/ROM provenance, bezel artwork licences, and BY-SA share-alike obligations.

- DOS terminal, virtual filesystem, and 12×12 CP437 font sprite system by Mike @ **LGR — Lazy Game Reviews** (<https://www.lazygamereviews.com>)
- AMIBIOS POST animation, emulator integration wrappers, menu tree, and bundled-emulator-specific code by Retro-Jack
- jsbeeb: GPL-3.0-or-later (mattgodbolt/jsbeeb)
- ElkJS: (c) Darren Coles 2013 (dmcoles/elkjs) — 6502 core ported from Elkulator by Tom Walker
- apple2js: MIT (whscullin/apple2js)
- FCEUmm: GPL-2.0 (libretro NES core) — mirrored from `cdn.emulatorjs.org/stable/`
- Stella: GPL-2.0 (`stella2014` libretro core, stella-emu) — Atari 2600; mirrored from `cdn.emulatorjs.org/stable/`
- JS7800: GPL-2.0 (raz0red)
- WebMSX: MIT (ppeccin/WebMSX, Paulo Peccin)
- JSVecX: GPL-3.0 (raz0red, fork by DrSnuggles — JS port of Valavan Manohararajah's VecX)
- JSSpeccy 3: GPL-3.0 (Matt Westcott / gasman)
- JtyOne: GPL-2.0 (Simon Holdsworth, port of Mike Wynne's EightyOne)
- XRoar: GPL-3.0+ (Ciaran Anscomb)
- Js99'er: GPL-2.0 (Rasmus Moustgaard) — vanilla-JS build; TI-99/4A cart ROMs mirrored from the js99er.net public archive
- atari800: GPL-2.0+ (atari800/atari800 v5.2.0, built from source to WASM); AltirraOS-XL/800/BASIC (Avery Lee, freely redistributable open-source OS replacement) embedded inside `atari800.wasm` at build time via `--enable-altirra_bios` — no separate ROM file ships
- EmulatorJS: GPL-3.0 (EmulatorJS/EmulatorJS) — modern fork of emularity; shared across the six VICE-family bundles, ColecoVision, NES, and Atari 2600 via `systems/_shared-ejs/`
- VICE: GPL-2.0 (vice-emu.sourceforge.net) — libretro cores (`x64`, `x128`, `xvic`, `xplus4`) mirrored from `cdn.emulatorjs.org/stable/`
- pet2001: BSD-2-Clause (Thomas Skibo) — vanilla-JS PET 2001 emulator at `systems/pet/pet2001/`
- gearcoleco: GPL-3.0 (Drhelius) — libretro ColecoVision core mirrored from `cdn.emulatorjs.org/stable/`
- ColecoVision BIOS: ©1982 Coleco, bundled for emulator-only use
- jzIntv: Joe Zbiciak (free-for-personal-use terms) — WASM build mirrored from [mholzinger/intellivision-overlay-editor](https://github.com/mholzinger/intellivision-overlay-editor)
- Intellivision EXEC + GROM BIOS: ©1979 Mattel Electronics, bundled for emulator-only use
- floooh/chips-test tiny8bit CPC WASM: MIT (Andre Weissflog) — mirrored from `floooh.github.io/tiny8bit/`
- libretro-o2em: GPL-2.0+ (libretro/libretro-o2em, original o2em by Daniel Boris / Andre de la Rocha) — compiled from upstream source via `systems/odyssey2/build.sh`
- Magnavox Odyssey² BIOS (`o2rom.bin`): ©1978 Magnavox/Philips, bundled for emulator-only use
## License

[![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc/4.0/)

The original orchestration code, menu trees, and AMIBIOS POST animations authored by Jack Horton are licensed under **Creative Commons Attribution-NonCommercial 4.0 International**. 

Please note that GenX-DOS is a composite project containing bundled emulators, assets, and the LGR terminal base framework. These components are explicitly excluded from the CC license and remain bound by their original upstream terms. See [ATTRIBUTION.md](ATTRIBUTION.md) for full compliance details.
