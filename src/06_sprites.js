// ---------------------------------------------------------------------------
// Character sprites: parametric pixel people drawn in code, cached per pose.
// ---------------------------------------------------------------------------
const OUTLINE = '#1b1020';
const SPR_W = 40, SPR_H = 48, FOOT_Y = 47;

const FRIENDS = ['dex', 'mila', 'theo', 'priya', 'benny', 'juno'];
const FRIEND_INFO = {
  dex: { name: 'DEX', color: '#e8504a', ability: 'Strength', verb: 'Push / Lift', desc: 'Pushes heavy stuff. Lifts shutters.' },
  mila: { name: 'MILA', color: '#2ec4b6', ability: 'Agility', verb: 'Double-jump / Climb', desc: 'Double-jumps. Climbs drainpipes.' },
  theo: { name: 'THEO', color: '#8fb33a', ability: 'Tinkerer', verb: 'Fix', desc: 'Fixes anything (except toasters).' },
  priya: { name: 'PRIYA', color: '#e0408a', ability: 'Charmer', verb: 'Talk', desc: 'Talks past grumpy people.' },
  benny: { name: 'BENNY', color: '#a66bf0', ability: 'Small & Sneaky', verb: 'Vents', desc: 'Crawls through vents. Unseen.' },
  juno: { name: 'JUNO', color: '#4cc9f0', ability: 'Musician', verb: 'Play', desc: 'Plays tunes. Distracts. Opens sound doors.' },
};

const BASE_SPECS = {
  dex: { skin: '#8d5a3b', hair: '#1c1412', hairStyle: 'buzz', top: '#d63c3c', top2: '#f4efe6', topStyle: 'track', bottom: '#2b2e4a', bottom2: '#f4efe6', bottomStyle: 'trackpants', shoes: '#f4efe6', legH: 9, torsoH: 11, torsoW: 14, headW: 11, headH: 10, armW: 3, acc: { whistle: true, brows: 'thick', stubble: true } },
  mila: { skin: '#f2c6a0', hair: '#e8742a', hairStyle: 'pony', top: '#2ec4b6', top2: '#ffd23f', topStyle: 'windbreaker', bottom: '#20212b', bottomStyle: 'shorts', shoes: '#ff6b35', legH: 9, torsoH: 9, torsoW: 9, headW: 10, headH: 10, armW: 2, acc: { helmet: '#2ec4b6', helmet2: '#ffd23f', freckles: true, strap: '#7a4a24', gloves: '#20212b' } },
  theo: { skin: '#e9b993', hair: '#6b4a2e', hairStyle: 'messy', top: '#6a8d3a', top2: '#efe2b4', topStyle: 'cardigan', bottom: '#5b4a3a', bottomStyle: 'pants', shoes: '#3b2a20', legH: 10, torsoH: 10, torsoW: 9, headW: 10, headH: 10, armW: 2, acc: { glasses: '#2a1e16', goggles: '#c7a14b', toolbelt: '#8a5a2b' } },
  priya: { skin: '#b07850', hair: '#141018', hairStyle: 'bob', top: '#c2185b', top2: '#fbe9f0', topStyle: 'blazer', bottom: '#2a1b3d', bottomStyle: 'skirt', shoes: '#1a1020', legH: 9, torsoH: 9, torsoW: 9, headW: 10, headH: 10, armW: 2, acc: { earrings: '#ffd700', buttons: '#ffd700', lipstick: '#8e1b3e' } },
  benny: { skin: '#f0c8a8', hair: '#3b2418', hairStyle: 'curly', top: '#9b5de5', top2: '#f4f1ea', topStyle: 'vest', bottom: '#1b1b2b', bottomStyle: 'pants', shoes: '#e63946', legH: 5, torsoH: 6, torsoW: 8, headW: 10, headH: 9, armW: 2, acc: { tophat: '#1b1b2b', hatband: '#9b5de5', bowtie: '#e63946', cape: '#5a189a', capeStars: '#ffd166' } },
  juno: { skin: '#6b4630', hair: '#2a1f3d', hair2: '#4cc9f0', hairStyle: 'puffs', top: '#4a6fa5', top2: '#ff4f9a', topStyle: 'denim', bottom: '#2b2b3a', bottomStyle: 'pants', shoes: '#f4efe6', legH: 9, torsoH: 9, torsoW: 9, headW: 10, headH: 10, armW: 2, acc: { headphones: '#ff4f9a', keytar: '#ff4f9a', pins: true } },
};

const OUTFITS = [
  { id: 'classic', name: 'Classic' },
  { id: 'pajamas', name: 'Pajama Party' },
  { id: 'tux', name: 'Wedding Band Tux' },
  { id: 'bowling', name: 'Team Bowling Shirts' },
  { id: 'sweater', name: 'Holiday Sweaters' },
  { id: 'gold', name: 'Solid Gold' },
];
const OUTFIT_COLORS = {
  pajamas: { dex: '#8fb0e0', mila: '#9be3c6', theo: '#ffc79e', priya: '#ff9fb2', benny: '#cfa6ff', juno: '#a8d8ff' },
  sweater: { dex: '#c1121f', mila: '#2a9d8f', theo: '#d9a520', priya: '#6a4c93', benny: '#2b9348', juno: '#1d3557' },
};
function specFor(who, outfit) {
  const b = BASE_SPECS[who];
  const s = JSON.parse(JSON.stringify(b));
  const o = OUTFITS[outfit || 0] ? OUTFITS[outfit || 0].id : 'classic';
  if (o === 'pajamas') {
    s.top = OUTFIT_COLORS.pajamas[who]; s.top2 = '#fffaf0'; s.topStyle = 'pajama';
    s.bottom = s.top; s.bottomStyle = 'pants'; s.shoes = '#efe4d2';
    delete s.acc.helmet; delete s.acc.goggles; delete s.acc.toolbelt; delete s.acc.strap; delete s.acc.gloves; delete s.acc.whistle;
    if (who === 'benny') { delete s.acc.tophat; delete s.acc.cape; delete s.acc.bowtie; s.acc.nightcap = '#cfa6ff'; }
    if (who === 'priya') { s.acc.sleepmask = '#ff7aa8'; delete s.acc.buttons; }
    if (who === 'dex') s.acc.teddy = true;
  } else if (o === 'tux') {
    s.top = '#1d1d26'; s.top2 = '#f7f4ee'; s.topStyle = 'tux'; s.bottom = '#1d1d26'; s.bottomStyle = 'pants'; s.shoes = '#0d0d12';
    s.acc.bowtie = FRIEND_INFO[who].color;
    delete s.acc.helmet; delete s.acc.goggles; delete s.acc.toolbelt; delete s.acc.strap; delete s.acc.gloves; delete s.acc.whistle; delete s.acc.buttons;
    if (who === 'benny') { s.acc.tophat = '#1d1d26'; s.acc.hatband = '#e63946'; delete s.acc.cape; }
  } else if (o === 'bowling') {
    s.top = '#e9c46a'; s.top2 = '#264653'; s.topStyle = 'bowling'; s.bottom = '#264653'; s.bottomStyle = 'pants'; s.shoes = '#9c2c2c';
    delete s.acc.toolbelt; delete s.acc.strap; delete s.acc.whistle; delete s.acc.buttons; delete s.acc.cape; delete s.acc.bowtie;
  } else if (o === 'sweater') {
    s.top = OUTFIT_COLORS.sweater[who]; s.top2 = '#fbf6ec'; s.topStyle = 'sweater';
    s.bottom = '#3a3242'; s.bottomStyle = 'pants'; s.shoes = '#5a3a2a';
    delete s.acc.helmet; delete s.acc.toolbelt; delete s.acc.strap; delete s.acc.whistle; delete s.acc.buttons; delete s.acc.cape; delete s.acc.bowtie;
    if (who === 'mila' || who === 'dex') s.acc.beanie = '#fbf6ec';
    if (who === 'benny') { delete s.acc.tophat; s.acc.beanie = '#c1121f'; }
  } else if (o === 'gold') {
    s.top = '#e0b13a'; s.top2 = '#fff1b8'; s.topStyle = 'suit'; s.bottom = '#c99a2e'; s.bottomStyle = 'pants'; s.shoes = '#fff1b8';
    s.acc.sparkle = true;
    delete s.acc.toolbelt; delete s.acc.strap; delete s.acc.whistle; delete s.acc.buttons;
    if (who === 'benny') { s.acc.tophat = '#e0b13a'; s.acc.hatband = '#fff1b8'; s.acc.cape = '#c99a2e'; }
    if (who === 'mila') { s.acc.helmet = '#e0b13a'; s.acc.helmet2 = '#fff1b8'; }
  }
  s.who = who;
  return s;
}

