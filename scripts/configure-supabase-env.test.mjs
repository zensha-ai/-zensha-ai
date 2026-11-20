import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findRows, updateEnv } from './configure-supabase-env.mjs';

test('preserves unrelated settings and comments while replacing duplicate credentials', () => {
  const source = '# Contact\r\nNEXT_PUBLIC_CONTACT_EMAIL=zenshaofficial@gmail.com\r\nSUPABASE_SERVICE_ROLE_KEY=old\r\nexport SUPABASE_SERVICE_ROLE_KEY=duplicate\r\nPAYMENTS_ENABLED=false\r\n';
  const result = updateEnv(source, { SUPABASE_SERVICE_ROLE_KEY: 'new-test-value', IP_HASH_SALT: 'test-salt' });
  assert.ok(result.includes('# Contact\nNEXT_PUBLIC_CONTACT_EMAIL=zenshaofficial@gmail.com'));
  assert.ok(result.includes('PAYMENTS_ENABLED=false'));
  assert.equal((result.match(/SUPABASE_SERVICE_ROLE_KEY=/g) ?? []).length, 1);
  assert.ok(result.includes('SUPABASE_SERVICE_ROLE_KEY=new-test-value'));
  assert.ok(result.endsWith('IP_HASH_SALT=test-salt\n'));
  assert.ok(!result.includes('old'));
  assert.ok(!result.includes('duplicate'));
});

test('supports whitespace, exported variables and UTF-8 BOMs', () => {
  assert.equal(updateEnv('\uFEFFexport NEXT_PUBLIC_SUPABASE_URL = old\n', { NEXT_PUBLIC_SUPABASE_URL: 'https://example.invalid' }), 'NEXT_PUBLIC_SUPABASE_URL=https://example.invalid\n');
});

test('supports project and key lists in both direct arrays and CLI envelopes', () => {
  const fixture = { api_keys: [{ name: 'anon', api_key: 'test-public' }, { name: 'service_role', api_key: 'test-server' }] };
  const predicate = (row) => typeof row.api_key === 'string';
  assert.deepEqual(findRows(fixture, predicate), fixture.api_keys);
  assert.deepEqual(findRows(fixture.api_keys, predicate), fixture.api_keys);
  assert.deepEqual(findRows({ projects: [] }, predicate), []);
});
