// SPDX-License-Identifier: GPL-3.0-or-later
// Part of GenX-DOS. This file runs alongside GPL-licensed emulator
// engines, so it is GPL-3.0-or-later rather than the repo's CC BY-NC.
// Shared USB-gamepad → keyboard shim for standalone engines that have no
// Gamepad API support of their own (the SDL-based WASM builds and
// EmulatorJS bundles read pads natively and don't need this).
//
// The page defines its key map BEFORE loading this script:
//
//   window.GenXGamepadMap = {
//     axes: {                       // left stick ± / d-pad (buttons 12-15)
//       left:  { key: 'ArrowLeft',  code: 'ArrowLeft',  keyCode: 37 },
//       right: { key: 'ArrowRight', code: 'ArrowRight', keyCode: 39 },
//       up:    { key: 'ArrowUp',    code: 'ArrowUp',    keyCode: 38 },
//       down:  { key: 'ArrowDown',  code: 'ArrowDown',  keyCode: 40 },
//     },
//     buttons: {                    // pad button index → key
//       0: { key: ' ', code: 'Space', keyCode: 32 },
//     },
//     target: document,             // optional dispatch target — an element,
//                                   // or a function returning one (resolved
//                                   // per event, for elements the engine
//                                   // only injects after it boots)
//   };
//
// Pad 0 is polled each frame; edges are translated into synthetic
// keydown/keyup events. An idle pad sends nothing, so keyboard play is
// unaffected until the pad is actually used.
(function () {
  var map = window.GenXGamepadMap;
  if (!map) return;
  var PRESS = 0.5;
  var RELEASE = 0.3;
  var state = {};

  // Add ?paddebug to the page URL for an on-screen log of every synthetic
  // key event the shim sends (and where it sends it).
  var DEBUG = /[?&]paddebug\b/.test(location.search);
  var dbg;
  function debugLog(line) {
    if (!DEBUG) return;
    if (!dbg) {
      dbg = document.createElement('pre');
      dbg.style.cssText =
        'position:fixed;left:8px;top:8px;z-index:99999;' +
        'background:rgba(0,0,0,.85);color:#0f0;font:14px/1.4 monospace;' +
        'padding:6px 10px;margin:0;pointer-events:none';
      document.body.appendChild(dbg);
    }
    dbg.textContent = (line + '\n' + dbg.textContent)
      .split('\n')
      .slice(0, 18)
      .join('\n');
  }

  // Debug heartbeat: prove the shim is alive and show whether the browser
  // is exposing a pad at all (pads only appear after a button is pressed
  // while the page is focused). Refreshes once a second.
  if (DEBUG) {
    debugLog('shim alive, map loaded');
    setInterval(function () {
      var pads = navigator.getGamepads ? navigator.getGamepads() : [];
      var p = null;
      for (var i = 0; i < pads.length; i++) {
        if (pads[i]) {
          p = pads[i];
          break;
        }
      }
      debugLog(
        p ? 'pad: ' + p.id.slice(0, 40) : 'pad: none visible (press a button)',
      );
    }, 1000);
  }

  function target() {
    var t = map.target;
    if (typeof t === 'function') t = t();
    return t || document;
  }

  function sendOne(key, down) {
    var el = target();
    debugLog(
      (down ? 'DOWN ' : 'UP   ') +
        JSON.stringify(key.key) +
        ' keyCode=' +
        key.keyCode +
        ' -> ' +
        (el === document ? 'document' : '<' + el.tagName.toLowerCase() + '>'),
    );
    el.dispatchEvent(
      new KeyboardEvent(down ? 'keydown' : 'keyup', {
        key: key.key,
        code: key.code,
        keyCode: key.keyCode,
        which: key.keyCode,
        bubbles: true,
        cancelable: true,
      }),
    );
  }

  // A mapping value may be a single { key, code, keyCode } or an ARRAY of
  // them. An array presses (and releases) several keys together on one edge —
  // for games whose "up"/"down"/etc. is really two keyboard keys held at once
  // (e.g. 3D Defender's four-zone joystick emulation).
  function send(keys, down) {
    if (Array.isArray(keys)) {
      for (var i = 0; i < keys.length; i++) sendOne(keys[i], down);
    } else {
      sendOne(keys, down);
    }
  }

  function set(name, key, want) {
    if (!!state[name] !== want) {
      state[name] = want;
      send(key, want);
    }
  }

  function poll() {
    var pads = navigator.getGamepads ? navigator.getGamepads() : [];
    var p = null;
    for (var i = 0; i < pads.length; i++) {
      if (pads[i]) {
        p = pads[i];
        break;
      }
    }
    if (p) {
      var b = p.buttons || [];
      function pressed(i) {
        return !!(b[i] && b[i].pressed);
      }
      if (map.axes) {
        var ax = p.axes[0] || 0;
        var ay = p.axes[1] || 0;
        // Hysteresis: a held direction releases at a lower deflection than
        // it pressed at, so a stick hovering near the threshold can't
        // machine-gun keydown/keyup pairs into the emulator.
        function beyond(name, v) {
          return v > (state[name] ? RELEASE : PRESS);
        }
        if (map.axes.left)
          set('left', map.axes.left, beyond('left', -ax) || pressed(14));
        if (map.axes.right)
          set('right', map.axes.right, beyond('right', ax) || pressed(15));
        if (map.axes.up)
          set('up', map.axes.up, beyond('up', -ay) || pressed(12));
        if (map.axes.down)
          set('down', map.axes.down, beyond('down', ay) || pressed(13));
      }
      if (map.buttons) {
        for (var idx in map.buttons) {
          set('b' + idx, map.buttons[idx], pressed(+idx));
        }
      }
    }
    requestAnimationFrame(poll);
  }
  requestAnimationFrame(poll);
})();
