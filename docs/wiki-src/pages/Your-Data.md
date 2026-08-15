GenX-DOS is a **static site with no backend** — no accounts, no cookies, no analytics, and nothing you do is ever sent anywhere. A few things, though, are written to your browser's own **semi-permanent storage** (`localStorage` / IndexedDB) so they survive a reload or a return visit. This page is the complete list of what those are and when they're written.

| Data | Where it's stored | When it's written | Which bundles |
|---|---|---|---|
| **Save-state slots** — five per game; an instant snapshot of the running machine | **IndexedDB** — database `gx-savestate`, store `slots`, keyed `platform:game:slot` | **Manually** — only when you click a **Save** slot | Any bundle showing the Save / Load buttons: the EmulatorJS cores via `genx-savestate.js`, and the standalone engines that expose a reachable state API via `genx-savestate-std.js` |
| **Model 100 battery-backed RAM** — the 32 KB base RAM behind the Startup Menu (your TEXT / ADRS / SCHEDL data and files) | **localStorage** — key `genx-m100-ram` (base64) | **Automatically** — every 10 seconds *and* on tab close; bare-boot Model 100 only (loaded games stay ephemeral) | Tandy TRS-80 Model 100 (`m100`) |
| **In-game cartridge saves** — a game's own SRAM / battery save (e.g. *Phantasy Star*) | **IndexedDB** — EmulatorJS's IDBFS save database (synced with `syncfs`) | **Automatically** — when the game itself writes its save RAM | EmulatorJS bundles *(handled by the bundled engine)* |
| **Emulator settings** — control mappings, volume, video / shader options | **localStorage** — `ejs-settings…` | **Automatically** — when you change a setting in the EmulatorJS menu | EmulatorJS bundles *(handled by the bundled engine)* |

The first two rows are GenX-DOS's own code (`genx-savestate.js` / `genx-savestate-std.js`, and the Model 100 page wrapper); the last two are the bundled **EmulatorJS** engine doing what it normally does. Save-state slots — the first row — can be exported to a file and restored; see [below](#backing-up-your-saves--and-moving-them-between-addresses).

## What isn't stored

No cookies, no login, no personal data, no telemetry — the site has no server to send any of it to. Everything in the table lives only in your browser, scoped to the GenX-DOS origin, and never leaves your machine.

## Backing up your saves — and moving them between addresses

Any bundle with the Save / Load buttons also has a **backup** button beside them, holding two things:

- **export all saves** — writes every save-state slot on the whole site (not just the game you're looking at) to a single `genx-dos-saves-YYYY-MM-DD.json` file. The count in brackets tells you how many slots that is before you click.
- **restore from file** — reads one of those files back.

Restoring is **not destructive**. If a slot already holds a save, the one in the file is skipped rather than written over, so restoring an old backup can never overwrite newer progress. The button reports what happened — `restored 12, kept 3` means twelve slots were empty and filled, and three already had something in them and were left alone. If you *want* the file's version, delete or overwrite that slot first.

### Why this matters if the address changes

Browsers scope storage to the **origin** — the exact address in the bar. IndexedDB cannot be read across origins by design, so saves made at one address are simply not visible from another. They aren't deleted; they're unreachable, and they stay that way.

So if you've been playing at one address and the site moves to another, **export before you switch and restore afterwards**, or your slots stay behind at the old one. (The old address keeps working for as long as it exists, so there's no rush — but nothing carries across on its own.)

## Clearing it

All of it is wiped by your browser's **"clear site data"** (or by clearing history / cookies + site data) for the GenX-DOS origin. Clearing it removes your save-state slots, Model 100 memory, in-game cartridge saves and emulator settings — there is no copy anywhere else, so use **backup → export all saves** first if you want to keep them.

---

See also the [Save / load state](Project-Overview#save--load-state) section of the Project Overview, and the repository's `SECURITY.md`.
