#!/usr/bin/env python3
"""
Generate f12.0.png – f12.15.png from f12.7.png.

Each file is a recoloured copy of the base sprite sheet, one per CGA palette
colour. The alpha channel is preserved so anti-aliasing and transparency work
correctly in the browser. f12.7.png (light grey) is skipped — it already
exists and is the source.

Usage:
    python3 make_fonts.py
"""

from PIL import Image
import os

# CGA 16-colour palette (indices 0–15)
PALETTE = [
    (0x00, 0x00, 0x00),  #  0  Black
    (0x00, 0x00, 0xaa),  #  1  Blue
    (0x00, 0xaa, 0x00),  #  2  Green
    (0x00, 0xaa, 0xaa),  #  3  Cyan
    (0xaa, 0x00, 0x00),  #  4  Red
    (0xaa, 0x00, 0xaa),  #  5  Magenta
    (0xaa, 0x55, 0x00),  #  6  Brown
    (0xaa, 0xaa, 0xaa),  #  7  Light Grey  ← source, skip
    (0x55, 0x55, 0x55),  #  8  Dark Grey
    (0x55, 0x55, 0xff),  #  9  Bright Blue
    (0x55, 0xff, 0x55),  # 10  Bright Green
    (0x55, 0xff, 0xff),  # 11  Bright Cyan
    (0xff, 0x55, 0x55),  # 12  Bright Red
    (0xff, 0x55, 0xff),  # 13  Bright Magenta
    (0xff, 0xff, 0x55),  # 14  Yellow
    (0xff, 0xff, 0xff),  # 15  White
]

img_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'prompt', 'img')
source_path = os.path.join(img_dir, 'f12.7.png')

src = Image.open(source_path).convert('RGBA')
r_src, g_src, b_src, alpha = src.split()

for idx, (r, g, b) in enumerate(PALETTE):
    if idx == 7:
        print('f12.7.png  skipped (source)')
        continue

    flat = Image.new('RGBA', src.size, (r, g, b, 0))
    flat.putalpha(alpha)

    out_path = os.path.join(img_dir, f'f12.{idx}.png')
    flat.save(out_path)
    print(f'f12.{idx}.png   #{r:02x}{g:02x}{b:02x}')

print('\nDone.')
