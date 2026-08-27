# Attribution

GenX-DOS bundles third-party emulators, libraries, system ROMs, and visual
assets. This file is the canonical record of those components and the terms
under which they are redistributed.

It is maintained alongside [CHANGELOG.md](CHANGELOG.md): whenever a new
emulator, BIOS, ROM, bezel, font, or other asset is added or replaced, an
entry is added here.

The summary list in [README.md](README.md) is a quick-reference; this file is
the authoritative version.

---

## Removal upon request

**If you hold rights in anything bundled here, or legally represent someone who
does, and you raise an identified copyright or intellectual-property concern,
the material in question will be removed immediately.** Not debated, not defended,
not delayed pending a formal process.

This applies to everything in the repository, not only games: software titles,
system ROMs and BIOS images, emulator code, artwork, fonts, documentation,
trade marks and names.

**What a request must contain.** Three things, so that nothing is pulled on an
anonymous say-so:

1. **Who you are** — a name, and the company or firm if you act for one.
2. **Your standing** — that you hold the rights, or who you represent and in
   what capacity.
3. **What and why** — the specific title, file or asset, and the basis of the
   concern.

That is the whole bar. No notice format, no particular form of words, and no
registration certificates, chain-of-title documents or legal citations — a few
sentences covering those three points will be taken in good faith and acted on.

**Where to send it**
- Open an issue: <https://github.com/Retro-Jack/GenX-DOS/issues> (there is a
  "Content removal request" template, but a plain issue is fine)
- Or, if you would rather it were not public: admin@genx-dos.fun

Removal will happen as soon as such a request reaches me. GenX-DOS is a
non-commercial preservation project run by one person; nothing here is worth
anyone's legal costs, mine included, and no title in it matters more than a
rights holder's wishes about their own work.

---

## Site code

