'use strict';
// ---------------------------------------------------------------------------
// Core constants & helpers
// ---------------------------------------------------------------------------
const W = 480, H = 270, T = 16;
const TAU = Math.PI * 2;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;
const approach = (v, target, step) => (v < target ? Math.min(v + step, target) : Math.max(v - step, target));
const sign = v => (v > 0 ? 1 : v < 0 ? -1 : 0);
const rnd = (a, b) => (b === undefined ? Math.random() * a : a + Math.random() * (b - a));
const rndi = (a, b) => Math.floor(a + Math.random() * (b - a + 1));
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const overlap = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function hash2(x, y, s) {
  let h = (x * 374761393 + y * 668265263 + (s || 0) * 982451653) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}
const Ease = {
  outCubic: t => 1 - Math.pow(1 - t, 3),
  inCubic: t => t * t * t,
  inOutSine: t => -(Math.cos(Math.PI * t) - 1) / 2,
  outBack: t => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
  outBounce: t => {
    const n1 = 7.5625, d1 = 2.75;
    if (t < 1 / d1) return n1 * t * t;
    if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
    if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
  },
  outElastic: t => (t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (TAU / 3)) + 1),
};

// Colour helpers -------------------------------------------------------------
function hexRgb(h) {
  h = h.replace('#', '');
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function rgbHex(r, g, b) {
  const c = v => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0');
  return '#' + c(r) + c(g) + c(b);
}
const _shadeCache = new Map();
function shade(hex, amt) {
  const k = hex + '|' + amt;
  let v = _shadeCache.get(k);
  if (v) return v;
  const [r, g, b] = hexRgb(hex);
  const f = amt < 0 ? c => c * (1 + amt) : c => c + (255 - c) * amt;
  v = rgbHex(f(r), f(g), f(b));
  _shadeCache.set(k, v);
  return v;
}
function mixCol(a, b, t) {
  const A = hexRgb(a), B = hexRgb(b);
  return rgbHex(lerp(A[0], B[0], t), lerp(A[1], B[1], t), lerp(A[2], B[2], t));
}
function rgba(hex, a) { const [r, g, b] = hexRgb(hex); return `rgba(${r},${g},${b},${a})`; }

// Canvas helpers ---------------------------------------------------------------
function makeCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = Math.max(1, w | 0); c.height = Math.max(1, h | 0);
  const g = c.getContext('2d');
  g.imageSmoothingEnabled = false;
  return [c, g];
}

const screenCanvas = document.getElementById('screen');
const sctx = screenCanvas.getContext('2d', { alpha: false });
const [buf, ctx] = makeCanvas(W, H);
const [upCanvas, upCtx] = makeCanvas(W, H);
const view = { x: 0, y: 0, w: W, h: H, scale: 1, k: 1, dpr: 1, cssW: W, cssH: H };

function resizeScreen() {
  const dpr = Math.min(window.devicePixelRatio || 1, 3);
  const r = screenCanvas.getBoundingClientRect();
  const cw = Math.max(16, Math.round(r.width * dpr)), ch = Math.max(16, Math.round(r.height * dpr));
  if (screenCanvas.width !== cw || screenCanvas.height !== ch) { screenCanvas.width = cw; screenCanvas.height = ch; }
  const s = Math.min(cw / W, ch / H);
  const vw = Math.round(W * s), vh = Math.round(H * s);
  view.x = Math.floor((cw - vw) / 2); view.y = Math.floor((ch - vh) / 2);
  view.w = vw; view.h = vh; view.scale = s; view.dpr = dpr; view.cssW = r.width; view.cssH = r.height;
  const k = clamp(Math.ceil(s - 0.001), 1, 8);
  if (view.k !== k || upCanvas.width !== W * k) {
    view.k = k; upCanvas.width = W * k; upCanvas.height = H * k; upCtx.imageSmoothingEnabled = false;
  }
}

function present() {
  // clear only the letterbox bars; the frame covers the rest
  const cw = screenCanvas.width, ch = screenCanvas.height;
  sctx.fillStyle = '#0d0811';
  if (view.x > 0) { sctx.fillRect(0, 0, view.x, ch); sctx.fillRect(view.x + view.w, 0, cw - view.x - view.w, ch); }
  if (view.y > 0) { sctx.fillRect(0, 0, cw, view.y); sctx.fillRect(0, view.y + view.h, cw, ch - view.y - view.h); }
  const s = view.scale;
  if (Math.abs(s - Math.round(s)) < 0.02 || s < 1) {
    sctx.imageSmoothingEnabled = s < 1;
    sctx.drawImage(buf, view.x, view.y, view.w, view.h);
  } else {
    upCtx.imageSmoothingEnabled = false;
    upCtx.drawImage(buf, 0, 0, upCanvas.width, upCanvas.height);
    sctx.imageSmoothingEnabled = true;
    sctx.imageSmoothingQuality = 'low';
    sctx.drawImage(upCanvas, view.x, view.y, view.w, view.h);
  }
}

// screen (client) -> buffer coordinates
function toBuf(clientX, clientY) {
  const r = screenCanvas.getBoundingClientRect();
  const px = (clientX - r.left) * view.dpr, py = (clientY - r.top) * view.dpr;
  return { x: (px - view.x) / view.scale, y: (py - view.y) / view.scale };
}

// small drawing helpers on the main buffer
function fill(x, y, w, h, col, g) { (g || ctx).fillStyle = col; (g || ctx).fillRect(x, y, w, h); }
function frameRect(x, y, w, h, col, g) {
  g = g || ctx; g.fillStyle = col;
  g.fillRect(x, y, w, 1); g.fillRect(x, y + h - 1, w, 1); g.fillRect(x, y, 1, h); g.fillRect(x + w - 1, y, 1, h);
}
// chunky rounded panel
function panel(x, y, w, h, bg, border, g) {
  g = g || ctx;
  x = Math.round(x); y = Math.round(y); w = Math.round(w); h = Math.round(h);
  g.fillStyle = border;
  g.fillRect(x + 2, y, w - 4, h); g.fillRect(x, y + 2, w, h - 4); g.fillRect(x + 1, y + 1, w - 2, h - 2);
  g.fillStyle = bg;
  g.fillRect(x + 2, y + 1, w - 4, h - 2); g.fillRect(x + 1, y + 2, w - 2, h - 4);
}
function circleFill(cx, cy, r, col, g) {
  g = g || ctx; g.fillStyle = col;
  for (let y = -r; y <= r; y++) {
    const hw = Math.floor(Math.sqrt(r * r - y * y + r * 0.6));
    g.fillRect(Math.round(cx - hw), Math.round(cy + y), hw * 2 + 1, 1);
  }
}
