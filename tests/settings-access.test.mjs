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
  const button = { style: {} };
  const form = { elements: { namedItem: field }, querySelectorAll: () => [], querySelector: () => ({}) };
  const dialog = { style: {}, open: false, setAttribute() {}, addEventListener() {}, close() { this.open = false; }, querySelector: selector => selector === 'form' ? form : {} };
  const window = { addEventListener() {}, setInterval(fn) { poll = fn; } };
  vm.runInNewContext(source, {
    window, document: { createElement: tag => tag === 'button' ? button : dialog, body: { append() {} } },
    localStorage: { getItem: () => session }, fetch,
  });
  window.EAISCreateSettings('https://worker.example');
  return { button, dialog, field, poll: () => poll(), login(token) { session = token ? JSON.stringify({ backendName: 'github', token }) : null; } };
}
test('anonymous visitors never see the settings entry or make permission requests', async () => {
  let calls = 0;
  const state = setup(async () => { calls++; });
  await flush();
  assert.equal(state.button.hidden, true);
  assert.equal(calls, 0);
  await state.button.onclick();
  assert.equal(state.dialog.open, false);
});
test('only verified GitHub admins see settings; logout hides and clears the dialog', async () => {
  const state = setup(async () => Response.json({ permissions: { push: true, admin: true } }));
  state.login('admin-token');
  await state.poll();
  assert.equal(state.button.hidden, false);
  state.dialog.open = true;
  state.field('token').value = 'sensitive-input';
  state.login(null);
  await state.poll();
  assert.equal(state.button.hidden, true);
  assert.equal(state.dialog.open, false);
  assert.equal(state.field('token').value, '');
});
test('writers, expired sessions and network failures keep settings hidden', async () => {
  for (const response of [() => Response.json({ permissions: { push: true, admin: false } }), () => new Response('', { status: 401 }), () => { throw new Error('offline'); }]) {
    const state = setup(async () => response());
    state.login('not-an-admin');
    await state.poll();
    assert.equal(state.button.hidden, true);
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
  assert.equal(state.button.hidden, true);
});
