# Weird exceptions

Most of what we take on falls into one of two piles: either it can be run in a
browser tab or it cannot, and either the licence permits what we want or it does
not. This page is for the ones that landed somewhere else entirely — where the
answer turned on something nobody would have guessed from the outside.

Each entry records what the oddity was and how it was settled, so the reasoning
survives longer than the conversation that produced it.

## ATCC — the talking version cannot come with us

[Air Traffic Control Center](https://genx-dos.fun/ATCC/) is a 1996 en-route
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
should be. Keep the voices and you are emulating Windows itself, which means
shipping an operating system that is not ours to ship, from a rights holder with
no door to knock on.

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
