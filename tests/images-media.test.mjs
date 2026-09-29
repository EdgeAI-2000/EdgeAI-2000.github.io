import { test } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
const source = readFileSync(new URL('../admin/cloudflare-images.js', import.meta.url), 'utf8');
function setup({ endpoint = 'https://images.example', user = { backendName: 'github', token: 'session-token' }, fetch, standalone = false, editor = false } = {}) {
  const controls = Object.fromEntries(['variant', 'file', 'upload', 'url', 'insert', 'close', 'status'].map(id => [id, { value: '', files: [], disabled: false }]));
  controls.variant.value = 'avatar';
  controls.file.files = [new Blob(['image'], { type: 'image/png' })];
  const events = {};
  const window = { location: { hash: '#/collections/people' }, addEventListener(name, fn) { events[name] = fn; } };
  const page = {
    style: {}, setAttribute() {}, addEventListener() {},
    querySelector: selector => controls[selector.slice(4)],
    querySelectorAll: () => Object.values(controls),
  };
  let library;
  const inserted = [];
  vm.runInNewContext(source, {
    CMS: { registerMediaLibrary(value) { library = value; } },
    window,
    MutationObserver: class { observe() {} },
    document: { createElement: tag => { assert.equal(tag, 'main'); return page; },
      querySelector: selector => !editor || selector.includes('EditorContainer') ? {} : null, getElementById: () => ({}),
      body: { appendChild() {}, classList: { toggle() {} } } },
    localStorage: { getItem: () => JSON.stringify(user) },
    FormData, fetch,
    Image: class { set src(value) { this.onload(); } },
  });
  const instance = library.init({ options: { config: { endpoint } }, handleInsert: url => inserted.push(url) });
  instance.show(standalone ? {} : { id: 'image-field' });
  return { controls, page, inserted, instance, window,
    navigate(hash) { window.location.hash = hash; events.hashchange(); } };
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
  assert.equal(state.page.hidden, true);
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


test('standalone media opens a page and follows navigation without a modal', () => {
  const state = setup({ standalone: true });
  assert.equal(state.window.location.hash, '#/media');
  assert.equal(state.page.hidden, false);
  assert.equal(state.controls.upload.textContent, '上传图片');
  assert.equal(state.controls.insert.hidden, true);
  state.navigate('#/collections/people');
  assert.equal(state.page.hidden, true);
  state.navigate('#/media');
  assert.equal(state.page.hidden, false);
  state.navigate('#/image-settings');
  assert.equal(state.page.hidden, true);
});

test('standalone upload retains the page and shows the URL without inserting into content', async () => {
  const state = setup({ standalone: true, fetch: async url => url.endsWith('/upload-url')
    ? Response.json({ uploadURL: 'https://upload.example/once', deliveryURL: 'https://images.example/image' })
    : Response.json({ success: true }) });
  await state.controls.upload.onclick();
  assert.equal(state.page.hidden, false);
  assert.equal(state.controls.url.value, 'https://images.example/image');
  assert.equal(state.inserted.length, 0);
});

test('image insertion keeps the editor route and cancel restores its content', () => {
  const state = setup({ editor: true });
  assert.equal(state.window.location.hash, '#/collections/people');
  assert.equal(state.page.hidden, false);
  assert.equal(state.controls.insert.hidden, false);
  state.controls.close.onclick();
  assert.equal(state.page.hidden, true);
  assert.equal(state.inserted.length, 0);
});
