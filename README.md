# Rayadh Abrar

[Portfolio](https://rayadh-abrar1.github.io/rayadhabrar/) · [Tutoring](https://rayadh-abrar1.github.io/rayadhabrar/tuitions.html)

This repository serves a static website from the root of the `main` branch on GitHub Pages. It uses plain HTML, CSS and JavaScript with no install or build step.

## Preview locally

```sh
python -m http.server 8080 --bind 127.0.0.1
```

Open [the local preview](http://127.0.0.1:8080/). The profile and timeline are in `index.html`. Tutoring subjects, enquiries and reviews are in `tuitions.html`. Update the downloadable tutoring PDF in `assets/` when the résumé changes. The sitemap lists the two public HTML pages.

## Tutoring reviews

The form encodes the rating and feedback into an email draft. The reviewer sends the draft from their email app. Feedback arrives by email and is reviewed before any publication. There is no public posting endpoint or client-side database.

## Security

Both pages restrict loaded resources through Content Security Policy and set a no-referrer policy. The portfolio runs without JavaScript. The tutoring page uses a local script for the email draft. The site uses HTTPS and has no external scripts, dependencies, analytics or credentials.

The policy is delivered in HTML. Controls that require HTTP headers, such as CSP `frame-ancestors`, would need a host or proxy that supports configurable response headers.