- **DOS terminal, virtual filesystem, and 12×12 CP437 font sprite system**
  — by Mike, who wrote it informally for **LGR — Lazy Game Reviews**
  (Clint Basinger, <https://www.lazygamereviews.com>). LGR's own site
  metadata credits Mike — `<meta name="Generator" content="Mike">` and
  `<meta name="Originator" content="Mike's brain -- thanks, Mike!">`.
  The interactive prompt under `prompt/`, the `fs.js` virtual `C:` drive
  layout, the command dispatcher, and the CP437 sprite font and renderer
  originate from **LGR-DOS** (the "LGR-DOS Command Prompt"), LGR's
  in-browser DOS-prompt project. GenX-DOS extends that base.
- **AMIBIOS POST animation, emulator integration wrappers, menu tree,
  and all bundled-emulator-specific code** — © Retro-Jack. Original work
  added on top of the LGR terminal base.
- Retro-Jack's original work (above) is licensed **CC BY-NC 4.0** — see
  `LICENSE.TXT`. The LGR terminal base is explicitly **excluded** from
  that licence and stays under LGR's own terms: source-available, with a
  clear credit to the LGR base required in any derivative work.

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
| `systems/bbcmicro/`, `systems/bbcmaster/` | jsbeeb, built from the [`Retro-Jack/jsbeeb`](https://github.com/Retro-Jack/jsbeeb) fork (same engine in two bundles — the Micro bundle boots Model B, the Master bundle boots `model=Master`; local changes in the fork's `GENX-CHANGES.md`) | Matt Godbolt | GPL-3.0-or-later |
| `systems/electron/` | ElkJS | Darren Coles (6502 core ported from Tom Walker's Elkulator) | © Darren Coles 2013 (no SPDX header in source) |
| `systems/jsnes/` | EmulatorJS + FCEUmm libretro core | EmulatorJS team; libretro/libretro-fceumm | GPL-3.0 (EmulatorJS), GPL-2.0 (FCEUmm) |
| `systems/stella/` | EmulatorJS + Stella (`stella2014`) libretro core | EmulatorJS team; stella-emu / libretro | GPL-3.0 (EmulatorJS), GPL-2.0 (Stella) |
| `systems/js7800/` | EmulatorJS + ProSystem (`prosystem`) libretro core | EmulatorJS team; libretro/prosystem | GPL-3.0 (EmulatorJS), GPL-2.0 (ProSystem) |
| `systems/msx1/`, `systems/msx2/` | WebMSX (same engine in two bundles — the MSX1 bundle boots `M=MSX1`, the MSX2 bundle boots `M=MSX2`) | Paulo Peccin | MIT |
| `systems/jsspeccy/` | JSSpeccy 3.2 | Matt Westcott (gasman) | GPL-3.0 |
| `systems/jtyone/` | JtyOne (port of Mike Wynne's EightyOne) | Simon Holdsworth | GPL-2.0 |
| `systems/xroar/` | XRoar (WASM) | Ciaran Anscomb | GPL-3.0-or-later |
| `systems/trs80/` | sdltrs (SDL2 TRS-80 emulator), built from source to WASM | Mark Grebe / Jens Guenther (gitlab.com/jengun/sdltrs) | BSD-2-Clause |
| `systems/trs80/model3.rom` | TRS-80 Model III ROM (14 KB) | © Tandy / Microsoft | Bundled for emulator-only use; fetched by the page and written into the emulator's in-memory filesystem at boot |
| `systems/trs80/sdltrs.wasm` (embedded) | TRS-80 Model I Level II BASIC ROM (12 KB) | © Tandy / Microsoft | Bundled for emulator-only use; embedded into the WASM at build time via `--embed-file`. Left in place from the Model I build; the bundle boots the Model III ROM above |
| `systems/js99er/` | Js99'er (vanilla-JS build) | Rasmus Moustgaard | GPL-2.0 |
| `systems/js99er/carts/*.rpk` | TI-99/4A cartridge ROMs (10 commercial titles, 1980-1983) | Texas Instruments / Imagic / Sega — original publishers | Distributed for retro-preservation; carts are 40+ years out of commerce. |
| `systems/atari800/`, `systems/atari400/` | atari800 v5.2.0, built from source to WASM (same core shipped in two bundles — the 400 bundle boots OS-B, the 800XL bundle boots OS-XL) | atari800 project | GPL-2.0+ |
| `systems/atari800/atari800.wasm`, `systems/atari400/atari800.wasm` (embedded) | AltirraOS-XL 3.41 + AltirraOS-800 + AltirraBASIC | Avery Lee | Freely-redistributable open-source OS replacement, compiled into the WASM via `--enable-altirra_bios` (no separate ROM file ships) |
| `systems/intv/` | jzIntv (WASM build) | Joe Zbiciak | Free for personal/non-commercial use. WASM build mirrored from [mholzinger/intellivision-overlay-editor](https://github.com/mholzinger/intellivision-overlay-editor) |
| `systems/odyssey2/` | libretro-o2em, custom SDL2/emscripten frontend | original o2em by Daniel Boris + Andre de la Rocha; libretro fork by libretro authors; frontend by Retro-Jack | Artistic-2.0 (libretro-o2em, verified against upstream); frontend bundled under repo terms |
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

### Corresponding source for the engine binaries

The GPL asks whoever distributes a binary to also make its source available, and
the Artistic License asks the same of modified versions.
The engines below ship here as compiled binaries, so this is where their source
lives. None of it is fetched at runtime — these are links for anyone wanting to
rebuild or inspect what we ship.

| Binary we ship | Corresponding source |
|---|---|
| `_shared-ejs/ejs/` — EmulatorJS runtime (GPL-3.0) | https://github.com/EmulatorJS/EmulatorJS |
| `vice_x64`, `vice_x128`, `vice_xvic`, `vice_xplus4` (GPL-2.0) | https://sourceforge.net/projects/vice-emu/ — libretro packaging: https://github.com/libretro/vice-libretro |
| `fceumm` (GPL-2.0) | https://github.com/libretro/libretro-fceumm |
| `gearcoleco` (GPL-3.0) | https://github.com/drhelius/Gearcoleco |
| `stella2014` (GPL-2.0) | https://github.com/libretro/stella2014-libretro |
| `gambatte` (GPL-2.0) | https://github.com/libretro/gambatte-libretro |
| `handy` (zlib) | https://github.com/libretro/libretro-handy |
| `genesis_plus_gx` (non-commercial redistribution licence) | https://github.com/libretro/Genesis-Plus-GX |
| `prosystem` (GPL-2.0) | https://github.com/libretro/prosystem-libretro |
| `atari400/`, `atari800/` — `atari800.wasm` (GPL-2.0+) | built by us: https://github.com/Retro-Jack/atari800 (`build-wasm.sh`, `BUILDING-WASM.md`) |
| `odyssey2/` — o2em core | built by us from https://github.com/libretro/libretro-o2em via `systems/odyssey2/build.sh`; our SDL2 frontend (`frontend.c`) sits beside it |
| `bbcmicro/`, `bbcmaster/` — jsbeeb (GPL-3.0+) | our fork, changes in `GENX-CHANGES.md`: https://github.com/Retro-Jack/jsbeeb |
| `m100/` — VirtualT (BSD) | `systems/m100/src/` in this repo |
| `trs80/` — sdltrs (BSD-2-Clause) | https://gitlab.com/jengun/sdltrs |

**o2em is Artistic-2.0, not GPL** (checked upstream 17/08/2026). This entry used
to read GPL-2.0+, which looks to have been an assumption from most libretro
cores being GPL. `libretro/libretro-o2em` carries a `COPYING` that is the
Artistic License 2.0, our bundled copy is byte-identical to it, and no source
file in the core carries a GPL header. The original O2EM was Artistic-licensed
and the libretro port kept those terms.

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
- **jsbeeb (BBC Micro / Master)** — built from the
  [`Retro-Jack/jsbeeb`](https://github.com/Retro-Jack/jsbeeb) fork (a pure-JS
  Vite build; the pre-built `dist/assets/` engine files in both bundles come
  from `npm run build` on the fork's `main` branch). Two local changes, both
  documented in the fork's `GENX-CHANGES.md`: (1) **d-pad gamepad remap** —
  four `GP.D12`–`GP.D15` cases in `src/gamepads.js` so a launch URL can map the
  d-pad buttons to any BBC key (jsbeeb hardwires them to Z/X/:/? with no remap
  hook); this is a general improvement offered upstream on the fork's clean
  `gamepad-dpad-remap` branch. (2) **monitor inset** — `src/main.js`
  `bottomReservedSize` widened 68→120 for the sitewide-wallpaper breathing room
  (GenX-local, not upstreamed). The fork tracks upstream releases — currently **rebased onto jsbeeb
  1.14.0** (July 2026). Hats off to Matt Godbolt for being on the ball: 1.14.0
  shipped the [#704](https://github.com/mattgodbolt/jsbeeb/pull/704) workaround
  for a Chrome 150 V8 bug that had been wedging the emulator, within a day of it
  surfacing — rebasing this fork onto it cleared the BBC freeze on GenX-DOS with
  nothing more to do on our side.
- **libretro-o2em** — built from upstream libretro/libretro-o2em via
  `systems/odyssey2/build.sh`. Custom SDL2/emscripten frontend
  (`frontend.c`) statically linked with the libretro core; reproducible
  with emsdk. `frontend.c` also adds `gx_state_*` `EMSCRIPTEN_KEEPALIVE`
  wrappers around the core's `retro_serialize`/`retro_unserialize` to
  expose save/load state to the page (with `HEAPU8` in
  `EXPORTED_RUNTIME_METHODS`).
- **sdltrs (TRS-80 Model III)** — built from `jengun/sdltrs`
  (gitlab.com/jengun/sdltrs) to WASM via emscripten (`build-wasm.sh`,
  `-sASYNCIFY` + `-sUSE_SDL=2`, `-sMODULARIZE`). Two `#ifdef __EMSCRIPTEN__`
  patches swap sdltrs's blocking `SDL_Delay` throttle (`trs_interrupt.c`) and
  `SDL_WaitEvent` (`trs_sdl_interface.c`) for `emscripten_sleep`, so the
  continuous Z80 loop yields once per timer tick and the page stays
  responsive. The bundle runs as a Model III (`-model 3`), whose ROM is
  fetched by the page and written into MEMFS at boot rather than embedded, so
  the machine can change without an emscripten rebuild; the Model I Level II
  BASIC ROM the build embeds via `--embed-file` is simply unused. sdltrs ships
  a built-in save-state (`trs_state_save`/`trs_state_load`) that isn't wired to
  the page yet.
- **VirtualT (Tandy TRS-80 Model 100)** — Stephen Hurd & Ken Pettit's VirtualT
  (BSD, © 2004; [sourceforge.net/projects/virtualt](https://sourceforge.net/projects/virtualt/))
  is a full FLTK desktop emulator; this bundle is built from its **core only**.
  The FLTK-free 8085 CPU, memory, HD44102 LCD and keyboard-matrix sources are
  compiled to WASM with emscripten (`-sASYNCIFY` + `-sUSE_SDL=2`) behind a small
  headless SDL2 frontend (`frontend_sdl.c`) plus headless display / file / clock /
  stub units written for this project; the ~40 FLTK GUI/IDE/debugger files are
  dropped. Because so much of the original is stripped away this is an
  **acknowledgement, not a fork** — VirtualT's BSD licence and the original
  copyright are preserved in the retained sources. The 32 KB Model 100 ROM is
  embedded via `--embed-file`. The five headless units (`frontend_sdl.c` plus the
  display / file / clock / stub replacements), a reproducible `build.sh`,
  `BUILDING-WASM.md` and VirtualT's BSD licence are in `systems/m100/src/`.

---

## BIOS and system ROMs

Bundled for emulator-only use. These remain the property of their
copyright holders.

| File | System | Copyright |
| --- | --- | --- |
| `systems/coleco/colecovision.rom` | ColecoVision | © 1982 Coleco Industries |
| `systems/lynx/lynxboot.img` | Atari Lynx boot ROM (512 bytes) | © 1989 Atari Corp. (required by the handy core to start games) |
| `systems/intv/exec.bin`, `grom.bin` | Intellivision EXEC + GROM | © 1979 Mattel Electronics |
| `systems/odyssey2/o2rom.bin` | Magnavox Odyssey² (MD5 562d5ebf…) | © 1978 Magnavox/Philips. |

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
- **Attack of the PETSCII Robots** (C64, `systems/c64/games/petrobot.d64`) —
  David Murray ("The 8-Bit Guy") / 8-Bit Productions, 2021. The official
  free **shareware** build (2 of the full game's 13 levels) is explicitly
  redistributable — "You are free to distribute this archive." Downloaded
  from [the8bitguy.com](https://www.the8bitguy.com/25753/petscii-robot-shareware-available/);
  the full game is for sale. Bundled disk only — the manual PDF and notes
  in the original archive are not shipped.

For every other commercial title, redistribution within this repo is on a
preservation / personal-use basis, and will be withdrawn the moment a rights
holder asks — see **Removal upon request** at the top of this file.

---

## Research and reference sources

Reference works — not bundled code — consulted to get the per-game gamedocs
right (control schemes and in-game behaviour). The project leans on them and is
glad to say so.

- **Paul Farrow — ZX81 disassemblies** ([www.fruitcake.plus.com](http://www.fruitcake.plus.com)).
  Paul's meticulous, fully-commented disassembly of *3D Monster Maze* (Malcolm
  Evans, New Generation Software, 1981) is the authority behind that ZX81
  gamedoc — the verified in-game keys and menu details we would otherwise have
  had to guess at. Painstaking preservation work, freely shared decades on.
  Thank you.

- **Mark Moxon — bbcelite.com** ([www.bbcelite.com](https://www.bbcelite.com)).
  Mark's fully-commented, line-by-line disassembly of *Elite* (Ian Bell & David
  Braben, Acornsoft 1984) across its 8-bit versions is the authority behind our
  Elite gamedocs — the correct publisher and year, the real flight and chart
  keys, and which features each port actually has (no Thargoids or suns on the
  Electron, the Master's fractional scoring). A monumental preservation effort,
  freely shared. Thank you.

- **David D. Busch — *25 Games for your TRS-80 Model 100*** (TAB Books, 1984).
  The Model 100 bundle's games are hand-transcribed BASIC type-in listings from
  this book, and its per-game chapters are the authority behind those gamedocs —
  the controls, scoring and how-to-play. A lovely artefact of the type-in era,
  leaned on here with thanks. As with the other bundled game code, these listings
  are included on a preservation / personal-use basis; a rights holder who wants
  them removed can open an issue.

- **Tandy — *TRS-80 Model 100 Owner's Manual*** (Radio Shack, 1983;
  [archive.org](https://archive.org/details/trs-80-m-100-user-guide)). The authority
  behind the Model 100 controls page — the exact TEXT / ADDRSS / SCHEDL usage and
  function-key labels (Find, Load, Save, Sel, Copy, Cut, Menu; and that ADDRSS and
  SCHEDL *find* records you enter in TEXT) come straight from it rather than memory.

- **dplassgit** — proposed the Tandy Model 100 as a GenX-DOS platform in
  [discussion #2, "Tandy 100?"](https://github.com/Retro-Jack/GenX-DOS/discussions/2)
  (*"Based on the Intel 8085 CPU… it definitely has the 8-bit feel"*). The whole
  platform exists because of that suggestion — and thanks to the above book, we
  were able to ship the usual amount of games, even when the primary source
  failed. Thanks for the nudge.

- **jimbro1000** — pointed out that the Tandy CoCo needs composite artifact
  colour in its high-resolution modes, and named the option that provides it
  (*"for the Tandy CoCo it really needs artifact emulation in hires black and
  white. For example Demon Attack should show black, white, red and blue"*).
  Demon Attack had been rendering in stark monochrome. Four games now carry
  the setting, and testing the suggestion turned up two more that needed it
  and three it would have spoiled. Thanks for the correction.

---

## Bezel artwork

`systems/_shared/bezels/` holds the transparent PNG monitor/console frames used by the CRT-bezel overlays. **Every platform is now wired to a bezel** (the per-emulator integration pass is complete).

Per maintainer policy, bezel / wallpaper / texture artwork is **not provenance-tracked** — these are anonymous hardware shots or generic CRT frames sourced from public web archives where the original photographer is no longer reachable, then processed locally (alpha-keying, screen cutout) in GIMP. Source-code dependencies stay fully tracked (above). Wired bezels ship without credit comments.

**Exception — `Amstrad.png`** is properly source-cleared and carries a binding obligation: cropped from [File:Amstrad_CPC464.jpg](https://commons.wikimedia.org/wiki/File:Amstrad_CPC464.jpg) (Wikimedia Commons) by Bill Bertram (username Pixel8), 7 May 2005, **CC-BY-SA 2.5**. Modifications inherit share-alike; `systems/cpc/play.html` carries the author + licence as an attribution comment.

(Note: jsbeeb's CUB monitor frame lives inside `systems/bbcmicro/dist/` and `systems/bbcmaster/dist/` as part of the upstream build, not this shared set.)

---

## Fonts

- `systems/_shared/styles/VGA_font/f12.*.png` — 12×12 CP437 bitmap font sprites. Generated
  locally by `make_fonts.py` from Unicode CP437 mappings; the rendered
  glyph shapes derive from public-domain VGA CP437 reference data.

- `styles/fonts/web437-vga.woff` — **Web437 IBM VGA 9×16**, from the Ultimate
    Oldschool PC Font Pack by **VileR** (<https://int10h.org/oldschool-pc-fonts/>),
    © 2016–2020 VileR. Licensed **CC BY-SA 4.0**
    (<https://creativecommons.org/licenses/by-sa/4.0/>). A genuine IBM VGA
    text-mode CP437 font; used on the home page (`index.html`) for the spec
    sheet and the "Enter the museum" button. Unmodified.

- `styles/fonts/michroma-400.woff2` — **Michroma** by Vernon Adams. Licensed
    **SIL Open Font License 1.1**. Display face on the home page and the
    feature article (`docs/article/index.html`).

- `styles/fonts/ibm-plex-mono-*.woff2`, `styles/fonts/ibm-plex-serif-*.woff2` —
    **IBM Plex Mono** and **IBM Plex Serif** by Mike Abbink & Bold Monday for
    IBM. Licensed **SIL Open Font License 1.1**. Body / UI faces on the landing
    page and the feature article. Subsetted to the Latin range.

---

## CSS / JS dependencies bundled per-emulator

- `systems/electron/jquery/jquery-1.9.1.js` + `jquery-ui-1.10.3.custom.min.js` —
  jQuery 1.9.1 and jQuery UI 1.10.3 custom build, MIT — required by ElkJS
  upstream. Kept as-is to avoid divergence from the ElkJS source.
- `systems/electron/` — ElkJS (© Darren Coles 2013) is **locally patched** from
  the upstream source: `display.js` row-doubling (removes upstream's baked-in
  scanlines), `sound.js` (adds the `soundInit()` AudioContext resume the upstream
  `soundToggle()` referenced but never defined, plus a 25% output mix), and
  `elkjs.js` (`resumeAudio()`, to start sound on a user gesture). The upstream
  duplicate jQuery 1.7.2 was removed. See CHANGELOG / wiki for the why.

- `systems/js99er/lib/jquery-1.11.0.min.js` — jQuery 1.11.0, MIT — required by
  js99er upstream. A second, separate copy from the ElkJS one above; the two
  bundles are independent and neither shares the other's build.
- `systems/apple2/dist/39795c0b4513de014cf8.woff`,
  `b7bcc075b395c14ce8c2.woff2` — **Bootstrap Icons** (MIT), pulled in by the
  apple2js webpack build. The filenames are content hashes, so the font is only
  identifiable from its internal name table — recorded here so it is not lost
  the next time the bundle is refreshed.
- `systems/_shared-ejs/ejs/data/emulator.min.js` — bundles **Font Awesome Free
  6.5.1** (Fonticons, Inc.) for its UI icons: icons CC BY 4.0, fonts SIL OFL
  1.1, code MIT. The upstream notice is retained in the minified file.

Other emulator bundles vendor their upstream dependencies; where a bundle's
runtime is locally modified (e.g. ElkJS above, the atari800 / CPC / o2em WASM
rebuilds) the change is recorded here or in the CHANGELOG.

**On upstream licence files.** Every GPL binary we ship now has the licence text
beside it, which is what the GPL asks for:

| File | Covers |
|---|---|
| `systems/_shared-ejs/COPYING` (GPL-3.0) | the EmulatorJS runtime, and with it all 14 bundles that share it — none of them carries its own core binary |
| `systems/_shared-ejs/ejs/data/cores/COPYING` (GPL-2.0) | the libretro cores sitting in that directory |
| `systems/jsspeccy/COPYING`, `systems/xroar/COPYING` (GPL-3.0) | those engines |
| `systems/jtyone/COPYING`, `systems/js99er/COPYING` (GPL-2.0) | those engines |
| `atari400/`, `atari800/` (GPL-2.0), `bbcmicro/`, `bbcmaster/` (GPL-3.0), `odyssey2/` | shipped with the builds we compiled ourselves |
| `m100/src/LICENSE` | VirtualT, BSD |

The permissively-licensed bundles — `apple1/`, `apple2/`, `msx1/`, `msx2/`,
`cpc/` (MIT), `pet/`, `trs80/` (BSD-2-Clause) — do **not** carry their notice
files. Those licences do ask for the copyright notice to travel with the code,
and the notice includes a per-project copyright line that cannot be
reconstructed from here, so it has to come from upstream rather than be written
locally. Until it does, the table above and its upstream links are the record.
`electron/` is a separate case: the ElkJS source carries a copyright line
(© Darren Coles 2013) but no licence grant at all, so there is nothing to
reproduce.

Do not read the absence of a licence file in a bundle as an unlicensed
component — check the table first.

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
