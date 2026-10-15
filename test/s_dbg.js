const path = require('path');
module.exports = async ({ page }) => {
  await page.addScriptTag({ path: path.join(__dirname, 'bot.js') });
  const r = await page.evaluate(() => {
    const G = window.__gang, B = window.__bot;
    G.Game.manual = true;
    const L = new G.LevelScene(2, { room: 2, noMusic: true });
    G.Game.setScene(L);
    B.step(30);
    B.as('priya');
    B.walkTo(4 * 16 + 8); B.walkTo(11 * 16 + 4, { tol: 3 });
    const f = B.f();
    const insp = L.room.ents.find(e => e.constructor.name === 'NPC');
    const best = L.bestInteractable(f);
    return { f: [f.x, f.y, f.w, f.h], insp: insp && [insp.x, insp.y, insp.w, insp.h, insp.state, insp.gone], ub: insp && insp.useBox(), best: best && [best.ent.constructor.name, best.info], ents: L.room.ents.map(e => e.constructor.name).join(',') };
  });
  console.log(JSON.stringify(r, null, 1));
};
