// ---------------------------------------------------------------------------
// Entities. Map chars anchor at the entity's BOTTOM-LEFT tile.
// ---------------------------------------------------------------------------
const NEED_ICON = { dex: 'dex', mila: 'mila', theo: 'theo', priya: 'priya', benny: 'benny', juno: 'juno' };

class Ent {
  constructor(room, tx, ty, p, wT, hT) {
    this.room = room; this.p = p || {};
    this.w = (this.p.w || wT || 1) * T; this.h = (this.p.h || hT || 1) * T;
    this.x = tx * T + (this.p.dx || 0);
    this.y = (ty + 1) * T - this.h + (this.p.dy || 0);
    this.id = this.p.id; this.link = this.p.link;
    this.solid = false; this.t = rndi(0, 200);
    this.tx = tx; this.ty = ty;
  }
  get cx() { return this.x + this.w / 2; }
  get cy() { return this.y + this.h / 2; }
  get level() { return this.room.level; }
  update() { this.t++; }
  draw() {}
  interactInfo() { return null; }
  use() {}
  useBox() { return { x: this.x - 6, y: this.y - 4, w: this.w + 12, h: this.h + 8 }; }
  setFlag(v) { if (this.id) this.level.setFlag(this.id, v); }
}

// ---- Crate (heavy pushable) -----------------------------------------------------
const CRATE_KINDS = {
  box: [1, 1], couch: [3, 1], vending: [1, 2], piano: [2, 2], fridge: [1, 2], amp: [1, 1], dresser: [2, 2], washer: [1, 1],
  snowball: [1, 1], cart: [2, 1], trunk: [2, 1], sandbag: [1, 1], bike: [2, 1], gym: [2, 1], grill: [2, 1], cooler: [1, 1],
  case: [2, 1], tophat: [2, 2], magnet: [1, 1], dumpster: [2, 2], suitcase: [1, 1], pianobig: [3, 2], speaker: [1, 2], boxes2: [1, 2],
};
class Crate extends Ent {
  constructor(room, tx, ty, p) {
    const k = CRATE_KINDS[p.kind || 'box'] || [1, 1];
    super(room, tx, ty, p, k[0], k[1]);
    this.kind = p.kind || 'box';
    this.solid = true; this.crate = true; this.vy = 0;
    this.home = { x: this.x, y: this.y };
    this.groundEnt = null; this.pushT = 0; this.wobble = 0;
  }
  update() {
    super.update();
    const room = this.room;
    if (this.wobble > 0) this.wobble--;
    this.vy = Math.min(this.vy + 0.3, 6);
    const res = room.moveY(this, this.vy);
    if (res.landed) {
      if (this.vy > 2.5) {
        AudioSys.sfx('thud'); this.level.shake(3); Particles.dust(this.cx, this.y + this.h, 8);
        this.level.crateLanded(this);
      }
      this.vy = 0; this.groundEnt = res.on; this.onGround = true;
    } else { this.onGround = false; this.groundEnt = null; }
    // conveyors
    const gc = room.groundCode(this);
    if (this.onGround && (gc === TL.CONVL || gc === TL.CONVR)) this.tryMove(gc === TL.CONVL ? -0.6 : 0.6);
    // bonk anyone underneath while falling
    if (this.vy > 2) {
      for (const f of this.level.friends) {
        if (!f.present || f.gone || f.mishapT > 0) continue;
        if (overlap(this, f)) f.mishap('bonk');
      }
    }
    if (this.y > room.h + 40) {
      this.x = this.home.x; this.y = this.home.y; this.vy = 0;
      Particles.puff(this.cx, this.cy, 14); AudioSys.sfx('poof');
    }
  }
  interactInfo(f) {
    if (this.p.fixed) return null;
    return f.who === 'dex' ? { ok: true, label: 'Grab (hold E)', prio: 1, hold: true } : { ok: false, need: 'dex', label: 'Too heavy', prio: 0 };
  }
  use(f) { if (f.who === 'dex') f.startGrab(this); }
  // move horizontally, carrying riders; blocked by walls, solids and people
  tryMove(dx) {
    const room = this.room;
    const before = this.x;
    const skip = f => f.groundEnt === this || f.pushingCrate === this || f.grabbing === this || f.mishapT > 0 || !f.present;
    // shove anybody standing in the way (they stop only against walls)
    const probe = { x: this.x + dx, y: this.y + 2, w: this.w, h: this.h - 2 };
    for (const f of this.level.friends) {
      if (skip(f) || !overlap(probe, f)) continue;
      const need = dx > 0 ? (probe.x + probe.w) - f.x : probe.x - (f.x + f.w);
      if (Math.sign(need) !== Math.sign(dx)) continue;
      const bx = f.x;
      room.moveX(f, need);
      // pinned against a wall? hop them up onto the crate instead of blocking the push
      if (Math.abs((f.x - bx) - need) > 0.5 && !room.rectBlocked(f.x, this.y - f.h, f.w, f.h, f)) {
        f.y = this.y - f.h; f.vy = 0; f.onGround = true; f.groundEnt = this;
        f.sx = 0.8; f.sy = 1.2;
      }
    }
    room.moveX(this, dx, { bodies: true, ignoreBody: skip });
    const moved = this.x - before;
    if (moved) {
      for (const f of this.level.friends) if (f.groundEnt === this && f.present) room.moveX(f, moved);
      for (const e of room.ents) if (e.crate && e !== this && e.groundEnt === this) e.tryMove(moved);
      this.pushT++;
      if (this.pushT % 14 === 1) AudioSys.sfx('push');
      if (this.pushT % 6 === 0) Particles.dust(moved > 0 ? this.x : this.x + this.w, this.y + this.h, 1);
    }
    return moved;
  }
  draw(g, ox, oy) {
    const x = Math.round(this.x - ox), y = Math.round(this.y - oy) + (this.wobble > 0 ? ((this.wobble >> 1) % 2) : 0);
    drawCrateArt(g, this.kind, x, y, this.w, this.h, this.t);
    // Dex affordance: small red weight badge
    if (this.level.showHints) { g.fillStyle = '#e8504a'; g.fillRect(x + this.w - 6, y + 2, 4, 3); g.fillStyle = '#fff'; g.fillRect(x + this.w - 5, y + 3, 2, 1); }
  }
}
function drawCrateArt(g, kind, x, y, w, h, t) {
  const R = (a, b, ww, hh, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, ww, hh); };
  switch (kind) {
    case 'couch':
      R(0, 4, w, h - 6, '#8a3a5a'); R(0, 2, 6, h - 2, '#7a2a4a'); R(w - 6, 2, 6, h - 2, '#7a2a4a');
      R(6, 0, w - 12, 8, '#9a4a6a'); R(6, 0, w - 12, 1, '#b86a8a'); R(Math.floor(w / 2), 1, 1, 7, '#7a2a4a');
      R(6, 8, w - 12, 3, '#a85a7a'); R(2, h - 2, 3, 2, '#3a2020'); R(w - 5, h - 2, 3, 2, '#3a2020');
      break;
    case 'vending':
      R(0, 0, w, h, '#c83a3a'); R(2, 2, w - 6, h - 12, '#2a3a4a');
      for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) R(3 + j * 4, 4 + i * 4, 3, 2, ['#ffd23f', '#4cc9f0', '#7cf29a', '#ff8a5a'][(i + j) % 4]);
      R(w - 4, 4, 2, 8, '#e8e8e8'); R(2, h - 8, w - 6, 4, '#1a1a1a'); R(0, 0, w, 1, '#e85a5a');
      break;
    case 'piano': case 'pianobig':
      R(0, 6, w, h - 10, '#1a1418'); R(0, 4, w, 3, '#2a2428'); R(2, 7, w - 4, 4, '#f4f0e6');
      for (let i = 3; i < w - 3; i += 3) R(i, 7, 1, 2, '#1a1418');
      R(2, h - 4, 3, 4, '#1a1418'); R(w - 5, h - 4, 3, 4, '#1a1418'); R(4, 0, 10, 5, '#2a2428'); R(5, 1, 7, 1, '#4a4448');
      break;
    case 'fridge':
      R(0, 0, w, h, '#e8eaee'); R(0, 12, w, 1, '#a8acb4'); R(w - 4, 4, 2, 6, '#8a8e96'); R(w - 4, 16, 2, 10, '#8a8e96'); R(1, 0, w - 2, 1, '#ffffff');
      R(3, 18, 4, 4, '#ffd23f'); R(5, 24, 3, 3, '#4cc9f0');
      break;
    case 'amp': case 'speaker':
      R(0, 0, w, h, '#2a2a2e'); R(2, 2, w - 4, h - 6, '#3e3e44');
      for (let yy = 4; yy < h - 6; yy += 2) R(3, yy, w - 6, 1, '#2a2a2e');
      R(2, h - 4, w - 4, 2, '#c8a040'); R(3, h - 3, 2, 1, '#ff4a4a');
      break;
    case 'dresser':
      R(0, 0, w, h, '#8a5a34'); R(0, 0, w, 2, '#a87a4a');
      for (let i = 0; i < 3; i++) { R(2, 4 + i * 9, w - 4, 7, '#9a6a40'); R(Math.floor(w / 2) - 2, 7 + i * 9, 4, 1, '#d8b060'); }
      R(1, h - 2, 3, 2, '#4a2e1a'); R(w - 4, h - 2, 3, 2, '#4a2e1a');
      break;
    case 'washer':
      R(0, 0, w, h, '#e4e8ec'); R(0, 0, w, 3, '#c4c8cc'); circleFill(x + 8, y + 9, 5, '#8a9aa8', g); circleFill(x + 8, y + 9, 3, '#7ac8e8', g);
      R(2, 1, 2, 1, '#ff5a3a'); R(11, 1, 3, 1, '#3a3a3a');
      break;
    case 'snowball':
      circleFill(x + 8, y + 8, 8, '#f4f8fc', g); R(3, 4, 4, 2, '#ffffff'); R(5, 12, 7, 2, '#c8d8ea'); R(10, 6, 2, 2, '#dde8f4');
      break;
    case 'cart':
      R(0, h - 6, w, 3, '#9aa2aa'); R(0, 2, 2, h - 4, '#9aa2aa'); R(2, h - 3, 3, 3, '#2a2a2a'); R(w - 5, h - 3, 3, 3, '#2a2a2a');
      R(4, 0, 10, h - 6, '#4a6aa8'); R(15, 3, 12, h - 9, '#a83a3a'); R(8, 1, 2, 1, '#d8d8d8');
      break;
    case 'suitcase':
      R(1, 3, w - 2, h - 4, '#4a6aa8'); R(5, 0, 6, 3, '#2a2a2a'); R(1, 8, w - 2, 1, '#3a5a98'); R(3, h - 1, 2, 1, '#222'); R(w - 5, h - 1, 2, 1, '#222');
      break;
    case 'trunk':
      R(0, 2, w, h - 2, '#6a4a2a'); R(0, 2, w, 3, '#8a6a3a'); R(4, 2, 2, h - 2, '#c8a040'); R(w - 6, 2, 2, h - 2, '#c8a040'); R(Math.floor(w / 2) - 2, 6, 4, 4, '#c8a040');
      break;
    case 'sandbag':
      R(1, 4, w - 2, h - 4, '#b8a070'); R(3, 2, w - 6, 3, '#c8b080'); R(7, 0, 2, 3, '#8a7a50'); R(3, 9, 10, 1, '#9a8458');
      break;
    case 'bike':
      circleFill(x + 6, y + 10, 5, '#2a2a2a', g); circleFill(x + 6, y + 10, 3, '#888', g);
      circleFill(x + w - 7, y + 10, 5, '#2a2a2a', g); circleFill(x + w - 7, y + 10, 3, '#888', g);
      R(6, 5, w - 12, 2, '#2ec4b6'); R(10, 2, 2, 8, '#2ec4b6'); R(w - 10, 2, 2, 8, '#2ec4b6'); R(8, 1, 6, 2, '#222'); R(w - 9, 0, 4, 2, '#555');
      break;
    case 'gym':
      R(2, 8, w - 4, 3, '#3a3a3a'); R(0, 2, 4, 14, '#555'); R(w - 4, 2, 4, 14, '#555'); R(4, 4, w - 8, 2, '#999'); R(4, 11, 3, 5, '#333'); R(w - 7, 11, 3, 5, '#333');
      break;
    case 'grill':
      R(2, 2, w - 4, 6, '#2a2a2e'); R(0, 0, w, 3, '#3a3a40'); R(4, 8, 2, 8, '#2a2a2e'); R(w - 6, 8, 2, 8, '#2a2a2e'); R(3, 14, w - 6, 1, '#2a2a2e');
      for (let i = 3; i < w - 3; i += 3) R(i, 1, 1, 1, '#8a8a8a');
      break;
    case 'cooler':
      R(0, 4, w, h - 4, '#3a7ac8'); R(0, 2, w, 4, '#f4f4f4'); R(5, 0, 6, 2, '#888'); R(2, 9, w - 4, 1, '#2a5a98');
      break;
    case 'case':
      R(0, 3, w, h - 3, '#1a1a22'); R(2, 5, w - 4, h - 7, '#2a2a34'); R(Math.floor(w / 2) - 3, 0, 6, 3, '#888'); R(4, 8, 6, 2, '#c8a040');
      break;
    case 'tophat':
      R(4, 2, w - 8, h - 6, '#1b1b2b'); R(0, h - 6, w, 4, '#1b1b2b'); R(4, h - 12, w - 8, 3, '#9b5de5'); R(7, 4, 2, 14, '#3a3a4a');
      R(2, h - 2, w - 4, 2, '#3a2a3a');
      break;
    case 'magnet':
      R(0, 0, 6, h, '#d83a3a'); R(w - 6, 0, 6, h, '#d83a3a'); R(0, h - 6, w, 6, '#d83a3a'); R(0, 0, 6, 4, '#e8e8e8'); R(w - 6, 0, 6, 4, '#e8e8e8');
      break;
    case 'dumpster':
      R(0, 6, w, h - 8, '#2a6a3a'); R(0, 2, w, 5, '#1e5a2e'); R(2, h - 2, 4, 2, '#222'); R(w - 6, h - 2, 4, 2, '#222'); R(6, 12, w - 12, 2, '#1e5a2e');
      R(0, 0, w, 3, '#f4f8fc');
      break;
    case 'boxes2':
      R(0, 0, w, h / 2 - 1, '#b08a5a'); R(1, h / 2, w - 1, h / 2, '#a07a4a'); R(0, h / 2 - 1, w, 1, '#7a5a34');
      R(6, 0, 4, h / 2 - 1, '#d8b88a'); R(6, h / 2, 4, h / 2, '#c8a87a');
      break;
    case 'box': default:
      R(0, 0, w, h, '#b08a5a'); R(0, 0, w, 1, '#d0aa7a'); R(0, h - 1, w, 1, '#7a5a34'); R(w - 1, 0, 1, h, '#8a6a40');
      R(Math.floor(w / 2) - 2, 0, 4, h, '#d8b88a'); R(2, 3, 4, 1, '#7a5a34'); R(2, 5, 3, 1, '#7a5a34');
  }
}

