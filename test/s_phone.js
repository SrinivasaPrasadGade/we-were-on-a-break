// Phone-sized viewports: portrait + landscape, level with touch buttons
module.exports = async ({ page, shot }) => {
  for (const [name, w, h] of [['phone_land', 844, 390], ['phone_port', 390, 844]]) {
    await page.setViewportSize({ width: w, height: h });
    await page.waitForTimeout(150);
    await page.evaluate(() => {
      const G = window.__gang; G.Game.manual = true;
      G.Save.data.settings.touch = 'on'; G.Input.touchUI = true;
      window.dispatchEvent(new Event('resize'));
      const L = new G.LevelScene(0, { room: 0, noMusic: true });
      G.Game.setScene(L);
      for (let i = 0; i < 90; i++) G.Game.update();
      G.Game.draw(); G.present();
    });
    await shot(name);
    const dims = await page.evaluate(() => { const c = document.querySelector('canvas'); const r = c.getBoundingClientRect(); return [r.x, r.y, r.width, r.height, c.width, c.height, document.documentElement.scrollWidth, window.innerWidth]; });
    console.log(name, JSON.stringify(dims));
  }
};
