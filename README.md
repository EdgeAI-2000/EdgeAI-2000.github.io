# EAIS LAB 实验室官网

## 项目概况

- 项目：EAIS LAB 边缘智能实验室中英文官网。
- 用途：以静态页面展示实验室介绍、研究方向、成员与校友、论文、新闻、专利、招生及资源；内容由 Markdown 集合和 `_data/` 数据维护。仓库提供静态管理后台页面，认证和图片服务由外部 Worker 提供。
- 仓库：[EdgeAI-2000/EdgeAI-2000.github.io](https://github.com/EdgeAI-2000/EdgeAI-2000.github.io)，后台目标分支为 `main`。
- 自定义域名：`CNAME` 配置为 `eaislab.com`；后台站点地址为 `https://eaislab.com`。
- `_config.yml` 的 `url` 仍为 `https://edgeai-2000.github.io`，`baseurl` 为空；维护 SEO、规范链接和站点地图时应核对这一配置与自定义域名的关系。
- 中文首页 `/zh/`，英文首页 `/en/`；根路径 `/` 的源码使用 HTML 跳转到英文首页，尽管全局 `lang` 为 `zh`。
- 研究方向：多智能体协同感知、边缘大模型推理与部署、代理式人工智能。
- 项目展示：EdgeCoSense 协同感知平台、EdgeModelBridge 大小模型协同引擎、EdgeAgentWorks 边缘多智能体应用平台。

## 技术组成

| 部分 | 当前源码配置 |
| --- | --- |
| 静态站点 | Jekyll、Liquid、Markdown、YAML front matter |
| 前端 | HTML、CSS、原生 JavaScript；主样式为 `assets/css/style.css`，表情脚本为 `assets/js/mascot.js` |
| Ruby | `.ruby-version` 指定 `3.2.0` |
| 锁定依赖 | GitHub Pages `232`、Jekyll `3.10.0`、Minima `2.5.1`、Bundler `2.7.2` |
| 站点插件 | SEO、sitemap、feed、titles-from-headings |
| 内容后台 | Decap CMS `3.16.3`，GitHub 登录与编辑工作流 |
| 图片服务 | Cloudflare Worker + Images + KV，独立于静态站点 |
| 论文同步 | Python、requests、PyYAML、scholarly，可使用 SerpAPI |
| 自动化测试 | Node.js 内置测试运行器 |

版本信息来自仓库文件，不代表服务器当前运行时版本已经验证。

## 目录与内容来源

| 路径 | 用途 |
| --- | --- |
| `_config.yml`、`Gemfile`、`Gemfile.lock` | 站点配置及 Ruby 依赖 |
| `index.md`、`zh/`、`en/` | 根路径跳转、中英文页面及英文详情入口 |
| `_people/` | 成员统一记录，包含中英文资料 |
| `en/people/`、`en/news/` | 引用统一成员、新闻记录的英文详情入口 |
| `_publications/auto/` | Scholar 同步输出；当前也存在 `source: manual` 的记录 |
| `_publications/manual/` | 后台配置的手工论文目录，当前检查时尚未创建 |
| `_themes/`、`_projects/` | 研究方向、项目介绍 |
| `_news/`、`_patents/` | 新闻、专利；部分目录包含下划线开头的模板 |
| `_data/nav/` | 中英文导航 |
| `_data/page_visibility.yml` | 中英文共用的页面显示开关 |
| `_data/scholar.yml` | Scholar 作者与同步数量配置 |
| `_data/member_submission.yml`、`assets/data/member-profiles.json` | 成员资料提交入口配置、从 `site.people` 生成 JSON 的 Liquid 模板（不是独立成员数据源） |
| `_data/venue_aliases.yml`、`_data/venue_ranks.yml` | 期刊会议别名和评级映射 |
| `_data/brand.json`、`_data/mascots.json` | 品牌图片 CDN 地址及表情视口配置 |
| `_data/` 的其他文件 | 经费、愿景、公告、组会、友情链接等结构化内容 |
| `_layouts/`、`_includes/` | 页面布局、导航、页脚、语言切换、吉祥物组件 |
| `assets/` | CSS、JavaScript、本地图片与品牌备份 |
| `admin/` | 后台入口、内容配置、图片上传插件和设置页面 |
| `workers/images/` | 图片服务 Worker 与 Wrangler 配置 |
| `scripts/scholar_sync.py` | 论文抓取与 Markdown 生成脚本 |
| `.github/workflows/scholar_sync.yml` | 定时论文同步工作流 |
| `CNAME` | GitHub Pages 自定义域名配置 |
| `tests/` | 图片服务、媒体选择器、设置访问测试 |
| `docs/admin-setup.md` | 后台权限、图片服务部署、配置与验收说明 |
| `docs/brand-identity.md` | 品牌资源来源、更新和视觉检查说明 |
| `_site/` | 已跟踪的构建输出，不作为内容编辑入口；`vendor/` 和 `.sass-cache/` 为可能产生的本地依赖和缓存目录 |

截至本次源码核对（2026-10-13），共有 43 份成员记录、89 份 `auto` 论文记录、3 个研究方向、3 个项目、2 条新闻、4 项专利；统计排除了下划线开头的模板，**不等于网站实际显示数量**。

## 本地运行与验证

在本地仓库根目录操作，先准备 `.ruby-version` 指定的 Ruby 3.2.0 与锁定的 Bundler；无需服务器固定路径、SSH 转发或 npm 构建步骤：

```sh
cd EdgeAI-2000.github.io
gem install bundler -v 2.7.2
bundle install
bundle exec jekyll serve --host 127.0.0.1 --port 4000 --destination /tmp/eais-lab-preview
```

浏览器访问 `http://127.0.0.1:4000/zh/` 或 `http://127.0.0.1:4000/en/`；根路径跳转到英文首页。配置文件更改后重启预览。本地静态预览不代表外部 OAuth、图片上传或成员资料服务可用。

构建与已有测试：

```sh
bundle exec jekyll build --destination /tmp/eais-lab-preview
node --test tests/*.test.mjs
```

使用临时输出目录可以避免覆盖已跟踪的 `_site/`。测试需另行准备 Node.js，使用内置测试运行器和 `fetch`、`Request`、`Response` 等 API，覆盖图片 Worker、媒体选择器和设置权限；不代替整站构建或线上验收。`docs/admin-setup.md` 另有旧 Ruby 环境下的备用构建方法，但该方法不能证明锁定依赖可正常安装。

## 日常内容维护

### 成员与中英文页面

成员资料统一写入 `_people/<slug>.md`。新增时可参考 `_people/kang-ling-wen.md` 等现有记录；更新时保留原文件名，避免改变详情页地址。主要字段：

- `name` / `name_en`、`bio_zh` / `bio_en`、`research_areas` / `research_areas_en`、`affiliation` / `affiliation_en`：中英文资料。
- `role`、`status`、`period`：角色、在读/校友状态和分组时间；现有记录还使用 `entry_year`、`graduation_year`。`_layouts/people.html` 当前展示的在读角色为 `pi`、`faculty`、`postdoc`、`phd`、`master`、`undergrad`、`engineer`，`status` 使用 `current` 或 `alumni`；后台虽提供 `ra` 选项，列表当前没有该在读分组。
- `avatar`、`style_photo`、`email`、`homepage`、`scholar`、`dblp`、`github`：图片及联系链接；链接使用完整 HTTP(S) 地址。个人页只在有效字段存在时显示相应联系入口。
- `destination` / `destination_en`、`thesis_title` / `thesis_title_en`：校友去向和学位论文资料。

中文详情页为 `/people/<slug>/`。新增成员还应建立 `en/people/<slug>.md`，英文入口引用同一份资料，不复制简介正文：

```yaml
---
layout: person
lang: en
person_slug: example-member
title: Example Member
permalink: /en/people/example-member/
---
```

资料页布局为 `_layouts/person.html`，成员列表布局为 `_layouts/people.html`。修改后核对中英文成员列表及两版详情页；角色和状态会影响分组，不能只确认文件已保存。

`_data/member_submission.yml` 当前启用 `https://services.eaislab.com/member-profile/` 入口；`_includes/member-submission.html` 展示登录、审核后发布的提示。此仓库配置入口，不包含该外部服务的后端源码；服务运行和审核结果需独立核验。

### 手工论文

后台的“手工论文”集合写入 `_publications/manual/`；该目录当前尚未创建。直接维护时，在该目录新增 `<year>-<slug>.md`，例如：

```yaml
---
title: "Example Paper"
authors:
  - 示例作者
year: 2026
venue: "IEEE Transactions on Mobile Computing"
type: journal
source: manual
---
```

使用整数 `year`、作者列表和实际 venue；`type` 可为 `conference`、`journal` 或 `preprint`，可选字段包括 `pdf`、`code`、`ccf` 和 Markdown 正文。中英文论文列表共用 `site.publications`，不需要另建英文入口。新增前搜索 `_publications/` 中的标题，避免与自动同步记录重复。

`_layouts/publications.html` 仅列出 **2020 年及以后**且 venue 能从 `_data/venue_ranks.yml` 匹配到 CAS 或 CCF 评级的论文，`_data/venue_aliases.yml` 用于 venue 展示名称归一化。仅填写论文的 `ccf` 字段并不能绕过列表筛选；未显示时检查年份和评级表匹配，而不是反复新增同一论文。

### 论文同步与展示

`_data/scholar.yml` 当前包含两个作者档案，`max_per_author: 100`。脚本优先在环境变量存在 `SERPAPI_API_KEY` 时使用 SerpAPI；未取到结果则回退到 scholarly。虽然配置写有 `prefer_serpapi`，当前脚本主逻辑实际依据密钥是否存在选择 SerpAPI。

GitHub Actions 每天 **02:17 UTC / 北京时间 10:17** 运行，也支持手动触发。流程安装 Python 3.11 与依赖，执行同步、检查输出非空，然后直接提交并推送论文更新；没有创建审核 PR 的步骤。SerpAPI 密钥应配置在仓库 Actions Secret 中。

手动执行方法：

```sh
python3 -m venv /tmp/eais-scholar-venv
. /tmp/eais-scholar-venv/bin/activate
python -m pip install requests pyyaml scholarly
python scripts/scholar_sync.py
```

**执行前检查 Git 差异并备份需要保留的内容。** `scripts/scholar_sync.py` 的 `ensure_output()` 会先删除 `_publications/auto/*.md`，再抓取并按年份和标题生成文件；不仅覆盖同名文件，抓取失败时也可能留下空目录。当前 `auto` 中有 `source: manual` 的记录，该字段不能保护文件免于删除；需要长期保留的手工论文应维护在 `manual` 目录，并检查重复记录。脚本不清理 `manual`。

工作流会拒绝零文件结果，但没有恢复删除文件的步骤；其提交命令为 `git add _publications/auto/*.md`，需额外检查未重新生成文件的删除是否已暂存，不能把工作流成功等同于整个目录完整同步。

### 新闻与英文详情

在 `_news/` 新建 `YYYY-MM-DD-<slug>.md`，或更新现有记录。可参考 `_template-paper.md`、`_template-award.md` 的字段，实际双语详情以 `_news/2026-09-29-wei-quanmin-tmc-paper-accepted.md` 为例：

- 填写 `title`、`title_en`、`lang: zh`、`date: YYYY-MM-DD`、`type`、`summary`、`summary_en`；`type` 使用 `news`、`award` 或 `press`。可选 `cover`、`authors`、`venue`、`link`。
- 使用 `layout: news`，在 front matter 的 `content_en: |` 中填写英文 Markdown 正文，在 front matter 后填写中文 Markdown 正文。旧模板未指定此布局，`_config.yml` 默认使用 `detail`，因此复制模板后需要补齐双语详情字段。
- 新建 `en/news/<同名文件>.md`，引用中文记录 URL；参考下面的英文入口，不复制新闻正文。

```yaml
---
layout: news
lang: en
title: Example News
news_url: /news/2026-10-13-example-news/
permalink: /en/news/2026-10-13-example-news/
---
```

`zh/news.md`、`en/news.md` 使用 `_layouts/list.html` 按日期倒序展示同一新闻集合。英文列表和首页仅在 `content_en` 存在时链接到 `/en/news/.../`，因此必须同时创建对应英文入口；否则会出现失效链接。核对 `/zh/news/`、`/en/news/`、首页及两版详情页。后台新闻表单当前没有 `content_en` 字段，也没有创建英文入口的集合，需要在仓库中补齐。

### 页面显示

当前 `_data/page_visibility.yml` 中 `projects: false`，其余已列开关为 `true`，包括 `news: true`。现有后台说明中的 News 默认关闭描述不代表当前配置。

开关影响导航、首页板块及相关入口；隐藏页面的原 URL 仍可访问，不能用于权限控制。后台页面设置由仓库 Admin 保存，直接更新 `main`，不经过内容草稿发布流程。

## 内容后台与图片服务

- 后台入口：`https://eaislab.com/admin/`。
- 仓库 Write 或更高权限可维护内容与上传图片；Admin 才能配置图片服务及保存页面显示设置。仅加入 GitHub 组织不足以获得编辑权限。
- 内容采用 Decap `editorial_workflow`：保存草稿后发布至 `main`，等待网站部署完成。
- OAuth 地址配置为 `https://eais-cms-oauth.neardws.workers.dev`，认证路径 `/oauth`；此 OAuth Worker 源码不在当前项目中。
- 图片 Worker 地址配置为 `https://eais-cms-images.neardws.workers.dev`，源码位于 `workers/images/worker.mjs`；Wrangler 服务名为 `eais-cms-images`，KV 绑定为 `SETTINGS`。
- 当前允许上传服务来源为 `https://eaislab.com`；增加其他域名或进行本地上传调试时，需明确配置对应来源。
- 后台保存的 Images Token 经 AES-GCM 加密写入 KV，`SETTINGS_ENCRYPTION_KEY` 存在 Worker Secret 中；Token 与加密密钥不要写入仓库或 README。
- 默认规格：头像 `600×600 / cover`，封面 `1200×675 / cover`，正文 `1600×1600 / scale-down`。
- 媒体选择器支持上传或插入已有 CDN、本地资源地址，不提供整个图片库的浏览和删除。取消草稿不会自动删除已上传图片。

首次部署、权限配置、换账号与验收步骤见 [后台与图片服务说明](docs/admin-setup.md)。配置中已存在 endpoint 与 KV 标识，不能仅凭文件断定服务当前可用，勿重复初始化或随意轮换加密密钥。

## 品牌维护

品牌原始资源来自 [EdgeAI-2000/logos](https://github.com/EdgeAI-2000/logos/tree/main/eais-lab)。页面读取 `_data/brand.json` 中的 Cloudflare Images 地址；`assets/images/brand/` 保留本地备份。表情组件通过 `_data/mascots.json` 与共享表情图实现。修改资源与 CDN 后按 [品牌维护说明](docs/brand-identity.md) 检查桌面、390px 和 320px 页面及图片透明区域。

## GitHub Pages 部署

- 发布源是仓库根目录的 Jekyll 源码：`_config.yml`、各内容集合、`zh/`、`en/` 和 `assets/`。`admin/config.yml` 将内容发布目标设为 `main`；`docs/admin-setup.md` 描述更新 `main` 后等待 GitHub Pages 部署。不要把 `_site/` 当作日常内容源。
- 部署前在仓库 **Settings → Pages** 核对发布方式、分支和目录；若使用分支源码构建，应与 `main` 的根目录配置一致。本仓库仅包含 Scholar 同步 workflow，没有自定义 Pages 构建/部署 workflow；文件本身不能证明 Pages 后台当前设置或线上部署状态。
- 自定义域名文件 `CNAME` 内容为 `eaislab.com`，后台 `site_url` / `display_url` 也使用此域名；但 `_config.yml` 的 `url` 为 `https://edgeai-2000.github.io`。上线前核对 Pages 域名、DNS、HTTPS 与生成页面的规范链接/站点地图，不应把配置文件视为域名已经生效的证明。
- 常规发布：本地检查 Markdown/YAML 和构建输出 → 审核源码差异 → 合并内容到 `main`（或通过 Decap 发布）→ 检查 GitHub Pages 构建/部署结果 → 在目标域名核对中英文页面。Scholar workflow 的成功只证明其同步步骤完成，不单独证明网站已经重新部署。
- Jekyll 的 `exclude` 当前排除 `README.md`、`node_modules`、`vendor`、`scripts`、`workers`、`tests`、`docs`；图片 Worker 不由 GitHub Pages 部署，独立部署说明见 `docs/admin-setup.md`。OAuth 和成员资料服务也需独立验证。

## 维护注意事项

1. 内容更新前后检查 Git 差异，避免将生成目录和运行时文件一并提交；本地预览和构建建议使用上述临时输出目录。
2. 当前 `.gitignore` 只忽略 `.DS_Store`、图片 Worker 的 `.dev.vars` 与 `.wrangler/`；`_site/` 中已有跟踪文件，不能假定生成产物会自动被忽略。
3. 如在本地添加代理上下文、运行记录或其他内部文件，先核对 `_config.yml` 的排除列表和实际构建输出，避免将它们作为站点资源发布；不要沿用旧环境的目录状态作为当前证据。
4. 本 README 根据仓库源码核对；依赖安装、构建成功、外部服务可用、GitHub Pages 部署成功和线上页面验收是不同检查项，不能相互替代。