// Recurring side characters & guest NPC looks
const NPC_SPECS = {
  gus: { skin: '#e0ac8a', hair: '#b8b2a8', hairStyle: 'bald', top: '#3d6b4f', top2: '#f3eee4', topStyle: 'apron', bottom: '#4b4038', bottomStyle: 'pants', shoes: '#2a2420', legH: 9, torsoH: 11, torsoW: 13, headW: 11, headH: 10, armW: 3, acc: { mustache: '#b8b2a8', brows: 'bushy', towel: true } },
  holloway: { skin: '#f0d0b8', hair: '#9a968e', hairStyle: 'combover', top: '#c9a227', top2: '#ebe4d2', topStyle: 'sweatervest', bottom: '#5c5248', bottomStyle: 'pants', shoes: '#2b211b', legH: 11, torsoH: 10, torsoW: 8, headW: 10, headH: 10, armW: 2, acc: { glasses: '#3a2a1e', bowtie: '#7a1f2b', mustache: '#9a968e', thinStache: true, clipboard: true } },
  roz: { skin: '#d9a07a', hair: '#e8e3f0', hairStyle: 'bouffant', top: '#7b2d8b', top2: '#ffd166', topStyle: 'gown', bottom: '#7b2d8b', bottomStyle: 'gown', shoes: '#ffd166', legH: 9, torsoH: 10, torsoW: 10, headW: 10, headH: 10, armW: 2, acc: { pearls: true, shawl: '#ffd166', lipstick: '#b0204a' } },
  fenwick: { skin: '#e8c4a8', hair: '#7a6f66', hairStyle: 'short', top: '#7a9cc6', top2: '#f2e6d0', topStyle: 'robe', bottom: '#7a9cc6', bottomStyle: 'robe', shoes: '#d8c4a0', legH: 9, torsoH: 10, torsoW: 10, headW: 10, headH: 10, armW: 2, acc: { curlers: true, brows: 'bushy' } },
  inspector: { skin: '#c99a76', hair: '#2a2420', hairStyle: 'short', top: '#5a5f66', top2: '#e8e8e8', topStyle: 'suit', bottom: '#4a4f56', bottomStyle: 'pants', shoes: '#1a1a1e', legH: 10, torsoH: 10, torsoW: 9, headW: 10, headH: 10, armW: 2, acc: { hat: '#3a3f46', clipboard: true, glasses: '#1a1a1e', tie: '#a03030' } },
  guard: { skin: '#9a6a48', hair: '#1a1410', hairStyle: 'short', top: '#2f4a7a', top2: '#d8d8d8', topStyle: 'uniform', bottom: '#1f2f4f', bottomStyle: 'pants', shoes: '#111', legH: 10, torsoH: 11, torsoW: 12, headW: 10, headH: 10, armW: 3, acc: { cap: '#1f2f4f', badge: '#ffd700' } },
  planner: { skin: '#d8a888', hair: '#3a2418', hairStyle: 'bun', top: '#1e1e24', top2: '#d0d0d0', topStyle: 'suit', bottom: '#1e1e24', bottomStyle: 'skirt', shoes: '#111', legH: 9, torsoH: 9, torsoW: 9, headW: 10, headH: 10, armW: 2, acc: { headset: '#333', clipboard: true } },
  officer: { skin: '#e2b896', hair: '#5a3a22', hairStyle: 'short', top: '#3b6ea8', top2: '#e0e0e0', topStyle: 'uniform', bottom: '#2a2a40', bottomStyle: 'pants', shoes: '#111', legH: 9, torsoH: 10, torsoW: 10, headW: 10, headH: 10, armW: 2, acc: { cap: '#2a2a40', badge: '#ffd700', ticketbook: true } },
  mime: { skin: '#f6f0ea', hair: '#111', hairStyle: 'short', top: '#f6f0ea', top2: '#1a1a1a', topStyle: 'stripes', bottom: '#1a1a1a', bottomStyle: 'pants', shoes: '#1a1a1a', legH: 9, torsoH: 9, torsoW: 9, headW: 10, headH: 10, armW: 2, acc: { beret: '#1a1a1a', mimeface: true, gloves: '#ffffff' } },
  stagehand: { skin: '#b58560', hair: '#202020', hairStyle: 'short', top: '#202024', top2: '#444', topStyle: 'tee', bottom: '#202024', bottomStyle: 'pants', shoes: '#111', legH: 10, torsoH: 10, torsoW: 10, headW: 10, headH: 10, armW: 2, acc: { headset: '#555', clipboard: true, beard: '#202020' } },
  agent: { skin: '#e0b090', hair: '#704020', hairStyle: 'bun', top: '#8a3a3a', top2: '#e0d8c8', topStyle: 'uniform', bottom: '#2a2a2a', bottomStyle: 'pants', shoes: '#111', legH: 9, torsoH: 9, torsoW: 9, headW: 10, headH: 10, armW: 2, acc: { cap: '#8a3a3a' } },
  commuter: { skin: '#c89070', hair: '#302018', hairStyle: 'short', top: '#7a6a5a', top2: '#ddd', topStyle: 'coat', bottom: '#3a3a44', bottomStyle: 'pants', shoes: '#222', legH: 10, torsoH: 10, torsoW: 10, headW: 10, headH: 10, armW: 2, acc: { newspaper: true } },
  inventor: { skin: '#e8c8a8', hair: '#d8d8d8', hairStyle: 'spiky', top: '#f4f4f4', top2: '#88aacc', topStyle: 'labcoat', bottom: '#4a4a5a', bottomStyle: 'pants', shoes: '#222', legH: 10, torsoH: 10, torsoW: 10, headW: 10, headH: 10, armW: 2, acc: { goggles: '#888', brows: 'bushy' } },
  caroler: { skin: '#e8c0a0', hair: '#8a4a20', hairStyle: 'short', top: '#2a6a3a', top2: '#c0303a', topStyle: 'coat', bottom: '#2a2a3a', bottomStyle: 'pants', shoes: '#3a2a1a', legH: 9, torsoH: 10, torsoW: 10, headW: 10, headH: 10, armW: 2, acc: { scarf: '#c0303a', beanie: '#c0303a', songbook: true } },
  shoveler: { skin: '#a87050', hair: '#2a1a10', hairStyle: 'short', top: '#e86a1a', top2: '#ffd23f', topStyle: 'coat', bottom: '#2a3a5a', bottomStyle: 'pants', shoes: '#3a2a1a', legH: 10, torsoH: 11, torsoW: 12, headW: 10, headH: 10, armW: 3, acc: { beanie: '#2a3a5a', beard: '#2a1a10' } },
  security: { skin: '#5a3a28', hair: '#111', hairStyle: 'short', top: '#3a3a44', top2: '#ddd', topStyle: 'uniform', bottom: '#2a2a32', bottomStyle: 'pants', shoes: '#111', legH: 10, torsoH: 11, torsoW: 12, headW: 10, headH: 10, armW: 3, acc: { badge: '#c0c0c0', wand: true } },
  gateagent: { skin: '#e8b898', hair: '#a85a2a', hairStyle: 'bun', top: '#1e4a7a', top2: '#f0f0f0', topStyle: 'uniform', bottom: '#1e4a7a', bottomStyle: 'skirt', shoes: '#111', legH: 9, torsoH: 9, torsoW: 9, headW: 10, headH: 10, armW: 2, acc: { scarf: '#e0a020' } },
  pigeonlady: { skin: '#d8b090', hair: '#c8c8c8', hairStyle: 'bun', top: '#8a6a9a', top2: '#d8c8a8', topStyle: 'coat', bottom: '#5a4a5a', bottomStyle: 'skirt', shoes: '#3a2a2a', legH: 9, torsoH: 10, torsoW: 10, headW: 10, headH: 10, armW: 2, acc: { shawl: '#a88ab8', pigeonHat: true } },
  vance: { skin: '#f0c8a8', hair: '#e8d070', hairStyle: 'slick', top: '#2a2a3a', top2: '#f0f0f0', topStyle: 'suit', bottom: '#2a2a3a', bottomStyle: 'pants', shoes: '#111', legH: 11, torsoH: 10, torsoW: 9, headW: 10, headH: 10, armW: 2, acc: { shades: '#111', tie: '#c0a020' } },
  critic: { skin: '#d8a888', hair: '#3a2a2a', hairStyle: 'short', top: '#5a2a4a', top2: '#e8d8c8', topStyle: 'suit', bottom: '#2a2a2a', bottomStyle: 'pants', shoes: '#111', legH: 9, torsoH: 10, torsoW: 9, headW: 10, headH: 10, armW: 2, acc: { beret: '#a02a2a', notebook: true, thinStache: true, mustache: '#3a2a2a' } },
  kid: { skin: '#f0c8a0', hair: '#c87a2a', hairStyle: 'short', top: '#e85a5a', top2: '#fff', topStyle: 'tee', bottom: '#3a5aa8', bottomStyle: 'shorts', shoes: '#fff', legH: 5, torsoH: 6, torsoW: 8, headW: 10, headH: 9, armW: 2, acc: { cap: '#3a5aa8' } },
  bride: { skin: '#d9a07a', hair: '#e8e3f0', hairStyle: 'bouffant', top: '#fbf8f2', top2: '#ffd166', topStyle: 'gown', bottom: '#fbf8f2', bottomStyle: 'gown', shoes: '#fbf8f2', legH: 9, torsoH: 10, torsoW: 10, headW: 10, headH: 10, armW: 2, acc: { pearls: true, veil: true, lipstick: '#b0204a', bouquet: true } },
  groom: { skin: '#f0d0b8', hair: '#9a968e', hairStyle: 'combover', top: '#1d1d26', top2: '#f7f4ee', topStyle: 'tux', bottom: '#1d1d26', bottomStyle: 'pants', shoes: '#0d0d12', legH: 11, torsoH: 10, torsoW: 8, headW: 10, headH: 10, armW: 2, acc: { glasses: '#3a2a1e', bowtie: '#7a1f2b', mustache: '#9a968e', thinStache: true, flower: '#ff6b8a' } },
};
// tint variations for crowds
function variantSpec(base, seed) {
  const s = JSON.parse(JSON.stringify(NPC_SPECS[base] || NPC_SPECS.commuter));
  const R = mulberry32(seed * 101 + 7);
  const skins = ['#f0c8a8', '#e0b090', '#c89070', '#a87050', '#8d5a3b', '#6b4630', '#f6d8c0'];
  const hairs = ['#2a1a10', '#5a3a22', '#c87a2a', '#e8d070', '#111', '#8a4a20', '#d8d8d8'];
  const tops = ['#7a6a5a', '#3a6a8a', '#8a3a4a', '#4a7a4a', '#a87a3a', '#5a4a8a', '#c06030', '#2a8a8a'];
  s.skin = skins[Math.floor(R() * skins.length)];
  s.hair = hairs[Math.floor(R() * hairs.length)];
  if (base === 'commuter' || base === 'caroler' || base === 'kid') s.top = tops[Math.floor(R() * tops.length)];
  s.hairStyle = ['short', 'bun', 'long', 'spiky', 'short'][Math.floor(R() * 5)];
  if (R() < 0.3) s.acc.glasses = '#222';
  s.legH += Math.floor(R() * 2);
  s.torsoW += Math.floor(R() * 2);
  return s;
}

