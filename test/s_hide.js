const path = require('path');
module.exports = async ({ page, shot }) => {
  await page.addScriptTag({ path: path.join(__dirname, 'bot.js') });
  await page.evaluate(() => {
    const G = window.__gang, B = window.__bot;
    G.Game.manual = true;
    const L = new G.LevelScene(6, { room: 0, noMusic: true });
    G.Game.setScene(L);
    B.step(30);
    B.as('priya');
    B.walkTo(8 * 16 + 4); B.jumpTo(14 * 16 + 8);
    B.walkTo(20 * 16, { tol: 2 });
    B.use(); B.step(70);
    B.as('mila'); B.walkTo(8 * 16 + 4, { tol: 3 }); B.jumpTo(12 * 16 + 12); B.walkTo(13 * 16, { tol: 2 }); B.use(); B.step(40);
    B.as('dex'); B.walkTo(17 * 16 + 8, { tol: 3 }); B.step(5);
    G.Game.draw(); G.present();
  });
  await shot('hide_test');
};
