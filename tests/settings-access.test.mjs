import { test } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
const source = readFileSync(new URL('../admin/settings.js', import.meta.url), 'utf8');
const flush = () => new Promise(resolve => setImmediate(resolve));
function setup(fetch) {
  let session = null;
  let poll;
  const fields = new Map();
  const field = name => {
    if (!fields.has(name)) fields.set(name, { value: '' });
    return fields.get(name);
  };
  const link = { setAttribute() {}, removeAttribute() {} };
  const item = { append() {} };
  const form = { reset() { for (const value of fields.values()) value.value = ''; }, elements: { namedItem: field }, querySelectorAll: () => [], querySelector: () => ({}) };
  const page = { querySelector: selector => selector === 'form' ? form : {} };
  const nav = { querySelector: () => ({ className: 'native-link' }), append(node) { node.parentElement = this; } };
  const events = {};
  const window = { location: { hash: '#/collections/people' }, addEventListener(name, fn) { events[name] = fn; }, setInterval(fn) { poll = fn; } };
  vm.runInNewContext(source, {
    window, document: {
      createElement: tag => ({ li: item, a: link, main: page })[tag],
      getElementById: () => ({}), querySelector: () => nav,
      body: { append() {}, classList: { toggle() {} } },
    },
    MutationObserver: class { observe() {} },
    localStorage: { getItem: () => session }, fetch,
  });
  window.EAISCreateSettings('https://worker.example');
  return { item, page, field, poll: () => poll(), focus: () => events.focus(),
    navigate(hash) { window.location.hash = hash; events.hashchange(); },
    login(token) { session = token ? JSON.stringify({ backendName: 'github', token }) : null; },
  };
}

test('anonymous visitors never see the settings entry or make permission requests', async () => {
  let calls = 0;
  const state = setup(async () => { calls++; });
  await flush();
  assert.equal(state.item.hidden, true);
  assert.equal(calls, 0);
  state.navigate('#/image-settings');
  assert.equal(state.page.hidden, true);
});
test('only verified GitHub admins see settings; logout hides and clears the page', async () => {
  const state = setup(async () => Response.json({ permissions: { push: true, admin: true } }));
  state.login('admin-token');
  await state.poll();
  assert.equal(state.item.hidden, false);
  state.navigate('#/image-settings');
  assert.equal(state.page.hidden, false);
  state.field('token').value = 'sensitive-input';
  state.login(null);
  await state.poll();
  assert.equal(state.item.hidden, true);
  assert.equal(state.page.hidden, true);
  assert.equal(state.field('token').value, '');
});
test('writers, expired sessions and network failures keep settings hidden', async () => {
  for (const response of [() => Response.json({ permissions: { push: true, admin: false } }), () => new Response('', { status: 401 }), () => { throw new Error('offline'); }]) {
    const state = setup(async () => response());
    state.login('not-an-admin');
    await state.poll();
    assert.equal(state.item.hidden, true);
  }
});
test('a delayed permission response cannot reopen settings after logout', async () => {
  let respond;
  const state = setup(() => new Promise(resolve => { respond = resolve; }));
  state.login('old-token');
  const pending = state.poll();
  state.login(null);
  await state.poll();
  respond(Response.json({ permissions: { push: true, admin: true } }));
  await pending;
  assert.equal(state.item.hidden, true);
});

test('settings uses its own route and hides when navigating back to native content', async () => {
  const state = setup(async () => Response.json({ permissions: { push: true, admin: true } }));
  state.login('admin-token');
  await state.poll();
  state.navigate('#/image-settings');
  assert.equal(state.page.hidden, false);
  state.field('token').value = 'unsaved-secret';
  state.navigate('#/workflow');
  assert.equal(state.page.hidden, true);
  assert.equal(state.field('token').value, '');
  state.navigate('#/image-settings');
  assert.equal(state.page.hidden, false);
});


test('refocusing with the same admin session preserves every unsaved field without reloading', async () => {
  let loads = 0;
  const state = setup(async url => {
    if (url.includes('api.github.com')) return Response.json({ permissions: { push: true, admin: true } });
    loads++;
    return Response.json({ accountId: 'saved-account', accountHash: 'saved-hash', tokenConfigured: true, editable: true, variants: {} });
  });
  state.login('admin-token');
  await state.poll();
  state.navigate('#/image-settings');
  await flush();
  const draft = { accountId: 'new-account', accountHash: 'new-hash', token: 'unsaved-secret', 'avatar-width': '720' };
  for (const [name, value] of Object.entries(draft)) state.field(name).value = value;
  await state.focus();
  await state.focus();
  await flush();
  assert.equal(state.page.hidden, false);
  assert.equal(loads, 1);
  for (const [name, value] of Object.entries(draft)) assert.equal(state.field(name).value, value, name);
});

test('refocusing still hides settings and clears secrets when admin permission is revoked', async () => {
  let admin = true;
  const state = setup(async () => Response.json({ permissions: { push: true, admin } }));
  state.login('admin-token');
  await state.poll();
  state.navigate('#/image-settings');
  state.field('token').value = 'unsaved-secret';
  admin = false;
  await state.focus();
  assert.equal(state.page.hidden, true);
  assert.equal(state.item.hidden, true);
  assert.equal(state.field('token').value, '');
});
