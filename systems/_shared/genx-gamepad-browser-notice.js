// SPDX-License-Identifier: GPL-3.0-or-later
// Part of GenX-DOS. This file runs alongside GPL-licensed emulator
// engines, so it is GPL-3.0-or-later rather than the repo's CC BY-NC.
// GenX-DOS — "this browser will not see your gamepad" notice.
//
// Chromium browsers do not hand a gamepad to a page that does not currently
// have focus, and in practice a pad plugged into one of these emulator pages
// is never picked up there at all: the emulator enumerates joysticks once at
// startup, the browser has revealed nothing by then, and nothing re-scans.
// The same pad works immediately in Firefox.
//
// This is not something the page can fix. It is not our bug either — XRoar's
// own online build at 6809.org.uk behaves identically, its joystick menu
// listing the pad in Firefox and not in Chrome with the same pad plugged in.
// So the honest thing is to tell the player which browser to use rather than
// leave them pressing buttons at a machine that cannot hear them.
//
// Styled as the audio banner, because a player already reads that strip as
// "the browser is getting in the way" and this is the same kind of message.
// It stacks BELOW the audio banner by sitting at --gx-banner-h, the height
// that genx-audio-banner.js publishes, and moves up when that banner clears.
//
// It does NOT show itself. The page calls GenXPadNotice() once it knows the
// loaded game actually uses a joystick -- telling someone their browser cannot
// see a gamepad, on a game that would ignore one anyway, is just noise.
//
// Include via one tag in the bundle's play.html, then call it:
//   <script defer src="../_shared/genx-gamepad-browser-notice.js"></script>
//   if (game.joy) GenXPadNotice();
(function () {
  if (window.__genxPadNotice) return; // idempotent
  window.__genxPadNotice = true;

  var KEY = 'gx-pad-notice-dismissed';

  // Chromium family only: Chrome, Edge, Opera, Brave and the rest share the
  // engine and the behaviour. Firefox is excluded because it works there.
  // Safari is NOT claimed either way — it has not been tested, and a browser
  // this notice cannot vouch for is better left unbothered.
  var ua = navigator.userAgent || '';
  var chromium = /Chrome|Chromium|Edg|OPR/.test(ua) && !/Firefox/.test(ua);
  if (!chromium) return;

  try {
    if (localStorage.getItem(KEY) === '1') return;
  } catch (e) {
    /* storage unavailable — show it, which is the safe direction */
  }

  function build() {
    if (!document.body || document.getElementById('genx-pad-notice')) return;
    var b = document.createElement('div');
    b.id = 'genx-pad-notice';
    b.textContent =
      'This browser cannot detect a USB gamepad -- use Firefox to play with one.';
    b.title = 'Click to dismiss';
    b.style.cssText = [
      'position:fixed',
      // below the audio banner, and back to the top when that one clears
      'top:var(--gx-banner-h, 0px)',
      'left:0',
      'width:100%',
      'box-sizing:border-box',
      'padding:8px 12px',
      'margin:0',
      // under the audio banner's 100000, over everything else
      'z-index:99998',
      'text-align:center',
      'font:bold 15px/1.4 system-ui,Arial,sans-serif',
      'color:#fff',
      'background:#e0912a',
      'cursor:pointer',
      'user-select:none',
    ].join(';');
    b.addEventListener('click', function () {
      b.remove();
      try {
        localStorage.setItem(KEY, '1');
      } catch (e) {
        /* dismissed for this page load only */
      }
    });
    document.body.appendChild(b);
  }

  window.GenXPadNotice = function () {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', build);
    } else {
      build();
    }
  };

  // The page may have decided it needs the notice before this script ran --
  // it is deferred, and the page's own game lookup can finish first off a warm
  // cache. Either order works: the page sets the flag and calls if it can, and
  // this picks up the flag if the call came too early to land.
  if (window.GENX_PAD_RELEVANT) window.GenXPadNotice();
})();
