What we've shipped, what's next, and what we've ruled out. This page is the project's running ledger — when a candidate comes up, the answer is here.

## The scope rule: 8-bit feel

Every shipped system has the *feel* of an 8-bit machine — sprite-based, chiptune, low-res. The test is the aesthetic, not the calendar year or strict CPU bit-width. (Updated 14/06/2026 from the earlier "8-bit era, ~1975-1990" framing.)

**In:** the classic 8-bit machines — Apple I/II, Atari 2600 / 400 / 800XL / 7800, BBC Micro / Master / Electron, Commodore PET / VIC-20 / MAX / 64 / 16 / Plus/4 / 128, MSX1 / MSX2, NES, Sega Master System, ColecoVision, Intellivision, ZX81 / Spectrum, Amstrad CPC, Tandy CoCo / TRS-80 / Model 100, TI-99/4A — plus the 8-bit-feel handhelds: Game Boy / Game Boy Color, Sega Game Gear, Atari Lynx.

**Out:** systems that defined the 16-bit GUI/console leap (Atari ST, Amiga, Macintosh, Archimedes, Sega Genesis, SNES, PC-Engine), and anything 32-bit+ (Saturn, N64, PlayStation, Neo Geo). The rule is about *feel*, not the calendar year — Genesis (1988) doesn't have the 8-bit feel and is out, while a late GBC game (2002) does and is in.

**Intellivision** (CP1610, 16-bit ALU) is the technical edge case the feel framing handles cleanly: Mattel marketed it as "the first 16-bit console", but it's universally grouped with 8-bit-era consoles (1979 launch, Atari 2600 contemporary). In.

---

## ✅ Shipped (19 emulator engines, 33 sub-systems)

