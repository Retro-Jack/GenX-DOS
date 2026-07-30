# atari800 — Atari 400 + 800XL

The atari800 build is the only one in GenX-DOS where we ended up compiling the emulator from source, because nothing else fit. It now ships as **two self-contained bundles** — `systems/atari400/` (boots OS-B, the cartridge-era Atari 400) and `systems/atari800/` (boots OS-XL, the Atari 800XL) — full copies of the same WASM, so each game's URL names the machine instead of hiding it behind a `?machine=` param on one shared dir. The build story below is the same for both.

## Where we started — and got blocked

The shortlist was three projects. All three fell out, in order:

1. **jsA8E** (`AnimaInCorpore/A8E`) — looked promising; a real WASM build of A8E, working in a browser. No `LICENSE` file in the repo, though. Under default copyright we can't legally redistribute, so it was out.
2. **EmulatorJS** — covers a lot of ground but the upstream supported-systems list does not include Atari 800; the closest core is `a5200`. No good.
3. **libretro-atari800 in the official RetroArch emscripten nightly** — plausible because the same nightly ships ~90 other cores. We downloaded the full 760 MB `RetroArch.7z` from `buildbot.libretro.com/nightly/emscripten/RetroArch.7z` to verify. atari800 is not one of the cores in the web build. (Useful side-effect: that audit confirmed VICE, gearcoleco, and o2em *are* in there, which seeded the C64 / Coleco / Odyssey² bundles we did later.)

So we built atari800 from source.

## The toolchain

emscripten via emsdk, fetched into `/tmp` because the build needs to be reproducible and that's the path the recipe encodes:

```sh
cd /tmp && git clone --depth 1 https://github.com/emscripten-core/emsdk.git
cd /tmp/emsdk && ./emsdk install latest && ./emsdk activate latest
source /tmp/emsdk/emsdk_env.sh
```

emsdk lives at `~/emsdk/` on this machine for persistence between sessions.

## The fake `sdl2-config` problem

atari800's autoconf uses `AM_PATH_SDL2`, which shells out to `sdl2-config`. emscripten ships SDL2 as a port (it's pulled in automatically by `-sUSE_SDL=2`) but doesn't ship the `sdl2-config` binary. The build dies on detection before it even gets to the C files.

The fix was a six-line shim that pretends to be `sdl2-config` and tells autoconf whatever it wants to hear:

```sh
cat > /tmp/fake-sdl2-config <<'EOF'
#!/bin/sh
case "$1" in
  --cflags|--cflags-only-I|--libs|--libs-only-l|--static-libs|--prefix) echo "" ;;
  --version) echo "2.30.0" ;;
esac
EOF
chmod +x /tmp/fake-sdl2-config
```

Then `SDL2_CONFIG=/tmp/fake-sdl2-config emconfigure ./configure …` runs cleanly.

## Configure flags, each one earned by a real failure

```sh
SDL2_CONFIG=/tmp/fake-sdl2-config emconfigure ./configure \
  --target=default \
  --with-video=sdl2 \
  --with-sound=sdl2 \
  --without-opengl \
  --disable-netsio \
  --disable-riodevice --disable-rserial --disable-rnetwork \
  --disable-audiorecording --disable-videorecording \
  --enable-altirra_bios \
  CFLAGS="-O2 -sUSE_SDL=2" LIBS="-sUSE_SDL=2"
```

Why each flag is there:

