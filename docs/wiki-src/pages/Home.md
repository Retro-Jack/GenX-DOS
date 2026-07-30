# GenX-DOS Wiki

GenX-DOS is a browser DOS prompt that boots emulators from numbered menus. We ship 19 emulator engines locally — 33 sub-systems between them — and nothing is fetched at runtime. Every byte lives on the same origin.

This wiki is the long-form companion to the repo. The [README](https://github.com/Retro-Jack/GenX-DOS/blob/master/README.md) is the quick tour; these pages are the field notes.

## Pages

| Page | What's inside |
|------|---------------|
| [[Project Overview]] | What the site does, how it boots, what's on screen |
| [[File Structure]] | Where things live in the repo |
| [[Virtual Filesystem]] | The simulated `C:` drive |
| [[Commands]] | DOS commands the prompt understands |
| [[Font System]] | How we draw 12×12 CP437 glyphs in HTML |
| [[Emulators]] | Index of every engine, each with its own page |
| [[Customising the Filesystem]] | Adding directories, files, menus |
| [[Roadmap]] | What's shipped, what's next, what won't be |

## In the repo

- [README.md](https://github.com/Retro-Jack/GenX-DOS/blob/master/README.md) — quick start + layout summary
- [Booting a Museum in a Browser Tab](https://retro-jack.github.io/GenX-DOS/docs/article/) — the feature article. *"A museum that boots in a tab — and you're allowed to touch everything."*
- [CHANGELOG.md](https://github.com/Retro-Jack/GenX-DOS/blob/master/CHANGELOG.md) — release notes
- [ATTRIBUTION.md](https://github.com/Retro-Jack/GenX-DOS/blob/master/ATTRIBUTION.md) — canonical record of every bundled third-party emulator, BIOS, ROM, bezel, and dependency
- [Packages](https://github.com/Retro-Jack/GenX-DOS/packages) — the whole site published on each release as a container image (`ghcr.io/retro-jack/genx-dos`) and an npm package (`@retro-jack/genx-dos`)
