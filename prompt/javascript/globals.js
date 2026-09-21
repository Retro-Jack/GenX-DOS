// ============================================================
// VERSION
// What COMMAND.COM reports. Keep it in step with the newest release
// heading in CHANGELOG.md — check-doc-counts.sh compares the two.
// ============================================================
var GENX_VERSION = '1.10.0';

// ============================================================
// PATH
// DOS looked for a program in the current directory first and then in
// each directory named by the PATH environment variable, which
// AUTOEXEC.BAT set. Ours is fixed and holds the drive root, where
// COMMAND.COM sits, so the interpreter answers from anywhere on C:.
// ============================================================
var GENX_PATH = ['C:\\'];

// ============================================================
// PALETTE
// 16-color CGA/EGA palette (indices 0-15)
// ============================================================
var pal = [
  '#000000',
  '#0000aa',
  '#00aa00',
  '#00aaaa',
  '#aa0000',
  '#aa00aa',
  '#aa5500',
  '#aaaaaa',
  '#555555',
  '#5555ff',
  '#55ff55',
  '#55ffff',
  '#ff5555',
  '#ff55ff',
  '#ffff55',
  '#ffffff',
];

// ============================================================
// FONT SYSTEM
// URL of the font sheet in each palette colour, indexed like pal.
// Filled by goFontGo() in goFontGo.js.
// ============================================================
var fontSrc = [];

// ============================================================
// TEXT COLOUR
// Palette indices that newly drawn characters take. SETCOL changes them.
// ============================================================
var txtPal = {
  bg: 0,
  fg: 7,
}; // current foreground/background palette indices

// ============================================================
// ARROW KEYS
// True while Up or Down is held. Their key codes, 38 and 40, are also
// the codes of '&' and '(', so the keypress handler ignores those codes
// while an arrow is down rather than typing the character. Set in
// doKeyDown, cleared in doKeyUp (keyboard.js).
// ============================================================
var kUp = false,
  kDown = false;

// ============================================================
// SCREEN
// promptEl is #prompt, which every character is drawn into; cursorEl is
// the blinking cursor, and new characters are inserted just before it.
// Both are set up in init.js.
// ============================================================
var cursorEl, promptEl;

// Current directory as a list of indices: path[0] picks the drive in fs,
// and each later entry picks a child of the directory before it.
var path = [0];

// ============================================================
// PROMPT & DISPLAY
// promptMode is true while the terminal writes its own text. That text is
// typed through the keypress handler like anything else, and promptMode
// marks those characters as protected (class 'p'), so pressing Enter
// reads back only what the user typed after them.
// bEchoOff is ECHO OFF: no prompt and no echoed Enter between commands.
// ============================================================
var promptMode = false;

var bEchoOff = false;

// ============================================================
// COMMAND REGISTRY
// Commands are registered by name and dispatched via handleCmd.
// ============================================================
var commands = {};

// ============================================================
// RUNTIME STATE
// ============================================================
var cmdStack = []; // history of entered commands
var cmdStackIdx = -1; // current position in history (for up/down navigation)
var ctxStack = []; // running programs; the top one receives each entered line
var curItvl; // cursor blink interval handle
