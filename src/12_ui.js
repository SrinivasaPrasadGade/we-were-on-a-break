// ---------------------------------------------------------------------------
// UI: menus, boot, opening credits, title, pause, results, credits, director
// ---------------------------------------------------------------------------
const mugCount = s => Object.keys(s.mugs || {}).filter(k => s.mugs[k]).length;
const doneCount = s => Object.keys(s.done || {}).filter(k => s.done[k]).length;
const UNLOCKS = {
  outfits: [
    { id: 1, name: 'Pajama Party', cond: s => !!s.done[3], hint: 'Finish Episode 4' },
    { id: 2, name: 'Wedding Band Tux', cond: s => !!s.done[5], hint: 'Finish Episode 6' },
    { id: 3, name: 'Team Bowling Shirts', cond: s => mugCount(s) >= 3, hint: 'Find 3 golden mugs' },
    { id: 4, name: 'Holiday Sweaters', cond: s => !!s.done[10], hint: 'Finish Episode 11' },
    { id: 5, name: 'Solid Gold', cond: s => mugCount(s) >= 13, hint: 'Find all 13 golden mugs' },
  ],
  decor: [
    { id: 'lights', name: 'String Lights', cond: s => !!s.done[0], hint: 'Finish Episode 1' },
    { id: 'terrarium', name: "Sarge's Terrarium", cond: s => !!s.done[1], hint: 'Finish Episode 2' },
    { id: 'certificate', name: 'Health Certificate', cond: s => !!s.done[2], hint: 'Finish Episode 3' },
    { id: 'candles', name: 'Blackout Candles', cond: s => !!s.done[3], hint: 'Finish Episode 4' },
    { id: 'flamingo', name: 'Rooftop Flamingo', cond: s => !!s.done[4], hint: 'Finish Episode 5' },
    { id: 'jukebox', name: 'Jukebox', cond: s => !!s.done[5], hint: 'Finish Episode 6' },
    { id: 'rulebook', name: "Holloway's Rulebook", cond: s => !!s.done[6], hint: 'Finish Episode 7' },
    { id: 'poster', name: 'Great Bennini Poster', cond: s => !!s.done[7], hint: 'Finish Episode 8' },
    { id: 'subwaymap', name: 'Subway Map', cond: s => !!s.done[8], hint: 'Finish Episode 9' },
    { id: 'tidybot', name: 'Tidy-Bot 9000', cond: s => !!s.done[9], hint: 'Finish Episode 10' },
    { id: 'snowman', name: 'Snowman & Cocoa', cond: s => !!s.done[10], hint: 'Finish Episode 11' },
    { id: 'postcard', name: 'Boarding Pass Frame', cond: s => !!s.done[11], hint: 'Finish Episode 12' },
    { id: 'neon', name: 'Grand Reopening Neon', cond: s => !!s.done[12], hint: 'Finish the Finale' },
    { id: 'goldcouch', name: 'The Golden Couch', cond: s => mugCount(s) >= 13, hint: 'Find all 13 golden mugs' },
  ],
};
function outfitUnlocked(i) { if (i === 0) return true; const u = UNLOCKS.outfits.find(o => o.id === i); return !!(u && u.cond(Save.data)); }
function decorOn(id) { const u = UNLOCKS.decor.find(o => o.id === id); return !!(u && u.cond(Save.data)); }
function epUnlocked(i) { if (i === 0) return true; if (i === 12) { for (let k = 0; k < 12; k++) if (!Save.data.done[k]) return false; return true; } return !!Save.data.done[i - 1]; }
function starsFor(cups, total) { if (!total) return 3; const p = cups / total; return p >= 0.85 ? 3 : p >= 0.5 ? 2 : 1; }
function unlockSnapshot() { return UNLOCKS.outfits.filter(o => o.cond(Save.data)).map(o => 'o' + o.id).concat(UNLOCKS.decor.filter(d => d.cond(Save.data)).map(d => 'd' + d.id)); }

