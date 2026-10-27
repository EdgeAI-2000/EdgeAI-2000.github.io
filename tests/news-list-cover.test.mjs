import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const list = read('../_layouts/list.html');
const css = read('../assets/css/style.css');
const home = read('../_layouts/home.html');

function block(source, selector) {
  const start = source.indexOf(selector);
  assert.notEqual(start, -1, `missing ${selector}`);
  const open = source.indexOf('{', start);
  const close = source.indexOf('}', open);
  return source.slice(open + 1, close);
}

test('news index covers are compact thumbnails beside the copy', () => {
  assert.match(list, /class="card\{% if news_cover != '' %\} news-card\{% endif %\}"/);
  assert.match(list, /class="news-cover"/);
  assert.match(list, /class="news-copy"/);
  assert.match(list, /class="cover" alt=news_title priority="lazy"/);
  assert.match(list, /card-16x9\.svg/);

  const grid = block(css, '.news-card {');
  assert.match(grid, /grid-template-columns:\s*240px minmax\(0,\s*1fr\)/);
  const cover = block(css, '.news-card .cover {');
  assert.match(cover, /width:\s*240px/);
  assert.match(cover, /height:\s*135px/);
  assert.match(cover, /object-fit:\s*cover/);
  assert.doesNotMatch(css, /grid-template-columns:\s*2fr 3fr/);

  const mobile = css.slice(css.lastIndexOf('@media (max-width: 600px)'));
  assert.match(mobile, /\.news-card\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)/);
  assert.match(mobile, /\.news-card \.cover\s*\{[^}]*width:\s*100%/);
  assert.match(mobile, /\.news-card \.cover\s*\{[^}]*max-width:\s*none/);
  assert.match(mobile, /\.news-card \.cover\s*\{[^}]*aspect-ratio:\s*16 \/ 9/);
});

test('other cover patterns stay as they are', () => {
  assert.match(block(css, '.card .cover {'), /width:\s*100%/);
  assert.match(block(css, '.card .cover {'), /aspect-ratio:\s*16 \/ 9/);
  assert.match(block(css, '.content img.news-photo {'), /max-height:\s*720px/);
  assert.match(block(css, '.news-list.visual .thumb {'), /width:\s*96px/);
  assert.match(block(css, '.news-list.visual .thumb {'), /height:\s*54px/);
  assert.match(home, /class="thumb"/);
  assert.doesNotMatch(home, /news-card/);
});
