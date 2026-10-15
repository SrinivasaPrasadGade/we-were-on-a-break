// 2P co-op: P1 = WASD+E, P2 = arrows + slash. Both move independently.
module.exports = async ({ page, shot }) => {
  const r = await page.evaluate(() => {
    const G = window.__gang; G.Game.manual = true;
    G.Save.data.settings.players = 2; G.Input.twoPlayer = true;
    const L = new G.LevelScene(2, { room: 0, noMusic: true });
    G.Game.setScene(L);
    for (let i = 0; i < 30; i++) G.Game.update();
    const p1 = L.p1(), p2 = L.p2();
    const before = [p1.who, p1.x, p2 && p2.who, p2 && p2.x];
    G.Input.down.add('KeyD'); G.Input.down.add('ArrowRight');
    for (let i = 0; i < 60; i++) G.Game.update();
    G.Input.down.delete('ArrowRight');
    G.Input.down.add('ArrowUp');
    for (let i = 0; i < 2; i++) G.Game.update();
    G.Input.down.delete('ArrowUp');
    for (let i = 0; i < 10; i++) G.Game.update();
    const mid = [L.p1().x, L.p2().x, L.p2().y];
    G.Input.down.clear();
    // P2 swaps friend with '.'
    G.Input.down.add('Period'); G.Game.update(); G.Input.down.delete('Period'); G.Game.update();
    const after = [L.p1().who, L.p2().who];
    for (let i = 0; i < 20; i++) G.Game.update();
    G.Game.draw(); G.present();
    return { before, mid, after };
  });
  console.log(JSON.stringify(r));
  await shot('twoplayer');
};
