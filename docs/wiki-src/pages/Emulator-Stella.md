# Stella — Atari 2600

The Atari 2600 runs on **EmulatorJS + Stella** (the `stella2014` libretro core), sharing the same framework as the VICE family, ColecoVision and the NES. It got here the hard way — we shipped it on **Javatari** first, then migrated.

## Why we left Javatari

Javatari.js (Paulo Peccin, AGPL-3.0) is a lovely self-contained 2600 emulator and the original integration was a one-liner. Two things eventually pushed us off it:

1. **It sizes its own canvas to the window.** Every other bundle lets *us* size the canvas, which is what makes a CRT bezel possible — shrink the picture into the bezel's screen hole. Javatari ignores any container we give it and fills the viewport, so it's the one engine we couldn't bezel. (We tested it: a hard-capped `#javatari-screen` was completely ignored.)
2. **GAME SELECT / RESET were on F11 / F12** — browser-reserved (fullscreen / devtools). The only reliable way to hit them was Javatari's on-screen console faceplate, which is itself chrome we'd otherwise want to hide. Reset *starts* most 2600 games, so this wasn't optional.

EmulatorJS solves both: we control the canvas (bezel-ready), and the console switches map to plain keys.

## The launch flow

`stella/play.html` is the standard `genxBootEJS` wrapper. EmulatorJS knows the 2600 as system `atari2600`, which it resolves to the `stella2014` core:

```js
genxBootEJS({
  title: 'Atari 2600',
  coreName: 'atari2600',
  defaultControls: {
    0: {
      0: { value: 'space' },        // FIRE
      2: { value: 'v' },            // GAME SELECT
      3: { value: 'enter' },        // GAME RESET
      4: { value: 'up arrow' }, 5: { value: 'down arrow' },
      6: { value: 'left arrow' }, 7: { value: 'right arrow' }
    }
  }
});
```

The existing `.a26` cart images carried straight over — Stella reads them unchanged.

## Controls

EmulatorJS has a dedicated `atari2600` control scheme (`emulator.js`, button-label block): **id 0 = FIRE, 2 = SELECT, 3 = RESET**, 4–7 = the joystick, and 10–15 = the difficulty A/B and Color/B-W switches (these stay on the EJS defaults `Q`/`E`/`Tab`/`R`, rarely needed). So on the keyboard:

- **Arrows** — joystick · **Space** — fire
- **Enter** — GAME RESET (starts/restarts most games)
- **V** — GAME SELECT (cycles the game variant)

A 2600 wrinkle worth documenting per-game: **Reset starts the game, but FIRE serves the ball** in paddle/serve games. Breakout, for instance, needs `Enter` to start and then `Space` to serve each ball.

## EJS chrome

Like the other EJS bundles, Stella inherits the shared `.ejs_menu_bar, .ejs_context_menu { display: none }` rule in `genx-frame.css`, so EmulatorJS's control bar doesn't pop up on mouse-move — only the screen shows.

## CRT bezel — the first on an EJS bundle (12/06/2026)

Bezeling Stella was the *whole point* of leaving Javatari, and it's the first time we've wrapped an EmulatorJS bundle in a CRT frame. The bezel is `70s.png` — a wood-cabinet console TV with legs, keyed out of its photo (background removed, screen alpha'd to a transparent hole) so the set floats on the 70s wallpaper. The trick is that EJS owns the canvas, so instead of sizing a `#canvas` ourselves (as the standalone-engine bezels do), we drop the EJS player div (`#game`) into the bezel's screen hole and let EJS draw into it:

```
.bezel-wrap  (1240x855, aspect of 70s.png)
  .screen-bg (black backdrop, slightly LARGER than the hole — stops the
              wallpaper bleeding through the cutout's soft edge)
  #game      (the EJS player at the measured hole: 27.6% / 13.1% / 45.4% × 51.6%)
  .bezel-img (70s.png on top, transparent screen hole)
```

EJS fits the canvas to `#game` preserving aspect, which leaves a top/bottom letterbox inside the hole. One CSS line on the canvas closes and sizes it:

```css
#game canvas { height: 100% !important; transform: translateX(-18px) scale(0.85); }
```

`height: 100%` stretches only the height (the width already filled the hole — forcing *both* dimensions overshot, because the EJS canvas's parent is wider than the hole). `translateX(-18px)` nudges the picture left so a black margin shows on the right, and `scale(0.85)` shrinks it to sit comfortably inside the glass rather than running edge-to-edge. This same pattern (player-in-hole + height-stretch) is the template for eventually bezeling the VICE family, ColecoVision and NES. *(The −18px and 0.85 are tuned to a desktop window — worth revisiting if they drift at very different sizes.)*

## Bundle layout

```
systems/stella/
├── play.html            ← genxBootEJS wrapper (coreName: 'atari2600')
├── controls.html
├── games.json
└── roms/
    └── *.a26            ← 2600 cart images (reused from the Javatari bundle)
```

The Stella core itself lives once in `systems/_shared-ejs/ejs/data/cores/stella2014-legacy-wasm.data`, shared with the rest of the EJS family.

## Related

- [[Emulator-EmulatorJS-NES-FCEUmm]] — sibling EJS bundle
- [[Emulator-gearcoleco-ColecoVision]] — sibling EJS bundle
- [[Emulator-EmulatorJS-7800-ProSystem]] — sibling Atari console (same Javatari/JS7800 → EmulatorJS migration)
- [[Emulators]] — index