// ---- Doors & barriers -------------------------------------------------------------
class Door extends Ent {
  constructor(room, tx, ty, p) {
    super(room, tx, ty, p, p.kind === 'curtain' ? 1 : 1, p.h || 2);
    this.kind = p.kind || 'door';
    this.open = 0; this.solid = true; this.fullH = this.h;
    this.forced = false; this.was = false;
  }
  wantOpen() { return this.forced || this.level.check(this.link); }
  update() {
    super.update();
    const want = this.wantOpen();
    if (want && this.open < 1) {
      if (this.open === 0) { AudioSys.sfx(this.kind === 'gate' || this.kind === 'bars' ? 'gate' : this.kind === 'door' ? 'creak' : 'door'); Particles.dust(this.cx, this.y + this.fullH, 5); }
      this.open = Math.min(1, this.open + 0.05);
    } else if (!want && this.open > 0) {
      // don't close on people
      const blocked = this.level.friends.some(f => f.present && overlap(f, { x: this.x, y: this.y, w: this.w, h: this.fullH }));
      if (!blocked) this.open = Math.max(0, this.open - 0.05);
    }
    this.solid = this.open < 0.85;
    if (want && !this.was && this.id) this.setFlag(true);
    this.was = want;
  }
  draw(g, ox, oy) {
    const x = Math.round(this.x - ox), y = Math.round(this.y - oy), w = this.w, h = this.fullH, o = this.open;
    drawDoorArt(g, this.kind, x, y, w, h, o, this.t, this);
  }
}
function drawDoorArt(g, kind, x, y, w, h, o, t, ent) {
  const R = (a, b, ww, hh, c) => { if (ww > 0 && hh > 0) { g.fillStyle = c; g.fillRect(x + a, y + b, ww, hh); } };
  switch (kind) {
    case 'gate': case 'bars': {
      const lift = Math.round(o * (h - 4));
      R(-2, -2, w + 4, 3, '#3a3e46');
      for (let i = 1; i < w; i += 4) R(i, -lift, 2, h - 1, '#5a606a');
      R(0, h - 4 - lift, w, 2, '#5a606a'); R(0, 4 - lift, w, 2, '#5a606a');
      break;
    }
    case 'shutter': {
      const lift = Math.round(o * (h - 2));
      R(-1, -3, w + 2, 4, '#4a4e56');
      for (let yy = 0; yy < h - lift; yy += 3) R(0, yy, w, 2, '#8a9098');
      R(0, h - lift - 2, w, 2, '#5a6068');
      break;
    }
    case 'curtain': {
      const cw = Math.round(w * (1 - o));
      for (let i = 0; i < cw; i += 3) R(i, 0, 2, h, i % 6 ? '#8a1a2a' : '#6a1220');
      R(0, 0, Math.max(1, cw), 3, '#c8a040');
      break;
    }
    case 'sound': {
      const lift = Math.round(o * (h - 2));
      R(0, -lift, w, h, '#2a3a5a'); R(2, 2 - lift, w - 4, h - 4, '#3a5a8a');
      R(3, 6 - lift, w - 6, 6, '#1a1a2a'); drawText('♪', x + w / 2, y + 4 - lift, '#4cc9f0', { align: 'center' });
      for (let i = 0; i < 3; i++) R(4, h - 14 + i * 3 - lift, w - 8, 1, '#2a3a5a');
      R(-1, -3, w + 2, 3, '#1a1a2a');
      break;
    }
    case 'boxes': {
      if (o >= 1) break;
      const fall = Math.round(o * 20);
      R(0 - fall, 0 + fall, w, h / 2, '#b08a5a'); R(0 + fall / 2, h / 2, w, h / 2, '#a07a4a');
      break;
    }
    case 'snow': {
      const sh = Math.round((1 - o) * h);
      if (sh <= 0) break;
      R(0, h - sh, w, sh, '#e8f0f8'); R(1, h - sh, w - 2, 2, '#ffffff'); R(2, h - sh + 6, w - 4, 1, '#c8d8ea');
      break;
    }
    case 'rope': {
      if (o >= 1) break;
      R(1, h - 18, 3, 18, '#c8a040'); R(w - 4, h - 18, 3, 18, '#c8a040'); R(2, h - 14, w - 4, 2, '#a01a2a');
      R(0, h - 2, 5, 2, '#8a7020'); R(w - 5, h - 2, 5, 2, '#8a7020');
      break;
    }
    case 'turnstile': {
      R(0, h - 20, w, 20, '#7a828a'); R(1, h - 19, w - 2, 2, '#b8c0c8');
      const a = o * Math.PI / 2;
      R(Math.round(w / 2 - Math.cos(a) * 7), h - 14, Math.max(1, Math.round(Math.cos(a) * 14)), 2, '#d8dce0');
      break;
    }
    case 'glass': {
      const sl = Math.round(o * w);
      g.fillStyle = 'rgba(180,220,255,0.45)'; g.fillRect(x, y - sl, w, h);
      R(0, -sl, w, 1, '#e8f4ff'); R(0, h - 1 - sl, w, 1, '#8ab0d0');
      break;
    }
    case 'door': default: {
      // a door panel that swings (narrows) open
      const ww = Math.max(2, Math.round(w * (1 - o * 0.85)));
      R(-1, -2, w + 2, 2, '#3a2418');
      R(0, 0, ww, h, '#7a4a30'); R(1, 2, Math.max(1, ww - 2), h / 2 - 3, '#8a5a3a'); R(1, h / 2 + 1, Math.max(1, ww - 2), h / 2 - 3, '#8a5a3a');
      if (o < 0.5) R(ww - 4, h / 2, 2, 3, '#e0c060');
      if (ent && ent.locked !== false && o === 0) { R(Math.floor(w / 2) - 2, h / 2 - 4, 4, 3, '#c8c8c8'); }
    }
  }
}

class SoundDoor extends Door {
  constructor(room, tx, ty, p) { super(room, tx, ty, Object.assign({ kind: 'sound' }, p)); this.heard = false; this.sound = true; }
  wantOpen() { return this.heard || this.level.check(this.link) && !!this.link; }
  onSound() { if (!this.heard) { this.heard = true; this.setFlag(true); AudioSys.sfx('fixed'); Particles.notes(this.cx, this.y, 6); this.level.toastAt(this.cx, this.y - 8, 'OPEN!', '#4cc9f0'); } }
  interactInfo(f) { if (this.heard) return null; return f.who === 'juno' ? { ok: true, label: 'Play', prio: 3, play: true } : { ok: false, need: 'juno', label: 'Needs music', prio: 1 }; }
}

