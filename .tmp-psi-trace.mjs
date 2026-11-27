import fs from 'node:fs';

const result = JSON.parse(fs.readFileSync(process.env.TEMP + '/psi-mobile.json', 'utf8'));
const audits = result.audits;

console.log('=== METRICS AUDIT');
console.log(JSON.stringify(audits.metrics?.details?.items?.[0] ?? {}, null, 2).slice(0, 2500));

console.log('\n=== SPEED INDEX DETAILS');
console.log(JSON.stringify(audits['speed-index']?.details ?? {}, null, 2).slice(0, 3000));

console.log('\n=== THUMBNAILS');
for (const item of audits['screenshot-thumbnails']?.details?.items ?? []) {
  console.log(item.timing, item.timestamp, item.data?.slice(0, 60));
}

console.log('\n=== FINAL SCREENSHOT');
console.log(JSON.stringify(audits['final-screenshot']?.details ?? {}, null, 2).slice(0, 300));

console.log('\n=== AUDIT GROUPS / SCORES');
for (const [id, category] of Object.entries(result.categories)) {
  console.log('\n--', id, category.score);
  for (const ref of category.auditRefs ?? []) {
    const audit = audits[ref.id];
    if (!audit || audit.scoreDisplayMode === 'notApplicable' || audit.scoreDisplayMode === 'manual') continue;
    if (audit.score !== null && audit.score < 1) {
      console.log(`  ${ref.id} | score=${audit.score} | ${audit.displayValue ?? ''} | weight=${ref.weight}`);
    }
  }
}
