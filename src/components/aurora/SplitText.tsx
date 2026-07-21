import { Children, type ReactNode, isValidElement } from 'react'
import styles from './aurora.module.css'

/**
 * Reveal tipográfico palavra-a-palavra (sobe com stagger).
 * Filhos que são ELEMENTOS (ex.: <em> com gradiente background-clip:text)
 * viram palavra ATÔMICA — recursar dentro deles quebra o clip.
 * Com prefers-reduced-motion o CSS pula a animação (palavras já visíveis).
 */
export default function SplitText({ children, baseDelay = 0.08, step = 0.055 }: {
  children: ReactNode
  baseDelay?: number
  step?: number
}) {
  let i = 0
  const wrap = (node: ReactNode, key: string) => (
    <span key={key} className={styles.stWord}>
      <span style={{ ['--d' as string]: `${baseDelay + (i++) * step}s` }}>{node}</span>
    </span>
  )
  const out: ReactNode[] = []
  Children.forEach(children, (child, ci) => {
    if (typeof child === 'string') {
      child.split(/(\s+)/).forEach((tok, ti) => {
        if (!tok) return
        if (/^\s+$/.test(tok)) out.push(tok)
        else out.push(wrap(tok, `w${ci}-${ti}`))
      })
    } else if (isValidElement(child) && child.type === 'br') {
      out.push(child)
    } else if (child != null) {
      out.push(wrap(child, `e${ci}`))
    }
  })
  return <>{out}</>
}
