# portfolio-cv

[English](README.md) · **Português (BR)**

[![Deploy](https://github.com/omfgnick/portfolio-cv/actions/workflows/deploy.yml/badge.svg)](https://github.com/omfgnick/portfolio-cv/actions/workflows/deploy.yml)

Perfil profissional / currículo online de **Nicolas Mesquita Fernandes** —
Infrastructure & Incident Operations (NOC, suporte N1/N2/N3, SLA/MTTR, segurança,
automação com PowerShell / Bash / Python).

Online: <https://omfgnick.github.io/portfolio-cv/>

## Stack

Mesma stack e convenções da landing do **SynapseNutri**:

- **Vite + React 18 + TypeScript**
- **CSS Modules** com sistema de design tokens (`src/styles/tokens.css`) — paleta
  noir aurora (esmeralda → ciano → violeta)
- **`AuroraCanvas` WebGL** de fundo animado (com fallbacks de reduced-motion e
  sem WebGL), interações `SplitText` e `useSpotlight`
- ícones **lucide-react**; tipografia Fraunces + Inter + JetBrains Mono
- testes com **Vitest**
- conteúdo data-driven (`src/data/cv.ts`)

## Estrutura

```
src/
  main.tsx                 # entrada
  pages/Home.tsx           # o currículo inteiro (uma página, como a Home da landing)
  pages/Home.module.css
  components/
    aurora/                # AuroraCanvas, SplitText, useTilt, useSpotlight (kit compartilhado)
    qr/QRCode.tsx          # QR real e escaneável (encoder autocontido)
    qr/qrEncoder.ts        # byte-mode, ECC-M, Reed-Solomon; qrEncoder.test.ts
    Counter.tsx
  hooks/useReveal.ts
  data/cv.ts               # perfil, experiências, skills, certificações, contatos
  styles/tokens.css, global.css
```

## Scripts

```bash
npm install
npm run dev        # dev server (http://localhost:5173/portfolio-cv/)
npm run build      # type-check + build de produção → dist/
npm run preview    # pré-visualiza o build
npm test           # Vitest (round-trip do encoder de QR)
```

## Deploy

GitHub Pages via GitHub Actions ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)):
todo push na `main` faz type-check, roda os testes, builda e publica o `dist/`.
O `base` do Vite é `/portfolio-cv/` para casar com a URL do Pages do projeto.

## Notas

- O QR é um QR de verdade, escaneável, gerado do zero (sem biblioteca externa) —
  o teste unitário o decodifica de volta à URL do LinkedIn e valida as síndromes
  Reed-Solomon.
- As animações são à prova de falhas: reveal-on-scroll e contadores degradam com
  elegância quando `IntersectionObserver` / `requestAnimationFrame` não existem.
