const path = require('path');
module.exports = async ({ page, shot, logs }) => {
  await page.addScriptTag({ path: path.join(__dirname, 'bot.js') });
  for (const f of require('fs').readdirSync(__dirname).filter(f => /^sol_ep\d+\.js$/.test(f))) await page.addScriptTag({ path: path.join(__dirname, f) });
  const ep = parseInt(process.env.EP || '0', 10);
  const S = (n) => page.evaluate(n => { const G = window.__gang; for (let i = 0; i < n; i++) G.Game.update(); G.Game.draw(); G.present(); }, n);
  const sceneName = () => page.evaluate(() => window.__gang.Game.scene && window.__gang.Game.scene.constructor.name);
  await page.evaluate((ep) => { const G = window.__gang; G.Game.manual = true; G.playEpisode(ep); }, ep);
  // cold open: let it play a bit, screenshot a few beats
  for (let k = 0; k < 6; k++) { await S(150); await shot(`flow_${k}_` + await sceneName()); }
  // advance through the cutscene quickly by holding E (advances bubbles)
  for (let i = 0; i < 80; i++) {
    const n = await sceneName();
    if (n !== 'CutsceneScene') break;
    await page.evaluate(() => { const G = window.__gang; G.Input.pressedKeys.add('KeyE'); G.Game.update(); for (let i = 0; i < 20; i++) G.Game.update(); });
  }
  await S(60); await shot('flow_10_' + await sceneName());
  await S(60); await shot('flow_11_' + await sceneName());
  // wait for the level
  for (let i = 0; i < 60 && (await sceneName()) !== 'LevelScene'; i++) await S(20);
  await S(40); await shot('flow_12_' + await sceneName());
  const nRooms = await page.evaluate(ep => window.__gang.EPISODES[ep].rooms.length, ep);
  for (let r = 0; r < nRooms; r++) {
    const res = await page.evaluate(([ep, r]) => {
      const B = window.__bot, L = window.__gang.Game.scene;
      if (L.roomIndex !== r) return 'wrong room ' + L.roomIndex;
      try { window.__sol[ep][r](B); } catch (e) { return 'FAIL ' + e.message; }
      return 'ok';
    }, [ep, r]);
    console.log('room', r, res);
    await S(5); await shot(`flow_2${r}_room_exit`);
    // wait for transition / next room
    for (let i = 0; i < 40; i++) { const ok = await page.evaluate(r => { const s = window.__gang.Game.scene; return s.constructor.name !== 'LevelScene' || (s.roomIndex === r + 1 && !s.trans); }, r); if (ok) break; await S(10); }
    await S(30);
  }
  for (let k = 0; k < 6; k++) { await S(120); await shot(`flow_3${k}_` + await sceneName()); }
  // skip ahead through results/tag/credits
  for (let i = 0; i < 40; i++) {
    const n = await sceneName();
    if (n === 'HubScene') break;
    await page.evaluate(() => { const G = window.__gang; G.Input.pressedKeys.add('KeyE'); G.Game.update(); for (let i = 0; i < 40; i++) G.Game.update(); });
    if (i % 4 === 0) { await S(1); await shot(`flow_4${i}_` + await sceneName()); }
  }
  await S(120); await shot('flow_90_' + await sceneName());
  const save = await page.evaluate(() => JSON.stringify(window.__gang.Save.data));
  console.log('save', save);
};
