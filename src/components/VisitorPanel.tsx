import { useEffect, useState } from 'react'
import { Globe } from 'lucide-react'
import { VISITS_ENDPOINT } from '@/data/config'
import styles from './VisitorPanel.module.css'

interface Stats { total: number; countries: { code: string; count: number }[] }

const NAMES: Record<string, string> = {
  BR: 'Brasil', US: 'Estados Unidos', PT: 'Portugal', GB: 'Reino Unido', DE: 'Alemanha',
  FR: 'França', ES: 'Espanha', IT: 'Itália', CA: 'Canadá', NL: 'Países Baixos',
  IN: 'Índia', JP: 'Japão', AU: 'Austrália', AR: 'Argentina', MX: 'México', XX: 'Desconhecido',
}
const flag = (cc: string) =>
  /^[A-Za-z]{2}$/.test(cc) ? String.fromCodePoint(...[...cc.toUpperCase()].map(c => 127397 + c.charCodeAt(0))) : '🌐'

export default function VisitorPanel() {
  const [data, setData] = useState<Stats | null>(null)

  useEffect(() => {
    if (!VISITS_ENDPOINT) return
    let cancelled = false
    const base = VISITS_ENDPOINT.replace(/\/$/, '')
    ;(async () => {
      try {
        if (!sessionStorage.getItem('nm_hit')) {
          sessionStorage.setItem('nm_hit', '1')
          fetch(`${base}/hit`, { method: 'POST' }).catch(() => {})
        }
        const r = await fetch(`${base}/stats`)
        const j = (await r.json()) as Stats
        if (!cancelled && j && typeof j.total === 'number') setData(j)
      } catch { /* rede indisponível: painel apenas não popula */ }
    })()
    return () => { cancelled = true }
  }, [])

  if (!VISITS_ENDPOINT || !data) return null

  const top = [...(data.countries || [])].sort((a, b) => b.count - a.count).slice(0, 6)
  const max = Math.max(1, ...top.map(c => c.count))

  return (
    <section className={`${styles.panel}`} aria-label="Tráfego global de visitas">
      <div className={styles.head}>
        <span className={styles.title}><Globe size={14} /> GLOBAL TRAFFIC</span>
        <span className={styles.total}>{data.total.toLocaleString('pt-BR')} <em>visitas</em></span>
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
      </div>
    </section>
  )
}
