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

test('hero wordmark stays high priority and the hero mascot loads eagerly', () => {
  const wordmark = includeTag(home, 'hero-wordmark');
  assert.match(wordmark, /priority="high"/);
  assert.match(wordmark, /width="685"/);
  assert.match(wordmark, /height="228"/);
  assert.doesNotMatch(wordmark, /loading="lazy"/);
  const heroMascot = includeTag(home, 'hero-mascot');
  assert.match(heroMascot, /priority="eager"/);
  assert.doesNotMatch(heroMascot, /priority="high"/);
  assert.doesNotMatch(heroMascot, /loading="lazy"/);
  assert.match(home, /class="cover"[^%]*priority="lazy"/);
  assert.match(home, /class="thumb"[^%]*priority="lazy"|class="thumb"/);
  assert.match(home, /width="68" height="68"/);
  assert.match(home, /variant='face'/);
});

test('below-fold cards are lazy and above-fold portraits stay eager', () => {
  assert.match(people, /eager_avatars = 8/);
  assert.match(people, /priority=img_priority/);
  assert.match(person, /class="avatar-lg"[^%]*width="112" height="112" priority="eager"/);
  assert.match(person, /style_photo/);
  assert.doesNotMatch(person, /variant='face'/);
  assert.doesNotMatch(includeTag(person, 'avatar-lg'), /loading="lazy"/);
  assert.match(people, /variant='face'/);
  assert.match(people, /width="88" height="88"/);
  assert.match(sections, /forloop\.first/);
  assert.match(sections, /cover_priority = 'eager'/);
  assert.match(sections, /cover_priority = 'lazy'/);
  assert.match(theme, /class="research-diagram"[^%]*priority="eager"/);
  assert.match(heading, /class="page-badge"[^%]*priority="eager"/);
  assert.match(footer, /include img\.html/);
  assert.doesNotMatch(footer, /priority="high"/);
});