- `--without-opengl` — atari800's SDL+GL path calls `eglCreateContext`, which fails in emscripten and leaves the canvas black. The software SDL renderer works fine.
- `--disable-netsio` / `--disable-riodevice` / `--disable-rserial` / `--disable-rnetwork` — these all need `clock_gettime` or a real host TTY/serial port, both of which trip emcc's strict implicit-declaration check. Nothing about them works in a browser anyway.
- `--disable-audiorecording` / `--disable-videorecording` — strips RLE/ZMBV/WAV/ADPCM/μ-law codecs we don't need.
- `--enable-altirra_bios` — this is the big one. It bakes Avery Lee's AltirraOS-XL 3.41 directly into the WASM. No copyrighted Atari OS ROM needs to ship alongside the bundle; the emulator falls back to AltirraOS automatically when no real ROM is found. This is also why `systems/atari800/` has no `roms/` directory full of `.bin` files — the OS lives inside `atari800.wasm`.
- `-sUSE_SDL=2` — pulls emscripten's SDL2 port for canvas, keyboard, and WebAudio.

## The relink step

The plain `emmake make` builds a Node-style `src/atari800` script, not a browser-loadable bundle. To get the browser artefacts:

```sh
cd src
OBJS=$(ls atari800-*.o sdl/atari800-*.o roms/atari800-*.o codecs/atari800-*.o atari_ntsc/atari800-*.o 2>/dev/null | grep -v video_gl)
emcc -O2 -sUSE_SDL=2 -sASYNCIFY -sALLOW_MEMORY_GROWTH=1 -sINITIAL_MEMORY=64MB \
  -sEXPORTED_RUNTIME_METHODS=ccall,cwrap,FS -sEXIT_RUNTIME=0 \
  -o atari800.html $OBJS -lm
```

`-sASYNCIFY` is non-optional. atari800's `for(;;)` main loop in `sdl/main.c` would hang the browser without it. ASYNCIFY suspends and resumes at `SDL_Delay` so the page can paint between frames.

This is the verbatim relink from the fork's `build-wasm.sh` — note there's **no `-sEXPORTED_FUNCTIONS` list**: the `gx_state_*` / `gx_request_*` save-state entry points (see the section above) export themselves via `EMSCRIPTEN_KEEPALIVE` in `src/atari.c`, so they survive DCE without being named here. And `FS` is in `-sEXPORTED_RUNTIME_METHODS` for double duty — `play.html`'s `preRun` uses it to preload the ROM, and the save-state adapter uses it to read/write the MEMFS `/gx-state.a8s` snapshot file.

Output: `atari800.js` (186 KB) + `atari800.wasm` (1.7 MB). The default emcc shell HTML gets thrown away — `play.html` replaces it.

## Save / load state — and the ASYNCIFY trap

atari800 has a real save-state system in C (`StateSav_SaveAtariState` / `StateSav_ReadAtariState`, file-based), so the fork's `build-wasm.sh` exports `gx_state_*` `EMSCRIPTEN_KEEPALIVE` wrappers around it. The catch is the same `-sASYNCIFY` that keeps the main loop alive in the first place.

The naïve version — a button that calls `StateSav_ReadAtariState` directly — corrupts the wasm heap instantly (`memory access out of bounds` flood). Here's why: `StateSav` reaches `emscripten_sleep` (machine reinit on load), so it's an asyncify operation. But the `for(;;)` main loop is *already* a suspended asyncify operation. Calling a second one from a JS event handler while the first is mid-suspend means two concurrent unwinds sharing one asyncify stack — they stomp each other.

The fix is to **defer the work onto the main loop's own asyncify context** instead of starting a competing one. JS never calls `StateSav` directly; it only sets a flag:

```c
// in sdl/main.c's for(;;) loop, each frame:
gx_state_poll();   // runs the actual StateSav_* iff a request flag is set
```

- `gx_request_save()` / `gx_request_load()` — set a flag, no sleep, return immediately (safe from a button).
- `gx_state_poll()` — called once per frame from the main loop, *on the loop's asyncify stack*, so the nested `emscripten_sleep` inside `StateSav` is safe. It runs the real save/load and writes a status code.
- `gx_state_status()` — JS polls this; `0` busy, `1` ok, `-1` fail.