// ---------------------------------------------------------------------------
// The drawing routine. Facing right; flipped at blit time.
// pose: {anim, t, expr, blink, talk, vy, item, extra}
// ---------------------------------------------------------------------------
function drawPerson(g, S, P) {
  const R = (x, y, w, h, c) => { if (w > 0 && h > 0) { g.fillStyle = c; g.fillRect(x, y, w, h); } };
  const A = S.acc || {};
  const cx = 20, FY = FOOT_Y;
  const t = P.t || 0;
  const anim = P.anim || 'idle';
  let legH = S.legH, torsoH = S.torsoH;
  const tw = S.torsoW, hw = S.headW, hh = S.headH;
  const skinD = shade(S.skin, -0.18);
  const topD = shade(S.top, -0.22), topL = shade(S.top, 0.18);
  const botD = shade(S.bottom, -0.2);
  let bob = 0, lean = 0, headBob = 0;
  // leg offsets: {dx, lift}
  let lf = { dx: 0, lift: 0, bend: 0 }, lb = { dx: 0, lift: 0, bend: 0 };
  let af = 'down', ab = 'down', afx = 0, abx = 0;
  let expr = P.expr || 'neutral';
  const walkF = Math.floor(t / (P.fast ? 4 : 6)) % 4;
  const small = S.legH <= 6;

  switch (anim) {
    case 'walk': case 'push': case 'pull': {
      const f = anim === 'walk' ? walkF : Math.floor(t / 9) % 4;
      const sw = [2, 0, -2, 0][f];
      lf.dx = sw; lb.dx = -sw;
      if (f === 0) lb.lift = 1; if (f === 2) lf.lift = 1;
      bob = (f === 1 || f === 3) ? -1 : 0;
      if (anim === 'walk') { afx = -Math.sign(sw); abx = Math.sign(sw); }
      else { af = 'forward'; ab = 'forward'; lean = anim === 'push' ? 1 : -1; if (expr === 'neutral') expr = 'strain'; }
      break;
    }
    case 'jump':
      lf.lift = 3; lf.dx = 1; lb.dx = -1; lb.lift = 0;
      af = 'up'; ab = 'out'; break;
    case 'fall':
      lf.dx = 2; lb.dx = -2; lf.lift = 1;
      af = (Math.floor(t / 5) % 2) ? 'up' : 'out'; ab = (Math.floor(t / 5) % 2) ? 'out' : 'up'; break;
    case 'climb': {
      const f = Math.floor(t / 8) % 2;
      af = f ? 'up' : 'upshort'; ab = f ? 'upshort' : 'up';
      lf.lift = f ? 2 : 0; lb.lift = f ? 0 : 2; break;
    }
    case 'hold':
      af = 'up'; ab = 'up'; legH -= 1; bob = (t % 40 < 20) ? 0 : 1; if (expr === 'neutral') expr = 'strain'; break;
    case 'fix': {
      legH -= 3; lf.dx = 2; lb.dx = -2;
      af = (Math.floor(t / 6) % 2) ? 'wrench' : 'wrench2'; ab = 'forward';
      if (expr === 'neutral') expr = 'focus'; break;
    }
    case 'play':
      af = 'keys'; ab = 'keys'; headBob = (Math.floor(t / 8) % 2); expr = expr === 'neutral' ? 'happy' : expr; break;
    case 'talk': case 'charm':
      af = (Math.floor(t / 14) % 2) ? 'gesture' : 'gesture2'; ab = 'down'; if (expr === 'neutral') expr = 'talk'; break;
    case 'magic':
      af = 'wand'; ab = 'out'; if (expr === 'neutral') expr = 'grin'; break;
    case 'cheer':
      af = 'up'; ab = 'up'; bob = (Math.floor(t / 8) % 2) ? -2 : 0; if (expr === 'neutral') expr = 'grin'; break;
    case 'dance': {
      const f = Math.floor(t / 12) % 4;
      af = ['up', 'hip', 'out', 'hip'][f]; ab = ['hip', 'up', 'hip', 'out'][f];
      bob = (Math.floor(t / 6) % 2) ? -1 : 0; lf.dx = f % 2 ? 1 : -1; lb.dx = -lf.dx;
      if (expr === 'neutral') expr = 'happy'; break;
    }
    case 'sit':
      legH = 3; af = 'lap'; ab = 'lap'; break;
    case 'flex':
      af = 'flex'; ab = 'flex'; if (expr === 'neutral') expr = 'grin'; break;
    case 'point':
      af = 'point'; break;
    case 'shrug':
      af = 'shrug'; ab = 'shrug'; if (expr === 'neutral') expr = 'smug'; break;
    case 'phone':
      af = 'phone'; break;
    case 'facepalm':
      af = 'face'; break;
    case 'cry':
      af = 'face'; ab = 'face'; expr = 'cry'; bob = (Math.floor(t / 10) % 2) ? 0 : 1; break;
    case 'hug':
      af = 'forward'; ab = 'forward'; expr = expr === 'neutral' ? 'happy' : expr; break;
    case 'ow':
      lf.lift = 4; lf.dx = 1; af = 'down'; ab = 'out'; bob = (Math.floor(t / 7) % 2) ? -3 : 0; expr = 'pain'; break;
    case 'zap':
      af = 'out'; ab = 'up'; expr = 'zapped'; break;
    case 'splash':
      af = 'down'; ab = 'down'; expr = 'sad'; break;
    case 'dizzy':
      lean = Math.round(Math.sin(t / 8) * 1.5); expr = 'dizzy'; break;
    case 'caught':
      af = 'up'; ab = 'up'; expr = 'surprised'; break;
    case 'surrender':
      af = 'up'; ab = 'up'; break;
    case 'backpain':
      ab = 'back'; af = 'down'; lean = -1; expr = 'pain'; break;
    case 'lean':
      af = 'hip'; ab = 'down'; break;
    case 'crawl':
      break;
    case 'idle': default: {
      bob = (t % 90) < 45 ? 0 : 0;
      if (P.quirk) applyQuirk();
      break;
    }
  }
  function applyQuirk() {
    const q = P.quirk; const k = t % 120;
    if (q === 'dex') { if (k < 50) { ab = 'back'; lean = -1; expr = 'pain'; } }
    else if (q === 'mila') { bob = (Math.floor(t / 7) % 2) ? -1 : 0; lf.lift = (Math.floor(t / 7) % 2) ? 1 : 0; lb.lift = 1 - lf.lift; }
    else if (q === 'theo') { af = 'gadget'; if (expr === 'neutral') expr = 'focus'; }
    else if (q === 'priya') { af = 'phone'; if ((t % 120) < 60) expr = 'talk'; }
    else if (q === 'benny') { af = 'cards'; ab = 'cards'; }
    else if (q === 'juno') { headBob = Math.floor(t / 10) % 2; af = 'snap'; }
  }

  if (anim === 'crawl') { drawCrawl(g, S, P, R); return; }

  const legTop = FY - legH + bob * 0;
  const torsoTop = FY - legH - torsoH + bob;
  const tx0 = cx - Math.floor(tw / 2) + lean;
  const headTop = torsoTop - hh + headBob + (anim === 'sit' ? 0 : 0);
  const hx0 = cx - Math.floor(hw / 2) + 1 + lean;
  const armLen = torsoH + (small ? 1 : 0);
  const aw = S.armW || 2;
  const sleeve = S.topStyle === 'tee' ? S.skin : S.top;

  // ---- behind-body items ----
  if (A.cape && anim !== 'sit') {
    const flap = Math.round(Math.sin(t / 6) * 1) - (P.vx ? Math.min(3, Math.abs(P.vx) * 1.5) : 0);
    const cy0 = torsoTop + 1, cy1 = FY - 1;
    for (let y = cy0; y <= cy1; y++) {
      const k = (y - cy0) / Math.max(1, cy1 - cy0);
      const x0 = tx0 - 1 - Math.round(k * (2 - flap));
      R(x0, y, Math.max(2, tx0 + 3 - x0), 1, A.cape);
    }
    R(tx0 - 2 + Math.round(flap / 2), cy1 - 3, 1, 1, A.capeStars || '#ffd166');
    R(tx0 - 1, cy0 + 3, 1, 1, A.capeStars || '#ffd166');
  }
  if (A.keytar && anim !== 'play') {
    // slung on back, diagonal
    for (let i = 0; i < 9; i++) R(tx0 - 2 + Math.floor(i / 3), torsoTop - 2 + i, 3, 1, i < 3 ? '#2a2a3a' : A.keytar);
    R(tx0 - 1, torsoTop + 3, 1, 3, '#f4f4f4');
  }
  if (S.hairStyle === 'pony' && !A.beanie) {
    const sw = anim === 'walk' ? [0, 1, 0, -1][walkF] : anim === 'jump' ? -1 : anim === 'fall' ? -2 : 0;
    R(hx0 - 3, headTop + 3 + sw, 3, 2, S.hair);
    R(hx0 - 4, headTop + 4 + sw, 2, 5, S.hair);
    R(hx0 - 4, headTop + 9 + sw, 1, 1, shade(S.hair, -0.2));
  }
  if (S.hairStyle === 'bouffant') {
    R(hx0 - 2, headTop - 3, hw + 3, hh - 1, S.hair);
    R(hx0 - 3, headTop - 1, 2, hh - 1, S.hair);
    R(hx0 - 1, headTop - 4, hw + 1, 2, S.hair);
  }
  if (A.veil) { R(hx0 - 3, headTop, 3, hh + torsoH, 'rgba(255,255,255,0.75)'); }

  // ---- back arm ----
  drawArm(ab, abx, true);
  // ---- legs ----
  drawLeg(lb, true);
  drawLeg(lf, false);
  // ---- torso ----
  drawTorso();
  // ---- head ----
  drawHead();
  // ---- front arm ----
  drawArm(af, afx, false);
  // ---- extras in front ----
  if (anim === 'play' && A.keytar) {
    const ky = torsoTop + Math.floor(torsoH / 2);
    R(tx0 - 2, ky, tw + 7, 3, A.keytar);
    R(tx0 - 1, ky + 1, tw + 3, 1, '#f4f4f4');
    for (let i = 0; i < tw + 3; i += 2) R(tx0 - 1 + i, ky + 1, 1, 1, '#222');
    R(tx0 + tw + 4, ky - 2, 2, 3, A.keytar);
  }
  if (A.teddy && anim === 'idle') {
    R(tx0 + tw - 1, torsoTop + 5, 4, 4, '#a0703a'); R(tx0 + tw - 1, torsoTop + 4, 1, 1, '#a0703a'); R(tx0 + tw + 2, torsoTop + 4, 1, 1, '#a0703a');
    R(tx0 + tw, torsoTop + 6, 1, 1, '#222');
  }
  if (A.sparkle && (t % 40) < 6) R(tx0 + (t * 7) % tw, torsoTop + (t * 3) % torsoH, 1, 1, '#ffffff');

  // ================= helpers ==================
  function drawLeg(L, back) {
    const lw = tw >= 12 ? 4 : 3;
    let x = back ? cx - lw + L.dx + (tw >= 12 ? -1 : 0) : cx + L.dx + (tw >= 12 ? 1 : 0) - (small ? 1 : 0);
    x += lean;
    if (small) x = back ? cx - 3 + L.dx : cx + L.dx;
    const y0 = FY - legH - L.lift + (bob > 0 ? bob : 0);
    const h = legH;
    const pc = back ? botD : S.bottom;
    const sk = back ? skinD : S.skin;
    const shoe = back ? shade(S.shoes, -0.2) : S.shoes;
    if (anim === 'sit') {
      // thighs forward, shins down
      R(x, FY - 4, lw + 4, 3, pc);
      R(x + lw + 2, FY - 2, lw - 1, 2, shoe);
      return;
    }
    const bs = S.bottomStyle;
    if (bs === 'shorts') {
      R(x, y0, lw, 3, pc); R(x, y0 + 3, lw, h - 5, sk);
    } else if (bs === 'skirt') {
      R(x, y0 + 3, lw, h - 5, sk);
    } else if (bs === 'gown' || bs === 'robe') {
      R(x, y0, lw, h - 2, pc);
    } else {
      R(x, y0, lw, h - 2, pc);
      if (bs === 'trackpants') R(back ? x : x + lw - 1, y0, 1, h - 2, S.bottom2 || '#fff');
    }
    // shoe
    R(x, y0 + h - 2, lw + 1, 2, shoe);
    R(x + lw, y0 + h - 1, 1, 1, shade(shoe, -0.3));
  }

  function drawTorso() {
    const x = tx0, y = torsoTop, w = tw, h = torsoH;
    const st = S.topStyle;
    // base
    R(x + 1, y, w - 2, 1, S.top);
    R(x, y + 1, w, h - 1, S.top);
    // side shading (back side)
    R(x, y + 1, 1, h - 1, topD);
    if (st === 'gown' || st === 'robe' || st === 'labcoat') {
      // long garment flaring down over the legs
      const extra = st === 'labcoat' ? Math.min(5, legH - 3) : legH - 1;
      for (let i = 0; i < extra; i++) R(x - (st === 'gown' ? Math.floor(i / 3) : 0), y + h + i, w + (st === 'gown' ? Math.floor(i / 3) * 2 : 0), 1, i % 4 === 3 && st === 'gown' ? shade(S.top, -0.08) : S.top);
      if (st === 'robe') { R(x, y + h - 3, w, 1, S.top2); R(x + w - 3, y + 1, 1, h + extra - 2, shade(S.top, -0.15)); }
      if (st === 'labcoat') { R(x + Math.floor(w / 2), y, 1, h + extra, '#d8d8d8'); R(x + 2, y + 3, 2, 2, S.top2); }
      if (st === 'gown') { R(x + 2, y + 1, w - 4, 1, S.top2); }
    }
    if (st === 'track') {
      R(x + Math.floor(w / 2), y, 1, h, S.top2);
      R(x + 1, y, w - 2, 1, shade(S.top, -0.1));
      R(x, y + h - 2, w, 2, S.top2);
    } else if (st === 'windbreaker') {
      R(x + Math.floor(w / 2), y + 1, 1, h - 1, S.top2);
      R(x + 2, y, w - 4, 1, S.top2);
      R(x, y + Math.floor(h / 2), w, 1, topL);
    } else if (st === 'cardigan') {
      R(x + Math.floor(w / 2) - 1, y, 3, h, S.top2);
      R(x + Math.floor(w / 2) + 2, y + 3, 1, 1, topD); R(x + Math.floor(w / 2) + 2, y + 6, 1, 1, topD);
    } else if (st === 'blazer') {
      R(x + Math.floor(w / 2) - 1, y, 3, 4, S.top2);
      R(x + Math.floor(w / 2) - 2, y + 1, 1, 3, topD); R(x + Math.floor(w / 2) + 2, y + 1, 1, 3, topD);
      R(x + Math.floor(w / 2) + 1, y + 5, 1, 1, A.buttons || '#ffd700'); R(x + Math.floor(w / 2) + 1, y + 7, 1, 1, A.buttons || '#ffd700');
    } else if (st === 'vest') {
      R(x, y, w, h, S.top2);
      R(x, y + 1, 3, h - 1, S.top); R(x + w - 3, y + 1, 3, h - 1, S.top); R(x, y + h - 2, w, 2, S.top);
    } else if (st === 'denim') {
      R(x + Math.floor(w / 2) - 1, y, 3, h, S.top2);
      for (let i = 1; i < h; i += 2) R(x + Math.floor(w / 2) - 1, y + i, 3, 1, shade(S.top2, -0.25));
      if (A.pins) { R(x + 1, y + 3, 1, 1, '#ffd23f'); R(x + w - 2, y + 2, 1, 1, '#ff4f9a'); R(x + w - 2, y + 5, 1, 1, '#7cf29a'); }
      R(x, y + h - 1, w, 1, topD);
    } else if (st === 'apron') {
      R(x + 2, y + 2, w - 4, h - 2, S.top2);
      R(x + 3, y, 1, 2, S.top2); R(x + w - 4, y, 1, 2, S.top2);
      R(x + 4, y + 6, w - 8, 2, shade(S.top2, -0.1));
    } else if (st === 'sweatervest') {
      R(x, y, w, h, S.top2);
      R(x, y + 2, w, h - 2, S.top);
      R(x + Math.floor(w / 2) - 1, y + 2, 2, 2, S.top2);
      for (let i = 3; i < h; i += 3) R(x + 1, y + i, w - 2, 1, shade(S.top, -0.12));
    } else if (st === 'tux' || st === 'suit') {
      R(x + Math.floor(w / 2) - 1, y, 3, h - 2, S.top2);
      R(x + Math.floor(w / 2) - 2, y, 1, h - 3, topL);
      R(x + Math.floor(w / 2) + 2, y, 1, h - 3, topL);
      if (st === 'suit' && A.tie) R(x + Math.floor(w / 2), y + 1, 1, h - 4, A.tie);
    } else if (st === 'pajama') {
      for (let i = x + 1; i < x + w; i += 3) R(i, y + 1, 1, h - 1, S.top2);
      R(x + Math.floor(w / 2), y + 2, 1, 1, '#7a6a5a'); R(x + Math.floor(w / 2), y + 5, 1, 1, '#7a6a5a');
    } else if (st === 'sweater') {
      const by = y + Math.floor(h / 2) - 1;
      R(x, by - 1, w, 1, S.top2); R(x, by + 2, w, 1, S.top2);
      for (let i = 0; i < w; i++) if ((i % 3) === 1) R(x + i, by, 1, 1, S.top2); else if ((i % 3) !== 1) R(x + i, by + 1, 1, 1, (i % 3) === 0 ? S.top2 : S.top);
      R(x + 1, y + 1, w - 2, 1, shade(S.top, -0.15)); R(x, y + h - 1, w, 1, shade(S.top, -0.15));
    } else if (st === 'bowling') {
      R(x + w - 4, y, 2, h, S.top2);
      R(x + 2, y, 3, 1, '#ffffff'); R(x + 1, y + 3, 2, 1, S.top2);
    } else if (st === 'uniform') {
      R(x + Math.floor(w / 2), y + 1, 1, h - 2, shade(S.top, -0.25));
      R(x, y + h - 2, w, 1, '#222');
      if (A.badge) R(x + w - 4, y + 2, 2, 2, A.badge);
    } else if (st === 'coat') {
      for (let i = 2; i < h; i += 3) R(x, y + i, w, 1, shade(S.top, -0.12));
      R(x + Math.floor(w / 2), y, 1, h, shade(S.top, -0.2));
    } else if (st === 'stripes') {
      for (let i = 1; i < h; i += 2) R(x, y + i, w, 1, S.top2);
    } else if (st === 'tee' || st === 'polo') {
      R(x + 2, y, w - 4, 1, shade(S.top, -0.2));
    } else if (st === 'gown') {
      // handled above
    }
    // accessories on torso
    if (A.strap) { for (let i = 0; i < h - 1; i++) R(x + w - 2 - Math.floor(i * (w - 3) / (h - 1)), y + i, 1, 1, A.strap); }
    if (A.toolbelt) { R(x, y + h - 2, w, 2, A.toolbelt); R(x + w - 3, y + h - 2, 1, 1, '#d8c070'); R(x + 1, y + h - 1, 2, 3, '#b0b8c0'); }
    if (A.whistle) { R(x + Math.floor(w / 2) + 1, y + 1, 1, 3, '#ddd'); R(x + Math.floor(w / 2) + 1, y + 4, 2, 2, '#c8ccd2'); }
    if (A.bowtie) { const bx = x + Math.floor(w / 2) - 1; R(bx, y, 1, 2, A.bowtie); R(bx + 2, y, 1, 2, A.bowtie); R(bx + 1, y, 1, 1, shade(A.bowtie, -0.3)); }
    if (A.pearls) { for (let i = 1; i < w - 1; i += 2) R(x + i, y + 1, 1, 1, '#fffaf0'); }
    if (A.shawl) { R(x - 1, y, w + 2, 3, A.shawl); R(x - 1, y + 3, 2, 3, A.shawl); R(x + w - 1, y + 3, 2, 2, A.shawl); }
    if (A.scarf) { R(x + 1, y - 1, w - 2, 2, A.scarf); R(x + w - 3, y + 1, 2, 4, A.scarf); }
    if (A.headphones && anim !== 'sleep') { R(x + 1, y - 1, w - 2, 1, A.headphones); R(x, y - 1, 2, 3, shade(A.headphones, -0.2)); R(x + w - 2, y - 1, 2, 3, A.headphones); }
    if (A.towel) { R(x, y, 3, 5, '#f0f0f0'); R(x, y + 1, 3, 1, '#d04040'); R(x, y + 3, 3, 1, '#d04040'); }
    if (A.flower) R(x + w - 3, y + 1, 2, 2, A.flower);
    if (A.bouquet && anim !== 'walk') { R(x + w, y + 5, 3, 3, '#ff8fab'); R(x + w + 1, y + 4, 1, 1, '#ffd166'); R(x + w + 1, y + 8, 1, 2, '#3a8a3a'); }
  }

  function drawHead() {
    const x = hx0, y = headTop, w = hw, h = hh;
    const sk = (expr === 'zapped') ? '#4a3a3a' : S.skin;
    // skull
    R(x + 1, y, w - 2, h, sk);
    R(x, y + 1, w, h - 2, sk);
    // neck shadow
    R(x + 2, y + h - 1, w - 4, 1, skinD);
    // nose (profile bump)
    const eyeY = y + Math.floor(h / 2);
    R(x + w, eyeY + 1, 1, 2, sk);
    // ear
    R(x + 2, eyeY, 2, 2, skinD);
    if (A.earrings) R(x + 2, eyeY + 2, 1, 1, A.earrings);
    // hair
    drawHair(x, y, w, h, eyeY);
    // face
    drawFace(x, y, w, h, eyeY);
    // head accessories
    if (A.helmet) {
      R(x - 1, y - 2, w + 2, 3, A.helmet);
      R(x, y - 3, w, 1, A.helmet);
      R(x + 1, y + 1, w - 1, 1, A.helmet);
      R(x + 2, y - 3, 2, 3, A.helmet2 || '#fff');
      R(x + 6, y - 2, 1, 1, shade(A.helmet, -0.35)); R(x + 4, y - 2, 1, 1, shade(A.helmet, -0.35));
      R(x + w, y + 1, 1, 2, A.helmet);
    }
    if (A.tophat) {
      const by = y + 1;
      R(x - 1, by, w + 3, 1, A.tophat);
      R(x + 1, by - 7, w - 2, 7, A.tophat);
      R(x + 1, by - 2, w - 2, 1, A.hatband || '#9b5de5');
      R(x + 2, by - 6, 1, 3, shade(A.tophat, 0.25));
    }
    if (A.goggles) {
      R(x, y + 2, w, 1, '#3a2a20');
      R(x + w - 5, y + 1, 2, 2, A.goggles); R(x + w - 2, y + 1, 2, 2, A.goggles);
      R(x + w - 5, y + 1, 1, 1, '#9ad8ff'); R(x + w - 2, y + 1, 1, 1, '#9ad8ff');
    }
    if (A.glasses) {
      const ex = x + w - 5;
      R(ex - 1, eyeY - 1, 3, 1, A.glasses); R(ex - 1, eyeY + 2, 3, 1, A.glasses);
      R(ex - 1, eyeY - 1, 1, 4, A.glasses); R(ex + 1, eyeY - 1, 1, 4, A.glasses);
      R(ex + 2, eyeY, 1, 1, A.glasses);
      R(ex + 3, eyeY - 1, 2, 1, A.glasses); R(ex + 3, eyeY + 2, 2, 1, A.glasses); R(ex + 4, eyeY - 1, 1, 4, A.glasses);
      R(x + 3, eyeY, ex - x - 4, 1, A.glasses);
    }
    if (A.shades) { R(x + w - 6, eyeY - 1, 6, 3, A.shades); R(x + 3, eyeY - 1, 3, 1, A.shades); }
    if (A.hat) { R(x - 1, y + 1, w + 3, 1, A.hat); R(x + 1, y - 3, w - 2, 4, A.hat); R(x + 1, y, w - 2, 1, shade(A.hat, -0.3)); }
    if (A.cap) { R(x, y - 1, w, 3, A.cap); R(x + w - 1, y + 1, 4, 1, A.cap); R(x + 2, y - 2, w - 4, 1, A.cap); if (A.badge) R(x + w - 4, y, 1, 1, A.badge); }
    if (A.beret) { R(x - 1, y - 2, w + 1, 3, A.beret); R(x + 3, y - 3, 1, 1, A.beret); }
    if (A.beanie) { R(x, y - 2, w, 4, A.beanie); R(x, y + 1, w, 1, shade(A.beanie, -0.2)); R(x + Math.floor(w / 2) - 1, y - 4, 3, 2, '#fbf6ec'); }
    if (A.nightcap) { R(x, y - 1, w, 3, A.nightcap); R(x - 2, y - 3, 6, 2, A.nightcap); R(x - 4, y - 2, 2, 3, A.nightcap); R(x - 5, y + 1, 2, 2, '#fff'); }
    if (A.sleepmask) { R(x + 1, y + 1, w - 1, 2, A.sleepmask); R(x + w - 5, y + 1, 1, 1, '#fff'); R(x + w - 2, y + 1, 1, 1, '#fff'); }
    if (A.headset) { R(x + 1, y - 1, w - 2, 1, A.headset); R(x + 1, eyeY - 1, 2, 3, A.headset); R(x + 3, eyeY + 2, 4, 1, A.headset); }
    if (A.curlers) { for (let i = 0; i < w; i += 3) R(x + i, y - 1, 2, 2, ['#ff8fab', '#8fd3ff', '#ffe08a'][i % 3]); }
    if (A.pigeonHat) { R(x + 1, y - 4, 5, 3, '#8a8a9a'); R(x + 5, y - 5, 2, 2, '#8a8a9a'); R(x + 6, y - 5, 1, 1, '#222'); R(x + 7, y - 4, 1, 1, '#e8a020'); R(x + 2, y - 3, 2, 1, '#6a9a8a'); }
  }

  function drawHair(x, y, w, h, eyeY) {
    const hc = S.hair, hd = shade(S.hair, -0.25);
    switch (S.hairStyle) {
      case 'buzz':
        R(x + 1, y, w - 2, 2, hc); R(x, y + 1, 3, eyeY - y - 1, hc); R(x + w - 2, y + 1, 1, 1, hc); break;
      case 'pony':
        R(x + 1, y, w - 2, 2, hc); R(x, y + 1, 3, eyeY - y + 1, hc); R(x + w - 3, y + 2, 2, 1, hc); break;
      case 'messy':
        R(x, y, w, 2, hc); R(x, y + 2, 3, eyeY - y, hc);
        R(x + 1, y - 1, 2, 1, hc); R(x + 4, y - 2, 2, 2, hc); R(x + 7, y - 1, 2, 1, hc); R(x + w - 1, y + 2, 1, 2, hc);
        R(x + 3, y + 1, 1, 1, hd); break;
      case 'bob':
        R(x, y - 1, w, 3, hc); R(x - 1, y, 4, h - 2, hc); R(x + w - 2, y + 1, 2, 2, hc);
        R(x + w - 1, y + 3, 1, 3, hc); R(x + 1, y - 1, w - 3, 1, shade(hc, 0.15)); break;
      case 'curly':
        R(x, y - 1, w, 3, hc); R(x - 1, y, 3, eyeY - y + 2, hc);
        for (let i = 0; i < w; i += 2) R(x + i, y - 2, 1, 1, hc);
        R(x + w - 2, y + 2, 2, 1, hc); R(x + 2, y, 1, 1, hd); R(x + 5, y, 1, 1, hd); break;
      case 'puffs':
        R(x + 1, y - 1, w - 2, 3, hc); R(x, y, 2, eyeY - y + 1, hc);
        circ(x + 1, y - 2, 3, hc); circ(x + w - 2, y - 2, 3, hc);
        R(x + w - 3, y - 4, 2, 1, S.hair2 || hc); R(x, y - 4, 2, 1, S.hair2 || hc); R(x + w - 1, y - 2, 1, 1, S.hair2 || hc); break;
      case 'bald':
        R(x, eyeY - 2, 3, 4, hc); R(x + 3, y, 3, 1, shade(S.skin, 0.25)); break;
      case 'combover':
        R(x, eyeY - 2, 3, 4, hc); for (let i = 1; i < w - 2; i += 2) R(x + i, y, 1, 1, hc); R(x + 1, y + 1, w - 4, 1, hc); break;
      case 'bouffant':
        R(x - 1, y - 2, w + 2, 4, hc); R(x - 2, y, 4, h - 2, hc); R(x + w - 1, y + 1, 2, 3, hc); break;
      case 'short':
        R(x, y, w, 2, hc); R(x, y + 2, 3, eyeY - y, hc); break;
      case 'slick':
        R(x, y - 1, w, 3, hc); R(x, y + 2, 2, eyeY - y - 1, hc); R(x + 1, y - 1, w - 2, 1, shade(hc, 0.3)); break;
      case 'long':
        R(x, y - 1, w, 3, hc); R(x - 1, y, 4, h + 2, hc); R(x + w - 1, y + 1, 1, 4, hc); break;
      case 'bun':
        R(x, y, w, 2, hc); R(x, y + 2, 3, eyeY - y, hc); circ(x + 1, y - 1, 2, hc); break;
      case 'spiky':
        R(x, y, w, 2, hc); R(x, y + 2, 3, eyeY - y, hc);
        for (let i = 0; i < w; i += 2) R(x + i, y - 2 + (i % 4 === 0 ? 0 : 1), 1, 2, hc); break;
      default: break;
    }
    if (expr === 'zapped') { for (let i = -1; i < w + 1; i += 2) R(x + i, y - 3 - (i % 3), 1, 3, '#2a2a2a'); }
  }
  function circ(cx2, cy2, r, c) {
    for (let yy = -r; yy <= r; yy++) {
      const ww = Math.round(Math.sqrt(r * r - yy * yy + 0.5));
      R(cx2 - ww, cy2 + yy, ww * 2 + 1, 1, c);
    }
  }

  function drawFace(x, y, w, h, eyeY) {
    const ex1 = x + w - 5, ex2 = x + w - 2;
    const dark = '#20141c';
    const blink = P.blink;
    let e = expr;
    if (A.mimeface) { R(x + 1, y + 1, w - 1, h - 2, '#fafafa'); }
    const eyes = (style) => {
      if (style === 'closed') { R(ex1, eyeY + 1, 2, 1, dark); R(ex2, eyeY + 1, 1, 1, dark); return; }
      if (style === 'happy') { R(ex1, eyeY + 1, 1, 1, dark); R(ex1 + 1, eyeY, 1, 1, dark); R(ex2, eyeY, 1, 1, dark); R(ex2 + 1, eyeY + 1, 1, 1, dark); return; }
      if (style === 'wide') { R(ex1, eyeY - 1, 2, 3, '#fff'); R(ex1 + 1, eyeY, 1, 1, dark); R(ex2, eyeY - 1, 1, 3, '#fff'); R(ex2, eyeY, 1, 1, dark); return; }
      if (style === 'tight') { R(ex1, eyeY, 2, 1, dark); R(ex1 + 1, eyeY + 1, 1, 1, dark); R(ex2, eyeY, 1, 1, dark); R(ex2, eyeY + 1, 1, 1, dark); return; }
      if (style === 'spiral') { R(ex1, eyeY - 1, 2, 1, dark); R(ex1 + 1, eyeY, 1, 1, dark); R(ex1, eyeY + 1, 2, 1, dark); R(ex2, eyeY - 1, 1, 3, dark); return; }
      if (style === 'zap') { R(ex1, eyeY, 2, 2, '#fff'); R(ex2, eyeY, 1, 2, '#fff'); return; }
      if (style === 'half') { R(ex1, eyeY + 1, 1, 1, dark); R(ex2, eyeY + 1, 1, 1, dark); R(ex1, eyeY, 2, 1, shade(S.skin, -0.3)); return; }
      R(ex1 + 1, eyeY, 1, 2, dark); R(ex2, eyeY, 1, 2, dark);
    };
    const brows = (kind) => {
      const bc = A.brows === 'bushy' ? (S.hairStyle === 'bald' ? S.hair : shade(S.hair, 0.1)) : shade(S.hair === '#e8e3f0' ? '#9a8aa8' : S.hair, -0.1);
      const thick = A.brows === 'thick' || A.brows === 'bushy';
      const by = eyeY - 2;
      if (kind === 'up') { R(ex1, by - 1, 2, 1, bc); R(ex2, by - 1, 2, 1, bc); }
      else if (kind === 'angry') { R(ex1, by, 1, 1, bc); R(ex1 + 1, by + 1, 1, 1, bc); R(ex2, by + 1, 1, 1, bc); R(ex2 + 1, by, 1, 1, bc); }
      else if (kind === 'sad') { R(ex1, by + 1, 1, 1, bc); R(ex1 + 1, by, 1, 1, bc); R(ex2, by, 1, 1, bc); R(ex2 + 1, by + 1, 1, 1, bc); }
      else if (kind === 'one') { R(ex1, by, 2, 1, bc); R(ex2, by - 1, 2, 1, bc); }
      else { R(ex1, by, 2, 1, bc); R(ex2, by, 2, 1, bc); }
      if (thick) { R(ex1, by - (kind === 'up' ? 2 : 1), 2, 1, bc); }
    };
    const mx = x + w - 4, my = eyeY + 3;
    const lip = A.lipstick || '#7a2a2a';
    const mouth = (kind) => {
      switch (kind) {
        case 'smile': R(mx, my, 3, 1, dark); R(mx - 1, my - 1, 1, 1, dark); R(mx + 3, my - 1, 1, 1, dark); break;
        case 'grin': R(mx - 1, my - 1, 5, 2, dark); R(mx, my - 1, 3, 1, '#fff'); break;
        case 'open': R(mx, my - 1, 3, 2, dark); R(mx + 1, my, 1, 1, '#c0405a'); break;
        case 'o': R(mx + 1, my - 1, 2, 2, dark); break;
        case 'frown': R(mx, my - 1, 3, 1, dark); R(mx - 1, my, 1, 1, dark); R(mx + 3, my, 1, 1, dark); break;
        case 'flat': R(mx, my, 3, 1, dark); break;
        case 'smirk': R(mx, my, 2, 1, dark); R(mx + 2, my - 1, 1, 1, dark); break;
        case 'teeth': R(mx - 1, my - 1, 5, 2, '#fff'); R(mx - 1, my, 5, 1, '#bbb'); R(mx - 1, my - 1, 1, 2, dark); R(mx + 3, my - 1, 1, 2, dark); break;
        case 'wobble': R(mx - 1, my, 1, 1, dark); R(mx, my - 1, 1, 1, dark); R(mx + 1, my, 1, 1, dark); R(mx + 2, my - 1, 1, 1, dark); R(mx + 3, my, 1, 1, dark); break;
        default: R(mx, my, 2, 1, dark);
      }
      if (A.lipstick && (kind === 'smile' || kind === 'flat' || kind === 'smirk' || !kind)) R(mx, my, 3, 1, lip);
    };
    const talkOpen = P.talk && (Math.floor(t / 5) % 2 === 0);
    switch (e) {
      case 'happy': eyes(blink ? 'closed' : 'normal'); brows('up'); mouth(talkOpen ? 'open' : 'smile'); break;
      case 'grin': eyes('happy'); brows('up'); mouth(talkOpen ? 'open' : 'grin'); break;
      case 'talk': eyes(blink ? 'closed' : 'normal'); brows(''); mouth(talkOpen ? 'open' : 'smile'); break;
      case 'surprised': eyes('wide'); brows('up'); mouth('o'); break;
      case 'sad': eyes(blink ? 'closed' : 'normal'); brows('sad'); mouth(talkOpen ? 'open' : 'frown'); break;
      case 'angry': eyes('normal'); brows('angry'); mouth(talkOpen ? 'open' : 'frown'); break;
      case 'smug': eyes('half'); brows('one'); mouth(talkOpen ? 'open' : 'smirk'); break;
      case 'scared': eyes('wide'); brows('sad'); mouth('wobble'); R(x + w - 1, y + 1, 1, 2, '#9ad8ff'); break;
      case 'cry': eyes('closed'); brows('sad'); mouth('open');
        R(ex1, eyeY + 2 + (t >> 2) % 4, 1, 2, '#6ec6ff'); R(ex2 + 1, eyeY + 2 + ((t >> 2) + 2) % 4, 1, 2, '#6ec6ff'); break;
      case 'sleep': eyes('closed'); mouth('flat'); break;
      case 'dizzy': eyes('spiral'); mouth('wobble'); break;
      case 'strain': eyes('tight'); brows('angry'); mouth('teeth'); break;
      case 'pain': eyes('tight'); brows('sad'); mouth('open'); break;
      case 'focus': eyes(blink ? 'closed' : 'normal'); brows('angry'); mouth('flat'); break;
      case 'zapped': eyes('zap'); mouth('o'); break;
      case 'wink': R(ex1, eyeY + 1, 2, 1, dark); R(ex2, eyeY, 1, 2, dark); brows('one'); mouth('smile'); break;
      case 'love': R(ex1, eyeY, 2, 2, '#ff4f7a'); R(ex2, eyeY, 1, 2, '#ff4f7a'); brows('up'); mouth('smile'); break;
      case 'shock': eyes('wide'); brows('up'); mouth('open'); break;
      default: eyes(blink ? 'closed' : 'normal'); brows(''); mouth(talkOpen ? 'open' : 'smile');
    }
    if (A.freckles) { R(ex1 - 1, eyeY + 2, 1, 1, '#d9926a'); R(ex2 + 1, eyeY + 2, 1, 1, '#d9926a'); }
    if (A.stubble) { R(x + 3, y + h - 3, w - 4, 1, shade(S.skin, -0.12)); }
    if (A.mustache) {
      if (A.thinStache) R(mx - 1, my - 1, 4, 1, A.mustache);
      else { R(mx - 2, my - 1, 6, 2, A.mustache); R(mx - 3, my, 1, 2, A.mustache); }
    }
    if (A.beard) R(x + 3, y + h - 3, w - 3, 3, A.beard);
    if (e === 'happy' || e === 'grin' || e === 'love') R(ex1 - 1, eyeY + 2, 1, 1, '#ff9a9a');
  }

  function drawArm(pose, swing, back) {
    const col = back ? shade(sleeve, -0.2) : sleeve;
    const sk = back ? skinD : S.skin;
    const hand = A.gloves ? (back ? shade(A.gloves, -0.2) : A.gloves) : sk;
    const W2 = aw;
    const fx = tx0 + tw - aw - 1;   // front shoulder
    const bx = tx0 + 1;             // back shoulder
    const sx = back ? bx : fx;
    const sy = torsoTop + 1;
    const headL = hx0 - W2, headR = hx0 + hw + 1;
    const eyeY = headTop + Math.floor(hh / 2);
    // poses that reach away from the body mirror for the back arm
    switch (pose) {
      case 'up': case 'upshort': {
        const ax = back ? Math.min(bx - 1, headL) : Math.max(fx + 1, headR);
        const len = pose === 'up' ? armLen + 2 : 8;
        if (back) R(ax, sy, bx - ax + W2, W2, col); else R(fx, sy, ax - fx + W2, W2, col);
        R(ax, sy - len + 3, W2, len - 1, col);
        R(ax, sy - len + 1, W2, 2, hand);
        return;
      }
      case 'flex': {
        const ax = back ? Math.min(bx - 2, headL) : Math.max(fx + 2, headR);
        if (back) R(ax, sy, bx - ax + W2, W2 + 1, col); else R(fx, sy, ax - fx + W2, W2 + 1, col);
        R(ax, sy - 4, W2 + 1, 5, col); R(ax, sy - 6, W2, 2, hand);
        return;
      }
      case 'out': {
        if (back) { R(bx - 3, sy, W2 + 3, W2, col); R(bx - 3 - W2, sy - 3, W2, 4, col); R(bx - 3 - W2, sy - 5, W2, 2, hand); }
        else { R(fx + 1, sy, W2 + 2, W2, col); R(fx + W2 + 3, sy - 3, W2, 4, col); R(fx + W2 + 3, sy - 5, W2, 2, hand); }
        return;
      }
      case 'shrug': {
        if (back) { R(bx - 2, sy, W2 + 2, W2, col); R(bx - 2 - W2, sy - 3, 2, 3, hand); }
        else { R(fx + 1, sy, W2 + 2, W2, col); R(fx + W2 + 3, sy - 3, 2, 3, hand); }
        return;
      }
      case 'down': R(sx + swing, sy, W2, armLen - 2, col); R(sx + swing, sy + armLen - 2, W2, 2, hand); break;
      case 'forward': R(sx + 1, sy + 2, W2 + 5, W2, col); R(sx + W2 + 6, sy + 2, 2, W2, hand); break;
      case 'hip': R(sx + 1, sy + 1, W2, 3, col); R(sx + 2, sy + 4, W2, 2, hand); break;
      case 'back': R(bx - 2, sy + 2, W2, 4, col); R(bx - 3, sy + 5, 2, 2, hand); break;
      case 'phone': {
        R(fx, sy, W2, 4, col); R(fx + 1, sy - 2, W2 + 1, 3, col);
        R(headR - 1, eyeY + 1, 2, 3, hand);
        R(headR, eyeY - 2, 2, 4, '#222'); R(headR, eyeY - 1, 1, 2, '#6ad4ff');
        break;
      }
      case 'gesture': R(sx + 1, sy + 1, W2 + 3, W2, col); R(sx + W2 + 4, sy - 1, 2, 3, hand); break;
      case 'gesture2': R(sx + 1, sy + 2, W2 + 2, W2, col); R(sx + W2 + 3, sy + 1, 2, 3, hand); break;
      case 'keys': R(sx + 1, sy + 3, W2 + 2, W2, col); R(sx + W2 + 2, sy + 4 + ((t >> 3) % 2), 2, 2, hand); break;
      case 'wand': {
        const ax = Math.max(fx + 1, headR);
        R(fx, sy, ax - fx + W2, W2, col); R(ax, sy - 3, W2, 4, col); R(ax, sy - 5, W2, 2, hand);
        R(ax + 1, sy - 11, 1, 6, '#1a1a1a'); R(ax + 1, sy - 12, 1, 2, '#fff');
        break;
      }
      case 'wrench': R(sx + 1, sy + 3, W2 + 4, W2, col); R(sx + W2 + 5, sy + 2, 2, 3, hand); R(sx + W2 + 7, sy, 1, 5, '#b8c0c8'); R(sx + W2 + 6, sy - 1, 3, 2, '#b8c0c8'); break;
      case 'wrench2': R(sx + 1, sy + 4, W2 + 4, W2, col); R(sx + W2 + 5, sy + 4, 2, 3, hand); R(sx + W2 + 7, sy + 4, 4, 1, '#b8c0c8'); R(sx + W2 + 10, sy + 3, 2, 3, '#b8c0c8'); break;
      case 'lap': R(sx + 1, sy + 4, W2 + 2, W2, col); R(sx + W2 + 3, sy + 5, 2, 2, hand); break;
      case 'point': R(sx + 1, sy + 1, W2 + 6, W2, col); R(sx + W2 + 7, sy + 1, 3, 1, hand); break;
      case 'face': R(fx, sy, W2, 2, col); R(fx + 1, sy - 2, W2, 3, col); R(headR - 3, eyeY, W2 + 1, 4, hand); break;
      case 'gadget': R(sx + 1, sy + 3, W2 + 3, W2, col); R(sx + W2 + 3, sy + 2, 4, 3, '#8a8a8a'); R(sx + W2 + 4, sy + 1, 1, 1, (t >> 3) % 2 ? '#ffd23f' : '#ff5a3a'); break;
      case 'cards': R(sx + 1, sy + 3, W2 + 2, W2, col); R(sx + W2 + 2, sy + 1 - ((t >> 2) % 3), 3, 4, '#fff'); R(sx + W2 + 3, sy + 2 - ((t >> 2) % 3), 1, 1, '#e63946'); break;
      case 'snap': R(sx + 1, sy + 1, W2 + 2, W2, col); R(sx + W2 + 3, sy - 1 + ((t >> 4) % 2), 2, 2, hand); break;
      default: R(sx, sy, W2, armLen - 2, col); R(sx, sy + armLen - 2, W2, 2, hand);
    }
    if (!back && A.clipboard && (pose === 'down' || pose === 'hip')) { R(sx + 1 + swing, sy + armLen - 6, 5, 6, '#8a5a2a'); R(sx + 2 + swing, sy + armLen - 5, 3, 4, '#f4f0e6'); }
    if (!back && A.newspaper && pose === 'down') { R(sx + swing, sy + 2, 6, 7, '#e8e4d8'); R(sx + 1 + swing, sy + 3, 4, 1, '#444'); R(sx + 1 + swing, sy + 5, 4, 1, '#888'); }
    if (!back && A.songbook && pose === 'down') { R(sx + 1, sy + 3, 5, 4, '#c0303a'); R(sx + 2, sy + 4, 3, 2, '#fff'); }
    if (!back && A.wand && pose === 'down') { R(sx + 1, sy + armLen - 3, 1, 6, '#222'); }
    if (!back && A.notebook && pose === 'down') { R(sx + 1, sy + armLen - 5, 4, 5, '#f4f0e6'); }
    if (!back && A.ticketbook && pose === 'down') { R(sx + 1, sy + armLen - 5, 4, 5, '#ffd23f'); }
    if (A.strap && back) { R(tx0 - 1, torsoTop + torsoH - 3, 3, 4, A.strap); }
  }
}

