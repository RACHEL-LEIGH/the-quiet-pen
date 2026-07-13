# The Quiet Pen

A premium writing studio that helps people find the right words for life's biggest moments —
starting with a guided wedding vows workbook, and expanding into speeches, letters, and
ghostwriting.

## Development

The site is built with [Eleventy](https://www.11ty.dev/). Page source lives in `src/`; `npm run build` generates the static site into `_site/` (not committed).

```
npm install
npm run serve   # local dev server with live reload at http://localhost:8080
npm run build   # one-off production build into _site/
```

- `src/_data/site.js` holds site-wide data: nav links, footer links, brand copy, and the guiding principle.
- `src/_data/workbooks.js` and `src/_data/testimonials.js` are the data sources for the "Life's Biggest Moments" roadmap and homepage testimonials (testimonials are fictional placeholders — replace with real reviews before launch).
- `src/_includes/base.njk` is the shared page shell (head, header, footer, sticky mobile CTA, floating contact button). `src/_includes/blog-post.njk` is the shared Journal article layout.
- `src/_includes/icons.njk` holds every inline SVG icon as a Nunjucks macro.
- `src/blog/*.njk` are individual Journal articles, collected automatically into `collections.blogPosts` (sorted newest first) via `.eleventy.js`.
- `src/css/style.css` is the whole design system: tokens, typography, and every shared component.
- `src/js/main.js` covers all interactivity — mobile nav, scroll-reveal, accordions' polish, animated stats, the newsletter/inquiry forms, and the confetti moment on a successful inquiry.

## Deployment

`netlify.toml` sets the build command (`npm run build`) and publish directory (`_site`) for deployment on [Netlify](https://www.netlify.com/) — connect this repo to a Netlify site to enable automatic deploys on push to `main`.
