// ---------------------------------------------------------------------------
// The Daily Grind: the café hub
// ---------------------------------------------------------------------------
const HUB_MAP = [
  '############################################################',
  '............................................................',
  '............................................................',
  '...l...........l...........l..............l.............l...',
  '............................................................',
  '............................................................',
  '............................................................',
  '............................................................',
  '............................................................',
  '............................................................',
  '............................................................',
  '............................................................',
  '............................................................',
  '.@..........................................................',
  '############################################################',
  '############################################################',
  '############################################################',
];
const HUB_SPOTS = [
  { kind: 'door', x: 6, w: 24, label: 'Title screen' },
  { kind: 'window', x: 70, w: 120, label: 'Look outside' },
  { kind: 'couch', x: 214, w: 124, label: 'Sit on THE couch' },
  { kind: 'chalk', x: 360, w: 100, label: 'Chalkboard: episodes' },
  { kind: 'shelf', x: 476, w: 100, label: 'Golden mug shelf' },
  { kind: 'gus', x: 640, w: 40, label: 'Talk to Gus' },
  { kind: 'wardrobe', x: 790, w: 40, label: 'Lost & Found: outfits' },
  { kind: 'jukebox', x: 862, w: 30, label: 'Jukebox', decor: 'jukebox' },
];
const JUKEBOX_SONGS = [['hub', 'Rainy Day Refill'], ['title', 'The Gang\'s All Here (Theme)'], ['funk', 'Moving Day Funk'], ['sneaky', 'Lizard on the Loose'], ['panic', 'Kitchen Panic'], ['lightsout', 'Lights Out'], ['sunny', 'Sunny Side Up'], ['wedding', 'Wedding Swing'], ['snoop', 'Rule Nine Shuffle'], ['magic', 'The Great Bennini'], ['subway', 'Uptown Local'], ['expo', 'Tidy-Bot Boogie'], ['snow', 'First Snow'], ['rush', 'Rush Hour'], ['finale', 'Grand Reopening']];

class HubSpot extends Ent {
  constructor(room, s) {
    super(room, 0, 13, {}, 1, 2);
    this.s = s; this.kind = s.kind;
    this.x = s.x; this.w = s.w; this.y = 224 - 40; this.h = 40;
  }
  interactInfo() {
    if (this.s.decor && !decorOn(this.s.decor)) return null;
    return { ok: true, label: this.s.label, prio: 3 };
  }
  use(f) { this.room.level.opts.hub.useSpot(this, f); }
}
class Buddy extends Ent {
  constructor(room, friend) { super(room, 0, 0, {}, 1, 2); this.friend = friend; this.sync(); }
  sync() { const f = this.friend; this.x = f.x - 4; this.y = f.y; this.w = f.w + 8; this.h = f.h; }
  update() { super.update(); this.sync(); }
  interactInfo(f) {
    if (f === this.friend || this.friend.ctrl >= 0 || !this.friend.present) return null;
    return { ok: true, label: 'Talk to ' + FRIEND_INFO[this.friend.who].name, prio: 4 };
  }
  use(f) { this.room.level.opts.hub.banter(f, this.friend); }
}
class Wanderer extends Ent {
  // Sarge (or Tidy-Bot) roaming the café
  constructor(room, kind, x) { super(room, 0, 13, {}, 1, 1); this.kind = kind; this.x = x; this.y = 224 - 12; this.w = 18; this.h = 12; this.dir = 1; this.wait = 60; this.tx = x; }
  update() {
    super.update();
    if (this.wait > 0) { this.wait--; if (this.wait === 0) { this.tx = rnd(40, 900); this.dir = this.tx > this.x ? 1 : -1; } return; }
    const sp = this.kind === 'robot' ? 0.9 : 0.6;
    this.x += this.dir * sp;
    if (Math.abs(this.x - this.tx) < 1) this.wait = rndi(90, 300);
    if (this.kind === 'robot' && this.t % 30 === 0) Particles.dust(this.x + 9, this.y + 12, 1);
  }
  interactInfo() { return { ok: true, label: this.kind === 'robot' ? 'Pat the Tidy-Bot' : 'Say hi to Sarge', prio: 2 }; }
  use(f) {
    const L = this.room.level;
    if (this.kind === 'robot') { L.say('robot', pick(['BEEP. YOUR SHOES ARE DUSTY. VACUUMING.', 'TIDY-BOT LOVES YOU. TIDY-BOT LOVES DUST MORE.', 'WARNING: COUCH CRUMB LEVELS CRITICAL.']), this); AudioSys.sfx('robot'); }
    else { L.say('sarge', pick(SARGE_LINES), this); AudioSys.sfx('squeak'); }
  }
  draw(g, ox, oy) {
    if (this.kind === 'robot') drawRobot(g, this.x + 9 - ox, this.y + 12 - oy, this.dir < 0, this.t, {});
    else drawIguana(g, this.x + 9 - ox, this.y + 12 - oy, this.dir < 0, this.t, { moving: this.wait <= 0 });
  }
}

