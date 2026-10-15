// ---------------------------------------------------------------------------
// World: themes, tiles, backgrounds, rooms & tile physics
// ---------------------------------------------------------------------------
const TL = { EMPTY: 0, SOLID: 1, ONEWAY: 2, LADDER: 3, CLIMB: 4, DUCT: 5, HAZARD: 6, ICE: 7, CONVL: 8, CONVR: 9 };
const isSolidCode = t => t === 1 || t === 5 || t === 7 || t === 8 || t === 9;

// palette & style for each location
const THEMES = {
  street: { ext: true, sky: ['#7cc6ef', '#d6f0fb'], far: 'skyline', farCol: '#a7c3d6', mid: 'buildings', midCol: '#8aa6bd', back: 'facade', facade: 'brick', wallA: '#b45a42', wallB: '#8c3f2e', floor: 'sidewalk', floorA: '#c2b8ae', floorB: '#9c928a', fill: 'brick', fillA: '#8a5a48', fillB: '#6a4034', oneway: 'grate', climb: 'pipe', hazard: 'mousetrap', roofline: 8 },
  street_eve: { ext: true, sky: ['#3a2a6a', '#f39a6a'], far: 'skyline', farCol: '#6a4a7a', mid: 'buildings', midCol: '#4a3a5a', back: 'facade', facade: 'brick', wallA: '#8a4a42', wallB: '#6a3430', floor: 'sidewalk', floorA: '#9a9090', floorB: '#7a7070', fill: 'brick', fillA: '#5a3a38', fillB: '#43292a', oneway: 'grate', climb: 'pipe', hazard: 'puddle', roofline: 8, lit: true },
  street_night: { ext: true, night: true, sky: ['#0f1030', '#3a2a5a'], far: 'skyline', farCol: '#2a2550', mid: 'buildings', midCol: '#1e1a3a', back: 'facade', facade: 'brick', wallA: '#5a3a44', wallB: '#432a34', floor: 'sidewalk', floorA: '#6a6470', floorB: '#4e4a56', fill: 'brick', fillA: '#3a2a34', fillB: '#2a1e28', oneway: 'grate', climb: 'pipe', hazard: 'puddle', roofline: 8, lit: true },
  snow: { ext: true, sky: ['#aebfd2', '#e8eff6'], far: 'skyline', farCol: '#c4d0dc', mid: 'buildings', midCol: '#a8b6c6', back: 'facade', facade: 'brick', wallA: '#9a5a4a', wallB: '#7a4438', floor: 'snow', floorA: '#f4f8fc', floorB: '#c8d8ea', fill: 'brick', fillA: '#6a4a44', fillB: '#523834', oneway: 'grate', climb: 'pipe', hazard: 'slush', roofline: 8, weather: 'snow' },
  park: { ext: true, sky: ['#b8c6d6', '#eef3f8'], far: 'skyline', farCol: '#cdd6e0', mid: 'trees', midCol: '#9aa8b6', back: 'none', floor: 'snow', floorA: '#f4f8fc', floorB: '#c8d8ea', fill: 'dirt', fillA: '#6a5a4a', fillB: '#544638', oneway: 'branch', climb: 'pole', hazard: 'slush', weather: 'snow' },
  roof: { ext: true, sky: ['#ff9e6a', '#ffe0a0'], far: 'skyline', farCol: '#d88a7a', mid: 'tanks', midCol: '#a86a6a', back: 'none', floor: 'tar', floorA: '#5a5258', floorB: '#3a3438', fill: 'brick', fillA: '#8a4a3a', fillB: '#6a382e', oneway: 'grate', climb: 'pipe', hazard: 'coals', sun: true },
  roof_night: { ext: true, night: true, sky: ['#120f30', '#3a2a5a'], far: 'skyline', farCol: '#2a2550', mid: 'tanks', midCol: '#1e1a3a', back: 'none', floor: 'tar', floorA: '#3a3640', floorB: '#26222a', fill: 'brick', fillA: '#4a2a2a', fillB: '#36201f', oneway: 'grate', climb: 'pipe', hazard: 'puddle', lit: true },
  hall: { back: 'wall', wall: 'stripes', wallA: '#7e5a72', wallB: '#6e4c63', trim: '#3e2832', floor: 'wood', floorA: '#9a6a44', floorB: '#7a4e30', fill: 'plaster', fillA: '#4a3438', fillB: '#3a282c', oneway: 'shelf', climb: 'holds', hazard: 'mousetrap', far: 'skyline', farNight: true },
  apt: { back: 'wall', wall: 'damask', wallA: '#d6ae6c', wallB: '#c49a58', trim: '#6a4a2a', floor: 'wood', floorA: '#a8744a', floorB: '#865634', fill: 'plaster', fillA: '#5a4232', fillB: '#463326', oneway: 'shelf', climb: 'holds', hazard: 'mousetrap', far: 'skyline' },
  apt2: { back: 'wall', wall: 'stripes', wallA: '#6fa8a0', wallB: '#5f968e', trim: '#2e4a46', floor: 'wood', floorA: '#b07a50', floorB: '#8a5a36', fill: 'plaster', fillA: '#3a4a48', fillB: '#2c3a38', oneway: 'shelf', climb: 'holds', hazard: 'mousetrap', far: 'skyline' },
  lobby: { back: 'wall', wall: 'panel', wallA: '#5e7a62', wallB: '#4e6a52', trim: '#2e3a30', floor: 'marble', floorA: '#e0dace', floorB: '#bcb4a6', fill: 'plaster', fillA: '#3e4a40', fillB: '#2e3a30', oneway: 'shelf', climb: 'holds', hazard: 'mousetrap', far: 'skyline' },
  stair: { back: 'wall', wall: 'cinder', wallA: '#a89a88', wallB: '#968876', trim: '#5a5046', floor: 'concrete', floorA: '#8a8480', floorB: '#6e6864', fill: 'concrete', fillA: '#5e5854', fillB: '#4e4844', oneway: 'grate', climb: 'pipe', hazard: 'mousetrap', far: 'skyline', farNight: true },
  basement: { back: 'wall', wall: 'cinder', wallA: '#5e6066', wallB: '#52545a', trim: '#2a2c30', floor: 'concrete', floorA: '#6e6a66', floorB: '#56524e', fill: 'concrete', fillA: '#3e3c3a', fillB: '#302e2c', oneway: 'grate', climb: 'pipe', hazard: 'puddle', pipes: true },
  laundry: { back: 'wall', wall: 'tiles', wallA: '#9cc4c2', wallB: '#86aeac', trim: '#4a6a68', floor: 'tile', floorA: '#d8d4cc', floorB: '#b0aca4', fill: 'concrete', fillA: '#4a5250', fillB: '#3a4240', oneway: 'shelf', climb: 'pipe', hazard: 'suds', pipes: true },
  cafe: { back: 'wall', wall: 'cafe', wallA: '#c6844a', wallB: '#5e3424', trim: '#3a2018', floor: 'checker', floorA: '#e6d6bc', floorB: '#3e2a22', fill: 'plaster', fillA: '#4a2c22', fillB: '#3a2018', oneway: 'shelf', climb: 'holds', hazard: 'mousetrap', far: 'skyline', farNight: true, rainy: true },
  kitchen: { back: 'wall', wall: 'tiles', wallA: '#ece6da', wallB: '#d6cfc0', trim: '#7a6a5a', floor: 'checker', floorA: '#e8e0d0', floorB: '#b83a3a', fill: 'plaster', fillA: '#5a4a44', fillB: '#4a3a34', oneway: 'shelf', climb: 'holds', hazard: 'mousetrap', far: 'skyline' },
  storage: { back: 'wall', wall: 'corrugated', wallA: '#7c868e', wallB: '#69737b', trim: '#3a4248', floor: 'concrete', floorA: '#8a8680', floorB: '#6c6862', fill: 'concrete', fillA: '#4a4846', fillB: '#3a3836', oneway: 'grate', climb: 'pipe', hazard: 'puddle' },
  ballroom: { back: 'wall', wall: 'damask', wallA: '#e2cfae', wallB: '#d2bd98', trim: '#a8843a', floor: 'carpet', floorA: '#a82a3a', floorB: '#7a1a28', fill: 'plaster', fillA: '#5a3a2a', fillB: '#4a2e20', oneway: 'shelf', climb: 'holds', hazard: 'mousetrap', far: 'skyline', farNight: true, chandeliers: true },
  theater: { back: 'wall', wall: 'curtain', wallA: '#6a1a2a', wallB: '#4a1220', trim: '#1a1014', floor: 'stage', floorA: '#6a4a34', floorB: '#4a3424', fill: 'dark', fillA: '#2a2024', fillB: '#1e181a', oneway: 'catwalk', climb: 'rope', hazard: 'mousetrap', spot: true },
  backstage: { back: 'wall', wall: 'brick', wallA: '#3a3036', wallB: '#2c2428', trim: '#1a1418', floor: 'stage', floorA: '#6a4a34', floorB: '#4a3424', fill: 'dark', fillA: '#2a2024', fillB: '#1e181a', oneway: 'catwalk', climb: 'rope', hazard: 'mousetrap' },
  subway: { back: 'wall', wall: 'subway', wallA: '#e2dcc4', wallB: '#2a7a5a', trim: '#3a3a36', floor: 'platform', floorA: '#9a968e', floorB: '#e8c020', fill: 'concrete', fillA: '#4a4844', fillB: '#3a3834', oneway: 'grate', climb: 'pipe', hazard: 'puddle' },
  train: { back: 'wall', wall: 'train', wallA: '#c8ccd0', wallB: '#a8b0b8', trim: '#4a5058', floor: 'metal', floorA: '#6a7078', floorB: '#4a5058', fill: 'metal', fillA: '#3a4048', fillB: '#2a3038', oneway: 'rack', climb: 'pole', hazard: 'puddle', far: 'tunnel' },
  expo: { back: 'wall', wall: 'expo', wallA: '#2c3c5e', wallB: '#24324e', trim: '#121a2a', floor: 'metal', floorA: '#9aa6b8', floorB: '#7a8698', fill: 'metal', fillA: '#3a465a', fillB: '#2e384a', oneway: 'booth', climb: 'truss', hazard: 'tesla' },
  alley: { ext: true, night: true, sky: ['#1a1838', '#3a3060'], far: 'skyline', farCol: '#2a2850', mid: 'buildings', midCol: '#201c3c', back: 'facade', facade: 'brick', wallA: '#6a3a34', wallB: '#4e2a26', floor: 'snow', floorA: '#dde6f0', floorB: '#aebccc', fill: 'brick', fillA: '#4a2e2c', fillB: '#3a2220', oneway: 'grate', climb: 'pipe', hazard: 'slush', roofline: 3, weather: 'snow', lit: true },
  boiler: { back: 'wall', wall: 'brick', wallA: '#5a3a30', wallB: '#4a2e26', trim: '#2a1a14', floor: 'concrete', floorA: '#6a625a', floorB: '#524a44', fill: 'concrete', fillA: '#3a3430', fillB: '#2e2824', oneway: 'grate', climb: 'pipe', hazard: 'puddle', pipes: true },
  airport: { back: 'wall', wall: 'airport', wallA: '#e6ecf0', wallB: '#c6d0d8', trim: '#6a7a88', floor: 'tile', floorA: '#d4d8de', floorB: '#b4bac2', fill: 'metal', fillA: '#5a6470', fillB: '#4a5460', oneway: 'rack', climb: 'pole', hazard: 'puddle', far: 'airfield' },
};

