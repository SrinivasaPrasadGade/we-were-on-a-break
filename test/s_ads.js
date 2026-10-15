// Commercial breaks: the cards and every ad at its last beat (badge, price, phone and fine print showing)
module.exports = async ({ page, shot }) => {
  const which = (process.env.ADS || '0,1,2,3,4,5,6,7,8,9,10,11,12').split(',').map(Number);
  await page.evaluate(() => { const G = window.__gang; G.Game.manual = true; });
  const run = (fn, arg) => page.evaluate(fn, arg);
  await run(() => { const G = window.__gang; const A = new G.AdBreakScene(G.ADS[0], {}); G.Game.setScene(A); A.enter(); for (let i = 0; i < 40; i++) G.Game.update(); G.Game.draw(); G.present(); });
  await shot('ad_card_out');
  for (const i of which) {
    const info = await run((i) => {
      const G = window.__gang; const A = new G.AdBreakScene(G.ADS[i], {}); G.Game.setScene(A); A.enter();
      let guard = 0;
      while (A.phase !== 'ad' && guard++ < 400) G.Game.update();
      // advance to the beat that reveals the most, then let it type out
      const target = Math.max(0, G.ADS[i].beats.length - 2);
      while (A.beat < target && guard++ < 6000) G.Game.update();
      for (let k = 0; k < 60; k++) G.Game.update();
      G.Game.draw(); G.present();
      return { beat: A.beat, phase: A.phase };
    }, i);
    await shot('ad_' + String(i).padStart(2, '0'));
  }
  await run(() => { const G = window.__gang; const A = G.Game.scene; A.setPhase('back'); for (let i = 0; i < 30; i++) G.Game.update(); G.Game.draw(); G.present(); });
  await shot('ad_card_back');
};
