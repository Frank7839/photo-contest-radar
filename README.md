# Photo Contest Radar

Photography competitions you can enter from India, each with a rules panel covering eligibility, fees, file specs, editing and AI rules, and image rights. Plus photowalks, workshops, exhibitions and festivals around Hyderabad.

**Live app:** https://photo-contest-radar.franklin160371.workers.dev/

- **Competitions, exhibitions and grants** sorted by deadline, with a countdown on each card.
- **Rules & requirements** panel on every card. Seven contests have full rules read from the organiser's page; the rest come from directory listings and say so.
- **Badges** for free entry, AI images banned, and rights terms (*Limited licence*, *Rights grab*, *Rights unclear*). Every card is marked "verify" until checked by hand.
- **Filters:** free only, AI banned, full rules only, type (contests, exhibitions, grants), community challenges, search, and India & Hyderabad.
- **Events near me:** Hyderabad photo events, with a city filter.
- **Your own shortlist.** Mark contests Shortlist, Applied or Skip, and events Interested or Going. Choices are saved on your device only.

## Install it on your phone

- **Android (Chrome):** open the app and tap **Install app** at the top, or **⋮ → Install app**.
- **iPhone (Safari):** tap **Share → Add to Home Screen**.
- **Desktop (Chrome or Edge):** click the install icon in the address bar.

After the first visit it also opens offline, showing the last list it downloaded.

## How it works

Photo Contest Radar is a static web app served by a Cloudflare Worker.

| File | What it does |
|---|---|
| [`public/index.html`](public/index.html) | The app: contest and event lists, rules panels, filters, install button |
| [`public/data/radar.json`](public/data/radar.json) | The contest and event list. Updating this file and pushing is how new contests appear |
| [`public/sw.js`](public/sw.js) | Service worker: install and offline. Fetches the list fresh when online |
| [`public/manifest.webmanifest`](public/manifest.webmanifest) | App name, icons and colours for installing |
| [`worker/worker.js`](worker/worker.js) | The Cloudflare Worker: serves `public/`, adds security headers, keeps the list's cache short |
| [`wrangler.jsonc`](wrangler.jsonc) | Worker config. No secrets or bindings needed |

### The data file

`radar.json` has three parts: `meta` (last and next search dates), `contests` and `events`. Each contest carries `name`, `organizer`, `deadline` (YYYY-MM-DD), `url`, `fee`, `feeLevel` (`free`, `low`, `high` or `check`), `prize`, `eligibility`, `genres`, `rightsFlag` (`ok`, `limited`, `warn` or `unknown`), and optionally `type` (`A` contest, `E` exhibition or publication, `G` grant, `C` community challenge), `aiBanned`, `source` (`official` or `listing`), `verified`, `checkedAt` and a `rules` object. A full `rules` object has `eligibility`, `cost`, `submission` (list), `editing` (list), `photoDate`, `themes`, `dates`, `prizes` and `rightsText`. A short one has `basic: true` with `eligibility`, `cost`, `themes`, `prizes` and `note`.

Rules are summarised automatically and can be wrong. Always confirm on the official page before paying or uploading.

## Deploy

Connect this repo to Cloudflare once with Workers Builds, and every push to `main` redeploys the app automatically:

1. In the Cloudflare dashboard, go to **Workers & Pages → Create → Continue with GitHub**.
2. Pick **Frank7839/photo-contest-radar**.
3. Leave the build command empty. The deploy command is `npx wrangler deploy`.
4. Click **Deploy**. The app goes live at `photo-contest-radar.<your-subdomain>.workers.dev`.

To run it locally: `npx wrangler dev`, then open http://localhost:8787.

## License

MIT. See [LICENSE](LICENSE).
