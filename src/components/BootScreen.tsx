import { useEffect, useState } from 'react'
import styles from './BootScreen.module.css'

const LINES = [
  'nightcity-ops boot · v4.8',
  'loading kernel modules ......... ok',
  'mount /noc /sla /incidents ..... ok',
  'establishing uplink ............ ok',
  'decrypting dossier ............. ok',
  'operator » nicolas.mesquita',
  '● systems operational',
]

export default function BootScreen({ skipText }: { skipText: string }) {
  const [show, setShow] = useState(true)
  const [n, setN] = useState(0)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) { setShow(false); return }
    const iv = setInterval(() => setN(v => Math.min(v + 1, LINES.length)), 175)
    const t1 = setTimeout(() => setClosing(true), 1900)
    const t2 = setTimeout(() => setShow(false), 2350) // remoção garantida
    const skip = () => { setClosing(true); setTimeout(() => setShow(false), 240) }
    window.addEventListener('keydown', skip)
    window.addEventListener('pointerdown', skip)
    return () => {
      clearInterval(iv); clearTimeout(t1); clearTimeout(t2)
      window.removeEventListener('keydown', skip); window.removeEventListener('pointerdown', skip)
    }
  }, [])

  if (!show) return null
  return (
    <div className={`${styles.boot} ${closing ? styles.closing : ''}`} role="status" aria-label="Inicializando sistema">
      {/* Camadas de cenario. aria-hidden porque nada aqui e informacao: quem
          usa leitor de tela ouve o aria-label do container e mais nada. */}
      <div className={styles.sweep} aria-hidden="true" />
      <div className={styles.bars} aria-hidden="true" />
      <div className={styles.mark} aria-hidden="true" data-text="NM">NM</div>
      <div className={styles.head} aria-hidden="true">NIGHT CITY // OPS TERMINAL</div>
      <div className={styles.term}>
        {LINES.slice(0, n).map((l, i) => (
          <div key={i} className={styles.line}>
            <span className={styles.p}>›</span> {l}{i === n - 1 && <span className={styles.caret} />}
          </div>
        ))}
      </div>
      <div className={styles.skip}>{skipText}</div>
    </div>
  )
}
