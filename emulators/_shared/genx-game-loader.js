// Common "fetch games.json + look up game by ?game=KEY" helper used by
// every play.html that follows the GenX-DOS pattern. Returns
// {key, game} on success; on failure, renders an error message into
// `errorTarget` (a CSS selector, default '#game') and returns null.
//
//   const r = await window.genxLoadGame();
//   if (!r) return;             // error already shown
//   const { key, game } = r;
//   // ... emulator-specific setup using game.rom, game.title, etc.
window.genxLoadGame = async function (errorTarget) {
  const target = errorTarget || '#game';
  const fail = (msg) => {
    const el = document.querySelector(target);
    if (el) el.innerHTML = '<div class="err">' + msg + '</div>';
    else document.body.innerHTML = '<div class="err" style="padding:20px;color:#fff;font-family:monospace">' + msg + '</div>';
  };
  const params = new URLSearchParams(location.search);
  const key = params.get('game');
  if (!key) { fail('No game specified.'); return null; }
  let games;
  try { games = await (await fetch('games.json')).json(); }
  catch (e) { fail('Failed to load games.json: ' + e.message); return null; }
  const game = games[key];
  if (!game) { fail('Unknown game key: ' + key); return null; }
  document.title = game.title || key;
  return { key, game, fail };
};
