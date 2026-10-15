// ---------------------------------------------------------------------------
// Level scene: plays an episode's rooms
// ---------------------------------------------------------------------------
const [darkCanvas, darkCtx] = makeCanvas(W, H);

class LevelScene {
  constructor(epIndex, opts) {
    opts = opts || {};
    this.opts = opts;
    this.epIndex = epIndex;
    this.ep = EPISODES[epIndex];
    this.hub = !!opts.hub;
    this.cups = 0; this.mugGot = false; this.takes = 1; this.time = 0;
    this.collected = new Set();
    this.cupsTotal = 0;
    if (!this.hub) for (const r of this.ep.rooms) for (const row of r.map) for (const ch of row) if (ch === 'c') this.cupsTotal++;
    this.followMode = !!(Save.data.settings.follow);
    this.ctrl = [0, -1];
    this.bubbles = []; this.toasts = []; this.lineQueue = []; this.lineWait = 0;
    this.hintMsg = null; this.choice = null; this.claps = [];
    this.cam = { x: 0, y: 0, look: 0 };
    this.shakeAmt = 0; this.shakeX = 0; this.shakeY = 0;
    this.trans = null; this.completing = false; this.lockInput = false; this.goalT = 0;
    this.showHints = true;
    this.slugT = 0;
    this.t = 0;
    if (!this.hub && !opts.noMusic) Music.play(this.ep.music || 'funk');
    this.loadRoom(opts.room || 0, true);
  }

  // ---- room management ------------------------------------------------------------
  loadRoom(i, first) {
    this.roomIndex = i;
    const def = this.hub ? this.opts.hubDef : this.ep.rooms[i];
    this.flags = {};
    const prevFriends = this.friends;
    this.room = new Room(def, this);
    this.room.flags = this.flags;
    Particles.list.length = 0;
    this.bubbles = []; this.lineQueue = []; this.choice = null; this.claps = [];
    // friends
    const cast = def.cast || FRIENDS;
    this.friends = FRIENDS.map(who => new Friend(this, who, 0, 0));
    const sp = this.room.spawn;
    let k = 0;
    const order = def.spawnOrder || FRIENDS;
    for (const who of order) {
      const f = this.friends.find(q => q.who === who);
      f.present = cast.includes(who);
      if (!f.present) continue;
      let x = sp.x + (def.spawnDir === -1 ? -k : k) * (def.spawnGap || 18) + 2;
      x = clamp(x, 0, this.room.w - f.w);
      f.x = x; f.y = sp.y - f.h; f.face = def.spawnDir || 1;
      f.checkpoint = { x: f.x, y: f.y, ent: null };
      f.alpha = 0; f.fadeIn = 6 + k * 6;
      k++;
    }
    if (def.positions) for (const who in def.positions) { const f = this.friends.find(q => q.who === who); const [tx, ty] = def.positions[who]; f.x = tx * T + 8 - f.w / 2; f.y = (ty + 1) * T - f.h; f.checkpoint = { x: f.x, y: f.y, ent: null }; }
    // keep the controlled friend if present
    let p1 = prevFriends ? prevFriends[this.ctrl[0]].who : (def.start || cast[0]);
    if (!cast.includes(p1)) p1 = def.start || cast[0];
    if (def.start && first) p1 = def.start;
    this.ctrl[0] = FRIENDS.indexOf(p1);
    if (Input.twoPlayer) {
      let p2i = this.ctrl[1];
      if (p2i < 0 || !cast.includes(FRIENDS[p2i]) || p2i === this.ctrl[0]) p2i = this.nextFree(this.ctrl[0], 1, -1);
      this.ctrl[1] = p2i;
    } else this.ctrl[1] = -1;
    // entities
    for (const [type, p, tx, ty] of this.room.pendingEnts) {
      const C = ENT_TYPES[type];
      if (!C) continue;
      const e = new C(this.room, tx, ty, p);
      if (type === 'cup' && this.collected.has(i + ':' + e.key)) continue;
      if (type === 'mug' && this.mugGot) continue;
      this.room.ents.push(e);
    }
    const phase = e => (e instanceof Platform ? 0 : e.crate ? 1 : 2);
    this.room.ents.sort((a, b) => phase(a) - phase(b));
    renderRoomLayers(this.room);
    this.updateCamera(true);
    this.slugT = this.hub ? 0 : 1;
    if (def.intro && !this.hub) this.queueLines(def.intro, 50);
    if (def.music && !this.hub) Music.play(def.music);
    this.roomT = 0;
  }
  nextFree(from, dir, exclude) {
    for (let k = 1; k <= 6; k++) {
      const i = ((from + dir * k) % 6 + 6) % 6;
      if (i === exclude || i === from) continue;
      if (this.friends && this.friends[i] && this.friends[i].present) return i;
    }
    return from;
  }
  retake() {
    this.takes++;
    AudioSys.sfx('clack');
    this.loadRoom(this.roomIndex);
    this.toastScreen('TAKE ' + this.takes + '!', '#ffffff');
  }

