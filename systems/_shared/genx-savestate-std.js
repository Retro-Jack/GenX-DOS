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
// getState may return any structured-cloneable value (most engines return a
// plain object or a Uint8Array). There are FIVE save slots per game: the Save
// and Load buttons each open a drop-up menu of the five slots (showing
// empty/used). Slots are kept in memory for the session and persisted to
// IndexedDB (keyed per platform+game+slot) so they survive a reload — and so
// different games keep independent saves.
(function () {
  if (document.querySelector('.gx-state-bar')) return;

  var SLOTS = 5;
  var mem = {}; // in-memory snapshots per slot for this session
  var filledSet = {}; // slot -> bool (has a save)

  var p = new URLSearchParams(location.search);
  var key =
    p.get('game') ||
    p.get('tape') ||
    p.get('rom') ||
    p.get('disk') ||
    p.get('disc1') ||
    'state';
  var platform = location.pathname
    .replace(/.*\/systems\//, '')
    .replace(/\/.*/, '');
  function slotKey(n) {
    return platform + ':' + key + ':' + n;
  }

  // --- IndexedDB persistence (one object store, keyed platform:game:slot) -----
  var DB_NAME = 'gx-savestate',
    STORE = 'slots',
    _db;
  function idb() {
    if (_db) return _db;
    _db = new Promise(function (resolve) {
      if (!window.indexedDB) return resolve(null);
      var r;
      try {
        r = indexedDB.open(DB_NAME, 1);
      } catch (e) {
        return resolve(null);
      }
      r.onupgradeneeded = function () {
        if (!r.result.objectStoreNames.contains(STORE))
          r.result.createObjectStore(STORE);
      };
      r.onsuccess = function () {
        resolve(r.result);
      };
      r.onerror = function () {
        resolve(null);
      };
    });
    return _db;
  }
  function idbReq(req) {
    return new Promise(function (resolve, reject) {
      req.onsuccess = function () {
        resolve(req.result);
      };
      req.onerror = function () {
        reject(req.error);
      };
    });
  }
  async function idbGet(k) {
    var db = await idb();
    if (!db) return undefined;
    try {
      return await idbReq(
        db.transaction(STORE, 'readonly').objectStore(STORE).get(k),
      );
    } catch (e) {
      return undefined;
    }
  }
  async function idbPut(k, v) {
    var db = await idb();
    if (!db) return false;
    try {
      await idbReq(
        db.transaction(STORE, 'readwrite').objectStore(STORE).put(v, k),
      );
      return true;
    } catch (e) {
      return false;
    }
  }
  async function idbKeys() {
    var db = await idb();
    if (!db) return [];
    try {
      return (
        (await idbReq(
          db.transaction(STORE, 'readonly').objectStore(STORE).getAllKeys(),
        )) || []
      );
    } catch (e) {
      return [];
    }
  }

  function adapter() {
    return window.GenXStateAdapter;
  }
  function ready() {
    var a = adapter();
    return !!(a && typeof a.getState === 'function' && (!a.ready || a.ready()));
  }
  function refocus() {
    var a = adapter();
    try {
      if (a && a.refocus) a.refocus();
    } catch (x) {}
  }

  // Engines often return live references inside getState() (e.g. js99er hands
  // back `this.ram` directly), so a saved snapshot would keep mutating with the
  // running machine. Deep-clone on the way in and out so the slot is frozen and
  // never aliases the engine. structuredClone preserves typed arrays; the tagged
  // JSON below does the same in the fallback path (plain JSON loses them).
  function clone(x) {
    try {
      if (window.structuredClone) return structuredClone(x);
    } catch (e) {}
    return jParse(jStringify(x));
  }
  var TA = [
    'Int8Array',
    'Uint8Array',
    'Uint8ClampedArray',
    'Int16Array',
    'Uint16Array',
    'Int32Array',
    'Uint32Array',
    'Float32Array',
    'Float64Array',
  ];
  function jStringify(v) {
    return JSON.stringify(v, function (k, val) {
      if (ArrayBuffer.isView(val) && !(val instanceof DataView)) {
        return {
          __ta__: val.constructor.name,
          d: Array.prototype.slice.call(val),
        };
      }
      return val;
    });
  }
  function jParse(s) {
    return JSON.parse(s, function (k, val) {
      if (val && val.__ta__ && TA.indexOf(val.__ta__) !== -1) {
        return new window[val.__ta__](val.d);
      }
      return val;
    });
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

  // getState/setState may be sync (most engines) or async (atari800 defers
  // through its frame loop); `await` handles both.
  async function doSave(n, btn) {
    try {
      var st = await adapter().getState();
      if (st === undefined || st === null) {
        flash(btn, 'no state');
        return;
      }
      var frozen = clone(st); // freeze a copy so the slot doesn't track the live machine
      mem[n] = frozen;
      await idbPut(slotKey(n), frozen);
      filledSet[n] = true;
      renderStatus();
      flash(btn, 'saved ' + n);
    } catch (e) {
      console.error('[gx-state] save failed:', e);
      flash(btn, 'failed');
    }
    refocus();
  }
  async function doLoad(n, btn) {
    var st = mem[n];
    if (st === null || st === undefined) {
      try {
        st = await idbGet(slotKey(n));
      } catch (e) {}
    }
    if (st === null || st === undefined) {
      flash(btn, 'no save');
      return;
    }
    // Hand the engine a fresh clone so it can't alias (and mutate) our slot.
    try {
      await adapter().setState(clone(st));
      mem[n] = st;
      flash(btn, 'loaded ' + n);
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

  // --- Drop-up slot menus ----------------------------------------------------
  var menus = [];
  function renderStatus() {
    menus.forEach(function (m) {
      for (var n = 1; n <= SLOTS; n++) {
        var r = m.rows[n],
          used = !!filledSet[n];
        r.textContent = n + (used ? ' used' : ' vacant');
        r.classList.toggle('gx-state-used', used);
      }
    });
  }
  function closeAll() {
    menus.forEach(function (m) {
      m.wrap.classList.remove('open');
    });
  }
  function mkMenu(kind, label, icon, onPick) {
    var wrap = document.createElement('div');
    wrap.className = 'gx-state-menu';
    var pop = document.createElement('div');
    pop.className = 'gx-state-pop';
    var toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'gx-state-btn gx-state-' + kind;
    toggle.dataset.label = label;
    toggle.innerHTML = '<span class="gx-state-txt">' + label + '</span>' + icon;
    var rows = {};
    for (var n = 1; n <= SLOTS; n++) {
      (function (n) {
        var r = document.createElement('button');
        r.type = 'button';
        r.className = 'gx-state-slot';
        r.addEventListener('click', function (e) {
          e.stopPropagation();
          closeAll();
          onPick(n, toggle); // load on an empty slot just flashes "no save"
        });
        rows[n] = r;
        pop.appendChild(r);
      })(n);
    }
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = wrap.classList.contains('open');
      closeAll();
      if (!open) wrap.classList.add('open');
    });
    wrap.appendChild(pop);
    wrap.appendChild(toggle);
    menus.push({ wrap: wrap, rows: rows, kind: kind });
    return wrap;
  }

  async function init() {
    if (document.querySelector('.gx-state-bar')) return;
    var bar = document.createElement('div');
    bar.className = 'gx-state-bar';
    bar.appendChild(mkMenu('save', 'save', ICON.save, doSave));
    bar.appendChild(mkMenu('load', 'load', ICON.load, doLoad));
    document.body.appendChild(bar);
    document.addEventListener('click', closeAll); // click outside closes menus
    renderStatus();
    var keys = await idbKeys();
    for (var n = 1; n <= SLOTS; n++)
      filledSet[n] = keys.indexOf(slotKey(n)) !== -1;
    renderStatus();
  }

  var tries = 0;
  var iv = setInterval(function () {
    if (ready()) {
      clearInterval(iv);
      init();
    } else if (++tries > 600) clearInterval(iv); // ~60s; no adapter / never ready → give up silently
  }, 100);
})();
