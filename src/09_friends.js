// ---------------------------------------------------------------------------
// The six friends: movement, abilities, mishaps, follow AI
// ---------------------------------------------------------------------------
const PHYS = { grav: 0.3, maxFall: 6.5, jumpV: 5.0, cut: 2.2, djumpV: 4.6, coyote: 6, buffer: 7, climb: 1.3, accel: 0.3, decel: 0.38, airAccel: 0.22 };
const FRIEND_STATS = {
  dex: { w: 14, h: 28, speed: 1.4 },
  mila: { w: 10, h: 26, speed: 1.85 },
  theo: { w: 10, h: 27, speed: 1.6 },
  priya: { w: 10, h: 26, speed: 1.6 },
  benny: { w: 10, h: 18, speed: 1.55 },
  juno: { w: 10, h: 26, speed: 1.6 },
};
const QUIPS = {
  dex: ['My back is FINE. Ignore the noises.', 'I lift. Emotionally, too.', 'Who packs a bowling ball in a shoebox?!', 'I volunteered for this. Why do I keep volunteering?', 'That commercial with the puppy... no. Not now.', 'Feel that? Pure gym-teacher energy.'],
  mila: ['Scoreboard update: Mila 1, Gravity 0.', 'That was a personal best. I keep a spreadsheet.', 'Scoreboard: Mila 412, everyone else: a rounding error.', 'I could do this blindfolded. I have.', 'Point for Mila. Obviously.', 'Race you. I already won.'],
  theo: ['Behold! The Pocket Fan 3000! ...It is a hair dryer.', 'Behold! Self-tying shoelaces! ...Mostly self-tying.', 'Behold! The Snack Tracker! It tracks... that I ate the snacks.', 'I can rewire a subway car. My toaster? Charcoal.', 'Behold! The Auto-Umbrella! ...Why is it raining INSIDE?', 'Behold! The Sock Finder! It found... one sock.'],
  priya: ['I know a guy.', 'I know a guy who knows a guy. Small world.', 'Location, location, location!', 'Hold on, my guy is calling. ...Wrong guy.', 'Trust me, I sold a closet as a "loft".', 'I could sell this hallway. Twice.'],
  benny: ['For my next trick... nope. Lost the rabbit.', 'Ta-da! ...Okay, imagine there was a dove.', 'Pick a card! Any card! ...Not that one.', 'Behold! The vanishing coin! ...It really vanished. That was rent money.', 'Ta-da!', 'Abracadabra! ...Abraca-dang it.'],
  juno: [],
};
const MAGIC_TRICKS = ['dove', 'sock', 'cards', 'flowers', 'nothing'];

class Friend {
  constructor(level, who, x, y) {
    this.level = level; this.who = who;
    const st = FRIEND_STATS[who];
    this.w = st.w; this.h = st.h; this.standH = st.h; this.speed = st.speed;
    this.x = x; this.y = y; this.vx = 0; this.vy = 0; this.face = 1;
    this.onGround = false; this.groundEnt = null; this.coyote = 0; this.jumpBuf = 0; this.djumpUsed = false;
    this.climbing = false; this.crawling = false; this.state = 'normal';
    this.holding = null; this.fixing = null; this.grabbing = null; this.pushingCrate = null;
    this.playT = 0; this.mishapT = 0; this.mishapKind = null; this.celebT = 0; this.quipCool = 0; this.trickT = 0; this.trick = null;
    this.checkpoint = { x, y, ent: null };
    this.present = true; this.gone = false; this.alpha = 1;
    this.t = rndi(0, 100); this.animT = 0; this.anim = 'idle'; this.expr = 'neutral';
    this.blinkT = rndi(60, 260); this.idleT = 0;
    this.sx = 1; this.sy = 1;
    this.ai = { stuck: 0, lastX: x, confused: 0, jumpCool: 0 };
    this.dropT = 0; this.pushHint = 0; this.flipT = 0; this.ctrl = -1;
  }
  get cx() { return this.x + this.w / 2; }
  get outfit() { return (Save.data.outfits && Save.data.outfits[this.who]) || 0; }
  busy() { return this.state === 'hold' || this.state === 'fix' || this.state === 'play' || this.mishapT > 0 || this.onPlate(); }
  onPlate() {
    for (const e of this.level.room.ents) if (e instanceof Plate && e.pressed && this.onGround && overlap({ x: e.x + 2, y: e.y + e.h - 6, w: e.w - 4, h: 8 }, this)) return true;
    return false;
  }
  canClimbCode(c) { return c === TL.LADDER || (c === TL.CLIMB && this.who === 'mila'); }
  climbTileAt() {
    const room = this.level.room;
    const tx = Math.floor(this.cx / T);
    const ty0 = Math.floor((this.y + 2) / T), ty1 = Math.floor((this.y + this.h - 1) / T);
    for (let ty = ty0; ty <= ty1; ty++) if (this.canClimbCode(room.code(tx, ty))) return { tx, ty };
    return null;
  }
  // standing on a ladder / climb top?
  onClimbTop() {
    const room = this.level.room;
    const tx = Math.floor(this.cx / T), ty = Math.floor((this.y + this.h + 1) / T);
    const c = room.code(tx, ty);
    return this.onGround && this.canClimbCode(c) && !this.canClimbCode(room.code(tx, ty - 1)) ? { tx, ty } : null;
  }

