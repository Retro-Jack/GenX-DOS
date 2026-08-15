#!/usr/bin/env python3
"""Build the self-hosted GenX-DOS wiki: docs/wiki-src/pages/*.md -> docs/wiki/*.html,
styled in the site's landing-page design language, fully relative-linked (so it
travels to any host). Regenerate:  python3 docs/wiki-src/build.py
Source of truth is the markdown in pages/ (mirrored from the old GitHub wiki)."""
import os, re, sys, unicodedata, html
import markdown

HERE = os.path.dirname(os.path.abspath(__file__))
SRC  = os.path.join(HERE, 'pages')
OUT  = os.path.normpath(os.path.join(HERE, '..', 'wiki'))
os.makedirs(OUT, exist_ok=True)

PAGES = sorted(f[:-3] for f in os.listdir(SRC) if f.endswith('.md'))
ROOT = os.path.normpath(os.path.join(HERE, '..', '..'))
# Root docs imported into the wiki as pages — single source, read from the repo root.
# slug -> (path, kind); kind 'md' renders through markdown, 'text' is preformatted.
EXTRA = {'README':          (os.path.join(ROOT, 'README.md'),          'md'),
         'ATTRIBUTION':     (os.path.join(ROOT, 'ATTRIBUTION.md'),     'md'),
         'CHANGELOG':       (os.path.join(ROOT, 'CHANGELOG.md'),       'md'),
         'CONTRIBUTING':    (os.path.join(ROOT, 'CONTRIBUTING.md'),    'md'),
         'SECURITY':        (os.path.join(ROOT, 'SECURITY.md'),        'md'),
         'CODE_OF_CONDUCT': (os.path.join(ROOT, 'CODE_OF_CONDUCT.md'), 'md'),
         'LICENSE':         (os.path.join(ROOT, 'LICENSE.TXT'),        'license')}
# Map a repo-root filename to its imported slug (LICENSE.TXT -> LICENSE, X.md -> X).
FILE2SLUG = {'LICENSE.TXT': 'LICENSE'}
def file2slug(fname):
    return FILE2SLUG.get(fname, fname[:-3] if fname.endswith('.md') else fname)
KNOWN = set(PAGES) | set(EXTRA)          # valid link targets (slugs)
PAGES_BASE = 'https://retro-jack.github.io/GenX-DOS/'   # -> ../../ (repo root)
SITE_BASE  = 'https://genx-dos.fun/'                    # the site's own domain, same rewrite
GH = 'https://github.com/Retro-Jack/GenX-DOS/'          # github repo/wiki base

def out_name(slug):                       # slug -> output filename
    return 'index.html' if slug == 'Home' else slug + '.html'

def gh_slugify(value, sep):               # GitHub-compatible heading anchors
    v = unicodedata.normalize('NFKD', value).lower()
    v = re.sub(r'[^\w\s-]', '', v).strip()
    return re.sub(r'\s', '-', v)

def _local(page, frag):
    return out_name(page) + (('#' + gh_slugify(frag, '-')) if frag else '')
def resolve(target):
    """Rewrite a link target to a relative wiki/site URL. Returns (url, dead?)."""
    t = target.strip()
    # GitHub wiki links -> local wiki pages
    if t in (GH + 'wiki', GH + 'wiki/'):
        return 'index.html', False
    if t.startswith(GH + 'wiki/'):
        page, _, frag = t[len(GH + 'wiki/'):].partition('#')
        return _local(page, frag), False
    # GitHub blob of an imported doc -> local page; other repo files -> repo-root
    if t.startswith(GH + 'blob/'):
        rest = t.split('/blob/', 1)[1].split('/', 1)[1]
        stem = file2slug(rest)
        return (stem + '.html', False) if stem in EXTRA else ('../../' + rest, False)
    for base in (PAGES_BASE, SITE_BASE):
        if t.startswith(base):
            return '../../' + t[len(base):], False
    # bare repo-root files (README.md / ATTRIBUTION.md / CHANGELOG.md / LICENSE.TXT)
    if '/' not in t and (t.endswith('.md') or t == 'LICENSE.TXT'):
        stem = file2slug(t)
        if stem in EXTRA: return stem + '.html', False
        if stem in KNOWN: return out_name(stem), False
        return '../../' + t, False
    if re.match(r'^(https?:)?//', t) or t.startswith('mailto:') or t.startswith('/') \
       or t.startswith('../') or t.startswith('#'):
        return t, False
    page, _, frag = t.partition('#')
    dead = page not in KNOWN and page != 'Home'
    return _local(page, frag), dead

# ---- markdown engine (GitHub-style heading ids so #anchors resolve) ----
def make_md():
    return markdown.Markdown(
        extensions=['tables', 'fenced_code', 'sane_lists', 'toc'],
        extension_configs={'toc': {'slugify': gh_slugify, 'permalink': False}})

