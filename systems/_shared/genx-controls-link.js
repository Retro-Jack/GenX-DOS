// SPDX-License-Identifier: GPL-3.0-or-later
// Part of GenX-DOS. This file runs alongside GPL-licensed emulator
// engines, so it is GPL-3.0-or-later rather than the repo's CC BY-NC.
//
// Injects the two top-corner links into every emulator's entry HTML:
//
//   top-left   gameplay controls -> this game's gamedoc       (how to play
//                               the loaded title)
//   top-right  system help   -> this bundle's controls.html  (the machine:
//                               keyboard map, soft keys, quirks)
//
// These used to be a single bottom-right link that pointed at ONE of the two
// depending on whether a ?game= key was present — so a player reading a
// game's page had no route to the machine's keyboard map, and a player on the
// machine page had no route back to the game. They answer different questions
// and are now both reachable at once.
//
// The left-hand link is only created when there is a game to point at. A
// keyless URL boots the bare machine, which has no gamedoc.
//
// WHERE THE KEY COMES FROM. Normally the live URL: ?game=, ?tape= or ?rom=.
// Some bundles rewrite their URL on load — apple2 turns ?game= into the
// ?disk= its engine expects, the CPC folds it into sokol_args, the BBC pages
// launch with a keyless ?disc1= and never carry a key at all. Those pages set
// `window.GENX_GAME_KEY` synchronously, before this deferred script runs, and
// it wins over the URL. That replaced three separate inline copies of this
// file's link-building, one per bundle, each of which had drifted.
//
// WHERE THE LINKS POINT. Both hrefs are resolved from this script's own src
// rather than written relative to the page, because the pages sit at
// different depths: systems/<bundle>/play.html for most, but
// systems/<bundle>/dist/index.html for the Vite builds, where a relative
// ../../ lands a level short.
//
// Skipped entirely if a `.gx-corner-link` or legacy `.gx-controls-link`
// element already exists, so a bundle that needs its own placement can opt
// out by providing one.
//
// FIRMWARE PROMPTS GET NO GAMEPLAY LINK. A handful of launchers carry a key
// that names a machine's own firmware rather than a game -- BASIC on the
// Commodore and Atari machines, LDOS and TRSDOS on the TRS-80. They are not
// games, they have no gamedoc, and a left-hand link built for them pointed at
// a page that does not exist: ten launchers, ten 404s, live and unnoticed
// because the corner link looks the same whether or not its target is there.
// Listed as platform/key so a real game called `basic` on some future machine
// would still get its link. check-doc-counts.sh holds this list to the tree,
// so adding a firmware entry without a gamedoc fails the check rather than
// shipping another dead link.
var NO_GAMEDOC = [
  'atari400/basic',
  'atari800/basic',
  'c16/basic',
  'c64/basic',
  'max/basic',
  'pet/basic',
  'plus4/basic',
  'vic20/basic',
  'trs80/ldos',
  'trs80/trsdos',
];
(function () {
  if (document.querySelector('.gx-corner-link, .gx-controls-link')) return;

  var me = document.currentScript;
  var ROOT =
    me && me.src
      ? me.src.replace(/systems\/_shared\/genx-controls-link\.js.*$/, '')
      : '../../';

  var p = new URLSearchParams(location.search);
  var key =
    (typeof window.GENX_GAME_KEY === 'string' && window.GENX_GAME_KEY) ||
    p.get('game') ||
    p.get('tape') ||
    p.get('rom') ||
    '';
  var platform = location.pathname
    .replace(/.*\/systems\//, '')
    .replace(/\/.*/, '');

  // the box-arrow used on both, matching the old single link
  var ICON =
    '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M6 1h5v5L8.86 3.85 4.7 8 4 7.3l4.15-4.16zM2 3h2v1H2v6h6V8h1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1"/></svg>';

  // Two lines: the first word sits above, the second carries the icon. Split
  // this way the label reads as a small heading in the corner rather than a
  // long horizontal strip across the top of the picture.
  function link(cls, href, l1, l2) {
    var a = document.createElement('a');
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener';
    a.className = 'gx-corner-link ' + cls;
    a.innerHTML =
      '<span class="gx-l1">' +
      l1 +
      '</span>' +
      '<span class="gx-l2">' +
      l2 +
      ICON +
      '</span>';
    document.body.appendChild(a);
  }

  if (key && NO_GAMEDOC.indexOf(platform + '/' + key) === -1) {
    link(
      'gx-left',
      ROOT + 'docs/games/' + platform + '/' + key + '.html',
      'Gameplay',
      'controls',
    );
  }
  link(
    'gx-right',
    ROOT + 'systems/' + platform + '/controls.html',
    'System',
    'help',
  );
})();
