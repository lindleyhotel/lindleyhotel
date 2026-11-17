# Changelog

## 0.3.0 – 2026-11-17
- Rooms page now follows LekkeSlaap's six room types with "from" prices (in `roomPrices` in config): Luxury, Standard Double, Basic Double, Standard Twin, Standard Triple, Classic Triple.
- Real room photos (WebP, two sizes each) with a tap-to-zoom photo viewer (swipe/arrow keys), plus a "No two rooms are the same" gallery.
- Kitchen gallery (platters and salads) on Bakery & Restaurant; table setting and platter photos on Weddings & Events.
- Home page shows a three-photo room teaser.
- Replaced "family room" wording site-wide (LekkeSlaap has no family room type).
- Grounds photos: "Around the hotel" strip on Home, "The grounds" gallery on History & Location (gardens, courtyard, church tower, storms, details).
- Bakery front and shelves on Bakery & Restaurant; bread rolls and the dining room in the kitchen gallery.
- Weddings & Events rebuilt around real wedding photos: photo hero, chapel/celebration/stay chapters, "A day at the Lindley Hotel" gallery, garden photo-spots section.
- Restaurant: "Hearty plates & proper puddings" gallery; more platters, breads and cakes in the groups gallery.
- Weddings & Events chapters previously showed the chapel pews, the reception table and the Luxury Room dressed for a special occasion.

## 0.2.0 – 2026-11-17
- Local SEO: town pages for Bethlehem, the R76 route (Kroonstad/Steynsrus/Gauteng) and Nketoana (Reitz, Petrus Steyn, Arlington), plus an Afrikaans page (/verblyf-lindley).
- "Where we are" nearby-towns section, Nearby footer column, Things to do in Lindley.
- FAQ system with FAQPage schema; breadcrumb schema; Hotel schema now includes bakery and restaurant departments with hours.
- WhatsApp-first touches from the Oosthuizen and Afrikken sites: WhatsApp button in header and hero, trust line, "How booking works" steps.
- CSS cache-busting on each build.

## 0.1.0 – 2026-11-17
- First version: home, rooms, bakery & restaurant, weddings & events, history & location, privacy and 404 pages.
- Zero-dependency build (`build.js`) with central `src/config.json`.
- All booking buttons link to the LekkeSlaap listing; call and WhatsApp alternatives; mobile quick-action bar.
- Hotel JSON-LD, Open Graph, sitemap.xml, robots.txt, security headers.
- Logo extracted onto a transparent background (ink and cream versions); hero photo and icons converted to WebP/PNG.
- Room photos are placeholders until real photos are supplied.
