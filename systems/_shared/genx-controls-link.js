// SPDX-License-Identifier: GPL-3.0-or-later
// Part of GenX-DOS. This file runs alongside GPL-licensed emulator
// engines, so it is GPL-3.0-or-later rather than the repo's CC BY-NC.
//
// Injects the two top-corner links into every emulator's entry HTML:
//
//   top-left   game controls -> this game's gamedoc           (how to play
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
// Skipped entirely if a `.gx-corner-link` or legacy `.gx-controls-link`
// element already exists, so a bundle that needs its own placement can opt
// out by providing one.
(function () {
  if (document.querySelector('.gx-corner-link, .gx-controls-link')) return;

  var p = new URLSearchParams(location.search);
  var key = p.get('game') || p.get('tape') || p.get('rom') || '';
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
    a.innerHTML = '<span class="gx-l1">' + l1 + '</span>' +
                  '<span class="gx-l2">' + l2 + ICON + '</span>';
    document.body.appendChild(a);
  }

  if (key) {
    link('gx-left', '../../docs/games/' + platform + '/' + key + '.html', 'Game', 'controls');
  }
  link('gx-right', 'controls.html', 'System', 'help');
})();
