# floooh/tiny8bit — Amstrad CPC

The Amstrad CPC bundle took three failed core swaps before landing on tiny8bit. The reasons each previous candidate fell out are worth keeping on record so we don't tread the path again.

## Where we started — three dead ends

1. **EmulatorJS + cap32.** The CDN's `cap32-legacy-wasm.data` exports are incomplete; the core aborts with `getControllerPortInfo undefined` on `GameManager.cwrap()`. Same pattern as the Odyssey² EJS dead-end — the vanilla libretro core wasn't EJS-forked. Out.

2. **crocods.** Boots cleanly. Then stops at a catalogue menu. The source has a literal `// TODO: ID_AUTORUN` so there's no API to skip the menu and go straight to the loaded image. Out.

3. **cpcbox.** Minified and obfuscated. Rejects our `.dsk` images with `[SNA Parser] Error: Invalid SNA id` because internal vars are like `$Kyk3LdzJw`. Debugging surface area is zero. Out.

So we landed on Andre Weissflog's [tiny8bit](https://github.com/floooh/chips-test) — a standalone WASM with a clean URL-param config API, no EJS dependency, MIT-licensed, CPC 6128 + Locomotive BASIC 1.1 default.

## The sokol_args URL-param API

tiny8bit reads its configuration from `window.location.search` via its sokol_args library (function `Za()` in the minified WASM glue). Standard keys:

- `file=<url>` — load `.dsk`/`.sna`/`.tap` on boot (relative path OK, resolves against document URL)
- `input=<keys>` — type these keys after load (URL-encoded; `%0A` is Enter; usually `run"NAME%0A`)
- `type=cpc464|cpc6128` — model override (default cpc6128)
- `joystick=<mode>` — joystick mode

The trick: sokol_args reads `location.search` *at startup*, so the URL has to be in the right shape *before* `cpc.js` runs. `play.html` reads our `?game=KEY`, looks up `{rom, input, type}` in `games.json`, then **rewrites the URL via `history.replaceState()` to `?file=<rom>&input=<boot-cmd>` BEFORE WASM init**. Only then inject `cpc.js`.

## The autoboot problem

CPC `.dsk` autoboot isn't built into the AMSDOS format. Each game needs its `run"<file>` command supplied via `input=`. Figuring out the right filename per disk means parsing the AMSDOS catalogue: track 0 sectors 0xC1-0xC4, 256-byte header + per-track 0x100 track-info preface, then 64 catalogue entries of 32 bytes each.

For example, *Roland on the Run*'s autoboot file is `ONTHERUN.BAS`, not the obvious-looking `DISC.BAS`. Get it wrong and the disk loads but does nothing.

## The single-fire-button problem

floooh's chips library only wires one fire button — BTN0 == BTN1, both mapped to Space. CPC games that expected two-button joysticks (PgUp/PgDn was the convention for second-button arcade ports) get nothing on PgUp/PgDn.

The fix was a capture-phase keydown listener that intercepts PageUp/PageDown, calls `preventDefault` + `stopPropagation`, then dispatches a synthetic Space:

```js
document.dispatchEvent(new KeyboardEvent(e.type, {
  key: ' ', code: 'Space', keyCode: 32, which: 32,
  bubbles: true, cancelable: true
}));
```

sokol's handler sees Space; the game sees a fire button. PgUp and PgDn become alternative fire keys without the user noticing.

## Rebuilding the WASM to drop the debug overlays

The stock tiny8bit binary paints two things over the screen that you can't turn off at runtime: a sokol-debugtext **status bar** along the bottom (`JOYSTICK`/`DISC`/`MOTOR`/`TRACK` plus frame timing) and a **muted-speaker icon** that sits there until the first click. Inside our CRT bezel both look like bugs.

We first tried hiding the status bar with a black CSS strip over the bottom of the cutout. It worked, but it was a fudge — the bar is drawn into the framebuffer, so the strip also masked a slice of any game that drew there. The cleaner answer was to rebuild the binary without the overlays, and it turned out to be a two-line patch.

In `floooh/chips-test`'s `examples/emus/cpc.c`:

- comment out `draw_status_bar();` in `frame()` — no more status bar;
- hardcode `.disable_speaker_icon = true` in the `gfx_init` descriptor — the icon never shows (audio still resumes on load via the same auto-unlock burst jsbeeb and Electron use).

