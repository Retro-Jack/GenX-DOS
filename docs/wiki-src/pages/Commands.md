The prompt understands a small subset of DOS commands. Commands are case-insensitive. Multiple commands can be chained with ` && ` (e.g. `cd\emulators && dir`).

## Navigation

| Command | What it does |
|---------|--------------|
| `dir` | List the current directory |
| `dir /w` | Wide view |
| `dir /o` | Alphabetical order |
| `dir /w /o` | Wide + sorted |
| `cd <dir>` | Change directory |
| `cd ..` | Go up one level |
| `cd \` | Jump to drive root |
| `cls` | Clear the screen |

## Files

| Command | What it does |
|---------|--------------|
| `<filename>` | Execute. `link:` opens the URL in a new tab; `data:` runs as a batch script |
| `type <file>` | Print the file's `data` (or `link`) to the screen. On an `.exe` it prints the program's bytes as CP437 glyphs — `MZ` then noise — and stops at the first Ctrl-Z, exactly as DOS did |
| `find <word>` | Search the whole virtual FS for games (`.exe` launchers) and emulator menus (sub-directories) whose name matches the query at a word boundary. Reports two sections — `GAMES` and `MENUS` — each with launcher + title + full path. Cross-references the numbered `.bat` shortcuts against the menu they sit beside, so `smb.exe` is findable by the title the menu shows for it (`Super Mario Bros.`). |
| `find "<phrase>"` | Multi-word queries must be wrapped in double quotes. Bare-spaced input is rejected with a hint that re-quotes the input. |

### What `find` looks like in practice

```
C:\>find attack

Searching for "attack"...
7 matches found.

GAMES (7)
  DEMON      Demon Attack (1982)
             C:\SYSTEMS\CONSOLE\ODYSSEY2\GAMES
  DEMONATK   Demon Attack (1983)
             C:\SYSTEMS\HOMECOMP\COMMODRE\VIC20\GAMES
  MOLATAK    Mole Attack (1982)
             C:\SYSTEMS\HOMECOMP\COMMODRE\MAX\GAMES
  DEMON      Demon Attack (1982)
             C:\SYSTEMS\HOMECOMP\TANDY\COCO\GAMES
  GALACTIC   Galactic Attack (1983)
             C:\SYSTEMS\HOMECOMP\TANDY\COCO\GAMES
  ATTACK     Attack Force (1980)
             C:\SYSTEMS\HOMECOMP\TANDY\TRS80\GAMES
  ROBOT      Robot Attack (1981)
             C:\SYSTEMS\HOMECOMP\TANDY\TRS80\GAMES
```

## Display

| Command | What it does |
|---------|--------------|
| `echo <text>` | Print text |
| `echo off` | Suppress the `C:\>` prompt re-render until the end of the current batch (or until `echo.`) |
| `echo.` | Print a blank line **and** restore prompt re-render — used at the end of menu batches so the `C:\>` appears under the menu |
| `setcol <BF>` | Set background + foreground colour by two hex digits (e.g. `07` = black bg, white fg) |

`help` prints the full command reference (the text on this wiki page, baked into `commands.js`).

Source: `prompt/javascript/commands.js`.

## Keyboard

| Key | Action |
|-----|--------|
| Enter | Submit |
| Backspace | Delete last character |
| ↑ / ↓ | Step through command history |