// ---------------------------------------------------------------------------
// Tile art
// ---------------------------------------------------------------------------
function drawWallPattern(g, th, x0, y0, w, h, seed) {
  const A = th.wallA, B = th.wallB;
  g.fillStyle = A; g.fillRect(x0, y0, w, h);
  const R = (x, y, ww, hh, c) => { g.fillStyle = c; g.fillRect(x, y, ww, hh); };
  switch (th.wall) {
    case 'stripes':
      for (let x = x0; x < x0 + w; x += 12) { R(x, y0, 3, h, B); R(x + 7, y0, 1, h, shade(A, 0.06)); }
      for (let y = y0 + 6; y < y0 + h; y += 16) for (let x = x0 + 5; x < x0 + w; x += 12) R(x, y, 1, 1, shade(A, 0.12));
      break;
    case 'damask':
      for (let y = y0; y < y0 + h; y += 12) for (let x = x0 + ((y / 12) % 2 ? 6 : 0); x < x0 + w; x += 12) {
        R(x + 2, y + 4, 1, 3, B); R(x + 1, y + 5, 3, 1, B); R(x + 2, y + 2, 1, 1, B); R(x + 2, y + 8, 1, 1, B);
      }
      break;
    case 'brick':
      for (let y = y0, r = 0; y < y0 + h; y += 6, r++) {
        R(x0, y + 5, w, 1, B);
        for (let x = x0 + (r % 2 ? 6 : 0); x < x0 + w; x += 12) { R(x, y, 1, 5, B); if (hash2(x, y, seed) < 0.15) R(x + 2, y + 1, 7, 3, shade(A, -0.07)); }
      }
      break;
    case 'tiles':
      for (let y = y0; y < y0 + h; y += 8) R(x0, y, w, 1, B);
      for (let x = x0; x < x0 + w; x += 8) R(x, y0, 1, h, B);
      for (let y = y0 + 1; y < y0 + h; y += 8) for (let x = x0 + 1; x < x0 + w; x += 8) R(x, y, 2, 1, shade(A, 0.18));
      break;
    case 'panel':
      for (let x = x0; x < x0 + w; x += 16) { R(x, y0, 1, h, B); R(x + 1, y0, 1, h, shade(A, 0.1)); }
      for (let y = y0; y < y0 + h; y += 48) R(x0, y, w, 2, B);
      break;
    case 'cinder':
      for (let y = y0, r = 0; y < y0 + h; y += 8, r++) {
        R(x0, y + 7, w, 1, B);
        for (let x = x0 + (r % 2 ? 8 : 0); x < x0 + w; x += 16) R(x, y, 1, 7, B);
      }
      break;
    case 'corrugated':
      for (let x = x0; x < x0 + w; x += 4) { R(x, y0, 1, h, B); R(x + 2, y0, 1, h, shade(A, 0.1)); }
      for (let y = y0; y < y0 + h; y += 64) R(x0, y, w, 2, shade(B, -0.2));
      break;
    case 'curtain':
      for (let x = x0; x < x0 + w; x += 10) { R(x, y0, 3, h, B); R(x + 5, y0, 2, h, shade(A, 0.12)); }
      break;
    case 'cafe':
      // warm wallpaper over dark wood wainscot (wainscot drawn per-row by floor tops)
      for (let x = x0; x < x0 + w; x += 10) R(x, y0, 1, h, shade(A, -0.08));
      for (let y = y0 + 5; y < y0 + h; y += 10) for (let x = x0 + 5; x < x0 + w; x += 10) { R(x, y, 1, 1, shade(A, 0.2)); }
      break;
    case 'subway':
      for (let y = y0; y < y0 + h; y += 6) R(x0, y, w, 1, shade(A, -0.12));
      for (let x = x0; x < x0 + w; x += 10) R(x, y0, 1, h, shade(A, -0.12));
      break;
    case 'train':
      for (let x = x0; x < x0 + w; x += 32) R(x, y0, 2, h, B);
      break;
    case 'expo':
      for (let x = x0; x < x0 + w; x += 24) R(x, y0, 1, h, B);
      for (let y = y0; y < y0 + h; y += 24) R(x0, y, w, 1, B);
      break;
    case 'airport':
      for (let x = x0; x < x0 + w; x += 32) R(x, y0, 2, h, B);
      for (let y = y0 + 20; y < y0 + h; y += 40) R(x0, y, w, 1, B);
      break;
    default: break;
  }
}

