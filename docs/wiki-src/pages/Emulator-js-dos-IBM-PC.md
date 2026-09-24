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

The per-game `dosbox.conf` is ours and is in the repo; the games are not. Three machine types and five cycle counts, taken from configurations the games themselves shipped with rather than guessed:

| Setting | Games |
|---|---|
| `machine=cga` | Paratrooper, Digger, Beast, Alley Cat, Sopwith, Rogue, Round 42, Kingdom of Kroz |
| `machine=ega` | Captain Comic, Commander Keen |
| `cycles=fixed 400` | Digger |
| `cycles=fixed 200` | Sopwith |
| `cycles=fixed 300` | Beast |
| `cycles=fixed 600` | Rogue, Kingdom of Kroz |

Without the fixed counts those five run at a speed nobody can play.

## Sopwith is our own build of its own source

Sopwith is the one game here that is not the binary someone else released. Its source is GPL — David Clark released it and later relicensed it — so it could be changed at the source rather than worked around in the player, and it was: twelve lines, so the plane flies on the cursor keys as well as on `,` `/` `X` `Z`. Up climbs, Down descends, Left slows, Right accelerates; the original keys are untouched, so the game's own manual stays correct.

The change is in `keybint()`, the keyboard interrupt handler, with the four scancodes added to `def.h`. It was built with Turbo C 2.01 and A86 under DOSBox, linked with `tlink` in place of the `otlink` the original makefile wants and which cannot be had. The modified source, notices of what changed and when, and the build recipe are published at [`Retro-Jack/sopwith-genx`](https://github.com/Retro-Jack/sopwith-genx), which is what the licence asks of us.

It runs as `SOPWITH2.EXE -s -i -k`: straight into a single-player game on the IBM keyboard path, which is the path the change lives in, instead of asking for a game mode and a keyboard type first. The sound is on from the first frame — the source has always inverted `soundflag`, so on is the default and `-q` is what turns it off.

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