function drawCrawl(g, S, P, R) {
  const t = P.t || 0, A = S.acc || {};
  const f = Math.floor(t / 7) % 2;
  const FY = FOOT_Y;
  // body horizontal: legs at back (left), torso middle, head front-low (right)
  const bodyY = FY - 7;
  R(8, bodyY + 3 - f, 5, 3, S.bottom); R(6, bodyY + 4 + f, 3, 2, S.shoes); // legs
  if (A.cape) R(10, bodyY - 1, 10, 3, A.cape);
  R(13, bodyY, 9, 6, S.top);
  if (S.topStyle === 'vest') R(14, bodyY + 1, 7, 4, S.top2);
  // head
  const hx = 21, hy = FY - 11;
  R(hx + 1, hy, 8, 9, S.skin); R(hx, hy + 1, 10, 7, S.skin);
  R(hx, hy - 1, 9, 3, S.hair); R(hx, hy, 2, 5, S.hair);
  R(hx + 6, hy + 4, 1, 2, '#20141c'); R(hx + 8, hy + 4, 1, 2, '#20141c');
  R(hx + 6, hy + 7, 2, 1, '#20141c');
  // arms reaching
  R(hx - 2 + (f ? 3 : 0), FY - 3, 3, 2, S.skin);
  R(hx + 2 + (f ? 0 : 3), FY - 3, 3, 2, shade(S.skin, -0.15));
  if (A.tophat) { R(hx - 6, FY - 6, 6, 5, A.tophat); R(hx - 7, FY - 2, 8, 1, A.tophat); }
}