// ---------------------------------------------------------------------------
// Generic list menu
// ---------------------------------------------------------------------------
class Menu {
  constructor(title, items, opts) { this.title = title; this.items = items; this.sel = 0; this.opts = opts || {}; this.t = 0; this.skipDisabled(1); }
  skipDisabled(dir) { let n = 0; while (this.items[this.sel] && this.items[this.sel].disabled && n++ < this.items.length) this.sel = (this.sel + dir + this.items.length) % this.items.length; }
  update() {
    this.t++;
    const m = Input.menu;
    const it = () => this.items[this.sel];
    if (m.up) { this.sel = (this.sel - 1 + this.items.length) % this.items.length; this.skipDisabled(-1); AudioSys.sfx('move'); }
    if (m.down) { this.sel = (this.sel + 1) % this.items.length; this.skipDisabled(1); AudioSys.sfx('move'); }
    const cur = it();
    if (cur && (cur.type === 'slider' || cur.type === 'choice')) {
      if (m.left) { cur.change(-1); AudioSys.sfx('move'); }
      if (m.right) { cur.change(1); AudioSys.sfx('move'); }
    }
    // pointer
    const L = this.layout;
    if (L) {
      for (let i = 0; i < this.items.length; i++) {
        const r = L[i];
        if (!r) continue;
        if (Input.hoverIn(r.x, r.y, r.w, r.h) && Input.lastDevice !== 'touch' && this.sel !== i && !this.items[i].disabled) this.sel = i;
        if (Input.clickIn(r.x, r.y, r.w, r.h)) {
          if (this.items[i].disabled) { AudioSys.sfx('deny'); continue; }
          this.sel = i;
          const c = this.items[i];
          if (c.type === 'slider' || c.type === 'choice') {
            const p = Input.mouse || { x: r.x + r.w };
            c.change(p && p.x < r.x + r.w / 2 ? -1 : 1); AudioSys.sfx('move');
          } else { this.activate(); }
          return;
        }
      }
    }
    if (m.ok && this.t > 5) {
      if (cur && cur.type === 'slider') cur.change(1);
      else if (cur && cur.type === 'choice') cur.change(1);
      else this.activate();
    }
    if (m.back && this.t > 5 && this.opts.onBack) { AudioSys.sfx('back'); this.opts.onBack(); }
  }
  activate() {
    const c = this.items[this.sel];
    if (!c || c.disabled) { AudioSys.sfx('deny'); return; }
    AudioSys.sfx('confirm');
    if (c.action) c.action();
  }
  draw(cx, y, w) {
    w = w || 220;
    const rowH = 16;
    const head = this.title ? 24 : 10;
    const h = head + 2 + this.items.length * rowH + 6;
    const x = Math.round(cx - w / 2);
    panel(x, y, w, h, '#22182c', '#ffd23f');
    panel(x + 3, y + 3, w - 6, h - 6, '#2a1e36', '#4a3a5a');
    if (this.title) drawText(this.title, cx, y + 9, '#ffd23f', { align: 'center' });
    this.layout = [];
    this.items.forEach((it, i) => {
      const iy = y + head + i * rowH;
      const sel = i === this.sel;
      this.layout[i] = { x: x + 6, y: iy - 3, w: w - 12, h: rowH - 1 };
      if (sel) { ctx.fillStyle = '#3e2c4e'; ctx.fillRect(x + 6, iy - 3, w - 12, rowH - 1); drawText('>', x + 10, iy, '#ffd23f'); }
      const col = it.disabled ? '#6a5a7a' : sel ? '#ffffff' : '#d8c8e8';
      drawText(it.label, x + 20, iy, col);
      if (it.type === 'slider') {
        const v = it.get();
        const bx = x + w - 92;
        for (let k = 0; k < 10; k++) { ctx.fillStyle = k < v ? (sel ? '#ffd23f' : '#c8a83a') : '#4a3a5a'; ctx.fillRect(bx + k * 7, iy + 1, 5, 6); }
        drawText(String(v), x + w - 14, iy, col, { align: 'right' });
      } else if (it.type === 'choice' || it.type === 'toggle') {
        drawText(it.value(), x + w - 14, iy, sel ? '#7cf29a' : '#9ad8b0', { align: 'right' });
      }
    });
    return h;
  }
}

function settingsItems(onBack) {
  const S = Save.data.settings;
  const apply = () => { Save.write(); AudioSys.applyVolumes(); };
  return [
    { label: 'Music volume', type: 'slider', get: () => S.music, change: d => { S.music = clamp(S.music + d, 0, 10); apply(); } },
    { label: 'Sound volume', type: 'slider', get: () => S.sfx, change: d => { S.sfx = clamp(S.sfx + d, 0, 10); apply(); AudioSys.sfx('cup'); } },
    { label: 'Laugh track', type: 'choice', value: () => (S.laugh ? 'ON' : 'OFF'), change: () => { S.laugh = !S.laugh; apply(); if (S.laugh) AudioSys.audience('chuckle', 0.6); } },
    { label: 'Screen shake', type: 'choice', value: () => (S.shake ? 'ON' : 'OFF'), change: () => { S.shake = !S.shake; apply(); } },
    { label: 'Touch buttons', type: 'choice', value: () => S.touch.toUpperCase(), change: d => { const o = ['auto', 'on', 'off']; S.touch = o[(o.indexOf(S.touch) + (d || 1) + 3) % 3]; Input.touchUI = S.touch === 'on' || (S.touch === 'auto' && Input.lastDevice === 'touch'); apply(); } },
    { label: 'Players', type: 'choice', value: () => (S.players === 2 ? '2 (CO-OP)' : '1'), change: () => { S.players = S.players === 2 ? 1 : 2; Input.twoPlayer = S.players === 2; apply(); } },
    { label: 'Fullscreen', type: 'button', action: () => { try { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen().catch(() => {}); } catch (e) { /* not available */ } } },
    { label: 'Back', type: 'button', action: onBack },
  ];
}

const CONTROLS_TEXT = [
  ['SOLO (KEYBOARD)', '#ffd23f'],
  ['Move: A/D or ←/→     Jump: W, ↑ or SPACE', '#f6ead8'],
  ['Ability / interact: E (hold to fix or grab)', '#f6ead8'],
  ['Climb: ↑/↓ on ladders (Mila: drainpipes too)', '#f6ead8'],
  ['Switch friend: 1-6 or Q   Gang follow/wait: F', '#f6ead8'],
  ['Drop through shelves: ↓ + JUMP   Pause: ESC', '#f6ead8'],
  ['CO-OP (SET PLAYERS TO 2)', '#ffd23f'],
  ['P1: WASD + E (switch Q)   P2: ARROWS + / (switch .)', '#f6ead8'],
  ['GAMEPAD: stick/d-pad, A jump, B/X ability, LB/RB switch', '#f6ead8'],
  ['TOUCH: on-screen buttons, tap portraits to switch', '#f6ead8'],
];
function drawControls(y) {
  panel(30, y, W - 60, 152, '#22182c', '#ffd23f');
  CONTROLS_TEXT.forEach((l, i) => drawText(l[0], W / 2, y + 10 + i * 13, l[1], { align: 'center' }));
}

