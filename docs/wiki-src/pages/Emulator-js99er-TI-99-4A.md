# js99er — TI-99/4A

The TI-99/4A bundle was uneventful by GenX-DOS standards — one script-load-order gotcha, no broken cores. Worth recording precisely *because* it was clean.

## Where we started — picking the right upstream

js99er has two upstreams:

- **Vanilla JS** at [github.com/Rasmus-M/js99er](https://github.com/Rasmus-M/js99er), mirrored at `http://old.js99er.net`. Simple `<script>` tags, no build step, works as a plain copy of `src/`.
- **Angular** at [github.com/Rasmus-M/js99er-angular](https://github.com/Rasmus-M/js99er-angular), at the active `https://js99er.net`. Heavier, harder to embed.

We took the vanilla JS one. No benefit to an Angular build for a single-cart launcher page, and the deploy is just a copy.

## The script load order — the one easy mistake

`minimal.html` (upstream template) loads 25 scripts in a specific order. The easy mistake is to forget the last three: `sound.js`, `settings.js`, `database.js`. Symptom: page sticks on "Loading…" with `Settings is not defined` in console. We hit this exactly once; fix was to add the three trailing scripts.

The full load order, for the record:

```
util.js, log.js
lib/jquery-1.11.0.min.js, lib/zip/zip.js, lib/zip/zip-ext.js
software/system.js, software.js
emu/{tape, disk, decoder, tms9900, tms9918a, f18a, f18agpu,
     f18aflash, sn76489, tms9919, tms5220, memory, cru,
     keyboard, joystick, ti994a}.js
sound.js, settings.js, database.js
```

## The boot pattern

```js
var settings = new Settings(false);
settings.setF18AEnabled(false);
var ti994a = new TI994A(canvas, {FLOPPY1: new DiskImage("FLOPPY1")}, settings);
var sound = new Sound(settings.isSoundEnabled(), ti994a.tms9919, ti994a.tms5220);
ti994a.start();
```

With no cart: boots to the TI-99/4A title screen — press <kbd>1</kbd> for TI BASIC.
With cart: title screen offers the cart name as option 2 — press <kbd>2</kbd>.

## The cart format

js99er can load three formats:

- `.rpk` — zipped `layout.xml` + raw ROM/GROM/inverted-ROM segments. Canonical format; loaded via `software.loadRPKModuleFromURL(url, onSuccess, onError)`. Needs `zip.js` (loaded).
- `.bin` — raw ROM/GROM. Loaded via `software.loadBinModuleFromURL`. Suffix matters: `…g.bin` = GROM, `…3.bin` = inverted ROM (paged379i), otherwise regular ROM.
- `.json` — js99er's own descriptor: `{"name": "...", "rom": ["AABB..."]}` hex-string array. Loaded via `software.loadProgram` (the generic fallback).

We used `.rpk` because that's what the public archive serves.

## URL pattern

`?game=<key>` is read directly by `play.html` and never rewritten, so the key is still in the URL when the deferred `genx-controls-link.js` runs and resolves `docs/games/js99er/<key>.html` cleanly. Cart files live at `systems/js99er/carts/<key>.rpk` — rename on download to match the key.

## What we kept vs stripped

- **Kept:** `emu/`, `lib/`, `sound/`, `software/system.js`, `util.js`, `log.js`, `sound.js`, `settings.js`, `database.js`, `software.js`
- **Stripped:** `index.html`, `fullscreen.html`, `js99er.js`, `disassembler.js`, `objLoader.js`, `css/`, `fonts/`, `images/`, `manifest.json`, `icon.png`, and every cart/disk/.json under `software/` except `system.js`

Bundle size: ~1.5 MB without carts, +~141 KB for our 10 carts.

## A note on F18A

The F18A is an enhanced VDP — a community-developed FPGA replacement for the original 9918a. js99er can emulate it via `settings.setF18AEnabled(true)`. None of our 10 carts use it, and enabling it changes the display chip emulation in ways that could affect period-correct rendering. So we explicitly disable it.

## A post-bundle-add orphan pass

When we added this bundle we ran the standard orphan-prune pass and pruned 11 files (~200 KB) that `play.html` doesn't load: `emu/ams.js`, `emu/googledrive.js`, `lib/audioBufferToWav.js`, `lib/bootstrap*.min.js` (4 variants), `lib/fileSaver.js`, `lib/imageMapResizer.js`, `lib/zip/mime-types.js`, `lib/zip/zip-fs.js`. **Kept `lib/zip/inflate.js`** — it's the worker for the `.rpk` pipeline. AMS + GoogleDrive were safe to delete because `settings` disables both at boot (constructors never instantiated).

## Save / load state

js99er's `TI994A` instance exposes `getState()` (a JSON-serializable snapshot) / `restoreState()`, so `play.html` exposes the instance and registers a `GenXStateAdapter` around them; `_shared/genx-savestate-std.js` draws the bottom-left **save** / **load** menus. **The gotcha that drove the shared core's design:** `memory.getState()` returns `this.ram` *by reference*, so a naive saved slot keeps mutating with the running machine (load looked like a no-op). The std core therefore deep-clones state on both save and load — `structuredClone` in memory (typed-array-tagged JSON as a fallback); the five per-game slots persist to IndexedDB.

## Bundle layout

```
systems/js99er/
├── play.html
├── controls.html
├── games.json
├── util.js, log.js, sound.js, settings.js, database.js, software.js
├── lib/    (jquery, zip)
├── emu/    (tms9900, tms9918a, ti994a, etc.)
├── software/system.js
└── carts/  (10 .rpk files)
```

## Related

- [[Emulators]] — index
