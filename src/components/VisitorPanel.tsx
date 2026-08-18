import { Globe } from 'lucide-react'
import { VISITS_ENDPOINT } from '@/data/config'
import type { VisitStats } from '@/hooks/useVisits'
import styles from './VisitorPanel.module.css'

const NAMES: Record<string, string> = {
  BR: 'Brasil', US: 'Estados Unidos', PT: 'Portugal', GB: 'Reino Unido', DE: 'Alemanha',
  FR: 'França', ES: 'Espanha', IT: 'Itália', CA: 'Canadá', NL: 'Países Baixos',
  IN: 'Índia', JP: 'Japão', AU: 'Austrália', AR: 'Argentina', MX: 'México', CL: 'Chile',
  CO: 'Colômbia', PE: 'Peru', UY: 'Uruguai', IE: 'Irlanda', CH: 'Suíça', SE: 'Suécia',
  PL: 'Polônia', RU: 'Rússia', CN: 'China', KR: 'Coreia do Sul', ZA: 'África do Sul',
  AE: 'Emirados Árabes', SG: 'Singapura', XX: 'Desconhecido',
}
// Centróides aproximados [lat, lon] para plotar no mapa (países fora da lista
// não recebem ponto no mapa, mas continuam na contagem/lista).
const CENTROIDS: Record<string, [number, number]> = {
  BR: [-14, -51], US: [39, -98], PT: [39.5, -8], GB: [54, -2], DE: [51, 10], FR: [46, 2],
  ES: [40, -4], IT: [42, 12], CA: [56, -106], NL: [52, 5], IN: [21, 78], JP: [36, 138],
  AU: [-25, 133], AR: [-38, -63], MX: [23, -102], CL: [-35, -71], CO: [4, -73], PE: [-9, -75],
  UY: [-32, -55], IE: [53, -8], CH: [46.8, 8], SE: [62, 15], PL: [52, 19], RU: [61, 90],
  CN: [35, 104], KR: [36, 127], ZA: [-30, 25], AE: [24, 54], SG: [1.3, 103.8], NZ: [-41, 174],
  AT: [47, 13], BE: [50.6, 4.6], DK: [56, 9], FI: [64, 26], NO: [61, 8], GR: [39, 22],
  IL: [31, 34], TR: [39, 35], EG: [26, 30], NG: [9, 8], AO: [-11, 17], MZ: [-18, 35],
}
const HOME: [number, number] = [-23.55, -46.63] // São Paulo
const flag = (cc: string) =>
  /^[A-Za-z]{2}$/.test(cc) ? String.fromCodePoint(...[...cc.toUpperCase()].map(c => 127397 + c.charCodeAt(0))) : '🌐'

const MW = 360, MH = 180
const proj = ([lat, lon]: [number, number]): [number, number] => [lon + 180, 90 - lat]

export default function VisitorPanel({ data }: { data: VisitStats | null }) {
  if (!VISITS_ENDPOINT || !data) return null

  const withCoords = (data.countries || []).filter(c => CENTROIDS[c.code])
  const top = [...(data.countries || [])].sort((a, b) => b.count - a.count).slice(0, 6)
  const max = Math.max(1, ...top.map(c => c.count))
  const [hx, hy] = proj(HOME)

  // linhas de grade (graticule) a cada 30°
  const grat: string[] = []
  for (let lon = 0; lon <= 360; lon += 30) grat.push(`M${lon} 0V${MH}`)
  for (let lat = 0; lat <= 180; lat += 30) grat.push(`M0 ${lat}H${MW}`)

  return (
    <section className={styles.panel} aria-label="Tráfego global de visitas">
      <div className={styles.head}>
        <span className={styles.title}><Globe size={14} /> GLOBAL TRAFFIC · LIVE MAP</span>
        <span className={styles.total}>{data.total.toLocaleString('pt-BR')} <em>visitas</em></span>
      </div>

      <div className={styles.body}>
        <div className={styles.mapWrap} aria-hidden="true">
          <svg viewBox={`0 0 ${MW} ${MH}`} className={styles.map} preserveAspectRatio="xMidYMid meet">
            <path d={grat.join('')} className={styles.grat} />
            {withCoords.map(c => {
              const [px, py] = proj(CENTROIDS[c.code])
              const cx = (hx + px) / 2, cy = Math.min(hy, py) - 22
              return <path key={`a-${c.code}`} d={`M${hx} ${hy}Q${cx} ${cy} ${px} ${py}`} className={styles.arc} />
            })}
            <circle cx={hx} cy={hy} r={2.6} className={styles.home} />
            {withCoords.map(c => {
              const [px, py] = proj(CENTROIDS[c.code])
              const r = 2 + Math.min(4, Math.sqrt(c.count))
              return (
                <g key={`d-${c.code}`}>
                  <circle cx={px} cy={py} r={r + 3} className={styles.pulse} />
                  <circle cx={px} cy={py} r={r} className={styles.dot} />
                </g>
              )
            })}
          </svg>
        </div>

        <div className={styles.rows}>
          {top.map(c => (
            <div key={c.code} className={styles.row}>
              <span className={styles.flag}>{flag(c.code)}</span>
              <span className={styles.name}>{NAMES[c.code] || c.code}</span>
              <span className={styles.bar}><i style={{ width: `${(c.count / max) * 100}%` }} /></span>
              <span className={styles.count}>{c.count.toLocaleString('pt-BR')}</span>
            </div>
          ))}
          {top.length === 0 && <div className={styles.await}>aguardando primeira visita…</div>}
        </div>
      </div>
    </section>
  )
}