// ---------------------------------------------------------------------------
// Pause overlay
// ---------------------------------------------------------------------------
class PauseMenu {
  constructor(level) {
    this.level = level; this.closed = false; this.mode = 'main'; this.t = 0;
    this.hub = level && level.hub;
    this.build();
  }
  build() {
    const L = this.level;
    const items = [{ label: 'Resume', action: () => this.close() }];
    if (L && !this.hub) items.push({ label: 'Retake scene', action: () => { this.close(); L.retake(); } });
    if (L) items.push({ label: 'Gang', type: 'choice', value: () => (L.followMode ? 'FOLLOW' : 'WAIT'), change: () => { L.followMode = !L.followMode; Save.data.settings.follow = L.followMode; Save.write(); } });
    items.push({ label: 'Settings', action: () => { this.mode = 'settings'; this.sub = new Menu('SETTINGS', settingsItems(() => { this.mode = 'main'; }), { onBack: () => { this.mode = 'main'; } }); } });
    items.push({ label: 'Controls', action: () => { this.mode = 'controls'; } });
    if (L && !this.hub) items.push({ label: 'Quit to the cafe', action: () => { this.close(); Music.stop(0.3); goHub(); } });
    if (this.hub) items.push({ label: 'Title screen', action: () => { this.close(); Game.go(new TitleScene()); } });
    this.menu = new Menu('PAUSED', items, { onBack: () => this.close() });
  }
  close() { this.closed = true; AudioSys.sfx('back'); }
  update() {
    this.t++;
    if (this.mode === 'main') { this.menu.update(); if (Input.pads[0].pressed.pause && this.t > 5) this.close(); }
    else if (this.mode === 'settings') this.sub.update();
    else if (this.mode === 'controls') { if ((Input.menu.ok || Input.menu.back || Input.clicks.length) && this.t > 5) { Input.clicks.length = 0; this.mode = 'main'; AudioSys.sfx('back'); } }
  }
  draw() {
    ctx.fillStyle = 'rgba(10,6,16,0.72)'; ctx.fillRect(0, 0, W, H);
    if (this.mode === 'main') {
      if (this.level && !this.hub) {
        const ep = this.level.ep;
        drawText(ep.finale ? 'THE SEASON FINALE' : 'S' + ep.season + ' E' + ep.num + ': ' + ep.title.toUpperCase(), W / 2, 22, '#f6ead8', { align: 'center' });
        drawText('Cups ' + this.level.cups + '/' + this.level.cupsTotal + '   Golden mug: ' + (this.level.mugGot ? 'YES' : 'not yet') + '   Take ' + this.level.takes, W / 2, 36, '#c8b8d8', { align: 'center' });
      }
      this.menu.draw(W / 2, 54, 220);
    } else if (this.mode === 'settings') this.sub.draw(W / 2, 40, 260);
    else if (this.mode === 'controls') { drawControls(50); drawText('Press any button to go back', W / 2, 212, '#8a7a9a', { align: 'center' }); }
  }
}

// ---------------------------------------------------------------------------
// Boot: an old TV waiting to be switched on
// ---------------------------------------------------------------------------
class BootScene {
  constructor() { this.t = 0; this.on = 0; }
  update() {
    this.t++;
    if (!this.on && (Input.anyPressed || Input.clicks.length)) {
      AudioSys.unlock();
      this.on = 1; Input.clicks.length = 0;
      setTimeout(() => AudioSys.sfx('tvon'), 30);
    }
    if (this.on) { this.on++; if (this.on > 40) Game.go(new OpeningScene(), { speed: 0.2 }); }
  }
  draw() {
    ctx.fillStyle = '#140d1a'; ctx.fillRect(0, 0, W, H);
    // wallpaper
    for (let x = 0; x < W; x += 12) { ctx.fillStyle = '#1a1222'; ctx.fillRect(x, 0, 3, H); }
    // tv
    const tx = 150, ty = 50;
    panel(tx, ty, 180, 140, '#6a4a30', OUTLINE);
    ctx.fillStyle = '#4a3220'; ctx.fillRect(tx + 6, ty + 6, 168, 128);
    panel(tx + 14, ty + 14, 120, 100, '#0a0a0e', '#2a2a2e');
    ctx.fillStyle = '#3a2a1a'; ctx.fillRect(tx + 146, ty + 20, 20, 90);
    circleFill(tx + 156, ty + 34, 6, '#c8a060'); circleFill(tx + 156, ty + 58, 6, '#c8a060');
    for (let i = 0; i < 5; i++) { ctx.fillStyle = '#2a1a10'; ctx.fillRect(tx + 148, ty + 76 + i * 6, 16, 2); }
    ctx.fillStyle = '#5a3a24'; ctx.fillRect(tx + 30, ty + 140, 8, 20); ctx.fillRect(tx + 142, ty + 140, 8, 20);
    // antenna
    ctx.fillStyle = '#9a9aa8';
    for (let i = 0; i < 40; i++) { ctx.fillRect(tx + 90 - i * 0.8, ty - i, 1, 1); ctx.fillRect(tx + 90 + i * 0.8, ty - i, 1, 1); }
    // screen
    const sx = tx + 18, sy = ty + 18, sw = 112, sh = 92;
    if (this.on) {
      for (let i = 0; i < 300; i++) { ctx.fillStyle = Math.random() < 0.5 ? '#e8e8f0' : '#6a6a7a'; ctx.fillRect(sx + Math.random() * sw, sy + Math.random() * sh, 2, 1); }
      ctx.fillStyle = 'rgba(255,255,255,' + Math.max(0, 1 - this.on / 20) + ')'; ctx.fillRect(sx, sy, sw, sh);
    } else {
      ctx.fillStyle = '#16161c'; ctx.fillRect(sx, sy, sw, sh);
      ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.fillRect(sx + 8, sy + 6, 30, 4);
      if ((this.t >> 5) % 2) drawText('♪', sx + sw / 2, sy + sh / 2 - 5, '#3a3a4a', { align: 'center', scale: 2 });
    }
    const blink = (this.t >> 5) % 2 === 0;
    drawText("THE GANG'S ALL HERE", W / 2, 208, '#ffd23f', { align: 'center', scale: 2, outline: OUTLINE });
    if (blink) drawText(Input.lastDevice === 'touch' ? 'TAP TO TUNE IN' : 'PRESS ANY KEY OR CLICK TO TUNE IN', W / 2, 236, '#f6ead8', { align: 'center' });
    drawText('Turn your sound on for the theme song & studio audience.', W / 2, 252, '#8a7a9a', { align: 'center' });
  }
}

