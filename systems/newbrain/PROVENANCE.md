# How this emulator was written

A statement of provenance for the NewBrain emulator in this bundle. It says
what the code was derived from, what it was deliberately not derived from, and
which of those claims can be checked by someone who does not take our word for
it.

The emulator is also published on its own, as
[`Retro-Jack/newbrain-js`](https://github.com/Retro-Jack/newbrain-js), and
`src/` here is a copy of `src/` there. That repository holds the authoritative
copy of this document; this one is kept beside the code it describes so the
bundle does not depend on it. A change to either belongs in both.

Written 31/10/2026. It is a statement of fact about how the work was done, not
legal advice.

## Why there is a statement at all

Two emulators of this machine existed before this one, and they sit on opposite
sides of a line.

**MAME's `newbrain` driver is BSD-3-Clause**, copyright Curt Coder. Reading it,
adapting it, even transliterating it would all be licensed reuse so long as the
copyright notice is retained — which [ATTRIBUTION.md](../../ATTRIBUTION.md)
does.
Nothing about this project needs clean-room separation from MAME, and it does
not claim any.

**Chris Despoinidis's Windows emulator is closed source.** Copying from that
would be neither licensed nor defensible, so the separation from it is real, and
this document exists to describe it rather than to assert it.

## What the code is derived from

**MAME's driver and COP400 device, read as reference.** The memory map, the
video generation, the COP420 instruction semantics and the wiring between the
Z80, the COP420, the keyboard matrix and the VF panel were all worked out by
reading `src/mame/grundy/newbrain.cpp`, `newbrain_v.cpp`, the
`src/devices/bus/newbrain/` cards and `src/devices/cpu/cop400/`. Fifteen files
are kept locally, in a `reference/` directory that is in neither repository, and
ATTRIBUTION names them by MAME's own paths.

`src/` is a reimplementation in JavaScript rather than a transliteration. The
COP420's instruction set is National Semiconductor's and the dispatch in
`src/cop420.js` encodes the same instruction set, because there is only one;
what it does not do is follow MAME's C++ structure. Where that distinction
matters least is worth saying plainly: the licence would have permitted the
closer approach too.

**Grundy's own NewBrain Software Technical Manual (1981).** The COP420 command
set, the DISPCOM transfer format and the page-zero variables are documented
there directly. The PDF carries a real text layer, so it was read with
`pdftotext` rather than OCR — the text is the publisher's own, not a guess at
it. Where the manual and MAME disagreed, behaviour observed while running the
real ROMs decided it.

**The ROMs themselves, by running them.** Several of the hardest findings came
from neither source. The COP420's SIO register being two different things
depending on `EN0` — an asynchronous counter with `EN0 = 1`, a shift register
with `EN0 = 0`, taking `SO` from bit 3 rather than bit 0 — was established
because tape loading could not work until it was right. The cassette framing,
start = 1 and data MSB-first and stop = 0, is the opposite of the usual
convention on both counts, and the leader's single extra `join` half-cycle is
not optional; none of that was taken on trust from anywhere.

## What it is not derived from

**No code, data or notes from the Windows emulator are in this repository.**
It was used as inspiration — as evidence that the machine could be emulated at
all, and as a source of two things that are not code: the tape library
described below, and, once, a screenshot.

**That screenshot is worth describing, because it is the closest contact there
was.** A capture of the Windows emulator showing `NEWBRAIN BASIC` / `READY`
settled a rendering fault: this emulator was showing `IN BASIC` from the same
bytes, which identified the display generator as the problem rather than the
ROM or the character set. Comparing what two programs put on screen is
observation of output. It is the same act as comparing against a photograph of
the real machine, and nothing about the other program's internals was learned
from it.

**An earlier decompilation existed and was destroyed.** Before this repository
was started, a working set included a copy of that closed-source emulator and a
full Ghidra decompilation of it. On 28/10/2026 the instruction was to treat the
original as reference and inspiration rather than as a source, and to delete the
decompile and start again. That is what happened: the decompiler output, the
working set, the tool's own cache and the notes transcribed from it were all
removed, and no part of the current implementation descends from them.

**The question was reopened later and declined.** When decompiling it again was
suggested as a way through a stubborn COP420 fault, it was not done — a
provenance story saying the work derives from MAME and Grundy's manual stops
being true the moment decompiled knowledge is let back in, and the exposure
would not fall on the person who wrote the code. A diff against MAME's opcode
table found the fault instead.

## The one piece of third-party code

`src/vendor/Z80.js` is Molly Howell's Z80 interpreter, **MIT licensed**, copied
rather than package-managed, with the full licence text beside it. Two
mechanical changes are recorded in
[`src/vendor/MODIFICATIONS.md`](src/vendor/MODIFICATIONS.md): a `typeof window`
guard so the file loads under Node for the test suite, and an ES module export.
No emulation behaviour is altered. Everything else in `src/` is original and
GPL-3.0-or-later.

## What was taken from the Windows distribution, and what it is

The tape library. `NewBrain Backup.tar.gz` is that emulator's distribution and
carries roughly 311 BASIC programs plus `Basic/Desc.txt`, a one-line
description of nearly every one — a better catalogue of NewBrain software than
anything on the web, and the reason six English tapes could be chosen on
evidence rather than guesswork. Those are third-party BASIC programs and the
author's own notes about them: data the distribution carries, not part of the
emulator. They are listed in [ROMS.txt](../../ROMS.txt) and are not in the
repository.

## What can be checked

Four things, none of which rest on assertion.

**The emulator's repository postdates the deletion.** `git log` in
`Retro-Jack/newbrain-js` shows its first commit, *Initial commit: Grundy
NewBrain AD emulator*, dated **28/10/2026** — the same day the decompile was
destroyed. Every line of the emulator was written after that point, and the
history is linear and public.

**Nothing of the decompilation survives on the machine.** No Ghidra
installation, no `/var/tmp` cache, no decompiler output, no derived notes.

**The renderer disagrees with MAME, on purpose.** MAME carries the display
generator's terminator flags between scanlines and restores only `qc`, from
`qb`. A terminator in column 38 leaves one byte behind it, the stale low `qb`
shifts into `qc` on the next scanline's first column, and the row renders on
alternate scanlines — which cannot be what the hardware does, because column 38
is where BASIC puts the terminator after an ordinary 38-character line. This
emulator handles the terminator per scanline and latches the frame end
separately, and `test/frameend.test.mjs` — in the standalone repository, which
carries the test suite the bundle does not — pins both behaviours. That test was
checked to *fail* against the two earlier broken versions, not merely to pass
against the current one. A copy does not diverge from its source and then prove
the divergence.

**It was built against observable behaviour throughout.** Seven test files
cover the boot sequence, the memory map, the COP420, the keyboard, video RAM,
the screen and the frame end. Of 118 tape images tested, 103 load byte for byte
through the machine's own ROM decoder rather than by interception; most of the
remainder are machine code or assembler output that BASIC's `LOAD` cannot accept
whatever the tape does.

## ROMs, and removal

The system ROMs are Grundy's and the COP420 microcode is National
Semiconductor's. **Neither is distributed with the repository**; ROMS.txt says
what is needed, under which names, and the emulator reports plainly when a file
is absent.

If you hold rights in anything named here, or represent someone who does, and
would rather it were not used this way, say so and it will be removed — no
argument and no delay. That offer covers this document's subject matter as much
as the rest of the project.
