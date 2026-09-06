# XRoar — Tandy Color Computer

XRoar was the first emulator in GenX-DOS where the upstream's HTML wrapper turned out to be doing a lot more than it looked. It became the cautionary tale that every emscripten-based emulator after it got measured against.

## Where we started

Upstream: [6809.org.uk/xroar/online/](http://www.6809.org.uk/xroar/online/) — Ciaran Anscomb's XRoar, a long-running Dragon/Tandy CoCo emulator written in C. Ciaran ships an emscripten-WASM build alongside the native binaries, served from his own site. It's GPL-2, covers the whole Dragon/CoCo family, and runs cleanly in a browser. There wasn't really a competitor worth evaluating — XRoar is *the* CoCo emulator.

## The first attempt: blank screen

We dropped `xroar.js` and `xroar.wasm` into `systems/xroar/`, wrote a thin `play.html` with a `<canvas>` and a `<script>` tag, and… nothing. Black screen. No errors on the page. Just a dead canvas.

DevTools told the real story: `Uncaught ReferenceError: ui_menu_clear is not defined`. The WASM was halting mid-init because it expected a pile of JS functions to exist for things like menu population and status updates — things the upstream HTML wraps a real UI around, but which we'd thrown away when we stripped the page down to the essentials.

The fix was to grep upstream's HTML for every `function ui_` definition and stub each one as a no-op. For XRoar v1.10 that's fifteen of them:

```js
function ui_done_initialising() {}
function ui_menu_clear() {}
function ui_menu_add() {}
function ui_menu_add_str() {}
function ui_menu_select() {}
function ui_menu_select_str() {}
function ui_set_checkbox() {}
function ui_set_fullscreen() {}
function ui_set_html() {}
function ui_set_value() {}
function ui_update_ccr() {}
function ui_update_disk_info() {}
function ui_update_hd_filename() {}
function ui_update_tape_input_filename() {}
function ui_update_tape_playing() {}
```

We refreshed. Still a black screen.

## The second attempt: invalid ROMs

This time the console had a different complaint: `(unpopulated) CRC32 INVALID` repeating for several ROM names. XRoar's docs mention "free open-source replacement ROMs built in" — easy to read as "no ROMs needed." That's not quite what they meant. The replacement ROMs *exist*, but they're not baked into the WASM; they're served alongside it from the upstream deploy directory.

A quick probe of upstream confirmed it:

```bash
curl -sIo /dev/null -w "%{http_code}\n" https://www.6809.org.uk/xroar/online/bas13.rom
```

200 OK. We mirrored the lot — `bas13.rom`, `extbas11.rom`, `d64_1.rom`, `d64_2.rom`, `dplus49b.rom`, `coco3.rom`, `coco3p.rom`, `disk11.rom`, `mc10.rom` — into the bundle directory.

Refreshed. Still black screen.

## The third attempt: absolute paths

Now the console showed `WARNING: Error fetching '/d64_1.rom'`. Note the leading slash. XRoar was requesting ROMs by absolute path, which under emscripten's default `locateFile` resolved to the web root — and our web root had no ROMs, only `index.html`. The files were sitting right next to `xroar.js`, but the runtime was looking for them three directories up.

The fix was a one-liner:

```js
Module.locateFile = function(path) { return path.replace(/^\/+/, ''); };
```

That strips the leading slash so requests become page-relative. After this, the boot log went green and the CoCo prompt appeared.

## One more sharp edge

`wasm_set_machine_cart('coco', …)` called from `onRuntimeInitialized` doesn't reliably switch from the default `dragon64` machine. By the time the callback fires, init has already locked in the wrong target. We worked around it by passing `-machine coco` in `Module.arguments` at the very start, so XRoar picks the right machine during its own init pass instead of being switched after the fact.

## How games launch now

Each game is a row in `games.json` describing the cartridge / tape / disk file and the machine variant. `play.html` reads `?game=<key>` from the URL, looks the entry up, and calls `wasm_set_machine_cart` + `wasm_load_file` with the right arguments. Cartridge games autorun instantly; tape games wait 2 seconds so the BASIC prompt finishes drawing before `CLOAD` fires.

## The diagnostic workflow that came out of this

Every new emscripten emulator now runs through the same loop before we declare it working:

```bash
chromium --headless --no-sandbox --enable-logging=stderr \
  --log-level=0 --virtual-time-budget=10000 \
  http://127.0.0.1:8765/systems/xroar/play.html?game=foo \
  2>&1 | grep CONSOLE
```

If the log shows valid CRC32 lines and the expected machine banner (`[part:coco] Tandy | Colour Computer`), it'll render. Headless can't verify pixels without a GPU, but a clean boot log is a strong proxy.

## Composite artifact colour

The CoCo's high-resolution modes were nominally two-colour, but on an NTSC television alternating pixel columns come out red and blue, and games were drawn *for* that. XRoar models it with `-tv-input cmp-rb` (`cmp-br` is the opposite artifact phase); our WASM build already carries the option, so no rebuild was needed. Raised by **jimbro1000**, who also named the option.

**It is per game**, via a `tv` field in `games.json` pushed onto `Module.arguments` before `xroar.js` loads. Tested globally to check that decision, and the split is not the one you would guess:

| Wants it | Harmed by it | No effect |
|---|---|---|
| Demon Attack | Dungeons of Daggorath | Popcorn (colour semigraphics) |
| Downland | Monster Maze | Polaris (4-colour) |
| Canyon Climber | Poltergeist | Galactic Attack (green PMODE set) |
| Mega-Bug | | |

Canyon Climber and Mega-Bug were the surprises — both look like ordinary colour games and are unreadable dither without it. The harmed three are deliberately clean white line art, which composite decoding fringes blue and orange; that is the argument against a global setting. The unaffected three come out pixel-identical either way, because artifacting only exists in the hi-res two-colour set.

**Judge on the gameplay screen, not the title.** Polaris and Poltergeist have hi-res-looking titles and four-colour gameplay.

## Joysticks, and USB gamepads

Several titles are joystick-only — Galactic Attack says "PRESS FIRE BUTTON TO BEGIN" and ignores the keyboard entirely — so without one they cannot be started. `games.json` carries `joy` (profile) and `joyport` (`left`/`right`) per game, passed as `-joy-left` / `-joy-right`.

Two traps:

- **A keyboard joystick consumes those keys.** Binding `kjoy0` (cursors + Alt) to a port takes the cursor keys away from the machine, so wiring one to a keyboard-controlled game *breaks* it. Poltergeist shipped that way and was fixed by removing its joystick.
- **`joyport` is this stack's numbering, not the manual's.** Polaris's manual says "the right joystick is for one player"; setting it to right gives a pad that does nothing, and `left` is what works. Set the field from testing, never from the documentation.

**A physical pad works, and XRoar asks SDL for the joystick list once at startup.** A browser reveals a gamepad only after a button is pressed on a focused page, so a pad that arrives late is missed -- click the screen and press again. If a browser sees no pad at all, check whether it is sandboxed: a Flatpak or Snap build without the host's `/run/udev` enumerates none, since udev is how a browser finds them on Linux.

Binding a pad needs the browser's `gamepadconnected` event forwarded into the emulator with `wasm_gamepad_connected`, and the joystick list read back from XRoar's own UI callbacks (`ui_menu_add` / `ui_menu_add_str`, which take **string pointers** needing `UTF8ToString`). Those callbacks are stubbed out as empty functions in most bundles; while they are stubs a connected pad is invisible by construction.

## Save / load state

XRoar exports `Module._write_snapshot(filename)`, which writes a full-machine `.sna` to the emscripten FS. The adapter cwraps it, writes to `/gx-state.sna`, and reads the bytes straight back out with `Module.FS.readFile()` — that `Uint8Array` is the state. Restore is the mirror: write the bytes to the FS, then call `wasm_load_file('/gx-state.sna', 0, 0)` — the **same** cwrapped loader `play.html` already uses to load games (XRoar auto-detects the `.sna` and restores the machine). So no new core surface was needed; the existing load path does the heavy lifting. `_shared/genx-savestate-std.js` draws the buttons.

## Bundle layout

```
systems/xroar/
├── play.html
├── xroar.js
├── xroar.wasm
├── games.json
├── controls.html
├── bas13.rom, extbas11.rom, d64_1.rom, d64_2.rom,
│   dplus49b.rom, coco3.rom, coco3p.rom, disk11.rom, mc10.rom
└── roms/        ← cartridge / tape / disk images
```

## Related

- [[Emulators]] — index of all engines
- [[File-Structure]] — where bundles sit in the repo
- [[Virtual-Filesystem]] — how `.exe` launchers reach `play.html`
