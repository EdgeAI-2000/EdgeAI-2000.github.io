# EAIS LAB 实验室官网

## 项目概况

- 项目：EAIS LAB 边缘智能实验室中英文官网。
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
| `_publications/auto/` | Scholar 同步输出；当前也存在 `source: manual` 的记录 |
| `_publications/manual/` | 后台配置的手工论文目录，当前检查时尚未创建 |
| `_themes/`、`_projects/` | 研究方向、项目介绍 |
| `_news/`、`_patents/` | 新闻、专利；部分目录包含下划线开头的模板 |
| `_data/nav/` | 中英文导航 |
| `_data/page_visibility.yml` | 中英文共用的页面显示开关 |
| `_data/scholar.yml` | Scholar 作者与同步数量配置 |
| `_data/venue_aliases.yml`、`_data/venue_ranks.yml` | 期刊会议别名和评级映射 |
| `_data/brand.json`、`_data/mascots.json` | 品牌图片 CDN 地址及表情视口配置 |
| `_data/` 的其他文件 | 经费、愿景、公告、组会、友情链接等结构化内容 |
| `_layouts/`、`_includes/` | 页面布局、导航、页脚、语言切换、吉祥物组件 |
| `assets/` | CSS、JavaScript、本地图片与品牌备份 |
| `admin/` | 后台入口、内容配置、图片上传插件和设置页面 |
| `workers/images/` | 图片服务 Worker 与 Wrangler 配置 |
| `scripts/scholar_sync.py` | 论文抓取与 Markdown 生成脚本 |
| `.github/workflows/scholar_sync.yml` | 定时论文同步工作流 |
| `tests/` | 图片服务、媒体选择器、设置访问测试 |
| `docs/admin-setup.md` | 后台权限、图片服务部署、配置与验收说明 |
| `docs/brand-identity.md` | 品牌资源来源、更新和视觉检查说明 |
| `_site/`、`.sass-cache/`、`vendor/` | 构建输出、缓存或本地依赖，不作为内容编辑入口 |

检查时共有 41 份成员记录、89 份 `auto` 论文记录、3 个研究方向、3 个项目、2 条新闻、4 项专利；统计排除了下划线开头的模板，**不等于网站实际显示数量**。

## 本地运行与验证

在服务器项目目录中操作，先准备与 `.ruby-version` 兼容的 Ruby 环境：

```sh
cd /home/neardws/Documents/lab-website
gem install bundler -v 2.7.2
bundle install
bundle exec jekyll serve --host 127.0.0.1 --port 4000
```

远程预览时，在本机另开终端建立转发：

```sh
ssh -N -L 4000:127.0.0.1:4000 neardws@192.168.33.113
```

浏览器访问 `http://127.0.0.1:4000/zh/` 或 `/en/`。配置文件更改后重启预览。

构建与已有测试：

```sh
bundle exec jekyll build --destination /tmp/eais-lab-preview
node --test tests/*.test.mjs
```

使用临时输出目录可以避免覆盖现有 `_site/`。`docs/admin-setup.md` 另有旧 Ruby 环境下的备用构建方法，但该方法不能证明锁定依赖可正常安装。此次仅整理文档，未安装依赖、启动服务或运行这些检查。

## 日常内容维护

### 成员与中英文页面

成员资料统一写入 `_people/<slug>.md`，中英文姓名、简介、研究方向及单位等使用相应字段。中文详情页为 `/people/<slug>/`。新增成员还应建立 `en/people/<slug>.md`，英文入口引用同一份资料：

```yaml
---
layout: person
lang: en
person_slug: example-member
title: Example Member
permalink: /en/people/example-member/
---
```

其他内容优先参考同目录现有记录和模板，并核对对应英文页面，避免只更新一个语言入口。

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

执行前检查 Git 差异：脚本按年份和标题生成文件名，并直接覆盖同名文件。当前 `auto` 目录中也有手工整理记录，人工补充的卷期、页码、评级等字段可能被同步覆盖；需要长期保留的手工论文应按后台约定维护在 `manual` 目录，并检查重复记录。

当前论文列表模板筛选 **2020 年及以后**的记录，并跳过无法从评级表匹配到 CAS 或 CCF 评级的论文。因此，新增文件后未显示时，应同时检查年份、venue 别名与评级映射。

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

## 品牌与发布

品牌原始资源来自 [EdgeAI-2000/logos](https://github.com/EdgeAI-2000/logos/tree/main/eais-lab)。页面读取 `_data/brand.json` 中的 Cloudflare Images 地址；`assets/images/brand/` 保留本地备份。表情组件通过 `_data/mascots.json` 与共享表情图实现。修改资源与 CDN 后按 [品牌维护说明](docs/brand-identity.md) 检查桌面、390px 和 320px 页面及图片透明区域。

现有文档描述网站由 GitHub Pages 从 `main` 源码构建；本地 `.github/workflows/` 只发现 Scholar 同步流程，Pages 后台设置和当前线上部署状态未在此次检查中验证。

## 检查时的维护事项

1. 远程目录已有大量 `_site/` 修改、删除及未跟踪文件，本次未清理、提交或覆盖这些内容。提交更新时先检查差异，避免将生成目录和运行时文件一并提交。
2. 当前 `.gitignore` 只忽略 `.DS_Store`、图片 Worker 的 `.dev.vars` 与 `.wrangler/`；`_site/` 中已有跟踪文件，不能假定生成产物会自动被忽略。
3. `AGENTS.md`、`SOUL.md`、`USER.md`、`memory/` 等属于本地代理上下文。当前 `_config.yml` 未明确排除它们，`_site/` 中已发现相关输出；发布前应核对构建内容，避免将内部上下文作为站点资源发布。
4. README 已在 Jekyll 的 `exclude` 列表中，不作为站点页面构建。此次只新增 README，未修改网站源码、开关、服务配置或部署状态。
