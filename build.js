#!/usr/bin/env node
/*
 * Lindley Hotel – static site builder.
 *
 * Zero dependencies: needs only Node.js 18+.
 *   node build.js        → builds the site into ./dist
 *
 * How it works
 *  - src/config.json holds every business fact (phone, address, hours, booking link…).
 *  - src/partials/*.html are shared pieces (header, footer, <head>).
 *  - src/pages/*.html are the pages. Each starts with a <!--meta {...} --> JSON block.
 *  - {{dotted.path}} tokens are replaced with values from config.json (HTML-escaped).
 *  - {{> name}} includes a partial. {{page.x}} reads the page's meta block.
 *  - public/ is copied as-is into dist/ (images, CSS, JS, icons).
 *  - sitemap.xml and robots.txt are generated.
 * An unknown token stops the build, so typos never reach the live site.
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SRC = path.join(ROOT, 'src');
const OUT = path.join(ROOT, 'dist');

const config = JSON.parse(fs.readFileSync(path.join(SRC, 'config.json'), 'utf8'));

const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const get = (obj, dotted) => dotted.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);

const partials = Object.fromEntries(
  fs.readdirSync(path.join(SRC, 'partials'))
    .filter((f) => f.endsWith('.html'))
    .map((f) => [f.replace(/\.html$/, ''), fs.readFileSync(path.join(SRC, 'partials', f), 'utf8')])
);

/* ---------- generated snippets ---------- */
const a = config.address;
const fullAddress = `${a.street}, ${a.town}, ${a.postalCode}, ${a.province}`;

function socialLinks() {
  const items = [];
  if (config.social.facebook) items.push(`<a href="${esc(config.social.facebook)}" rel="noopener" target="_blank">Facebook</a>`);
  if (config.social.instagram) items.push(`<a href="${esc(config.social.instagram)}" rel="noopener" target="_blank">Instagram</a>`);
  return items.length ? `<p class="footer-social">Follow us: ${items.join(' · ')}</p>` : '';
}

function hoursList() {
  const rows = [
    { label: 'Check-in', value: `${config.checkInFrom} – ${config.checkInTo}` },
    { label: 'Check-out', value: `By ${config.checkOutBy}` },
    { label: 'Bakery & take-away', value: config.bakeryHours },
    { label: 'Restaurant', value: config.restaurantHours },
  ];
  return rows
    .map((h) => `<li><span>${esc(h.label)}</span><span>${esc(h.value)}</span></li>`)
    .join('\n');
}

function hotelJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    '@id': config.siteUrl + '/#hotel',
    name: config.name,
    alternateName: config.alternateNames,
    description: config.seoDescription,
    url: config.siteUrl + '/',
    image: config.siteUrl + '/assets/img/og-image.jpg',
    logo: config.siteUrl + '/assets/img/logo-ink.png',
    telephone: config.phoneIntl,
    email: config.email || undefined,
    priceRange: `From ${config.fromPrice} per night`,
    currenciesAccepted: 'ZAR',
    checkinTime: config.checkInFrom,
    checkoutTime: config.checkOutBy,
    petsAllowed: undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: a.street,
      addressLocality: a.town,
      postalCode: a.postalCode,
      addressRegion: a.province,
      addressCountry: a.country,
    },
    hasMap: config.mapsUrl,
    containedInPlace: { '@type': 'City', name: 'Lindley, Free State' },
    amenityFeature: config.amenities.map((n) => ({ '@type': 'LocationFeatureSpecification', name: n, value: true })),
    department: [
      { '@type': 'Bakery', name: `${config.name} Bakery & Take-Away`, telephone: config.phoneIntl, address: { '@type': 'PostalAddress', streetAddress: a.street, addressLocality: a.town, postalCode: a.postalCode, addressRegion: a.province, addressCountry: a.country }, openingHours: config.bakeryOpeningHoursSchema },
      { '@type': 'Restaurant', name: `${config.name} Restaurant`, telephone: config.phoneIntl, servesCuisine: 'South African', address: { '@type': 'PostalAddress', streetAddress: a.street, addressLocality: a.town, postalCode: a.postalCode, addressRegion: a.province, addressCountry: a.country }, openingHours: config.restaurantOpeningHoursSchema },
    ],
    sameAs: [config.lekkeslaapUrl, config.social.facebook, config.social.instagram, config.googleBusinessUrl].filter(Boolean),
  };
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

// FAQ text may use {{config.tokens}}; fill them with plain values before escaping.
const fill = (str) => String(str).replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, k) => {
  const v = get(config, k);
  if (v === undefined || typeof v === 'object') throw new Error(`Unknown token {{${k}}} in FAQ`);
  return v;
});

