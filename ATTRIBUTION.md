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

- **DOS terminal, virtual filesystem, and 12×12 CP437 font sprite system**
  — Mike @ **LGR — Lazy Game Reviews** (<https://www.lazygamereviews.com>).
  The interactive prompt under `prompt/`, the `fs.js` virtual `C:` drive
  layout, the command dispatcher, and the CP437 sprite font and renderer
  originate from LGR's DOS-prompt project. GenX-DOS extends that base.
- **AMIBIOS POST animation, emulator integration wrappers, menu tree,
  and all bundled-emulator-specific code** — © Retro-Jack. Original work
  added on top of the LGR terminal base.
- No licence file in repo; treated as source-available for
  personal/educational use. Credit the LGR base in any derivative work.

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
| `emulators/webmsx/` | WebMSX | Paulo Peccin | MIT |
| `emulators/jsspeccy/` | JSSpeccy 3.2 | Matt Westcott (gasman) | GPL-3.0 |
| `emulators/jtyone/` | JtyOne (port of Mike Wynne's EightyOne) | Simon Holdsworth | GPL-2.0 |
| `emulators/xroar/` | XRoar (WASM) | Ciaran Anscomb | GPL-3.0-or-later |
| `emulators/js99er/` | Js99'er (vanilla-JS build) | Rasmus Moustgaard | GPL-2.0 |
| `emulators/js99er/carts/*.rpk` | TI-99/4A cartridge ROMs (10 commercial titles, 1980-1983) | Texas Instruments / Imagic / Sega — original publishers | Distributed for retro-preservation; carts are 40+ years out of commerce. Mirrored from the js99er.net public cart archive (Rasmus Moustgaard). |
| `emulators/atari800/` | atari800 v5.2.0, built from source to WASM | atari800 project | GPL-2.0+ |
| `emulators/atari800/atari800.wasm` (embedded) | AltirraOS-XL 3.41 + AltirraOS-800 + AltirraBASIC | Avery Lee | Freely-redistributable open-source OS replacement, compiled into the WASM via `--enable-altirra_bios` (no separate ROM file ships) |
| `emulators/intellivision/` | jzIntv (WASM build) | Joe Zbiciak | Free for personal/non-commercial use. WASM build mirrored from [mholzinger/intellivision-overlay-editor](https://github.com/mholzinger/intellivision-overlay-editor) |
| `emulators/odyssey2/` | libretro-o2em, custom SDL2/emscripten frontend | original o2em by Daniel Boris + Andre de la Rocha; libretro fork by libretro authors; frontend by Retro-Jack | GPL-2.0+ (libretro-o2em); frontend bundled under repo terms |
| `emulators/amstradcpc/` | floooh's tiny8bit CPC WASM | Andre Weissflog | MIT |
| `emulators/pet/pet2001/` | pet2001 (vanilla-JS PET 2001 emulator) | Thomas Skibo | BSD-2-Clause |
| `emulators/_shared-ejs/` | EmulatorJS framework | EmulatorJS team | GPL-3.0 |
| `emulators/_shared-ejs/ejs/data/cores/` | VICE libretro cores (`x64`, `x128`, `xvic`, `xplus4`) | vice-emu.sourceforge.net | GPL-2.0 |
| `emulators/_shared-ejs/ejs/data/cores/` | gearcoleco libretro core (ColecoVision) | Drhelius | GPL-3.0 |
| `emulators/_shared-ejs/ejs/data/cores/` | FCEUmm libretro core (NES) | libretro/libretro-fceumm | GPL-2.0 |

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
| `emulators/coleco/colecovision.rom` | ColecoVision | © 1982 Coleco Industries |
| `emulators/intellivision/roms/exec.bin`, `grom.bin` | Intellivision EXEC + GROM | © 1979 Mattel Electronics |
| `emulators/odyssey2/roms/o2rom.bin` | Magnavox Odyssey² (MD5 562d5ebf…) | © 1978 Magnavox/Philips. Sourced from the BizHawk firmware archive. |

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
  Shipped under the Commodore 64 sub-system only (`emulators/c64/`).
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
the bezel-overlay integration. **`PC.png` is wired into the DOS prompt
page (`prompt/index.html`) as of 09/06/2026; the other eight bezels are
still staging for the per-emulator integration pass.** Each bezel's
source and licence must display credit lines when the bezel goes live
in the rest of `play.html`.

| File | Hardware identified | Verified source | Author | Licence | Integration risk |
| --- | --- | --- | --- | --- | --- |
| `Amstrad.png` | Amstrad CTM640 monitor + CPC464 keyboard | [File:Amstrad_CPC464.jpg](https://commons.wikimedia.org/wiki/File:Amstrad_CPC464.jpg) (Wikimedia Commons) | Bill Bertram (Wikimedia username Pixel8) — 7 May 2005 | CC-BY-SA 2.5 | ✅ Cleared. Modifications inherit share-alike. Background alpha'd in GIMP from the original white-background product photo. |
| `70s.png` | HMV-branded wood-cabinet console TV (probable Albany / M1-A5 family) | Unverified — reposted via Reddit / retro forums; original photographer unknown | Unknown | Unverified | ⚠️ Stock-photo or collector-site original; medium risk if commercial product photography |
| `80s.png` | Generic solid-state portable TV (dial + channel buttons) | Unverified — Reddit / retro forums | Unknown | Unverified | ⚠️ Lower risk (generic anonymous hardware) but still unattributed |
| `Acorn.png` | Microvitec CUB monitor (brown bezel, "Microvitec CUB" colour logo, red LED) | Unverified — Reddit / retro forums. Microvitec CUBs are extensively documented at [stardot.org.uk](https://stardot.org.uk) and [retrorepairsandrefurbs.com](https://retrorepairsandrefurbs.com); no Wikimedia Commons match found | Unknown | Unverified | ⚠️ Likely a collector / restoration site photo; medium risk |
| `Apple.png` | Apple Monitor /// ("monitor ///" badge) | Unverified — Reddit / retro forums. Wikimedia Commons has [Apple3.jpg](https://commons.wikimedia.org/wiki/File:Apple3.jpg) (CC-BY-SA 3.0 / GFDL, Alexander Schaelss 2004) but it's lower-res and a different composition | Unknown | Unverified | ⚠️ Replaceable with the Schaelss Commons photo if needed |
| `Commodore.png` | Commodore 1084S (specifically — "1084S" badge, not "1084") | Unverified — Reddit / retro forums. Wikimedia Commons has [Commodore1084_first_version_front.jpg](https://commons.wikimedia.org/wiki/File:Commodore1084_first_version_front.jpg) (CC-BY-SA 4.0, Gestumblindi 2021) for the 1084 first-version, but not this 1084S variant | Unknown | Unverified | ⚠️ Replaceable with the Gestumblindi 1084 if the model swap is acceptable |
| `PC.png` | IBM 5153 CGA colour monitor (3 knobs, IBM badge top-right, green power LED) — originally staged as `IBM 5153 CGA.png` | Unverified — Reddit / retro forums. Wikimedia Commons has only the 5151 monochrome ([File:5151_monochrome_monitor.jpg](https://commons.wikimedia.org/wiki/File:5151_monochrome_monitor.jpg), CC-BY-SA 2.0 steverenouk), not the 5153 colour variant we have | Unknown | Unverified | ⚠️ The 5153 colour is the period-correct match for our DOS bundle but no verified Commons source found |
| `Sinclair.png` | Generic 80s portable colour TV with side-speaker panel — historically accurate (Spectrum/ZX81 era used household TVs, no Sinclair-branded monitor existed) | Unverified — Reddit / retro forums | Unknown | Unverified | ⚠️ Lower risk (generic anonymous hardware) |
| `Vectrex.png` | GCE Vectrex console front view, dark cabinet on wooden surface | Unverified — Reddit / retro forums. Art style suggests it *may* be a CGI render rather than a photograph (user supposition, not confirmed) — community 3D models do circulate for emulation overlays | Unknown | Unverified | ⚠️ Either a photo or a render; in both cases the original artist isn't reachable from the Reddit/forum repost. Replaceable with a Wikipedia Vectrex photo if needed |

### Provenance trail and integration plan

Per [[user notes 06/06/2026]], all eight unverified bezels above were sourced from **Reddit posts and retro-computing forums** between approximately 2024 and 2026. Reddit / forum reposts strip EXIF and break the attribution chain — the original photographer or rights holder for each is no longer reachable from the current artefact. GIMP processing (alpha-keying, cleanup) was applied locally and is recorded in PNG `Comment: Created with GIMP` metadata for most of them.

**Two paths to clear the integration blocker before wiring bezels into emulator pages:**

1. **Replace with verified Commons sources** where one exists. Best candidates today:
   - `Commodore.png` → Gestumblindi's 1084 (CC-BY-SA 4.0) — accept the 1084 vs 1084S variant swap
   - `Apple.png` → Schaelss's Apple3.jpg (CC-BY-SA 3.0) — accept the lower resolution
   - `PC.png` → would need IBM 5153 (CGA colour) Commons source — none currently identified; would either swap to the 5151 monochrome or keep the unverified 5153
   - `Acorn.png` → no Commons CUB found; would need a new source hunt
   - `Amstrad.png` → already done (CC-BY-SA 2.5)

2. **Keep as-is, accept the risk**, and add a generic "bezel artwork sourced from public web archives, original photographers unknown — please open an issue if you recognise your work" credit line on the integration footer. Lower friction but DMCA-exposed if a rights holder objects.

Recommended for the branded monitors (Acorn/Apple/Commodore/PC): option 1. Recommended for the generic TVs (70s/80s/Sinclair/Vectrex): option 2 is defensible since these are anonymous hardware shots with no obvious commercial-photography fingerprint.

The remaining per-emulator integration pass should not ship without one of these resolutions for each row.

---

## Fonts

- `prompt/img/f12.*.png` — 12×12 CP437 bitmap font sprites. Generated
  locally by `make_fonts.py` from Unicode CP437 mappings; the rendered
  glyph shapes derive from public-domain VGA CP437 reference data.

---

## CSS / JS dependencies bundled per-emulator

- `emulators/electron/jquery/jquery-1.9.1.js` + `jquery-ui-1.10.3.custom.min.js` —
  jQuery 1.9.1 and jQuery UI 1.10.3 custom build, MIT — required by ElkJS
  upstream. Kept as-is to avoid divergence from the ElkJS source.

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
