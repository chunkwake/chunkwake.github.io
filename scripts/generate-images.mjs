import { Resvg } from '@resvg/resvg-js';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(root, 'public');
const matrix = JSON.parse(await readFile(path.join(root, 'content', 'data', 'feature-matrix.json'), 'utf8'));

const accent = '#a6a092';
const text = '#e7e7e7';
const muted = '#9a9a96';
const subtle = '#7a7a75';
const panel = '#202020';
const border = '#303030';

function escapeXml(value) {
  return value.replace(/[<>&"']/g, (char) => ({
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '"': '&quot;',
    "'": '&apos;',
  })[char]);
}

function mark(x, y, scale, centerColor = accent, baseColor = text) {
  const cells = [
    [2, 2, 0.4],
    [9.25, 2, 0.4],
    [16.5, 2, 0.4],
    [2, 9.25, 0.4],
    [9.25, 9.25, 1],
    [16.5, 9.25, 0.4],
    [2, 16.5, 0.4],
    [9.25, 16.5, 0.4],
    [16.5, 16.5, 0.18],
  ];

  return `<g transform="translate(${x} ${y}) scale(${scale})">${cells
    .map(
      ([cx, cy, opacity]) =>
        `<rect x="${cx}" y="${cy}" width="5.5" height="5.5" rx="1" fill="${opacity === 1 ? centerColor : baseColor}" opacity="${opacity}"/>`,
    )
    .join('')}</g>`;
}

function baseSvg(content) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <defs>
      <pattern id="grid" width="44" height="44" patternUnits="userSpaceOnUse">
        <path d="M44 0H0V44" fill="none" stroke="#242424" stroke-width="1"/>
      </pattern>
      <radialGradient id="glow" cx="12%" cy="0%" r="80%">
        <stop offset="0" stop-color="${accent}" stop-opacity="0.18"/>
        <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="line" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="${accent}" stop-opacity="0.55"/>
        <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="630" fill="#181818"/>
    <rect width="1200" height="630" fill="url(#grid)" opacity="0.55"/>
    <rect width="1200" height="630" fill="url(#glow)"/>
    <rect x="0" y="0" width="1200" height="1" fill="${border}"/>
    ${content}
  </svg>`;
}

function header(lang) {
  return `${mark(80, 66, 2.2)}
    <text x="150" y="106" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="30" font-weight="600" fill="${text}" letter-spacing="-0.8">chunk<tspan fill="${accent}">wake</tspan></text>
    <text x="1120" y="90" text-anchor="end" font-family="Consolas, monospace" font-size="12" fill="${subtle}" letter-spacing="1.4">MINECRAFT 26.3</text>
    <text x="1120" y="112" text-anchor="end" font-family="Consolas, monospace" font-size="12" fill="${subtle}" letter-spacing="1.4">RUST + JVM</text>
    <rect x="80" y="150" width="1040" height="1" fill="${border}"/>`;
}

function footer(lang) {
  return `<rect x="80" y="566" width="1040" height="1" fill="${border}"/>
    <text x="80" y="600" font-family="Consolas, monospace" font-size="13" fill="${subtle}">chunkwake.github.io</text>
    <text x="1120" y="600" text-anchor="end" font-family="Consolas, monospace" font-size="13" fill="${subtle}">${lang === 'en' ? 'open source · GPL-3.0' : 'открытый код · GPL-3.0'}</text>`;
}

function stat(x, value, label, lang) {
  return `<text x="${x}" y="474" font-family="Consolas, monospace" font-size="34" font-weight="600" fill="${text}">${escapeXml(value)}</text>
    <text x="${x}" y="500" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="12" fill="${subtle}" letter-spacing="0.8">${escapeXml(label.toUpperCase())}</text>`;
}

function landingSvg(lang) {
  const ru = lang === 'ru';
  const title = ru ? ['Сервер Minecraft', 'на Rust.'] : ['A Minecraft server', 'in Rust.'];
  const subtitle = ru
    ? 'Плагины Paper без переписывания. Один бинарник.'
    : 'Paper plugins without a rewrite. One binary.';

  return baseSvg(`
    ${header(lang)}
    <text x="80" y="282" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="64" font-weight="600" fill="${text}" letter-spacing="-2">${escapeXml(title[0])}</text>
    <text x="80" y="356" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="64" font-weight="600" fill="${accent}" letter-spacing="-2">${escapeXml(title[1])}</text>
    <text x="80" y="408" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="24" fill="${muted}">${escapeXml(subtitle)}</text>
    <rect x="80" y="444" width="180" height="1" fill="url(#line)"/>
    ${stat(80, String(matrix.totals.ready), ru ? 'механик готово' : 'mechanics ready', lang)}
    ${stat(330, String(matrix.totals.partial), ru ? 'частично' : 'partial', lang)}
    ${stat(580, '26.3', 'Minecraft', lang)}
    ${footer(lang)}
  `);
}

function docsSvg(lang) {
  const ru = lang === 'ru';
  const title = ru ? 'Документация' : 'Documentation';
  const subtitle = ru
    ? 'Установка, миграция, плагины и матрица механик.'
    : 'Install, migrate, write plugins and check the feature matrix.';
  const sections = ru
    ? ['Быстрый старт', 'Миграция', 'Плагины', 'Фич-матрица']
    : ['Quick start', 'Migration', 'Plugins', 'Feature matrix'];

  const chips = sections
    .map((label, index) => {
      const x = 80 + index * 230;
      return `<rect x="${x}" y="462" width="206" height="42" rx="6" fill="${panel}" stroke="${border}"/>
        <text x="${x + 16}" y="488" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="14" fill="${muted}">${escapeXml(label)}</text>`;
    })
    .join('');

  return baseSvg(`
    ${header(lang)}
    <text x="80" y="300" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="70" font-weight="600" fill="${text}" letter-spacing="-2.2">${escapeXml(title)}</text>
    <rect x="80" y="326" width="120" height="2" fill="${accent}"/>
    <text x="80" y="382" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="24" fill="${muted}">${escapeXml(subtitle)}</text>
    ${chips}
    ${footer(lang)}
  `);
}

function iconSvg(size, padding) {
  const scale = (size - padding * 2) / 24;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" fill="#181818"/>
    ${mark(padding, padding, scale)}
  </svg>`;
}

async function png(svg, file) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'original' },
    font: { loadSystemFonts: true },
  });
  await writeFile(path.join(publicDir, file), resvg.render().asPng());
}

await mkdir(publicDir, { recursive: true });

await Promise.all([
  png(landingSvg('ru'), 'og-ru.png'),
  png(landingSvg('en'), 'og-en.png'),
  png(docsSvg('ru'), 'og-docs-ru.png'),
  png(docsSvg('en'), 'og-docs-en.png'),
  png(iconSvg(192, 40), 'icon-192.png'),
  png(iconSvg(512, 104), 'icon-512.png'),
  png(iconSvg(512, 72), 'icon-maskable-512.png'),
  png(iconSvg(180, 38), 'apple-icon.png'),
]);

console.log('images: wrote OG images and PWA icons to public/');
