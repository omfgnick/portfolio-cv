import { useEffect, useMemo, useRef, useState } from 'react'
import { Search, CornerDownLeft, type LucideIcon } from 'lucide-react'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import styles from './CommandPalette.module.css'

export interface CmdItem {
  id: string
  label: string
  hint?: string
  icon: LucideIcon
  run: () => void
}

const norm = (s: string) => {
  const t = (s || '').toLowerCase().normalize('NFD')
  try { return t.replace(/\p{Diacritic}/gu, '') } catch { return t.replace(/[̀-ͯ]/g, '') }
}

interface PaletteUI { palettePh: string; paletteEmpty: string; navHint: string; selectHint: string; closeHint: string; ariaPalette: string; ariaCommand: string }

export default function CommandPalette({ open, onClose, items, ui }: { open: boolean; onClose: () => void; items: CmdItem[]; ui: PaletteUI }) {
  const [q, setQ] = useState('')
  const [idx, setIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  useFocusTrap(boxRef, open)

  const filtered = useMemo(() => {
    const t = norm(q).trim()
    if (!t) return items
    return items.filter(i => norm(`${i.label} ${i.hint || ''}`).includes(t))
  }, [q, items])

  useEffect(() => { if (open) { setQ(''); setIdx(0); setTimeout(() => inputRef.current?.focus(), 20) } }, [open])
  useEffect(() => { if (idx >= filtered.length) setIdx(0) }, [filtered.length, idx])

  if (!open) return null

  const run = (i?: CmdItem) => { const item = i ?? filtered[idx]; if (item) { onClose(); item.run() } }

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setIdx(v => Math.min(v + 1, filtered.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setIdx(v => Math.max(v - 1, 0)) }
    else if (e.key === 'Enter') { e.preventDefault(); run() }
    else if (e.key === 'Escape') { e.preventDefault(); onClose() }
  }

  return (
    <div className={styles.overlay} onMouseDown={onClose} role="dialog" aria-modal="true" aria-label={ui.ariaPalette}>
      <div ref={boxRef} className={styles.box} onMouseDown={e => e.stopPropagation()} onKeyDown={onKey}>
        {/* Barra de RAM do menu de quickhack. E cenario: aria-hidden porque nao
            ha recurso nenhum sendo consumido, e anuncia-la seria mentira. */}
        <div className={styles.ram} aria-hidden="true">
          <span className={styles.ramLabel}>RAM</span>
          {Array.from({ length: 8 }).map((_, i) => (
            <i key={i} className={i < 8 - Math.min(6, idx) ? styles.ramOn : ''} />
          ))}
        </div>
        <div className={styles.head}>
          <Search size={15} />
          <input ref={inputRef} value={q} onChange={e => { setQ(e.target.value); setIdx(0) }} placeholder={ui.palettePh} aria-label={ui.ariaCommand} />
          <span className={styles.esc}>ESC</span>
        </div>
        <div className={styles.list} role="listbox">
          {filtered.length === 0 && <div className={styles.empty}>{ui.paletteEmpty}</div>}
          {filtered.map((i, k) => (
            <button key={i.id} type="button" role="option" aria-selected={k === idx}
              className={`${styles.item} ${k === idx ? styles.active : ''}`}
              onMouseEnter={() => setIdx(k)} onClick={() => run(i)}>
              <i.icon size={16} className={styles.icon} />
              <span className={styles.label}>{i.label}</span>
              {/* "Custo" derivado do proprio id: estavel entre renders e sem
                  Math.random, que mudaria o numero a cada tecla digitada. */}
              <span className={styles.cost} aria-hidden="true">{1 + (i.id.length % 4)}</span>
              {i.hint && <span className={styles.hint}>{i.hint}</span>}
              {k === idx && <CornerDownLeft size={13} className={styles.enter} />}
            </button>
          ))}
        </div>
        <div className={styles.foot}><span>{ui.navHint}</span><span>{ui.selectHint}</span><span>{ui.closeHint}</span></div>
      </div>
    </div>
  )
}
