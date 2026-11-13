#!/usr/bin/env node
/**
 * Record real terminal sessions from a built Chunkwake binary.
 *
 * Usage:
 *   node scripts/record-terminal.mjs --binary target/debug/chunkwake --core ../core
 *   node scripts/record-terminal.mjs --only doctor,tick
 *
 * The script starts a throwaway flat-world server for console demos, waits for
 * the dashboard line, sends commands one by one and writes JSON under
 * public/terminal/. Absolute paths are replaced with ./server so the checked-in
 * data is portable.
 */
import { execFileSync, spawn, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { createInterface } from 'node:readline';
import { fileURLToPath } from 'node:url';
import { sessions } from './terminal-sessions.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = new Map();
for (let i = 2; i < process.argv.length; i += 1) {
  const value = process.argv[i];
  if (!value.startsWith('--')) continue;
  const next = process.argv[i + 1];
  if (next && !next.startsWith('--')) {
    args.set(value.slice(2), next);
    i += 1;
  } else {
    args.set(value.slice(2), 'true');
  }
}

const coreDir = path.resolve(
  args.get('core') || process.env.CHUNKWAKE_CORE || 'E:\\paper_rust',
);
// Resolve before spawning: console sessions run with cwd set to the throwaway
// server directory, so a relative binary path would otherwise be looked up
// there instead of the repository root.
const binary = path.resolve(
  args.get('binary') ||
    process.env.CHUNKWAKE_BIN ||
    path.join(
      coreDir,
      'target',
      'debug',
      process.platform === 'win32' ? 'chunkwake.exe' : 'chunkwake',
    ),
);
const outDir = path.resolve(root, args.get('out') || 'public/terminal');
const fixture = path.resolve(
  args.get('dir') || path.join(os.tmpdir(), 'chunkwake-terminal-fixture'),
);
const only = new Set((args.get('only') || '').split(',').filter(Boolean));

if (!existsSync(binary)) {
  console.error(`terminal: binary not found at ${binary}`);
  process.exit(1);
}

const env = { ...process.env, NO_COLOR: '1', CLICOLOR: '0' };

function stripAnsi(value) {
  return value.replace(/\x1b\[[0-9;]*[A-Za-z]/g, '');
}

function normalize(value) {
  let text = stripAnsi(String(value)).replace(/\r$/, '').trimEnd();
  const variants = new Set([
    fixture,
    fixture.replace(/\\/g, '/'),
    fixture.replace(/\//g, '\\'),
  ]);
  for (const variant of variants) {
    if (variant) text = text.split(variant).join('./server');
  }
  text = text.replace(/(?:[A-Za-z]:[\\/][^\s]*?chunkwake-terminal-fixture[\\/]?)/gi, './server');
  return text.replace(/[\\/]server[\\/](?:\.\/server)/g, './server');
}

function parseLogLine(line) {
  const match = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\s+(INFO|WARN|ERROR)\s+(.*)$/.exec(line);
  if (!match) return { text: normalize(line) };
  return { level: match[1].toLowerCase(), text: normalize(match[2]) };
}

function coreInfo() {
  try {
    const sha = execFileSync('git', ['-C', coreDir, 'rev-parse', 'HEAD'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    const branch = execFileSync('git', ['-C', coreDir, 'branch', '--show-current'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return { repo: 'chunkwake/core', branch: branch || 'ver/26.3', coreSha: sha };
  } catch {
    return {
      repo: 'chunkwake/core',
      branch: 'ver/26.3',
      coreSha: process.env.CHUNKWAKE_CORE_SHA || null,
    };
  }
}

function binaryInfo() {
  let version = '26.3';
  try {
    const help = execFileSync(binary, ['--help'], { encoding: 'utf8', env });
    const match = /Minecraft\s+([0-9][^\s]*)/.exec(help);
    if (match) version = match[1];
  } catch {
    // keep the default
  }

  return {
    version,
    profile: /[\\/]debug[\\/]/.test(binary) ? 'debug' : 'release',
  };
}

async function freePort(preferred) {
  if (preferred) {
    const available = await new Promise((resolve) => {
      const server = net.createServer();
      server.unref();
      server.once('error', () => resolve(false));
      server.listen(preferred, '127.0.0.1', () => {
        server.close(() => resolve(true));
      });
    });
    if (available) return preferred;
  }

  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}

function runSetup() {
  const result = spawnSync(binary, ['setup', '--yes', '--dir', fixture], {
    cwd: fixture,
    env,
    encoding: 'utf8',
  });
  if (result.error) throw new Error(`setup failed: ${result.error.message}`);
  if (result.status !== 0) {
    throw new Error(`setup failed: ${result.stderr || result.stdout || `exit ${result.status}`}`);
  }
}

function setConfig(key, value) {
  const result = spawnSync(binary, ['config', 'set', key, value, '--dir', fixture], {
    cwd: fixture,
    env,
    encoding: 'utf8',
  });
  if (result.error) throw new Error(`config set ${key} failed: ${result.error.message}`);
  if (result.status !== 0) {
    throw new Error(
      `config set ${key} failed: ${result.stderr || result.stdout || `exit ${result.status}`}`,
    );
  }
}

async function prepareFixture() {
  await mkdir(fixture, { recursive: true });
  if (!existsSync(path.join(fixture, 'server.properties'))) runSetup();

  // Prefer the documented defaults so `doctor` and `config show` in the docs
  // look like a normal install; fall back to a random port when something is
  // already listening.
  const port = await freePort(25565);
  const metricsPort = await freePort(25585);
  setConfig('server-port', String(port));
  setConfig('metrics-port', String(metricsPort));
  setConfig('online-mode', 'false');
  setConfig('max-players', '20');
  setConfig('motd', 'A Chunkwake Server');

  await rm(path.join(fixture, 'world'), { recursive: true, force: true });
  await rm(path.join(fixture, 'logs'), { recursive: true, force: true });
  await rm(path.join(fixture, '.chunkwake.lock'), { force: true });
}

function collectCli(session) {
  return new Promise((resolve, reject) => {
    const argv = [...session.args];
    if (session.needsDir) argv.push('--dir', fixture);
    const child = spawn(binary, argv, { cwd: fixture, env });
    const lines = [];
    const stdout = createInterface({ input: child.stdout });
    const stderr = createInterface({ input: child.stderr });
    stdout.on('line', (line) => lines.push(line));
    stderr.on('line', (line) => lines.push(line));

    const timer = setTimeout(() => {
      child.kill();
      reject(new Error(`cli session ${session.id} timed out`));
    }, 30_000);

    child.on('error', reject);
    child.on('close', () => {
      clearTimeout(timer);
      resolve(lines);
    });
  });
}

async function recordCli(session) {
  const lines = await collectCli(session);
  const displayArgs = [...session.args];
  if (session.needsDir) displayArgs.push('--dir', './server');

  const events = [
    {
      type: 'input',
      text: `chunkwake ${displayArgs.join(' ')}`,
      at: 0,
    },
  ];

  lines.forEach((line, index) => {
    const parsed = parseLogLine(line);
    events.push({ type: 'output', text: parsed.text, at: 120 + index * 70 });
  });

  return {
    id: session.id,
    shell: 'cli',
    prompt: '$',
    title: session.title,
    description: session.description,
    events,
  };
}

function waitForReady(child) {
  return new Promise((resolve, reject) => {
    const rl = createInterface({ input: child.stdout });
    const timer = setTimeout(() => {
      rl.close();
      reject(new Error('server did not report a dashboard in time'));
    }, 60_000);

    child.on('error', (error) => {
      clearTimeout(timer);
      reject(error);
    });

    rl.on('line', (line) => {
      if (!line.includes('dashboard on')) return;
      clearTimeout(timer);
      resolve(rl);
    });
  });
}

function collectUntilQuiet(rl, quietMs = 450, maxMs = 3000) {
  return new Promise((resolve) => {
    const lines = [];
    let timer;
    let done = false;

    const finish = () => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      rl.off('line', onLine);
      resolve(lines);
    };

    const onLine = (line) => {
      lines.push(line);
      clearTimeout(timer);
      timer = setTimeout(finish, quietMs);
    };

    rl.on('line', onLine);
    timer = setTimeout(finish, maxMs);
  });
}

function waitForExit(child) {
  return new Promise((resolve) => {
    if (child.exitCode !== null) {
      resolve();
      return;
    }
    child.once('close', resolve);
    setTimeout(resolve, 5000);
  });
}

async function recordServer(session) {
  const child = spawn(binary, ['--dir', fixture], {
    cwd: fixture,
    env,
    stdio: ['pipe', 'pipe', 'pipe'],
  });

  const startedAt = Date.now();
  const events = [];
  let rl;

  // Drain stderr so a chatty warning cannot fill the pipe and stall startup.
  child.stderr.resume();

  try {
    rl = await waitForReady(child);
    await new Promise((resolve) => setTimeout(resolve, 350));

    for (const command of session.commands) {
      const inputAt = Date.now() - startedAt;
      events.push({ type: 'input', text: command, at: inputAt });

      const linesPromise = collectUntilQuiet(rl);
      child.stdin.write(`${command}\n`);
      const lines = await linesPromise;

      lines.forEach((line, index) => {
        if (line.trim() === '' && index === lines.length - 1) return;
        const parsed = parseLogLine(line);
        events.push({
          type: 'output',
          ...(parsed.level ? { level: parsed.level } : {}),
          text: parsed.text,
          at: inputAt + 140 + index * 80,
        });
      });

      if (command === 'stop') {
        await waitForExit(child);
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, 220));
    }
  } finally {
    rl?.close();
    if (child.exitCode === null) child.kill();
  }

  // The first command is sent after the world is ready; playback should start
  // at zero instead of waiting through server startup.
  const offset = events[0]?.at ?? 0;
  for (const event of events) event.at = Math.max(0, event.at - offset);

  return {
    id: session.id,
    shell: 'console',
    prompt: '>',
    title: session.title,
    description: session.description,
    events,
  };
}

async function writeManifest() {
  const entries = [];
  for (const file of await readdir(outDir)) {
    if (!file.endsWith('.json') || file === 'index.json') continue;
    try {
      const data = JSON.parse(await readFile(path.join(outDir, file), 'utf8'));
      entries.push({
        id: data.id,
        shell: data.shell,
        prompt: data.prompt,
        title: data.title,
        description: data.description,
        capturedAt: data.capturedAt,
        core: data.core,
        binary: data.binary,
      });
    } catch {
      // ignore a partially written file
    }
  }

  entries.sort((a, b) => a.id.localeCompare(b.id));
  await writeFile(
    path.join(outDir, 'index.json'),
    `${JSON.stringify({ generatedAt: new Date().toISOString(), demos: entries }, null, 2)}\n`,
    'utf8',
  );
  return entries;
}

await mkdir(outDir, { recursive: true });
const core = coreInfo();
const bin = binaryInfo();
const selected = sessions.filter((session) => only.size === 0 || only.has(session.id));

if (selected.some((session) => session.kind === 'server' || session.needsDir)) {
  await prepareFixture();
} else {
  await mkdir(fixture, { recursive: true });
}

for (const session of selected) {
  console.log(`terminal: recording ${session.id}`);
  const data = session.kind === 'cli' ? await recordCli(session) : await recordServer(session);
  const output = {
    ...data,
    capturedAt: new Date().toISOString(),
    core,
    binary: bin,
    fixture: 'flat world, no players',
  };
  await writeFile(path.join(outDir, `${session.id}.json`), `${JSON.stringify(output, null, 2)}\n`, 'utf8');
}

const entries = await writeManifest();
console.log(`terminal: ${entries.length} demos in ${path.relative(root, outDir)}`);