class HubScene {
  constructor() {
    this.t = 0; this.overlay = null; this.wantsTouch = true;
    const self = this;
    const def = { name: 'The Daily Grind', theme: 'cafe', map: HUB_MAP, cast: FRIENDS, start: Save.data.hubWho || 'dex' };
    this.level = new LevelScene(0, { hub: this, hubDef: def, drawBack: (g, ox, oy) => self.drawBack(g, ox, oy), hudInHub: true });
    const L = this.level;
    L.followMode = false;
    // place the gang around the café
    const spots = { dex: [234, true], priya: [262, true], juno: [290, true], theo: [420, false], mila: [150, false], benny: [600, false] };
    for (const f of L.friends) {
      const sp = spots[f.who];
      f.x = sp[0]; f.y = 224 - f.h; f.sitting = sp[1]; f.face = f.who === 'benny' ? -1 : 1; f.checkpoint = { x: f.x, y: f.y };
      f.alpha = 1; f.fadeIn = 0;
    }
    const me = L.p1();
    me.x = 40; me.sitting = false; me.face = 1;
    // hub entities
    for (const s of HUB_SPOTS) L.room.ents.push(new HubSpot(L.room, s));
    for (const f of L.friends) L.room.ents.push(new Buddy(L.room, f));
    if (decorOn('terrarium')) L.room.ents.push(new Wanderer(L.room, 'sarge', 500));
    if (decorOn('tidybot')) L.room.ents.push(new Wanderer(L.room, 'robot', 700));
    L.updateCamera(true);
    this.gusT = 0; this.banterIdx = {};
    this.welcome = 0;
  }
  enter() {
    Music.play(this.jukebox ? this.jukebox : 'hub', { fadeIn: 1 });
    // welcome line from Gus based on progress
    this.welcome = 60;
  }
  update() {
    this.t++;
    if (this.welcome > 0 && --this.welcome === 0) {
      const L = this.level;
      L.say('gus', pick(gusLines()), this.gusEnt());
    }
    if (this.overlay) {
      this.overlay.update();
      if (this.overlay.closed) this.overlay = null;
      Particles.update();
      return;
    }
    this.level.update();
    // remember who we're playing as
    const p = this.level.p1();
    if (p && Save.data.hubWho !== p.who) { Save.data.hubWho = p.who; }
    // stand up when moving
    for (const f of this.level.friends) if (f.sitting && f.ctrl >= 0 && (Math.abs(f.vx) > 0.1 || !f.onGround)) f.sitting = false;
  }
  gusEnt() { return this.level.room.ents.find(e => e instanceof HubSpot && e.kind === 'gus'); }
  useSpot(spot, f) {
    const L = this.level;
    switch (spot.kind) {
      case 'chalk': this.overlay = new EpisodeBoard(); AudioSys.sfx('select'); break;
      case 'shelf': this.overlay = new ShelfView(); AudioSys.sfx('select'); break;
      case 'wardrobe': this.overlay = new Wardrobe(f.who); AudioSys.sfx('select'); break;
      case 'gus': L.say('gus', pick(gusLines()), spot); break;
      case 'door': Game.go(new TitleScene()); break;
      case 'window': f.say(pick(WINDOW_LINES)); break;
      case 'couch': {
        f.x = clamp(f.x, 222, 320); f.sitting = true; f.vx = 0;
        f.say(pick(COUCH_LINES[f.who] || ['Ahh. The couch.']));
        if (Math.random() < 0.5) setTimeout(() => { L.say('gus', pick(['That couch is for paying customers.', 'You know that couch has a dent shaped like you six?', 'I should charge rent for that couch.', 'One day I\'m putting a meter on that thing.']), this.gusEnt()); AudioSys.audience('chuckle', 0.5); }, 1600);
        break;
      }
      case 'jukebox': {
        const i = (JUKEBOX_SONGS.findIndex(s => s[0] === (this.jukebox || 'hub')) + 1) % JUKEBOX_SONGS.length;
        this.jukebox = JUKEBOX_SONGS[i][0];
        Music.play(this.jukebox, { fadeIn: 0.5 });
        L.toastAt(spot.cx, spot.y - 6, '♪ ' + JUKEBOX_SONGS[i][1], '#4cc9f0', 150);
        break;
      }
      default: break;
    }
  }
  banter(me, them) {
    const L = this.level;
    const ex = pickBanter(me.who, them.who, this.banterIdx);
    them.face = me.cx > them.cx ? 1 : -1; me.face = them.cx > me.cx ? 1 : -1;
    const lines = ex.map(([who, text]) => [who === 'me' ? me.who : who === 'them' ? them.who : who, text]);
    L.lineQueue = []; L.queueLines(lines, 0);
  }
  draw() {
    this.level.draw();
    // hub HUD extras
    const d = doneCount(Save.data), m = mugCount(Save.data);
    panel(W - 128, 24, 124, 14, 'rgba(27,16,32,0.8)', '#4a3a5a');
    drawText('EPISODES ' + d + '/13  MUGS ' + m + '/13', W - 66, 27, '#f6ead8', { align: 'center' });
    if (d === 0 && !this.overlay) {
      const a = 0.6 + Math.sin(this.t / 10) * 0.4;
      drawText('Walk to the chalkboard and press E to pick an episode!', W / 2, 46, '#ffd23f', { align: 'center', outline: OUTLINE, alpha: a });
    }
    if (this.overlay) this.overlay.draw();
  }
  // café dressing drawn behind the actors
  drawBack(g, ox, oy) {
    const t = this.t;
    const P = (kind, x, y, data) => drawSetProp(g, kind, x - ox, y - oy, t, data);
    // window with rain & the street
    P('window', 70, 80, {});
    if (decorOn('snowman')) { drawSetProp(g, 'snowpile', 70 - ox, 158 - oy, t); g.fillStyle = '#f4f8fc'; }
    if (decorOn('flamingo')) { const fx = 196 - ox, fy = 188 - oy; g.fillStyle = '#ff7aa8'; g.fillRect(fx, fy, 6, 8); g.fillRect(fx + 4, fy - 10, 2, 10); g.fillRect(fx + 4, fy - 12, 5, 3); g.fillStyle = '#222'; g.fillRect(fx + 2, fy + 8, 1, 16); g.fillRect(fx + 4, fy + 8, 1, 16); }
    // couch + coffee table + lamp
    if (decorOn('goldcouch')) { g.save(); P('couch', 216, 186, null); g.globalCompositeOperation = 'color'; g.fillStyle = 'rgba(245,197,66,0.9)'; g.fillRect(208 - ox, 180 - oy, 140, 46); g.restore(); }
    else P('couch', 216, 186, null);
    P('coffeetable', 246, 210);
    P('lamp', 190, 160);
    if (decorOn('candles')) { for (let i = 0; i < 3; i++) { g.fillStyle = '#f4efe6'; g.fillRect(258 + i * 14 - ox, 202 - oy, 3, 6); g.fillStyle = (t >> 3) % 2 ? '#ffd23f' : '#ff8a3a'; g.fillRect(258 + i * 14 - ox, 199 - oy, 3, 3); } }
    // chalkboard
    drawChalkboard(g, 360 - ox, 70 - oy, t);
    // shelf
    drawMugShelf(g, 476 - ox, 92 - oy, t);
    // counter & Gus
    P('counter', 600, 166);
    blitPerson(g, 'npc:gus', npcSpecFn('gus'), { anim: 'idle', t, expr: 'neutral', blink: (t % 210) < 6, talk: this.level.isTalking(this.gusEnt()) }, 660 - ox, 166 - oy + 6, { flip: true });
    P('counter', 600, 166);
    // menu board over counter
    g.fillStyle = '#2a1a10'; g.fillRect(604 - ox, 62 - oy, 140, 44); g.fillStyle = '#3a2a1e'; g.fillRect(606 - ox, 64 - oy, 136, 40);
    drawText('ESPRESSO  2', 612 - ox, 70 - oy, '#f6ead8', { g }); drawText('CAPPUCCINO  3', 612 - ox, 81 - oy, '#f6ead8', { g }); drawText('THE COUCH  PRICELESS', 612 - ox, 92 - oy, '#ffb0a0', { g });
    // lost & found box
    g.fillStyle = '#8a5a34'; g.fillRect(790 - ox, 196 - oy, 40, 28); g.fillStyle = '#a87a4a'; g.fillRect(790 - ox, 196 - oy, 40, 4);
    drawText('LOST &', 810 - ox, 203 - oy, '#3a2010', { g, align: 'center' }); drawText('FOUND', 810 - ox, 212 - oy, '#3a2010', { g, align: 'center' });
    g.fillStyle = '#c83a3a'; g.fillRect(796 - ox, 190 - oy, 10, 6); g.fillStyle = '#2ec4b6'; g.fillRect(812 - ox, 188 - oy, 8, 8); g.fillStyle = '#ffd23f'; g.fillRect(822 - ox, 191 - oy, 6, 5);
    // jukebox
    if (decorOn('jukebox')) {
      const jx = 862 - ox, jy = 178 - oy;
      g.fillStyle = '#7a2a3a'; g.fillRect(jx, jy, 30, 46); g.fillStyle = '#ffd23f'; g.fillRect(jx + 3, jy + 3, 24, 14);
      g.fillStyle = ['#ff4f9a', '#4cc9f0', '#7cf29a'][(t >> 4) % 3]; g.fillRect(jx + 5, jy + 5, 20, 10);
      g.fillStyle = '#3a1a20'; for (let i = 0; i < 4; i++) g.fillRect(jx + 5, jy + 22 + i * 5, 20, 2);
      if (this.jukebox && t % 30 === 0) Particles.notes(862 + 15, 172, 1);
    }
    // wall decorations
    if (decorOn('lights')) for (let x = 0; x < 960; x += 16) { const sag = Math.sin(x / 40) * 4; g.fillStyle = '#3a2a2a'; g.fillRect(x - ox, 36 + sag - oy, 16, 1); g.fillStyle = ['#ff5a5a', '#ffd23f', '#5ae0a0', '#5ab0ff'][(x / 16) % 4]; g.fillRect(x + 7 - ox, 37 + sag - oy, 2, 3); }
    if (decorOn('certificate')) { g.fillStyle = '#c8a040'; g.fillRect(560 - ox, 140 - oy, 24, 18); g.fillStyle = '#f4efe6'; g.fillRect(562 - ox, 142 - oy, 20, 14); drawText('A-', 572 - ox, 145 - oy, '#3a8a3a', { g, align: 'center' }); }
    if (decorOn('poster')) { g.fillStyle = '#5a189a'; g.fillRect(930 - ox, 100 - oy, 26, 36); g.fillStyle = '#ffd166'; g.fillRect(934 - ox, 104 - oy, 18, 4); drawText('GREAT', 943 - ox, 112 - oy, '#ffd166', { g, align: 'center' }); drawText('BENNY', 943 - ox, 122 - oy, '#ffffff', { g, align: 'center' }); }
    if (decorOn('subwaymap')) { g.fillStyle = '#f4efe6'; g.fillRect(890 - ox, 60 - oy, 40, 28); g.fillStyle = '#c83a3a'; g.fillRect(894 - ox, 70 - oy, 32, 2); g.fillStyle = '#3a6ac8'; g.fillRect(908 - ox, 62 - oy, 2, 24); g.fillStyle = '#3a9a4a'; g.fillRect(896 - ox, 80 - oy, 30, 2); }
    if (decorOn('rulebook')) { g.fillStyle = '#5a3a22'; g.fillRect(560 - ox, 84 - oy, 12, 6); drawText('RULES', 566 - ox, 76 - oy, '#c8b8a8', { g, align: 'center' }); }
    if (decorOn('postcard')) { g.fillStyle = '#c8a040'; g.fillRect(150 - ox, 40 - oy, 30, 18); g.fillStyle = '#f4f4f8'; g.fillRect(152 - ox, 42 - oy, 26, 14); g.fillStyle = '#3a6ac8'; g.fillRect(152 - ox, 42 - oy, 26, 4); }
    if (decorOn('neon')) { const on = (t >> 3) % 9 !== 0; drawText('GRAND REOPENING', 480 - ox, 46 - oy, on ? '#ff4f9a' : '#5a2a3a', { g, align: 'center', scale: 2, outline: on ? '#3a0a1a' : undefined }); }
    if (decorOn('snowman')) { drawCupIcon(g, 286 - ox, 200 - oy); }
    // plants
    drawDecor(g, 'f', 340 - ox, 192 - oy, THEMES.cafe, null, {});
    drawDecor(g, 'f', 900 - ox, 192 - oy, THEMES.cafe, null, {});
    drawDecor(g, 'b', 920 - ox, 176 - oy, THEMES.cafe, null, {});
    // door
    P('door', 6, 176);
  }
}