function drawSolidTile(g, th, x, y, top, left, right, bottom, tx, ty, code) {
  const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); };
  const n = hash2(tx, ty, 3);
  if (code === TL.DUCT) {
    R(0, 0, 16, 16, '#8a949c'); R(0, 0, 16, 1, '#b0bac2'); R(0, 15, 16, 1, '#5a646c');
    R(0, 7, 16, 1, '#6e7880'); R(2, 3, 1, 1, '#c8d0d6'); R(13, 3, 1, 1, '#c8d0d6'); R(2, 11, 1, 1, '#c8d0d6'); R(13, 11, 1, 1, '#c8d0d6');
    if (!top) R(0, 0, 16, 1, '#7a848c');
    return;
  }
  if (code === TL.ICE) {
    R(0, 0, 16, 16, '#a8d8f0'); R(0, 0, 16, 2, '#e8f8ff'); R(3 + (n * 8 | 0), 4, 5, 1, '#d8f0ff'); R(9, 9, 4, 1, '#88c0e0');
    R(0, 15, 16, 1, '#78a8c8');
    return;
  }
  if (code === TL.CONVL || code === TL.CONVR) {
    R(0, 0, 16, 16, '#3a3a40'); R(0, 0, 16, 4, '#2a2a2e');
    for (let i = 0; i < 16; i += 4) R(i, 1, 2, 2, '#5a5a62');
    R(1, 6, 14, 8, '#54545c'); R(3, 9, 3, 3, '#8a8a92'); R(10, 9, 3, 3, '#8a8a92');
    return;
  }
  // fill
  const fA = th.fillA, fB = th.fillB;
  R(0, 0, 16, 16, fA);
  switch (th.fill) {
    case 'brick':
      for (let r = 0; r < 4; r++) { R(0, r * 4 + 3, 16, 1, fB); R(((r % 2) ? 4 : 12), r * 4, 1, 3, fB); }
      break;
    case 'concrete':
      if (n < 0.5) R((n * 30 | 0) % 14, (n * 70 | 0) % 14, 2, 1, fB);
      R((n * 13 | 0) % 15, (n * 97 | 0) % 15, 1, 1, fB);
      break;
    case 'dirt':
      R((n * 30 | 0) % 14, (n * 70 | 0) % 14, 2, 2, fB); R((n * 51 | 0) % 14, (n * 17 | 0) % 14, 1, 1, fB);
      break;
    case 'metal':
      R(0, 0, 16, 1, shade(fA, 0.12)); R(1, 1, 1, 1, fB); R(14, 1, 1, 1, fB); R(1, 14, 1, 1, fB); R(14, 14, 1, 1, fB);
      break;
    case 'dark': case 'plaster': default:
      // boxed wall panels: subtle seams
      R(0, 7, 16, 1, fB); R((tx % 2) ? 3 : 11, 0, 1, 7, fB); R((tx % 2) ? 11 : 3, 8, 1, 8, fB);
      if (n < 0.3) R((n * 40 | 0) % 15, (n * 90 | 0) % 15, 1, 1, shade(fA, 0.1));
      break;
  }
  if (left) { R(0, 0, 2, 16, shade(fA, 0.16)); R(0, 0, 1, 16, shade(fA, 0.28)); }
  if (right) { R(14, 0, 2, 16, shade(fA, -0.3)); R(15, 0, 1, 16, '#1b1020'); }
  if (bottom) { R(0, 13, 16, 3, shade(fA, -0.35)); R(0, 15, 16, 1, '#1b1020'); }
  if (top) {
    const A = th.floorA, B = th.floorB;
    switch (th.floor) {
      case 'wood':
        R(0, 0, 16, 5, A); R(0, 4, 16, 1, B); R((tx % 2) ? 5 : 11, 0, 1, 4, B); R(0, 0, 16, 1, shade(A, 0.2)); R(0, 5, 16, 1, shade(fA, -0.3));
        break;
      case 'carpet':
        R(0, 0, 16, 5, A); R(0, 0, 16, 1, shade(A, 0.2)); for (let i = (ty % 2) * 2; i < 16; i += 4) R(i, 2, 1, 1, B); R(0, 5, 16, 1, shade(fA, -0.3));
        break;
      case 'checker':
        for (let i = 0; i < 16; i += 4) R(i, 0, 4, 5, ((i / 4 + tx * 4) % 2) ? B : A);
        R(0, 0, 16, 1, 'rgba(255,255,255,0.25)'); R(0, 5, 16, 1, shade(fA, -0.3));
        break;
      case 'tile':
        R(0, 0, 16, 5, A); R(0, 4, 16, 1, B); R(7, 0, 1, 4, B); R(15, 0, 1, 4, B); R(0, 0, 16, 1, shade(A, 0.15));
        break;
      case 'marble':
        R(0, 0, 16, 5, A); R(0, 4, 16, 1, B); R(((tx * 5) % 12), 1, 4, 1, B); R(0, 0, 16, 1, '#fff');
        break;
      case 'concrete':
        R(0, 0, 16, 4, A); R(0, 0, 16, 1, shade(A, 0.18)); R(0, 4, 16, 1, B); if (n < 0.4) R(n * 30 % 14, 2, 2, 1, B);
        break;
      case 'sidewalk':
        R(0, 0, 16, 6, A); R(0, 0, 16, 1, shade(A, 0.2)); R(0, 5, 16, 1, B); if (tx % 2 === 0) R(0, 0, 1, 5, B);
        break;
      case 'tar':
        R(0, 0, 16, 4, A); R(0, 0, 16, 1, shade(A, 0.25)); R(0, 4, 16, 1, B); if (n < 0.5) R(n * 25 % 13, 2, 3, 1, B);
        break;
      case 'snow':
        R(0, 0, 16, 5, A); R(0, 4, 16, 2, B); R(0, 5, 16, 1, shade(B, -0.1)); R((n * 20 | 0) % 12, 1, 3, 1, '#ffffff');
        if (left) R(-1, 1, 2, 4, A); if (right) R(15, 1, 2, 4, A);
        break;
      case 'metal':
        R(0, 0, 16, 4, A); R(0, 0, 16, 1, shade(A, 0.25)); R(0, 3, 16, 1, B); R(3, 1, 1, 1, B); R(12, 1, 1, 1, B);
        break;
      case 'platform':
        R(0, 0, 16, 5, A); R(0, 0, 16, 2, B); R(0, 5, 16, 1, shade(fA, -0.3));
        for (let i = 0; i < 16; i += 4) R(i, 0, 2, 2, shade(B, -0.15));
        break;
      case 'stage':
        R(0, 0, 16, 5, A); R(0, 4, 16, 1, B); R(0, 0, 16, 1, shade(A, 0.18)); R((tx % 3) * 5, 0, 1, 4, B);
        break;
      case 'grass':
        R(0, 0, 16, 5, A); R(0, 3, 16, 2, B);
        break;
      default:
        R(0, 0, 16, 4, A);
    }
  }
}

