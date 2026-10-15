// Hub overlays with mid-game progress: chalkboard, mug shelf, wardrobe
module.exports = async ({ page, shot }) => {
  await page.evaluate(() => {
    const G = window.__gang; G.Game.manual = true;
    const S = G.Save.data;
    S.done = {}; S.stars = {}; S.mugs = {};
    for (let i = 0; i < 8; i++) { S.done[i] = true; S.stars[i] = (i % 3) + 1; if (i % 2 === 0) S.mugs[i] = true; }
    G.Game.setScene(new G.HubScene());
    for (let i = 0; i < 60; i++) G.Game.update();
    G.Game.draw(); G.present();
  });
  await shot('hub_0');
  for (const kind of ['chalk', 'shelf', 'wardrobe']) {
    await page.evaluate((kind) => {
      const G = window.__gang; const H = G.Game.scene;
      H.overlay = null;
      const f = H.level ? H.level.p1() : null;
      H.useSpot({ kind }, f || { who: 'dex' });
      for (let i = 0; i < 40; i++) G.Game.update();
      G.Game.draw(); G.present();
    }, kind);
    await shot('hub_' + kind);
  }
};