  // ---- flags & helpers -------------------------------------------------------------
  setFlag(id, v) { if (!id) return; this.flags[id] = v; }
  check(expr) {
    if (!expr) return true;
    return String(expr).split('|').some(group => group.split('&').every(term => {
      term = term.trim();
      if (term[0] === '!') return !this.flags[term.slice(1)];
      return !!this.flags[term];
    }));
  }
  p1() { return this.friends[this.ctrl[0]]; }
  p2() { return this.ctrl[1] >= 0 ? this.friends[this.ctrl[1]] : null; }
  active() { return this.p1(); }
  near(ent, d) { const f = this.p1(); return f && Math.abs(f.cx - ent.cx) < d && Math.abs(f.y - ent.y) < d; }
  shake(n) { if (Save.data.settings.shake) this.shakeAmt = Math.max(this.shakeAmt, n); }
  crateLanded() { }
  hint(need, text, dur) {
    if (this.hintMsg && this.hintMsg.text === text && this.hintMsg.t > 0) { this.hintMsg.t = Math.max(this.hintMsg.t, dur || 150); return; }
    this.hintMsg = { need, text, t: dur || 150 };
  }
  toastAt(x, y, text, col, dur) { this.toasts.push({ x, y, text, col: col || '#fff', t: 0, dur: dur || 70, world: true }); }
  toastScreen(text, col) { this.toasts.push({ x: W / 2, y: 110, text, col: col || '#fff', t: 0, dur: 80, world: false, big: true }); }
  takeClap(f) { this.claps.push({ x: f.cx, y: f.y - 8, n: this.takes, t: 0 }); setTimeout(() => AudioSys.sfx('clack'), 60); }

  // ---- speech ---------------------------------------------------------------------
  say(who, text, anchor, opts) {
    if (!text) return;
    const f = this.friends && this.friends.find(q => q.who === who && q.present);
    anchor = anchor || f || null;
    if (!anchor) { anchor = this.p1(); }
    this.bubbles = this.bubbles.filter(b => b.anchor !== anchor);
    const b = { who, text: normText(text), anchor, t: 0, shown: 0, dur: 70 + text.length * 2.6, voice: VOICES[who] ? who : (anchor && anchor.p && anchor.p.voice) || 'npc' };
    if (anchor && anchor.look && VOICES[anchor.look]) b.voice = anchor.look;
    this.bubbles.push(b);
    if (this.bubbles.length > 3) this.bubbles.shift();
    return b;
  }
  isTalking(ent) { return this.bubbles.some(b => b.anchor === ent && b.shown < b.text.length); }
  queueLines(lines, delay) { for (const l of lines) this.lineQueue.push(l); this.lineWait = Math.max(this.lineWait, delay || 0); }
  updateLines() {
    if (this.lineWait > 0) { this.lineWait--; return; }
    if (!this.lineQueue.length) return;
    if (this.bubbles.some(b => b.fromQueue && b.t < b.text.length + 30)) return;
    const l = this.lineQueue.shift();
    if (l[0] === 'laugh') { AudioSys.audience(l[1] || 'chuckle', 0.7); this.lineWait = 10; return; }
    if (l[0] === 'flag') { this.setFlag(l[1], true); return; }
    let anchor = null;
    if (!FRIENDS.includes(l[0])) anchor = this.room.ents.find(e => (e.look === l[0] || e.p.voice === l[0] || (e.p && e.p.name === l[0]))) || null;
    const b = this.say(l[0], l[1], anchor);
    if (b) b.fromQueue = true;
    this.lineWait = 6;
  }
  runTrigger(tr, f) {
    const p = tr.p;
    if (p.flag) this.setFlag(p.flag, true);
    if (p.join) {
      for (const who of [].concat(p.join)) {
        const q = this.friends.find(x => x.who === who);
        if (!q || q.present) continue;
        q.present = true;
        const at = p.joinAt ? { x: p.joinAt[0] * T + 8, y: (p.joinAt[1] + 1) * T } : { x: tr.x + tr.w + 20, y: tr.y + tr.h };
        q.x = at.x - q.w / 2; q.y = at.y - q.h; q.face = -1; q.alpha = 0; q.fadeIn = 10;
        q.checkpoint = { x: q.x, y: q.y, ent: null };
        Particles.puff(q.cx, q.y + q.h / 2, 12);
        AudioSys.sfx(who === 'benny' ? 'magic' : 'pop');
        this.toastAt(q.cx, q.y - 10, FRIEND_INFO[who].name + ' JOINS!', FRIEND_INFO[who].color, 120);
      }
    }
    if (p.lines) this.queueLines(p.lines, 4);
    if (p.hint) this.hint(p.hintNeed || null, p.hint);
    if (p.hintKeys) this.hint(p.hintNeed || null, Input.lastDevice === 'touch' ? p.hintKeys.touch : p.hintKeys.keys, 330);
    if (p.laugh) AudioSys.audience(p.laugh, 0.7);
  }

