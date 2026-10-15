// ---------------------------------------------------------------------------
// Input: keyboard, gamepads, touch buttons, pointer clicks
// ---------------------------------------------------------------------------
const ACTIONS = ['left', 'right', 'up', 'down', 'jump', 'act', 'swap', 'swapPrev', 'follow', 'pause'];
const BINDS = {
  solo: {
    left: ['KeyA', 'ArrowLeft'], right: ['KeyD', 'ArrowRight'], up: ['KeyW', 'ArrowUp'], down: ['KeyS', 'ArrowDown'],
    jump: ['Space', 'KeyW', 'ArrowUp', 'KeyZ', 'KeyK'], act: ['KeyE', 'KeyX', 'Slash', 'KeyJ', 'Enter', 'NumpadEnter'],
    swap: ['KeyQ', 'Tab', 'Period'], swapPrev: ['Comma'], follow: ['KeyF'], pause: ['Escape', 'KeyP'],
  },
  p1: {
    left: ['KeyA'], right: ['KeyD'], up: ['KeyW'], down: ['KeyS'], jump: ['KeyW', 'Space'], act: ['KeyE'],
    swap: ['KeyQ', 'Tab'], swapPrev: [], follow: ['KeyF'], pause: ['Escape', 'KeyP'],
  },
  p2: {
    left: ['ArrowLeft'], right: ['ArrowRight'], up: ['ArrowUp'], down: ['ArrowDown'], jump: ['ArrowUp'],
    act: ['Slash', 'NumpadEnter', 'Numpad0'], swap: ['Period'], swapPrev: ['Comma'], follow: [], pause: [],
  },
};
const PREVENT = new Set(['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab', 'Slash', 'Quote', 'Backspace']);

function blankPad() {
  const p = { held: {}, pressed: {}, released: {} };
  for (const a of ACTIONS) { p.held[a] = false; p.pressed[a] = false; p.released[a] = false; }
  return p;
}