  // ---------------------------------------------------------------------------
  update(pad) {
    this.t++; this.animT++;
    if (this.quipCool > 0) this.quipCool--;
    if (this.celebT > 0) this.celebT--;
    if (this.flipT > 0) this.flipT--;
    if (this.trickT > 0) this.trickT--;
    if (this.ai.jumpCool > 0) this.ai.jumpCool--;
    if (--this.blinkT < -6) this.blinkT = rndi(120, 320);
    this.sx = lerp(this.sx, 1, 0.2); this.sy = lerp(this.sy, 1, 0.2);
    if (!this.present) return;
    if (this.mishapT > 0) { this.tickMishap(); return; }
    const L = this.level, room = L.room;
    const Hd = pad.held, Pr = pad.pressed;
    let dir = (Hd.right ? 1 : 0) - (Hd.left ? 1 : 0);
    if (this.sitting && (dir || Pr.jump)) this.sitting = false;

    // ---- locked states ----
    if (this.state === 'hold') {
      if (!this.holding) this.state = 'normal';
      else if (dir !== 0 || Pr.jump || Pr.act) { this.release(); Pr.act = false; Pr.jump = false; }
      else { this.physicsIdle(); this.anim = 'hold'; return; }
    }
    if (this.state === 'fix') {
      if (!this.fixing || !Hd.act || dir !== 0 || this.fixing.fixed) {
        if (this.fixing) this.fixing.fixer = null;
        this.fixing = null; this.state = 'normal';
      } else { this.physicsIdle(); this.anim = 'fix'; this.face = this.fixing.cx >= this.cx ? 1 : -1; return; }
    }
    if (this.state === 'play') {
      this.playT--;
      if (this.playT === 52) L.soundPulse(this);
      if (this.playT <= 0) this.state = 'normal';
      this.physicsIdle(); this.anim = 'play'; return;
    }
    if (this.state === 'pose') {
      this.playT--; if (this.playT <= 0) this.state = 'normal';
      this.physicsIdle(); return;
    }
    if (this.state === 'talkpose') { this.physicsIdle(); this.anim = 'talk'; return; }
    if (this.state === 'hide') {
      if (!this.hiding || dir !== 0 || Pr.jump || Pr.act || Pr.up) { this.unhide(); Pr.act = false; Pr.jump = false; Pr.up = false; }
      else { this.physicsIdle(); this.anim = 'idle'; return; }
    }
    if (L.lockInput) { dir = 0; }

    // ---- E: ability / interact ----
    if (Pr.act && !L.lockInput) this.act();
    if (this.state !== 'normal') return;
    // grab release
    if (this.grabbing && (!Hd.act || !this.adjacent(this.grabbing))) this.grabbing = null;

    // ---- exits: up at a door ----
    if (Pr.up && !L.lockInput && this.onGround) {
      const ex = L.exitHere(this);
      if (ex) { ex.use(this); Pr.jump = false; this.jumpBuf = 0; return; }
    }

    // ---- climbing ----
    if (!this.climbing && !L.lockInput) {
      const ct = this.climbTileAt();
      if (ct && Hd.up && (!this.onGround || Pr.up || this.vy >= 0) && !(Pr.jump && !Hd.up)) { this.startClimb(ct); if (Pr.jump) { Pr.jump = false; this.jumpBuf = 0; } }
      else if (Hd.down && this.onGround) {
        const top = this.onClimbTop();
        if (top && Pr.down) { this.startClimb(top); this.y += 3; }
      }
    }
    if (this.climbing) { this.updateClimb(Hd, Pr, dir); return; }

    // ---- Benny crawling ----
    if (this.who === 'benny') this.updateCrawl(Hd, dir);

    // ---- horizontal ----
    const gc = this.onGround ? room.groundCode(this) : 0;
    const ice = gc === TL.ICE;
    const maxS = this.speed * (this.pushingCrate || this.grabbing ? 0.62 : 1) * (this.crawling ? 0.7 : 1);
    const acc = this.onGround ? (ice ? 0.05 : PHYS.accel) : PHYS.airAccel;
    const dec = this.onGround ? (ice ? 0.015 : PHYS.decel) : 0.08;
    if (dir) { this.vx = approach(this.vx, dir * maxS, acc); if (!this.grabbing) this.face = dir; }
    else this.vx = approach(this.vx, 0, dec);
    if (this.onGround && (gc === TL.CONVL || gc === TL.CONVR)) room.moveX(this, gc === TL.CONVL ? -0.7 : 0.7);

    // ---- jumping ----
    if (this.onGround) { this.coyote = PHYS.coyote; this.djumpUsed = false; } else if (this.coyote > 0) this.coyote--;
    if (Pr.jump && !L.lockInput) this.jumpBuf = PHYS.buffer; else if (this.jumpBuf > 0) this.jumpBuf--;
    if (this.jumpBuf > 0 && Hd.down && this.onGround && this.onOneway()) {
      this.dropT = 10; this.jumpBuf = 0; this.onGround = false;
    } else if (this.jumpBuf > 0 && (this.onGround || this.coyote > 0) && !this.crawling) {
      this.jump();
    } else if (Pr.jump && !this.onGround && this.coyote <= 0 && this.who === 'mila' && !this.djumpUsed && !L.lockInput) {
      this.doubleJump();
    }
    if (!Hd.jump && this.vy < -PHYS.cut && !this.bounced) this.vy = -PHYS.cut;
    if (this.vy >= 0) this.bounced = false;

    // ---- gravity ----
    this.vy = Math.min(this.vy + PHYS.grav, PHYS.maxFall);

    // ---- move X (with Dex pushing / pulling) ----
    this.pushingCrate = null;
    if (this.vx) {
      const dx = this.vx;
      if (this.who === 'dex' && this.onGround) {
        const probe = { x: this.x + dx, y: this.y + 3, w: this.w, h: this.h - 6 };
        for (const e of room.ents) {
          if (!e.crate || e === this.groundEnt) continue;
          if (overlap(probe, e) && e.y + e.h > this.y + 6 && e.y < this.y + this.h - 3) {
            const need = dx > 0 ? (this.x + dx + this.w) - e.x : (this.x + dx) - (e.x + e.w);
            if (Math.sign(need) === Math.sign(dx)) { e.tryMove(clamp(need, -1.2, 1.2)); this.pushingCrate = e; e.wobble = 4; }
          }
        }
      }
      const before = this.x;
      const hit = room.moveX(this, dx);
      const moved = this.x - before;
      if (this.grabbing && moved && Math.sign(moved) !== Math.sign(this.grabbing.cx - this.cx)) this.grabbing.tryMove(moved);
      if (hit && hit.crate && this.who !== 'dex' && this.onGround) {
        if (++this.pushHint === 30) { L.hint('dex', 'Too heavy! Needs DEX'); this.say(pick(['Nope. That is a Dex job.', 'Way too heavy.', 'Not budging.'])); }
      } else if (!hit) this.pushHint = 0;
      if (hit) this.vx = this.pushingCrate ? this.vx : 0;
    }
    // ---- move Y ----
    const wasGround = this.onGround;
    const prevVy = this.vy;
    const res = room.moveY(this, this.vy, { drop: this.dropT > 0, who: this.who });
    if (this.dropT > 0) this.dropT--;
    if (res.landed) {
      if (res.on && res.on.bounce && prevVy > 0.5) {
        this.vy = -res.on.power; this.bounced = true; this.onGround = false; this.groundEnt = null;
        res.on.squish = 6; AudioSys.sfx('spring'); this.sx = 1.3; this.sy = 0.7;
      } else {
        if (!wasGround && prevVy > 2) { this.sx = 1.25; this.sy = 0.78; AudioSys.sfx('land'); Particles.dust(this.cx, this.y + this.h, 3); }
        this.vy = 0; this.onGround = true; this.groundEnt = res.on;
      }
    } else {
      this.onGround = false; this.groundEnt = null;
      if (res.ceiling) this.vy = Math.max(0, this.vy);
    }
    // standing on a crate that moved away etc.
    if (this.onGround && !res.landed) this.onGround = false;

    // ---- hazards & pits ----
    // hazard tiles only bite at floor level (the trap/puddle sits in the bottom of its tile)
    const hz = room.overlapsCode({ x: this.x + 3, y: this.y + this.h - 6, w: this.w - 6, h: 6 }, TL.HAZARD);
    if (hz && this.y + this.h > hz.ty * T + 9) this.mishap(hazardReaction(room.theme.hazard));
    if (this.y > room.h + 24) this.mishap('fall');

    this.pickAnim(dir);
  }

