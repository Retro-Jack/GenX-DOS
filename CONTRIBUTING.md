# Contributing

GenX-DOS is a one-person preservation hobby project, but bug reports, doc
fixes, and small improvements are very welcome.

## Reporting problems

- **Something's broken** (a game won't boot, keys are wrong, display glitches):
  open an issue with the bug-report template. The system, game, browser, and
  the exact URL from the address bar are the four things that make it
  reproducible.
- **Security concerns:** see [SECURITY.md](SECURITY.md) — please report
  privately.
- **Rights holders:** if you want a bundled title removed, open an issue —
  see the takedown note in [ATTRIBUTION.md](ATTRIBUTION.md). Removal requests
  are honoured.

## Running it locally

```sh
./Launch.sh          # or: python3 -m http.server 8765
```

Open <http://127.0.0.1:8765/prompt/>. There is no build step — edit, refresh,
done. One gotcha: browsers cache `prompt/javascript/fs.js` aggressively, so
hard-refresh (Ctrl+Shift+R) after editing the virtual filesystem.

## Ground rules for pull requests

Keep PRs small and focused. A few project conventions:

1. **Every change gets a CHANGELOG bullet** under `## [Unreleased]` in
   [CHANGELOG.md](CHANGELOG.md).
2. **Never modify vendored emulator runtime** (the upstream JS/WASM inside
   `systems/<name>/`). Hand-written GenX-DOS code lives in
   `prompt/javascript/`, `systems/_shared/`, `systems/_shared-ejs/genx-*.js`,
   and each bundle's `play.html` — that's the code that's open to change.
3. **Third-party additions need an [ATTRIBUTION.md](ATTRIBUTION.md) entry**
   (source, author, licence) — see the "How to add a new attribution entry"
   section there.
4. **Don't submit game ROMs, BIOSes, or disk images** in PRs.
5. Authored JS/JSON is Prettier-formatted; vendored code is left byte-faithful.
6. Error rendering in wrappers uses `textContent` (never `innerHTML`
   concatenation) — CodeQL scans every push.

## Proposing a new system

The scope rule is **8-bit feel** — sprite-based, chiptune, low-res; the
aesthetic decides, not the calendar. Check the
[Roadmap](https://github.com/Retro-Jack/GenX-DOS/wiki/Roadmap) first: it lists
what's shipped, what's plausible, and what's been ruled out (and why). The
integration recipe is on the
[Emulators](https://github.com/Retro-Jack/GenX-DOS/wiki/Emulators) wiki page.

## Licensing

By contributing you agree your contribution is licensed under the repo's
terms: **CC BY-NC 4.0** for the original GenX-DOS work, with the LGR terminal
base and all bundled third-party components keeping their upstream licences —
see [LICENSE.TXT](LICENSE.TXT) and [ATTRIBUTION.md](ATTRIBUTION.md).