function drawChalkboard(g, x, y, t) {
  g.fillStyle = '#5a3a22'; g.fillRect(x, y, 100, 76); g.fillStyle = '#24342c'; g.fillRect(x + 4, y + 4, 92, 68);
  drawText('TONIGHT ON', x + 50, y + 8, '#f4efe6', { g, align: 'center' });
  drawText('THE GANG\'S', x + 50, y + 20, '#ffd23f', { g, align: 'center' });
  drawText('ALL HERE', x + 50, y + 30, '#ffd23f', { g, align: 'center' });
  const d = doneCount(Save.data);
  drawText('Episodes: ' + d + '/13', x + 50, y + 46, '#bfe0c8', { g, align: 'center' });
  if ((t >> 5) % 2) drawText('(press E)', x + 50, y + 58, '#8aa898', { g, align: 'center' });
  g.fillStyle = '#e8e4d8'; g.fillRect(x + 80, y + 70, 8, 2);
}
function drawMugShelf(g, x, y, t) {
  g.fillStyle = '#6a4a2a'; g.fillRect(x, y + 20, 100, 4); g.fillRect(x, y + 50, 100, 4);
  g.fillStyle = '#4a2e1a'; g.fillRect(x + 4, y + 24, 3, 4); g.fillRect(x + 93, y + 24, 3, 4); g.fillRect(x + 4, y + 54, 3, 4); g.fillRect(x + 93, y + 54, 3, 4);
  for (let i = 0; i < 13; i++) {
    const row = i < 7 ? 0 : 1, col = row ? i - 7 : i;
    const mx = x + 4 + col * 14 + (row ? 7 : 0), my = y + (row ? 36 : 6);
    const got = !!Save.data.mugs[i];
    drawMugIcon(g, mx, my, t + i * 9, !got);
  }
  drawText('GOLDEN MUGS', x + 50, y - 6, '#f5c542', { g, align: 'center' });
}

