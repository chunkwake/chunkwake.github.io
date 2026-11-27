import fs from 'node:fs';

const html = fs.readFileSync(process.env.TEMP + '/psi.html', 'utf8');
for (const needle of ['lighthouseVersion', '\\"lighthouseVersion\\"', 'categories', '\\"categories\\"', 'audits', '\\"audits\\"', 'fetchTime', 'formFactor']) {
  let index = -1;
  let count = 0;
  while ((index = html.indexOf(needle, index + 1)) >= 0 && count < 4) {
    console.log('===', JSON.stringify(needle), '@', index);
    console.log(html.slice(Math.max(0, index - 200), index + 240).replace(/\s+/g, ' '));
    count += 1;
  }
}
