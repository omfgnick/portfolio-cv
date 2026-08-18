import { Globe } from 'lucide-react'
import { VISITS_ENDPOINT } from '@/data/config'
import type { VisitStats } from '@/hooks/useVisits'
import type { Lang } from '@/data/cv'
import { UI } from '@/i18n/ui'
import styles from './VisitorPanel.module.css'

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
const MW = 360, MH = 180
const proj = ([lat, lon]: [number, number]): [number, number] => [lon + 180, 90 - lat]

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

  const grat: string[] = []
  for (let lon = 0; lon <= 360; lon += 45) grat.push(`M${lon} 0V${MH}`)
  for (let lat = 0; lat <= 180; lat += 45) grat.push(`M0 ${lat}H${MW}`)

  return (
    <section className={styles.panel} aria-label="Visitor traffic">
      <div className={styles.head}>
        <span className={styles.title}><Globe size={13} /> GLOBAL TRAFFIC</span>
        {!!data.live && <span className={styles.live}><i /> {data.live} {u.live}</span>}
        <span className={styles.total}>{nf(data.total)} <em>{u.visits}</em></span>
      </div>

      <div className={styles.grid}>
        {/* Mapa mini */}
        <div className={styles.map}>
          <svg viewBox={`0 0 ${MW} ${MH}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <path d={grat.join('')} className={styles.grat} />
            {withCoords.map(c => {
              const [px, py] = proj(CENTROIDS[c.code]); const cx = (hx + px) / 2, cy = Math.min(hy, py) - 24
              return <path key={`a${c.code}`} d={`M${hx} ${hy}Q${cx} ${cy} ${px} ${py}`} className={styles.arc} />
            })}
            <circle cx={hx} cy={hy} r={2.8} className={styles.home} />
            {withCoords.map(c => { const [px, py] = proj(CENTROIDS[c.code]); const r = 2 + Math.min(4, Math.sqrt(c.count))
              return <g key={`d${c.code}`}><circle cx={px} cy={py} r={r + 3} className={styles.pulse} /><circle cx={px} cy={py} r={r} className={styles.dot} /></g> })}
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
