// BBC Micro corner controls-link wiring.
//
// jsbeeb's dist/index.html is a Vite build launched with disc-image URLs
// (`?disc1=<publisher>/<Title>.ssd`) — there is no `?game=` key, so the
// shared genx-controls-link.js can't resolve the per-game gamedoc. Instead
// the page ships a hardcoded `<a class="gx-controls-link" href="../controls.html">`;
// this script upgrades that href to the right `docs/games/bbcmicro/<key>.html`
// based on the disc that was loaded.
//
// Map is keyed on the disc filename (without directory or extension). A disc
// with no entry here (or the keyless BASIC launch) falls through to the
// generic controls.html.
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
  if (!key) return;
  var a = document.querySelector('.gx-controls-link');
  // dist/index.html lives at systems/bbcmicro/dist/, so docs/games/ is three
  // levels up (dist -> bbcmicro -> systems -> repo root).
  if (a) a.href = '../../../docs/games/bbcmicro/' + key + '.html';
})();
