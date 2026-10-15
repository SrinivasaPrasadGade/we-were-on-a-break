// ---------------------------------------------------------------------------
// Sitcom staging: sets, cutscenes, freeze-frames, establishing shots, title cards
// ---------------------------------------------------------------------------
// Each set is a single-screen "stage" (30x17 tiles). Floor at row 14 => feet y = 224.
const SETS = {
  cafe: {
    theme: 'cafe', floor: 14,
    map: [
      '##############################',
      '..............................',
      '..............................',
      '..l......l.........l......l...',
      '......w.w.....................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '...........................f..',
      '##############################',
      '##############################',
      '##############################',
    ],
    props: [['window', 80, 52], ['chalk', 300, 66], ['counter', 330, 160], ['couch', 120, 186], ['coffeetable', 150, 210], ['lamp', 44, 160], ['door', 6, 176]],
    doors: { L: 20, D1: 20 },
  },
  apt3a: {
    theme: 'apt', floor: 14,
    map: [
      '##############################',
      '..............................',
      '..............................',
      '..............................',
      '..........w...........i.......',
      '...i..........................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '....................b.........',
      '##############################',
      '##############################',
      '##############################',
    ],
    props: [['door', 6, 176], ['kitchen', 380, 150], ['terrarium', 300, 178], ['workbench', 220, 186], ['couch', 60, 186]],
  },
  apt3b: {
    theme: 'apt2', floor: 14,
    map: [
      '##############################',
      '..............................',
      '..............................',
      '..............................',
      '.......w.........w............',
      '..............................',
      '..n.......................n...',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '##############################',
      '##############################',
      '##############################',
    ],
    props: [['door', 6, 176], ['bikes', 380, 120], ['keyboard', 300, 190], ['couch', 110, 186], ['partytable', 220, 196]],
  },
  hall: {
    theme: 'hall', floor: 14,
    map: [
      '##############################',
      '..............................',
      '..............................',
      '....l.........l.........l.....',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..d..........d..........d.....',
      '##############################',
      '##############################',
      '##############################',
    ],
    labels: ['3A', '3B', '3C'],
    props: [['rug', 150, 222]],
  },
  roof: {
    theme: 'roof', floor: 14,
    map: [
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '#.............................',
      '##############################',
      '##############################',
      '##############################',
    ],
    props: [['grill', 330, 196], ['lawnchairs', 100, 200], ['lights', 0, 120], ['roofdoor', 410, 160]],
  },
  street: {
    theme: 'street', floor: 14,
    map: [
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '....w....w.....w....w....w....',
      '..............................',
      '..............................',
      '..............................',
      '.......u......................',
      '.q.......................q...h',
      '##############################',
      '##############################',
      '##############################',
    ],
    props: [],
  },
  stage: {
    theme: 'theater', floor: 14,
    map: [
      '##############################',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '##############################',
      '##############################',
      '##############################',
    ],
    props: [['spotlight', 240, 0], ['magicbox', 330, 190]],
  },
  ballroom: {
    theme: 'ballroom', floor: 14,
    map: [
      '##############################',
      '..............................',
      '....y..........y.........y....',
      '..............................',
      '.......w..........w...........',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '##############################',
      '##############################',
      '##############################',
    ],
    props: [['arch', 220, 120], ['bandstand', 360, 170]],
  },
  expo: {
    theme: 'expo', floor: 14,
    map: [
      '##############################',
      '..............................',
      '..............................',
      '...n.......n..........n.......',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '##############################',
      '##############################',
      '##############################',
    ],
    props: [['booth', 300, 150], ['podium', 120, 190]],
  },
  gate: {
    theme: 'airport', floor: 14,
    map: [
      '##############################',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '##############################',
      '##############################',
      '##############################',
    ],
    openings: [[1, 2, 28, 8]],
    props: [['gatedesk', 330, 186], ['gatesign', 340, 60], ['seats', 60, 200]],
  },
  snowcafe: { base: 'cafe', snowy: true },
  closedcafe: { base: 'cafe', closed: true },
  grandcafe: { base: 'cafe', grand: true },
  subway: {
    theme: 'train', floor: 14,
    map: [
      '##############################',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '##############################',
      '##############################',
      '##############################',
    ],
    openings: [[2, 4, 4, 4], [10, 4, 4, 4], [18, 4, 4, 4], [25, 4, 4, 4]],
    props: [['poles', 0, 0], ['trainseats', 0, 200]],
  },
};
const SET_CACHE = {};
function getSet(name) {
  if (SET_CACHE[name]) return SET_CACHE[name];
  let def = SETS[name] || SETS.cafe;
  const extra = def;
  if (def.base) def = Object.assign({}, SETS[def.base], { variant: extra });
  const room = new Room({ map: def.map, theme: def.theme, labels: def.labels, openings: def.openings }, { friends: [] });
  renderRoomLayers(room);
  const s = { name, def, room, floorY: def.floor * T, variant: def.variant || {} };
  SET_CACHE[name] = s;
  return s;
}

