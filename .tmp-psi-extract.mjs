import fs from 'node:fs';

const html = fs.readFileSync(process.env.TEMP + '/psi.html', 'utf8');
console.log('html', html.length);

const scripts = [...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)];
console.log('scripts', scripts.length);
let found = 0;
for (const [index, match] of scripts.entries()) {
  const attrs = match[1];
  const body = match[2];
  if (!/application\/(ld\+)?json/.test(attrs)) continue;
  console.log('json script', index, attrs.slice(0, 120), 'len', body.length);
  try {
    const parsed = JSON.parse(body);
    console.log('  parsed keys', Object.keys(parsed).slice(0, 12));
    if (parsed.categories || parsed.audits) {
      fs.writeFileSync(process.env.TEMP + '/psi-result.json', JSON.stringify(parsed));
      console.log('  saved');
      found += 1;
    }
  } catch (error) {
    console.log('  parse failed', String(error).slice(0, 120));
  }
}

if (found === 0) {
  const idx = html.indexOf('"categories"');
  console.log('categories @', idx);
  if (idx >= 0) console.log(html.slice(Math.max(0, idx - 600), idx + 300).replace(/\s+/g, ' '));
}
