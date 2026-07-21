# portfolio-cv

**English** · [Português (BR)](README.pt-BR.md)

Single-page professional profile / online CV for **Nicolas Mesquita Fernandes**
— Infrastructure & Incident Operations (NOC, N1/N2/N3 support, SLA/MTTR,
security, automation with PowerShell / Bash / Python).

Live: <https://omfgnick.github.io/portfolio-cv/>

## Overview

The whole site is a single, dependency-free [`index.html`](index.html):

- No build step, no frameworks, no external requests — HTML, inline CSS and
  vanilla JavaScript only.
- Light/dark theme, responsive layout, and a client-side search/filter over the
  experience sections.
- SEO and social metadata (Open Graph, Twitter card, JSON-LD `Person` schema)
  plus a restrictive Content-Security-Policy.

## Running locally

Because everything is self-contained, just open the file:

```bash
# option 1: open directly
open index.html          # macOS
start index.html         # Windows

# option 2: serve it (recommended, closer to production)
python -m http.server 8000
# then browse to http://localhost:8000
```

## Deployment

Hosted with **GitHub Pages** from the default branch. Any push updates the live
site at the URL above.

## Editing

All content and styling live in `index.html`. Update the relevant section in the
markup; there is nothing to compile or bundle.