  physicsIdle() {
    const room = this.level.room;
    this.vx = 0;
    this.vy = Math.min(this.vy + PHYS.grav, PHYS.maxFall);
    const res = room.moveY(this, this.vy, { who: this.who });
    if (res.landed) { this.vy = 0; this.onGround = true; this.groundEnt = res.on; } else { this.onGround = false; this.groundEnt = null; }
  }
  onOneway() {
    const room = this.level.room;
    if (this.groundEnt && this.groundEnt.oneway) return true;
    const ty = Math.floor((this.y + this.h + 1) / T);
    const tx0 = Math.floor(this.x / T), tx1 = Math.floor((this.x + this.w - 0.01) / T);
    let any = false;
    for (let tx = tx0; tx <= tx1; tx++) { const c = room.code(tx, ty); if (isSolidCode(c)) return false; if (c === TL.ONEWAY) any = true; }
    return any;
  }
  adjacent(e) {
    return Math.abs((this.cx < e.cx ? e.x - (this.x + this.w) : this.x - (e.x + e.w))) < 3 && this.y + this.h > e.y + 2 && this.y < e.y + e.h;
  }

  jump() {
    this.vy = -PHYS.jumpV; this.coyote = 0; this.jumpBuf = 0; this.onGround = false; this.groundEnt = null;
    this.sx = 0.82; this.sy = 1.2;
    AudioSys.sfx('jump');
    Particles.dust(this.cx, this.y + this.h, 2);
  }
  doubleJump() {
    this.vy = -PHYS.djumpV; this.djumpUsed = true; this.flipT = 18;
    this.sx = 0.8; this.sy = 1.2;
    AudioSys.sfx('djump');
    Particles.puff(this.cx, this.y + this.h, 5);
    if (Math.random() < 0.12 && this.quipCool <= 0) { this.say('Scoreboard: Mila 1, Gravity 0.'); this.quipCool = 300; }
  }

