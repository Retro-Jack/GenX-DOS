// SPDX-License-Identifier: GPL-3.0-or-later
// Part of GenX-DOS. This file runs alongside GPL-licensed emulator
// engines, so it is GPL-3.0-or-later rather than the repo's CC BY-NC.
// VICE RUN/STOP keyboard remap.
//
// Browsers capture Esc before the libretro keyboard callback can see it (it
// exits pointer-lock / fullscreen), so a real Esc never reaches VICE as
// RUN/STOP. This remaps Scroll Lock and Pause/Break to a synthetic Escape —
// synthetic events bypass the browser's Esc-capture because they aren't real
// user gestures, so the Escape reaches VICE cleanly as RUN/STOP. (RESTORE is
// the libretro default Page Up, which the browser doesn't capture, so it needs
// no remap.)
//
// No on-screen buttons: RUN/STOP and RESTORE aren't in-game keys — their real
// uses are the BASIC prompt (break a program) and the RUN/STOP+RESTORE reset —
// so the soft buttons were dropped as clutter. The keyboard routes stay.
//
// Include via one tag in each VICE play.html:
//   <script defer src="../_shared/genx-vice-softkeys.js"></script>
(function () {
  const fireEsc = () => {
    const init = {
      key: 'Escape',
      code: 'Escape',
      keyCode: 27,
      which: 27,
      bubbles: true,
      cancelable: true,
    };
    const targets = [document, window, document.body];
    const cv = document.querySelector('canvas');
    if (cv) targets.push(cv);
    for (const t of targets) {
      try {
        t.dispatchEvent(new KeyboardEvent('keydown', init));
        setTimeout(() => t.dispatchEvent(new KeyboardEvent('keyup', init)), 80);
      } catch (_) {
        /* swallow */
      }
    }
  };

  // Scroll Lock + Pause/Break both trigger RUN/STOP.
  const handler = (e) => {
    if (
      e.code === 'ScrollLock' ||
      e.key === 'ScrollLock' ||
      e.keyCode === 145 ||
      e.code === 'Pause' ||
      e.key === 'Pause' ||
      e.keyCode === 19
    ) {
      e.preventDefault();
      e.stopPropagation();
      fireEsc();
    }
  };
  document.addEventListener('keydown', handler, true);
  window.addEventListener('keydown', handler, true);
})();
