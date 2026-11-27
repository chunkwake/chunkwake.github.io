import fs from 'node:fs';

const result = JSON.parse(fs.readFileSync(process.env.TEMP + '/psi-mobile.json', 'utf8'));
const items = result.audits['screenshot-thumbnails']?.details?.items ?? [];
for (const [index, item] of items.entries()) {
  const data = item.data ?? '';
  const base64 = data.includes(',') ? data.split(',')[1] : data;
  fs.writeFileSync(`${process.env.TEMP}/psi-shot-${index}.jpg`, Buffer.from(base64, 'base64'));
  console.log(index, item.timing, base64.length);
}
