#!/usr/bin/env python3
"""Draw the text rows of docs/images/genx-social.png in the site's own font.

The card's menu rows and stats line are the prompt's CP437 sprite sheet
(systems/_shared/styles/VGA_font/f12.<colour>.png): each 12x12 glyph is
alpha-composited onto the row's background and the row is scaled to 24x36
per character, nearest-neighbour. Drawn this way the menu rows match the card
pixel for pixel, so a row is changed by editing ROWS and running this script.
The stats line's counts are measured from docs/games/, the same way
check-doc-counts.sh measures them, so the card cannot fall behind the site.
The title, subtitle, box and prompt line are artwork and are left alone.

Usage:
    python3 tools/social-card.py          # redraw any row that differs
    python3 tools/social-card.py --check  # report rows that differ; exit 1 if any
"""
import os
import sys

from PIL import Image, ImageChops

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CARD = os.path.join(ROOT, "docs/images/genx-social.png")
FONT = os.path.join(ROOT, "systems/_shared/styles/VGA_font/f12.%d.png")

MENU_BG = (8, 8, 8)
STATS_BG = (0, 0, 0)

# (text, x, y, CGA colour, background). Menu rows are 36 px apart; the left
# column's first character is at x=184 and the right column's at x=640, so
# single-digit numbers there start one character in, at 664.
ROWS = [
    ("1. Commodore 64", 184, 336, 7, MENU_BG),
    ("2. BBC Micro", 184, 372, 7, MENU_BG),
    ("3. ZX Spectrum", 184, 408, 7, MENU_BG),
    ("4. Apple ][+", 184, 444, 7, MENU_BG),
    ("5. Game Boy", 184, 480, 7, MENU_BG),
    ("6. MSX", 664, 336, 7, MENU_BG),
    ("7. Arcade (Coin-op)", 664, 372, 7, MENU_BG),
    ("8. Atari 800", 664, 408, 7, MENU_BG),
    ("9. Sega Game Gear", 664, 444, 7, MENU_BG),
    ("10. ...and many more", 640, 480, 7, MENU_BG),
]

# The right column's text may run as far as this before the box's inner border.
RIGHT_LIMIT = 1140


def render(text, colour, bg):
    sheet = Image.open(FONT % colour).convert("RGBA")
    row = Image.new("RGBA", (12 * len(text), 12), bg + (255,))
    for i, ch in enumerate(text):
        n = ord(ch)
        glyph = sheet.crop(((n % 16) * 12, (n // 16) * 12,
                            (n % 16) * 12 + 12, (n // 16) * 12 + 12))
        row.alpha_composite(glyph, (12 * i, 0))
    return row.convert("RGB").resize((24 * len(text), 36), Image.NEAREST)


def stats_row():
    games_dir = os.path.join(ROOT, "docs/games")
    systems = [d for d in os.listdir(games_dir)
               if os.path.isdir(os.path.join(games_dir, d))]
    # MS-DOS 4.00 has a page on the IBM PC shelf but is the operating system,
    # not a game. check-doc-counts.sh keeps the same list; both must agree.
    nongames = {os.path.join(ROOT, "docs/games/dos/msdos4.html")}
    games = sum(1
                for root, _, files in os.walk(games_dir)
                for f in files
                if f.endswith(".html") and os.path.join(root, f) not in nongames)
    # CP437 0xFA is the middle dot; the line is centred on the card.
    text = "%d games \xfa %d systems \xfa 100%% self-hosted" % (games, len(systems))
    x = (1280 - 24 * len(text)) // 2
    return (text, x, 556, 8, STATS_BG)


def main():
    check = "--check" in sys.argv
    card = Image.open(CARD).convert("RGB")
    changed = 0
    for text, x, y, colour, bg in ROWS + [stats_row()]:
        row = render(text, colour, bg)
        if x + row.width > RIGHT_LIMIT and x > 600:
            sys.exit("%r is too long for the right column" % text)
        box = (x, y, x + row.width, y + 36)
        if ImageChops.difference(card.crop(box), row).getbbox() is None:
            continue
        changed += 1
        print(("differs: " if check else "redrawn: ") + text.replace("\xfa", "\u00b7"))
        if not check:
            # Clear to the column's end first, so a shorter row leaves nothing behind.
            if y == 556:
                card.paste(bg, (0, y, card.width, y + 36))
            else:
                end = RIGHT_LIMIT if x > 600 else 620
                card.paste(bg, (x, y, max(end, x + row.width), y + 36))
            card.paste(row, (x, y))
    if changed and not check:
        card.save(CARD, optimize=True)
    if not changed:
        print("every row matches")
    return 1 if (check and changed) else 0


if __name__ == "__main__":
    sys.exit(main())
