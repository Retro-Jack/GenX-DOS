// GenX-DOS save/load-state buttons for EmulatorJS bundles.
// The EmulatorJS toolbar is hidden site-wide (genx-frame.css hides
// .ejs_menu_bar / .ejs_context_menu), so this re-exposes just Save State and
// Load State as two GenX-styled buttons (same look as the 'controls' link,
// bottom-left). EJS-only: everything is gated on window.EJS_emulator, so the
// script is a harmless no-op on non-EJS bundles (it gives up after ~60s).
//
// Save uses EJS_emulator.gameManager.getState() (a Uint8Array); Load uses
// gameManager.loadState(state). The slot is kept in memory for the session and
// mirrored to localStorage (per platform+game) so it also survives a reload.
(function () {
  if (document.querySelector('.gx-state-bar')) return;

  var slot = null; // in-memory state (Uint8Array) for this session
  var p = new URLSearchParams(location.search);
  var key = p.get('game') || p.get('tape') || p.get('rom') || 'state';
  var platform = location.pathname
    .replace(/.*\/systems\//, '')
    .replace(/\/.*/, '');
  var lsKey = 'gx-state:' + platform + ':' + key;

  function emu() {
    return window.EJS_emulator;
  }
  function ready() {
    var e = emu();
    return e && e.gameManager && typeof e.gameManager.getState === 'function';
  }

  // chunked to avoid call-stack overflow on large states
  function toB64(u8) {
    var s = '',
      C = 0x8000;
    for (var i = 0; i < u8.length; i += C)
      s += String.fromCharCode.apply(null, u8.subarray(i, i + C));
    return btoa(s);
  }
  function fromB64(b) {
    var s = atob(b),
      u8 = new Uint8Array(s.length);
    for (var i = 0; i < s.length; i++) u8[i] = s.charCodeAt(i);
    return u8;
  }

  // EJS attaches its keydown/keyup listener to elements.parent and only reads
  // keys while that element holds focus, so hand focus back there (clicking a
  // button moves it off) — not to the canvas.
  function refocus() {
    try {
      var e = emu();
      var el =
        (e && e.elements && e.elements.parent) ||
        (e && e.canvas) ||
        document.querySelector('#game canvas, canvas');
      if (el && el.focus) el.focus({ preventScroll: true });
    } catch (x) {}
  }

  // The mirrored EJS cores are an older build: they expose save_state_info
  // (returns "ptr|len|status", state read from the WASM HEAP), NOT the newer
  // Module.EmulatorJSGetState() that the bundled GameManager src calls — so the
  // src getState() throws here. Read the state directly from the core instead.
  function getStateBytes() {
    var e = emu();
    if (!e.gameManager._gxInfo)
      e.gameManager._gxInfo = e.Module.cwrap('save_state_info', 'string', []);
    var parts = e.gameManager._gxInfo().split('|'); // "length|pointer|status"
    if (parts[2] !== '1') throw new Error(parts[0] || 'state unsupported');
    var len = parseInt(parts[0], 10),
      ptr = parseInt(parts[1], 10);
    return e.Module.HEAPU8.slice(ptr, ptr + len); // slice = copy (HEAP is reused)
  }

  // Self-contained load (mirrors the old min.js GameManager.loadState): write
  // the bytes to the WASM FS as game.state, then call the core's load_state.
  function setStateBytes(bytes) {
    var e = emu(),
      FS = e.Module.FS;
    try {
      FS.unlink('game.state');
    } catch (x) {}
    FS.writeFile('/game.state', bytes);
    if (!e.gameManager._gxLoad)
      e.gameManager._gxLoad = e.Module.cwrap('load_state', 'number', [
        'string',
        'number',
      ]);
    var r = e.gameManager._gxLoad('game.state', 0);
    setTimeout(function () {
      try {
        FS.unlink('game.state');
      } catch (x) {}
    }, 4000);
    return r;
  }

  function flash(btn, msg) {
    var label = btn.dataset.label,
      t = btn.querySelector('.gx-state-txt');
    t.textContent = msg;
    btn.classList.add('gx-state-flash');
    setTimeout(function () {
      t.textContent = label;
      btn.classList.remove('gx-state-flash');
    }, 850);
  }

  function doSave(btn) {
    try {
      var st = getStateBytes();
      if (!st || !st.length) {
        flash(btn, 'no state');
        return;
      }
      slot = st;
      try {
        localStorage.setItem(lsKey, toB64(st));
      } catch (e) {
        /* quota / too big — keep in-memory only */
      }
      flash(btn, 'saved');
    } catch (e) {
      console.error('[gx-state] save failed:', e);
      flash(btn, 'failed');
    }
    refocus();
  }
  function doLoad(btn) {
    var st = slot;
    if (!st) {
      try {
        var b = localStorage.getItem(lsKey);
        if (b) st = fromB64(b);
      } catch (e) {}
    }
    if (!st) {
      flash(btn, 'no save');
      return;
    }
    try {
      setStateBytes(st);
      flash(btn, 'loaded');
    } catch (e) {
      console.error('[gx-state] load failed:', e);
      flash(btn, 'failed');
    }
    refocus();
  }

  var ICON = {
    save: '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M5.5 1h1v5.1l1.6-1.6.7.7L6 7.9 3.2 5.2l.7-.7L5.5 6.1zM2 9h8v1.5a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5z"/></svg>',
    load: '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M6 1.1l2.8 2.7-.7.7L6.5 2.9V8h-1V2.9L3.9 4.5l-.7-.7zM2 9h8v1.5a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5z"/></svg>',
  };

  function mkBtn(label, cls, icon, onClick) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'gx-state-btn ' + cls;
    b.dataset.label = label;
    b.innerHTML = '<span class="gx-state-txt">' + label + '</span>' + icon;
    b.addEventListener('click', function () {
      onClick(b);
      b.blur();
    });
    return b;
  }

  function init() {
    if (document.querySelector('.gx-state-bar')) return;
    var bar = document.createElement('div');
    bar.className = 'gx-state-bar';
    bar.appendChild(mkBtn('save', 'gx-state-save', ICON.save, doSave));
    bar.appendChild(mkBtn('load', 'gx-state-load', ICON.load, doLoad));
    document.body.appendChild(bar);
  }

  var tries = 0;
  var iv = setInterval(function () {
    if (ready()) {
      clearInterval(iv);
      init();
    } else if (++tries > 600) clearInterval(iv); // ~60s; non-EJS page → give up silently
  }, 100);
})();
