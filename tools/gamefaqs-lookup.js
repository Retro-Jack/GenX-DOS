/* Pull scoring data out of GameFAQs for the arcade gamedocs.
 *
 * WHY IT RUNS IN THE BROWSER: gamefaqs.gamespot.com answers 403 to anything that
 * is not a real browser session. Pasted into the console on a GameFAQs page,
 * these same-origin fetches carry that session and work.
 *
 * WHY IT IS THIS FIDDLY: the guides are written by different people over twenty
 * years, so there is no common layout. Three shapes turn up:
 *   - hand-drawn ASCII inside <pre>, headed "SCORING"
 *   - real HTML tables, where textContent runs the cells together
 *     ("Smart Missile125 ptsSatellite100 pts") unless separators are put back
 *   - prose with no scoring section at all
 * So it tries a heading first, then falls back to any cluster of "N points"
 * lines, and gives up honestly rather than guessing.
 *
 * Usage:  await gf.forGame('Centipede')
 */
window.gf = {
  sleep: ms => new Promise(r => setTimeout(r, ms)),

  async get(url) {
    const r = await fetch(url, { credentials: 'same-origin' });
    if (!r.ok) throw new Error(url + ' -> ' + r.status);
    return new DOMParser().parseFromString(await r.text(), 'text/html');
  },

  /* Match on the URL SLUG, never the link text: search rows link out as "Data",
   * "Guides", "Q&A", so matching text picked Gauntlet Legends for Gauntlet. */
  async findArcade(title) {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const d = await this.get('/search?game=' + encodeURIComponent(title));
    const all = [...new Set([...d.querySelectorAll('a[href^="/"]')]
      .map(a => a.getAttribute('href'))
      .filter(h => /^\/[a-z0-9]+\/\d+-/.test(h) && !h.startsWith('/boards/'))
      .map(h => h.split('/').slice(0, 3).join('/')))];
    const exact = all.find(b => b.startsWith('/arcade/') && b.replace(/^\/arcade\/\d+-/, '') === slug);
    if (exact) return exact;
    /* Not every arcade release surfaces in search; a same-titled home release
     * often links to it from its own page. */
    for (const b of all.filter(x => x.replace(/^\/[a-z0-9]+\/\d+-/, '') === slug).slice(0, 4)) {
      await this.sleep(500);
      let g; try { g = await this.get(b); } catch (e) { continue; }
      const arc = g.querySelector('a[href^="/arcade/"]');
      if (arc) return arc.getAttribute('href').split('/').slice(0, 3).join('/');
    }
    return null;
  },

  async guides(base) {
    const d = await this.get(base + '/faqs');
    return [...d.querySelectorAll('a[href*="/faqs/"]')]
      .map(a => ({ href: a.getAttribute('href') }))
      .filter(g => /\/faqs\/\d+/.test(g.href));
  },

  async text(href) {
    const d = await this.get(href);
    d.querySelectorAll('td, th').forEach(e => e.append(document.createTextNode(' | ')));
    d.querySelectorAll('tr, p, div, li, h1, h2, h3, h4, br').forEach(e => e.append(document.createTextNode('\n')));
    /* Longest candidate, not first: .ffaq matches a header div before the body. */
    const c = [...d.querySelectorAll('#faqwrap, .ffaq, .faqtext, pre, div')]
      .map(e => e.textContent || '').sort((a, b) => b.length - a.length);
    return (c[0] || '').replace(/\r/g, '').replace(/\n{3,}/g, '\n\n');
  },

  bestScoring(t) {
    const idx = [...t.matchAll(/scoring|point values|score table/gi)].map(m => m.index);
    let best = null, bestDigits = -1;
    for (const i of idx) {
      const chunk = t.slice(i, i + 1100), dg = (chunk.match(/\d/g) || []).length;
      if (dg > bestDigits) { bestDigits = dg; best = chunk; }
    }
    if (best && bestDigits > 12) return { digits: bestDigits, excerpt: best };
    const lines = t.split('\n');
    const hits = lines.map((l, i) => [i, l])
      .filter(([, l]) => /\b\d{1,3}(,\d{3})*\s*(points|pts)\b/i.test(l));
    if (hits.length >= 3) {
      const s = hits[0][0];
      return { digits: hits.length, excerpt: lines.slice(Math.max(0, s - 4), s + 28).join('\n').slice(0, 1200) };
    }
    return null;
  },

  async forGame(title) {
    const base = await this.findArcade(title);
    if (!base) return { title, error: 'no arcade page on GameFAQs' };
    await this.sleep(500);
    for (const g of (await this.guides(base)).slice(0, 6)) {
      await this.sleep(500);
      let t; try { t = await this.text(g.href); } catch (e) { continue; }
      if (t.length < 3000) continue;
      const s = this.bestScoring(t);
      if (s) return { title, base, guide: g.href, excerpt: s.excerpt };
    }
    return { title, base, error: 'no scoring in the first six guides' };
  },
};
