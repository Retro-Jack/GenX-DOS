# gearcoleco — ColecoVision

The ColecoVision bundle was our first add-on to the shared EmulatorJS framework after the VICE family — the engine was a known quantity, but the controller wasn't.

## Where we started

EmulatorJS supports ColecoVision through Drhelius's [gearcoleco](https://github.com/drhelius/Gearcoleco) libretro core. Mirror `gearcoleco-legacy-wasm.data` into `_shared-ejs/ejs/data/cores/`, set `EJS_core = 'coleco'` (EJS aliases that internally to `gearcoleco`), wire `EJS_biosUrl` at `colecovision.rom`, and the cart boots. That bit was easy.

## The keypad problem

The ColecoVision controller has a 12-key keypad on it. Most launch-era Coleco games gate startup on **"PRESS NUMBER FOR SKILL LEVEL"**. Without a keypad, the game is unreachable. So how do you map a 12-key keypad onto a PC?

gearcoleco scatters the keypad across the RetroPad face and shoulder buttons:

| RetroPad button | ColecoVision keypad |
|---|---|
| Y | keypad 1 |
| X | keypad 2 |
| L, R, L2, R2, L3, R3 | keypad 3–8 |
| START | keypad * |
| SELECT | keypad # |
| LeftStick X-axis | keypad 9 / keypad 0 |

That mapping was the right call — every keypad button is reachable from a generic RetroPad. But EJS's default keyboard map turns those into `s / a / q / e / tab / r / <empty> / <empty>` — keypad 7 and 8 aren't bound to any key at all, and there's no period-correct number-key mapping.

## The fix: drive the whole keypad off the PC numpad

A PC numpad *is* a 12-key keypad. Period-correct shape, leaves the number row free, and means muscle memory transfers directly to the ColecoVision keypad layout:

```js
window.EJS_defaultControls = {
  0: {
    1:  { value: 'numpad 1' },   // Y      → keypad 1
    9:  { value: 'numpad 2' },   // X      → keypad 2
    10: { value: 'numpad 3' },   // L      → keypad 3
    11: { value: 'numpad 4' },   // R      → keypad 4
    12: { value: 'numpad 5' },   // L2     → keypad 5
    13: { value: 'numpad 6' },   // R2     → keypad 6
    14: { value: 'numpad 7' },   // L3     → keypad 7
    15: { value: 'numpad 8' },   // R3     → keypad 8
    3:  { value: 'multiply' },   // START  → keypad * (numpad *)
    2:  { value: 'subtract' },   // SELECT → keypad # (numpad -)
    16: { value: 'numpad 9' },   // LStickX+ → keypad 9
    17: { value: 'numpad 0' }    // LStickX- → keypad 0
  }
};
```

## A pleasant surprise vs. the VICE family

Unlike `EJS_defaultOptions` — which is overridden by `localStorage` on subsequent visits, requiring the `localStorage.clear()` dance during iteration — `EJS_defaultControls` is consumed fresh on every load. `this.controls = JSON.parse(JSON.stringify(this.defaultControllers))` at `emulator.js:2781` re-initialises from defaults on every emulator construction. Control overrides take effect immediately, no incantation required.

## NumLock as a load-bearing key

The numpad is doing all the work here. If a user has NumLock off, the keypad is dead. We wire `_shared/genx-numlock-warn.js` into `play.html` — the same defensive banner the VICE bundles use for numpad-as-joystick. Banner pops, user toggles NumLock, game works.

## The EJS button-ID cheat sheet

Useful for any future override on any other EmulatorJS bundle. From `emulator.js:3539`:

| ID | Button | Default | ID | Button | Default |
|---|---|---|---|---|---|
| 0 | B | x | 12 | L2 | tab |
| 1 | Y | s | 13 | R2 | r |
| 2 | SELECT | v | 14 | L3 | (none) |
| 3 | START | enter | 15 | R3 | (none) |
| 4 | DPAD_UP | up | 16 | LStickX+ | h |
| 5 | DPAD_DOWN | down | 17 | LStickX- | f |
| 6 | DPAD_LEFT | left | 18 | LStickY+ | g |
| 7 | DPAD_RIGHT | right | 19 | LStickY- | t |
| 8 | A | z | 20-23 | RStick X/Y +/- | l/j/k/i |
| 9 | X | a | 24-26 | Hotkeys 1/2/3 | varies |
| 10 | L | q | | | |
| 11 | R | e | | | |

`value2` is the gamepad mapping name (BUTTON_2, START, DPAD_UP, etc.) — leave it alone when overriding `value`. The merge at `emulator.js:248` does `{ ...existing, ...override }` per button, so partial `{ value: ... }` overrides preserve `value2`.

The global name is `EJS_defaultControls` (singular `Control`); internally it's passed to the config as `defaultControllers` (plural with double `l`). Easy typo trap.

## Bundle layout

```
systems/coleco/
├── play.html              ← ~85 lines, sets EJS_defaultControls
├── controls.html
├── games.json
├── colecovision.rom       ← BIOS, MD5 2c66f5911e5b42b8ebe113403548eee7
└── games/
    └── *.col              ← 10 cart images
```

The gearcoleco core lives at `systems/_shared-ejs/ejs/data/cores/gearcoleco-legacy-wasm.data` alongside the VICE cores.

## Related

- [[Emulator-VICE-family]] — same EmulatorJS framework, different cores
- [[Emulator-EmulatorJS-NES-FCEUmm]] — same EJS framework, NES
- [[Emulators]] — index
