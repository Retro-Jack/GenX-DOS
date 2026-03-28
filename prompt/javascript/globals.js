// ============================================================
// PALETTE
// 16-color CGA/EGA palette (indices 0-15)
// ============================================================
var pal = [
    "#000000", "#0000aa", "#00aa00", "#00aaaa",
    "#aa0000", "#aa00aa", "#aa5500", "#aaaaaa",
    "#555555", "#5555ff", "#55ff55", "#55ffff",
    "#ff5555", "#ff55ff", "#ffff55", "#ffffff"
];

// ============================================================
// FONT SYSTEM
// Generates CSS background-position rules for each character
// in the 16x16 bitmap font sprite sheet, then loads per-color
// font images into a hidden #fonts div.
// ============================================================
var fontSrc = [];

// ============================================================
// KEYBOARD STATE & COLOR
// ============================================================
var txtPal = { bg: 0, fg: 7 }; // current foreground/background palette indices

// ============================================================
// KEYBOARD HANDLER — keyup
// Resets arrow-key held state.
// ============================================================
var kUp = false, kDown = false;

// ============================================================
// INITIALIZATION
// Wires up the DOM, starts the cursor blink interval,
// renders the prompt, and runs AUTOEXEC.BAT if present.
// ============================================================
var cursorEl, promptEl;

// Current directory path as array of indices into fs[0].directories
var path = [0];

// ============================================================
// PROMPT & DISPLAY
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
var cmdStack    = [];   // history of entered commands
var cmdStackIdx = -1;   // current position in history (for up/down navigation)
var ctxStack    = [];   // active program context stack (for context-aware input)
var curItvl;            // cursor blink interval handle
