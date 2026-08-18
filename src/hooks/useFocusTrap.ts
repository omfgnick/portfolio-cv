import { useEffect, type RefObject } from 'react'

/**
 * Aprisiona o foco dentro de `ref` enquanto `active` for true (Tab/Shift+Tab
 * ciclam), foca o primeiro elemento ao ativar e devolve o foco ao elemento
 * anterior ao desativar. Para modais acessíveis (command palette, ajuda).
 */
const SEL = 'a[href],button:not([disabled]),input:not([disabled]),textarea,select,[tabindex]:not([tabindex="-1"])'

export function useFocusTrap(ref: RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    if (!active) return
    const el = ref.current
    if (!el) return
    const prev = document.activeElement as HTMLElement | null
    const focusables = () => Array.from(el.querySelectorAll<HTMLElement>(SEL)).filter(x => x.offsetParent !== null)
    focusables()[0]?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const f = focusables()
      if (f.length === 0) return
      const first = f[0], last = f[f.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    el.addEventListener('keydown', onKey)
    return () => { el.removeEventListener('keydown', onKey); prev?.focus?.() }
  }, [active, ref])
}
