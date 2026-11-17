# Architecture

## Choice: static site with a tiny build script

A small hotel site needs speed, low cost, easy hosting and easy handover – not a CMS server or a framework. So:

- **Plain HTML, CSS and a little JavaScript.** Works on any browser, loads fast on mobile data.
- **`build.js` (no dependencies)** assembles pages from shared partials and fills `{{tokens}}` from `src/config.json`. This keeps one source of truth for business facts and avoids duplicated header/footer code.
- **Output in `dist/`** is portable to any static host. Cloudflare Workers config is in `wrangler.jsonc`; `public/_headers` sets security headers.

## Folders

```
src/config.json      business facts (single source of truth)
src/partials/        layout, header, footer, booking banner
src/pages/           one file per page, each starting with a <!--meta {json} --> block
public/              copied as-is: assets/css, assets/js, assets/img, icons, _headers
build.js             builder → dist/ (+ sitemap.xml, robots.txt)
serve.js             local preview server
```

## Page meta block

```html
<!--meta { "title": "...", "description": "...", "path": "/rooms", "nav": "rooms", "priority": "0.9" } -->
```
`noindex: true` keeps a page out of the sitemap and adds `noindex`.

## Booking integration (LekkeSlaap)

LekkeSlaap does not publish an embeddable booking widget, so the site deep-links to the listing (`lekkeslaapUrl`) in a new tab. All booking buttons carry `data-book` so they can be found and upgraded in one pass if LekkeSlaap ever provides room-specific links or a widget. Phone and WhatsApp are offered as alternatives.

## SEO

Per-page title, description and canonical; Open Graph tags; `Hotel` JSON-LD (built from config); generated sitemap and robots.txt; semantic headings.

## Privacy (POPIA)

No forms, cookies or trackers. Enquiries go via phone, WhatsApp or email. Google Fonts is the only third-party resource loaded; self-host the fonts later to remove it.

## Content editing

Content lives in plain files. For the hotel to edit text and photos themselves later, a Git-based CMS (e.g. Pages CMS or Decap CMS) can be added on top of `src/config.json` without changing the architecture.