// ---------------------------------------------------------------------------
// Hub overlays: chalkboard (episodes), shelf (trophies), wardrobe (outfits)
// ---------------------------------------------------------------------------
class EpisodeBoard {
  constructor() { this.sel = Math.min(12, Math.max(0, firstUnplayed())); this.closed = false; this.t = 0; }
  update() {
    this.t++;
    const m = Input.menu;
    const col = this.sel === 12 ? 2 : Math.floor(this.sel / 6), row = this.sel === 12 ? 0 : this.sel % 6;
    if (m.down) { this.sel = this.sel === 12 ? 12 : (row < 5 ? this.sel + 1 : this.sel); AudioSys.sfx('move'); }
    if (m.up) { this.sel = this.sel === 12 ? 12 : (row > 0 ? this.sel - 1 : this.sel); AudioSys.sfx('move'); }
    if (m.right) { this.sel = col === 0 ? this.sel + 6 : 12; AudioSys.sfx('move'); }
    if (m.left) { this.sel = this.sel === 12 ? 6 + Math.min(5, row) : col === 1 ? this.sel - 6 : this.sel; AudioSys.sfx('move'); }
    for (let i = 0; i < 13; i++) { const r = this.rect(i); if (Input.clickIn(r.x, r.y, r.w, r.h)) { if (this.sel === i) this.play(); else { this.sel = i; AudioSys.sfx('move'); } return; } }
    if (Input.clickIn(W - 40, 8, 32, 14)) { this.close(); return; }
    if (m.ok && this.t > 5) this.play();
    if (m.back && this.t > 5) this.close();
  }
  rect(i) {
    if (i === 12) return { x: 340, y: 74, w: 124, h: 120 };
    const c = Math.floor(i / 6), r = i % 6;
    return { x: 18 + c * 160, y: 52 + r * 32, w: 156, h: 30 };
  }
  play() {
    if (!epUnlocked(this.sel)) { AudioSys.sfx('deny'); return; }
    AudioSys.sfx('confirm');
    this.closed = true;
    Music.stop(0.4);
    playEpisode(this.sel);
  }
  close() { this.closed = true; AudioSys.sfx('back'); }
  draw() {
    ctx.fillStyle = 'rgba(10,6,16,0.6)'; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#5a3a22'; ctx.fillRect(8, 8, W - 16, H - 16);
    ctx.fillStyle = '#24342c'; ctx.fillRect(12, 12, W - 24, H - 24);
    // chalk dust
    ctx.fillStyle = 'rgba(255,255,255,0.04)'; for (let i = 0; i < 40; i++) ctx.fillRect(hash2(i, 1, 5) * W, hash2(i, 2, 5) * H, 20, 2);
    drawText('WHAT\'S ON TONIGHT?', W / 2, 18, '#f4efe6', { align: 'center', scale: 2 });
    drawText('SEASON 1', 96, 40, '#ffd23f', { align: 'center' });
    drawText('SEASON 2', 256, 40, '#ffd23f', { align: 'center' });
    drawText('X', W - 24, 12, '#f4efe6', { scale: 2 });
    for (let i = 0; i < 13; i++) {
      const r = this.rect(i), ep = EPISODES[i], sel = i === this.sel, un = epUnlocked(i);
      ctx.strokeStyle = sel ? '#ffd23f' : 'rgba(244,239,230,0.25)'; ctx.lineWidth = 1;
      ctx.strokeRect(r.x + 0.5, r.y + 0.5, r.w - 1, r.h - 1);
      if (i === 12) {
        drawText('THE FINALE', r.x + r.w / 2, r.y + 8, un ? '#ff8fab' : '#5a6a62', { align: 'center' });
        drawText(un ? 'The Grand' : '???', r.x + r.w / 2, r.y + 30, un ? '#f4efe6' : '#5a6a62', { align: 'center', scale: 1 });
        if (un) drawText('Reopening', r.x + r.w / 2, r.y + 42, '#f4efe6', { align: 'center' });
        if (!un) drawText('Finish all 12', r.x + r.w / 2, r.y + 56, '#5a6a62', { align: 'center' });
        this.drawStatus(i, r.x + r.w / 2 - 22, r.y + 80);
        continue;
      }
      drawText((i % 6 + 1) + '.', r.x + 5, r.y + 5, un ? '#f4efe6' : '#5a6a62');
      drawText(un ? fitText(ep.title, r.w - 22) : 'Locked', r.x + 17, r.y + 5, un ? (sel ? '#ffffff' : '#d8e8d0') : '#5a6a62');
      this.drawStatus(i, r.x + 17, r.y + 17);
    }
    // detail strip
    const ep = EPISODES[this.sel];
    if (epUnlocked(this.sel)) {
      const lines = wrapText(ep.blurb || '', W - 356).slice(0, 4);
      lines.forEach((l, k) => drawText(l, 340, 196 + k * 9, '#f4efe6', {}));
      drawText(Input.lastDevice === 'touch' ? 'Tap again to roll!' : 'E: ROLL CAMERA!', 340, 236, '#ffd23f', {});
    } else wrapText('Finish the previous episode first.', W - 356).forEach((l, k) => drawText(l, 340, 199 + k * 10, '#8aa898', {}));
  }
  drawStatus(i, x, y) {
    const S = Save.data;
    if (!S.done[i]) { if (epUnlocked(i)) drawText('NEW!', x, y, '#ff8fab'); return; }
    for (let k = 0; k < 3; k++) drawText('★', x + k * 9, y - 1, k < (S.stars[i] || 0) ? '#ffd23f' : '#4a5a52');
    drawMugIcon(ctx, x + 30, y - 3, this.t, !S.mugs[i]);
  }
}
function firstUnplayed() { for (let i = 0; i < 13; i++) if (!Save.data.done[i]) return epUnlocked(i) ? i : 0; return 12; }

