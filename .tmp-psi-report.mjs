import fs from 'node:fs';

const result = JSON.parse(fs.readFileSync(process.env.TEMP + '/psi-mobile.json', 'utf8'));
const audits = result.audits;

console.log('=== SCORES');
for (const [key, category] of Object.entries(result.categories)) {
  console.log(key, category.score, category.title);
}

console.log('\n=== METRICS');
for (const id of [
  'first-contentful-paint',
  'largest-contentful-paint',
  'total-blocking-time',
  'cumulative-layout-shift',
  'speed-index',
  'interactive',
  'server-response-time',
]) {
  const audit = audits[id];
  if (audit) console.log(id, audit.displayValue, audit.score, audit.numericValue);
}

console.log('\n=== FAILING / OPPORTUNITY AUDITS');
const rows = [];
for (const [id, audit] of Object.entries(audits)) {
  if (audit.scoreDisplayMode === 'notApplicable' || audit.scoreDisplayMode === 'manual' || audit.scoreDisplayMode === 'informative') continue;
  if (audit.score === 1 || audit.score === null) continue;
  const savingsMs = audit.details?.overallSavingsMs ?? 0;
  const savingsBytes = audit.details?.overallSavingsBytes ?? 0;
  rows.push({ id, score: audit.score, title: audit.title, display: audit.displayValue ?? '', savingsMs: Math.round(savingsMs), savingsBytes });
}
rows.sort((a, b) => b.savingsMs - a.savingsMs || b.savingsBytes - a.savingsBytes || a.score - b.score);
for (const row of rows) {
  console.log(`${row.id} | score=${row.score} | ${row.display} | save ${row.savingsMs}ms ${row.savingsBytes}B | ${row.title}`);
}

console.log('\n=== TOP SAVINGS BY BYTES');
rows.sort((a, b) => b.savingsBytes - a.savingsBytes);
for (const row of rows.slice(0, 12)) {
  console.log(`${row.id} | ${row.savingsBytes}B ${row.savingsMs}ms | ${row.title}`);
}

console.log('\n=== DIAGNOSTICS');
for (const id of [
  'mainthread-work-breakdown',
  'bootup-time',
  'network-requests',
  'network-rtt',
  'network-server-latency',
  'render-blocking-resources',
  'unused-javascript',
  'unused-css-rules',
  'uses-long-cache-ttl',
  'total-byte-weight',
  'dom-size',
  'third-party-summary',
  'lcp-discovery-insight',
  'lcp-breakdown-insight',
  'cls-culprits-insight',
  'font-display-insight',
  'image-delivery-insight',
  'document-latency-insight',
]) {
  const audit = audits[id];
  if (!audit) continue;
  console.log(`\n--- ${id} | ${audit.displayValue ?? ''} | score=${audit.score}`);
  const details = audit.details;
  if (!details) continue;
  if (details.items) {
    for (const item of details.items.slice(0, 12)) {
      console.log(JSON.stringify(item).slice(0, 500));
    }
  } else {
    console.log(JSON.stringify(details).slice(0, 800));
  }
}

console.log('\n=== LCP ELEMENT');
console.log(JSON.stringify(audits['largest-contentful-paint-element']?.details?.items ?? [], null, 2).slice(0, 2000));
