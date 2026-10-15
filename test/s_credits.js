module.exports = async ({ page, shot }) => {
  await page.evaluate(() => {
    const G = window.__gang; G.Game.manual = true;
    G.Save.data.done = {}; for (let i = 0; i < 13; i++) G.Save.data.done[i] = true;
    G.Save.data.mugs = { 0: true, 4: true, 12: true };
    const C = window.__gang.Game.scene.constructor; void C;
  });
  await page.evaluate(() => { const G = window.__gang; const CS = window.__CreditsScene; void CS; });
  for (let k = 0; k < 16; k++) {
    await page.evaluate((k) => {
      const G = window.__gang;
      if (k === 0) { G.Game.setScene(new G.CreditsScene('end', 12, { done: () => {} })); }
      for (let i = 0; i < 150; i++) G.Game.update();
      G.Game.draw(); G.present();
    }, k);
    await shot('endcred_' + String(k).padStart(2, '0'));
  }
};
