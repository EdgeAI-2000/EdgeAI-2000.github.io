import { test } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
const source = readFileSync(new URL('../admin/cloudflare-images.js', import.meta.url), 'utf8');
function setup({ endpoint = 'https://images.example', user = { backendName: 'github', token: 'session-token' }, fetch } = {}) {
  const controls = Object.fromEntries(['variant', 'file', 'upload', 'url', 'insert', 'close', 'status'].map(id => [id, { value: '', files: [], disabled: false }]));
  controls.variant.value = 'avatar';
  controls.file.files = [new Blob(['image'], { type: 'image/png' })];
  const dialog = {
    style: {}, setAttribute() {}, addEventListener() {},
    querySelector: selector => controls[selector.slice(4)],
    querySelectorAll: () => Object.values(controls),
    showModal() { this.open = true; }, close() { this.open = false; },
  };
  let library;
  const inserted = [];
  vm.runInNewContext(source, {
    CMS: { registerMediaLibrary(value) { library = value; } },
    document: { createElement: () => dialog, body: { appendChild() {} } },
    localStorage: { getItem: () => JSON.stringify(user) },
    FormData, fetch,
    Image: class { set src(value) { this.onload(); } },
  });
  const instance = library.init({ options: { config: { endpoint } }, handleInsert: url => inserted.push(url) });
  instance.show();
  return { controls, dialog, inserted, instance };
}
test('upload reuses GitHub login and sends no auth header to direct upload', async () => {
  const calls = [];
  const state = setup({ fetch: async (url, options) => {
    calls.push({ url, options });
    return calls.length === 1
      ? Response.json({ uploadURL: 'https://upload.imagedelivery.net/once', deliveryURL: 'https://imagedelivery.net/hash/id/avatar' })
      : Response.json({ success: true });
  } });
  await state.controls.upload.onclick();
  assert.equal(calls[0].options.headers.Authorization, 'Bearer session-token');
  assert.equal(calls[1].options.headers, undefined);
  assert.deepEqual(state.inserted, ['https://imagedelivery.net/hash/id/avatar']);
  assert.equal(state.dialog.open, false);
});
test('unconfigured service and missing login fail without uploading', async () => {
  for (const options of [{ endpoint: '' }, { user: null }]) {
    let calls = 0;
    const state = setup({ ...options, fetch: () => { calls++; } });
    await state.controls.upload.onclick();
    assert.equal(calls, 0);
    assert.equal(state.inserted.length, 0);
    assert.ok(state.controls.status.textContent);
  }
});
test('failed uploads do not insert broken URLs and can be retried', async () => {
  const state = setup({ fetch: async () => Response.json({ error: '登录已过期' }, { status: 401 }) });
  await state.controls.upload.onclick();
  assert.equal(state.inserted.length, 0);
  assert.equal(state.controls.upload.disabled, false);
  assert.equal(state.controls.status.textContent, '登录已过期');
});
test('existing local images remain usable, executable URLs are rejected', () => {
  const state = setup();
  state.controls.url.value = 'javascript:alert(1)';
  state.controls.insert.onclick();
  assert.equal(state.inserted.length, 0);
  state.controls.url.value = '/assets/images/people/zhangsan.svg';
  state.controls.insert.onclick();
  assert.deepEqual(state.inserted, ['/assets/images/people/zhangsan.svg']);
});
