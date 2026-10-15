module.exports = async ({ page }) => {
  const res = await page.evaluate(() => {
    const G = window.__gang; G.Game.manual = true;
    const L = new G.LevelScene(4, { room: 2, noMusic: true });
    G.Game.setScene(L);
    for (let i = 0; i < 30; i++) G.Game.update();
    const N = 200; let tDraw = 0, tPresent = 0;
    for (let i = 0; i < N; i++) {
      G.Game.update();
      const a = performance.now(); G.Game.draw(); const b = performance.now(); G.present(); const c = performance.now();
      tDraw += b - a; tPresent += c - b;
    }
    // break down the level draw
    const parts = {};
    const wrap = (obj, name, key) => { const f = obj[key]; obj[key] = function () { const a = performance.now(); const r = f.apply(this, arguments); parts[name] = (parts[name] || 0) + performance.now() - a; return r; }; };
    wrap(L, 'drawHUD', 'drawHUD'); wrap(L, 'drawBubbles', 'drawBubbles');
    for (const e of L.room.ents) { const f = e.draw; e.draw = function () { const a = performance.now(); const r = f.apply(this, arguments); parts['ent:' + e.constructor.name] = (parts['ent:' + e.constructor.name] || 0) + performance.now() - a; return r; }; }
    for (const f0 of L.friends) { const f = f0.draw; f0.draw = function () { const a = performance.now(); const r = f.apply(this, arguments); parts.friends = (parts.friends || 0) + performance.now() - a; return r; }; }
    for (let i = 0; i < N; i++) { G.Game.update(); G.Game.draw(); }
    const out = { draw: (tDraw / N).toFixed(2), present: (tPresent / N).toFixed(2) };
    for (const k in parts) out[k] = (parts[k] / N).toFixed(2);
    return out;
  });
  console.log(JSON.stringify(res, null, 1));
};