class ShelfView {
  constructor() { this.closed = false; this.t = 0; }
  update() { this.t++; if (this.t > 5 && (Input.menu.ok || Input.menu.back || Input.clicks.length)) { Input.clicks.length = 0; this.closed = true; AudioSys.sfx('back'); } }
  draw() {
    ctx.fillStyle = 'rgba(10,6,16,0.8)'; ctx.fillRect(0, 0, W, H);
    panel(16, 10, W - 32, H - 20, '#22182c', '#f5c542');
    drawText('THE GOLDEN MUG SHELF', W / 2, 18, '#f5c542', { align: 'center', scale: 2 });
    for (let i = 0; i < 13; i++) {
      const x = 34 + (i % 7) * 60, y = 46 + Math.floor(i / 7) * 40;
      const got = !!Save.data.mugs[i];
      ctx.save(); ctx.translate(x, y); ctx.scale(2, 2); drawMugIcon(ctx, 0, 0, this.t + i * 7, !got); ctx.restore();
      drawText(i === 12 ? 'FIN' : 'E' + (i + 1), x + 14, y + 31, got ? '#f5c542' : '#5a4a6a', { align: 'center' });
    }
    drawText('UNLOCKS', 40, 132, '#ffd23f');
    const all = UNLOCKS.outfits.map(o => ({ n: 'Outfit: ' + o.name, ok: o.cond(Save.data), h: o.hint })).concat(UNLOCKS.decor.map(d => ({ n: 'Cafe: ' + d.name, ok: d.cond(Save.data), h: d.hint })));
    all.forEach((u, i) => {
      const x = 40 + (i < 10 ? 0 : 205), y = 146 + (i % 10) * 10;
      drawText((u.ok ? '★ ' : '- ') + (u.ok ? u.n : u.h), x, y, u.ok ? '#f6ead8' : '#6a5a7a');
    });
  }
}