// ---- Dex shutter ---------------------------------------------------------------------
class Shutter extends Ent {
  constructor(room, tx, ty, p) {
    super(room, tx, ty, p, 1, p.h || 3);
    this.fullH = this.h; this.lift = 0; this.liftPx = (p.lift || 2) * T; this.solid = true; this.holder = null; this.kind = p.kind || 'shutter';
  }
  update() {
    super.update();
    const held = this.holder && this.holder.holding === this;
    if (!held) this.holder = null;
    const want = held || this.level.check(this.link) && !!this.link;
    if (want) this.lift = Math.min(1, this.lift + 0.06);
    else if (this.lift > 0) {
      const gap = { x: this.x, y: this.y, w: this.w, h: this.fullH };
      const under = this.level.friends.some(f => f.present && overlap(f, gap));
      if (!under) { this.lift = Math.max(0, this.lift - 0.12); if (this.lift === 0) { AudioSys.sfx('crash'); this.level.shake(2); } }
    }
    this.h = Math.max(1, this.fullH - Math.round(this.lift * this.liftPx));
    this.solid = true;
  }
  interactInfo(f) {
    if (f.who === 'dex') return { ok: true, label: f.holding === this ? 'Let go' : 'Lift', prio: 4 };
    return { ok: false, need: 'dex', label: 'Too heavy', prio: 1 };
  }
  use(f) { if (f.holding === this) f.release(); else { f.startHold(this); this.holder = f; AudioSys.sfx('shutter'); AudioSys.sfx('grunt'); } }
  draw(g, ox, oy) {
    const x = Math.round(this.x - ox), y = Math.round(this.y - oy), w = this.w;
    const R = (a, b, ww, hh, c) => { if (hh > 0) { g.fillStyle = c; g.fillRect(x + a, y + b, ww, hh); } };
    R(-2, -3, w + 4, 4, '#3a3e46');
    const hh = this.h;
    if (this.kind === 'beam') {
      R(0, 0, w, hh, '#7a5a3a'); for (let i = 4; i < hh; i += 8) R(0, i, w, 1, '#5a3a22');
    } else {
      for (let yy = 0; yy < hh; yy += 3) R(0, yy, w, 2, '#9aa0a8');
      R(0, hh - 3, w, 3, '#6a7078'); R(Math.floor(w / 2) - 3, hh - 5, 6, 2, '#e8504a');
    }
    if (this.level.showHints && this.lift < 0.5) { g.fillStyle = '#e8504a'; g.fillRect(x + w / 2 - 2, y + 4, 4, 3); }
  }
}

// ---- Lever (anyone) ------------------------------------------------------------------
class Lever extends Ent {
  constructor(room, tx, ty, p) { super(room, tx, ty, p, 1, 1); this.on = !!p.on; this.kind = p.kind || 'lever'; if (this.on) this.setFlagLater = true; }
  update() { super.update(); if (this.setFlagLater) { this.setFlag(true); this.setFlagLater = false; } }
  interactInfo() { return (this.on && !this.p.toggle) ? null : { ok: true, label: this.kind === 'button' ? 'Press' : 'Pull', prio: 3 }; }
  use(f) {
    if (this.on && !this.p.toggle) return;
    this.on = this.p.toggle ? !this.on : true;
    this.setFlag(this.on);
    AudioSys.sfx('lever');
    Particles.dust(this.cx, this.cy, 3);
    if (this.p.say && this.on) this.level.say(f.who, this.p.say);
  }
  draw(g, ox, oy) {
    const x = Math.round(this.x - ox), y = Math.round(this.y - oy);
    const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); };
    if (this.kind === 'button') {
      R(3, 4, 10, 10, '#4a4e56'); R(4, 5, 8, 8, '#2a2e36'); circleFill(x + 8, y + 9, 3, this.on ? '#7cf29a' : '#e8504a', g);
    } else if (this.kind === 'valve') {
      R(7, 6, 2, 10, '#6a7078'); circleFill(x + 8, y + 6, 5, '#c83a3a', g); circleFill(x + 8, y + 6, 3, '#4a4e56', g);
      const a = this.on ? 1 : 0; R(4 + a * 3, 5, 8 - a * 3, 2, '#e8504a');
    } else {
      R(3, 10, 10, 6, '#4a4e56'); R(4, 11, 8, 2, '#6a707a');
      if (this.on) { R(9, 4, 2, 7, '#8a8e96'); R(9, 2, 4, 3, '#7cf29a'); }
      else { R(5, 4, 2, 7, '#8a8e96'); R(3, 2, 4, 3, '#e8504a'); }
    }
  }
}

// ---- Broken things (Theo) ----------------------------------------------------------
class Broken extends Ent {
  constructor(room, tx, ty, p) {
    super(room, tx, ty, p, p.w || 1, p.h || 1);
    this.kind = p.kind || 'panel'; this.fixed = false; this.progress = 0; this.fixer = null;
  }
  update() {
    super.update();
    if (!this.fixed) {
      if (this.fixer && this.fixer.fixing === this) {
        this.progress += 1 / 55;
        if (this.t % 9 === 0) AudioSys.sfx('clink');
        if (this.t % 5 === 0) Particles.sparks(this.cx, this.cy, 2);
        if (this.progress >= 1) this.complete();
      } else { this.fixer = null; this.progress = Math.max(0, this.progress - 0.01); }
      if (this.t % 50 === 0 && hash2(this.t, this.tx, 2) < 0.6) { Particles.sparks(this.cx, this.cy, 3); if (this.level.near(this, 160)) AudioSys.sfx('spark'); }
    }
  }
  complete() {
    this.fixed = true; this.progress = 1;
    this.setFlag(true);
    AudioSys.sfx('fixed');
    Particles.sparkle(this.cx, this.cy, 12);
    const f = this.fixer;
    if (f) { f.fixing = null; f.state = 'normal'; f.celebrate(40); }
    this.level.onFixed(this, f);
  }
  interactInfo(f) {
    if (this.fixed) return null;
    return f.who === 'theo' ? { ok: true, label: 'Fix (hold)', prio: 4, hold: true } : { ok: false, need: 'theo', label: 'Broken', prio: 1 };
  }
  use(f) { if (!this.fixed && f.who === 'theo') { this.fixer = f; f.startFix(this); } }
  draw(g, ox, oy) {
    const x = Math.round(this.x - ox), y = Math.round(this.y - oy);
    drawBrokenArt(g, this.kind, x, y, this.w, this.h, this.fixed, this.t);
    if (!this.fixed && this.progress > 0) {
      g.fillStyle = '#1b1020'; g.fillRect(x + this.w / 2 - 11, y - 8, 22, 5);
      g.fillStyle = '#8fb33a'; g.fillRect(x + this.w / 2 - 10, y - 7, Math.round(20 * this.progress), 3);
    }
    if (!this.fixed && this.level.showHints) drawNeedBadge(g, 'theo', x + this.w - 4, y - 2, this.t);
  }
}
function drawBrokenArt(g, kind, x, y, w, h, fixed, t) {
  const R = (a, b, ww, hh, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, ww, hh); };
  const blink = (t >> 3) % 2;
  switch (kind) {
    case 'fusebox':
      R(1, 0, w - 2, h, '#6a707a'); R(2, 1, w - 4, h - 2, '#4a505a');
      for (let i = 0; i < 3; i++) R(4 + i * 3, 4, 2, 6, fixed ? '#7cf29a' : (i === 1 ? '#ff4a3a' : '#3a3a3a'));
      if (!fixed) R(3, 11, 10, 2, blink ? '#ffd23f' : '#3a3a3a');
      break;
    case 'generator':
      R(0, 4, w, h - 4, '#c8a020'); R(2, 6, w - 4, h - 10, '#a88010'); R(4, 0, 8, 5, '#555'); circleFill(x + w - 9, y + h / 2 + 2, 5, '#3a3a3a', g);
      R(5, h - 8, 10, 3, fixed ? '#7cf29a' : (blink ? '#ff4a3a' : '#5a1a1a'));
      if (fixed) { R(6, 1 - (t >> 2) % 2, 2, 2, '#ddd'); }
      break;
    case 'elevator': case 'panel':
      R(3, 1, 10, 14, '#8a8e96'); R(4, 2, 8, 12, '#3a3e46');
      R(6, 4, 4, 3, fixed ? '#7cf29a' : (blink ? '#ff4a3a' : '#5a1a1a')); R(6, 9, 4, 3, fixed ? '#7cf29a' : '#555');
      if (!fixed) { R(12, 12, 3, 1, '#ffd23f'); R(13, 13, 1, 3, '#ffd23f'); }
      break;
    case 'switch':
      R(4, 3, 8, 11, '#e8e0d0'); R(6, 5, 4, 7, '#c8c0b0'); R(7, fixed ? 5 : 8, 2, 3, fixed ? '#7cf29a' : '#555');
      break;
    case 'espresso':
      R(0, 2, w, h - 2, '#b8bcc4'); R(2, 4, w - 4, 8, '#3a3a40'); R(4, 6, 3, 3, fixed ? '#7cf29a' : (blink ? '#ff4a3a' : '#5a1a1a'));
      R(w - 10, 12, 6, 6, '#3a3a40'); R(w - 9, h - 6, 4, 4, '#f4f0e6'); R(2, 0, w - 4, 3, '#d8dce4');
      if (!fixed && (t % 40) < 20) { g.fillStyle = 'rgba(255,255,255,0.7)'; g.fillRect(x + w - 6, y - 4 - (t % 20) / 3, 3, 4); }
      break;
    case 'grill':
      R(0, 4, w, 6, '#2a2a2e'); R(2, 10, 2, h - 10, '#2a2a2e'); R(w - 4, 10, 2, h - 10, '#2a2a2e'); R(0, 2, w, 3, '#3a3a40');
      if (fixed) for (let i = 2; i < w - 2; i += 3) R(i, 1 - (t >> 3) % 2, 2, 2, (i + (t >> 3)) % 2 ? '#ff6a2a' : '#ffd23f');
      break;
    case 'sign':
      R(0, 0, w, h, '#2a1a2a'); R(1, 1, w - 2, h - 2, '#3a2a3a');
      drawText(fixed ? 'OPEN' : 'OP N', x + w / 2, y + h / 2 - 5, fixed ? '#ff4f9a' : '#6a3a5a', { align: 'center' });
      break;
    case 'pump': case 'boiler':
      R(2, 0, w - 4, h, '#7a3a2a'); R(0, 4, w, h - 8, '#8a4a3a'); circleFill(x + w / 2, y + h / 2, 4, '#d8d0c0', g);
      R(w / 2, h / 2 - 3, 1, 3, fixed ? '#3a8a3a' : '#c83a3a');
      if (!fixed && (t % 30) < 15) { g.fillStyle = 'rgba(255,255,255,0.6)'; g.fillRect(x + w - 2, y + 2, 5, 3); }
      break;
    case 'motor':
      R(1, 3, w - 2, h - 5, '#5a606a'); circleFill(x + w / 2, y + h / 2, 4, '#3a3e46', g); R(w / 2 - 1, 2, 2, 3, '#8a8e96');
      R(2, h - 3, w - 4, 2, '#3a3e46');
      break;
    case 'lights':
      R(2, 4, w - 4, 8, '#3a3a3a'); R(4, 6, w - 8, 4, fixed ? '#ffe89a' : '#5a5a4a');
      break;
    case 'robot':
      drawRobot(g, x + w / 2, y + h, false, fixed ? t : 0, {});
      break;
    case 'speaker':
      R(1, 0, w - 2, h, '#2a2a2e'); circleFill(x + w / 2, y + h / 2 + 2, 4, '#4a4a50', g); circleFill(x + w / 2, y + 4, 2, '#4a4a50', g);
      break;
    case 'escalator':
      R(0, h - 6, w, 6, '#5a606a'); R(0, h - 8, w, 2, fixed ? '#ffd23f' : '#3a3e46');
      break;
    case 'turnstile':
      R(0, 4, w, h - 4, '#7a828a'); R(2, 6, w - 4, 3, fixed ? '#7cf29a' : '#ff4a3a');
      break;
    case 'snowplow':
      R(0, 4, w, h - 8, '#e8a020'); R(w - 6, 0, 6, h - 4, '#5a606a'); R(2, h - 4, 4, 4, '#222'); R(w - 12, h - 4, 4, 4, '#222'); R(4, 6, 8, 5, '#9ad8ff');
      break;
    case 'boarding':
      R(0, 0, w, h, '#3a4a5a'); R(2, 2, w - 4, 6, '#1a2a3a'); drawText(fixed ? 'GO' : '--', x + w / 2, y + 1, fixed ? '#7cf29a' : '#ff4a3a', { align: 'center' });
      break;
    default:
      R(2, 2, 12, 12, '#7a7e86'); R(4, 4, 8, 8, fixed ? '#7cf29a' : '#ff4a3a');
  }
}
function drawNeedBadge(g, who, x, y, t) {
  const col = FRIEND_INFO[who] ? FRIEND_INFO[who].color : '#fff';
  const bob = Math.round(Math.sin(t / 12));
  x = Math.round(x); y = Math.round(y) + bob;
  g.fillStyle = '#1b1020'; g.fillRect(x - 1, y - 6, 7, 7);
  g.fillStyle = col; g.fillRect(x, y - 5, 5, 5);
  g.fillStyle = '#fff';
  switch (who) {
    case 'theo': g.fillRect(x + 1, y - 4, 1, 3); g.fillRect(x + 2, y - 2, 2, 1); g.fillRect(x + 3, y - 4, 1, 2); break; // wrench
    case 'priya': g.fillRect(x + 1, y - 4, 3, 2); g.fillRect(x + 1, y - 2, 1, 1); break; // speech
    case 'juno': g.fillRect(x + 2, y - 4, 1, 3); g.fillRect(x + 1, y - 2, 1, 1); g.fillRect(x + 3, y - 4, 1, 1); break; // note
    case 'benny': g.fillRect(x + 1, y - 4, 3, 1); g.fillRect(x + 1, y - 2, 3, 1); break; // vent
    case 'dex': g.fillRect(x + 1, y - 3, 3, 2); break;
    case 'mila': g.fillRect(x + 2, y - 4, 1, 3); g.fillRect(x + 1, y - 3, 3, 1); break;
    default: break;
  }
}

