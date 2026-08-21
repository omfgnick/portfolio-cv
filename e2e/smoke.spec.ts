import { test, expect } from './fixtures'
import AxeBuilder from '@axe-core/playwright'

/** Coleta erros de console para falhar em qualquer erro em runtime. */
function trackConsole(page: import('@playwright/test').Page) {
  const errors: string[] = []
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })
  page.on('pageerror', e => errors.push(String(e)))
  return errors
}

test.describe('portfolio-cv', () => {
  // Garante que o app React montou (listeners de teclado ativos) antes de cada teste
  test.beforeEach(async ({ page }) => {
    await page.goto('./')
    await expect(page.locator('#main-content')).toBeVisible()
    await expect(page.getByTestId('theme-toggle')).toBeVisible()
  })

  test('carrega sem erros de console', async ({ page }) => {
    const errors = trackConsole(page)
    await page.reload()
    await expect(page).toHaveTitle(/Nicolas/i)
    await expect(page.locator('#main-content')).toBeVisible()
    expect(errors, errors.join('\n')).toEqual([])
  })

  test('toggle de tema alterna data-theme', async ({ page }) => {
    const root = page.locator('html')
    const before = await root.getAttribute('data-theme')
    await page.getByTestId('theme-toggle').click()
    await expect(root).not.toHaveAttribute('data-theme', before ?? '')
  })

  test('toggle de idioma alterna PT/EN', async ({ page }) => {
    const btn = page.getByTestId('lang-toggle')
    const before = (await btn.innerText()).trim()
    await btn.click()
    await expect(btn).not.toHaveText(before)
    await expect(page.locator('html')).toHaveAttribute('lang', /pt|en/)
  })

  test('Ctrl+K abre a command palette e Esc fecha', async ({ page }) => {
    await page.keyboard.press('Control+k')
    const dialog = page.getByRole('dialog', { name: /command palette/i })
    await expect(dialog).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(dialog).toHaveCount(0)
  })

  test('skip link fica visível ao focar e leva ao conteúdo', async ({ page }) => {
    await page.keyboard.press('Tab')
    const skip = page.locator('a[href="#main-content"]')
    await expect(skip).toBeFocused()
  })

  test('CV em PDF está disponível para download (200)', async ({ page, request }) => {
    const link = page.getByTestId('pdf-download')
    await expect(link).toHaveAttribute('download', '')
    const href = await link.getAttribute('href')
    expect(href).toMatch(/cv-nicolas-mesquita-(pt|en)\.pdf$/)
    const res = await request.get(new URL(href!, page.url()).toString())
    expect(res.status()).toBe(200)
    expect(res.headers()['content-type']).toContain('pdf')
  })

  test('deep link da seção copia URL com idioma e ancora', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await page.locator('#praise').scrollIntoViewIfNeeded()
    await page.locator('#praise button[aria-label]').first().click()
    const copied = await page.evaluate(() => navigator.clipboard.readText())
    expect(copied).toMatch(/\?lang=(pt|en)#praise$/)
  })

  test('depoimentos exibem as recomendações reais', async ({ page }) => {
    const cards = page.locator('#praise figure')
    await expect(cards).toHaveCount(2)
    // nomes são iguais nos dois idiomas; a citação varia (pt literal / en traduzido)
    await expect(cards.first()).toContainText('Alexsandro Romão Dias')
    await expect(cards.nth(1)).toContainText('Lafaiete Rodrigues Machado')
    await expect(cards.nth(1).locator('blockquote'))
      .toHaveText(/sem restrições|without reservation/)
    await expect(page.locator('#praise')).toContainText(/LinkedIn/)
  })

  test('linha do tempo abre a experiência correspondente', async ({ page }) => {
    const bars = page.locator('#experience ol li button')
    await expect(bars).toHaveCount(10)
    // com filtro ativo, clicar numa barra deve limpar a busca e revelar a vaga
    await page.getByRole('searchbox').fill('zebra')
    await expect(page.locator('#experience [id^=job-]')).toHaveCount(1)
    await bars.nth(7).click()
    await expect(page.getByRole('searchbox')).toHaveValue('')
    await expect(page.locator('#job-7')).toHaveAttribute('data-open', 'true')
  })

  test('modo recrutador abre, fecha e limpa a URL', async ({ page }) => {
    await page.getByTestId('recruiter-open').click()
    const dialog = page.getByRole('dialog', { name: /30 (segundos|seconds)/i })
    await expect(dialog).toBeVisible()
    await expect(page).toHaveURL(/view=quick/)
    await expect(dialog.getByTestId('rv-pdf')).toHaveAttribute('download', '')
    await page.keyboard.press('Escape')
    await expect(dialog).toHaveCount(0)
    await expect(page).not.toHaveURL(/view=quick/)
  })

  test('?view=quick abre o resumo direto e cabe numa tela', async ({ page }) => {
    await page.goto('./?view=quick')
    const card = page.locator('[role=dialog] > div')
    await expect(card).toBeVisible()
    const fits = await card.evaluate(el => el.scrollHeight <= el.clientHeight + 2)
    expect(fits, 'o resumo deve caber sem rolagem').toBe(true)
  })

  // A varredura do axe nesta página leva ~25s; com vários workers em paralelo
  // o limite padrão de 30s estoura (falha por tempo, não por violação).
  const AXE_TIMEOUT = 90_000

  async function axeCheck(page: import('@playwright/test').Page) {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()
    const serious = results.violations.filter(v => v.impact === 'serious' || v.impact === 'critical')
    return serious.map(v => `${v.id} (${v.impact}) — ${v.nodes.length}x: ${v.nodes[0]?.html?.slice(0, 90)}`)
  }

  test('breach protocol abre pelo terminal e respeita a regra do jogo', async ({ page }) => {
    // O titulo do dialogo agora e traduzido, entao o teste fixa o idioma em
    // vez de depender do locale do navegador que roda a suite.
    await page.goto('./?lang=en')
    const term = page.locator('#nm-term-input')
    await term.click()
    await term.fill('breach')
    await term.press('Enter')

    const dlg = page.getByRole('dialog', { name: 'Breach Protocol' })
    await expect(dlg).toBeVisible()

    // Primeira jogada: a linha 0 inteira esta liberada, e so ela
    const playable = dlg.locator('button[role=gridcell]:not([disabled])')
    await expect(playable).toHaveCount(5)

    // Depois de jogar, a selecao fica presa na coluna da escolha anterior:
    // sobram 4 (as 5 da coluna menos a celula ja usada)
    await playable.first().click()
    await expect(dlg.locator('button[role=gridcell]:not([disabled])')).toHaveCount(4)

    await page.keyboard.press('Escape')
    await expect(dlg).toBeHidden()
  })

  test('o painel mostra o engajamento que o worker ja coletava', async ({ page }) => {
    const painel = page.getByLabel(/Tráfego de visitantes|Visitor traffic/)
    await painel.scrollIntoViewIfNeeded()
    await expect(painel).toContainText(/WHAT PEOPLE DO|O QUE AS PESSOAS FAZEM/)
    await expect(painel).toContainText(/412/)               // sessoes do fixture
    await expect(painel).toContainText(/Downloaded the CV|Baixou o CV/)
    // 5 baldes de rolagem + 4 de permanencia
    await expect(painel.locator('[class*="barWrap"]')).toHaveCount(9)
  })

  test('sem engajamento, a faixa nao aparece em vez de mostrar moldura vazia', async ({ page }) => {
    await page.route('**/*.workers.dev/**', r => r.fulfill({
      status: 200, contentType: 'application/json',
      headers: { 'access-control-allow-origin': '*' },
      body: JSON.stringify({ total: 5, countries: [], days: [], referrers: [], live: 0, engagement: {} }),
    }))
    await page.goto('./')
    const painel = page.getByLabel(/Tráfego de visitantes|Visitor traffic/)
    await expect(painel).toBeVisible()
    await expect(painel).not.toContainText(/WHAT PEOPLE DO|O QUE AS PESSOAS FAZEM/)
  })

  test('modo scanner liga pela tecla S e desliga com Esc', async ({ page }) => {
    const raiz = page.locator('html')
    await expect(raiz).not.toHaveAttribute('data-scan', 'on')

    await page.keyboard.press('s')
    await expect(raiz).toHaveAttribute('data-scan', 'on')

    await page.keyboard.press('Escape')
    await expect(raiz).not.toHaveAttribute('data-scan', 'on')
  })

  test('a tecla S dentro de um campo de texto NAO liga o scanner', async ({ page }) => {
    // Sem esta guarda, digitar "sla" na busca ligaria e desligaria o scanner
    // no meio da palavra - e o usuario nao faria ideia do porque.
    const busca = page.getByRole('searchbox')
    await busca.click()
    await busca.fill('sla')
    await expect(page.locator('html')).not.toHaveAttribute('data-scan', 'on')
    await expect(busca).toHaveValue('sla')
  })

  test('o botao do HUD tambem alterna o scanner', async ({ page }) => {
    const botao = page.getByTestId('scan-toggle')
    await expect(botao).toHaveAttribute('aria-pressed', 'false')
    await botao.click()
    await expect(botao).toHaveAttribute('aria-pressed', 'true')
    await expect(page.locator('html')).toHaveAttribute('data-scan', 'on')
  })

  test('sem violações sérias de acessibilidade (axe)', async ({ page }) => {
    test.setTimeout(AXE_TIMEOUT)
    const found = await axeCheck(page)
    expect(found, found.join('\n')).toEqual([])
  })

  test('acessibilidade também no tema claro', async ({ page }) => {
    test.setTimeout(AXE_TIMEOUT)
    await page.getByTestId('theme-toggle').click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
    const found = await axeCheck(page)
    expect(found, found.join('\n')).toEqual([])
  })

  test('acessibilidade com o scanner ligado', async ({ page }) => {
    // O scanner cobre a pagina de rotulos em amarelo; se algum ficar ilegivel,
    // e aqui que aparece.
    test.setTimeout(AXE_TIMEOUT)
    await page.getByTestId('scan-toggle').click()
    await expect(page.locator('html')).toHaveAttribute('data-scan', 'on')
    const found = await axeCheck(page)
    expect(found, found.join('\n')).toEqual([])
  })

  test('acessibilidade no modo recrutador', async ({ page }) => {
    test.setTimeout(AXE_TIMEOUT)
    await page.getByTestId('recruiter-open').click()
    await expect(page.getByRole('dialog')).toBeVisible()
    const found = await axeCheck(page)
    expect(found, found.join('\n')).toEqual([])
  })
})

// Primeira visita sem preferência salva: o idioma vem do navegador
test.describe('detecção de idioma', () => {
  test.describe('visitante en-US', () => {
    test.use({ locale: 'en-US' })
    test('abre em inglês', async ({ page }) => {
      await page.goto('./')
      await expect(page.getByTestId('lang-toggle')).toHaveText(/EN/)
      await expect(page.locator('html')).toHaveAttribute('lang', 'en')
      await expect(page.locator('a[href="#main-content"]')).toHaveText(/Skip to content/i)
    })
  })

  test.describe('visitante pt-BR', () => {
    test.use({ locale: 'pt-BR' })
    test('abre em português', async ({ page }) => {
      await page.goto('./')
      await expect(page.getByTestId('lang-toggle')).toHaveText(/PT/)
      await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR')
    })
  })

  test('?lang= tem precedência sobre o navegador', async ({ page }) => {
    await page.goto('./?lang=en')
    await expect(page.getByTestId('lang-toggle')).toHaveText(/EN/)
  })
})