WIKILINK = re.compile(r'\[\[([^\]]+)\]\]')
def pre_wikilinks(text):
    # [[Page Name]] -> [Page Name](Page-Name); [[Target|Display]] -> [Display](Target)
    # (this wiki writes the target slug first, then the display text). Spaces->hyphens.
    def sub(m):
        inner = m.group(1)
        target, disp = (inner.split('|', 1) if '|' in inner else (inner, inner))
        return '[%s](%s)' % (disp.strip(), target.strip().replace(' ', '-'))
    return WIKILINK.sub(sub, text)

HREF = re.compile(r'href="([^"]+)"')
def rewrite_hrefs(htmltext, dead_sink):
    def sub(m):
        url, dead = resolve(m.group(1))
        if dead:
            dead_sink.add(m.group(1))
        return 'href="%s"' % url
    return HREF.sub(sub, htmltext)

IMG = re.compile(r'<img\b[^>]*>')
def rewrite_imgs(h):
    def sub(m):
        tag = m.group(0); sm = re.search(r'src="([^"]+)"', tag)
        if not sm: return tag
        src = sm.group(1)
        if re.match(r'https?:', src):                 # external (badges) -> no-network: use alt text
            am = re.search(r'alt="([^"]*)"', tag); return am.group(1) if am else ''
        new = '../' + src[len('docs/'):] if src.startswith('docs/') else src
        return tag.replace('src="%s"' % src, 'src="%s"' % new)
    return IMG.sub(sub, h)

def first_h1(md_text):
    for line in md_text.splitlines():
        if line.startswith('# '):
            return line[2:].strip()
    return None

# ---- plain-text LICENSE.TXT -> design-language markdown (drop the ASCII banners) ----
def _is_rule(s):
    s = s.strip()
    return bool(s) and set(s) <= {'=', '-'}
def _caps_ratio(text):
    letters = [c for c in text if c.isalpha()]
    return sum(c.isupper() for c in letters) / len(letters) if letters else 0.0
def license_to_md(raw):
    lines = [ln.rstrip() for ln in raw.splitlines()]
    n = len(lines)
    out, para = ['# License'], []
    def flush_para():
        if not para: return
        text = ' '.join(x.strip() for x in para).strip(); para.clear()
        if not text: return
        text = re.sub(r'(https?://\S+)', r'[\1](\1)', text)
        out.append(('> ' + text) if _caps_ratio(text) > 0.9 and len(text) > 80 else text)
    i = 0
    while i < n and (_is_rule(lines[i]) or not lines[i].strip() or lines[i].strip() == 'LICENSE'):
        i += 1
    while i < n and lines[i].strip() and ':' in lines[i] and not _is_rule(lines[i]):  # metadata
        k, _, v = lines[i].partition(':'); meta = [k.strip(), v.strip()]; i += 1
        while i < n and lines[i].startswith(' ') and lines[i].strip() and ':' not in lines[i]:
            meta[1] += ' ' + lines[i].strip(); i += 1
        out.append('- **%s:** %s' % (meta[0], meta[1]))
    while i < n:
        ln = lines[i]; s = ln.strip()
        if _is_rule(s) or not s:
            flush_para(); i += 1; continue
        nxt = lines[i + 1].strip() if i + 1 < n else ''
        if re.match(r"^[A-Z0-9 &.'\"-]+$", s) and re.search('[A-Z]', s) and len(s) <= 45 and nxt == '':
            flush_para(); out.append('## ' + s); i += 1; continue
        if s.startswith('* '):
            flush_para(); out.append('- ' + s[2:].strip()); i += 1; continue
        m = re.match(r'^(\d+)\.\s+([A-Z][A-Z -]+):\s*$', s)     # numbered obligation
        if m:
            flush_para(); i += 1; body = []
            while i < n and lines[i].strip() and not _is_rule(lines[i]):
                body.append(lines[i].strip()); i += 1
            name = m.group(2).title().replace('Non-Commercial', 'Non-commercial')
            out.append('**%s. %s.** %s' % (m.group(1), name, ' '.join(body)))
            continue
        para.append(ln); i += 1
    flush_para()
    return '\n\n'.join(out)