  startClimb(ct) {
    this.climbing = true; this.vx = 0; this.vy = 0; this.crawling = false;
    this.x = ct.tx * T + T / 2 - this.w / 2;
  }
  updateClimb(Hd, Pr, dir) {
    const room = this.level.room;
    const vdir = (Hd.down ? 1 : 0) - (Hd.up ? 1 : 0);
    // jump off (jump that isn't also "up")
    if (Pr.jump && !Hd.up) { this.climbing = false; this.vy = -3.8; this.vx = dir * this.speed; this.djumpUsed = false; AudioSys.sfx('jump'); this.anim = 'jump'; return; }
    this.vx = 0;
    if (dir) { room.moveX(this, dir * 0.9); this.face = dir; }
    this.vy = vdir * PHYS.climb;
    if (this.vy) { if (this.animT % 12 === 0) AudioSys.sfx('climb'); }
    else this.animT--; // freeze climb anim
    const res = room.moveY(this, this.vy, { who: this.who, climbing: true });
    if (res.landed && this.vy > 0) { this.climbing = false; this.onGround = true; this.vy = 0; }
    // reached the top?
    const tx = Math.floor(this.cx / T);
    const feetTy = Math.floor((this.y + this.h - 1) / T);
    if (this.vy < 0 && !this.canClimbCode(room.code(tx, feetTy))) {
      // find top tile under us
      const topTy = feetTy + 1;
      if (this.canClimbCode(room.code(tx, topTy))) { this.y = topTy * T - this.h; this.climbing = false; this.onGround = true; this.vy = 0; }
    }
    if (!this.climbTileAt() && this.climbing) { this.climbing = false; }
    this.anim = 'climb';
    if (this.y > room.h + 24) this.mishap('fall');
  }

  updateCrawl(Hd, dir) {
    const room = this.level.room;
    const STAND = this.standH, CRAWL = 12;
    const bottom = this.y + this.h;
    if (this.crawling) {
      const free = !room.rectBlocked(this.x, bottom - STAND, this.w, STAND, this);
      if (free && !Hd.down) { this.crawling = false; this.h = STAND; this.y = bottom - STAND; }
    } else if (this.onGround) {
      let want = Hd.down;
      if (!want && dir) {
        const blockedStand = room.rectBlocked(this.x + dir * 2, bottom - STAND, this.w, STAND, this);
        const freeCrawl = !room.rectBlocked(this.x + dir * 2, bottom - CRAWL, this.w, CRAWL, this);
        if (blockedStand && freeCrawl) want = true;
      }
      if (want) { this.crawling = true; this.h = CRAWL; this.y = bottom - CRAWL; }
    }
  }