The state itself moves through a MEMFS file (`/gx-state.a8s`) that JS reads/writes with `Module.FS`. Because the round-trip is asynchronous, `play.html`'s `GenXStateAdapter` is **async** (`getState`/`setState` return Promises that resolve when `gx_state_status` flips) — `_shared/genx-savestate-std.js` `await`s the adapter, which is a no-op for the synchronous engines. Any blocking-ASYNCIFY-main-loop emulator needs this deferral pattern, not a direct call. (Contrast [[Emulator-tiny8bit-CPC]], whose chips snapshot has no `emscripten_sleep` and so calls straight from the button.)

## The `play.html` contract

`play.html` sets up `window.Module` *before* injecting `atari800.js`:

- `canvas` — the `<canvas>` element
- `arguments` — `['/game.atr']` for disks, `['-cart', '/game.rom']` for cartridges, optionally `['-cart-type', N, '-cart', '/game.rom']` for headerless cart dumps (Star Raiders needs `cartType:1` = Standard 8KB)
- `preRun` — calls `Module.FS.createPreloadedFile('/', vfsName, romUrl, true, false)` to fetch the ROM into the WASM virtual FS before `main()` runs

## One game-source gotcha

The Star Raiders `.atr` shipped as `a8b_Star_Raiders_1979_Atari_US_k_file` is a cart-binary-in-disk-wrapper — it boots straight into a 6502 CIM at `$A184`. The right source is the 8 KB `.rom` from `a8b_cart_Star_Raiders_1979_Atari_US`, launched with `-cart-type 1`.

## A note on headless verification

Headless chromium screenshots of SDL2/WASM canvases look black even when frames are being drawn — SwiftShader/compositor timing makes them unreliable. Verify in a real browser, or read pixels via `getImageData` from a probe page.

## Bundle layout

```
systems/atari400/   (and systems/atari800/, a full copy of the same build)
├── play.html           ← atari400/ defaults to OS-B; atari800/ to OS-XL
├── atari800.js
├── atari800.wasm        ← AltirraOS baked in here
├── games.json          ← 400 carts/disks in atari400/, 800XL titles in atari800/
├── controls.html
├── COPYING
└── roms/                ← cart / disk / cassette images
```

The reproducible build script lives in the [Retro-Jack/atari800](https://github.com/Retro-Jack/atari800) fork — upstream source untouched, just `build-wasm.sh` + `BUILDING-WASM.md` on top. (It is *not* copied into the bundle.)

## CRT bezel (11/06/2026)

The Atari 400/800 page wraps the canvas in the `80s.png` wood-cabinet TV bezel (a floating set on the 70s wallpaper, screen keyed to a transparent hole). The interesting part was making the picture fill the screen cutout corner-to-corner.

The obvious approach — scale the canvas past 100% with CSS and clip the overscan — fought atari800's video pipeline. atari800 sizes its framebuffer from the canvas's *pixel* dimensions and renders with near-integer scaling, so the visible-picture size jumps in coarse, viewport-dependent steps as you nudge the CSS percentage. A value tuned to fill one window doesn't hold on another.

The fix is to let the emulator do the filling. atari800's SDL build exposes its VIDEOMODE system on the command line, passed straight through `Module.arguments`:

```
-stretch full        # stretch the visible area to the whole canvas (no integer-scale letterbox)
-fit-screen both     # fit both axes
-image-aspect none   # don't preserve 4:3 — allow a non-uniform fill
-horiz-area tv       # trim the overscan border to the TV-safe area
-vert-area tv
```

With those, the canvas sits at a plain `width/height: 100%` of the cutout and the picture meets all four corners on every game, at any window size — deterministic, no calibration. (Aside: the argument builder had to be reworked to *append* cart/disk args rather than reassigning the array, or the video args got clobbered.)

## Related

- [[Emulators]] — index of all engines
- [[Emulator-XRoar-CoCo]] — the other from-source emscripten build
- [[Emulator-sdltrs-TRS-80]] — the TRS-80 build; same ASYNCIFY pattern
- [[File-Structure]] — where bundles sit in the repo