// ---------------------------------------------------------------------------
// Set furniture (drawn at the stage's fixed wide shot)
// ---------------------------------------------------------------------------
function drawSetProp(g, kind, x, y, t, set) {
  const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x + a), Math.round(y + b), w, h); };
  switch (kind) {
    case 'couch': // the big comfy couch, 120 wide
      R(0, 14, 120, 24, '#8a3a2a'); R(-6, 8, 12, 30, '#7a2e20'); R(114, 8, 12, 30, '#7a2e20');
      R(6, 0, 108, 18, '#9a4a36'); R(6, 0, 108, 2, '#b8664e'); R(42, 2, 1, 16, '#7a2e20'); R(78, 2, 1, 16, '#7a2e20');
      R(6, 18, 108, 8, '#a8563f'); R(6, 18, 108, 1, '#c87a5e'); R(42, 18, 1, 8, '#8a3a2a'); R(78, 18, 1, 8, '#8a3a2a');
      R(-4, 36, 4, 4, '#3a2018'); R(120, 36, 4, 4, '#3a2018');
      R(14, 6, 10, 9, '#e8c070'); R(96, 6, 10, 9, '#6aa8c8');
      if (set && set.variant && set.variant.grand) { R(6, 0, 108, 2, '#ffd23f'); }
      break;
    case 'coffeetable':
      R(0, 0, 60, 4, '#6a4a2a'); R(0, 0, 60, 1, '#8a6a4a'); R(4, 4, 3, 10, '#4a2e1a'); R(53, 4, 3, 10, '#4a2e1a');
      drawCupIcon(g, x + 10, y - 9); drawCupIcon(g, x + 40, y - 9);
      R(24, -3, 12, 3, '#d8c8a8');
      break;
    case 'counter':
      R(0, 0, 150, 6, '#4a2a1a'); R(0, 0, 150, 1, '#6a4a3a'); R(4, 6, 142, 58, '#6a3a24'); for (let i = 10; i < 146; i += 24) R(i, 10, 18, 48, '#5a3020');
      R(20, -22, 30, 22, '#b8bcc4'); R(24, -18, 22, 8, '#3a3a40'); R(28, -15, 4, 3, '#7cf29a'); // espresso
      R(70, -14, 30, 14, '#e8dcc8'); R(72, -12, 26, 2, '#c8a070'); R(74, -9, 6, 6, '#c86a3a'); R(84, -9, 6, 6, '#e8b040'); // pastry case
      R(116, -10, 14, 10, '#4a8a5a'); R(118, -14, 10, 4, '#3a3a3a'); // register
      break;
    case 'chalk': // menu chalkboard
      R(0, 0, 96, 56, '#5a3a22'); R(3, 3, 90, 50, '#2a3a32');
      drawText('THE DAILY GRIND', x + 48, y + 6, '#f4efe6', { align: 'center' });
      drawText('Coffee ..... $2', x + 8, y + 19, '#d8e8d0'); drawText('Latte ...... $4', x + 8, y + 29, '#d8e8d0'); drawText('Couch ...... $$$', x + 8, y + 39, '#ffb0a0');
      break;
    case 'window': {
      // big front window with rain
      R(-4, -4, 128, 96, '#3a2018');
      g.fillStyle = '#1a2440'; g.fillRect(x, y, 120, 88);
      for (let i = 0; i < 9; i++) { g.fillStyle = 'rgba(255,220,140,0.5)'; g.fillRect(x + 8 + i * 13, y + 40 + (i % 3) * 8, 3, 4); }
      g.fillStyle = 'rgba(140,170,220,0.6)';
      for (let i = 0; i < 26; i++) { const rx = (hash2(i, 1, 2) * 120 + t * 0.2) % 120, ry = (hash2(i, 2, 2) * 88 + t * (2 + hash2(i, 3, 2))) % 88; g.fillRect(x + rx, y + ry, 1, 4); }
      R(58, 0, 4, 88, '#3a2018'); R(0, 42, 120, 4, '#3a2018');
      drawText('DNIRG YLIAD EHT', x + 60, y + 12, 'rgba(255,200,120,0.6)', { align: 'center' });
      if (set && set.variant && set.variant.closed) { R(36, 50, 48, 20, '#f4efe6'); drawText('CLOSED', x + 60, y + 56, '#c83a3a', { align: 'center' }); }
      break;
    }
    case 'lamp':
      R(8, 0, 2, 64, '#2a2a2a'); R(0, -10, 18, 12, '#e8c080'); R(2, -8, 14, 2, '#fff0c0'); R(4, 62, 10, 2, '#2a2a2a');
      break;
    case 'door':
      R(0, 0, 4, 48, '#3a2018'); R(4, 0, 22, 48, '#7a4a30'); R(8, 4, 14, 16, '#9ac8e8'); R(20, 24, 3, 3, '#e0c060');
      break;
    case 'kitchen':
      R(0, 0, 90, 74, '#e8e4dc'); R(0, 30, 90, 4, '#8a6a4a'); R(4, 34, 40, 40, '#d8d4cc'); R(48, 34, 40, 40, '#d8d4cc');
      R(56, 10, 26, 18, '#c8ccd4'); R(60, 14, 18, 8, '#3a3a40'); // microwave
      R(8, 18, 20, 12, '#b8b8c0'); R(10, 14, 6, 4, '#3a3a3a'); R(18, 12, 6, 6, '#3a3a3a'); // toaster (charred)
      break;
    case 'terrarium':
      R(0, 0, 60, 34, '#5a3a22'); R(2, 2, 56, 28, 'rgba(160,220,200,0.35)'); R(2, 22, 56, 8, '#8a6a3a'); R(10, 14, 6, 8, '#3a8a3a');
      break;
    case 'workbench':
      R(0, 0, 70, 5, '#8a5a34'); R(4, 5, 3, 33, '#5a3a22'); R(63, 5, 3, 33, '#5a3a22');
      R(8, -10, 14, 10, '#7a7e86'); R(10, -14, 2, 4, '#ffd23f'); R(30, -6, 20, 6, '#b8c0c8'); R(54, -8, 8, 8, '#c84a3a');
      break;
    case 'bikes':
      for (let i = 0; i < 2; i++) { circleFill(x + 10 + i * 40, y + 30, 9, '#2a2a2a', g); circleFill(x + 10 + i * 40, y + 30, 6, '#5a5a5a', g); circleFill(x + 34 + i * 40, y + 30, 9, '#2a2a2a', g); circleFill(x + 34 + i * 40, y + 30, 6, '#5a5a5a', g); R(10 + i * 40, 22, 24, 3, i ? '#ff6b35' : '#2ec4b6'); }
      R(0, 0, 90, 4, '#5a3a22');
      break;
    case 'keyboard':
      R(0, 0, 60, 8, '#2a2a2e'); R(2, 1, 56, 4, '#f4f4f4'); for (let i = 3; i < 58; i += 4) R(i, 1, 2, 2, '#222'); R(6, 8, 3, 26, '#555'); R(51, 8, 3, 26, '#555');
      break;
    case 'partytable':
      R(0, 0, 70, 4, '#f4efe6'); R(0, 4, 70, 14, '#ff4f9a'); R(4, 18, 3, 10, '#555'); R(63, 18, 3, 10, '#555');
      R(20, -10, 30, 10, '#f4f0e0'); R(22, -12, 26, 2, '#ff8fab'); for (let i = 0; i < 5; i++) R(24 + i * 5, -16, 1, 4, '#ffd23f');
      break;
    case 'rug': R(0, 0, 180, 3, '#8a2a3a'); R(4, 0, 172, 1, '#c8a040'); break;
    case 'grill':
      R(0, 0, 40, 14, '#2a2a2e'); R(-2, -2, 44, 3, '#3a3a40'); R(6, 14, 3, 14, '#2a2a2e'); R(31, 14, 3, 14, '#2a2a2e');
      for (let i = 2; i < 38; i += 4) R(i, -4 - (t >> 3) % 2, 2, 2, (i + (t >> 3)) % 3 ? '#ff6a2a' : '#ffd23f');
      break;
    case 'lawnchairs':
      for (let i = 0; i < 2; i++) { R(i * 60, 0, 30, 3, '#4cc9f0'); R(i * 60, 3, 3, 20, '#c8c8c8'); R(i * 60 + 27, 3, 3, 20, '#c8c8c8'); R(i * 60 + 4, -14, 3, 14, '#c8c8c8'); R(i * 60 + 4, -14, 24, 3, '#4cc9f0'); }
      break;
    case 'lights':
      for (let i = 0; i < 30; i++) { const lx = i * 16, ly = Math.sin(i * 0.8) * 4; g.fillStyle = '#3a3a3a'; g.fillRect(lx, y + ly, 16, 1); g.fillStyle = ['#ff5a5a', '#ffd23f', '#5ae0a0', '#5ab0ff'][i % 4]; g.fillRect(lx + 7, y + ly + 1, 2, 3); }
      break;
    case 'roofdoor':
      R(0, 0, 44, 64, '#8a4a3a'); R(8, 16, 26, 48, '#5a3a2a'); R(28, 40, 3, 3, '#e0c060');
      break;
    case 'spotlight':
      g.fillStyle = 'rgba(255,240,180,0.18)';
      g.beginPath(); g.moveTo(x, y); g.lineTo(x - 70, y + 224); g.lineTo(x + 70, y + 224); g.closePath(); g.fill();
      break;
    case 'magicbox':
      R(0, 0, 60, 34, '#5a189a'); R(2, 2, 56, 30, '#7a38ba'); for (let i = 0; i < 5; i++) R(6 + i * 11, 8 + (i % 2) * 10, 3, 3, '#ffd166'); R(28, -6, 4, 40, '#c8c8c8');
      break;
    case 'arch':
      R(0, 0, 4, 104, '#e8e0f0'); R(60, 0, 4, 104, '#e8e0f0'); R(0, -4, 64, 6, '#e8e0f0');
      for (let i = 0; i < 9; i++) { circleFill(x + 2 + (i < 5 ? 0 : 60), y + i * 12, 4, i % 2 ? '#ff8fab' : '#ffffff', g); }
      for (let i = 0; i < 8; i++) circleFill(x + 4 + i * 8, y - 2, 4, i % 2 ? '#ff8fab' : '#ffffff', g);
      break;
    case 'bandstand':
      R(0, 30, 100, 24, '#5a3a22'); R(0, 30, 100, 2, '#8a6a4a'); R(10, 14, 20, 16, '#2a2a2e'); R(70, 14, 20, 16, '#2a2a2e'); R(40, 10, 20, 8, '#ff4f9a');
      break;
    case 'booth':
      R(0, 0, 120, 74, '#2a3a5a'); R(4, 4, 112, 20, '#4cc9f0'); drawText("THEO'S INVENTIONS", x + 60, y + 9, '#1a2a3a', { align: 'center' });
      R(10, 40, 100, 34, '#d8dce4');
      break;
    case 'podium':
      R(0, 0, 40, 40, '#5a3a22'); R(-4, -4, 48, 6, '#7a5a3a'); R(18, -14, 2, 10, '#555'); R(14, -18, 10, 5, '#333');
      break;
    case 'gatedesk':
      R(0, 0, 90, 38, '#2a4a7a'); R(0, 0, 90, 4, '#e8eef2'); R(30, -16, 30, 14, '#1a2a3a'); R(32, -14, 26, 10, '#3a6ac8');
      break;
    case 'gatesign':
      R(0, 0, 90, 30, '#1a1a22'); drawText('GATE 47', x + 45, y + 4, '#ffd23f', { align: 'center' }); drawText('FLIGHT 88 - 3:00', x + 45, y + 16, '#7cf29a', { align: 'center' });
      break;
    case 'seats':
      for (let i = 0; i < 4; i++) { R(i * 24, 0, 22, 4, '#4a6a9a'); R(i * 24, -14, 4, 14, '#4a6a9a'); R(i * 24 + 9, 4, 3, 20, '#888'); }
      break;
    case 'poles':
      for (let i = 0; i < 5; i++) { g.fillStyle = '#c8ccd0'; g.fillRect(40 + i * 100, 32, 2, 192); }
      g.fillStyle = '#c8ccd0'; g.fillRect(0, 34, 480, 2);
      break;
    case 'trainseats':
      for (let i = 0; i < 6; i++) { R(i * 84 + 10, 0, 50, 6, '#3a6ac8'); R(i * 84 + 10, -16, 50, 6, '#2a5ab8'); R(i * 84 + 14, 6, 3, 18, '#555'); R(i * 84 + 53, 6, 3, 18, '#555'); }
      break;
    case 'sign': {
      const txt = set || '';
      const w = textWidth(txt) + 12;
      R(0, 0, w, 16, '#1a1a22'); R(1, 1, w - 2, 14, '#f4efe6'); drawText(txt, x + w / 2, y + 4, '#c83a3a', { align: 'center' });
      break;
    }
    case 'letter':
      R(0, 0, 18, 12, '#f4efe6'); R(0, 0, 18, 1, '#c8c0b0'); R(3, 4, 10, 1, '#555'); R(3, 7, 8, 1, '#555');
      break;
    case 'lettuce':
      R(0, 0, 8, 6, '#6ac84a'); R(1, -1, 5, 2, '#8ae86a');
      break;
    case 'toast':
      R(0, 0, 8, 7, '#c8904a'); R(1, 1, 6, 5, '#e8c080'); R(2, 2, 2, 1, '#3a2a1a');
      break;
    case 'flowers':
      R(3, 6, 2, 8, '#3a8a3a'); circleFill(x + 4, y + 4, 3, '#ff8fab', g); circleFill(x + 1, y + 7, 2, '#ffd23f', g);
      break;
    case 'banner': {
      const txt = set || 'GRAND REOPENING';
      R(0, 0, 220, 18, '#c83a3a'); R(2, 2, 216, 14, '#e85a4a'); drawText(txt, x + 110, y + 5, '#ffffff', { align: 'center' });
      break;
    }
    case 'contract':
      R(0, 0, 14, 18, '#f4efe6'); for (let i = 3; i < 15; i += 3) R(2, i, 10, 1, '#888'); R(2, 15, 6, 1, '#3a6ac8');
      break;
    case 'iguana': drawIguana(g, x, y, false, t, { tongue: (t % 80) < 6 }); break;
    case 'iguanaL': drawIguana(g, x, y, true, t, { tongue: (t % 80) < 6 }); break;
    case 'iguanaPilot': drawIguana(g, x, y, true, t, { pilot: true }); break;
    case 'robot': drawRobot(g, x, y, false, t, { arm: true }); break;
    case 'rabbit': drawRabbit(g, x, y, false, t); break;
    case 'cake':
      R(0, 0, 30, 16, '#f4e0f0'); R(0, 0, 30, 4, '#ff8fab'); for (let i = 0; i < 4; i++) { R(4 + i * 7, -6, 2, 6, '#7ac8f0'); R(4 + i * 7, -8 - (t >> 3) % 2, 2, 2, '#ffd23f'); }
      break;
    case 'snowpile': R(0, 0, 480, 20, '#f4f8fc'); for (let i = 0; i < 480; i += 24) circleFill(x + i + 12, y + 2, 10, '#f4f8fc', g); break;
    default: break;
  }
}

