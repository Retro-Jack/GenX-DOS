# Weird exceptions

Most of what we take on falls into one of two piles: either it can be run in a
browser tab or it cannot, and either the licence permits what we want or it does
not. This page is for the ones that landed somewhere else entirely — where the
answer turned on something nobody would have guessed from the outside.

Each entry records what the oddity was and how it was settled, so the reasoning
survives longer than the conversation that produced it.

## ATCC — the talking version cannot come with us

Air Traffic Control Center is a 1996 en-route
radar simulator by Xavius Software, built by a working controller and modelling
real FAA sectors across three centres. It is the kind of thing this project
exists for. It is also a tangle, and the tangle is instructive.

### Its licence permits something almost nothing else does

ATCC 1.0's licence forbids distributing the installed software, then carves out
an exception by name:

> you MAY transfer, assign or distribute copies of the software's INSTALLATION
> PACKAGE (the single-file ATCC.EXE setup executable). This must be the exact,
> unaltered setup file for this software as obtained from www.xavius.com.

That is an express grant from the rights holder, which is rarer than it sounds.
The condition is exact, so it is worth verifying rather than assuming: the file
we hold is byte-identical to the one the original site still serves.

The carve-out is also the reason a browser bundle is a different question. A
bundle serves the *installed* files, which is the half the licence refuses, so
it needs permission rather than inference.

### Version 1.1 was given away, and that changed less than it looks

1.1 was the paid release. Later it was set free — not by a new licence, but by
Xavius publishing its unlock code on their own download page. The Internet
Archive catches the moment: in 2007 the page told you to buy a code, by 2009 it
simply printed one, and it still did in 2016.

It is tempting to read that as a release into the wild. It is not. **Free to use
is not free to pass on.** 1.1's licence has no redistribution clause at all, and
none of the installation-package exception 1.0 carries. The published code
unlocked the copy you downloaded from Xavius; it did not make the installer
yours to hand on.

### The part that actually settles it

Even with permission, 1.1 could not be made browser-playable in any way worth
doing — and the reason is in the package rather than the paperwork.

Open it up and the simulator is still a DOS program, launched through a PIF,
drawing with the same Borland stroked fonts 1.0 uses. What 1.1 adds is 807
numbered sound files and a small Windows program whose job is to play them. The
pilots' voices are not part of the simulator at all; they are a Windows
companion feeding clips to a DOS program that cannot make a sound itself.

So the two things always said about 1.1 — that it gained speech, and that modern
Windows will not run it — are one fact. Run the DOS half under an emulator and
it behaves exactly like 1.0: same sim, same sectors, silence where the readbacks
should be. Keep the voices and you are emulating Windows itself.

### What we assumed, and what testing found

The first version of this entry stopped there, on the reasoning that emulating
Windows means shipping an operating system that is not ours to ship. That is
true about *shipping* it. It was wrong about possibility, and we only found out
by trying.

Windows 98 runs in a browser tab, through v86, better than we expected: a cold
boot to a usable desktop in about **27 seconds**, 13 to 38 mIPS sustained, and
mouse and keyboard both working. Most importantly **the audio works** — the
thing the whole question turns on.

Two things are worth writing down for whoever tries next. Mouse input needs
pointer lock; without it, button presses never reach the guest at all, however
precisely you place the cursor. And in locked mode v86 applies exactly **2x** to
pointer movement, so the way to hit anything is to drive the cursor into a
corner to zero it, then send half the distance you want to travel.

Where our test stopped was a detail of someone else's demo page rather than a
limit of the technique: that profile will not accept a CD image mid-run, so the
installer could not be got into the guest. Serving our own instance, both images
would be mounted at boot.

So the platform is not the obstacle. What stands in the way is that the Windows
image is not ours to ship -- a visitor could supply their own, as they already
must for the local route -- and that 1.1's licence has no redistribution clause
whatever runs it. Added to that is the cost of asking somebody to bring an
operating system to a site whose whole promise is that you click and it boots.

### Where it was left

| | |
|---|---|
| **A page about it** | Written in our own words, hosting nothing of theirs, linking to the original downloads |
| **The 1.0 installer** | Redistributable by express permission; verified unaltered |
| **A browser-playable 1.0** | Needs permission, because it serves installed files |
| **Anything 1.1** | Installer at most, and only with permission |
| **A browser-playable 1.1** | Not pursued — it would be 1.0 with extra steps, or Windows |

The Xavius ATC products are now owned and supported by
[Adacel Technologies](https://www.adacel.com/), so that is where a request goes.

**The lesson worth keeping:** a licence that says *freeware*, a product that was
given away, and a program that will run are three separate questions. ATCC
answers them differently from each other, and the obvious reading is wrong on
two of the three.

## The CoCo's colours were never in the signal

The Tandy CoCo's hi-res modes are two-colour. The games are not. On an NTSC
television the composite signal turns alternating pixel columns into red and
blue, and the titles that mattered were drawn *for* that artefact rather than in
spite of it. Demon Attack is black, white, red and blue on a TV set, and stark
monochrome without it.

The trap is that accuracy points both ways. Emulate the artefact and Dungeons of
Daggorath's deliberately clean white line art comes out fringed blue and orange;
leave it off and Canyon Climber and Mega-Bug — which look like ordinary colour
games — collapse into unreadable dither. There is no setting that is right for
the machine, because the machine was never the question.

So it is per game, not global: a `tv` key on the entry, pushed as XRoar's
`-tv-input` before the module loads. The two values are the artefact's two
phases, which decide *which* colour lands on which column. Judge it on the
gameplay screen, too, not the title — several titles wear a hi-res title over
four-colour play, and look fine either way.

## The NES folder is named after the wrong emulator

`systems/jsnes/` does not contain jsnes. It runs FCEUmm through EmulatorJS, and
the folder name is a fossil of the build that came before.

Worth knowing because it misleads in two directions. Documentation should say
"FCEUmm via EmulatorJS" regardless of what the path says — and the keymap
deliberately swaps B and A against EmulatorJS's own RetroPad default, because
the old jsnes build mapped them the period-correct way round and the swap keeps
the muscle memory intact. That block looks like a bug until you know it is a
decision.

## A disk you have to turn over

Some Apple II games ship across both sides of one floppy, and say so: the game
stops and asks you to turn the disk over. There is no clean way to emulate a
physical act, so there is a **Flip Disk** button that swaps the image in the
running drive with no reset, which is exactly what turning it over did.

The part that cannot be automated is knowing when to offer it. **An image cannot
be asked whether it has another side.** So the pairs are listed by hand, one
entry per game, and no entry means no button. Detection is not hard here; it is
impossible.

It also gives you an unusually clean test. Boot the second side on its own and
the game itself objects — Oregon Trail answers `PLEASE INSERT SIDE 1 OF YOUR
OREGON TRAIL DISKETTE`. That complaint is the proof the side is genuine and
readable, which no amount of checking the filename would give you.
