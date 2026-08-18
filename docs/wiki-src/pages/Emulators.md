18 emulator engines ship with GenX-DOS, driving 33 sub-systems between them. Some of the integrations were one-liners; others took a week of trial and failure. Every engine — plus each libretro core the shared EmulatorJS framework hosts — has its own integration story, so the index below runs to more rows than the engine count: one row per story page.

## The engines

| Article | Sub-systems |
|---|---|
| [[Emulator-XRoar-CoCo]] | Tandy Color Computer |
| [[Emulator-sdltrs-TRS-80]] | Tandy TRS-80 Model III |
| [[Emulator-VirtualT-Model-100]] | Tandy TRS-80 Model 100 |
| [[Emulator-atari800]] | Atari 400, Atari 800XL |
| [[Emulator-VICE-family]] | VIC-20, MAX, C64, C16, Plus/4, C128 |
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
| [[Emulator-EmulatorJS-7800-ProSystem]] | Atari 7800 |
| [[Emulator-WebMSX]] | MSX, MSX2 |
| [[Emulator-JSSpeccy]] | ZX Spectrum |
| [[Emulator-JtyOne]] | ZX81 |

Fourteen of these share one copy of the EmulatorJS framework at `systems/_shared-ejs/` — the six VICE bundles, the Coleco bundle, the NES bundle, the Atari 2600 (Stella) bundle, the Atari 7800 (ProSystem) bundle, the Game Boy / GBC (gambatte) bundle, the Atari Lynx (handy) bundle, and the two Sega bundles — Master System and Game Gear — both on genesis_plus_gx. All the EJS-specific gotchas live in [[Emulator-VICE-family]]; the Coleco and NES articles assume that context and only document what's different.

## How a game launches

The same flow across every emulator:

1. The user picks a number in a `GAMES` menu.
2. `N.bat` runs the named launcher (e.g. `sonic1`).
3. `sonic1.bat` is a `link:` entry pointing at the emulator's URL.
4. The terminal opens that URL in a new tab via `window.open(link, "_blank")`.

URL patterns vary per emulator. Each engine article documents its own.

## PROMPT vs BASIC entries

Every emulator's GAMES menu has a "boot a clean machine" entry as item N+1. Labels match what the user actually sees on boot:

- **PROMPT** for `>` / `Ok` style command-line systems
- **BASIC** for systems whose BASIC banner is the boot screen (`READY`, `Ready`, `READY.`)

All six VICE-family + 800XL bundles route through a small `empty.prg` for the BASIC entry; the PET (now under Skibo) uses the same `empty.prg` pattern via its own runtime; Spectrum, ZX81, and CPC pass no query at all (their emulators already drop to ROM BASIC with no software inserted).

## Controls reference pages

Every emulator directory has a `controls.html` documenting its keyboard / joystick mapping. Same dark-amber DOS-flavoured style across all pages; the page-level CSS lives in `systems/_shared/styles/genx-controls.css`.

**Per-game instruction pages** at `docs/games/<platform>/<key>.html` replace `controls.html` when a game has researched gameplay instructions. The `genx-controls-link.js` script reads `?game=`, `?tape=`, or `?rom=` from the URL and routes to the matching gamedocs page, falling back to `controls.html` when no game param is present (prompt/BASIC entries).

Every emulator's main entry HTML carries a small bottom-right `controls` link (fixed position, semi-transparent, Wikipedia-style external-link SVG icon). The link sits in the entry HTML itself — `play.html` for the wrapped emulators, the upstream `index.html` for the URL-driven ones (`bbcmicro`, `bbcmaster`, `msx1`, `msx2`). It's **not** in the virtual filesystem; the DOS prompt's `dir` output shows only `.bat` launchers and menu scripts, never raw `.html` files.

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
6. **Wire `fs.js`**: each game's `.bat` gets a `link:` field pointing at the URL pattern above. Per-system `GAMES` menu follows the 45-char box format (see [[Customising the Filesystem]]) with 10 titles + a PROMPT or BASIC entry.

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
- [[Virtual Filesystem]] — how `.bat` launchers reach `play.html`
- [[File Structure]] — where bundles sit in the repo
- [[Roadmap]] — what's shipped, what's next
