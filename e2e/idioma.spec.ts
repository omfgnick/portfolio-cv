import { test, expect } from './fixtures'

/**
 * Consistência de idioma.
 *
 * Vários rótulos de cenário nasceram cravados em inglês e apareciam iguais nos
 * dois idiomas — DOSSIER, INSTALLED, os atributos, o lifepath. Um deles estava
 * ao contrário: o aria-label do boot era "Inicializando sistema" mesmo no modo
 * inglês, então um leitor de tela em inglês ouvia português.
 *
 * Este teste varre o texto renderizado e o dos rótulos de acessibilidade
 * procurando palavras que só podem existir no OUTRO idioma.
 *
 * Nomes próprios ficam de fora de propósito: produto (SolarWinds, Zabbix),
 * empresa, tecnologia (React, Vite) e "Night City" são iguais nos dois.
 */

/** Texto visível + aria-labels, que é onde os vazamentos se escondem. */
async function pageText(page: import('@playwright/test').Page) {
  return page.evaluate(() => {
    const visible = document.body.innerText
    const labels = [...document.querySelectorAll('[aria-label]')]
      .map(el => el.getAttribute('aria-label') || '')
      .join(' | ')
    return `${visible}\n${labels}`.toUpperCase()
  })
}

/**
 * O terminal digita as linhas ao longo de alguns segundos. Sem esperar, a
 * varredura rodava com metade do texto na tela e um vazamento real
 * ('systems operational' na linha de status, em portugues) passou batido ate
 * eu conferir o site publicado na mao.
 */
async function esperarTerminal(page: import('@playwright/test').Page) {
  const body = page.getByTestId('term-body')
  await body.waitFor()
  // '$status' e o penultimo comando e e igual nos dois idiomas, entao serve de
  // ancora sem depender justamente do texto que este teste vai inspecionar.
  await expect(body).toContainText('$status', { timeout: 10000 })
  await expect(body).toContainText('●', { timeout: 10000 })
}

// Palavras que, aparecendo, denunciam o idioma errado
const SO_EM_INGLES = [
  'DOSSIER', 'AVAILABLE', 'INSTALLED', 'REFLEXES', 'INTELLIGENCE',
  'STREETKID', 'NOMAD', 'SYSTEMS OPERATIONAL', 'SECTIONS', 'VISITOR TRAFFIC',
  'BOOTING SYSTEM', 'BACK TO TOP',
]
const SO_EM_PORTUGUES = [
  'DOSSIÊ', 'DISPONÍVEL', 'INSTALADO', 'REFLEXOS', 'INTELIGÊNCIA',
  'FILHO DAS RUAS', 'NÔMADE', 'SISTEMAS OPERACIONAIS', 'SEÇÕES',
  'TRÁFEGO DE VISITANTES', 'INICIALIZANDO', 'VOLTAR AO TOPO',
]

test.describe('consistência de idioma', () => {
  test('em português não sobra rótulo em inglês', async ({ page }) => {
    await page.goto('./?lang=pt')
    await expect(page.locator('#main-content')).toBeVisible()
    await esperarTerminal(page)
    const txt = await pageText(page)

    const vazou = SO_EM_INGLES.filter(w => txt.includes(w))
    expect(vazou, `rótulos em inglês na página em português: ${vazou.join(', ')}`).toEqual([])
  })

  test('em inglês não sobra rótulo em português', async ({ page }) => {
    await page.goto('./?lang=en')
    await expect(page.locator('#main-content')).toBeVisible()
    await esperarTerminal(page)
    const txt = await pageText(page)

    const vazou = SO_EM_PORTUGUES.filter(w => txt.includes(w))
    expect(vazou, `rótulos em português na página em inglês: ${vazou.join(', ')}`).toEqual([])
  })

  test('o atributo das skills acompanha o idioma', async ({ page }) => {
    await page.goto('./?lang=pt')
    await expect(page.locator('[class*="skillAttr"]').first()).toHaveText(/CORPO|REFLEXOS|HABILIDADE TÉCNICA|INTELIGÊNCIA|FRIEZA/)
    await page.goto('./?lang=en')
    await expect(page.locator('[class*="skillAttr"]').first()).toHaveText(/BODY|REFLEXES|TECHNICAL ABILITY|INTELLIGENCE|COOL/)
  })

  test('o lifepath acompanha o idioma', async ({ page }) => {
    await page.goto('./?lang=pt')
    await expect(page.locator('[class*="lifepath"]').first()).toHaveText(/CORPORATIVO|NÔMADE|FILHO DAS RUAS/)
    await page.goto('./?lang=en')
    await expect(page.locator('[class*="lifepath"]').first()).toHaveText(/CORPO|NOMAD|STREETKID/)
  })
})
