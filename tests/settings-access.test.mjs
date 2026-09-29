import { test } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
const source = readFileSync(new URL('../admin/settings.js', import.meta.url), 'utf8');
const flush = () => new Promise(resolve => setImmediate(resolve));
function setup(fetch, endpoint = 'https://worker.example', visibilityFetch = async () => Response.json({ sha: 'initial-sha', content: btoa('news: false\nprojects: false\n') })) {
  let session = null;
  let poll;
  const fields = new Map();
  const field = name => {
    if (!fields.has(name)) fields.set(name, { value: '' });
    return fields.get(name);
  };
  const link = { setAttribute() {}, removeAttribute() {} };
  const item = { append() {} };
  const submit = {};
  const status = {};
  const form = { reset() { for (const value of fields.values()) value.value = ''; }, elements: { namedItem: field }, querySelectorAll: () => [], querySelector: () => submit };
  const visibilityFields = {};
  const visibilityStatus = {};
  const visibilityReload = {};
  const switches = Object.fromEntries('home about vision contact admissions news themes research projects funding publications patents people openings privacy sitemap'.split(' ').map(name => [name, { checked: false, disabled: false }]));
  const visibilityForm = { querySelector: () => visibilityFields, elements: { namedItem: name => switches[name] } };
  const page = { querySelector: selector => ({ '[data-images-form]': form, '[data-status]': status,
    '[data-visibility-form]': visibilityForm, '[data-visibility-status]': visibilityStatus, '[data-visibility-reload]': visibilityReload })[selector] || {} };
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
    localStorage: { getItem: () => session }, atob, btoa,
    fetch: (url, options) => url.includes('/contents/') ? visibilityFetch(url, options) : fetch(url, options),
  });
  window.EAISCreateSettings(endpoint);
  return { item, page, field, submit, status, switches, visibilityForm, visibilityFields, visibilityStatus, visibilityReload, poll: () => poll(), focus: () => events.focus(),
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


test('missing deployment clearly explains why saving is unavailable', async () => {
  const state = setup(async () => Response.json({ permissions: { push: true, admin: true } }), '');
  state.login('admin-token');
  await state.poll();
  state.navigate('#/image-settings');
  await flush();
  assert.equal(state.submit.disabled, true);
  assert.equal(state.submit.textContent, '服务未部署，暂不能保存');
  assert.match(state.status.textContent, /Cloudflare 登录授权和首次服务部署/);
});

test('ready service enables save and uninitialized storage explains the disabled state', async () => {
  for (const editable of [true, false]) {
    const state = setup(async url => Response.json(url.includes('api.github.com')
      ? { permissions: { push: true, admin: true } }
      : { accountId: '', accountHash: '', variants: {}, editable }));
    state.login('admin-token');
    await state.poll();
    state.navigate('#/image-settings');
    await flush();
    assert.equal(state.submit.disabled, !editable);
    assert.equal(state.submit.textContent, editable ? '验证并保存配置' : '存储未初始化，暂不能保存');
  }
});


test('inline switches load and publish on the same page even without an image service', async () => {
  const calls = [];
  const state = setup(async () => Response.json({ permissions: { push: true, admin: true } }), '', async (url, options) => {
    calls.push({ url, options });
    return Response.json(options.method === 'GET'
      ? { sha: 'old', content: btoa('news: true\nprojects: false\n') }
      : { content: { sha: 'new' } });
  });
  state.login('admin-token');
  await state.poll();
  state.navigate('#/image-settings');
  await flush();
  assert.equal(state.switches.news.checked, true);
  assert.equal(state.switches.projects.checked, false);
  assert.equal(state.visibilityFields.disabled, false);
  state.switches.news.checked = false;
  state.switches.projects.checked = true;
  await state.visibilityForm.onsubmit({ preventDefault() {} });
  assert.equal(state.page.hidden, false);
  assert.equal(calls[1].options.headers.Authorization, 'Bearer admin-token');
  const payload = JSON.parse(calls[1].options.body);
  assert.equal(payload.sha, 'old');
  assert.equal(payload.branch, 'main');
  assert.match(atob(payload.content), /^news: false$/m);
  assert.match(atob(payload.content), /^projects: true$/m);
  assert.equal(atob(payload.content).trim().split('\n').length, 16);
  assert.match(state.visibilityStatus.textContent, /已保存并发布/);
  await state.visibilityForm.onsubmit({ preventDefault() {} });
  assert.equal(JSON.parse(calls[2].options.body).sha, 'new');
});

test('failed or malformed reads disable publishing and allow reload', async () => {
  for (const response of [() => new Response('', { status: 403 }), () => Response.json({ sha: 'bad', content: btoa('invalid') })]) {
    const state = setup(async () => Response.json({ permissions: { push: true, admin: true } }), '', response);
    state.login('admin-token');
    await state.poll();
    state.navigate('#/image-settings');
    await flush();
    assert.equal(state.visibilityFields.disabled, true);
    assert.equal(state.visibilityReload.disabled, false);
    assert.ok(state.visibilityStatus.textContent);
  }
});

test('concurrent changes are not overwritten and failed saves preserve draft switches', async () => {
  let writes = 0;
  const state = setup(async () => Response.json({ permissions: { push: true, admin: true } }), '', async (url, options) => {
    if (options.method === 'GET') return Response.json({ sha: 'old', content: btoa('news: false\nprojects: false\n') });
    writes++;
    return new Response('', { status: 409 });
  });
  state.login('admin-token');
  await state.poll();
  state.navigate('#/image-settings');
  await flush();
  state.switches.news.checked = true;
  await state.visibilityForm.onsubmit({ preventDefault() {} });
  assert.equal(writes, 1);
  assert.equal(state.switches.news.checked, true);
  assert.match(state.visibilityStatus.textContent, /重新读取/);
});

test('late visibility reads cannot update the page after logout', async () => {
  let respond;
  let writes = 0;
  const state = setup(async () => Response.json({ permissions: { push: true, admin: true } }), '', async (url, options) => {
    if (options.method === 'PUT') writes++;
    return new Promise(resolve => { respond = resolve; });
  });
  state.login('admin-token');
  await state.poll();
  state.navigate('#/image-settings');
  state.login(null);
  await state.poll();
  respond(Response.json({ sha: 'old', content: btoa('news: true\nprojects: true\n') }));
  await flush();
  assert.equal(state.switches.news.checked, false);
  assert.equal(state.page.hidden, true);
  await state.visibilityForm.onsubmit({ preventDefault() {} });
  assert.equal(writes, 0);
});


test('all page switches load legacy defaults and parents disable children recursively', async () => {
  let saved;
  const state = setup(async () => Response.json({ permissions: { push: true, admin: true } }), '', async (url, options) => {
    if (options.method === 'PUT') { saved = atob(JSON.parse(options.body).content); return Response.json({ content: { sha: 'new' } }); }
    return Response.json({ sha: 'old', content: btoa('news: false\nprojects: false\n') });
  });
  state.login('admin-token'); await state.poll(); state.navigate('#/image-settings'); await flush();
  for (const [name, field] of Object.entries(state.switches)) assert.equal(field.checked, !['news', 'projects'].includes(name), name);
  state.switches.about.checked = false;
  state.switches.themes.checked = false;
  state.visibilityForm.onchange();
  const children = ['vision', 'contact', 'admissions', 'openings', 'research', 'projects', 'funding', 'publications', 'patents'];
  for (const name of children) {
    assert.equal(state.switches[name].checked, false, name);
    assert.equal(state.switches[name].disabled, true, name);
  }
  await state.visibilityForm.onsubmit({ preventDefault() {} });
  for (const name of children) assert.match(saved, new RegExp(`^${name}: false$`, 'm'));
  state.switches.about.checked = true;
  state.visibilityForm.onchange();
  assert.equal(state.switches.vision.disabled, false);
  assert.equal(state.switches.vision.checked, false);
  assert.equal(state.switches.openings.disabled, true);
  state.switches.admissions.checked = true;
  state.visibilityForm.onchange();
  assert.equal(state.switches.openings.disabled, false);
});
