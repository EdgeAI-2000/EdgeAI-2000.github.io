const variants = {
  avatar: { width: 600, height: 600, fit: 'cover', metadata: 'none' },
  cover: { width: 1200, height: 675, fit: 'cover', metadata: 'none' },
  content: { width: 1600, height: 1600, fit: 'scale-down', metadata: 'none' },
};

async function encryptionKey(env) {
  if (!env.SETTINGS_ENCRYPTION_KEY || env.SETTINGS_ENCRYPTION_KEY.length < 32) throw new Error('Missing encryption key');
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(env.SETTINGS_ENCRYPTION_KEY));
  return crypto.subtle.importKey('raw', hash, 'AES-GCM', false, ['encrypt', 'decrypt']);
}

async function readSettings(env) {
  const stored = env.SETTINGS && await env.SETTINGS.get('cloudflare', 'json');
  if (!stored) return { accountId: env.CF_ACCOUNT_ID || '', accountHash: env.CF_IMAGES_HASH || '', token: env.CF_IMAGES_TOKEN || '', variants };
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: new Uint8Array(stored.iv) }, await encryptionKey(env), new Uint8Array(stored.token));
  return { accountId: stored.accountId, accountHash: stored.accountHash, token: new TextDecoder().decode(plain), variants: stored.variants || variants };
}

