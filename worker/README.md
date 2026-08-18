# Contador de visitas por país (Cloudflare Worker)

Backend minúsculo e **grátis** (plano free do Cloudflare Workers + KV) que conta
visitas **agregadas por país** — sem IP, sem cookies, sem PII (LGPD-friendly).
O país vem direto do edge da Cloudflare (`request.cf.country`).

O painel **"GLOBAL TRAFFIC"** no site aparece automaticamente assim que você
apontar `src/data/config.ts` para a URL do worker.

## Passo a passo (~5 min)

Pré-requisito: uma conta grátis em <https://dash.cloudflare.com>.

```bash
cd worker

# 1) login (abre o navegador)
npx wrangler login

# 2) cria o KV namespace e copia o "id" que aparecer
npx wrangler kv namespace create VISITS

# 3) cole esse id em wrangler.toml no lugar de SUBSTITUA_PELO_ID_DO_KV

# 4) publica o worker
npx wrangler deploy
```

O deploy imprime a URL pública, algo como:
`https://portfolio-visits.SEU-SUBDOMINIO.workers.dev`

## Ligar no site

Edite [`src/data/config.ts`](../src/data/config.ts):

```ts
export const VISITS_ENDPOINT = 'https://portfolio-visits.SEU-SUBDOMINIO.workers.dev'
```

Faça commit/push — o CI publica e o painel passa a mostrar os números reais.

## Rotas

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/hit` | incrementa total + país do visitante (chamado 1x por sessão) |
| `GET` | `/stats` | retorna `{ total, countries: [{ code, count }] }` |

## Notas

- O plano free do KV permite ~1.000 escritas/dia — mais que suficiente para um
  portfólio. O site só incrementa **uma vez por sessão** (`sessionStorage`).
- Só são armazenadas contagens por código de país (ex.: `BR`, `US`). Nenhum dado
  pessoal é gravado.
- Se preferir não manter backend, dá pra trocar por **GoatCounter** (hospedado,
  grátis) — me avise que adapto o painel para a API deles.