// ---------------------------------------------------------------------------
// Sprite cache + blit
// ---------------------------------------------------------------------------
const SpriteCache = {
  map: new Map(),
  get(key, specFn, pose) {
    let c = this.map.get(key);
    if (c) return c;
    if (this.map.size > 900) this.map.clear();
    const [raw, rg] = makeCanvas(SPR_W, SPR_H);
    drawPerson(rg, specFn(), pose);
    c = outlineCanvas(raw);
    this.map.set(key, c);
    return c;
  },
};
function outlineCanvas(raw, col) {
  const [sil, sg] = makeCanvas(raw.width, raw.height);
  sg.drawImage(raw, 0, 0);
  sg.globalCompositeOperation = 'source-in';
  sg.fillStyle = col || OUTLINE;
  sg.fillRect(0, 0, raw.width, raw.height);
  const [out, og] = makeCanvas(raw.width + 2, raw.height + 2);
  og.drawImage(sil, 0, 1); og.drawImage(sil, 2, 1); og.drawImage(sil, 1, 0); og.drawImage(sil, 1, 2);
  og.drawImage(raw, 1, 1);
  return out;
}
const _specCache = new Map();
function cachedSpec(key, fn) {
  let s = _specCache.get(key);
  if (!s) { s = fn(); _specCache.set(key, s); }
  return s;
}
function personKey(id, pose) {
  return id + '|' + (pose.anim || 'idle') + '|' + (pose.frameKey !== undefined ? pose.frameKey : 0) + '|' + (pose.expr || '') + '|' + (pose.blink ? 1 : 0) + '|' + (pose.talk ? 1 : 0) + '|' + (pose.quirk || '');
}
// Normalise the pose's time into a frame key so caching works for animations
function frameKeyFor(pose) {
  const t = pose.t || 0;
  switch (pose.anim) {
    case 'walk': return Math.floor(t / (pose.fast ? 4 : 6)) % 4 + (pose.vx ? ':' + clamp(Math.round(Math.abs(pose.vx)), 0, 2) : '');
    case 'push': case 'pull': return Math.floor(t / 9) % 4;
    case 'fall': return Math.floor(t / 5) % 2;
    case 'climb': case 'crawl': return Math.floor(t / 8) % 2;
    case 'hold': return (t % 40 < 20) ? 0 : 1;
    case 'fix': return Math.floor(t / 6) % 2;
    case 'play': return Math.floor(t / 8) % 2;
    case 'talk': case 'charm': return Math.floor(t / 14) % 2 + (pose.talk ? ':' + (Math.floor(t / 5) % 2) : '');
    case 'cheer': return Math.floor(t / 8) % 2;
    case 'dance': return (Math.floor(t / 12) % 4) + ':' + (Math.floor(t / 6) % 2);
    case 'cry': return (Math.floor(t / 10) % 2) + ':' + ((t >> 2) % 4);
    case 'ow': return Math.floor(t / 7) % 2;
    case 'dizzy': return Math.round(Math.sin(t / 8) * 1.5);
    case 'idle': {
      let k = '';
      if (pose.quirk) {
        const q = pose.quirk;
        if (q === 'dex') k = (t % 120 < 50) ? 'q' : '';
        else if (q === 'mila') k = Math.floor(t / 7) % 2;
        else if (q === 'theo') k = (t >> 3) % 2;
        else if (q === 'benny') k = (t >> 2) % 3;
        else if (q === 'juno') k = Math.floor(t / 10) % 2 + ':' + ((t >> 4) % 2);
        else if (q === 'priya') k = Math.floor(t / 5) % 2;
      }
      return k + (pose.talk ? 't' + (Math.floor(t / 5) % 2) : '');
    }
    default: return pose.talk ? 't' + (Math.floor(t / 5) % 2) : 0;
  }
}