  // ---- E ----------------------------------------------------------------------
  act() {
    const L = this.level;
    if (this.who === 'mila' && !this.onGround && !this.climbing && !this.djumpUsed && this.coyote <= 0) { this.doubleJump(); return; }
    const best = L.bestInteractable(this);
    if (best && best.info.ok) {
      // Juno: low-priority things (doors to hide in, chats) never get in the way of a song somebody nearby wants to hear
      if (best.info.play || (this.who === 'juno' && (best.info.prio || 0) <= 2 && this.musicWanted())) { this.startPlay(); return; }
      best.ent.use(this); return;
    }
    if (this.who === 'juno') { this.startPlay(); return; }
    if (this.who === 'mila') { const ct = this.climbTileAt(); if (ct) { this.startClimb(ct); return; } }
    if (best && !best.info.ok) {
      L.hint(best.info.need, needText(best.info.need, best.info.label));
      this.state = 'pose'; this.playT = 30; this.anim = 'shrug';
      if (best.ent.use && best.ent instanceof NPC) best.ent.use(this);
      AudioSys.sfx('deny');
      return;
    }
    this.quip();
  }
  musicWanted() {
    const R = 7 * T;
    for (const e of this.level.room.ents) {
      if (!e.onSound) continue;
      const d = Math.hypot(e.cx - this.cx, e.cy - (this.y + this.h / 2));
      if (d > R + Math.max(e.w, e.h) / 2) continue;
      if (e instanceof Watcher && e.danceT <= 0) return true;
      if (e instanceof NPC && e.solve === 'music' && e.state === 'block') return true;
      if (e instanceof Runner && e.p.lovesMusic && !e.caught && !e.moving) return true;
      if ((e instanceof Sensor || e instanceof SoundDoor) && !e.heard && (!e.ready || e.ready())) return true;
    }
    return false;
  }
  startPlay() {
    this.state = 'play'; this.playT = 72;
    const riffs = [[[0, 72, 0.5], [0.5, 76, 0.5], [1, 79, 0.5], [1.5, 84, 1]], [[0, 74, 0.25], [0.25, 77, 0.25], [0.5, 81, 0.5], [1, 79, 0.5], [1.5, 77, 1]], [[0, 76, 0.5], [0.5, 79, 0.25], [0.75, 76, 0.25], [1, 74, 0.5], [1.5, 72, 1]], [[0, 67, 0.25], [0.25, 72, 0.25], [0.5, 76, 0.25], [0.75, 79, 0.25], [1, 84, 1]]];
    Music.notes(pick(riffs), 'keytar', 150, 0.9);
    Particles.notes(this.cx, this.y, 3);
    if (this.quipCool <= 0 && Math.random() < 0.35) { this.say(pick(['♪ Dum da-dum! ♪', '♪ This one\'s called "Please Work". ♪', '♪ Ba-dum, tss! ♪', '♪ Wedding medley, take one! ♪'])); this.quipCool = 240; }
  }
  startFix(e) { this.state = 'fix'; this.fixing = e; this.vx = 0; AudioSys.sfx('clink'); }
  startHold(e) {
    this.state = 'hold'; this.holding = e; this.vx = 0;
    // snap beside the shutter
    if (this.cx < e.cx) this.x = e.x - this.w; else this.x = e.x + e.w;
    this.face = this.cx < e.cx ? 1 : -1;
  }
  release() {
    if (this.holding) { this.holding = null; }
    if (this.state === 'hold') this.state = 'normal';
  }
  startGrab(c) { this.grabbing = c; this.face = c.cx > this.cx ? 1 : -1; }
  startHide(h) {
    this.hiding = h; h.occupant = this; this.state = 'hide'; this.vx = 0;
    this.x = h.cx - this.w / 2;
    AudioSys.sfx('creak');
    if (Math.random() < 0.5 && this.quipCool <= 0) { this.say(pick(HIDE_LINES[this.who] || ['Shh.'])); this.quipCool = 200; }
  }
  unhide() {
    if (this.hiding) { this.hiding.occupant = null; this.hiding.peekT = 0; }
    this.hiding = null; if (this.state === 'hide') this.state = 'normal';
    AudioSys.sfx('creak');
  }
  celebrate(n) { this.celebT = n; }

