import { Globe } from 'lucide-react'
import { VISITS_ENDPOINT } from '@/data/config'
import type { VisitStats } from '@/hooks/useVisits'
import type { Lang } from '@/data/cv'
import { UI } from '@/i18n/ui'
import styles from './VisitorPanel.module.css'
import { WORLD_PATH } from './worldPath'

const NAMES: Record<Lang, Record<string, string>> = {
  pt: {
    BR: 'Brasil', US: 'EUA', PT: 'Portugal', GB: 'Reino Unido', DE: 'Alemanha', FR: 'França',
    ES: 'Espanha', IT: 'Itália', CA: 'Canadá', NL: 'Holanda', IN: 'Índia', JP: 'Japão',
    AU: 'Austrália', AR: 'Argentina', MX: 'México', CL: 'Chile', CO: 'Colômbia', PE: 'Peru',
    UY: 'Uruguai', IE: 'Irlanda', CH: 'Suíça', SE: 'Suécia', PL: 'Polônia', RU: 'Rússia',
    CN: 'China', KR: 'Coreia', ZA: 'Áf. do Sul', AE: 'Emirados', SG: 'Singapura', XX: '—',
  },
  en: {
    BR: 'Brazil', US: 'USA', PT: 'Portugal', GB: 'UK', DE: 'Germany', FR: 'France',
    ES: 'Spain', IT: 'Italy', CA: 'Canada', NL: 'Netherlands', IN: 'India', JP: 'Japan',
    AU: 'Australia', AR: 'Argentina', MX: 'Mexico', CL: 'Chile', CO: 'Colombia', PE: 'Peru',
    UY: 'Uruguay', IE: 'Ireland', CH: 'Switzerland', SE: 'Sweden', PL: 'Poland', RU: 'Russia',
    CN: 'China', KR: 'S. Korea', ZA: 'S. Africa', AE: 'UAE', SG: 'Singapore', XX: '—',
  },
}
const CENTROIDS: Record<string, [number, number]> = {
  BR: [-14, -51], US: [39, -98], PT: [39.5, -8], GB: [54, -2], DE: [51, 10], FR: [46, 2],
  ES: [40, -4], IT: [42, 12], CA: [56, -106], NL: [52, 5], IN: [21, 78], JP: [36, 138],
  AU: [-25, 133], AR: [-38, -63], MX: [23, -102], CL: [-35, -71], CO: [4, -73], PE: [-9, -75],
  UY: [-32, -55], IE: [53, -8], CH: [46.8, 8], SE: [62, 15], PL: [52, 19], RU: [61, 90],
  CN: [35, 104], KR: [36, 127], ZA: [-30, 25], AE: [24, 54], SG: [1.3, 103.8], NZ: [-41, 174],
  AT: [47, 13], BE: [50.6, 4.6], DK: [56, 9], FI: [64, 26], NO: [61, 8], GR: [39, 22],
  IL: [31, 34], TR: [39, 35], EG: [26, 30], NG: [9, 8], AO: [-11, 17], MZ: [-18, 35],
}
const HOME: [number, number] = [-23.55, -46.63]
const flag = (cc: string) =>
  /^[A-Za-z]{2}$/.test(cc) ? String.fromCodePoint(...[...cc.toUpperCase()].map(c => 127397 + c.charCodeAt(0))) : '🌐'
const MW = 360
const proj = ([lat, lon]: [number, number]): [number, number] => [lon + 180, 90 - lat]

/**
 * O quadro do mapa é bem mais largo que alto. Com o mundo inteiro (360x180,
 * 2:1) e 'slice', o SVG escalava para cobrir e cortava cerca de 30 graus de
 * latitude em cima e embaixo — sumia justamente com Canadá, norte da Europa,
 * sul da Argentina e Austrália, que é onde os visitantes estão.
 *
 * Recortando a faixa habitada (72°N a 48°S) o viewBox fica 3:1, quase a
 * proporção do quadro, e cabe inteiro com 'meet'. O que fica de fora é
 * Antártida e calota ártica.
 */
const VIEW_TOP = 18          // y de 90 - 72
const VIEW_H = 120           // até y 138, ou seja 48°S