// Draw a person at bottom-centre (bx, by) in buffer space.
// opts: {flip, sx, sy (scale), alpha, tint}
function blitPerson(g, specId, specFn, pose, bx, by, opts) {
  opts = opts || {};
  pose.frameKey = frameKeyFor(pose);
  // the cache key must capture time-dependent details
  const key = specId + '|' + personKey('', pose) + (pose.anim === 'cry' || pose.expr === 'cry' ? '|' + ((pose.t >> 2) % 4) : '') + (pose.vxk !== undefined ? '|' + pose.vxk : '');
  const spr = SpriteCache.get(key, specFn, pose);
  const sx = opts.sx || 1, sy = opts.sy || 1;
  const w = spr.width * sx, h = spr.height * sy;
  const px = Math.round(bx - (SPR_W / 2 + 1) * sx), py = Math.round(by - (FOOT_Y + 1) * sy);
  const prev = g.globalAlpha;
  if (opts.alpha !== undefined) g.globalAlpha = prev * opts.alpha;
  if (opts.flip) {
    g.save();
    g.translate(Math.round(bx), 0);
    g.scale(-1, 1);
    g.drawImage(spr, Math.round(-(SPR_W / 2 + 1) * sx), py, Math.round(w), Math.round(h));
    g.restore();
  } else {
    g.drawImage(spr, px, py, Math.round(w), Math.round(h));
  }
  g.globalAlpha = prev;
}