  // ---- interactions ---------------------------------------------------------------
  bestInteractable(f) {
    const box = { x: f.x - 2, y: f.y, w: f.w + 4, h: f.h };
    let best = null, bs = -1e9;
    for (const e of this.room.ents) {
      if (!e.interactInfo) continue;
      const info = e.interactInfo(f);
      if (!info) continue;
      if (!overlap(box, e.useBox())) continue;
      const score = (info.ok ? 100 : 0) + (info.prio || 0) * 10 - Math.abs(e.cx - f.cx) * 0.05;
      if (score > bs) { bs = score; best = { ent: e, info }; }
    }
    return best;
  }
  exitHere(f) {
    for (const e of this.room.ents) if (e instanceof Exit && f.cx > e.x && f.cx < e.x + e.w && f.y + f.h > e.y + 8 && f.y < e.y + e.h) return e;
    return null;
  }
  soundPulse(f) {
    const R = 7 * T;
    this.pulses = this.pulses || [];
    this.pulses.push({ x: f.cx, y: f.y + 8, t: 0 });
    for (const e of this.room.ents) {
      if (!e.onSound) continue;
      const d = Math.hypot(e.cx - f.cx, e.cy - (f.y + f.h / 2));
      if (d <= R + Math.max(e.w, e.h) / 2) e.onSound(f);
    }
  }
  onFixed(ent, f) {
    if (!f) return;
    const r = Math.random();
    if (r < 0.3) {
      setTimeout(() => { Particles.sparks(ent.cx, ent.cy, 16); AudioSys.sfx('zap'); f.say(pick(['It almost works! ...Oh. It works.', 'Behold! It works! I\'m as shocked as you.', 'Fixed it! Don\'t touch it. Ever.'])); AudioSys.audience('chuckle', 0.6); }, 200);
    } else if (r < 0.6) f.say(pick(['Fixed! Now if only I could fix my toaster.', 'Theo: 1, Machines: 0.', 'Ta-da! Wait, that\'s Benny\'s line.', 'Good as new. Better, actually.']));
    if (ent.p.say) this.queueLines(ent.p.say, 30);
  }
  onCaught(r, f) {
    AudioSys.audience('cheer', 0.8);
    if (r.p.say) this.queueLines(r.p.say, 10);
    if (r.p.goal) { this.goalT = 90; }
  }
  gotCup(cup, f) {
    this.cups++;
    this.collected.add(this.roomIndex + ':' + cup.key);
  }
  gotMug(m, f) {
    this.mugGot = true;
    AudioSys.sfx('mug');
    AudioSys.audience('cheer', 0.7);
    Particles.sparkle(m.cx, m.cy, 24);
    this.toastScreen('GOLDEN MUG!', '#f5c542');
    const lines = { dex: 'A golden mug! I\'m not crying, you\'re crying.', mila: 'Golden mug! Scoreboard: Mila, gold medal.', theo: 'Pure gold! Well... gold-ish.', priya: 'I know a guy who\'d pay a fortune for this.', benny: 'Ta-da! A real trick! It\'s real!', juno: '♪ Golden, golden, gold! ♪' };
    f.say(lines[f.who]);
  }
  exitRoom(exit, f) {
    if (this.trans || this.completing) return;
    if (exit.goal) { this.complete(); return; }
    const next = this.roomIndex + 1;
    if (next >= this.ep.rooms.length) { this.complete(); return; }
    AudioSys.sfx('door');
    this.lockInput = true;
    this.trans = { t: 0, next, shot: this.ep.rooms[next].shot || null };
  }
  complete() {
    if (this.completing) return;
    this.completing = true; this.lockInput = true; this.completeT = 0;
    Music.stop(0.4);
    for (const f of this.friends) if (f.present) { f.celebT = 400; f.release(); f.state = 'normal'; }
    AudioSys.audience('applause', 0.9);
    setTimeout(() => AudioSys.audience('cheer', 0.6), 500);
    Particles.confetti(W / 2 + this.cam.x, this.cam.y, 80);
    Music.oneShot('fanfare', 0.8);
  }

  // ---- choice dialog (Priya) -------------------------------------------------------------
  openChoice(npc, f) {
    const talk = npc.p.talk || { q: 'What do you want?', opts: [{ t: 'I know a guy.', ok: true, r: 'Fine. Go.' }] };
    this.choice = { npc, f, sel: 0, phase: 'ask', t: 0, talk };
    f.state = 'talkpose'; f.face = npc.cx > f.cx ? 1 : -1;
    npc.face = f.cx < npc.cx ? -1 : 1;
    this.say(npc.npcVoice(), talk.q, npc);
    AudioSys.sfx('select');
  }
  updateChoice() {
    const c = this.choice; c.t++;
    const opts = c.talk.opts;
    if (c.phase === 'ask') {
      const m = Input.menu;
      if (m.up) { c.sel = (c.sel + opts.length - 1) % opts.length; AudioSys.sfx('move'); }
      if (m.down) { c.sel = (c.sel + 1) % opts.length; AudioSys.sfx('move'); }
      for (let i = 0; i < opts.length; i++) if (Input.keyPressed('Digit' + (i + 1))) { c.sel = i; this.pickChoice(); return; }
      const bx = 60, by = 176;
      for (let i = 0; i < opts.length; i++) if (Input.clickIn(bx, by + 14 + i * 14, W - 120, 13)) { c.sel = i; this.pickChoice(); return; }
      if (m.ok && c.t > 10) { this.pickChoice(); return; }
      if (m.back && c.t > 10) { this.closeChoice(); }
    } else if (c.phase === 'result') {
      if (--c.wait <= 0) {
        if (c.ok) { c.npc.solved(); this.closeChoice(); }
        else this.closeChoice();
      }
    }
  }
  pickChoice() {
    const c = this.choice;
    const o = c.talk.opts[c.sel];
    AudioSys.sfx('confirm');
    this.say(c.f.who, o.t, c.f);
    c.phase = 'result'; c.ok = !!o.ok; c.wait = 150 + (o.r || '').length * 2;
    setTimeout(() => {
      if (!this.choice || this.choice !== c) return;
      this.say(c.npc.npcVoice(), o.r || (o.ok ? 'Fine. Go ahead.' : 'Nope.'), c.npc);
      if (o.ok) { AudioSys.audience(o.laugh || 'chuckle', 0.7); c.npc.expr = 'happy'; c.f.celebT = 60; }
      else { AudioSys.audience(o.laugh || 'laugh', 0.8); c.npc.expr = 'angry'; }
    }, 900);
  }
  closeChoice() {
    const c = this.choice;
    if (c && c.f) c.f.state = 'normal';
    this.choice = null;
  }

