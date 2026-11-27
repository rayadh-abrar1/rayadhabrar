# Rayadh Abrar

[Portfolio](https://rayadhabrar.pages.dev/) · [Tutoring](https://rayadhabrar.pages.dev/tuitions.html)

This repository serves a static website from the root of the `main` branch on Cloudflare Pages (free plan) at https://rayadhabrar.pages.dev. GitHub Pages still serves a copy whose canonical tags point to Cloudflare. It uses plain HTML, CSS and JavaScript with no install or build step.

## Preview locally

```sh
python -m http.server 8080 --bind 127.0.0.1
```

Open [the local preview](http://127.0.0.1:8080/). The profile and timeline are in `index.html`. Tutoring subjects, enquiries and reviews are in `tuitions.html`. Update the downloadable tutoring PDF in `assets/` when the résumé changes. The sitemap lists the two public HTML pages.

## Tutoring reviews

The review form posts to `/api/reviews`, a Cloudflare Pages Function in `functions/`. New reviews are stored as pending in the `REVIEWS` KV namespace and appear on the tutoring page only after approval at `/admin.html`, which asks for the `ADMIN_TOKEN` secret set in the Cloudflare dashboard. Where no API exists (GitHub Pages, local preview), the form falls back to an email draft. Reviews written directly into `tuitions.html` always show.

## Search

Canonical URLs, Open Graph tags, JSON-LD (`Person`, `WebSite`, `Service`), `sitemap.xml` and `robots.txt` all use `https://rayadhabrar.pages.dev`. If the address changes, replace it across the repository.

## Security

Both pages restrict loaded resources through Content Security Policy and set a no-referrer policy. The portfolio runs without JavaScript. The tutoring page uses a local script for the email draft. The site uses HTTPS and has no external scripts, dependencies, analytics or credentials.

The policy is delivered in HTML. Controls that require HTTP headers, such as CSP `frame-ancestors`, would need a host or proxy that supports configurable response headers.
