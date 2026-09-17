# apple1js — Apple I

The Apple I bundle is Will Scullin's [apple1js](https://github.com/whscullin/apple1js) — same author as the Apple ][+ bundle, written in the same style. Smaller machine, smaller bundle, smaller surface for things to go wrong. `apple1.js` is built from our fork, [`Retro-Jack/apple1js`](https://github.com/Retro-Jack/apple1js).

## Where we started

apple1js is pure JavaScript, no WASM, MIT-licensed (© Will Scullin — see ATTRIBUTION). Boots to the Woz Monitor prompt, optionally drops into Integer BASIC, Applesoft, or VolksForth depending on what tape is loaded.

## The runtime-tape design

apple1js's `tapes/` directory holds 15 `.js` files. Ten of them are games; `bezelcard.js` is the bezel test card; the other four — `applesoft.js`, `basic.js`, `monitor.js`, `volksforth.js` — are runtime dependencies (Integer BASIC, Applesoft BASIC, Woz Monitor, VolksForth) that `play.html` loads even in prompt mode. They look like orphan tapes if you only count games. They aren't.

This is the one situation where a file-count audit needs context. The post-bundle audit memory flags this explicitly so future passes don't try to "clean up" the BASIC implementations.

## The fork

Three changes live in the `genx` branch of [`Retro-Jack/apple1js`](https://github.com/Retro-Jack/apple1js), each written up in its `GENX-CHANGES.md` with the steps to rebuild:

- **Reset is on Pause/Break, not F1.** F1 is the browser's help key, and GenX-DOS leaves it alone.
- **RESET is pressed 300 ms after start-up.** A real Apple I sat doing nothing until you pressed it; the page presses it for you, so the monitor is running when a tape loads.
- **Green phosphor, `#11cf00`, from the start.** The same green as the PET. The emulator's *Green Screen* option draws in that colour, and the page's Monitor options are now read once at start-up as well as on a click, so `play.html` can start with the box ticked.

The first two began as edits to the built `apple1.js`, made when the bundle was copied in May 2026. The fork was created in September to carry them as source: built from upstream `674e6ea`, the bundle matched what we had been shipping apart from exactly those two edits.

## The chrome cleanup

Like apple2js, upstream `apple1js.html` ships a full app: keyboard buttons, modal dialogs, status panels. Same approach as the Apple ][+ bundle — keep the DOM intact (the bundle queries it at boot and throws if anything's missing), hide it with CSS:

```css
h1, h2, .inset, .modal, #keyboard { display: none !important; }
td > div:not(.overscan) { display: none !important; }
.overscan {
  width: min(100vw, calc(100dvh * 4 / 3));
  height: min(100dvh, calc(100vw * 3 / 4));
}
```

Result: just the text display, scaled to 4:3.

## How tapes launch

`?tape=<key>` maps to a tape descriptor in the `tapes` object. apple1js's load API handles the rest — the tape script defines `tapes[key]` with the bytes inline, and the emulator's tape input mode reads them at the speed real cassette tape did. Most games take a few seconds to load.

## Bundle layout

```
systems/apple1/
├── play.html         ← chrome hider + tape loader
├── controls.html     ← Woz Monitor / Integer BASIC reference
├── apple1.js         ← built from Retro-Jack/apple1js (genx)
├── css/apple1.css
├── tapes/
│   ├── basic.js, applesoft.js, monitor.js, volksforth.js  ← runtime deps
│   ├── bezelcard.js  ← bezel test card
│   └── <10 game tape .js files>
```

## Related

- [[Emulator-apple2js]] — same author, sibling bundle
- [[Emulators]] — index