  // ---- update ----------------------------------------------------------------------------
  update() {
    this.t++; this.time++;
    if (this.slugT > 0) this.slugT++;
    if (this.slugT > 240) this.slugT = 0;
    // transition
    if (this.trans) { this.updateTrans(); return; }
    if (this.choice) { this.updateChoice(); this.updateBubbles(); this.tickFx(); return; }

    const solo = !Input.twoPlayer;
    const pad1 = Input.pads[0], pad2 = Input.pads[1];
    // pause
    if (pad1.pressed.pause && !this.completing) { Game.openPause(this); return; }
    if (Input.clickIn(W - 22, 3, 19, 16)) { Game.openPause(this); return; }
    // switching
    if (!this.completing) {
      this.handleSwitch(0, pad1);
      if (!solo) this.handleSwitch(1, pad2);
      if (!this.hub && (pad1.pressed.follow || Input.clickIn(4 + 6 * 22 + 2, 4, 46, 14))) {
        this.followMode = !this.followMode; Save.data.settings.follow = this.followMode; Save.write();
        AudioSys.sfx('select');
        this.toastScreen(this.followMode ? 'GANG: FOLLOW ME!' : 'GANG: WAIT HERE', '#ffffff');
      }
    }
    if (Input.twoPlayer && this.ctrl[1] < 0) this.ctrl[1] = this.nextFree(this.ctrl[0], 1, -1);
    if (!Input.twoPlayer) this.ctrl[1] = -1;

    this.room.t++;
    this.roomT++;
    // update entities (platforms & crates first)
    const ents = this.room.ents;
    let i = 0;
    for (; i < ents.length && (ents[i] instanceof Platform || ents[i].crate); i++) ents[i].update();
    // friends
    const lead = this.p1();
    let fi = 0;
    for (let k = 0; k < this.friends.length; k++) {
      const f = this.friends[k];
      if (!f.present) continue;
      if (f.fadeIn !== undefined) { if (f.fadeIn > 0) { f.fadeIn--; f.alpha = 0; } else if (f.alpha < 1) f.alpha = Math.min(1, f.alpha + 0.15); }
      let pad;
      if (k === this.ctrl[0]) pad = this.completing ? emptyPad() : pad1;
      else if (k === this.ctrl[1]) pad = this.completing ? emptyPad() : pad2;
      else pad = (this.followMode && !this.completing) ? f.aiPad(lead, fi++) : emptyPad();
      f.ctrl = k === this.ctrl[0] ? 0 : k === this.ctrl[1] ? 1 : -1;
      f.update(pad);
    }
    for (; i < ents.length; i++) ents[i].update();
    Particles.update();
    this.updateLines();
    this.updateBubbles();
    this.tickFx();
    this.updateCamera(false);
    // goal by flag
    if (!this.completing && this.room.def.goal && this.check(this.room.def.goal)) { if (!this.goalT) this.goalT = 70; }
    if (this.goalT > 0 && !this.completing) { if (--this.goalT === 0) this.complete(); }
    if (this.completing) {
      this.completeT++;
      if (this.completeT % 30 === 0) Particles.confetti(W / 2 + this.cam.x, this.cam.y, 25);
      if (this.completeT > 200) { this.completing = 'done'; this.finish(); }
    }
    if (this.hub && this.opts.onUpdate) this.opts.onUpdate(this);
  }
  finish() {
    const res = { ep: this.epIndex, cups: this.cups, total: this.cupsTotal, mug: this.mugGot, takes: this.takes, time: this.time };
    if (this.opts.done) this.opts.done(res);
  }
  handleSwitch(p, pad) {
    const cur = this.ctrl[p];
    const other = this.ctrl[1 - p];
    let want = -1;
    if (pad.select >= 0) want = pad.select;
    if (pad.pressed.swap) want = this.nextFree(cur, 1, other);
    if (pad.pressed.swapPrev) want = this.nextFree(cur, -1, other);
    if (p === 0) for (let i = 0; i < 6; i++) if (Input.clickIn(4 + i * 22, 3, 21, 22)) want = i;
    if (want < 0 || want === cur) return;
    const f = this.friends[want];
    if (!f || !f.present) { AudioSys.sfx('deny'); return; }
    if (want === other) { AudioSys.sfx('deny'); return; }
    const old = this.friends[cur];
    if (old && old.state !== 'hold') { old.vx = 0; if (old.state === 'fix') { old.state = 'normal'; if (old.fixing) old.fixing.fixer = null; old.fixing = null; } }
    if (old) old.grabbing = null;
    this.ctrl[p] = want;
    AudioSys.sfx('swap');
    Particles.sparkle(f.cx, f.y + 4, 6);
    f.sx = 1.2; f.sy = 0.85;
    if (Math.random() < 0.25 && f.quipCool <= 0) { f.say(pick(SWAP_LINES[f.who])); f.quipCool = 200; }
  }
  tickFx() {
    if (this.shakeAmt > 0) { this.shakeX = rnd(-this.shakeAmt, this.shakeAmt); this.shakeY = rnd(-this.shakeAmt, this.shakeAmt); this.shakeAmt *= 0.85; if (this.shakeAmt < 0.3) { this.shakeAmt = 0; this.shakeX = this.shakeY = 0; } }
    for (const t of this.toasts) t.t++;
    this.toasts = this.toasts.filter(t => t.t < t.dur);
    for (const c of this.claps) c.t++;
    this.claps = this.claps.filter(c => c.t < 70);
    if (this.hintMsg && this.hintMsg.t > 0) this.hintMsg.t--;
    if (this.pulses) { for (const p of this.pulses) p.t++; this.pulses = this.pulses.filter(p => p.t < 40); }
  }
  updateBubbles() {
    for (const b of this.bubbles) {
      b.t++;
      if (b.shown < b.text.length) {
        b.shown = Math.min(b.text.length, b.shown + 1.2);
        if (Math.floor(b.shown) % 3 === 0 && b.text[Math.floor(b.shown)] !== ' ') AudioSys.blip(b.voice);
      }
    }
    this.bubbles = this.bubbles.filter(b => b.t < b.text.length + b.dur);
  }
  updateTrans() {
    const tr = this.trans;
    tr.t++;
    if (tr.t === 18) {
      if (tr.shot) Music.oneShot(pick(['bumper1', 'bumper2', 'bumper3', 'bumper4']), 0.9);
      this.loadRoom(tr.next);
    }
    const dur = tr.shot ? 120 : 36;
    if (tr.t >= dur) { this.trans = null; this.lockInput = false; }
  }
  updateCamera(snap) {
    const f = this.p1();
    if (!f) return;
    let tx = f.cx, ty = f.y + f.h / 2;
    const f2 = this.p2();
    if (f2 && f2.present) { tx = (tx + f2.cx) / 2; ty = (ty + f2.y + f2.h / 2) / 2; }
    this.cam.look = lerp(this.cam.look, (f.climbing ? 0 : f.face * 24), 0.05);
    let cx = tx + (f2 ? 0 : this.cam.look) - W / 2;
    let cy = ty - H / 2 - 12;
    const r = this.room;
    if (r.w <= W) cx = (r.w - W) / 2; else cx = clamp(cx, 0, r.w - W);
    if (r.h <= H) cy = (r.h - H); else cy = clamp(cy, 0, r.h - H);
    if (snap) { this.cam.x = cx; this.cam.y = cy; }
    else { this.cam.x += (cx - this.cam.x) * 0.12; this.cam.y += (cy - this.cam.y) * 0.1; }
    // 2P: keep both players on screen horizontally (the screen edge acts as a wall)
    if (f2 && f2.present && r.w > W && !snap) {
      for (const q of [f, f2]) {
        const lo = this.cam.x + 2, hi = this.cam.x + W - 2 - q.w;
        if (q.x < lo && !r.rectBlocked(lo, q.y, q.w, q.h, q)) q.x = lo;
        if (q.x > hi && !r.rectBlocked(hi, q.y, q.w, q.h, q)) q.x = hi;
      }
    }
  }

