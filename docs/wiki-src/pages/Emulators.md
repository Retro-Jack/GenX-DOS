19 emulator engines ship with GenX-DOS, driving 33 sub-systems between them. Some of the integrations were one-liners; others took a week of trial and failure. Every engine — plus each libretro core the shared EmulatorJS framework hosts — has its own integration story, so the index below runs to more rows than the engine count: one row per story page.

## The engines

| Article | Sub-systems |
|---|---|
| [[Emulator-XRoar-CoCo]] | Tandy Color Computer |
| [[Emulator-sdltrs-TRS-80]] | Tandy TRS-80 Model III |
| [[Emulator-VirtualT-Model-100]] | Tandy TRS-80 Model 100 |
| [[Emulator-atari800]] | Atari 400, Atari 800XL |
| [[Emulator-VICE-family]] | VIC-20, MAX, C64, C16, Plus/4 |
| [[Emulator-pet2001-Skibo]] | Commodore PET 2001 |
| [[Emulator-gearcoleco-ColecoVision]] | ColecoVision |
| [[Emulator-jzIntv-Intellivision]] | Mattel Intellivision |
| [[Emulator-libretro-o2em-Odyssey2]] | Magnavox Odyssey² |
| [[Emulator-apple2js]] | Apple ][+ |
| [[Emulator-tiny8bit-CPC]] | Amstrad CPC |
| [[Emulator-elkjs-Electron]] | Acorn Electron |
| [[Emulator-js99er-TI-99-4A]] | TI-99/4A |
| [[Emulator-apple1js]] | Apple I |
| [[Emulator-jsbeeb]] | BBC Micro, BBC Master 128 |
| [[Emulator-EmulatorJS-NES-FCEUmm]] | NES |
| [[Emulator-Stella]] | Atari 2600 |
| [[Emulator-gambatte-Game-Boy]] | Game Boy, Game Boy Color |
| [[Emulator-handy-Atari-Lynx]] | Atari Lynx |
| [[Emulator-genesis-plus-gx-Game-Gear]] | Sega Master System + Game Gear (one genesis_plus_gx core) |
| [[Emulator-jsvecx-Vectrex]] | GCE Vectrex |
| [[Emulator-EmulatorJS-7800-ProSystem]] | Atari 7800 |
| [[Emulator-WebMSX]] | MSX, MSX2 |
| [[Emulator-JSSpeccy]] | ZX Spectrum |
| [[Emulator-JtyOne]] | ZX81 |

Fourteen of these share one copy of the EmulatorJS framework at `systems/_shared-ejs/` — the six VICE bundles, the Coleco bundle, the NES bundle, the Atari 2600 (Stella) bundle, the Atari 7800 (ProSystem) bundle, the Game Boy / GBC (gambatte) bundle, the Atari Lynx (handy) bundle, and the two Sega bundles — Master System and Game Gear — both on genesis_plus_gx. All the EJS-specific gotchas live in [[Emulator-VICE-family]]; the Coleco and NES articles assume that context and only document what's different.

## How a game launches

The same flow across every emulator:

1. The user picks a number in a `GAMES` menu.
2. `N.bat` runs the named launcher (e.g. `sonic1`).
3. `sonic1.exe` is a `link:` entry pointing at the emulator's URL.
4. The terminal opens that URL in a new tab via `window.open(link, "_blank")`.

URL patterns vary per emulator. Each engine article documents its own.

## PROMPT vs BASIC entries

Every emulator's GAMES menu has a "boot a clean machine" entry as item N+1. Labels match what the user actually sees on boot:

- **PROMPT** for `>` / `Ok` style command-line systems
- **BASIC** for systems whose BASIC banner is the boot screen (`READY`, `Ready`, `READY.`)

All six VICE-family + 800XL bundles route through a small `empty.prg` for the BASIC entry; the PET (now under Skibo) uses the same `empty.prg` pattern via its own runtime; Spectrum, ZX81, and CPC pass no query at all (their emulators already drop to ROM BASIC with no software inserted).

## Controls reference pages

Every emulator directory has a `controls.html` documenting its keyboard / joystick mapping. Same dark-amber DOS-flavoured style across all pages; the page-level CSS lives in `systems/_shared/styles/genx-controls.css`.

**Per-game instruction pages** live at `docs/games/<platform>/<key>.html`. They do not replace `controls.html` — the two answer different questions, and a play page offers both at once.

`genx-controls-link.js` puts **two links in the top corners** of every emulator page: **gameplay controls** on the left, resolved from `?game=`, `?tape=` or `?rom=` in the live URL, and **system help** on the right, always `controls.html`. A keyless URL boots the bare machine, which has no game page, so only the right-hand link appears. Each is a two-line label in IBM Plex Mono on a pill of the wallpaper's own brown; the banners are pinned to the bottom of the screen so nothing ever displaces them.

The pages link to each other as well: every gamedoc carries *System help* under its header, and every `controls.html` ends with a **Gameplay controls** list of that system's games in menu order. Both page types run under `default-src 'none'` with no `script-src`, so this is static HTML — a controls page cannot know which game you arrived from, which is why it lists them all.

**Where the key comes from.** Normally the live URL. Four bundles have no usable key there by the time the deferred script runs: **apple2** rewrites `?game=` into the `?disk=` its engine expects, **cpc** folds it into sokol_args, and **bbcmicro** / **bbcmaster** launch from a keyless `?disc1=` and never carry one. Each of those pages sets `window.GENX_GAME_KEY` synchronously instead, and the shared script prefers it over the URL — the BBC bundles' `genx-gamedoc-link.js` already published that variable for the soft-key policy, so one disc-to-gamedoc map now serves both. They previously kept three inline copies of the link-building code, which had drifted.

Both hrefs are resolved from the script's own `src`, not written relative to the page: the BBC entry points live at `systems/<bundle>/dist/index.html`, a directory deeper than every other bundle's, where a page-relative path lands a level short.

The shared script still stands down whenever it finds a `.gx-corner-link` or legacy `.gx-controls-link` already in the page, so a bundle that needs its own placement can opt out by providing one; `genx-controls-link.css` keeps the old rule for that case.

None of these pages are in the virtual filesystem; the DOS prompt's `dir` output shows only `.exe` launchers and `.bat` menu scripts, never raw `.html` files.

### The controls table — the house layout

Every gamedoc's **Controls** table uses the same three columns, in this order:

| Gamepad | Keyboard | Action |
|---|---|---|
| D-pad ← / → | <kbd>←</kbd> / <kbd>→</kbd> | Rotate ship counter-clockwise / clockwise |
| B | <kbd>Space</kbd> | Fire |
| Start | <kbd>Enter</kbd> | GAME RESET — start game |

Drop a column that does not apply to that machine: a bundle with no gamepad
support loses the first, and the handful of games driven entirely by a pad lose
the second. Never leave a column in place and fill it with dashes.

**The Gamepad column names what the player presses**, in Xbox terms — `A`, `B`,
`X`, `Y`, `LB`, `RB`, `LT`, `RT`, `D-pad`, `Left stick`, `Start`, `Back`. Xbox
because that is what most people have plugged into a PC; a player should be able
to read the cell and put a thumb on the right button without translating. It does
*not* name the original machine's control. "Fire", "Reset" and "Joystick" are
things the 1982 hardware had; they belong in the Action column if they need
saying at all, which is why a 2600 row reads `Start | Enter | GAME RESET — start
game` rather than putting the switch name in a column header's place.

**Where the mapping comes from** — never from memory, always from the thing that
implements it:

| Bundle | Authority |
|---|---|
| The 13 EmulatorJS bundles | `_shared-ejs/ejs/data/src/gamepad.js` (pad button 0-3 = A/B/X/Y) crossed with `emulator.js`'s `initControlVars` defaults and the bundle's own `defaultControls` override in `play.html` |
| Vectrex | the engine polls the axes directly: left stick, and X/Y/A/B are buttons 1-4 |
| BBC Micro / Master | the per-game `GP.*` parameters in the launch URL in `fs.js` |
| Tandy CoCo | the per-game `joystick` field in `games.json` |
| CPC, Electron, Spectrum, ZX81 | the per-game `window.GenXGamepadMap` in that bundle's `play.html` |

The **Apple ][+** belongs on that list too, found during the sweep: `apple2js`
drives paddles 0 and 1 straight off the left stick and maps pad `A`/`LB` to Apple
button 0, `B`/`RB` to button 1 (`dist/main2.bundle.js`, default map
`{A:0, B:1, L1:0, R1:1}`).

Machines with no pad support at all — Apple I, Atari 400/800, TI-99/4A, Model
100, MSX1/2, PET, TRS-80, Intellivision, Odyssey² — carry two columns. The last
two are worth naming because their tables used to *have* a Gamepad column that
described the original console's controller rather than a USB one. For the
Atari, TRS-80, Model 100 and MSX the SDL builds do carry Emscripten's gamepad
plumbing, but nothing here binds it to anything, so a column would be a claim we
cannot support: test with a real pad before adding one.

## Adding a new emulator

Same recipe each time:

1. **Copy** the deployed bundle into `systems/<name>/`. Mirror with `wget` if it's hosted, or build from source if you must. Drop the upstream `node_modules`, the inner `.git`, any `.gitignore` that excludes deploy artefacts, and any upstream `README.md` / dev tooling.
2. **Strip telemetry and external runtime fetches** from the source's HTML and bundled JS/CSS *before* deploying. Each of these patterns has bitten us at least once:
   - Inline analytics (`gtag(`, `umami`, etc.) — jsbeeb and webmsx both shipped Google Analytics; removed both.
   - Framework-version checks like `fetch("https://cdn.<framework>.org/.../version.json")` — EmulatorJS does this on every bootstrap. Patched `checkForUpdates()` to a no-op `return;`.
   - Hardcoded NetPlay / multiplayer relay servers — the former Javatari bundle had `SERVER_ADDRESS: "webmsx.azurewebsites.net/"` for keep-alive + WebSocket. Set the address to `""` so any guarded `address && …` short-circuits and the wss:// URL becomes invalid.
   - CSS web-font `@import` rules pointing at `fonts.googleapis.com` — jsbeeb's Vite-built CSS had a Lato import. Strip it; fall through to the system-font fallback unless the visual difference matters.
3. **Add the standard `<noscript>` overlay** to every new HTML entry point — copy verbatim from any existing emulator page.
4. **Write `play.html`** if the emulator needs a key-based launcher. Skip if the emulator's own page already accepts URL params (BBC and WebMSX patterns). The wrapper reads `?game=<key>`, fetches `games.json`, looks up `{title, rom}`, and boots the emulator with that ROM.
5. **Bundle the ROMs** under `systems/<name>/<roms-dir>/`. External ROM sites generally don't set CORS for direct browser fetch, so wrappers can't pull at runtime — every byte must be on the same origin.
6. **Wire `fs.js`**: each game's `.exe` gets a `link:` field pointing at the URL pattern above. Per-system `GAMES` menu follows the 45-char box format (see [[Customising the Filesystem]]) with 10 titles + a PROMPT or BASIC entry.

## Multi-model platforms

Some platforms host multiple machines under the same vendor — ATARI has 2600 / 7800 as siblings under CONSOLE and 400 / 800XL as siblings under HOMECOMP; MSX has MSX1 and MSX2; SINCLAIR has SPECTRUM and ZX81. The hierarchical pattern: a parent menu with `1.<MODEL1>` / `2.<MODEL2>` rows, each pointing into its own GAMES dir. See `prompt/javascript/fs.js` for the exact tree.

Single-platform manufacturers (NES, INTV, CVISION, ODYSSEY2, SMS, COCO) sit directly under their CONSOLE or HOMECOMP parent — no manufacturer middle level.

Note: Atari 400 + 800XL run the **same atari800 engine** but ship as two self-contained bundles — `systems/atari400/` (boots OS-B) and `systems/atari800/` (boots OS-XL) — so each game's URL names the machine. MSX and BBC are split the same way: `msx1/`+`msx2/` and `bbcmicro/`+`bbcmaster/`.

## Testing changes

```sh
./GenX-DOS.sh        # or: python3 -m http.server 8765
```

After editing `fs.js` or any emulator wrapper, hard-refresh the prompt page (Ctrl+Shift+R). Browsers aggressively cache `fs.js` between visits.

## Related

- [[Project Overview]] — what the site does
- [[Virtual Filesystem]] — how `.exe` launchers reach `play.html`
- [[File Structure]] — where bundles sit in the repo
- [[Roadmap]] — what's shipped, what's next
