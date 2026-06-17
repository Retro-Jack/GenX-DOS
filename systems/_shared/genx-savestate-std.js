// GenX-DOS save/load-state buttons for the standalone (non-EmulatorJS) bundles.
// The EmulatorJS bundles use genx-savestate.js (gated on window.EJS_emulator);
// this is the parallel for engines that expose their own JS save-state API.
//
// A bundle opts in by setting window.GenXStateAdapter BEFORE this script runs
// (or any time before the engine is ready):
//
//   window.GenXStateAdapter = {
//     ready:    function () { return <engine booted & state API present>; },
//     getState: function () { return <JSON-serializable snapshot>; },
//     setState: function (snap) { <restore snapshot>; },
//     refocus:  function () { <hand keyboard focus back to the canvas>; }  // optional
//   };
//
// getState may return any JSON-serializable value (most engines return a plain
// object); for binary snapshots the adapter should base64-encode to a string.
// The slot is kept in memory for the session and mirrored to localStorage
// (per platform+game) so it also survives a reload. Buttons match the EJS ones.
(function () {
  if (document.querySelector('.gx-state-bar')) return;

  var slot = null; // in-memory snapshot for this session
  var p = new URLSearchParams(location.search);
  var key = p.get('game') || p.get('tape') || p.get('rom') || p.get('disk') || 'state';
  var platform = location.pathname.replace(/.*\/systems\//, '').replace(/\/.*/, '');
  var lsKey = 'gx-state:' + platform + ':' + key;

  function adapter() { return window.GenXStateAdapter; }
  function ready() { var a = adapter(); return !!(a && typeof a.getState === 'function' && (!a.ready || a.ready())); }
  function refocus() { var a = adapter(); try { if (a && a.refocus) a.refocus(); } catch (x) {} }

  // Engines often return live references inside getState() (e.g. js99er hands
  // back `this.ram` directly), so a saved snapshot would keep mutating with the
  // running machine. Deep-clone on the way in and out so the slot is frozen and
  // never aliases the engine. structuredClone preserves typed arrays; the
  // tagged JSON below does the same for localStorage (plain JSON loses them).
  function clone(x) {
    try { if (window.structuredClone) return structuredClone(x); } catch (e) {}
    return jParse(jStringify(x));
  }
  var TA = ['Int8Array','Uint8Array','Uint8ClampedArray','Int16Array','Uint16Array','Int32Array','Uint32Array','Float32Array','Float64Array'];
  function jStringify(v) {
    return JSON.stringify(v, function (k, val) {
      if (ArrayBuffer.isView(val) && !(val instanceof DataView)) {
        return { __ta__: val.constructor.name, d: Array.prototype.slice.call(val) };
      }
      return val;
    });
  }
  function jParse(s) {
    return JSON.parse(s, function (k, val) {
      if (val && val.__ta__ && TA.indexOf(val.__ta__) !== -1) {
        return new (window[val.__ta__])(val.d);
      }
      return val;
    });
  }

  function flash(btn, msg) {
    var label = btn.dataset.label, t = btn.querySelector('.gx-state-txt');
    t.textContent = msg; btn.classList.add('gx-state-flash');
    setTimeout(function () { t.textContent = label; btn.classList.remove('gx-state-flash'); }, 850);
  }

  function doSave(btn) {
    try {
      var st = adapter().getState();
      if (st === undefined || st === null) { flash(btn, 'no state'); return; }
      slot = clone(st); // freeze a copy so the slot doesn't track the live machine
      try { localStorage.setItem(lsKey, jStringify(st)); } catch (e) { /* quota — keep in-memory only */ }
      flash(btn, 'saved');
    } catch (e) { console.error('[gx-state] save failed:', e); flash(btn, 'failed'); }
    refocus();
  }
  function doLoad(btn) {
    var st = slot;
    if (st === null) { try { var b = localStorage.getItem(lsKey); if (b) st = jParse(b); } catch (e) {} }
    if (st === null || st === undefined) { flash(btn, 'no save'); return; }
    // Hand the engine a fresh clone so it can't alias (and mutate) our slot.
    try { adapter().setState(clone(st)); flash(btn, 'loaded'); } catch (e) { console.error('[gx-state] load failed:', e); flash(btn, 'failed'); }
    refocus();
  }

  var ICON = {
    save: '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M5.5 1h1v5.1l1.6-1.6.7.7L6 7.9 3.2 5.2l.7-.7L5.5 6.1zM2 9h8v1.5a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5z"/></svg>',
    load: '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M6 1.1l2.8 2.7-.7.7L6.5 2.9V8h-1V2.9L3.9 4.5l-.7-.7zM2 9h8v1.5a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5z"/></svg>'
  };

  function mkBtn(label, cls, icon, onClick) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'gx-state-btn ' + cls;
    b.dataset.label = label;
    b.innerHTML = '<span class="gx-state-txt">' + label + '</span>' + icon;
    b.addEventListener('click', function () { onClick(b); b.blur(); });
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
    if (ready()) { clearInterval(iv); init(); }
    else if (++tries > 600) clearInterval(iv); // ~60s; no adapter / never ready → give up silently
  }, 100);
})();
