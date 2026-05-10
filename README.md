# GenX-DOS

A browser DOS prompt that boots emulators from numbered menus, with bundled ROMs.

## Quick start

```sh
python3 -m http.server 8765
```

Open <http://127.0.0.1:8765/prompt/>.

## Layout

```
index.html                fake BIOS POST screen, redirects to prompt/
prompt/                   the DOS terminal (HTML + JS, no build)
  index.html
  javascript/             terminal logic + virtual filesystem (fs.js)
  img/                    bitmap font sprite sheets
emulators/
  jsbeeb/                 BBC Micro      — Vite-built dist + 10 .ssd discs
  jsnes/                  NES            — pure-JS bundle + 10 .nes ROMs
  genesis/                Sega Genesis   — Emscripten bundle + 10 .bin ROMs
  javatari/               Atari 2600     — pure-JS bundle + 10 .a26 ROMs
  jsdos/                  MS-DOS         — js-dos v7 + 10 .jsdos game bundles
  archimedes-live/        Acorn Archimedes — Arculator WASM + 10 RISC OS titles
  webmsx/                 MSX/MSX2/MSX2+ — WebMSX single-file bundle + 10 MSX1 + 10 MSX2 titles
  jsvecx/                 GCE/Smith Engineering Vectrex — JSVecX + ~100 commercial/homebrew ROMs
```

## Self-hosted emulators

| System    | Copied from                     | URL pattern                              |
|-----------|---------------------------------|------------------------------------------|
| BBC Micro | mattgodbolt/jsbeeb v1.12.0      | `?disc1=<path>.ssd&autoboot`             |
| NES       | bfirsh/jsnes v2.1.0             | `play.html?game=<key>`                   |
| Genesis   | lrusso/Genesis (PicoDrive port) | `play.html?game=<key>`                   |
| 2600      | ppeccin/javatari.js v5.0.4      | `play.html?game=<key>`                   |
| MS-DOS    | caiiiycuk/js-dos v7.0.0         | `play.html?game=<key>`                   |
| Archimedes| pdjstone/archimedes-live        | `#disc=<catalogue-id>&autoboot`          |
| MSX       | ppeccin/WebMSX                  | `?ROM=games/<name>.zip`                  |
| Vectrex   | DrSnuggles/jsvecx (raz0red)     | `?rom=<dir>/<title>` (use index.html, NOT seamless.html — that one is iframe-only) |

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
- JSNES: Apache-2.0 (bfirsh/jsnes)
- Genesis (lrusso): GPL-2.0 (notaz/PicoDrive port)
- Javatari: AGPL-3.0 (ppeccin/javatari.js)
- js-dos: GPL-2.0 (caiiiycuk/js-dos v7.0.0)
- Archimedes Live: MIT (pdjstone/archimedes-live, WASM port of Sarah Walker's Arculator)
- WebMSX: MIT (ppeccin/WebMSX) — same author as Javatari
- JSVecX: GPL-3.0 (raz0red, fork by DrSnuggles — JS port of Valavan Manohararajah's VecX C source)
