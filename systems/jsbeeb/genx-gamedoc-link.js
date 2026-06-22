// jsbeeb-specific corner controls-link wiring.
//
// jsbeeb's dist/index.html is a Vite build launched with disc-image URLs
// (`?disc1=<publisher>/<Title>.ssd[&model=Master]`) — there is no `?game=`
// key, so the shared genx-controls-link.js can't resolve the per-game
// gamedoc. Instead the page ships a hardcoded `<a class="gx-controls-link"
// href="../controls.html">`; this script upgrades that href to the right
// `gamedocs/jsbeeb/<key>.html` based on the disc that was loaded.
//
// Map is keyed on the disc filename (without directory or extension), which
// is unique across both the BBC Micro and Master menus. A disc with no
// entry here (or the keyless BASIC/blank-Master launch) falls through to
// the generic controls.html.
(function () {
  var DISC_TO_KEY = {
    // BBC Micro
    Elite: 'elite',
    ChuckieEgg: 'chuckegg',
    Repton: 'repton',
    ManicMiner: 'manicmn',
    JetSetWilly: 'jetwilly',
    Citadel: 'citadel',
    Exile: 'exile',
    Thrust: 'thrust',
    'Snapper-v1-alt': 'snapper',
    Uridium: 'uridium',
    // BBC Master
    EliteMaster: 'master-elite',
    LastNinja2: 'master-ninja2',
    Repton3: 'master-repton3',
    ReptonInfinity: 'master-reptoninf',
    Firetrack: 'master-firetrak',
    CrazeeRider: 'master-crazee',
    StrykersRun: 'master-stryker',
    ByFairMeansOrFoul: 'master-bfmof',
    HoledOut: 'master-holedout',
    Ballistix: 'master-ballistx',
  };

  var disc = new URLSearchParams(location.search).get('disc1');
  if (!disc) return;
  var name = disc
    .split('/')
    .pop()
    .replace(/\.[^.]+$/, '');
  var key = DISC_TO_KEY[name];
  if (!key) return;
  var a = document.querySelector('.gx-controls-link');
  // dist/index.html lives at systems/jsbeeb/dist/, so gamedocs/ is three
  // levels up (dist -> jsbeeb -> systems -> repo root).
  if (a) a.href = '../../../gamedocs/jsbeeb/' + key + '.html';
})();
