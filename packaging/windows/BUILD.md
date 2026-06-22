# Windows installer build

Produces `GenX-DOS-<version>-setup.exe` — an offline, per-user NSIS installer
that bundles the whole site, a `serve.bat` launcher (+ Start-Menu/Desktop
shortcuts), and a Python installer it runs only if Python isn't already present.

## What's here

- **`installer.nsi`** — the NSIS script (per-user install to
  `%LOCALAPPDATA%\GenX-DOS`, no admin/UAC; Python-if-missing; shortcuts;
  uninstaller + Add/Remove Programs entry).
- **`serve.bat`** — the launcher: starts `python -m http.server 8765` from the
  installed `site\` and opens the browser. Prefers `py`, falls back to `python`.

## Build (from a Linux box)

1. **Stage the payload** next to a copy of these files:
   - `site/` — the repo working tree (minus `.git` and dev config), e.g.
     `rsync -a --exclude='.git/' --exclude='.prettier*' <repo>/ ./site/`
   - `python-setup.exe` — the official Windows installer from python.org
     (e.g. `python-3.12.10-amd64.exe`), downloaded over HTTPS and checksum-checked.
2. **Compile** with NSIS 3.x (`makensis`). On Linux a `makensis` ships inside
   electron-builder's NSIS cache (`~/.cache/electron-builder/nsis-*/linux/makensis`)
   if you don't have a system one:
   ```sh
   NSISDIR=~/.cache/electron-builder/nsis-3.0.4.1/nsis-3.0.4.1-1mx3n \
     "$NSISDIR/linux/makensis" -V2 installer.nsi
   ```
   Output: `GenX-DOS-<version>-setup.exe` (~88 MB with `/SOLID lzma`).
3. **Test** under Wine or on real Windows, then attach to the GitHub release:
   `gh release upload v<version> GenX-DOS-<version>-setup.exe`.

Bump the `OutFile` / version strings in `installer.nsi` per release.