(The forward declaration of `draw_status_bar` then gets `__attribute__((unused))` so the dead function doesn't trip `-Werror`.)

Building it is its own small adventure: floooh has moved chips-test onto **fibs**, his Deno/TypeScript successor to fips, so there's no plain CMakeLists to point `emcc` at. The dance is — install Deno, symlink an existing emsdk in where fibs expects its own (`ln -sfn $HOME/emsdk .fibs/sdks/emsdk`), then `fibs config emsc-ninja-release` and `fibs build cpc`. The two artifacts drop into `.fibs/dist/emsc-ninja-release/` and we copy `cpc.js` + `cpc.wasm` over the bundle's. The full recipe lives in the repo at `systems/cpc/BUILDING-WASM.md`.

## Save / load state — exporting the chips snapshot

chips already has the hard part done: `cpc_save_snapshot(sys, dst)` and `cpc_load_snapshot(sys, version, src)` (declared in `chips/systems/cpc.h`) take a full machine snapshot as a self-contained `cpc_t` struct copy. The stock build just never exported them. Since we already rebuild the WASM for the overlay removal, exposing them was cheap — `examples/emus/cpc.c` (right after the `} state;` global) gets four `EMSCRIPTEN_KEEPALIVE` wrappers around a static `cpc_t gx_snap`:

```c
EMSCRIPTEN_KEEPALIVE int   gx_state_size(void) { return (int)sizeof(cpc_t); }
EMSCRIPTEN_KEEPALIVE void* gx_state_ptr(void)  { return (void*)&gx_snap; }
EMSCRIPTEN_KEEPALIVE int   gx_state_save(void) { cpc_save_snapshot(&state.cpc, &gx_snap); return (int)sizeof(cpc_t); }
EMSCRIPTEN_KEEPALIVE int   gx_state_load(void) { return cpc_load_snapshot(&state.cpc, CPC_SNAPSHOT_VERSION, &gx_snap) ? 1 : 0; }
```

The key contrast with [[Emulator-atari800]]: the chips snapshot is a plain struct copy with **no `emscripten_sleep`** anywhere in it, so there's no ASYNCIFY clash — the adapter calls `gx_state_save`/`load` straight from the button, no frame-loop deferral. `play.html`'s `GenXStateAdapter` is synchronous: `getState` = `_gx_state_save()` size + `HEAPU8.slice(_gx_state_ptr(), +n)`; `setState` = `HEAPU8.set(bytes, ptr)` + `_gx_state_load()`.

**The HEAPU8 gotcha (same one o2em hit):** the stock fibs `emscripten.ts` sets no `EXPORTED_RUNTIME_METHODS` *and* `NO_FILESYSTEM=1`, so `Module.HEAPU8` doesn't exist and there's no MEMFS file fallback either. The fix is one line added to the imported `fibs-extras/emscripten.ts` `build()` hook — `-sEXPORTED_RUNTIME_METHODS=['HEAPU8','ccall','cwrap']` — then re-run `config` before `build` so it's baked into the ninja files. (The build sets `INITIAL_MEMORY=32MB` with growth, so `Module.HEAPU8` could go stale after a memory grow, but the CPC's footprint never triggers one.)

## The no-game (BASIC) branch

If no `?game=` URL param, skip `genxLoadGame()` (which fails on missing key by design), set `document.title = 'Amstrad CPC'`, clear the search via `history.replaceState(null, '', location.pathname)`, and let `cpc.js` init with empty sokol_args. The WASM defaults to CPC 6128 + Locomotive BASIC. User gets `Ready` and a blinking cursor.

## A game-sourcing note

`.dsk` is the preferred format — period-correct for the 3-inch floppy CPC era. `.sna` snapshots boot faster but feel inauthentic. ("I prefer .dsk — this isn't a cartridge system.")

French-only releases are a recurring trap. 1985's *Sorcery* (Virgin) was dropped for it early on, and *Get Dexter* went the same way later: the only dump that would boot turned out to be the French *Crafton & Xunk*, whose keys differ from the English release, so rather than ship a game under a name and a key table it doesn't use, we replaced it outright.

