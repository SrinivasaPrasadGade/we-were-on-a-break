// Load the src files + a test script in headless Chromium; optionally evaluate an expression and print JSON.
// usage: node tools/run.js <test.js> [expr] [screenshot.png]
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
(async () => {
  const [testFile, expr, png] = process.argv.slice(2);
  const root = path.join(__dirname, '..');
  const srcDir = path.join(root, 'src');
  const files = fs.readdirSync(srcDir).filter(f => /^\d\d_.*\.js$/.test(f)).sort();
  let js = '';
  for (const f of files) {
    if (process.env.SKIP && new RegExp(process.env.SKIP).test(f)) continue;
    js += '\n// ' + f + '\n' + fs.readFileSync(path.join(srcDir, f), 'utf8');
  }
  js += '\n' + fs.readFileSync(testFile, 'utf8');
  const head = fs.readFileSync(path.join(srcDir, '00_head.html'), 'utf8');
  const html = '<!doctype html><html><head><meta charset="utf-8"></head><body>' + head + '<script>\n' + js + '\n</script></body></html>';
  const tmp = path.join(root, 'test', '_run.html');
  fs.writeFileSync(tmp, html);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1472, height: 828 } });
  const logs = [];
  page.on('pageerror', e => logs.push('PAGEERROR: ' + e.message + '\n' + (e.stack || '')));
  page.on('console', m => logs.push(m.type() + ': ' + m.text()));
  await page.goto('file://' + tmp);
  await page.waitForTimeout(300);
  if (expr) {
    try {
      const r = await page.evaluate(expr);
      console.log(JSON.stringify(r, null, 1));
    } catch (e) { console.log('EVAL ERROR', e.message); }
  }
  if (png) { await page.evaluate(() => { if (typeof Game !== 'undefined') { Game.draw(); present(); } }).catch(() => {}); await page.screenshot({ path: png }); }
  if (logs.length) console.log(logs.slice(0, 40).join('\n'));
  await browser.close();
})();