// ---------------------------------------------------------------------------
// Cutscene scene
// ---------------------------------------------------------------------------
const ACTOR_INFO = {
  gus: { name: 'GUS', color: '#8ac89a', voice: 'gus' },
  holloway: { name: 'MR. HOLLOWAY', color: '#d8b84a', voice: 'holloway' },
  roz: { name: 'ROZ', color: '#c88ad8', voice: 'roz' },
  sarge: { name: 'SARGE', color: '#6ac84a', voice: 'sarge', animal: 'iguana' },
  robot: { name: 'TIDY-BOT', color: '#8adcf0', voice: 'robot', animal: 'robot' },
  fenwick: { name: 'MR. FENWICK', color: '#9ab8e0', voice: 'npc' },
  inspector: { name: 'INSPECTOR', color: '#b0b8c0', voice: 'npc' },
  planner: { name: 'PLANNER', color: '#b0b0b0', voice: 'npc' },
  bride: { name: 'ROZ', color: '#c88ad8', voice: 'roz' },
  groom: { name: 'MR. HOLLOWAY', color: '#d8b84a', voice: 'holloway' },
  stagehand: { name: 'STAGE MGR', color: '#a0a0a0', voice: 'npc' },
  inventor: { name: 'DR. KESSLER', color: '#d0d0d0', voice: 'npc' },
  gateagent: { name: 'GATE AGENT', color: '#7aa8e0', voice: 'npc' },
  vance: { name: 'MR. VANCE', color: '#e8d070', voice: 'npc' },
  critic: { name: 'THE CRITIC', color: '#c86a9a', voice: 'npc' },
  agent: { name: 'AGENT', color: '#c86a6a', voice: 'npc' },
  security: { name: 'SECURITY', color: '#9a9aaa', voice: 'npc' },
  officer: { name: 'OFFICER', color: '#6a9ad8', voice: 'npc' },
  announcer: { name: 'ANNOUNCER', color: '#f4efe6', voice: 'npc', offscreen: true },
  phone: { name: 'GUS (PHONE)', color: '#8ac89a', voice: 'gus', offscreen: true },
  crowd: { name: 'CROWD', color: '#f4efe6', voice: 'npc', offscreen: true },
};
function actorName(who) { return FRIEND_INFO[who] ? FRIEND_INFO[who].name : (ACTOR_INFO[who] ? ACTOR_INFO[who].name : who.toUpperCase()); }
function actorColor(who) { return FRIEND_INFO[who] ? FRIEND_INFO[who].color : (ACTOR_INFO[who] ? ACTOR_INFO[who].color : '#c8b8a8'); }
function actorVoice(who) { return VOICES[who] ? who : (ACTOR_INFO[who] ? ACTOR_INFO[who].voice : 'npc'); }

