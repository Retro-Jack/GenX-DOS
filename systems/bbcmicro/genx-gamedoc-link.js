// BBC Micro corner controls-link wiring.
//
// jsbeeb's dist/index.html is a Vite build launched with disc-image URLs
// (`?disc1=<publisher>/<Title>.ssd`) — there is no `?game=` key in the URL, so
// the shared genx-controls-link.js has nothing to resolve a gamedoc from. This
// script translates the disc that was loaded into the gamedoc key and
// publishes it as `window.GENX_GAME_KEY`, which the shared script reads in
// preference to the URL. It is included before that script so the key is set
// by the time it runs.
//
// Map is keyed on the disc filename (without directory or extension). A disc
// with no entry here (or the keyless BASIC launch) publishes no key, and the
// page shows only the system-help link.
(function () {
  var DISC_TO_KEY = {
    Elite: 'elite',
    Frak: 'frak',
    ChuckieEgg: 'chuckegg',
    Repton: 'repton',
    CastleQuest: 'castlequest',
    JetSetWilly: 'jetwilly',
    Exile: 'exile',
    Thrust: 'thrust',
    'Snapper-v1-alt': 'snapper',
    Firetrack: 'firetrak',
  };

  var disc = new URLSearchParams(location.search).get('disc1');
  if (!disc) return;
  var name = disc
    .split('/')
    .pop()
    .replace(/\.[^.]+$/, '');
  var key = DISC_TO_KEY[name];
  // Published for the soft-key policy (genx-softkey-policy.js), which needs the
  // same disc-to-gamedoc mapping and should not keep a second copy of it.
  window.GENX_GAME_KEY = key || null;
  window.GENX_SYSTEM = 'bbcmicro';
})();