// ---------------------------------------------------------------------------
// Opening credits (synced to the theme song)
// ---------------------------------------------------------------------------
const OPENING_ROLES = [
  { who: 'dex', tag: 'The Muscle (some assembly required)' },
  { who: 'mila', tag: 'The Competitor (currently winning)' },
  { who: 'theo', tag: 'The Inventor (it almost works)' },
  { who: 'priya', tag: 'The Closer (she knows a guy)' },
  { who: 'benny', tag: 'The Magician (allegedly)' },
  { who: 'juno', tag: 'The Musician (wedding band legend)' },
];
class OpeningScene {
  constructor(opts) { this.opts = opts || {}; this.t = 0; this.startAt = null; this.wantsTouch = false; this.ended = false; }
  enter() {
    Music.stop(0); Music.play('theme', { restart: true });
    this.startAt = Music.cur ? Music.cur.start : null;
    Particles.list.length = 0;
  }
  beat() {
    const spb = 60 / 136;
    if (AudioSys.ok && this.startAt !== null && !Game.manual) return (AudioSys.now() - this.startAt) / spb;
    return this.t / 60 / spb;
  }
  update() {
    this.t++;
    Particles.update();
    if ((Input.menu.ok || Input.menu.back || Input.clicks.length) && this.t > 20) { Input.clicks.length = 0; this.finish(); return; }
    if (this.beat() > 23 * 4 + 6) this.finish();
  }
  finish() {
    if (this.ended) return; this.ended = true;
    Save.data.seenOpening = true; Save.write();
    if (Music.name === 'theme') Music.stop(0.6);
    if (this.opts.done) this.opts.done(); else Game.go(new TitleScene({ fromOpening: true }));
  }
  draw() {
    const b = this.beat(), bar = Math.floor(b / 4), inBar = b - bar * 4;
    if (bar < 2) return this.drawIntro(b);
    if (bar < 8) return this.drawFriend(OPENING_ROLES[bar - 2], inBar, bar);
    if (bar < 10) return this.drawSupporting(b - 32);
    if (bar < 14) return this.drawWalk(b - 40);
    if (bar < 18) return this.drawCouch(b - 56);
    return this.drawLogo(b - 72);
  }
  drawIntro(b) {
    drawEstablishing('cafe_night', this.t);
    const a = clamp((b - 4) / 2, 0, 1);
    if (a > 0) {
      ctx.globalAlpha = a;
      ctx.fillStyle = 'rgba(10,6,16,0.6)'; ctx.fillRect(0, 196, W, 34);
      drawText('LIVE FROM THE BIG COMFY COUCH...', W / 2, 206, '#f6ead8', { align: 'center' });
      ctx.globalAlpha = 1;
    }
  }
  drawFriend(role, k, bar) {
    const who = role.who, info = FRIEND_INFO[who];
    const frozen = k >= 2.5;
    const kk = frozen ? 2.5 : k;
    drawMemphis(shade(info.color, -0.55), [info.color, '#ffd23f', '#f6ead8', shade(info.color, 0.4)], frozen ? 0 : this.t, bar * 13, 34, [250, 46, 230, 120]);
    // diagonal stripe
    ctx.fillStyle = shade(info.color, -0.3);
    for (let i = 0; i < 70; i++) ctx.fillRect(0, 150 + i - Math.round(i * 0.3), W, 1);
    const S = 4, x = 170, y = 236;
    const tt = Math.floor(kk * 26);
    const pose = { anim: 'idle', t: tt, expr: 'happy' };
    let prop = null;
    switch (who) {
      case 'dex': pose.anim = 'hold'; pose.expr = frozen ? 'pain' : 'strain'; prop = 'couch'; break;
      case 'mila': pose.anim = 'jump'; pose.expr = 'grin'; break;
      case 'theo': pose.anim = 'fix'; pose.expr = frozen ? 'surprised' : 'focus'; break;
      case 'priya': pose.anim = 'phone'; pose.expr = frozen ? 'wink' : 'talk'; pose.talk = !frozen; break;
      case 'benny': pose.anim = frozen ? 'cheer' : 'magic'; pose.expr = 'grin'; break;
      case 'juno': pose.anim = 'play'; pose.expr = 'grin'; break;
      default: break;
    }
    let lift = 0;
    if (who === 'mila') lift = Math.sin(Math.min(1, kk / 2.5) * Math.PI * 0.5) * 60;
    if (who === 'dex') { const cy = y - 31 * S - 8; drawCrateArt(ctx, 'couch', x - 72, cy - 16, 144, 32, 0); }
    if (who === 'benny') { const hy = frozen ? y - 120 : y - 10 - Math.min(1, kk) * 40; drawCrateArt(ctx, 'tophat', x - 40, hy, 80, 60, 0); }
    blitPerson(ctx, friendSpecId(who, 0), friendSpecFn(who, 0), pose, x, y - lift, { sx: S, sy: S });
    if (who === 'theo') { // flying toast
      const tx2 = x + 60 + kk * 40, ty2 = y - 80 - kk * 30;
      ctx.save(); ctx.translate(tx2, ty2); ctx.scale(3, 3); drawSetProp(ctx, 'toast', 0, 0, 0); ctx.restore();
      if (!frozen && this.t % 4 === 0) Particles.sparks(x + 50, y - 60, 3);
    }
    if (who === 'juno' && !frozen && this.t % 6 === 0) Particles.notes(x + 40, y - 80, 1);
    if (who === 'mila') { panel(300, 176, 120, 36, '#1b1020', '#ffd23f'); drawText('MILA     1', 360, 184, '#2ec4b6', { align: 'center' }); drawText('GRAVITY  0', 360, 196, '#f6ead8', { align: 'center' }); }
    if (who === 'priya') { panel(300, 120, 90, 30, '#f4efe6', OUTLINE); drawText('SOLD!', 345, 128, '#c83a3a', { align: 'center', scale: 2 }); }
    if (!frozen) Particles.draw(ctx, 0, 0);
    if (frozen) {
      const f = k - 2.5;
      if (f < 0.25) { ctx.fillStyle = 'rgba(255,255,255,' + (1 - f * 4) + ')'; ctx.fillRect(0, 0, W, H); }
      const slide = Ease.outBack(clamp(f / 0.5, 0, 1));
      const nx = W + 10 - slide * 210;
      panel(nx - 10, 60, 230, 74, info.color, OUTLINE);
      drawText(info.name, nx + 4, 70, '#ffffff', { scale: 5, outline: OUTLINE });
      drawText(role.tag, nx + 4, 116, '#1b1020', {});
      ctx.fillStyle = 'rgba(255,200,120,0.08)'; ctx.fillRect(0, 0, W, H);
    }
  }
  drawSupporting(b) {
    // three quick cards: Gus, Holloway, Sarge (2.67 beats each)
    const i = Math.min(2, Math.floor(b / 2.67));
    const k = b - i * 2.67;
    const data = [
      { id: 'gus', name: 'and GUS', tag: 'who owns the couch', bg: '#2a4a3a', col: '#8ac89a' },
      { id: 'holloway', name: 'and MR. HOLLOWAY', tag: 'who owns the building', bg: '#4a3a1a', col: '#d8b84a' },
      { id: 'sarge', name: 'and SARGE', tag: 'as Himself', bg: '#2a4a1a', col: '#6ac84a' },
    ][i];
    drawMemphis(data.bg, [data.col, '#f6ead8', '#ffd23f'], this.t, 50 + i, 22);
    if (data.id === 'sarge') { ctx.save(); ctx.translate(170, 220); ctx.scale(5, 5); drawIguana(ctx, 0, 0, false, this.t, { tongue: (this.t % 30) < 8 }); ctx.restore(); }
    else blitPerson(ctx, 'npc:' + data.id, npcSpecFn(data.id), { anim: data.id === 'gus' ? 'facepalm' : 'point', t: this.t, expr: data.id === 'gus' ? 'sad' : 'angry' }, 160, 236, { sx: 4, sy: 4 });
    const slide = Ease.outCubic(clamp(k / 0.6, 0, 1));
    drawText(data.name, W - 20 - (1 - slide) * -200, 90, '#ffffff', { align: 'right', scale: 3, outline: OUTLINE });
    drawText(data.tag, W - 20, 124, data.col, { align: 'right', outline: OUTLINE });
  }
  drawWalk(b) {
    // the classic group walk down the street
    drawEstablishing('building_day', 400 + b * 30);
    ctx.fillStyle = '#9c928a'; ctx.fillRect(0, 230, W, 40); ctx.fillStyle = '#c2b8ae'; ctx.fillRect(0, 228, W, 6);
    const order = ['benny', 'priya', 'theo', 'dex', 'mila', 'juno'];
    const prog = b / 16;
    order.forEach((who, i) => {
      const x = -60 + prog * 620 - i * 40;
      const pose = { anim: 'walk', t: Math.floor(b * 26 / 2) * 2 + i * 3, expr: 'happy', fast: false };
      blitPerson(ctx, friendSpecId(who, 0), friendSpecFn(who, 0), pose, x, 232 - Math.abs(Math.sin(b * Math.PI)) * 2, { sx: 2, sy: 2 });
    });
    drawText('SIX FRIENDS. ONE COUCH.', W / 2, 30, '#ffffff', { align: 'center', scale: 2, outline: OUTLINE });
  }
  drawCouch(b) {
    const set = getSet('cafe');
    ctx.save();
    const z = 1.6;
    ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-190, -170);
    ctx.drawImage(set.room.backCanvas, 0, 0);
    drawFar(ctx, set.room.theme, 0, 0, this.t, 270);
    ctx.drawImage(set.room.backCanvas, 0, 0);
    for (const p of set.def.props) drawSetProp(ctx, p[0], p[1], p[2], this.t, set);
    ctx.drawImage(set.room.frontCanvas, 0, 0);
    const jump = b >= 8;
    const seats = [['dex', 140], ['priya', 168], ['juno', 196], ['theo', 224]];
    for (const [who, sx] of seats) blitPerson(ctx, friendSpecId(who, 0), friendSpecFn(who, 0), { anim: jump ? 'cheer' : 'sit', t: this.t, expr: 'grin' }, sx, jump ? 222 - Math.abs(Math.sin(b * Math.PI / 2)) * 8 : 214, {});
    blitPerson(ctx, friendSpecId('mila', 0), friendSpecFn('mila', 0), { anim: jump ? 'cheer' : 'idle', t: this.t, expr: 'grin', quirk: 'mila' }, 110, 222 - (jump ? Math.abs(Math.sin(b * Math.PI / 2)) * 8 : 0), {});
    blitPerson(ctx, friendSpecId('benny', 0), friendSpecFn('benny', 0), { anim: jump ? 'cheer' : 'idle', t: this.t, expr: 'grin' }, 256, 222 - (jump ? Math.abs(Math.sin(b * Math.PI / 2 + 1)) * 8 : 0), { flip: true });
    blitPerson(ctx, 'npc:gus', npcSpecFn('gus'), { anim: 'idle', t: this.t, expr: jump ? 'smug' : 'neutral' }, 360, 160, { flip: true });
    ctx.restore();
    if (b >= 14) { if (b < 14.2) { ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.fillRect(0, 0, W, H); } }
    if (b < 1) { ctx.fillStyle = 'rgba(10,6,14,' + (1 - b) + ')'; ctx.fillRect(0, 0, W, H); }
  }
  drawLogo(b) {
    drawMemphis('#24163a', ['#ff4f9a', '#ffd23f', '#4cc9f0', '#7cf29a', '#ff8a5a'], this.t, 99, 40);
    drawTitleLogo(W / 2, 70, b, this.t);
    if (b > 16) { drawText('A SITCOM YOU CAN PLAY', W / 2, 200, '#f6ead8', { align: 'center', outline: OUTLINE }); }
    if (b > 18 && this.t % 8 === 0) Particles.sparkle(rnd(80, 400), rnd(40, 160), 3);
    Particles.draw(ctx, 0, 0);
  }
}