class CutsceneScene {
  constructor(script, opts) {
    this.script = script; this.opts = opts || {};
    this.i = 0; this.t = 0;
    this.actors = {}; this.props = [];
    this.set = null; this.bubble = null; this.waiting = null;
    this.zoom = { s: 1, tx: W / 2, ty: H / 2, cs: 1, cx: W / 2, cy: H / 2 };
    this.dark = false; this.darkA = 0; this.caption = null; this.flash = 0;
    this.frozen = null; this.freezeT = 0; this.done = false; this.skipHint = 0;
    this.recap = !!this.opts.recap;
    this.emotes = [];
    this.wantsTouch = false;
    this.exec();
  }
  actor(who) {
    if (!this.actors[who]) this.actors[who] = { who, x: -100, y: 224, face: 1, anim: 'idle', expr: 'neutral', t: rndi(0, 50), visible: false, alpha: 1, walkTo: null, speed: 1.3, animT: 0, blinkT: rndi(50, 200) };
    return this.actors[who];
  }
  floorY() { return this.set ? this.set.floorY : 224; }
  exec() {
    // run instant commands until a blocking one
    while (this.i < this.script.length && !this.waiting && !this.frozen) {
      const c = this.script[this.i++];
      this.run(c);
    }
    if (this.i >= this.script.length && !this.waiting && !this.frozen && !this.endT) this.endT = 1;
  }
  run(c) {
    const op = c[0];
    const A = w => this.actor(w);
    switch (op) {
      case 'set': this.set = getSet(c[1]); this.setName = c[1]; this.props = []; if (c[2]) this.setLabel = c[2]; break;
      case 'at': {
        const a = A(c[1]); const o = c[3] || {};
        a.x = c[2]; a.y = o.y !== undefined ? o.y : this.floorY(); a.visible = true; a.face = o.face || (a.x < W / 2 ? 1 : -1);
        a.anim = o.anim || 'idle'; a.expr = o.expr || 'neutral'; a.alpha = 1; a.sit = o.anim === 'sit';
        break;
      }
      case 'enter': {
        const a = A(c[1]); const from = c[2]; const o = c[4] || {};
        a.visible = true; a.y = o.y !== undefined ? o.y : this.floorY();
        a.x = from === 'L' ? -20 : from === 'R' ? W + 20 : (this.set && this.set.def.doors && this.set.def.doors[from]) || 20;
        if (from !== 'L' && from !== 'R') { a.alpha = 0; a.fadeIn = true; }
        a.walkTo = c[3]; a.anim = 'walk'; a.face = c[3] > a.x ? 1 : -1; a.expr = o.expr || 'neutral';
        if (o.wait) this.waiting = { type: 'walk', who: c[1] };
        if (from !== 'L' && from !== 'R') AudioSys.sfx('creak');
        break;
      }
      case 'walk': {
        const a = A(c[1]); const o = c[3] || {};
        a.walkTo = c[2]; a.anim = 'walk'; a.face = c[2] > a.x ? 1 : -1; a.sit = false;
        if (o.wait) this.waiting = { type: 'walk', who: c[1] };
        break;
      }
      case 'exit': {
        const a = A(c[1]);
        a.walkTo = c[2] === 'L' ? -40 : c[2] === 'R' ? W + 40 : c[2]; a.anim = 'walk'; a.face = a.walkTo > a.x ? 1 : -1; a.exiting = true; a.sit = false;
        if (c[3] && c[3].wait) this.waiting = { type: 'walk', who: c[1] };
        break;
      }
      case 'say': {
        const who = c[1], text = c[2], o = c[3] || {};
        const a = this.actors[who];
        if (a && o.expr) a.expr = o.expr;
        if (a && o.anim) { a.anim = o.anim; a.animT = 0; }
        if (a && o.face) a.face = o.face;
        this.bubble = { who, text: normText(text), shown: 0, t: 0, done: false, sing: !!o.sing };
        this.waiting = { type: 'say' };
        break;
      }
      case 'sing': {
        const who = c[1] || 'juno';
        const a = this.actor(who); a.anim = 'play'; a.expr = 'happy';
        const dur = playJingle(c[2], c[2].length * 7);
        this.bubble = { who, text: normText('♪ ' + c[2] + ' ♪'), shown: 0, t: 0, done: false, sing: true, minT: Math.round(dur * 60) };
        this.waiting = { type: 'say' };
        break;
      }
      case 'expr': if (c[1] === 'all') { for (const k in this.actors) this.actors[k].expr = c[2]; } else A(c[1]).expr = c[2]; break;
      case 'anim': { const targets = c[1] === 'all' ? Object.values(this.actors) : [A(c[1])]; for (const a of targets) { a.anim = c[2]; a.animT = 0; a.sit = c[2] === 'sit'; } break; }
      case 'face': { const a = A(c[1]); if (typeof c[2] === 'number') a.face = c[2]; else { const b = this.actors[c[2]]; if (b) a.face = b.x > a.x ? 1 : -1; } break; }
      case 'faceall': { const b = this.actors[c[1]]; if (b) for (const k in this.actors) { const a = this.actors[k]; if (a !== b) a.face = b.x > a.x ? 1 : -1; } break; }
      case 'laugh': AudioSys.audience(c[1] || 'laugh', c[2] || 0.85); break;
      case 'wait': this.waiting = { type: 'time', t: c[1] }; break;
      case 'sfx': AudioSys.sfx(c[1]); break;
      case 'shake': this.shakeAmt = c[1] || 3; break;
      case 'flash': this.flash = 8; break;
      case 'pop': {
        const a = A(c[1]); a.x = c[2]; a.y = c[3] !== undefined ? c[3] : this.floorY(); a.visible = true; a.alpha = 1; a.anim = c[4] || 'cheer'; a.expr = 'grin'; a.animT = 0;
        Particles.puff(a.x, a.y - 14, 16); AudioSys.sfx('magic');
        break;
      }
      case 'vanish': { const a = A(c[1]); Particles.puff(a.x, a.y - 14, 16); a.visible = false; AudioSys.sfx('poof'); break; }
      case 'hide': A(c[1]).visible = false; break;
      case 'prop': {
        const id = c[1];
        let p = this.props.find(q => q.id === id);
        if (!p) { p = { id, kind: c[2], x: c[3], y: c[4], t: 0, data: c[5] }; this.props.push(p); }
        else { p.kind = c[2] || p.kind; p.x = c[3] !== undefined ? c[3] : p.x; p.y = c[4] !== undefined ? c[4] : p.y; if (c[5] !== undefined) p.data = c[5]; }
        break;
      }
      case 'moveprop': { const p = this.props.find(q => q.id === c[1]); if (p) { p.tx = c[2]; p.ty = c[3]; p.speed = c[4] || 2; } break; }
      case 'unprop': this.props = this.props.filter(q => q.id !== c[1]); break;
      case 'zoom': {
        if (!c[1]) { this.zoom.s = 1; this.zoom.tx = W / 2; this.zoom.ty = H / 2; }
        else { const a = this.actors[c[1]]; if (a) { this.zoom.s = c[2] || 1.8; this.zoom.tx = a.x; this.zoom.ty = a.y - 22; } }
        this.zoom.cut = true;
        break;
      }
      case 'dark': this.dark = !!c[1]; if (c[2]) this.darkA = this.dark ? 1 : 0; break;
      case 'caption': this.caption = { text: c[1], t: 0, dur: c[2] || 90, sub: c[3] }; if (c[2] !== 0) this.waiting = { type: 'time', t: c[2] || 90 }; break;
      case 'music': Music.play(c[1]); break;
      case 'stopmusic': Music.stop(c[1] || 0.5); break;
      case 'freeze': this.startFreeze(); break;
      case 'emote': { const a = A(c[1]); this.emotes.push({ a, k: c[2], t: 0 }); break; }
      case 'jump': { const a = A(c[1]); a.hop = 12; AudioSys.sfx('jump'); break; }
      case 'fx': {
        const [k, x, y] = [c[1], c[2], c[3]];
        if (k === 'confetti') Particles.confetti(W / 2, 0, 90);
        else if (k === 'sparks') { Particles.sparks(x, y, 20); AudioSys.sfx('spark'); }
        else if (k === 'puff') { Particles.puff(x, y, 18); AudioSys.sfx('poof'); }
        else if (k === 'notes') Particles.notes(x, y, 8);
        else if (k === 'hearts') Particles.hearts(x, y, 8);
        else if (k === 'steam') { for (let i = 0; i < 6; i++) Particles.puff(x + rnd(-10, 10), y, 3); AudioSys.sfx('steam'); }
        break;
      }
      case 'call': if (typeof c[1] === 'function') c[1](this); break;
      default: break;
    }
  }
  startFreeze() {
    // capture current frame
    this.draw(true);
    const [fc, fg] = makeCanvas(W, H);
    fg.drawImage(buf, 0, 0);
    this.frozen = fc; this.freezeT = 0; this.flash = 6;
    Music.stop(0.1);
    Music.oneShot('sting_freeze', 1);
    AudioSys.sfx('clack');
  }
  update() {
    this.t++;
    if (this.skipHint < 200) this.skipHint++;
    const m = Input.menu;
    // skip whole scene
    if ((Input.keyPressed('Escape') || Input.clickIn(W - 50, 2, 48, 14)) && !this.opts.noSkip) { this.finish(); return; }
    if (this.flash > 0) this.flash--;
    if (this.frozen) {
      this.freezeT++;
      if (this.freezeT > 30 && (m.ok || Input.clicks.length)) { Input.clicks.length = 0; this.freezeT = Math.max(this.freezeT, 150); }
      if (this.freezeT > (this.opts.freezeHold || 150)) this.finish();
      return;
    }
    if (this.endT) { this.endT++; if (this.endT > 20) this.finish(); return; }
    // actors
    for (const k in this.actors) {
      const a = this.actors[k];
      a.t++; a.animT++;
      if (--a.blinkT < -6) a.blinkT = rndi(100, 280);
      if (a.hop > 0) a.hop--;
      if (a.fadeIn) { a.alpha = Math.min(1, a.alpha + 0.1); if (a.alpha >= 1) a.fadeIn = false; }
      if (a.walkTo !== null && a.walkTo !== undefined) {
        const d = a.walkTo - a.x;
        if (Math.abs(d) <= a.speed) {
          a.x = a.walkTo; a.walkTo = null; a.anim = 'idle';
          if (a.exiting) { a.visible = false; a.exiting = false; }
        } else { a.x += Math.sign(d) * a.speed; a.face = Math.sign(d); a.anim = 'walk'; }
      }
    }
    for (const p of this.props) {
      p.t++;
      if (p.tx !== undefined) {
        const dx = p.tx - p.x, dy = p.ty - p.y, d = Math.hypot(dx, dy);
        if (d <= p.speed) { p.x = p.tx; p.y = p.ty; p.tx = undefined; }
        else { p.x += dx / d * p.speed; p.y += dy / d * p.speed; }
      }
    }
    for (const e of this.emotes) e.t++;
    this.emotes = this.emotes.filter(e => e.t < 70);
    Particles.update();
    if (this.shakeAmt > 0) { this.shakeAmt *= 0.85; if (this.shakeAmt < 0.3) this.shakeAmt = 0; }
    this.darkA = approach(this.darkA, this.dark ? 1 : 0, 0.08);
    // zoom (cuts are instant, like multi-cam)
    const z = this.zoom;
    if (z.cut) { z.cs = z.s; z.cx = z.tx; z.cy = z.ty; z.cut = false; }
    if (this.caption) this.caption.t++;
    // waiting
    const w = this.waiting;
    if (w) {
      if (w.type === 'time') { if (--w.t <= 0) this.waiting = null; }
      else if (w.type === 'walk') { const a = this.actors[w.who]; if (!a || a.walkTo === null || a.walkTo === undefined) this.waiting = null; }
      else if (w.type === 'say') {
        const b = this.bubble;
        b.t++;
        if (b.shown < b.text.length) {
          b.shown = Math.min(b.text.length, b.shown + 0.9);
          if (Math.floor(b.shown) % 2 === 0 && b.text[Math.floor(b.shown)] !== ' ' && !b.sing) AudioSys.blip(actorVoice(b.who));
          if ((m.ok || Input.clicks.length) && b.t > 6) { b.shown = b.text.length; Input.clicks.length = 0; }
        } else {
          b.after = (b.after || 0) + 1;
          const autoT = Math.max(b.minT || 0, 50 + b.text.length * 2.2);
          if (((m.ok || Input.clicks.length) && b.after > 6) || b.after > autoT - b.text.length / 0.9 + 40) {
            Input.clicks.length = 0;
            this.waiting = null; this.bubble = null;
            const a = this.actors[b.who]; if (a && a.anim === 'play') a.anim = 'idle';
          }
        }
      }
    }
    if (!this.waiting) this.exec();
  }
  finish() {
    if (this.done) return;
    this.done = true;
    Particles.list.length = 0;
    if (this.opts.done) this.opts.done();
  }
  draw(forCapture) {
    if (this.frozen && !forCapture) { this.drawFrozen(); return; }
    const s = this.set || getSet('cafe');
    const room = s.room, th = room.theme;
    // render stage into buffer, then apply camera zoom (multi-cam cut)
    const z = this.zoom;
    const sh = this.shakeAmt ? rnd(-this.shakeAmt, this.shakeAmt) : 0;
    ctx.save();
    if (z.cs !== 1) {
      ctx.translate(W / 2, H / 2); ctx.scale(z.cs, z.cs);
      const cx = clamp(z.cx, W / (2 * z.cs), W - W / (2 * z.cs)), cy = clamp(z.cy, H / (2 * z.cs), H - H / (2 * z.cs));
      ctx.translate(-cx, -cy);
    }
    ctx.translate(Math.round(sh), 0);
    ctx.fillStyle = '#120c18'; ctx.fillRect(0, 0, W, H);
    if (th.ext || room.decor.some(d => d.ch === 'w') || room.def.openings || th.far) drawFar(ctx, th, 0, 0, this.t, room.h);
    ctx.drawImage(room.backCanvas, 0, 0);
    // set dressing
    if (s.def.props) for (const p of s.def.props) drawSetProp(ctx, p[0], p[1], p[2], this.t, s);
    if (s.variant.snowy) { drawSetProp(ctx, 'snowpile', 0, 222, this.t); }
    if (this.setLabel) drawSetProp(ctx, 'sign', W / 2 - textWidth(this.setLabel) / 2 - 6, 40, this.t, this.setLabel);
    ctx.drawImage(room.frontCanvas, 0, 0);
    for (const p of this.props) drawSetProp(ctx, p.kind, p.x, p.y, p.t, p.data);
    // actors sorted by y then x
    const list = Object.values(this.actors).filter(a => a.visible).sort((a, b) => a.y - b.y);
    for (const a of list) this.drawActor(a);
    Particles.draw(ctx, 0, 0);
    for (const e of this.emotes) {
      const a = e.a;
      const y = a.y - this.actorHeight(a) - 16 - Math.min(6, e.t / 2);
      drawText(e.k, a.x + 6, y, e.k === '♥' ? '#ff4f7a' : e.k === '!' ? '#ff4a3a' : '#ffffff', { scale: 2, outline: OUTLINE, align: 'center' });
    }
    ctx.restore();
    if (this.darkA > 0) {
      ctx.fillStyle = 'rgba(4,2,12,' + (this.darkA * 0.94) + ')'; ctx.fillRect(0, 0, W, H);
    }
    // bubble (screen space, after zoom transform: compute screen pos)
    if (this.bubble) {
      const b = this.bubble, a = this.actors[b.who];
      let hx = W / 2, hy = 60;
      if (a && a.visible && !this.darkA) {
        const p = this.toScreen(a.x, a.y - this.actorHeight(a) - 4);
        hx = p.x; hy = p.y;
      } else if (a && a.visible && this.darkA) { const p = this.toScreen(a.x, a.y - this.actorHeight(a) - 4); hx = p.x; hy = p.y; }
      drawSpeechBubble(b.text.slice(0, Math.floor(b.shown)), b.text, hx, hy, actorName(b.who), actorColor(b.who), b.t < 4 ? b.t / 4 : 1);
    }
    if (this.caption) {
      const c = this.caption;
      const a = c.t < 10 ? c.t / 10 : 1;
      ctx.globalAlpha = a;
      ctx.fillStyle = 'rgba(10,6,16,0.8)'; ctx.fillRect(0, 22, W, c.sub ? 34 : 22);
      drawText(c.text, W / 2, 28, '#ffd23f', { align: 'center', scale: c.sub ? 1 : 1 });
      if (c.sub) drawText(c.sub, W / 2, 41, '#f6ead8', { align: 'center' });
      ctx.globalAlpha = 1;
    }
    if (this.recap) this.drawRecapFX();
    if (this.flash > 0) { ctx.fillStyle = 'rgba(255,255,255,' + (this.flash / 8) + ')'; ctx.fillRect(0, 0, W, H); }
    if (!forCapture && !this.opts.noSkip && this.skipHint < 200) {
      ctx.globalAlpha = this.skipHint > 170 ? (200 - this.skipHint) / 30 : 0.8;
      drawText(Input.lastDevice === 'touch' ? 'SKIP ▸'.replace('▸', '>') : 'ESC: SKIP', W - 6, 5, '#d8c8e8', { align: 'right', outline: OUTLINE });
      ctx.globalAlpha = 1;
    }
    if (this.endT) { ctx.fillStyle = 'rgba(10,6,14,' + (this.endT / 20) + ')'; ctx.fillRect(0, 0, W, H); }
  }
  toScreen(x, y) {
    const z = this.zoom;
    if (z.cs === 1) return { x, y };
    const cx = clamp(z.cx, W / (2 * z.cs), W - W / (2 * z.cs)), cy = clamp(z.cy, H / (2 * z.cs), H - H / (2 * z.cs));
    return { x: (x - cx) * z.cs + W / 2, y: (y - cy) * z.cs + H / 2 };
  }
  actorHeight(a) {
    if (FRIENDS.includes(a.who)) return FRIEND_STATS[a.who].h + (a.who === 'benny' ? 8 : 2);
    if (ACTOR_INFO[a.who] && ACTOR_INFO[a.who].animal) return 12;
    return 30;
  }
  drawActor(a) {
    const info = ACTOR_INFO[a.who];
    const y = a.y - (a.hop ? Math.sin(a.hop / 12 * Math.PI) * 10 : 0);
    if (info && info.offscreen) return;
    ctx.globalAlpha = a.alpha;
    if (info && info.animal === 'iguana') drawIguana(ctx, a.x, y, a.face < 0, a.t, { moving: a.anim === 'walk', tongue: (a.t % 80) < 6, pilot: a.pilot });
    else if (info && info.animal === 'robot') drawRobot(ctx, a.x, y, a.face < 0, a.t, { arm: true });
    else {
      const talking = this.bubble && this.bubble.who === a.who && this.bubble.shown < this.bubble.text.length;
      const isFriend = FRIENDS.includes(a.who);
      const anim = a.sit ? 'sit' : a.anim;
      const pose = { anim, t: a.t, expr: a.expr, blink: a.blinkT < 0, talk: talking, quirk: (anim === 'idle' && a.quirk) ? a.who : null, fast: a.who === 'mila' };
      const spec = isFriend ? friendSpecId(a.who, (Save.data.outfits || {})[a.who] || 0) : 'npc:' + a.who;
      const fn = isFriend ? friendSpecFn(a.who, (Save.data.outfits || {})[a.who] || 0) : npcSpecFn(a.who);
      blitPerson(ctx, spec, fn, pose, a.x, y, { flip: a.face < 0 });
    }
    ctx.globalAlpha = 1;
  }
  drawFrozen() {
    const k = this.freezeT;
    const z = 1 + Math.min(0.05, k * 0.0006);
    ctx.save();
    ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2);
    ctx.drawImage(this.frozen, 0, 0);
    ctx.restore();
    // warm "frozen film" tint + vignette
    ctx.fillStyle = 'rgba(255,200,120,0.10)'; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(0, 0, W, 6); ctx.fillRect(0, H - 6, W, 6);
    if (this.recap) this.drawRecapFX();
    if (this.flash > 0) { ctx.fillStyle = 'rgba(255,255,255,' + (this.flash / 6) + ')'; ctx.fillRect(0, 0, W, H); }
    if (this.opts.onFrozenDraw) this.opts.onFrozenDraw(k);
    if (k > 120) { ctx.fillStyle = 'rgba(10,6,14,' + Math.min(1, (k - 120) / 30) + ')'; ctx.fillRect(0, 0, W, H); }
  }
  drawRecapFX() {
    ctx.save();
    ctx.globalCompositeOperation = 'color';
    ctx.fillStyle = 'rgba(150,110,60,0.85)'; ctx.fillRect(0, 0, W, H);
    ctx.restore();
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    for (let y = (this.t % 3); y < H; y += 3) ctx.fillRect(0, y, W, 1);
    const ty = (this.t * 3) % (H + 40) - 20;
    ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.fillRect(0, ty, W, 8);
    ctx.fillStyle = 'rgba(10,6,16,0.85)'; ctx.fillRect(0, H - 26, W, 20);
    drawText('PREVIOUSLY ON THE GANG\'S ALL HERE...', W / 2, H - 20, '#f6ead8', { align: 'center' });
    if ((this.t >> 4) % 2) { ctx.fillStyle = '#ff3a3a'; circleFill(18, 16, 3, '#ff3a3a'); drawText('PLAY', 26, 12, '#f6ead8', {}); }
  }
}

