// Run bot solutions for episodes: node tools/verify.js [ep] [room]
const fs = require('fs'); const path = require('path'); const { chromium } = require('playwright');
(async () => {
  const [epArg, roomArg] = process.argv.slice(2);
  const root = path.join(__dirname, '..');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 960, height: 540 } });
  const logs = [];
  page.on('pageerror', e => logs.push('PAGEERROR: ' + e.message + '\n' + (e.stack || '').split('\n').slice(0, 5).join('\n')));
  page.on('console', m => { if (m.type() === 'error') logs.push('console.error: ' + m.text()); });
  await page.goto('file://' + path.join(root, 'dist', 'gangs-all-here.html'));
  await page.waitForTimeout(300);
  await page.addScriptTag({ path: path.join(root, 'test', 'bot.js') });
  for (const f of fs.readdirSync(path.join(root, 'test')).filter(f => /^sol_ep\d+\.js$/.test(f))) await page.addScriptTag({ path: path.join(root, 'test', f) });
  const eps = await page.evaluate(() => Object.keys(window.__sol).map(Number));
  let fails = 0;
  for (const ep of eps) {
    if (epArg !== undefined && epArg !== 'all' && +epArg !== ep) continue;
    const nRooms = await page.evaluate(ep => window.__sol[ep].length, ep);
    let carry = null;
    for (let r = 0; r < nRooms; r++) {
      if (roomArg !== undefined && +roomArg !== r) continue;
      const res = await page.evaluate(([ep, r]) => {
        const G = window.__gang, B = window.__bot;
        G.Game.manual = true; G.Input.down.clear();
        const L = new G.LevelScene(ep, { room: r, noMusic: true });
        G.Game.setScene(L);
        B.frames = 0; B.log = [];
        B.step(30);
        let ok = true, err = null;
        try { window.__sol[ep][r](B); B.step(10); } catch (e) { ok = false; err = e.message + (e instanceof Error && !e.message.includes('[') ? '\n' + (e.stack || '').split('\n').slice(0, 3).join('\n') : ''); }
        const done = !!(L.trans || L.completing || L.goalT > 0);
        const cupsLeft = L.room.ents.filter(e => e.constructor.name === 'Cup' && !e.got).map(e => [e.tx, e.ty]);
        const mugHere = G.EPISODES[ep].rooms[r].map.some(row => row.includes('*'));
        G.Game.draw(); G.present();
        return { ok: ok && done, err: err || (done ? null : 'room not completed'), frames: B.frames, cupsLeft, mug: L.mugGot, mugHere, takes: L.takes - 1, log: B.log };
      }, [ep, r]);
      const tag = `E${ep + 1} R${r + 1}`;
      if (!res.ok) fails++;
      console.log(`${res.ok ? 'PASS' : 'FAIL'} ${tag} frames=${res.frames} (${(res.frames / 60).toFixed(0)}s) cupsLeft=${JSON.stringify(res.cupsLeft)} ${res.mugHere ? 'mug=' + res.mug : ''} mishaps=${res.takes}${res.err ? '\n   -> ' + res.err : ''}`);
      fs.mkdirSync(path.join(root, 'test', 'verify'), { recursive: true });
      await page.screenshot({ path: path.join(root, 'test', 'verify', `e${ep + 1}r${r + 1}_${res.ok ? 'pass' : 'FAIL'}.png`) });
    }
  }
  if (logs.length) console.log(logs.slice(0, 30).join('\n'));
  console.log(fails ? `${fails} FAILURES` : 'ALL PASS');
  await browser.close();
})();
