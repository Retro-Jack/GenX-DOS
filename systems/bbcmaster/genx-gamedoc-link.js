// BBC Master corner controls-link wiring.
//
// jsbeeb's dist/index.html is a Vite build launched with disc-image URLs
// (`?model=Master&disc1=<publisher>/<Title>.ssd`) — there is no `?game=`
// key, so the shared genx-controls-link.js can't resolve the per-game
// gamedoc. Instead the page ships a hardcoded `<a class="gx-controls-link"
// href="../controls.html">`; this script upgrades that href to the right
// `docs/games/bbcmaster/<key>.html` based on the disc that was loaded.
//
// Map is keyed on the disc filename (without directory or extension). A disc
// with no entry here (or the keyless blank-Master launch) falls through to
// the generic controls.html.
(function () {
  var DISC_TO_KEY = {
    EliteMaster: 'elite',
    Nevryon: 'nevryon',
    Galaforce: 'galaforce',
    PalaceOfMagic: 'palaceofmagic',
    BoneCruncher: 'bonecrun',
    CrazeeRider: 'crazee',
    Commando: 'commando',
    ByFairMeansOrFoul: 'bfmof',
    HoledOut: 'holedout',
    Ballistix: 'ballistx',
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
  window.GENX_SYSTEM = 'bbcmaster';
  if (!key) return;
  var a = document.querySelector('.gx-controls-link');
  // dist/index.html lives at systems/bbcmaster/dist/, so docs/games/ is three
  // levels up (dist -> bbcmaster -> systems -> repo root).
  if (a) a.href = '../../../docs/games/bbcmaster/' + key + '.html';
})();
