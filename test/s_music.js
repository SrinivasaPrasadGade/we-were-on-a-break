// compile every song and report event counts / errors
module.exports = async ({ page }) => {
  const r = await page.evaluate(() => {
    const G = window.__gang; const out = [];
    for (const name of Object.keys(G.SONGS)) {
      try { const cs = G.compileSong(G.SONGS[name]); const ev = cs.events || cs.ev || cs; const bad = ev.filter(e => !isFinite(e.t) || !isFinite(e.m || 0) || (e.m !== undefined && (e.m < 20 || e.m > 110))); out.push(name + ': ' + ev.length + ' events' + (bad.length ? ' BAD ' + bad.length + ' ' + JSON.stringify(bad[0]) : '')); } catch (e) { out.push(name + ' ERR ' + e.message); }
    }
    return out;
  });
  console.log(r.join('\n'));
};
