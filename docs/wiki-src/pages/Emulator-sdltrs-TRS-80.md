# sdltrs — Tandy TRS-80 Model I

The TRS-80 Model I is the second GenX-DOS bundle compiled from source to WASM (after [[Emulator-atari800]]). It runs **sdltrs** (Mark Grebe / Jens Guenther) — the SDL2 TRS-80 emulator, BSD-2-Clause, still actively maintained.

## Why sdltrs

The shortlist:

1. **lkesteloot/trs80** — a clean TypeScript/ESM emulator, easy to embed. It works, but renders the screen with a baked-in green-phosphor padding border (an overscan frame around the text) that fought the CRT bezel, and exposes no save-state. It was the starting point but got replaced.
2. **No libretro TRS-80 core** ships in the EmulatorJS-flavoured set, so the EJS route was out (unlike most recent additions — see [[Emulator-VICE-family]] for that path).
3. **sdltrs** — accurate, maintained, renders a plain 512×384 text area with no phosphor padding (so the canvas just fills the bezel cutout), and has a built-in save-state in C (`trs_state_save` / `trs_state_load`). Worth building.

Source: **`https://gitlab.com/jengun/sdltrs`** — the matching `jengun` GitHub repo 404s; GitLab is the live one.

## The build

emscripten via emsdk (lives at `~/emsdk/`), same toolchain as atari800. sdltrs is a flat `src/*.c` SDL2 program, so the recipe is a single `emcc` of all the sources — no autotools:

```sh
emcc $SRCS -O2 -DSDL2 -DROM_PATH='""' -sUSE_SDL=2 -sASYNCIFY \
  -sALLOW_MEMORY_GROWTH=1 -sINITIAL_MEMORY=32MB -sFORCE_FILESYSTEM=1 \
  -sMODULARIZE=1 -sEXPORT_NAME=createSDLTRS \
  -sEXPORTED_RUNTIME_METHODS="['FS','callMain','ccall','cwrap']" \
  -sEXPORTED_FUNCTIONS="['_main']" \
  --embed-file ../../level2.rom@/level2.rom -o ../out/sdltrs.js
```

`$SRCS` is every `src/*.c` including `PasteManager.c` — its X11 clipboard paths are `#ifdef`-guarded out under `-DSDL2`. Output: `sdltrs.js` (~190 KB) + `sdltrs.wasm` (~1.3 MB).

### `-sASYNCIFY` and two yield patches

Like atari800, sdltrs runs a blocking continuous loop (`z80_run(1)`, `main()` never returns), so `-sASYNCIFY` is non-optional. But ASYNCIFY only helps if the loop actually *yields*. sdltrs's throttle uses `SDL_Delay`, which busy-waits under emscripten and freezes the page. Two `#ifdef __EMSCRIPTEN__` patches fix it:

- `trs_interrupt.c`, `trs_timer_sync_with_host()` — replace the `SDL_Delay(...)` throttle with `emscripten_sleep(...)`, and call `emscripten_sleep(0)` even when no delay is due, so the loop yields **once per timer tick** no matter what.
- `trs_sdl_interface.c`, `trs_get_event()` — the paused-machine `SDL_WaitEvent` path busy-waits too; swap it for `while (!SDL_PollEvent(&event)) emscripten_sleep(10);`.

With those, `emscripten_sleep` unwinds the stack each tick, the browser paints, and the `createSDLTRS` factory promise resolves.

### `-sMODULARIZE` load order

The build emits a `createSDLTRS(moduleOverrides)` factory. `sdltrs.js` **must** load before the inline boot code that calls it — a load-order slip gives "createSDLTRS is not defined", silently swallowed inside the boot's async IIFE.

## The ROM

`play.html` boots with the **Model I Level II BASIC ROM** (12 288 bytes, md5 `ca74822ebc2803c6635a55116ecd9539`), embedded into the WASM at `/level2.rom` via `--embed-file`. It was extracted from the `trs80-emulator` npm package (`dist/Model1Level2Rom.js`) — note that `model1Level2Rom` is a **latin1 binary string**: `Buffer.from(str, 'latin1')`, not utf-8, or you get 17 210 corrupt bytes. © Tandy / Microsoft; bundled for emulator-only use (recorded in ATTRIBUTION).

## The `play.html` contract

```js
createSDLTRS({
  canvas,
  arguments: ['-m1', '-romfile1', '/level2.rom', '-noled', '-borderwidth', '0', '-scale', '2', '/game.cmd'],
  preRun: [m => m.FS.writeFile('/game.cmd', cmdBytes)],
});
```

`-m1` = Model I, `-noled -borderwidth 0` = a clean 512×384 (4:3) text area with no chrome (1024×768 at `-scale 2`). The `.cmd` is written to MEMFS and passed as a **positional arg**; sdltrs's `trs_load_cmd` runs it after reset and jumps straight into the program — no disk boot.

### The canvas backing-store gotcha (cost an hour)

sdltrs uses the **software** video path (`SDL_GetWindowSurface` / `SDL_UpdateWindowSurface` = a raw `putImageData` into the canvas). Emscripten does **not** resize the canvas backing store on this path — it stays at the HTML default 300×150 — and `width:100%` CSS only sets the *display* size. So the 1024×768 surface lands in a 300×150 buffer and **only the top-left corner draws**. Fix: hard-set the backing store via HTML attributes — `<canvas width="1024" height="768">` (= the scale-2 surface size); CSS then scales the display into the bezel cutout.

## Why `.cmd`, not disk images

The lineup is 10 self-contained `.cmd` arcade games (Big Five Software / Adventure International). Disk boot was investigated and dropped: the RetroStore `disk_0.*` images aren't bootable system disks (the games ship as `command.CMD` to run on a bare machine), and a bare Model I with a non-bootable disk hangs on the black FDC boot-wait. The `.cmd`-as-positional-arg path sidesteps boot entirely.

> Sourcing note: RetroStore's RPC (`retrostore.org/rpc?m=pubapplist` → `downloadapp?appId=…`) yields a ZIP with the self-contained `command.CMD` plus a disk image; we keep the `.cmd`.

## CLEAR softkey

Most TRS-80 arcade games start with the **CLEAR** key, which has no obvious modern-keyboard equivalent. sdltrs maps CLEAR to PC **Home** (or Delete), so `systems/_shared/genx-trs80-softkeys.js` adds a top-left **CLEAR** button that dispatches a synthetic `Home` keydown/keyup to document/window/body/canvas — emscripten SDL2 doesn't check `isTrusted`, so the synthetic key reaches the emulator. `Esc` is the TRS-80 BREAK key.

## Save / load state

sdltrs has a working save-state in C (`trs_state_save.c`), but it isn't wired to the page's save/load menus yet — so the TRS-80 bundle ships without them for now. The hooks are there for a future pass.

## Bundle layout

```
systems/trs80/
├── play.html
├── sdltrs.js
├── sdltrs.wasm          ← Level II ROM embedded here
├── games.json
├── controls.html
└── games/               ← 10 .cmd programs
```

The build tree is ephemeral (`/tmp`); only a *rebuild* needs the recipe above — re-clone, re-apply the two patches, run the `emcc` line.

## Related

- [[Emulators]] — index of all engines
- [[Emulator-atari800]] — the other from-source ASYNCIFY emscripten build
- [[Emulator-XRoar-CoCo]] — the other Tandy machine