  quip() {
    if (this.quipCool > 0) return;
    this.quipCool = 150;
    const L = this.level;
    switch (this.who) {
      case 'benny': {
        this.trick = pick(MAGIC_TRICKS); this.trickT = 60;
        this.state = 'pose'; this.playT = 40; this.anim = 'magic';
        AudioSys.sfx('magic'); Particles.puff(this.cx + this.face * 8, this.y + 6, 10);
        const lines = { dove: 'Ta-da! A dove! ...It\'s a pigeon. Close enough.', sock: 'From my hat... a rabbit! ...A sock. Again.', cards: 'Pick a card! ...Pick up ALL the cards.', flowers: 'For you! ...They\'re plastic. And on fire. No, wait.', nothing: 'Ta-da! ...The trick is that nothing happened.' };
        this.say(lines[this.trick]);
        if (Math.random() < 0.7) AudioSys.audience('chuckle', 0.55);
        break;
      }
      case 'theo':
        this.state = 'pose'; this.playT = 40; this.anim = 'fix';
        Particles.sparks(this.cx + this.face * 8, this.y + 10, 8); AudioSys.sfx('spark');
        this.say(pick(QUIPS.theo));
        if (Math.random() < 0.6) AudioSys.audience('chuckle', 0.5);
        break;
      case 'dex':
        this.state = 'pose'; this.playT = 40; this.anim = 'flex';
        this.say(pick(QUIPS.dex));
        break;
      case 'mila':
        this.state = 'pose'; this.playT = 30; this.anim = 'cheer';
        this.say(pick(QUIPS.mila));
        break;
      case 'priya':
        this.state = 'pose'; this.playT = 40; this.anim = 'phone';
        this.say(pick(QUIPS.priya));
        break;
      default: break;
    }
  }
  say(text, opts) { this.level.say(this.who, text, null, opts); }

  // ---- mishaps -------------------------------------------------------------------
  mishap(kind) {
    if (this.mishapT > 0 || !this.present) return;
    const L = this.level;
    if (L.completing) return;
    this.release(); this.climbing = false; this.grabbing = null;
    if (this.hiding) { this.hiding.occupant = null; this.hiding = null; }
    if (this.fixing) { this.fixing.fixer = null; this.fixing = null; }
    this.state = 'mishap'; this.mishapKind = kind; this.mishapT = kind === 'fall' ? 60 : 78;
    this.vx = 0; this.vy = (kind === 'fall') ? 0 : -2.5;
    this.crawling = false; this.h = this.standH;
    L.takes++;
    const sfx = { ow: 'snap', zap: 'zap', splash: 'splash', caught: 'whistle', bonk: 'crash', fall: 'slide' }[kind] || 'boing';
    AudioSys.sfx(sfx);
    if (kind === 'ow') setTimeout(() => AudioSys.sfx('ow'), 120);
    if (kind === 'zap') Particles.sparks(this.cx, this.y + 8, 14);
    if (kind === 'splash') Particles.drops(this.cx, this.y + this.h, 12);
    L.shake(kind === 'bonk' ? 4 : 2);
    setTimeout(() => AudioSys.audience(Math.random() < 0.45 ? 'big' : 'laugh', 0.8), kind === 'fall' ? 450 : 200);
    const lines = MISHAP_LINES[this.who] && MISHAP_LINES[this.who][kind];
    if (lines && Math.random() < 0.75) this.say(pick(lines));
  }
  tickMishap() {
    this.mishapT--;
    const k = this.mishapKind;
    if (k !== 'fall' && this.mishapT > 22) {
      this.vy = Math.min(this.vy + 0.2, 3);
      const res = this.level.room.moveY(this, this.vy);
      if (res.landed) this.vy = 0;
      if (k === 'dizzy' || k === 'bonk') { if (this.t % 10 === 0) Particles.twinkle(this.cx + rnd(-6, 6), this.y - 4); }
      if (k === 'zap' && this.t % 6 === 0) Particles.puff(this.cx, this.y, 1);
    }
    if (this.mishapT === 22) {
      if (k !== 'fall') Particles.puff(this.cx, this.y + this.h / 2, 10);
      this.respawn();
    }
    if (this.mishapT <= 0) { this.state = 'normal'; this.mishapKind = null; this.alpha = 1; }
  }
  respawn() {
    const cp = this.checkpoint;
    const room = this.level.room;
    this.x = cp.x; this.y = cp.y; this.vx = 0; this.vy = 0;
    // nudge up if blocked
    for (let i = 0; i < 6 && room.rectBlocked(this.x, this.y, this.w, this.h, this); i++) this.y -= T;
    Particles.puff(this.cx, this.y + this.h / 2, 12);
    AudioSys.sfx('pop');
    this.level.takeClap(this);
    this.sx = 0.6; this.sy = 1.4;
    this.onGround = false;
  }

