// Measure average update+draw+present ms per frame in a few heavy rooms
module.exports = async ({ page }) => {
  const cases = [[3, 0], [3, 1], [12, 4], [10, 1], [7, 2], [4, 2], [0, 0]];
  for (const [ep, r] of cases) {
    const res = await page.evaluate(([ep, r]) => {
      const G = window.__gang; G.Game.manual = true;
      const L = new G.LevelScene(ep, { room: r, noMusic: true });
      G.Game.setScene(L);
      for (let i = 0; i < 30; i++) G.Game.update();
      // walk right while measuring
      G.Input.down.add('KeyD');
      const N = 240; let tu = 0, td = 0;
      for (let i = 0; i < N; i++) {
        const a = performance.now(); G.Game.update(); const b = performance.now(); G.Game.draw(); G.present(); const c = performance.now();
        tu += b - a; td += c - b;
      }
      G.Input.down.clear();
      return { name: G.EPISODES[ep].rooms[r].name, update: (tu / N).toFixed(2), draw: (td / N).toFixed(2), ents: L.room.ents.length };
    }, [ep, r]);
    console.log(`E${ep + 1}R${r + 1} ${res.name}: update ${res.update}ms draw ${res.draw}ms ents=${res.ents}`);
  }
};
