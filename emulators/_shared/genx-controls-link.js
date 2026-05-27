// Injects the bottom-right "controls" link into every emulator's entry
// HTML. Each bundle has a controls.html alongside its play.html; this
// script auto-creates the <a> + SVG icon at runtime so the HTML stays
// short. Bundles include this with `<script defer src=".../genx-controls-link.js"></script>`
// and add the matching <link rel="stylesheet" ...controls-link.css">.
//
// Skipped if a `.gx-controls-link` element already exists (so bundles
// that need to position the link differently can opt out by adding
// their own).
(function () {
  if (document.querySelector('.gx-controls-link')) return;
  var p = new URLSearchParams(location.search);
  var key = p.get('game') || p.get('tape') || p.get('rom') || '';
  var platform = location.pathname.replace(/.*\/emulators\//, '').replace(/\/.*/, '');
  var a = document.createElement('a');
  a.href = key ? '../../gamedocs/' + platform + '/' + key + '.html' : 'controls.html';
  a.target = '_blank';
  a.rel = 'noopener';
  a.className = 'gx-controls-link';
  a.innerHTML = 'controls<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M6 1h5v5L8.86 3.85 4.7 8 4 7.3l4.15-4.16zM2 3h2v1H2v6h6V8h1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1"/></svg>';
  document.body.appendChild(a);
})();