  // ---- follow AI -------------------------------------------------------------------
  aiPad(leader, idx) {
    const pad = { held: {}, pressed: {}, released: {} };
    for (const a of ACTIONS) { pad.held[a] = false; pad.pressed[a] = false; }
    if (!leader || leader === this || this.busy() || !leader.present || leader.mishapT > 0) return pad;
    const room = this.level.room;
    const gap = 16 + idx * 13;
    const tx = leader.cx - leader.face * gap;
    const dx = tx - this.cx;
    const dyL = (leader.y + leader.h) - (this.y + this.h);
    if (this.ai.confused > 0) {
      this.ai.confused--;
      if (Math.abs(leader.cx - this.ai.leaderX) > 48 || Math.abs(leader.y - this.ai.leaderY) > 40) this.ai.confused = 0;
      return pad;
    }
    // ladders
    const ct = this.climbTileAt();
    if (this.climbing) {
      if (dyL < -6) pad.held.up = true; else if (dyL > 6) pad.held.down = true;
      else if (Math.abs(dx) > 4) { pad.held[dx > 0 ? 'right' : 'left'] = true; }
      return pad;
    }
    if (ct && dyL < -24 && Math.abs(leader.cx - this.cx) < 80) { pad.held.up = true; pad.pressed.up = true; return pad; }
    if (this.onGround && dyL > 24) { const top = this.onClimbTop(); if (top && Math.abs(leader.cx - this.cx) < 80) { pad.held.down = true; pad.pressed.down = true; return pad; } }
    if (Math.abs(dx) < 6 && Math.abs(dyL) < 40) { this.ai.stuck = 0; return pad; }
    const d = dx > 0 ? 1 : -1;
    pad.held[d > 0 ? 'right' : 'left'] = true;
    if (this.onGround && this.ai.jumpCool <= 0) {
      const ahead = { x: this.x + d * 6, y: this.y + 2, w: this.w, h: this.h - 4 };
      const wall = room.rectBlocked(ahead.x, ahead.y, ahead.w, ahead.h, this);
      // ground ahead?
      const footX = d > 0 ? this.x + this.w + 2 : this.x - 2;
      let groundAhead = false, dropDepth = 0;
      for (let k = 0; k < 8; k++) {
        const ty = Math.floor((this.y + this.h + 1) / T) + k;
        const c = room.code(Math.floor(footX / T), ty);
        if (isSolidCode(c) || c === TL.ONEWAY || c === TL.LADDER) { groundAhead = k === 0; dropDepth = k; break; }
        dropDepth = 99;
      }
      const hazardAhead = room.code(Math.floor((footX + d * 4) / T), Math.floor((this.y + this.h - 4) / T)) === TL.HAZARD;
      if (wall) {
        // can we clear it? check up to 2 tiles
        const free2 = !room.rectBlocked(ahead.x, this.y - 2 * T, ahead.w, this.h, this);
        if (free2) { pad.pressed.jump = true; pad.held.jump = true; this.ai.jumpCool = 20; }
      } else if (!groundAhead) {
        if (dyL < -8 || dropDepth > 6) {
          // leader is up/level across a gap: jump if there's ground within 3 tiles
          let land = false;
          for (let k = 1; k <= 3; k++) {
            const gx = Math.floor((footX + d * k * T) / T);
            for (let j = -2; j <= 1; j++) { const ty = Math.floor((this.y + this.h + 1) / T) + j; if (isSolidCode(room.code(gx, ty)) && !isSolidCode(room.code(gx, ty - 1))) land = true; }
          }
          if (land) { pad.pressed.jump = true; pad.held.jump = true; this.ai.jumpCool = 25; }
          else { pad.held.left = pad.held.right = false; this.goConfused(leader); }
        }
      } else if (hazardAhead) { pad.pressed.jump = true; pad.held.jump = true; this.ai.jumpCool = 25; }
      else if (dyL < -20 && Math.abs(dx) < 40) {
        // leader on a ledge above: hop
        pad.pressed.jump = true; pad.held.jump = true; this.ai.jumpCool = 30;
      }
    } else if (!this.onGround) pad.held.jump = true;
    // stuck detection
    if (Math.abs(this.x - this.ai.lastX) < 0.3) { if (++this.ai.stuck > 70) this.goConfused(leader); }
    else this.ai.stuck = 0;
    this.ai.lastX = this.x;
    return pad;
  }
  goConfused(leader) { this.ai.confused = 120; this.ai.stuck = 0; this.ai.leaderX = leader.cx; this.ai.leaderY = leader.y; }

  pickAnim(dir) {
    let a;
    if (this.sitting && this.onGround && Math.abs(this.vx) < 0.1) a = 'sit';
    else if (this.climbing) a = 'climb';
    else if (this.crawling) a = 'crawl';
    else if (!this.onGround) a = this.flipT > 0 ? 'jump' : (this.vy < 0 ? 'jump' : 'fall');
    else if (this.pushingCrate) a = 'push';
    else if (this.grabbing && Math.abs(this.vx) > 0.1) a = 'pull';
    else if (Math.abs(this.vx) > 0.25) a = 'walk';
    else if (this.celebT > 0) a = 'cheer';
    else a = 'idle';
    if (a !== this.anim) { this.anim = a; this.animT = 0; }
    if (a === 'idle') this.idleT++; else this.idleT = 0;
  }

