# Student Laptop Finder

SW302 – User Interface Development, Assignment 2 (JavaScript & Tailwind CSS 4).

A five-page app to browse laptops, search and filter them, read full specifications,
save favorites and compare them side by side. All laptop data is loaded with `fetch()`
from `data/laptops.json`; styling uses Tailwind CSS 4 (installed locally, no CDN).

GitHub repository: **<paste your repo link here>**

## Install and build

```bash
npm install          # installs tailwindcss, @tailwindcss/cli and @tailwindcss/forms
npm run build        # builds src/input.css -> dist/output.css
npm run watch        # optional: rebuild automatically while you edit
```

## Run

`fetch()` does not work on pages opened directly as files, so start a local server,
for example **VS Code Live Server** (right-click `index.html` -> *Open with Live Server*),
or run `python -m http.server` in this folder and open `http://localhost:8000`.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home page, theme switch, live statistics |
| `laptops.html` | Catalogue with search, filters, sorting and favorite buttons |
| `details.html?id=7` | Full specifications of one laptop |
| `favorites.html` | Saved laptops, total and average price, remove / clear all |
| `compare.html` | Side-by-side comparison of 2–4 favorites with best values highlighted |

## Code structure (`src/js`)

| File | Job |
| --- | --- |
| `api.js` | `fetchLaptops()` with async/await and try/catch |
| `storage.js` | Favorites, comparison picks and theme in localStorage |
| `ui.js` | Card, skeleton, message and favorite-button helpers (shared by pages) |
| `compare.js` | Specification rows, best-value logic, comparison table |
| `layout.js` | Header, navigation, theme switch and footer for every page |
| `theme-init.js` | Applies the saved theme before first paint (no flash) |
| `home.js`, `catalogue.js`, `details.js`, `favorites.js`, `comparePage.js` | One small file per page |

## Tailwind setup (`src/input.css`)

- `@import "tailwindcss";` and `@plugin "@tailwindcss/forms";`
- Two themes defined with `@theme` tokens: **Performance Mode** (dark + orange, default)
  and **Battery Saver Mode** (light + green, `data-theme="battery"`).
- Components in `@layer components` with `@apply`: `.laptop-card`, `.btn-action`,
  `.btn-outline`, `.panel`, `.field`, `.nav-link`.

## Notes

- Prices are in Egyptian pounds (EGP). The two laptop photos in `assets/` are shared by all laptops;
  change the `image` field in `data/laptops.json` to give a laptop its own photo.
- Saved data lives in localStorage under the keys `lf-favorites`, `lf-compare` and `lf-theme`.
