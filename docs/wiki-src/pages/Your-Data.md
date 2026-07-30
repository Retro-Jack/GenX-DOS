GenX-DOS is a **static site with no backend** — no accounts, no cookies, no analytics, and nothing you do is ever sent anywhere. A few things, though, are written to your browser's own **semi-permanent storage** (`localStorage` / IndexedDB) so they survive a reload or a return visit. This page is the complete list of what those are and when they're written.

| Data | Where it's stored | When it's written | Which bundles |
|---|---|---|---|
| **Save-state slots** — five per game; an instant snapshot of the running machine | **IndexedDB** — database `gx-savestate`, store `slots`, keyed `platform:game:slot` | **Manually** — only when you click a **Save** slot | Any bundle showing the Save / Load buttons: the EmulatorJS cores via `genx-savestate.js`, and the standalone engines that expose a reachable state API via `genx-savestate-std.js` |
| **Model 100 battery-backed RAM** — the 32 KB base RAM behind the Startup Menu (your TEXT / ADRS / SCHEDL data and files) | **localStorage** — key `genx-m100-ram` (base64) | **Automatically** — every 10 seconds *and* on tab close; bare-boot Model 100 only (loaded games stay ephemeral) | Tandy TRS-80 Model 100 (`m100`) |
| **In-game cartridge saves** — a game's own SRAM / battery save (e.g. *Phantasy Star*) | **IndexedDB** — EmulatorJS's IDBFS save database (synced with `syncfs`) | **Automatically** — when the game itself writes its save RAM | EmulatorJS bundles *(handled by the bundled engine)* |
| **Emulator settings** — control mappings, volume, video / shader options | **localStorage** — `ejs-settings…` | **Automatically** — when you change a setting in the EmulatorJS menu | EmulatorJS bundles *(handled by the bundled engine)* |

The first two rows are GenX-DOS's own code (`genx-savestate.js` / `genx-savestate-std.js`, and the Model 100 page wrapper); the last two are the bundled **EmulatorJS** engine doing what it normally does.

## What isn't stored

No cookies, no login, no personal data, no telemetry — the site has no server to send any of it to. Everything in the table lives only in your browser, scoped to the GenX-DOS origin, and never leaves your machine.

## Clearing it

All of it is wiped by your browser's **"clear site data"** (or by clearing history / cookies + site data) for the GenX-DOS origin. Clearing it removes your save-state slots, Model 100 memory, in-game cartridge saves and emulator settings — there is no copy anywhere else, so export anything you want to keep first.

---

See also the [Save / load state](Project-Overview#save--load-state) section of the Project Overview, and the repository's `SECURITY.md`.
