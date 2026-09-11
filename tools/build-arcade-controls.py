#!/usr/bin/env python3
"""Build tools/arcade-controls.json: what each arcade cabinet's controls are,
taken from the emulator's own data rather than written by hand.

Two files published with the mame2003-plus core supply it:

  src/controls.c              per-game control labels ("Rotate Left", "Hyperspace")
  metadata/mame2003-plus.xml  each game's control type, button count, and parent

A clone with no labels of its own borrows its parent's, as the core itself does.
Both files are read at the commit pinned below, so the output only changes when
someone moves the pin on purpose. build-arcade-gamedoc.py reads the result.

  python3 tools/build-arcade-controls.py              downloads the pinned files
  python3 tools/build-arcade-controls.py --src DIR    uses controls.c and
                                                      mame2003-plus.xml from DIR
"""
import argparse, io, json, os, re, tempfile, urllib.request
import xml.etree.ElementTree as ET

REPO = 'libretro/mame2003-plus-libretro'
PIN = 'd3ac6c95f293a33b684402cf57fa56d9247d095a'      # master, 10/09/2026
FILES = {'controls.c': 'src/controls.c', 'mame2003-plus.xml': 'metadata/mame2003-plus.xml'}

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GAMES = os.path.join(ROOT, 'systems', 'arcade', 'games.json')
OUT = os.path.join(ROOT, 'tools', 'arcade-controls.json')

# One labels function per game: `const char *asteroid_get_ctrl_name(int type)`,
# a switch whose cases return the label for each input.
FUNC = re.compile(r'const char \*(\w+)_get_ctrl_name\(int type\)\s*\{(.*?)\n\}', re.S)
CASE = re.compile(r'case\s+\(?([A-Z0-9_+ ]+?)\)?\s*:\s*return\s+(?:BTN\d\s*)?"([^"]*)"')


def fetch(src):
    if src:
        return {name: os.path.join(src, name) for name in FILES}
    tmp = tempfile.mkdtemp(prefix='mame2003plus-')
    paths = {}
    for name, path in FILES.items():
        url = f'https://raw.githubusercontent.com/{REPO}/{PIN}/{path}'
        paths[name] = os.path.join(tmp, name)
        print(f'fetching {path} @ {PIN[:10]}')
        urllib.request.urlretrieve(url, paths[name])
    return paths


def main():
    ap = argparse.ArgumentParser(description=__doc__.split('\n\n')[0])
    ap.add_argument('--src', help='directory holding controls.c and mame2003-plus.xml')
    paths = fetch(ap.parse_args().src)

    games = json.load(open(GAMES))
    src = io.open(paths['controls.c'], encoding='utf-8', errors='replace').read()
    labels = {m.group(1): {c.group(1).strip(): c.group(2) for c in CASE.finditer(m.group(2))}
              for m in FUNC.finditer(src)}

    meta = {}
    for g in ET.parse(paths['mame2003-plus.xml']).getroot():
        if g.get('name') in games:
            inp = g.find('input')
            meta[g.get('name')] = {
                'cloneof': g.get('cloneof'),
                'control': (inp.get('control') if inp is not None else None) or 'unlisted',
                'buttons': int((inp.get('buttons') if inp is not None else None) or 0),
            }

    missing = sorted(set(games) - set(meta))
    if missing:
        raise SystemExit(f'not in the core\'s metadata: {missing}')

    out = {}
    for key in sorted(games):
        m = meta[key]
        if key in labels:
            lab, frm = labels[key], 'own'
        elif m['cloneof'] and m['cloneof'] in labels:
            lab, frm = labels[m['cloneof']], 'parent ' + m['cloneof']
        else:
            lab, frm = {}, 'none'
        out[key] = {'control': m['control'], 'buttons': m['buttons'],
                    'labels_from': frm, 'labels': lab}

    with open(OUT, 'w') as f:
        json.dump({'source': f'https://github.com/{REPO}/tree/{PIN}', 'games': out},
                  f, indent=1, sort_keys=False)
        f.write('\n')
    named = sum(1 for v in out.values() if v['labels'])
    print(f'wrote {os.path.relpath(OUT, ROOT)}: {len(out)} games, {named} with the core\'s own labels')


if __name__ == '__main__':
    main()
