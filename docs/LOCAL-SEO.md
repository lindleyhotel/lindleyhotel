# Local SEO plan – Lindley Hotel

Same approach as the Oosthuizen and Afrikken sites: town names in real content, a Google Business Profile, FAQ schema, and Search Console from day one.

## Built into the site
- **Titles & descriptions** name Lindley, Free State and the R76.
- **Hotel schema** (JSON-LD) with address, phone, check-in/out, amenities, and the bakery and restaurant as departments with opening hours.
- **FAQPage schema** generated from each page's `faq` list; **BreadcrumbList** on inner pages.
- **Town landing pages** with their own useful content (not copy-paste doorway pages):
  - `/accommodation-near-bethlehem`
  - `/r76-stopover` (Kroonstad – Steynsrus – Lindley – Bethlehem, and Gauteng travellers)
  - `/accommodation-reitz-petrus-steyn-arlington` (Nketoana)
  - `/verblyf-lindley` (Afrikaans, for "verblyf Lindley" / "akkommodasie Lindley" searches)
- **"Where we are" towns block** and a **Nearby** footer column link everything together.
- **Things to do in Lindley** on the History & Location page.
- Nearby towns and page links live in `src/config.json` (`nearbyTowns`, `nearbyPages`).

## To do after launch (owner / hotel)
1. **Google Business Profile** – claim or create "Lindley Hotel".
   - Primary category: *Hotel*. Additional: *Bakery*, *Restaurant*, *Wedding venue*.
   - Address exactly: 1 Pretorius Street, Lindley, 9630 (same as the site and LekkeSlaap).
   - Phone 063 115 6628, website link, hours, check-in/out, amenities.
   - Upload real photos regularly (rooms, bakery counter, food, chapel, veranda).
   - Put the profile link in `googleBusinessUrl` in `src/config.json` (it is added to the schema).
2. **Reviews** – ask happy guests for Google reviews and reply to every one. Never write or buy reviews.
3. **Search Console** – verify the domain (Cloudflare DNS makes this easy) and submit `/sitemap.xml`.
4. **Consistent details (NAP)** – make sure LekkeSlaap, Facebook, Google and any directories use the same name, address and phone.
5. **Local links** – ask Nketoana tourism pages, wedding directories, the Riemland route and local churches/schools to link to the site.
6. **Bing Places** – import from Google Business Profile (5 minutes).

## Adding another town page later
Copy one of the town pages, write genuinely different content for that town (distance, why people visit, FAQ), add it to `nearbyPages` in config, run `node build.js`.