function faqHtml(faq) {
  if (!faq || !faq.length) return '';
  return faq.map((f) => `<details class="faq"><summary>${esc(fill(f.q))}</summary><p>${esc(fill(f.a))}</p></details>`).join('\n');
}

function faqJsonLd(faq) {
  if (!faq || !faq.length) return '';
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({ '@type': 'Question', name: fill(f.q), acceptedAnswer: { '@type': 'Answer', text: fill(f.a) } })),
  };
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

function breadcrumbJsonLd(page) {
  if (!page.crumb) return '';
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: config.siteUrl + '/' },
      { '@type': 'ListItem', position: 2, name: page.crumb, item: config.siteUrl + page.path },
    ],
  };
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

function nearbyLinks() {
  return config.nearbyPages.map((p) => `<li><a href="${esc(p.path)}">${esc(p.label)}</a></li>`).join('\n');
}

function townTags() {
  return config.nearbyTowns.map((t) => `<li><span class="town-name">${esc(t.name)}</span><span class="town-note">${esc(t.note)}</span></li>`).join('\n');
}

const waIcon = '<svg class="wa-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.7 14.9L2 22l5.3-1.4A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.3-.5.1-1 .1-3.3-.8-2.8-1.1-4.5-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2.1 1-2.4c.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.4.6-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.4 1.8 2.2 1.2 1.1 2.2 1.4 2.5 1.6.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.5.3.1.2.1.7-.1 1.4z"/></svg>';

const generated = {
  fullAddress: esc(fullAddress),
  socialLinks: socialLinks(),
  hoursList: hoursList(),
  hotelJsonLd: hotelJsonLd(),
  nearbyLinks: nearbyLinks(),
  townTags: townTags(),
  waIcon,
  cssVersion: String(Math.floor(Date.now() / 1000)),
  year: String(new Date().getFullYear()),
  whatsappUrl: esc(`https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(config.whatsappGreeting)}`),
};
const perPage = (page) => ({
  faqBlock: faqHtml(page.faq),
  pageJsonLd: faqJsonLd(page.faq) + breadcrumbJsonLd(page),
});

/* ---------- templating ---------- */
function render(tpl, page, depth = 0) {
  if (depth > 5) throw new Error('Partials nested too deeply');
  return tpl
    .replace(/\{\{>\s*([\w-]+)\s*\}\}/g, (_, name) => {
      if (!(name in partials)) throw new Error(`Unknown partial "${name}" in ${page.file}`);
      return render(partials[name], page, depth + 1);
    })
    .replace(/\{\{\s*nav:([\w-]+)\s*\}\}/g, (_, key) => (page.nav === key ? 'aria-current="page"' : ''))
    .replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, key) => {
      if (key in generated) return generated[key];
      const pp = perPage(page);
      if (key in pp) return pp[key];
      if (key.startsWith('page.')) {
        const v = get(page, key.slice(5));
        if (v === undefined) throw new Error(`Unknown token {{${key}}} in ${page.file}`);
        return esc(v);
      }
      const v = get(config, key);
      if (v === undefined || typeof v === 'object') throw new Error(`Unknown token {{${key}}} in ${page.file}`);
      return esc(v);
    });
}

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const s = path.join(from, entry.name);
    const d = path.join(to, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

/* ---------- build ---------- */
fs.rmSync(OUT, { recursive: true, force: true });
copyDir(path.join(ROOT, 'public'), OUT);

const sitemap = [];
const pageFiles = fs.readdirSync(path.join(SRC, 'pages')).filter((f) => f.endsWith('.html'));

for (const file of pageFiles) {
  const raw = fs.readFileSync(path.join(SRC, 'pages', file), 'utf8');
  const m = raw.match(/^<!--meta\s*([\s\S]*?)-->\s*/);
  if (!m) throw new Error(`${file} is missing its <!--meta {...} --> block`);
  const meta = JSON.parse(m[1]);
  const page = {
    file,
    lang: 'en-ZA',
    ...meta,
    canonical: config.siteUrl + meta.path,
    robots: meta.noindex ? 'noindex, follow' : 'index, follow',
  };
  const body = render(raw.slice(m[0].length), page);
  const html = render(partials.layout, page).replace('<!--CONTENT-->', body);
  fs.writeFileSync(path.join(OUT, file), html);
  if (!meta.noindex) sitemap.push({ loc: page.canonical, priority: meta.priority || '0.7' });
}

const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(
  path.join(OUT, 'sitemap.xml'),
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    sitemap
      .sort((x, y) => y.priority - x.priority)
      .map((u) => `  <url><loc>${u.loc}</loc><lastmod>${today}</lastmod><priority>${u.priority}</priority></url>`)
      .join('\n') +
    '\n</urlset>\n'
);
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${config.siteUrl}/sitemap.xml\n`);

console.log(`Built ${pageFiles.length} pages into dist/`);