// ---- Pressure plate ------------------------------------------------------------------
class Plate extends Ent {
  constructor(room, tx, ty, p) { super(room, tx, ty, p, p.w || 1, 1); this.pressed = false; this.latched = false; this.heavy = !!p.heavy; }
  update() {
    super.update();
    const zone = { x: this.x + 2, y: this.y + this.h - 6, w: this.w - 4, h: 8 };
    let on = false;
    for (const e of this.room.ents) if (e.crate && overlap(zone, e)) on = true;
    if (!on) for (const f of this.level.friends) {
      if (!f.present || f.gone || f.mishapT > 0) continue;
      if (this.heavy && f.who !== 'dex') continue;
      if (f.onGround && overlap(zone, f)) on = true;
    }
    if (this.p.latch && this.latched) on = true;
    if (on && !this.pressed) { AudioSys.sfx('lever'); if (this.p.latch) this.latched = true; }
    if (on !== this.pressed) { this.pressed = on; this.setFlag(on); }
  }
  draw(g, ox, oy) {
    const x = Math.round(this.x - ox), y = Math.round(this.y - oy) + this.h;
    const d = this.pressed ? 1 : 0;
    g.fillStyle = '#3a3e46'; g.fillRect(x + 1, y - 3, this.w - 2, 3);
    g.fillStyle = this.pressed ? '#7cf29a' : (this.heavy ? '#e8504a' : '#ffd23f');
    g.fillRect(x + 2, y - 4 + d, this.w - 4, 2);
    if (this.p.mark) { // an "X marks the spot" for furniture
      g.fillStyle = this.pressed ? '#7cf29a' : '#ffffff';
      for (let i = 0; i < 5; i++) { g.fillRect(x + this.w / 2 - 2 + i, y - 10 + i, 1, 1); g.fillRect(x + this.w / 2 + 2 - i, y - 10 + i, 1, 1); }
    }
    if (this.heavy && !this.pressed && this.level.showHints) drawNeedBadge(g, 'dex', x + this.w / 2 - 2, y - 6, this.t);
  }
}

// ---- NPC blocker (Priya talks / Juno distracts) -------------------------------------
class NPC extends Ent {
  constructor(room, tx, ty, p) {
    super(room, tx, ty, p, 1, 2);
    this.look = p.look || 'guard';
    this.w = 14; this.x = tx * T + 1;
    this.h = 28; this.y = (ty + 1) * T - 28;
    this.face = p.face || -1;
    this.state = p.state || 'block';
    this.solve = p.solve || 'talk';
    this.solid = this.state === 'block';
    // wall height: up to the ceiling so nobody hops over
    let top = ty;
    while (top > 0 && !room.solidAt(tx, top - 1) && ty - top < 8) top--;
    this.wallTop = top * T;
    this.home = this.x;
    this.target = p.moveTo !== undefined ? (tx + p.moveTo) * T + 1 : null;
    this.anim = 'idle'; this.expr = p.expr || 'angry';
    this.danceT = 0; this.cool = 0; this.talkT = 0;
    this.seed = p.seed;
  }
  get solidBox() { return { x: this.x, y: this.wallTop, w: this.w, h: this.y + this.h - this.wallTop }; }
  get colBox() { return this.state === 'block' ? this.solidBox : null; }
  update() {
    super.update();
    if (this.cool > 0) this.cool--;
    if (this.talkT > 0) this.talkT--;
    if (this.state === 'block') {
      // collision box spans to ceiling
      const sb = this.solidBox;
      this.solidRect = sb;
      // greet approaching friends
      const f = this.level.active();
      if (f && Math.abs(f.cx - this.cx) < 40 && Math.abs(f.y - this.y) < 40 && this.cool === 0) {
        this.cool = 240;
        const line = this.p.block || 'Nobody gets past me.';
        this.level.say(this.npcVoice(), line, this);
        this.face = f.cx < this.cx ? -1 : 1;
        if (this.solve === 'talk' && f.who !== 'priya') this.level.hint('priya', 'Needs PRIYA to talk past');
        if (this.solve === 'music' && f.who !== 'juno') this.level.hint('juno', 'Needs JUNO to distract');
      }
    } else if (this.state === 'dance') {
      this.danceT--;
      this.anim = 'dance'; this.expr = 'happy';
      if (this.t % 20 === 0) Particles.notes(this.cx, this.y - 4, 1);
      if (this.danceT <= 0) { this.state = this.target !== null ? 'leave' : 'done'; }
    } else if (this.state === 'leave') {
      this.anim = 'walk';
      const dir = sign(this.target - this.x);
      this.face = dir || this.face;
      this.x += dir * 1.2;
      if (Math.abs(this.target - this.x) < 1.5) { this.x = this.target; this.state = 'done'; this.anim = this.solve === 'music' ? 'dance' : 'idle'; this.face = -this.face; if (this.p.vanish) { this.fading = 1; AudioSys.sfx('creak'); } }
    }
    if (this.fading) { this.fading -= 0.05; if (this.fading <= 0) { this.fading = 0; this.gone = true; } }
    this.solid = this.state === 'block';
  }
  npcVoice() { return this.p.voice || 'npc'; }
  useBox() { return { x: this.x - 24, y: this.y - 4, w: this.w + 48, h: this.h + 8 }; }
  // used by collision: replace box with full-height wall while blocking
  get collider() { return this.state === 'block' ? this.solidBox : null; }
  interactInfo(f) {
    if (this.gone) return null;
    if (this.state !== 'block') return this.p.after ? { ok: true, label: 'Chat', prio: 1 } : null;
    if (this.solve === 'talk') return f.who === 'priya' ? { ok: true, label: 'Talk', prio: 5 } : { ok: false, need: 'priya', label: 'Grumpy', prio: 2 };
    return f.who === 'juno' ? { ok: true, label: 'Play', prio: 5, play: true } : { ok: false, need: 'juno', label: 'In the way', prio: 2 };
  }
  use(f) {
    if (this.state !== 'block') { if (this.p.after) this.level.say(this.npcVoice(), pick([].concat(this.p.after)), this); return; }
    if (this.solve === 'talk' && f.who === 'priya') this.level.openChoice(this, f);
    else if (this.solve !== 'talk' && f.who !== 'juno') this.level.say(this.npcVoice(), this.p.block || 'Move along.', this);
  }
  onSound() {
    if (this.solve === 'music' && this.state === 'block') {
      this.state = 'dance'; this.danceT = 70; this.setFlag(true);
      this.level.say(this.npcVoice(), this.p.won || 'Ooh, I love this song!', this);
      AudioSys.audience('chuckle', 0.6);
    }
  }
  solved() {
    this.state = this.target !== null ? 'leave' : 'done';
    this.expr = 'happy';
    this.setFlag(true);
  }
  draw(g, ox, oy) {
    if (this.gone) return;
    if (this.look === 'pigeons') {
      const fly = this.state !== 'block';
      g.globalAlpha = this.fading ? this.fading : 1;
      for (let i = 0; i < 5; i++) {
        const px = this.cx - ox - 10 + i * 6 + (fly ? Math.sin(this.t / 5 + i) * 3 : 0);
        const py = this.y + this.h - oy - (i % 2) * 9 - (fly ? (this.t % 60) * 0.3 + i * 2 : 0) - (i > 2 ? 14 : 0);
        drawPigeon(g, px, py, (i + (this.t >> 5)) % 2 === 0, this.t + i * 7, fly);
      }
      g.globalAlpha = 1;
      if (this.state === 'block' && this.level.showHints) drawNeedBadge(g, 'juno', Math.round(this.cx - ox) - 2, Math.round(this.y - oy) - 16, this.t);
      if (this.state === 'block' && this.t % 120 === 0 && this.level.near(this, 200)) AudioSys.sfx('coo');
      return;
    }
    const pose = { anim: this.anim, t: this.t, expr: this.expr, blink: (this.t % 180) < 6, talk: this.level.isTalking(this) };
    blitPerson(g, 'npc:' + this.look + (this.seed !== undefined ? '~' + this.seed : ''), npcSpecFn(this.look, this.seed), pose, Math.round(this.cx - ox), Math.round(this.y + this.h - oy), { flip: this.face < 0, alpha: this.fading ? this.fading : 1 });
    if (this.state === 'block' && this.level.showHints) drawNeedBadge(g, this.solve === 'talk' ? 'priya' : 'juno', Math.round(this.cx - ox) - 2, Math.round(this.y - oy) - 10, this.t);
    if (this.state === 'block' && this.p.arms) { /* arms crossed handled by pose */ }
  }
}

