import { useEffect, useState } from 'react'
import { VISITS_ENDPOINT } from '@/data/config'

/** Agregados de engajamento: contagem por balde, sem nada por pessoa. */
export interface Engagement {
  sessions?: number
  actions?: Record<string, number>
  sections?: Record<string, number>
  depth?: Record<string, number>
  dwell?: Record<string, number>
}

export interface VisitStats {
  total: number
  countries: { code: string; count: number }[]
  days?: { date: string; count: number }[]
  referrers?: { host: string; count: number }[]
  live?: number
  engagement?: Engagement
}

/**
 * Busca as estatísticas de visitas (e registra 1 hit por sessão, com o referrer).
 * Uma única chamada no app inteiro — resultado compartilhado (HUD + painel).
 */
export function useVisits(): VisitStats | null {
  const [data, setData] = useState<VisitStats | null>(null)
  useEffect(() => {
    if (!VISITS_ENDPOINT) return
    let cancelled = false
    const base = VISITS_ENDPOINT.replace(/\/$/, '')
    ;(async () => {
      try {
        if (!sessionStorage.getItem('nm_hit')) {
          sessionStorage.setItem('nm_hit', '1')
          let ref = ''
          try { ref = document.referrer ? new URL(document.referrer).hostname : '' } catch { /* noop */ }
          const hit = `${base}/hit${ref ? `?ref=${encodeURIComponent(ref)}` : ''}`
          await fetch(hit, { method: 'POST' }).catch(() => {})
        }
        const r = await fetch(`${base}/stats`)
        const j = (await r.json()) as VisitStats
        if (!cancelled && j && typeof j.total === 'number') setData(j)
      } catch { /* rede indisponível: componentes apenas não populam */ }
    })()
    return () => { cancelled = true }
  }, [])
  return data
}
