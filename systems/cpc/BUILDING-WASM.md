# Rebuilding `cpc.js` / `cpc.wasm`

The bundled Amstrad CPC emulator is floooh's tiny8bit CPC
([`floooh/chips-test`](https://github.com/floooh/chips-test), MIT, by Andre
Weissflog). We ship a **locally rebuilt** binary rather than the stock one, for
two reasons:

1. The stock build unconditionally draws a sokol-debugtext **status bar**
   (`JOYSTICK`/`DISC`/`MOTOR`/`TRACK` + frame timing) across the bottom of the
   canvas — it paints over the game and can't be toggled off at runtime.
2. It draws a suspended-audio **muted-speaker icon** until the first click.

Both are baked into the WASM, so the only clean fix is to patch the source and
rebuild. This is how.

## What we patched

Two lines in `examples/emus/cpc.c`:

| Line | Stock | Ours |
| --- | --- | --- |
| `frame()` | `draw_status_bar();` | commented out — removes the status bar |
| `gfx_init(...)` | `.disable_speaker_icon = sargs_exists("disable-speaker-icon")` | `.disable_speaker_icon = true` — icon never shows; audio still auto-unlocks from `play.html` |

(The forward declaration of `draw_status_bar` is marked
`__attribute__((unused))` so the now-uncalled function doesn't trip `-Werror`.)

### Save / load state

We also export wrappers around chips' own snapshot API so `play.html`'s
save-state buttons work. The chips CPC snapshot (`cpc_save_snapshot` /
`cpc_load_snapshot`, declared in `chips/systems/cpc.h`) is a **self-contained
`cpc_t` struct copy with no `emscripten_sleep`** — so, unlike atari800, it's
safe to call straight from a JS button with no frame-loop deferral.

Added to `examples/emus/cpc.c` (just after the `} state;` global), gated on
`__EMSCRIPTEN__`:

```c
#include <emscripten.h>
static cpc_t gx_snap;
EMSCRIPTEN_KEEPALIVE int   gx_state_size(void) { return (int)sizeof(cpc_t); }
EMSCRIPTEN_KEEPALIVE void* gx_state_ptr(void)  { return (void*)&gx_snap; }
EMSCRIPTEN_KEEPALIVE int   gx_state_save(void) { cpc_save_snapshot(&state.cpc, &gx_snap); return (int)sizeof(cpc_t); }
EMSCRIPTEN_KEEPALIVE int   gx_state_load(void) { return cpc_load_snapshot(&state.cpc, CPC_SNAPSHOT_VERSION, &gx_snap) ? 1 : 0; }
```

`play.html` moves the raw struct bytes in/out of `gx_snap` through `HEAPU8`.
That requires **`HEAPU8` on the `Module` object**, which the stock fibs
Emscripten config does *not* export (it sets no `EXPORTED_RUNTIME_METHODS`), so
add one line to the imported `fibs-extras/emscripten.ts` `build()` hook (the
same gotcha that bit the o2em rebuild):

```ts
b.addLinkOptions([`-sEXPORTED_RUNTIME_METHODS=['HEAPU8','ccall','cwrap']`]);
```

The file lives at `.fibs/imports/fibs-extras/emscripten.ts` after the first
`config` run — edit it, then re-run `config` (so the new link flag is baked
into the ninja files) before `build cpc`.

Nothing else is changed — the URL-param config (`file`, `input`, `type`,
`joystick`) that `play.html` drives still works exactly as upstream.

## Toolchain

floooh's build system is now **fibs** (a Deno/TypeScript successor to fips),
driven by the repo's `fibs.ts`. You need:

- **Deno** — `curl -fsSL https://deno.land/install.sh | sh`
- **Emscripten SDK** — any recent `emsdk` with `emcc` on `PATH`
- cmake + ninja (fibs uses the Ninja generator)

fibs wants its own SDK at `.fibs/sdks/emsdk`; symlink an existing one rather
than letting it download a second copy:

```sh
mkdir -p .fibs/sdks && ln -sfn "$HOME/emsdk" .fibs/sdks/emsdk
```

## Build

From a clone of `floooh/chips-test` with the two-line patch above applied:

```sh
source "$HOME/emsdk/emsdk_env.sh"
deno run --allow-all --no-config 'jsr:@floooh/fibs@^1' config emsc-ninja-release
deno run --allow-all --no-config 'jsr:@floooh/fibs@^1' build cpc
```

Output lands in `.fibs/dist/emsc-ninja-release/`:

```
cpc.js     ~33 KB
cpc.wasm   ~330 KB
cpc.html   (the demo shell — not used; play.html is our shell)
```

## Install

Copy the two artifacts over the bundle's:

```sh
cp .fibs/dist/emsc-ninja-release/cpc.js   <genx-dos>/systems/cpc/cpc.js
cp .fibs/dist/emsc-ninja-release/cpc.wasm <genx-dos>/systems/cpc/cpc.wasm
```

`play.html` and `cpc.html` are unrelated — we only take `cpc.js` + `cpc.wasm`.
