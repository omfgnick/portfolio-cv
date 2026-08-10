import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Search, ChevronDown, Copy, Check, Printer, ArrowUp, MessageCircle,
  Linkedin, Github, Mail, Phone, MapPin, ExternalLink, ChevronRight,
  User, Briefcase, Cpu, Award, Radio,
  Headphones, Radar, ShieldAlert, ListChecks, Lock, Terminal,
  Activity, Network, DatabaseBackup, ShieldCheck, Server, Cloud, type LucideIcon,
} from 'lucide-react'
import styles from './Home.module.css'
import aurora from '@/components/aurora/aurora.module.css'
import AuroraCanvas from '@/components/aurora/AuroraCanvas'
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

const NAV = [
  { id: 'about', label: 'PERFIL', icon: User },
  { id: 'experience', label: 'EXP', icon: Briefcase },
  { id: 'skills', label: 'SKILLS', icon: Cpu },
  { id: 'credentials', label: 'CRED', icon: Award },
  { id: 'contact', label: 'LINK', icon: Radio },
]

const CMD: Record<string, string> = {
  about: '~/profile $ whoami',
  experience: '~/logs $ cat operational_history',
  skills: '~/sys $ ls tooling_matrix',
  credentials: '~/creds $ verify --all',
  contact: '~/net $ connect --secure',
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

function SecHead({ id, tag }: { id: string; tag: string }) {
  return (
    <div className={styles.cmd}>
      <span className={styles.cmdLine}><span className={styles.cmdPrompt}>&gt;</span> {CMD[id]}<span className={styles.cmdCaret} /></span>
      <span className={styles.cmdTag}>[ {tag} ]</span>
    </div>
  )
}

export default function Home() {
  const [query, setQuery] = useState('')
  const [openIdx, setOpenIdx] = useState<number>(0)
  const [copied, setCopied] = useState<string>('')
  const [shownLines, setShownLines] = useState(0)
  const [toTop, setToTop] = useState(false)
  const [active, setActive] = useState('about')
  const [clock, setClock] = useState('--:--:--')
  const searchRef = useRef<HTMLInputElement>(null)

  useReveal(styles.visible)

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) { setShownLines(TERMINAL.length); return }
    const iv = setInterval(() => setShownLines(n => { if (n >= TERMINAL.length) { clearInterval(iv); return n } return n + 1 }), 240)
    return () => clearInterval(iv)
  }, [])

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString('pt-BR', { hour12: false }))
    tick(); const iv = setInterval(tick, 1000); return () => clearInterval(iv)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      setToTop(window.scrollY > 620)
      let cur = NAV[0].id
      for (const n of NAV) { const el = document.getElementById(n.id); if (el && el.getBoundingClientRect().top <= 160) cur = n.id }
      setActive(cur)
    }
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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

  const doCopy = async (key: string, val: string) => { if (await copyText(val)) { setCopied(key); setTimeout(() => setCopied(''), 1100) } }
  const waUrl = `${PROFILE.whatsapp}?text=${encodeURIComponent('Olá! Vi seu perfil e gostaria de conversar sobre uma oportunidade. Podemos falar?')}`
  const year = new Date().getFullYear()

  return (
    <div className={styles.shell}>
      <AuroraCanvas className={styles.auroraBg} />
      <div className={styles.gridBg} aria-hidden="true" />
      <div className={styles.scan} aria-hidden="true" />

      {/* floating */}
      <a className={`${styles.fab} ${styles.wa}`} href={waUrl} target="_blank" rel="noopener noreferrer nofollow" aria-label="WhatsApp"><MessageCircle size={22} /></a>
      <button className={`${styles.fab} ${styles.top} ${toTop ? styles.show : ''}`} type="button" aria-label="Voltar ao topo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><ArrowUp size={20} /></button>

      {/* LEFT RAIL */}
      <aside className={styles.rail}>
        <a className={styles.railBrand} href="#top" aria-label="Início"><span>NM</span></a>
        <nav className={styles.railNav} aria-label="Seções">
          {NAV.map(n => (
            <a key={n.id} href={`#${n.id}`} className={`${styles.railLink} ${active === n.id ? styles.railOn : ''}`} aria-current={active === n.id ? 'true' : undefined}>
              <n.icon size={19} />
              <span className={styles.railLabel}>{n.label}</span>
            </a>
          ))}
        </nav>
        <div className={styles.railFoot}>
          <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer nofollow" aria-label="LinkedIn"><Linkedin size={16} /></a>
          <a href={PROFILE.github} target="_blank" rel="noopener noreferrer nofollow" aria-label="GitHub"><Github size={16} /></a>
          <span className={styles.railLed} title="online" />
        </div>
      </aside>

      {/* MAIN */}
      <div className={styles.main} id="top">
        <div className={styles.hudTop}>
          <span className={styles.hudPath}>SYS://<b>{active.toUpperCase()}</b></span>
          <label className={styles.hudSearch}>
            <Search size={14} />
            <input ref={searchRef} value={query} onChange={e => setQuery(e.target.value)} type="search" placeholder="filter --experiencia --skill --ferramenta" aria-label="Buscar" autoComplete="off" />
            <span className={styles.kbd}>/</span>
          </label>
          <span className={styles.hudClock}><span className={styles.hudLed} /> {clock}</span>
        </div>

        <main className={styles.content}>
          {/* HERO */}
          <section className={styles.hero}>
            <div className={`${styles.panel} ${styles.heroMain}`}>
              <div className={styles.panelHead}><span className={styles.phId}>OPR·001</span><span className={styles.phDots}><i /><i /><i /></span><span className={styles.phStatus}>DOSSIER</span></div>
              <div className={styles.heroBody}>
                <span className={aurora.badge}><span className={aurora.dot} /> DISPONÍVEL PARA NOVAS OPORTUNIDADES</span>
                <h1 className={styles.name} data-text="Nicolas Mesquita Fernandes">Nicolas Mesquita <span className={styles.nameAccent}>Fernandes</span></h1>
                <p className={styles.role}>{PROFILE.role}</p>
                <div className={styles.idLine}>
                  <span>ID <b>NMF·2014</b></span><i>//</i><span>CLEARANCE <b>NOC-N3</b></span><i>//</i><span>LOC <b>SÃO PAULO</b></span><i>//</i><span>STATUS <b className={styles.avail}>AVAILABLE</b></span>
                </div>
                <p className={styles.tagline}>{PROFILE.tagline}</p>
                <div className={styles.tags}>{PROFILE.tags.map(t => <span key={t} className={styles.tag}><ChevronRight size={12} /> {t}</span>)}</div>
                <div className={styles.cta}>
                  <a className={`${styles.btn} ${styles.primary}`} href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer nofollow"><Linkedin size={16} /> LinkedIn</a>
                  <a className={styles.btn} href={PROFILE.github} target="_blank" rel="noopener noreferrer nofollow"><Github size={16} /> GitHub</a>
                  <a className={styles.btn} href={waUrl} target="_blank" rel="noopener noreferrer nofollow"><MessageCircle size={16} /> Falar comigo</a>
                  <button className={styles.btn} type="button" onClick={() => window.print()}><Printer size={16} /> PDF</button>
                </div>
              </div>
            </div>

            <div className={`${styles.panel} ${styles.term}`} aria-hidden="true">
              <div className={styles.panelHead}><span className={styles.phId}>TTY·0</span><span className={styles.phDots}><i /><i /><i /></span><span className={styles.phStatus}>noc@vivo</span></div>
              <div className={styles.termBody}>
                {TERMINAL.slice(0, shownLines).map((line, i) => {
                  const prompt = line.startsWith('$')
                  return (
                    <div key={i} className={styles.termLine}>
                      {prompt ? <><span className={styles.prompt}>noc@vivo:~$</span>{line.slice(1)}</> : <span className={line.includes('operational') ? styles.ok : styles.out}>{line}</span>}
                      {i === shownLines - 1 && <span className={styles.caret} />}
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

          {/* METRICS readout */}
          <section className={styles.metrics}>
            {METRICS.map((m, i) => (
              <div key={m.label} className={`${styles.metric} ${styles.reveal}`} data-reveal>
                {i > 0 && <span className={styles.metricSep} aria-hidden="true" />}
                <div className={styles.metricK}><Counter end={m.count} suffix={m.suffix} /></div>
                <div className={styles.metricLbl}>{m.label}</div>
              </div>
            ))}
          </section>

          {/* ABOUT */}
          <section id="about" className={styles.section}>
            <SecHead id="about" tag="01" />
            <div className={styles.cols}>
              <div className={`${styles.panel} ${styles.pad} ${styles.reveal}`} data-reveal>
                <p className={styles.lead}>Atuo em <b>escalonamento e continuidade do serviço</b> em ambientes de missão crítica, unindo monitoração proativa, gestão de incidentes orientada a <b>SLA</b> e automação de rotinas operacionais.</p>
                <div className={styles.capGrid}>
                  {CAPS.map(c => (
                    <div key={c.h} className={styles.cap}>
                      <div className={styles.capH}><Icon name={c.icon} size={16} /> {c.h}</div>
                      <div className={styles.capD}>{c.d}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className={`${styles.panel} ${styles.pad} ${styles.reveal}`} data-reveal>
                <div className={styles.subhead}>// SNAPSHOT</div>
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
            <SecHead id="experience" tag="02" />
            <div className={styles.timeline}>
              {jobs.length === 0 && <p className={styles.empty}>Nenhuma experiência corresponde ao filtro.</p>}
              {jobs.map((j) => {
                const realIdx = JOBS.indexOf(j)
                const open = openIdx === realIdx
                return (
                  <div key={realIdx} className={`${styles.job} ${styles.reveal}`} data-open={open ? 'true' : 'false'} data-reveal>
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
            <SecHead id="skills" tag="03" />
            <div className={styles.skills}>
              {skills.length === 0 && <p className={styles.empty}>Nenhuma skill corresponde ao filtro.</p>}
              {skills.map(s => (
                <div key={s.title} className={`${styles.panel} ${styles.skill} ${styles.reveal}`} data-reveal>
                  <div className={styles.skillH}>
                    <div className={styles.skillT}><Icon name={s.icon} size={16} /> {s.title}</div>
                    <div className={styles.signal}>{Array.from({ length: 5 }).map((_, k) => <i key={k} className={k < s.level ? styles.on : ''} style={{ height: 6 + k * 2 }} />)}</div>
                  </div>
                  <div className={styles.chips}>{s.chips.map(c => <span key={c} className={styles.chip}>{c}</span>)}</div>
                </div>
              ))}
            </div>
          </section>

          {/* CREDENTIALS */}
          <section id="credentials" className={styles.section}>
            <SecHead id="credentials" tag="04" />
            <div className={styles.cols}>
              <div className={`${styles.panel} ${styles.pad} ${styles.reveal}`} data-reveal>
                <div className={styles.subhead}>// CERTIFICAÇÕES</div>
                <div className={styles.snap}>
                  {CERTS.map(c => (
                    <div key={c.title} className={styles.snapRow}><ShieldCheck size={16} /><div><div className={styles.snapT}>{c.title}</div><div className={styles.snapS}>{c.sub}</div>{c.cred && <div className={styles.cred}>cred: {c.cred}</div>}</div></div>
                  ))}
                </div>
              </div>
              <div className={`${styles.panel} ${styles.pad} ${styles.reveal}`} data-reveal>
                <div className={styles.subhead}>// FORMAÇÃO</div>
                <div className={styles.snap}>
                  {EDU.map(e => <div key={e.title} className={styles.snapRow}><Server size={16} /><div><div className={styles.snapT}>{e.title}</div><div className={styles.snapS}>{e.sub}</div></div></div>)}
                </div>
              </div>
            </div>
          </section>

          {/* CONTACT */}
          <section id="contact" className={styles.section}>
            <SecHead id="contact" tag="05" />
            <div className={styles.contactGrid}>
              <div className={`${styles.panel} ${styles.pad} ${styles.reveal}`} data-reveal>
                {CONTACTS.map(c => (
                  <div key={c.type} className={styles.kvRow}>
                    <span className={styles.kvIc}><Icon name={c.icon} size={17} /></span>
                    <div className={styles.kvMain}>
                      <div className={styles.kvLbl}>{c.label}</div>
                      <div className={styles.kvVal}>{c.href ? <a href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer nofollow">{c.value} {c.href.startsWith('http') && <ExternalLink size={12} style={{ display: 'inline', verticalAlign: '-1px' }} />}</a> : c.value}</div>
                    </div>
                    {c.copy && <button className={`${styles.copyBtn} ${copied === c.type ? styles.copied : ''}`} type="button" onClick={() => doCopy(c.type, c.copy!)}>{copied === c.type ? <><Check size={13} /> ok</> : <><Copy size={13} /> copy</>}</button>}
                  </div>
                ))}
              </div>
              <div className={`${styles.panel} ${styles.qrPanel} ${styles.reveal}`} data-reveal>
                <div className={styles.qrBox}><QRCode text={LINKEDIN_QR} size={132} /></div>
                <div className={styles.qrText}><div className={styles.qrT}>QR // LINKEDIN</div><div className={styles.qrD}>Aponte a câmera para abrir o perfil — ideal para currículo impresso.</div></div>
              </div>
            </div>
          </section>

          <footer className={styles.footer}>
            <div>© {year} NICOLAS MESQUITA FERNANDES</div>
            <div>REACT · VITE · TYPESCRIPT · <span className={styles.footOk}>SYSTEMS OPERATIONAL</span></div>
          </footer>
        </main>
      </div>
    </div>
  )
}
