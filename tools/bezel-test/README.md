# Bezel test cards

One BASIC program per machine that fills the **border white** and the
**playfield black**. That is the clearest possible target for the bezel-fit
check (audit purpose 4): the white shows exactly how far the emulator's picture
reaches, so any gap, letterbox or feather fringe between picture and bezel is
unambiguous instead of being guesswork against a game's own artwork.

### Getting to a BASIC prompt

Not every bundle boots to BASIC. Known routes:

    bbcmicro   dist/index.html?disc=blank.ssd   (no param 404s on elite.ssd;
                                                 jsbeeb prepends discs/ itself)
    bbcmaster  dist/?model=Master&disc1=blank.ssd
               ^ the model matters: without it you get a Model B, banner
                 "BBC Computer 32K" instead of "Acorn MOS". Not a bundle bug —
                 the menu links all pass model=Master.
    electron   play.html                        (boots straight to BASIC)
    xroar      play.html                        (boots straight to BASIC)
    jsspeccy   play.html, then click to start

### Typing these in through the browser

Dispatch synthetic `KeyboardEvent`s at `document` (and at the canvas — some
bundles listen there). One trap cost a run on the CPC: **`keypress` must carry the
character code, not the key code.** A comma is `charCode: 44` with
`keyCode: 188`; sending 188 as the charCode made `INK 0,0` arrive as `INK 0` and
throw "Syntax error in 30". jsbeeb happened not to care, tiny8bit does. If a line
comes out mangled, type `NEW` before retyping — the CPC keeps the failed text on
its input line and you get `30 30 INK 0,0INK 0`.

### Findings — Acorn (done 30/08/2026)

**BBC Micro and BBC Master pass.** The card showed the picture well inset from
the tube, which looked like a gap — but the canvas is exactly the bezel
container's size, so it covers the whole glass and that band is the BBC's own
black border, symmetric at 138px left and 143px right. Both models identical.
Without the card this was indistinguishable from the CoCo's real fault.

**Acorn Electron passes** — and it produced the trap worth recording. The magenta
backing showed a thick ring out to the glass, which read as a 40px-per-side gap
against the cutout's bounding box of 738x623. Sizing the canvas to that bbox was
a regression, not a fix: the hole is a **rounded** rectangle, and the Electron's
addressable area runs edge to edge with no screen border, so the overshoot clipped
real characters — the boot banner came up as "orn Electron" and "3ASIC". Jack
spotted it immediately.

**Compare a bezel's picture against the largest rectangle INSCRIBED in the hole,
not the hole's bounding box.** For `Microvitec-CUB.png` that is 85,73..753,637, i.e.
`10.24%/10.169%/80%/78.41%` — against which the Electron's original
`10.96%/10.97%/78.69%/76.69%` was already within 1.3%. Magenta visible between
the inscribed rectangle and the hole's curve is the corners, and is expected.

The CoCo could be pushed proud of its hole only because what spilled over was
screen *border*. A machine whose picture has no border margin has nothing to
spend, so check what the overshoot would cost before taking it.

### Findings — Amstrad (done 30/08/2026)

**CPC passes.** It already uses the oversize-and-clip approach: `#canvas` at
`24.85%/4.8%/46.3%/66.4%` against a hole bbox of `27.097%/13.004%/41.877%/47.177%`,
so it stands 30px proud left and right, 73px top and 99px bottom, and the bezel
trims the rest. No magenta anywhere. What the overshoot eats is the CPC's hardware
border, not picture — the card shows a healthy white band still inside the glass.

Cosmetic note, not a fault: the ROM reports **"Amstrad 128K Microcomputer (v3)"**,
a 6128, while the bezel photograph is badged **CPC 464**.

Use with the magenta trick — set `.screen-bg` to magenta and the three failure
modes separate cleanly. See the `feedback-magenta-bezel-check` memory.

## Two dialect problems, not one

Each machine has its own BASIC **and** its own keyword-entry scheme. The
ZX Spectrum is the sharp example: in K mode one keypress is one keyword, so `B`
*is* `BORDER` and typing the letters "BORDER" gives nonsense. `PAPER` is not
reachable from K mode at all. So a program being correct BASIC is only half of
being enterable.

## Verification status

Written from reference knowledge and **verified by running it in our own bundle**
only where marked. Unverified files are drafts and may be wrong on dialect
details — that is exactly the class of thing recall gets wrong.

| file | machine | border control | status |
|---|---|---|---|
| `xroar.bas` | Tandy CoCo | colour set via `SCREEN 1,1` | **VERIFIED 30/08/2026** — `PCLS 0` is the correct one of the two |
| `jsspeccy.bas` | ZX Spectrum | `BORDER` | drafted; needs K-mode/extended-mode entry, see above |
| `msx1.bas`, `msx2.bas` | MSX1 / MSX2 | `COLOR fg,bg,border` | drafted |
| `cpc.bas` | Amstrad CPC | `BORDER 26` = bright white | **VERIFIED 30/08/2026** |
| `atari400.bas`, `atari800.bas` | Atari 8-bit | `SETCOLOR 4` = border, `2` = playfield | drafted |
| `c64.bas` | C64 | `POKE 53280/53281` | drafted |
| `c128.bas` | C128 | `COLOR` | **suspect** — used source 5 (80-col background); 40-col foreground is source 1 |
| `vic20.bas` | VIC-20 | `POKE 36879` | drafted |
| `c16.bas`, `plus4.bas` | C16 / Plus4 | `COLOR` | **suspect** — assumed source 4 is the border, as on the C128; TED numbers differently |
| `js99er.bas` | TI-99/4A | `CALL SCREEN` colours border *and* background together, so the playfield is filled with a black-on-black character | drafted |
| `bbcmicro.bas`, `bbcmaster.bas`, `electron.bas` | BBC / Electron | **no border register** — border is always black, so the card is a white fill with a black inset, marking the addressable edge | **ALL THREE VERIFIED 30/08/2026** |
| `apple2.bas` | Apple ][+ | no border; inverse-space frame | drafted |
| `pet.bas` | PET | no border; reverse-video frame | **suspect** — positions with `TAB`, but PET BASIC 2.0 positions with `CHR$` cursor codes |
| `trs80.bas` | TRS-80 Model III | monochrome; `SET()` frame at the graphics edge | drafted |
| `jtyone.bas` | ZX81 | no colour at all; screen is already white, so the card is an inverse-video black interior | drafted |
| `apple1.bas` | Apple I | no inverse video and no graphics — a solid white edge is **not possible**; asterisk frame is the closest available | drafted, best-effort |

## Scope and order

Jack, 30/08/2026: **every computer except the Tandy portable**, worked through
**starting with Acorn and proceeding alphabetically** by manufacturer:

    Acorn        bbcmicro, bbcmaster, electron
    Amstrad      cpc
    Apple        apple1, apple2
    Atari        atari400, atari800
    Commodore    c16, c64, c128, pet, plus4, vic20
    MSX          msx1, msx2
    Sinclair     jsspeccy, jtyone
    Tandy        trs80, xroar
    TI           js99er

Twenty machines. The **TRS-80 Model 100 is excluded** by request. The Commodore
MAX Machine is a cartridge console with no BASIC ROM, so it falls in with the
other no-BASIC systems below rather than with the Commodore computers.

## No BASIC — cannot be done this way

`coleco`, `gamegear`, `gbc`, `intv`, `js7800`, `jsnes`, `lynx`, `max`,
`odyssey2`, `sms`, `stella`. Eleven of the 33 systems are consoles or handhelds
with no BASIC in ROM. For those the bezel check has to use the magenta trick
against a game screen with a known solid-colour edge.
