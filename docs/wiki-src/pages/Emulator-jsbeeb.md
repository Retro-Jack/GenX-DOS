# jsbeeb — BBC Micro

jsbeeb is Matt Godbolt's BBC Micro emulator. GenX-DOS ships it as **two self-contained bundles** — `systems/bbcmicro/` (Model B) and `systems/bbcmaster/` (Master 128, `?model=Master`) — so each game's URL names the machine it runs on rather than hiding the model behind a shared `systems/jsbeeb/` path. They're full copies of the same Vite build — since rebuilt from our own [`Retro-Jack/jsbeeb`](https://github.com/Retro-Jack/jsbeeb) fork (jsbeeb 1.14.0) for a d-pad gamepad remap and a monitor-frame tweak. The core integration was hands-off (jsbeeb is a polished web product in its own right), but each bundle is among the largest in the suite and has some scary-looking orphan situations that are actually load-bearing.

## Where we started

[jsbeeb](https://github.com/mattgodbolt/jsbeeb) is a Vite-built TypeScript bundle, GPL-3.0-or-later. Drop in the `dist/` directory verbatim, point `play.html` at `dist/index.html?disc=<url>`, done. There wasn't really an integration step — jsbeeb already supports per-machine URL parameters and direct disc loading. We just hosted the build. (We've since moved to a light fork for the d-pad gamepad remap — see the gamepad section below.)

## The bundle is 25 MB and most of it isn't orphan

A quick `du -sh` shows ~25 MB, which raises eyebrows on a static site. Two-thirds of that is intentional. Worth documenting because every audit pass re-discovers these:

- **`dist/teletext/` is 21 MB.** Four `txt0..3.dat` files, referenced by `dist/assets/index-*.js` via the URL pattern `teletext/txt${n}`. No GenX-DOS menu path triggers teletext mode. The data is there because upstream jsbeeb keeps Ceefax viewer alive (F12 menu inside jsbeeb). Removing it is safe iff no one ever hits the teletext button. Defensible for our use, but it counts as a feature regression, not a cleanup.

- **`dist/roms/{atom,tube,compact,b1770,a01,us,b,bp}/`** — system ROMs for BBC variants we don't expose (Acorn Atom, Tube co-processors, Master Compact, 1770 disc controller, BBC A01 / B early-OS / B+, US BBC). All referenced by `assets/index-*.js`'s model picker, so they're technically not orphans even though we only ever launch Model B and Master 128. ~150 KB total.

The teletext blob is the only one that would meaningfully shrink the bundle if removed.

## How the two bundles work

Each bundle is a full copy of the jsbeeb `dist/`. The BBC Micro menu launches `systems/bbcmicro/dist/?disc1=<Title>.ssd&autoboot` (jsbeeb defaults to Model B); the BBC Master menu launches `systems/bbcmaster/dist/?model=Master&disc1=<Title>.dsd&autoboot`. Same engine, two honest paths — the only functional difference is the `?model=Master` param the Master menu adds.

## Save / load state

jsbeeb exposes the running machine as `window.processor`, and its own rewind feature uses `processor.snapshotState()` / `restoreState()` — a complete machine snapshot. We ride that exact API: the adapter (injected into the Vite `dist/index.html` alongside the other genx links) registers `getState`/`setState` around those two calls, and `_shared/genx-savestate-std.js` draws the bottom-left **save** / **load** menus. Because it's a full snapshot it works mid-game in titles with no save of their own — **Elite** being the obvious one.

## The COPY soft button

The BBC's COPY key has no obvious PC equivalent — jsbeeb maps it to `End` (also Right-Ctrl / F11). Several BBC titles use it (as an in-game "continue" or action key; the BBC's Delete = freeze), so `_shared/genx-bbc-copykey.js` adds a clickable **COPY** button (top-left, in the GenX button style) that dispatches a synthetic `End`. jsbeeb listens for keydown on `document` and reads `event.which`/`keyCode` (no `isTrusted` check), so the synthetic key maps cleanly to COPY — the same synthetic-event trick the VICE RUN/STOP keyboard remap uses. Included in both `bbcmicro/` and `bbcmaster/` dist pages.

## USB gamepad support (the fork)

Standard-scheme games need nothing extra: jsbeeb natively maps a pad's d-pad to the BBC's `Z`/`X`/`'`/`/` steering keys, so titles like **Snapper** are pad-playable out of the box. The problem is digital games that use *other* keys — upstream jsbeeb hardwires the d-pad to those four keys with no remap hook, so a game with different controls couldn't drive the pad at all.

