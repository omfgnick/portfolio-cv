import { useEffect, useRef } from 'react'
import type { Lang } from '@/data/cv'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import styles from './ShortcutsHelp.module.css'

const T: Record<Lang, { title: string; rows: [string, string][] }> = {
  pt: {
    title: 'ATALHOS DE TECLADO',
    rows: [
      ['/', 'Focar a busca'],
      ['Ctrl / ⌘ + K', 'Abrir command palette'],
      ['?', 'Mostrar esta ajuda'],
      ['Esc', 'Fechar / limpar'],
      ['↑ ↓ ↵', 'Navegar na palette'],
    ],
  },
  en: {
    title: 'KEYBOARD SHORTCUTS',
    rows: [
      ['/', 'Focus search'],
      ['Ctrl / ⌘ + K', 'Open command palette'],
      ['?', 'Show this help'],
      ['Esc', 'Close / clear'],
      ['↑ ↓ ↵', 'Navigate the palette'],
    ],
  },
}

export default function ShortcutsHelp({ open, onClose, lang }: { open: boolean; onClose: () => void; lang: Lang }) {
  const boxRef = useRef<HTMLDivElement>(null)
  useFocusTrap(boxRef, open)
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  const d = T[lang]
  return (
    <div className={styles.overlay} onMouseDown={onClose} role="dialog" aria-modal="true" aria-label={d.title}>
      <div ref={boxRef} className={styles.box} tabIndex={0} onMouseDown={e => e.stopPropagation()}>
        <div className={styles.head}>{d.title}<span className={styles.esc}>ESC</span></div>
        <div className={styles.rows}>
          {d.rows.map(([k, desc]) => (
            <div key={k} className={styles.row}>
              <kbd className={styles.kbd}>{k}</kbd>
              <span className={styles.desc}>{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