function friendSpecId(who, outfit) { return who + '#' + (outfit || 0); }
function friendSpecFn(who, outfit) { return () => cachedSpec(friendSpecId(who, outfit), () => specFor(who, outfit)); }
function npcSpecFn(id, seed) {
  if (seed !== undefined) return () => cachedSpec(id + '~' + seed, () => variantSpec(id, seed));
  return () => cachedSpec('npc:' + id, () => { const s = JSON.parse(JSON.stringify(NPC_SPECS[id] || NPC_SPECS.commuter)); s.who = id; return s; });
}

// Portraits (head and shoulders) for HUD & menus, cached
const PortraitCache = new Map();
function portrait(who, outfit, expr) {
  const key = who + '|' + (outfit || 0) + '|' + (expr || 'neutral');
  let c = PortraitCache.get(key);
  if (c) return c;
  const [raw, rg] = makeCanvas(SPR_W, SPR_H);
  const spec = FRIENDS.includes(who) ? specFor(who, outfit) : (NPC_SPECS[who] ? JSON.parse(JSON.stringify(NPC_SPECS[who])) : specFor('dex', 0));
  drawPerson(rg, spec, { anim: 'idle', t: 0, expr: expr || 'happy' });
  // crop head area
  const top = FOOT_Y - spec.legH - spec.torsoH - spec.headH - 8;
  const [crop, cg] = makeCanvas(18, 18);
  cg.drawImage(raw, 11, Math.max(0, top), 18, 18, 0, 0, 18, 18);
  c = outlineCanvas(crop);
  PortraitCache.set(key, c);
  return c;
}

