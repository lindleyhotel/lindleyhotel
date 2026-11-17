# Lindley Hotel 1895 – website

Website for the **Lindley Hotel**, 1 Pretorius Street, Lindley, Free State: heritage hotel, bakery & take-away, restaurant, and chapel for weddings.

Room bookings go to the hotel's **LekkeSlaap** listing. Every "Book" button links there; the link lives in one place (`src/config.json → lekkeslaapUrl`).

## Quick start

Needs only **Node.js 18 or newer**. No packages to install.

```bash
node build.js      # builds the site into dist/
node serve.js      # preview at http://localhost:8080
```

## Where things are

| You want to change…                         | Edit                                  |
|---------------------------------------------|---------------------------------------|
| Phone, email, address, hours, booking link, "from" price | `src/config.json`        |
| Text on a page                              | `src/pages/<page>.html`               |
| Header, footer, booking banner              | `src/partials/`                       |
| Colours, fonts, spacing                     | `public/assets/css/styles.css` (`:root`) |
| Photos                                      | `public/assets/img/` – see `docs/PHOTOS.md` |

`{{tokens}}` in pages are filled from `config.json` at build time. A typo in a token stops the build with an error, so mistakes never go live.

## Pages

`/` · `/rooms` · `/bakery-restaurant` · `/weddings-events` · `/history-location` · `/privacy` · `404`

Local SEO pages: `/accommodation-near-bethlehem` · `/r76-stopover` · `/accommodation-reitz-petrus-steyn-arlington` · `/verblyf-lindley` (Afrikaans). See `docs/LOCAL-SEO.md`.

FAQs are written as a `faq` list in a page's meta block and output both as the visible FAQ (`{{faqBlock}}`) and as FAQPage schema. FAQ text may use config tokens like `{{phoneDisplay}}`.

`sitemap.xml` and `robots.txt` are generated automatically.

## Deploy (Cloudflare Workers, static assets)

1. Push this repository to GitHub.
2. Cloudflare dashboard → **Workers & Pages → Create → Import a repository**.
3. Build command: `node build.js` · Deploy command: `npx wrangler deploy` (settings are in `wrangler.jsonc`).
4. Add the custom domain under the Worker's **Settings → Domains & Routes**.
5. Set `siteUrl` in `src/config.json` to the final domain, push, then submit `/sitemap.xml` in Google Search Console.

The output in `dist/` is plain HTML/CSS/JS, so it can also be hosted on any static host (Netlify, GitHub Pages, cPanel, etc.).

## Before going live

See `docs/CONTENT-CHECKLIST.md` – a short list of facts the hotel must confirm.

## Project documents

- `MASTER-RULES.md` – the development constitution this project follows
- `AI-INSTRUCTIONS.md` – read first if you are an AI coding assistant
- `ARCHITECTURE.md` – how the build works and why
- `CHANGELOG.md` – history of changes
