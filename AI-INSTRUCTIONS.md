# Instructions for AI coding assistants

Read `MASTER-RULES.md`, `README.md` and `ARCHITECTURE.md` before changing anything.

## Rules for this project

1. **Facts come from `src/config.json`.** Never hard-code the phone number, email, address, hours, prices or the LekkeSlaap link in a page – add a key to config and use a `{{token}}`.
2. **Never invent business facts.** No made-up reviews, ratings, review counts, room prices, menu items, capacities or history. If something is unknown, leave it out and add it to `docs/CONTENT-CHECKLIST.md`.
3. **Reviews** link to the LekkeSlaap listing. Only quote a review on the site if the hotel supplies it and it is genuine.
4. **No dependencies** unless there is a clear need. The build is plain Node.js on purpose.
5. **Keep it fast:** WebP images, `loading="lazy"` below the fold, explicit `width`/`height`.
6. **Accessibility:** semantic HTML, visible focus, alt text, 44px+ tap targets, WCAG 2.2 AA contrast.
7. Run `node build.js` – it must finish without errors – and preview with `node serve.js`.
8. Add an entry to `CHANGELOG.md` for every meaningful change.