// ---- Watcher (patrols, catches rule-breakers; Juno distracts, Benny is unseen) -------
class Watcher extends Ent {
  constructor(room, tx, ty, p) {
    super(room, tx, ty, p, 1, 2);
    this.look = p.look || 'holloway';
    this.w = 12; this.h = 28; this.x = tx * T + 2; this.y = (ty + 1) * T - 28;
    this.x1 = (tx + (p.from !== undefined ? p.from : -3)) * T; this.x2 = (tx + (p.to !== undefined ? p.to : 3)) * T;
    this.face = p.face || 1; this.speed = p.speed || 0.55; this.range = (p.range || 6) * T;
    this.pause = 0; this.danceT = 0; this.alertT = 0; this.seenRange = 0;
    this.lines = p.lines || ['HEY! Rule-breaker!', 'Caught you!', 'Back to your mark!', 'Not on my watch!'];
  }
  update() {
    super.update();
    if (this.alertT > 0) { this.alertT--; return; }
    if (this.danceT > 0) {
      this.danceT--;
      if (this.t % 18 === 0) Particles.notes(this.cx, this.y - 4, 1);
      return;
    }
    if (this.pause > 0) { this.pause--; if (this.pause === 30) this.face = -this.face; }
    else {
      this.x += this.face * this.speed;
      if (this.x <= this.x1) { this.x = this.x1; this.pause = 60; }
      if (this.x >= this.x2) { this.x = this.x2; this.pause = 60; }
    }
    // vision
    const eyeY = this.y + 6;
    const eyeX = this.face > 0 ? this.x + this.w : this.x;
    let reach = 0;
    for (reach = 0; reach < this.range; reach += 4) {
      const px = eyeX + this.face * reach;
      if (this.room.solidAt(Math.floor(px / T), Math.floor(eyeY / T)) || this.room.solidAt(Math.floor(px / T), Math.floor((this.y + this.h - 4) / T))) break;
      let blocked = false;
      for (const e of this.room.ents) if (e.solid && e !== this && px >= e.x && px <= e.x + e.w && eyeY + 10 >= e.y && eyeY + 10 <= e.y + e.h) { blocked = true; break; }
      if (blocked) break;
    }
    this.seenRange = reach;
    const vis = this.face > 0 ? { x: eyeX, y: this.y - 6, w: reach, h: this.h + 6 } : { x: eyeX - reach, y: this.y - 6, w: reach, h: this.h + 6 };
    this.vis = vis;
    for (const f of this.level.friends) {
      if (!f.present || f.gone || f.mishapT > 0 || f.who === 'benny') continue;
      if (overlap(vis, f)) {
        this.alertT = 50;
        this.level.say(this.p.voice || 'holloway', pick(this.lines), this);
        AudioSys.sfx('whistle');
        f.mishap('caught');
        break;
      }
    }
  }
  onSound() {
    if (this.danceT <= 0) { this.level.say(this.p.voice || 'holloway', pick(this.p.danceLines || ['...is that a bossa nova?', 'Oh, I LOVE this one.', 'My feet! They have a mind of their own!']), this); }
    this.danceT = 360; this.alertT = 0;
  }
  draw(g, ox, oy) {
    // vision cone
    if (this.vis && this.danceT <= 0 && this.alertT <= 0) {
      const v = this.vis;
      g.fillStyle = 'rgba(255,240,140,0.13)';
      g.fillRect(Math.round(v.x - ox), Math.round(this.y - oy + 2), Math.round(v.w), this.h - 2);
      g.fillStyle = 'rgba(255,240,140,0.22)';
      g.fillRect(Math.round(v.x - ox), Math.round(this.y - oy + 6), Math.round(v.w), 1);
    }
    const anim = this.danceT > 0 ? 'dance' : this.alertT > 0 ? 'point' : (this.pause > 0 ? 'idle' : 'walk');
    const expr = this.danceT > 0 ? 'happy' : this.alertT > 0 ? 'angry' : 'focus';
    blitPerson(g, 'npc:' + this.look, npcSpecFn(this.look), { anim, t: this.t, expr, blink: (this.t % 150) < 5 }, Math.round(this.cx - ox), Math.round(this.y + this.h - oy), { flip: this.face < 0 });
    if (this.alertT > 0) drawText('!', Math.round(this.cx - ox), Math.round(this.y - oy) - 14, '#ff4a3a', { scale: 2, align: 'center', outline: '#1b1020' });
    if (this.danceT > 0) drawText('♪', Math.round(this.cx - ox) + 8, Math.round(this.y - oy) - 10 - (this.t >> 3) % 3, '#4cc9f0', { outline: '#1b1020' });
    if (this.level.showHints && this.danceT <= 0) drawNeedBadge(g, 'juno', Math.round(this.cx - ox) - 2, Math.round(this.y - oy) - 10, this.t);
  }
}

// ---- Vent grate (Benny) ------------------------------------------------------------
class Grate extends Ent {
  constructor(room, tx, ty, p) { super(room, tx, ty, p, 1, 1); this.solid = true; this.opened = false; this.fallY = 0; }
  interactInfo(f) { if (this.opened) return null; return f.who === 'benny' ? { ok: true, label: 'Open vent', prio: 4 } : { ok: false, need: 'benny', label: 'Too small', prio: 1 }; }
  use(f) {
    if (this.opened || f.who !== 'benny') return;
    this.opened = true; this.solid = false; this.setFlag(true);
    AudioSys.sfx('magic'); Particles.puff(this.cx, this.cy, 10);
    this.level.say('benny', pick(['Ta-da! ...I unscrewed it.', 'Abraca-DOOR!', 'And now, the amazing disappearing vent cover!', 'Nobody look. Magician secret.']));
  }
  update() { super.update(); if (this.opened && this.fallY < 40) this.fallY += 2; }
  draw(g, ox, oy) {
    const x = Math.round(this.x - ox), y = Math.round(this.y - oy);
    if (this.opened) {
      if (this.fallY < 40) { g.globalAlpha = 1 - this.fallY / 40; g.fillStyle = '#8a949c'; g.fillRect(x + 2, y + this.fallY, 12, 12); g.globalAlpha = 1; }
      return;
    }
    g.fillStyle = '#5a646c'; g.fillRect(x + 1, y + 1, 14, 14);
    g.fillStyle = '#9aa4ac'; for (let i = 3; i < 14; i += 3) g.fillRect(x + 2, y + i, 12, 1);
    g.fillStyle = '#a66bf0'; g.fillRect(x + 2, y + 2, 2, 2); g.fillRect(x + 12, y + 2, 2, 2); g.fillRect(x + 2, y + 12, 2, 2); g.fillRect(x + 12, y + 12, 2, 2);
    if (this.level.showHints) drawNeedBadge(g, 'benny', x + 12, y - 2, this.t);
  }
}

// ---- Moving platform / elevator -------------------------------------------------------
class Platform extends Ent {
  constructor(room, tx, ty, p) {
    super(room, tx, ty, p, p.w || 2, 1);
    this.h = 6; this.y = (ty + 1) * T - 6 + (p.dy || 0);
    this.oneway = p.oneway !== false; this.solid = true;
    this.start = { x: this.x, y: this.y };
    this.path = (p.path || [[0, 0], [0, -4]]).map(([a, b]) => ({ x: this.start.x + a * T, y: this.start.y + b * T }));
    this.seg = 0; this.dir = 1; this.wait = p.wait || 70; this.speed = p.speed || 0.8; this.mode = p.mode || 'cycle';
    this.kind = p.kind || 'elevator'; this.dyFrame = 0; this.dxFrame = 0; this.moving = false; this.atEnd = false;
    this.cableTop = p.cableTop !== undefined ? p.cableTop * T : null;
  }
  active() { return !this.link || this.level.check(this.link); }
  update() {
    super.update();
    let target = null;
    const act = this.active();
    if (this.mode === 'cycle') {
      if (!act) { this.dyFrame = 0; this.dxFrame = 0; this.moving = false; return; }
      if (this.wait > 0) { this.wait--; this.dyFrame = 0; this.dxFrame = 0; this.moving = false; return; }
      target = this.path[this.seg + this.dir] || null;
      if (!target) { this.dir = -this.dir; target = this.path[this.seg + this.dir]; }
    } else {
      // toggle / once: go to last point when active, back to first when not (once: stays)
      const goal = act || (this.mode === 'once' && this.atEnd) ? this.path.length - 1 : 0;
      if (this.seg === goal && this.x === this.path[goal].x && this.y === this.path[goal].y) { this.dyFrame = 0; this.dxFrame = 0; this.moving = false; if (goal === this.path.length - 1) this.atEnd = true; return; }
      const step = goal > this.seg ? 1 : goal < this.seg ? -1 : 0;
      target = step ? this.path[this.seg + step] : this.path[this.seg];
      this.dir = step || 1;
    }
    const dx = clamp(target.x - this.x, -this.speed, this.speed), dy = clamp(target.y - this.y, -this.speed, this.speed);
    this.moving = !!(dx || dy);
    if (this.moving && this.t % 40 === 0 && this.level.near(this, 200)) AudioSys.sfx('hum');
    // carry riders
    const riders = this.level.friends.filter(f => f.present && f.groundEnt === this);
    const crates = this.room.ents.filter(e => e.crate && e.groundEnt === this);
    if (dy < 0) {
      for (const r of riders.concat(crates)) {
        const before = r.y; this.room.moveY(r, dy, { ignore: s => s === this });
        if (r.y > before + dy + 0.01) { /* blocked by ceiling: stop */ }
      }
    }
    this.x += dx; this.y += dy;
    this.dyFrame = dy; this.dxFrame = dx;
    if (dy > 0) for (const r of riders.concat(crates)) { r.y += dy; }
    if (dx) for (const r of riders.concat(crates)) this.room.moveX(r, dx);
    if (Math.abs(this.x - target.x) < 0.01 && Math.abs(this.y - target.y) < 0.01) {
      this.x = target.x; this.y = target.y;
      this.seg = this.path.indexOf(target);
      if (this.mode === 'cycle') { this.wait = this.p.wait || 70; if (this.seg === this.path.length - 1 || this.seg === 0) this.dir = this.seg === 0 ? 1 : -1; AudioSys.sfx('ding'); }
    }
  }
  draw(g, ox, oy) {
    const x = Math.round(this.x - ox), y = Math.round(this.y - oy), w = this.w;
    const R = (a, b, ww, hh, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, ww, hh); };
    if (this.kind === 'elevator' || this.kind === 'lift') {
      const top = this.cableTop !== null ? Math.round(this.cableTop - oy) : y - 300;
      g.fillStyle = '#2a2a2e'; g.fillRect(x + 3, top, 1, y - top); g.fillRect(x + w - 4, top, 1, y - top);
      R(0, 0, w, 6, '#7a828a'); R(0, 0, w, 2, '#b8c0c8'); R(1, 6, w - 2, 2, '#4a4e56');
      R(2, 2, 3, 2, this.active() ? '#7cf29a' : '#ff4a3a');
    } else if (this.kind === 'plank') {
      R(0, 0, w, 5, '#8a5a34'); R(0, 0, w, 1, '#b07a4a');
    } else if (this.kind === 'cloud') {
      R(0, 0, w, 6, '#f4f8fc'); R(2, -2, w - 4, 2, '#ffffff');
    } else {
      R(0, 0, w, 6, '#6a7078'); R(0, 0, w, 1, '#a8b0b8');
    }
  }
}

