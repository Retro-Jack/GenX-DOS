// SPDX-License-Identifier: GPL-3.0-or-later
// Part of GenX-DOS. This file runs alongside GPL-licensed emulator
// engines, so it is GPL-3.0-or-later rather than the repo's CC BY-NC.
// genx-repo-link.js — injects a subtle bottom-centre "licence · source · readme"
// credit onto every emulator entry page. Self-contained: it creates its
// own <style>, so a page only needs one `<script defer src=...>` include
// (no matching CSS <link>). The licence + readme links are on-site wiki
// pages, resolved from this script's own src so they work at any path depth
// (play.html, jsbeeb/dist/index.html, …) and on any host — localhost, Pages,
// a clone, or a private host. Only source is an absolute GitHub URL.
//
// Sits in a small dark pill (the surround is the wallpaper, not black, so
// bare text would vanish into it — same reason the corner links and the
// save / load buttons carry their own background; all three share the brown
// taken from the wallpaper itself). Understated but legible. The pill is
// pointer-events:none so only the links take clicks and it never
// steals one from the emulator; it stays clear of the save / load buttons
// (bottom-left). The dismissible banners deliberately cover it — a credit
// line is the one thing down there that can afford to be hidden for a
// moment, which is why they sit at the bottom rather than over the corner
// links at the top.
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
  var README = ROOT + 'docs/wiki/README.html';
  // A rights holder arrives at a game, not at the home page. The route to us
  // was only linked from the landing page's footer, so every page they would
  // actually land on offered none, which left the one person we most want to
  // hear from with the least obvious way to reach us. This puts it on every
  // play page, one click from anywhere. It points at the legal position
  // rather than at the removal procedure alone, because someone who has just
  // found their own work here wants to know where we stand as well as how to
  // ask; that page opens with the position and links the procedure.
  var LEGAL = ROOT + 'docs/wiki/Legal.html';
  // Back to the prompt the game was launched from. The wordmark goes to the
  // landing page, which is a different journey: one leaves the museum, the
  // other returns to the menu you came in by.
  var MENU = ROOT + 'prompt/';
  // The prompt carries this pill too, where a link back to the prompt would
  // be a link to itself. Drop it there rather than offer a no-op.
  var ON_MENU = location.href.indexOf(MENU) === 0;
  var s = document.createElement('style');
  s.textContent =
    '.gx-repo-link{position:fixed;left:50%;bottom:10px;transform:translateX(-50%);' +
    'z-index:99998;background:var(--gx-btn-bg,#4c2e1d);border:1px solid rgba(255,176,0,.22);' +
    'padding:3px 11px;border-radius:4px;white-space:nowrap;pointer-events:none;' +
    'font:10px/1 ui-monospace,"SF Mono",Menlo,Consolas,monospace;' +
    'letter-spacing:.05em;color:rgba(255,176,0,.5)}' +
    '.gx-repo-link a{color:rgba(255,176,0,.82);text-decoration:none;' +
    'pointer-events:auto;transition:color .15s ease}' +
    '.gx-repo-link a:hover{color:var(--gx-btn-hot,#ff8800)}';
  document.head.appendChild(s);
  var d = document.createElement('div');
  d.className = 'gx-repo-link';
  d.innerHTML =
    '<a href="' +
    ROOT +
    '" class="gx-home-link">GenX-DOS</a> · ' +
    (ON_MENU ? '' : '<a href="' + MENU + '" class="gx-menu-link">menu</a> · ') +
    '<a href="' +
    REPO +
    '" target="_blank" rel="noopener">source</a> · <a href="' +
    README +
    '" target="_blank" rel="noopener">readme</a> · <a href="' +
    LEGAL +
    '" target="_blank" rel="noopener">legal</a>';
  // The wordmark goes home. These pages are opened with window.open from the
  // prompt, so the tidy exit is to point the window that opened us at the home
  // page and close this one — otherwise the player is left with a spent
  // emulator tab and the prompt sitting behind it. A direct visit has no
  // opener, so the click is left alone and the href navigates as normal, which
  // also keeps it working if the listener never runs.
  function opener() {
    try {
      return window.opener && !window.opener.closed ? window.opener : null;
    } catch (x) {
      return null;
    }
  }
  d.querySelector('.gx-home-link').addEventListener('click', function (e) {
    var w = opener();
    if (!w) return;
    e.preventDefault();
    try {
      w.location.href = ROOT;
      w.focus();
    } catch (x) {}
    window.close();
  });
  // The opener IS the prompt, so menu only has to hand the window back and
  // get out of the way. Deliberately not setting its location: that would
  // reload the prompt and throw away whichever directory the player had
  // navigated to, which is the one thing someone pressing "menu" wants kept.
  var menuLink = d.querySelector('.gx-menu-link');
  if (menuLink)
    menuLink.addEventListener('click', function (e) {
      var w = opener();
      if (!w) return;
      e.preventDefault();
      try {
        w.focus();
      } catch (x) {}
      window.close();
    });
  document.body.appendChild(d);
})();