async function saveSettings(env, settings) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, await encryptionKey(env), new TextEncoder().encode(settings.token));
  await env.SETTINGS.put('cloudflare', JSON.stringify({ accountId: settings.accountId, accountHash: settings.accountHash, variants: settings.variants, iv: [...iv], token: [...new Uint8Array(encrypted)] }));
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin');
    const allowed = (env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim());
    const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', Vary: 'Origin' };
    const reply = (status, data) => new Response(JSON.stringify(data), { status, headers });
    if (!origin || !allowed.includes(origin)) return reply(403, { error: '不允许此来源。' });
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Headers'] = 'Authorization, Content-Type';
    headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
    const path = new URL(request.url).pathname;
    if (!['/upload-url', '/settings'].includes(path)) return reply(404, { error: '接口不存在。' });
    if (request.method !== 'POST' && !(path === '/settings' && request.method === 'GET')) return reply(405, { error: '不支持此请求方法。' });
    const authorization = request.headers.get('Authorization') || '';
    if (!/^Bearer \S+$/.test(authorization)) return reply(401, { error: '请先登录后台。' });
    if (!env.GITHUB_REPO) return reply(503, { error: '图片服务尚未配置内容仓库。' });
    let input;
    if (request.method === 'POST') {
      try { input = await request.json(); } catch { return reply(400, { error: '请求格式不正确。' }); }
    }
    if (path === '/upload-url' && !Object.hasOwn(variants, input?.variant)) return reply(400, { error: '请选择有效图片尺寸。' });
    try {
      const github = await fetch(`https://api.github.com/repos/${env.GITHUB_REPO}`, {
        headers: { Authorization: authorization, Accept: 'application/vnd.github+json', 'User-Agent': 'eais-images', 'X-GitHub-Api-Version': '2022-11-28' },
      });
      if (github.status === 401) return reply(401, { error: '登录已过期，请重新登录。' });
      if (!github.ok) return reply(403, { error: '无法验证仓库权限，请检查账号及 GitHub 授权。' });
      const repo = await github.json();
      if (!repo.permissions?.push) return reply(403, { error: '需要网站仓库的写权限。' });
      let settings = await readSettings(env);
      if (path === '/settings') {
        // Repository admins configure billing credentials; writers can only upload.
        if (!repo.permissions?.admin) return reply(403, { error: '修改或查看服务配置需要仓库 Admin 权限。' });
        if (request.method === 'GET') return reply(200, {
          accountId: settings.accountId, accountHash: settings.accountHash,
          tokenConfigured: Boolean(settings.token), editable: Boolean(env.SETTINGS && env.SETTINGS_ENCRYPTION_KEY),
          variants: settings.variants,
        });
        if (!env.SETTINGS || !env.SETTINGS_ENCRYPTION_KEY) return reply(503, { error: '请先部署设置存储和加密密钥。' });
        if (!/^[a-f0-9]{32}$/i.test(input?.accountId || '') || !/^[a-zA-Z0-9_-]+$/.test(input?.accountHash || '')) return reply(400, { error: '请填写有效的 Account ID 和 Images Account Hash。' });
        if (input.token !== undefined && typeof input.token !== 'string') return reply(400, { error: '密钥格式不正确。' });
        // A blank token may only reuse credentials for the same account.
        const token = input.token?.trim() || (input.accountId === settings.accountId ? settings.token : '');
        if (!token) return reply(400, { error: '请填写 Cloudflare Images API Token。' });
        const configuredVariants = {};
        for (const id of Object.keys(variants)) {
          const value = input.variants?.[id] || settings.variants[id];
          if (!Number.isInteger(value?.width) || !Number.isInteger(value?.height) || value.width < 1 || value.height < 1 || value.width > 4096 || value.height > 4096 || !['cover', 'scale-down'].includes(value.fit)) {
            return reply(400, { error: '图片规格须为 1–4096 像素，模式须为裁剪或等比缩小。' });
          }
          configuredVariants[id] = { width: value.width, height: value.height, fit: value.fit, metadata: 'none' };
        }
        settings = { accountId: input.accountId, accountHash: input.accountHash, token, variants: configuredVariants };
        await encryptionKey(env);
        const base = `https://api.cloudflare.com/client/v4/accounts/${settings.accountId}/images/v1`;
        const cfHeaders = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
        const existing = await fetch(`${base}/variants`, { headers: cfHeaders });
        const result = await existing.json();
        if (!existing.ok || !result.success) return reply(400, { error: 'Cloudflare 验证失败，请检查账号、Images 服务及 Token 权限。' });
        // Verify the delivery hash against an existing image when one is available.
        const images = await fetch(`${base}?per_page=1`, { headers: cfHeaders });
        const imageResult = await images.json();
        if (!images.ok || !imageResult.success) return reply(400, { error: '无法验证 Images 账号，请检查 Token 权限。' });
        const sampleURL = imageResult.result?.images?.[0]?.variants?.[0];
        if (sampleURL && new URL(sampleURL).pathname.split('/')[1] !== settings.accountHash) return reply(400, { error: 'Images Account Hash 与该账号不匹配。' });
        for (const [id, options] of Object.entries(settings.variants)) {
          const exists = Object.hasOwn(result.result?.variants || {}, id);
          const response = await fetch(`${base}/variants${exists ? `/${id}` : ''}`, {
            method: exists ? 'PATCH' : 'POST', headers: cfHeaders,
            body: JSON.stringify({ ...(exists ? {} : { id }), options, neverRequireSignedURLs: true }),
          });
          const variant = await response.json();
          if (!response.ok || !variant.success) return reply(502, { error: `图片规格 ${id} 设置失败；部分规格可能已更新，请重试。` });
        }
        await saveSettings(env, settings);
        return reply(200, { saved: true, tokenConfigured: true, message: '配置已加密保存，三种图片规格已初始化。配置同步可能需要约一分钟。' });
      }
      if (!settings.accountId || !settings.accountHash || !settings.token) return reply(503, { error: '请管理员先在后台完成图片服务配置。' });
      const body = new FormData();
      body.set('requireSignedURLs', 'false');
      body.set('expiry', new Date(Date.now() + 10 * 60 * 1000).toISOString());
      const cloudflare = await fetch(`https://api.cloudflare.com/client/v4/accounts/${settings.accountId}/images/v2/direct_upload`, {
        method: 'POST', headers: { Authorization: `Bearer ${settings.token}` }, body,
      });
      const data = await cloudflare.json();
      if (!cloudflare.ok || !data.success || !data.result?.uploadURL || !data.result?.id) return reply(502, { error: '无法创建图片上传地址，请检查 Cloudflare Images 配置。' });
      return reply(200, {
        uploadURL: data.result.uploadURL,
        deliveryURL: `https://imagedelivery.net/${settings.accountHash}/${data.result.id}/${input.variant}`,
      });
    } catch {
      return reply(502, { error: '图片服务暂时不可用，请检查服务端配置后重试。' });
    }
  },
};
