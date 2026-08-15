# VICE — the whole Commodore family

The VICE-family bundle was the first time we leaned on [EmulatorJS](https://emulatorjs.org) as a host framework instead of integrating a standalone emulator. Six sub-systems (VIC-20, MAX, C64, C16, Plus/4, C128) share one copy of EmulatorJS and four VICE libretro cores in `systems/_shared-ejs/`. Every gotcha listed below was paid for at least once.

> The PET originally rode along as a seventh sub-system on `vice_xpet`, but libretro-vice ships PET with a hardcoded Business UK keyboard mapper that no `vicerc` resource can override — the symptom was `Enter` producing `P` and letters scrambled. We migrated PET out to Thomas Skibo's standalone emulator in June 2026; see [[Emulator-pet2001-Skibo]] for the full story.

## Where we started

EmulatorJS supports the full VICE family through its libretro core mirror. Mirror the `vice_x64-legacy-wasm.data` blob, point `EJS_core = 'vice_x64'` at it, and you'd expect a working C64. The shape of the work was right; the details took a week.

## The "calling home" problem

EmulatorJS bootstrap fires `fetch("https://cdn.emulatorjs.org/stable/data/version.json")` on every page load — a passive "newer version exists?" log line. Failing gracefully when blocked is good behaviour, but a static GitHub Pages site shouldn't be making that call at all.

The function lives in `ejs/data/src/emulator.js`. The fix was one line:

```js
checkForUpdates = function() { return; };
```

Apply it once in the shared framework. Done.

## The "no-game / bare boot" trap

Setting `EJS_startOnLoaded = true` without setting `EJS_gameUrl` should drop the user at a BASIC `READY.` prompt. It doesn't. EmulatorJS gets stuck on "Download Game Core" forever, because `download(undefined, ...)` resolves to `undefined`, then `startGameFromDownload(undefined)` throws inside an async IIFE — silently.

The workaround is to ship a tiny placeholder PRG that VICE autostarts. The bytes are `01 08 00 00`: BASIC start address `$0801` followed by an end-of-BASIC marker. VICE autostart RUNs the empty program and immediately drops to `READY.`. The same trick works on every machine in the family, but each one needs the right BASIC start address:

| Machine | Bytes |
|---|---|
| C64, VIC-20 (BASIC v2) | `01 08 00 00` ($0801) |
| Plus/4, C16 (BASIC 3.5) | `01 10 00 00` ($1001) |
| C128 (BASIC 7.0) | `01 1C 00 00` ($1C01) |

The 4-byte stub leaves a faint `RUN` line and a doubled `READY.` on screen. We tried six fixes — disabling VICE autostart, patching EJS to skip the URL, persisting `EJS_disableLocalStorage`, a `10 PRINT CHR$(147)` BASIC stub, a `10 SYS <reset-vector>` cold-reset stub — and each one broke a different VICE machine. The reset-vector trick worked perfectly on C64 but killed the PET stone dead. After a day of this, the verdict was: "an extra RUN command never killed anyone." We shipped the stub.

## The `localStorage` ambush

`EJS_defaultOptions` is overridden by persisted user settings. First-visit values get written to `localStorage['ejs-<gameId>-settings']` and IndexedDB `EJS_CFG`, and on subsequent visits *those* win. Changing `EJS_defaultOptions` in `play.html` has zero effect until storage is cleared:

```js
localStorage.clear(); indexedDB.deleteDatabase('EJS_CFG'); location.reload();
```

Critical when iterating on options. Once shipping, irrelevant to users — but mid-development, the cause of an embarrassing amount of "this fix isn't working" panic.

## The `-legacy-` core variant

EJS picks `-legacy-<arch>-wasm.data` as the default core variant. The non-legacy variant only gets picked if a per-core `ejs/data/cores/reports/<core>.json` is shipped, which we don't. Mirror only the non-legacy file and EJS 404s on it, then silently falls through to `cdn.emulatorjs.org/nightly/data/cores/<core>-legacy-wasm.data` with a "FAILSAFE, NOT OFFICIALLY SUPPORTED" warning in console. Always mirror the `-legacy-` variant.

## The `EJS_DEBUG_XX` workaround

The mirrored `emulator.min.js` from `cdn.emulatorjs.org/stable/data/` is *not* shipped as an ES module — no `export default` — but `loader.js` uses dynamic `import()` and reads `module.default`. Appending `export default EmulatorJS;` makes the file syntactically valid as ESM (node `--check` passes) but breaks at runtime because the bundle relies on non-strict-mode behaviour. Stick with `EJS_DEBUG_XX = true` — that path loads `src/emulator.js` (proper ESM with imports of 12 sibling modules, ~750 KB unminified). Not ideal, but works. **Don't strip `data/src/`** in any orphan-pruning pass — it's load-bearing.

## The VICE libretro options nobody documents

When debugging option issues, read the browser console first. The core logs `invalid core value X for Y` for any silently-rejected option. Saved hours by spotting this only after extensive grepping.

- **`vice_drive_sound_emulation` is a percentage**, not on/off. Accepted values are `disabled`, `5%`, `10%`, … `100%` in 5% steps. Default is `20%`. Setting `'enabled'` is silently rejected. (Earlier libretro-vice builds went up to `1000%`; the May 2026 build caps at `100%`. Our value is now `'100%'`.)
- **Warp-during-autoload is `vice_autoloadwarp`**, not `vice_autostart_warp`. The latter looks plausible from libretro docs but is silently ignored.
- **Warp mutes drive sound.** The core help string says so. If you want audible boot, accept the ~30 s real-time IEC load. We chose audible for the C64 — the chunking 1541 is part of the experience.

## The "typed keys don't work" disaster

EJS's default for "Direct Keyboard Input" is `disabled`, which routes typed keys through `keyChange()` to map them to RetroPad gamepad buttons. Symptom: pressing letters/numbers/arrows on the C64 produces random joystick motion or fire, not typing. Most Plus/4 titles and any keyboard-heavy game are unusable in this mode.

The fix:

```js
window.EJS_defaultOptions = {
  ...,
  'keyboardInput': 'enabled',       // typed keys → VICE keyboard callback
  'altKeyboardInput': 'enabled',    // Left Alt → C= key, not browser menu
  'vice_joyport_type': '1'          // Numpad → VICE joystick port
};
```

Keyboard typing and numpad-joystick coexist because they listen on disjoint key sets. Hybrid games (Last Ninja: joystick + F-keys for items, Elite: joystick flight + 20 letter commands) work end-to-end on the unified fix.

## The `Esc` key trap

Browsers capture `Esc` to exit pointer-lock or fullscreen *before* the libretro keyboard callback can see it, so a real `Esc` never reaches VICE as RUN/STOP. The fix lives at `systems/_shared/genx-vice-softkeys.js` — it remaps two keys:

1. Scroll Lock keydown (Windows + Linux PC keyboards)
2. Pause/Break keydown (PC keyboard backup)

Both dispatch a synthetic Escape keydown. Synthetic events bypass the browser's Esc-capture because they aren't real user gestures, so they reach VICE cleanly as RUN/STOP. (RESTORE needs no remap — libretro VICE maps it to `Page Up`, which the browser doesn't capture.)

There are no on-screen RUN/STOP / RESTORE buttons: neither is an in-game key (their real uses are breaking a program at the BASIC prompt and the RUN/STOP+RESTORE reset), so they'd be clutter — keyboard access only.

## The C128 garbage-boot bug — and the framebuffer hack it retired (13/06/2026)

For a while the C128 cold-booted to a screen of uninitialised-RAM garbage instead of the BASIC 7.0 banner — and it did so on the live site too, so it wasn't a local regression. The other VICE cores (x64/xvic/xplus4) booted fine; only **`vice_x128`** was affected. The mirrored `stable` x128 build was byte-identical to the current `cdn.emulatorjs.org/stable` one, so the bug was in the stable build itself.

**The fix: mirror the `nightly` x128 build instead** (`cdn.emulatorjs.org/nightly/data/cores/vice_x128-legacy-wasm.data`). It boots straight to BASIC 7.0. C128 is now the one VICE machine on a nightly core; the rest stay on stable.

This also **retired a long-standing CSS hack.** The stable x128 core reported a fat 856×288 framebuffer regardless of the active video chip, which forced a `scaleY(2.784/1.333)` stretch on the canvas to fill a 4:3 frame. The nightly core renders a normal framebuffer, so that hack is gone. C128 keeps the family's `height: 100%` fit but with a **per-video-mode fill scale**: 40-col VIC-II takes the family `scale(1.01)`, 80-col VDC takes `scale(1.26)` (the wider VDC picture sits smaller in the glass). `perGame` tags `<html>` with `gx-vicii` / `gx-vdc` and CSS picks the scale.

Two gotchas paid for along the way:

- **`vice_c128_video_output` values are the bare keys `VICII` / `VDC`.** The core *also* carries the strings `"VIC-II (40 cols)"` / `"VDC (80 cols)"` — but those are the dropdown **labels**, not settable values. Passing a label makes the core silently reject it and fall back to 40-col VIC-II. (Confirmed by extracting the core `.data` and reading the WASM strings.)
- **The 80-col VDC screen is black-background**, the 40-col VIC-II screen is grey with a green border — easy to mistake the black VDC boot for "nothing happened". 40-col and 80-col both work; titles with a BASIC autostart loader play through (e.g. Star Fleet I).
- **ML-first gotcha (resolved by swapping titles).** A few homebrews ship the machine-language game as the disk's *first* file (load address `$4001`, no BASIC loader), so VICE's `LOAD"*",8,1:RUN` can't start them — RUN only runs BASIC, so they drop to `READY.`. Knight's Quest and Tetris 128 hit this and were swapped for `invaders` + `uniquest`, whose first file is a `$1C01` BASIC loader (autostarts cleanly). Injecting a BASIC `BOOT` loader onto the disk works mechanically but needs the real entry point per title (the load address is only a guess), so it doesn't generalise into an automatic pass — swapping the title is the reliable fix.

## The per-game model override pattern

When a single sub-system needs different VICE models per title (C128 VIC-IIe vs VDC per game), `games.json` carries an optional `video` field per entry and `play.html` reads it. The gotcha: in the existing `play.html`, the `game` variable is declared *inside* the `if (key) { ... }` block. Moving the `let game = null;` declaration above the `if` is mandatory or you get a silent ReferenceError inside the async IIFE.

## Reuse across the family

Every VICE-family bundle uses the same play.html, the same EmulatorJS framework, and the same `_shared-ejs/` core directory. Only `EJS_core` and `games.json` change:

| Bundle | `EJS_core` | Core file |
|---|---|---|
| VIC-20 | `vice_xvic` | `vice_xvic-legacy-wasm.data` |
| MAX, C64 | `vice_x64` | `vice_x64-legacy-wasm.data` |
| C16, Plus/4 | `vice_xplus4` | `vice_xplus4-legacy-wasm.data` |
| C128 | `vice_x128` | `vice_x128-legacy-wasm.data` (**nightly** build — stable boots to garbage) |

Six bundles, four cores, one EmulatorJS copy. Total VICE-family storage is ~11 MB (8.5 MB shared + 6 × ~250 KB bundle-specific) instead of ~22 MB if every bundle carried its own framework.

## CRT bezel — one monitor for the whole family (13/06/2026)

All six machines share a single `Commodore.png` bezel — the **1084S** monitor (1223×1104), keyed to a transparent screen hole. Because they're all one shared `play.html` shape, one bezel + one set of hole coordinates does the lot. Same EmulatorJS player-in-hole recipe as [[Emulator-Stella]]: drop the EJS player div (`#game`) into the hole and let EJS draw into it.

```
.bezel-wrap  (1223×1104, aspect of Commodore.png)
  .screen-bg (black backdrop, slightly LARGER than the hole — stops the
              wallpaper bleeding through the cutout's soft edge)
  #game      (the EJS player at the measured hole: 12.3% / 12.5% / 76.0% × 63.9%)
  .bezel-img (Commodore.png on top, transparent screen hole)
```

The hole is ~4:3, so the canvas fill is gentle:

```css
#game canvas { height: 100% !important; transform: scale(1.01); }
```

`height: 100%` closes EJS's tiny letterbox; `scale(1.01)` is a +1% nudge to seat the picture in the glass with no border gap. Five of the six machines share this exact rule; **C128 splits it by video chip** — 40-col VIC-II `scale(1.01)`, 80-col VDC `scale(1.26)` — via the `gx-vicii` / `gx-vdc` class its `perGame` adds to `<html>` (see [above](#the-c128-garbage-boot-bug--and-the-framebuffer-hack-it-retired-13062026)).

One layout wrinkle worth noting: the VICE bundles inject a NumLock-off warning banner (`position: fixed`), so it sits above the flex-centred bezel without disturbing it.

## Bundle layout

```
systems/_shared-ejs/
└── ejs/data/
    ├── src/         ← runtime-required, do not strip
    ├── cores/       ← 4 VICE cores + gearcoleco + FCEUmm
    └── …

systems/c64/        (and vic20, max, c16, plus4, c128)
├── play.html         ← ~70 lines; sets EJS_* globals, injects loader.js
├── controls.html
├── games.json
└── games/
    ├── empty.prg     ← 4-byte BASIC entry stub
    └── *.d64 / *.prg / *.crt
```

## Related

- [[Emulator-pet2001-Skibo]] — the PET migrated out of the VICE family
- [[Emulator-gearcoleco-ColecoVision]] — same EJS framework, different libretro core
- [[Emulator-EmulatorJS-NES-FCEUmm]] — same EJS framework, NES via FCEUmm
- [[Emulators]] — index