// ---- Blocks that appear / vanish (bridges, ladders, walls) -----------------------------
class Blocks extends Ent {
  constructor(room, tx, ty, p) {
    super(room, tx, ty, p, p.w || 1, p.h || 1);
    this.kind = p.kind || 'bridge';
    this.mode = p.mode || 'appear';
    this.code = this.kind === 'ladder' ? TL.LADDER : (this.kind === 'plank' || this.kind === 'scaffold' ? TL.ONEWAY : TL.SOLID);
    this.tx0 = tx; this.ty0 = ty - (this.h / T) + 1; this.tw = this.w / T; this.th = this.h / T;
    this.on = null; this.anim = 0;
    this.apply(this.isOn(), true);
  }
  isOn() { const c = this.level.check(this.link); return this.mode === 'appear' ? c : !c; }
  apply(on, init) {
    if (on === this.on) return;
    this.on = on;
    for (let y = 0; y < this.th; y++) for (let x = 0; x < this.tw; x++) this.room.setCode(this.tx0 + x, this.ty0 + y, on ? this.code : TL.EMPTY);
    if (!init) {
      this.anim = 1;
      AudioSys.sfx(on ? 'thud' : 'crash'); Particles.dust(this.cx, this.cy, 10); this.level.shake(2);
      if (on && this.code !== TL.LADDER) {
        // lift anyone caught inside
        for (const f of this.level.friends) if (f.present && overlap(f, this)) { f.y = this.y - f.h; f.vy = 0; }
      }
      if (on) this.setFlag(true);
    }
  }
  update() { super.update(); this.apply(this.isOn()); if (this.anim > 0) this.anim = Math.max(0, this.anim - 0.05); }
  draw(g, ox, oy) {
    if (!this.on) return;
    const th = this.room.theme;
    for (let y = 0; y < this.th; y++) for (let x = 0; x < this.tw; x++) {
      const px = Math.round((this.tx0 + x) * T - ox), py = Math.round((this.ty0 + y) * T - oy - this.anim * 6);
      if (this.kind === 'ladder') drawLadderTile(g, px, py, y === 0);
      else if (this.kind === 'plank' || this.kind === 'scaffold') { g.fillStyle = '#8a5a34'; g.fillRect(px, py, T, 4); g.fillStyle = '#b07a4a'; g.fillRect(px, py, T, 1); if (this.kind === 'scaffold') { g.fillStyle = '#6a7078'; g.fillRect(px + 2, py + 4, 1, 12); g.fillRect(px + 13, py + 4, 1, 12); } }
      else if (this.kind === 'boxes') drawCrateArt(g, 'box', px, py, T, T, 0);
      else if (this.kind === 'bridge') { g.fillStyle = '#8a5a34'; g.fillRect(px, py, T, 6); g.fillStyle = '#b07a4a'; g.fillRect(px, py, T, 1); g.fillStyle = '#5a3a22'; g.fillRect(px + 7, py, 1, 6); g.fillRect(px, py + 6, T, 1); }
      else if (this.kind === 'snow') { g.fillStyle = '#e8f0f8'; g.fillRect(px, py, T, T); g.fillStyle = '#ffffff'; g.fillRect(px, py, T, 2); }
      else drawSolidTile(g, th, px, py, y === 0, x === 0, x === this.tw - 1, y === this.th - 1, this.tx0 + x, this.ty0 + y, TL.SOLID);
    }
  }
}

// ---- Collectibles ---------------------------------------------------------------------
class Cup extends Ent {
  constructor(room, tx, ty, p) { super(room, tx, ty, p, 1, 1); this.key = 'c' + tx + ',' + ty; this.got = false; }
  update() {
    super.update();
    if (this.got) return;
    const box = { x: this.x + 3, y: this.y + 2, w: 10, h: 12 };
    for (const f of this.level.friends) if (f.present && !f.gone && f.mishapT <= 0 && overlap(box, f)) { this.collect(f); break; }
  }
  collect(f) {
    this.got = true; this.level.gotCup(this, f);
    AudioSys.sfx('cup'); Particles.sparkle(this.cx, this.cy, 5);
  }
  draw(g, ox, oy) {
    if (this.got) return;
    const x = Math.round(this.x - ox), y = Math.round(this.y - oy + Math.sin(this.t / 15) * 1.5);
    drawCupIcon(g, x + 4, y + 4, this.t);
  }
}
function drawCupIcon(g, x, y, t) {
  const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); };
  R(0, 3, 7, 7, OUTLINE); R(7, 4, 3, 5, OUTLINE);
  R(1, 4, 5, 5, '#f4efe6'); R(1, 4, 5, 1, '#6a3a22'); R(7, 5, 2, 3, '#f4efe6'); R(8, 6, 1, 1, OUTLINE);
  R(1, 7, 5, 1, '#e8504a');
  if (t !== undefined) { const s = (t >> 4) % 2; g.fillStyle = 'rgba(255,255,255,0.7)'; g.fillRect(x + 2 + s, y + 1, 1, 2); g.fillRect(x + 4 - s, y, 1, 2); }
}
class Mug extends Ent {
  constructor(room, tx, ty, p) { super(room, tx, ty, p, 1, 1); this.got = false; }
  update() {
    super.update();
    if (this.got) return;
    const box = { x: this.x + 2, y: this.y + 1, w: 12, h: 14 };
    for (const f of this.level.friends) if (f.present && !f.gone && f.mishapT <= 0 && overlap(box, f)) { this.got = true; this.level.gotMug(this, f); break; }
    if (this.t % 12 === 0) Particles.twinkle(this.cx + rnd(-8, 8), this.cy + rnd(-8, 8));
  }
  draw(g, ox, oy) {
    if (this.got) return;
    const x = Math.round(this.x - ox), y = Math.round(this.y - oy + Math.sin(this.t / 12) * 2);
    drawMugIcon(g, x + 2, y + 1, this.t);
  }
}
function drawMugIcon(g, x, y, t, dull) {
  const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); };
  const gold = dull ? '#5a5060' : '#f5c542', light = dull ? '#6a6070' : '#fff1a8', dark = dull ? '#3a3040' : '#b8860b';
  R(0, 1, 10, 13, OUTLINE); R(10, 3, 4, 8, OUTLINE);
  R(1, 2, 8, 11, gold); R(1, 2, 8, 1, light); R(2, 3, 1, 8, light); R(10, 4, 3, 1, gold); R(12, 4, 1, 6, gold); R(10, 9, 3, 1, gold);
  R(1, 12, 8, 1, dark); R(4, 5, 3, 3, dark);
  if (!dull && t !== undefined && (t >> 3) % 6 === 0) { R(7, 0, 1, 3, '#fff'); R(6, 1, 3, 1, '#fff'); }
}

class Checkpoint extends Ent {
  constructor(room, tx, ty, p) { super(room, tx, ty, p, 1, 1); this.lit = false; }
  update() {
    super.update();
    for (const f of this.level.friends) {
      if (!f.present || f.gone || f.mishapT > 0 || !f.onGround) continue;
      if (Math.abs(f.cx - this.cx) < 8 && Math.abs((f.y + f.h) - (this.y + this.h)) < 4) {
        if (f.checkpoint.ent !== this) {
          f.checkpoint = { x: this.cx - f.w / 2, y: this.y + this.h - f.h, ent: this };
          if (!this.lit) { this.lit = true; AudioSys.sfx('checkpoint'); this.level.toastAt(this.cx, this.y - 6, 'HIT YOUR MARK!', '#ffd23f'); }
        }
      }
    }
  }
  draw(g, ox, oy) {
    const x = Math.round(this.x - ox), y = Math.round(this.y + this.h - oy);
    const c = this.lit ? '#ffd23f' : '#f4efe6';
    g.fillStyle = c;
    for (let i = 0; i < 9; i++) { g.fillRect(x + 3 + i, y - 2 - Math.floor(i / 3) % 1, 1, 2); }
    g.fillRect(x + 3, y - 2, 10, 1); g.fillRect(x + 7, y - 4, 2, 4);
    g.fillRect(x + 4, y - 3, 1, 2); g.fillRect(x + 11, y - 3, 1, 2);
  }
}

class Exit extends Ent {
  constructor(room, tx, ty, p) {
    super(room, tx, ty, p, 2, 2);
    this.w = 24; this.x = tx * T - 4; this.h = 32; this.y = (ty + 1) * T - 32;
    this.goal = !!p.goal; this.label = p.label || (p.goal ? 'FINISH' : 'NEXT SCENE');
    this.kind = p.kind || 'door';
  }
  isOpen() { return !this.link || this.level.check(this.link); }
  interactInfo() { return { ok: true, label: this.isOpen() ? (this.goal ? 'Finish!' : 'Next scene') : 'Locked', prio: 6, exit: true }; }
  use(f) {
    if (!this.isOpen()) { AudioSys.sfx('deny'); this.level.toastAt(this.cx, this.y - 6, this.p.lockedMsg || 'LOCKED', '#ff8a7a'); return; }
    this.level.exitRoom(this, f);
  }
  draw(g, ox, oy) {
    const x = Math.round(this.x - ox), y = Math.round(this.y - oy);
    const open = this.isOpen();
    const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); };
    R(-2, -2, this.w + 4, this.h + 2, '#2a1a14');
    R(0, 0, this.w, this.h, open ? '#2a1e30' : '#5a3a2a');
    if (!open) { R(2, 2, this.w - 4, this.h - 2, '#7a4a30'); R(4, 4, this.w - 8, 10, '#8a5a3a'); R(4, 17, this.w - 8, 12, '#8a5a3a'); R(this.w - 6, 16, 2, 3, '#e0c060'); }
    else { R(2, 2, this.w - 4, this.h - 2, '#3a2a40'); R(this.w - 5, 2, 3, this.h - 2, '#7a4a30'); g.fillStyle = 'rgba(255,220,150,0.25)'; g.fillRect(x + 2, y + 2, this.w - 7, this.h - 2); }
    // exit sign
    const blink = open && (this.t >> 4) % 4 !== 0;
    R(2, -9, this.w - 4, 7, '#1b1020'); R(3, -8, this.w - 6, 5, open ? (blink ? '#e8504a' : '#a8302a') : '#4a2a2a');
    drawText(this.goal ? '★' : 'EXIT', x + this.w / 2, y - 9, open ? '#ffffff' : '#8a6a6a', { align: 'center' });
  }
}

