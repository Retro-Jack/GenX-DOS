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
//     target: document,             // optional dispatch target
//   };
//
// Pad 0 is polled each frame; edges are translated into synthetic
// keydown/keyup events. An idle pad sends nothing, so keyboard play is
// unaffected until the pad is actually used.
(function () {
  var map = window.GenXGamepadMap;
  if (!map) return;
  var target = map.target || document;
  var DEAD = 0.4;
  var state = {};

  function send(key, down) {
    target.dispatchEvent(
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
        if (map.axes.left)
          set('left', map.axes.left, ax < -DEAD || pressed(14));
        if (map.axes.right)
          set('right', map.axes.right, ax > DEAD || pressed(15));
        if (map.axes.up) set('up', map.axes.up, ay < -DEAD || pressed(12));
        if (map.axes.down) set('down', map.axes.down, ay > DEAD || pressed(13));
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