| Category | Platform | Year | Dir | Engine | Notes |
|----------|----------|------|-----|--------|-------|
| Console | Atari 2600 | 1977 | `stella/` | EmulatorJS + Stella (stella2014) | |
| Console | Magnavox Odyssey² | 1978 | `odyssey2/` | libretro-o2em → WASM + custom SDL2 frontend | EJS path dead; o2rom.bin BIOS bundled |
| Console | Intellivision | 1979 | `intv/` | jzIntv WASM (custom loader) | exec.bin + grom.bin BIOS bundled |
| Console | ColecoVision | 1982 | `coleco/` | EmulatorJS + gearcoleco | RetroPad → numpad keypad remap |
| Console | Sega Master System | 1986 | `sms/` | EmulatorJS + genesis_plus_gx | replaced the Vectrex 04/07/2026 |
| Console | NES | 1983 | `jsnes/` | EmulatorJS + FCEUmm libretro | dir name predates migration |
| Console | Atari 7800 | 1986 | `js7800/` | EmulatorJS + ProSystem | migrated from JS7800 for the bezel |
| Apple | Apple I | 1976 | `apple1/` | scullin/apple1js | 10 tapes (Integer BASIC + 6502 asm) |
| Apple | Apple ][+ | 1977 | `apple2/` | whscullin/apple2js (webpack) | URL rewrite `?game=` → `?disk=` |
| Acorn | BBC Micro | 1981 | `bbcmicro/` | mattgodbolt/jsbeeb (Retro-Jack fork) | Model B; fork adds d-pad remap + monitor inset |
| Acorn | Acorn Electron | 1983 | `electron/` | dmcoles/elkjs | row-doubling display fix |
| Acorn | BBC Master 128 | 1986 | `bbcmaster/` | jsbeeb (Retro-Jack fork) `?model=Master` | full copy of the fork build |
| Atari | Atari 400 | 1979 | `atari400/` | atari800 WASM (self-built) | boots OS-B |
| Atari | Atari 800XL | 1983 | `atari800/` | atari800 WASM (self-built) | boots OS-XL; full copy of the same build |
| Commodore | PET | 1977 | `pet/` | Thomas Skibo's pet2001 (vanilla JS) | PET 2001 / BASIC 2 / 32 K |
| Commodore | VIC-20 | 1980 | `vic20/` | EmulatorJS + VICE xvic | `memory_expansions='all'` |
| Commodore | MAX Machine | 1982 | `max/` | EmulatorJS + VICE x64 (Ultimax mode) | Japan-only |
| Commodore | C64 | 1982 | `c64/` | EmulatorJS + VICE x64 | |
| Commodore | C16 | 1984 | `c16/` | EmulatorJS + VICE xplus4 (`c16pal` mode) | shares xplus4 core |
| Commodore | Plus/4 | 1984 | `plus4/` | EmulatorJS + VICE xplus4 | |
| Commodore | C128 | 1985 | `c128/` | EmulatorJS + VICE x128 (native mode, **nightly** core) | per-game VICII/VDC |
| MSX | MSX1 | 1983 | `msx1/` | ppeccin/WebMSX | boots `?M=MSX1` |
| MSX | MSX2 | 1986 | `msx2/` | ppeccin/WebMSX | full copy; boots `?M=MSX2` |
| Sinclair | ZX81 | 1981 | `jtyone/` | Simon Holdsworth/JtyOne | |
| Sinclair | ZX Spectrum | 1982 | `jsspeccy/` | gasman/JSSpeccy 3 | WASM Z80 |
| Amstrad | CPC | 1984 | `cpc/` | floooh/chips-test tiny8bit | sokol_args URL params |
| Tandy | Color Computer (CoCo) | 1980 | `xroar/` | Ciaran Anscomb/XRoar | |
| Tandy | TRS-80 Model I | 1977 | `trs80/` | jengun/sdltrs (our WASM build) | 10 `.cmd` games |
| Tandy | TRS-80 Model 100 | 1983 | `m100/` | Hurd & Pettit/VirtualT (our core-only WASM build) | 10 `.ba` games; live clock + battery-backed RAM |
| TI | TI-99/4A | 1981 | `js99er/` | Rasmus-M/js99er (vanilla JS) | `.rpk` carts |
| Handheld | Game Boy / GBC | 1989 | `gbc/` | EmulatorJS + gambatte (**nightly** core) | GBC mode; classroom bezel |
| Handheld | Atari Lynx | 1989 | `lynx/` | EmulatorJS + handy | `lynxboot.img` BIOS bundled |
| Handheld | Sega Game Gear | 1990 | `gamegear/` | EmulatorJS + genesis_plus_gx | `EJS_volume` 1.5 (quiet PSG) |

**Shared infrastructure:**
- `_shared/` — controls.css, frame.css, NumLock JS, VICE softkeys, gamedocs link JS
- `_shared-ejs/` — one EmulatorJS framework + 4 VICE cores + gearcoleco + FCEUmm + Stella + gambatte + handy + genesis_plus_gx + prosystem cores (14 bundles share; ~25 MB saved vs per-bundle copies)

See [[Emulators]] for the per-platform integration stories.

---

## ⏳ Still to go

### Out of scope under the 8-bit-feel rule
Listed for clarity — these are the 16-bit/32-bit transition and beyond.

- **NEC PC-Engine / TurboGrafx-16** — 16-bit-era console
- **Nintendo SNES** — 16-bit-era console
- **Sega Saturn / Nintendo 64 / PlayStation / Neo Geo AES** — 32-bit and beyond

---

## ❌ Rejected (don't re-investigate without new information)

### Quality / hosting / library size
- **Research Machines RM 380Z** (1977) — surveyed 14/07/2026. RM's first machine and one of the first built for UK schools, predating the BBC Micro: a £7,000 card-cage CP/M box (~£56,000 in today's money) — S100-style IEEE bus, 2 MHz Z80 (not a Z80A), 64 K max, COS ROM monitor booting CP/M and RML Extended BASIC. **No games library exists** — the CBM-II rule, only harder. The fullest inventory anywhere ([vt100.net](https://vt100.net/rm/software/)) lists six games — Adventure, Startrek, Games Package, Wordsquare, Hike, Fives and Threes — all text, none held. MAME ships no software list for `rm380z` or `rm480z`, so nothing has ever been dumped. The dedicated archive at `rml380z.org` was abandoned in July 2012 with every section left an empty stub (its Games page is one line plus a system-disk image), and the domain is now dead. A collector with a school 380Z and its complete original software haul confirms he has no games for it. Emulation is MAME-only with no browser build, but the library settles it before that matters. Reopens only if a genuinely dumped games library surfaces.
- **GCE / Milton Bradley Vectrex** (1982) — **shipped, then removed 04/07/2026** (replaced by the Sega Master System). The only browser core, jsvecx, has AY-3-8912 sound emulation that overruns tones and can't voice Spike's speech; confirmed against upstream jsvecx and the libretro `vecx` core, so it's the emulation lineage rather than a bundle bug, with no practical browser alternative. Fails the site's accuracy bar. Door reopens only if a browser Vectrex emulator with correct AY sound appears.
- **Sinclair ZX80** (1980) — re-investigated 07/06/2026. ROMs OK. JtyOne ZX80 mode is broken (display-sync state machine never fires the keyboard scan). zame-dev's `js-zx8x` works correctly but ships without an SPDX licence header. Door stays open if either gets fixed.
- **Acorn Atom** — removed 26/05/2026. Investigated as jsbeeb's Atom mode + tape files; didn't meet the quality bar, JS patch reverted.

*Undated below: never shipped, so no commit dates them — all were recorded when this page was written (05/06/2026).*
- **Sinclair QL** (1984) — no turn-key bundle; sQLux build is ~4h project
- **Cambridge Z88** (1988) — OZvm is Java/C++ desktop only
- **Sinclair NewBrain** (1982) — MAME driver broken (VFD doesn't get data)
- **Sinclair MK14** (1977) — MAME-only, very obscure (256-byte RAM kit)
- **Microvision** (1979) — split-CPU emulators don't pair with available ROMs
- **Commodore CBM-II / B-series** (1982-84) — VICE cores exist but the library is ~5 commercial games + business productivity. Not enough content for a 10-entry bundle.

### Out of scope (16-bit, removed)
- **Sega Genesis** (`genesis/`) — removed 05/06/2026; Motorola 68000 16-bit
- **Macintosh Plus** (`macplus/`) — removed 25/05/2026
- **Acorn Archimedes** (`archimedes-live/`) — removed 25/05/2026
- **Atari ST** (`estyjs/`) — removed 25/05/2026
- **Commodore Amiga 500** (`amiga/`) — removed 25/05/2026
- **Atari 5200** — removed 11/05/2026 from the menu tree (an external-links platform, stripped in the self-hosting push)

---

## Maintenance threads (shipped systems, open follow-ups)

- **Menu reformat sweep** — ✅ done 05/06/2026. Every game menu is a 4-column `# Title (Year) CODE` layout, year-sorted ascending, alphabetical within year. Every echo row across `fs.js` verifies at exactly 45 chars.
- **Per-game gamedocs pages** — ✅ done 09/06/2026. 327 pages across all 33 sub-systems (Vectrex's 11 out, Master System's 10 in, 04/07/2026; the ZX81's Chess replaced by 1K Chess in its two openings, +1, 06/07/2026; the Tandy Model 100's 10 in, +1 sub-system, 07/07/2026). The 20 `gamedocs/jsbeeb/*.html` (BBC Micro + Master) were briefly runtime orphans (jsbeeb launches keyless `?disc1=` URLs and its Vite `dist/index.html` hardcodes the corner link to `../controls.html`) — **wired 11/06/2026** via a `genx-gamedoc-link.js` that maps the disc filename → gamedoc key and rewrites the link `href` on load. Keyless BASIC / blank-Master launches still fall through to `controls.html`. (The shared `jsbeeb/` bundle was later split into `bbcmicro/` + `bbcmaster/`, 25/06/2026, each with its own copy of that script and gamedoc dir.) **All gamedoc controls re-verified against the original manuals / disassemblies (23/06/2026)** and corrected platform-by-platform where keys had been guessed — every standalone-emulator bundle had errors, the EmulatorJS bundles were already accurate; see the CHANGELOG for the per-platform detail.
- **Controls-link URL wiring** — `genx-controls-link.js` reads the game key from the live URL params (`?game=` / `?tape=` / `?rom=`) when the deferred script runs. amstradcpc and jtyone rewrite their URL on load (stripping `?game=`), but the rewrite sits behind an awaited `fetch('games.json')`, so the deferred link script reads the key *before* the rewrite lands — no extra plumbing needed. (There is **no** `window._genxGameKey` stash; earlier drafts of this page described one that was never implemented.) jsbeeb is the exception that doesn't fit this URL-param model — it has no game key in its URL at all, so it ships its own `genx-gamedoc-link.js` that maps the disc filename to the gamedoc key instead (see the gamedocs thread above).
- **C128 indie dates** — 4 of 7 homebrews (Phazer, Rockfall 128, Wumpus 2.0, World at War) have no internal version stamp anywhere; fall back to zimmers.net file mtimes (one definitive, one fuzzy).
- **MAX Multimax-extracted carts** — 7 games extracted from the MultiMax EasyFlash compilation. Remaining unknown banks (Sea Wolf, Le Mans, Avenger, etc.) lack identifiable strings; would need empirical VICE testing or menu-table decode to extract.
- **PET: 3 games skipped** — the PET runs Skibo's pet2001 now (it moved off VICE). Microchess 2.0 hits an illegal opcode on that core; 3D Star Trek and Cosmiads load at non-standard addresses the loader doesn't auto-start. Recoverable with manual cleanup.
- **CRT 4:3 bezels** — every platform is now bezeled (completed 16/06/2026). The first seven wired by 13/06/2026: `PC.png` (DOS prompt, 09/06), `Acorn.png` (Electron, 10/06), `Pet.png` (PET, 10/06), `Amstrad.png` (CPC, 10/06), `80s.png` (Atari 400/800, 11/06), `70s.png` (Atari 2600 / Stella, 12/06 — the **first bezel on an EmulatorJS bundle**), and `Commodore.png` (the 1084S, across the whole VICE family — `c64`/`c128`/`c16`/`plus4`/`vic20`/`max`, one monitor + one hole, 13/06). The core recipe is a layered stack inside `.bezel-wrap` — black backdrop behind, canvas in the middle, the transparent-hole PNG on top — but the canvas-fill method varies by engine: the PC bezel uses non-uniform `transform: scale` on the canvas; the atari800 bezel tells the emulator itself to fill via `-stretch full -fit-screen both -image-aspect none` (its integer scaling made a CSS scale quantised and viewport-fragile); the **EJS bundles** put the EJS player (`#game`) in the hole and stretch the canvas to fill — Stella uses `#game canvas { height: 100% !important; transform: translateX(-18px) scale(0.85) }` and the VICE family (all six, C128 included) uses `#game canvas { height: 100% !important; transform: scale(1.01) }`. The rest were wired through 16/06/2026: `Apple.png` (Apple ][/I), the keyed `nes.png` (NES), `70s.png` reused for ColecoVision / Intellivision / Odyssey², `80s.png` for the Atari 7800, and `Sinclair.png` for the MSX, CoCo and TI-99/4A — so every platform now sits in a bezel. (The two later arrivals were bezeled on landing: the Sega Master System, 04/07/2026, reuses the CRT treatment; the Tandy Model 100, 07/07/2026, sits in a device-over-photo bezel rather than a CRT one.) Source-verification note: the maintainer has adopted a no-graphic-provenance-tracking policy for bezels/wallpapers/textures, so wired bezels no longer carry per-image credit comments (the earlier PC/Acorn/Pet "open an issue" comments predate that policy; `Amstrad.png` keeps a real CC-BY-SA credit because it is genuinely source-cleared).
- **Sitewide 70s wallpaper** — ✅ landed 09/06/2026. `systems/_shared/textures/70s-bg.png` (seamless arrow-arch pattern) tiled at 220 px via the shared body rule. Suppressed on per-platform `controls.html` pages via a `body.controls-page` opt-out.