// The show logo; b = beats since start of the reveal (>= 16 = fully shown)
function drawTitleLogo(cx, y, b, t) {
  const words = [['THE', '#f6ead8', 2], ["GANG'S", '#ff4f9a', 5], ['ALL', '#4cc9f0', 3], ['HERE', '#ffd23f', 5]];
  const starts = [0, 1, 2.5, 3.5];
  let yy = y;
  // line 1: THE GANG'S, line 2: ALL HERE
  const line1 = [words[0], words[1]], line2 = [words[2], words[3]];
  const drawLine = (ws, idx0, ly) => {
    const total = ws.reduce((a, w, i) => a + textWidth(w[0], w[2]) + (i ? 12 : 0), 0);
    let x = cx - total / 2;
    ws.forEach((w, i) => {
      const k = clamp((b - starts[idx0 + i]) / 0.5, 0, 1);
      if (k > 0) {
        const s = w[2] * (1 + (1 - Ease.outBack(k)) * 0.6);
        const ww = textWidth(w[0], w[2]);
        const off = w[2] === 2 ? 22 : w[2] === 3 ? 14 : 0;
        ctx.globalAlpha = k;
        drawText(w[0], x + ww / 2 + 3, ly + off + 4, '#1b1020', { scale: Math.round(s), align: 'center' });
        drawText(w[0], x + ww / 2, ly + off + Math.sin(t / 20 + i) * (k >= 1 ? 1.5 : 0), w[1], { scale: Math.round(s), align: 'center', outline: OUTLINE });
        ctx.globalAlpha = 1;
      }
      x += textWidth(w[0], w[2]) + 12;
    });
  };
  drawLine(line1, 0, yy);
  drawLine(line2, 2, yy + 56);
  // little coffee mug mascot
  if (b > 4.5) { ctx.save(); ctx.translate(cx + 150, yy + 74); ctx.scale(3, 3); drawMugIcon(ctx, 0, 0, t); ctx.restore(); }
}

