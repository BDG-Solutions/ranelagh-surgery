# Ranelagh Surgery — website redesign concept

A redesign proposal for [ranelaghsurgery.com](https://ranelaghsurgery.com), built with the practice's existing content (About, Services, Opening times, Fees, Contact, Travel Vaccinations and Location pages), plus the Eircode and rating from its Google listing.

> This is a design concept, not the official website. It is excluded from search engines (`noindex` + `robots.txt`).

## What's improved

- **A real page description** — the current home page's search description is still the WordPress sample text ("This is an example page… I'm a bike messenger"). Here every page has a proper title and description.
- **Content on the home page** — the current home page shows three headings and one sentence. Here it shows today's appointment sessions, services, fees, out-of-hours cover and how to find the practice.
- **Phone numbers that dial** — every number (practice, Luke Doc, GP 24) is a `tel:` link, with a sticky Call / Book / Directions bar on phones.
- **Live opening status** — "Open now / Closed · opens at…" (Irish time), and a "today's line" showing the morning and evening sessions and then the out-of-hours services, in order.
- **Out-of-hours care made clear** — Luke Doc and GP 24, with hours, address, fees and call buttons, on the home page and the Opening times page.
- **Social proof** — the 4.5★ Google rating (41 reviews) under the main call button, linked to the Google listing.
- **Booking by phone made obvious** — the practice books by phone only, so "Book" leads to a big call button. A separate form prepares a general (non-appointment) email to the practice. No server needed.
- **Outdated notices removed** — the old Christmas opening times and the separate "Temporarily Suspended" travel vaccinations page are replaced by a note on the Services page.
- **Getting here** — next to Beechwood Luas (Green Line), with map, copy-address button and directions.
- **The practice's own icon** — the heartbeat symbol from the current site header, used as the logo mark and favicon.
- **Its own look** — a "Green Line" design after the Luas stop next door: condensed signage headings (Archivo), clear body text (Source Sans 3), the sky blue of the current site, a route-line motif for the practice day and a departure-board fee list.
- **Accessible** — semantic HTML, skip link, keyboard-friendly menu (focus trap, Esc to close), visible focus, reduced-motion support.

## Stack

Plain HTML, CSS and JavaScript (ES modules). No build step, no dependencies.

```
index.html        page shell
css/styles.css    design system and layout
js/data.js        all content: services, fees, hours, out-of-hours, contact details
js/app.js         router (#/, #/about, #/services, #/hours, #/fees, #/contact), pages and interactions
js/icons.js       inline SVG icons and logo mark
assets/           favicon
```

To change a fee, an opening time or any text, edit `js/data.js` — every page reads from it.

## Run locally

```bash
npx http-server . -p 5173
```

Then open http://127.0.0.1:5173. (ES modules don't load from `file://`, so use a local server.)

## Deploy

Any static host works (Hostinger, GitHub Pages, Netlify): upload the files as they are. Routing uses `#/` URLs, so no server rewrite rules are needed.

Before going live as the official site, remove the `noindex` meta tag from `index.html`, replace `robots.txt`, and remove the "design concept" note in the footer (`js/app.js`).

## Content to confirm with the practice

- Fees come from the current Fees page (no date shown) and are shown as a guide.
- Saturday opening ("suspended until further notice") and travel vaccinations ("temporarily suspended") may have changed.
- Out-of-hours details (Luke Doc, GP 24, their hours and fees) come from the current site and should be checked.
- The Eircode (D06 NR77) comes from the Google listing.
- Whether other doctors or a practice nurse should be listed (the site names a nurse for smears and blood tests, but not who).
- Photos of Dr Nikrow and the practice are needed for the marked photo spaces.
