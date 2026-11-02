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

test('Paper, PDF, Code, Video, and Project Page are the same primary button', () => {
  const actions = layout.slice(layout.indexOf('class="paper-actions"'), layout.indexOf('</header>'));
  assert.match(actions, /class="btn"/);
  assert.doesNotMatch(actions, /btn secondary/);
  assert.match(layout, /assign paper_label = 'Paper'/);
  assert.match(layout, /assign code_label = 'Code'/);
  assert.match(layout, /assign video_label = 'Video'/);
  assert.match(layout, /assign page_label = 'Project Page'/);
  assert.match(actions, />PDF</);
  assert.match(css, /\.paper-actions \.btn\s*\{[^}]*background:\s*var\(--button\)/);
  assert.match(css, /\.paper-actions \.btn\s*\{[^}]*box-shadow:\s*none/);
  assert.doesNotMatch(css, /\.paper-actions \.btn:not\(\.secondary\)/);
});

test('key results are taken from the abstract, including the OPV2V reduction', () => {
  assert.match(layout, /project\.key_results/);
  assert.match(project, /value: ">350×"/);
  assert.match(project, /34\.375 MB → 99\.688 KB/);
  assert.match(project, /OPV2V、V2XSet、DAIR-V2X/);
  assert.match(project, /相对全特征协同/);
  assert.match(project, /Versus full-feature collaboration/);
  assert.doesNotMatch(project, /\d+(?:\.\d+)?%/);
});

test('concept and framework figures stay, and the demo is captioned without extra art', () => {
  assert.match(project, /figure_concept: \/assets\/images\/projects\/paracomm\/fcc-vs-pcc\.png/);
  assert.match(project, /figure_method: \/assets\/images\/projects\/paracomm\/framework\.png/);
  assert.match(project, /demo_video: https:\/\/files\.eaislab\.com\/projects\/paracomm\/demo\.mp4/);
  assert.match(project, /demo_poster: https:\/\/files\.eaislab\.com\/projects\/paracomm\/demo-poster\.jpg/);
  assert.match(project, /demo_lead_zh: "看完就懂。"/);
  assert.match(project, /demo_lead_en: "Watch it once and the idea is clear\."/);
  assert.match(layout, /figure_concept/);
  assert.match(layout, /figure_method/);
  assert.doesNotMatch(layout, /placeholder|picsum|unsplash/i);
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
