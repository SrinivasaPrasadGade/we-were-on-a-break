module.exports = async ({ page, shot }) => {
  const ep = parseInt(process.env.EP || '0', 10);
  const n = await page.evaluate((ep) => window.__gang.EPISODES[ep].rooms.length, ep);
  for (let r = 0; r < n; r++) {
    await page.evaluate(([ep, r]) => {
      const G = window.__gang; G.Game.manual = true;
      const L = new G.LevelScene(ep, { room: r, noMusic: true });
      G.Game.setScene(L);
      for (let i = 0; i < 90; i++) G.Game.update();
      G.Game.draw(); G.present();
    }, [ep, r]);
    await shot('ep' + ep + '_room' + r + '_a');
    // pan camera across the room
    const w = await page.evaluate(() => window.__gang.Game.scene.room.w);
    for (let k = 1; k * 400 < w - 200; k++) {
      await page.evaluate((x) => { const G = window.__gang; const L = G.Game.scene; L.cam.x = Math.min(x, L.room.w - 480); L.cam.y = Math.max(0, L.room.h - 270); G.Game.draw(); G.present(); }, k * 400);
      await shot('ep' + ep + '_room' + r + '_' + String.fromCharCode(97 + k));
    }
  }
};
