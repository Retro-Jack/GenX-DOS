// SPDX-License-Identifier: GPL-3.0-or-later
// Part of GenX-DOS. This file runs alongside GPL-licensed emulator
// engines, so it is GPL-3.0-or-later rather than the repo's CC BY-NC.
// Shared bootstrap for 11 EmulatorJS bundles: the 6 VICE-family machines,
// ColecoVision, the Atari 2600 (Stella), the Game Boy / GBC (gambatte), the
// Atari Lynx (handy), and the Sega Game Gear (genesis_plus_gx). (NES/jsnes is
// also EJS but keeps its own inline boot.)
//
// Each bundle's play.html shrinks to:
//
//   <body>
//     <noscript>...</noscript>
//     <div id="game"><div class="loading">Booting <name>…</div></div>
//     <script>
//       genxBootEJS({
//         title: '<system name>',     // doc title + no-key fallback
//         coreName: 'vice_xpet',       // EJS_core
//         defaultOptions: { ... },     // EJS_defaultOptions
//         defaultControls: { ... },    // optional, EJS_defaultControls
//         biosUrl: 'foo.rom',          // optional, bundle-local
//         bareBoot: 'games/empty.prg',  // optional, ROM loaded when no ?game=
//         perGame: (game, opts) => {}  // optional — mutate opts based on game
//       });
//     </script>
//   </body>
//
// All the games.json fetch, key lookup, EJS-globals setup, loader.js
// injection lives here. Bundle-specific quirks (PET 3032/4032 chargen,
// C128 VICII/VDC, MAX Ultimax mode) all live in defaultOptions +
// per-game callback.
//
// Keyless boot: a missing `?game=` URL boots the bare machine, the way
// switching one on with no cartridge or disk in it does. EJS will not
// start at all without a game — it sits on "Download Game Data 100%"
// for ever — so a bundle that has something sensible to boot into names
// that ROM as `bareBoot`, and it is loaded instead. The VICE machines
// point at their 4-byte empty.prg and land on the BASIC READY screen;
// the ColecoVision and Lynx point at their own boot ROM. It is a plain
// path rather than a games.json key on purpose: these are not games and
// must not turn up in the game counts.
//
// A bundle with no meaningful bare state (a cartridge console with no
// BIOS, say) simply omits `bareBoot` and gets a plain message rather
// than the silent hang.
window.genxBootEJS = async function (config) {
  const fail = (msg) => {
    // textContent, not innerHTML, so a crafted ?game= key can't inject markup.
    const el = document.getElementById('game');
    if (!el) return;
    const div = document.createElement('div');
    div.className = 'err';
    div.textContent = msg;
    el.replaceChildren(div);
  };

  const params = new URLSearchParams(location.search);
  const key = params.get('game');

  let game = null;
  let gameUrl = null;
  document.title = config.title || key || '';
  if (key) {
    let games;
    try {
      games = await (await fetch('games.json')).json();
    } catch (e) {
      fail('Failed to load games.json: ' + e.message);
      return;
    }
    game = games[key];
    if (!game) {
      fail('Unknown game key: ' + key);
      return;
    }
    gameUrl = game.rom;
  } else if (config.bareBoot) {
    // No key: boot the bare machine. bareBoot is a plain bundle-relative
    // path, deliberately not a games.json key — these are boot ROMs and
    // empty stubs, not games, and they must not land in the game counts.
    gameUrl = config.bareBoot;
  } else {
    // Every bundle declares bareBoot, so this is a safety net for a
    // newly added one that forgot to — not something a visitor should see.
    fail('This machine has no bare-boot ROM configured.');
    return;
  }

  // Run the per-game callback (e.g. PET model override, C128 video output).
  const options = Object.assign({}, config.defaultOptions || {});
  if (typeof config.perGame === 'function') {
    config.perGame(game, options);
  }

  // EJS expects globals set BEFORE loader.js runs.
  window.EJS_player = '#game';
  // loader.js prepends "../" to any non-absolute EJS_pathtodata, so we
  // build an absolute pathname derived from the document URL — works
  // both at the repo root locally and under /GenX-DOS/ on Pages.
  window.EJS_pathtodata =
    (location.pathname.match(/^.*\/systems\//) || ['../'])[0] +
    '_shared-ejs/ejs/data/';
  window.EJS_core = config.coreName;
  window.EJS_startOnLoaded = true;
  // True forces loader.js to use src/emulator.js (proper ES module with
  // `export default`); the cdn.emulatorjs.org `emulator.min.js` we
  // mirrored isn't an ES module, so `await import(...).default` returns
  // undefined and the loader bails silently.
  window.EJS_DEBUG_XX = true;
  window.EJS_defaultOptions = options;
  if (config.defaultControls)
    window.EJS_defaultControls = config.defaultControls;
  // When coreName names a concrete core (e.g. 'genesis_plus_gx' because the
  // system's first-choice core isn't bundled), controlScheme pins the input
  // scheme to the intended system (e.g. 'segaMS').
  if (config.controlScheme) window.EJS_controlScheme = config.controlScheme;
  if (config.biosUrl)
    window.EJS_biosUrl = new URL(config.biosUrl, location.href).href;
  if (gameUrl) window.EJS_gameUrl = new URL(gameUrl, location.href).href;

  const s = document.createElement('script');
  s.src = '../_shared-ejs/ejs/data/loader.js';
  document.body.appendChild(s);
};
