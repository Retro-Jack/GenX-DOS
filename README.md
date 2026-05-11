# GenX-DOS

A browser DOS prompt that boots emulators from numbered menus, with bundled ROMs.

## Quick start

```sh
./serve.sh
```

Or directly:

```sh
python3 -m http.server 8765
```

Open <http://127.0.0.1:8765/prompt/>.

## Layout

```
index.html                fake BIOS POST screen, redirects to prompt/
serve.sh                  starts the local server
prompt/                   the DOS terminal (HTML + JS, no build)
  index.html
  javascript/             terminal logic + virtual filesystem (fs.js)
  img/                    bitmap font sprite sheets + AMIBIOS logo
emulators/
  jsbeeb/                 BBC Micro        — Vite-built dist + 10 .ssd discs
  archimedes-live/        Acorn Archimedes — Arculator WASM + 10 RISC OS titles
  jsnes/                  NES              — pure-JS bundle + 10 .nes ROMs
  genesis/                Sega Genesis     — Emscripten bundle + 10 .bin ROMs
  javatari/               Atari 2600       — pure-JS bundle + 10 .a26 ROMs
  js7800/                 Atari 7800       — pure-JS bundle + 10 .a78 carts
  jsdos/                  MS-DOS           — js-dos v7 + 20 .jsdos game bundles
  webmsx/                 MSX / MSX2 / MSX2+ — WebMSX single-file bundle + 10 MSX1 + 10 MSX2 titles
  jsvecx/                 GCE Vectrex      — JSVecX + ~100 commercial/homebrew ROMs
  estyjs/                 Atari ST         — EstyJS + EmuTOS + 10 .st disks
  jsspeccy/               Sinclair Spectrum — JSSpeccy 3.2 + 10 .z80 snapshots
  jtyone/                 Sinclair ZX81    — JtyOne + 10 .p tapes (hex format)
  xroar/                  Tandy CoCo       — XRoar WASM + 10 .ccc carts
```

## Self-hosted emulators

| System    | Copied from                          | URL pattern                              |
|-----------|--------------------------------------|------------------------------------------|
| BBC Micro | mattgodbolt/jsbeeb v1.12.0           | `?disc1=<path>.ssd&autoboot`             |
| Archimedes| pdjstone/archimedes-live             | `#disc=<catalogue-id>&autoboot`          |
| NES       | bfirsh/jsnes v2.1.0                  | `play.html?game=<key>`                   |
| Genesis   | lrusso/Genesis (PicoDrive port)      | `play.html?game=<key>`                   |
| 2600      | ppeccin/javatari.js v5.0.4           | `play.html?game=<key>`                   |
| 7800      | raz0red/JS7800 v0.0.9                | `play.html?game=<key>`                   |
| MS-DOS    | caiiiycuk/js-dos v7.0.0              | `play.html?game=<key>`                   |
| MSX       | ppeccin/WebMSX                       | `?ROM=games/<sub>/<name>.zip[&M=MSX1]`   |
| Vectrex   | DrSnuggles/jsvecx (raz0red)          | `index.html?rom=<dir>/<title>` (never `seamless.html`) |
| Atari ST  | kaiec/EstyJS 2.0 + EmuTOS            | `play.html?game=<key>`                   |
| Spectrum  | gasman/JSSpeccy 3 v3.2               | `play.html?game=<key>`                   |
| ZX81      | hammingweight/JtyOne                 | `play.html?game=<key>`                   |
| Tandy CoCo| Ciaran Anscomb/XRoar v1.10           | `play.html?game=<key>`                   |

ROMs are bundled locally — nothing is fetched at runtime.

## Documentation

See the [wiki](https://github.com/Retro-Jack/GenX-DOS/wiki):

- **Project Overview** — what the site does and how it's structured
- **Virtual Filesystem** — the simulated `C:` drive and menu layout
- **Commands** — the DOS commands the prompt understands
- **Font System** — the 12×12 CP437 bitmap renderer
- **Emulators** — the integration recipe and gotchas
- **Customising the Filesystem** — adding entries, batches, menus

## License

- Site code by Retro-Jack
- jsbeeb: GPL-3.0-or-later (mattgodbolt/jsbeeb)
- archimedes-live: MIT (pdjstone/archimedes-live, WASM port of Sarah Walker's Arculator)
- JSNES: Apache-2.0 (bfirsh/jsnes)
- Genesis (lrusso): GPL-2.0 (notaz/PicoDrive port)
- Javatari: AGPL-3.0 (ppeccin/javatari.js)
- JS7800: GPL-2.0 (raz0red)
- js-dos: GPL-2.0 (caiiiycuk/js-dos v7.0.0)
- WebMSX: MIT (ppeccin/WebMSX) — same author as Javatari
- JSVecX: GPL-3.0 (raz0red, fork by DrSnuggles — JS port of Valavan Manohararajah's VecX C source)
- EstyJS: GPL-2.0+ (Kai Eckert / Darren Coles); EmuTOS: GPL-2.0+ (open-source TOS reimplementation)
- JSSpeccy 3: GPL-3.0 (Matt Westcott / gasman)
- JtyOne: GPL-2.0 (Simon Holdsworth, port of Mike Wynne's EightyOne)
- XRoar: GPL-3.0+ (Ciaran Anscomb)
