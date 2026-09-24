# js-dos — IBM PC

The machine the site had been dressed as since the beginning. The DOS prompt boots into an IBM 5153 monitor, and for a long time there was nothing behind it: the DOS was set dressing for a launcher. This bundle puts a real one there.

## Not the js-dos player

[js-dos](https://js-dos.com/) ships a complete DOS player — UI, canvas, save handling, cloud features — and we use none of it. The bundle takes the layer underneath, the `emulators` package, for three reasons that only became clear once the player was tried:

1. **The player hard-depends on OPFS.** It calls `navigator.storage.estimate()` and `getDirectory()` at start-up, which need a secure context. On staging, which is plain HTTP, it threw on both and never produced a canvas. The `emulators` layer has no such dependency and starts happily on an insecure origin.
2. **It brings a UI we would only have hidden**, the way apple2js's header is hidden.
3. **It owns its canvas.** The bezel here needs a canvas we control, sized to the prompt's screen geometry to the decimal.

What `emulators` gives instead is a frame stream, a key sink and a sound queue. `genx-dos-player.js` wires those to our own canvas. Upstream's own README points this way: *if you want to build a custom DOS player, use the emulators package instead*.

```js
emulators.pathPrefix = 'jsdos/emulators/';
const ci = await emulators.dosboxDirect([
  { dosboxConf: conf, jsdosConf: { version: '8' } },
  { path: 'DIGGER.COM', contents: bytes },
]);
```

Vendored: `emulators.js`, `wdosbox.js`, `wdosbox.wasm` — about 1.7 MB. Not `js-dos.js` or `js-dos.css`, which are the player.

## The bezel is a constraint, not a finish

Arriving from the launcher must not move the monitor, so the bundle copies the prompt's geometry rather than deriving its own:

```css
.bezel-wrap { width: min(100vw, calc(100vh * 1815 / 1300));
              aspect-ratio: 1815 / 1300; }     /* NOT 100dvh - 120px */
.screen-bg  { inset: 5%; }
.screen     { left: 15.1%; top: 17.3%; width: 60.1%; height: 61.3%; }
```

Four things have to match or the seam shows: the same `IBM-5153.png` by the same path so it comes from cache; the same wrap expression (the Electron page reserves a 120px footer strip, the CPC multiplies by 1.05 — either would resize the monitor mid-transition); the prompt's *tuned* hole coordinates rather than the raw cutout at 13.5/15.7/63.25/64.5; and the same wallpaper painted before first paint. The aperture is 1.369:1 and CGA is 1.6:1, so the canvas is stretched to fill in both axes, exactly as the prompt stretches its 80x25 character grid.

## The start-up banner, and how it is hidden

DOSBox prints its own greeting before `[autoexec]` runs, and this build has no `startbanner` setting — the string is compiled into the wasm. So the greeting is covered rather than withheld: every frame is painted as it arrives, and the canvas itself stays hidden until the blank screen that each autoexec's `cls` produces, or until the picture has been still for a moment.

It was twice wrong before it was right, and both mistakes are worth keeping in mind. Waiting for a *video-mode change* looked correct until a text-mode game arrived and never changed mode. Then holding the frames back and drawing the last one at the moment of reveal looked correct until Sopwith, which draws its menu and waits for a key: two frames, neither of them blank, and then nothing. The reveal rested on a timer, and a browser throttles timers hard in a tab nobody is looking at — measured here, `setTimeout(0)` fired ten times in three seconds. The frame arrived, the timer did not, and the screen stayed black with a perfectly healthy game behind it. **Paint always; hide the canvas, not the picture.**

Each autoexec also carries `@echo off` and `mount c . > nul`, so the mount confirmation and the command echo never appear either.

## Each game gets the machine it was written for

The per-game `dosbox.conf` is ours and is in the repo; the games are not. Four machine types and five cycle counts, taken from configurations the games themselves shipped with rather than guessed:

| Setting | Games |
|---|---|
| `machine=cga` | Paratrooper, Digger, Beast, Alley Cat, Sopwith, Rogue, Round 42, Kingdom of Kroz |
| `machine=ega` | Captain Comic, Commander Keen |
| `machine=vga` | MS-DOS 4.00 |
| `cycles=fixed 400` | Digger |
| `cycles=fixed 200` | Sopwith |
| `cycles=fixed 300` | Beast |
| `cycles=fixed 600` | Rogue, Kingdom of Kroz |

Without the fixed counts those five run at a speed nobody can play.

## Sopwith is our own build of its own source

Sopwith is the one game here that is not the binary someone else released. Its source is GPL — David Clark released it and later relicensed it — so it could be changed at the source rather than worked around in the player, and it was: twelve lines, so the plane flies on the cursor keys as well as on `,` `/` `X` `Z`. Up climbs, Down descends, Left slows, Right accelerates; the original keys are untouched, so the game's own manual stays correct.

The change is in `keybint()`, the keyboard interrupt handler, with the four scancodes added to `def.h`. It was built with Turbo C 2.01 and A86 under DOSBox, linked with `tlink` in place of the `otlink` the original makefile wants and which cannot be had. The modified source, notices of what changed and when, and the build recipe are published at [`Retro-Jack/sopwith-genx`](https://github.com/Retro-Jack/sopwith-genx), which is what the licence asks of us.

It runs as `SOPWITH2.EXE -s -i -k`: straight into a single-player game on the IBM keyboard path, which is the path the change lives in, instead of asking for a game mode and a keyboard type first. The sound is on from the first frame — the source has always inverted `soundflag`, so on is the default and `-q` is what turns it off.

## MS-DOS 4.00 is our own build too

Entry eleven is not a game but the operating system, booted from a 720K floppy image — banners, the date and time prompts, and a bare `A>`, with no `AUTOEXEC.BAT` to short-circuit any of it. Microsoft released the MS-DOS 4.00 source under the MIT licence in 2024, and `v4.0/src/` is a complete tree: unlike the v1.25 and v2.0 releases, which ship the kernel but not the machine-specific `IO.SYS`, this one contains `BOOT/` and `BIOS/` as well, so a bootable disk can be built rather than assembled around someone else's binary. It goes through `imgmount a` then `boot -l a`, which wdosbox supports.

The published source needed two repairs before it would build, both artefacts of how it was packaged rather than anything wrong in 1988:

- **Line endings had been normalised to LF.** The DOS tools are not all equally forgiving: `nmake` and MASM read LF-only files without complaint, which is why the build gets 55 objects in before anything goes wrong. `nosrvbld` does not — it parses the `:use` line of a `.skl` expecting CRLF, fails to find the group name, and reports `Can not find  in index file` with the name missing. Nor does the linker's response-file parser, which reads four modules out of `msbio.lnk` and then sits at an `Object Modules [.OBJ]:` prompt waiting for a keyboard that, in a scripted build, is never coming. Converting the `.skl`, `.msg` and `.lnk` files to CRLF fixes both. The makefiles were left alone, since nmake was never the thing complaining.
- **`SETENV.BAT` points `INCLUDE` and `LIB` at directories that do not exist** — `tools\inc` and `tools\lib`, where the release actually puts them under `tools\bld\`. Everything written in assembler builds regardless; everything written in C fails at `cannot open include file 'stdio.h'`, which is most of the utilities.

With those two fixed the whole tree builds: the boot sector, `IO.SYS`, `MSDOS.SYS`, `COMMAND.COM` and around forty-five utilities. The image carries thirty of them — the ones that do something useful on a single floppy with no printer, no second drive and no hard disk.

Laying out the disk has one requirement worth recording: the boot sector looks for `IO.SYS` and `MSDOS.SYS` as the **first two root directory entries**, so the image must be formatted without a volume label. A label takes entry zero, pushes `IO.SYS` to entry one, and the disk answers `Non-System disk or disk error` — which is, pleasingly, the very message the CRLF fix restored.

A boot can be verified without looking at a screen by letting the booted system report on itself: an `AUTOEXEC.BAT` that runs `VER`, `MEM` and `CHKDSK` redirected to a file on `A:` leaves its evidence inside the image, readable afterwards with mtools.

## Keyboard

`KeyboardEvent.code` maps to DOSBox key codes from the `emulators` package's own `src/keys.ts` — fetched, not derived (F1 is 290, the arrows 262-265, Ctrl 341/345, Alt 342/346). Ctrl and Alt reach the game rather than the browser, because they are Commander Keen's jump and pogo. A `blur` handler releases everything held, or a game walks into a wall for ever.

## CSP

This page needs `script-src 'self' 'unsafe-eval'`, not the narrower `'wasm-unsafe-eval'` the standalone bundles use: wdosbox evaluates strings at start-up. That puts it with the sixteen EmulatorJS bundles rather than the seventeen narrowed ones.

## Licensing

js-dos declares **GPL-2.0** in its `package.json` and on npm, but the upstream `8.xx` branch ships no LICENSE file while `7.xx` carries the full GPL-2 text. Worth resolving upstream.

## Bundle layout

```
systems/dos/
  play.html              bezel + canvas, CSP, corner links, pill
  genx-dos-player.js     renderer, keyboard, sound
  controls.html          system help
  games.json             title + file list per game
  jsdos/emulators/       emulators.js, wdosbox.js, wdosbox.wasm
  games/<key>/           dosbox.conf (ours) — the games themselves are not in the repo
```

## Related

- [[Emulators]] — the index
- [[Virtual-Filesystem]] — where `C:\SYSTEMS\PC\IBM` sits
