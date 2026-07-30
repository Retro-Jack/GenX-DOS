# WebMSX — MSX

WebMSX is Paulo Peccin's MSX emulator (MIT). It covers MSX, MSX2, MSX2+, MSX turbo R. We shipped it twice: an early all-in-one integration that proved fragile, then a clean rebuild (16/06/2026) that's the current bundle.

## Why we rebuilt it

The first integration edited the upstream single-file `index.html` directly — stripping Google Analytics, neutering the donation modal, keeping the PWA wiring — all inside one ~5 MB file with the engine inlined. Editing a minified all-in-one is exactly as brittle as it sounds: an injected closing `</script>` tag once leaked into the inlined engine and broke the whole page.

The rebuild splits engine from wrapper:

- **`wmsx.js`** — the stock WebMSX 6.0 *embedded* build, ~5 MB, **never edited**. Because we don't touch it, there's nothing to re-scrub on an upstream re-sync and no risk of breaking the engine with a stray edit.
- **`index.html`** — *our* wrapper. It sets the WebMSX config object, loads `wmsx.js`, then adds the GenX controls link as a normal element *after* the engine (so no `</script>` can leak in).

## The wrapper config

WebMSX reads URL params when `ALLOW_URL_PARAMETERS` is on, so the menu's `?ROM=` / `?M=` / `?ANY=` map straight to the engine's own abbreviations (`ROM`→`CARTRIDGE1_URL`, `M`→`MACHINE`, `ANY`→`AUTODETECT_URL`). The extra `?game=` param is ignored by the engine and consumed by `genx-controls-link.js`.

```js
window.WMSX = {
  SCREEN_ELEMENT_ID: 'wmsx-screen',
  ALLOW_URL_PARAMETERS: true,
  SCREEN_CONTROL_BAR: 0          // 0 = auto-hide on hover
};
```

The WebMSX control bar (`#wmsx-bar`) is hidden site-wide — GenX bundles don't show emulator chrome. WebMSX also pops **on-screen OSD toasts** ("AUTO: NTSC 60Hz", media/state notices); chasing the monitor's `showOSD` through `WMSX.room.screen` is a dead end, but the toasts turn out to be a plain **DOM overlay `#wmsx-osd`**, so a one-line `#wmsx-osd { display: none !important }` kills them cleanly — no timing games.

## Save / load state

WebMSX exposes the running machine as `WMSX.room.machine`, with `saveState(true)` / `loadState(state)` — the same complete state API its netplay uses. The wrapper registers a `GenXStateAdapter` around those two calls and `_shared/genx-savestate-std.js` turns it into the bottom-left **save** / **load** menus. The state is a plain object graph (typed arrays included), so the shared core's `structuredClone` + typed-array-tagged JSON handle the in-memory slots, which persist to IndexedDB (five per game).

## The CRT bezel

WebMSX (`SCREEN_RESIZE_DISABLED: false`) sizes `#wmsx-screen-canvas` to fit its container, so the MSX takes the shared **`Sinclair.png`** vintage-TV bezel like the Spectrum/CoCo: `#wmsx` is pinned into the screen hole and the canvas is forced to fill it (`transform: translate(8px, -10px) scale(0.842)`). No barrel/fisheye — the MSX picture reads better flat.

## Cart loading

Carts auto-load by URL — every MSX game in this build is a cartridge that boots straight to play (no disk titles). The menu links pass `?ROM=games/<name>.zip&M=MSX1` (or `&M=MSX2`).

## Two bundles, one engine

WebMSX ships as **two self-contained bundles** — `systems/msx1/` (boots `M=MSX1`) and `systems/msx2/` (boots `M=MSX2`) — so the URL path names the machine instead of an ambiguous shared `systems/webmsx/`. Each is a full copy of the same `wmsx.js`; the MSX2 menu passes an explicit `M=MSX2` rather than relying on WebMSX's implicit default.

## Bundle layout

```
systems/msx1/   (and an identical systems/msx2/)
├── wmsx.js              ← stock WebMSX 6.0 embedded engine (never edited)
├── index.html           ← OUR wrapper (config + engine + controls link)
├── controls.html
└── games/*.zip
```

## Related

- [[Emulator-XRoar-CoCo]] — same `Sinclair.png` bezel
- [[Emulators]] — index
