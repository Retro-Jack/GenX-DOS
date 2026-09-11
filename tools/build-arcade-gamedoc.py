"""Render one arcade gamedoc from the emulator's own data plus written copy.

Controls are never hand-written: the button labels come from the core's control
data (tools/arcade-controls.json, built by build-arcade-controls.py), tidied by
arcade-labels.py, and the movement row is built from the same source so a
two-way cabinet is not described as an 8-way stick. Copy — the one-line sub,
the intro, scoring and strategy — is written per game.

  python3 tools/build-arcade-gamedoc.py              check all 100 pages
  python3 tools/build-arcade-gamedoc.py KEY ...      check just these
  add --write to rewrite the pages instead of checking them

Run from the command line, it takes each page's copy from the page as it stands
and regenerates everything else around it, so a change to the control data or
to this template reaches every page without the copy being retyped. Pages whose
controls were corrected by hand are listed, with the reason, in
tools/arcade-gamedoc-overrides.json, and keep those blocks as written.
"""
import html, io, json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__)) if '__file__' in dir() else 'tools'
exec(open(os.path.join(HERE, 'arcade-labels.py')).read())      # provides tidy()

PAD = {'IPT_BUTTON1': ('A', 'Z'), 'IPT_BUTTON2': ('RB', 'X'), 'IPT_BUTTON3': ('X', 'V'),
       'IPT_BUTTON4': ('Y', 'A'), 'IPT_BUTTON5': ('B', 'C'), 'IPT_BUTTON6': ('LB', 'S')}
LR = '<kbd>&larr;</kbd> <kbd>&rarr;</kbd>'
ALL = '<kbd>&larr;</kbd> <kbd>&rarr;</kbd> <kbd>&uarr;</kbd> <kbd>&darr;</kbd>'
GENERIC = {'joy8way': 'Move (8-way)', 'joy4way': 'Move (4-way)', 'unlisted': 'Move'}
ANALOGUE = {'trackball': 'a trackball', 'dial': 'a spinner', 'paddle': 'a paddle',
            'stick': 'an analogue stick', 'lightgun': 'a light gun'}


def _row(pad, keys, act):
    return f'      <tr><td>{pad}</td><td>{keys}</td><td>{act}</td></tr>'


def control_rows(key, labels, control):
    """Movement first, then whichever buttons this cabinet actually has."""
    d = {a: b for a, b in labels.items() if 'BUTTON' not in a}
    rows = []
    # Twin-stick has to be detected from the metadata as well as the labels:
    # Splat! is a doublejoy cabinet the core never names, so keying off the
    # labels alone silently gave it one D-pad row and lost its second stick.
    if control.startswith('doublejoy') or any('JOYSTICKLEFT' in a for a in d):
        def lab(k, alt): return d.get(k, alt)
        rows.append(_row('Left stick', ALL,
                         ' / '.join(dict.fromkeys([lab('IPT_JOYSTICKLEFT_UP', 'Up'), lab('IPT_JOYSTICKLEFT_DOWN', 'Down'),
                                                   lab('IPT_JOYSTICKLEFT_LEFT', 'Left'), lab('IPT_JOYSTICKLEFT_RIGHT', 'Right')]))))
        rows.append(_row('Right stick', '<kbd>J</kbd> <kbd>L</kbd> <kbd>I</kbd> <kbd>K</kbd>',
                         ' / '.join(dict.fromkeys([lab('IPT_JOYSTICKRIGHT_UP', 'Up'), lab('IPT_JOYSTICKRIGHT_DOWN', 'Down'),
                                                   lab('IPT_JOYSTICKRIGHT_LEFT', 'Left'), lab('IPT_JOYSTICKRIGHT_RIGHT', 'Right')]))))
    else:
        axes = [a for a in d if a.startswith(('IPT_TRACKBALL', 'IPT_AD_STICK', 'IPT_DIAL', 'IPT_PADDLE'))]
        if axes:
            has_y = any('_Y' in a for a in axes)
            xl = next((d[a] for a in axes if a.endswith('_X') or a == 'IPT_DIAL' or a == 'IPT_PADDLE'), 'Left')
            xr = next((d[a] for a in axes if 'EXTENSION' in a and ('_X' in a or 'DIAL' in a or 'PADDLE' in a)), 'Right')
            act = f'{xl} / {xr}'
            if has_y:
                yu = next((d[a] for a in axes if a.endswith('_Y')), 'Up')
                yd = next((d[a] for a in axes if 'EXTENSION' in a and '_Y' in a), 'Down')
                act = f'{xl} / {xr} / {yu} / {yd}'
            rows.append(_row('D-pad, or the left stick', ALL if has_y else LR, act))
        elif 'IPT_JOYSTICK_LEFT' in d and 'IPT_JOYSTICK_UP' not in d:
            rows.append(_row('D-pad, or the left stick', LR, f"{d['IPT_JOYSTICK_LEFT']} / {d['IPT_JOYSTICK_RIGHT']}"))
        else:
            rows.append(_row('D-pad, or the left stick', ALL, GENERIC.get(control, 'Move')))
    for ipt in ['IPT_BUTTON1', 'IPT_BUTTON2', 'IPT_BUTTON3', 'IPT_BUTTON4', 'IPT_BUTTON5', 'IPT_BUTTON6']:
        if ipt not in labels:
            continue
        good = tidy(labels[ipt].strip())
        if good is None:                    # the core marks it unused or unnamed
            continue
        pad, k = PAD[ipt]
        # tidy() may hand back an entity (&mdash;); escape the text, not that.
        rows.append(_row(pad, f'<kbd>{k}</kbd>', re.sub(r'&amp;(#?\w+;)', r'&\1', html.escape(good, quote=False))))
    return rows