// ---------------------------------------------------------------------------
// Establishing shots (scene-change bumpers)
// ---------------------------------------------------------------------------
function drawEstablishing(kind, t) {
  const R = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), w, h); };
  const parts = kind.split('_');
  const base = parts[0], time = parts[1] || 'day';
  const sky = { day: ['#6ab8ec', '#cdeefa'], night: ['#0f1030', '#3a2a5a'], dusk: ['#3a2a6a', '#f39a6a'], snow: ['#9fb0c4', '#e4ecf4'], sunset: ['#ff8e5a', '#ffe0a0'] }[time] || ['#6ab8ec', '#cdeefa'];
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, sky[0]); grad.addColorStop(1, sky[1]);
  ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
  const night = time === 'night' || time === 'dusk';
  if (time === 'night') { for (let i = 0; i < 50; i++) R(hash2(i, 1, 9) * W, hash2(i, 2, 9) * 120, 1, 1, '#ffffff'); circleFill(400, 40, 12, '#f4f0d8'); }
  const pan = t * 0.25;
  // background skyline
  const far = skylineStrip(THEMES.street, 'skyline', night ? '#2a2550' : time === 'snow' ? '#b8c4d2' : '#9ab8cc', 140, 11, night, night);
  ctx.drawImage(far, -((pan * 0.3) % 960), H - 190);
  const lit = (x, y) => night && hash2(x | 0, y | 0, 7) < 0.6;
  const facade = (x, y, w, h, col, rows, cols, opts) => {
    opts = opts || {};
    R(x, y, w, h, col);
    for (let r = 0; r < h; r += 6) R(x, y + r + 5, w, 1, shade(col, -0.18));
    R(x - 3, y - 4, w + 6, 5, shade(col, -0.3));
    const cw = (w - 20) / cols, rh = (h - (opts.ground || 50)) / rows;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const wx = x + 12 + c * cw, wy = y + 12 + r * rh;
      R(wx - 2, wy - 2, 22, 26, '#e8e0d0');
      R(wx, wy, 18, 22, lit(wx, wy) ? '#ffd88a' : (night ? '#2a3050' : '#8ab8d8'));
      R(wx + 8, wy, 2, 22, '#e8e0d0');
      if (opts.fire && c % 2 === 0) { R(wx - 6, wy + 22, 30, 2, '#2a2a30'); for (let k = 0; k < 30; k += 4) R(wx - 6 + k, wy + 16, 1, 6, '#2a2a30'); }
    }
  };
  const wobble = Math.sin(t / 20) * 1;
  switch (base) {
    case 'building': {
      facade(130 - pan, 30, 230, 240, '#b45a42', 4, 5, { fire: true, ground: 60 });
      R(200 - pan, 210, 90, 60, '#5a2a22'); R(214 - pan, 222, 26, 48, '#3a1a14'); R(250 - pan, 222, 26, 48, '#3a1a14');
      R(190 - pan, 200, 110, 14, '#2a6a4a'); drawText('THE BELLWEATHER', 245 - pan, 203, '#f4efe6', { align: 'center' });
      R(0, 262, W, 8, '#8a8480');
      facade(-60 - pan * 1.1, 70, 150, 200, '#7a6a8a', 3, 3);
      facade(400 - pan * 1.1, 60, 150, 210, '#6a8a7a', 3, 3);
      break;
    }
    case 'cafe': {
      facade(70, 20, 340, 250, '#6a3a2a', 2, 6, { ground: 110 });
      R(90, 160, 300, 110, '#3a2018'); R(100, 170, 180, 80, night ? '#ffcf7a' : '#e8c080'); R(300, 170, 60, 100, '#5a2a1a');
      for (let i = 0; i < 5; i++) R(120 + i * 34, 200, 20, 30, 'rgba(90,50,30,0.5)');
      R(90, 140, 300, 24, '#2a1a10'); const blink = (t >> 3) % 7 !== 0;
      drawText('THE DAILY GRIND', 240, 145, blink ? '#ff9a5a' : '#8a4a2a', { align: 'center', scale: 2 });
      R(0, 262, W, 8, '#7a7470');
      if (time !== 'snow') { ctx.fillStyle = 'rgba(160,190,230,0.7)'; for (let i = 0; i < 80; i++) { const rx = (hash2(i, 3, 3) * W + t * 0.5) % W, ry = (hash2(i, 4, 3) * H + t * 7) % H; ctx.fillRect(rx, ry, 1, 6); } }
      break;
    }
    case 'roof': {
      R(0, 200, W, 70, '#4a4448'); R(0, 196, W, 6, '#8a4a3a');
      R(300, 90, 70, 60, '#7a5a4a'); R(296, 84, 78, 8, '#5a3a2a'); R(305, 150, 4, 50, '#4a3a3a'); R(360, 150, 4, 50, '#4a3a3a');
      for (let i = 0; i < 12; i++) R(40 + i * 30, 160 + Math.sin(i) * 4, 2, 3, ['#ff5a5a', '#ffd23f', '#5ae0a0'][i % 3]);
      R(80, 176, 40, 20, '#2a2a2e');
      break;
    }
    case 'storage': {
      facade(40, 70, 400, 200, '#8a8e94', 0, 1, { ground: 200 });
      for (let i = 0; i < 4; i++) { R(70 + i * 92, 150, 80, 110, '#e8a020'); for (let k = 0; k < 110; k += 6) R(70 + i * 92, 150 + k, 80, 1, '#b87a10'); }
      R(140, 90, 200, 30, '#2a4a7a'); drawText('STOR-N-MORE', 240, 98, '#f4efe6', { align: 'center', scale: 2 });
      break;
    }
    case 'hotel': {
      facade(90, 10, 300, 260, '#e2cfae', 5, 6, { ground: 70 });
      R(170, 200, 140, 70, '#a8843a'); R(200, 214, 80, 56, '#3a2a1a'); R(150, 186, 180, 18, '#7a1a28');
      drawText('THE GRAND MARQUIS', 240, 191, '#ffd23f', { align: 'center' });
      for (let i = 0; i < 8; i++) R(160 + i * 22, 182, 3, 4, (t >> 2) % 8 === i ? '#ffffff' : '#ffd23f');
      break;
    }
    case 'theater': {
      facade(60, 30, 360, 240, '#6a2a3a', 2, 6, { ground: 120 });
      R(100, 120, 280, 50, '#1a1a22');
      for (let i = 0; i < 28; i++) R(102 + i * 10, 122, 4, 4, ((t >> 2) + i) % 4 ? '#ffd23f' : '#fff');
      for (let i = 0; i < 28; i++) R(102 + i * 10, 162, 4, 4, ((t >> 2) + i + 2) % 4 ? '#ffd23f' : '#fff');
      drawText('RIALTO', 240, 130, '#ff4f9a', { align: 'center', scale: 2 });
      drawText('TONIGHT: THE GREAT BENNINI', 240, 150, '#f4efe6', { align: 'center' });
      R(180, 200, 120, 70, '#3a1a20');
      break;
    }
    case 'subway': {
      R(0, 220, W, 50, '#7a7470');
      R(150, 170, 180, 60, '#2a2a30'); for (let i = 0; i < 8; i++) R(160 + i * 4, 180 + i * 6, 160 - i * 8, 4, '#4a4a52');
      R(140, 150, 6, 80, '#2a5a3a'); R(334, 150, 6, 80, '#2a5a3a'); circleFill(143, 146, 7, '#7cf29a'); circleFill(337, 146, 7, '#7cf29a');
      R(170, 140, 140, 18, '#2a5a3a'); drawText('LARKSPUR ST', 240, 145, '#f4efe6', { align: 'center' });
      facade(-40, 40, 160, 200, '#9a7a6a', 3, 3); facade(370, 50, 160, 190, '#7a6a8a', 3, 3);
      break;
    }
    case 'train': {
      R(0, 0, W, H, '#14161c');
      for (let i = 0; i < 8; i++) { const lx = ((i * 90 - t * 12) % 720 + 720) % 720 - 120; R(lx, 70, 30, 4, '#ffd88a'); }
      R(20 + Math.sin(t / 5), 110, 440, 100, '#c8ccd0'); R(20, 110, 440, 8, '#3a6ac8');
      for (let i = 0; i < 6; i++) R(40 + i * 72, 130, 50, 36, '#2a3040');
      R(30, 210, 420, 6, '#4a5058');
      break;
    }
    case 'expo': {
      R(0, 220, W, 50, '#8a96a8');
      ctx.fillStyle = '#c8d0dc'; ctx.beginPath(); ctx.arc(240, 230, 170, Math.PI, 0); ctx.fill();
      for (let i = 0; i < 8; i++) R(80 + i * 42, 90, 2, 140, '#9aa6b8');
      R(120, 150, 240, 26, '#2c3c5e'); drawText('CITY INVENTION EXPO', 240, 158, '#4cc9f0', { align: 'center' });
      break;
    }
    case 'park': {
      R(0, 210, W, 60, '#f4f8fc');
      for (let i = 0; i < 6; i++) { const x = 30 + i * 80; R(x + 12, 150, 6, 60, '#5a3a24'); for (let k = 0; k < 4; k++) R(x + k * 3, 100 + k * 14, 30 - k * 6, 16, '#3a6a4a'); R(x + 2, 98, 26, 4, '#ffffff'); }
      R(200, 196, 60, 4, '#7a5a3a'); R(204, 200, 3, 10, '#5a3a24'); R(253, 200, 3, 10, '#5a3a24');
      break;
    }
    case 'alley': {
      facade(0, 20, W, 250, '#5a3a34', 3, 6, { fire: true, ground: 60 });
      R(300, 210, 60, 50, '#2a6a3a'); R(298, 206, 64, 6, '#1e5a2e'); R(0, 255, W, 15, '#dde6f0');
      R(80, 200, 40, 60, '#3a2018'); R(70, 186, 60, 14, '#2a1a10'); drawText('GRIND', 100, 189, '#ff9a5a', { align: 'center' });
      break;
    }
    case 'airport': {
      R(0, 200, W, 70, '#5a6a5a'); R(0, 214, W, 8, '#4a4a52');
      R(60, 90, 360, 120, '#c6d0d8'); for (let i = 0; i < 9; i++) R(76 + i * 38, 110, 30, 70, '#8ab8e0');
      R(60, 80, 360, 14, '#6a7a88'); drawText('TERMINAL B', 240, 83, '#ffffff', { align: 'center' });
      const px = (t * 3) % 700 - 100;
      R(px, 50 - t * 0.2, 60, 8, '#f4f4f8'); R(px + 44, 40 - t * 0.2, 8, 10, '#3a6ac8'); R(px + 20, 54 - t * 0.2, 20, 4, '#d8d8e0');
      break;
    }
    default: {
      facade(130 - pan, 30, 230, 240, '#b45a42', 4, 5, { fire: true });
    }
  }
  if (time === 'snow') {
    for (let i = 0; i < 90; i++) {
      const x = (hash2(i, 3, 1) * W + t * 0.4 + Math.sin(t / 30 + i) * 6) % W, y = (hash2(i, 5, 1) * H + t * (0.8 + hash2(i, 6, 1))) % H;
      R(x, y, i % 4 ? 1 : 2, i % 4 ? 1 : 2, '#ffffff');
    }
    R(0, 258, W, 12, '#f4f8fc');
  }
  // letterbox bars like an old TV transition
  ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(0, 0, W, 4); ctx.fillRect(0, H - 4, W, 4);
  void wobble;
}

