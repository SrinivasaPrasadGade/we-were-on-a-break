const path = require('path');
module.exports = async ({ page }) => {
  await page.addScriptTag({ path: path.join(__dirname, 'bot.js') });
  await page.addScriptTag({ path: path.join(__dirname, 'sol_ep5.js') });
  const r = await page.evaluate(() => {
    const G = window.__gang, B = window.__bot;
    G.Game.manual = true;
    const L = new G.LevelScene(4, { room: 0, noMusic: true });
    G.Game.setScene(L);
    B.step(30);
    const out = [];
    B.onStep = () => { const f = B.f(); if (f.who === 'mila' && B.frames % 20 === 0 && B.frames > 900) out.push([B.frames, f.cx.toFixed(1), f.y.toFixed(1), (f.y + f.h).toFixed(1), f.vy.toFixed(2), f.onGround, f.climbing].join(' ')); };
    try { window.__sol[4][0](B); } catch (e) { out.push('ERR ' + e.message); }
    return out.slice(0, 80);
  });
  console.log(r.join('\n'));
};