  // ---- drawing -------------------------------------------------------------------------
  draw() {
    const r = this.room, th = r.theme;
    const ox = Math.round(this.cam.x + this.shakeX), oy = Math.round(this.cam.y + this.shakeY);
    // background
    ctx.fillStyle = '#120c18'; ctx.fillRect(0, 0, W, H);
    if (th.ext || th.far || th.back !== 'wall' || r.decor.some(d => d.ch === 'w') || r.def.openings) drawFar(ctx, th, ox, oy, this.t, r.h);
    if (th.rainy && !this.hub) this.drawRainBehind(ox, oy);
    ctx.drawImage(r.backCanvas, -ox, -oy);
    if (this.opts.drawBack) this.opts.drawBack(ctx, ox, oy, this);
    for (const e of r.ents) if (e.back) e.draw(ctx, ox, oy);
    ctx.drawImage(r.frontCanvas, -ox, -oy);
    // animated hazard tiles
    const tx0 = Math.max(0, Math.floor(ox / T)), tx1 = Math.min(r.cols - 1, Math.floor((ox + W) / T));
    const ty0 = Math.max(0, Math.floor(oy / T)), ty1 = Math.min(r.rows - 1, Math.floor((oy + H) / T));
    for (let ty = ty0; ty <= ty1; ty++) for (let tx = tx0; tx <= tx1; tx++) {
      const c = r.code(tx, ty);
      if (c === TL.HAZARD) drawHazardTile(ctx, th, tx * T - ox, ty * T - oy, this.t, tx);
      else if ((c === TL.CONVL || c === TL.CONVR) && r.code(tx, ty - 1) !== c) {
        const s = ((this.t * (c === TL.CONVL ? -1 : 1)) % 4 + 4) % 4;
        ctx.fillStyle = '#7a7a84'; for (let i = 0; i < 16; i += 4) ctx.fillRect(tx * T - ox + ((i + s) % 16), ty * T - oy + 1, 2, 2);
      }
    }
    // entities
    for (const e of r.ents) if (!e.back && !(e instanceof Cup || e instanceof Mug || e instanceof NPC || e instanceof Watcher || e instanceof Talker)) e.draw(ctx, ox, oy);
    for (const e of r.ents) if (e instanceof NPC || e instanceof Watcher || e instanceof Talker) e.draw(ctx, ox, oy);
    for (const e of r.ents) if (e instanceof Cup || e instanceof Mug) e.draw(ctx, ox, oy);
    // friends (inactive first)
    const order = this.friends.filter(f => f.present).sort((a, b) => (a.ctrl >= 0 ? 1 : 0) - (b.ctrl >= 0 ? 1 : 0));
    for (const f of order) f.draw(ctx, ox, oy);
    // player markers
    for (let p = 0; p < 2; p++) {
      const f = p === 0 ? this.p1() : this.p2();
      if (!f || !f.present || f.mishapT > 0) continue;
      const mx = Math.round(f.cx - ox), my = Math.round(f.y - oy) - (f.who === 'benny' ? 14 : 10) - (f.who === 'juno' ? 3 : 0) - Math.round(Math.abs(Math.sin(this.t / 10)) * 2);
      const col = p === 0 ? '#ffd23f' : '#4cc9f0';
      ctx.fillStyle = OUTLINE; ctx.fillRect(mx - 3, my - 1, 7, 4); ctx.fillRect(mx - 2, my + 3, 5, 1); ctx.fillRect(mx - 1, my + 4, 3, 1);
      ctx.fillStyle = col; ctx.fillRect(mx - 2, my, 5, 2); ctx.fillRect(mx - 1, my + 2, 3, 1); ctx.fillRect(mx, my + 3, 1, 1);
      if (Input.twoPlayer) drawText(p === 0 ? '1' : '2', mx + 5, my - 4, col, { outline: OUTLINE });
    }
    // sound pulses
    if (this.pulses) for (const p of this.pulses) {
      const rr = p.t * 3 + 6;
      ctx.strokeStyle = 'rgba(76,201,240,' + (1 - p.t / 40) * 0.7 + ')'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(Math.round(p.x - ox), Math.round(p.y - oy), rr, 0, TAU); ctx.stroke();
      ctx.beginPath(); ctx.arc(Math.round(p.x - ox), Math.round(p.y - oy), rr * 0.6, 0, TAU); ctx.stroke();
    }
    Particles.draw(ctx, ox, oy);
    // weather
    if (th.weather === 'snow') this.drawSnow();
    // darkness
    if (r.def.dark) this.drawDark(ox, oy);
    // clapperboards
    for (const c of this.claps) drawClapper(c.x - ox, c.y - oy - c.t * 0.2, c.n, c.t);
    // toasts
    for (const t of this.toasts) {
      const a = t.t < 8 ? t.t / 8 : t.t > t.dur - 12 ? (t.dur - t.t) / 12 : 1;
      if (t.world) drawText(t.text, t.x - ox, t.y - oy - t.t * 0.3, t.col, { align: 'center', outline: OUTLINE, alpha: a });
      else drawText(t.text, t.x, t.y - t.t * 0.15, t.col, { align: 'center', outline: OUTLINE, scale: 2, alpha: a });
    }
    this.drawBubbles(ox, oy);
    if (!this.hub || this.opts.hudInHub) this.drawHUD();
    if (this.choice) this.drawChoice();
    if (this.trans) this.drawTrans();
    if (this.completing) this.drawComplete();
  }
  drawRainBehind() { }
  drawSnow() {
    for (let i = 0; i < 70; i++) {
      const x = (hash2(i, 3, 1) * W + this.t * (0.3 + hash2(i, 4, 1) * 0.4) + Math.sin(this.t / 30 + i) * 6 - this.cam.x * 0.3) % W;
      const y = (hash2(i, 5, 1) * H + this.t * (0.6 + hash2(i, 6, 1) * 0.8)) % H;
      ctx.fillStyle = i % 3 ? '#ffffff' : '#dde8f4';
      ctx.fillRect(Math.round((x + W) % W), Math.round(y), i % 5 === 0 ? 2 : 1, i % 5 === 0 ? 2 : 1);
    }
  }
  drawDark(ox, oy) {
    const r = this.room;
    let level = r.def.darkLevel || 0.9;
    if (r.def.lightLink && this.check(r.def.lightLink)) { this.litT = Math.min(1, (this.litT || 0) + 0.02); level *= (1 - this.litT * 0.85); }
    if (level < 0.05) return;
    const g = darkCtx;
    g.globalCompositeOperation = 'source-over';
    g.clearRect(0, 0, W, H);
    g.fillStyle = 'rgba(6,4,18,' + level + ')';
    g.fillRect(0, 0, W, H);
    g.globalCompositeOperation = 'destination-out';
    const hole = (x, y, rad, a) => {
      const grd = g.createRadialGradient(x, y, rad * 0.25, x, y, rad);
      grd.addColorStop(0, 'rgba(0,0,0,' + (a || 1) + ')'); grd.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = grd; g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
    };
    for (const f of this.friends) if (f.present && f.mishapT <= 22) hole(f.cx - ox, f.y + f.h / 2 - oy, f.ctrl >= 0 ? 68 : 36);
    for (const e of r.ents) {
      if (e instanceof Light && e.on()) hole(e.cx - ox, e.cy - oy, e.r);
      else if (e instanceof Broken && e.fixed && (e.kind === 'lights' || e.kind === 'generator' || e.kind === 'fusebox')) hole(e.cx - ox, e.cy - oy, e.p.r ? e.p.r * T : 110);
      else if (e instanceof Sensor && e.heard) hole(e.cx - ox, e.cy - oy, 90);
      else if ((e instanceof Cup && !e.got) || (e instanceof Mug && !e.got)) hole(e.cx - ox, e.cy - oy, e instanceof Mug ? 22 : 12, 0.7);
      else if (e instanceof Exit) hole(e.cx - ox, e.y - oy, 26, 0.8);
      else if ((e instanceof NPC && !e.gone) || e instanceof Watcher || e instanceof Talker) hole(e.cx - ox, e.cy - oy, 30, 0.85);
      else if (e instanceof Broken && !e.fixed) hole(e.cx - ox, e.cy - oy, 16, 0.6);
    }
    g.globalCompositeOperation = 'source-over';
    ctx.drawImage(darkCanvas, 0, 0);
  }
  drawBubbles(ox, oy) {
    for (const b of this.bubbles) {
      const a = b.anchor;
      if (!a) continue;
      const hx = Math.round((a.cx !== undefined ? a.cx : a.x) - ox);
      let hy = Math.round(a.y - oy) - 6;
      if (a.who === 'benny' || (a.p && a.p.small)) hy -= 6;
      if (a.who === 'juno') hy -= 4;
      if (a.who === 'mila') hy -= 3;
      const name = FRIEND_INFO[b.who] ? FRIEND_INFO[b.who].name : (b.anchor && b.anchor.p && b.anchor.p.name) || NPC_NAMES[b.who] || '';
      const col = FRIEND_INFO[b.who] ? FRIEND_INFO[b.who].color : '#c8b8a8';
      drawSpeechBubble(b.text.slice(0, Math.floor(b.shown)), b.text, hx, hy, name, col, b.t < 4 ? b.t / 4 : 1);
    }
  }
  drawHUD() {
    // portraits
    for (let i = 0; i < 6; i++) {
      const f = this.friends[i];
      const x = 4 + i * 22, y = 3;
      const isP1 = i === this.ctrl[0], isP2 = i === this.ctrl[1];
      const lift = isP1 || isP2 ? 0 : 2;
      panel(x, y + lift, 21, 22, f.present ? '#2a1e36' : '#1a1420', isP1 ? '#ffd23f' : isP2 ? '#4cc9f0' : '#4a3a5a');
      if (f.present) {
        const pc = portrait(f.who, f.outfit, f.mishapT > 0 ? 'dizzy' : (isP1 || isP2 ? 'happy' : 'neutral'));
        ctx.drawImage(pc, x + 1, y + lift + 1);
        if (f.busy() && !isP1 && !isP2) { ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(x + 2, y + lift + 2, 17, 18); }
      } else drawText('?', x + 10, y + lift + 7, '#5a4a6a', { align: 'center' });
      drawText(String(i + 1), x + 2, y + lift + 14, isP1 ? '#ffd23f' : '#c8b8d8', { outline: OUTLINE });
    }
    if (!this.hub) {
      // follow toggle
      const fx = 4 + 6 * 22 + 2;
      panel(fx, 5, 46, 14, this.followMode ? '#2e5a4a' : '#3a2a4a', '#1b1020');
      drawText((Input.lastDevice !== 'touch' ? 'F:' : '') + (this.followMode ? 'FOLLOW' : 'WAIT'), fx + 23, 8, this.followMode ? '#7cf29a' : '#d8c8e8', { align: 'center' });
      // cups + mug
      const cx = W - 92;
      panel(cx, 4, 66, 16, '#2a1e36', '#4a3a5a');
      drawCupIcon(ctx, cx + 3, 6);
      drawText(this.cups + '/' + this.cupsTotal, cx + 16, 8, '#f6ead8', {});
      drawMugIcon(ctx, cx + 49, 5, this.t, !this.mugGot);
    }
    // pause button
    panel(W - 22, 4, 18, 16, '#2a1e36', '#4a3a5a');
    ctx.fillStyle = '#f6ead8'; ctx.fillRect(W - 17, 8, 3, 8); ctx.fillRect(W - 12, 8, 3, 8);
    // context prompt
    const f = this.p1();
    if (f && f.present && !this.lockInput && f.mishapT <= 0) {
      const best = this.bestInteractable(f);
      const ex = this.exitHere(f);
      let label = null;
      if (ex) label = (Input.lastDevice === 'touch' ? '↑ ' : '[↑] ') + ex.interactInfo().label;
      else if (best && best.info.ok) label = (Input.lastDevice === 'touch' ? 'E: ' : '[E] ') + best.info.label;
      else if (best && !best.info.ok && best.info.need) label = best.info.label + ' - needs ' + FRIEND_INFO[best.info.need].name + ' (' + (FRIENDS.indexOf(best.info.need) + 1) + ')';
      if (label) {
        const w = textWidth(label) + 12;
        panel(W / 2 - w / 2, H - 22, w, 15, 'rgba(27,16,32,0.85)', '#6a5a7a');
        drawText(label, W / 2, H - 18, '#ffffff', { align: 'center' });
      }
    }
    // hint (needs friend)
    if (this.hintMsg && this.hintMsg.t > 0) {
      const hm = this.hintMsg;
      const a = Math.min(1, hm.t / 20);
      const w = textWidth(hm.text) + (hm.need ? 34 : 14);
      const y = H - 44 + (1 - a) * 10;
      ctx.globalAlpha = a;
      panel(W / 2 - w / 2, y, w, 20, '#1b1020', hm.need ? FRIEND_INFO[hm.need].color : '#6a5a7a');
      if (hm.need) ctx.drawImage(portrait(hm.need, 0, 'happy'), W / 2 - w / 2 + 2, y + 1);
      drawText(hm.text, W / 2 - w / 2 + (hm.need ? 26 : 7), y + 6, '#ffffff', {});
      ctx.globalAlpha = 1;
    }
    // slug line
    if (this.slugT > 0) {
      const def = this.room.def;
      const s = (def.slug || ('INT. ' + (def.name || 'SOMEWHERE') + ' - ' + (def.time || 'DAY'))).toUpperCase();
      const n = Math.min(s.length, Math.floor(this.slugT / 2));
      const a = this.slugT > 200 ? (240 - this.slugT) / 40 : 1;
      if (n > 0) {
        const w = textWidth(s) + 12;
        ctx.globalAlpha = a;
        ctx.fillStyle = 'rgba(15,10,20,0.78)'; ctx.fillRect(W / 2 - w / 2, 30, w, 14);
        drawText(s.slice(0, n), W / 2 - w / 2 + 6, 33, '#f6ead8', {});
        ctx.globalAlpha = 1;
      }
    }
    if (Input.touchUI && Game.touchControlsActive()) drawTouchControls();
  }
  drawChoice() {
    const c = this.choice;
    if (c.phase !== 'ask') return;
    const opts = c.talk.opts;
    const bx = 60, by = 176, w = W - 120, h = 16 + opts.length * 14;
    panel(bx - 4, by - 4, w + 8, h + 6, '#1b1020', '#e0408a');
    drawText('PRIYA SAYS:', bx + 4, by, '#e0408a', {});
    opts.forEach((o, i) => {
      const y = by + 14 + i * 14;
      const sel = i === c.sel;
      if (sel) { ctx.fillStyle = '#3a2440'; ctx.fillRect(bx, y - 2, w, 13); }
      drawText((i + 1) + '. ' + o.t, bx + 6, y, sel ? '#ffd23f' : '#e8d8f0', {});
      if (sel) drawText('>', bx - 1, y, '#ffd23f', {});
    });
  }
  drawTrans() {
    const tr = this.trans;
    const dur = tr.shot ? 120 : 36;
    if (tr.shot && tr.t >= 18 && tr.t < dur - 14) {
      drawEstablishing(tr.shot, tr.t - 18);
      return;
    }
    let a;
    if (tr.t < 18) a = tr.t / 18; else a = Math.max(0, (dur - tr.t) / 14);
    ctx.fillStyle = 'rgba(10,6,14,' + clamp(a, 0, 1) + ')';
    ctx.fillRect(0, 0, W, H);
  }
  drawComplete() {
    const t = this.completeT;
    const a = Math.min(1, t / 20);
    ctx.globalAlpha = a;
    const y = 80 + Math.sin(t / 15) * 2;
    drawText(this.ep.endLine || "THAT'S A WRAP!", W / 2, y, '#ffd23f', { align: 'center', scale: 3, outline: OUTLINE });
    ctx.globalAlpha = 1;
    if (t > 150) { ctx.fillStyle = 'rgba(10,6,14,' + ((t - 150) / 50) + ')'; ctx.fillRect(0, 0, W, H); }
  }
}
function emptyPad() { const p = { held: {}, pressed: {}, released: {}, select: -1 }; for (const a of ACTIONS) { p.held[a] = false; p.pressed[a] = false; } return p; }
const SWAP_LINES = {
  dex: ['Dex, reporting for heavy lifting.', 'I\'m up. My back is up. Mostly.'],
  mila: ['Finally. Tag me in!', 'Mila\'s on. Scoreboard\'s on.'],
  theo: ['Theo here. What\'s broken?', 'Did someone say "malfunction"?'],
  priya: ['Priya here. Who needs convincing?', 'Let\'s make a deal.'],
  benny: ['Ta-da! It\'s me!', 'The Great Benny appears!'],
  juno: ['♪ Juno\'s on the keys! ♪', '♪ Ready to rock! ♪'],
};
const NPC_NAMES = { gus: 'GUS', holloway: 'MR. HOLLOWAY', roz: 'ROZ', sarge: 'SARGE', robot: 'TIDY-BOT', npc: '' };

