import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styles from './Breach.module.css'

/**
 * Breach Protocol — o mini-jogo de matriz de códigos do Cyberpunk 2077.
 *
 * Regra do jogo: a primeira escolha sai da linha 0; depois alterna entre ficar
 * preso na COLUNA da escolha anterior e ficar preso na LINHA dela. Vence quem
 * montar a sequência-alvo dentro do buffer.
 *
 * A matriz é gerada a partir de um caminho válido, e não sorteada e torcida
 * para dar certo: sem isso, uma matriz aleatória pode simplesmente não ter
 * solução, e o jogador fica tentando resolver algo impossível.
 *
 * Easter egg: só aparece por `breach` no terminal.
 */

const CODES = ['1C', '55', '7A', 'BD', 'E9', 'FF']
const SIZE = 5
const BUFFER = 6
const TARGET_LEN = 3

type Cell = { r: number; c: number }
const rnd = (n: number) => Math.floor(Math.random() * n)

/** Gera a grade já contendo uma solução, e devolve também a sequência-alvo. */
function build(): { grid: string[][]; target: string[] } {
  const grid = Array.from({ length: SIZE }, () =>
    Array.from({ length: SIZE }, () => CODES[rnd(CODES.length)]),
  )

  // Caminho legal: linha 0 → mesma coluna → mesma linha → ...
  const path: Cell[] = []
  let r = 0
  let c = rnd(SIZE)
  path.push({ r, c })
  for (let i = 1; i < TARGET_LEN; i++) {
    if (i % 2 === 1) {
      // preso na coluna da anterior: escolhe outra linha
      let nr = rnd(SIZE)
      while (nr === r) nr = rnd(SIZE)
      r = nr
    } else {
      // preso na linha da anterior: escolhe outra coluna
      let nc = rnd(SIZE)
      while (nc === c) nc = rnd(SIZE)
      c = nc
    }
    path.push({ r, c })
  }

  const target = path.map(() => CODES[rnd(CODES.length)])
  path.forEach((p, i) => { grid[p.r][p.c] = target[i] })
  return { grid, target }
}

export default function Breach({ onClose, lang, title }: { onClose: () => void; lang: 'pt' | 'en'; title: string }) {
  const pt = lang === 'pt'
  const [{ grid, target }, setGame] = useState(build)
  const [buffer, setBuffer] = useState<{ code: string; r: number; c: number }[]>([])
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing')
  const closeRef = useRef<HTMLButtonElement>(null)

  // Passo par prende na coluna da anterior; passo ímpar prende na linha.
  const step = buffer.length
  const last = buffer[step - 1]
  const lockRow = step === 0 ? 0 : step % 2 === 0 ? last.r : null
  const lockCol = step === 0 ? null : step % 2 === 1 ? last.c : null

  const enabled = useCallback((r: number, c: number) => {
    if (status !== 'playing') return false
    if (buffer.some(b => b.r === r && b.c === c)) return false
    if (lockRow !== null) return r === lockRow
    if (lockCol !== null) return c === lockCol
    return true
  }, [status, buffer, lockRow, lockCol])

  const pick = (r: number, c: number) => {
    if (!enabled(r, c)) return
    const next = [...buffer, { code: grid[r][c], r, c }]
    setBuffer(next)

    const codes = next.map(b => b.code)
    const joined = codes.join(',')
    if (joined.includes(target.join(','))) { setStatus('won'); return }
    if (next.length >= BUFFER) setStatus('lost')
  }

  const restart = () => { setGame(build()); setBuffer([]); setStatus('playing') }

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const msg = useMemo(() => {
    if (status === 'won') return pt ? 'ACESSO CONCEDIDO' : 'ACCESS GRANTED'
    if (status === 'lost') return pt ? 'BUFFER ESGOTADO' : 'BUFFER DEPLETED'
    return pt ? 'em execução' : 'in progress'
  }, [status, pt])

  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true" aria-label={title}>
      <div className={styles.box}>
        <div className={styles.head}>
          <span className={styles.title}>{title}</span>
          <button ref={closeRef} className={styles.close} type="button" onClick={onClose}
            aria-label={pt ? 'Fechar' : 'Close'}>×</button>
        </div>

        <p className={styles.hint}>
          {pt
            ? 'A primeira escolha sai da linha destacada. Depois alterna: coluna, linha, coluna…'
            : 'First pick comes from the highlighted row. Then it alternates: column, row, column…'}
        </p>

        <div className={styles.seq}>
          <span className={styles.seqLabel}>{pt ? 'SEQUÊNCIA' : 'SEQUENCE'}</span>
          {target.map((t, i) => <b key={i}>{t}</b>)}
        </div>

        <div className={styles.buffer}>
          <span className={styles.seqLabel}>BUFFER</span>
          {Array.from({ length: BUFFER }).map((_, i) => (
            <i key={i} className={buffer[i] ? styles.filled : ''}>{buffer[i]?.code ?? ''}</i>
          ))}
        </div>

        <div className={styles.grid} role="grid">
          {grid.map((row, r) => (
            <div key={r} className={styles.row} role="row">
              {row.map((code, c) => {
                const used = buffer.some(b => b.r === r && b.c === c)
                const on = enabled(r, c)
                return (
                  <button
                    key={c}
                    role="gridcell"
                    type="button"
                    className={`${styles.cell} ${used ? styles.used : ''} ${on ? styles.on : ''}`}
                    onClick={() => pick(r, c)}
                    disabled={!on}
                    aria-label={`${code} — ${pt ? 'linha' : 'row'} ${r + 1}, ${pt ? 'coluna' : 'column'} ${c + 1}`}
                  >{code}</button>
                )
              })}
            </div>
          ))}
        </div>

        {/* aria-live para quem não vê a grade acompanhar o resultado */}
        <div className={`${styles.status} ${styles[status]}`} role="status" aria-live="polite">{msg}</div>

        <button className={styles.again} type="button" onClick={restart}>
          {pt ? 'nova matriz' : 'new matrix'}
        </button>
      </div>
    </div>
  )
}
