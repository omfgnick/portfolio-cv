import { Linkedin } from 'lucide-react'
import type { Lang } from '@/data/cv'
import { TESTIMONIALS, initials, formatDate } from '@/data/testimonials'
import styles from './Testimonials.module.css'

interface Props {
  lang: Lang
  /** Link para a aba de recomendações do LinkedIn (verificação pela fonte). */
  source: string
  ui: { verifyOn: string; translated: string }
}

export default function Testimonials({ lang, source, ui }: Props) {
  const pt = lang === 'pt'
  return (
    <>
      <div className={styles.grid}>
        {TESTIMONIALS.map(t => (
          <figure key={t.name} className={styles.card}>
            <span className={styles.mark} aria-hidden="true">&rdquo;</span>
            <blockquote className={styles.quote} cite={source}>
              {pt ? t.quote : t.quoteEn}
            </blockquote>
            {!pt && <span className={styles.translated}>{ui.translated}</span>}
            <figcaption className={styles.who}>
              <span className={styles.avatar} aria-hidden="true">{initials(t.name)}</span>
              <span className={styles.meta}>
                <span className={styles.name}>{t.name}</span>
                <span className={styles.role}>{t.role}</span>
                <span className={styles.rel}>{t.rel[lang]} · {formatDate(t.date, lang)}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
      <a className={styles.source} href={source} target="_blank" rel="noopener noreferrer nofollow">
        <Linkedin size={13} /> {ui.verifyOn}
      </a>
    </>
  )
}