// ---------------------------------------------------------------------------
// Title screen
// ---------------------------------------------------------------------------
class TitleScene {
  constructor(opts) { this.opts = opts || {}; this.t = 0; this.mode = 'main'; this.wantsTouch = false; this.build(); }
  enter() { if (Music.name !== 'title') Music.play('title', { fadeIn: 1.2 }); }
  build() {
    const started = doneCount(Save.data) > 0;
    this.menu = new Menu("", [
      { label: started ? 'Continue the show' : 'Start the show', action: () => { if (!started) playEpisode(0); else goHub(); } },
      { label: 'Players', type: 'choice', value: () => (Save.data.settings.players === 2 ? '2 (CO-OP)' : '1'), change: () => { const S = Save.data.settings; S.players = S.players === 2 ? 1 : 2; Input.twoPlayer = S.players === 2; Save.write(); } },
      { label: 'Settings', action: () => { this.mode = 'settings'; this.sub = new Menu('SETTINGS', settingsItems(() => { this.mode = 'main'; }), { onBack: () => { this.mode = 'main'; } }); } },
      { label: 'Controls', action: () => { this.mode = 'controls'; } },
      { label: 'Watch the opening', action: () => Game.go(new OpeningScene()) },
      { label: 'Credits', action: () => Game.go(new CreditsScene('end', -1, { done: () => Game.go(new TitleScene()) })) },
    ]);
  }
  update() {
    this.t++;
    if (this.mode === 'main') this.menu.update();
    else if (this.mode === 'settings') this.sub.update();
    else if ((Input.menu.ok || Input.menu.back || Input.clicks.length) && this.t > 5) { Input.clicks.length = 0; this.mode = 'main'; }
    Particles.update();
  }
  draw() {
    // café at night behind
    const set = getSet('cafe');
    drawFar(ctx, set.room.theme, 0, 0, this.t, 270);
    ctx.drawImage(set.room.backCanvas, 0, 0);
    for (const p of set.def.props) drawSetProp(ctx, p[0], p[1], p[2], this.t, set);
    ctx.drawImage(set.room.frontCanvas, 0, 0);
    const seats = [['dex', 140], ['priya', 166], ['juno', 192], ['theo', 218]];
    for (const [who, sx] of seats) blitPerson(ctx, friendSpecId(who, (Save.data.outfits || {})[who] || 0), friendSpecFn(who, (Save.data.outfits || {})[who] || 0), { anim: 'sit', t: this.t + sx, expr: 'happy', blink: ((this.t + sx * 7) % 200) < 6 }, sx, 214, {});
    blitPerson(ctx, friendSpecId('mila', (Save.data.outfits || {}).mila || 0), friendSpecFn('mila', (Save.data.outfits || {}).mila || 0), { anim: 'idle', t: this.t, quirk: 'mila' }, 100, 222, {});
    blitPerson(ctx, friendSpecId('benny', (Save.data.outfits || {}).benny || 0), friendSpecFn('benny', (Save.data.outfits || {}).benny || 0), { anim: 'idle', t: this.t, quirk: 'benny' }, 246, 222, { flip: true });
    blitPerson(ctx, 'npc:gus', npcSpecFn('gus'), { anim: 'idle', t: this.t, expr: 'neutral', blink: (this.t % 190) < 6 }, 58, 222, {});
    ctx.fillStyle = 'rgba(14,8,22,0.55)'; ctx.fillRect(0, 0, W, H);
    drawTitleLogo(W / 2, 12, 99, this.t);
    if (this.mode === 'main') this.menu.draw(362, 124, 200);
    else if (this.mode === 'settings') this.sub.draw(W / 2, 40, 260);
    else { drawControls(50); }
    const d = doneCount(Save.data), m = mugCount(Save.data);
    drawText('Episodes ' + d + '/13   Golden mugs ' + m + '/13', W / 2, H - 12, '#8a7a9a', { align: 'center' });
    if (!Save.available) drawText('(Progress will not be saved in this browser)', W / 2, H - 22, '#8a6a6a', { align: 'center' });
  }
}

