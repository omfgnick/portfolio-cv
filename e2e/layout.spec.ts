import { test, expect, type Page } from '@playwright/test'

/**
 * Guarda de layout.
 *
 * Substitui a regressão visual por screenshot: esta página tem WebGL, boot
 * animado, terminal que digita, contadores, chunks lazy e dados de rede, e a
 * comparação pixel a pixel oscilava ~50% das execuções — um gate que falha
 * sozinho ensina todo mundo a ignorar o vermelho. Aqui as asserções são sobre
 * geometria medida (estouro, corte, sobreposição, alvos de toque), que é
 * determinística e descreve o que de fato quebra.
 */

const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 720 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 812 },
]

async function open(page: Page, url = './?lang=pt') {
  await page.goto(url)
  await expect(page.locator('#main-content')).toBeVisible()
  await expect(page.getByTestId('theme-toggle')).toBeVisible()
}

for (const vp of VIEWPORTS) {
  test.describe(vp.name, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } })

    test('a página não rola na horizontal', async ({ page }) => {
      await open(page)
      const over = await page.evaluate(() => {
        const de = document.documentElement
        return de.scrollWidth - de.clientWidth
      })
      expect(over, `${over}px de estouro horizontal`).toBeLessThanOrEqual(1)
    })

    test('nenhum bloco vaza da largura da viewport', async ({ page }) => {
      await open(page)
      const leaks = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth
        const bad: string[] = []
        document.querySelectorAll<HTMLElement>('section, footer, figure, .panel').forEach(el => {
          const r = el.getBoundingClientRect()
          if (r.width === 0) return
          // margem de 2px para arredondamento de subpixel
          if (r.right > vw + 2 || r.left < -2) {
            bad.push(`${el.tagName}#${el.id || '—'} (${Math.round(r.left)}..${Math.round(r.right)} vs ${vw})`)
          }
        })
        return bad
      })
      expect(leaks, leaks.join('\n')).toEqual([])
    })

    test('a linha do tempo cabe no próprio quadro e mantém os rótulos', async ({ page }) => {
      await open(page)
      const r = await page.evaluate(() => {
        const wrap = document.querySelector('#experience div[class*="wrap"]') as HTMLElement
        const rows = Array.from(document.querySelectorAll('#experience ol li'))
        const wr = wrap.getBoundingClientRect()
        let labelled = 0, overlapping = 0
        rows.forEach(row => {
          const bar = row.querySelector('button') as HTMLElement
          const out = row.querySelector('span[class*="outer"]') as HTMLElement | null
          const hasInner = !!bar.querySelector('span')
          if (hasInner || out) labelled++
          if (out) {
            const br = bar.getBoundingClientRect(), lr = out.getBoundingClientRect()
            if (!(lr.right <= br.left + 1 || lr.left >= br.right - 1)) overlapping++
          }
        })
        return { rows: rows.length, labelled, overlapping, scrollsInside: wrap.scrollWidth > wrap.clientWidth, wrapRight: wr.right }
      })
      expect(r.rows).toBe(10)
      // toda posição precisa estar identificada, dentro ou ao lado da barra
      expect(r.labelled).toBe(r.rows)
      expect(r.overlapping, 'rótulo sobrepondo a barra').toBe(0)
    })

    test('alvos de toque têm tamanho utilizável', async ({ page }) => {
      await open(page)
      const small = await page.evaluate(() => {
        const bad: string[] = []
        document.querySelectorAll<HTMLElement>('nav a, [class*="hudIcon"], [class*="fab"]').forEach(el => {
          const r = el.getBoundingClientRect()
          if (r.width === 0 || r.height === 0) return
          if (r.width < 24 || r.height < 24) bad.push(`${el.getAttribute('aria-label') || el.textContent?.trim().slice(0, 20)}: ${Math.round(r.width)}x${Math.round(r.height)}`)
        })
        return bad
      })
      expect(small, small.join('\n')).toEqual([])
    })
  })
}

test.describe('resumo executivo', () => {
  for (const vp of [{ w: 1280, h: 720 }, { w: 1366, h: 768 }, { w: 1440, h: 900 }]) {
    test(`cabe sem rolagem em ${vp.w}x${vp.h}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.w, height: vp.h })
      await page.goto('./?view=quick')
      const card = page.locator('[role=dialog] > div')
      await expect(card).toBeVisible()
      const over = await card.evaluate(el => el.scrollHeight - el.clientHeight)
      expect(over, `${over}px além da tela`).toBeLessThanOrEqual(2)
    })
  }
})
