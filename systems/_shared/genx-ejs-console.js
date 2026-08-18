// SPDX-License-Identifier: GPL-3.0-or-later
// Part of GenX-DOS. This file runs alongside GPL-licensed emulator
// engines, so it is GPL-3.0-or-later rather than the repo's CC BY-NC.
// GenX-DOS console-switch panel for the EmulatorJS Atari consoles.
//
// The VCS put its switches along the front of the case, printed in lower case:
// power, tv type, left difficulty, right difficulty, game select, game reset.
// Games depend on them — game reset is how most titles begin, game select picks
// the variation (on a 2600 cartridge often the difference between one game and
// thirty), and the difficulty switches change how several play. In a browser
// none of that is visible, so a player sits at a title screen with no idea how
// to start. Reported by a reader of the Tweakers piece.
//
// This is the same panel, in the same left-to-right order the console had, with
// power left off because it means nothing here.
//
// Two kinds of control, because the console had two:
//   * game select and game reset were momentary — you push, they spring back.
//     Buttons.
//   * tv type and the difficulties were sliders that stayed where you put them.
//     Two-position switches, showing which side they are on.
//
// THE MECHANISM IS NOT THE ONE THE OTHER SOFT KEYS USE. Elsewhere we dispatch a
// synthetic KeyboardEvent, because those engines read the DOM's keyboard events.
// EmulatorJS ignores them outright — firing V at the 2600 left the variation
// number sitting where it was. These go through
// gameManager.simulateInput(player, buttonId, value), the path EJS's own
// on-screen controls use. Button ids are read from its source rather than
// guessed: data/src/emulator.js, the getControlScheme() blocks.
//
// Include via one tag in the bundle's play.html:
//   <script defer src="../_shared/genx-ejs-console.js"></script>
(function () {
  // Laid out in the order the switches appear on the console itself.
  const PANELS = {
    atari2600: {
      controls: [
        {
          kind: 'switch',
          name: 'tv type',
          // Each position is its own button id on the 2600, so a flip is a press
          // of whichever id names the side you are moving to.
          positions: [
            { text: 'color', id: 14 },
            { text: 'b·w', id: 15 },
          ],
          start: 0,
        },
        {
          kind: 'switch',
          name: 'left difficulty',
          positions: [
            { text: 'a', id: 10 },
            { text: 'b', id: 12 },
          ],
          start: 1,
        },
        {
          kind: 'switch',
          name: 'right difficulty',
          positions: [
            { text: 'a', id: 11 },
            { text: 'b', id: 13 },
          ],
          start: 1,
        },
        { kind: 'press', name: 'game select', id: 2 },
        { kind: 'press', name: 'game reset', id: 3 },
      ],
    },
    // The 7800's case carries only power, pause, select and reset — no
    // difficulty switches, whatever ids the core exposes for 2600
    // compatibility. Three momentary buttons, so no sliders and no switch
    // panel: plain keys, the way they were before the 2600 gained its panel.
    atari7800: {
      plain: true,
      controls: [
        { kind: 'press', name: 'PAUSE', id: 3 },
        { kind: 'press', name: 'SELECT', id: 2 },
        { kind: 'press', name: 'RESET', id: 9 },
      ],
    },
  };

  const emu = () => window.EJS_emulator;
  const ready = () => {
    const e = emu();
    return !!(
      e &&
      e.gameManager &&
      typeof e.gameManager.simulateInput === 'function'
    );
  };

  // A switch is a momentary contact as far as the core is concerned: press,
  // then release. Holding it down is the same as holding the real switch over,
  // which some games read as "still resetting" and never start.
  const flick = (id) => {
    const gm = emu().gameManager;
    try {
      gm.simulateInput(0, id, 1);
      setTimeout(() => {
        try {
          gm.simulateInput(0, id, 0);
        } catch (_) {
          /* swallow */
        }
      }, 120);
    } catch (_) {
      /* swallow */
    }
  };

  const CSS = `
    /* The switches sat in a black plastic strip across the front of the case,
       names printed beside them. Grouping them the same way keeps the labels
       legible over the wallpaper and reads as one panel rather than five loose
       controls. */
    #genx-ejs-console {
      /* Sat under the set, in the gap between the TV's legs — where a console
         actually lived. Clear of the credit pill along the bottom, and clear of
         the save/load and controls corners. */
      position: fixed; bottom: 58px; left: 50%; transform: translateX(-50%);
      z-index: 100;
      display: flex; align-items: flex-end; gap: 16px;
      padding: 8px 14px 10px;
      background: #0a0a0a;
      border: 1px solid rgba(255, 176, 0, 0.28);
      border-radius: 6px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
      font: 10px/1 ui-monospace, "SF Mono", Menlo, Consolas, monospace;
      letter-spacing: 0.06em;
    }
    .gx-sw {
      display: flex; flex-direction: column; gap: 6px; align-items: center;
      min-width: 62px;
      background: none; border: 0; padding: 0; margin: 0;
      color: rgba(255, 176, 0, 0.75);
      /* Buttons do not inherit font by default — without this the switch
         legends fell back to the UA's button face while the press legends used
         the panel's, and the two rows of labels did not match. */
      font: inherit; letter-spacing: 0.06em;
      cursor: pointer;
    }
    /* Stacked, the way the legends were printed on the console — "left" over
       "difficulty" — which also keeps the panel narrow enough to sit between
       the TV's legs. */
    .gx-sw-name {
      text-transform: lowercase;
      white-space: pre-line;
      text-align: center;
      line-height: 1.3;
    }
    /* The track: two seats with the knob sitting in one of them, the way the
       real slider sits at one end of its channel. */
    .gx-sw-track {
      position: relative;
      display: grid; grid-template-columns: 1fr 1fr; align-items: center;
      /* Sized to its own legend rather than a fixed width — "color" needs more
         channel than "a", exactly as the printed panel gave it. */
      min-width: 62px; height: 20px;
      background: #000; border: 1px solid rgba(255, 176, 0, 0.35);
      border-radius: 10px;
      overflow: hidden;
    }
    .gx-sw-pos {
      text-align: center; z-index: 1; padding: 0 7px;
      color: rgba(255, 176, 0, 0.35);
      transition: color 0.15s ease;
      text-transform: lowercase;
    }
    .gx-sw-pos.on { color: #000; }
    .gx-sw-knob {
      position: absolute; top: 2px; left: 2px;
      width: calc(50% - 3px); height: calc(100% - 4px);
      border-radius: 8px;
      background: rgba(255, 176, 0, 0.8);
      transition: transform 0.16s ease;
      display: flex; align-items: center; justify-content: center; gap: 2px;
    }
    .gx-sw[data-pos="1"] .gx-sw-knob { transform: translateX(calc(100% + 2px)); }
    /* the moulded grip on the real switch */
    .gx-sw-knob i { width: 1px; height: 7px; background: rgba(0, 0, 0, 0.45); }
    .gx-sw:hover .gx-sw-track { border-color: #ff8800; }
    .gx-sw:hover .gx-sw-knob { background: #ff8800; }
    .gx-sw:focus-visible { outline: 2px solid #ff8800; outline-offset: 3px; }

    .gx-press {
      display: flex; flex-direction: column; gap: 6px; align-items: center;
      min-width: 62px;
      background: none; border: 0; padding: 0; margin: 0;
      color: rgba(255, 176, 0, 0.75);
      font: inherit; letter-spacing: 0.06em;
      cursor: pointer;
    }
    .gx-press-cap {
      width: 62px; height: 20px;
      display: flex; align-items: center; justify-content: center;
      background: #000; border: 1px solid rgba(255, 176, 0, 0.35);
      border-radius: 10px;
      transition: background 0.12s ease, border-color 0.12s ease;
    }
    .gx-press-cap span {
      width: 14px; height: 8px; border-radius: 4px;
      background: rgba(255, 176, 0, 0.8);
    }
    .gx-press:hover .gx-press-cap { border-color: #ff8800; }
    .gx-press:hover .gx-press-cap span { background: #ff8800; }
    .gx-press:active .gx-press-cap { background: rgba(255, 176, 0, 0.15); }
    .gx-press:focus-visible { outline: 2px solid #ff8800; outline-offset: 3px; }

    /* Plain keys — for a console whose switches were all momentary, so there is
       no slider to draw and no panel to group them into. */
    #genx-ejs-console.plain {
      background: none; border: 0; box-shadow: none; padding: 0; gap: 6px;
    }
    .gx-key {
      color: rgba(255, 176, 0, 0.75); background: #000;
      border: 1px solid rgba(255, 176, 0, 0.35); border-radius: 4px;
      font: 12px/1 ui-monospace, "SF Mono", Menlo, Consolas, monospace;
      letter-spacing: 0.05em; padding: 5px 10px;
      cursor: pointer;
      transition: color 0.15s ease, border-color 0.15s ease;
    }
    .gx-key:hover { color: #ff8800; border-color: #ff8800; }
    .gx-key:focus-visible { outline: 2px solid #ff8800; outline-offset: 2px; }
  `;

  const build = (panel) => {
    const plain = !!panel.plain;
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    const bar = document.createElement('div');
    bar.id = 'genx-ejs-console';
    if (plain) bar.classList.add('plain');

    for (const ctl of panel.controls) {
      if (ctl.kind === 'press') {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = plain ? 'gx-key' : 'gx-press';
        btn.title = ctl.name + ' — momentary switch, springs back';
        if (plain) {
          btn.textContent = ctl.name;
        } else {
          btn.innerHTML =
            '<span class="gx-sw-name"></span><span class="gx-press-cap"><span></span></span>';
          btn.querySelector('.gx-sw-name').textContent = ctl.name.replace(
            ' ',
            '\n',
          );
        }
        btn.addEventListener('click', () => {
          flick(ctl.id);
          btn.blur();
        });
        bar.appendChild(btn);
        continue;
      }

      // Two-position switch. The emulator cannot be asked which way its
      // switches are set, so this tracks its own position and starts where the
      // console powered up; flipping it sends the id for the side moved to.
      const sw = document.createElement('button');
      sw.type = 'button';
      sw.className = 'gx-sw';
      sw.dataset.pos = String(ctl.start);
      sw.title = ctl.name + ' — two-position switch';
      sw.innerHTML =
        '<span class="gx-sw-name"></span>' +
        '<span class="gx-sw-track">' +
        '<span class="gx-sw-knob"><i></i><i></i><i></i></span>' +
        '<span class="gx-sw-pos"></span><span class="gx-sw-pos"></span>' +
        '</span>';
      sw.querySelector('.gx-sw-name').textContent = ctl.name.replace(' ', '\n');
      const seats = sw.querySelectorAll('.gx-sw-pos');
      seats[0].textContent = ctl.positions[0].text;
      seats[1].textContent = ctl.positions[1].text;

      const paint = () => {
        const pos = Number(sw.dataset.pos);
        seats[0].classList.toggle('on', pos === 0);
        seats[1].classList.toggle('on', pos === 1);
      };
      paint();

      sw.addEventListener('click', () => {
        const next = Number(sw.dataset.pos) === 0 ? 1 : 0;
        sw.dataset.pos = String(next);
        paint();
        flick(ctl.positions[next].id);
        sw.blur();
      });
      bar.appendChild(sw);
    }

    document.body.appendChild(bar);
  };

  // EJS publishes its emulator object well after the page parses, and the
  // control scheme is only knowable from it, so wait rather than race.
  const start = () => {
    if (!ready()) return false;
    const scheme = emu().getControlScheme && emu().getControlScheme();
    const panel = PANELS[scheme];
    if (panel) build(panel);
    return true;
  };

  if (!start()) {
    const timer = setInterval(() => {
      if (start()) clearInterval(timer);
    }, 250);
    setTimeout(() => clearInterval(timer), 30000);
  }
})();
