#!/usr/bin/env python3
"""Build a self-booting Apple ][ bezel test card as an apple2js disk image.

The Apple II cannot be driven to a BASIC prompt from our bundle: with a Disk II
present and no bootable disk the machine sits in the boot loop, and no keypress
we can synthesise reaches it -- see the bezel-test README. So the card ships as
a disk instead of as a program to type.

No DOS is involved. The Disk II boot ROM reads track 0 sector 0 into $0800 and
jumps to $0801, so the card is ~26 bytes of 6502 in the boot sector: set text
mode, then fill the whole text page with inverse spaces. That paints the entire
addressable screen white, which is what a bezel check wants -- anything on
screen that is NOT white is bezel, gap or overscan, with no ambiguity.
"""
import base64, json, sys

# --- the card, assembled by hand; entry is $0801 ---------------------------
ORG = 0x0801
code = bytearray()
def emit(*b): code.extend(b)

emit(0x8D, 0x51, 0xC0)          # STA $C051   TEXT mode on
emit(0x8D, 0x54, 0xC0)          # STA $C054   text/lores page 1
loop_target = ORG + len(code) + 4        # after LDA #$20 / LDX #$00
emit(0xA9, 0x20)                # LDA #$20   inverse space = solid white cell
emit(0xA2, 0x00)                # LDX #$00
loop = ORG + len(code)
emit(0x9D, 0x00, 0x04)          # STA $0400,X
emit(0x9D, 0x00, 0x05)          # STA $0500,X
emit(0x9D, 0x00, 0x06)          # STA $0600,X
emit(0x9D, 0x00, 0x07)          # STA $0700,X
emit(0xE8)                      # INX
rel = loop - (ORG + len(code) + 2)
assert -128 <= rel <= 127
emit(0xD0, rel & 0xFF)          # BNE loop
here = ORG + len(code)
emit(0x4C, here & 0xFF, here >> 8)   # JMP *   park here

sector0 = bytearray(256)
sector0[0] = 0x01               # the boot ROM's sector count byte; code is at +1
sector0[1:1+len(code)] = code
assert len(code) < 250, len(code)

disk = {
    "name": "Bezel test card",
    "type": "do",
    "category": "Apple",
    "encoding": "base64",
    "data": [
        [base64.b64encode(bytes(sector0) if (t, s) == (0, 0) else bytes(256)).decode()
         for s in range(16)]
        for t in range(35)
    ],
}
out = sys.argv[1] if len(sys.argv) > 1 else 'bezelcard.json'
json.dump(disk, open(out, 'w'))
print("wrote %s  (%d bytes of 6502 in T0S0, entry $%04X)" % (out, len(code), ORG))
print("code:", ' '.join('%02X' % b for b in code))
