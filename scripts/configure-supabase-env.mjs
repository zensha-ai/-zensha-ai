import { spawnSync } from 'node:child_process';
import { randomBytes, randomUUID } from 'node:crypto';
import { existsSync, readFileSync, renameSync, unlinkSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const root = fileURLToPath(new URL('../', import.meta.url));
class SetupError extends Error {}

// Accept both CLI versions' JSON envelopes without logging their contents.
export function findRows(value, predicate) {
  if (!value || typeof value !== 'object') return [];
  if (predicate(value)) return [value];
  return Object.values(value).flatMap((child) => findRows(child, predicate));
}

export function updateEnv(source, values) {
  const pending = new Map(Object.entries(values));
  const lines = source.replace(/^\uFEFF/, '').split(/\r?\n/).flatMap((line) => {
    const key = /^(?:export\s+)?([A-Z][A-Z0-9_]*)\s*=/.exec(line)?.[1];
    if (!key || !Object.hasOwn(values, key)) return [line];
    if (!pending.has(key)) return []; // Remove duplicate definitions of updated keys.
    pending.delete(key);
    return [`${key}=${values[key]}`];
  });
  while (lines.at(-1) === '') lines.pop();
  return [...lines, ...Array.from(pending, ([key, value]) => `${key}=${value}`), ''].join('\n');
}

function supabase(args) {
  const cli = path.join(root, 'node_modules/supabase/dist/supabase.js');
  if (!existsSync(cli)) throw new SetupError('Run npm.cmd install first to install the project CLI.');
  const result = spawnSync(process.execPath, [cli, ...args, '--agent', 'no', '--output-format', 'json'], {
    cwd: root,
    encoding: 'utf8',
    timeout: 30_000,
    maxBuffer: 2 * 1024 * 1024,
    windowsHide: true,
    env: { ...process.env, SUPABASE_TELEMETRY_DISABLED: '1', DO_NOT_TRACK: '1' },
  });
  // Never print stdout/stderr: api-keys output contains server credentials.
  if (result.error || result.status !== 0) {
    throw new SetupError('Supabase CLI failed. Check login and network access in your own terminal; run npx.cmd supabase login if needed.');
  }
  try {
    const parsed = JSON.parse(result.stdout);
    if (parsed?.error || parsed?._tag === 'Error') throw new Error();
    return parsed;
  } catch {
    throw new SetupError('Supabase did not return usable JSON. No API keys were printed or saved.');
  }
}

async function main() {
  const ignored = spawnSync('git', ['check-ignore', '-q', '--', '.env.local'], { cwd: root });
  const tracked = spawnSync('git', ['ls-files', '--error-unmatch', '--', '.env.local'], { cwd: root, stdio: 'ignore' });
  if (ignored.status !== 0 || tracked.status !== 1) {
    throw new SetupError('Refusing to save credentials: .env.local must be ignored and untracked by Git.');
  }

  const projects = findRows(supabase(['projects', 'list']), (row) => row.name === 'zensha-ai' && typeof row.id === 'string');
  if (projects.length !== 1) {
    throw new SetupError('Expected exactly one project named zensha-ai. Create it in the Supabase dashboard on a Free organization, preferably in Mumbai, then run this script again. Stop if a paid plan is required.');
  }
  const projectRef = projects[0].id;
  if (!/^[a-z0-9]{20}$/.test(projectRef)) throw new SetupError('Unexpected project reference; no files changed.');
  const url = `https://${projectRef}.supabase.co`;
  const envFile = path.join(root, '.env.local');
  const source = existsSync(envFile) ? readFileSync(envFile, 'utf8') : '';
  // [ \t]* (not \s*) so an empty value can't match text on the following line.
  const oldUrl = /^NEXT_PUBLIC_SUPABASE_URL[ \t]*=[ \t]*["']?([^\s"'#]+)["']?[ \t]*$/m.exec(source)?.[1];
  if (oldUrl && oldUrl.replace(/\/$/, '') !== url) {
    throw new SetupError('The existing environment points to a different Supabase project. Review that configuration before replacing it.');
  }

  const keys = findRows(supabase(['projects', 'api-keys', `--remote=${projectRef}`, '--reveal']), (row) => typeof row.api_key === 'string');
  const publicKey = keys.find((row) => row.name === 'anon') ?? keys.find((row) => row.type === 'publishable');
  const serverKey = keys.find((row) => row.name === 'service_role') ?? keys.find((row) => row.type === 'secret');
  const keyPattern = /^(?:sb_(?:publishable|secret)_[A-Za-z0-9_-]+|eyJ[A-Za-z0-9_.-]+)$/;
  if (!keyPattern.test(publicKey?.api_key ?? '') || !keyPattern.test(serverKey?.api_key ?? '')) {
    throw new SetupError('Required public/server keys were unavailable. No environment values changed.');
  }

  const db = createClient(url, serverKey.api_key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (input, init) => fetch(input, { ...init, signal: AbortSignal.timeout(15_000) }) },
  });
  const { error } = await db.storage.listBuckets();
  if (error) throw new SetupError('Project API verification failed. Wait for provisioning to finish and try again.');

  const hasSalt = /^(?:export\s+)?IP_HASH_SALT\s*=\s*(?!["']?["']?\s*(?:#.*)?$).+/m.test(source);
  const values = {
    NEXT_PUBLIC_SUPABASE_URL: url,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: publicKey.api_key,
    SUPABASE_SERVICE_ROLE_KEY: serverKey.api_key,
    ...(!hasSalt ? { IP_HASH_SALT: randomBytes(32).toString('hex') } : {}),
  };
  const temporary = `${envFile}.${randomUUID()}.tmp`;
  try {
    writeFileSync(temporary, updateEnv(source, values), { encoding: 'utf8', mode: 0o600, flag: 'wx' });
    renameSync(temporary, envFile);
  } finally {
    if (existsSync(temporary)) unlinkSync(temporary);
  }
  console.log('Supabase API verified. App keys saved to ignored .env.local without displaying them.');
  console.log('Restart the Next.js development server. Database migrations still need to be applied.');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error instanceof SetupError ? error.message : 'Setup failed. No credentials were printed.');
    process.exitCode = 1;
  });
}
