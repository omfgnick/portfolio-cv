# portfolio-cv

[English](README.md) · **Português (BR)**

Perfil profissional / currículo online de página única de **Nicolas Mesquita
Fernandes** — Infrastructure & Incident Operations (NOC, suporte N1/N2/N3,
SLA/MTTR, segurança, automação com PowerShell / Bash / Python).

Online: <https://omfgnick.github.io/>

## Visão geral

O site inteiro é um único [`index.html`](index.html) sem dependências:

- Sem etapa de build, sem frameworks, sem requisições externas — apenas HTML,
  CSS inline e JavaScript puro.
- Tema claro/escuro, layout responsivo e uma busca/filtro no lado do cliente
  sobre as seções de experiência.
- Metadados de SEO e redes sociais (Open Graph, Twitter card, JSON-LD do tipo
  `Person`), além de uma Content-Security-Policy restritiva.

## Rodando localmente

Como tudo é autocontido, basta abrir o arquivo:

```bash
# opção 1: abrir diretamente
open index.html          # macOS
start index.html         # Windows

# opção 2: servir (recomendado, mais próximo de produção)
python -m http.server 8000
# depois acesse http://localhost:8000
```

## Deploy

Hospedado com **GitHub Pages** a partir da branch padrão. Qualquer push atualiza
o site no ar na URL acima.

## Edição

Todo o conteúdo e o estilo ficam em `index.html`. Atualize a seção
correspondente na marcação; não há nada para compilar ou empacotar.
