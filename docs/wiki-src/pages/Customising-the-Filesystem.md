The virtual filesystem lives in `prompt/javascript/fs.js` as a JS array called `fs`. Every directory and every file is an object in that tree. No server, no database — edit the file, hard-refresh, the prompt picks up the change.

## What a node looks like

```js
var fs = [{
  name: 'C',
  directories: [ ... ],
  files: [ ... ]
}];
```

A node is one of:

| Shape | Means |
|-------|-------|
| `{ name, directories, files }` | a directory |
| `{ name, link }` | a "file" that opens a URL when executed |
| `{ name, data }` | a "file" whose `data` is run as a batch script when executed |

`hidden: true` on a node hides it from `dir` output (still navigable via `cd`).

---

## Adding a link file

```js
{ name: 'GITHUB.COM', link: 'https://github.com/yourname' }
```

Drop it into any directory's `files` array. The user can `cd` into the directory and type `github.com` to open it.

---

## Adding a batch file

```js
{ name: 'HELLO.BAT',
  data: 'echo off\nsetcol 2e\necho Hello, world!\nsetcol 07\necho.' }
```

Lines are separated by `\n`. Supported batch commands: anything in [[Commands]] plus any filename present in the current directory.

---

## Adding a directory

```js
{ name: 'MUSIC',
  directories: [],
  files: [
    { name: 'BANDCAMP.COM', link: 'https://yourname.bandcamp.com' }
  ]
}
```

---

## Adding a system menu (numbered list)

The standard pattern for a system with several titles is a directory whose `menu.bat` prints a box-drawn menu, plus numbered `.bat` shortcuts that each run a named `.exe` launcher.

```js
{ name: 'GAMES', directories: [], files: [
    { name: 'menu.bat', data: 'echo off\ncls\necho ╔═══...╗\n...echo.\n' },
    { name: '0.bat',    data: 'echo off\ncd ..\ncd ..\nmenu\n' },
    { name: '1.bat',    data: 'mario\n' },
    { name: '2.bat',    data: 'contra\n' },
    { name: 'mario.exe',  link: '../systems/jsnes/play.html?game=mario' },
    { name: 'contra.exe', link: '../systems/jsnes/play.html?game=contra' },
] }
```

The `menu.bat` data string renders rows like `║   1.  Super Mario Bros.        (1985) ║` — **title first, year last** is the project convention (see Menu box format below).

The flow: the user types a number → it runs the matching `N.bat` → which runs `<key>` → which resolves to `<key>.exe` (the `link:` entry) → which opens the emulator URL. Typing `<key>` at the prompt does the same thing, which is what keeps the menus self-documenting for anyone who tries `dir`.

For a real example see the NES or C64 blocks in `fs.js`.

---

## Menu box format

Standard menus use double-rule CP437 borders with a **45-char inner width**.

```
 ╔═════════════════════════════════════════════╗
 ║              CENTERED HEADER                ║ ◄── header (45 chars between ║)
 ╠─────────────────────────────────────────────╣
 ║                                             ║ ◄── blank spacer row
 ║   1.  Some Title                     (1985) ║ ◄── 3-column: # Title (Year)
 ║   2.  Another Title                  (1986) ║
 ║                                             ║
 ║  11.  BASIC system prompt                   ║ ◄── prompt rows have no year
 ║                                             ║
 ║   0.  Back                                  ║ ◄── always last
 ║                                             ║
 ╠─────────────────────────────────────────────╣
 ║        Type a number and press ENTER        ║
 ╚═════════════════════════════════════════════╝
```

Entry row layout (45 chars between borders): **3 columns — number, title, year.** Games sorted by year ascending, alphabetical within year.

```
 ║   N.  Title field                    (YYYY) ║
  ├─────┤├─────────────────────────────┤├────┤│
     7                 31                 6   1
   "N.  "        title (left)          (YYYY)
```

- Title field 31 chars left-justified; year column 6 chars `(YYYY)` or `(home)`-style marker; 1 space of padding before the border.
- BASIC / system-prompt rows have no year — the title field extends through the year slot.
- The launcher name is no longer a column. It is still typeable at the prompt, and `find` recovers it by reading the numbered `.bat` beside each row.
- Double-digit numbers shift left one space: `  NN.  ` vs `   N.  ` — same 7-char prefix width.
- Blank line before the last entry in a group = visual separator (e.g. games vs system prompt).

Two things to remember:

- Apostrophes in titles must be escaped: `K.C.\'s Krazy Chase!` inside a `'...'` JS string.
- The on-screen rendering uses CP437 box-drawing glyphs (`É`, `═`, `║`, etc.) via the font sprite system — the Unicode equivalents shown above are for documentation readability only.

---

## Boot behaviour

`autoexec.bat` runs automatically on load. Its default `data` is just `menu\n` — which runs the root `menu.bat`. The root `menu.bat` in turn does `cd systems\nmenu\n`, dropping the user straight into the EMULATOR LAUNCHER.

To boot to a different starting place, override `menu.bat` (or `autoexec.bat`):

```js
{ name: 'autoexec.bat', data: 'cd systems\\console\\nes\\games\ncls\ndir/w/o\n' }
```

To set colours at boot, prepend `setcol`:

```js
{ name: 'autoexec.bat', data: 'echo off\nsetcol 02\nc:\ncls\nmenu\n' }
```

Common combos:

| Code | bg / fg |
|------|---------|
| `07` | black / light grey (default) |
| `0f` | black / white |
| `17` | dark blue / light grey |
| `02` | black / dark green |
| `0a` | black / green |
| `0e` | black / yellow |

See [[Font System]] for the 16-colour palette.

---

## A few things we've learned the hard way

- Use absolute paths (`cd\\games\\action`) inside `.bat` files; relative `cd` only works if the target is a direct child.
- Files can only be executed from the directory they live in — there is no `PATH`.
- For menu generation it's much easier to write a small Python helper that emits the `echo` lines than to hand-craft the box-drawing characters.
