# GenX-DOS

A browser DOS prompt that boots emulators from numbered menus, with bundled ROMs. Drop into a fake AMIBIOS POST, get a `C:\>` cursor, type a number, play a game. Everything runs client-side — no backend, no external network calls at runtime. Try it [here](https://genx-dos.fun/).

<p align="center">
  <img src="docs/images/screenshot-menu.png" width="49%" alt="GenX-DOS launcher menu in a CRT bezel, running in a browser">
  <img src="docs/images/screenshot.png" width="49%" alt="GenX-DOS running California Games (Atari Lynx) in a browser, framed in a handheld bezel">
</p>

Live at **[genx-dos.fun](https://genx-dos.fun/)**.

We bundle 18 emulator engines covering 33 sub-systems between them, from the Apple I to the Sega Master System.

**Scope:** 8-bit *feel* — anything with the look and sound of an 8-bit machine (sprite-based, chiptune, low-res), including the 8-bit-feel handhelds (Game Boy/GBC, Game Gear, Lynx) even where they run into the late 90s. The cutoff is the *aesthetic*, not the calendar or strict CPU width; 16-bit home consoles/computers (Genesis, SNES, Amiga, ST) stay out. See the [Roadmap](https://github.com/Retro-Jack/GenX-DOS/wiki/Roadmap) for what's shipped, planned, and rejected.

## Quick start

```sh
./GenX-DOS.sh
```

On Windows, double-click `GenX-DOS.bat` (or run it from a terminal).

Or directly:

```sh
python3 -m http.server 8765
```

Open <http://127.0.0.1:8765/>.

GenX-DOS has no backend, but it **must be hosted over HTTP** — the commands above do that. Don't open the files straight from disk (`file:///…/index.html`): the DOS shell loads, but games stay blank, because the emulators fetch their ROMs, disc images and WASM as the page loads and browsers block that for `file://` pages. Any static file host does the job — `GenX-DOS.sh`, `python3 -m http.server`, nginx, or whatever your host provides.

## Download

Every release ships a **[zip of the whole site](https://github.com/Retro-Jack/GenX-DOS/releases/latest)** — no clone, no build. Unzip it and run it:

- **Linux / macOS:** `./GenX-DOS.sh`
- **Windows:** double-click `GenX-DOS.bat`

Both start a local server and open the home page. (See **Quick start** above for why it has to be hosted over HTTP rather than opened from disk.)

## What you'll find in the repo

```
index.html                home page — intro, spec sheet, links, and the way into prompt/
GenX-DOS.sh / GenX-DOS.bat    local dev server (Linux / Windows), opens the home page
check-doc-counts.sh       checks the counts quoted in the docs still match the tree
CHANGELOG.md              release notes
ATTRIBUTION.md            canonical record of every bundled third-party asset
LICENSE.TXT               CC BY-NC 4.0 for the original work (third-party excluded)
SECURITY.md               scope + private vulnerability reporting
CONTRIBUTING.md           local setup + PR ground rules; CODE_OF_CONDUCT.md alongside
AI-DISCLAIMER.md          how AI was used building this, and what it did not decide
docs/                     feature article, self-hosted wiki, screenshots, social preview, fonts
  games/                  per-game instruction pages (docs/games/<platform>/<key>.html)
prompt/                   the DOS terminal (HTML + JS, no build)
  index.html
  javascript/             terminal logic + virtual filesystem (fs.js)
  img/                    bitmap font sprite sheets + AMIBIOS logo
systems/
  _shared/                shared CSS + helpers (NumLock warn, VICE RUN/STOP key remap, BBC COPY button, save-state, ...)
  _shared-ejs/            shared EmulatorJS framework + 4 VICE cores + gearcoleco + FCEUmm + Stella + gambatte + handy + genesis_plus_gx + prosystem
                          (14 bundles share one ~3 MB framework; saves ~25 MB vs per-bundle copies)
  apple1/                 Apple I             — apple1js + 10 cassette tapes
  bbcmicro/               BBC Micro           — jsbeeb Vite dist (Model B) + BBC disks
  bbcmaster/              BBC Master 128      — jsbeeb Vite dist (model=Master) + Master-enhanced disks
  electron/               Acorn Electron      — ElkJS + 6 UEF snapshots
  apple2/                 Apple ][+           — apple2js webpack dist + 10 .dsk images
  jsnes/                  NES                 — EmulatorJS + FCEUmm + 10 .nes ROMs
  stella/                 Atari 2600          — EmulatorJS + Stella (stella2014) + 10 .a26 ROMs
  gbc/                    Game Boy / GBC      — EmulatorJS + gambatte + 10 GB/GBC ROMs (handheld)
  lynx/                   Atari Lynx          — EmulatorJS + handy + boot ROM + 10 .lnx ROMs (handheld)
  gamegear/               Sega Game Gear      — EmulatorJS + genesis_plus_gx + 10 .gg ROMs (handheld)
  js7800/                 Atari 7800          — EmulatorJS + ProSystem + 10 .a78 carts
  msx1/                   MSX1                — WebMSX 6.0 (stock wmsx.js + wrapper) + 10 titles
  msx2/                   MSX2                — WebMSX 6.0 (stock wmsx.js + wrapper) + 10 titles
  sms/                    Sega Master System  — EmulatorJS + genesis_plus_gx + 10 .sms carts
  jsspeccy/               Sinclair Spectrum   — JSSpeccy 3.2 + 10 .z80 snapshots
  jtyone/                 Sinclair ZX81       — JtyOne + 10 .p tapes
  xroar/                  Tandy CoCo          — XRoar WASM + 10 .ccc carts
  trs80/                  Tandy TRS-80 Model I — sdltrs built from source to WASM + 10 .cmd games
  m100/                   Tandy Model 100     — VirtualT core extracted to WASM + 10 .ba games (portable)
  js99er/                 TI-99/4A            — vanilla-JS js99er + 10 .rpk carts
  atari400/               Atari 400           — atari800 WASM, boots OS-B
  atari800/               Atari 800XL         — atari800 WASM, boots OS-XL
  pet/                    Commodore PET       — Thomas Skibo's pet2001 (vanilla JS) + 10 .prg
  vic20/                  Commodore VIC-20    — EmulatorJS + VICE xvic + 10 cart .prg
  max/                    Commodore MAX       — EmulatorJS + VICE x64 in Ultimax mode + 10 .crt
  c64/                    Commodore 64        — EmulatorJS + VICE x64 + 10 .d64
  c16/                    Commodore 16        — EmulatorJS + VICE xplus4 C16 mode + 10 .prg
  plus4/                  Commodore Plus/4    — EmulatorJS + VICE xplus4 + 10 .prg
  c128/                   Commodore 128       — EmulatorJS + VICE x128 native mode + 10 titles
  coleco/                 ColecoVision        — EmulatorJS + gearcoleco + 10 launch-era .col carts
  intv/                   Mattel Intellivision — jzIntv WASM (custom loader) + 10 carts
  cpc/                    Amstrad CPC         — floooh tiny8bit CPC WASM + 10 .dsk titles
  odyssey2/               Magnavox Odyssey²   — libretro-o2em + custom SDL2 frontend + 10 carts
```

## Where the readable source is

The hand-written GenX-DOS code lives in `prompt/javascript/`, `systems/_shared/`, `systems/_shared-ejs/`, each emulator's `play.html` wrapper, and `systems/m100/src/` (the Model 100's headless VirtualT build units + recipe) — all formatted for reading.

Everything else under `systems/<name>/` is upstream: emscripten WASM glue (`xroar.js`, `atari800.js`, `o2em.js`, `jzintv.js`), webpack production bundles (`apple1.js`, `apple2/dist/*.bundle.js`, `jsspeccy.js`), the stock WebMSX engine (`msx1/wmsx.js`, `msx2/wmsx.js`), or hand-written JS from the upstream project (ElkJS, js99er's `emu/`). For the readable source of those, follow the upstream link in [ATTRIBUTION.md](ATTRIBUTION.md) or the per-engine integration story on the [wiki](https://github.com/Retro-Jack/GenX-DOS/wiki/Emulators).

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
| 7800      | EmulatorJS + ProSystem (prosystem core) | `play.html?game=<key>`                |
| MSX1 / MSX2 | ppeccin/WebMSX (split into `msx1/` + `msx2/` bundles) | `?ROM=games/<name>.zip&M=MSX1` \| `&M=MSX2` |
| Spectrum  | gasman/JSSpeccy 3                    | `play.html?game=<key>`                   |
| ZX81      | JtyOne                               | `play.html?game=<key>`                   |
| Tandy CoCo| Ciaran Anscomb/XRoar                 | `play.html?game=<key>`                   |
| TRS-80 Model I | jengun/sdltrs (our own WASM build) | `play.html?game=<key>`                |
| Model 100 | Hurd & Pettit/VirtualT (our own core-only WASM build) | `play.html?game=<key>`     |
| TI-99/4A  | Rasmus-M/js99er (vanilla-JS build)   | `play.html?game=<key>`                   |
| Atari 400 / 800XL | atari800/atari800 (our own WASM build; split into `atari400/` + `atari800/` bundles) | `play.html?game=<key>` |
| VIC-20 / MAX / C64 / C16 / Plus/4 / C128 | EmulatorJS + VICE libretro family | `play.html?game=<key>` |
| PET       | Thomas Skibo's pet2001 (vanilla JS)  | `play.html?game=<key>`                   |
| ColecoVision | EmulatorJS + gearcoleco (Drhelius) libretro | `play.html?game=<key>` |
| Intellivision | jzIntv (Joe Zbiciak) WASM, custom emscripten loader | `play.html?game=<key>` |
| Amstrad CPC   | floooh/chips-test tiny8bit CPC WASM (Andre Weissflog) | `play.html?game=<key>` (rewrites to `?file=&input=` for sokol_args) |
| Magnavox Odyssey² | libretro/libretro-o2em + custom SDL2/emscripten frontend | `play.html?game=<key>` |

ROMs are bundled locally — nothing is fetched at runtime.

The six VICE-family bundles (VIC-20, MAX, C64, C16, Plus/4, C128) share a unified input config (`keyboardInput` enabled + `vice_joyport_type='1'` Numpad) so typing and joystick coexist. Numpad 8/4/6/2 = joystick directions, 0/5 = fire, everything else types. Esc is browser-captured (exits pointer-lock/fullscreen) so we remap RUN/STOP to **Scroll Lock** + **Pause/Break** via `systems/_shared/genx-vice-softkeys.js` (RESTORE stays on the libretro default Page Up). The PET sits separately on Thomas Skibo's pet2001 (vanilla JS, BSD-2-Clause) — keyboard-only and unrelated to the VICE plumbing; see the wiki for the migration story.

The BBC bundles (jsbeeb) add a top-left **COPY** button via `systems/_shared/genx-bbc-copykey.js` — the BBC COPY key maps to the PC End key, which isn't obvious, so titles that use it (as an in-game "continue" or action key) get a click target. The TRS-80 Model I (sdltrs) likewise adds a **CLEAR** button via `systems/_shared/genx-trs80-softkeys.js`.

## USB gamepads

The EmulatorJS bundles read pads natively through the libretro cores. For standalone engines with no Gamepad API of their own, `systems/_shared/genx-gamepad-keys.js` polls pad 0 and synthesizes the keyboard events the engine already understands, driven by a per-game `window.GenXGamepadMap` (axes + button-index → key) defined in the bundle's play page — so each game's pad layout presses that game's own verified keys. The pad is gameplay-only — a game's title/start stays on the keyboard. Currently wired: Amstrad CPC, Acorn Electron, ZX Spectrum and the ZX81's action games (the ZX81 pages also filter out keys with no in-game function, since a stray Space is BREAK on that machine). Axis presses use hysteresis (on at 0.5, off at 0.3) so a hovering stick can't machine-gun key events, an idle pad sends nothing, and `?paddebug` on any wired play page shows a live log of what the shim is sending.

## Save / load state

Most bundles carry **save** / **load** controls in the bottom-left corner — each opens a drop-up menu of **five save slots per game**, an instant in-browser snapshot of the running machine kept in memory and persisted to **IndexedDB** (`gx-savestate`, keyed `platform:game:slot`) so the slots survive a reload. Because they're keyed per game, different games keep independent saves. The 14 EmulatorJS bundles use the libretro cores' own state API (`systems/_shared/genx-savestate.js`); the standalone engines that expose a reachable save-state — TI-99/4A, BBC Micro/Master (mid-game, even Elite), MSX, Tandy CoCo, Odyssey², Atari 400/800XL and Amstrad CPC — ride each emulator's native API through `systems/_shared/genx-savestate-std.js` + a small per-bundle `GenXStateAdapter`. Three needed a WASM rebuild to expose state the stock build hid: the **Odyssey²** (o2em — call libretro's dead-code-eliminated `retro_serialize`/`retro_unserialize`), the **Atari 400/800XL** (atari800 fork — `StateSav_*`, deferred through the frame loop to dodge an ASYNCIFY clash) and the **Amstrad CPC** (tiny8bit — export chips' `cpc_save_snapshot`/`cpc_load_snapshot`). The remaining engines (Apple, Electron, Spectrum, ZX81, Intellivision, PET) expose no reachable state API, so those bundles have no buttons. The TRS-80 Model I (sdltrs) ships a built-in save-state (`trs_state_save`/`trs_state_load`) that isn't wired to buttons yet — so no buttons there either, for now.

## Documentation

See the [wiki](https://github.com/Retro-Jack/GenX-DOS/wiki) for the long form. Each engine's integration story is its own page.

Prefer a narrative read? **[Booting a Museum in a Browser Tab](https://genx-dos.fun/docs/article/)** is a magazine-style feature on the project — the concept, the static/no-build constraint, the emulator war stories, and the curation philosophy.

- **[Project Overview](https://github.com/Retro-Jack/GenX-DOS/wiki/Project-Overview)** — what the site does and how it's structured
- **[Virtual Filesystem](https://github.com/Retro-Jack/GenX-DOS/wiki/Virtual-Filesystem)** — the simulated `C:` drive and menu layout
- **[Commands](https://github.com/Retro-Jack/GenX-DOS/wiki/Commands)** — the DOS commands the prompt understands
- **[Font System](https://github.com/Retro-Jack/GenX-DOS/wiki/Font-System)** — how we draw the 12×12 CP437 glyphs
- **[Emulators](https://github.com/Retro-Jack/GenX-DOS/wiki/Emulators)** — index of every engine, each with its own page
- **[Customising the Filesystem](https://github.com/Retro-Jack/GenX-DOS/wiki/Customising-the-Filesystem)** — adding entries, batches, menus
- **[Your Data](https://github.com/Retro-Jack/GenX-DOS/wiki/Your-Data)** — exactly what GenX-DOS keeps in your browser's local storage, and when (nothing leaves your machine)

## License

The full licence text is in **[LICENSE.TXT](LICENSE.TXT)**, and **[ATTRIBUTION.md](ATTRIBUTION.md)** is the canonical record of every bundled third-party component (source URLs, authors, BIOS/ROM provenance, bezel artwork licences, and BY-SA share-alike obligations). Summary below.

- DOS terminal, virtual filesystem, and 12×12 CP437 font sprite system by Mike, written informally for **LGR — Lazy Game Reviews** (Clint Basinger, <https://www.lazygamereviews.com>)
- AMIBIOS POST animation, emulator integration wrappers, menu tree, and bundled-emulator-specific code by Retro-Jack
- jsbeeb: GPL-3.0-or-later (mattgodbolt/jsbeeb)
- ElkJS: (c) Darren Coles 2013 (dmcoles/elkjs) — 6502 core ported from Elkulator by Tom Walker
- apple2js: MIT (whscullin/apple2js)
- FCEUmm: GPL-2.0 (libretro NES core) — mirrored from `cdn.emulatorjs.org/stable/`
- Stella: GPL-2.0 (`stella2014` libretro core, stella-emu) — Atari 2600; mirrored from `cdn.emulatorjs.org/stable/`
- ProSystem: GPL-2.0 (`prosystem` libretro core, stella-emu/libretro — Atari 7800) — mirrored from `cdn.emulatorjs.org/stable/`
- WebMSX: MIT (ppeccin/WebMSX, Paulo Peccin)
- JSSpeccy 3: GPL-3.0 (Matt Westcott / gasman)
- JtyOne: GPL-2.0 (Simon Holdsworth, port of Mike Wynne's EightyOne)
- XRoar: GPL-3.0+ (Ciaran Anscomb)
- sdltrs: BSD-2-Clause (Mark Grebe / Jens Guenther, gitlab.com/jengun/sdltrs) — TRS-80 Model I, built from source to WASM; Model I Level II BASIC ROM (©Tandy/Microsoft) embedded for emulation
- Js99'er: GPL-2.0 (Rasmus Moustgaard) — vanilla-JS build
- atari800: GPL-2.0+ (atari800/atari800 v5.2.0, built from source to WASM); AltirraOS-XL/800/BASIC (Avery Lee, freely redistributable open-source OS replacement) embedded inside `atari800.wasm` at build time via `--enable-altirra_bios` — no separate ROM file ships
- EmulatorJS: GPL-3.0 (EmulatorJS/EmulatorJS) — modern fork of emularity; shared across 14 bundles via `systems/_shared-ejs/` — the six VICE-family bundles, ColecoVision, NES, Atari 2600, Atari 7800, Sega Master System, and the three handhelds (Game Boy/GBC, Lynx, Game Gear)
- VICE: GPL-2.0 (vice-emu.sourceforge.net) — libretro cores (`x64`, `x128`, `xvic`, `xplus4`) mirrored from `cdn.emulatorjs.org/stable/`
- pet2001: BSD-2-Clause (Thomas Skibo) — vanilla-JS PET 2001 emulator at `systems/pet/pet2001/`
- gearcoleco: GPL-3.0 (Drhelius) — libretro ColecoVision core mirrored from `cdn.emulatorjs.org/stable/`
- ColecoVision BIOS: ©1982 Coleco, bundled for emulator-only use
- jzIntv: Joe Zbiciak (free-for-personal-use terms) — WASM build mirrored from [mholzinger/intellivision-overlay-editor](https://github.com/mholzinger/intellivision-overlay-editor)
- Intellivision EXEC + GROM BIOS: ©1979 Mattel Electronics, bundled for emulator-only use
- floooh/chips-test tiny8bit CPC WASM: MIT (Andre Weissflog) — locally rebuilt from source (overlays patched out + save-state wrappers; see `systems/cpc/BUILDING-WASM.md`)
- libretro-o2em: Artistic-2.0 (libretro/libretro-o2em, original o2em by Daniel Boris / Andre de la Rocha) — compiled from upstream source via `systems/odyssey2/build.sh`
- Magnavox Odyssey² BIOS (`o2rom.bin`): ©1978 Magnavox/Philips, bundled for emulator-only use

[![License: CC BY-NC 4.0](docs/badges/license-cc-by-nc-4.0.svg)](https://creativecommons.org/licenses/by-nc/4.0/)

The original orchestration code, menu trees, and AMIBIOS POST animations authored by Jack Horton are licensed under **Creative Commons Attribution-NonCommercial 4.0 International** — see **[LICENSE.TXT](LICENSE.TXT)** for the full terms.

Please note that GenX-DOS is a composite project containing bundled emulators, assets, and the LGR terminal base framework. These components are explicitly excluded from the CC license and remain bound by their original upstream terms. See [ATTRIBUTION.md](ATTRIBUTION.md) for full compliance details.