function drawOnewayTile(g, th, x, y, tx, ty, room) {
  const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); };
  const leftCont = room.code(tx - 1, ty) === TL.ONEWAY, rightCont = room.code(tx + 1, ty) === TL.ONEWAY;
  switch (th.oneway) {
    case 'grate': case 'catwalk': case 'rack':
      R(0, 0, 16, 2, '#4a4e56'); R(0, 2, 16, 2, '#2e3238');
      for (let i = 1; i < 16; i += 3) R(i, 1, 1, 2, '#6a707a');
      if (!leftCont) R(0, 0, 2, 8, '#3a3e46');
      if (!rightCont) R(14, 0, 2, 8, '#3a3e46');
      if (th.oneway === 'grate' && tx % 3 === 0) R(7, 4, 2, 10, 'rgba(40,44,52,0.6)');
      break;
    case 'branch':
      R(0, 0, 16, 4, '#6a4a30'); R(0, 0, 16, 1, '#f4f8fc'); R(3, 4, 4, 2, '#5a3a24');
      break;
    case 'booth':
      R(0, 0, 16, 4, '#d8dce4'); R(0, 0, 16, 1, '#ffffff'); R(0, 4, 16, 1, '#6a7488'); if (tx % 2) R(4, 1, 8, 2, '#4cc9f0');
      break;
    case 'shelf': default:
      R(0, 0, 16, 3, '#8a5a34'); R(0, 0, 16, 1, '#b07a4a'); R(0, 3, 16, 1, '#4a2e1a');
      if (!leftCont) { R(1, 3, 2, 4, '#5a3a22'); }
      if (!rightCont) { R(13, 3, 2, 4, '#5a3a22'); }
  }
}

function drawLadderTile(g, x, y, top) {
  const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); };
  R(2, 0, 2, 16, '#8a6038'); R(12, 0, 2, 16, '#8a6038');
  R(3, 0, 1, 16, '#a87a4a'); R(13, 0, 1, 16, '#a87a4a');
  for (let i = 2; i < 16; i += 5) R(4, i, 8, 2, '#a87a4a');
  if (top) { R(2, 0, 12, 1, '#c89a6a'); }
}
const MILA_COL = '#2ec4b6';
function drawClimbTile(g, th, x, y, tx, ty, room) {
  const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); };
  const topEnd = room.code(tx, ty - 1) !== TL.CLIMB;
  switch (th.climb) {
    case 'rope':
      R(7, 0, 2, 16, '#c8a870'); for (let i = (ty % 2) * 3; i < 16; i += 6) R(7, i, 2, 1, '#8a6a40');
      if (ty % 3 === 0) R(6, 6, 4, 2, MILA_COL);
      break;
    case 'pole': case 'truss':
      R(6, 0, 4, 16, '#b8c0c8'); R(6, 0, 1, 16, '#e0e6ea'); R(9, 0, 1, 16, '#7a828a');
      if (ty % 2 === 0) R(5, 7, 6, 2, MILA_COL);
      break;
    case 'holds':
      R(5, 0, 6, 16, 'rgba(0,0,0,0.12)');
      R(4 + (ty % 2) * 5, 3, 3, 2, MILA_COL); R(9 - (ty % 2) * 5, 10, 3, 2, MILA_COL);
      R(4 + (ty % 2) * 5, 5, 3, 1, shade(MILA_COL, -0.4)); R(9 - (ty % 2) * 5, 12, 3, 1, shade(MILA_COL, -0.4));
      break;
    case 'pipe': default:
      R(5, 0, 6, 16, '#7e8890'); R(6, 0, 1, 16, '#aab4bc'); R(10, 0, 1, 16, '#5a646c');
      if (ty % 2 === 0) { R(4, 6, 8, 3, MILA_COL); R(4, 6, 8, 1, shade(MILA_COL, 0.4)); }
  }
  if (topEnd) R(4, 0, 8, 2, MILA_COL);
}

const HAZARD_STYLES = {};
function drawHazardTile(g, th, x, y, t, tx) {
  const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x + a), Math.round(y + b), w, h); };
  switch (th.hazard) {
    case 'mousetrap':
      R(2, 12, 12, 4, '#c89a5a'); R(2, 12, 12, 1, '#e0b878'); R(3, 9, 1, 4, '#c0c0c8'); R(3, 9, 9, 1, '#c0c0c8'); R(11, 13, 2, 2, '#ffd23f');
      break;
    case 'puddle': {
      R(0, 13, 16, 3, '#3a6a9a'); R(2, 13, 10, 1, '#7ab0e0');
      const sp = (t + tx * 13) % 40 < 8;
      if (sp) { R(6, 8, 1, 5, '#ffe866'); R(7, 10, 2, 1, '#fff'); R(8, 6, 1, 4, '#ffe866'); }
      R(12, 9, 4, 1, '#222'); R(14, 10, 1, 3, '#222');
      break;
    }
    case 'coals':
      R(0, 11, 16, 5, '#3a2a2a');
      for (let i = 0; i < 16; i += 4) R(i + 1, 12, 3, 2, ((t >> 3) + i + tx) % 3 ? '#ff6a2a' : '#ffd23f');
      break;
    case 'slush':
      R(0, 12, 16, 4, '#8a9aa8'); R(1, 12, 14, 1, '#c8d4de'); R((t >> 4) % 12, 14, 3, 1, '#6a7a88');
      break;
    case 'suds':
      for (let i = 0; i < 16; i += 5) { const b = Math.sin((t + i * 7 + tx * 3) / 9) * 1.5; R(i, 10 + b, 5, 6 - b, '#f4f8ff'); R(i + 1, 10 + b, 2, 1, '#ffffff'); }
      R(0, 14, 16, 2, '#9ad0e8');
      break;
    case 'tesla':
      R(5, 6, 6, 10, '#5a6070'); R(4, 4, 8, 3, '#c0c8d0');
      if ((t + tx * 5) % 30 < 10) { R(2, 0, 1, 5, '#a8e8ff'); R(13, 1, 1, 4, '#a8e8ff'); R(7, 0, 2, 4, '#ffffff'); }
      break;
    default:
      R(0, 12, 16, 4, '#aa3333');
  }
}

