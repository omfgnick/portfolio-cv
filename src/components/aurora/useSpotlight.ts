import { useEffect, type RefObject } from 'react'

/**
 * Spotlight que segue o mouse: no pointermove do CONTAINER, escreve --mx/--my
 * (px relativos) em cada filho direto — os filhos com a classe `.spotCell`
 * (aurora.module.css) acendem um radial nessa posição via ::before.
 * Só `pointer: fine`; listener passivo.
 */
export function useSpotlight(containerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    const move = (e: PointerEvent) => {
      for (const cell of Array.from(el.children) as HTMLElement[]) {
        const b = cell.getBoundingClientRect()
        cell.style.setProperty('--mx', `${e.clientX - b.left}px`)
        cell.style.setProperty('--my', `${e.clientY - b.top}px`)
      }
    }
    el.addEventListener('pointermove', move, { passive: true })
    return () => el.removeEventListener('pointermove', move)
  }, [containerRef])
}
