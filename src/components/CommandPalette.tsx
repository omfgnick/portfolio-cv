import { useEffect, useMemo, useRef, useState } from 'react'
import { Search, CornerDownLeft, type LucideIcon } from 'lucide-react'
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

export default function CommandPalette({ open, onClose, items }: { open: boolean; onClose: () => void; items: CmdItem[] }) {
  const [q, setQ] = useState('')
  const [idx, setIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

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
    <div className={styles.overlay} onMouseDown={onClose} role="dialog" aria-modal="true" aria-label="Command palette">
      <div className={styles.box} onMouseDown={e => e.stopPropagation()} onKeyDown={onKey}>
        <div className={styles.head}>
          <Search size={15} />
          <input ref={inputRef} value={q} onChange={e => { setQ(e.target.value); setIdx(0) }} placeholder="Digite um comando ou seção…" aria-label="Buscar comando" />
          <span className={styles.esc}>ESC</span>
        </div>
        <div className={styles.list} role="listbox">
          {filtered.length === 0 && <div className={styles.empty}>Nenhum comando encontrado.</div>}
          {filtered.map((i, k) => (
            <button key={i.id} type="button" role="option" aria-selected={k === idx}
              className={`${styles.item} ${k === idx ? styles.active : ''}`}
              onMouseEnter={() => setIdx(k)} onClick={() => run(i)}>
              <i.icon size={16} className={styles.icon} />
              <span className={styles.label}>{i.label}</span>
              {i.hint && <span className={styles.hint}>{i.hint}</span>}
              {k === idx && <CornerDownLeft size={13} className={styles.enter} />}
            </button>
          ))}
        </div>
        <div className={styles.foot}><span>↑↓ navegar</span><span>↵ selecionar</span><span>esc fechar</span></div>
      </div>
    </div>
  )
}
