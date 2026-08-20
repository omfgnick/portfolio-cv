import { test as base, expect } from '@playwright/test'

/**
 * Fixture comum a todos os specs: o endpoint de visitas nunca é chamado de
 * verdade.
 *
 * Antes disso, cada execução da suíte batia no Worker de produção. Duas
 * consequências, as duas ruins:
 *
 *  - o teste "carrega sem erros de console" falhava de forma intermitente,
 *    porque sob carga o Worker devolvia erro de CORS e o erro caía no console
 *    da página. Passava isolado e falhava na suíte cheia, que é o pior tipo
 *    de falha para diagnosticar;
 *  - o plano gratuito do Cloudflare KV dá 1.000 escritas por dia somadas, e
 *    cada rodada de teste consumia parte dessa cota — em CI, a cada push.
 *
 * A resposta abaixo é estável, então o HUD e o painel de visitantes renderizam
 * sempre o mesmo número, o que também é o que a regressão visual precisa.
 */

const STATS = {
  total: 1234,
  live: 3,
  countries: [
    { code: 'BR', count: 900 },
    { code: 'US', count: 220 },
    { code: 'PT', count: 114 },
  ],
  days: Array.from({ length: 14 }, (_, i) => ({
    date: `2026-01-${String(i + 1).padStart(2, '0')}`,
    count: 10 + i,
  })),
  referrers: [{ host: 'github.com', count: 271 }],
}

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route('**/*.workers.dev/**', route => {
      const url = route.request().url()
      // /hit é POST e não devolve corpo útil; /stats alimenta a interface
      if (url.includes('/stats')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          headers: { 'access-control-allow-origin': '*' },
          body: JSON.stringify(STATS),
        })
      }
      return route.fulfill({ status: 204, headers: { 'access-control-allow-origin': '*' } })
    })
    await use(page)
  },
})

export { expect }
