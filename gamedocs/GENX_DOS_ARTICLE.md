# Booting Up Nostalgia: Inside GenX-DOS

*A browser, a blinking cursor, and 32 ways to fall back in love with 8-bit gaming.*

There's a particular kind of magic in the moment a beige CRT used to flicker to life: the chime of a BIOS POST, the clack of a keyboard, a `C:\>` prompt waiting for you to type something it understood. GenX-DOS bottles that exact moment — and then, instead of booting into a single machine, hands you the keys to thirty-two of them.

## The Pitch

GenX-DOS is a browser-based DOS prompt that fakes its way through an AMIBIOS power-on self-test, drops you at a familiar command line, and lets you type a number to launch a game. No installs, no plugins, no server round-trips once the page loads — every ROM, every emulator core, every byte of it ships bundled in the page itself. Type a number, get a game. It's the platonic ideal of "just let me play something," wrapped in the costume of a machine you might have actually owned.

What makes the project interesting isn't the gimmick of the BIOS screen — it's the sheer scope hiding behind it. Nineteen separate emulator engines, stitched together under one roof, covering thirty-two distinct systems: the Apple I, the BBC Micro and Master, the Acorn Electron, NES, Atari 2600/7800, the entire Commodore 8-bit family (PET, VIC-20, C64, C16, Plus/4, C128, even the rare MAX), ColecoVision, Intellivision, Amstrad CPC, Magnavox Odyssey², MSX, Vectrex, Sinclair Spectrum and ZX81, Tandy CoCo and TRS-80, TI-99/4A, Atari 400/800XL — and three handhelds tucked in for good measure: Game Boy/GBC, Atari Lynx, and Sega Game Gear.

## Drawing the Line at "8-Bit Feel"

Scope creep is the natural enemy of any retro project, so GenX-DOS draws its boundary deliberately: the cutoff is aesthetic, not chronological or technical. If a machine has the *feel* of 8-bit — sprite-based graphics, chiptune audio, low resolution — it's in, even if it limped into the late '90s as a handheld. If it's a 16-bit home system like the Genesis, SNES, Amiga, or Atari ST, it's out, full stop, regardless of how charming it might be. It's a curatorial choice as much as a technical one, and it gives the collection a coherent identity instead of becoming "every emulator we could find."

## Under the Hood

Rather than reinventing an emulator for every platform, GenX-DOS leans on the best existing open-source work and wraps it in a uniform shell. Thirteen of the bundles share a common EmulatorJS framework plus libretro cores — FCEUmm for NES, Stella and ProSystem for the Atari 2600/7800, the VICE family for the Commodore machines, gearcoleco for ColecoVision, gambatte and Handy and Genesis Plus GX for the handhelds — all pooling roughly 3MB of shared framework instead of each bundle dragging its own copy along, saving an estimated 25MB across the project. The rest are standalone JavaScript or WebAssembly ports: apple1js, jsbeeb, ElkJS, apple2js, JSVecX, JSSpeccy, XRoar, and more, several of them rebuilt from source specifically for this project (sdltrs for the TRS-80, atari800 for the Atari 400/800XL, a patched tiny8bit core for the Amstrad CPC) to expose save-state hooks the stock builds had compiled away.

That save-state work is a nice detail buried in the README: most bundles sport in-browser save/load buttons, mirrored to `localStorage` so a snapshot survives a page reload. Getting there for the Odyssey², the Atari 400/800XL, and the Amstrad CPC meant cracking open WASM builds that had dead-stripped their own serialization code and wiring it back through — the kind of unglamorous archaeology that retro-emulation projects live or die by.

## A Console Without a Network Cable

Perhaps the most quietly radical design decision is what GenX-DOS *doesn't* do: it doesn't call out to anything. Every ROM, every BIOS, every engine is bundled locally and served from the page on first load. There's no live network dependency once you're in — you could, in principle, point a browser at a local copy and play a TRS-80 cassette game on a plane. In an era where most "retro" experiences are actually thin clients pointed at someone else's server, that's a deliberate, slightly stubborn choice — and it's exactly the choice you'd expect from a project obsessed with recreating the feel of a machine that worked the same way offline as on.

## Who It's For

GenX-DOS sits at the intersection of a few audiences: people chasing a specific console they grew up with, people who just want to poke around in obscure hardware they never owned (a Magnavox Odyssey² is not exactly a common houseguest), and people who appreciate the craft of making thirty-two wildly different machines feel like rooms in the same house. The DOS shell isn't just decoration — it's the connective tissue that makes hopping from a Vectrex vector-graphics game to a Spectrum loading screen feel like part of one coherent system instead of thirty-two disconnected demos.

It's licensed CC BY-NC for the original orchestration code (the menu trees, the BIOS animation, the wrapper logic), while the bundled emulators and assets carry their own upstream licenses — a reminder that a project like this is as much an act of careful attribution as it is of code.

Type a number. Press enter. Somewhere behind the curtain, a real emulator core spins up a real ROM, and for a few minutes, the C: prompt is the only interface that matters again.
