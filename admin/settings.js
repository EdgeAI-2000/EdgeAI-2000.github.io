window.EAISCreateSettings = function (endpoint) {
  endpoint = endpoint?.replace(/\/$/, '');
  const route = '#/image-settings';
  const item = document.createElement('li');
  item.hidden = true;
  const link = document.createElement('a');
  link.href = route;
  link.textContent = '图片服务设置';
  item.append(link);
  const page = document.createElement('main');
  page.id = 'eais-image-settings';
  page.hidden = true;
  page.innerHTML = `
    <h1>图片服务设置</h1>
    <p>仅网站仓库管理员可配置。密钥加密保存在服务端，不会写入网站内容。</p>
    <form>
      <p><label>Cloudflare Account ID<br><input name="accountId" required pattern="[a-fA-F0-9]{32}" style="width:100%" autocomplete="off"></label></p>
      <p><label>Images Account Hash<br><input name="accountHash" required pattern="(?:[a-zA-Z0-9_]|-)+" style="width:100%" autocomplete="off"></label></p>
      <p>以上两项可在 Cloudflare Images 控制台找到；Account Hash 来自图片分发地址。</p>
      <p><label>Images API Token<br><input name="token" type="password" style="width:100%" autocomplete="new-password" placeholder="首次必填；留空保留已有密钥"></label></p>
      <p data-token-status></p>
      <p>Token 需要该账号的 Images 编辑权限。请先在 Cloudflare 开通 Images 托管存储。</p>
      <fieldset><legend>图片规格（像素）</legend>
      ${[['avatar', '头像'], ['cover', '封面'], ['content', '正文']].map(([id, label]) => `
        <p>${label}
          <label>宽 <input name="${id}-width" type="number" min="1" max="4096" required style="width:75px"></label>
          <label>高 <input name="${id}-height" type="number" min="1" max="4096" required style="width:75px"></label>
          <select name="${id}-fit" aria-label="${label}缩放模式"><option value="cover">裁剪填满</option><option value="scale-down">等比缩小</option></select>
        </p>`).join('')}
      </fieldset>
      <p>保存时自动创建或更新以上公开规格。分发时自动优化格式，并移除 EXIF 信息。</p>
      <p>若该账号已有同名 avatar、cover、content 规格，保存会更新它们。</p>
      <button type="submit">验证并保存配置</button>
    </form>
    <p data-status role="status" aria-live="polite"></p>`;
  document.body.append(page);
  const form = page.querySelector('form');
  const status = page.querySelector('[data-status]');
  const tokenStatus = page.querySelector('[data-token-status]');
  const field = name => form.elements.namedItem(name);
  let busy = false;
  const lock = value => {
    busy = value;
    form.querySelectorAll('input, select, button').forEach(element => { element.disabled = value; });
  };
  let allowed = false;
  let active = false;
  let pageVersion = 0;
  // Decap 3.16.3 has no custom-page API. Keep its header and replace only the
  // route content while our hash route is active; all native routes stay intact.
  function renderRoute() {
    const nav = document.querySelector('#nc-root header nav ul');
    if (nav && item.parentElement !== nav) {
      const nativeLink = nav.querySelector('a');
      link.className = `${nativeLink?.className.replace('header-link-active', '') || ''} eais-settings-link`;
      nav.append(item);
    }
    item.hidden = !allowed;
    const showing = Boolean(allowed && sessionToken() && nav && window.location.hash.replace(/\/$/, '') === route);
    document.body.classList.toggle('eais-settings-route', showing);
    page.hidden = !showing;
    if (showing) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
    if (showing && !active) {
      active = true;
      loadSettings();
    } else if (!showing && active) {
      active = false;
      pageVersion++;
      field('token').value = '';
    }
  }
  async function api(method, body) {
    if (!endpoint?.startsWith('https://')) throw new Error('首次使用需部署图片服务，并在网站配置中填写其地址。');
    const user = JSON.parse(localStorage.getItem('decap-cms-user') || 'null');
    if (user?.backendName !== 'github' || !user.token) throw new Error('请先使用 GitHub 管理员账号登录。');
    const response = await fetch(`${endpoint}/settings`, {
      method, headers: { Authorization: `Bearer ${user.token}`, 'Content-Type': 'application/json' },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || '图片配置服务不可用。');
    return result;
  }
  async function loadSettings() {
    const version = ++pageVersion;
    form.reset();
    tokenStatus.textContent = '';
    status.textContent = '正在读取配置…';
    lock(true);
    try {
      const result = await api('GET');
      if (version !== pageVersion || !active) return;
      field('accountId').value = result.accountId;
      field('accountHash').value = result.accountHash;
      for (const [id, variant] of Object.entries(result.variants)) {
        for (const name of ['width', 'height', 'fit']) field(`${id}-${name}`).value = variant[name];
      }
      tokenStatus.textContent = result.tokenConfigured ? '密钥已配置（不显示原值）。' : '尚未配置密钥。';
      status.textContent = result.editable ? '' : '服务端尚未启用设置存储，请完成首次部署。';
      lock(false);
      form.querySelector('[type=submit]').disabled = !result.editable;
    } catch (error) {
      if (version !== pageVersion || !active) return;
      status.textContent = error.message;
      lock(false);
      form.querySelector('[type=submit]').disabled = true;
    }
  };
  form.onsubmit = async event => {
    event.preventDefault();
    if (!active || !allowed || !sessionToken() || busy || !form.reportValidity()) return;
    const version = pageVersion;
    const payload = { accountId: field('accountId').value.trim(), accountHash: field('accountHash').value.trim(), token: field('token').value.trim() };
    payload.variants = Object.fromEntries(['avatar', 'cover', 'content'].map(id => [id, {
      width: Number(field(`${id}-width`).value), height: Number(field(`${id}-height`).value), fit: field(`${id}-fit`).value,
    }]));
    lock(true);
    status.textContent = '正在验证账号并初始化图片规格…';
    try {
      const result = await api('POST', payload);
      if (version !== pageVersion || !active) return;
      field('token').value = '';
      tokenStatus.textContent = '密钥已配置（不显示原值）。';
      status.textContent = result.message;
    } catch (error) {
      if (version === pageVersion && active) status.textContent = error.message;
    } finally {
      payload.token = '';
      if (version === pageVersion) {
        field('token').value = '';
        lock(false);
      }
    }
  };
  // Decap has no public login/logout event; observe its pinned session format.
  function sessionToken() {
    try {
      const user = JSON.parse(localStorage.getItem('decap-cms-user') || 'null');
      return user?.backendName === 'github' && typeof user.token === 'string' ? user.token : '';
    } catch { return ''; }
  }
  let checkedToken;
  let authVersion = 0;
  async function syncAccess(force = false) {
    const token = sessionToken();
    const sessionChanged = token !== checkedToken;
    if (!force && !sessionChanged) return;
    checkedToken = token;
    const version = ++authVersion;
    // Rechecking the same session must not unmount the page or reset its draft.
    if (sessionChanged) {
      allowed = false;
      field('token').value = '';
      renderRoute();
    }
    if (!token) return;
    try {
      const response = await fetch('https://api.github.com/repos/EdgeAI-2000/EdgeAI-2000.github.io', {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' },
      });
      const repository = response.ok ? await response.json() : null;
      if (version === authVersion && token === sessionToken()) {
        allowed = Boolean(repository?.permissions?.push && repository.permissions.admin);
        renderRoute();
      }
    } catch { /* Keep the settings entry hidden until access can be verified. */ }
  }
  const observer = new MutationObserver(renderRoute);
  observer.observe(document.getElementById('nc-root') || document.body, { childList: true, subtree: true });
  window.addEventListener('hashchange', renderRoute);
  syncAccess();
  window.addEventListener('storage', () => syncAccess());
  window.addEventListener('focus', () => syncAccess(true));
  window.setInterval(syncAccess, 1000);

};
