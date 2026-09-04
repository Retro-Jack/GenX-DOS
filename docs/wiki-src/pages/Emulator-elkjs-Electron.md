# ElkJS — Acorn Electron

The Acorn Electron bundle is one of the older browser emulators on the site. ElkJS (Darren Coles) is solid 6502 emulation built on top of an even older Elkulator core, and the integration work was mostly about backing out upstream's full app and fixing the one display bug that survived.

## Where we started

[ElkJS](https://github.com/dmcoles/elkjs) is Darren Coles's port of Tom Walker's Elkulator. Pure JavaScript, no WASM, no build step — drop the source into a directory, point a `<script>` tag at `elkjs.js`, and it runs. License-wise it's "© Darren Coles 2013" with no SPDX header; the underlying Elkulator core is GPL-2.

## The first observation: the display had scanlines

Upstream's `display.js` draws each emulated row to one canvas line and skips the next (blacked out), creating a CRT-style scanline effect baked into the display path. In a bezel-first site, that effect collides with whatever shading the bezel itself applies, and on modern high-DPI panels it just looks like the emulator is missing half the picture.

The fix was one `data.copyWithin()` call per row to duplicate each drawn row to the line below. Text modes (3/6/7) also have blank inter-character gap rows that need doubling to maintain geometry on the 640x512 canvas. After the patch the picture fills the canvas at native aspect, and the bezel handles whatever scanline aesthetic the user wants.

## The jQuery dependency that wouldn't die

`elkjs.js` has one `$()` call — `refreshTapeDialog` in the tape-loading flow. It's the *only* jQuery use in the active code path, and it's in a function we can't avoid calling. So `play.html` loads jQuery 1.9.1 + jQuery UI for that single call.

Upstream actually shipped two jQueries (1.7.2 and 1.9.1) for legacy reasons. We removed 1.7.2 (the duplicate was unused) and kept 1.9.1.

## The upstream chrome cleanup

The original ElkJS `index.html` is a full app: accordion sidebar, webring, in-page games dialog, tape dialog, browse button for local files. None of it suits a launcher page that's already chosen a specific game. Replaced wholesale by `play.html`. The casualties:

- `index.html` (upstream)
- `main.js`
- `gamesdialog.html`, `tapedialog.html`
- `css/elkjs.css`
- `css/jquery-ui-1.10.3.custom.min.css`
- `css/images/*` (jQuery UI theme sprites)
- `jquery/jquery-1.7.2.min.js` (the duplicate)

## How games launch

Games map to a `games` object in `play.html`. `?game=KEY` triggers `elkjs.openFile(games[key])` after a 3-second delay (OS ROM init time on a cold boot). UEF files are snapshots — they load instantly, no tape wait.

## The autoplay-policy workaround

Browser autoplay policy starts the AudioContext suspended. ElkJS's `soundToggle()` resumes it only on its *first* call, so games could be left silent if nothing ever resumed the context. GenX adds an idempotent `elkjs.resumeAudio()` (resume + enable, no toggle) and `play.html` calls it on **every** real user gesture (`keydown` / `pointerdown` / `touchstart`), plus a staggered window.open-activation attempt on load. So sound starts the moment the user interacts. Output is mixed to **25%** in `sound.js`'s `fillBuffer` (`* 0.25`) — the raw ±1 square wave is otherwise painfully loud.

## Bundle layout

```
systems/electron/
├── play.html            ← minimal wrapper
├── elkjs.js             ← core (+ display.js row-doubling & sound.js audio patches)
├── processor.js / display.js / sound.js / keyboard.js / sheila.js / memory.js / tape.js / uef_file.js / …
├── jquery/              ← jquery-1.9.1.js + jquery-ui-1.10.3.custom.min.js
├── basic.rom, os.rom    ← Electron ROMs
├── controls.html
└── *_snap.uef           ← 6 memory-snapshot UEFs (from the set ElkJS ships; Repton 2 dropped)
```

## The positional keyboard gotcha

ElkJS's `keyboard.js` maps PC keys to the Electron matrix **by position**, so — exactly like jsbeeb — a few keys aren't where a PC user would reach for them. The values are the `keyCode → { row, mask }` table in `keyboard.js`:

| Electron key | Press on PC | keyCode |
|--------------|-------------|---------|
| `:` `*`      | apostrophe `'` | 222 |
| `/` `?`      | `/` | 191 |
| COPY         | `Home` | 36 (`/* copy = home */`) |
| DELETE       | `Backspace` | 8 |
| ESCAPE       | `Esc` | 27 |

Note COPY is **Home** here, not `End` as on jsbeeb, and there is **no** on-screen COPY button on the Electron bundle. Games scan by matrix position, so e.g. Snapper's "up" is the `:` `*` key = `'`. The gamedocs list the PC key for each affected title.

## USB gamepad support (04/07/2026)

Per-game `window.GenXGamepadMap`s in `play.html` on the shared `genx-gamepad-keys.js` shim. ElkJS reads `evt.keyCode` from `document.onkeydown`/`onkeyup`, exactly what the shim synthesizes — the one engine that needed no adaptation at all. Every game maps **Start** to its own title-screen key (Boxer and Starship Command were otherwise unstartable from a pad), and Elite gets the full six-button flight set with the vertical axis inverted (stick up climbs) — the house convention for flightsim-style games.

## Related

- [[Emulator-jsbeeb]] — sibling Acorn machine, different emulator
- [[Emulators]] — index
