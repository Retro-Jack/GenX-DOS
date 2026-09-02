#!/usr/bin/env python3
"""Build an Apple I bezel test card as an apple1js tape.

The Apple I has no framebuffer and no inverse video: the display is a 40x24
uppercase-only terminal you can only print to. So the card cannot be a solid
white field like the Apple ][ one. The densest thing available is a screenful
of a single glyph, which still marks the addressable area exactly -- which is
what the bezel check needs.

Loaded and run straight from the Woz Monitor; no BASIC, nothing to source.
The program prints 30 rows of 40 characters, more than one screenful, so the
display is completely covered however far down the monitor's own output has
already pushed the cursor.
"""
import sys

ORG = 0x0300
CHAR = 0xC0          # '@' with the high bit set, as the Apple I display wants
ECHO = 0xFFEF        # Woz Monitor's character-out routine

code = bytearray()
def emit(*b): code.extend(b)

emit(0xA2, 30)                       # LDX #30      rows
row = ORG + len(code)
emit(0xA0, 40)                       # LDY #40      columns
col = ORG + len(code)
emit(0xA9, CHAR)                     # LDA #$C0
emit(0x20, ECHO & 0xFF, ECHO >> 8)   # JSR $FFEF
emit(0x88)                           # DEY
emit(0xD0, (col - (ORG + len(code) + 2)) & 0xFF)   # BNE col
emit(0xCA)                           # DEX
emit(0xD0, (row - (ORG + len(code) + 2)) & 0xFF)   # BNE row
here = ORG + len(code)
emit(0x4C, here & 0xFF, here >> 8)   # JMP *  park

end = ORG + len(code) - 1
script = 'C100R\\n%04X.%04XR\\n%04XR\\n' % (ORG, end, ORG)

rows = []
for i in range(0, len(code), 8):
    rows.append('        ' + ' '.join('0x%02X,' % b for b in code[i:i+8]))
js = ("/*\n%s*/\n\ntapes['Bezel test card'] = {\n"
      "    script: '%s',\n    tracks: [[ // %04X.%04X\n%s\n    ]]\n};\n") % (
      script.replace('\\n', '\n'), script, ORG, end, '\n'.join(rows))

out = sys.argv[1] if len(sys.argv) > 1 else 'bezelcard.js'
open(out, 'w').write(js)
print("wrote %s  (%d bytes of 6502 at $%04X)" % (out, len(code), ORG))
print("script:", script.replace('\\n', ' / '))
print("code  :", ' '.join('%02X' % b for b in code))
