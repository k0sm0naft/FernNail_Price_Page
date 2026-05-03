# Fern nail art — price page

Single-page price list and visit calculator for the Fern nail art studio.
Mobile-first, three languages (UA / RU / EN), data-driven content.

Live: <https://k0sm0naft.github.io/FernNail_Price_Page/> *(enable Pages once — see below)*

## Local development

```bash
npm install
npm run dev      # → http://localhost:5173
npm run build    # → ./dist
npm run preview  # serve ./dist locally
```

Requires Node 20+ and npm.

## Editing content

Everything that varies — categories, services, prices, contacts, UI strings —
lives in JSON. No JavaScript or HTML changes needed for routine edits.

| File | What lives here |
|---|---|
| `src/data/prices.json` | Categories and items. Add/remove either by editing this array. Each item has `id`, `labels.{ua,ru,en}`, and a `price` (or `range` like `"20-100"`). Optional flags: `from: true` (shows "from X" prefix), `info: "<tooltipKey>"` (shows an info-icon with tooltip from `tooltips`), `estimatePrice` (used by the calculator when `range` or `from` makes the headline price ambiguous). |
| `src/data/calculator.json` | Wizard steps. Each option references item IDs from `prices.json` via `addsItems` / `replacesItems` / `requires`. Removing an option's referenced item is safe — the calculator skips missing IDs. |
| `src/data/locales/{ua,ru,en}.json` | UI strings only (nav, hero, calculator labels, contact section). Service/category names are sourced from `prices.json`. |
| `src/data/config.json` | Brand, location, hours, social media URLs, payment placeholders. |

After editing, refresh the dev server — Vite reloads automatically.

## Deploy to GitHub Pages

A workflow is wired at `.github/workflows/deploy.yml`. It builds on every
push to `main` and publishes to GitHub Pages.

**One-time setup in the repo settings:** *Settings → Pages → Source: GitHub Actions.*

After that, push to `main` and the site updates within a minute.

If you move the site under a custom domain, set `VITE_BASE: /` in the
workflow `env:` block (or remove the variable entirely) so absolute paths
resolve at the domain root.

## Project layout

```
src/
├─ index.html               main page
├─ styles/                  tokens.css (design system) + main.css (layout)
├─ scripts/                 main.js bootstraps i18n, services, calculator, parallax
└─ data/                    JSON content described above
public/
└─ assets/{leaves,fonts}    static assets served at /assets/
.github/workflows/
└─ deploy.yml               npm build → GitHub Pages
refs/
└─ disign/                  source design package from Claude Design (kept for traceability)
```

## Roadmap

- Phase 3 — `/print/` route with QR for offline price sheets
- Phase 4 — payment modal (card copy + Monobank deep-link)
- Phase 5 — Instagram screenshot exporter (Stories / square / portrait, per category, per language)
- Phase 6 — PWA manifest, OG image, full favicon set
- Phase 7 — calculator v2: multi-select steps, conditional showIf

## Notes

- The script font `Hamiltone-Demo.otf` is a demo build; review licensing
  before commercial use. Free alternatives that pair well: Caveat,
  Sacramento, Allura, Pinyon Script (all on Google Fonts).
- All payment and contact details in `src/data/config.json` are placeholders.
  Replace before going live.
