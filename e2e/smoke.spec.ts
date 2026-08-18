import { test, expect } from '@playwright/test'
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

  test('sem violações sérias de acessibilidade (axe)', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()
    const serious = results.violations.filter(v => v.impact === 'serious' || v.impact === 'critical')
    const summary = serious.map(v => `${v.id} (${v.impact}) — ${v.nodes.length}x`).join('\n')
    expect(serious, summary).toEqual([])
  })
})
