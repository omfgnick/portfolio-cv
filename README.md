# portfolio-cv

**English** · [Português (BR)](README.pt-BR.md)

[![Deploy](https://github.com/omfgnick/portfolio-cv/actions/workflows/deploy.yml/badge.svg)](https://github.com/omfgnick/portfolio-cv/actions/workflows/deploy.yml)

Professional profile / online CV for **Nicolas Mesquita Fernandes** — Infrastructure
& Incident Operations (NOC, N1/N2/N3 support, SLA/MTTR, security, automation with
PowerShell / Bash / Python).

Live: <https://omfgnick.github.io/portfolio-cv/>

## Tech stack

Same stack and conventions as the **SynapseNutri** landing page:

- **Vite + React 18 + TypeScript**
- **CSS Modules** with a design-token system (`src/styles/tokens.css`) — noir
  aurora palette (emerald → cyan → violet)
- **WebGL `AuroraCanvas`** animated background (with reduced-motion + WebGL
  fallbacks), `SplitText`, `useSpotlight` interactions
- **lucide-react** icons; Fraunces + Inter + JetBrains Mono type
- **Vitest** unit tests
- Data-driven content (`src/data/cv.ts`)

## Project structure

```
src/
  main.tsx                 # entry
  pages/Home.tsx           # the whole CV (one page, like the landing's Home)
  pages/Home.module.css
  components/
    aurora/                # AuroraCanvas, SplitText, useTilt, useSpotlight (shared kit)
    qr/QRCode.tsx          # real, scannable QR (self-contained encoder)
    qr/qrEncoder.ts        # byte-mode, ECC-M, Reed-Solomon; qrEncoder.test.ts
    Counter.tsx
  hooks/useReveal.ts
  data/cv.ts               # profile, jobs, skills, certs, contacts
  styles/tokens.css, global.css
```

## Scripts

```bash
npm install
npm run dev        # dev server (http://localhost:5173/portfolio-cv/)
npm run build      # type-check + production build → dist/
npm run preview    # preview the production build
npm test           # Vitest (QR encoder round-trip)
```

## Deployment

GitHub Pages via GitHub Actions ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)):
every push to `main` type-checks, runs tests, builds, and deploys `dist/`. The
Vite `base` is `/portfolio-cv/` to match the project Pages URL.

## Notes

- The QR code is a genuine, scannable QR generated from scratch (no external
  library) — the unit test decodes it back to the LinkedIn URL and verifies the
  Reed-Solomon syndromes.
- Motion is fail-safe: reveal-on-scroll and counters degrade gracefully when
  `IntersectionObserver` / `requestAnimationFrame` are unavailable.