// ---------------------------------------------------------------------------
// Results ("That's a wrap!")
// ---------------------------------------------------------------------------
class ResultsScene {
  constructor(epIndex, res, opts) {
    this.ep = EPISODES[epIndex]; this.epIndex = epIndex; this.res = res; this.opts = opts || {}; this.t = 0;
    const before = unlockSnapshot();
    const S = Save.data;
    this.stars = starsFor(res.cups, res.total);
    this.firstTime = !S.done[epIndex];
    S.done[epIndex] = true;
    S.stars[epIndex] = Math.max(S.stars[epIndex] || 0, this.stars);
    S.bestCups[epIndex] = Math.max(S.bestCups[epIndex] || 0, res.cups);
    if (res.mug) S.mugs[epIndex] = true;
    S.totalTakes = (S.totalTakes || 0) + res.takes;
    Save.write();
    const after = unlockSnapshot();
    this.newUnlocks = after.filter(u => !before.includes(u)).map(u => u[0] === 'o' ? 'Outfits: ' + UNLOCKS.outfits.find(o => 'o' + o.id === u).name : 'Cafe: ' + UNLOCKS.decor.find(o => 'd' + o.id === u).name);
    this.wantsTouch = false;
  }
  enter() { AudioSys.audience('applause', 0.8); Music.oneShot('fanfare', 0.7); }
  update() {
    this.t++;
    Particles.update();
    if (this.t === 40 || this.t === 70 || this.t === 100) {
      const k = (this.t - 40) / 30;
      if (k < this.stars) { AudioSys.sfx('mug'); Particles.sparkle(W / 2 - 50 + k * 50, 132, 14); }
    }
    if (this.t > 60 && (Input.menu.ok || Input.clicks.length)) { Input.clicks.length = 0; if (!this.doneF) { this.doneF = true; this.opts.done && this.opts.done(); } }
  }
  draw() {
    drawMemphis('#1e1430', ['#ff4f9a', '#ffd23f', '#4cc9f0', '#7cf29a'], this.t, 300 + this.epIndex, 26);
    panel(70, 18, W - 140, H - 36, '#22182c', '#ffd23f');
    drawText("THAT'S A WRAP!", W / 2, 28, '#ffd23f', { align: 'center', scale: 3, outline: OUTLINE });
    const ep = this.ep;
    drawText((ep.finale ? 'SEASON FINALE: ' : 'S' + ep.season + ' E' + ep.num + ': ') + ep.title.toUpperCase(), W / 2, 62, '#f6ead8', { align: 'center' });
    const r = this.res;
    const cupsShown = Math.min(r.cups, Math.floor(this.t / 2));
    drawCupIcon(ctx, W / 2 - 70, 80);
    drawText('Coffee cups  ' + cupsShown + ' / ' + r.total, W / 2 - 56, 83, '#f6ead8');
    drawMugIcon(ctx, W / 2 - 68, 96, this.t, !r.mug);
    drawText(r.mug ? 'Golden mug  FOUND!' : 'Golden mug  still hidden...', W / 2 - 52, 100, r.mug ? '#f5c542' : '#8a7a9a');
    // stars
    for (let k = 0; k < 3; k++) {
      const shown = this.t > 40 + k * 30 && k < this.stars;
      const sc = shown ? 3 + Math.max(0, 1 - (this.t - 40 - k * 30) / 10) : 3;
      drawText('★', W / 2 - 50 + k * 50, 118, shown ? '#ffd23f' : '#3a2e4a', { align: 'center', scale: Math.round(sc), outline: OUTLINE });
    }
    const secs = Math.floor(r.time / 60);
    drawText('Takes: ' + r.takes + '     Time: ' + Math.floor(secs / 60) + ':' + String(secs % 60).padStart(2, '0'), W / 2, 158, '#c8b8d8', { align: 'center' });
    if (this.stars < 3) drawText('85% of the cups earns 3 stars', W / 2, 170, '#8a7a9a', { align: 'center' });
    if (this.newUnlocks.length && this.t > 110) {
      drawText('NEW UNLOCKS!', W / 2, 184, '#7cf29a', { align: 'center' });
      this.newUnlocks.slice(0, 3).forEach((u, i) => drawText(u, W / 2, 196 + i * 11, '#f6ead8', { align: 'center' }));
    }
    if (this.t > 60 && (this.t >> 5) % 2) drawText('Press E / tap to roll the tag scene', W / 2, H - 30, '#d8c8e8', { align: 'center' });
    Particles.draw(ctx, 0, 0);
  }
}

