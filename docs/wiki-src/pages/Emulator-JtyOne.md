# JtyOne — Sinclair ZX81

JtyOne (Simon Holdsworth) is a port of Mike Wynne's EightyOne. The ZX81 bundle is small and quiet — the smallest screen, the smallest emulator, the smallest games.

## Where we started

[JtyOne](https://github.com/jtyone) is GPL-2.0. Pure JavaScript, no WASM, no build step. The runtime exports a global object and writes to an emulator canvas + status span.

## The launch flow

`play.html` reads `?game=<key>` from the URL, fetches `games.json`, gets a `{rom, type}` record per entry, and hands it off to JtyOne's loader. `rom` is the file path; `type` distinguishes `.p` files (snapshot, loads instantly) from `.tap` files (real tape image, real load time).

## The display

ZX81's native screen is 256×192 monochrome (one screen = 1 KB of character memory). JtyOne renders to a canvas that we constrain via standard genx-frame CSS:

```css
#emulator_canvas {
  box-shadow: 2px 2px 10px rgba(0, 0, 0, .7);
  image-rendering: pixelated;
}
```

Below the canvas, the upstream code expects an `#emulator_status` span for tape position / loader messages. We kept it (small, low-vis text) for tape-loading feedback.

## Joystick / keyboard input

ZX81 was keyboard-only — no joystick port on the original hardware. JtyOne maps the joystick directions to the period-correct ZX81 keys (Q/A/O/P for the four directions, on Sinclair games that use them) but most of our entries respond to direct key input from `qaop` + Enter for fire.

## File formats

- `.p` — ZX81 snapshot. Instant load.
- `.p81` — alternative snapshot format with a filename header.
- `.tap` — tape image. Real-time loading; the screen flickers for ~30 seconds while LOAD "" runs.

We default to `.p` where available.

## Bundle layout

```
systems/jtyone/
├── play.html
├── zx81_emu.js          ← JtyOne runtime
├── controls.html
├── games.json
├── roms/                ← system ROM
└── tapes/
    └── *.p / *.tap
```

## USB gamepad support + key filtering (04-05/07/2026)

The seven action games have per-game `window.GenXGamepadMap`s on the shared shim (the four typed-command games — Black Crystal, City of Zion and 1K Chess's two openings — are keyboard by design). JtyOne listens on `document` and decodes `e.key` single chars with `e.keyCode` fallbacks, so the shim's defaults work unmodified. The pad-map block must run **before** the loader script, which rewrites the URL for the engine — and the rewrite now keeps `?game=` alongside `?tzx=` (deleting it raced the deferred shared controls-link script and could cost the gamedoc link).

Because every ZX81 key is live BASIC (Space is BREAK), each action game also gets a **key allowlist**: a capture-phase listener swallows any key with no in-game function before the engine sees it. Games that define a quit key (3D Monster Maze's `A`) close the game tab via `window.close()` — prompt-launched windows are script-opened, so this is allowed; hand-typed URLs fall through to the tape's patched behaviour.

## 3D Monster Maze tape surgery (05/07/2026)

Working from a full disassembly, the intro's inverse-video keyword labels (STOP / LIST / CONT — keycap legends a PC keyboard doesn't have) were patched byte-for-byte in `tapes/monstmze.p.hex` to the real keys "A" / "K" / "C", and the program's two `NEW` tokens (0xE6) became `RUN` (0xF7), so no keypress can strand the player at a dead BASIC prompt. The .p.hex format is plain hex of the ZX81 memory image from 0x4009; display text uses the ZX81 charset (letters 0x26-0x3F, +0x80 for inverse), BASIC lines are big-endian line number + little-endian length + tokens. In-game keys (5 turn left, 7 forward, 8 turn right) were confirmed from the disassembly's game loop.

## Related

- [[Emulator-JSSpeccy]] — sibling Sinclair machine
- [[Emulators]] — index
