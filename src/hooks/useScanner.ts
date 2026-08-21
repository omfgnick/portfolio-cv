import { useCallback, useEffect, useState } from 'react'

/**
 * Modo scanner — a leitura das ópticas Kiroshi do Cyberpunk 2077.
 *
 * Liga e desliga com a tecla `S`, e o estado vive num atributo no <html>, e não
 * numa classe React: assim o CSS de qualquer componente reage sem precisar
 * receber a informação por prop através de meia dúzia de níveis.
 *
 * Três cuidados que o modo precisa ter para não atrapalhar quem só quer ler:
 *
 *  - a tecla é ignorada enquanto o foco está num campo de texto, senão digitar
 *    "s" na busca ligaria o scanner;
 *  - `Escape` desliga, que é o reflexo de todo mundo;
 *  - quem pediu `prefers-reduced-motion` não recebe a varredura animada — só a
 *    moldura estática.
 */
export function useScanner() {
  const [ativo, setAtivo] = useState(false)

  const alternar = useCallback(() => setAtivo(v => !v), [])

  useEffect(() => {
    const digitando = (el: EventTarget | null) => {
      const alvo = el as HTMLElement | null
      if (!alvo) return false
      const tag = alvo.tagName
      return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || alvo.isContentEditable
    }

    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setAtivo(false); return }
      if (e.ctrlKey || e.metaKey || e.altKey) return
      if (digitando(e.target)) return
      if (e.key === 's' || e.key === 'S') {
        e.preventDefault()
        setAtivo(v => !v)
      }
    }

    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [])

  useEffect(() => {
    const raiz = document.documentElement
    if (ativo) raiz.setAttribute('data-scan', 'on')
    else raiz.removeAttribute('data-scan')
    return () => raiz.removeAttribute('data-scan')
  }, [ativo])

  return { ativo, alternar }
}
