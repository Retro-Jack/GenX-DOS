// SPDX-License-Identifier: GPL-3.0-or-later
// Part of GenX-DOS. This file runs alongside GPL-licensed emulator
// engines, so it is GPL-3.0-or-later rather than the repo's CC BY-NC.
// Hold the emulator screen back until the bezel around it is in place.
//
// Every bundle draws a CRT/console bezel as an <img> layered over a screen
// hole, and positions the canvas inside that hole in percentages of the
// bezel's box. The bezel is a PNG, so it arrives after the first paint: for a
// moment the canvas is laid out against a box whose size isn't settled yet and
// shows up unframed, off-centre, or as a bare grey rectangle on the wallpaper.
// The Apple I and Atari 7800 were the most obvious, but every bundle does it
// to some degree.
//
// This hides the canvas until the bezel image has both loaded and been through
// a layout pass, then reveals it. The bezel and its black backdrop are left
// visible throughout, so the machine appears first and the screen lights up
// inside it — which is also the right order for a CRT.
//
// Deliberately loaded SYNCHRONOUSLY in <head>, not deferred: it injects the
// hiding rule itself rather than relying on a stylesheet, because six bundles
// don't load genx-frame.css. Running before the body is parsed is what makes
// it flash-free, and injecting the rule from here means a page can never end
// up hiding its canvas with no script around to reveal it again.
(function () {
  var READY = 'gx-bezel-ready';
  var root = document.documentElement;

  // The whole screen stack, not just the canvas: the black underlay is
  // positioned in percentages of the bezel's box too, so on its own it appears
  // as a black rectangle floating on the wallpaper before the bezel lands.
  // Hiding the pair means the machine, its screen hole and the picture all
  // arrive together. `.screen-bg` is the usual name, `.screen` is the Atari
  // 400/800 pair, and jsbeeb draws its backdrop as a pseudo-element.
  //
  // Nothing is hidden unless this script is alive to undo it.
  // The bezel image is hidden too, so the stack appears as one piece. Revealed
  // on its own load event, which fires regardless of visibility. Left out, the
  // frame would paint a couple of frames before its backdrop and show
  // wallpaper through the keyed-transparent screen hole.
  var HIDE = [
    'canvas',
    '.screen-bg',
    '.screen',
    '#cub-monitor::before',
    'img.bezel-img',
    '#cub-monitor-pic',
  ];
  var style = document.createElement('style');
  style.textContent =
    HIDE.map(function (sel) {
      return 'html:not(.' + READY + ') ' + sel;
    }).join(',\n') + ' { visibility: hidden !important; }';
  (document.head || root).appendChild(style);

  var done = false;
  function reveal() {
    if (done) return;
    done = true;
    root.classList.add(READY);
  }

  // Failsafe: never leave the screen hidden because a bezel 404'd, decoded
  // slowly, or a bundle turned out not to have one at all.
  setTimeout(reveal, 4000);

  function bezels() {
    return Array.prototype.slice.call(
      document.querySelectorAll(
        'img.bezel-img, #cub-monitor-pic, img[src*="/bezels/"]',
      ),
    );
  }

  function waitFor(imgs) {
    var pending = imgs.length;
    if (!pending) return reveal();
    imgs.forEach(function (img) {
      function settled() {
        if (--pending > 0) return;
        // One frame after the last bezel lands, so the canvas is measured
        // against the final box rather than the one being replaced.
        requestAnimationFrame(function () {
          requestAnimationFrame(reveal);
        });
      }
      if (img.complete) return settled();
      img.addEventListener('load', settled);
      img.addEventListener('error', settled); // a missing bezel must not hang it
    });
  }

  function start() {
    var found = bezels();
    if (found.length) return waitFor(found);
    // Some bundles build their frame after DOMContentLoaded, so give the
    // bezel a moment to appear before giving up and showing the screen.
    var tries = 0;
    var iv = setInterval(function () {
      var f = bezels();
      if (f.length) {
        clearInterval(iv);
        waitFor(f);
      } else if (++tries > 20 || done) {
        clearInterval(iv);
        reveal();
      }
    }, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