test('heading and footer expression sheets are both deferred', () => {
  assert.match(footer, /include mascot\.html[^%]*defer=true/);
  assert.match(heading, /include mascot\.html pose=page\.mascot defer=true/);
  assert.match(mascot, /data-mascot-defer/);
  assert.match(mascot, /data-src/);
  assert.match(mascot, /href/);
  assert.match(mascotJs, /IntersectionObserver/);
  assert.match(mascotJs, /rootMargin: '240px 0px'/);
  assert.match(mascotJs, /page heading/);
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
    observe(target) {
      this.targets = this.targets || [];
      this.targets.push(target);
      this.target = target;
    }
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

test('deferred heading mascot reveals on intersection without a random pose', () => {
  const headingImage = element({ 'data-src': 'https://cdn.example/expressions' });
  const footerImage = element({ 'data-src': 'https://cdn.example/expressions' });
  const headingMascot = {
    defer: true,
    querySelector(selector) {
      return selector === 'image[data-src]' && headingImage.getAttribute('data-src') ? headingImage : null;
    },
  };
  const footerMascot = {
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
      if (selector === 'rect') return element();
      if (selector === 'image[data-src]' && footerImage.getAttribute('data-src')) return footerImage;
      return null;
    },
  };
  const observers = runMascot([headingMascot, footerMascot]);
  assert.equal(observers.length, 1);
  assert.equal(observers[0].targets.length, 2);
  assert.equal(headingImage.getAttribute('href'), null);
  observers[0].callback([{ isIntersecting: true, target: headingMascot }], observers[0]);
  assert.equal(headingImage.getAttribute('href'), 'https://cdn.example/expressions');
  assert.equal(headingImage.getAttribute('data-src'), null);
  assert.equal(footerImage.getAttribute('href'), null);
});

test('built pages keep the wordmark high priority and lazy-load later images', { skip: !existsSync('/tmp/eais-lab-preview/zh/index.html') && 'run jekyll build first' }, () => {
  for (const lang of ['zh', 'en']) {
    const html = readFileSync(`/tmp/eais-lab-preview/${lang}/index.html`, 'utf8');
    const wordmark = html.match(/<img[^>]*class="hero-wordmark"[^>]*>/)[0];
    const mascotImg = html.match(/<img[^>]*class="hero-mascot"[^>]*>/)[0];
    assert.match(wordmark, /fetchpriority="high"/);
    assert.match(wordmark, /decoding="auto"/);
    assert.match(wordmark, /width="685"/);
    assert.match(wordmark, /height="228"/);
    assert.match(wordmark, /eais-brand-wordmark\/logo/);
    assert.doesNotMatch(wordmark, /loading="lazy"/);
    assert.match(mascotImg, /decoding="auto"/);
    assert.doesNotMatch(mascotImg, /fetchpriority="high"/);
    assert.doesNotMatch(mascotImg, /loading="lazy"/);
    assert.match(html, /rel="icon"[^>]*eais-brand-favicon\/icon"[^>]*type="image\/png"/);
    assert.doesNotMatch(html, /689b350b-9753-4664-5792-4cd8783cc200/);
    assert.doesNotMatch(html, /f96cbe50-14f0-491a-70e8-a4d2f9162300/);
    assert.doesNotMatch(html, /image\/svg\+xml/);
    const thumbs = html.match(/<img[^>]*class="thumb"[^>]*>/g) || [];
    assert.ok(thumbs.length >= 1);
    for (const tag of thumbs) {
      assert.match(tag, /\/thumb"/);
      assert.doesNotMatch(tag, /\/cover"/);
      assert.match(tag, /width="96"/);
      assert.match(tag, /height="54"/);
      assert.match(tag, /loading="lazy" decoding="async"/);
    }
    const covers = html.match(/<img[^>]*class="cover"[^>]*>/g) || [];
    assert.ok(covers.length >= 1);
    for (const tag of covers) {
      assert.match(tag, /loading="lazy" decoding="async"/);
      assert.match(tag, /width="\d+"/);
      assert.match(tag, /height="\d+"/);
      assert.doesNotMatch(tag, /\/cover"/);
      if (tag.includes('eais-research-')) {
        assert.match(tag, /\/thumb"/);
        assert.match(tag, /width="480"/);
        assert.match(tag, /height="270"/);
      }
    }
    const faces = html.match(/<img[^>]*class="avatar-img"[^>]*>/g) || [];
    assert.ok(faces.length >= 1);
    for (const tag of faces) {
      assert.match(tag, /width="68"/);
      assert.match(tag, /height="68"/);
      if (tag.includes('imagedelivery.net')) assert.match(tag, /\/face"/);
    }
    const vision = html.match(/<img[^>]*eais-research-vision\/cover[^>]*>/)[0];
    assert.match(vision, /width="1200"/);
    assert.match(vision, /height="675"/);
    assert.doesNotMatch(vision, /\/thumb/);
    assert.match(html, /data-mascot-defer/);
    assert.match(html, /<image[^>]*data-src=/);
    assert.doesNotMatch(html, /<image[^>]*href=/);
  }

  const peopleHtml = readFileSync('/tmp/eais-lab-preview/zh/people/index.html', 'utf8');
  const avatars = peopleHtml.match(/<img[^>]*class="avatar-img"[^>]*>/g) || [];
  assert.ok(avatars.length > 8);
  avatars.slice(0, 8).forEach((tag) => assert.doesNotMatch(tag, /loading="lazy"/));
  avatars.slice(8).forEach((tag) => assert.match(tag, /loading="lazy" decoding="async"/));
  for (const tag of avatars) {
    assert.match(tag, /width="88"/);
    assert.match(tag, /height="88"/);
    if (tag.includes('imagedelivery.net')) assert.match(tag, /\/face"/);
    assert.doesNotMatch(tag, /\/avatar"/);
  }
  assert.doesNotMatch(peopleHtml, /<image[^>]*href=/);
  assert.ok((peopleHtml.match(/data-mascot-defer/g) || []).length >= 2);

  const profile = readFileSync('/tmp/eais-lab-preview/people/he-chun/index.html', 'utf8');
  const largeAvatar = profile.match(/<img[^>]*class="avatar-lg"[^>]*>/)[0];
  assert.match(largeAvatar, /\/avatar"/);
  assert.doesNotMatch(largeAvatar, /\/face"/);
  assert.match(largeAvatar, /width="112"/);
  assert.match(largeAvatar, /height="112"/);

  const newsHtml = readFileSync('/tmp/eais-lab-preview/zh/news/index.html', 'utf8');
  const newsCovers = newsHtml.match(/<img[^>]*class="cover"[^>]*>/g) || [];
  assert.ok(newsCovers.length >= 1);
  for (const tag of newsCovers) {
    assert.match(tag, /width="240"/);
    assert.match(tag, /height="135"/);
    if (tag.includes('imagedelivery.net')) {
      assert.match(tag, /\/thumb"/);
      assert.doesNotMatch(tag, /\/cover"/);
    }
  }
  const article = readFileSync('/tmp/eais-lab-preview/news/2026-10-16-wei-quanmin-national-scholarship/index.html', 'utf8');
  assert.match(article, /\/content/);
  assert.doesNotMatch(article, /\/thumb/);

  const themesHtml = readFileSync('/tmp/eais-lab-preview/en/themes/index.html', 'utf8');
  const themeImgs = themesHtml.match(/<img[^>]*src="[^"]+"[^>]*>/g).filter((tag) => !tag.includes('page-badge') && !tag.includes('wordmark') && !tag.includes('footer'));
  assert.doesNotMatch(themeImgs[0], /loading="lazy"/);
  themeImgs.slice(1).forEach((tag) => assert.match(tag, /loading="lazy"/));
  const researchCards = themeImgs.filter((tag) => tag.includes('eais-research-'));
  assert.ok(researchCards.length >= 3);
  for (const tag of researchCards) {
    assert.match(tag, /\/thumb"/);
    assert.doesNotMatch(tag, /\/cover"/);
    assert.match(tag, /width="480"/);
    assert.match(tag, /height="270"/);
  }

  const diagram = readFileSync('/tmp/eais-lab-preview/themes/edge-intelligence/index.html', 'utf8');
  assert.match(diagram, /eais-research-edge-llm-inference\/cover/);
  assert.match(diagram, /width="1200"/);
  assert.match(diagram, /height="675"/);
  assert.doesNotMatch(diagram, /\/thumb/);

  const about = readFileSync('/tmp/eais-lab-preview/zh/about/index.html', 'utf8');
  const badge = about.match(/<img[^>]*class="page-badge"[^>]*>/)[0];
  assert.doesNotMatch(badge, /loading="lazy"/);
  assert.match(about, /data-mascot-defer/);
});
