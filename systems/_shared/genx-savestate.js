// GenX-DOS save/load-state buttons for EmulatorJS bundles.
// The EmulatorJS toolbar is hidden site-wide (genx-frame.css hides
// .ejs_menu_bar / .ejs_context_menu), so this re-exposes Save/Load State as
// GenX-styled controls (same look as the 'controls' link, bottom-left). EJS-only:
// everything is gated on window.EJS_emulator, so the script is a harmless no-op
// on non-EJS bundles (it gives up after ~60s).
//
// Save uses the core's save_state_info (state read from the WASM HEAP); Load
// writes the bytes back and calls load_state. There are FIVE save slots per
// game: the Save and Load buttons each open a drop-up menu of the five slots
// (showing empty/used). Slots are kept in memory for the session and persisted
// to IndexedDB (keyed per platform+game+slot) so they survive a reload — and so
// different games keep independent saves.
(function () {
  if (document.querySelector('.gx-state-bar')) return;

  var SLOTS = 5;
  var mem = {}; // in-memory states (Uint8Array) per slot for this session
  var filledSet = {}; // slot -> bool (has a save)

  var p = new URLSearchParams(location.search);
  var key = p.get('game') || p.get('tape') || p.get('rom') || 'state';
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

  function emu() {
    return window.EJS_emulator;
  }
  function ready() {
    var e = emu();
    return e && e.gameManager && typeof e.gameManager.getState === 'function';
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

  async function doSave(n, btn) {
    try {
      var st = getStateBytes();
      if (!st || !st.length) {
        flash(btn, 'no state');
        return;
      }
      mem[n] = st;
      await idbPut(slotKey(n), st);
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
    if (!st) {
      try {
        st = await idbGet(slotKey(n));
      } catch (e) {}
    }
    if (!st) {
      flash(btn, 'no save');
      return;
    }
    try {
      setStateBytes(st);
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
        r.textContent = n + (used ? ' used' : ' empty');
        r.classList.toggle('gx-state-used', used);
        if (m.kind === 'load') r.disabled = !used; // can't load an empty slot
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
          if (r.disabled) return;
          closeAll();
          onPick(n, toggle);
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
    } else if (++tries > 600) clearInterval(iv); // ~60s; non-EJS page → give up silently
  }, 100);
})();
