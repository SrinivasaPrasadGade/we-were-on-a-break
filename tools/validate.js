// Static content checks for all episodes (runs the content files in a VM with stubs)
const fs = require('fs'); const path = require('path'); const vm = require('vm');
const root = path.join(__dirname, '..');
const ctx = { FRIENDS: ['dex', 'mila', 'theo', 'priya', 'benny', 'juno'], console };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root, 'src', '14_episodes.js'), 'utf8') + '\nthis.EPISODES = EPISODES;', ctx);
const RESERVED = new Set(['#', '=', 'H', 'M', 'D', '^', 'I', '{', '}', '@', 'c', '*', 'k', '.', ' ']);
let errors = 0;
const err = m => { errors++; console.log('ERROR ' + m); };
ctx.EPISODES.forEach((ep, ei) => {
  let mugs = 0, cups = 0;
  ep.rooms.forEach((r, ri) => {
    const tag = `E${ei + 1}R${ri + 1}`;
    const w = r.map[0].length;
    r.map.forEach((row, y) => { if (row.length !== w) err(`${tag} row ${y} length ${row.length} != ${w}`); });
    const legend = r.ents || {};
    for (const k of Object.keys(legend)) {
      if (RESERVED.has(k) && k !== 'X') err(`${tag} legend uses reserved char '${k}'`);
      if (!r.map.some(row => row.includes(k))) err(`${tag} legend '${k}' not in map`);
      if (!legend[k] || !legend[k].t) err(`${tag} legend '${k}' has no type`);
    }
    let spawn = 0, exit = 0;
    r.map.forEach(row => { for (const ch of row) {
      if (ch === '@') spawn++;
      if (ch === 'X') exit++;
      if (ch === '*') mugs++;
      if (ch === 'c') cups++;
      if (/[A-Z0-9]/.test(ch) && !RESERVED.has(ch) && ch !== 'X' && !legend[ch]) err(`${tag} map char '${ch}' has no legend`);
    } });
    if (spawn !== 1) err(`${tag} has ${spawn} spawns`);
    // nothing dangerous or solid along the spawn line (6 friends, 18px apart)
    r.map.forEach((row, y) => { const sx = row.indexOf('@'); if (sx < 0) return;
      const cast = (r.cast || ctx.FRIENDS).length;
      for (let px = sx * 16 + 2; px < sx * 16 + 2 + (cast - 1) * 18 + 14; px += 2) {
        const tx = Math.floor(px / 16);
        for (const yy of [y, y - 1]) { const ch = (r.map[yy] || '')[tx]; if (ch === '^' || ch === '#' || ch === 'D') err(`${tag} spawn line blocked by '${ch}' at ${tx},${yy}`); }
        const leg = r.ents && r.ents[row[tx]]; if (leg && (leg.t === 'crate' || leg.t === 'hazard' || leg.t === 'npc')) err(`${tag} spawn line overlaps ${leg.t} at ${tx},${y}`);
      } });
    if (!exit && !r.goal) err(`${tag} has no exit and no goal`);
    for (const e of r.extra || []) if (e.x === undefined || e.y === undefined) err(`${tag} extra entity without x/y`);
  });
  if (mugs !== 1) err(`E${ei + 1} has ${mugs} golden mugs`);
  console.log(`E${ei + 1} "${ep.title}": ${ep.rooms.length} rooms, ${cups} cups, ${mugs} mug`);
});
console.log(errors ? errors + ' ERRORS' : 'content OK');
process.exit(errors ? 1 : 0);
