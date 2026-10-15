// Drive the built game in headless Chromium: node tools/play.js <scenario.js> [outdir]
const fs = require('fs'); const path = require('path'); const { chromium } = require('playwright');
(async () => {
  const [scenario, outdir] = process.argv.slice(2);
  const root = path.join(__dirname, '..');
  const html = path.join(root, 'dist', 'gangs-all-here.html');
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage({ viewport: { width: 960, height: 540 } });
  const logs = [];
  page.on('pageerror', e => logs.push('PAGEERROR: ' + e.message + '\n' + (e.stack || '').split('\n').slice(0, 4).join('\n')));
  page.on('console', m => { if (m.type() !== 'debug') logs.push(m.type() + ': ' + m.text()); });
  await page.goto('file://' + html);
  await page.waitForTimeout(400);
  const ctx = { page, out: outdir || path.join(root, 'test', 'shots'), logs, shot: async (name) => { fs.mkdirSync(ctx.out, { recursive: true }); await page.screenshot({ path: path.join(ctx.out, name + '.png') }); } };
  const fn = require(path.resolve(scenario));
  try { await fn(ctx); } catch (e) { console.log('SCENARIO ERROR', e.message); }
  if (logs.length) console.log(logs.slice(0, 60).join('\n'));
  await browser.close();
})();
