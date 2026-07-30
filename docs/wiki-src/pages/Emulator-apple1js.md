# apple1js — Apple I

The Apple I bundle is Will Scullin's [apple1js](https://github.com/whscullin/apple1js) — same author as the Apple ][+ bundle, written in the same style. Smaller machine, smaller bundle, smaller surface for things to go wrong.

## Where we started

apple1js is pure JavaScript, no WASM, BSD-2-clause-style permissive licence (the actual SPDX header is a custom Will Scullin notice — see ATTRIBUTION). Boots to the Woz Monitor prompt, optionally drops into Integer BASIC, Applesoft, or VolksForth depending on what tape is loaded.

## The runtime-tape design

apple1js's `tapes/` directory holds 14 `.js` files. Ten of them are games; the other four — `applesoft.js`, `basic.js`, `monitor.js`, `volksforth.js` — are runtime dependencies (Integer BASIC, Applesoft BASIC, Woz Monitor, VolksForth) that `play.html` loads even in prompt mode. They look like orphan tapes if you only count games. They aren't.

This is the one situation where a file-count audit needs context. The post-bundle audit memory flags this explicitly so future passes don't try to "clean up" the BASIC implementations.

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

`?game=<key>` maps to a tape descriptor in the `tapes` object. apple1js's load API handles the rest — the tape script defines `tapes[key]` with the bytes inline, and the emulator's tape input mode reads them at the speed real cassette tape did. Most games take a few seconds to load.

## Bundle layout

```
systems/apple1/
├── play.html         ← chrome hider + tape loader
├── controls.html     ← Woz Monitor / Integer BASIC reference
├── apple1.js         ← upstream entry
├── css/apple1.css
├── tapes/
│   ├── basic.js, applesoft.js, monitor.js, volksforth.js  ← runtime deps
│   └── <10 game tape .js files>
```

## Related

- [[Emulator-apple2js]] — same author, sibling bundle
- [[Emulators]] — index
