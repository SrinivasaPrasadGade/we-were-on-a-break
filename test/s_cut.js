// Render a cutscene of episode $EP ($PART = coldOpen|tag|previously) at regular beats.
module.exports = async ({ page, shot }) => {
  const ep = parseInt(process.env.EP || '0', 10);
  const part = process.env.PART || 'coldOpen';
  const every = parseInt(process.env.EVERY || '90', 10);
  await page.evaluate(([ep, part]) => {
    const G = window.__gang; G.Game.manual = true;
    const E = G.EPISODES[ep];
    G.Game.setScene(new G.CutsceneScene(E[part], { recap: part === 'previously', done: () => { window.__cutDone = true; } }));
  }, [ep, part]);
  for (let k = 0; k < 40; k++) {
    const done = await page.evaluate((n) => { const G = window.__gang; for (let i = 0; i < n && !window.__cutDone; i++) G.Game.update(); G.Game.draw(); G.present(); return !!window.__cutDone; }, every);
    await shot(`cut_${part}_${String(k).padStart(2, '0')}`);
    if (done) break;
  }
};