// ---------------------------------------------------------------------------
// Decor (lowercase map letters). Drawn on the back layer.
// ---------------------------------------------------------------------------
function decorSize(ch, th) {
  return ({ a: [2, 2], b: [2, 3], d: [2, 3], e: [2, 3], f: [1, 2], g: [2, 2], h: [1, 1], i: [1, 1], j: [1, 1], l: [1, 1], m: [2, 2], n: [2, 1], o: [1, 1], p: [1, 1], q: [1, 5], r: [2, 1], s: [3, 1], t: [2, 1], u: [3, 1], v: [1, 1], w: [2, 2], x: [2, 2], y: [1, 1], z: [1, 1] })[ch] || [1, 1];
}
function drawDecor(g, ch, x, y, th, room, info) {
  const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); };
  const night = th.night || th.farNight;
  switch (ch) {
    case 'w': { // window 32x32 (hole cut later), frame
      const fr = th.ext ? '#e8e0d0' : (th.trim || '#3a2a2a');
      R(0, 0, 32, 2, fr); R(0, 30, 32, 2, fr); R(0, 0, 2, 32, fr); R(30, 0, 2, 32, fr); R(15, 0, 2, 32, fr); R(0, 15, 32, 2, fr);
      R(-2, 31, 36, 2, shade(fr, -0.2));
      if (th.ext) { // exterior window glass (lit or reflective)
        const lit = th.lit && hash2(x, y, 9) < 0.6;
        const glass = lit ? '#ffd88a' : (th.night ? '#2a3050' : '#8ab8d8');
        R(2, 2, 13, 13, glass); R(17, 2, 13, 13, glass); R(2, 17, 13, 13, glass); R(17, 17, 13, 13, glass);
        if (!lit) { R(4, 4, 3, 1, '#d8f0ff'); R(19, 19, 3, 1, '#d8f0ff'); }
        else { R(2, 2, 13, 4, '#e8b060'); R(17, 2, 13, 4, '#e8b060'); }
      }
      break;
    }
    case 'd': { // apartment / building door 32x48
      const label = info && info.label;
      R(4, 4, 24, 44, '#6a3e2a'); R(2, 2, 28, 2, th.trim || '#3a2a2a'); R(2, 2, 2, 46, th.trim || '#3a2a2a'); R(28, 2, 2, 46, th.trim || '#3a2a2a');
      R(7, 8, 18, 14, '#7a4a32'); R(7, 26, 18, 18, '#7a4a32'); R(8, 9, 16, 1, '#8a5a3e'); R(8, 27, 16, 1, '#8a5a3e');
      R(22, 26, 3, 3, '#e0c060');
      if (label) { R(11, 12, 10, 6, '#e0c060'); drawText(label, x + 16, y + 11, '#3a2a10', { g, align: 'center' }); }
      break;
    }
    case 'e': // elevator doors
      R(0, 2, 32, 46, '#9aa2aa'); R(2, 4, 28, 44, '#b8c0c8'); R(15, 4, 2, 44, '#7a828a'); R(10, -6, 12, 6, '#2a2a2a'); R(12, -5, 3, 4, '#ff8a3a');
      break;
    case 'f': // plant
      R(4, 22, 8, 10, '#b0603a'); R(3, 22, 10, 2, '#c87a4a');
      R(7, 8, 2, 14, '#3a7a3a'); R(3, 10, 5, 4, '#4a9a4a'); R(8, 6, 5, 5, '#4a9a4a'); R(2, 15, 5, 4, '#3a8a3a'); R(9, 13, 5, 4, '#5aaa5a');
      break;
    case 'b': // bookshelf 32x48
      R(0, 0, 32, 48, '#5a3a22'); R(2, 2, 28, 44, '#3a2414');
      for (let s = 0; s < 3; s++) {
        R(2, 14 + s * 15, 28, 2, '#5a3a22');
        for (let k = 0; k < 7; k++) { const c = ['#c04040', '#4070c0', '#40a060', '#d0a030', '#8a50b0', '#e07030', '#3a8a8a'][(k + s * 3 + (x >> 4)) % 7]; R(3 + k * 4, 4 + s * 15, 3, 10 - (k % 3), c); }
      }
      break;
    case 'a': // armchair 32x32
      R(2, 10, 28, 16, '#7a3a4a'); R(0, 14, 6, 14, '#6a2e3e'); R(26, 14, 6, 14, '#6a2e3e'); R(4, 4, 24, 10, '#8a4a5a'); R(4, 26, 3, 6, '#3a2020'); R(25, 26, 3, 6, '#3a2020');
      break;
    case 'i': // picture frame
      R(1, 2, 14, 11, '#c8a040'); R(3, 4, 10, 7, ['#6ab0d8', '#d88a6a', '#8ac87a', '#c88ad8'][(x + y) % 4]); R(5, 7, 4, 4, shade(['#6ab0d8', '#d88a6a', '#8ac87a', '#c88ad8'][(x + y) % 4], -0.3));
      break;
    case 'l': // wall sconce
      R(6, 6, 4, 6, '#c8a040'); R(5, 3, 6, 4, '#ffe8a0'); R(4, 2, 8, 1, '#fff4c8');
      break;
    case 'o': // clock
      circleFill(x + 8, y + 8, 6, '#3a2a2a', g); circleFill(x + 8, y + 8, 5, '#f4f0e6', g); R(8, 4, 1, 4, '#222'); R(8, 8, 3, 1, '#222');
      break;
    case 'm': // mailboxes
      R(0, 2, 32, 28, '#8a7a5a'); for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) { R(2 + c * 7, 4 + r * 9, 6, 7, '#b8a878'); R(6 + c * 7, 7 + r * 9, 1, 1, '#3a3a3a'); }
      break;
    case 'r': // radiator
      R(2, 4, 28, 12, '#d8d0c0'); for (let i = 3; i < 30; i += 3) R(i, 4, 1, 12, '#a8a090'); R(2, 14, 28, 2, '#8a8070');
      break;
    case 'n': { // poster / neon 32x16
      const cols = ['#ff4f9a', '#4cc9f0', '#ffd23f', '#7cf29a'];
      const c = cols[(x >> 4) % 4];
      R(2, 1, 28, 14, '#2a1a2a'); R(3, 2, 26, 12, shade(c, -0.5)); R(5, 4, 22, 2, c); R(5, 8, 14, 2, c); R(21, 8, 6, 4, '#fff');
      break;
    }
    case 's': { // sign with text 48x16
      const text = (info && info.label) || '';
      R(0, 1, 48, 14, '#2a3a5a'); R(1, 2, 46, 12, '#3a4e7a'); drawText(text, x + 24, y + 4, '#ffffff', { g, align: 'center' });
      break;
    }
    case 't': // table
      R(0, 6, 32, 3, '#8a5a34'); R(0, 6, 32, 1, '#b07a4a'); R(3, 9, 2, 7, '#5a3a22'); R(27, 9, 2, 7, '#5a3a22');
      R(12, 2, 4, 4, '#f4efe6'); R(13, 0, 1, 2, 'rgba(255,255,255,0.5)');
      break;
    case 'u': // awning
      for (let i = 0; i < 48; i += 8) { R(i, 0, 4, 10, '#c83a3a'); R(i + 4, 0, 4, 10, '#f4efe6'); }
      for (let i = 0; i < 48; i += 4) R(i, 10, 3, 2, (i / 4) % 2 ? '#f4efe6' : '#c83a3a');
      break;
    case 'h': // hydrant
      R(4, 4, 8, 12, '#d83a3a'); R(3, 2, 10, 3, '#e85a4a'); R(2, 8, 12, 3, '#c02a2a'); R(6, 0, 4, 2, '#e85a4a');
      break;
    case 'j': // trash can
      R(2, 3, 12, 13, '#6a7078'); R(1, 1, 14, 3, '#8a9098'); for (let i = 4; i < 14; i += 3) R(i, 5, 1, 10, '#5a6068');
      break;
    case 'q': { // street lamp 16x80
      R(7, 10, 2, 70, '#2a2a34'); R(4, 76, 8, 4, '#2a2a34'); R(3, 4, 10, 7, '#2a2a34'); R(4, 6, 8, 5, night || th.lit ? '#ffe89a' : '#e8e0c8');
      break;
    }
    case 'g': { // graffiti / poster on wall 32x32
      R(3, 4, 26, 20, '#e8e0c8'); R(5, 6, 22, 6, ['#c83a6a', '#3a8ac8', '#e8a020'][(x >> 4) % 3]); R(5, 14, 16, 2, '#3a3a3a'); R(5, 18, 12, 2, '#3a3a3a');
      break;
    }
    case 'v': // vent cover decor
      R(2, 4, 12, 8, '#8a949c'); for (let i = 5; i < 12; i += 2) R(3, i, 10, 1, '#4a545c');
      break;
    case 'p': // vertical pipe
      R(5, 0, 6, 16, '#6a7a6a'); R(6, 0, 1, 16, '#8a9a8a');
      break;
    case 'x': // background boxes
      R(2, 12, 14, 20, '#b08a5a'); R(16, 18, 14, 14, '#c09a6a'); R(6, 2, 14, 12, '#a87a4a'); R(2, 21, 14, 1, '#d8b88a'); R(8, 7, 10, 1, '#d8b88a');
      break;
    case 'y': // hanging light
      R(7, -4, 1, 8, '#2a2a2a'); R(3, 4, 10, 4, '#3a3a3a'); R(4, 8, 8, 2, '#ffe89a');
      break;
    case 'z': { // string lights
      const sag = Math.sin((x / 16) * Math.PI) * 2;
      R(0, 3 + sag, 16, 1, '#3a3a3a'); R(7, 4 + sag, 2, 3, ['#ff5a5a', '#ffd23f', '#5ae0a0', '#5ab0ff'][(x >> 4) % 4]);
      break;
    }
    default: break;
  }
}

