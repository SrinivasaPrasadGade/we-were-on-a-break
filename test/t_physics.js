// Physics characterization: jump heights / distances for each friend
function drawEstablishing() {}
class PauseMenu { constructor() { this.closed = true; } update() {} draw() {} }
const EPISODES = [{
  title: 'Test', rooms: [{
    name: 'Test Lab', theme: 'hall', map: [
      '################################################################################',
      '#..............................................................................#',
      '#..............................................................................#',
      '#..............................................................................#',
      '#..............................................................................#',
      '#..............................................................................#',
      '#..............................................................................#',
      '#..............................................................................#',
      '#..............................................................................#',
      '#..............................................................................#',
      '#..............................................................................#',
      '#..............................................................................#',
      '#..............................................................................#',
      '#..............................................................................#',
      '#@.............................................................................#',
      '################################################################################',
      '################################################################################',
    ],
  }],
}];
function startScene() { return new LevelScene(0, {}); }
boot({});
Game.manual = true;
window.__measure = function () {
  const L = Game.scene;
  const out = {};
  for (const who of FRIENDS) {
    for (const mode of ['single', 'double']) {
      if (mode === 'double' && who !== 'mila') continue;
      // fresh room
      L.loadRoom(0);
      const f = L.friends.find(q => q.who === who);
      for (const q of L.friends) if (q !== f) q.present = false;
      L.ctrl[0] = FRIENDS.indexOf(f.who);
      f.x = 40; f.y = 15 * 16 - f.h; f.alpha = 1; f.fadeIn = 0;
      for (let i = 0; i < 30; i++) Game.update();
      // run up to speed
      Input.down.add('KeyD');
      for (let i = 0; i < 40; i++) Game.update();
      const x0 = f.x, y0 = f.y + f.h;
      let minY = y0, frames = 0, landedX = null;
      Input.down.add('Space'); Input.pressedKeys.add('Space');
      let didDouble = false;
      for (let i = 0; i < 200; i++) {
        if (mode === 'double' && !didDouble && f.vy >= -0.5 && i > 2) { Input.down.delete('Space'); Game.update(); frames++; Input.down.add('Space'); didDouble = true; }
        Game.update();
        frames++;
        minY = Math.min(minY, f.y + f.h);
        if (i > 3 && f.onGround) { landedX = f.x; break; }
      }
      Input.down.delete('Space'); Input.down.delete('KeyD');
      out[who + '_' + mode] = { height: +(y0 - minY).toFixed(1), dist: +(landedX - x0).toFixed(1), frames, speed: f.speed };
    }
  }
  return out;
};