The [`Retro-Jack/jsbeeb`](https://github.com/Retro-Jack/jsbeeb) fork (jsbeeb 1.14.0) adds four `GP.D12`–`GP.D15` cases, so a launch URL can bind the d-pad buttons to any BBC key. First wired: **Chuckie Egg** (`GP.FIRE=SPACE&GP.D12=A&GP.D13=Z&GP.D14=COMMA&GP.D15=PERIOD` — d-pad runs and climbs, any button jumps); **Elite** and **Thrust** followed, each binding the d-pad and face buttons to its own scheme. Some games need nothing at all — **Frak!**, **Jet Set Willy** and **Firetrack** happen to use exactly the keys the pad already sends. The remap is a general improvement, offered back upstream on the fork's clean `gamepad-dpad-remap` branch; the only GenX-local fork change is the **CUB-monitor inset** (68→120px, for wallpaper breathing room), kept on the fork's build branch. Local changes are logged in the fork's `GENX-CHANGES.md` and credited in [ATTRIBUTION.md](https://github.com/Retro-Jack/GenX-DOS/blob/master/ATTRIBUTION.md).

Worth knowing, because it isn't obvious from the `GP.*` machinery: jsbeeb *also* drives the BBC's **real analogue joystick**, on a completely separate path from the key-faking above. `GamepadSource` feeds the pad's axes into the emulated ADC (all four channels default to it), and the system VIA reads the pad directly for the joystick fire buttons — but those are Gamepad-API buttons **10 and 11**, which on a standard pad are the **stick-click buttons L3 and R3**, not the face buttons. So a game offering its own joystick option answers to *left stick to steer, click the left stick to fire* — pressing **A** at such a prompt does nothing, which makes the feature look broken when it isn't.

## The positional keyboard gotcha (`:` `*` `@`)

jsbeeb's default layout (`keyLayout='physical'`) maps PC keys to BBC keys **by physical position, not by character**. So several BBC keys land somewhere a PC user wouldn't guess, and pressing the PC key that *prints* the same glyph gives the wrong BBC key:

| BBC key | Press on PC | Why |
|---------|-------------|-----|
| `:` `*` | apostrophe `'` | `i(k.APOSTROPHE, O.COLON_STAR)` — PC `:` (Shift+`;`) gives BBC `+` instead |
| `/` `?` | `/` | positional match, no surprise |
| `@`     | `[` | `i(k.LEFT_SQUARE_BRACKET, O.AT)` |
| COPY    | `End` (or the COPY button) | also Right-Ctrl / F11 |
| `f0`    | `F10` | `f1`–`f9` are `F1`–`F9` |

Games scan the key matrix by position, so Shift state doesn't matter — e.g. Repton/Firetrack "up" is the `:` `*` key, which you press as `'`. The gamedocs spell out the PC key for every affected title.

## Bundle layout

```
systems/bbcmicro/   (and an identical systems/bbcmaster/)
├── dist/
│   ├── index.html              ← jsbeeb entry, used directly
│   ├── assets/                 ← Vite-built bundle (this is most of jsbeeb)
│   ├── discs/                  ← bundled disc images (each bundle carries only its own menu's discs)
│   ├── images/, sounds/        ← jsbeeb chrome
│   ├── roms/                   ← BBC variant system ROMs (most unused)
│   ├── teletext/               ← 21 MB Ceefax data, kept for completeness
│   └── tapes/
├── controls.html               ← thin wrapper page (retitled per machine)
├── genx-gamedoc-link.js         ← rewrites the corner link to the per-game gamedoc
└── COPYING                     ← GPL-3.0
```

`play.html` for each is just `dist/index.html`. The `controls.html` next to it is GenX-specific, not from upstream.

Because jsbeeb launches with keyless disc URLs (`?disc1=<Title>.ssd`), the shared `genx-controls-link.js` can't resolve a per-game gamedoc. `dist/index.html` ships a hardcoded `<a class="gx-controls-link" href="../controls.html">` plus a deferred `genx-gamedoc-link.js` that maps the disc filename → gamedoc key and upgrades the link's `href` on load. Each bundle's script targets its own gamedoc dir — `bbcmicro/` → `docs/games/bbcmicro/` (e.g. `Elite` → `elite`), `bbcmaster/` → `docs/games/bbcmaster/` (e.g. `EliteMaster` → `elite`, the old `master-` prefix dropped now each machine has its own dir). Keyless BASIC / blank-Master launches keep the generic `controls.html`.

## Related

- [[Emulator-elkjs-Electron]] — sibling Acorn machine
- [[Emulators]] — index
