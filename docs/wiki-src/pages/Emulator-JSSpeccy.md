# JSSpeccy — ZX Spectrum

JSSpeccy 3.2 (Matt Westcott / gasman) is the ZX Spectrum bundle. The integration was small — JSSpeccy ships a clean JS API with a documented options object, so the wrapper is mostly just calling it correctly.

## Where we started

[JSSpeccy 3.2](https://github.com/gasman/jsspeccy3) is GPL-3.0. The version 3 series is a from-scratch WebAssembly rewrite of an earlier pure-JS emulator. The runtime takes a config object (`{zoom, sandbox, uiEnabled, machine}`) and a `JSSpeccy()` constructor that wires up to a target div.

## The launch flow

`play.html` reads `?game=<key>` from the URL, looks it up in `games.json`, and constructs JSSpeccy with:

```js
const opts = { zoom: 2, sandbox: false, uiEnabled: false, machine: 48 };
const speccy = JSSpeccy(document.getElementById('jsspeccy'), opts);
speccy.openTAPFile(game.rom);
```

Three of the four options matter:

- `uiEnabled: false` — hides JSSpeccy's own toolbar (file picker, machine picker, joystick selector). We're a launcher, not a sandbox.
- `sandbox: false` — allows the emulator to make real network requests (loading the tape file from the server). With `sandbox: true` it would only accept tapes uploaded via the file picker.
- `machine: 48` — boots the Spectrum 48K by default. JSSpeccy supports 48 / 128 / +2 / +2A / +3; if a future entry needs a specific model, the games.json record can carry the field and `play.html` reads it.

## Layout

JSSpeccy renders to its own canvas inside the `#jsspeccy` div. CSS pins the canvas with a shadow and pixelated rendering:

```css
#jsspeccy { box-shadow: 2px 2px 10px rgba(0, 0, 0, .7); }
#jsspeccy canvas { image-rendering: pixelated; display: block; }
```

## File formats

JSSpeccy handles `.tap`, `.tzx`, `.sna`, `.z80`. Most of our entries are `.tap` (raw tape image) since that's what the contemporary preservation archives serve. `.tzx` is preferred where copy protection is involved — the format preserves loader timing — but JSSpeccy abstracts the difference, so the wrapper code doesn't care.

## Bundle layout

```
systems/jsspeccy/
├── play.html
├── jsspeccy/            ← upstream JS + WASM
├── controls.html
├── games.json
└── games/
    └── *.tap / *.tzx
```

## USB gamepad support (04/07/2026)

Per-game `window.GenXGamepadMap`s in `play.html` drive the shared `systems/_shared/genx-gamepad-keys.js` shim (pad 0 polled per frame, mapped keys synthesized on edges). Two engine quirks cost real debugging time:

- **JSSpeccy re-binds its key listeners.** At machine start it calls `setKeyboardEventRoot()` onto the focusable app-container div it injects into `#jsspeccy` — synthetic events dispatched at `document` never reach a descendant's listeners, so the shim's `target` is a lazy function returning `document.querySelector('#jsspeccy > div')` (the div doesn't exist until the engine boots). This is also why the real keyboard only responds after a first click: focus.
- **No public audio handle.** JSSpeccy creates its AudioContext internally with no resume-on-gesture, so direct-URL opens (no `window.open` activation) stayed silent. `play.html` patches the `AudioContext` constructor before the engine loads, captures every context, and resumes suspended ones on load and on real user gestures.

Key decoding is `Tr[e.keyCode]` with an `e.key` string fallback (the fallback resolves `,`/`.` as Symbol Shift combos). The engine emulates **no joystick hardware** — no Kempston; PC arrows land on CAPS SHIFT+5/6/7/8, i.e. the cursor-joystick convention.

All ten games were pad-verified in play (04/07/2026), which doubled as the bundle's first hands-on key audit: Chuckie Egg's documented `,`/`.`/A/Z were another platform's keys (real defaults 9/0/2/W, jump Z or M — Space does nothing), and Pssst / Sabre Wulf had up/down swapped relative to each other's docs. Jet Set Willy and Underwurlde also had their snapshots replaced (the old JSW stopped at a code-entry screen and reset; the old Underwurlde booted into a lives-cheat offer).

## Related

- [[Emulator-JtyOne]] — sibling Sinclair machine
- [[Emulators]] — index