# ---- sidebar nav from _Sidebar.md ----
def build_nav(active_slug):
    lines = open(os.path.join(HERE, '_Sidebar.md')).read().splitlines()
    out, cur = [], []
    def flush():
        if cur:
            out.append('<ul>' + ''.join(cur) + '</ul>'); cur.clear()
    link_re = re.compile(r'-\s*\[([^\]]+)\]\(([^)]+)\)')
    for ln in lines:
        s = ln.strip()
        if s.startswith('### '):
            flush(); out.append('<div class="grp">%s</div>' % html.escape(s[4:]))
        elif s.startswith('**') and s.endswith('**'):
            flush(); out.append('<div class="grp">%s</div>' % html.escape(s[2:-2]))
        elif s.startswith('-') and '[' in s:
            m = link_re.search(s)
            if not m: continue
            text, target = m.group(1), m.group(2)
            url, _ = resolve(target)
            active = ' class="active"' if url == out_name(active_slug) else ''
            cur.append('<li><a href="%s"%s>%s</a></li>' % (url, active, html.escape(text)))
    flush()
    return '\n'.join(out)

TEMPLATE = '''<!doctype html>
<html lang="en">
<head>
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src 'self'; style-src 'self'; font-src 'self'; base-uri 'none'; form-action 'none'">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title} — GenX-DOS Wiki</title>
<link rel="shortcut icon" href="../../systems/_shared/favicon.ico">
<link rel="icon" type="image/gif" href="../../systems/_shared/animated_favicon1.gif">
<link rel="stylesheet" href="../../styles/genx.css">
<link rel="stylesheet" href="../../styles/wiki.css">
</head>
<body>
<header class="top">
  <a class="brand" href="index.html">GenX&#8209;DOS<span class="w">WIKI</span></a>
  <span class="out"><a href="../../prompt/">Prompt</a><a href="../article/">Article</a><a href="../../">&#8617;&nbsp;Site</a></span>
</header>
<div class="layout">
  <nav class="side">
{nav}
  </nav>
  <main class="content">
{content}
  </main>
</div>
<footer class="foot">
  <p>GenX&#8209;DOS Wiki &middot; part of the <a href="../../">GenX&#8209;DOS</a> project &middot; regenerated from markdown.</p>
</footer>
</body>
</html>
'''

def main():
    dead_all = {}
    jobs = [(slug, os.path.join(SRC, slug + '.md'), 'md') for slug in PAGES]
    jobs += [(slug, path, kind) for slug, (path, kind) in sorted(EXTRA.items())]
    for slug, path, kind in jobs:
        raw = open(path).read()
        dead = set()
        if kind == 'license':                      # plain-text LICENSE.TXT -> styled markdown
            raw = license_to_md(raw)
        title = first_h1(raw) or slug.replace('-', ' ')
        md = make_md()
        body = md.convert(pre_wikilinks(raw))
        body = rewrite_imgs(body)
        body = rewrite_hrefs(body, dead)
        if dead: dead_all[slug] = dead
        page = TEMPLATE.format(title=html.escape(title),
                               nav=build_nav(slug),
                               content=body)
        open(os.path.join(OUT, out_name(slug)), 'w').write(page)
    open(os.path.normpath(os.path.join(HERE, '..', '..', 'styles', 'wiki.css')), 'w').write(CSS)
    print('wrote %d html pages + wiki.css to %s' % (len(jobs), OUT))
    if dead_all:
        print('DEAD LINKS:')
        for s, d in dead_all.items(): print('  ', s, '->', sorted(d))
    else:
        print('no dead internal links')

