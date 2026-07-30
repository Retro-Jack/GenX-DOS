// genx-repo-link.js — injects a subtle bottom-centre "licence · source · readme"
// credit onto every emulator entry page. Self-contained: it creates its
// own <style>, so a page only needs one `<script defer src=...>` include
// (no matching CSS <link>). The licence + readme links are on-site wiki
// pages, resolved from this script's own src so they work at any path depth
// (play.html, jsbeeb/dist/index.html, …) and on any host — localhost, Pages,
// a clone, or a private host. Only source is an absolute GitHub URL.
//
// Sits in a small dark pill (the surround is the wallpaper, not black, so
// bare text would vanish into it — same reason the controls / save-load
// links carry their own background). Understated but legible. The pill is
// pointer-events:none so only the links take clicks and it never
// steals one from the emulator; it stays clear of the controls link
// (bottom-right) and the save / load buttons (bottom-left).
(function () {
  if (document.querySelector('.gx-repo-link')) return;
  var REPO = 'https://github.com/Retro-Jack/GenX-DOS';
  // Site root, derived from where this script itself was loaded from.
  var ROOT =
    document.currentScript && document.currentScript.src
      ? document.currentScript.src.replace(
          /systems\/_shared\/genx-repo-link\.js.*$/,
          '',
        )
      : '/';
  var LIC = ROOT + 'docs/wiki/LICENSE.html';
  var README = ROOT + 'docs/wiki/README.html';
  var s = document.createElement('style');
  s.textContent =
    '.gx-repo-link{position:fixed;left:50%;bottom:10px;transform:translateX(-50%);' +
    'z-index:99998;background:#000;border:1px solid rgba(255,176,0,.22);' +
    'padding:3px 11px;border-radius:4px;white-space:nowrap;pointer-events:none;' +
    'font:10px/1 ui-monospace,"SF Mono",Menlo,Consolas,monospace;' +
    'letter-spacing:.05em;color:rgba(255,176,0,.5)}' +
    '.gx-repo-link a{color:rgba(255,176,0,.82);text-decoration:none;' +
    'pointer-events:auto;transition:color .15s ease}' +
    '.gx-repo-link a:hover{color:#ff8800}';
  document.head.appendChild(s);
  var d = document.createElement('div');
  d.className = 'gx-repo-link';
  d.innerHTML =
    'GenX-DOS · <a href="' +
    LIC +
    '" target="_blank" rel="noopener">licence</a> · <a href="' +
    REPO +
    '" target="_blank" rel="noopener">source</a> · <a href="' +
    README +
    '" target="_blank" rel="noopener">readme</a>';
  document.body.appendChild(d);
})();
