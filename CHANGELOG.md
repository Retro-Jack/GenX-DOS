# Changelog

## [Unreleased]

### Changed
- **jsbeeb CUB monitor breathing room** — the BBC Micro/Master monitor was flush against the top of the viewport. Widened the sizing JS's vertical inset (`r` 68→120 in `dist/assets/index-*.js`) and added `#cub-monitor { margin-top: 60px }` so the monitor centres with ~60px of wallpaper above and below. (One change, both BBC machines — they share `dist/`.)
- **Electron bezel breathing room** — matched the CUB spacing on `emulators/electron/play.html`: capped `.bezel-wrap` height at `100dvh - 120px` so the Acorn monitor centres with ~60px above and below instead of filling the full height.
- **Atari 2600 migrated from Javatari to EmulatorJS + Stella** (`stella2014` libretro core, GPL-2.0). Javatari sized its own canvas — so it couldn't take a CRT bezel like the other bundles — and put GAME SELECT / RESET on browser-reserved `F11`/`F12`, leaving its on-screen console panel as the only reliable control. The new `emulators/stella/` bundle runs on the shared EJS framework like the 8 other EJS bundles: GenX controls the canvas, and the 2600's switches map to plain keys via `EJS_defaultControls` — `Space` = fire, `Enter` = GAME RESET, `V` = GAME SELECT, arrows = joystick. Existing `.a26` ROMs reused unchanged. Engine count 20 → 19 (the 2600 folds into EmulatorJS); EJS bundles 8 → 9; sub-systems unchanged at 28. Gamedocs moved `gamedocs/javatari/` → `gamedocs/stella/` and rewritten to the keyboard scheme; `fs.js` menu links repointed; old `emulators/javatari/` bundle (Javatari.js, AGPL-3.0) deleted.
- **PET migrated from VICE xpet to Thomas Skibo's pet2001** (BSD-2-Clause, vanilla JS, no WASM/libretro/EJS). `vice_xpet` ships with a hardcoded Business UK keyboard mapper that no `vicerc` resource overrides — symptom was `Enter`→`P` and scrambled letters. New `emulators/pet/` runtime is ~90 lines of `play.html` driving Skibo's `pet2001/*.js` (9 files), bumps RAM to 32 KB, auto-types `load"*",8`+`run` via the petkeys queue with a per-game `autostart` override in `games.json`. Sub-system count unchanged at 28.

