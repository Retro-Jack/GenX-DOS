# MAME 2003-Plus — Arcade

The arcade section is a hundred cabinets from ten makers, ten each, at `C:\SYSTEMS\ARCADE\<MAKER>\GAMES` — the same shape as `CONSOLE\NES\GAMES`. It runs on **EmulatorJS + `mame2003_plus`**, the libretro port of MAME 0.78 kept alive by the MAME 2003-Plus team, sharing the one EmulatorJS framework at `systems/_shared-ejs/` with the thirteen other EJS bundles. EmulatorJS hosts two MAME cores and both are 0.78-era, so the choice was between them rather than of MAME versions; 2003-Plus is the maintained one, with years of backported drivers and fixes.

The makers are listed alphabetically, matching the CONSOLE menu — a menu ordered by anyone's private ranking isn't self-evident to a player — and games run year ascending within each maker. Every launcher is named after its romset, the way the site's other launchers are named after their files.

## Romsets must match the core, not a modern set

A 0.78-era core wants exactly what its own data file lists: the member names, the split between parent and clone archives, the CRC of every chip. A romset built for a current MAME disagrees with it constantly on filenames and occasionally on which archive a chip lives in, and the core refuses the game rather than guess. So all hundred sets were built by CRC against the core's own metadata and then verified member by member — every file decompressed and its CRC recomputed — with no absent, wrong or extra file in any of them.

Matching titles to romsets by position would have filed four games under the wrong ROM: Battlezone as `missile`, Marble Madness as `paperboy`, Sheriff as `spacefev`, Bionic Commando as `blktiger`. Both lists were year-ascending, but they broke ties differently. Each set is matched on its own recorded title instead.

## The options file was empty

The arcade cabinet opened on MAME's copyright warning however `mame2003-plus_skip_disclaimer` was set, and that turned out to be true of every EJS bundle, not just this one. EmulatorJS builds the core's options file from `getCoreSettings()`, which returns an empty string unless the player has saved settings of their own — so the defaults a page passes in never reached any core at all. `genx-ejs-boot.js` now wraps `getCoreSettings()` to append the page's defaults to whatever the player has saved, which is also why the disclaimer and the ROM-warning screens are gone.

## Controls come from the core, and the numbering is wrong

The controls on the hundred gamedocs are not recalled. The core ships per-game control labels, and they name the controls for 78 of the 100 — which is why Asteroids reads Rotate Left / Rotate Right rather than a stick, and Tempest's second button is the Superzapper. Its labels are not consistently written, though, so `tools/arcade-labels.py` corrects them as an explicit list, where a wrong correction is visible.

The pages are generated, and can be regenerated from a clone. `tools/build-arcade-controls.py` reads the core's own `controls.c` and metadata XML at a pinned upstream commit into `tools/arcade-controls.json`; `tools/build-arcade-gamedoc.py` rebuilds every page around the copy it already carries and reports any page that has drifted from the data. Eighteen pages had their controls set by hand after generation — the diamond layouts, Battlezone's treads, Hang-On's throttle and brake, the cabinets whose driver names buttons the labels don't — and `tools/arcade-gamedoc-overrides.json` keeps those blocks with the reason for each.

**MAME's button order is not panel order.** On Gun.Smoke and Missile Command, buttons 1 and 2 are the two *outer* positions and button 3 is the middle one. We measured it rather than read it: Missile Command prints LOW under a base that is nearly spent, so firing one button over and over names its base, and Gun.Smoke's shots visibly leave the sheriff to one side. Those two, and Punch-Out!!, fire from X, Y and B laid out as a diamond so each button sits where it points. Tutankham, which fires left or right along a corridor and nothing else, fires on the right stick.

The five twin-stick cabinets — Robotron: 2084, Splat!, Battlezone, Sheriff and Inferno — read their second joystick from the pad's right analogue stick (I/J/K/L on the keyboard); on a D-pad alone, Battlezone's tank drove but could not steer.

Per-game controls needed a hook the boot glue did not have. Its `perGame` hook took core options only; it now also receives a private copy of the control map and the game's key. The copy is deep, because what a hook rebinds is one input's binding object, and a shallow copy would write into the page's own literal and follow every game loaded afterwards in the same tab.

## Star Wars' yoke

Star Wars is one of eight cabinets whose control the core's data calls an analogue stick rather than a joy-N-way, and the first of them we tested, so the left stick flies it proportionally. Released, the crosshair sprang back to a point a quarter of the way across rather than to the middle. The axis was never wrong: held hard over, the extremes sit symmetrically either side of centre. The rest position comes from the core's **Digital Joystick Centering**, which exists for driving an analogue port from a *digital* stick and pulls a real analogue stick off centre instead. It is off for this game, and the core's XY device, which defaults to the mouse, is off too, leaving the pad's stick as the only thing flying the crosshair.

The other seven are played rather than assumed, and only get the same settings if they show the same fault. Five are done: I, Robot centres correctly on the defaults and needed something else entirely — its two VIEW buttons are read through the start inputs, so they sit on X and Y — Paperboy steers proportionally and throws on A, and Hang-On and Out Run have their own sections. Blaster, Space Harrier and Sinistar are still to play.

## Hang-On's brake, and a config file written at boot

Hang-On's cabinet was a motorbike: handlebars that steer, a twist-grip throttle and a brake lever, all three analogue — MAME's AD Stick X, Y and Z — and no buttons at all. Steering and throttle came through on the defaults. The brake did not, because this MAME assigns AD Stick Z to nothing, and none of the core's options changes that.

MAME 0.78 reads a global `default.cfg` that overrides default input assignments one input type at a time, and it takes an analogue port's axis from the first stick-axis code in its sequence. So the page writes a 20-byte `default.cfg` with a single record — "AD Stick Z, player 1: was nothing, is now right stick down" — and binds LT to "right stick down" and RT to "left stick up". MAME applies a record only when its stored old sequence matches the built-in one, which an empty sequence always does. The file is global to the core but harmless elsewhere, since Z was unassigned for every game.

Where to put it was the fiddly part. EmulatorJS's own `externalFiles` writes its files first and then mounts the persistent save storage over `/data/saves`, which hides them. It fires a `saveDatabaseLoaded` event straight after that mount and before the game boots, so `genx-ejs-boot.js` writes any file a page lists in `window.GENX_EJS_SAVE_FILES` then.

One more thing came out of play-testing: with RT holding full throttle, the bike still slowed down. The left stick's *down* was still bound, and it shares the throttle's axis, so the downward drift of a hand steering the stick read as easing off. For Hang-On the left stick now steers and nothing else.

## The coin door

A cabinet has no keyboard, so the coin slot and the two start buttons are soft keys — 1P, coin, 2P, in that order — in a box beside the *Gameplay controls* link, matched to it in colour, rule and height. The height is measured off the link at runtime rather than written down, because the label is two lines of a webfont whose height isn't known until the font arrives.

## Cabinets and marquees

Each game's orientation is read from the core's metadata, so the vertical and horizontal cabinets each get the right screen without a per-game setting. Every cabinet carries its marquee, normalised to one 674×145 canvas. The libretro artwork covered 97 of them; the other three are Irem cabinets, and Traverse USA had no marquee of its own anywhere, so its marquee is built from the untitled artwork with the game's own title lockup lifted from its attract screen.
