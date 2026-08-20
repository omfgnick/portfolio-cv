import { test, expect } from './fixtures'

/**
 * Contraste dos tokens, tema a tema.
 *
 * Existe por causa de um defeito que passou por tudo: o preenchimento do painel
 * chanfrado (--panel-fill) nasceu no tema escuro, quase preto, e ficou sem par
 * no tema claro. O resultado foi painel preto com texto preto — contraste de
 * 1:1, a página inteira ilegível no modo claro, em produção.
 *
 * O axe não pegou, e não é culpa dele: o preenchimento é um pseudo-elemento
 * ::after, e o axe não conta o fundo de um ::after como fundo do texto que está
 * por cima. Este teste compara os tokens diretamente, que é onde o erro mora.
 */

const luminancia = (rgb: [number, number, number]) => {
  const [r, g, b] = rgb.map(v => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const contraste = (a: [number, number, number], b: [number, number, number]) => {
  const [l1, l2] = [luminancia(a), luminancia(b)].sort((x, y) => y - x)
  return (l1 + 0.05) / (l2 + 0.05)
}

async function corDoToken(page: import('@playwright/test').Page, nome: string) {
  return page.evaluate((n) => {
    // Deixa o próprio navegador resolver o token para rgb()
    const d = document.createElement('div')
    d.style.color = `var(${n})`
    document.body.appendChild(d)
    const cor = getComputedStyle(d).color
    d.remove()
    const m = cor.match(/\d+/g) || ['0', '0', '0']
    return [Number(m[0]), Number(m[1]), Number(m[2])] as [number, number, number]
  }, nome)
}

for (const tema of ['dark', 'light'] as const) {
  test(`o texto tem contraste sobre o preenchimento do painel — tema ${tema}`, async ({ page }) => {
    await page.goto('./')
    await page.evaluate(t => document.documentElement.setAttribute('data-theme', t), tema)
    await expect(page.locator('#main-content')).toBeVisible()

    const fundo = await corDoToken(page, '--panel-fill')
    const texto = await corDoToken(page, '--text-primary')
    const razao = contraste(fundo, texto)

    expect(
      razao,
      `--text-primary sobre --panel-fill no tema ${tema}: ${razao.toFixed(2)}:1 (mínimo 4.5)`,
    ).toBeGreaterThanOrEqual(4.5)
  })
}

test('nenhum token de cor do tema escuro fica sem par no claro', async ({ page }) => {
  await page.goto('./')
  const semPar = await page.evaluate(() => {
    const folha = [...document.styleSheets].flatMap(s => {
      try { return [...s.cssRules] } catch { return [] }
    }) as CSSStyleRule[]
    const pega = (sel: string) => {
      const r = folha.find(x => x.selectorText === sel)
      if (!r) return new Set<string>()
      return new Set([...r.style].filter(p => p.startsWith('--')))
    }
    const escuro = pega(':root')
    const claro = pega(':root[data-theme="light"]')
    // Geometria e tipografia podem ser compartilhadas; cor, não
    const cor = (n: string) => !/^--(font|text-(xs|sm|base|md|lg|xl|2xl|3xl)|weight|leading|tracking|radius|chamfer|ease)/.test(n)
    return [...escuro].filter(n => cor(n) && !claro.has(n))
  })
  expect(semPar, `tokens de cor sem par no tema claro: ${semPar.join(', ')}`).toEqual([])
})
