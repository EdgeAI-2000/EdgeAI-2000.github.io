# EAIS LAB visual identity

Canonical artwork: [EdgeAI-2000/logos](https://github.com/EdgeAI-2000/logos/tree/main/eais-lab).

The supplied PNGs already contain transparency. Keep their original illustration,
colours and expression details. WebP copies reduce transfer size; SVG viewports
frame the existing artwork without redrawing it. These are raster-backed SVGs,
not vector illustrations.

## Placement

- Header: text name. Footer: horizontal wordmark. Keep names in body text and copyright as text.
- Home: horizontal wordmark as the main heading, with the standard waving mascot beside the research introduction.
- About: compact EAIS LAB badge.
- Research: idea; projects: coding; publications/patents: reading.
- Team: waving; admissions/contact: heart; vision: presenting; 404: thinking.
- Footer: choose coffee, peeking or waving once per page load, with coffee as the
  no-JavaScript fallback. Never rotate while a visitor is reading.
- Browser icon: framed cat head; Apple touch icon: full badge.
- CMS: the waving cat is the login and navigation logo. `admin/brand.css` applies
  the blue/yellow palette to Decap's login, navigation, collections and settings.
  Its component-label selectors target the pinned Decap 3.16.3; check these
  screens again when upgrading Decap. Keep authentication and status colours intact.

Use deep blue text, blue actions and yellow accents on white and pale blue surfaces.
Yellow highlights active navigation and key details; pair yellow fills with dark text.
Use one prominent
mascot per introductory section, never one per result card. Images are decorative
unless they identify a link; brand links expose the text “EAIS LAB”. All artwork
reserves its layout space. Mascots are static, including with reduced motion.

## Updating assets

All brand images are hosted in Cloudflare Images. `_data/brand.json` contains the
six public delivery URLs used by the website: wordmark, mascot, badge, expression
sheet, favicon and Apple touch icon. Local files are retained as backups; templates
load the CDN URLs directly, including the image inside each expression viewport.

In the logos repository, run `node scripts/build-brand-assets.mjs` (requires
ImageMagick's `convert`), then `python3 scripts/upload-cloudflare-images.py`
(requires `curl` and a GitHub CLI login with website repository write permission).
The upload script uses the existing authenticated Images Worker and skips
unchanged files. It never needs to read or store the Cloudflare API token.

Copy the six resulting delivery URLs from `eais-lab/cloudflare-images.json` into
`_data/brand.json`. Update the local backup files in `assets/images/brand/` and
copy `eais-lab/web/expressions.json` to `_data/mascots.json` when artwork changes.
The `content` variant preserves aspect ratio. Keep that variant in scale-down
mode so the expression sheet's viewports remain aligned.

`_includes/mascot.html` uses the shared sheet and the manifest's viewports, so
multiple expressions reuse one cached image. The logos repository also provides
20 self-contained individual SVGs, also uploaded to Cloudflare Images, for use
outside this website. Set `mascot` in
page front matter and render `page-heading.html` for an introductory illustration.

## Verification

Build with `bundle exec jekyll build --destination /tmp/eais-brand-preview`.
Check Chinese and English routes at desktop, 390px and 320px widths; confirm
brand links, mobile dropdowns, sticky publication filters, transparent artwork,
the no-JavaScript footer and all three random footer poses. Keep local generated
output out of commits; GitHub Pages builds the source on `main`.

After CDN changes, verify every URL resolves, check transparent areas and SVG
embedded artwork, and confirm browser requests for brand images use
`imagedelivery.net` rather than `/assets/images/brand/`. Cloudflare sanitizes SVGs
and may transcode their embedded raster images; byte-for-byte equality is not
expected ([format documentation](https://developers.cloudflare.com/images/get-started/limits/#svg)).
