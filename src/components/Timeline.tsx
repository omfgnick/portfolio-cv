import type { Job } from '@/data/cv'
import styles from './Timeline.module.css'

/** 'AAAA-MM' → meses desde o ano 0, para posicionar as barras. */
const months = (ym: string) => {
  const [y, m] = ym.split('-').map(Number)
  return y * 12 + (m - 1)
}

interface Props {
  jobs: Job[]
  /** Chamado ao clicar numa barra: abre a experiência correspondente. */
  onPick: (index: number) => void
  ui: { totalYears: string; roles: string; hint: string }
}

export default function Timeline({ jobs, onPick, ui }: Props) {
  if (jobs.length === 0) return null

  const starts = jobs.map(j => months(j.start))
  const ends = jobs.map(j => months(j.end))
  const min = Math.min(...starts)
  const max = Math.max(...ends)
  const span = Math.max(1, max - min)

  const pct = (m: number) => ((m - min) / span) * 100
  const firstYear = Math.floor(min / 12)
  const lastYear = Math.floor(max / 12)
  const years: number[] = []
  for (let y = firstYear; y <= lastYear; y++) years.push(y)
  // Em janelas longas, mostra um rótulo a cada 2 anos para não embolar
  const step = years.length > 8 ? 2 : 1

  const totalYears = Math.round((span / 12) * 10) / 10
  const newest = ends.indexOf(max)

  return (
    <div className={styles.wrap}>
      <div className={styles.chart}>
        <div className={styles.axis}>
          {years.map((y, i) => (i % step === 0 ? (
            <span key={y} className={styles.year} style={{ left: `${pct(y * 12)}%` }}>{y}</span>
          ) : null))}
        </div>
        {years.map((y, i) => (i % step === 0 ? (
          <span key={`g${y}`} className={styles.grid} style={{ left: `${pct(y * 12)}%` }} aria-hidden="true" />
        ) : null))}

        <ol className={styles.rows}>
          {jobs.map((j, i) => {
            const left = pct(starts[i])
            const width = Math.max(1.2, pct(ends[i]) - left)
            const org = j.org.split('·')[0].trim()
            // Rótulo dentro da barra quando há espaço; senão, ao lado dela
            const inside = width >= 11
            const after = !inside && left + width < 62
            return (
              <li key={`${j.org}-${j.start}`} className={styles.row}>
                <button
                  type="button"
                  className={`${styles.bar} ${i === newest ? styles.current : ''}`}
                  style={{ left: `${left}%`, width: `${width}%` }}
                  onClick={() => onPick(i)}
                  title={`${j.role} · ${j.org} · ${j.period}`}
                  aria-label={`${j.role}, ${j.org}, ${j.period}`}
                >
                  {inside && <span className={styles.label}>{org}</span>}
                </button>
                {!inside && (
                  <span
                    className={`${styles.outer} ${after ? styles.afterBar : styles.beforeBar}`}
                    style={after ? { left: `calc(${left + width}% + 7px)` } : { right: `calc(${100 - left}% + 7px)` }}
                    aria-hidden="true"
                  >
                    {org}
                  </span>
                )}
              </li>
            )
          })}
        </ol>
      </div>

      <div className={styles.legend}>
        <span><b>{totalYears}</b> {ui.totalYears}</span>
        <span><b>{jobs.length}</b> {ui.roles}</span>
        <span>{ui.hint}</span>
      </div>
    </div>
  )
}