// ---------------------------------------------------------------------------
// Animals & machines
// ---------------------------------------------------------------------------
function drawIguana(g, x, y, flip, t, opts) {
  // x,y bottom-centre; ~18x9
  opts = opts || {};
  g.save();
  g.translate(Math.round(x), Math.round(y));
  if (flip) g.scale(-1, 1);
  const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(a, b, w, h); };
  const body = opts.color || '#5fae3c', dark = shade(body, -0.3), belly = '#b8d86a';
  const step = Math.floor(t / 5) % 2;
  const moving = opts.moving;
  // tail
  R(-12, -4, 5, 2, body); R(-15, -3, 4, 1, body); R(-17, -2, 3, 1, dark);
  // body
  R(-7, -6, 11, 5, body); R(-6, -2, 9, 1, belly);
  // spikes
  for (let i = -6; i < 3; i += 2) R(i, -7, 1, 1, dark);
  // head
  R(3, -7, 6, 4, body); R(8, -6, 2, 3, body); R(6, -6, 1, 1, '#111'); R(4, -3, 3, 1, '#d84a4a');
  // tongue flick
  if (opts.tongue || (t % 90) < 6) R(10, -4, 3, 1, '#e8507a');
  // legs
  const lo = moving ? step : 0;
  R(-6 + lo, -1, 2, 1, dark); R(-4 - lo, -1, 2, 1, dark); R(1 + lo, -1, 2, 1, dark); R(3 - lo, -1, 2, 1, dark);
  // tiny army helmet (he's Sarge)
  if (opts.helmet !== false) { R(3, -9, 6, 2, '#5a6a3a'); R(2, -8, 8, 1, '#4a5a2a'); }
  if (opts.pilot) { R(3, -10, 6, 3, '#1e3a6a'); R(3, -8, 8, 1, '#1e3a6a'); R(5, -9, 2, 1, '#ffd700'); }
  g.restore();
}
function drawPigeon(g, x, y, flip, t, flying) {
  g.save(); g.translate(Math.round(x), Math.round(y)); if (flip) g.scale(-1, 1);
  const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(a, b, w, h); };
  R(-4, -6, 7, 4, '#8a8a9a'); R(1, -8, 3, 3, '#7a7a8a'); R(3, -7, 1, 1, '#111'); R(4, -6, 2, 1, '#e8a020');
  R(-1, -5, 2, 1, '#5a9a8a');
  if (flying) { const f = (t >> 2) % 2; R(-3, f ? -10 : -5, 4, f ? 4 : 2, '#9a9aaa'); }
  else { R(-1, -2, 1, 2, '#e88a50'); R(1, -2, 1, 2, '#e88a50'); if ((t >> 4) % 3 === 0) R(1, -9, 3, 3, '#7a7a8a'); }
  g.restore();
}
function drawRabbit(g, x, y, flip, t) {
  g.save(); g.translate(Math.round(x), Math.round(y)); if (flip) g.scale(-1, 1);
  const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(a, b, w, h); };
  const hop = (t >> 3) % 2;
  R(-4, -6 - hop, 7, 5, '#f4f0ea'); R(2, -9 - hop, 4, 4, '#f4f0ea'); R(3, -14 - hop, 1, 5, '#f4f0ea'); R(5, -13 - hop, 1, 4, '#f4f0ea');
  R(3, -13 - hop, 1, 3, '#ffb0c0'); R(4, -8 - hop, 1, 1, '#c03050'); R(6, -7 - hop, 1, 1, '#ff8fa0'); R(-5, -5 - hop, 2, 2, '#fff');
  g.restore();
}
function drawRobot(g, x, y, flip, t, opts) {
  // Theo's Tidy-Bot 9000: a round vacuum robot with an arm and a face screen
  opts = opts || {};
  g.save(); g.translate(Math.round(x), Math.round(y)); if (flip) g.scale(-1, 1);
  const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(a, b, w, h); };
  const bob = (t >> 3) % 2;
  R(-9, -8 - bob, 18, 6, '#c8d0d8'); R(-8, -9 - bob, 16, 1, '#e0e6ea'); R(-9, -3 - bob, 18, 1, '#7a8088');
  R(-3, -7 - bob, 8, 3, '#1a2a3a'); R(-1, -6 - bob, 1, 1, '#5cf0ff'); R(2, -6 - bob, 1, 1, '#5cf0ff');
  if ((t >> 4) % 2) R(-1, -5 - bob, 4, 1, '#5cf0ff');
  R(-7, -2, 4, 2, '#333'); R(3, -2, 4, 2, '#333');
  R(-8, -12 - bob, 1, 4, '#888'); R(-9, -13 - bob, 3, 1, (t >> 2) % 2 ? '#ff4a4a' : '#ffd23f');
  if (opts.arm) { R(8, -8 - bob, 5, 1, '#888'); R(12, -10 - bob, 1, 3, '#888'); }
  g.restore();
}
function drawRoboDog(g, x, y, flip, t, sitting) {
  g.save(); g.translate(Math.round(x), Math.round(y)); if (flip) g.scale(-1, 1);
  const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(a, b, w, h); };
  const s = sitting ? 2 : 0;
  R(-7, -9 + s, 11, 5, '#a8b0c0'); R(3, -13 + s, 6, 5, '#a8b0c0'); R(7, -11 + s, 1, 1, '#ff3a3a'); R(8, -9 + s, 3, 2, '#8890a0');
  R(4, -15 + s, 1, 2, '#8890a0'); R(-8, -11 + s, 1, 3, '#8890a0');
  if (!sitting) { const f = (t >> 3) % 2; R(-6, -4, 2, 4 - f, '#7a8090'); R(1, -4, 2, 3 + f, '#7a8090'); } else { R(-6, -3, 3, 3, '#7a8090'); R(1, -3, 2, 3, '#7a8090'); }
  g.restore();
}
function drawDove(g, x, y, t) {
  const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x + a), Math.round(y + b), w, h); };
  const f = (t >> 2) % 2;
  R(-3, -2, 6, 3, '#fff'); R(2, -3, 2, 2, '#fff'); R(4, -2, 1, 1, '#e8a020');
  R(-2, f ? -6 : -1, 4, f ? 4 : 2, '#f0f0f0');
}