// ---- Runner (Sarge the iguana, Theo's robot...) -------------------------------------
class Runner extends Ent {
  constructor(room, tx, ty, p) {
    super(room, tx, ty, p, 1, 1);
    this.kind = p.kind || 'sarge';
    this.path = (p.path || [[tx, ty]]).map(([a, b]) => ({ x: a * T + 8, y: (b + 1) * T }));
    this.i = 0; this.px = this.path[0].x; this.py = this.path[0].y; this.moving = false; this.face = p.face || -1;
    this.trigger = (p.near === undefined ? 4 : p.near) * T; this.caught = false; this.hop = 0;
  }
  update() {
    super.update();
    if (this.caught) return;
    const last = this.path.length - 1;
    if (!this.moving && this.i < last) {
      const near = this.lured || (this.trigger > 0 && this.level.friends.some(f => f.present && !f.gone && Math.abs(f.cx - this.px) < this.trigger && Math.abs(f.y + f.h - this.py) < 4 * T));
      if (near && (!this.p.gate || this.level.check(this.p.gate))) {
        this.lured = false;
        this.moving = true;
        AudioSys.sfx(this.kind === 'robot' ? 'robot' : 'squeak');
        if (this.p.taunts && Math.random() < 0.7) this.level.say(this.kind === 'robot' ? 'robot' : 'sarge', pick(this.p.taunts), this);
      }
    }
    if (this.moving) {
      const tgt = this.path[this.i + 1];
      const dx = tgt.x - this.px, dy = tgt.y - this.py;
      const d = Math.hypot(dx, dy);
      const sp = this.p.speed || 2.2;
      this.face = dx < 0 ? -1 : dx > 0 ? 1 : this.face;
      if (d <= sp) { this.px = tgt.x; this.py = tgt.y; this.i++; this.moving = false; if (this.i === last && this.p.vanish) this.gone = true; }
      else { this.px += dx / d * sp; this.py += dy / d * sp; }
      this.hop = Math.abs(Math.sin(this.t / 3)) * 3;
      if (this.t % 6 === 0) Particles.dust(this.px, this.py, 1);
    } else this.hop = 0;
    this.x = this.px - 8; this.y = this.py - 12; this.w = 16; this.h = 12;
    // catch at the end (optionally gated)
    if (this.p.catchable && this.i === last && !this.moving && !this.gone && (!this.p.catchLink || this.level.check(this.p.catchLink))) {
      for (const f of this.level.friends) if (f.present && !f.gone && f.mishapT <= 0 && overlap(f, { x: this.x - 4, y: this.y - 6, w: this.w + 8, h: this.h + 6 })) {
        this.caught = true; this.setFlag(true); this.level.onCaught(this, f); break;
      }
    }
  }
  onSound() {
    if (this.p.lovesMusic && !this.caught) {
      this.lured = true; this.setFlag && this.p.lureFlag && this.level.setFlag(this.p.lureFlag, true);
      Particles.hearts(this.px, this.py - 14, 4);
      if (this.p.lureSay) this.level.queueLines(this.p.lureSay, 0);
    }
  }
  draw(g, ox, oy) {
    if (this.gone || this.caught && this.p.hideWhenCaught) return;
    const x = this.px - ox, y = this.py - oy - this.hop;
    if (this.kind === 'robot') drawRobot(g, x, y, this.face < 0, this.t, { arm: true });
    else if (this.kind === 'rabbit') drawRabbit(g, x, y, this.face < 0, this.t);
    else if (this.kind === 'dove') drawDove(g, x, y - 6, this.t);
    else drawIguana(g, x, y, this.face < 0, this.t, { moving: this.moving, pilot: this.p.pilot });
  }
}

// ---- Hazards ----------------------------------------------------------------------------
class Hazard extends Ent {
  constructor(room, tx, ty, p) { super(room, tx, ty, p, p.w || 1, p.h || 1); this.kind = p.kind || room.theme.hazard; }
  active() { return !this.link || !this.level.check(this.link); }
  update() {
    super.update();
    if (!this.active()) return;
    const box = { x: this.x + 2, y: this.y + this.h - 8, w: this.w - 4, h: 8 };
    if (this.kind === 'steam' || this.kind === 'tesla' || this.kind === 'sprinkler') { box.y = this.y; box.h = this.h; }
    if (this.kind === 'steam' && !this.p.always && (this.t % 120) > 70) return;
    for (const f of this.level.friends) if (f.present && !f.gone && f.mishapT <= 0 && overlap(box, f)) f.mishap(hazardReaction(this.kind));
  }
  draw(g, ox, oy) {
    const x = Math.round(this.x - ox), y = Math.round(this.y - oy);
    const on = this.active();
    for (let i = 0; i < this.w / T; i++) for (let j = 0; j < this.h / T; j++) {
      if (this.kind === 'steam') {
        if (!on) continue;
        if (this.p.always || (this.t % 120) <= 70) { for (let k = 0; k < 4; k++) { g.fillStyle = 'rgba(255,255,255,' + (0.55 - k * 0.1) + ')'; g.fillRect(x + i * T + 3 + Math.round(Math.sin((this.t + k * 9 + i * 5) / 6) * 2), y + j * T + T - 4 - k * 4 - (this.t % 8), 10, 4); } }
        continue;
      }
      const th = Object.assign({}, this.room.theme, { hazard: this.kind });
      if (!on) {
        if (this.kind === 'tesla') { g.fillStyle = '#5a6070'; g.fillRect(x + i * T + 5, y + j * T + 6, 6, 10); g.fillStyle = '#c0c8d0'; g.fillRect(x + i * T + 4, y + j * T + 4, 8, 3); }
        else if (this.kind === 'coals') { g.fillStyle = '#3a2a2a'; g.fillRect(x + i * T, y + j * T + 13, T, 3); }
        else if (this.kind === 'mousetrap') { g.fillStyle = '#c89a5a'; g.fillRect(x + i * T + 2, y + j * T + 13, 12, 3); }
        else { g.fillStyle = 'rgba(120,170,220,0.45)'; g.fillRect(x + i * T, y + j * T + 14, T, 2); }
        continue;
      }
      drawHazardTile(g, th, x + i * T, y + j * T, this.t, this.tx + i);
    }
  }
}
function hazardReaction(kind) {
  return ({ mousetrap: 'ow', puddle: 'zap', tesla: 'zap', coals: 'ow', slush: 'splash', suds: 'splash', steam: 'ow', water: 'splash' })[kind] || 'ow';
}

// ---- Spring (trampoline / mattress) ------------------------------------------------------
class Spring extends Ent {
  constructor(room, tx, ty, p) { super(room, tx, ty, p, p.w || 1, 1); this.h = 8; this.y = (ty + 1) * T - 8; this.solid = true; this.oneway = true; this.bounce = true; this.power = p.power || 8.2; this.squish = 0; this.kind = p.kind || 'trampoline'; }
  update() { super.update(); if (this.squish > 0) this.squish--; }
  draw(g, ox, oy) {
    const x = Math.round(this.x - ox), y = Math.round(this.y - oy) + (this.squish > 0 ? 2 : 0);
    if (this.kind === 'mattress') { g.fillStyle = '#e8e0f0'; g.fillRect(x, y, this.w, 8 - (this.squish > 0 ? 2 : 0)); g.fillStyle = '#9ab0e0'; for (let i = 2; i < this.w; i += 5) g.fillRect(x + i, y + 2, 2, 2); }
    else { g.fillStyle = '#2a2a2e'; g.fillRect(x + 1, y + 2, 2, 6); g.fillRect(x + this.w - 3, y + 2, 2, 6); g.fillStyle = '#4cc9f0'; g.fillRect(x, y, this.w, 3); g.fillStyle = '#e8504a'; g.fillRect(x, y, 3, 3); g.fillRect(x + this.w - 3, y, 3, 3); }
  }
}

// ---- Lights for dark rooms -------------------------------------------------------------
class Light extends Ent {
  constructor(room, tx, ty, p) { super(room, tx, ty, p, 1, 1); this.r = (p.r || 5) * T; this.kind = p.kind || 'lamp'; }
  on() { return !this.link || this.level.check(this.link); }
  draw(g, ox, oy) {
    const x = Math.round(this.x - ox), y = Math.round(this.y - oy), on = this.on();
    if (this.kind === 'hang') { g.fillStyle = '#2a2a2a'; g.fillRect(x + 7, y - 6, 1, 8); g.fillStyle = '#3a3a3a'; g.fillRect(x + 3, y + 2, 10, 4); g.fillStyle = on ? '#ffe89a' : '#4a4a40'; g.fillRect(x + 4, y + 6, 8, 2); }
    else if (this.kind === 'clapper') { g.fillStyle = '#c8a040'; g.fillRect(x + 6, y + 6, 4, 10); g.fillStyle = on ? '#ffe89a' : '#5a5a4a'; g.fillRect(x + 3, y, 10, 7); }
    else { g.fillStyle = '#c8a040'; g.fillRect(x + 6, y + 6, 4, 6); g.fillStyle = on ? '#ffe89a' : '#5a5a4a'; g.fillRect(x + 5, y + 2, 6, 5); }
  }
}

// ---- Sound sensors (Juno) ----------------------------------------------------------------
class Sensor extends Ent {
  constructor(room, tx, ty, p) { super(room, tx, ty, p, p.w || 1, p.h || 1); this.kind = p.kind || 'speaker'; this.heard = false; this.sound = true; }
  onSound() {
    if (this.heard && !this.p.repeat) return;
    this.heard = true; this.setFlag(true);
    AudioSys.sfx('fixed'); Particles.notes(this.cx, this.y, 5);
    if (this.p.say) this.level.say(this.p.sayWho || 'juno', this.p.say);
  }
  interactInfo(f) { return this.heard ? null : (f.who === 'juno' ? { ok: true, label: 'Play', prio: 3, play: true } : { ok: false, need: 'juno', label: 'Sound-activated', prio: 1 }); }
  update() { super.update(); if (this.p.link && this.level.check(this.p.link) && !this.heard) { /* externally triggered */ } }
  draw(g, ox, oy) {
    const x = Math.round(this.x - ox), y = Math.round(this.y - oy);
    const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); };
    switch (this.kind) {
      case 'dog':
        drawRoboDog(g, x + 8, y + this.h, true, this.t, this.heard); break;
      case 'clapper':
        R(4, 6, 8, 10, '#3a3a40'); R(5, 7, 6, 3, this.heard ? '#7cf29a' : '#4cc9f0'); R(6, 0, 4, 6, this.heard ? '#ffe89a' : '#6a6a5a'); break;
      case 'karaoke':
        R(0, 4, this.w, this.h - 4, '#3a2a5a'); R(2, 6, this.w - 4, 8, this.heard ? '#ff4f9a' : '#1a1a2a'); drawText('♪', x + this.w / 2, y + 6, this.heard ? '#fff' : '#4cc9f0', { align: 'center' }); break;
      case 'mic':
        R(7, 4, 2, 12, '#888'); R(5, 0, 6, 5, '#333'); R(4, 14, 8, 2, '#555'); break;
      default:
        R(1, 2, 14, 14, '#2a2a2e'); circleFill(x + 8, y + 10, 4, '#4a4a52', g); circleFill(x + 8, y + 10, 2, '#6a6a72', g); R(3, 3, 10, 2, this.heard ? '#7cf29a' : '#4cc9f0');
    }
    if (!this.heard && this.level.showHints) drawNeedBadge(g, 'juno', x + this.w - 4, y - 2, this.t);
  }
}

