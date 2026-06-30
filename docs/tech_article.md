# Booting a Museum in a Browser Tab

### How GenX-DOS turns a fake DOS prompt into a 32-system emulation arcade — with no installer, no plugins, and not a single byte fetched at runtime

---

There's a particular sound a 486 made when you turned it on. You can't hear it here — this is a browser tab — but everything else is in place. An AMIBIOS logo flashes. Memory counts up in 64 KB increments. A configuration table rattles off a numeric coprocessor that's politely *Absent*. Then the screen clears to a black field, a grey `C:\>` blinks, and the machine waits for you the way machines used to: by doing nothing at all until you type something.

Type `menu`. A box-drawn list appears — Home Computers, Games Consoles, Handheld Consoles — rendered in the chunky CP437 glyphs of a CGA text mode. Drill in, type a number, and a Commodore 64 boots inside a curved CRT bezel, the wood-grain wallpaper of a 1977 living room visible around the glass. Forty-year-old games run. Nothing was installed. Nothing phoned home.

This is **GenX-DOS**, and the trick it pulls off is harder than it looks.

## The lie that makes it work

The conceit is simple: a DOS prompt as a launcher. The execution is a stack of careful deceptions. That `C:\>` isn't a terminal emulator — it's a simulated filesystem (`fs.js`) where every directory you `cd` into and every file you `dir` is a JavaScript object, and every "program" is a `.bat` script that either prints a menu or opens an emulator. The text isn't text at all: each character is a 12×12 pixel sprite, sliced from a bitmap font sheet and positioned by CSS, so the whole display has the authentic blocky bite of a real VGA console rather than the smooth anti-aliasing of a web font.

That foundation isn't original, and the project is scrupulous about saying so. The terminal, the virtual C: drive, and the sprite-font renderer come from **LGR-DOS**, written informally by a developer known as Mike for Clint Basinger's *Lazy Game Reviews*. GenX-DOS — the work of Jack Horton — is what got built on top: the AMIBIOS boot animation, the menu trees, the emulator integrations, the bezels, and several hundred pages of per-game documentation. The `ATTRIBUTION.md` file reads like a museum's provenance ledger, down to the Wikimedia photographer whose Amstrad CPC photo carries a share-alike obligation.

## One rule that shapes everything

The defining constraint is almost monastic: **static, no build step, no runtime network calls.** The entire site is HTML and JavaScript served straight off a GitHub Pages branch. There's no bundler, no `package.json`, nothing to compile. Every ROM, every emulator core, every byte of game data lives on the same origin and ships in the clone.

This sounds limiting. It's actually the smartest decision in the project. A preservation site whose whole point is "this old software still runs" can't afford to depend on a CDN that might 404 in 2031, or a build toolchain that bit-rots, or a third-party emulator host that goes dark. By refusing all of it, GenX-DOS becomes the thing it's preserving: a self-contained artifact you could burn to a disc and run in a decade.

It also means the repository is a beast — 441 MB, with jsbeeb alone weighing 25 MB — and that thirteen of the emulators had to be talked into *sharing* one copy of the EmulatorJS framework instead of each dragging its own, a move that saved roughly 25 MB. Frugality and excess, side by side.

## Where the week-long fights happened

Plugging in nineteen emulator engines to cover thirty-two sub-systems — from the Apple I to the Sega Game Gear — sounds like a lot of glue code. Some of it was. The interesting parts were the engines that fought back.

Four emulators had to be **recompiled from source to WebAssembly** because no suitable browser build existed: the Atari 800, the Magnavox Odyssey², the TRS-80 Model I, and the Amstrad CPC. That's not configuration work; that's wrangling Emscripten toolchains. And then there was the save-state problem, which is the kind of bug that earns a war story.

The Atari build wanted in-browser save states, but the function that serialises the machine's state internally calls `emscripten_sleep` — which makes it an *asyncify* operation. The trouble is that the emulator's main loop is *already* a suspended asyncify operation. Call the save routine from a button click and you get two concurrent stack unwinds sharing one asyncify stack, stomping each other into a flood of "memory access out of bounds." The fix was to defer the save through the frame loop so it never runs concurrently with the loop it's part of. That is a genuinely subtle piece of systems engineering hiding behind a button that just says *Save*.