class EstablishingScene {
  constructor(kind, opts) { this.kind = kind; this.opts = opts || {}; this.t = 0; this.dur = this.opts.dur || 120; }
  enter() { Music.stop(0.2); Music.oneShot(this.opts.bumper || pick(['bumper1', 'bumper2', 'bumper3', 'bumper4']), 0.95); }
  update() { this.t++; if (this.t >= this.dur || (this.t > 20 && (Input.menu.ok || Input.clicks.length))) { if (!this.doneF) { this.doneF = true; this.opts.done && this.opts.done(); } } }
  draw() { drawEstablishing(this.kind, this.t); }
}

// ---------------------------------------------------------------------------
// 90s Memphis-pattern backdrop (title cards, credits, opening)
// ---------------------------------------------------------------------------
function drawMemphis(bg, accents, t, seed, density, clear) {
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  const R2 = mulberry32(seed || 7);
  const n = density || 26;
  for (let i = 0; i < n; i++) {
    const x = R2() * W, y = R2() * H, k = Math.floor(R2() * 5), c = accents[Math.floor(R2() * accents.length)];
    if (clear && x > clear[0] - 24 && x < clear[0] + clear[2] && y > clear[1] - 12 && y < clear[1] + clear[3]) continue;
    const dx = Math.sin(t / 60 + i) * 2, dy = Math.cos(t / 70 + i) * 2;
    ctx.fillStyle = c;
    if (k === 0) { // squiggle
      for (let j = 0; j < 24; j++) ctx.fillRect(Math.round(x + j + dx), Math.round(y + Math.sin(j / 3) * 3 + dy), 2, 2);
    } else if (k === 1) { // triangle
      for (let j = 0; j < 9; j++) ctx.fillRect(Math.round(x - j + dx), Math.round(y + j + dy), j * 2 + 1, 1);
    } else if (k === 2) { // dots
      for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) ctx.fillRect(Math.round(x + a * 5 + dx), Math.round(y + b * 5 + dy), 2, 2);
    } else if (k === 3) { // ring
      circleFill(x + dx, y + dy, 6, c); circleFill(x + dx, y + dy, 4, bg);
    } else { // zigzag
      for (let j = 0; j < 20; j++) ctx.fillRect(Math.round(x + j + dx), Math.round(y + Math.abs((j % 8) - 4) + dy), 2, 2);
    }
  }
}

