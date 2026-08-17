// SPDX-License-Identifier: GPL-3.0-or-later
// Part of GenX-DOS. This file runs alongside GPL-licensed emulator
// engines, so it is GPL-3.0-or-later rather than the repo's CC BY-NC.
// Stop EmulatorJS chasing a regional English translation that was never there.
//
// EJS short-circuits only two locales without a fetch — "en" and "en-US"
// (loader.js, defaultLangs). Every other locale makes it request
// localization/<locale>.json first and fall back to the base language after.
// It ships en.json but no regional English, so an en-GB, en-NZ, en-AU, en-CA
// (and so on) visitor takes a 404 and a console warning on every single
// emulator load before landing on exactly the English it would have used
// anyway.
//
// Pinning those locales to plain "en" makes loader.js return immediately.
// Nothing is lost: an en-GB override would be an empty file, since the only
// American spellings in en.json are inside the proper nouns "EmulatorJS
// License" and "RetroArch License", which are names and stay as they are.
//
// Deliberately narrow. Locales EJS really does translate — fr, de, es and the
// rest — are left alone so they keep working; this only catches the English
// regions where the fetch is guaranteed to miss.
//
// Load before whichever script sets up the EJS globals and injects loader.js.
(function () {
  try {
    var lang = navigator.language || '';
    if (/^en[-_]/i.test(lang)) window.EJS_language = 'en';
  } catch (e) {}
})();