// ---------------------------------------------------------------------------
// Parallax backgrounds
// ---------------------------------------------------------------------------
const BGCache = new Map();
function skylineStrip(th, kind, col, h, seed, night, lit) {
  const key = kind + col + h + seed + night + lit;
  let c = BGCache.get(key);
  if (c) return c;
  const w = 960;
  const [cv, g] = makeCanvas(w, h);
  const R2 = mulberry32(seed);
  const R = (a, b, ww, hh, cc) => { g.fillStyle = cc; g.fillRect(a, b, ww, hh); };
  if (kind === 'skyline' || kind === 'buildings') {
    let x = 0;
    while (x < w) {
      const bw = 24 + Math.floor(R2() * (kind === 'skyline' ? 40 : 56));
      const bh = Math.floor(h * (0.35 + R2() * 0.6));
      R(x, h - bh, bw, bh, col);
      if (R2() < 0.3) R(x + bw / 2 - 2, h - bh - 8, 4, 8, col);
      if (R2() < 0.2 && kind === 'buildings') { R(x + 4, h - bh - 10, 10, 10, col); R(x + 6, h - bh - 14, 6, 4, col); }
      // windows
      const wc = night || lit ? '#ffd88a' : shade(col, 0.15);
      for (let wy = h - bh + 6; wy < h - 4; wy += kind === 'skyline' ? 7 : 9) {
        for (let wx = x + 3; wx < x + bw - 4; wx += kind === 'skyline' ? 5 : 7) {
          if (night || lit) { if (R2() < 0.35) R(wx, wy, 2, 3, wc); }
          else if (R2() < 0.6) R(wx, wy, 2, 3, wc);
        }
      }
      x += bw + Math.floor(R2() * 6);
    }
  } else if (kind === 'trees') {
    for (let x = 0; x < w; x += 20 + Math.floor(R2() * 20)) {
      const th2 = 40 + R2() * 50;
      R(x + 8, h - th2 * 0.4, 4, th2 * 0.4, shade(col, -0.2));
      for (let k = 0; k < 4; k++) R(x + k * 2, h - th2 + k * 9, 20 - k * 4, 10, col);
      R(x + 2, h - th2 - 1, 16, 3, '#f4f8fc');
    }
  } else if (kind === 'tanks') {
    let x = 0;
    while (x < w) {
      const bw = 40 + Math.floor(R2() * 60), bh = Math.floor(h * (0.2 + R2() * 0.4));
      R(x, h - bh, bw, bh, col);
      if (R2() < 0.5) { // water tower
        const tx2 = x + 10;
        R(tx2, h - bh - 30, 22, 20, shade(col, -0.1)); R(tx2 - 2, h - bh - 34, 26, 5, shade(col, -0.2));
        R(tx2 + 2, h - bh - 10, 2, 10, col); R(tx2 + 18, h - bh - 10, 2, 10, col);
      }
      x += bw + 10 + Math.floor(R2() * 30);
    }
  }
  BGCache.set(key, cv);
  return cv;
}

function drawSky(g, th, camX, camY, t, roomH) {
  const night = th.night;
  const top = th.sky ? th.sky[0] : (night ? '#141030' : '#7cc6ef');
  const bot = th.sky ? th.sky[1] : (night ? '#3a2a5a' : '#d6f0fb');
  const grad = g.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, top); grad.addColorStop(1, bot);
  g.fillStyle = grad; g.fillRect(0, 0, W, H);
  if (night) {
    for (let i = 0; i < 60; i++) {
      const sx = (hash2(i, 1, 4) * 600 - camX * 0.05) % 600, sy = hash2(i, 2, 4) * 160;
      const tw2 = (Math.sin(t / 30 + i) + 1) / 2;
      g.fillStyle = tw2 > 0.7 ? '#ffffff' : '#a8a8d8';
      g.fillRect(Math.round((sx + 600) % 600 - 60), Math.round(sy), 1, 1);
    }
    circleFill(400 - camX * 0.02, 40, 12, '#f4f0d8', g); circleFill(405 - camX * 0.02, 37, 10, top, g);
  } else if (th.sun) {
    circleFill(380 - camX * 0.02, 70, 22, '#fff2b0', g); circleFill(380 - camX * 0.02, 70, 18, '#ffe080', g);
  } else if (!th.weather) {
    // clouds
    for (let i = 0; i < 6; i++) {
      const cx2 = ((hash2(i, 7, 1) * 900 + t * 0.05 - camX * 0.1) % 900 + 900) % 900 - 100;
      const cy2 = 20 + hash2(i, 8, 1) * 60;
      g.fillStyle = 'rgba(255,255,255,0.85)';
      g.fillRect(Math.round(cx2), Math.round(cy2), 40, 8); g.fillRect(Math.round(cx2 + 8), Math.round(cy2 - 5), 22, 6); g.fillRect(Math.round(cx2 + 26), Math.round(cy2 - 3), 10, 4);
    }
  }
}

function drawFar(g, th, camX, camY, t, roomH) {
  if (th.far === 'tunnel') {
    g.fillStyle = '#121418'; g.fillRect(0, 0, W, H);
    // speeding tunnel lights
    for (let i = 0; i < 6; i++) {
      const lx = ((i * 140 - t * 9) % 840 + 840) % 840 - 180;
      g.fillStyle = '#ffd88a'; g.fillRect(lx, 60, 26, 3); g.fillRect(lx, 180, 26, 3);
      g.fillStyle = 'rgba(255,216,138,0.15)'; g.fillRect(lx - 10, 50, 46, 140);
    }
    for (let i = 0; i < 20; i++) { const lx = ((i * 50 - t * 14) % 1000 + 1000) % 1000 - 100; g.fillStyle = '#2a2e36'; g.fillRect(lx, 0, 6, H); }
    return;
  }
  if (th.far === 'airfield') {
    const grad = g.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#6ab8f0'); grad.addColorStop(0.6, '#c8e8fb'); grad.addColorStop(0.61, '#7a8a7a'); grad.addColorStop(1, '#5a6a5a');
    g.fillStyle = grad; g.fillRect(0, 0, W, H);
    g.fillStyle = '#4a4a52'; g.fillRect(0, H * 0.66, W, 10);
    for (let i = 0; i < W; i += 30) { g.fillStyle = '#f0f0f0'; g.fillRect(((i - camX * 0.3) % W + W) % W, H * 0.66 + 4, 14, 2); }
    // a plane taking off now and then
    const p = (t % 900) / 900;
    const px = -80 + p * 700 - camX * 0.1, py = H * 0.62 - Math.max(0, p - 0.3) * 260;
    g.fillStyle = '#f4f4f8'; g.fillRect(px, py, 54, 8); g.fillRect(px + 40, py - 10, 8, 10); g.fillRect(px + 18, py + 3, 20, 4);
    g.fillStyle = '#3a6ac8'; g.fillRect(px, py + 3, 54, 2); g.fillRect(px + 40, py - 10, 8, 3);
    return;
  }
  // exterior-style sky + skylines (also seen through interior windows)
  const night = th.night || th.farNight;
  const ths = th.ext ? th : (night ? THEMES.street_night : THEMES.street);
  drawSky(g, ths, camX, camY, t, roomH);
  const far = skylineStrip(ths, 'skyline', ths.farCol || '#a7c3d6', 140, 11, night, ths.lit);
  const fx = -((camX * 0.2) % 960);
  const fy = H - 140 - 40 - Math.min(40, camY * 0.05);
  g.drawImage(far, Math.round(fx), Math.round(fy)); g.drawImage(far, Math.round(fx + 960), Math.round(fy));
  if (th.ext && th.mid) {
    const mid = skylineStrip(th, th.mid, th.midCol || '#8aa6bd', 170, 23, night, th.lit);
    const mx = -((camX * 0.45) % 960);
    const my = H - 170 - 10 - Math.min(60, camY * 0.15);
    g.drawImage(mid, Math.round(mx), Math.round(my)); g.drawImage(mid, Math.round(mx + 960), Math.round(my));
  }
}

