// Shared bootstrap for the 7 VICE-family + Coleco EmulatorJS bundles.
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
// VICE BASIC entry: a missing `?game=` URL is allowed and falls through
// to the no-key boot (doc title = config.title, no EJS_gameUrl set).
// EJS hits the "stuck on Download Game Core" path if nothing loads, so
// every VICE bundle ships an empty.prg as games[basic].rom — the menu
// always passes ?game=basic when the user picks BASIC.
window.genxBootEJS = async function (config) {
  const fail = (msg) => {
    const el = document.getElementById('game');
    if (el) el.innerHTML = '<div class="err">' + msg + '</div>';
  };

  const params = new URLSearchParams(location.search);
  const key = params.get('game');

  let game = null;
  let gameUrl = null;
  if (key) {
    let games;
    try { games = await (await fetch('games.json')).json(); }
    catch (e) { fail('Failed to load games.json: ' + e.message); return; }
    game = games[key];
    if (!game) { fail('Unknown game key: ' + key); return; }
    document.title = game.title || key;
    gameUrl = game.rom;
  } else {
    document.title = config.title || '';
  }

  // Run the per-game callback (e.g. PET model override, C128 video output).
  const options = Object.assign({}, config.defaultOptions || {});
  if (typeof config.perGame === 'function') {
    config.perGame(game, options);
  }

  // EJS expects globals set BEFORE loader.js runs.
  window.EJS_player    = '#game';
  // loader.js prepends "../" to any non-absolute EJS_pathtodata, so we
  // build an absolute pathname derived from the document URL — works
  // both at the repo root locally and under /GenX-DOS/ on Pages.
  window.EJS_pathtodata = (location.pathname.match(/^.*\/emulators\//) || ['../'])[0] + '_shared-ejs/ejs/data/';
  window.EJS_core           = config.coreName;
  window.EJS_startOnLoaded  = true;
  // True forces loader.js to use src/emulator.js (proper ES module with
  // `export default`); the cdn.emulatorjs.org `emulator.min.js` we
  // mirrored isn't an ES module, so `await import(...).default` returns
  // undefined and the loader bails silently.
  window.EJS_DEBUG_XX       = true;
  window.EJS_defaultOptions = options;
  if (config.defaultControls) window.EJS_defaultControls = config.defaultControls;
  if (config.biosUrl) window.EJS_biosUrl = new URL(config.biosUrl, location.href).href;
  if (gameUrl) window.EJS_gameUrl = new URL(gameUrl, location.href).href;

  const s = document.createElement('script');
  s.src = '../_shared-ejs/ejs/data/loader.js';
  document.body.appendChild(s);
};
