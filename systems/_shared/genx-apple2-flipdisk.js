// SPDX-License-Identifier: GPL-3.0-or-later
// Part of GenX-DOS. This file runs alongside GPL-licensed emulator
// engines, so it is GPL-3.0-or-later rather than the repo's CC BY-NC.
// GenX-DOS FLIP DISK soft button for the Apple ][+ (apple2js) bundle.
//
// Some Apple II releases shipped on a "flippy" disk: the program on one side,
// more of it on the other, and partway through the game stops and asks you to
// take the disk out, turn it over and put it back. The Disk II drive only ever
// sees one side, so there is no software way around it — the flip was a
// physical act the player performed.
//
// That leaves an emulated version dead in the water at the halfway point. Our
// play.html hides apple2js's own drive UI (we auto-load via ?disk=KEY, so the
// loader would be unreachable chrome), which means a player who reaches the
// prompt has nothing to click and no way forward. This button is that missing
// physical act: it swaps the other side into drive 1 while the machine keeps
// running, which is exactly what the game is waiting for.
//
// apple2js exposes Apple2.doLoadHTTP(drive, url). Loading into drive 1 mid-run
// needs no reset — the running program simply finds the other side next time
// it reads, the same as it would have on real hardware.
//
// Games are declared below rather than detected, because "does this disk have
// a second side" is not something the image can be asked. A game with no entry
// gets no button.
//
// Include via one tag in apple2/play.html:
//   <script defer src="../_shared/genx-apple2-flipdisk.js"></script>
(function () {
  // game key -> the two sides, in the order they are flipped between.
  const FLIPPY = {
    oregon: [
      { label: 'A', url: 'woz/oregon-a.woz' },
      { label: 'B', url: 'woz/oregon-b.woz' },
    ],
  };

  const key = new URLSearchParams(location.search).get('disk');
  const sides = FLIPPY[key];
  if (!sides) return;

  const build = () => {
    const style = document.createElement('style');
    style.textContent = `
      #genx-apple2-flip {
        position: fixed; top: 8px; left: 8px;
        z-index: 100;
        color: rgba(255, 176, 0, 0.75); background: #000;
        border: 1px solid rgba(255, 176, 0, 0.35); border-radius: 4px;
        font: 12px/1 ui-monospace, "SF Mono", Menlo, Consolas, monospace;
        letter-spacing: 0.05em; padding: 5px 10px;
        cursor: pointer;
        transition: color 0.15s ease, border-color 0.15s ease;
      }
      #genx-apple2-flip:hover { color: #ff8800; border-color: #ff8800; }
    `;
    document.head.appendChild(style);

    let current = 0;
    const btn = document.createElement('button');
    btn.id = 'genx-apple2-flip';
    btn.type = 'button';
    // Deliberately not "flip to side B": the game may ask for either side, more
    // than once, and the label would then have to track which way round the
    // disk is. Turning it over is one action either way, exactly as it was.
    btn.textContent = 'Flip Disk';
    btn.title =
      'This game is on a two-sided disk. Click here whenever it asks you to ' +
      'turn the disk over.';

    btn.addEventListener('click', () => {
      current = (current + 1) % sides.length;
      // Drive 1 — the only drive the bundle boots from.
      window.Apple2.doLoadHTTP(1, sides[current].url);
      btn.blur();
    });

    document.body.appendChild(btn);
  };

  // The button drives Apple2, so wait until the bundle has published it rather
  // than racing the emulator's own boot.
  const ready = () => {
    if (window.Apple2 && typeof window.Apple2.doLoadHTTP === 'function') {
      build();
      return true;
    }
    return false;
  };

  if (!ready()) {
    const timer = setInterval(() => {
      if (ready()) clearInterval(timer);
    }, 200);
    // Give up quietly rather than polling forever if the bundle never loads.
    setTimeout(() => clearInterval(timer), 15000);
  }
})();