// ---- Friendly talkers, signs, triggers, decor -----------------------------------------------
class Talker extends Ent {
  constructor(room, tx, ty, p) {
    super(room, tx, ty, p, 1, 2);
    this.look = p.look || 'gus'; this.face = p.face || -1; this.w = 14; this.x = tx * T + 1; this.h = 28; this.y = (ty + 1) * T - 28;
    this.i = 0; this.anim = p.anim || 'idle'; this.expr = p.expr || 'neutral';
  }
  interactInfo() { return { ok: true, label: 'Chat', prio: 2 }; }
  use(f) {
    const lines = this.p.lines || ['...'];
    const l = lines[this.i % lines.length]; this.i++;
    this.level.say(this.p.voice || this.look, l, this);
    this.face = f.cx < this.cx ? -1 : 1;
  }
  draw(g, ox, oy) {
    if (this.p.iguana) { drawIguana(g, this.cx - ox, this.y + this.h - oy, this.face < 0, this.t, {}); return; }
    blitPerson(g, 'npc:' + this.look + (this.p.seed !== undefined ? '~' + this.p.seed : ''), npcSpecFn(this.look, this.p.seed), { anim: this.anim, t: this.t, expr: this.expr, blink: (this.t % 170) < 6, talk: this.level.isTalking(this) }, Math.round(this.cx - ox), Math.round(this.y + this.h - oy), { flip: this.face < 0 });
  }
}
class Sign extends Ent {
  constructor(room, tx, ty, p) { super(room, tx, ty, p, 1, 1); }
  interactInfo() { return { ok: true, label: 'Read', prio: 1 }; }
  use() { this.level.toastAt(this.cx, this.y - 6, this.p.text || '...', '#ffffff', 180); }
  draw(g, ox, oy) {
    const x = Math.round(this.x - ox), y = Math.round(this.y - oy);
    g.fillStyle = '#5a3a22'; g.fillRect(x + 7, y + 6, 2, 10);
    g.fillStyle = '#e8dcc0'; g.fillRect(x + 1, y, 14, 8); g.fillStyle = '#5a3a22'; g.fillRect(x + 3, y + 2, 10, 1); g.fillRect(x + 3, y + 4, 7, 1);
  }
}
class Trigger extends Ent {
  constructor(room, tx, ty, p) { super(room, tx, ty, p, p.w || 1, p.h || 3); this.fired = false; }
  update() {
    super.update();
    if (this.fired) return;
    if (this.p.cond && !this.level.check(this.p.cond)) return;
    const f = this.level.active();
    const who = this.p.any ? this.level.friends.filter(q => q.present) : (f ? [f] : []);
    for (const q of who) {
      if (overlap(this, q)) { this.fired = true; this.level.runTrigger(this, q); break; }
    }
  }
}
class Deco extends Ent {
  constructor(room, tx, ty, p) { super(room, tx, ty, p, p.w || 1, p.h || 1); this.kind = p.kind || 'tv'; this.back = !!p.back; }
  draw(g, ox, oy) {
    const x = Math.round(this.x - ox), y = Math.round(this.y - oy), t = this.t;
    const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); };
    switch (this.kind) {
      case 'tv': R(0, 2, this.w, this.h - 2, '#2a2a2e'); R(2, 4, this.w - 4, this.h - 7, ['#4a8ac8', '#c84a8a', '#8ac84a'][(t >> 6) % 3]); break;
      case 'iguana': drawIguana(g, x + this.w / 2, y + this.h, this.p.flip, t, { tongue: (t % 120) < 8 }); break;
      case 'pigeons': for (let i = 0; i < (this.p.n || 3); i++) drawPigeon(g, x + 4 + i * 9, y + this.h, i % 2 === 0, t + i * 13, false); break;
      case 'balloons': for (let i = 0; i < 3; i++) { const c = ['#ff4f9a', '#4cc9f0', '#ffd23f'][i]; circleFill(x + 4 + i * 5, y + 4 + Math.sin(t / 20 + i) * 1.5, 3, c, g); R(4 + i * 5, 7, 1, this.h - 7, '#ddd'); } break;
      case 'fire': for (let i = 0; i < this.w; i += 4) R(i, this.h - 6 - ((t + i * 3) >> 2) % 4, 3, 6, (i + (t >> 3)) % 2 ? '#ff6a2a' : '#ffd23f'); break;
      case 'disco': circleFill(x + 8, y + 8, 6, '#c8ccd8', g); for (let i = 0; i < 6; i++) R(3 + ((i + (t >> 3)) % 6) * 2, 4 + (i % 3) * 3, 2, 2, '#ffffff'); break;
      case 'rabbit': drawRabbit(g, x + 8, y + this.h, this.p.flip, t); break;
      case 'robot': drawRobot(g, x + 8, y + this.h, this.p.flip, t, {}); break;
      case 'dove': drawDove(g, x + 8, y + 8 + Math.sin(t / 10) * 3, t); break;
      case 'snowman': circleFill(x + 8, y + this.h - 6, 6, '#f4f8fc', g); circleFill(x + 8, y + this.h - 16, 4, '#f4f8fc', g); R(7, this.h - 17, 1, 1, '#222'); R(9, this.h - 17, 1, 1, '#222'); R(9, this.h - 15, 3, 1, '#ff8a2a'); R(4, this.h - 22, 8, 2, '#2a2a2a'); break;
      case 'truck': {
        // a box moving truck (cab on the left); its roof is the shelf above it
        const hh = this.h;
        R(0, 8, 18, hh - 8, '#e8504a'); R(2, 11, 11, 8, '#9ad8f0'); R(0, hh - 6, 18, 6, '#3a3a40');
        R(16, 0, this.w - 16, hh - 4, '#f4efe6'); R(16, 0, this.w - 16, 2, '#d8d0c0'); R(16, hh - 6, this.w - 16, 3, '#c8c0b0');
        drawText('MOVE-IT', x + 16 + (this.w - 16) / 2, y + 7, '#e8504a', { g, align: 'center' });
        drawText('MOVERS', x + 16 + (this.w - 16) / 2, y + 17, '#3a3a40', { g, align: 'center' });
        circleFill(x + 10, y + hh - 3, 5, '#2a2a2e', g); circleFill(x + 10, y + hh - 3, 2, '#8a8a92', g);
        circleFill(x + this.w - 12, y + hh - 3, 5, '#2a2a2e', g); circleFill(x + this.w - 12, y + hh - 3, 2, '#8a8a92', g);
        break;
      }
      case 'greenhouse': {
        g.fillStyle = 'rgba(200,240,230,0.13)'; g.fillRect(x, y, this.w, this.h);
        g.fillStyle = 'rgba(230,255,250,0.35)';
        for (let i = 0; i <= this.w; i += 32) g.fillRect(x + i, y, 2, this.h);
        g.fillRect(x, y, this.w, 2);
        for (let i = 8; i < this.w; i += 64) g.fillRect(x + i, y + 6, 10, 2);
        for (let k = 0; k < 6; k++) { R(8 + k * 52, this.h - 10, 8, 10, '#3a8a3a'); R(6 + k * 52, this.h - 14, 12, 5, ['#ff7aa8', '#ffd23f', '#c88ad8'][k % 3]); }
        break;
      }
      case 'plane': R(0, 6, this.w, 6, '#f4f4f8'); R(this.w - 8, 0, 6, 8, '#3a6ac8'); R(this.w / 2 - 6, 10, 12, 4, '#d8d8e0'); for (let i = 6; i < this.w - 10; i += 5) R(i, 7, 2, 2, '#4a6a8a'); break;
      default: break;
    }
  }
}

// map type name -> class
const ENT_TYPES = {
  crate: Crate, door: Door, sounddoor: SoundDoor, shutter: Shutter, lever: Lever, broken: Broken, plate: Plate,
  npc: NPC, watcher: Watcher, grate: Grate, platform: Platform, blocks: Blocks, cup: Cup, mug: Mug,
  checkpoint: Checkpoint, exit: Exit, runner: Runner, hazard: Hazard, spring: Spring, light: Light,
  sensor: Sensor, talker: Talker, sign: Sign, trigger: Trigger, deco: Deco,
};

// ---------------------------------------------------------------------------
// Particles
// ---------------------------------------------------------------------------
const Particles = {
  list: [],
  add(p) { if (this.list.length < 400) this.list.push(p); },
  dust(x, y, n) { for (let i = 0; i < n; i++) this.add({ k: 'dust', x: x + rnd(-6, 6), y: y - rnd(0, 3), vx: rnd(-0.6, 0.6), vy: rnd(-0.8, -0.1), life: rndi(16, 28), max: 28, c: pick(['#d8ccb8', '#bfb3a0', '#e8dcc8']) }); },
  puff(x, y, n) { for (let i = 0; i < n; i++) { const a = rnd(0, TAU), s = rnd(0.3, 1.6); this.add({ k: 'smoke', x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 0.3, life: rndi(20, 40), max: 40, r: rnd(2, 5), c: pick(['#e8e4f0', '#c8c4d8', '#f4f0fa']) }); } },
  sparks(x, y, n) { for (let i = 0; i < n; i++) this.add({ k: 'spark', x, y, vx: rnd(-2, 2), vy: rnd(-2.5, 0), life: rndi(10, 22), max: 22, c: pick(['#ffe866', '#ffffff', '#ffb02e']) }); },
  sparkle(x, y, n) { for (let i = 0; i < n; i++) { const a = rnd(0, TAU), s = rnd(0.5, 2); this.add({ k: 'star', x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: rndi(16, 30), max: 30, c: pick(['#ffffff', '#ffe866', '#7cf2ff']) }); } },
  twinkle(x, y) { this.add({ k: 'star', x, y, vx: 0, vy: -0.2, life: 20, max: 20, c: '#fff6c0' }); },
  notes(x, y, n) { for (let i = 0; i < n; i++) this.add({ k: 'note', x: x + rnd(-6, 6), y, vx: rnd(-0.4, 0.4), vy: rnd(-0.9, -0.5), life: rndi(40, 60), max: 60, c: pick(['#4cc9f0', '#ff4f9a', '#ffd23f', '#7cf29a']) }); },
  confetti(x, y, n) { for (let i = 0; i < n; i++) this.add({ k: 'conf', x: x + rnd(-W / 2, W / 2), y: y + rnd(-40, 0), vx: rnd(-0.5, 0.5), vy: rnd(0.4, 1.4), life: rndi(120, 220), max: 220, c: pick(['#ff4f9a', '#4cc9f0', '#ffd23f', '#7cf29a', '#ff8a3a', '#a66bf0']), r: rnd(0, TAU) }); },
  drops(x, y, n) { for (let i = 0; i < n; i++) this.add({ k: 'drop', x, y, vx: rnd(-1.5, 1.5), vy: rnd(-3, -1), life: rndi(20, 30), max: 30, c: '#7ab8e8' }); },
  hearts(x, y, n) { for (let i = 0; i < n; i++) this.add({ k: 'heart', x: x + rnd(-8, 8), y, vx: rnd(-0.3, 0.3), vy: rnd(-0.8, -0.4), life: rndi(40, 60), max: 60, c: '#ff4f7a' }); },
  update() {
    for (let i = this.list.length - 1; i >= 0; i--) {
      const p = this.list[i];
      p.x += p.vx; p.y += p.vy;
      if (p.k === 'spark' || p.k === 'drop') p.vy += 0.15;
      if (p.k === 'dust' || p.k === 'smoke') { p.vx *= 0.94; p.vy *= 0.94; }
      if (p.k === 'conf') { p.r += 0.1; p.vx += Math.sin(p.life / 10) * 0.02; }
      if (--p.life <= 0) this.list.splice(i, 1);
    }
  },
  draw(g, ox, oy) {
    for (const p of this.list) {
      const x = Math.round(p.x - ox), y = Math.round(p.y - oy), a = p.life / p.max;
      g.globalAlpha = Math.min(1, a * 1.6);
      g.fillStyle = p.c;
      switch (p.k) {
        case 'smoke': { const r = Math.round(p.r * (1.6 - a)); g.fillRect(x - r, y - r, r * 2, r * 2); break; }
        case 'star': g.fillRect(x, y - 1, 1, 3); g.fillRect(x - 1, y, 3, 1); break;
        case 'note': drawText('♪', x, y, p.c, { g }); break;
        case 'heart': drawText('♥', x, y, p.c, { g }); break;
        case 'conf': g.fillRect(x, y, Math.abs(Math.cos(p.r)) * 3 + 1, 2); break;
        default: g.fillRect(x, y, p.k === 'dust' ? 2 : 1, p.k === 'dust' ? 2 : (p.k === 'spark' ? 2 : 1));
      }
    }
    g.globalAlpha = 1;
  },
};
