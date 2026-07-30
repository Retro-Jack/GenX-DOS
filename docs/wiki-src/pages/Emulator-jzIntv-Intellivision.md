# jzIntv — Intellivision

The Intellivision bundle was where the shared-EJS pattern ran out: EmulatorJS doesn't ship an Intellivision core, full stop. So the Intellivision bundle is on its own — a custom emscripten loader with no EJS at all.

## Where we started — and why we left EJS

The first check was whether EmulatorJS supports Intellivision. Verified 2026-05-20 against `cdn.emulatorjs.org/stable/data/cores/`: no `freeintv`, no `intellivision`, no `intv` files; the official supported-systems list confirms it. No EJS-flavoured Intellivision core exists at all. The shared-EJS pattern the VICE family + Coleco use doesn't apply here.

So we needed a standalone WASM emulator with its own loader. Joe Zbiciak's [jzIntv](http://spatula-city.org/~im14u2c/intv/) is *the* Intellivision emulator, but it's distributed as a C source tree, not a browser build.

## The WASM source

The jzIntv WASM build came from [mholzinger/intellivision-overlay-editor](https://github.com/mholzinger/intellivision-overlay-editor) — an overlay-design tool that happened to bundle a fully-working jzIntv WASM at `static/wasm/`. The repo has no published `LICENSE` file but README badges MIT for the wrapper code; the underlying jzIntv source is free-for-personal-use. We mirrored just three files: `jzintv.js` (127 KB), `jzintv.wasm` (364 KB), and `jzintv.data` (1.2 KB).

No separate `jzintv-wasm` repo exists. If the overlay-editor stops being maintained, the fallback would be building jzIntv to WASM from `libretro/jzintv` source via emsdk — a couple of hours of work, but not pleasant.

## The launch API

`jzintv.js` exposes one function, `Module.launchJzintv()`, that does everything we need:

```
Module.launchJzintv(execBuffer, gromBuffer, romBuffer, cfgBuffer,
                    extraArgs, ecsBuffer, jlpData, romExt, ivoiceBuffer)
```

Internally it writes `exec.bin`, `grom.bin`, `game.<ext>` (and optional `game.cfg`, `ecs.bin`, `ivoice.bin`, `game.jlp`) into the WASM FS via `Module.FS.writeFile`, builds argv as `["-e", "exec.bin", "-g", "grom.bin", "-v1", "-z1", "--kbdhackfile=desk.kbd"]` + `extraArgs` + `[romFile]`, then calls `Module.callMain(args)`.

`play.html` fetches BIOS + cart in parallel and hands the buffers off:

```js
const [execBuf, gromBuf, romBuf] = await Promise.all([
  fetch('exec.bin').then(r => r.arrayBuffer()),
  fetch('grom.bin').then(r => r.arrayBuffer()),
  fetch(game.rom).then(r => r.arrayBuffer())
]);
window.Module = {
  canvas: document.getElementById('canvas'),
  noInitialRun: true,
  onRuntimeInitialized: function() {
    Module.launchJzintv(execBuf, gromBuf, romBuf, null, [], null, null, 'int', null);
  }
};
```

`noInitialRun: true` is mandatory. Without it, Module calls `main()` with no args before our `launchJzintv` gets a chance to set up the FS, and the emulator runs with no ROM loaded.

## The `desk.kbd` parser landmines

jzIntv reads its keyboard map from a `--kbdhackfile`. The default `desk.kbd` shipped with mholzinger's build only has keypad and action-button mappings — no disc/D-pad bindings at all. Without disc input, no Intellivision game is playable. We had to write our own.

The parser turned out to be sensitive in three non-obvious ways:

1. **No UTF-8 in comments.** A `→` (U+2192) or `—` (U+2014) breaks parsing — the multi-byte sequence throws off tokenisation and the error surfaces as `Unknown command '7'` (or whatever digit appears next). ASCII-only mandatory.
2. **No apostrophes in comments.** A line like `; Names must match jzintv's SDL key tokens` errors with `Too many arguments in kbdhackfile`. The `'` is presumably being parsed as a string delimiter even inside a comment.
3. **Disc bindings must come last.** Putting `UP/DOWN/LEFT/RIGHT → PD0L_D_*` lines *before* `LSHIFT/LCTRL/LALT → PD0L_A_*` in the same MAP block causes the action-button names to be rejected with `Unknown command 'LALT'`. Putting the disc lines at the end (after all keypad and action-button bindings) works cleanly. Mechanism unclear — possibly a buffer-size or state-machine quirk in jzintv's binding-table allocator. Just keep disc bindings at the bottom.

## The `desk.kbd` we ship

`jzintv.data` is an emscripten `--preload-file` package containing `desk.kbd` at the WASM FS root. Our expanded version (~1.2 KB, plain ASCII) adds:

- Arrow keys → disc N/S/W/E (jzintv synthesises diagonals when you hold two arrows)
- Numpad → keypad (period-correct shape: a numpad *is* a 12-key keypad)
- Space → top action button (alias of LShift) for one-handed play

jzintv's code-name table for the relevant subset:

- Disc: `PD0L_D_N`, `_S`, `_E`, `_W` (and `_NE`, `_SE`, `_NW`, `_SW`, plus 8 in-between)
- Action buttons: `PD0L_A_T` (top), `PD0L_A_L` (bottom-left), `PD0L_A_R` (bottom-right)
- Keypad: `PD0L_KP1` … `PD0L_KP9`, `PD0L_KP0`, `PD0L_KPC` (CLR), `PD0L_KPE` (ENT)
- Player 2: same names with `PD0R_` prefix

## BIOS

`exec.bin` (8 KB, MD5 `62e761035cb657903761800f4437b8af`) + `grom.bin` (2 KB, MD5 `0cd5946c6473e42e8e4c2137785e427f`). Both Mattel copyright, bundled for emulator-only use — same legal posture as the Coleco BIOS we already ship.

## Reuse caveats

This recipe — emscripten `Module` loader + `launchJzintv` API — does *not* generalise to other libretro WASM cores. It's specific to jzIntv's API shape. Future WASM-but-not-EJS emulators (a hypothetical px68k X68000 WASM, or a NINTV-DS port) will each have their own Module + arg conventions and need their own bespoke `play.html`.

## Bundle layout

```
systems/intv/
├── play.html       ← ~80 lines, custom Module loader
├── controls.html
├── games.json
├── exec.bin        ← BIOS
├── grom.bin        ← BIOS
├── jzintv.js       ← emscripten glue, 127 KB
├── jzintv.wasm     ← emulator, 364 KB
├── jzintv.data     ← preload: custom desk.kbd
└── games/
    └── *.int       ← 10 cart images
```

Total bundle ~625 KB.

## Related

- [[Emulator-XRoar-CoCo]] — different emscripten-loader gotchas
- [[Emulator-libretro-o2em-Odyssey2]] — same "no EJS core exists" pattern, different solution
- [[Emulators]] — index
