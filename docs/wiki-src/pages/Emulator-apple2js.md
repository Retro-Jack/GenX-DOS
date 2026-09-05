# apple2js — Apple ][+

The Apple ][+ bundle was a contrast to the emscripten emulators around it: pure JavaScript, no WASM, no Emscripten — but its own kind of integration work because the upstream emulator ships a full app with chrome we needed to hide.

## Where we started

Will Scullin's [apple2js](https://github.com/whscullin/apple2js) — MIT-licensed, the mature browser Apple ][ option, period-correct ][+ with 48 KB / Applesoft / Disk II. Pure JavaScript. The "browser" in the name isn't a wrapper around a C emulator; the 6502 is implemented in JS. Built with webpack 5.

## The build

```sh
git clone --depth 1 https://github.com/whscullin/apple2js.git
cd apple2js && git submodule update --init
npm install && npm run build   # → dist/*.bundle.js (~1.3 MB total)
```

We mirrored into `systems/apple2/`:

- `dist/*.bundle.js` (no `.map`) — and crucially, **all** dynamic chunks (the numbered `<id>.bundle.js` files, ~16 of them). webpack loads them lazily; missing chunks fail at runtime.
- `dist/*.png` and `dist/*.woff*` — fonts and glyphs for chrome. Technically unused since we hide chrome, but cheap.
- `css/apple2.css` — bundle references it for positioning.
- `img/*.png` — same reason.
- `json/disks/index.js` — **required**. The bundle loads this at boot; needs a minimal `disk_index = [...]` array listing each bundled disk.

## The chrome problem

Upstream `apple2js.html` is a full app: header, exit-fullscreen button, modal dialogs, status panels. None of it suits GenX-DOS's bezel-first aesthetic.

The mistake would be deleting those DOM elements. The bundle queries them at boot — `document.getElementById('exit-fullscreen')` etc. — and throws if anything's missing. Keep the DOM intact; hide it with CSS:

```html
<style>
  #header, #exit-fullscreen, .inset, .modal { display: none !important; }
</style>
```

Then resize `#display`, `.overscan`, and `#screen` to fit the viewport at 4:3 (Apple ][+ NTSC native is 280×192, the apple2js canvas is 592×416). Result: just the canvas, full-bleed.

## The URL-param rewrite

GenX-DOS's convention is `?game=<key>`; apple2js's convention is `?disk=<key>`. Rather than fork the URL handling, we rewrite the param before the main bundle reads it:

```js
const params = new URLSearchParams(location.search);
const key = params.get('game');
if (key) {
  params.delete('game');
  params.set('disk', key);
  history.replaceState(null, '', '?' + params.toString());
}
```

apple2js's `processHash` then loads `json/disks/<key>.json` like normal.

No-game-param launches drop straight into the BASIC prompt — period-correct ][+ behaviour, no menu needed.

## The disk-conversion pipeline

apple2js doesn't take `.dsk` files directly. It needs disks in its own JSON format (base64-encoded sectors). Upstream ships the conversion tool:

```sh
./bin/dsk2json -c <Category> -n "<Name>" <input.dsk> > json/disks/<key>.json
```

A standard DOS 3.3 disk is 35 tracks × 16 sectors × 256 bytes = 143,360 bytes raw, which expands to ~200 KB JSON. Each game key has to appear in:

- `json/disks/<key>.json` (the disk itself)
- `json/disks/index.js` (the local-catalogue declaration)
- The menu's `<key>.exe` link

Any one of those missing and the disk silently fails to load.

## Menu codes

Code names cap at 8 chars (this is a DOS terminal). Long titles get trimmed: CHOPLIFTR → CHOPLIFT, LODERUNR → LODERUN. The file key, the displayed code, and the link path's `?game=` value all have to match.

## Bundle layout

```
systems/apple2/
├── play.html             ← chrome hider + ?game→?disk rewrite
├── apple2js.html         ← upstream entry, mostly unused
├── *.bundle.js           ← main2 + numbered chunks
├── css/, img/, *.png, *.woff*
└── json/disks/
    ├── index.js          ← local catalogue
    └── *.json            ← per-game disks
```

## Related

- [[Emulator-apple1js]] — same author, different machine
- [[Emulators]] — index