// ---------------------------------------------------------------------------
// Room: parse map + tile physics
// ---------------------------------------------------------------------------
class Room {
  constructor(def, level) {
    this.def = def;
    this.level = level;
    this.theme = THEMES[def.theme] || THEMES.hall;
    const map = def.map;
    this.rows = map.length;
    this.cols = Math.max(...map.map(r => r.length));
    this.w = this.cols * T; this.h = this.rows * T;
    this.tiles = new Uint8Array(this.cols * this.rows);
    this.ents = [];
    this.decor = [];
    this.spawn = { x: 2 * T, y: (this.rows - 3) * T };
    this.flags = {};
    this.t = 0;
    const legend = Object.assign({}, def.ents || {});
    const decorLabels = (def.labels || []).slice();
    for (let y = 0; y < this.rows; y++) {
      const row = map[y];
      for (let x = 0; x < this.cols; x++) {
        const ch = row[x] || '.';
        let code = TL.EMPTY;
        switch (ch) {
          case '#': code = TL.SOLID; break;
          case '=': code = TL.ONEWAY; break;
          case 'H': code = TL.LADDER; break;
          case 'M': code = TL.CLIMB; break;
          case 'D': code = TL.DUCT; break;
          case '^': code = TL.HAZARD; break;
          case 'I': code = TL.ICE; break;
          case '{': code = TL.CONVL; break;
          case '}': code = TL.CONVR; break;
          case '@': this.spawn = { x: x * T, y: y * T + T }; break;
          case 'c': this.pendingEnts.push(['cup', {}, x, y]); break;
          case '*': this.pendingEnts.push(['mug', {}, x, y]); break;
          case 'k': this.pendingEnts.push(['checkpoint', {}, x, y]); break;
          case 'X': this.pendingEnts.push(['exit', legend.X || {}, x, y]); break;
          case '.': case ' ': break;
          default:
            if (ch >= 'a' && ch <= 'z') {
              const info = {};
              if ((ch === 'd' || ch === 's') && decorLabels.length) info.label = decorLabels.shift();
              const sz = decorSize(ch);
              this.decor.push({ ch, x: x * T, y: (y + 1) * T - sz[1] * T, info });
            } else if (legend[ch]) {
              const p = legend[ch];
              this.pendingEnts.push([p.t, p, x, y]);
            }
        }
        this.tiles[y * this.cols + x] = code;
      }
    }
  }
  get pendingEnts() {
    if (!this._pending) {
      this._pending = [];
      for (const e of this.def.extra || []) this._pending.push([e.t, e, e.x, e.y]);
    }
    return this._pending;
  }

  code(tx, ty) {
    if (tx < 0 || tx >= this.cols) return TL.SOLID;
    if (ty < 0) return this.def.openTop ? TL.EMPTY : (this.code(tx, 0) === TL.SOLID ? TL.SOLID : TL.EMPTY);
    if (ty >= this.rows) return TL.EMPTY;
    return this.tiles[ty * this.cols + tx];
  }
  setCode(tx, ty, c) { if (tx >= 0 && ty >= 0 && tx < this.cols && ty < this.rows) this.tiles[ty * this.cols + tx] = c; }
  solidAt(tx, ty) { return isSolidCode(this.code(tx, ty)); }
  ladderTop(tx, ty) { return this.code(tx, ty) === TL.LADDER && this.code(tx, ty - 1) !== TL.LADDER && !this.solidAt(tx, ty - 1); }
  climbTop(tx, ty) { return this.code(tx, ty) === TL.CLIMB && this.code(tx, ty - 1) !== TL.CLIMB && !this.solidAt(tx, ty - 1); }

  // does rect overlap any solid (tiles or solid entities)?
  rectBlocked(x, y, w, h, ignore, withBodies) {
    const tx0 = Math.floor(x / T), tx1 = Math.floor((x + w - 0.001) / T);
    const ty0 = Math.floor(y / T), ty1 = Math.floor((y + h - 0.001) / T);
    for (let ty = ty0; ty <= ty1; ty++) for (let tx = tx0; tx <= tx1; tx++) if (this.solidAt(tx, ty)) return true;
    const r = { x, y, w, h };
    for (const s of this.ents) if (s.solid && s !== ignore && !s.oneway && overlap(r, s.colBox || s)) return true;
    if (withBodies) for (const f of this.level.friends) if (f !== ignore && f.present && !f.gone && overlap(r, f)) return true;
    return false;
  }

  // Horizontal move with collision. Returns the blocker (or null).
  moveX(b, dx, opts) {
    if (!dx) return null;
    opts = opts || {};
    let hit = null;
    const y0 = b.y, y1 = b.y + b.h - 0.001;
    const ty0 = Math.floor(y0 / T), ty1 = Math.floor(y1 / T);
    let nx = b.x + dx;
    if (dx > 0) {
      const tx = Math.floor((nx + b.w - 0.001) / T);
      for (let ty = ty0; ty <= ty1; ty++) if (this.solidAt(tx, ty)) { nx = tx * T - b.w; hit = { tile: true }; break; }
    } else {
      const tx = Math.floor(nx / T);
      for (let ty = ty0; ty <= ty1; ty++) if (this.solidAt(tx, ty)) { nx = (tx + 1) * T; hit = { tile: true }; break; }
    }
    const r = { x: nx, y: b.y, w: b.w, h: b.h };
    for (const s of this.ents) {
      if (!s.solid || s === b || s.oneway || (opts.ignore && opts.ignore(s))) continue;
      const c = s.colBox || s;
      if (overlap(r, c)) {
        if (dx > 0 && c.x >= b.x + b.w - 1) { nx = Math.min(nx, c.x - b.w); hit = s; }
        else if (dx < 0 && c.x + c.w <= b.x + 1) { nx = Math.max(nx, c.x + c.w); hit = s; }
        r.x = nx;
      }
    }
    if (opts.bodies) {
      for (const f of this.level.friends) {
        if (f === b || !f.present || f.gone || (opts.ignoreBody && opts.ignoreBody(f))) continue;
        if (overlap(r, f)) {
          if (dx > 0 && f.x >= b.x + b.w - 1) { nx = Math.min(nx, f.x - b.w); hit = f; }
          else if (dx < 0 && f.x + f.w <= b.x + 1) { nx = Math.max(nx, f.x + f.w); hit = f; }
          r.x = nx;
        }
      }
    }
    // never move backwards because of a block
    if (dx > 0) nx = Math.max(nx, b.x); else nx = Math.min(nx, b.x);
    b.x = nx;
    return hit;
  }

