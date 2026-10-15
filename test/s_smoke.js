module.exports = async ({ page, shot }) => {
  await shot('00_boot');
  // manual stepping
  const step = (n) => page.evaluate(n => { const G = window.__gang.Game; G.manual = true; for (let i = 0; i < n; i++) G.update(); G.draw(); window.__gang.present(); }, n);
  await page.evaluate(() => { window.__gang.Game.manual = true; });
  await page.keyboard.press('Space');
  await step(60); await shot('01_opening_a');
  await step(400); await shot('02_opening_b');
  await step(500); await shot('03_opening_c');
  await step(700); await shot('04_opening_d');
  await step(900); await shot('05_opening_e');
  await page.keyboard.press('Enter'); await step(80); await shot('06_title');
};