def page(key, game, labels, control, buttons, sub, intro, extra_start=None,
         scoring='', strategy=''):
    title = game['title'].rsplit(' (', 1)[0]
    year_mk = game['title'].rsplit('(', 1)[1].rstrip(')')
    rows = control_rows(key, labels, control)
    named = len([r for r in rows if '<kbd>Z</kbd>' in r or '<kbd>X</kbd>' in r or '<kbd>V</kbd>' in r
                 or '<kbd>A</kbd>' in r or '<kbd>C</kbd>' in r or '<kbd>S</kbd>' in r])
    if not labels and buttons == 0:
        what = 'two sticks' if control.startswith('doublejoy') else ANALOGUE.get(control, 'the stick')
        note = ('<p class="note-plain">No buttons at all &mdash; the control panel was '
                f'{what} and nothing else.</p>')
    elif not labels:
        note = (f'<p class="note-plain">This cabinet used {buttons} button'
                f'{"s" if buttons != 1 else ""}. The emulator does not name them for this machine, '
                'so they are listed by number.</p>')
        for i, ipt in enumerate(['IPT_BUTTON1', 'IPT_BUTTON2', 'IPT_BUTTON3',
                                 'IPT_BUTTON4', 'IPT_BUTTON5', 'IPT_BUTTON6'][:buttons]):
            pad, k = PAD[ipt]
            rows.append(_row(pad, f'<kbd>{k}</kbd>', f'Button {i + 1}'))
    elif buttons == 0:
        what = ('two sticks' if any('JOYSTICKLEFT' in a for a in labels)
                else ANALOGUE.get(control, 'the stick'))
        note = ('<p class="note-plain">No buttons at all &mdash; the control panel was '
                f'{what} and nothing else.</p>')
    else:
        # Just the count. What the buttons do is the table directly below, and
        # a line saying the others do nothing tells the reader what the absence
        # of a row already told them.
        note = (f'<p class="note-plain">This cabinet used {buttons} button'
                f'{"s" if buttons != 1 else ""}.</p>')
    steps = ['      <li>Insert a coin &mdash; the coin slot at the top left, or <kbd>5</kbd>.</li>',
             '      <li>Press 1 player start &mdash; the 1P button, or <kbd>1</kbd>.</li>']
    if control in ANALOGUE:
        steps.append(f'      <li>The real cabinet used {ANALOGUE[control]}, so <strong>hold</strong> a '
                     'direction rather than tapping it &mdash; a tap is often too brief to register.</li>')
    if extra_start:
        steps.append(f'      <li>{extra_start}</li>')
    return f'''<!doctype html>
<html lang="en">
<head>
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src 'self'; style-src 'self'; font-src 'self'; base-uri 'none'; form-action 'none'">
  <meta charset="utf-8"><link rel="shortcut icon" href="../../../systems/_shared/favicon.ico"><link rel="icon" type="image/gif" href="../../../systems/_shared/animated_favicon1.gif">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{html.escape(title)} &mdash; Arcade &mdash; GenX-DOS</title>
  <link rel="stylesheet" href="../../../styles/genx-doc.css">
</head>
<body>
  <a class="gx-home" href="../../../">&#8617;&nbsp;<b>GenX&#8209;DOS</b></a>
  <div class="wrap">
    <div class="head">
      <div class="system">Arcade &middot; {html.escape(year_mk)}</div>
      <h1>{html.escape(title)}</h1>
      <p class="sub">{sub}</p>
    </div>

    <p class="gx-crosslink"><a href="../../../systems/arcade/controls.html">System help &mdash; the arcade controls</a></p>

    <p class="intro">{intro}</p>

    <h2>Getting started</h2>
    <ol>
{chr(10).join(steps)}
    </ol>

    <h2>Controls</h2>
    {note}
    <table>
      <tr><th>Gamepad</th><th>Keyboard</th><th>Action</th></tr>
{chr(10).join(rows)}
    </table>

{scoring}{strategy}    <h2>Arcade controls</h2>
    <p>Coin on <kbd>5</kbd>, start on <kbd>1</kbd>, and the six cabinet buttons on
      <kbd>Z</kbd> <kbd>X</kbd> <kbd>C</kbd> <kbd>V</kbd> <kbd>A</kbd> <kbd>S</kbd>.
      The <a href="../../../systems/arcade/controls.html">arcade controls page</a> covers the panel in full.</p>
    <div class="footer">
      part of <a href="https://genx-dos.fun/" target="_blank" rel="noopener">GenX-DOS</a> ·
      <a href="../../wiki/Your-Data.html" target="_blank" rel="noopener">your data</a> ·
      <a href="../../wiki/ATTRIBUTION.html#removal-upon-request" target="_blank" rel="noopener">removal upon request</a>
    </div>
  </div>
</body>
</html>
'''


