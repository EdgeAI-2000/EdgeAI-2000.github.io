# 管理后台与 Cloudflare 图片

## 使用方式

访问 `https://eaislab.com/admin/`，使用拥有网站仓库 Write 或更高权限的 GitHub 账号登录。仅向少数管理员授予该权限；加入 GitHub 组织本身不够。沿用现有 OAuth Worker，本项目未包含该 Worker 的源码，需单独验证其 OAuth 应用、回调和组织授权。

可维护新闻、成员、项目、手工论文、专利。内容先保存草稿，再通过 Decap 的编辑工作流发布到 main，等待现有网站部署完成。后台预览不等同于完整网站预览。管理员具有整个仓库的写权限，不提供学生级别的行或字段权限。

手工论文位于 `_publications/manual/`；自动论文位于 `_publications/auto/`，不由本后台编辑，避免下次 Scholar 同步覆盖。新增前检查重复论文。当前论文页面仍保留原有筛选规则，部分未评级论文不会出现在默认列表。

图片字段及 Markdown 编辑器的媒体选择器使用同一个上传窗口：选择用途、选择文件、上传并插入。也可粘贴已有 CDN URL 或 `/assets/...` 路径。上传成功后会验证图片可读取，再回填地址。旧图片保留原路径，无需批量迁移。

## 首次部署（仅一次）

Cloudflare Images 托管存储为付费服务。先检查计费并开通：
https://developers.cloudflare.com/images/pricing/

服务本身及加密密钥不能通过尚未部署的后台创建。首次由部署者完成：

1. 在 `workers/images` 目录登录 Cloudflare 并创建设置存储：

   ```sh
   npx wrangler login
   npx wrangler kv namespace create SETTINGS
   ```

2. 将输出的 namespace ID 填入 `wrangler.jsonc` 的 `kv_namespaces[0].id`。核对 `GITHUB_REPO` 和 `ALLOWED_ORIGINS`；来源必须完全匹配，如有 www 域名可用逗号追加，不能使用通配符。
3. 使用密码管理器生成至少 32 字符的随机加密密钥，安全备份后交互输入：

   ```sh
   npx wrangler secret put SETTINGS_ENCRYPTION_KEY
   npx wrangler deploy
   ```

   此密钥用于加密后台保存的 Images Token。不要写入 Git，也不要随意更换或删除；否则原有加密配置将无法读取。它与用户在后台填写的 Images API Token 不同。
4. 将部署得到的 HTTPS Worker 根地址填入 `admin/config.yml` 的 `media_library.config.endpoint`，不附加 `/upload-url`。发布网站代码。

Account ID、Account Hash 和 Images Token 均可留空，改由后台设置。兼容已有通过 Worker 环境变量配置的账号；后台保存的配置优先。

## 后台日常配置

1. 使用网站仓库 **Admin** 权限账号登录 `/admin/`，点击顶部导航中“媒体”后面的“图片服务设置”，进入独立设置页面。Write 权限可以编辑内容及上传图片，但不能配置服务。
2. 填写 Cloudflare Account ID 和 Images Account Hash（两者不同，在 Images 控制台查找）。
3. 填写限定该账号、具有 Images 编辑权限的 API Token。后台只显示是否已配置，不会返回原始密钥。更换时填写新 Token；留空保留同一账号的已有 Token。切换账号必须提供新 Token。
4. 配置头像、封面和正文图片的宽、高与缩放模式。默认如下，尺寸可设为 1–4096 像素：

   | 名称 | 宽 | 高 | fit |
   | --- | --- | --- | --- |
   | avatar | 600 | 600 | cover（裁剪填满） |
   | cover | 1200 | 675 | cover（裁剪填满） |
   | content | 1600 | 1600 | scale-down（等比缩小） |

5. 点击“验证并保存配置”。服务会检查 Cloudflare 权限，创建或更新三个公开规格，并设置 metadata 为 none。Token 使用 AES-GCM 加密存储在 Cloudflare KV；密钥留在 Worker Secret。配置传播可能需约一分钟。

同名图片规格会被更新，因此也会影响这个 Cloudflare 账号中使用它们的其他图片。规格修改不支持事务回滚：如果中途失败，配置不会保存，但已修改的规格可能生效，修复后重新保存即可。新账号无现有图片时，无法预先交叉验证 Account Hash；上传后的预览检查会阻止插入不可读取的图片地址。

Images 根据浏览器自动协商 WebP / AVIF 等格式，URL 不需要 `.webp` 后缀。不需要开启 flexible variants。

图片接口每次向 GitHub 验证仓库权限，再申请 10 分钟有效的单次上传地址。GitHub Token 仅发送到自有 Worker 和 GitHub；Cloudflare Token 只在保存设置时从管理员浏览器通过 HTTPS 发往自有 Worker，此后只在 Worker 内解密使用。上传文件直接发往 Cloudflare。

当前媒体选择器提供上传及已有地址插入，不提供整库浏览或删除；废弃草稿产生的未引用图片可在 Cloudflare Images 控制台清理。取消内容草稿不会自动删除图片。

## 验收

- 有写权限的管理员能登录、创建草稿、编辑并发布；在对应中英文页面核对新增内容。
- 上传 JPG / PNG，分别选择头像、封面和正文，确认预览及发布页面均显示图片；浏览器网络面板应显示 `imagedelivery.net`，并按浏览器能力返回优化后的图片类型。
- Markdown 正文插图也应走同一媒体选择器；既有 `/assets/` 图片继续显示。
- 只读或无效 GitHub Token 无法申请上传地址；非允许来源被拒绝。
- 未配置图片 endpoint 时窗口明确提示配置缺失，不会把原图静默写入 GitHub。
- 运行 `node --test tests/*.test.mjs`，以及 `bundle exec jekyll build`。

本地已安装的 Ruby 3.0 与仓库锁文件的部分依赖版本不兼容时，可以用现有 Jekyll 验证页面：

```sh
JEKYLL_NO_BUNDLER_REQUIRE=true jekyll build --destination /tmp/eais-admin-site
```

这是本地备用验证方式，不代表锁文件依赖已验证。上线需要实际验证 GitHub OAuth、Cloudflare 图片上传和网站发布全链路。

## 维护注意

Decap 固定为 3.16.3。图片插件读取该版本的 `decap-cms-user` 本地会话以复用登录；升级 Decap 时须重新验证会话存储结构与媒体接口。现有 GitHub OAuth Worker 不因图片服务部署而更改。
