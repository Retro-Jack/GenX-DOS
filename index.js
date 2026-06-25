'use strict';

// GenX-DOS ships as a static, client-side site (no build step). This entry
// point exists so the npm package is "reusable" programmatically: it resolves
// the directory holding the bundled site so a host app can serve it.
//
//   const genxdos = require('@retro-jack/genx-dos');
//   app.use(express.static(genxdos.path));   // then open the root
//
// `path` is the package root (where index.html lives, which redirects to
// prompt/). There is nothing to import at runtime — the value is the folder.
module.exports = {
  path: __dirname,
  indexHtml: require('path').join(__dirname, 'index.html'),
};