### Added
- **Atari 2600 CRT bezel** wired into `emulators/stella/play.html` — `_shared/bezels/70s.png`, a maintainer-keyed wood-cabinet console TV with legs (1240×855, the set isolated from its photo and floating on the 70s wallpaper, with a transparent screen hole at `27.6%/13.1%/45.4%×51.6%`). **First bezel on an EmulatorJS bundle** — EJS owns the canvas, so the screen hole holds `#game` (the EJS player) and EJS draws into it. Three layers: a black `.screen-bg` slightly larger than the hole (stops wallpaper bleeding through the cutout's soft edge) → `#game` at the hole → bezel PNG on top. EJS fits the canvas preserving aspect, leaving a top/bottom letterbox; closed and sized it with `#game canvas { height: 100% !important; transform: translateX(-18px) scale(0.85) }` (height-stretch + a left nudge to centre + a shrink to sit the picture inside the glass). Sets the pattern for eventually bezeling the rest of the EJS family. `70s.png` moves staging → wired (now six wired, four staging).
- **Atari 400/800 CRT bezel** wired into `emulators/atari800/play.html` — `_shared/bezels/80s.png`, an early-'80s wood-cabinet TV (maintainer-keyed from the OBS bezel library: transparent background + screen hole, resized 3872×2592 → 1680×1125). The set floats on the 70s wallpaper. Two-layer order (`.screen` clip box at the measured hole `15.4%/21.3%/46.4%×52.8%` with a black backdrop → bezel PNG on top), bezel sized at `*1.25` of the height-based width.
  - **Stretch-to-fill, not CSS-scaled:** atari800 renders its visible TV area with integer scaling that's quantised and viewport-dependent, so a CSS canvas scale tuned to one window doesn't hold on another. Instead the canvas sits at a plain 100% of the cutout and atari800 is told to fill it directly via `-stretch full -fit-screen both -image-aspect none -horiz-area tv -vert-area tv` (passed through the existing `Module.arguments` builder). Picture now meets all four cutout corners deterministically at any window size, on every game in the bundle. Also reworked the arg builder to *append* cart/disk args rather than reassigning, so the video args survive.
- **Amstrad CPC CRT bezel** wired into `emulators/amstradcpc/play.html` — the licence-cleared `_shared/bezels/Amstrad.png` (CPC464 + CTM640 monitor, 1502×992). Standard three-layer order (black backdrop → tiny8bit canvas at the screen cutout → bezel PNG on top), canvas centred and stretched to fill the cutout (`left 24.85%/top 4.8%/46.3%×66.4%`), `#loading` overlay tracking it, bezel scaled +5% (`*1.05` on the height-based width), 70s wallpaper behind. Carries a real CC-BY-SA 2.5 attribution comment (Bill Bertram) since this bezel is properly source-cleared. Fourth bezel to go live.
  - **Overlay removal (rebuilt WASM):** floooh's stock binary unconditionally draws a sokol-debugtext status bar (JOYSTICK/DISC/MOTOR/TRACK + frame timing) and a suspended-audio muted-speaker icon. Rather than masking them, rebuilt `cpc.js`/`cpc.wasm` from `floooh/chips-test` (fibs, `emsc-ninja-release`): commented out `draw_status_bar()` and hardcoded `disable_speaker_icon = true` in `examples/emus/cpc.c`. Recipe at `emulators/amstradcpc/BUILDING-WASM.md`. Audio auto-unlock burst kept so sound resumes on load. Supersedes the earlier black-strip mask.
- **`emulators/amstradcpc/BUILDING-WASM.md`** — build recipe for the patched `cpc.js`/`cpc.wasm` (source, two-line patch, fibs config + build, install paths).
- **PET 2001 CRT bezel** wired into `emulators/pet/play.html` — `_shared/bezels/Pet.png` replaced with a higher-res blue-trimmed PET 2001 frame (1024×771, maintainer-keyed from the local OBS bezel library). Standard three-layer bezel order (black backdrop → canvas at the detected screen cutout left 30.3%/top 20.5%/37.3%×35.4% → bezel PNG on top), 70s wallpaper behind, generic photographer-unknown credit comment at the foot. Third bezel to go live after PC and Acorn.
- **Star Trek (1977)** added to the PET bundle as the replacement headline title — Mike Mayfield's defining BASIC space game, sourced from zimmers.net.
- **`gamedocs/pet/startrek.html`** — per-game instructions for the new headline title (the `?game=startrek` controls link was 404ing without it). Gamedocs sweep stays complete at 281 pages.

### Removed
- **`gamedocs/pet/petrobot.html`** — orphaned PETSCII Robots gamedoc, left behind when the title was dropped from the PET bundle. No launcher or `games.json` key referenced it.
- **PETSCII Robots Shareware (2022)** dropped from the PET bundle. Skibo's emulator has no 1541 disk-image support, no BASIC 4 / PET 4032 ROM, and no multi-file disk loader — three hard blockers that all three of PETSCII Robots' boot requirements need. The title is no longer shipped on any sub-system; its ATTRIBUTION/README credits were removed accordingly. Documented in detail at `wiki/Emulator-pet2001-Skibo`.
- **`emulators/_shared-ejs/ejs/data/cores/vice_xpet-legacy-wasm.data`** (1.3 MB) — the libretro VICE PET core, no longer referenced by any bundle. VICE-family shared dir drops from 5 cores to 4.

### Fixed
- **jsbeeb per-game gamedocs wired** — the 20 `gamedocs/jsbeeb/*.html` (BBC Micro + Master) were runtime orphans: the Vite `dist/index.html` hardcodes the corner link to `../controls.html` and the menu launches keyless `?disc1=` URLs, so the per-game gamedoc never resolved. Added `emulators/jsbeeb/genx-gamedoc-link.js` — maps the disc filename (e.g. `EliteMaster` → `master-elite`) to the gamedoc key and rewrites the corner link's `href` on load; keyless BASIC / blank-Master launches fall through to `controls.html`. Wired into `dist/index.html` via a deferred `<script>`. All 20 keys verified to map to existing files and serve 200.
- **BBC Elite gamedocs — front-view key relabelled to PC `F10`** — `gamedocs/jsbeeb/elite.html` and `master-elite.html` showed the front view as `F0`, which has no PC-keyboard equivalent. Verified jsbeeb's keymap (`i(k.F10,O.F0),i(k.F1,O.F1)…`): BBC `f1`–`f9` map to PC `F1`–`F9` 1:1, BBC `f0` maps to PC `F10`. Relabelled `F0`→`F10` and corrected elite.html's keyboard note (it had implied an `f0`–`f9` → `F1`–`F10` block shift).
- **On-screen overlay sweep** — audited every emulator (visual capture of all 24 bundles) for stray chrome. **JtyOne** (ZX81) showed a live `FPS: nn` readout — hidden (`#emulator_status`). The **EmulatorJS bundles** (VICE family, ColecoVision, NES, Atari 2600) leaked their control bar (play/pause/settings/fullscreen/volume) on mouse-move plus a right-click context menu — hidden via `.ejs_menu_bar, .ejs_context_menu { display: none }` in the shared `genx-frame.css` (harmless on the non-EJS bundles that also load it). Everything else already renders clean: js7800/apple2/xroar/jsbeeb strip their upstream chrome, the bezel bundles frame the screen, and the Vectrex screen overlay + jsspeccy/intellivision start gates are intentional (not chrome). *(The 2600's Javatari-specific chrome work was superseded by the Stella migration below.)*
- **NES (jsnes) gamedocs — corrected the keyboard footer on all 10** — the "Default keyboard mapping" line read `Z = A, X = B … SHIFT = SELECT`, but `jsnes/play.html` overrides the EmulatorJS controls to B=`z` / A=`x` (so **Z=B, X=A**) and leaves SELECT at the EJS default of **V** (not Shift). Fixed both errors across every NES gamedoc so the A/B keys and SELECT key are right.
- **C64 Elite gamedoc — controls rewritten from the manual** — the page had been cloned from the BBC layout: views/screens were listed on `F0`–`F8` (the C64 has no `F0`, and its screens live on the number row), and flight was on the numpad. Rewrote against the Firebird 1985 C64 manual (cross-checked with c64-wiki): views on the four C64 function keys `F1`/`F3`/`F5`/`F7`, screens on the number row (`4` galactic chart, `5` local, `6` data, `7` market, `8` status, `9` inventory, `1`/`2`/`3` buy/sell/equip), keyboard flight (`<`/`>` roll, `S`/`X` dive/climb, `Space`/`?` speed). Translated the two C64-specific keys to what VICE actually delivers on a PC: energy bomb = **Left Ctrl** (the C64 Commodore key), intergalactic jump = **Tab+H** (the C64 CTRL key). (Left/right of the `F5`/`F7` side views left unstated — sources conflict.)
  - All five Elite gamedocs audited: jsbeeb Micro + Master (F0→F10, above), Amstrad CPC (number-key views — already correct), Acorn Electron (`Alt`=FUNC, verified correct against `electron/keyboard.js`), C64 (this rewrite).
- **Audit + doc sync (12/06/2026)** — post-Stella-migration sweep. No orphan files: javatari fully removed, all 7 EJS cores referenced, the `stella/` bundle wired (10 gamedocs = 10 `games.json` keys), no junk/backups. Stale-text fixes: the `genx-ejs-boot.js` header still said "7 VICE-family + Coleco bundles" (stale since the PET migration off VICE, and missing Stella) — corrected to "6 VICE + ColecoVision + Atari 2600 (8 genxBootEJS users; NES keeps its own boot)". Wiki had five stale EJS-bundle-count claims ("8 bundles share" / "Eight of these") — bumped to nine and the cores list given Stella; the File-Structure bezel line ("PC.png live; others staging") refreshed to the five wired. README/ATTRIBUTION verified current (19 engines / 28 sub-systems / 9 EJS bundles; bezel section five-wired).
- **Audit + doc sync (11/06/2026)** — orphan-file and stale-text sweep. Findings: (1) `ATTRIBUTION.md` bezel section said "four wired" — corrected to five (`80s.png` → atari800 shipped this session) and refreshed the `80s.png` row (it was swapped to the wood-cabinet OBS TV) with the no-graphic-provenance policy noted. (2) **jsbeeb's 20 per-game `gamedocs/jsbeeb/*.html` were runtime orphans** — now wired (see the entry above) rather than deleted. (3) The wiki's `_genxGameKey` controls-link mechanism is fictional — it exists nowhere in code; amstradcpc/jtyone gamedocs actually resolve because their URL rewrite sits behind an awaited `fetch`, so the deferred `genx-controls-link.js` reads `?game=` first. Wiki corrected separately. No orphan assets/cores/ROMs found elsewhere; README counts (20 engines / 28 sub-systems / 8 EJS bundles) verified current.
- **Amstrad CPC controls page** rewritten — the old `controls.html` claimed the cursor keys/Space were mapped to the 9-pin joystick port. No game passes `?joystick`, so the port isn't emulated; keys arrive as the CPC's own keyboard. Reframed as host→CPC keyboard with the full mapping from `cpc.c` (cursor keys, Space, Enter, Shift, Esc/BREAK, DEL/clear, F1–F10 keypad) and the F1 browser-intercept caveat.
- **Elite (CPC) gamedoc** rewritten — the previous controls were BBC/C64-derived (F1–F4 views, F5–F9 charts). Transcribed the actual Amstrad CPC Firebird quick-key card: views `1`–`4`, charts/trading on the number row (`5`–`9`, `0`, `F` Find Planet), flight `S`/`X`/`<`/`>` or arrows, `J` torus / `H` hyperspace / `G then H` intergalactic, combat `A`/`T`/`M`/`U`/`E`/`Tab`/`Esc`, game `Del`/`Clr`/`@`, plus the frozen-only option toggles. Also corrected the start state (begins docked, `1` to launch), the save-only-while-docked tip, and the single-planet-per-system mining note.
- **PET keyboard, full rewrite** — `Enter` now produces Return, letters type as themselves, no stuck keys, no input delay. (Root cause was upstream-libretro and unfixable without recompiling the core; the migration above sidesteps it.)
- **Frogger boot crash on PET** — Skibo's `pet2001io.js` reads VIA timer-2 latch-low (`via_t2ll`) at line 679 but never declares it with `var`. In sloppy mode the first write at line 552 would implicit-global it, but Frogger reads before writing, so the read crashes with `ReferenceError`. Added the missing `var via_t2ll = 0xff;` declaration plus a matching reset line. Two-line patch, fixes Frogger and any future title that reads T2 before writing.
- **Doc sync after PET migration** — `README.md`, `ATTRIBUTION.md`, the PET menu in `prompt/javascript/fs.js` (Star Trek slotted in at position 1, PETSCII Robots row removed, numbering shifted), and four wiki pages (`Roadmap`, `File-Structure`, `Virtual-Filesystem`, `Emulator-EmulatorJS-NES-FCEUmm`) all updated to describe PET as Skibo / 4 VICE cores instead of 5.
- **Audit doc sweep (10/06/2026)** — the PET migration pushed the engine count 19 → 20 (pet2001 is now a standalone engine, no longer riding EmulatorJS). Corrected the lagging "19 emulators" / "5 VICE cores" / "nine bundles share EJS" claims across `README.md`, `Project-Overview`, `Home`, `Roadmap`, `Emulators`, `Emulator-VICE-family`, and `File-Structure`. Untracked staged bezel `_shared/bezels/Pet.png` committed to complete the set. Refreshed the ATTRIBUTION bezel section: 10 bezels now, `PC.png` + `Acorn.png` wired (the rest staging), `Pet.png` row added. Added the generic "original photographer unknown — open an issue if you recognise your work" bezel credit as an HTML comment at the foot of `prompt/index.html` (PC) and `emulators/electron/play.html` (Acorn) — comment rather than visible text since both are fullscreen immersive pages.

### Added
- **Electron (ElkJS) bezel + audio auto-unlock** — `emulators/electron/play.html` now wraps the canvas in the standard three-layer order (`.screen-bg` z:1 → canvas z:2 → `Acorn.png` z:3) inside a `.bezel-wrap` sized via `min(100vw, calc(100dvh * 835 / 719))`. Body gets the 70s wallpaper. Sound: `_autoUnlockSound()` fires `elkjs.soundToggle()` at 0/100/500/1000/2000 ms on DOMContentLoaded; the original keydown fallback kicks in only if the burst missed the window.open activation window. Second emulator to validate the bezel pattern after jsbeeb.
- **jsbeeb dist chrome strip + bezel order + audio auto-unlock** — `dist/index.html` hides upstream `#header-bar` and `#leds`; wallpaper paints on body; standard three-layer order inside `#cub-monitor` (black `::before` at `inset: 5%` z:1 → canvas z:2 → CUB PNG z:3, `pointer-events:none` on the PNG so clicks reach the canvas). Audio unlock: jsbeeb only resumes its `AudioContext` on `mousedown` to `#audio-warning`, so we (a) forward any page mousedown to the warning and (b) fire optimistic mousedowns at 0/100/500/1000/2000 ms on `DOMContentLoaded` so the user-gesture from the prompt's `window.open()` click can propagate through. Confirmed working 10/06/2026.
- **70s tile wallpaper** — `emulators/_shared/textures/70s-bg.png` (1016×960, seamless 70s arrow-arch pattern) tiled at 220px as the body background. Applied via `genx-controls.css` so the DOS prompt page + all gamedocs inherit. Surrounds the centred IBM PC bezel on the prompt view; sits behind the centred `.wrap` on gamedoc pages.
- **`body.controls-page` override** in `genx-controls.css` — suppresses the wallpaper on the 24 per-platform `controls.html` pages so the keyboard tables stay on a flat `#0a0a0a` background. The class is set on each `<body>` directly. *(Superseded — see "Wallpaper dropped from all doc pages" below.)*
- **Centred menu boxes** — all 38 menu screens in `prompt/javascript/fs.js` now centre their box-drawing artwork in the 80-column grid (per-box indent computed from the box's max width). The `C:\>` prompt line itself stays left-aligned.
- **IBM PC bezel for the DOS prompt** — `prompt/index.html` now embeds the shared `PC.png` bezel and scales the 80×25 grid into the screen cutout. Non-uniform `transform: scale(sx, sy)` stretches the 960×300 prompt to fill the cutout in both axes — period-accurate for VGA text mode which used non-square pixels. Auto-scroll via MutationObserver keeps the cursor row visible as new lines render. Resizes cleanly with the browser window.
- **Three explicit layers behind the bezel** — `.screen-bg` (back, 90% of the bezel-wrap, solid black) → `.prompt-fit` (canvas, sized to the cutout, the prompt grid lives here) → `.bezel-img` (front, PC.png on top). The black backdrop blocks the wallpaper from bleeding through the PNG's anti-aliased cutout boundary.
- **AMI Megatrends logo proportions match the stretched grid** — sized to 205×51 (½ width, ⅜ height of the source 409×136) so it doesn't appear elongated when the rest of the screen is non-uniformly scaled.

### Removed
- **Tseng ET4000 video BIOS POST lines** from the boot sequence — `init.js` now goes straight from the AMI logo to the AMIBIOS system POST.

### Changed
- **Wallpaper dropped from all doc pages** — `_shared/genx-controls.css` body rule no longer paints the 70s tile. Removes the wallpaper from all 24 `controls.html` pages **and** all 281 `gamedocs/*/*.html` pages in one shot; keyboard tables and game instructions now sit on a flat `#0a0a0a` background, which keeps the dense table content legible. The earlier `body.controls-page` override + class on each controls.html body is now redundant — both removed. Wallpaper still tiles on the DOS prompt, jsbeeb dist, and Electron play.html.

### Fixed
- **Electron function-key references in `gamedocs/electron/elite.html`** — the BBC Elite manual's <kbd>f0</kbd>–<kbd>f9</kbd> labels were carried over wholesale, but the Electron has no F-keys at all. ElkJS already maps PC <kbd>Alt</kbd> → Electron FUNC (the orange key), which is how Electron software reaches f0–f9 in practice. Rewrote all 9 references in Elite to use <kbd>Alt</kbd>+<kbd>N</kbd> directly. controls.html keyboard table now spells out the Alt → FUNC mapping with the BBC <kbd>f7</kbd> → <kbd>Alt</kbd>+<kbd>7</kbd> example.
- **Electron sound (upstream `sound.soundInit` missing)** — `elkjs.js:143` calls `sound.soundInit()` on first `soundToggle()`, but the method was never defined in `sound.js` — upstream's keydown path threw `TypeError` and audio never enabled for anyone. Added `self.soundInit = function () { if (audioContext.state === 'suspended') audioContext.resume(); }` to `sound.js`. Combined with the `_autoUnlockSound` burst from DOMContentLoaded, audio now starts on tab open via the prompt's `window.open` user-activation propagation.
- **Controls-link readability over wallpaper** — `genx-controls-link.css` dropped the element-level `opacity: 0.5` + translucent `rgba(0, 0, 0, 0.55)` background combo (which let the 70s pattern bleed through). Now solid `#000` background with a thin amber border, muted `rgba(255, 176, 0, 0.75)` text. Hover brightens to full `#ff8800` on both text and border. Affects every emulator entry HTML site-wide.
- **Double prompt after closing an emulator tab** — `commands-core.js` close-handler now just re-runs `menu` in place instead of `cd ..; menu`. The old sequence trampolined through the parent's menu.bat (which itself `cd`s into the games dir and re-runs `menu`), and the trailing `echo.` on each layer toggled `bEchoOff` plus triggered an extra `prompt()` at the end of `handleCmd`, producing two prompt lines on return.
- **Audit sync (09/06/2026)** — `ATTRIBUTION.md` bezel section updated to reflect PC.png landing on the DOS prompt. Stale `init.js` POST-flow comment that still referenced the (removed) Tseng line trimmed. No code-path changes.

### Changed
- **Site JS beautified** — `prompt/javascript/*.js`, `emulators/_shared/*.js`, `emulators/_shared-ejs/genx-ejs-boot.js`, and the inline controls-link injector in `apple2/play.html`. Run through `js-beautify` (4-space indent). No behaviour changes; same modules, same exports.

### Fixed
- **Vectrex focus-loss auto-resume** — synthetic Escape `keyup` dispatched on `window.focus` triggers the runtime's existing `Mu()` handler, which closes the (internally-open) menu and calls `start()` after 300 ms. No more manual ESC press needed after clicking away.
- **JS7800 F-key reference** — platform `controls.html` + 10 gamedoc pages had F3 and F4 swapped. F3 is the Reset switch (= start the game on most carts); F4 is Pause. Corrected throughout.

### Changed
- **README rewritten in casual journey-style voice** to match the wiki. No content removed; same lineup table, URL patterns, and licence list, just framed as a project narrative.
- **CHANGELOG de-cluttered** — trimmed verbose entries to release-note form. Deep recipes live in the wiki now.

### Added
- **Mobile-device block** — touch-only devices see a full-screen "Desktop Only" overlay via `@media (pointer: coarse), (hover: none)` + `body::before`. 24 emulator pages inherit it from `_shared/genx-noscript.css`; three outliers (root + prompt + jsbeeb dist index) get an inline copy. z-index 999999 sits above the corner controls link.
  - Loosened to comma (OR) shortly after first commit — iPadOS reports `pointer: coarse` + `hover: hover` so the `and` form was skipping iPads.

### Removed
- **js99er upstream-UI orphans (11 files, ~200 KB)** at `emulators/js99er/` — `ams.js`, `googledrive.js`, four bootstrap variants, `fileSaver.js`, `imageMapResizer.js`, two unused zip features. Kept `lib/zip/inflate.js` (it's the `.rpk` worker).

### Fixed
- **Fourth doc-sync audit (08/06/2026)** — README MSX line still mentioned MSX2+; bumped Virtual-Filesystem sub-system count 27 → 28; dropped TI-99/4A from Roadmap "Plausible" (now shipped).

### Added
- **Texas Instruments TI-99/4A** at `emulators/js99er/` (Rasmus Moustgaard's Js99'er, vanilla-JS, GPL-2.0) + 10 `.rpk` carts. New HOMECOMP entry **TEXAS / TI99 (1979)**. play.html falls back to the TI title screen when no cart is specified.
- **TI-99/4A gamedocs (10 pages)**. Parsec gets a laser-overheat note; Tunnels of Doom has a separate combat-key table; Microsurgeon gets a tool-select reference. **Gamedocs sweep stays complete: 28 / 28 sub-systems, 281 pages.**

### Changed
- **HOMECOMP parent menu** — added row 9 "Texas (1979) TI99" between Tandy and the back-row sentinel. Column widths preserved at 45 chars.

### Added
- **Tandy CoCo gamedocs (10 pages)** at `gamedocs/xroar/`. Daggorath gets a dedicated typed-command reference. XRoar preserves `?game=` so no `fs.js` wiring needed. **Gamedocs sweep complete: 27 / 27 sub-systems, 271 pages.**

### Added
- **MSX2 gamedocs (10 pages)** at `gamedocs/webmsx/` — covers Konami's MSX2 peak (Vampire Killer, Metal Gear, etc.) through Compile's Aleste and SD Snatcher. Each `.bat` launcher appends `&game=<key>` so the lowercase resolver picks up the right page.

### Changed
- **`prompt/javascript/fs.js`** — appended `&game=<key>` to MSX2 `.bat` launchers (including SD Snatcher's `?ANY=…` disk-set variant). Pure documentation glue.

### Added
- **MSX1 gamedocs (10 pages)** at `gamedocs/webmsx/` — 10 Konami MSX cartridges covering the formative 1983-86 era. `.bat` launchers append `&game=<key>` because WebMSX's `?ROM=` is uppercase and `URLSearchParams.get('rom')` wouldn't match.

### Changed
- **`prompt/javascript/fs.js`** — appended `&game=<key>` to MSX1 `.bat` launchers (documentation glue).

### Added
- **Commodore 128 gamedocs (10 pages)** at `gamedocs/c128/`. Each page indicates VICII (40-col) vs VDC (80-col), matching the `video` field in `games.json`.
- **Commodore Plus/4 gamedocs (10 pages)** at `gamedocs/plus4/`. Auto-linked from each game's controls badge.

### Removed
- **jsvecx upstream alternate entry points** at `emulators/jsvecx/` — `rtm.html`, `seamless.html`, `vectrex.html`, two overlays + 7 JS/CSS dependents (~127 KB). Kept `js/rtm.js` + `css/rtm.css` (Show Chips), full `bios/`/`img/`/`roms/`. HTTP 200 on `index.html` + all menu URLs confirmed post-delete.

### Added
- **`emulators/apple1/controls.html`** — Apple I keyboard / Woz Monitor / Integer BASIC reference. Resolves the 404 in the Woz Monitor prompt corner link.

### Fixed
- **Third doc-sync audit (08/06/2026)** — ATTRIBUTION ElkJS jQuery row had wrong path + version; README Vectrex URL pattern missing `&game=<key>`; wiki MSX list still mentioned MSX2+; MAX cart count, jsvecx ROM count, gamedocs progress numbers refreshed.
- **Second doc-sync audit (07/06/2026)** — README atari800 "10 disk/cart titles" was 11 (Choplifter added); MAX line "8 .crt carts" → 10 carts (Mole Attack + Money Wars); atari800 AltirraOS clarified as embedded in WASM not separate ROM; EmulatorJS sharing line missing FCEUmm; ATTRIBUTION rows for the two nonexistent AltirraOS `.rom` paths removed.
- **First doc-sync audit (07/06/2026)** — README `_shared-ejs/` missing FCEUmm; Vectrex "~100 ROMs" was ~500; ATTRIBUTION cores rows pointed at pre-dedupe path; ColecoVision BIOS path corrected; wiki Emulators intro 8 → 9 bundles; shared-dir size 9 MB → 11 MB.
- **PET menu BASIC label** — said "BASIC 4 prompt"; the entry boots PET 3032 (BASIC 2). Swapped to "BASIC 2 prompt"; same 14-char length.
- **`emulators/pet/controls.html` was stale** — described 4032/BASIC 4 with `DIRECTORY`/`DLOAD"name"` shortcuts that don't exist in BASIC 2. Rewritten for BASIC 2 with the PETSCII Robots 4032 override called out.
- **`emulators/amstradcpc/controls.html` was stale** — described CrocoDS + EJS toolbar; actual bundle is tiny8bit. Rewritten to match the real bundle (PgUp/PgDn→Space remap, page-reload reset, no in-canvas reset button).

### Changed
- **Top-level EMULATOR LAUNCHER spacing** — added a blank row between each entry. Previously only the WIKI entry had a separator above it.

### Added
- **MAX gets 2 more carts: Mole Attack + Money Wars** — bank-extracted from the [MultiMax EasyFlash compilation](https://csdb.dk/release/?id=210760) by screen-code PETSCII fingerprinting (bank 17 = "MOLE", bank 18 = "MONEY"). Wrapped as 8 KB Ultimax-mode `.crt`s. Commercial count: 8 → 10. Tried Mr. T.N.T. first (turned out to be a 1983 HesWare C64 cart, not MAX); Sea Wolf + Le Mans present on MultiMax but their banks lack identifiable strings.

### Changed
- **`emulators/atari800/play.html` canvas fills viewport** at 4:3 (`width: min(98vw, calc(98vh * 4 / 3))`) instead of rendering at native 336×240. Tried `transform: scale(2)` first; canvas overflowed `body{overflow:hidden}` and only a corner pixel showed.

### Added
- **Choplifter! added to Atari 400** — 16K Brøderbund cart (1982), `cartType: 2`. 11th game in the Atari 400 menu. New `gamedocs/atari800/chopliftr.html` (shared between 400 + 800XL).
- **Commodore 16, C64, MAX, VIC-20, PET gamedocs (10 each)** — same template as the other platforms. C64 notable: Impossible Mission's "Stay a while" digitised sample puzzle, Elite's full Cobra Mk III keymap, Wizball's colour-mix mechanic, Last Ninja walk/combat toggle. PET notable: PETSCII Robots' per-game `model: 4032` override and ~30 s authentic 1541 boot sound.
- **Amstrad CPC gamedocs (10 pages)** at `gamedocs/amstradcpc/`. Each documents the autoboot behaviour (tiny8bit's sokol_args `input=run"…` pre-types the boot command). `_genxGameKey` stash not yet wired; corner link still resolves because original `?game=` is read before the rewrite.

### Removed
- **Orphan upstream doc files** — `_shared-ejs/ejs/data/compression/README.md`, `localization/README.md`, `jsbeeb/dist/roms/README`. Per the no-docs-in-bundles rule.
- **Half-done JtyOne ZX80 wiring** — reverted. JtyOne's ZX80 mode has a display-sync bug (the `d` state machine is gated on `0 != zx81opts.machine`, so machine==0 never updates). zame-dev's `js-zx8x` works but lacks an SPDX header.

### Added
- **ZX81 gamedocs (10 pages)** at `gamedocs/jtyone/`. 3D Monster Maze page notes the no-sound design; Chess (Psion) covers the coordinate-notation parser. **Sinclair family now complete in the gamedocs sweep.**
- **ZX Spectrum gamedocs (10 pages)** at `gamedocs/jsspeccy/`. Knight Lore documents the Filmation isometric engine; Skool Daze covers the four-teacher puzzle.
- **BBC Master gamedocs (10 pages)** at `gamedocs/jsbeeb/`, prefixed `master-` to avoid collision with BBC Micro pages in the shared `jsbeeb/` platform dir. Acorn family now complete in the gamedocs sweep.
- **Acorn Electron gamedocs (10 pages)** at `gamedocs/electron/`. Filenames match the `?game=<key>` URL keys ElkJS uses (`chuckie.html` not `chuckegg.html`). Electron-specific footer notes the single-ULA quirks vs the BBC original.
- **LGR attribution** for the DOS terminal, virtual filesystem, and 12×12 CP437 font sprite system. The interactive prompt under `prompt/`, the `fs.js` virtual `C:` drive, the command dispatcher, and the CP437 sprite font originate from LGR's DOS-prompt project; GenX-DOS extends that base.
- **BBC Micro gamedocs (10 pages)** at `gamedocs/jsbeeb/`. Elite gets the full F0-F9 + chart + missile/ECM/hyperspace reference; Thrust documents the gravity/pod-swing physics; Exile flags the open-world map-as-you-go nature. Wiring caveat: jsbeeb's `?disc1=…&autoboot` URL carries no `?game=`, so the corner link still falls back to `controls.html`.
- **Atari 400 gamedocs (9 new pages)** at `gamedocs/atari800/` — Star Raiders already covered from the 800XL pass. Atari 8-bit family now complete in the gamedocs sweep.
- **`ATTRIBUTION.md` at the repo root** — canonical record of every third-party emulator, BIOS, ROM, bezel, font, and dependency, with source URL + author + licence. README's `## License` stays as a quick-reference.
- **Atari 800XL gamedocs (10 pages)** at `gamedocs/atari800/`. First home-computer platform completed in the gamedocs sweep.
- **Vectrex gamedocs (11 pages)** at `gamedocs/jsvecx/`. `fs.js` bat-links now pass `&game=<key>` (jsvecx ignores it) so the controls-link resolver picks up the clean key first instead of the messy `?rom=Commercial/...` path.
- **Atari 7800 gamedocs (10 pages)** at `gamedocs/js7800/`. js7800 preserves `?game=` alongside the auto-added `?cart=` so no extra wiring.
- **Atari 2600 gamedocs (10 pages)** at `gamedocs/javatari/`.
- **NES gamedocs (10 pages)** at `gamedocs/jsnes/`.
- **Intellivision gamedocs (10 pages)** at `gamedocs/intellivision/`. Console-specific footer documents the 16-direction disc + 3 side buttons + 12-key keypad.
- **ColecoVision gamedocs (10 pages)** at `gamedocs/coleco/`.
- **Odyssey² gamedocs (10 pages)** at `gamedocs/odyssey2/`.
- **Magnavox Odyssey²** at `emulators/odyssey2/` via libretro-o2em compiled to WASM (GPL-2.0+). EJS path rejected first — vanilla libretro cores fail because EJS forks each core to add EJS-specific helpers (`system_restart`, `simulate_input`, etc.). Custom SDL2/emscripten frontend (`frontend.c`, ~200 LOC) statically linked. 10 first-party + Imagic titles. `o2rom.bin` BIOS bundled.
- **Acorn Electron** at `emulators/electron/` via ElkJS (Darren Coles). 10 UEF snapshots + Electron BASIC. CRT raster scanline effect removed from `display.js` (row doubling).
- **BBC Master 128** under ACORN — same jsbeeb with `?model=Master`. 10 Master-enhanced titles (Elite Master uses DSD for `*DRIVE 2`).
- **Apple I restored** under APPLE parent menu (Apple I + Apple ][+). Hint text overlay hidden via CSS.
- **Per-game instruction pages** at `gamedocs/<platform>/<key>.html`. `genx-controls-link.js` reads `?game=`/`?tape=`/`?rom=` and routes to the matching page, falling back to `controls.html` for prompt entries. Completed: Apple I, Apple ][.
- **Amstrad CPC** at `emulators/amstradcpc/` via EmulatorJS + Caprice32 (later swapped to tiny8bit — see below). CPC 6128 + Locomotive BASIC 1.1. 10 first-in-series TOSEC classics.
- **Mattel Intellivision** at `emulators/intellivision/` via jzIntv WASM. EJS doesn't ship an Intellivision core, so this bundle has its own emscripten Module loader + `Module.launchJzintv()` API. Custom `desk.kbd` adds arrow→disc + numpad→keypad bindings the stock map omits. BIOS (exec.bin + grom.bin, ©1979 Mattel) bundle-local.
- **Commodore 128** at `emulators/c128/` via VICE x128 — seventh and final VICE-family sub-system. Native mode (`vice_c128_go64: 'disabled'`). Per-game `video` field toggles `VICII` (40-col) vs `VDC` (80-col). CSS `scaleY(2.088)` hack on the canvas works around VICE x128's 856×288 framebuffer letterboxing inside the 4:3 container.
- **`_shared/genx-vice-softkeys.js`** — keyboard remap + soft button for VICE RUN/STOP. Browsers capture Esc before the libretro keyboard callback sees it, so synthetic Escape gets dispatched from three fallbacks: Scroll Lock, Pause/Break, and a top-left soft button. Wired into all 7 VICE play.html.
- **Commodore PET** at `emulators/pet/` via VICE xpet. Default = model 3032 (BASIC 2 chargen); 4032 broke 9/10 bundled games with garbled PETSCII. PETSCII Robots gets a per-game `model` override (needs BASIC 4 + 32K + ships TILESET.PET). 10 games sourced from `zimmers.net` + PETSCII Robots from the8bitguy.com. **Skipped:** Microchess 2.0, 3D Star Trek, Cosmiads (non-standard load addresses VICE doesn't autostart).
- **Commodore MAX Machine** at `emulators/max/` via VICE x64 in Ultimax mode (`vice_c64_model: 'ultimax'`) — 2 KB RAM, no built-in BASIC. 8 carts + MAX BASIC. Sources: 3 TOSEC + 1 Internet Archive Slalom + 5 bank-extracted from the MultiMax EasyFlash compilation (CSDb 210760). Wrapped as proper Ultimax-mode `.crt`s; 16K MultiMax banks split $8000+$A000 in EasyFlash addressing become $8000+$E000 in Ultimax mode.
- **Commodore 16** at `emulators/c16/` via VICE xplus4 in C16 mode (`vice_plus4_model: 'c16pal'`) — 16K RAM. 10 first-in-series UK-budget titles from plus4world.com. Bundle structure cloned from `emulators/plus4/` so the self-containment patches carry over for free.
- **Commodore Plus/4** at `emulators/plus4/` via VICE xplus4. 10 first-in-series classics. BASIC entry uses a Plus/4-specific empty.prg (load address `$1001` for BASIC 3.5).
- **Commodore VIC-20** at `emulators/vic20/` via VICE xvic. 10 cart classics. `vice_vic20_memory_expansions: 'all'` gives full 35K expansion.
- **Commodore 64** at `emulators/c64/` via EmulatorJS + VICE x64. 10 `.d64` classics + BASIC. Replaces the prior archive.org-iframe wrapper. Long iteration history (vc64web → chips → IA iframe → EmulatorJS) recorded in memory.
- **Atari 400** — reuses the atari800 WASM build, `?machine=atari` boots OS-B/AltirraOS-800 instead of XL's AltirraOS-XL. 10 cart-era classics distinct from the 800XL list.
- **Atari 800XL** at `emulators/atari800/` — atari800 v5.2.0 built from source to WASM via emscripten. AltirraOS-XL 3.41 baked in (`--enable-altirra_bios`). 10 first-in-series classics. **Star Raiders gotcha:** the `a8b_Star_Raiders_*_k_file` 8.7 KB `.atr` is a cart-in-disk wrapper that boots to a CIM; switched to raw 8 KB `.rom` + `-cart-type 1`.
- **Per-emulator controls reference pages** at `emulators/<name>/controls.html`. Shared dark-amber DOS-flavoured style.
- **Corner controls link** on every emulator's entry HTML — fixed bottom-right, semi-transparent, amber, Wikipedia-style external-link SVG icon. Single shared `.gx-controls-link` class.
- **Atari ST** at `emulators/estyjs/` via EstyJS 2.0 (later removed in scope tightening). EmuTOS bundled. 14 JS modules inlined in upstream order, then `estyjs.openFloppyFile('A', urlString)` after 1.5s.
- **ATARI\ST submenu** with 10 first-in-series ST classics (later removed).
- **Sinclair ZX81** at `emulators/jtyone/` via JtyOne. **Three gotchas:** custom `.hex` tape format (`xxd -p | tr -d '\n'`); `FileToLoad` opens ROM URLs with a hardcoded leading slash; the error path references an undefined `statusLabel`.
- **ZX81 submenu** — 10 native classics from `zx81stuff.org.uk` (~140 KB total).
- **Sinclair Spectrum** at `emulators/jsspeccy/` via JSSpeccy 3 v3.2 (WASM Z80 in Web Worker). 5 ROMs + 5 tape-loader SZX snapshots. **Quirk:** despite `autoStart: true`, JSSpeccy3 always shows a play-button overlay because Web Audio needs a user gesture.
- **SPECTRUM submenu** — 10 first-in-series `.z80` snapshots (instant boot past the tape-loading screen).
- **Atari 7800** at `emulators/js7800/` via JS7800 v0.0.9. **Gotcha:** upstream ships `bupboop.wasm` (~590 KB YM-2151 emulator) referenced by `bupboop.js` but not listed in the `<script>` tags — easy to miss; without it, `RuntimeError: abort` on every cart load.
- **ATARI 7800 sub-system restored** under CONSOLE\ATARI. 10 first-in-series / arcade-port classics. **Sourcing gotcha:** archive.org's bare `download/...` paths intermittently return 500 HTML pages; fall back to `archive.org/cors/...`.
- **Tandy Color Computer** at `emulators/xroar/` via XRoar v1.10. **Three gotchas:** (1) WASM doesn't ship system ROMs — mirror them alongside; (2) requests use absolute paths like `/d64_1.rom`, needs a `Module.locateFile` shim; (3) upstream defines 15 `ui_*` callbacks the WASM invokes — without them, silent halt. Stubbed all 15 as no-ops.
- **COCO menu** — 10 cartridge classics + PROMPT. **Gotcha:** CCA's `xroar-online/` deploy is CORS-locked to `6809.org.uk` so we mirror, never hotlink.
- **Acorn Archimedes** at `emulators/archimedes-live/` (later removed in scope tightening). Local-domain fallback paths meant no patches needed.
- **ARCHIMEDES menu** with 10 titles + DESKTOP entry (RISC OS is GUI, not PROMPT). Lander = the first-ever Archimedes game.
- **MSX** at `emulators/webmsx/` via WebMSX. Single 5 MB `index.html` with engine + UI + BIOSes inlined. Stripped Google Analytics.
- **MSX menu**, later split into MSX1 + MSX2 sub-systems (10 + 10 Konami carts).
- **DUKE submenu** under EMULATORS\DOS — Duke Nukem 1/2/3D (later removed in scope tightening).
- **KEEN submenu** under EMULATORS\DOS — Commander Keen 1-6 + Keen Dreams (later removed in scope tightening).
- **SMITH ENGINEERING category** under CONSOLE — Vectrex at `emulators/jsvecx/`. 10 commercial classics.
- **Javatari** at `emulators/javatari/` (AGPL-3.0, pure-JS Atari 2600). 10-entry catalogue.
- **lrusso/Genesis** at `emulators/genesis/` (later removed in scope tightening). 15-entry Genesis catalogue.
- **JSBeeb** at `emulators/jsbeeb/` v1.12.0; `dist/` built locally. 15 BBC discs same-origin (no `stairwaytohell.com` runtime fetches).
- **JSNES** at `emulators/jsnes/` v2.1.0. 18 NES ROMs from archive.org. EmulatorJS attempted first and dropped — its loader's `"../"` path-prepend rendered a blank screen.
- **`find <word>` / `find "<phrase>"`** — walks the virtual FS recursively, parses each `menu.bat` for human-readable titles, reports `GAMES` + `MENUS` sections.
- **`serve.sh`** — picks port 8765, traps SIGINT, opens browser to `/prompt/`.
- **`<noscript>` overlay** on all HTML entry points — fixed-position black-on-grey monospace.
- **Single-page boot animation** — AMIBIOS POST, 4 s pause, System Configuration table, EMULATOR LAUNCHER drawn below (no `cls`, table stays on screen alongside the menu like a real DOS boot). Tseng Labs ET4000 video BIOS line prepended; memory test animates as a 4-digit counter every 32 ms to `8064 KB OK`.

### Changed
- **ATTRIBUTION.md bezel section expanded** — the 8 OBS bezels were sourced via Reddit/forums; EXIF stripped, original photographers unreachable. Hardware identified by visible markings (Microvitec CUB, IBM 5153 CGA, Commodore 1084S, Apple Monitor ///). Wikimedia replacement candidates logged where available.
- **Amstrad bezel** — desk-shot swapped for a tight CTM640 cutout (Wikimedia Commons CC-BY-SA 2.5, Bill Bertram). Screen cutout now dominates the frame.
- **Bezel staging** — replaced 8 auto-named stock images with 9 cleanly-named PNGs from `/mnt/multimedia/Assets/OBS/Bezels/`. Pure asset swap.
- **NES Duck Hunt → Super Mario Bros. 2 (1988)** — Duck Hunt needs the Zapper, which `play.html` doesn't wire.
- **`commands-core.js` `find()` comment** — example string referenced the removed Genesis bundle. Swapped to "Cybernes".
- **Scope rule formalised: 8-bit era only.** Cutoff is era, not strict bit-width. Intellivision (CP1610 16-bit ALU) is in; Genesis/SNES/ST/Amiga/Mac/Archimedes are out.
- **Vectrex `#menu` overlay hidden** via CSS. Focus-loss pause documented in `controls.html` + 11 gamedoc footers (runtime `start` symbol isn't reachable from outer scope).
- **Vectrex fs.js bat-links** now append `&game=<key>` so the gamedocs resolver gets a clean key.
- **All game menus reformatted to 4-column `# Title (Year) CODE`**, sorted by year ascending, alphabetical within year. 600 echo rows verified at exactly 45 chars across 26 platforms.
- **ZX81, NES, Vectrex, ColecoVision, Intellivision, CoCo, Atari 2600, Atari 7800 menus** — reformatted with researched release years, re-sorted, bat-file order remapped.
- **BBC Master "By Fair or Foul" → "Fair or Foul"** — single-distinctive-form style match.
- **Duke Nukem + Commander Keen submenus** — inline `(YYYY)` moved to year column.
- **Top-level HOMECOMP + CONSOLE menus gained `(YYYY)` column** — earliest 8-bit machine per manufacturer.
- **HOMECOMP + CONSOLE sorted alphabetically (non-recursive).**
- **Platform parent menus normalised to `(YYYY) CODE`** — `[GAMES]` markers removed; Sinclair reordered so ZX81 (1981) precedes Spectrum (1982).
- **Master-Enhanced Titles masthead** — was 46 chars; back to 45.
- **Vectrex Mine Storm row** — was 44 chars; back to 45.
- **C128 indie release dates researched** — `(home)` → `(indie)`. 128 Crush 1985, Knight's Quest 1991, Tetris 128 1991 confirmed from internal stamps. Phazer, Rockfall 128, Wumpus 2.0, World at War have no stamp — fall back to zimmers.net mtimes.
- **ACORN parent menu** created — BBC Micro, Electron, Master grouped under one ACORN entry.
- **HOMECOMP grouped by manufacturer, sorted by release date.** "Atari Consoles" / "Atari Home Computers" shortened to "Atari".
- **CONSOLE sorted by release date.**
- **Vectrex Mine Storm moved to built-in slot (#11)** since it's the bundled ROM. Scramble (1982) added as game #10 to fill the freed slot.
- **7 off-centre menu mastheads fixed** — Commander Keen, Master-Enhanced, PET, C128, Atari 400, MSX1, MSX2.
- **Amstrad CPC core swapped: EmulatorJS + Caprice32 → floooh/tiny8bit** (MIT). cap32 aborted with `getControllerPortInfo undefined`; crocods autobooted but exposed no skip-catalog API; cpcbox was minified+obfuscated. tiny8bit takes `?file=` + `?input=` URL params via sokol_args; play.html rewrites our `?game=` before WASM init. PgUp/PgDn remapped to fire (synthetic Space).
- **CPC Sorcery → Elite (1985 Firebird).** Sorcery's TOSEC release is French-only.
- **Drive-change commands (`A:`, `D:`, etc.)** now reply "Drive not ready." Period-correct DOS message; `C:` stays silent.
- **NES emulator swapped: `bfirsh/jsnes` v2.1.0 → EmulatorJS + FCEUmm.** Audio quality (jsnes used `ScriptProcessorNode`). Dir name kept to avoid every `fs.js` link changing. `EJS_defaultControls` swaps B/A on `x`/`z` to preserve previous muscle memory.
- **Flattened single-platform manufacturer menus** in CONSOLE/HOMECOMP — removed the pass-through middle level for NES, GENESIS, INTV, CVISION, ODYSSEY2, VECTREX, COCO.
- **"Odyssey 2" → "Odyssey²"** in all CONSOLE menus. The renderer maps JS char codes to sprite indices directly, so the menu strings store `ý` (U+00FD = 253) which renders as the CP437 superscript-2.
- **`find odyssey…`** matches the Odyssey² entry regardless of suffix.
- **Investigated suppressing the visible `RUN` + duplicate `READY.`** on VICE BASIC entries. Tried 6 approaches (libretro `vice_autostart='disabled'`, EJS null-`EJS_gameUrl` guard, `disableLocalStorage`, `PRINT CHR$(147)`, `10 SYS <reset-vector>`). All 6 broke a different machine. Reverted to the 4-byte `empty.prg` stub.
- **EmulatorJS framework deduplicated** to `emulators/_shared-ejs/ejs/data/` across 7 VICE bundles. Cores deduplicated too: c64+max share `vice_x64`, plus4+c16 share `vice_xplus4`. **Saved ~12.6 MB** (later grew to ~25 MB once Coleco + NES joined).
- **VICE keyboard + joystick now coexist** across all six CBM bundles. `keyboardInput: 'enabled'` + `altKeyboardInput: 'enabled'` (typed keys → VICE) + `vice_joyport_type: '1'` (Numpad → VICE joystick port). Disjoint key sets. `genx-numlock-warn.js` warns on the first keydown if NumLock is off. **localStorage caveat:** anyone who tested earlier broken builds needs `localStorage.clear()` + IndexedDB delete.
- **Site is now fully self-contained at runtime.** Audit eliminated three external references: EmulatorJS version check (`checkForUpdates()` → `return;`), Javatari NetPlay relay (`SERVER_ADDRESS = ""`), jsbeeb Google Fonts `@import` (stripped from the Vite-built CSS).
- **All game files locally hosted** across 16 emulator bundles (audit verified each `games.json` + URL-param launchers). No external image/audio/video/iframe/service-worker/web-font remains.
- **C64 loading audible and real-time.** `vice_drive_true_emulation=enabled`, `vice_drive_sound_emulation=1000%`, `vice_autoloadwarp=disabled`. ~30 s of period-authentic IEC activity. Three discoveries from the runtime log: the sound option is a PERCENTAGE not on/off; warp-during-autoload is `vice_autoloadwarp` not `vice_autostart_warp`; no separate volume knob exists.
- **C64 cold load** no longer falls through to `cdn.emulatorjs.org`. EJS picks the `-legacy-` variant by default when no per-core `reports/` JSON ships; mirroring only the non-legacy file 404s and falls through. Mirror the legacy variant. Net delta: -300 KB.
- **Menu column order flipped** — every row now reads `   N.  Title text                      CODE     ║` (title first). 228 entry rows across 37 menus.
- **Shared CSS extracted** to `emulators/_shared/genx-controls.css` + `genx-controls-link.css`. ~30 KB of repeated bytes removed.
- **WebMSX social-card metadata** repointed at the GenX-DOS Pages URL. Upstream WebMSX logo link kept.
- **Root-level menu skipped** — `c:\menu.bat` now does `cd emulators\nmenu` directly. Boot drops straight into EMULATOR LAUNCHER.
- **`echo on` → `echo.`** in fs.js batches (53 occurrences). DOS shorthand for "print blank line".
- **`COMMODORE` → `COMMODRE`, `ARCHIMEDES` → `ARCHIMDS`** so the displayed code matches the typeable command.
- **Project renamed DOS-Site → GenX-DOS.** GitHub repo moved; local clone relocated; old URLs auto-redirect.
- **GAMES menus trimmed to top-10 most popular titles.** NES dropped 8, Genesis 5, BBC 5, Atari 2600 8.
- **`PROMPT` entry added to BBC GAMES menu** — links to `dist/` with no `disc1` / `autoboot`. Other home computers got the same treatment as they were added.
- **AMIBIOS POST rebrand** — `AMIBIOS (C) 1985-1991 American Megatrends Inc.,`, `80486SX`, `8064 KB OK`, `Hit <DEL> if you want to run SETUP`, `40-0102-001102-00101111-121291-i486-K8` footer. Tseng Labs ET4000 video BIOS line prepended; memory test animates as a 4-digit counter.
- **Drive + port specs added** to POST + Configuration table: Floppy A `1.44mb (3.5")`, B `360kb (5.25")`, HDD C/D, COM1, LPT1. Detection lines stream at 500 ms intervals.
- **After the Configuration table renders**: two blank lines, `Starting GenX-DOS . . .`, 1 s pause, `Press F1 for help`, then the menu. Boot-end hint reads `Type "help" <enter> for assistance.` (F1 hijack is unreliable cross-browser).
- **`emulators/jsbeeb/` optimised: 71 MB → 27 MB.** Removed upstream dev infrastructure (`src/`, `public/`, `tests/`, `tools/`, `docs/`, `docker/`, `Dockerfile`, `Makefile`, dot-folders) and 18 sample/test discs not referenced.
- **README rewritten** to reflect all emulators. Wiki refreshed end-to-end.

### Removed
- **Sega Genesis** (`emulators/genesis/` + GENESIS submenu) — 16-bit (68000), outside 8-bit focus. ~20 MB.
- **Prince of Persia from CPC bundle** — replaced by 3D Construction Kit (1991 Freescape).
- **`emulators/jsbeeb/package.json`** — npm build manifest not used at runtime.
- **8 unused Apple I tape files** (cell, codebreaker, little_tower, matrix, shut, slots, startrek2003, wumpus). ~256 KB.
- **Acorn Atom** (jsbeeb Atom mode + tape files) — didn't meet quality bar. Reverted JS patch.
- **Macintosh, Acorn Archimedes, Atari ST, Commodore Amiga 500** — all 16-bit GUI-era removed under the scope tightening.

- **Apple ][+** at `emulators/apple2/` via [apple2js](https://github.com/whscullin/apple2js) (Will Scullin, MIT) — pure JS, no WASM. Apple ][+ 48 KB + Applesoft + Disk II. webpack 5 production build; CSS overlay hides every chrome element; `?game=` rewritten to apple2js's `?disk=`. 10 first-in-series classics + Applesoft BASIC, converted via `bin/dsk2json`. All sourced from the [4am preservation collection](https://archive.org/details/apple_ii_library_4am) except Karateka (TOSEC).
- **`emulators/_shared/genx-frame.css`** — universal frame styles (page reset, body flex-centring, `.err`, `.loading`) extracted from 11 play.html files. Bundles with custom body layouts (atari800, jsspeccy, jtyone, genesis, javatari, js7800, xroar) keep their inline CSS unchanged.
- **BASIC prompt entries** for Spectrum / ZX81 / CPC. amstradcpc/play.html needed a no-game branch (skip `genxLoadGame()`, let cpc.js init with empty sokol_args). Coverage: 11 platforms.
- **168 external game-link `.bat`s** — vizzed.com / free80sarcade.com / c64online.com / archive.org / zx81stuff.org.uk / colorcomputerarchive.com. Replaced with bundled emulators.
- **Upstream-only files** from copied bundles (~1.85 MB reclaimed): `.claude/`, `.gitignore`, `README.md`, `.js.map` × 3 source maps (1.77 MB), `LICENSE.txt`. LICENSE/COPYING kept where present for GPL/MIT compliance.
- **Stale `c:\changes.bat`** — never referenced; superseded by this file.
- **`emulators/jsbeeb/index.html`** Google Analytics — `gtag` snippet for `G-Z9ZN3S7XRE` stripped; CSP tightened. `dist/` rebuilt.

### Fixed
- **C64 Elite stuck on Lenslok purple-screen loop** — bundled `elite.d64` was the uncracked 1985 Firebird release. Swapped for the GMA86 crack + Moxon flicker-free patch from [c64-elite-flicker-free](https://github.com/markmoxon/c64-elite-flicker-free).
- **5 disk-swap-requiring games swapped** for single-disk alternatives. Surfaced by user reporting Trinity (C128 D71 dual-sided) prompted for disk B mid-session.
  - C64: Bard's Tale → Boulder Dash (Bard's Tale was just the boot disk of a 4-side RPG).
  - C128: Trinity → Knight's Quest, Beyond Zork → Wumpus 2.0 (both D71 dual-sided).
  - ST: Monkey Island → Marble Madness (only 5 LFL files = most rooms missing); Carrier Command → Predator (unreadable root directory).
  - Defender of the Crown (ST) flagged but kept (158 KB with `PICS/` + `P/` subdirs that may contain the rest).
- **`vice_drive_sound_emulation` updated 1000% → 100%** — May 2026 VICE 3.9 build capped the option enum at 100%. Older value silently fell back to 20% default. Cross-checked against the libretro-vice master source.
- **C64 + VIC-20 BASIC entries** now boot to `READY.` Previous wiring (`play.html` with no `?game=`) hit a broken EJS code path (`download(undefined, ...)` → `startGameFromDownload(undefined)` throws inside an async IIFE, silent). Fix: ship 4-byte `empty.prg` + register as `"basic"` + point `.bat` at `?game=basic`.

### Documentation
- Top-level `README.md` describing the site layout, emulator integration recipes, menu structure, and jsbeeb URL semantics.
