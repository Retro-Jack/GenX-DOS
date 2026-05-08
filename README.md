# www.lazygamereviews.com

A static recreation of the early LGR (Lazy Game Reviews) website with a DOS prompt aesthetic, plus a self-hosted emulator suite that boots playable games from numbered DOS-style menus.

## Quick start

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Open <http://127.0.0.1:8765/prompt/> and navigate the menus by typing numbers at the `C:\>` prompt.

## Layout

```
index.html              site root
prompt/                 DOS prompt page (typed-command terminal in JS)
  index.html
  javascript/           terminal logic, virtual filesystem (fs.js)
emulators/
  jsbeeb/               BBC Micro — vendored from mattgodbolt/jsbeeb v1.12.0
    dist/               built runtime (Vite, base "./") — entry point served as-is
    dist/discs/         10 BBC disc images (.ssd) + 5 vendor folders
  jsnes/                NES — vendored from bfirsh/jsnes v2.1.0 (npm dist)
    dist/jsnes.min.js   135 KB pure-JS emulator
    play.html           thin wrapper: ?game=<key> -> games.json -> jsnes.Browser
    games.json          10-entry catalogue
    roms/               10 .nes files
  genesis/              Sega Genesis — vendored from lrusso/Genesis (Emscripten/PicoDrive port)
    Genesis.min.js      2.1 MB pure-JS emulator
    play.html           thin wrapper, 4:3 aspect-locked canvas
    games.json
    roms/               10 .bin files (extracted from upstream zip romsets)
```

## Emulator integration recipe

For each system the pattern is identical:

1. **Vendor** the emulator under `emulators/<name>/`. Drop upstream `node_modules`, inner `.git`, and any `.gitignore` that excludes deploy artefacts (e.g. `*.ssd`, `/dist`).
2. **Strip telemetry** from the source's `index.html` before deploying (jsbeeb shipped Google Analytics; removed).
3. **Write a `play.html` wrapper** that reads `?game=<key>` from the URL, fetches `games.json`, looks up `{title, rom}`, and boots the emulator with that ROM. Use absolute paths (`location.pathname.replace(/[^/]*$/, "")`) for any framework that does its own path mangling.
4. **Bundle ROMs locally** under `roms/` (or `dist/discs/` for jsbeeb). Archive.org doesn't set CORS for direct browser fetch, so `play.html` can't pull ROMs at runtime — they must be on the same origin.
5. **Wire fs.js** so each game's `.bat` file has a `link:` field pointing to `../emulators/<name>/play.html?game=<key>`. The terminal opens it via `window.open(link, "_blank")`.

## Menu structure (CONSOLE branch)

```
EMULATORS -> CONSOLE -> ATARI    -> 2600 / 5200 / 7800 -> GAMES (external links)
                    -> NINTENDO -> NES -> GAMES (10 titles, JSNES local)
                    -> SEGA     -> GENESIS -> GAMES (10 titles, lrusso/Genesis local)
                    -> MATTEL / COLECO / MAGNAVOX -> GAMES (external links)
EMULATORS -> HOMECOMP -> ACORN -> BBC -> GAMES (10 titles + PROMPT, jsbeeb local)
                     -> COMMODORE / ATARI / SINCLAIR / TANDY / TI / SHARP -> GAMES (external links)
```

Self-hosted systems (NES, Genesis, BBC) include local ROMs and run fully offline once `python3 -m http.server` is started. External-linked systems open game-specific URLs on third-party sites; they will be progressively self-hosted using the same recipe.

## Notes on jsbeeb disc URLs

jsbeeb's `?disc1=` parameter accepts several schemas:

- `?disc1=path/to/file.ssd` (empty schema): **must be a raw `.ssd`/`.dsd`/`.hfe` file** — the empty-schema branch in `loadDiscImage()` does not unzip. We extracted each upstream `.zip` into a raw `.ssd` and serve those.
- `?disc1=sth:Acornsoft/Elite.zip`: jsbeeb fetches from `stairwaytohell.com` (used for STH-listed games when not bundled). We don't use this any more.
- `?disc1=https://example.com/file.zip`: full-URL form, automatically unzipped.

`?autoboot` triggers `*EXEC !BOOT`. Without it, the emulator stays at the BASIC `>` prompt — used by the PROMPT menu entry.

## License

Site code is the LGR recreation by Retro-Jack. Each vendored emulator retains its upstream license:

- jsbeeb: GPL-3.0-or-later (mattgodbolt/jsbeeb)
- JSNES: Apache-2.0 (bfirsh/jsnes)
- lrusso/Genesis: GPL-2.0 (port of PicoDrive, notaz/PicoDrive)

ROMs are sourced from public archive.org collections; their copyright remains with the original publishers.
