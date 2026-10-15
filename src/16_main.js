// ---------------------------------------------------------------------------
// Save data, scene manager, main loop, boot
// ---------------------------------------------------------------------------
const SAVE_KEY = 'the-gangs-all-here.save.v1';
const reducedMotion = (() => { try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } })();
function deepMerge(base, over) {
  if (!over || typeof over !== 'object') return base;
  for (const k of Object.keys(over)) {
    if (base[k] && typeof base[k] === 'object' && !Array.isArray(base[k]) && over[k] && typeof over[k] === 'object') base[k] = deepMerge(base[k], over[k]);
    else if (over[k] !== undefined) base[k] = over[k];
  }
  return base;
}
const Save = {
  data: null, available: true,
  defaults() {
    return {
      v: 1, done: {}, stars: {}, bestCups: {}, mugs: {}, outfits: {}, seenOpening: false, lastEp: 0, totalTakes: 0,
      settings: { music: 7, sfx: 8, laugh: true, ads: true, shake: !reducedMotion, touch: 'auto', follow: false, players: 1 },
    };
  },
  load(snapshot) {
    let d = null;
    try { const raw = window.localStorage.getItem(SAVE_KEY); if (raw) d = JSON.parse(raw); } catch (e) { d = null; this.available = false; }
    if (!d && snapshot && snapshot.save) d = snapshot.save;
    this.data = deepMerge(this.defaults(), d || {});
  },
  write() { try { window.localStorage.setItem(SAVE_KEY, JSON.stringify(this.data)); } catch (e) { this.available = false; } },
  reset() { const s = this.data.settings; this.data = this.defaults(); this.data.settings = s; this.write(); },
};

const Game = {
  scene: null, overlay: null, t: 0, manual: false,
  fade: { a: 0, dir: 0, speed: 0.08, next: null, col: '#0a060e' },
  go(scene, opts) {
    opts = opts || {};
    if (opts.instant || !this.scene) { this.setScene(scene); return; }
    this.fade.next = scene; this.fade.dir = 1; this.fade.speed = opts.speed || 0.09; this.fade.col = opts.col || '#0a060e';
  },
  setScene(s) {
    this.scene = s;
    if (s && s.enter) s.enter();
  },
  touchControlsActive() { return !!(this.scene && this.scene.wantsTouch && !this.overlay); },
  openPause(level) { this.overlay = new PauseMenu(level); AudioSys.sfx('select'); },
  update() {
    this.t++;
    Input.poll();
    if (Input.twoPlayer !== (Save.data.settings.players === 2)) Input.twoPlayer = Save.data.settings.players === 2;
    if (this.fade.dir === 1) {
      this.fade.a += this.fade.speed;
      if (this.fade.a >= 1) { this.fade.a = 1; this.fade.dir = -1; const n = this.fade.next; this.fade.next = null; if (n) this.setScene(n); }
    } else if (this.fade.dir === -1) {
      this.fade.a -= this.fade.speed;
      if (this.fade.a <= 0) { this.fade.a = 0; this.fade.dir = 0; }
    }
    if (this.fade.dir !== 1) {
      if (this.overlay) { this.overlay.update(); if (this.overlay && this.overlay.closed) this.overlay = null; }
      else if (this.scene) this.scene.update();
    }
    Input.endFrame();
  },
  draw() {
    if (this.scene) this.scene.draw();
    if (this.overlay) this.overlay.draw();
    if (this.fade.a > 0) { ctx.globalAlpha = this.fade.a; ctx.fillStyle = this.fade.col; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; }
  },
};

// ---- main loop ------------------------------------------------------------------
let _last = 0, _acc = 0;
function frame(now) {
  requestAnimationFrame(frame);
  if (Game.manual) return;
  if (!_last) _last = now;
  let dt = (now - _last) / 1000; _last = now;
  if (dt > 0.1) dt = 0.1;
  _acc += dt;
  let steps = 0;
  while (_acc >= 1 / 60 && steps < 4) { Game.update(); _acc -= 1 / 60; steps++; }
  if (steps >= 4) _acc = 0;
  if (steps > 0) { Game.draw(); present(); }
}

function boot(snapshot) {
  Save.load(snapshot);
  Input.twoPlayer = Save.data.settings.players === 2;
  if (Save.data.settings.touch === 'on') Input.touchUI = true;
  resizeScreen();
  window.addEventListener('resize', resizeScreen);
  if (window.ResizeObserver) { try { new ResizeObserver(resizeScreen).observe(screenCanvas); } catch (e) { /* ignore */ } }
  try { window.claude && window.claude.hot && window.claude.hot.snapshot && window.claude.hot.snapshot(() => ({ save: Save.data })); } catch (e) { /* ignore */ }
  Game.setScene(startScene());
  requestAnimationFrame(frame);
}