function drawSpeechBubble(shownText, fullText, hx, hy, name, col, alpha) {
  const lines = wrapText(fullText, 150);
  const shownLines = wrapText(fullText, 150);
  let w = 0;
  for (const l of lines) w = Math.max(w, textWidth(l));
  w += 10; const h = lines.length * 10 + 7 + (name ? 4 : 0);
  let x = Math.round(hx - w / 2), y = Math.round(hy - h - 6);
  x = clamp(x, 3, W - w - 3); y = clamp(y, 26, H - h - 3);
  ctx.globalAlpha = alpha === undefined ? 1 : alpha;
  panel(x, y, w, h, '#fbf6ec', OUTLINE);
  // tail
  const tx = clamp(hx, x + 6, x + w - 8);
  if (hy - 6 > y + h) {
    ctx.fillStyle = OUTLINE; ctx.fillRect(tx - 3, y + h - 1, 7, 2); ctx.fillRect(tx - 2, y + h + 1, 5, 2); ctx.fillRect(tx - 1, y + h + 3, 3, 2);
    ctx.fillStyle = '#fbf6ec'; ctx.fillRect(tx - 2, y + h - 2, 5, 2); ctx.fillRect(tx - 1, y + h, 3, 2); ctx.fillRect(tx, y + h + 2, 1, 1);
  }
  if (name) {
    const nw = textWidth(name) + 6;
    panel(x + 4, y - 6, nw, 10, col, OUTLINE);
    drawText(name, x + 7, y - 4, '#1b1020', {});
  }
  // reveal text progressively
  let remaining = shownText.length;
  for (let i = 0; i < shownLines.length; i++) {
    const l = shownLines[i];
    const part = l.slice(0, Math.max(0, remaining));
    remaining -= l.length + 1;
    drawText(part, x + 5, y + 5 + (name ? 3 : 0) + i * 10, '#2a1a2a', {});
  }
  ctx.globalAlpha = 1;
}