export default function VisitorPanel({ data, lang }: { data: VisitStats | null; lang: Lang }) {
  if (!VISITS_ENDPOINT || !data) return null
  const u = UI[lang]
  const names = NAMES[lang]
  const nf = (n: number) => n.toLocaleString(lang === 'pt' ? 'pt-BR' : 'en-US')

  const top = [...(data.countries || [])].sort((a, b) => b.count - a.count)
  const withCoords = (data.countries || []).filter(c => CENTROIDS[c.code])
  const [hx, hy] = proj(HOME)
  const days = data.days || []
  const dMax = Math.max(1, ...days.map(d => d.count))
  const referrer = (data.referrers || [])[0]

  // Grade a cada 30 graus, desenhada só dentro da faixa visível
  const grat: string[] = []
  for (let x = 0; x <= MW; x += 30) grat.push(`M${x} ${VIEW_TOP}V${VIEW_TOP + VIEW_H}`)
  for (let y = VIEW_TOP; y <= VIEW_TOP + VIEW_H; y += 30) grat.push(`M0 ${y}H${MW}`)

  return (
    <section className={styles.panel} aria-label={lang === 'pt' ? 'Tráfego de visitantes' : 'Visitor traffic'}>
      <div className={styles.head}>
        <span className={styles.title}><Globe size={13} /> GLOBAL TRAFFIC</span>
        {!!data.live && <span className={styles.live}><i /> {data.live} {u.live}</span>}
        <span className={styles.total}>{nf(data.total)} <em>{u.visits}</em></span>
      </div>

      <div className={styles.grid}>
        {/* Mapa mini */}
        <div className={styles.map}>
          <svg viewBox={`0 ${VIEW_TOP} ${MW} ${VIEW_H}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            <path d={WORLD_PATH} className={styles.land} />
            <path d={grat.join('')} className={styles.grat} />
            {withCoords.map(c => {
              const [px, py] = proj(CENTROIDS[c.code]); const cx = (hx + px) / 2
              // sem o clamp, a curva sobe acima do topo do viewBox e o arco some
              const cy = Math.max(VIEW_TOP + 4, Math.min(hy, py) - 22)
              return <path key={`a${c.code}`} d={`M${hx} ${hy}Q${cx} ${cy} ${px} ${py}`} className={styles.arc} />
            })}
            <g><title>São Paulo</title><circle cx={hx} cy={hy} r={2.4} className={styles.home} /></g>
            {withCoords.map(c => {
              const [px, py] = proj(CENTROIDS[c.code])
              const r = 1.6 + Math.min(3.2, Math.sqrt(c.count))
              return (
                <g key={`d${c.code}`}>
                  {/* title da o nome do pais no hover; o SVG e aria-hidden porque
                      a mesma informacao ja esta na lista ao lado, em texto */}
                  <title>{`${names[c.code] || c.code} · ${nf(c.count)}`}</title>
                  <circle cx={px} cy={py} r={r + 2} className={styles.pulse} />
                  <circle cx={px} cy={py} r={r} className={styles.dot} />
                </g>
              )
            })}
          </svg>
        </div>

        {/* Sparkline 14 dias */}
        <div className={styles.cell}>
          <div className={styles.cLbl}>{u.last14}</div>
          <div className={styles.spark}>
            {days.map((d, i) => (
              <span key={i} className={styles.sBar} style={{ height: `${Math.max(6, (d.count / dMax) * 100)}%` }} title={`${d.date}: ${d.count}`} />
            ))}
          </div>
        </div>

        {/* Top países */}
        <div className={styles.cell}>
          <div className={styles.cLbl}>{u.topCountries}</div>
          <div className={styles.ctys}>
            {top.slice(0, 4).map(c => (
              <span key={c.code} className={styles.cty}><span className={styles.f}>{flag(c.code)}</span>{names[c.code] || c.code}<b>{c.count}</b></span>
            ))}
            {top.length === 0 && <span className={styles.await}>{u.waiting}</span>}
          </div>
        </div>

        {/* Origem (referrer) */}
        <div className={styles.cell}>
          <div className={styles.cLbl}>{u.source}</div>
          <div className={styles.ref}>
            {referrer ? <><b>{referrer.host}</b><span>{referrer.count} {u.visitCount}</span></> : <><b>{u.direct}</b><span>{u.noReferrer}</span></>}
          </div>
        </div>
      </div>
    </section>
  )
}
