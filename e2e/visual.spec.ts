import type { Page, Locator } from '@playwright/test'
import { test, expect } from './fixtures'

/**
 * Regressão visual.
 *
 * Já existiu aqui antes e foi removida: falhava em ~metade das execuções e
 * ninguém confiava mais no resultado, que é o pior estado possível para um
 * teste. As fontes das falhas eram sempre as mesmas, e agora estão tratadas
 * uma a uma:
 *
 *  - aurora em WebGL, que desenha ruído diferente a cada frame → mascarada;
 *  - relógio do HUD, que muda a cada segundo → mascarado;
 *  - contador de visitas, que depende de rede → mascarado;
 *  - terminal, que digita as linhas ao longo do tempo → mascarado;
 *  - LEDs, cursores e o brilho do nome, todos animados → `animations: 'disabled'`
 *    congela, e o tema já roda com reducedMotion no config;
 *  - webfont ainda carregando no momento da captura → espera document.fonts.ready.
 *
 * Roda como projeto separado (`--project=visual`) e fica fora da suíte padrão:
 * os snapshots são por plataforma, e sem a baseline de Linux no repositório
 * isso derrubaria o CI por falta de arquivo, não por regressão de verdade.
 */

/** O que ainda muda depois de congelar as animações: mascarado na captura. */
function unstable(page: Page): Locator[] {
  return [
    page.getByTestId('hud-clock'),          // relógio, muda a cada segundo
    page.getByTestId('hud-visits'),         // contador, depende de rede
  ]
}

async function settle(page: Page) {
  await page.keyboard.press('Escape')            // pula o boot

  // A aurora é WebGL num rAF: 'animations: disabled' não a alcança, e o
  // canvas fica atrás de tudo, aparecendo nos vãos entre os cards. Com ela
  // rodando o screenshot nunca vê dois frames iguais e estoura o timeout -
  // foi exatamente isso que derrubou a versão anterior destes testes.
  await page.addStyleTag({
    content: `
      canvas { display: none !important; }
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
        caret-color: transparent !important;
      }
    `,
  })

  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(500)
}

test.describe('regressão visual', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.setViewportSize({ width: 1280, height: 900 })
    await settle(page)
  })

  test('seção de skills', async ({ page }) => {
    const el = page.locator('#skills')
    await el.scrollIntoViewIfNeeded()
    await page.waitForTimeout(400)
    await expect(el).toHaveScreenshot('skills.png', {
      animations: 'disabled',
      mask: unstable(page),
      // 1% de tolerancia deixava passar mudanca de cor em texto pequeno: a
      // etiqueta amarela trocada por laranja nao movia nem 1% dos pixels da
      // secao. Com 0,1% e threshold mais baixo o teste passa a ter dentes,
      // e ainda absorve antialiasing.
      maxDiffPixelRatio: 0.001,
      threshold: 0.12,
    })
  })

  test('seção de credenciais', async ({ page }) => {
    const el = page.locator('#credentials')
    await el.scrollIntoViewIfNeeded()
    await page.waitForTimeout(400)
    await expect(el).toHaveScreenshot('credentials.png', {
      animations: 'disabled',
      mask: unstable(page),
      // 1% de tolerancia deixava passar mudanca de cor em texto pequeno: a
      // etiqueta amarela trocada por laranja nao movia nem 1% dos pixels da
      // secao. Com 0,1% e threshold mais baixo o teste passa a ter dentes,
      // e ainda absorve antialiasing.
      maxDiffPixelRatio: 0.001,
      threshold: 0.12,
    })
  })

  test('barra lateral de navegação', async ({ page }) => {
    await expect(page.locator('nav').first()).toHaveScreenshot('rail.png', {
      animations: 'disabled',
      mask: unstable(page),
      // 1% de tolerancia deixava passar mudanca de cor em texto pequeno: a
      // etiqueta amarela trocada por laranja nao movia nem 1% dos pixels da
      // secao. Com 0,1% e threshold mais baixo o teste passa a ter dentes,
      // e ainda absorve antialiasing.
      maxDiffPixelRatio: 0.001,
      threshold: 0.12,
    })
  })
})
