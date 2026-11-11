import QRCode from 'qrcode';
import type { DonationPalette } from './donations';

/**
 * A small SVG QR renderer with rounded modules and a quiet zone. The built-in
 * `qrcode` renderer only draws square modules; this keeps each donation card
 * visually distinct without losing the QR structure.
 */
export function renderQr(address: string, palette: DonationPalette) {
  const qr = QRCode.create(address, { errorCorrectionLevel: 'H' });
  const { size } = qr.modules;
  const quiet = 2;
  const total = size + quiet * 2;

  const inFinder = (x: number, y: number) =>
    (x < 7 && y < 7) || (x >= size - 7 && y < 7) || (x < 7 && y >= size - 7);

  const parts: string[] = [
    `<rect width="${total}" height="${total}" rx="2.4" fill="${palette.paper}"/>`,
  ];

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      if (!qr.modules.get(y, x) || inFinder(x, y)) continue;
      parts.push(
        `<rect x="${x + quiet}" y="${y + quiet}" width="0.9" height="0.9" rx="0.28" fill="${palette.ink}"/>`,
      );
    }
  }

  for (const [x, y] of [
    [0, 0],
    [size - 7, 0],
    [0, size - 7],
  ]) {
    parts.push(
      `<rect x="${x + quiet}" y="${y + quiet}" width="7" height="7" rx="1.7" fill="${palette.ink}"/>`,
      `<rect x="${x + quiet + 1}" y="${y + quiet + 1}" width="5" height="5" rx="1.2" fill="${palette.paper}"/>`,
      `<rect x="${x + quiet + 2}" y="${y + quiet + 2}" width="3" height="3" rx="0.75" fill="${palette.ink}"/>`,
    );
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" role="img" aria-hidden="true" focusable="false" shape-rendering="geometricPrecision">${parts.join('')}</svg>`;
}
