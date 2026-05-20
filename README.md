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
  _shared/                shared CSS for controls.html + corner-link styles + NumLock warning JS + RUN/STOP softkey
  _shared-ejs/            shared EmulatorJS framework + 5 VICE cores + gearcoleco core (saves ~13 MB vs per-bundle copies)
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
  atari800/               Atari 400 + 800XL — atari800 v5.2.0 built to WASM + AltirraOS + 10 disk/cart titles per sub-system
  pet/                    Commodore PET    — EmulatorJS + VICE xpet + 9 .prg classics + PETSCII Robots .d64
  vic20/                  Commodore VIC-20 — EmulatorJS + VICE xvic + 10 cart .prg
  max/                    Commodore MAX    — EmulatorJS + VICE x64 Ultimax mode + 8 .crt carts + MAX BASIC
  c64/                    Commodore 64     — EmulatorJS + VICE x64 + 10 .d64 disk images
  c16/                    Commodore 16     — EmulatorJS + VICE xplus4 C16 mode + 10 .prg C16-16K titles
  plus4/                  Commodore Plus/4 — EmulatorJS + VICE xplus4 + 10 .prg titles
  c128/                   Commodore 128    — EmulatorJS + VICE x128 native mode + 10 mixed commercial/homebrew titles (VICII 40-col + VDC 80-col)
  coleco/                 ColecoVision     — EmulatorJS + gearcoleco core + 10 launch-era .col carts
  intellivision/          Mattel Intellivision — jzIntv WASM (custom loader, not EJS) + 10 first-in-series classics
```

## Emulators

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
| Atari 400 / 800XL | atari800/atari800 v5.2.0 (own WASM build) | `play.html?game=<key>[&machine=…]` |
| PET / VIC-20 / MAX / C64 / C16 / Plus/4 / C128 | EmulatorJS + VICE libretro (xpet / xvic / x64 / xplus4 / x128) | `play.html?game=<key>` |
| ColecoVision | EmulatorJS + gearcoleco (Drhelius) libretro | `play.html?game=<key>` |
| Intellivision | jzIntv (Joe Zbiciak) WASM, custom emscripten loader | `play.html?game=<key>` |

ROMs are bundled locally — nothing is fetched at runtime.

The seven VICE-family bundles ship a unified input config (`keyboardInput` enabled + `vice_joyport_type='1'` Numpad for the six with a joystick port) so typing and joystick coexist. Numpad 8/4/6/2 = joystick directions, 0/5 = fire, everything else types. The PET has no joystick — keyboard-only. Esc is browser-captured (exits pointer-lock/fullscreen) so the bundles remap RUN/STOP to **Scroll Lock** + **Pause/Break** + a top-left clickable button via `emulators/_shared/genx-vice-softkeys.js`.

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
- atari800: GPL-2.0+ (atari800/atari800 v5.2.0, built from source to WASM); AltirraOS-XL 3.41 bundled (Avery Lee, freely redistributable open-source OS replacement)
- EmulatorJS: GPL-3.0 (EmulatorJS/EmulatorJS) — modern fork of emularity; shared across the seven VICE-family bundles and ColecoVision via `emulators/_shared-ejs/`
- VICE: GPL-2.0 (vice-emu.sourceforge.net) — libretro cores (`x64`, `x128`, `xvic`, `xplus4`, `xpet`) mirrored from `cdn.emulatorjs.org/stable/`
- gearcoleco: GPL-3.0 (Drhelius) — libretro ColecoVision core mirrored from `cdn.emulatorjs.org/stable/`
- ColecoVision BIOS: ©1982 Coleco, bundled for emulator-only use
- jzIntv: Joe Zbiciak (free-for-personal-use terms) — WASM build mirrored from [mholzinger/intellivision-overlay-editor](https://github.com/mholzinger/intellivision-overlay-editor)
- Intellivision EXEC + GROM BIOS: ©1979 Mattel Electronics, bundled for emulator-only use
- PETSCII Robots Shareware: David Murray / The 8-Bit Guy (2022, free demo build distributed via the8bitguy.com)
