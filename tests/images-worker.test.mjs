import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import worker from '../workers/images/worker.mjs';
const originalFetch = globalThis.fetch;
afterEach(() => { globalThis.fetch = originalFetch; });
const env = { ALLOWED_ORIGINS: 'https://eaislab.com', GITHUB_REPO: 'org/site', CF_ACCOUNT_ID: 'account', CF_IMAGES_HASH: 'hash', CF_IMAGES_TOKEN: 'private-key' };
function request({ origin = 'https://eaislab.com', token = 'github-token', method = 'POST', body = { variant: 'avatar' } } = {}) {
  const headers = { Origin: origin, 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  return new Request('https://images.example/upload-url', { method, headers, ...(method === 'POST' ? { body: JSON.stringify(body) } : {}) });
}
test('preflight only allows the configured website', async () => {
  const response = await worker.fetch(request({ method: 'OPTIONS' }), env);
  assert.equal(response.status, 204);
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), env.ALLOWED_ORIGINS);
  const denied = await worker.fetch(request({ origin: 'https://evil.example' }), env);
  assert.equal(denied.status, 403);
  assert.equal(denied.headers.get('Access-Control-Allow-Origin'), null);
});
test('missing login and invalid variants never call upstream services', async () => {
  globalThis.fetch = () => { throw new Error('must not call'); };
  assert.equal((await worker.fetch(request({ token: '' }), env)).status, 401);
  assert.equal((await worker.fetch(request({ body: { variant: '../original' } }), env)).status, 400);
});
test('read-only GitHub users cannot allocate uploads', async () => {
  let calls = 0;
  globalThis.fetch = async url => {
    calls++;
    assert.match(url, /^https:\/\/api.github.com\//);
    return Response.json({ permissions: { push: false } });
  };
  assert.equal((await worker.fetch(request(), env)).status, 403);
  assert.equal(calls, 1);
});
test('expired login is rejected', async () => {
  globalThis.fetch = async () => new Response('', { status: 401 });
  assert.equal((await worker.fetch(request(), env)).status, 401);
});
test('authorized uploads keep each credential scoped to its provider', async () => {
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push(url);
    if (url.includes('api.github.com')) {
      assert.equal(options.headers.Authorization, 'Bearer github-token');
      return Response.json({ permissions: { push: true } });
    }
    assert.equal(options.headers.Authorization, 'Bearer private-key');
    assert.equal(options.body.get('requireSignedURLs'), 'false');
    assert.ok(Date.parse(options.body.get('expiry')) > Date.now());
    return Response.json({ success: true, result: { id: 'image-id', uploadURL: 'https://upload.imagedelivery.net/one-time' } });
  };
  const response = await worker.fetch(request(), env);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
  const result = await response.json();
  assert.equal(result.deliveryURL, 'https://imagedelivery.net/hash/image-id/avatar');
  assert.ok(!JSON.stringify(result).includes('private-key'));
  assert.equal(calls.length, 2);
});
test('provider errors return a safe actionable message', async () => {
  globalThis.fetch = async url => url.includes('github')
    ? Response.json({ permissions: { push: true } })
    : Response.json({ success: false, errors: ['private provider details'] }, { status: 400 });
  const response = await worker.fetch(request(), env);
  assert.equal(response.status, 502);
  assert.ok(!(await response.text()).includes('private provider details'));
});

