// genx-repo-link.js — injects a subtle bottom-centre "source · licence"
// credit onto every emulator entry page. Self-contained: it creates its
// own <style>, so a page only needs one `<script defer src=...>` include
// (no matching CSS <link>). The links are absolute GitHub URLs, so the
// script works at any path depth (play.html, jsbeeb/dist/index.html, …).
//
// Deliberately understated — low-opacity amber, bottom centre, the text
// itself is pointer-events:none so only the two links are clickable and
// it never steals a click from the emulator. The controls link (bottom
// right) and save/load buttons (bottom left) stay clear of it.
(function () {
  if (document.querySelector('.gx-repo-link')) return;
  var REPO = 'https://github.com/Retro-Jack/GenX-DOS';
  var LIC = 'https://github.com/Retro-Jack/GenX-DOS/blob/master/LICENSE.TXT';
  var s = document.createElement('style');
  s.textContent =
    '.gx-repo-link{position:fixed;left:50%;bottom:6px;transform:translateX(-50%);' +
    'z-index:99998;font:9px/1 ui-monospace,"SF Mono",Menlo,Consolas,monospace;' +
    'letter-spacing:.06em;color:rgba(255,176,0,.30);white-space:nowrap;pointer-events:none}' +
    '.gx-repo-link a{color:inherit;text-decoration:none;pointer-events:auto;transition:color .15s ease}' +
    '.gx-repo-link a:hover{color:rgba(255,136,0,.9)}';
  document.head.appendChild(s);
  var d = document.createElement('div');
  d.className = 'gx-repo-link';
  d.innerHTML =
    'GenX-DOS · <a href="' +
    REPO +
    '" target="_blank" rel="noopener">source</a> · <a href="' +
    LIC +
    '" target="_blank" rel="noopener">licence</a>';
  document.body.appendChild(d);
})();
