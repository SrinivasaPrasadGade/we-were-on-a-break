// Render every room of episode $EP (pans across wide/tall rooms). NODARK=1 disables darkness.
module.exports = async ({ page, shot }) => {
  const ep = parseInt(process.env.EP || '0', 10);
  const nodark = !!process.env.NODARK;
  const n = await page.evaluate((ep) => window.__gang.EPISODES[ep].rooms.length, ep);
  for (let r = 0; r < n; r++) {
    await page.evaluate(([ep, r, nodark]) => {
      const G = window.__gang; G.Game.manual = true;
      if (nodark) G.EPISODES[ep].rooms[r].dark = false;
      const L = new G.LevelScene(ep, { room: r, noMusic: true });
      G.Game.setScene(L);
      for (let i = 0; i < 90; i++) G.Game.update();
      G.Game.draw(); G.present();
    }, [ep, r, nodark]);
    await shot('ep' + ep + '_room' + r + '_a');
    const [w, h] = await page.evaluate(() => [window.__gang.Game.scene.room.w, window.__gang.Game.scene.room.h]);
    let k = 0;
    for (let y = 0; y < h; y += 240) {
      for (let x = 0; x < w; x += 440) {
        k++;
        await page.evaluate(([x, y]) => { const G = window.__gang; const L = G.Game.scene; L.cam.x = Math.max(0, Math.min(x, L.room.w - 480)); L.cam.y = Math.max(0, Math.min(y, L.room.h - 270)); G.Game.draw(); G.present(); }, [x, y]);
        await shot('ep' + ep + '_room' + r + '_p' + k);
        if (x + 480 >= w) break;
      }
      if (y + 270 >= h) break;
    }
  }
};