class TitleCardScene {
  constructor(epIndex, opts) {
    this.ep = EPISODES[epIndex]; this.epIndex = epIndex; this.opts = opts || {}; this.t = 0;
    const palettes = [['#2a1a5a', ['#ff4f9a', '#ffd23f', '#4cc9f0', '#7cf29a']], ['#5a1a2a', ['#ffd23f', '#4cc9f0', '#ff8a5a', '#f4efe6']], ['#123a4a', ['#ff4f9a', '#ffd23f', '#f4efe6', '#ff8a5a']], ['#3a2a10', ['#4cc9f0', '#ff4f9a', '#7cf29a', '#f4efe6']]];
    this.pal = palettes[epIndex % palettes.length];
  }
  enter() { Music.stop(0.1); Music.oneShot('sting_title', 1); }
  update() {
    this.t++;
    if (this.t > 25 && (Input.menu.ok || Input.clicks.length)) this.t = Math.max(this.t, 170);
    if (this.t > 200 && !this.doneF) { this.doneF = true; this.opts.done && this.opts.done(); }
  }
  draw() {
    drawMemphis(this.pal[0], this.pal[1], this.t, 11 + this.epIndex * 7, 40, [30, 44, 420, 150]);
    const ep = this.ep;
    const a = Math.min(1, this.t / 12);
    ctx.globalAlpha = a;
    drawText("THE GANG'S ALL HERE", W / 2, 52, '#f6ead8', { align: 'center', outline: OUTLINE });
    const sub = ep.finale ? 'THE SEASON FINALE' : 'SEASON ' + ep.season + ', EPISODE ' + ep.num;
    drawText(sub, W / 2, 88, this.pal[1][1], { align: 'center', scale: 1, outline: OUTLINE });
    // title words drop in one at a time
    const words = ep.title.toUpperCase().split(' ');
    const lines = [];
    let cur = '';
    for (const w of words) { const test = cur ? cur + ' ' + w : w; if (textWidth(test, 3) > W - 40) { lines.push(cur); cur = w; } else cur = test; }
    lines.push(cur);
    let wi = 0;
    lines.forEach((line, li) => {
      const lw = textWidth(line, 3);
      let x = W / 2 - lw / 2;
      for (const w of line.split(' ')) {
        const start = 14 + wi * 7;
        const k = clamp((this.t - start) / 14, 0, 1);
        const y = 116 + li * 36 - (1 - Ease.outBack(k)) * 30;
        if (k > 0) {
          ctx.globalAlpha = k;
          drawText(w, x + 3, y + 3, '#1b1020', { scale: 3 });
          drawText(w, x, y, wi % 2 ? this.pal[1][0] : '#ffffff', { scale: 3, outline: OUTLINE });
        }
        x += textWidth(w + ' ', 3);
        wi++;
      }
    });
    ctx.globalAlpha = 1;
    if (this.t > 170) { ctx.fillStyle = 'rgba(10,6,14,' + (this.t - 170) / 30 + ')'; ctx.fillRect(0, 0, W, H); }
  }
}
