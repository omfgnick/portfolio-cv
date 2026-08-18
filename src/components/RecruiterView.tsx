import { useEffect, useRef } from 'react'
import { X, Linkedin, MessageCircle, FileText, Mail } from 'lucide-react'
import type { CVData } from '@/data/cv'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import styles from './RecruiterView.module.css'

export interface RecruiterUI {
  title: string; close: string; now: string; stack: string
  certs: string; pdf: string; email: string; seeFull: string
}

interface Props {
  cv: CVData
  ui: RecruiterUI
  pdfUrl: string
  waUrl: string
  email: string
  onClose: () => void
}

/**
 * Resumo de uma tela para quem tem 30 segundos. Só reaproveita conteúdo que já
 * existe no CV (métricas, cargo mais recente, skills, certificações) — nada aqui
 * é redigido à parte, para não divergir do currículo completo.
 */
export default function RecruiterView({ cv, ui, pdfUrl, waUrl, email, onClose }: Props) {
  const boxRef = useRef<HTMLDivElement>(null)
  useFocusTrap(boxRef, true)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.preventDefault(); onClose() } }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [onClose])

  const now = cv.jobs[0]
  // Enxuto de propósito: o resumo precisa caber numa tela de laptop (~720px)
  const topSkills = cv.skills.slice(0, 4).flatMap(s => s.chips.slice(0, 2))

  return (
    <div className={styles.overlay} onMouseDown={onClose} role="dialog" aria-modal="true" aria-label={ui.title}>
      <div ref={boxRef} className={styles.card} onMouseDown={e => e.stopPropagation()}>
        <div className={styles.head}>
          <span>{ui.title}</span>
          <button className={styles.close} type="button" onClick={onClose}>
            <X size={13} /> ESC
          </button>
        </div>

        <div className={styles.body}>
          <h2 className={styles.name}>{cv.profile.name}</h2>
          <p className={styles.role}>{cv.profile.role.replace(/^\/\/\s*/, '')}</p>
          <p className={styles.tagline}>{cv.profile.tagline}</p>

          <div className={styles.metrics}>
            {cv.metrics.map(m => (
              <div key={m.label} className={styles.metric}>
                <span className={styles.mVal}>{m.count}{m.suffix ?? ''}</span>
                <span className={styles.mLbl}>{m.label}</span>
              </div>
            ))}
          </div>

          {now && (
            <>
              <div className={styles.blockTitle}>{ui.now}</div>
              <div className={styles.now}>
                <div className={styles.nowRole}>{now.role}</div>
                <div className={styles.nowOrg}>{now.org}</div>
                <div className={styles.nowPeriod}>{now.period}</div>
                <ul className={styles.points}>
                  {now.points.slice(0, 2).map((p, i) => <li key={i}>{p}</li>)}
                </ul>
              </div>
            </>
          )}

          <div className={styles.blockTitle}>{ui.stack}</div>
          <div className={styles.chips}>
            {topSkills.map(c => <span key={c} className={styles.chip}>{c}</span>)}
          </div>

          <div className={styles.blockTitle}>{ui.certs}</div>
          <div className={styles.chips}>
            {cv.certs.slice(0, 4).map(c => <span key={c.title} className={styles.chip}>{c.title}</span>)}
          </div>

          <div className={styles.actions}>
            <a className={`${styles.btn} ${styles.primary}`} href={pdfUrl} download data-testid="rv-pdf">
              <FileText size={15} /> {ui.pdf}
            </a>
            <a className={styles.btn} href={cv.profile.linkedin} target="_blank" rel="noopener noreferrer nofollow">
              <Linkedin size={15} /> LinkedIn
            </a>
            <a className={styles.btn} href={waUrl} target="_blank" rel="noopener noreferrer nofollow">
              <MessageCircle size={15} /> WhatsApp
            </a>
            <a className={styles.btn} href={`mailto:${email}`}>
              <Mail size={15} /> {ui.email}
            </a>
          </div>

          <button className={styles.full} type="button" onClick={onClose}>{ui.seeFull}</button>
        </div>
      </div>
    </div>
  )
}
