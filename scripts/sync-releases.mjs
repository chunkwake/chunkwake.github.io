#!/usr/bin/env node
/**
 * Pull the latest published release from chunkwake/core and cache the assets
 * the download page needs: file names, sizes, platforms and SHA-256 digests.
 *
 * Usage:
 *   node scripts/sync-releases.mjs           # always fetch
 *   node scripts/sync-releases.mjs --cache   # reuse a fresh local copy
 *
 * The committed JSON is also the fallback. If GitHub is unavailable, the build
 * keeps the last known release instead of failing or showing an empty page.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repo = 'chunkwake/core';
const source = `https://api.github.com/repos/${repo}/releases?per_page=10`;
const outputPath = path.join(root, 'content', 'data', 'release.json');
const cacheMaxAgeMs = 6 * 60 * 60 * 1000;

const args = new Set(process.argv.slice(2));
const useCache = args.has('--cache');
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;

function detectPlatform(name) {
  const lower = name.toLowerCase();
  if (/sha256|checksums?|\.sha256$|\.sig$|\.asc$/.test(lower)) return 'other';
  if (/windows|win64|win32|\.exe$|\.msi$/.test(lower)) return 'windows';
  if (/linux|musl/.test(lower)) return 'linux';
  return 'other';
}

function detectArch(name) {
  const lower = name.toLowerCase();
  if (/aarch64|arm64/.test(lower)) return 'arm64';
  if (/x86_64|amd64|x64/.test(lower)) return 'x86_64';
  return '';
}

function detectKind(name) {
  const lower = name.toLowerCase();
  if (/sha256|checksums?|\.sha256$|\.sig$|\.asc$/.test(lower)) return 'checksum';
  if (/\.(zip|tar\.gz|tgz|tar\.xz|tar\.zst|7z)$/.test(lower)) return 'archive';
  if (/\.(exe|msi)$/.test(lower)) return 'binary';
  return 'other';
}

function parseChecksumText(text) {
  const map = new Map();

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const bsd = /^SHA256\s*\((.+)\)\s*=\s*([a-f0-9]{64})$/i.exec(line);
    if (bsd) {
      map.set(bsd[1].trim(), bsd[2].toLowerCase());
      continue;
    }

    const gnu = /^([a-f0-9]{64})\s+\*?(.+)$/i.exec(line);
    if (gnu) {
      map.set(gnu[2].trim(), gnu[1].toLowerCase());
      continue;
    }

    const bare = /^([a-f0-9]{64})$/i.exec(line);
    if (bare) map.set('', bare[1].toLowerCase());
  }

  return map;
}

async function loadChecksums(assets) {
  const map = new Map();

  for (const asset of assets) {
    if (detectKind(asset.name) !== 'checksum' || asset.size > 1_000_000) continue;

    try {
      const response = await fetch(asset.browser_download_url, {
        headers: { 'user-agent': 'chunkwake-site-release-sync' },
        signal: AbortSignal.timeout(20_000),
      });
      if (!response.ok) continue;

      const parsed = parseChecksumText(await response.text());
      for (const [name, hash] of parsed) {
        map.set(name, hash);
        map.set(path.basename(name), hash);
      }
    } catch (error) {
      console.warn(`releases: could not read ${asset.name}: ${error.message}`);
    }
  }

  return map;
}

function checksumFor(asset, checksums) {
  const digest = /^sha256:([a-f0-9]{64})$/i.exec(asset.digest ?? '');
  if (digest) return digest[1].toLowerCase();

  return (
    checksums.get(asset.name) ??
    checksums.get(path.basename(asset.name)) ??
    checksums.get('') ??
    null
  );
}

function normalizeRelease(release, checksums) {
  const assets = [...(release.assets ?? [])]
    .map((asset) => {
      const platform = detectPlatform(asset.name);
      const kind = detectKind(asset.name);
      return {
        name: asset.name,
        size: asset.size,
        url: asset.browser_download_url,
        platform: kind === 'checksum' ? 'other' : platform,
        arch: detectArch(asset.name),
        kind,
        downloads: asset.download_count ?? 0,
        sha256: checksumFor(asset, checksums),
      };
    })
    .sort((a, b) => {
      const order = { windows: 0, linux: 1, other: 2 };
      return (order[a.platform] ?? 3) - (order[b.platform] ?? 3) || a.name.localeCompare(b.name);
    });

  return {
    tag: release.tag_name,
    version: (release.tag_name ?? '').replace(/^v/i, ''),
    name: release.name || release.tag_name,
    publishedAt: release.published_at,
    htmlUrl: release.html_url,
    prerelease: Boolean(release.prerelease),
    assets,
  };
}

async function readExisting() {
  try {
    return JSON.parse(await readFile(outputPath, 'utf8'));
  } catch {
    return null;
  }
}

function isFresh(data) {
  if (!data?.fetchedAt) return false;
  const fetchedAt = Date.parse(data.fetchedAt);
  return Number.isFinite(fetchedAt) && Date.now() - fetchedAt < cacheMaxAgeMs;
}

async function write(data) {
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

async function main() {
  const existing = await readExisting();

  if (useCache && isFresh(existing)) {
    console.log(
      `releases: using cached copy from ${existing.fetchedAt} (${existing.release?.tag ?? 'no release'})`,
    );
    return;
  }

  let releases;
  try {
    const response = await fetch(source, {
      headers: {
        accept: 'application/vnd.github+json',
        'user-agent': 'chunkwake-site-release-sync',
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
      signal: AbortSignal.timeout(20_000),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status} ${response.statusText}`);
    releases = await response.json();
  } catch (error) {
    if (existing) {
      console.warn(
        `releases: fetch failed (${error.message}); keeping the committed copy from ${existing.fetchedAt ?? 'unknown'}`,
      );
      return;
    }

    console.error(`releases: fetch failed and no local copy exists: ${error.message}`);
    process.exitCode = 1;
    return;
  }

  const release = Array.isArray(releases) ? releases.find((item) => !item.draft) : null;

  if (!release) {
    if (existing?.release) {
      console.warn(
        `releases: GitHub returned no published releases; keeping the cached ${existing.release.tag}`,
      );
      return;
    }

    if (existing && existing.release === null) {
      console.log('releases: no published release yet (cached)');
      return;
    }

    await write({
      source,
      repo,
      fetchedAt: new Date().toISOString(),
      release: null,
    });
    console.log('releases: no published release yet');
    return;
  }

  const checksums = await loadChecksums(release.assets ?? []);
  const data = {
    source,
    repo,
    fetchedAt: new Date().toISOString(),
    release: normalizeRelease(release, checksums),
  };

  await write(data);

  const checksummed = data.release.assets.filter((asset) => asset.sha256).length;
  console.log(
    `releases: ${data.release.tag} (${data.release.assets.length} assets, ${checksummed} with SHA-256)`,
  );
}

await main();
