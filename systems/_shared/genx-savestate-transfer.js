// GenX-DOS save-state backup: export every slot to a file, restore from one.
//
// Save states live in IndexedDB, which browsers scope to the ORIGIN. Nothing
// saved on one address is reachable from another — there is no cross-origin
// IndexedDB — so moving the site to a new domain would otherwise strand every
// visitor's slots: not deleted, just permanently unreachable. This gives them a
// way to carry saves across, and doubles as a plain backup.
//
// It attaches a third drop-up to the .gx-state-bar that genx-savestate.js
// (EmulatorJS) and genx-savestate-std.js (standalone engines) build, and works
// with either: it talks to the shared 'gx-savestate' database directly rather
// than to any engine, so it needs no save-state API and knows nothing about the
// emulator on the page. Load it after whichever of those two the page uses.
//
// The export covers EVERY game on the site, not just the one on screen — the
// database is site-wide and one file is what a person migrating actually wants.
//
// Also exposed as window.GenXSaveTransfer = { exportAll, importFile, count }
// so a page without the button bar can drive it.
(function () {
  var DB_NAME = 'gx-savestate',
    STORE = 'slots',
    FORMAT = 'genx-dos-savestates',
    VERSION = 1;

  // --- database (same store the two savestate scripts write) -----------------
  var _db;
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
      // If this script wins the race to open the database, it must create the
      // store too, or the savestate script's own open() sees version 1 already
      // present and never runs its upgrade.
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
  function req(r) {
    return new Promise(function (resolve, reject) {
      r.onsuccess = function () {
        resolve(r.result);
      };
      r.onerror = function () {
        reject(r.error);
      };
    });
  }
  async function readAll() {
    var db = await idb();
    if (!db) return [];
    try {
      var os = db.transaction(STORE, 'readonly').objectStore(STORE);
      var keys = (await req(os.getAllKeys())) || [];
      var vals = (await req(os.getAll())) || [];
      return keys.map(function (k, i) {
        return { key: k, value: vals[i] };
      });
    } catch (e) {
      return [];
    }
  }
  async function putIfAbsent(k, v) {
    var db = await idb();
    if (!db) return 'failed';
    try {
      var os = db.transaction(STORE, 'readwrite').objectStore(STORE);
      // Restoring must never destroy a save made since the export. Existing
      // keys are left alone and counted as skipped rather than overwritten.
      var existing = await req(os.get(k));
      if (existing !== undefined) return 'skipped';
      await req(os.put(v, k));
      return 'restored';
    } catch (e) {
      return 'failed';
    }
  }

  // --- encoding --------------------------------------------------------------
  // Slot values are Uint8Array for EmulatorJS cores (raw WASM state) and plain
  // structured-cloneable objects for the standalone adapters, so each entry
  // records which it is and binary is base64'd to survive JSON.
  function toB64(bytes) {
    var s = '',
      CH = 0x8000; // chunked: String.fromCharCode.apply dies on huge arrays
    for (var i = 0; i < bytes.length; i += CH)
      s += String.fromCharCode.apply(null, bytes.subarray(i, i + CH));
    return btoa(s);
  }
  function fromB64(b64) {
    var bin = atob(b64),
      out = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }
  function encode(v) {
    if (v instanceof Uint8Array) return { type: 'bytes', data: toB64(v) };
    if (v instanceof ArrayBuffer)
      return { type: 'bytes', data: toB64(new Uint8Array(v)) };
    return { type: 'json', data: v };
  }
  function decode(e) {
    if (!e || typeof e !== 'object') return undefined;
    if (e.type === 'bytes') return fromB64(e.data);
    if (e.type === 'json') return e.data;
    return undefined;
  }

  // --- export / import -------------------------------------------------------
  async function count() {
    return (await readAll()).length;
  }

  async function exportAll() {
    var rows = await readAll();
    if (!rows.length) return { ok: false, reason: 'empty', n: 0 };
    var slots = {};
    rows.forEach(function (r) {
      slots[r.key] = encode(r.value);
    });
    var payload = {
      format: FORMAT,
      version: VERSION,
      exported: new Date().toISOString(),
      origin: location.origin, // so a restore can tell where saves came from
      count: rows.length,
      slots: slots,
    };
    var blob = new Blob([JSON.stringify(payload)], {
      type: 'application/json',
    });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download =
      'genx-dos-saves-' + new Date().toISOString().slice(0, 10) + '.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 10000);
    return { ok: true, n: rows.length };
  }

  async function importText(text) {
    var data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      return { ok: false, reason: 'unreadable' };
    }
    if (!data || data.format !== FORMAT || !data.slots)
      return { ok: false, reason: 'not a GenX-DOS save file' };
    var restored = 0,
      skipped = 0,
      failed = 0;
    for (var k in data.slots) {
      if (!Object.prototype.hasOwnProperty.call(data.slots, k)) continue;
      var v = decode(data.slots[k]);
      if (v === undefined) {
        failed++;
        continue;
      }
      var r = await putIfAbsent(k, v);
      if (r === 'restored') restored++;
      else if (r === 'skipped') skipped++;
      else failed++;
    }
    return {
      ok: true,
      restored: restored,
      skipped: skipped,
      failed: failed,
      from: data.origin || '',
    };
  }

  function importFile() {
    return new Promise(function (resolve) {
      var inp = document.createElement('input');
      inp.type = 'file';
      inp.accept = 'application/json,.json';
      inp.style.display = 'none';
      inp.addEventListener('change', function () {
        var f = inp.files && inp.files[0];
        if (!f) {
          inp.remove();
          return resolve({ ok: false, reason: 'cancelled' });
        }
        var fr = new FileReader();
        fr.onload = async function () {
          resolve(await importText(String(fr.result)));
          inp.remove();
        };
        fr.onerror = function () {
          inp.remove();
          resolve({ ok: false, reason: 'unreadable' });
        };
        fr.readAsText(f);
      });
      document.body.appendChild(inp);
      inp.click();
    });
  }

  window.GenXSaveTransfer = {
    exportAll: exportAll,
    importFile: importFile,
    importText: importText, // same restore path without the file picker
    count: count,
  };

  // --- UI: a third drop-up on the existing bar --------------------------------
  var ICON =
    '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 1h5l3 3v7a.5.5 0 0 1-.5.5h-7A.5.5 0 0 1 2 11zm4.5.9V4H9zM4 6h4v1H4zm0 2h4v1H4z"/></svg>';

  function flash(btn, msg, hold) {
    var label = btn.dataset.label,
      t = btn.querySelector('.gx-state-txt');
    t.textContent = msg;
    btn.classList.add('gx-state-flash');
    setTimeout(function () {
      t.textContent = label;
      btn.classList.remove('gx-state-flash');
    }, hold || 1600);
  }

  function build(bar) {
    if (bar.querySelector('.gx-state-transfer')) return;

    var wrap = document.createElement('div');
    wrap.className = 'gx-state-menu';
    var pop = document.createElement('div');
    pop.className = 'gx-state-pop';
    var toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'gx-state-btn gx-state-transfer';
    toggle.dataset.label = 'backup';
    toggle.innerHTML = '<span class="gx-state-txt">backup</span>' + ICON;

    function row(text, onClick) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'gx-state-slot';
      b.textContent = text;
      b.addEventListener('click', function (e) {
        e.stopPropagation();
        wrap.classList.remove('open');
        onClick();
      });
      pop.appendChild(b);
      return b;
    }

    var exportRow = row('export all saves', async function () {
      var r = await exportAll();
      flash(
        toggle,
        r.ok ? 'saved ' + r.n + ' slots' : 'nothing to export',
        r.ok ? 1600 : 1200,
      );
    });

    row('restore from file', async function () {
      var r = await importFile();
      if (!r.ok) {
        if (r.reason !== 'cancelled') flash(toggle, r.reason, 2200);
        return;
      }
      var msg = 'restored ' + r.restored;
      if (r.skipped) msg += ', kept ' + r.skipped;
      if (r.failed) msg += ', failed ' + r.failed;
      flash(toggle, msg, 2600);
      refreshLabel();
    });

    // The export row says how much there is to export, so it is obvious whether
    // this browser holds anything before a migration.
    async function refreshLabel() {
      var n = await count();
      exportRow.textContent =
        n === 0
          ? 'export all saves (none yet)'
          : 'export all saves (' + n + ')';
    }
    refreshLabel();

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = wrap.classList.contains('open');
      // Close the save/load menus too — they listen for document clicks, which
      // stopPropagation here would otherwise prevent.
      bar.querySelectorAll('.gx-state-menu').forEach(function (m) {
        m.classList.remove('open');
      });
      if (!open) {
        wrap.classList.add('open');
        refreshLabel();
      }
    });
    // Listen in the CAPTURE phase. The save/load toggles call stopPropagation,
    // so a normal bubbling listener never hears their clicks and this menu
    // would stay open underneath theirs. Capture runs on the way down, before
    // the target's own handler can stop anything. Clicks inside this menu are
    // exempt, or the toggle below would find it already closed and always
    // re-open it.
    document.addEventListener(
      'click',
      function (e) {
        if (!wrap.contains(e.target)) wrap.classList.remove('open');
      },
      true,
    );

    wrap.appendChild(pop);
    wrap.appendChild(toggle);
    bar.appendChild(wrap);
  }

  // The bar is created asynchronously once the engine reports ready, so wait
  // for it rather than assuming it exists at script time.
  var tries = 0;
  var iv = setInterval(function () {
    var bar = document.querySelector('.gx-state-bar');
    if (bar) {
      clearInterval(iv);
      build(bar);
    } else if (++tries > 600) clearInterval(iv); // ~60s, then give up silently
  }, 100);
})();
