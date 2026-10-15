const path = require('path');
module.exports = async ({ page }) => {
  await page.addScriptTag({ path: path.join(__dirname, 'bot.js') });
  await page.addScriptTag({ path: path.join(__dirname, 'sol_ep11.js') });
  const r = await page.evaluate(() => {
    const G = window.__gang, B = window.__bot;
    G.Game.manual = true;
    const L = new G.LevelScene(10, { room: 1, noMusic: true });
    G.Game.setScene(L);
    B.step(30);
    const out = [];
    let lastTakes = 1;
    B.onStep = () => {
      const ws = L.room.ents.filter(e => e.constructor.name === 'Watcher');
      if (B.frames % 60 === 0 || L.takes !== lastTakes) out.push(B.frames + ' who=' + B.f().who + ' x=' + B.f().x.toFixed(0) + ' st=' + B.f().state + ' | ' + ws.map(w => 'W' + w.tx + ' x=' + w.x.toFixed(0) + ' f=' + w.face + ' dance=' + w.danceT + ' alert=' + w.alertT + ' vis=' + (w.vis ? Math.round(w.vis.x) + '+' + Math.round(w.vis.w) : '-')).join(' ; ') + ' takes=' + L.takes);
      lastTakes = L.takes;
    };
    try { window.__sol[10][1](B); } catch (e) { out.push('ERR ' + e.message); }
    return out.slice(-40);
  });
  console.log(r.join('\n'));
};