function drawClapper(x, y, n, t) {
  x = Math.round(x); y = Math.round(y);
  const a = t < 50 ? 1 : (70 - t) / 20;
  ctx.globalAlpha = Math.max(0, a);
  const open = t < 8 ? 1 - t / 8 : 0;
  ctx.fillStyle = OUTLINE; ctx.fillRect(x - 13, y - 9, 26, 18);
  ctx.fillStyle = '#2a2a30'; ctx.fillRect(x - 12, y - 4, 24, 12);
  // striped top
  ctx.save(); ctx.translate(x - 12, y - 5); ctx.rotate(-open * 0.5);
  ctx.fillStyle = '#f4f4f4'; ctx.fillRect(0, -4, 24, 4);
  ctx.fillStyle = '#2a2a30'; for (let i = 0; i < 24; i += 6) ctx.fillRect(i, -4, 3, 4);
  ctx.restore();
  drawText('TAKE ' + n, x, y - 1, '#ffffff', { align: 'center' });
  ctx.globalAlpha = 1;
}

function drawTouchControls() {
  for (const b of Input.touchButtons) {
    const held = Input.touchHeld[b.id];
    ctx.globalAlpha = held ? 0.75 : 0.42;
    if (b.round) {
      circleFill(b.x + b.w / 2, b.y + b.h / 2, b.w / 2, OUTLINE);
      circleFill(b.x + b.w / 2, b.y + b.h / 2, b.w / 2 - 2, held ? '#6a5a8a' : '#3a2e4a');
    } else panel(b.x, b.y, b.w, b.h, held ? '#6a5a8a' : '#3a2e4a', OUTLINE);
    ctx.globalAlpha = held ? 1 : 0.8;
    drawText(b.label, b.x + b.w / 2, b.y + b.h / 2 - (b.label.length > 2 ? 5 : 8), '#ffffff', { align: 'center', scale: b.label.length > 2 ? 1 : 2 });
  }
  ctx.globalAlpha = 1;
}
