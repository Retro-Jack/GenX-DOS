# Attribution

GenX-DOS bundles emulators, system ROMs, game ROMs, and visual assets sourced
from third parties. This file is the canonical record of where each piece came
from and under what terms it is redistributed.

It is maintained alongside [CHANGELOG.md](CHANGELOG.md): whenever a new
emulator, BIOS, ROM, bezel, font, or other asset is added or replaced, an
entry is added here.

The summary list in [README.md](README.md) is a quick-reference; this file is
the authoritative version.

---

## Site code

- **GenX-DOS** — © Retro-Jack. The terminal, virtual filesystem, font sprite
  system, AMIBIOS POST animation, and integration wrappers around bundled
  emulators are original site code. No licence file in repo; treated as
  source-available for personal/educational use.

---

## Emulators

Each bundle directory contains the upstream `LICENSE` or `COPYING` file where
one was provided. Build recipes for self-compiled WASM bundles
(`emulators/atari800/build-wasm.sh`, `emulators/odyssey2/build.sh`) live in
the corresponding emulator folder.

| Bundle directory | Upstream project | Author(s) | Licence |
| --- | --- | --- | --- |
| `emulators/apple1/` | apple1js | whscullin | MIT |
| `emulators/apple2/` | apple2js | whscullin | MIT |
| `emulators/jsbeeb/` | jsbeeb | Matt Godbolt | GPL-3.0-or-later |
| `emulators/electron/` | ElkJS | Darren Coles (6502 core ported from Tom Walker's Elkulator) | © Darren Coles 2013 (no SPDX header in source) |
| `emulators/jsnes/` | EmulatorJS + FCEUmm libretro core | EmulatorJS team; libretro/libretro-fceumm | GPL-3.0 (EmulatorJS), GPL-2.0 (FCEUmm) |
| `emulators/javatari/` | Javatari.js | Paulo Peccin | AGPL-3.0 |
| `emulators/js7800/` | JS7800 | raz0red | GPL-2.0 |
| `emulators/jsvecx/` | JSVecX (fork of raz0red's port of Valavan Manohararajah's VecX) | DrSnuggles | GPL-3.0 |
| `emulators/jsdos/` | js-dos v7.0.0 | caiiiycuk | GPL-2.0 |
| `emulators/webmsx/` | WebMSX | Paulo Peccin | MIT |
| `emulators/jsspeccy/` | JSSpeccy 3.2 | Matt Westcott (gasman) | GPL-3.0 |
| `emulators/jtyone/` | JtyOne (port of Mike Wynne's EightyOne) | Simon Holdsworth | GPL-2.0 |
| `emulators/xroar/` | XRoar (WASM) | Ciaran Anscomb | GPL-3.0-or-later |
| `emulators/atari800/` | atari800 v5.2.0, built from source to WASM | atari800 project | GPL-2.0+ |
| `emulators/atari800/` | AltirraOS-XL 3.41 (replacement BIOS bundled in `roms/`) | Avery Lee | Freely-redistributable open-source OS replacement (see upstream `Altirra-AdditionalLicense.txt`) |
| `emulators/intellivision/` | jzIntv (WASM build) | Joe Zbiciak | Free for personal/non-commercial use. WASM build mirrored from [mholzinger/intellivision-overlay-editor](https://github.com/mholzinger/intellivision-overlay-editor) |
| `emulators/odyssey2/` | libretro-o2em, custom SDL2/emscripten frontend | original o2em by Daniel Boris + Andre de la Rocha; libretro fork by libretro authors; frontend by Retro-Jack | GPL-2.0+ (libretro-o2em); frontend bundled under repo terms |
| `emulators/amstradcpc/` | floooh's tiny8bit CPC WASM | Andre Weissflog | MIT |
| `emulators/_shared-ejs/` | EmulatorJS framework | EmulatorJS team | GPL-3.0 |
| `emulators/_shared-ejs/cores/` | VICE libretro cores (`x64`, `x128`, `xvic`, `xplus4`, `xpet`) | vice-emu.sourceforge.net | GPL-2.0 |
| `emulators/_shared-ejs/cores/` | gearcoleco libretro core (ColecoVision) | Drhelius | GPL-3.0 |

### How the cores are mirrored

EmulatorJS-flavoured libretro cores (FCEUmm, VICE family, gearcoleco) are
mirrored from `cdn.emulatorjs.org/stable/` rather than rebuilt locally. The
upstream CDN serves the same `.data` archives EmulatorJS itself loads from.

### Self-compiled WASM builds

- **atari800** — built from `atari800/atari800` v5.2.0 source via
  [`Retro-Jack/atari800`](https://github.com/Retro-Jack/atari800) fork
  (adds `build-wasm.sh` + `BUILDING-WASM.md` on top of upstream). The
  pre-built `.js` + `.wasm` in this repo correspond to that build script.
- **libretro-o2em** — built from upstream libretro/libretro-o2em via
  `emulators/odyssey2/build.sh`. Custom SDL2/emscripten frontend
  (`frontend.c`) statically linked with the libretro core; reproducible
  with emsdk.

---

## BIOS and system ROMs

Bundled for emulator-only use. These remain the property of their
copyright holders.

| File | System | Copyright |
| --- | --- | --- |
| `emulators/_shared-ejs/cores/coleco.bios` | ColecoVision | © 1982 Coleco Industries |
| `emulators/intellivision/roms/exec.bin`, `grom.bin` | Intellivision EXEC + GROM | © 1979 Mattel Electronics |
| `emulators/odyssey2/roms/o2rom.bin` | Magnavox Odyssey² (MD5 562d5ebf…) | © 1978 Magnavox/Philips. Sourced from the BizHawk firmware archive. |
| `emulators/atari800/roms/altirraos_xl.rom` | AltirraOS-XL (Atari XL OS replacement) | Avery Lee — freely redistributable open-source OS replacement, NOT the original Atari ROM |
| `emulators/atari800/roms/altirraos_800.rom` | AltirraOS-800 (Atari 400/800 OS replacement) | Avery Lee — freely redistributable open-source OS replacement |

---

## Game ROMs

The repo bundles several hundred 8-bit-era game ROMs across all platforms.
These remain the copyright of their original publishers and are included
for historical preservation, emulator integration, and educational use.

Notable inclusions where the rights holder has explicitly released the
software under permissive terms:

- **Apple I cassette tapes** — Integer BASIC era homebrew + Apple's own
  30th Anniversary demo by Brian Wiser. Sourced from the
  [Apple I Project](https://www.applefritter.com/apple1) archive.
- **AltirraOS-800 / -XL** (counted under BIOS, above) — Avery Lee's
  free re-implementation of Atari OS-B / OS-XL.
- **PETSCII Robots Shareware** — David Murray ("The 8-Bit Guy"), 2022.
  Free demo build distributed via [the8bitguy.com](https://the8bitguy.com).
- **3D Construction Kit demos and indie homebrew** across various
  platforms — license varies; check the per-bundle `games.json` or
  source archive when in doubt.

For every other commercial title, redistribution within this repo is on a
preservation / personal-use basis. If you are a rights holder and want a
title removed, open an issue at
<https://github.com/Retro-Jack/GenX-DOS/issues>.

---

## Bezel artwork

`emulators/_shared/bezels/` contains transparent PNG monitor frames for
the upcoming bezel-overlay integration. **Currently staging-only — not
yet wired into emulator pages.** Each bezel's source and licence must
display credit lines when the bezel goes live in `play.html`.

| File | Source | Author | Licence | Notes |
| --- | --- | --- | --- | --- |
| `Amstrad.png` | [File:Amstrad_CPC464.jpg](https://commons.wikimedia.org/wiki/File:Amstrad_CPC464.jpg) (Wikimedia Commons) | Bill Bertram (Wikimedia username Pixel8) — 7 May 2005 | CC-BY-SA 2.5 | Background alpha'd in GIMP from the original white-background product photo. Modifications inherit share-alike. |
| `70s.png` | OBS asset library `/mnt/multimedia/Assets/OBS/Bezels/` | TBD | TBD | Source pending verification before going live |
| `80s.png` | OBS asset library | TBD | TBD | Source pending verification |
| `Acorn.png` | OBS asset library | TBD | TBD | Source pending verification |
| `Apple.png` | OBS asset library | TBD | TBD | Source pending verification |
| `Commodore.png` | OBS asset library | TBD | TBD | Source pending verification |
| `PC.png` | OBS asset library | TBD | TBD | Source pending verification |
| `Sinclair.png` | OBS asset library | TBD | TBD | Source pending verification |
| `Vectrex.png` | OBS asset library | TBD | TBD | Source pending verification |

The TBD rows above predate the introduction of this file and need their
provenance confirmed before the bezel integration pass — that pass cannot
ship with unattributed CC-BY-SA / CC-BY material. Resolving each TBD is a
prerequisite for wiring the bezel into the corresponding emulator page.

---

## Fonts

- `prompt/img/f12.*.png` — 12×12 CP437 bitmap font sprites. Generated
  locally by `make_fonts.py` from Unicode CP437 mappings; the rendered
  glyph shapes derive from public-domain VGA CP437 reference data.

---

## CSS / JS dependencies bundled per-emulator

- `emulators/electron/javascript/jquery-1.7.2.min.js` — jQuery 1.7.2,
  MIT — required by ElkJS upstream. Kept as-is to avoid divergence
  from the ElkJS source.

Other emulator bundles use vendored copies of their upstream dependencies
without modification; the upstream `LICENSE` / `COPYING` files in each
bundle directory cover those.

---

## How to add a new attribution entry

When adding code or assets to the repo:

1. Identify the upstream source and licence. If the licence is unclear,
   ask before bundling.
2. Place the upstream `LICENSE` / `COPYING` file in the bundle directory
   alongside the binary or source it covers.
3. Add a row to the relevant table above.
4. Add a parallel entry in `CHANGELOG.md` under `## [Unreleased]`.
5. If the licence is one of the BY-SA family, note in the table that
   modifications inherit share-alike — this affects what we can do with
   derived work.
