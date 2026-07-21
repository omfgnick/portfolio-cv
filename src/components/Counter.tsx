import { useEffect, useRef, useState } from 'react'

/**
 * Contador animado com fallbacks robustos (mesmo padrão da landing):
 * IntersectionObserver dispara a animação; se indisponível/atrasado, um
 * setTimeout garante o valor final; prefers-reduced-motion pula direto ao fim.
 * Timer-driven (setInterval) para completar mesmo em abas em segundo plano.
 */
export default function Counter({ end, suffix = '', duration = 1600 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const animate = () => {
      if (started.current) return
      started.current = true
      const step = end / (duration / 16)
      let cur = 0
      const t = setInterval(() => {
        cur = Math.min(cur + step, end)
        setCount(Math.floor(cur))
        if (cur >= end) { setCount(end); clearInterval(t) }
      }, 16)
    }
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) { setCount(end); return }
    let io: IntersectionObserver | null = null
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(([e]) => { if (e.isIntersecting) animate() }, { rootMargin: '0px 0px -10% 0px' })
      if (ref.current) io.observe(ref.current)
    } else { animate() }
    const fb = setTimeout(() => { if (!started.current) animate() }, 900)
    return () => { io?.disconnect(); clearTimeout(fb) }
  }, [end, duration])

  return <span ref={ref}>{count}{suffix}</span>
}
