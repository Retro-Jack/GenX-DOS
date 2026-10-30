# NewBrain — Grundy NewBrain AD

The NewBrain is the only bundle on the site whose emulator is **ours**. Every other system runs someone else's engine — ported, forked, or compiled from source — but there was no NewBrain emulator to port that ran in a browser, so the machine is written from scratch: Z80 memory map and video, a COP420 core, and a cassette codec. It is also published on its own at [`Retro-Jack/newbrain-js`](https://github.com/Retro-Jack/newbrain-js).

It sits under **Portable Computers** beside the [[Emulator-VirtualT-Model-100]], which is where it belongs: the NewBrain ran off a battery pack and carried its own display, so it works with no monitor attached at all.

## Two processors, two screens

The machine is a Z80A at 4 MHz with a **COP420** alongside it — a 4-bit National Semiconductor microcontroller running its own microcode, which owns the keyboard matrix, the cassette, and the sixteen-character vacuum fluorescent panel on the machine's front. The Z80 talks to it over a serial microbus. Get the COP wrong and the machine looks dead even though the Z80 is running perfectly.

Both displays are on the page. The monitor is where programs draw — 40 or 80 columns, switched by whatever is running. The glowing strip on the machine is the VF panel, and it is not decoration: the firmware writes to it, so it lights up while the machine works.

The machine has **no sound hardware at all**. Sound was to be an add-on, like the discs, so the games are silent — as they were in 1982.

## The cassette is not Kansas City Standard

The obvious guess is wrong. The NewBrain uses a two-tone FSK scheme of its own, and the framing is **start = 1, data MSB-first, stop = 0** — the opposite of the usual convention on both counts. Cells are measured in Z80 T-states rather than cycles of a carrier:

| Element | T-states |
| --- | --- |
| leader group | 2208, 2208, 1120, 1120 |
| join (one extra half-cycle) | 2208 |
| bit 1 | 832 × 4 |
| bit 0 | 1655, 1793 |

That single `join` half-cycle between the leader and the first frame is not optional — without it nothing decodes at all.

## The COP's two serial modes

The hardware fix that made tape loading work: the COP420's SIO register is **two different things** depending on `EN0`. With `EN0 = 1` it is an asynchronous binary counter, decrementing on a debounced falling edge of SI — which is how the machine counts tape pulses. With `EN0 = 0` it is an ordinary shift register, and `SO` takes bit 3, not bit 0.

These had been implemented the wrong way round, so counter mode ignored SI entirely and no tape could ever be read. The TPIN line was unwired on top of that.

## The row terminator and the frame end

The display generator walks RAM from the TVL latch and uses `00` bytes as markers: **one ends the row, two end the frame, three start a graphics line**. A program marks the bottom of its screen with a double `00`, and nothing below that should be drawn.

Our renderer handles the row terminator **per scanline** and latches the frame end separately. That is a deliberate divergence from MAME, and it is worth knowing why. MAME carries the terminator flags from one scanline to the next and restores only `qc`, from `qb`. That works whenever two or more bytes follow the `00` — but a terminator in **column 38** leaves exactly one byte behind it, the stale low `qb` shifts into `qc` on the next scanline's first column, and the row renders on alternate scanlines.

Column 38 is where BASIC puts the terminator after a 38-character line, which is an entirely ordinary thing to print, so the hardware cannot behave that way. Released MAME draws such a line solid — but only because it has no terminator logic at all and paints all 240 lines regardless, which is also why it would show whatever lies past the end of a program's screen.

## Loading a game

A real NewBrain has to be told to listen *before* the tape starts: type `LOAD ""`, press NEW LINE, then press play. The page does all of that, waits for the machine to take the last block, and types `RUN`.

Loading is not instant, because the signal is real and the ROM decodes it a bit at a time. The machine is run flat out until the load finishes, so the largest game here costs seconds rather than the minute it once did. The cassette motor stopping part-way through a load is normal — the ROM halts it between blocks while it stows one away, and the tape stops with it.

## The expansion slot

A card is bank 4 of the address space, `0x8000-0x9FFF`, and that is the only part of the map it gets. The slot is **wired but empty**, which is the machine as sold — the disc system was bought separately.

Fitting a disc controller was attempted and is known not to work. The wiring is right (a card answering `0xFF` boots exactly as an empty slot does), but a card returning the real `d413` ROM stops the machine booting on every BIOS revision, and why is unexplained. The findings are written up in the standalone repository's `EXPANSION.md` so the next person starts further along.

## Keyboard notes

Keys are mapped by physical position, so the layout does not depend on the host keymap. `Esc` is **STOP**, `Enter` is **NEW LINE**, `Tab` is **GRAPHICS** and backquote is **VIDEO TEXT**. Several characters sit somewhere a modern keyboard does not: `[` gives `(`, `]` gives `)`, `'` gives `+`, and the apostrophe is Shift-`7`. Two machine keys have no PC equivalent and are unreachable — **REPEAT** and the `£`/`*` key.

See [[Emulators]] for the rest of the engines, and [[Legal]] for licensing.
