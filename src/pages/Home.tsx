import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Search, ChevronDown, Copy, Check, Printer, ArrowUp, MessageCircle,
  Linkedin, Github, Mail, Phone, MapPin, ExternalLink,
  Headphones, Radar, ShieldAlert, ListChecks, Lock, Terminal,
  Activity, Network, DatabaseBackup, ShieldCheck, Server, Cloud, type LucideIcon,
} from 'lucide-react'
import styles from './Home.module.css'
import aurora from '@/components/aurora/aurora.module.css'
import AuroraCanvas from '@/components/aurora/AuroraCanvas'
import SplitText from '@/components/aurora/SplitText'
import { useSpotlight } from '@/components/aurora/useSpotlight'
import Counter from '@/components/Counter'
import QRCode from '@/components/qr/QRCode'
import { useReveal } from '@/hooks/useReveal'
import {
  PROFILE, METRICS, TERMINAL, CAPS, JOBS, SKILLS, CERTS, EDU, CONTACTS, LINKEDIN_QR,
} from '@/data/cv'

const ICONS: Record<string, LucideIcon> = {
  Headphones, Radar, ShieldAlert, ListChecks, Lock, Terminal,
  Activity, Network, DatabaseBackup, ShieldCheck, Server, Cloud,
  Mail, Phone, Linkedin, Github, MapPin,
}
const Icon = ({ name, ...p }: { name: string } & React.ComponentProps<LucideIcon>) => {
  const C = ICONS[name] ?? Activity
  return <C {...p} />
}

const norm = (s: string) => {
  const t = (s || '').toLowerCase().normalize('NFD')
  try { return t.replace(/\p{Diacritic}/gu, '') } catch { return t.replace(/[̀-ͯ]/g, '') }
}

async function copyText(t: string): Promise<boolean> {
  try { await navigator.clipboard.writeText(t); return true }
  catch {
    try {
      const ta = document.createElement('textarea'); ta.value = t; ta.style.position = 'fixed'; ta.style.left = '-9999px'
      document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); return true
    } catch { return false }
  }
}

