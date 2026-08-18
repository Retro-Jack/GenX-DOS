// SPDX-License-Identifier: GPL-3.0-or-later
// Part of GenX-DOS. This file runs alongside GPL-licensed emulator
// engines, so it is GPL-3.0-or-later rather than the repo's CC BY-NC.
// Decides whether a given game gets a given soft key.
//
// A soft key exists to surface a machine key a player cannot guess — the
// TRS-80's CLEAR, the BBC's COPY. Showing one on a game that never asks for
// that key is noise, and worse, it implies the game wants it: a player sitting
// at Robot Attack pressing CLEAR because there is a button for it learns
// nothing except that the button does nothing.
//
// So the button appears only where the game's own page says the key is used.
// That map is generated from the gamedocs' Controls tables by
// tools/build-softkey-map.py into softkeys.json beside this file, so the two
// cannot drift: add a CLEAR row to a gamedoc and the button appears next build.
//
// FAILS OPEN. If the map can't be fetched, every soft key is shown. Hiding the
// only discoverable way to start a game because a JSON request failed is a far
// worse outcome than one harmless extra button, and six of the ten TRS-80
// games genuinely cannot be started any other way a visitor would find.
//
// Usage, from a soft-key script:
//   GenXSoftKeys.allowed('trs80', gameKey, 'CLEAR').then(function (ok) {
//     if (ok) build();
//   });
(function () {
  // Resolve softkeys.json against THIS script's own URL rather than the page's.
  // The pages that use it sit at different depths — systems/trs80/play.html and
  // systems/bbcmicro/dist/index.html — so a path relative to the document would
  // have to differ per bundle, which is exactly the sort of thing that rots.
  var here = document.currentScript && document.currentScript.src;
  var url = here
    ? here.replace(/[^/]*$/, 'softkeys.json')
    : '../_shared/softkeys.json';

  var pending = null;

  var load = function () {
    if (!pending) {
      pending = fetch(url)
        .then(function (r) {
          if (!r.ok) throw new Error('HTTP ' + r.status);
          return r.json();
        })
        .catch(function () {
          return null; // fail open — see the note above
        });
    }
    return pending;
  };

  window.GenXSoftKeys = {
    allowed: function (system, game, key) {
      // No game loaded (a bare-machine boot) — there is nothing to consult, and
      // a player at a BASIC prompt may well want the key. Show it.
      if (!system || !game) return Promise.resolve(true);
      return load().then(function (map) {
        if (!map) return true;
        var keys = map[system + '/' + game];
        return !!keys && keys.indexOf(key) !== -1;
      });
    },
  };
})();
