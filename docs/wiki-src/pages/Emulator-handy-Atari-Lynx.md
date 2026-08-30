# handy — Atari Lynx

The Atari Lynx — the world's first colour handheld (1989), with hardware sprite-scaling and rotation — runs on **EmulatorJS + handy** (the Lynx libretro core), the second platform in the **Handheld Consoles** category after the [[Emulator-gambatte-Game-Boy|Game Boy]].

## Same bezel style — held up in class

The Lynx reuses the handheld bezel style: the device is held up in the **foreground over the classroom photo** (`classroom.jpg`), not a CRT on the wallpaper. The Lynx is a wide landscape unit (`Lynx.png`, 2097×853, screen keyed to a transparent hole), bottom-anchored and sized to 75%. EJS draws into the screen hole; `#game canvas { height: 100% !important; transform: scale(0.95); }`. See [[Emulator-gambatte-Game-Boy]] for the full layer recipe — only the device image and the screen-hole coordinates differ.

## The boot ROM

Unlike most of the EJS bundles, **handy needs the Lynx boot ROM** (`lynxboot.img`, 512 bytes) to start games — without it, nothing loads. It ships in the bundle and is handed to the core via `genxBootEJS`'s `biosUrl`:

```js
genxBootEJS({
  title: 'Atari Lynx',
  coreName: 'lynx',          // EJS resolves 'lynx' → handy
  biosUrl: 'lynxboot.img',
  defaultControls: { 0: { 0:{value:'z'}, 8:{value:'x'}, 3:{value:'enter'},
                          10:{value:'shift'}, 11:{value:'ctrl'},
                          4:{value:'up arrow'},5:{value:'down arrow'},6:{value:'left arrow'},7:{value:'right arrow'} } }
});
```

The `handy` **stable** core works fine — no nightly swap needed (unlike `gambatte` and `vice_x128`).

## Controls

Arrows = d-pad, **X** = A, **Z** = B, **Shift** = Option 1, **Ctrl** = Option 2, **Enter** = Pause. The Lynx had no fixed orientation and games used A/B/Option however they liked, so each gamedoc spells out the per-game meaning. (handy also has a `handy_rot` option for the games meant to be played rotated — none of the bundled 10 are.)

## Library

A showcase set leaning on the Lynx's colour and scaling, year-sorted: California Games (the pack-in), Chip's Challenge (a Lynx *original* — it predates the Windows version), Electrocop, Blue Lightning, Warbirds (all 1989 launch titles), Zarlor Mercenary, Klax, Todd's Adventures in Slime World, S.T.U.N. Runner, Rampart. Gamedocs at `docs/games/lynx/<key>.html`. ROMs are `.lnx` (64-byte-header format the core reads directly).

## Bundle layout

```
systems/lynx/
├── play.html            ← genxBootEJS wrapper (coreName: 'lynx', biosUrl)
├── controls.html
├── games.json
├── lynxboot.img         ← 512-byte Lynx boot ROM (required)
└── roms/
    └── *.lnx
```

The handy core lives once in `systems/_shared-ejs/ejs/data/cores/handy-legacy-wasm.data`.

## Related

- [[Emulator-gambatte-Game-Boy]] — sibling handheld, same bezel style
- [[Emulator-VICE-family]] — the shared EmulatorJS gotchas
- [[Emulators]] — index
