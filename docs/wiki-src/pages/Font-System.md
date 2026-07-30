We don't use a webfont. Every character on screen is its own `<div>`, and CSS picks a 12×12 region of a sprite sheet to show the right glyph. This is more work than a single `<canvas>` would be, but it means each character can carry its own attributes (palette index, original value for command-line scanning, classnames for blinking cursor offset), which makes the terminal logic far simpler.

## The sprite sheets

```
systems/_shared/styles/VGA_font/f12.7.png         master  (light grey on transparent)
systems/_shared/styles/VGA_font/f12.<0..15>.png   per-CGA-colour variants
```

Each sheet is 192×192 px — a 16×16 grid of 12×12 px CP437 glyphs, indexed by character code 0–255.

## How the CSS gets generated

`goFontGo()` runs once on page load and builds one CSS rule per code:

```css
.f-65 { background-position: -12px -48px; }   /* 'A' (index 65) */
```

plus two utility classes:

| Class | Purpose |
|-------|---------|
| `.f-n` | zero-width newline marker (used to count visible rows) |
| `.f-cursor` | slight negative margin so the blinking cursor sits flush |

## What a rendered character looks like

```html
<div class="font f-65"
     style="background-color:#000000; background-image:url(../systems/_shared/styles/VGA_font/f12.7.png)"
     v="A"></div>
```

| Attribute | Role |
|-----------|------|
| `class="font"` | size + float |
| `class="f-65"` | background-position (which glyph) |
| `style="background-color:..."` | active palette background |
| `style="background-image:..."` | which `f12.<N>.png` for the fg colour |
| `v="A"` | raw character value (read back when scanning the command line) |

The `v=` attribute is the cheat code: when the user types and the prompt needs to know "what's at the cursor's previous position", it reads `v=` directly off the div. No buffered string state to keep in sync with the visual.

## The palette

Active colours live in `txtPal = { bg, fg }` (indices into the table below). Change them with `setcol <bg><fg>` — e.g. `setcol 02` is black on green.

| Index | Hex |
|-------|-----|
| 0  Black        | `#000000` |
| 1  Dark Blue    | `#0000aa` |
| 2  Dark Green   | `#00aa00` |
| 3  Dark Cyan    | `#00aaaa` |
| 4  Dark Red     | `#aa0000` |
| 5  Dark Magenta | `#aa00aa` |
| 6  Brown        | `#aa5500` |
| 7  Light Grey   | `#aaaaaa` |
| 8  Dark Grey    | `#555555` |
| 9  Blue         | `#5555ff` |
| 10 Green        | `#55ff55` |
| 11 Cyan         | `#55ffff` |
| 12 Red          | `#ff5555` |
| 13 Magenta      | `#ff55ff` |
| 14 Yellow       | `#ffff55` |
| 15 White        | `#ffffff` |

## Regenerating colour variants

`make_fonts.py` (in `systems/_shared/styles/VGA_font/`, beside the sheets) takes `f12.7.png` and writes the other 15 variants by re-tinting the alpha channel. Run it after editing the master sheet.