function settingsRequest(method = 'GET', body) {
  return new Request('https://images.example/settings', {
    method, headers: { Origin: env.ALLOWED_ORIGINS, Authorization: 'Bearer github-token', 'Content-Type': 'application/json' },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
}
function settingsEnv() {
  const values = new Map();
  return {
    ...env, SETTINGS_ENCRYPTION_KEY: 'a-test-encryption-key-with-at-least-32-characters',
    SETTINGS: { async get(key) { return values.has(key) ? JSON.parse(values.get(key)) : null; }, async put(key, value) { values.set(key, value); } },
    values,
  };
}
test('writers can upload but cannot view or edit service settings', async () => {
  globalThis.fetch = async () => Response.json({ permissions: { push: true, admin: false } });
  for (const method of ['GET', 'POST']) {
    assert.equal((await worker.fetch(settingsRequest(method, method === 'POST' ? {} : undefined), env)).status, 403);
  }
});
test('admin settings response never reveals the stored token', async () => {
  globalThis.fetch = async () => Response.json({ permissions: { push: true, admin: true } });
  const response = await worker.fetch(settingsRequest(), env);
  assert.equal(response.status, 200);
  const body = await response.text();
  assert.ok(!body.includes('private-key'));
  assert.equal(JSON.parse(body).tokenConfigured, true);
});
test('save validates credentials, initializes variants, encrypts token and reuses it for upload', async () => {
  const context = settingsEnv();
  const variants = [];
  globalThis.fetch = async (url, options) => {
    if (url.includes('github')) return Response.json({ permissions: { push: true, admin: true } });
    assert.equal(options.headers.Authorization, 'Bearer new-cloudflare-secret');
    if (url.endsWith('/variants') && !options.method) return Response.json({ success: true, result: { variants: { avatar: {} } } });
    if (url.includes('?per_page')) return Response.json({ success: true, result: { images: [] } });
    if (options.method === 'PATCH' || (url.endsWith('/variants') && options.method === 'POST')) {
      variants.push({ method: options.method, body: JSON.parse(options.body) });
      return Response.json({ success: true });
    }
    return Response.json({ success: true, result: { id: 'new-image', uploadURL: 'https://upload.imagedelivery.net/once' } });
  };
  const response = await worker.fetch(settingsRequest('POST', { accountId: 'a'.repeat(32), accountHash: 'delivery-hash', token: 'new-cloudflare-secret' }), context);
  assert.equal(response.status, 200);
  assert.equal(variants.length, 3);
  assert.equal(variants[0].method, 'PATCH');
  assert.equal(variants[1].body.id, 'cover');
  assert.equal(variants[2].body.options.fit, 'scale-down');
  assert.ok(!context.values.get('cloudflare').includes('new-cloudflare-secret'));
  const get = await worker.fetch(settingsRequest(), context);
  assert.equal((await get.json()).tokenConfigured, true);
  const upload = await worker.fetch(request(), context);
  assert.equal((await upload.json()).deliveryURL, 'https://imagedelivery.net/delivery-hash/new-image/avatar');
});
test('invalid Cloudflare credentials leave saved configuration untouched', async () => {
  const context = settingsEnv();
  globalThis.fetch = async url => url.includes('github')
    ? Response.json({ permissions: { push: true, admin: true } })
    : Response.json({ success: false }, { status: 403 });
  const response = await worker.fetch(settingsRequest('POST', { accountId: 'a'.repeat(32), accountHash: 'hash', token: 'invalid-secret' }), context);
  assert.equal(response.status, 400);
  assert.equal(context.values.size, 0);
});
test('changing accounts requires a new credential and invalid account IDs are rejected', async () => {
  const context = settingsEnv();
  globalThis.fetch = async url => {
    assert.ok(url.includes('github'));
    return Response.json({ permissions: { push: true, admin: true } });
  };
  for (const accountId of ['a'.repeat(32), '../../another-resource']) {
    assert.equal((await worker.fetch(settingsRequest('POST', { accountId, accountHash: 'hash', token: '' }), context)).status, 400);
  }
  assert.equal(context.values.size, 0);
});
test('out-of-range image settings cannot change Cloudflare resources', async () => {
  const context = settingsEnv();
  globalThis.fetch = async url => {
    assert.ok(url.includes('github'));
    return Response.json({ permissions: { push: true, admin: true } });
  };
  const response = await worker.fetch(settingsRequest('POST', {
    accountId: 'a'.repeat(32), accountHash: 'hash', token: 'secret',
    variants: { avatar: { width: 999999, height: 600, fit: 'cover' } },
  }), context);
  assert.equal(response.status, 400);
  assert.equal(context.values.size, 0);
});
