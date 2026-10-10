// SPDX-License-Identifier: GPL-3.0-or-later
// Part of GenX-DOS. This file runs alongside GPL-licensed emulator
// engines, so it is GPL-3.0-or-later rather than the repo's CC BY-NC.
//
// Injects the two top-corner links into every emulator's entry HTML:
//
//   top-left   program controls -> this entry's gamedoc        (how to drive
//                               whatever is loaded: a game, or a machine's
//                               own BASIC or DOS prompt)
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
// EVERY LAUNCHER KEY NOW HAS A PAGE. This list was the ten firmware prompts --
// BASIC on the Commodore and Atari machines, LDOS and TRSDOS on the TRS-80 --
// whose left-hand link pointed at a gamedoc that did not exist, so it 404'd.
// They have pages of their own now and the list is empty, but it stays as the
// mechanism: an entry here is `platform/key`, and check-doc-counts.sh holds it
// to the tree in both directions, so a launcher added without a page fails the
// check rather than shipping another dead link.
var NO_GAMEDOC = [];

// A KEYLESS URL IS THE BARE MACHINE, AND THAT HAS A PAGE TOO. Thirteen entries
// launch with no key at all -- the BBC pages go out as `?disc1=blank.ssd`, the
// rest as a plain `play.html` -- because the bare machine is the point: it
// comes up in its own BASIC, monitor or startup menu. That is a program like
// any other and is documented like one, so when nothing else supplies a key
// these stand in. Bundles that publish `window.GENX_GAME_KEY` for a real game
// still win, and the three that publish an empty string or null when there is
// no game (apple2, cpc, and the two BBC mappers) fall through to here exactly
// as intended. check-doc-counts.sh holds this map to the tree.
var BARE_KEY = {
  apple1: 'monitor',
  apple2: 'basic',
  bbcmaster: 'basic',
  bbcmicro: 'basic',
  cpc: 'basic',
  electron: 'basic',
  js99er: 'basic',
  jsspeccy: 'basic',
  jtyone: 'basic',
  m100: 'menu',
  msx1: 'basic',
  msx2: 'basic',
  xroar: 'basic',
};
(function () {
  if (document.querySelector('.gx-corner-link, .gx-controls-link')) return;

  var me = document.currentScript;
  var ROOT =
    me && me.src
      ? me.src.replace(/systems\/_shared\/genx-controls-link\.js.*$/, '')
      : '../../';

  var p = new URLSearchParams(location.search);
  var platform = location.pathname
    .replace(/.*\/systems\//, '')
    .replace(/\/.*/, '');
  var key =
    (typeof window.GENX_GAME_KEY === 'string' && window.GENX_GAME_KEY) ||
    p.get('game') ||
    p.get('tape') ||
    p.get('rom') ||
    BARE_KEY[platform] ||
    '';

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
      'Program',
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
