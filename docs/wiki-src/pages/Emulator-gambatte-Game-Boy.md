# gambatte — Nintendo Game Boy / Game Boy Color

The Game Boy line runs on **EmulatorJS + gambatte** (the accuracy-focused GB/GBC libretro core), the 10th bundle to share the framework at `systems/_shared-ejs/`. It's the first entry in the new **Handheld Consoles** menu category (alongside the still-to-build Atari Lynx and Sega Game Gear).

## A new bezel style — the device in your hands, in class

Every other bundle frames its display as a **CRT on the 70s wallpaper**. The handhelds flip that: the device is held up in the **foreground over a full-bleed photo**. The Game Boy Color sits bottom-anchored over a **classroom photo** — the look of sneaking a handheld under the desk in class.

```
body { background: classroom.jpg cover; align-items: flex-end; }   /* held up from your lap */
  .bezel-wrap                  (aspect of gbc.png, height-capped)
    .screen-bg  (black backdrop, slightly larger than the hole)
    #game       (EJS player at the screen hole)
    .bezel-img  (gbc.png — grape GBC, screen keyed to a transparent hole)
```

`#game canvas { height: 100% !important; transform: scale(0.95); }` seats the picture inside the screen. The device PNG is maintainer-keyed (re-cropped so the device bottom = image bottom, for the bottom-anchor). This is the template for the upcoming Lynx + Game Gear.

## Two gotchas

**The `stable` gambatte core is broken** — it renders a blank white panel, no ROM ever displays (verified with a dead-simple ROM-only test cart). Same broken-`stable` story as `vice_x128`. We mirror the **`nightly`** build (`cdn.emulatorjs.org/nightly/data/cores/gambatte-legacy-wasm.data`), which works.

**Boot in GBC mode** so the bundle plays both generations:

```js
genxBootEJS({
  title: 'Game Boy Color',
  coreName: 'gb',
  defaultOptions: { 'gambatte_gb_hwmode': 'GBC' },   // else CGB-only carts show white
  defaultControls: { 0: { 0:{value:'z'}, 8:{value:'x'}, 2:{value:'shift'}, 3:{value:'enter'},
                          4:{value:'up arrow'},5:{value:'down arrow'},6:{value:'left arrow'},7:{value:'right arrow'} } }
});
```

In GBC mode, the colour-only cart (Shantae) runs, and the mono games get gambatte's auto-colourisation so they pop against the bright classroom.

## Controls

The universal Game Boy keyboard layout: **arrows** = d-pad, **X** = A, **Z** = B, **Enter** = Start, **Shift** = Select.

## Library

A deliberate mix of GB classics and GBC colour showpieces, year-sorted: Tetris, Super Mario Land, Castlevania: The Adventure, Gargoyle's Quest, Kirby's Dream Land, Link's Awakening, Donkey Kong ('94), Pokémon Red, Final Fantasy Adventure (all GB), Shantae (GBC). Each has a per-game gamedoc at `gamedocs/gbc/<key>.html`.

## Bundle layout

```
systems/gbc/
├── play.html            ← genxBootEJS wrapper (coreName: 'gb', GBC hwmode)
├── controls.html
├── games.json
└── roms/
    └── *.gb / *.gbc
```

The gambatte core lives once in `systems/_shared-ejs/ejs/data/cores/gambatte-legacy-wasm.data`.

## Related

- [[Emulator-VICE-family]] — the shared EmulatorJS gotchas (and the other broken-`stable`→`nightly` core, x128)
- [[Emulator-Stella]] — sibling EJS bundle (the first CRT bezel on EJS)
- [[Emulators]] — index
