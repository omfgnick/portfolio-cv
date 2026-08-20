/**
 * Gera o contorno dos continentes para o mini-mapa do painel de visitantes.
 *
 * Fonte: Natural Earth (domínio público), via o pacote `world-atlas`. O caminho
 * sai pronto em coordenadas do próprio SVG e é gravado num .ts que o bundle
 * importa — nada é buscado em tempo de execução, o que o CSP do site
 * (`default-src 'self'`) não permitiria de qualquer forma.
 *
 * Projeção equiretangular, a mesma que o painel já usava para posicionar os
 * pontos: x = lon + 180, y = 90 - lat, num viewBox de 360x180.
 *
 * Uso:
 *   node scripts/gen-worldmap.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import * as topojson from 'topojson-client'

const require = createRequire(import.meta.url)
const SRC = require.resolve('world-atlas/land-110m.json')
const OUT = 'src/components/worldPath.ts'

// 110m já é a resolução mais grosseira do Natural Earth. Ainda assim sobram
// centenas de ilhas com poucos pixels no mapa final: num quadro de 104px de
// altura elas viram sujeira e só engordam o bundle.
const MIN_AREA = 2     // em graus quadrados
// O mapa é desenhado com cerca de 0,9 px por grau. Arredondar para grau inteiro
// é, na prática, encaixar numa grade menor que um pixel — invisível ali, e corta
// o caminho de 49 KB para uma fração disso. O 'dedupe' abaixo aproveita o
// arredondamento como simplificação: pontos que caem no mesmo lugar somem.
const DECIMALS = 0

const topo = JSON.parse(readFileSync(SRC, 'utf8'))
const land = topojson.feature(topo, topo.objects.land)

const round = (n) => Number(n.toFixed(DECIMALS))
const project = ([lon, lat]) => [round(lon + 180), round(90 - lat)]

/** Área aproximada do polígono (fórmula do laço), só para descartar ilha pequena. */
function area(ring) {
  let a = 0
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    a += ring[j][0] * ring[i][1] - ring[i][0] * ring[j][1]
  }
  return Math.abs(a / 2)
}

const parts = []
let mantidos = 0
let descartados = 0

const addPolygon = (polygon) => {
  // Só o anel externo: buracos (mares internos) não valem o custo nesta escala
  const ring = polygon[0]
  if (area(ring) < MIN_AREA) { descartados++; return }

  const pts = ring.map(project)

  // Anel que dá a volta no mundo inteiro numa faixa fina de latitude não é
  // terra: é uma ilha junto ao antimeridiano cujo contorno, projetado sem
  // cuidado, virou uma barra atravessando o mapa. Fiji foi assim que apareceu.
  const xs = pts.map((q) => q[0])
  const ys = pts.map((q) => q[1])
  if (Math.max(...xs) - Math.min(...xs) > 350 && Math.max(...ys) - Math.min(...ys) < 4) {
    descartados++
    return
  }

  // Quando dois pontos seguidos saltam mais de meio globo em longitude, o
  // contorno cruzou o antimeridiano. Ligar os dois com uma reta desenha uma
  // costura horizontal de ponta a ponta do mapa - era o risco que atravessava
  // a Eurásia na altura da Sibéria. Aqui o caminho é QUEBRADO no salto: cada
  // lado vira um subcaminho, e a emenda some.
  const subpaths = []
  let atual = [pts[0]]
  let [px, py] = pts[0]
  for (const [x, y] of pts.slice(1)) {
    if (Math.abs(x - px) > 180) {
      subpaths.push(atual)
      atual = [[x, y]]
    } else if (x !== px || y !== py) {
      // ponto que não move nada depois do arredondamento é descartado
      atual.push([x, y])
    }
    px = x; py = y
  }
  subpaths.push(atual)

  let usou = false
  for (const sp of subpaths) {
    if (sp.length < 3) continue
    usou = true
    parts.push('M' + sp.map(([x, y]) => `${x} ${y}`).join('L') + 'Z')
  }
  if (usou) mantidos++
  else descartados++
}

for (const feature of land.features) {
  const g = feature.geometry
  if (g.type === 'Polygon') addPolygon(g.coordinates)
  else if (g.type === 'MultiPolygon') g.coordinates.forEach(addPolygon)
}

const d = parts.join('')
const header = `/**
 * GERADO POR scripts/gen-worldmap.mjs — não edite à mão.
 *
 * Contorno dos continentes em projeção equiretangular, viewBox 360x180
 * (x = lon + 180, y = 90 - lat). Fonte: Natural Earth 110m via world-atlas,
 * domínio público. Ilhas com menos de ${MIN_AREA} grau² foram descartadas: nesta
 * escala elas ocupam menos de um pixel e só engordam o bundle.
 */
export const WORLD_PATH =
  '${d}'
`

writeFileSync(OUT, header)
console.log(`  polígonos mantidos : ${mantidos}`)
console.log(`  descartados        : ${descartados}`)
console.log(`  tamanho do caminho : ${(d.length / 1024).toFixed(1)} KB`)
console.log(`  gravado em         : ${OUT}`)
