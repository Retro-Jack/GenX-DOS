// SPDX-License-Identifier: GPL-3.0-or-later
// Part of GenX-DOS. This file runs alongside GPL-licensed emulator
// engines, so it is GPL-3.0-or-later rather than the repo's CC BY-NC.
// GenX-DOS — consistent "audio suspended" banner for every system.
//
// Browsers block autoplay until a user gesture, so an engine's AudioContext
// starts life 'suspended' and stays silent until the user clicks or presses a
// key. jsbeeb ships its own visible prompt for this; this script gives every
// OTHER bundle the same one: a fixed banner across the top of the window
// whenever any AudioContext is suspended, cleared (and the context resumed) on
// the first click / keypress.
//
// It works by wrapping the AudioContext constructor to track the contexts the
// engine creates, so it MUST run before the engine makes its context — load it
// as a plain <script> early in <head> (NOT deferred).
(function () {
  if (window.__genxAudioBanner) return; // idempotent
  window.__genxAudioBanner = true;

  var contexts = [];
  function track(ctx) {
    if (ctx && contexts.indexOf(ctx) < 0) contexts.push(ctx);
    return ctx;
  }

  // Wrap AudioContext / webkitAudioContext so every context the engine makes is
  // tracked. A Proxy preserves the original constructor completely.
  ['AudioContext', 'webkitAudioContext'].forEach(function (name) {
    var Orig = window[name];
    if (typeof Orig !== 'function') return;
    try {
      window[name] = new Proxy(Orig, {
        construct: function (target, args) {
          return track(Reflect.construct(target, args));
        },
      });
    } catch (e) {
      /* Proxy/Reflect unsupported — leave the constructor untouched. */
    }
  });

  var banner;
  function makeBanner() {
    if (banner || !document.body) return banner;
    banner = document.createElement('div');
    banner.id = 'genx-audio-banner';
    banner.textContent =
      'Your browser has suspended audio -- mouse click or key press for sound.';
    // pointer-events:none so the banner never blocks the game beneath it; any
    // click still bubbles to the document handler below and resumes audio.
    banner.style.cssText = [
      'position:fixed',
      'top:0',
      'left:0',
      'width:100%',
      'box-sizing:border-box',
      'padding:8px 12px',
      'margin:0',
      'z-index:100000',
      'text-align:center',
      'font:bold 15px/1.4 system-ui,Arial,sans-serif',
      'color:#fff',
      'background:#e0912a',
      'cursor:pointer',
      'user-select:none',
      'pointer-events:none',
      'display:none',
    ].join(';');
    document.body.appendChild(banner);
    return banner;
  }

  function anySuspended() {
    for (var i = 0; i < contexts.length; i++) {
      if (contexts[i] && contexts[i].state === 'suspended') return true;
    }
    return false;
  }

  function update() {
    var b = makeBanner();
    if (!b) return;
    var show = anySuspended();
    b.style.display = show ? 'block' : 'none';
    // Publish the banner's height so anything pinned to the top of the screen
    // can sit below it. The banner is fixed at top:0 with a very high z-index,
    // so a soft-key button at top:8px is simply buried underneath while audio
    // is suspended — which is exactly when a player is looking for it. Reading
    // this variable is cheaper and less fragile than each script hunting for
    // the banner element itself.
    document.documentElement.style.setProperty(
      '--gx-banner-h',
      show ? b.offsetHeight + 'px' : '0px',
    );
  }

  function resumeAll() {
    for (var i = 0; i < contexts.length; i++) {
      var c = contexts[i];
      if (c && c.state === 'suspended' && c.resume) {
        try {
          c.resume();
        } catch (e) {}
      }
    }
    setTimeout(update, 50);
  }

  function start() {
    makeBanner();
    setInterval(update, 400);
    ['pointerdown', 'mousedown', 'keydown', 'touchstart'].forEach(function (t) {
      document.addEventListener(t, resumeAll, true);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