Other ghosts were more mundane and more maddening. Two libretro cores — the C128 and the Game Boy's gambatte — shipped *broken* in their stable builds: one cold-booted to uninitialised-RAM garbage, the other rendered a blank white panel. The cure was to mirror the nightly builds for exactly those two while keeping everyone else on stable, a footnote now permanently enshrined in the attribution file.

And then, because every retro project eventually meets it, there was **the Firefox problem.** The DOS prompt is a fixed 80×25 grid scaled to fit inside the bezel's screen cutout, and Firefox kept drawing a faint horizontal hairline through every row of text — sub-pixel anti-aliasing on the clip edges of a non-integer transform. The eventual fix snaps each character cell to whole device pixels and renders the sprite font nearest-neighbour. A font-rescaling rewrite was attempted, tested, and thrown away in favour of the simpler snap. The residual shimmer that remains? It reads as CRT scanline character now. Sometimes the bug becomes the feature.

## A point of view about the past

What elevates GenX-DOS above "a pile of emulators" is that it has *opinions*. The scope isn't "8-bit era" — it's **8-bit feel**. The aesthetic decides, not the calendar: the Game Boy, Game Gear and Lynx are in, late-90s release dates be damned, because they look and sound like 8-bit machines; the Genesis and Amiga are out, because they don't. Each system's menu lists ten games, sorted by year — the Acorn Electron the lone exception, carrying the seven snapshots its emulator (ElkJS) ships — with built-in software like the Vectrex's Mine Storm relegated to a deliberate eleventh slot. When a franchise qualifies, the *first* entry gets the nod, not the sequel. Given a choice of formats, the floppy release beats the CD.

The per-game documentation got the same treatment. A site-wide audit re-checked every control scheme against original manuals and disassemblies, and found that nearly every hand-built emulator's docs had *guessed* keys that turned out wrong — Vectrex fire buttons, ZX Spectrum's per-publisher control quirks, a TI-99 "Hunt the Wumpus" that turned out to be the graphical joystick cart, not the text game. The corrections were sourced, not invented. It's the kind of pedantry that separates a toy from a reference.

## The unglamorous virtues

Underneath the CRT glow, GenX-DOS runs on process discipline that most solo projects never bother with: Keep-a-Changelog formatting, semantic-version tags, GitHub releases, and recurring audits that hunt for orphaned files and stale documentation. During the writing of this article the project shipped four point releases in three days — a Firefox fix, a docs sync, an exit-screen polish, a credit on the prompt page — each one tagged, each one deploy-verified against the live site.

It is not flawless, and it would be dishonest to pretend otherwise. There are no automated tests; the safety net is a human eye and a habit of verifying every change against production. The core terminal renders output by firing synthetic keypress events at itself, a clever hack that's also a little haunted — a recent bug saw the "exit" screen lose its cursor because trimming a couple of blank-line commands silently removed the side effect that redrew the prompt. The legal footing of bundling several hundred commercial ROMs is the gray area every preservation project lives in, mitigated by a visible takedown path. These are the honest seams of an ambitious one-person build.

## Insert disk and press any key

But here's the thing about standing in front of it. You type `0` to exit, and the screen clears to a small sign-off — *GenX-DOS (2026)* — and drops you back to a live prompt, cursor blinking, waiting again. For a second the whole illusion holds completely: it's 1991, the machine is yours, and there's a whole shelf of cartridges one number away.

It's a museum that boots in a tab. And unlike most museums, you're allowed to touch everything.

---

*GenX-DOS is live at [retro-jack.github.io/GenX-DOS](https://retro-jack.github.io/GenX-DOS/) and open-source on [GitHub](https://github.com/Retro-Jack/GenX-DOS). The orchestration code is CC BY-NC 4.0; the bundled emulators and the LGR terminal base keep their own licences.*