class Wardrobe {
  constructor(who) { this.who = FRIENDS.indexOf(who); this.closed = false; this.t = 0; this.sel = (Save.data.outfits[who] || 0); }
  update() {
    this.t++;
    const m = Input.menu;
    const w = FRIENDS[this.who];
    if (m.left) { this.who = (this.who + 5) % 6; this.sel = Save.data.outfits[FRIENDS[this.who]] || 0; AudioSys.sfx('move'); }
    if (m.right) { this.who = (this.who + 1) % 6; this.sel = Save.data.outfits[FRIENDS[this.who]] || 0; AudioSys.sfx('move'); }
    if (m.up) { this.sel = (this.sel + OUTFITS.length - 1) % OUTFITS.length; AudioSys.sfx('move'); }
    if (m.down) { this.sel = (this.sel + 1) % OUTFITS.length; AudioSys.sfx('move'); }
    for (let i = 0; i < OUTFITS.length; i++) if (Input.clickIn(250, 56 + i * 22, 200, 20)) { this.sel = i; this.equip(); return; }
    if (Input.clickIn(20, 100, 40, 60)) { this.who = (this.who + 5) % 6; this.sel = Save.data.outfits[FRIENDS[this.who]] || 0; return; }
    if (Input.clickIn(200, 100, 40, 60)) { this.who = (this.who + 1) % 6; this.sel = Save.data.outfits[FRIENDS[this.who]] || 0; return; }
    if (Input.clickIn(W - 40, 8, 32, 14)) { this.closed = true; return; }
    if (m.ok && this.t > 5) this.equip();
    if (m.back && this.t > 5) { this.closed = true; AudioSys.sfx('back'); }
    void w;
  }
  equip() {
    if (!outfitUnlocked(this.sel)) { AudioSys.sfx('deny'); return; }
    Save.data.outfits[FRIENDS[this.who]] = this.sel; Save.write();
    AudioSys.sfx('magic'); Particles.puff(130, 150, 14);
    PortraitCache.clear();
  }
  draw() {
    ctx.fillStyle = 'rgba(10,6,16,0.8)'; ctx.fillRect(0, 0, W, H);
    panel(10, 8, W - 20, H - 16, '#22182c', '#a66bf0');
    drawText('LOST & FOUND', W / 2, 16, '#d8b8ff', { align: 'center', scale: 2 });
    drawText('X', W - 32, 12, '#f4efe6', { scale: 2 });
    const who = FRIENDS[this.who];
    drawText('<', 36, 120, '#ffd23f', { scale: 3 }); drawText('>', 214, 120, '#ffd23f', { scale: 3 });
    const preview = outfitUnlocked(this.sel) ? this.sel : (Save.data.outfits[who] || 0);
    blitPerson(ctx, friendSpecId(who, preview), friendSpecFn(who, preview), { anim: 'idle', t: this.t, expr: 'happy', quirk: who }, 130, 196, { sx: 3, sy: 3 });
    drawText(FRIEND_INFO[who].name, 130, 206, FRIEND_INFO[who].color, { align: 'center', scale: 2 });
    OUTFITS.forEach((o, i) => {
      const y = 56 + i * 22, sel = i === this.sel, un = outfitUnlocked(i), worn = (Save.data.outfits[who] || 0) === i;
      panel(250, y, 200, 20, sel ? '#3e2c4e' : '#2a1e36', sel ? '#ffd23f' : '#4a3a5a');
      drawText(un ? o.name : 'LOCKED', 258, y + 6, un ? '#f6ead8' : '#6a5a7a');
      if (!un) { const u = UNLOCKS.outfits.find(q => q.id === i); drawText(u ? u.hint : '', 444, y + 6, '#8a7a9a', { align: 'right' }); }
      if (worn) drawText('WEARING', 444, y + 6, '#7cf29a', { align: 'right' });
    });
    drawText('←/→ friend   ↑/↓ outfit   E to wear', W / 2, H - 22, '#c8b8d8', { align: 'center' });
    Particles.draw(ctx, 0, 0);
  }
}