// ---------------------------------------------------------------------------
// Credits (mini after each episode; full roll after the finale)
// ---------------------------------------------------------------------------
class CreditsScene {
  constructor(kind, epIndex, opts) {
    this.kind = kind; this.epIndex = epIndex; this.opts = opts || {}; this.t = 0; this.wantsTouch = false;
    this.lines = kind === 'mini' ? miniCreditLines(epIndex) : endCreditLines();
    this.speed = kind === 'mini' ? 0.5 : 0.42;
  }
  enter() { Music.play(this.kind === 'mini' ? 'minicredits' : 'credits', { restart: true }); }
  update() {
    this.t++;
    Particles.update();
    const total = this.lines.length * 14 + H + 40;
    if (this.t > 30 && (Input.menu.ok || Input.menu.back || Input.clicks.length)) { Input.clicks.length = 0; this.end(); return; }
    if (this.t * this.speed > total) this.end();
    if (this.kind !== 'mini' && this.t % 40 === 0) Particles.confetti(W / 2, -10, 6);
  }
  end() { if (this.doneF) return; this.doneF = true; Music.stop(1); if (this.opts.done) this.opts.done(); }
  draw() {
    if (this.kind === 'mini') {
      drawMemphis('#1a1226', ['#3a2a4a', '#4a3a5a'], this.t, 5, 30);
      // gang silhouettes on the left
      const set = getSet('cafe');
      ctx.save(); ctx.beginPath(); ctx.rect(14, 40, 210, 190); ctx.clip();
      ctx.translate(-30, -10);
      drawFar(ctx, set.room.theme, 0, 0, this.t, 270); ctx.drawImage(set.room.backCanvas, 0, 0);
      for (const p of set.def.props) drawSetProp(ctx, p[0], p[1], p[2], this.t, set);
      ctx.drawImage(set.room.frontCanvas, 0, 0);
      [['dex', 140], ['priya', 166], ['juno', 192], ['theo', 218]].forEach(([w, x]) => blitPerson(ctx, friendSpecId(w, 0), friendSpecFn(w, 0), { anim: 'sit', t: this.t, expr: 'happy' }, x, 214, {}));
      ctx.restore();
      frameRect(14, 40, 210, 190, '#ffd23f');
    } else {
      drawMemphis('#1e1430', ['#ff4f9a', '#ffd23f', '#4cc9f0', '#7cf29a', '#ff8a5a'], this.t, 77, 34, [W / 2 - 150, 0, 300, H]);
    }
    const x0 = this.kind === 'mini' ? 350 : W / 2;
    let y = H + 10 - this.t * this.speed;
    for (const l of this.lines) {
      if (y > -20 && y < H + 10) {
        if (l.portrait) { ctx.drawImage(portrait(l.portrait, 0, 'happy'), Math.round(x0 - 10), Math.round(y - 4)); }
        else if (l.couch) {
          ctx.save(); ctx.translate(Math.round(x0 - 60), Math.round(y)); drawSetProp(ctx, 'couch', 0, 0, this.t, null); ctx.restore();
          ['dex', 'priya', 'juno', 'theo'].forEach((w, i) => blitPerson(ctx, friendSpecId(w, 0), friendSpecFn(w, 0), { anim: 'sit', t: this.t, expr: 'grin' }, x0 - 40 + i * 26, y + 28, {}));
          blitPerson(ctx, friendSpecId('mila', 0), friendSpecFn('mila', 0), { anim: 'cheer', t: this.t, expr: 'grin' }, x0 - 76, y + 36, {});
          blitPerson(ctx, friendSpecId('benny', 0), friendSpecFn('benny', 0), { anim: 'cheer', t: this.t + 5, expr: 'grin' }, x0 + 76, y + 36, { flip: true });
        }
        else drawText(l.text, x0, Math.round(y), l.col || '#f6ead8', { align: 'center', scale: l.scale || 1, outline: OUTLINE });
      }
      y += l.h || 14;
    }
    Particles.draw(ctx, 0, 0);
  }
}

// ---------------------------------------------------------------------------
// Episode director
// ---------------------------------------------------------------------------
function runSteps(steps) { let k = 0; const next = () => { const s = steps[k++]; if (s) s(next); }; next(); }
function playEpisode(i) {
  const E = EPISODES[i];
  Save.data.lastEp = i; Save.write();
  let result = null;
  const steps = [];
  if (E.previously) steps.push(next => Game.go(new CutsceneScene(E.previously, { recap: true, done: next, freezeHold: 60 })));
  steps.push(next => Game.go(new CutsceneScene(E.coldOpen, { done: next })));
  steps.push(next => Game.go(new TitleCardScene(i, { done: next }), { speed: 0.15 }));
  steps.push(next => { if (E.rooms[0].shot) Game.go(new EstablishingScene(E.rooms[0].shot, { done: next })); else next(); });
  steps.push(next => Game.go(new LevelScene(i, { done: res => { result = res; next(); } })));
  steps.push(next => Game.go(new ResultsScene(i, result, { done: next })));
  steps.push(next => Game.go(new CutsceneScene(E.tag, { done: next, freezeHold: 170 })));
  steps.push(next => Game.go(new CreditsScene('mini', i, { done: next })));
  if (E.finale) steps.push(next => Game.go(new CreditsScene('end', i, { done: next })));
  steps.push(() => goHub());
  runSteps(steps);
}
function goHub() {
  Game.go(new EstablishingScene('cafe_night', { done: () => Game.go(new HubScene(), { speed: 0.12 }), dur: 110 }));
}
function startScene() { return new BootScene(); }