export default function Home() {
  const [query, setQuery] = useState('')
  const [openIdx, setOpenIdx] = useState<number>(0)
  const [copied, setCopied] = useState<string>('')
  const [shownLines, setShownLines] = useState(0)
  const [toTop, setToTop] = useState(false)
  const skillsRef = useRef<HTMLDivElement>(null)
  const capsRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  useReveal(styles.visible)
  useSpotlight(skillsRef)
  useSpotlight(capsRef)

  // Terminal boot sequence — linha a linha (robusto; caret na última).
  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) { setShownLines(TERMINAL.length); return }
    const iv = setInterval(() => setShownLines(n => { if (n >= TERMINAL.length) { clearInterval(iv); return n } return n + 1 }), 260)
    return () => clearInterval(iv)
  }, [])

  // Back-to-top visibility.
  useEffect(() => {
    const onScroll = () => setToTop(window.scrollY > 620)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Keyboard "/" focuses search.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (document.activeElement?.tagName || '').toLowerCase()
      if (e.key === '/' && tag !== 'input' && tag !== 'textarea') { e.preventDefault(); searchRef.current?.focus() }
      if (e.key === 'Escape' && document.activeElement === searchRef.current) { setQuery(''); searchRef.current?.blur() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const q = norm(query).trim()
  const terms = q ? q.split(/\s+/) : []
  const match = (text: string) => { const t = norm(text); return terms.every(x => t.includes(x)) }

  const jobs = useMemo(() => JOBS.filter(j => !terms.length || match(`${j.filter} ${j.role} ${j.org} ${j.desc} ${j.points.join(' ')}`)), [q])
  const skills = useMemo(() => SKILLS.filter(s => !terms.length || match(`${s.title} ${s.chips.join(' ')}`)), [q])

  const doCopy = async (key: string, val: string) => {
    if (await copyText(val)) { setCopied(key); setTimeout(() => setCopied(''), 1100) }
  }

  const waUrl = `${PROFILE.whatsapp}?text=${encodeURIComponent('Olá! Vi seu perfil e gostaria de conversar sobre uma oportunidade. Podemos falar?')}`
  const year = new Date().getFullYear()

  return (
    <div className={styles.page}>
      <AuroraCanvas className={styles.auroraBg} />
      <div className={styles.grid} aria-hidden="true" />

      {/* WhatsApp + back-to-top */}
      <a className={`${styles.fab} ${styles.wa}`} href={waUrl} target="_blank" rel="noopener noreferrer nofollow" aria-label="WhatsApp">
        <MessageCircle size={22} />
      </a>
      <button className={`${styles.fab} ${styles.top} ${toTop ? styles.show : ''}`} type="button" aria-label="Voltar ao topo"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <ArrowUp size={20} />
      </button>

      {/* Topbar */}
      <header className={styles.topbar}>
        <div className={styles.topInner}>
          <div className={styles.brand}>
            <span className={styles.logo}>NM</span>
            <span className={styles.brandText}>
              <span className={styles.brandTitle}>nicolas.mesquita</span>
              <span className={styles.brandSub}><span className={aurora.dot} /> mission control · online</span>
            </span>
          </div>
          <div className={styles.search} role="search">
            <Search size={15} />
            <input ref={searchRef} value={query} onChange={e => setQuery(e.target.value)} type="search"
              placeholder="filtrar experiências, skills, ferramentas..." aria-label="Buscar" autoComplete="off" />
            <span className={styles.kbd}>/</span>
          </div>
          <nav className={styles.nav} aria-label="Seções">
            <a href="#about">Perfil</a><a href="#experience">Experiência</a><a href="#skills">Skills</a>
            <a href="#credentials">Credenciais</a><a href="#contact">Contato</a>
          </nav>
        </div>
      </header>

      <main className={styles.container}>
        {/* HERO */}
        <section className={styles.hero}>
          <div className={`${styles.panel} ${styles.heroMain}`}>
            <span className={aurora.badge}><span className={aurora.dot} /> DISPONÍVEL PARA NOVAS OPORTUNIDADES</span>
            <h1 className={styles.name}>
              <SplitText>Nicolas Mesquita <em className={aurora.auroraText}>Fernandes</em></SplitText>
            </h1>
            <p className={styles.role}>{PROFILE.role}</p>
            <p className={styles.tagline}>{PROFILE.tagline}</p>
            <div className={styles.tags}>
              {PROFILE.tags.map(t => <span key={t} className={styles.tag}><span className={styles.tagDot}>◈</span> {t}</span>)}
            </div>
            <div className={styles.cta}>
              <a className={`${styles.btn} ${styles.primary}`} href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer nofollow"><Linkedin size={16} /> LinkedIn</a>
              <a className={styles.btn} href={PROFILE.github} target="_blank" rel="noopener noreferrer nofollow"><Github size={16} /> GitHub</a>
              <a className={styles.btn} href={waUrl} target="_blank" rel="noopener noreferrer nofollow"><MessageCircle size={16} /> Falar comigo</a>
              <button className={styles.btn} type="button" onClick={() => window.print()}><Printer size={16} /> PDF</button>
            </div>
          </div>

          <div className={`${styles.panel} ${styles.term}`} aria-hidden="true">
            <div className={styles.termBar}>
              <span className={styles.tRed} /><span className={styles.tYel} /><span className={styles.tGrn} />
              <span className={styles.termTitle}>noc@vivo:~ — status</span>
            </div>
            <div className={styles.termBody}>
              {TERMINAL.slice(0, shownLines).map((line, i) => {
                const prompt = line.startsWith('$')
                return (
                  <div key={i} className={styles.termLine}>
                    {prompt
                      ? <><span className={styles.prompt}>noc@vivo:~$</span>{line.slice(1)}</>
                      : <span className={line.includes('operational') ? styles.ok : styles.out}>{line}</span>}
                    {i === shownLines - 1 && <span className={styles.caret} />}
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* METRICS */}
        <section className={styles.metrics}>
          {METRICS.map(m => (
            <div key={m.label} className={`${styles.panel} ${styles.metric} ${styles.reveal}`} data-reveal>
              <div className={styles.metricK}><Counter end={m.count} suffix={m.suffix} /></div>
              <div className={styles.metricLbl}>{m.label}</div>
            </div>
          ))}
        </section>

        {/* ABOUT */}
        <section id="about" className={styles.section}>
          <div className={styles.secHead}>
            <span className={aurora.kicker}>Perfil</span><span className={styles.idx}>01 / whoami</span>
          </div>
          <div className={styles.cols}>
            <div className={`${styles.panel} ${styles.about} ${styles.reveal}`} data-reveal>
              <p>
                Atuo em <b>escalonamento e continuidade do serviço</b> em ambientes de missão crítica, unindo
                monitoração proativa, gestão de incidentes orientada a <b>SLA</b> e automação de rotinas operacionais.
              </p>
              <div ref={capsRef} className={styles.capGrid}>
                {CAPS.map(c => (
                  <div key={c.h} className={`${styles.cap} ${aurora.spotCell}`}>
                    <div className={styles.capH}><Icon name={c.icon} size={16} /> {c.h}</div>
                    <div className={styles.capD}>{c.d}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className={`${styles.panel} ${styles.about} ${styles.reveal}`} data-reveal>
              <span className={aurora.kicker} style={{ marginBottom: 12, display: 'block' }}>Snapshot</span>
              <div className={styles.snap}>
                <div className={styles.snapRow}><MapPin size={16} /><div><div className={styles.snapT}>São Paulo, Brasil</div><div className={styles.snapS}>Presencial / híbrido</div></div></div>
                <div className={styles.snapRow}><Activity size={16} /><div><div className={styles.snapT}>Foco</div><div className={styles.snapS}>Operação estável · Incidentes · SLA · Automação</div></div></div>
                <div className={styles.snapRow}><Server size={16} /><div><div className={styles.snapT}>Stack principal</div><div className={styles.snapS}>SolarWinds · Remedy · Grafana · Zabbix · Meraki</div></div></div>
                <div className={styles.snapRow}><Network size={16} /><div><div className={styles.snapT}>Idiomas</div><div className={styles.snapS}>Português (nativo) · Technical English</div></div></div>
              </div>
            </div>
          </div>
        </section>

        {/* EXPERIENCE */}
        <section id="experience" className={styles.section}>
          <div className={styles.secHead}>
            <span className={aurora.kicker}>Experiência</span><span className={styles.idx}>02 / operational history</span>
          </div>
          <div className={styles.timeline}>
            {jobs.length === 0 && <p className={styles.empty}>Nenhuma experiência corresponde ao filtro.</p>}
            {jobs.map((j) => {
              const realIdx = JOBS.indexOf(j)
              const open = openIdx === realIdx
              return (
                <div key={realIdx} className={`${styles.job} ${open ? styles.jobOpen : ''} ${styles.reveal}`} data-reveal>
                  <button className={styles.jobToggle} type="button" aria-expanded={open} onClick={() => setOpenIdx(open ? -1 : realIdx)}>
                    <div className={styles.jobTop}>
                      <div>
                        <div className={styles.jobRole}>{j.role}</div>
                        <div className={styles.jobOrg}>{j.org}</div>
                        {j.loc && <div className={styles.jobLoc}>{j.loc}</div>}
                      </div>
                      <div className={styles.jobMeta}>
                        <span className={styles.period}>{j.period}</span>
                        <span className={styles.chev}><ChevronDown size={16} /></span>
                      </div>
                    </div>
                  </button>
                  {open && (
                    <div className={styles.jobBody}>
                      <div className={styles.jobDesc}>{j.desc}</div>
                      <ul className={styles.points}>{j.points.map((p, k) => <li key={k}>{p}</li>)}</ul>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills" className={styles.section}>
          <div className={styles.secHead}>
            <span className={aurora.kicker}>Skills &amp; Ferramentas</span><span className={styles.idx}>03 / tooling matrix</span>
          </div>
          <div ref={skillsRef} className={styles.skills}>
            {skills.length === 0 && <p className={styles.empty}>Nenhuma skill corresponde ao filtro.</p>}
            {skills.map(s => (
              <div key={s.title} className={`${styles.panel} ${styles.skill} ${aurora.spotCell} ${styles.reveal}`} data-reveal>
                <div className={styles.skillH}>
                  <div className={styles.skillT}><Icon name={s.icon} size={16} /> {s.title}</div>
                  <div className={styles.signal}>
                    {Array.from({ length: 5 }).map((_, k) => (
                      <i key={k} className={k < s.level ? styles.on : ''} style={{ height: 6 + k * 2 }} />
                    ))}
                  </div>
                </div>
                <div className={styles.chips}>{s.chips.map(c => <span key={c} className={styles.chip}>{c}</span>)}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CREDENTIALS */}
        <section id="credentials" className={styles.section}>
          <div className={styles.secHead}>
            <span className={aurora.kicker}>Credenciais</span><span className={styles.idx}>04 / certification &amp; academic log</span>
          </div>
          <div className={styles.cols}>
            <div className={`${styles.panel} ${styles.about} ${styles.reveal}`} data-reveal>
              <span className={aurora.kicker} style={{ marginBottom: 12, display: 'block' }}>Certificações</span>
              <div className={styles.snap}>
                {CERTS.map(c => (
                  <div key={c.title} className={styles.snapRow}>
                    <ShieldCheck size={16} />
                    <div><div className={styles.snapT}>{c.title}</div><div className={styles.snapS}>{c.sub}</div>{c.cred && <div className={styles.cred}>cred: {c.cred}</div>}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className={`${styles.panel} ${styles.about} ${styles.reveal}`} data-reveal>
              <span className={aurora.kicker} style={{ marginBottom: 12, display: 'block' }}>Formação</span>
              <div className={styles.snap}>
                {EDU.map(e => (
                  <div key={e.title} className={styles.snapRow}>
                    <Server size={16} />
                    <div><div className={styles.snapT}>{e.title}</div><div className={styles.snapS}>{e.sub}</div></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className={styles.section}>
          <div className={styles.secHead}>
            <span className={aurora.kicker}>Contato</span><span className={styles.idx}>05 / communication channels</span>
          </div>
          <div className={styles.contactGrid}>
            <div className={`${styles.panel} ${styles.kv} ${styles.reveal}`} data-reveal>
              {CONTACTS.map(c => (
                <div key={c.type} className={styles.kvRow}>
                  <span className={styles.kvIc}><Icon name={c.icon} size={17} /></span>
                  <div className={styles.kvMain}>
                    <div className={styles.kvLbl}>{c.label}</div>
                    <div className={styles.kvVal}>
                      {c.href ? <a href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer nofollow">{c.value} {c.href.startsWith('http') && <ExternalLink size={12} style={{ display: 'inline', verticalAlign: '-1px' }} />}</a> : c.value}
                    </div>
                  </div>
                  {c.copy && (
                    <button className={`${styles.copyBtn} ${copied === c.type ? styles.copied : ''}`} type="button" onClick={() => doCopy(c.type, c.copy!)}>
                      {copied === c.type ? <><Check size={13} /> copiado</> : <><Copy size={13} /> copiar</>}
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className={`${styles.panel} ${styles.qrPanel} ${styles.reveal}`} data-reveal>
              <div className={styles.qrBox}><QRCode text={LINKEDIN_QR} size={132} /></div>
              <div className={styles.qrText}>
                <div className={styles.qrT}>QR do LinkedIn</div>
                <div className={styles.qrD}>Aponte a câmera para abrir o perfil — ideal para currículo impresso.</div>
              </div>
            </div>
          </div>
        </section>

        <footer className={styles.footer}>
          <div>© {year} Nicolas Mesquita Fernandes</div>
          <div>built with React · Vite · TypeScript</div>
        </footer>
      </main>
    </div>
  )
}
