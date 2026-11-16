# Video Editor Portfolio
Plain HTML/CSS/JS (GSAP + Lucide via CDN). Open `index.html` in a browser — no backend needed. For the best results run `python3 -m http.server` in this folder.

## Customize
- **Projects / showreel / testimonials / email:** top of `script.js`. Paste a Google Drive share URL for each video and set each file to “Anyone with the link” / Viewer. Drive thumbnails are generated automatically; videos load in a Drive preview modal only after a click. Categories must match the filter names (list in `cats`).
- **Name & text:** search `YOUR NAME` in `index.html`. Stats: `data-count` attributes. Social links: Contact and Footer sections.
- **Profile photo:** save as `assets/images/profile.jpg`.
- **Colors / fonts:** `:root` at the top of `style.css`.
- **Contact form:** uses a `mailto:` fallback (nothing is stored). To use a form service (Formspree, Web3Forms…), replace the `location.href` line in the submit handler with a `fetch` POST of the `FormData`.
- Intro plays once per session (`sessionStorage`); clear it or open a new tab to see it again.
