// Build a test page from selected src files + a test script, render in headless Chromium, screenshot.
// usage: node tools/shot.js <testScript.js> <out.png> [scale] [files-upto-prefix]
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const [testFile, outPng, scaleArg, upto] = process.argv.slice(2);
  const root = path.join(__dirname, '..');
  const srcDir = path.join(root, 'src');
  const lim = upto || '99';
  const files = fs.readdirSync(srcDir).filter(f => /^\d\d_.*\.js$/.test(f) && f.slice(0, 2) <= lim).sort();
  let js = '';
  for (const f of files) js += '\n// ' + f + '\n' + fs.readFileSync(path.join(srcDir, f), 'utf8');
  js += '\n' + fs.readFileSync(testFile, 'utf8');
  const head = fs.readFileSync(path.join(srcDir, '00_head.html'), 'utf8');
  const html = '<!doctype html><html><head><meta charset="utf-8"></head><body>' + head + '<script>\n' + js + '\n</script></body></html>';
  const tmp = path.join(root, 'test', '_shot.html');
  fs.writeFileSync(tmp, html);
  const scale = parseFloat(scaleArg || '2');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: Math.round(480 * scale) + 32, height: Math.round(270 * scale) }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning' || m.type() === 'log') errors.push(m.type() + ': ' + m.text()); });
  await page.goto('file://' + tmp);
  await page.waitForTimeout(500);
  await page.screenshot({ path: outPng });
  console.log(errors.join('\n'));
  await browser.close();
})();
