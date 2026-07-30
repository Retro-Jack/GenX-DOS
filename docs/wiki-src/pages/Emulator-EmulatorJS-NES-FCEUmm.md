# FCEUmm — NES

The NES bundle lives at `systems/jsnes/`. The directory name is a legacy artefact — the bundle migrated from bfirsh/jsnes to EmulatorJS + FCEUmm a while ago. The dir was kept to avoid forcing every `fs.js` link to change. If you're looking at the directory and wondering why an EmulatorJS bundle is named `jsnes/`, that's why.

## Where we started

The first NES bundle used [bfirsh/jsnes](https://github.com/bfirsh/jsnes) v2.1.0, a pure-JS NES emulator. It worked, but its audio pipeline used the deprecated `ScriptProcessorNode` path, which is glitchy in modern browsers — clicks, dropouts, frame-locked audio drift. Long-term that path is going away entirely.

EmulatorJS + the [FCEUmm](https://github.com/libretro/libretro-fceumm) libretro core has a clean AudioWorklet pipeline. Same gain in audio quality the rest of the EmulatorJS bundles got.

## The migration

The shape is the same as every other EJS bundle. From the C64 recipe:

- `EJS_core = 'nes'`
- `EJS_pathtodata` computed from URL relative to `_shared-ejs/ejs/data/`
- `EJS_startOnLoaded = true`
- `EJS_DEBUG_XX = true`
- FCEUmm core lives at `_shared-ejs/ejs/data/cores/fceumm-legacy-wasm.data`

Same `localStorage` ambush, same `-legacy-` core variant gotcha, same `EJS_DEBUG_XX` workaround as the VICE family. Refer to [[Emulator-VICE-family]] for the long-form explanation of each — they apply identically.

## The B/A swap that came along for the ride

bfirsh/jsnes mapped X = A, Z = B — period-correct (A on right, B on left, X is the right-hand key, Z is the left-hand key). EmulatorJS's RetroPad default is the inverse: B (button 0) on `x`, A (button 8) on `z`. Period-correct to the physical NES is the opposite *direction*: A is the right button, so it should be the right-hand key.

Either side has a defensible reading. The deciding factor: users who'd already learned the bfirsh layout. Swap the defaults to preserve muscle memory:

```js
window.EJS_defaultControls = {
  0: {
    0: { value: 'z' },  // B
    8: { value: 'x' }   // A
  }
};
```

X stays A, Z stays B. Anyone who learned the old build doesn't have to relearn.

## A documentation gotcha

When adding new emulator-list claims to README / ATTRIBUTION / Roadmap / File-Structure, the current set of EmulatorJS libretro cores is: **FCEUmm + gearcoleco + 4 VICE cores (x64, x128, xvic, xplus4)**. FCEUmm is easy to forget when listing them — the dir name "jsnes" doesn't suggest a libretro core lives behind it. The PET used to ride along on `vice_xpet` but was migrated out in June 2026; see [[Emulator-pet2001-Skibo]].

## Bundle layout

```
systems/jsnes/      ← name is legacy; runtime is EJS+FCEUmm
├── play.html         ← B/A swap + standard EJS bootstrap
├── controls.html
├── games.json
└── games/
    └── *.nes
```

The FCEUmm core lives at `systems/_shared-ejs/ejs/data/cores/fceumm-legacy-wasm.data`.

## Related

- [[Emulator-VICE-family]] — same EJS bootstrap pattern, all the EJS gotchas explained in full
- [[Emulator-gearcoleco-ColecoVision]] — sibling EJS bundle with controller overrides
- [[Emulators]] — index
