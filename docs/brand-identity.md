# EAIS LAB visual identity

Canonical artwork: [EdgeAI-2000/logos](https://github.com/EdgeAI-2000/logos/tree/main/eais-lab).

The supplied PNGs already contain transparency. Keep their original illustration,
colours and expression details. WebP copies reduce transfer size; SVG viewports
frame the existing artwork without redrawing it. These are raster-backed SVGs,
not vector illustrations.

## Placement

- Header/footer: horizontal wordmark. Keep names in body text and copyright as text.
- Home: standard waving mascot, beside the research introduction.
- About: compact EAIS LAB badge.
- Research: idea; projects: coding; publications/patents: reading.
- Team: waving; admissions/contact: heart; vision: presenting; 404: thinking.
- Footer: choose coffee, peeking or waving once per page load, with coffee as the
  no-JavaScript fallback. Never rotate while a visitor is reading.
- Browser icon: framed cat head; Apple touch icon: full badge.

Preserve the site's quiet light surfaces and blue actions. Use one prominent
mascot per introductory section, never one per result card. Images are decorative
unless they identify a link; brand links expose the text “EAIS LAB”. All artwork
reserves its layout space. Mascots are static, including with reduced motion.

## Updating assets

In the logos repository, run `node scripts/build-brand-assets.mjs` (requires
ImageMagick's `convert`). Copy `mascot.webp`, `mascot-expressions.webp`,
`wordmark.svg`, `badge.webp`, `favicon.svg` and `apple-touch-icon.png` from
`eais-lab/web/` to `assets/images/brand/`. Copy `expressions.json` to
`_data/mascots.json` at the same time.

`_includes/mascot.html` uses the shared sheet and the manifest's viewports, so
multiple expressions reuse one cached image. The logos repository also provides
20 self-contained individual SVGs for use outside this website. Set `mascot` in
page front matter and render `page-heading.html` for an introductory illustration.

## Verification

Build with `bundle exec jekyll build --destination /tmp/eais-brand-preview`.
Check Chinese and English routes at desktop, 390px and 320px widths; confirm
brand links, mobile dropdowns, sticky publication filters, transparent artwork,
the no-JavaScript footer and all three random footer poses. Keep local generated
output out of commits; GitHub Pages builds the source on `main`.