  draw(g, ox, oy) {
    if (!this.present) return;
    if (this.state === 'hide' && this.hiding) return;
    const L = this.level;
    let anim = this.anim, expr = 'neutral';
    if (this.mishapT > 0) {
      const k = this.mishapKind;
      if (k === 'fall') return;
      if (this.mishapT <= 22) return;
      anim = { ow: 'ow', zap: 'zap', splash: 'splash', caught: 'caught', bonk: 'dizzy', dizzy: 'dizzy' }[k] || 'dizzy';
    }
    if (this.state === 'pose' && this.anim) anim = this.anim;
    const quirk = (anim === 'idle' && this.idleT > 180 && (this.idleT % 360) < 140) ? this.who : null;
    if (this.celebT > 0 && anim === 'idle') anim = 'cheer';
    if (this.pushHint > 30 && anim === 'idle') expr = 'strain';
    const talk = L.isTalking(this);
    const pose = { anim, t: this.animT + this.t * 0, expr: this.mishapT > 0 ? undefined : expr, blink: this.blinkT < 0, talk, quirk, fast: this.who === 'mila', vx: this.vx };
    if (anim === 'walk') pose.t = this.t;
    if (anim === 'idle' || anim === 'cheer' || anim === 'dance' || anim === 'play' || anim === 'fix' || anim === 'hold') pose.t = this.t;
    let sx = this.sx, sy = this.sy;
    const bx = this.cx - ox, by = this.y + this.h - oy;
    if (this.flipT > 0 && !this.onGround) {
      // Mila's flip: quick squash cycle
      const k = this.flipT / 18;
      sx *= 1 - Math.sin(k * Math.PI) * 0.25; sy *= 1 + Math.sin(k * Math.PI) * 0.1;
    }
    blitPerson(g, friendSpecId(this.who, this.outfit), friendSpecFn(this.who, this.outfit), pose, bx, by + (anim === 'crawl' ? 0 : 0), { flip: this.face < 0, sx, sy, alpha: this.alpha });
    if (this.ai.confused > 0 && L.followMode) drawText('?', Math.round(bx), Math.round(by - this.h - 14), '#ffffff', { align: 'center', outline: OUTLINE });
    if (this.trickT > 0 && this.trick === 'dove') drawDove(g, bx + this.face * (60 - this.trickT), by - 30 - (60 - this.trickT) * 0.6, this.t);
  }
}

function needText(need, label) {
  const n = FRIEND_INFO[need] ? FRIEND_INFO[need].name : '';
  return label ? label + ' - needs ' + n : 'Needs ' + n;
}

const MISHAP_LINES = {
  dex: { ow: ['OW! My toe! My BIG toe!'], zap: ['That... tickled. Painfully.'], splash: ['Cold! Cold cold cold!'], caught: ['I was never here!'], fall: ['Nooo!'], bonk: ['Who threw a couch?!'] },
  mila: { ow: ['That doesn\'t count! Redo!'], zap: ['I\'m fine! Scoreboard unaffected!'], splash: ['Ugh! New shoes!'], caught: ['Best two out of three!'], fall: ['Didn\'t happen!'], bonk: ['Ow. Point for the box.'] },
  theo: { ow: ['Note to self: invent toe armor.'], zap: ['Fascinating! Ow!'], splash: ['My notes!'], caught: ['I can explain! ...I can\'t.'], fall: ['Gravity: still works!'], bonk: ['Science!'] },
  priya: { ow: ['These shoes cost more than this building!'], zap: ['My hair! My HAIR!'], splash: ['I am calling my guy!'], caught: ['Do you know who I know?'], fall: ['Not my best angle!'], bonk: ['Rude!'] },
  benny: { ow: ['That trap was NOT part of the act!'], zap: ['Ta-da...?'], splash: ['The amazing soggy magician!'], fall: ['I meant to do that!'], bonk: ['...Ta-da.'] },
  juno: { ow: ['♪ Owww-ow-ow! ♪'], zap: ['♪ Electric! ♪'], splash: ['♪ Splish splash, I\'m... wet. ♪'], caught: ['♪ Busted! ♪'], fall: ['♪ Down I go! ♪'], bonk: ['♪ Bonk! ♪'] },
};
const HIDE_LINES = {
  dex: ['I\'m a door now. A very muscular door.', 'Nobody look at my elbows.'],
  mila: ['Hiding: also a sport. I\'m winning.', 'Holloway: 0, Mila: 1.'],
  theo: ['Nobody here but us coats.', 'I am one with the fern.'],
  priya: ['I know a guy who hides in doorways. It\'s me.', 'Very chic. Very hidden.'],
  benny: ['He can\'t see me anyway. I just like doors.', 'The Great Benny... vanishes!'],
  juno: ['♪ Shh-shh-shh ♪', 'This is my quiet song.'],
};
