import { useEffect, useState } from 'react'
import { VISITS_ENDPOINT } from '@/data/config'

export interface VisitStats { total: number; countries: { code: string; count: number }[] }

/**
 * Busca as estatísticas de visitas (e registra 1 hit por sessão). Uma única
 * chamada no app inteiro — o resultado é compartilhado (HUD + painel de mapa).
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
          await fetch(`${base}/hit`, { method: 'POST' }).catch(() => {})
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
