import { useEffect, useRef } from 'react'
import { VISITS_ENDPOINT } from '@/data/config'

/**
 * Mede engajamento da visita e envia UM resumo no fim.
 *
 * O KV grátis da Cloudflare dá 1.000 operações de escrita/exclusão/listagem por
 * dia — somadas num único balde. Gravar evento a evento gastaria essa cota
 * depressa e derrubaria o contador de visitas junto, então tudo é acumulado
 * aqui e enviado de uma vez.
 *
 * Não guarda nada que identifique a pessoa: só quais ações aconteceram, quais
 * seções foram vistas, até onde rolou e quanto tempo ficou.
 */
export interface Engagement {
  /** Registra uma ação (clique em PDF, LinkedIn, etc.). Repetir é inofensivo. */
  track: (action: string) => void
}

const SECTIONS = ['about', 'experience', 'skills', 'projects', 'credentials', 'praise', 'contact']

export function useEngagement(): Engagement {
  const actions = useRef(new Set<string>())
  const sections = useRef(new Set<string>())
  const maxDepth = useRef(0)
  const start = useRef(Date.now())
  const sent = useRef(false)

  useEffect(() => {
    if (!VISITS_ENDPOINT) return
    const base = VISITS_ENDPOINT.replace(/\/$/, '')

    const onScroll = () => {
      const de = document.documentElement
      const max = de.scrollHeight - de.clientHeight
      if (max <= 0) return
      const pct = Math.round((de.scrollTop / max) * 100)
      if (pct > maxDepth.current) maxDepth.current = Math.min(100, pct)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    // Uma seção conta como vista quando aparece de fato, não quando existe no DOM
    let io: IntersectionObserver | null = null
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(
        entries => entries.forEach(e => { if (e.isIntersecting) sections.current.add(e.target.id) }),
        { threshold: 0.35 },
      )
      SECTIONS.forEach(id => { const el = document.getElementById(id); if (el) io!.observe(el) })
    }

    const send = () => {
      if (sent.current) return
      sent.current = true
      const payload = JSON.stringify({
        actions: [...actions.current],
        sections: [...sections.current],
        depth: maxDepth.current,
        seconds: Math.round((Date.now() - start.current) / 1000),
      })
      // sendBeacon sobrevive ao fechamento da aba; fetch normal seria cancelado.
      try {
        if (navigator.sendBeacon) {
          navigator.sendBeacon(`${base}/events`, new Blob([payload], { type: 'application/json' }))
        } else {
          fetch(`${base}/events`, { method: 'POST', body: payload, keepalive: true }).catch(() => {})
        }
      } catch { /* medição nunca deve quebrar a página */ }
    }

    // 'pagehide' cobre o caso do iOS, onde 'beforeunload' não dispara
    const onHide = () => { if (document.visibilityState === 'hidden') send() }
    window.addEventListener('pagehide', send)
    document.addEventListener('visibilitychange', onHide)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pagehide', send)
      document.removeEventListener('visibilitychange', onHide)
      io?.disconnect()
    }
  }, [])

  return { track: (action: string) => { actions.current.add(action) } }
}
