// Concatenates src/* into one self-contained HTML page (artifact form: no html/head/body tags).
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const srcDir = path.join(root, 'src');
const files = fs.readdirSync(srcDir).filter(f => /^\d\d_.*\.(js|html)$/.test(f)).sort();

let head = '';
let js = '';
let foot = '';
for (const f of files) {
  const txt = fs.readFileSync(path.join(srcDir, f), 'utf8');
  if (f.endsWith('.html')) {
    if (f.startsWith('00_')) head += txt;
    else foot += txt;
  } else {
    js += `\n// ===== ${f} =====\n` + txt + '\n';
  }
}

const out = head + '<script>\n(function(){\n' + js + '\n})();\n</script>\n' + foot;
const outPath = path.join(root, 'dist', 'gangs-all-here.html');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, out);
console.log('built', outPath, (out.length / 1024).toFixed(1) + ' KB', files.length + ' files');
