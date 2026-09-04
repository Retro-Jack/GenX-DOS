# JSVecX — GCE Vectrex

The Vectrex is the odd one out on this site twice over. It is the only console here with its own screen built in — no television, so no 4:3 bezel, just a photo of the whole machine standing on the wallpaper — and it is the only platform we have shipped, removed, and then shipped again.

## Why we removed it

We dropped it on 04/07/2026, and the reason was one game. *Spike* talks: it is the Vectrex title everyone remembers for having a voice. Under jsvecx it ran perfectly and said nothing at all. A console whose most famous game is silent is a console shipped broken, so out it went and the Sega Master System took the slot.

The note we left behind said the fault was AY-3-8912 sound emulation, and that the same limitation existed in the libretro `vecx` core, so it was the emulation lineage rather than our bundle. That note was wrong on both counts, and it took a link from Jack to find out.

## Why it came back

The link was [vectrexia.com](https://vectrexia.com/), where Spike speaks. Which meant it was possible — and, once we looked, that site is running jsvecx too. It had simply added the missing piece itself.

The missing piece is not the sound chip. The Vectrex has no speech hardware whatsoever, and neither does the *Spike* cartridge. What it has is a **four-level DAC on VIA port A**, and a multiplexor that can route that DAC to the sound line. Speech is played by flicking between those levels very fast: the waveform lives in the *timing* of the flicks, not in sample depth. Across the whole of *Spike*, port A only ever holds four values while the gate is open — `0, 48, 160, 208`, which as signed 16-bit are `0, +12288, −24576, −12288`.

Upstream jsvecx does not emulate that path at all. So we added it, in [our fork](https://github.com/Retro-Jack/jsvecx), taken verbatim from `libretro-vecx` rather than tuned by ear.

Two details are worth knowing, because neither is obvious and both will bite anyone reimplementing this:

- **The gate test needs three bits, not two.** `alg_update()` already switches on `via_orb & 0x06`, but the DAC only reaches the sound line when the demultiplexor is enabled as well. The condition is `(via_orb & 0x07) == 0x06`.
- **The value is latched before the gate opens.** Instrument the port-A write, count only the writes made while the gate is open, and you get *zero*. The game sets the value first and switches the multiplexor afterwards, so a single hook on the write will never see any speech.

## Proving it rather than trusting our ears

The whole reason the platform was removed was a judgement made by listening, and that judgement was wrong. So the DAC went in against a measurement instead.

A headless harness runs the emulator with no display and counts how often the DAC is gated open. The reference implementation, `libretro-vecx`, gives **20,702** for *Spike* and **0** for *Mine Storm*. Our JavaScript gives **20,530** and **0** — 0.8% apart. That number says something useful beyond "it works": jsvecx's 6809 and VIA emulation were always faithful, and only the DAC was ever missing.

One trap in running it: with no buttons pressed the game sits on its title screen and the DAC never fires, which looks exactly like a broken DAC. Drive the input.

The same harness then corrected the game documentation. Run over all ten cartridges, it shows that only *Spike* produces multi-level DAC output. **Berzerk uses the DAC not at all** — so the arcade machine's "Chicken! Fight like a robot!" taunt, which our gamedoc claimed the port retained, never existed on this machine. Star Castle, Cosmic Chasm and Rip-Off gate the DAC open at a single unchanging level, which is the analogue path rather than sound content.

## Three sound chips, one of which works

The engine ships **three** implementations that each define `e8910()` — `processed/e8910.js`, `js/e8910Full.js`, and an AudioWorklet built from a minified string inside `js/audioWorkletWrapper.js`. Whichever script loads last wins.

Tested in Chrome with an analyser tapped between the gain node and the destination, the AudioWorklet path produces RMS 0.001 and peak 0.002 — silence — while the ScriptProcessorNode in `e8910Full.js` gives RMS 0.17–0.37 with peaks near 0.99. Pristine upstream behaves the same, so this is not something our fork caused. It does mean upstream's own shipped build has no working audio, because that build is precisely the one that excludes `e8910Full.js`.

So the bundle loads `js/e8910Full.js` last, deliberately. The fork carries the same DAC in the worklet as well, in case that path is ever fixed, but nothing relies on it.

The audio rate is effectively fixed at 22050 Hz: `SOUND_FREQ` is used in exactly one place, to construct the AudioContext, while the PSG's period maths uses a hard-coded `STEP3 = 1`. Raising the rate transposes all the music down an octave.

## What we changed besides the DAC

**The emulator paused itself whenever the window lost focus** — it called `stop()` and forced its menu open on `blur`, so clicking any other window froze the machine. Wrong for an embedded player, and it makes measurement treacherous, since any unfocused reading looks like a dead emulator. Removed. Genuine backgrounding via `visibilitychange` is left alone.

**ROMs are stored flat**, as `games/<key>.bin` with `overlays/<key>.png` beside them, driven by a single `?game=<key>` like every other bundle here. Upstream nested them in collection folders and derived the overlay name by splitting the filename on its `_<year>` suffix. It also accepted remote URLs fetched through a proxy — a runtime network call this site does not make. That path is gone.

`minestrm` is deliberately not a file: Mine Storm lives in the boot ROM, so it sets its overlay and leaves the machine bare.

## The overlays

Vectrex games shipped with a printed plastic screen cover, because the display is monochrome — the colour you remember is physical. We ship the eleven overlays and lay each one in front of the vectors inside the bezel aperture, which is why *Spike* has a blue sky and a red logo on a machine that could only ever draw white lines.

## The bezel

The screen hole is a clean rectangle — width holds at 646–647px across the full height, height at 804–811px across the full width — so it needs none of the inscribed-rectangle fitting the TRS-80 and Electron did.

One measuring trap: the usual transparent-pixel bounding box returns **100% × 100%** here and is useless, because the console floats on a transparent surround rather than filling the frame. Flood-fill from the hole centre instead. Any bezel that is a photograph of a whole machine will behave the same way.

The canvas and overlay both need `!important` on their geometry. The engine's own `resizer()` runs on every resize and writes inline `width`/`height`/`left`/`top` on both, sizing them to the viewport for its full-screen layout, and inline styles beat ordinary rules.

## What you get

Ten commercial cartridges plus Mine Storm from the boot ROM. The bundle is 912 KB — the version we shipped in 2026 carried the emulator's entire 499-ROM library, of which the menu ever listed eleven.

No save states: jsvecx exposes none, so the bundle has no save/load controls.
