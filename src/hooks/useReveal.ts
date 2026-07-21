import { useEffect } from 'react'

/**
 * Reveal-on-scroll robusto (mesmo padrão da landing): adiciona a classe
 * `visibleClass` aos elementos `[data-reveal]` quando entram na viewport.
 * Fail-safe: sem IntersectionObserver revela tudo; um setTimeout garante que
 * o conteúdo nunca fica preso invisível se o observer não disparar.
 */
export function useReveal(visibleClass: string) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    const reveal = (el: Element) => el.classList.add(visibleClass)
    if (!('IntersectionObserver' in window)) { els.forEach(reveal); return }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target) } })
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' })
    els.forEach(el => io.observe(el))
    const fb = setTimeout(() => els.forEach(reveal), 1600)
    return () => { io.disconnect(); clearTimeout(fb) }
  }, [visibleClass])
}
