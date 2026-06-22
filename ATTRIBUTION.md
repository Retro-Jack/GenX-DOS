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
one was provided. Build recipes for self-compiled WASM bundles live with their
bundle (`systems/odyssey2/build.sh`, `systems/cpc/BUILDING-WASM.md`); atari800's
`build-wasm.sh` lives in the [`Retro-Jack/atari800`](https://github.com/Retro-Jack/atari800)
fork rather than the bundle.

| Bundle directory | Upstream project | Author(s) | Licence |
| --- | --- | --- | --- |
| `systems/apple1/` | apple1js | whscullin | MIT |
| `systems/apple2/` | apple2js | whscullin | MIT |
| `systems/jsbeeb/` | jsbeeb | Matt Godbolt | GPL-3.0-or-later |
| `systems/electron/` | ElkJS | Darren Coles (6502 core ported from Tom Walker's Elkulator) | © Darren Coles 2013 (no SPDX header in source) |
| `systems/jsnes/` | EmulatorJS + FCEUmm libretro core | EmulatorJS team; libretro/libretro-fceumm | GPL-3.0 (EmulatorJS), GPL-2.0 (FCEUmm) |
| `systems/stella/` | EmulatorJS + Stella (`stella2014`) libretro core | EmulatorJS team; stella-emu / libretro | GPL-3.0 (EmulatorJS), GPL-2.0 (Stella) |
| `systems/js7800/` | EmulatorJS + ProSystem (`prosystem`) libretro core | EmulatorJS team; libretro/prosystem | GPL-3.0 (EmulatorJS), GPL-2.0 (ProSystem) |
| `systems/jsvecx/` | JSVecX (fork of raz0red's port of Valavan Manohararajah's VecX) | DrSnuggles | GPL-3.0 |
| `systems/webmsx/` | WebMSX | Paulo Peccin | MIT |
| `systems/jsspeccy/` | JSSpeccy 3.2 | Matt Westcott (gasman) | GPL-3.0 |
| `systems/jtyone/` | JtyOne (port of Mike Wynne's EightyOne) | Simon Holdsworth | GPL-2.0 |
| `systems/xroar/` | XRoar (WASM) | Ciaran Anscomb | GPL-3.0-or-later |
| `systems/trs80/` | sdltrs (SDL2 TRS-80 emulator), built from source to WASM | Mark Grebe / Jens Guenther (gitlab.com/jengun/sdltrs) | BSD-2-Clause |
| `systems/trs80/sdltrs.wasm` (embedded) | TRS-80 Model I Level II BASIC ROM (12 KB) | © Tandy / Microsoft | Bundled for emulator-only use; embedded into the WASM at build time via `--embed-file` (no separate ROM file ships) |
| `systems/js99er/` | Js99'er (vanilla-JS build) | Rasmus Moustgaard | GPL-2.0 |
| `systems/js99er/carts/*.rpk` | TI-99/4A cartridge ROMs (10 commercial titles, 1980-1983) | Texas Instruments / Imagic / Sega — original publishers | Distributed for retro-preservation; carts are 40+ years out of commerce. Mirrored from the js99er.net public cart archive (Rasmus Moustgaard). |
| `systems/atari800/` | atari800 v5.2.0, built from source to WASM | atari800 project | GPL-2.0+ |
| `systems/atari800/atari800.wasm` (embedded) | AltirraOS-XL 3.41 + AltirraOS-800 + AltirraBASIC | Avery Lee | Freely-redistributable open-source OS replacement, compiled into the WASM via `--enable-altirra_bios` (no separate ROM file ships) |
| `systems/intv/` | jzIntv (WASM build) | Joe Zbiciak | Free for personal/non-commercial use. WASM build mirrored from [mholzinger/intellivision-overlay-editor](https://github.com/mholzinger/intellivision-overlay-editor) |
| `systems/odyssey2/` | libretro-o2em, custom SDL2/emscripten frontend | original o2em by Daniel Boris + Andre de la Rocha; libretro fork by libretro authors; frontend by Retro-Jack | GPL-2.0+ (libretro-o2em); frontend bundled under repo terms |
| `systems/cpc/` | floooh's tiny8bit CPC WASM — locally rebuilt from `floooh/chips-test` (status bar + muted-speaker icon patched out, plus `gx_state_*` save-state wrappers; see `systems/cpc/BUILDING-WASM.md`) | Andre Weissflog | MIT |
| `systems/pet/pet2001/` | pet2001 (vanilla-JS PET 2001 emulator) | Thomas Skibo | BSD-2-Clause |
| `systems/_shared-ejs/` | EmulatorJS framework | EmulatorJS team | GPL-3.0 |
| `systems/_shared-ejs/ejs/data/cores/` | VICE libretro cores (`x64`, `x128`, `xvic`, `xplus4`) | vice-emu.sourceforge.net | GPL-2.0 |
| `systems/_shared-ejs/ejs/data/cores/` | gearcoleco libretro core (ColecoVision) | Drhelius | GPL-3.0 |
| `systems/_shared-ejs/ejs/data/cores/` | FCEUmm libretro core (NES) | libretro/libretro-fceumm | GPL-2.0 |
| `systems/_shared-ejs/ejs/data/cores/` | Stella libretro core (`stella2014`, Atari 2600) | stella-emu / libretro | GPL-2.0 |
| `systems/_shared-ejs/ejs/data/cores/` | gambatte libretro core (Game Boy / Game Boy Color) | libretro/gambatte (sinamas) | GPL-2.0 |
| `systems/_shared-ejs/ejs/data/cores/` | handy libretro core (Atari Lynx) | libretro/libretro-handy (K. Wilkins) | zlib / GPL-compatible |
| `systems/_shared-ejs/ejs/data/cores/` | genesis_plus_gx libretro core (Sega Game Gear / Master System / Mega Drive) | libretro/Genesis-Plus-GX (Eke-Eke) | non-commercial redistribution licence (see core) |
| `systems/_shared-ejs/ejs/data/cores/` | prosystem libretro core (Atari 7800) | libretro/prosystem (Greg Stanton, libretro port) | GPL-2.0 |

### How the cores are mirrored

EmulatorJS-flavoured libretro cores (FCEUmm, VICE family, gearcoleco, Stella,
gambatte, handy, genesis_plus_gx, prosystem) are mirrored from `cdn.emulatorjs.org/stable/` rather than rebuilt
locally. The upstream CDN serves the same `.data` archives EmulatorJS itself
loads from.

**Exception — `vice_x128` (C128) and `gambatte` (Game Boy):** the current
`stable` builds are broken — `vice_x128` cold-boots to uninitialised-RAM
garbage, and `gambatte` renders a blank white panel (no ROM ever displays).
Both verified June 2026. We mirror the `nightly` builds of these two instead
(`cdn.emulatorjs.org/nightly/`), which work. All other cores stay on `stable`.

### Self-compiled WASM builds

- **atari800** — built from `atari800/atari800` v5.2.0 source via
  [`Retro-Jack/atari800`](https://github.com/Retro-Jack/atari800) fork
  (adds `build-wasm.sh` + `BUILDING-WASM.md` on top of upstream). The
  pre-built `.js` + `.wasm` in this repo correspond to that build script.
  The fork also adds `gx_state_*` `EMSCRIPTEN_KEEPALIVE` wrappers around
  atari800's `StateSav_*AtariState`, run from a `gx_state_poll()` in the
  `sdl/main.c` frame loop so the file-based save/load is deferred onto the
  main-loop ASYNCIFY stack (a direct call would be a second concurrent
  asyncify op and corrupt the heap) — that's what drives the page's
  save/load buttons.
- **cpc (tiny8bit)** — rebuilt from `floooh/chips-test` via fibs (Deno +
  emsdk), recipe in `systems/cpc/BUILDING-WASM.md`. Beyond the overlay
  removal, `examples/emus/cpc.c` gains `gx_state_*` `EMSCRIPTEN_KEEPALIVE`
  wrappers around chips' `cpc_save_snapshot`/`cpc_load_snapshot`, with
  `HEAPU8` added to `EXPORTED_RUNTIME_METHODS` in the fibs `emscripten.ts`.
  The chips snapshot is a self-contained struct copy (no `emscripten_sleep`),
  so unlike atari800 the adapter calls it straight from the button — no
  frame-loop deferral.
- **libretro-o2em** — built from upstream libretro/libretro-o2em via
  `systems/odyssey2/build.sh`. Custom SDL2/emscripten frontend
  (`frontend.c`) statically linked with the libretro core; reproducible
  with emsdk. `frontend.c` also adds `gx_state_*` `EMSCRIPTEN_KEEPALIVE`
  wrappers around the core's `retro_serialize`/`retro_unserialize` to
  expose save/load state to the page (with `HEAPU8` in
  `EXPORTED_RUNTIME_METHODS`).
- **sdltrs (TRS-80 Model I)** — built from `jengun/sdltrs`
  (gitlab.com/jengun/sdltrs) to WASM via emscripten (`build-wasm.sh`,
  `-sASYNCIFY` + `-sUSE_SDL=2`, `-sMODULARIZE`). Two `#ifdef __EMSCRIPTEN__`
  patches swap sdltrs's blocking `SDL_Delay` throttle (`trs_interrupt.c`) and
  `SDL_WaitEvent` (`trs_sdl_interface.c`) for `emscripten_sleep`, so the
  continuous Z80 loop yields once per timer tick and the page stays
  responsive. The Model I Level II BASIC ROM is embedded via `--embed-file`.
  sdltrs ships a built-in save-state (`trs_state_save`/`trs_state_load`) that
  isn't wired to the page yet.

---

## BIOS and system ROMs

Bundled for emulator-only use. These remain the property of their
copyright holders.

| File | System | Copyright |
| --- | --- | --- |
| `systems/coleco/colecovision.rom` | ColecoVision | © 1982 Coleco Industries |
| `systems/lynx/lynxboot.img` | Atari Lynx boot ROM (512 bytes) | © 1989 Atari Corp. (required by the handy core to start games) |
| `systems/intv/roms/exec.bin`, `grom.bin` | Intellivision EXEC + GROM | © 1979 Mattel Electronics |
| `systems/odyssey2/roms/o2rom.bin` | Magnavox Odyssey² (MD5 562d5ebf…) | © 1978 Magnavox/Philips. Sourced from the BizHawk firmware archive. |

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
- **3D Construction Kit demos and indie homebrew** across various
  platforms — license varies; check the per-bundle `games.json` or
  source archive when in doubt.

For every other commercial title, redistribution within this repo is on a
preservation / personal-use basis. If you are a rights holder and want a
title removed, open an issue at
<https://github.com/Retro-Jack/GenX-DOS/issues>.

---

## Bezel artwork

`systems/_shared/bezels/` holds the transparent PNG monitor/console frames used by the CRT-bezel overlays. **Every platform is now wired to a bezel** (the per-emulator integration pass is complete).

Per maintainer policy, bezel / wallpaper / texture artwork is **not provenance-tracked** — these are anonymous hardware shots or generic CRT frames sourced from public web archives where the original photographer is no longer reachable, then processed locally (alpha-keying, screen cutout) in GIMP. Source-code dependencies stay fully tracked (above). Wired bezels ship without credit comments.

**Exception — `Amstrad.png`** is properly source-cleared and carries a binding obligation: cropped from [File:Amstrad_CPC464.jpg](https://commons.wikimedia.org/wiki/File:Amstrad_CPC464.jpg) (Wikimedia Commons) by Bill Bertram (username Pixel8), 7 May 2005, **CC-BY-SA 2.5**. Modifications inherit share-alike; `systems/cpc/play.html` carries the author + licence as an attribution comment.

(Note: jsbeeb's CUB monitor frame lives inside `systems/jsbeeb/dist/` as part of the upstream build, not this shared set.)

---

## Fonts

- `prompt/img/f12.*.png` — 12×12 CP437 bitmap font sprites. Generated
  locally by `make_fonts.py` from Unicode CP437 mappings; the rendered
  glyph shapes derive from public-domain VGA CP437 reference data.

---

## CSS / JS dependencies bundled per-emulator

- `systems/electron/jquery/jquery-1.9.1.js` + `jquery-ui-1.10.3.custom.min.js` —
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
