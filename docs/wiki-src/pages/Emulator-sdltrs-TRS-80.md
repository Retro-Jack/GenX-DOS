# sdltrs — Tandy TRS-80 Model III

The TRS-80 is the second GenX-DOS bundle compiled from source to WASM (after [[Emulator-atari800]]). It runs **sdltrs** (Mark Grebe / Jens Guenther) — the SDL2 TRS-80 emulator, BSD-2-Clause, still actively maintained.

> **The bundle was a Model I until August 2026.** The Model III runs the Model I library, and it is the better machine to put in front of a visitor: one case instead of a monitor, an expansion interface and a drive stack cabled together, a 2.03 MHz Z80 instead of 1.77, lower-case as standard, and a keyboard with a numeric keypad. Same games, tidier machine. Changing it was a two-line edit to `play.html` — see [The ROM](#the-rom) for why no rebuild was needed.

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

`play.html` boots the **Model III ROM** (14 336 bytes, md5 `0e4c4b1638a23fd26796816cf2f83961`), which ships as `systems/trs80/model3.rom`. © Tandy / Microsoft; bundled for emulator-only use (recorded in ATTRIBUTION).

**It is fetched at runtime, not embedded.** The original build baked the Model I Level II ROM into the WASM at `/level2.rom` with `--embed-file`, which meant the machine was fixed at compile time — changing it would have meant a whole emsdk rebuild for the sake of a 14 KB file. Instead the page fetches the ROM alongside the game and writes both into MEMFS in `preRun`:

```js
preRun: [m => {
  m.FS.writeFile('/game.cmd', cmdBytes);
  m.FS.writeFile('/model3.rom', romBytes);
}],
```

The embedded Level II ROM is still in the WASM — harmless, unreferenced, and not worth a rebuild to strip. If the bundle ever needs another TRS-80, it is now a change of two strings.

## The `play.html` contract

```js
createSDLTRS({
  canvas,
  arguments: ['-model', '3', '-romfile3', '/model3.rom', '-noled', '-borderwidth', '0', '-scale', '2', '/game.cmd'],
  preRun: [m => {
    m.FS.writeFile('/game.cmd', cmdBytes);
    m.FS.writeFile('/model3.rom', romBytes);
  }],
});
```

`-model 3` picks the machine and `-romfile3` names its ROM — note that each model has its own `-romfileN` switch, so `-romfile1` would be silently ignored here. `-noled -borderwidth 0` = a clean 512×384 (4:3) text area with no chrome (1024×768 at `-scale 2`). The `.cmd` is written to MEMFS and passed as a **positional arg**; sdltrs's `trs_load_cmd` runs it after reset and jumps straight into the program — no disk boot.

### The canvas backing-store gotcha (cost an hour)

sdltrs uses the **software** video path (`SDL_GetWindowSurface` / `SDL_UpdateWindowSurface` = a raw `putImageData` into the canvas). Emscripten does **not** resize the canvas backing store on this path — it stays at the HTML default 300×150 — and `width:100%` CSS only sets the *display* size. So the 1024×768 surface lands in a 300×150 buffer and **only the top-left corner draws**. Fix: hard-set the backing store via HTML attributes — `<canvas width="1024" height="768">` (= the scale-2 surface size); CSS then scales the display into the bezel cutout.

## Why `.cmd`, not disk images

The lineup is 10 self-contained `.cmd` arcade games (Big Five Software, Adventure International, Cornsoft Group). Disk boot was investigated and dropped: the RetroStore `disk_0.*` images aren't bootable system disks (the games ship as `command.CMD` to run on a bare machine), and a bare machine with a non-bootable disk hangs on the black FDC boot-wait. The `.cmd`-as-positional-arg path sidesteps boot entirely.

### The self-contained build is the thing to check

**Eliminator was dropped in August 2026 and replaced with Space Castle**, and the reason is worth recording because it will come up again.

Eliminator had been shipping dead — a black screen, on the Model I before the Model III swap and after it. The file itself was fine: 56 contiguous load blocks, a sensible entry point, every byte accounted for. Chasing it turned up three things:

- Our copy is **byte-identical to RetroStore's `command.CMD`** for that title, so the self-contained conversion is broken at source, not here.
- The **genuine binary needs a DOS**. Both public-domain discs — the Model I TRSDOS one and the Model III LDOS one — carry the identical 13 973-byte build, loading `83EC–B9A1`, above where the DOS sits. Extracted by hand and tried on a bare machine it loads, runs, and then fills the screen with garbage.
- **It is not a model-compatibility problem.** That build was run as a Model I and as a Model III: same failure, byte for byte the same picture. There is no separate Model III build to find.

So the rule for adding a title here: a `.cmd` that loads **low**, below where a DOS would be, is a bare-machine build and will work. One that loads high wants a DOS we do not provide, however clean its structure looks. Structural validity says nothing about it — the broken one parsed perfectly.

> Sourcing note: RetroStore's RPC (`retrostore.org/rpc?m=pubapplist` → `downloadapp?appId=…`) yields a ZIP with the self-contained `command.CMD` plus a disk image; we keep the `.cmd`.

## CLEAR softkey

Most TRS-80 arcade games start with the **CLEAR** key, which has no obvious modern-keyboard equivalent. sdltrs maps CLEAR to PC **Home** (or Delete), so `systems/_shared/genx-trs80-softkeys.js` adds a **CLEAR** button that dispatches a synthetic `Home` keydown/keyup — emscripten SDL2 doesn't check `isTrusted`, so the synthetic key reaches the emulator. `Esc` is the TRS-80 BREAK key.

Three things about it changed in August 2026, all worth knowing if you write another soft key:

- **It dispatches once, at `document`.** It used to fire at document, window, body *and* canvas "to be safe". Those events bubble, so one click reached `window` four times over and the machine saw four CLEARs. The same shape in the Atari script crashed atari800 outright when a player clicked impatiently.
- **It sits under the machine, in the amber style**, alongside the Atari console keys rather than alone in the top-left corner. It was previously grey-on-grey at 0.6 opacity, which read as a *disabled* control — the one button that starts most of the games, looking like it did nothing.
- **It only appears on the six games that use CLEAR.** `_shared/genx-softkey-policy.js` consults `softkeys.json`, generated from the gamedocs' Controls tables by `tools/build-softkey-map.py`. Gating on the documentation meant the documentation had to be right, and it wasn't — only Defense Command named CLEAR, though Galaxy Invasion, Cosmic Fighter and Attack Force need it to start. Each game's own text was read out of its `.cmd` to settle it; `strings` on a TRS-80 binary gives you the title screen verbatim, which is a far better source than memory.

## Save / load state

sdltrs has a working save-state in C (`trs_state_save.c`), but it isn't wired to the page's save/load menus yet — so the TRS-80 bundle ships without them for now. The hooks are there for a future pass.

## Bundle layout

```
systems/trs80/
├── play.html
├── sdltrs.js
├── sdltrs.wasm          ← Level II ROM embedded here (unused)
├── model3.rom           ← the ROM actually booted
├── games.json
├── controls.html
└── games/               ← 10 .cmd programs
```

The build tree is ephemeral (`/tmp`); only a *rebuild* needs the recipe above — re-clone, re-apply the two patches, run the `emcc` line.

## Related

- [[Emulators]] — index of all engines
- [[Emulator-atari800]] — the other from-source ASYNCIFY emscripten build
- [[Emulator-XRoar-CoCo]] — another Tandy machine
- [[Emulator-VirtualT-Model-100]] — and the portable one
