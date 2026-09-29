/* Decap 3.16.3 stores its GitHub session in decap-cms-user. Recheck on upgrades. */
CMS.registerMediaLibrary({
  name: 'cloudflare_images',
  init({ options, handleInsert }) {
    if (typeof window !== "undefined" && window.EAISCreateSettings) window.EAISCreateSettings(options.config?.endpoint);
    const dialog = document.createElement('dialog');
    dialog.setAttribute('aria-label', '图片上传');
    dialog.style.cssText = 'width:min(520px,90vw);border:1px solid #ccc;border-radius:12px;padding:24px;z-index:99999';
    dialog.innerHTML = `
      <h2>上传图片</h2>
      <p>图片会自动优化，并通过 CDN 分发。支持 JPG、PNG、WebP、GIF，最大 10 MB。</p>
      <p><label>用途 <select id="cf-variant">
        <option value="content">正文</option>
        <option value="avatar">头像</option>
        <option value="cover">封面</option>
      </select></label></p>
      <p><input id="cf-file" type="file" aria-label="选择图片" accept="image/jpeg,image/png,image/webp,image/gif"></p>
      <button id="cf-upload" type="button">上传并插入</button>
      <hr>
      <p><label>或使用已有图片地址 <input id="cf-url" type="text" placeholder="https://… 或 /assets/…" style="width:100%"></label></p>
      <button id="cf-insert" type="button">插入已有图片</button>
      <button id="cf-close" type="button">取消</button>
      <p id="cf-status" role="status" aria-live="polite"></p>`;
    document.body.appendChild(dialog);
    const find = id => dialog.querySelector(`#cf-${id}`);
    const status = message => { find('status').textContent = message; };
    let busy = false;
    const close = () => { if (!busy) dialog.close(); };
    find('close').onclick = close;
    dialog.addEventListener('cancel', event => { if (busy) event.preventDefault(); });
    find('insert').onclick = () => {
      const url = find('url').value.trim();
      if (!/^https:\/\/[^\s]+$/.test(url) && !/^\/(?!\/)[^\s]+$/.test(url)) {
        status('请输入 HTTPS 图片地址或站内图片路径。');
        return;
      }
      handleInsert(url);
      close();
    };
    find('upload').onclick = async () => {
      const endpoint = options.config?.endpoint?.replace(/\/$/, '');
      if (!endpoint || !endpoint.startsWith('https://')) {
        status('管理员需先配置 Cloudflare 图片服务。已有图片地址仍可使用。');
        return;
      }
      const file = find('file').files[0];
      if (!file || !['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type) || file.size > 10 * 1024 * 1024) {
        status('请选择不超过 10 MB 的 JPG、PNG、WebP 或 GIF 图片。');
        return;
      }
      busy = true;
      dialog.querySelectorAll('button, input, select').forEach(el => { el.disabled = true; });
      status('正在上传和处理图片…');
      try {
        const user = JSON.parse(localStorage.getItem('decap-cms-user') || 'null');
        if (user?.backendName !== 'github' || !user.token) throw new Error('请先使用 GitHub 登录后台。');
        const response = await fetch(`${endpoint}/upload-url`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${user.token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ variant: find('variant').value }),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || '无法获取上传地址。');
        const body = new FormData();
        body.append('file', file);
        const upload = await fetch(result.uploadURL, { method: 'POST', body });
        const uploaded = await upload.json();
        if (!upload.ok || !uploaded.success) throw new Error('图片上传失败，请检查图片尺寸或稍后重试。');
        // Verify the configured variant resolves before saving a broken image URL.
        await new Promise((resolve, reject) => {
          const preview = new Image();
          preview.onload = resolve;
          preview.onerror = () => reject(new Error('图片已上传，但无法读取，请检查 Cloudflare 图片规格配置。'));
          preview.src = result.deliveryURL;
        });
        handleInsert(result.deliveryURL);
        dialog.close();
      } catch (error) {
        status(error.message || '上传失败，请稍后重试。');
      } finally {
        busy = false;
        dialog.querySelectorAll('button, input, select').forEach(el => { el.disabled = false; });
      }
    };
    return {
      show() {
        status('');
        find('file').value = '';
        find('url').value = '';
        dialog.showModal();
      },
      hide: close,
      enableStandalone: () => true,
    };
  },
});