# ---- command line: regenerate pages around the copy they already carry ------

ROOT = os.path.dirname(HERE)
STD_STEPS = ('Insert a coin', 'Press 1 player start', 'The real cabinet used')


def copy_from(page_html):
    """The written parts of an existing page: everything this script cannot derive."""
    def one(pattern):
        m = re.search(pattern, page_html, re.S)
        return m.group(1) if m else ''
    steps = re.findall(r'      <li>(.*?)</li>', one(r'<ol>\n(.*?)\n    </ol>'), re.S)
    extra = [s for s in steps if not s.startswith(STD_STEPS)]
    return {'sub': one(r'<p class="sub">(.*?)</p>'),
            'intro': one(r'<p class="intro">(.*?)</p>'),
            'extra_start': extra[-1] if extra else None,
            # Everything between the Controls table and the closing section:
            # scoring, strategy, and on a few pages a note hung off the table.
            'rest': one(r'<h2>Controls</h2>.*?\n    </table>\n(.*?)    <h2>Arcade controls</h2>')}


def main(argv):
    write = '--write' in argv
    keys = [a for a in argv if not a.startswith('--')]
    games = json.load(open(os.path.join(ROOT, 'systems', 'arcade', 'games.json')))
    data = json.load(open(os.path.join(HERE, 'arcade-controls.json')))['games']
    # Pages set by hand after generation: their steps / Controls block are kept
    # verbatim, each with the reason it differs from what the data would give.
    overrides = json.load(open(os.path.join(HERE, 'arcade-gamedoc-overrides.json')))['games']
    differ = []
    for key in keys or sorted(games):
        path = os.path.join(ROOT, 'docs', 'games', 'arcade', key + '.html')
        old = io.open(path, encoding='utf-8').read()
        c = copy_from(old)
        d = data[key]
        rest = c['rest']
        new = page(key, games[key], d['labels'], d['control'], d['buttons'],
                   c['sub'], c['intro'], c['extra_start'], scoring=rest[1:] if rest.startswith('\n') else rest)
        if not rest.startswith('\n'):      # a note sits directly under the table
            new = new.replace('    </table>\n\n' + rest, '    </table>\n' + rest, 1)
        o = overrides.get(key, {})
        if 'steps' in o:
            new = re.sub(r'(    <ol>\n).*?(\n    </ol>)', lambda m: m.group(1) + o['steps'] + m.group(2), new, count=1, flags=re.S)
        if 'controls' in o:
            new = re.sub(r'(    <h2>Controls</h2>\n).*?\n    </table>', lambda m: m.group(1) + o['controls'], new, count=1, flags=re.S)
        if new != old:
            differ.append(key)
            if write:
                io.open(path, 'w', encoding='utf-8').write(new)
    done = 'rewrote' if write else 'differ from what the data would generate'
    print(f'{len(differ)} of {len(keys or games)} pages {done}' + (f': {" ".join(differ)}' if differ else ''))
    return 1 if differ and not write else 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
