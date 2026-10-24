import { test } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { existsSync, readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const home = read('../_layouts/home.html');
const people = read('../_layouts/people.html');
const person = read('../_layouts/person.html');
const sections = read('../_layouts/sections.html');
const theme = read('../_layouts/theme.html');
const footer = read('../_includes/footer.html');
const heading = read('../_includes/page-heading.html');
const mascot = read('../_includes/mascot.html');
const img = read('../_includes/img.html');
const mascotJs = read('../assets/js/mascot.js');

function includeTag(source, className) {
  const match = source.match(new RegExp(`\\{% include img\\.html[^%]*class="${className}"[^%]*%\\}`));
  assert.ok(match, `missing img include for ${className}`);
  return match[0];
}

test('image helper lazy-loads by default and keeps eager priorities unloaded', () => {
  assert.match(img, /loading="lazy" decoding="async"/);
  const highBranch = img.split("include.priority == 'high'")[1].split('elsif')[0];
  const eagerBranch = img.split("include.priority == 'eager'")[1].split('else')[0];
  assert.match(highBranch, /fetchpriority="high" decoding="auto"/);
  assert.doesNotMatch(highBranch, /loading="lazy"/);
  assert.match(eagerBranch, /decoding="auto"/);
  assert.doesNotMatch(eagerBranch, /loading="lazy"/);
});

test('hero wordmark and mascot stay high priority on both language homepages', () => {
  for (const className of ['hero-wordmark', 'hero-mascot']) {
    const tag = includeTag(home, className);
    assert.match(tag, /priority="high"/);
    assert.doesNotMatch(tag, /loading="lazy"/);
  }
  assert.match(home, /class="cover"[^%]*priority="lazy"/);
  assert.match(home, /class="thumb"[^%]*priority="lazy"|class="thumb"/);
  assert.match(home, /class="avatar-img"/);
});

test('below-fold cards are lazy and above-fold portraits stay eager', () => {
  assert.match(people, /eager_avatars = 8/);
  assert.match(people, /priority=img_priority/);
  assert.match(person, /class="avatar-lg"[^%]*priority="eager"/);
  assert.match(person, /style_photo/);
  assert.doesNotMatch(includeTag(person, 'avatar-lg'), /loading="lazy"/);
  assert.match(sections, /forloop\.first/);
  assert.match(sections, /cover_priority = 'eager'/);
  assert.match(sections, /cover_priority = 'lazy'/);
  assert.match(theme, /class="research-diagram"[^%]*priority="eager"/);
  assert.match(heading, /class="page-badge"[^%]*priority="eager"/);
  assert.match(footer, /include img\.html/);
  assert.doesNotMatch(footer, /priority="high"/);
});

test('footer expression sheet is deferred and heading mascots are not', () => {
  assert.match(footer, /include mascot\.html[^%]*defer=true/);
  assert.match(mascot, /data-mascot-defer/);
  assert.match(mascot, /data-src/);
  assert.match(mascot, /href/);
  assert.match(mascotJs, /IntersectionObserver/);
  assert.match(mascotJs, /rootMargin: '240px 0px'/);
});

test('contact maps on both sites already lazy-load', () => {
  for (const path of ['../zh/contact.md', '../en/contact.md']) {
    const contact = read(path);
    const frames = contact.match(/<iframe\b[^>]*>/g) || [];
    assert.ok(frames.length >= 1);
    for (const frame of frames) assert.match(frame, /loading="lazy"/);
  }
});

function element(attrs = {}) {
  return {
    attrs: { ...attrs },
    getAttribute(name) { return this.attrs[name] ?? null; },
    setAttribute(name, value) { this.attrs[name] = value; },
    removeAttribute(name) { delete this.attrs[name]; },
  };
}

function runMascot(mascots, { intersectionObserver = true } = {}) {
  const observers = [];
  class IO {
    constructor(callback, options) {
      this.callback = callback;
      this.options = options;
      observers.push(this);
    }
    observe(target) { this.target = target; }
    unobserve() { this.target = null; }
  }
  const document = {
    querySelectorAll(selector) {
      if (selector === '[data-mascot-random]') return mascots.filter((mascot) => mascot.random);
      if (selector === '[data-mascot-defer]') return mascots.filter((mascot) => mascot.defer);
      return [];
    },
  };
  vm.runInNewContext(mascotJs, {
    document,
    IntersectionObserver: intersectionObserver ? IO : undefined,
    JSON,
    Math,
  });
  return observers;
}

test('deferred footer sprite waits for intersection', () => {
  const image = element({ 'data-src': 'https://cdn.example/expressions' });
  const mascot = {
    defer: true,
    querySelector(selector) {
      return selector === 'image[data-src]' && image.getAttribute('data-src') ? image : null;
    },
  };
  const observers = runMascot([mascot]);
  assert.equal(image.getAttribute('href'), null);
  assert.equal(observers[0].options.rootMargin, '240px 0px');
  observers[0].callback([{ isIntersecting: false, target: mascot }], observers[0]);
  assert.equal(image.getAttribute('href'), null);
  observers[0].callback([{ isIntersecting: true, target: mascot }], observers[0]);
  assert.equal(image.getAttribute('href'), 'https://cdn.example/expressions');
  assert.equal(image.getAttribute('data-src'), null);
});

test('deferred sprite still loads when IntersectionObserver is unavailable', () => {
  const image = element({ 'data-src': 'https://cdn.example/expressions' });
  const mascot = {
    defer: true,
    querySelector() { return image.getAttribute('data-src') ? image : null; },
  };
  const observers = runMascot([mascot], { intersectionObserver: false });
  assert.equal(observers.length, 0);
  assert.equal(image.getAttribute('href'), 'https://cdn.example/expressions');
});

test('random footer pose still runs before the sprite is revealed', () => {
  const rect = element();
  const image = element({ 'data-src': 'https://cdn.example/expressions' });
  const mascot = {
    random: true,
    defer: true,
    dataset: {
      poses: JSON.stringify({
        coffee: { viewBox: '0 0 10 10' },
        peeking: { viewBox: '10 0 10 10' },
        waving: { viewBox: '20 0 10 10' },
      }),
    },
    setAttribute(name, value) { this.attrs = { ...(this.attrs || {}), [name]: value }; },
    querySelector(selector) {
      if (selector === 'rect') return rect;
      if (selector === 'image[data-src]') return image;
      return null;
    },
  };
  runMascot([mascot], { intersectionObserver: false });
  assert.ok(['coffee', 'peeking', 'waving'].includes(mascot.dataset.pose));
  assert.equal(rect.getAttribute('width'), '10');
  assert.equal(image.getAttribute('href'), 'https://cdn.example/expressions');
});

test('built pages keep the hero eager and lazy-load later images', { skip: !existsSync('/tmp/eais-lab-preview/zh/index.html') && 'run jekyll build first' }, () => {
  for (const lang of ['zh', 'en']) {
    const html = readFileSync(`/tmp/eais-lab-preview/${lang}/index.html`, 'utf8');
    const wordmark = html.match(/<img[^>]*class="hero-wordmark"[^>]*>/)[0];
    const mascotImg = html.match(/<img[^>]*class="hero-mascot"[^>]*>/)[0];
    for (const tag of [wordmark, mascotImg]) {
      assert.match(tag, /fetchpriority="high"/);
      assert.match(tag, /decoding="auto"/);
      assert.doesNotMatch(tag, /loading="lazy"/);
    }
    const covers = html.match(/<img[^>]*class="cover"[^>]*>/g) || [];
    assert.ok(covers.length >= 1);
    for (const tag of covers) assert.match(tag, /loading="lazy" decoding="async"/);
    assert.match(html, /data-mascot-defer/);
    assert.match(html, /<image[^>]*data-src=/);
    assert.doesNotMatch(html, /<image[^>]*href=/);
  }

  const peopleHtml = readFileSync('/tmp/eais-lab-preview/zh/people/index.html', 'utf8');
  const avatars = peopleHtml.match(/<img[^>]*class="avatar-img"[^>]*>/g) || [];
  assert.ok(avatars.length > 8);
  avatars.slice(0, 8).forEach((tag) => assert.doesNotMatch(tag, /loading="lazy"/));
  avatars.slice(8).forEach((tag) => assert.match(tag, /loading="lazy" decoding="async"/));

  const themesHtml = readFileSync('/tmp/eais-lab-preview/en/themes/index.html', 'utf8');
  const themeImgs = themesHtml.match(/<img[^>]*src="[^"]+"[^>]*>/g).filter((tag) => !tag.includes('page-badge') && !tag.includes('footer'));
  assert.doesNotMatch(themeImgs[0], /loading="lazy"/);
  themeImgs.slice(1).forEach((tag) => assert.match(tag, /loading="lazy"/));

  const about = readFileSync('/tmp/eais-lab-preview/zh/about/index.html', 'utf8');
  const badge = about.match(/<img[^>]*class="page-badge"[^>]*>/)[0];
  assert.doesNotMatch(badge, /loading="lazy"/);
  assert.match(about, /data-mascot-defer/);
  assert.match(peopleHtml, /<image[^>]*href=/);
  assert.match(peopleHtml, /data-mascot-defer/);
});
