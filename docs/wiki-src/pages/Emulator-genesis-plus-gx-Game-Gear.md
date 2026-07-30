# genesis_plus_gx — Sega Master System + Game Gear

One core, two Sega machines. **EmulatorJS + genesis_plus_gx** (the accuracy-focused Sega libretro core, also used for the Mega Drive) drives both the handheld **Game Gear** and the console **Master System** from a single shared `.data` file. The Game Gear came first as a handheld; the Master System landed later (04/07/2026, replacing the retired Vectrex) and reuses the same already-shipped core. The Game Gear story is below; the Master System section follows it.

## Game Gear

Sega's colour, backlit answer to the Game Boy. It's the third and final platform in the **Handheld Consoles** category, completing the set alongside the [[Emulator-gambatte-Game-Boy|Game Boy]] and [[Emulator-handy-Atari-Lynx|Lynx]].

## Same bezel style — held up in class

The Game Gear reuses the handheld bezel style: the device held up in the **foreground over the classroom photo**, bottom-anchored and sized to 75%. `gamegear.png` (1523×818, wide landscape, screen keyed transparent), EJS in the screen hole. See [[Emulator-gambatte-Game-Boy]] for the full layer recipe — only the device image and hole coordinates differ.

## The core: system `segaGG`

```js
genxBootEJS({
  title: 'Sega Game Gear',
  coreName: 'segaGG',          // EJS resolves 'segaGG' → genesis_plus_gx
  defaultControls: { 0: { 0:{value:'z'}, 8:{value:'x'}, 3:{value:'enter'},
                          4:{value:'up arrow'},5:{value:'down arrow'},6:{value:'left arrow'},7:{value:'right arrow'} } }
});
```

`genesis_plus_gx` **stable** works — no nightly swap. No BIOS needed.

## Volume — EJS doesn't clamp above 1.0

The Game Gear's PSG is quiet, and EJS defaults its master volume to **0.5**. Useful finding: EJS reads `EJS_volume` and passes it **straight to a Web Audio gain node with no clamp** (`emulator.js`: `gain.gain.value = volume`), so values **above 1.0 genuinely amplify**. This bundle runs `window.EJS_volume = 1.5;` (150%) in its `play.html` — Game-Gear-only, not the shared boot. (At >1.0 the loudest passages can clip a touch; 1.25 is a safer ceiling if it sounds harsh.) The same trick works for any bundle that's too quiet.

## Controls

Arrows = d-pad, **Z** = Button 1, **X** = Button 2, **Enter** = Start. Most games use the two buttons as jump + attack (either way round); each gamedoc spells out the per-game meaning.

## Library

A Sega showcase, year-sorted: Columns (the pack-in), Sonic the Hedgehog (the 8-bit GG game, distinct from the Mega Drive one), Shinobi, Aerial Assault, Streets of Rage, Defenders of Oasis (a full RPG), Land of Illusion (Mickey), Mortal Kombat (Sega kept the gore), Dr. Robotnik's Mean Bean Machine, Tails Adventure. Gamedocs at `gamedocs/gamegear/<key>.html`. ROMs are `.gg`.

## Bundle layout

```
systems/gamegear/
├── play.html            ← genxBootEJS wrapper (coreName: 'segaGG', EJS_volume 1.5)
├── controls.html
├── games.json
└── roms/
    └── *.gg
```

The core lives once in `systems/_shared-ejs/ejs/data/cores/genesis_plus_gx-legacy-wasm.data` — shared with the Master System bundle below (and with any future genesis_plus_gx machine).

## Master System

The 8-bit console the Game Gear was built from. It shipped 04/07/2026 as `systems/sms/`, replacing the retired Vectrex, and rides the **same genesis_plus_gx core** already on disk for the Game Gear — no extra `.data`.

### The core: system `segaMS`, but name the core explicitly

```js
genxBootEJS({
  title: 'Sega Master System',
  coreName: 'genesis_plus_gx',   // NOT 'segaMS'
  controlScheme: 'segaMS'        // forwarded so EJS applies SMS button labels
});
```

The gotcha: EJS's `segaMS` **system alias** resolves to `smsplus`, a core we don't bundle. So `coreName` is set to the concrete `genesis_plus_gx` (which runs the SMS natively), while `controlScheme: 'segaMS'` is passed through `genx-ejs-boot.js` so the pad/keyboard still gets the Master System's control layout. `stable` core, no BIOS.

### CRT bezel — it's a console, not a handheld

Unlike the Game Gear's held-up-device bezel, the Master System wears the shared **`80s.png` wood-cabinet CRT television** (on the `70s-bg.png` wallpaper, screen keyed transparent) — the same TV bezel the Atari 400/800 bundles use. It sits under the **CONSOLE** parent menu.

### Library

Year-sorted, ten titles: Alex Kidd in Miracle World (1986, the de-facto pack-in), Fantasy Zone, Wonder Boy, Out Run (1987), Phantasy Star (1988, with a **battery save** that persists to IndexedDB), R-Type, Shinobi, Psycho Fox (1989), Castle of Illusion (1990), and the 8-bit Sonic the Hedgehog (1991). Gamedocs at `gamedocs/sms/<key>.html`; ROMs are `.sms`. Five save-state slots via the shared `_shared/genx-savestate.js`, plus native USB gamepad support.

## Related

- [[Emulator-gambatte-Game-Boy]] · [[Emulator-handy-Atari-Lynx]] — sibling handhelds, same bezel style
- [[Emulators]] — index
