# libretro-o2em — Magnavox Odyssey²

The Odyssey² bundle came with an instructive false start: we assumed EmulatorJS would Just Work for any libretro core, and learned the hard way that it doesn't.

## Where we started — the EJS dead end

The plan was the obvious one: drop `o2em-legacy-wasm.data` into `_shared-ejs/ejs/data/cores/`, set `EJS_core = 'o2em'`, write a `play.html` that mirrors the VICE/Coleco shape. Loaded the core, called `GameManager.cwrap(...)`, immediate runtime error: `system_restart` is `undefined`.

The reason: **vanilla libretro cores are not drop-in for EJS.** EJS forks each libretro core to add EJS-specific extension functions (`system_restart`, `simulate_input`, `toggleMainLoop`, `cmd_take_screenshot`, `ejs_set_variable`, `get_core_options`, etc.) that `EJS_GameManager` wraps via `cwrap`. A vanilla libretro core lacks those exports; `GameManager.cwrap("system_restart", …)` resolves to `undefined` and EJS gives up.

Polyfilling cwrap doesn't help — the EJS-specific symbols aren't *in* the core, no amount of JS wrapping can conjure them. Don't try this again for any platform whose libretro core EJS hasn't already forked. Either build the EJS-flavoured fork yourself or take a different path.

We took a different path: build vanilla libretro-o2em to WASM, then write a small SDL2/emscripten frontend.

## The build pipeline

`systems/odyssey2/build.sh` does the whole thing end-to-end. The skeleton:

```sh
source ~/emsdk/emsdk_env.sh
git clone https://github.com/libretro/libretro-o2em
cd libretro-o2em
emmake make platform=emscripten -j$(nproc)
```

That produces `o2em_libretro_emscripten.bc`. First trap: despite the `.bc` extension, **that file is an `ar` archive, not LLVM bitcode.** Rename it to `.a` so emcc accepts it.

Second trap: `STATIC_LINKING=1` skips the libretro-common helpers in the core's own Makefile. They have to be compiled explicitly from `libretro-o2em/libretro-common/`:

```
compat_snprintf, compat_strcasestr, compat_strl, fopen_utf8,
encoding_crc32, encoding_utf, file_path, file_path_io,
file_stream, file_stream_transforms, stdstring, rtime,
vfs_implementation
```

Final link flags:

```
-s USE_SDL=2
-s MODULARIZE=1
-s EXPORT_NAME=createO2EM
-s EXPORTED_RUNTIME_METHODS=FS,callMain,HEAPU8
-s INITIAL_MEMORY=33554432
-s ALLOW_MEMORY_GROWTH=1
```

`MODULARIZE=1` matters for the next gotcha.

## The frontend: ~200 lines of `frontend.c`

A libretro core can't drive itself. It needs a frontend that calls `retro_init`, `retro_run`, and supplies video/audio/input callbacks. `frontend.c` implements those: RGB565 → ARGB8888 video conversion, 16-bit stereo audio queued through `SDL_QueueAudio`, `RETRO_DEVICE_KEYBOARD` polled from SDL key state via `SDL_PollEvent` (mapped 1:1 to `RETROK_*`).

Two gotchas in the frontend code:

1. **Don't allocate the framebuffer on the stack.** emscripten's default stack is 64 KB. A 384×269×4-byte ARGB scratch buffer blows it. Make it `static`. The stack overflow shows up as a clean `___handle_stack_overflow` abort in dev builds — easy to diagnose, easy to fix, but worth flagging.

2. **Modularised builds pass the `Module` instance as the first arg to each `preRun` callback.** `this` is not reliably the Module. Write `function (mod) { mod.FS.writeFile(...) }`, not `function () { this.FS.writeFile(...) }`. The latter fails silently — the file isn't written and the BIOS lookup later fails with an unhelpful error.

## How a game launches

`play.html` uses the shared `genxLoadGame()` from `_shared/genx-game-loader.js` (the same helper Intellivision, CPC, and apple2 use). It fetches `o2rom.bin` + the chosen cart in parallel, queues them as `preRun` writes (`/o2rom.bin` and `/game.bin` in MEMFS), then calls `createO2EM(Module)` to start the runtime. The frontend opens both via standard `fopen`.

## Save / load state — exposing `retro_serialize`

The Odyssey² was, briefly, the one platform we'd written off as un-save-stateable — then realised the fix was ours to make. Every libretro core implements `retro_serialize` / `retro_unserialize`, and o2em is no exception (they wrap `savestate_to_mem` / `savestate_size`). The catch: **our `frontend.c` never called them**, so with `STATIC_LINKING` the linker dead-code-eliminated them — `o2em.wasm` had no `retro_serialize` symbol at all.

Since we own the frontend, the feature was a rebuild away. `frontend.c` gained four `EMSCRIPTEN_KEEPALIVE` wrappers:

```c
int gx_state_save(void);      // retro_serialize into gx_buf → returns HEAP ptr
int gx_state_size(void);      // length of the last save
int gx_state_buffer(int n);   // realloc gx_buf to n, return ptr for JS to fill
int gx_state_load(int n);     // retro_unserialize from gx_buf
```

The serialized blob is owned by a static `gx_buf` in C, so JS never needs `_malloc`/`_free` exported — it just reads/writes `HEAPU8` at the returned pointer. **One gotcha that cost a rebuild:** `HEAPU8` isn't on the Module unless it's in `EXPORTED_RUNTIME_METHODS`. Without it the adapter's `ready()` check fails silently and no buttons ever appear — easy to miss because nothing errors. (That's why the flag list above reads `FS,callMain,HEAPU8`.)

`play.html` captures the instance from `createO2EM(Module).then(m => …)` and registers a `GenXStateAdapter` (`getState` = `_gx_state_save` → slice `HEAPU8`; `setState` = `_gx_state_buffer` → fill → `_gx_state_load`), which `_shared/genx-savestate-std.js` turns into the bottom-left **save** / **load** menus. This is the reusable pattern for any libretro-core-on-custom-frontend bundle.

## BIOS

`o2rom.bin`, 1024 bytes, MD5 `562d5ebf9e030a40d6fabfc2f33139fd`. Bundled under the same emulator-only-use precedent as the ColecoVision and Intellivision BIOSes. G7400/C52/JOPAC variants exist (`O2_G7400_bios.bin`, `O2_PhillipsC52.bin`) if multi-region support is wanted later.

## Bundle layout

```
systems/odyssey2/
├── play.html
├── games.json
├── build.sh           ← reproducible build recipe
├── frontend.c         ← ~240 LOC SDL2 frontend (+ gx_state_* wrappers)
├── controls.html      ← keyboard reference (added 17/06/2026)
├── o2em.js            ← emscripten glue
├── o2em.wasm          ← 860 KB
├── o2rom.bin          ← BIOS, 1 KB
└── games/
    └── *.bin          ← 10 cart images, ~36 KB total
```

It now ships a `controls.html` like the rest of the bundles (added 17/06/2026, completing the set). Every launch here carries `?game=<key>`, so both corner links appear — the game's page on the left, this page on the right; a keyless launch would show only the right-hand one.

Total bundle ~1.05 MB. Comparable to Intellivision.

## Related

- [[Emulator-jzIntv-Intellivision]] — same "no EJS core" situation, different solution (jzIntv already had a WASM build)
- [[Emulator-atari800]] — same emscripten build pipeline
- [[Emulators]] — index
