import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const layout = read('../_layouts/project_paper.html');
const css = read('../assets/css/style.css');
const project = read('../_projects/paracomm.md');
const en = read('../en/project/paracomm.md');
const root = read('../project/paracomm.md');

test('ParaComm permalinks stay on the existing paths', () => {
  assert.match(project, /permalink: \/zh\/project\/paracomm\//);
  assert.match(en, /permalink: \/en\/project\/paracomm\//);
  assert.match(en, /project_slug: paracomm/);
  assert.match(root, /permalink: \/project\/paracomm\//);
  assert.match(root, /redirect_to: \/en\/project\/paracomm\//);
});

test('hero is a centered paper landing with a quiet venue line', () => {
  assert.match(layout, /class="paper-hero"/);
  assert.match(layout, /<p class="paper-kicker">\{\{ project\.venue \| escape \}\}<\/p>/);
  assert.doesNotMatch(layout, /project\.short_name/);
  assert.match(css, /\.paper-hero\s*\{[^}]*text-align:\s*center/);
  assert.match(css, /\.paper-kicker\s*\{[^}]*color:\s*var\(--muted\)/);
  assert.match(css, /\.paper-project h1\s*\{[^}]*clamp\(34px,\s*4\.6vw,\s*52px\)/);
});

test('video is its own section immediately after the action buttons', () => {
  const actions = layout.indexOf('class="paper-actions"');
  const headerEnd = layout.indexOf('</header>');
  const video = layout.indexOf('id="paper-demo"');
  const concept = layout.indexOf('id="concept"');
  const abstract = layout.indexOf('id="abstract"');
  assert.ok(actions > 0 && headerEnd > actions && video > headerEnd);
  assert.ok(concept > video && abstract > concept);
  assert.match(layout, /assign video_heading = 'Video'/);
  assert.match(layout, /assign video_heading = '演示'/);
  assert.match(layout, /class="paper-video"/);
  assert.doesNotMatch(layout, /paper-figure-card|paper-stage|paper-demo-pending/);
});

test('ParaComm uses shields, and projects without badges keep equal buttons', () => {
  const actions = layout.slice(layout.indexOf('class="paper-actions"'), layout.indexOf('</header>'));
  assert.match(actions, /class="paper-badge"/);
  assert.match(actions, /project\.badges/);
  assert.match(actions, /when 'pdf'[\s\S]*project\.pdf/);
  assert.match(actions, /when 'code'[\s\S]*project\.code/);
  assert.match(actions, /when 'video'[\s\S]*#paper-demo/);
  assert.match(actions, /class="btn"/);
  assert.doesNotMatch(actions, /btn secondary/);
  assert.match(layout, /assign paper_label = 'Paper'/);
  assert.match(layout, /assign code_label = 'Code'/);
  assert.match(layout, /assign video_label = 'Video'/);
  assert.match(layout, /assign page_label = 'Project Page'/);
  assert.match(actions, />PDF</);
  assert.match(css, /\.paper-badge/);
  assert.match(css, /\.paper-actions \.btn\s*\{[^}]*background:\s*var\(--button\)/);
  assert.match(css, /\.paper-actions \.btn\s*\{[^}]*box-shadow:\s*none/);
  assert.doesNotMatch(css, /\.paper-actions \.btn:not\(\.secondary\)/);
});

test('PDF, code, and result figures use the lab hosts', () => {
  assert.match(project, /pdf:\s*https:\/\/files\.eaislab\.com\/projects\/paracomm\/paper\.pdf/);
  assert.match(project, /code:\s*https:\/\/github\.com\/EdgeAI-2000\/ParaComm/);
  assert.match(project, /doi:\s*https:\/\/doi\.org\/10\.1109\/TMC\.2026\.3741641/);
  assert.doesNotMatch(project, /fengxueguiren\/ParaComm/);
  assert.doesNotMatch(project, /weiquanmin\.github\.io\/ParaComm\/static\/pdfs/);
  assert.match(project, /src: https:\/\/imagedelivery\.net\/FNBuifN30Gov-zkgIT2tCQ\/paracomm-fig7-v4\/public/);
  assert.match(project, /src: https:\/\/imagedelivery\.net\/FNBuifN30Gov-zkgIT2tCQ\/paracomm-fig8-v4\/public/);
  assert.doesNotMatch(project, /paracomm-fig7-v2|paracomm-fig8-v2/);
  assert.doesNotMatch(project, /paracomm-fig7-pdf|paracomm-fig8-pdf/);
  assert.doesNotMatch(project, /642abaca-b080-4ed2-a207-36f189f0fa00/);
  assert.doesNotMatch(project, /00a974fb-07ad-4887-9d08-8c9a6a07f200/);
  assert.match(project, /width:\s*1366/);
  assert.match(project, /height:\s*453/);
  assert.match(project, /height:\s*387/);
  assert.match(project, /results_lead_en:.*qualitative comparison \(Fig\. 7\).*trade-off analysis \(Fig\. 8\)/);
  assert.match(project, /results_lead_zh:.*定性对比（图 7）.*折中分析（图 8）/);
  assert.match(project, /caption_en:.*atom top-k/);
  assert.match(project, /caption_zh:.*原子 top-k/);
  assert.match(layout, /include asset-src\.html src=fig\.src/);
  assert.match(layout, /id="results"/);
  const assetSrc = read('../_includes/asset-src.html');
  assert.match(assetSrc, /contains ':\/\/'/);
  assert.match(assetSrc, /relative_url/);
});

test('key results are taken from the abstract, including the OPV2V reduction', () => {
  assert.match(layout, /project\.key_results/);
  assert.match(project, /value: ">350×"/);
  assert.match(project, /34\.375 MB → 99\.688 KB/);
  assert.match(project, /OPV2V、V2XSet、DAIR-V2X/);
  assert.match(project, /相对全特征协同/);
  assert.match(project, /Versus full-feature collaboration/);
  const withoutBadgeArt = project.replace(/^.*img\.shields\.io.*$/gm, '');
  assert.doesNotMatch(withoutBadgeArt, /\d+(?:\.\d+)?%/);
});

test('concept and framework figures stay, and the demo is captioned without extra art', () => {
  assert.match(project, /figure_concept: \/assets\/images\/projects\/paracomm\/fcc-vs-pcc\.png/);
  assert.match(project, /figure_method: \/assets\/images\/projects\/paracomm\/framework\.png/);
  assert.match(project, /demo_video: https:\/\/files\.eaislab\.com\/projects\/paracomm\/demo\.mp4/);
  assert.match(project, /demo_poster: https:\/\/files\.eaislab\.com\/projects\/paracomm\/demo-poster\.jpg/);
  assert.doesNotMatch(project, /demo_lead/);
  assert.doesNotMatch(project, /看完就懂/);
  assert.doesNotMatch(project, /Watch it once and the idea is clear/);
  assert.match(project, /demo_caption_en:/);
  assert.match(layout, /figure_concept/);
  assert.match(layout, /figure_method/);
  assert.doesNotMatch(layout, /placeholder|picsum|unsplash/i);
});

test('ParaComm paper pages omit the back-to-projects footer link', () => {
  assert.match(layout, /assign paper_slug = page\.project_slug \| default: project\.slug \| default: page\.slug/);
  assert.match(layout, /assign back_label = 'Back to projects'/);
  assert.match(layout, /assign back_label = '返回项目列表'/);
  const gated = layout.match(/\{% unless paper_slug == 'paracomm' %\}([\s\S]*?)\{% endunless %\}/);
  assert.ok(gated, 'back link must be skipped when the paper slug is paracomm');
  assert.match(gated[1], /class="paper-back"/);
  assert.match(gated[1], /list_url/);
  assert.equal((layout.match(/class="paper-back"/g) || []).length, 1);
});

test('the paper page drops rounded section cards and accent underlines', () => {
  const paperCss = css.slice(css.indexOf('Paper project pages'));
  assert.ok(paperCss.length > 0);
  assert.doesNotMatch(paperCss, /\.paper-section h2::after/);
  assert.doesNotMatch(paperCss, /\.paper-figure-card/);
  assert.doesNotMatch(paperCss, /border-radius:\s*20px/);
  assert.doesNotMatch(paperCss, /linear-gradient/);
  assert.match(paperCss, /\.paper-block h2::after\s*\{\s*content:\s*none/);
  assert.match(paperCss, /\.paper-block\s*\{[^}]*background:\s*transparent/);
});
