import fs from 'node:fs';

const html = fs.readFileSync(process.env.TEMP + '/psi.html', 'utf8');

function extractAt(marker, output) {
  const markerIndex = html.indexOf(marker);
  if (markerIndex < 0) {
    console.log('marker not found', marker.slice(0, 40));
    return;
  }

  let start = markerIndex;
  while (start > 0) {
    if (html[start] === '"' && html[start - 1] !== '\\') break;
    start -= 1;
  }

  let end = start + 1;
  while (end < html.length) {
    if (html[end] === '"' && html[end - 1] !== '\\') break;
    end += 1;
  }

  const raw = html.slice(start + 1, end);
  const unescaped = JSON.parse(`"${raw}"`);
  const result = JSON.parse(unescaped);
  fs.writeFileSync(output, JSON.stringify(result, null, 2));
  console.log('saved', output, 'bytes', unescaped.length, 'fetchTime', result.fetchTime);
}

extractAt('{\\"fetchTime', process.env.TEMP + '/psi-mobile.json');
// The desktop report appears after the mobile one; skip the first marker.
const first = html.indexOf('{\\"fetchTime');
face: {
  const secondIndex = html.indexOf('{\\"fetchTime', first + 10);
  if (secondIndex < 0) break face;
  const htmlCopy = html;
  const start = htmlCopy.lastIndexOf('"', secondIndex);
  let end = start + 1;
  while (end < htmlCopy.length) {
    if (htmlCopy[end] === '"' && htmlCopy[end - 1] !== '\\') break;
    end += 1;
  }
  const raw = htmlCopy.slice(start + 1, end);
  const result = JSON.parse(JSON.parse(`"${raw}"`));
  fs.writeFileSync(process.env.TEMP + '/psi-desktop.json', JSON.stringify(result, null, 2));
  console.log('saved desktop', result.fetchTime);
}