  // Vertical move. Handles one-way platforms & ladder tops. Returns {landed, ceiling, on}.
  moveY(b, dy, opts) {
    const res = { landed: false, ceiling: false, on: null, tile: 0 };
    if (!dy) return res;
    opts = opts || {};
    const tx0 = Math.floor(b.x / T), tx1 = Math.floor((b.x + b.w - 0.001) / T);
    if (dy > 0) {
      const prevBottom = b.y + b.h;
      const newBottom = prevBottom + dy;
      let land = Infinity, landTile = 0, on = null;
      const rowA = Math.floor(prevBottom / T), rowB = Math.floor((newBottom - 0.001) / T);
      for (let ty = rowA; ty <= rowB; ty++) {
        const top = ty * T;
        for (let tx = tx0; tx <= tx1; tx++) {
          const c = this.code(tx, ty);
          if (isSolidCode(c)) { if (top >= prevBottom - 0.01 && top < land) { land = top; landTile = c; } }
          else if (!opts.drop && !b.climbing && (c === TL.ONEWAY || (c === TL.LADDER && this.ladderTop(tx, ty)) || (c === TL.CLIMB && b.who === 'mila' && this.climbTop(tx, ty)))) {
            if (prevBottom <= top + 0.01 && top < land) { land = top; landTile = c; }
          }
        }
      }
      for (const s0 of this.ents) {
        if (!s0.solid || s0 === b || (opts.ignore && opts.ignore(s0))) continue;
        if (s0.oneway && (opts.drop || b.climbing)) continue;
        const s = s0.colBox || s0;
        if (b.x + b.w <= s.x || b.x >= s.x + s.w) continue;
        const top = s.y;
        if (prevBottom <= top + 0.01 + (s0.dyFrame > 0 ? s0.dyFrame : 0) && newBottom >= top && top <= land) { land = top; on = s0; landTile = 0; }
      }
      if (land < Infinity && newBottom >= land) {
        b.y = land - b.h; res.landed = true; res.on = on; res.tile = landTile;
      } else b.y += dy;
    } else {
      let ny = b.y + dy;
      const ty = Math.floor(ny / T);
      for (let tx = tx0; tx <= tx1; tx++) if (this.solidAt(tx, ty)) { ny = (ty + 1) * T; res.ceiling = true; break; }
      const r = { x: b.x, y: ny, w: b.w, h: b.h };
      for (const s0 of this.ents) {
        if (!s0.solid || s0 === b || s0.oneway || (opts.ignore && opts.ignore(s0))) continue;
        const s = s0.colBox || s0;
        if (overlap(r, s) && s.y + s.h <= b.y + 0.5) { ny = Math.max(ny, s.y + s.h); res.ceiling = true; r.y = ny; }
      }
      b.y = Math.min(ny, b.y);
    }
    return res;
  }

  // what tile is under the body's feet (for ice/conveyors)
  groundCode(b) {
    const ty = Math.floor((b.y + b.h + 1) / T);
    const tx = Math.floor((b.x + b.w / 2) / T);
    return this.code(tx, ty);
  }
  overlapsCode(b, code, inset) {
    inset = inset || 0;
    const tx0 = Math.floor((b.x + inset) / T), tx1 = Math.floor((b.x + b.w - inset - 0.001) / T);
    const ty0 = Math.floor((b.y + inset) / T), ty1 = Math.floor((b.y + b.h - inset - 0.001) / T);
    for (let ty = ty0; ty <= ty1; ty++) for (let tx = tx0; tx <= tx1; tx++) if (this.code(tx, ty) === code) return { tx, ty };
    return null;
  }
}

// Pre-render the static layers of a room
function renderRoomLayers(room) {
  const th = room.theme;
  const [back, bg] = makeCanvas(room.w, room.h);
  const [front, fg] = makeCanvas(room.w, room.h);
  // back wall / facade
  if (th.back === 'wall') {
    drawWallPattern(bg, th, 0, 0, room.w, room.h, 1);
    // baseboards and wainscot under floors
    for (let ty = 1; ty < room.rows; ty++) for (let tx = 0; tx < room.cols; tx++) {
      if (room.solidAt(tx, ty) && !room.solidAt(tx, ty - 1) && room.code(tx, ty - 1) !== TL.DUCT) {
        if (th.wall === 'cafe') { bg.fillStyle = th.wallB; bg.fillRect(tx * T, ty * T - 22, T, 22); bg.fillStyle = shade(th.wallB, 0.15); bg.fillRect(tx * T, ty * T - 22, T, 2); for (let i = 0; i < 16; i += 8) { bg.fillStyle = shade(th.wallB, -0.15); bg.fillRect(tx * T + i, ty * T - 18, 1, 16); } }
        bg.fillStyle = th.trim || '#2a1a1a'; bg.fillRect(tx * T, ty * T - 3, T, 3);
      }
    }
  } else if (th.back === 'facade') {
    const top = (th.roofline || 4) * T;
    bg.fillStyle = th.wallA; bg.fillRect(0, top, room.w, room.h - top);
    const fake = Object.assign({}, th, { wall: 'brick', wallA: mixCol(th.wallA, '#6a7a9a', 0.35), wallB: mixCol(th.wallB, '#4a5a7a', 0.35) });
    bg.fillStyle = fake.wallA; bg.fillRect(0, top, room.w, room.h - top);
    drawWallPattern(bg, fake, 0, top, room.w, room.h - top, 2);
    bg.fillStyle = shade(th.wallA, -0.3); bg.fillRect(0, top, room.w, 3);
    bg.fillStyle = shade(th.wallA, 0.15); bg.fillRect(0, top - 2, room.w, 2);
  }
  // vent interiors (empty cells boxed in by ducts)
  for (let ty = 0; ty < room.rows; ty++) for (let tx = 0; tx < room.cols; tx++) {
    if (room.code(tx, ty) !== TL.EMPTY) continue;
    const ud = room.code(tx, ty - 1) === TL.DUCT && room.code(tx, ty + 1) === TL.DUCT;
    const lr = room.code(tx - 1, ty) === TL.DUCT && room.code(tx + 1, ty) === TL.DUCT;
    const near = [[0, -1], [0, 1], [-1, 0], [1, 0]].filter(([a, b]) => room.code(tx + a, ty + b) === TL.DUCT).length >= 2;
    if (ud || lr || near) {
      bg.fillStyle = '#2e343a'; bg.fillRect(tx * T, ty * T, T, T);
      bg.fillStyle = '#3a4248'; bg.fillRect(tx * T, ty * T + 7, T, 1);
    }
  }
  // decor
  for (const d of room.decor) drawDecor(bg, d.ch, d.x, d.y, th, room, d.info);
  // push the back layer into the distance so solid ground reads clearly
  bg.save();
  bg.globalCompositeOperation = 'source-atop';
  bg.fillStyle = th.ext ? 'rgba(40,24,60,0.34)' : 'rgba(24,14,34,0.22)';
  bg.fillRect(0, 0, room.w, room.h);
  bg.restore();
  // cut window holes (show parallax)
  bg.save();
  bg.globalCompositeOperation = 'destination-out';
  for (const d of room.decor) {
    if (d.ch === 'w' && !th.ext) { bg.fillRect(d.x + 2, d.y + 2, 13, 13); bg.fillRect(d.x + 17, d.y + 2, 13, 13); bg.fillRect(d.x + 2, d.y + 17, 13, 13); bg.fillRect(d.x + 17, d.y + 17, 13, 13); }
  }
  if (th.back === 'wall' && room.def.openings) for (const o of room.def.openings) bg.fillRect(o[0] * T, o[1] * T, o[2] * T, o[3] * T);
  bg.restore();
  // tiles
  for (let ty = 0; ty < room.rows; ty++) for (let tx = 0; tx < room.cols; tx++) {
    const c = room.code(tx, ty);
    const x = tx * T, y = ty * T;
    if (isSolidCode(c)) {
      const top = !room.solidAt(tx, ty - 1) && ty > 0 || (ty === 0 && room.def.openTop);
      drawSolidTile(fg, th, x, y, top && c !== TL.DUCT ? true : (c === TL.DUCT ? !room.solidAt(tx, ty - 1) : false),
        !room.solidAt(tx - 1, ty), !room.solidAt(tx + 1, ty), !room.solidAt(tx, ty + 1) && ty < room.rows - 1, tx, ty, c);
    } else if (c === TL.ONEWAY) drawOnewayTile(fg, th, x, y, tx, ty, room);
    else if (c === TL.LADDER) drawLadderTile(fg, x, y, room.ladderTop(tx, ty));
    else if (c === TL.CLIMB) drawClimbTile(fg, th, x, y, tx, ty, room);
  }
  room.backCanvas = back; room.frontCanvas = front;
}