Four screens now run over a candidate disc before anyone bothers launching it, each learned the hard way:

- **Trainers.** *Bomb Jack*'s disc boots to "Trainer From T.H.C. — Unlimited Lives (Y/N)?" and holds no clean copy of the game. `strings` catches the ones that announce themselves in plain text; it cannot see a trainer drawn as bitmap text, so playing it is still the only proof.
- **Read the catalogue properly.** Do *not* grep a `.dsk` for filename-shaped strings — it invents names that aren't there (it had us chasing `LOADER` and `RUN-ME` on a disc whose only files are `DISC` and `EIDOLON`) and silently drops any 8-character name, because those leave no space before the extension. Parse the AMSDOS directory instead: track 0 sectors `&C1`–`&C4` (or track 2 `&41`–`&44`), 32-byte entries, mask each character with `&7F`.
- **An empty catalogue means it won't run.** Twice now — *Gauntlet* and *Way of the Tiger* — a disc whose directory reads empty and which loads via `|CPM` has its loader on custom tracks, and dies at boot. A readable catalogue is the better predictor than the `PROTECTED` flag: *Tau Ceti* is Speedlock-protected and perfectly happy.
- **Single disc only.** The launcher mounts one image with no way to swap, so a game whose data spans two discs is out — *The Guild of Thieves* boots and then asks for the other side, and at ~300K of data it cannot be merged onto one 178K disc either. Tape is no escape route: `input=` doesn't auto-type for tapes and there's no virtual PLAY, so a `.cdt` stalls at "Press PLAY then any key".

## What this taught us

When evaluating a new platform's WASM emulator:

1. Check the source for exposed URL-param / JS API hooks (sokol_args, location.search consumers, init callbacks). If it's all baked-in defaults, you'll need source patching.
2. Check the source for `// TODO: AUTORUN` or similar incomplete features that block headless usage.
3. Avoid minified + obfuscated standalone JS — debug surface area is zero.

## Bundle layout

```
systems/cpc/
├── play.html            ← URL rewrite + PgUp/PgDn remap
├── cpc.js               ← tiny8bit emscripten glue (locally rebuilt)
├── cpc.wasm             ← emulator (locally rebuilt — overlays patched out + gx_state_* save-state)
├── BUILDING-WASM.md     ← rebuild recipe (source patch + fibs build)
├── controls.html
├── games.json
└── games/
    └── *.dsk            ← floppy images, with per-game boot command
```

## Related

- [[Emulator-XRoar-CoCo]] — same emscripten Module pattern
- [[Emulator-jzIntv-Intellivision]] — also custom loader, no EJS
- [[Emulators]] — index

## USB gamepad support (04/07/2026)

The engine reads only keyboard/mouse, so pads come via our wrapper: `play.html` sets a `window.GenXGamepadMap` (arrows + Space) and loads the shared `systems/_shared/genx-gamepad-keys.js`, which polls pad 0 each frame and synthesizes the mapped KeyboardEvents on edges (idle pads emit nothing, so keyboard-driven games are unaffected). Games whose CPC original had a joystick option carry a `"joystick": true` flag in `games.json`; `play.html` forwards it as the sokol `joystick=true` arg so tiny8bit's emulated 9-pin port consumes the synthesized arrows/Space. First wired title: 3D Starstrike; *The Eidolon* and *Prince of Persia* followed, both joystick-native by design (their manuals document a joystick alongside the keyboard), so the pad drives the emulated port rather than faking keystrokes at the game. The shim has since gone multi-engine — the Acorn Electron, ZX Spectrum and ZX81 bundles all drive it with per-game maps (see their pages), and it gained a lazily-resolved dispatch target, press/release hysteresis on the stick axes (on at 0.5, off at 0.3) and a `?paddebug` on-screen event log along the way. On the CPC the map now loads only when a `?game=` is present, so a pad can't type into the bare Locomotive BASIC prompt, and `play.html` builds its corner controls link inline (the sokol_args URL rewrite raced the deferred shared link script).

Also from the same session: the bezel now fills the full viewport height (the 120px wallpaper margin in the `.bezel-wrap` width cap was dropped — `calc(100dvh * 1502 / 992 * 1.05)`), which made the canvas noticeably more legible.
