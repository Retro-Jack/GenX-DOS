# ProSystem — Atari 7800

The Atari 7800 runs on **EmulatorJS + ProSystem** (the `prosystem` libretro core), sharing the same framework as the VICE family, ColecoVision, the NES and the 2600. Like the 2600, it got here the hard way — we shipped it on **JS7800** first, then migrated for the bezel.

## Why we left JS7800

[JS7800](https://github.com/raz0red/js7800) (raz0red, GPL-2.0) is a solid 7800 core and the original integration just meant backing out its demo-style UI (header, cart-picker, leaderboard/snackbar toasts, controls toolbar). What it couldn't do was take a CRT bezel:

- **It drives its own `requestAnimationFrame` loop and sizes its own canvas.** Pinned into a bezel's screen hole it stalled on the 7800 BIOS splash — the cart loaded (the headless console confirmed the cartridge header) but the render loop never advanced. Constrained to the hole, the picture wouldn't come up. Every other bundle lets *us* size the canvas, which is what makes the bezel possible.

EmulatorJS solves it the same way it did for the 2600: we control the canvas (bezel-ready), and the console switches map to plain keys. The `80s.png` wood-cabinet TV bezel — shared with the Atari 800XL — went on at the same time.

## The launch flow

`js7800/play.html` is the standard EmulatorJS wrapper. EmulatorJS knows the 7800 as system `atari7800`, which it resolves to the `prosystem` core:

```js
window.EJS_core = 'atari7800';
window.EJS_defaultControls = {
  0: {
    0: { value: 'z' },      // BUTTON 1 (left fire)
    8: { value: 'x' },      // BUTTON 2 (right fire)
    9: { value: 'enter' },  // RESET  → starts the game from the title
    2: { value: 'shift' },  // SELECT → cycles game variations
    3: { value: 'p' }       // PAUSE
  }
};
```

The existing `.a78` cart images and `games.json` carried straight over — ProSystem reads them unchanged.

## Controls — the RESET gotcha

The one trap: on the EmulatorJS `atari7800` scheme, **RESET is button id 9, not START (id 3)** — and on the 7800, RESET is what *starts* a game from the title screen. Mapping START there left every game stuck on its title. So `Enter` is wired to id 9 (RESET → start), `Shift` to id 2 (SELECT → variations), `P` to PAUSE. The two fire buttons are `Z` (left) / `X` (right); arrows are the d-pad.

## Bundle layout

```
systems/js7800/
├── play.html            ← EmulatorJS wrapper (EJS_core: 'atari7800')
├── controls.html
├── games.json
└── roms/
    └── *.a78            ← 7800 cart images (reused unchanged)
```

The core itself lives in the shared framework at `systems/_shared-ejs/ejs/data/cores/prosystem-legacy-wasm.data`; the old `js7800/js/` engine (JS7800 + bupboop) is gone. Save / load state work through the GenX save/load menus like the other EmulatorJS bundles.

## Related

- [[Emulator-Stella]] — sibling Atari console, same Javatari→EmulatorJS migration story
- [[Emulator-VICE-family]] — the shared EmulatorJS gotchas
- [[Emulators]] — index