CSS = r'''/* GenX-DOS wiki — landing-page design language (dark CRT terminal).
   Generated by docs/wiki-src/build.py — edit there, not here. */
/* fonts + palette come from ../assets/genx.css (linked before this file) */
*{box-sizing:border-box;margin:0;padding:0}
html{background:var(--crt);scroll-behavior:smooth}
body{background:var(--crt);color:var(--paper);font-family:'IBM Plex Serif',Georgia,serif;
  font-size:1.02rem;line-height:1.62;-webkit-font-smoothing:antialiased}
a{color:var(--cyan);text-decoration:none;border-bottom:1px solid rgba(75,196,214,.35)}
a:hover{color:#8fe3ef;border-bottom-color:var(--cyan)}
a:focus-visible{outline:2px solid var(--cyan);outline-offset:2px}

.top{position:sticky;top:0;z-index:10;display:flex;justify-content:space-between;align-items:center;gap:1rem;
  padding:.7rem 1.4rem;background:rgba(11,13,16,.9);backdrop-filter:blur(6px);
  border-bottom:1px solid var(--line);
  font-family:'IBM Plex Mono',monospace;font-size:.72rem;letter-spacing:.14em;text-transform:uppercase}
.top .brand{font-family:'Michroma',sans-serif;color:var(--amber);letter-spacing:.2em;border:0;font-size:.82rem}
.top .brand .w{color:var(--green);margin-left:.55rem;font-size:.62rem;letter-spacing:.25em}
.top .out{display:flex;gap:1.3rem}
.top .out a{color:var(--dim);border:0}
.top .out a:hover{color:var(--amber)}

.layout{display:flex;max-width:1180px;margin:0 auto;align-items:flex-start}
.side{position:sticky;top:49px;flex:0 0 248px;align-self:flex-start;max-height:calc(100dvh - 49px);overflow-y:auto;
  padding:1.9rem 1.2rem 3rem;border-right:1px solid var(--line);font-family:'IBM Plex Mono',monospace}
.side .grp{font-size:.66rem;letter-spacing:.2em;text-transform:uppercase;color:var(--green);margin:1.6rem 0 .55rem}
.side .grp:first-child{margin-top:0}
.side ul{list-style:none;margin:0}
.side li{margin:.12rem 0}
.side a{display:block;padding:.3rem .55rem;border-radius:4px;color:var(--paper);border:0;
  font-size:.79rem;letter-spacing:.01em;line-height:1.35}
.side a:hover{background:var(--panel);color:var(--amber)}
.side a.active{background:var(--panel);color:var(--amber);box-shadow:inset 2px 0 0 var(--amber)}

.content{flex:1 1 auto;min-width:0;max-width:820px;padding:2.5rem 2.6rem 4.5rem}
.content h1{font-family:'Michroma',sans-serif;font-weight:400;color:var(--amber);
  font-size:clamp(1.5rem,3.4vw,2.05rem);line-height:1.16;letter-spacing:.01em;
  margin:0 0 1.5rem;padding-bottom:1rem;border-bottom:1px solid var(--line)}
.content h2{font-family:'Michroma',sans-serif;font-weight:400;color:var(--amber);font-size:1rem;
  letter-spacing:.06em;text-transform:uppercase;display:flex;align-items:center;gap:1rem;margin:2.5rem 0 1rem}
.content h2::after{content:"";flex:1;height:1px;background:var(--line)}
.content h3{font-family:'Michroma',sans-serif;font-weight:400;color:var(--green);font-size:.85rem;
  letter-spacing:.05em;text-transform:uppercase;margin:1.9rem 0 .7rem}
.content h4{font-family:'IBM Plex Mono',monospace;font-weight:600;color:var(--paper);
  font-size:.82rem;letter-spacing:.03em;margin:1.4rem 0 .5rem}
.content p{margin:0 0 1.1rem}
.content ul,.content ol{margin:0 0 1.15rem 1.4rem}
.content li{margin:.32rem 0}
.content li::marker{color:var(--amber)}
.content ul ul,.content ol ol,.content ul ol,.content ol ul{margin-bottom:.2rem}
.content strong{color:var(--paper);font-weight:600}
.content em{font-style:italic}
.content hr{border:0;border-top:1px solid var(--line);margin:2.1rem 0}
.content blockquote{border-left:2px solid var(--green);background:var(--panel);
  padding:.65rem 1rem;margin:0 0 1.15rem;border-radius:0 4px 4px 0}
.content blockquote p:last-child{margin:0}

code{font-family:'IBM Plex Mono',monospace;font-size:.85em;color:var(--amber);
  background:rgba(255,176,0,.10);padding:.08em .36em;border-radius:3px;word-break:break-word}
pre{background:var(--panel);border:1px solid var(--line);border-radius:6px;
  padding:1rem 1.1rem;margin:0 0 1.25rem;overflow-x:auto}
pre code{color:var(--paper);background:none;padding:0;font-size:.8rem;line-height:1.55;word-break:normal}

.content table{border-collapse:collapse;width:100%;margin:0 0 1.3rem;font-size:.88rem;
  border:1px solid var(--line);display:block;overflow-x:auto}
.content th,.content td{border:1px solid var(--line);padding:.5rem .7rem;text-align:left;vertical-align:top}
.content th{background:var(--panel);color:var(--amber);font-family:'IBM Plex Mono',monospace;
  font-weight:600;font-size:.76rem;letter-spacing:.03em;text-transform:uppercase;white-space:nowrap}

.foot{border-top:1px solid var(--line);color:var(--dim);text-align:center;
  padding:2.2rem 1.4rem 2.8rem;font-family:'IBM Plex Mono',monospace;font-size:.7rem;letter-spacing:.04em;line-height:1.7}
.foot a{color:var(--amber);border-bottom-color:var(--line)}
.foot a:hover{color:var(--paper)}

@media(max-width:900px){
  .layout{flex-direction:column}
  .side{position:static;flex-basis:auto;width:100%;max-height:none;border-right:0;
    border-bottom:1px solid var(--line);display:flex;flex-wrap:wrap;gap:.15rem .8rem;padding:1rem 1.3rem 1.2rem}
  .side .grp{width:100%;margin:.55rem 0 .15rem}
  .side ul{display:flex;flex-wrap:wrap;gap:.1rem .3rem}
  .content{max-width:100%;padding:1.9rem 1.3rem 3.2rem}
}
'''

if __name__ == '__main__':
    main()
