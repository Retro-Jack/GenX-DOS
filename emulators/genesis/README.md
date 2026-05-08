# Genesis

A Sega Genesis and 32x emulator with mobile compatibility designed for running in pure JavaScript pre-ECMAScript 2015 (no WebAssembly). Simply open the link below, click the red icon, and select a ROM file in `32X`, `BIN` or `MD` format from your computer; it will be loaded and booted automatically.

## Links:

- [Genesis emulator](https://lrusso.github.io/Genesis/Genesis.htm)
- [Demo booting a sample game](https://lrusso.github.io/Genesis/Genesis.htm?demo)

## Screenshots:

![alt screenshot1](https://lrusso.github.io/Genesis/SCREENSHOT1.jpg)

![alt screenshot2](https://lrusso.github.io/Genesis/SCREENSHOT2.jpg)

![alt screenshot3](https://lrusso.github.io/Genesis/SCREENSHOT3.jpg)

![alt screenshot4](https://lrusso.github.io/Genesis/SCREENSHOT4.jpg)

## How to use it:

Examples of loading local and online files can be found [here](https://github.com/lrusso/Genesis/blob/main/Genesis.htm#L141-L193) and [here](https://github.com/lrusso/Genesis/blob/main/Genesis.htm#L221-L268).

```js
embedGenesis({
  container: "game",
  name: "Sonic The Hedgehog",
  rom: romFile,
  soundEnabled: true,
  showMobileControls: true,
  backText: "BACK",
  soundText: "SOUND",
  loadText: "LOAD",
  saveText: "SAVE",
  player1: {
    up: "ArrowUp",
    down: "ArrowDown",
    left: "ArrowLeft",
    right: "ArrowRight",
    start: "Enter",
    mode: "KeyZ",
    a: "KeyA",
    b: "KeyS",
    c: "KeyD",
    x: "KeyQ",
    y: "KeyW",
    z: "KeyE",
  },
  player2: {
    up: "KeyI",
    down: "KeyK",
    left: "KeyJ",
    right: "KeyL",
    start: "KeyH",
    mode: "KeyV",
    a: "KeyB",
    b: "KeyN",
    c: "KeyM",
    x: "KeyU",
    y: "KeyO",
    z: "KeyP",
  },
  cbStarted: function cbStarted() {
    console.log("Emulator started.")
  },
})
```

| Parameter          |    Type     | Required | Default value | Description                |
| :----------------- | :---------: | :------: | :-----------: | :------------------------- |
| container          |   string    |   yes    |       –       | Target element ID.         |
| name               |   string    |   yes    |       –       | Game name.                 |
| rom                | ArrayBuffer |   yes    |       –       | ROM file.                  |
| soundEnabled       |   boolean   |    no    |     true      | Initial sound state.       |
| showMobileControls |   boolean   |    no    |     false     | Show mobile controls.      |
| backText           |   string    |    no    |     BACK      | Text for the Back button.  |
| soundText          |   string    |    no    |     SOUND     | Text for the Sound button. |
| loadText           |   string    |    no    |     LOAD      | Text for the Load button.  |
| saveText           |   string    |    no    |     SAVE      | Text for the Save button.  |
| player1            |   object    |    no    |       –       | Player 1 keys.             |
| player2            |   object    |    no    |       –       | Player 2 keys.             |
| cbStarted          |  function   |    no    |       -       | Called on emulator start.  |

## Special keys:

| Action          | macOS Shortcut | Windows Shortcut | Safari Shortcut |
| :-------------- | :------------: | :--------------: | :-------------: |
| Save state      |  Command + 1   |     Ctrl + 1     |    Ctrl + 1     |
| Load state      |  Command + 2   |     Ctrl + 2     |    Ctrl + 2     |
| Toggle sound    |  Command + 3   |     Ctrl + 3     |    Ctrl + 3     |
| Fullscreen mode |  Command + F   |     Ctrl + F     |    Ctrl + F     |
| Reset game      |  Command + R   |     Ctrl + R     |    Ctrl + R     |

## Author's note:

This emulator is compatible with both Android and iOS devices. However, WebKit on iOS has historically lagged behind; for instance, it took nearly a decade for Apple to allow developers to set a custom download filename for an `a` tag. This feature was implemented recently on iOS, so you can now download the game state. Another three iOS quirks: 1) if a slow connection causes the script to take several seconds to load, WebKit may fail to initialize the AudioContext; 2) if you send Safari to the background and return to it, there will be no audio; 3) if you click on the file selector and it takes you several seconds to choose a ROM file, there will be no audio. In any case, a manual tap on the screen is required to enable or re-enable the audio.

## Main differences with the original project:

- Transpiled JS to pre-ES2015 via `node ConverterES5.js picodrive.js`.

## This is a modified version of PicoDrive:

https://github.com/lrusso/picodrive

**NOTE:** Emscripten 4.0.23 was used to build the emulator.

## Virtual joystick code:

https://github.com/lrusso/VirtualJoystick