const Input = {
  down: new Set(),
  pressedKeys: new Set(),
  releasedKeys: new Set(),
  pads: [blankPad(), blankPad()],
  menu: { up: false, down: false, left: false, right: false, ok: false, back: false, any: false },
  twoPlayer: false,
  lastDevice: 'keys',
  touchUI: false,
  touchButtons: [],
  touchHeld: {},
  touchLatch: {},
  pointers: new Map(),
  clicks: [],
  gpPrev: [{}, {}],
  anyPressed: false,
  textHook: null,

  keyHeld(code) { return this.down.has(code); },
  keyPressed(code) { return this.pressedKeys.has(code); },

  poll() {
    // Gamepads
    let gps = [];
    try { gps = navigator.getGamepads ? Array.from(navigator.getGamepads()).filter(Boolean) : []; } catch (e) { gps = []; }
    const gpState = [null, null];
    gps.slice(0, 2).forEach((gp, i) => {
      const b = n => !!(gp.buttons[n] && gp.buttons[n].pressed);
      const ax = gp.axes[0] || 0, ay = gp.axes[1] || 0;
      gpState[i] = {
        left: b(14) || ax < -0.4, right: b(15) || ax > 0.4, up: b(12) || ay < -0.5, down: b(13) || ay > 0.5,
        jump: b(0), act: b(1) || b(2), swap: b(5), swapPrev: b(4), follow: b(3), pause: b(9) || b(8),
      };
      if (Object.values(gpState[i]).some(v => v)) this.lastDevice = 'pad';
    });

    const solo = !this.twoPlayer;
    for (let p = 0; p < 2; p++) {
      const pad = this.pads[p];
      const bind = solo ? (p === 0 ? BINDS.solo : null) : (p === 0 ? BINDS.p1 : BINDS.p2);
      const gp = solo ? (p === 0 ? (gpState[0] || gpState[1]) : null) : gpState[p];
      for (const a of ACTIONS) {
        let h = false;
        if (bind) for (const code of bind[a]) if (this.down.has(code)) { h = true; break; }
        if (gp && gp[a]) h = true;
        if (p === 0 && (this.touchHeld[a] || this.touchLatch[a])) h = true;
        pad.pressed[a] = h && !pad.held[a];
        pad.released[a] = !h && pad.held[a];
        pad.held[a] = h;
      }
      // direct friend selection keys
      pad.select = -1;
      if (solo && p === 0) {
        for (let i = 1; i <= 6; i++) if (this.pressedKeys.has('Digit' + i) || this.pressedKeys.has('Numpad' + i)) pad.select = i - 1;
        if (this.touchSelect !== undefined && this.touchSelect >= 0) pad.select = this.touchSelect;
      } else if (!solo) {
        if (p === 0) {
          for (let i = 1; i <= 6; i++) if (this.pressedKeys.has('Digit' + i)) pad.select = i - 1;
          if (this.touchSelect !== undefined && this.touchSelect >= 0) pad.select = this.touchSelect;
        } else {
          for (let i = 1; i <= 6; i++) if (this.pressedKeys.has('Numpad' + i)) pad.select = i - 1;
        }
      }
    }
    this.touchSelect = -1;
    for (const k in this.touchLatch) this.touchLatch[k] = false;

    // Menu (merged) input
    const kp = c => this.pressedKeys.has(c);
    const m = this.menu;
    const gpm = (i, a) => gpState[i] && gpState[i][a] && !(this.gpPrev[i] && this.gpPrev[i][a]);
    m.up = kp('ArrowUp') || kp('KeyW') || gpm(0, 'up') || gpm(1, 'up');
    m.down = kp('ArrowDown') || kp('KeyS') || gpm(0, 'down') || gpm(1, 'down');
    m.left = kp('ArrowLeft') || kp('KeyA') || gpm(0, 'left') || gpm(1, 'left');
    m.right = kp('ArrowRight') || kp('KeyD') || gpm(0, 'right') || gpm(1, 'right');
    m.ok = kp('Enter') || kp('Space') || kp('KeyE') || kp('NumpadEnter') || kp('KeyZ') || kp('KeyX') || kp('Slash') || gpm(0, 'jump') || gpm(1, 'jump');
    m.back = kp('Escape') || kp('Backspace') || kp('KeyP') || gpm(0, 'act') || gpm(1, 'act') || gpm(0, 'pause') || gpm(1, 'pause');
    m.any = this.pressedKeys.size > 0 || [0, 1].some(i => gpState[i] && Object.keys(gpState[i]).some(k => gpm(i, k)));
    this.gpPrev = [gpState[0] ? { ...gpState[0] } : {}, gpState[1] ? { ...gpState[1] } : {}];
    this.anyPressed = m.any || this.clicks.length > 0;
  },

  endFrame() {
    this.pressedKeys.clear();
    this.releasedKeys.clear();
    this.clicks.length = 0;
  },

  // Take one click (buffer coords) if inside rect
  clickIn(x, y, w, h) {
    for (let i = 0; i < this.clicks.length; i++) {
      const c = this.clicks[i];
      if (c.x >= x && c.x < x + w && c.y >= y && c.y < y + h) { this.clicks.splice(i, 1); return true; }
    }
    return false;
  },
  hoverIn(x, y, w, h) {
    const p = this.mouse;
    return p && p.x >= x && p.x < x + w && p.y >= y && p.y < y + h;
  },
};

window.addEventListener('keydown', e => {
  if (e.ctrlKey || e.metaKey) return;
  if (!Input.down.has(e.code)) Input.pressedKeys.add(e.code);
  Input.down.add(e.code);
  Input.lastDevice = 'keys';
  if (PREVENT.has(e.code)) e.preventDefault();
  if (typeof AudioSys !== 'undefined') AudioSys.unlock();
}, { passive: false });
window.addEventListener('keyup', e => {
  Input.down.delete(e.code);
  Input.releasedKeys.add(e.code);
});
window.addEventListener('blur', () => { Input.down.clear(); for (const k in Input.touchHeld) Input.touchHeld[k] = false; Input.pointers.clear(); });

// --- Touch controls & pointer -----------------------------------------------------
// Buttons are laid out in buffer coordinates (480x270).
function layoutTouchButtons() {
  const B = [];
  B.push({ id: 'left', x: 6, y: 206, w: 46, h: 46, label: '←' });
  B.push({ id: 'right', x: 56, y: 206, w: 46, h: 46, label: '→' });
  B.push({ id: 'up', x: 108, y: 186, w: 34, h: 32, label: '↑' });
  B.push({ id: 'down', x: 108, y: 222, w: 34, h: 32, label: '↓' });
  B.push({ id: 'jump', x: 426, y: 204, w: 48, h: 48, label: 'JUMP', round: true });
  B.push({ id: 'act', x: 372, y: 214, w: 46, h: 46, label: 'E', round: true });
  Input.touchButtons = B;
}
layoutTouchButtons();

function touchButtonAt(x, y) {
  if (!Input.touchUI || !Game.touchControlsActive()) return null;
  let best = null, bd = 1e9;
  for (const b of Input.touchButtons) {
    const pad = 8;
    if (x >= b.x - pad && x < b.x + b.w + pad && y >= b.y - pad && y < b.y + b.h + pad) {
      const d = Math.hypot(x - (b.x + b.w / 2), y - (b.y + b.h / 2));
      if (d < bd) { bd = d; best = b; }
    }
  }
  return best;
}
function refreshTouchHeld() {
  for (const a of ACTIONS) Input.touchHeld[a] = false;
  for (const [, p] of Input.pointers) {
    if (p.btn) {
      Input.touchHeld[p.btn] = true;
      if (p.btn === 'up') Input.touchHeld.jump = Input.touchHeld.jump || false;
    }
  }
}
screenCanvas.addEventListener('pointerdown', e => {
  e.preventDefault();
  screenCanvas.setAttribute('data-ptr', '');
  try { screenCanvas.focus({ preventScroll: true }); } catch (err) { /* ignore */ }
  if (typeof AudioSys !== 'undefined') AudioSys.unlock();
  const p = toBuf(e.clientX, e.clientY);
  if (e.pointerType === 'touch' || e.pointerType === 'pen') {
    if (!Input.touchUI && Save.data.settings.touch !== 'off') Input.touchUI = true;
    Input.lastDevice = 'touch';
  } else Input.lastDevice = Input.lastDevice === 'pad' ? 'pad' : 'keys';
  const btn = touchButtonAt(p.x, p.y);
  Input.pointers.set(e.pointerId, { btn: btn ? btn.id : null, x: p.x, y: p.y });
  if (btn) { refreshTouchHeld(); Input.touchLatch[btn.id] = true; }
  else Input.clicks.push({ x: p.x, y: p.y });
  try { screenCanvas.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
}, { passive: false });
screenCanvas.addEventListener('pointermove', e => {
  const p = toBuf(e.clientX, e.clientY);
  Input.mouse = p;
  const ptr = Input.pointers.get(e.pointerId);
  if (ptr && ptr.btn) {
    const btn = touchButtonAt(p.x, p.y);
    // allow sliding between movement buttons
    if (btn && btn.id !== ptr.btn && ['left', 'right', 'up', 'down'].includes(btn.id) && ['left', 'right', 'up', 'down'].includes(ptr.btn)) {
      ptr.btn = btn.id; refreshTouchHeld();
    }
  }
});
function endPointer(e) {
  if (Input.pointers.has(e.pointerId)) { Input.pointers.delete(e.pointerId); refreshTouchHeld(); }
}
screenCanvas.addEventListener('pointerup', endPointer);
screenCanvas.addEventListener('pointercancel', endPointer);
screenCanvas.addEventListener('contextmenu', e => e.preventDefault());
