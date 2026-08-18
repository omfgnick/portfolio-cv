import { useEffect, useRef, useState } from 'react'
import {
  Search, ChevronDown, Copy, Check, Printer, ArrowUp, MessageCircle,
  Linkedin, Github, Mail, Phone, MapPin, ExternalLink, ChevronRight,
  User, Briefcase, Cpu, Award, Radio, Download, Command, Globe, FolderGit2, ArrowUpRight, Sun, Moon, Languages,
  Headphones, Radar, ShieldAlert, ListChecks, Lock, Terminal,
  Activity, Network, DatabaseBackup, ShieldCheck, Server, Cloud, type LucideIcon,
} from 'lucide-react'
import styles from './Home.module.css'
import aurora from '@/components/aurora/aurora.module.css'
import AuroraCanvas from '@/components/aurora/AuroraCanvas'
import { useSpotlight } from '@/components/aurora/useSpotlight'
import { useTilt } from '@/components/aurora/useTilt'
import Counter from '@/components/Counter'
import QRCode from '@/components/qr/QRCode'
import CommandPalette, { type CmdItem } from '@/components/CommandPalette'
import VisitorPanel from '@/components/VisitorPanel'
import BootScreen from '@/components/BootScreen'
import ShortcutsHelp from '@/components/ShortcutsHelp'
import TerminalPanel from '@/components/Terminal'
import { useReveal } from '@/hooks/useReveal'
import { useVisits } from '@/hooks/useVisits'
import { downloadVCard } from '@/lib/vcard'
import { getCV, type Lang, LINKEDIN_QR } from '@/data/cv'
import { UI } from '@/i18n/ui'

const NAV = [
  { id: 'about', icon: User },
  { id: 'experience', icon: Briefcase },
  { id: 'skills', icon: Cpu },
  { id: 'projects', icon: FolderGit2 },
  { id: 'credentials', icon: Award },
  { id: 'contact', icon: Radio },
]

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

function SecHead({ cmd, tag }: { cmd: string; tag: string }) {
  return (
    <div className={styles.cmd}>
      <span className={styles.cmdLine}><span className={styles.cmdPrompt}>&gt;</span> {cmd}<span className={styles.cmdCaret} /></span>
      <span className={styles.cmdTag}>[ {tag} ]</span>
    </div>
  )
}

export default function Home() {
  const [query, setQuery] = useState('')
  const [openIdx, setOpenIdx] = useState<number>(0)
  const [copied, setCopied] = useState<string>('')
  const [toTop, setToTop] = useState(false)
  const [scrollPct, setScrollPct] = useState(0)
  const [active, setActive] = useState('about')
  const [clock, setClock] = useState('--:--:--')
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>(
    () => (typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'),
  )
  const [lang, setLang] = useState<Lang>(() => {
    try {
      const url = new URLSearchParams(window.location.search).get('lang')
      if (url === 'en' || url === 'pt') return url
      return localStorage.getItem('nm_lang') === 'en' ? 'en' : 'pt'
    } catch { return 'pt' }
  })
  const searchRef = useRef<HTMLInputElement>(null)
  const skillsRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLElement>(null)
  const termRef = useRef<HTMLDivElement>(null)
  const visits = useVisits()

  useSpotlight(skillsRef)
  useTilt(heroRef, termRef, { baseX: 0, rangeX: 6, rangeY: 8 })

  const t = UI[lang]
  const cv = getCV(lang)
  const P = cv.profile

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    try { localStorage.setItem('nm_theme', next) } catch { /* noop */ }
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', next === 'light' ? '#f3f7f5' : '#04110d')
  }
  const toggleLang = () => {
    const next: Lang = lang === 'pt' ? 'en' : 'pt'
    setLang(next)
    document.documentElement.setAttribute('lang', next === 'pt' ? 'pt-BR' : 'en')
    try { localStorage.setItem('nm_lang', next) } catch { /* noop */ }
  }

  useReveal(styles.visible)

  useEffect(() => {
    const loc = lang === 'pt' ? 'pt-BR' : 'en-GB'
    const tick = () => setClock(new Date().toLocaleTimeString(loc, { hour12: false }))
    tick(); const iv = setInterval(tick, 1000); return () => clearInterval(iv)
  }, [lang])

  useEffect(() => {
    const onScroll = () => {
      setToTop(window.scrollY > 620)
      const de = document.documentElement
      const max = de.scrollHeight - de.clientHeight
      setScrollPct(max > 0 ? Math.min(1, de.scrollTop / max) : 0)
      let cur = NAV[0].id
      for (const n of NAV) { const el = document.getElementById(n.id); if (el && el.getBoundingClientRect().top <= 160) cur = n.id }
      setActive(cur)
    }
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const KONAMI = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a']
    let ki = 0
    const glitch = () => { document.body.classList.add('nm-glitch'); setTimeout(() => document.body.classList.remove('nm-glitch'), 2600) }
    const onKey = (e: KeyboardEvent) => {
      const tag = (document.activeElement?.tagName || '').toLowerCase()
      const typing = tag === 'input' || tag === 'textarea'
      const k = e.key.toLowerCase()
      if (k === KONAMI[ki]) { ki++; if (ki === KONAMI.length) { ki = 0; glitch() } } else { ki = k === KONAMI[0] ? 1 : 0 }
      if ((k === 'k') && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setPaletteOpen(o => !o); return }
      if (e.key === '?' && !typing) { e.preventDefault(); setHelpOpen(o => !o); return }
      if (e.key === '/' && !typing) { e.preventDefault(); searchRef.current?.focus() }
      if (e.key === 'Escape' && document.activeElement === searchRef.current) { setQuery(''); searchRef.current?.blur() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const q = norm(query).trim()
  const terms = q ? q.split(/\s+/) : []
  const match = (text: string) => { const tx = norm(text); return terms.every(x => tx.includes(x)) }
  const jobs = cv.jobs.filter(j => !terms.length || match(`${j.filter} ${j.role} ${j.org} ${j.desc} ${j.points.join(' ')}`))
  const skills = cv.skills.filter(s => !terms.length || match(`${s.title} ${s.chips.join(' ')}`))

  const doCopy = async (key: string, val: string) => { if (await copyText(val)) { setCopied(key); setTimeout(() => setCopied(''), 1100) } }
  const waText = lang === 'pt'
    ? 'Olá! Vi seu perfil e gostaria de conversar sobre uma oportunidade. Podemos falar?'
    : 'Hi! I saw your profile and would like to talk about an opportunity. Can we chat?'
  const waUrl = `${P.whatsapp}?text=${encodeURIComponent(waText)}`
  const year = new Date().getFullYear()
  const nfmt = (n: number) => n.toLocaleString(lang === 'pt' ? 'pt-BR' : 'en-US')

  const goto = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  const cmdItems: CmdItem[] = [
    ...NAV.map(n => ({ id: `go-${n.id}`, label: `${t.goTo} ${t.navLabels[n.id]}`, icon: n.icon, run: () => goto(n.id) })),
    { id: 'linkedin', label: t.cmdLinkedin, hint: 'nicolasmesquita', icon: Linkedin, run: () => window.open(P.linkedin, '_blank', 'noopener') },
    { id: 'github', label: t.cmdGithub, hint: 'omfgnick', icon: Github, run: () => window.open(P.github, '_blank', 'noopener') },
    { id: 'wa', label: t.cmdWa, icon: MessageCircle, run: () => window.open(waUrl, '_blank', 'noopener') },
    { id: 'email', label: t.cmdEmail, hint: 'omfg_nick@hotmail.com', icon: Mail, run: () => doCopy('email', 'omfg_nick@hotmail.com') },
    { id: 'phone', label: t.cmdPhone, hint: '+55 11 94232-7967', icon: Phone, run: () => doCopy('phone', '+5511942327967') },
    { id: 'vcard', label: t.cmdVcard, icon: Download, run: downloadVCard },
    { id: 'print', label: t.cmdPrint, icon: Printer, run: () => window.print() },
  ]

  return (
    <div className={styles.shell}>
      <BootScreen skipText={t.bootSkip} />
      <AuroraCanvas className={styles.auroraBg} />
      <div className={styles.gridBg} aria-hidden="true" />
      <div className={styles.scan} aria-hidden="true" />
      <div className={styles.progress} aria-hidden="true"><span style={{ transform: `scaleX(${scrollPct})` }} /></div>

      <a className={`${styles.fab} ${styles.wa}`} href={waUrl} target="_blank" rel="noopener noreferrer nofollow" aria-label="WhatsApp"><MessageCircle size={22} /></a>
      <button className={`${styles.fab} ${styles.top} ${toTop ? styles.show : ''}`} type="button" aria-label="Top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><ArrowUp size={20} /></button>

      {/* LEFT RAIL */}
      <aside className={styles.rail}>
        <a className={styles.railBrand} href="#top" aria-label="Home"><span>NM</span></a>
        <nav className={styles.railNav} aria-label="Sections">
          {NAV.map(n => (
            <a key={n.id} href={`#${n.id}`} className={`${styles.railLink} ${active === n.id ? styles.railOn : ''}`} aria-current={active === n.id ? 'true' : undefined}>
              <n.icon size={19} />
              <span className={styles.railLabel}>{t.navLabels[n.id]}</span>
            </a>
          ))}
        </nav>
        <div className={styles.railFoot}>
          <a href={P.linkedin} target="_blank" rel="noopener noreferrer nofollow" aria-label="LinkedIn"><Linkedin size={16} /></a>
          <a href={P.github} target="_blank" rel="noopener noreferrer nofollow" aria-label="GitHub"><Github size={16} /></a>
          <span className={styles.railLed} title="online" />
        </div>
      </aside>

      {/* MAIN */}
      <div className={styles.main} id="top">
        <div className={styles.hudTop}>
          <span className={styles.hudPath}>SYS://<b>{active.toUpperCase()}</b></span>
          <label className={styles.hudSearch}>
            <Search size={14} />
            <input ref={searchRef} value={query} onChange={e => setQuery(e.target.value)} type="search" placeholder={t.searchPh} aria-label="Search" autoComplete="off" />
            <span className={styles.kbd}>/</span>
          </label>
          <button className={styles.hudIcon} type="button" onClick={toggleLang} aria-label={t.langToggle} title={t.langToggle}>
            <Languages size={14} /> <span className={styles.hudLang}>{lang.toUpperCase()}</span>
          </button>
          <button className={styles.hudIcon} type="button" onClick={toggleTheme} aria-label={t.themeToggle} title={t.themeToggle}>
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>
          <button className={styles.hudCmd} type="button" onClick={() => setPaletteOpen(true)} aria-label="Command palette (Ctrl/Cmd + K)">
            <Command size={13} /> K
          </button>
          {visits && <span className={styles.hudVisits} title="visits"><Globe size={12} /> {nfmt(visits.total)}</span>}
          <span className={styles.hudClock}><span className={styles.hudLed} /> {clock}</span>
        </div>

        <main className={styles.content}>
          {/* HERO */}
          <section ref={heroRef} className={styles.hero}>
            <div className={`${styles.panel} ${styles.heroMain}`}>
              <div className={styles.panelHead}><span className={styles.phId}>OPR·001</span><span className={styles.phDots}><i /><i /><i /></span><span className={styles.phStatus}>DOSSIER</span></div>
              <div className={styles.heroBody}>
                <span className={aurora.badge}><span className={aurora.dot} /> {t.available}</span>
                <h1 className={styles.name} data-text="Nicolas Mesquita Fernandes">Nicolas Mesquita <span className={styles.nameAccent}>Fernandes</span></h1>
                <p className={styles.role}>{P.role}</p>
                <div className={styles.idLine}>
                  <span>ID <b>NMF·2014</b></span><i>//</i><span>CLEARANCE <b>NOC-N3</b></span><i>//</i><span>LOC <b>SÃO PAULO</b></span><i>//</i><span>STATUS <b className={styles.avail}>AVAILABLE</b></span>
                </div>
                <p className={styles.tagline}>{P.tagline}</p>
                <div className={styles.tags}>{P.tags.map(tag => <span key={tag} className={styles.tag}><ChevronRight size={12} /> {tag}</span>)}</div>
                <div className={styles.cta}>
                  <a className={`${styles.btn} ${styles.primary}`} href={P.linkedin} target="_blank" rel="noopener noreferrer nofollow"><Linkedin size={16} /> LinkedIn</a>
                  <a className={styles.btn} href={P.github} target="_blank" rel="noopener noreferrer nofollow"><Github size={16} /> GitHub</a>
                  <a className={styles.btn} href={waUrl} target="_blank" rel="noopener noreferrer nofollow"><MessageCircle size={16} /> {t.contact}</a>
                  <button className={styles.btn} type="button" onClick={downloadVCard}><Download size={16} /> vCard</button>
                  <button className={styles.btn} type="button" onClick={() => window.print()}><Printer size={16} /> PDF</button>
                </div>
              </div>
            </div>

            <div ref={termRef} className={`${styles.panel} ${styles.term}`}>
              <div className={styles.panelHead}><span className={styles.phId}>TTY·0</span><span className={styles.phDots}><i /><i /><i /></span><span className={styles.phStatus}>noc@vivo</span></div>
              <TerminalPanel boot={cv.terminal} ctx={{ lang, goto, toggleTheme, toggleLang, print: () => window.print(), vcard: downloadVCard, links: { linkedin: P.linkedin, github: P.github, wa: waUrl } }} />
            </div>
          </section>

          {/* METRICS */}
          <section className={styles.metrics}>
            {cv.metrics.map((m, i) => (
              <div key={m.label} className={`${styles.metric} ${styles.reveal}`} data-reveal>
                {i > 0 && <span className={styles.metricSep} aria-hidden="true" />}
                <div className={styles.metricK}><Counter end={m.count} suffix={m.suffix} /></div>
                <div className={styles.metricLbl}>{m.label}</div>
              </div>
            ))}
          </section>

          <VisitorPanel data={visits} lang={lang} />

          {/* ABOUT */}
          <section id="about" className={styles.section}>
            <SecHead cmd={t.sectionTitle.about} tag="01" />
            <div className={styles.cols}>
              <div className={`${styles.panel} ${styles.pad} ${styles.reveal}`} data-reveal>
                <p className={styles.lead}>{t.aboutLead}</p>
                <div className={styles.capGrid}>
                  {cv.caps.map(c => (
                    <div key={c.h} className={styles.cap}>
                      <div className={styles.capH}><Icon name={c.icon} size={16} /> {c.h}</div>
                      <div className={styles.capD}>{c.d}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className={`${styles.panel} ${styles.pad} ${styles.reveal}`} data-reveal>
                <div className={styles.subhead}>{t.snapshot}</div>
                <div className={styles.snap}>
                  <div className={styles.snapRow}><MapPin size={16} /><div><div className={styles.snapT}>São Paulo, {lang === 'pt' ? 'Brasil' : 'Brazil'}</div><div className={styles.snapS}>{t.presential}</div></div></div>
                  <div className={styles.snapRow}><Activity size={16} /><div><div className={styles.snapT}>{t.focus}</div><div className={styles.snapS}>{t.focusVal}</div></div></div>
                  <div className={styles.snapRow}><Server size={16} /><div><div className={styles.snapT}>{t.stack}</div><div className={styles.snapS}>SolarWinds · Remedy · Grafana · Zabbix · Meraki</div></div></div>
                  <div className={styles.snapRow}><Network size={16} /><div><div className={styles.snapT}>{t.languages}</div><div className={styles.snapS}>{t.languagesVal}</div></div></div>
                </div>
              </div>
            </div>
          </section>

          {/* EXPERIENCE */}
          <section id="experience" className={styles.section}>
            <SecHead cmd={t.sectionTitle.experience} tag="02" />
            <div className={styles.timeline}>
              {jobs.length === 0 && <p className={styles.empty}>{t.emptyExp}</p>}
              {jobs.map((j) => {
                const realIdx = cv.jobs.indexOf(j)
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
                    <div className={styles.jobBody}>
                      <div className={styles.jobBodyInner}>
                        <div className={styles.jobDesc}>{j.desc}</div>
                        <ul className={styles.points}>{j.points.map((pt, k) => <li key={k}>{pt}</li>)}</ul>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* SKILLS */}
          <section id="skills" className={styles.section}>
            <SecHead cmd={t.sectionTitle.skills} tag="03" />
            <div ref={skillsRef} className={styles.skills}>
              {skills.length === 0 && <p className={styles.empty}>{t.emptySkill}</p>}
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

          {/* PROJECTS */}
          <section id="projects" className={styles.section}>
            <SecHead cmd={t.sectionTitle.projects} tag="04" />
            <div className={styles.projects}>
              {cv.projects.map(pr => (
                <a key={pr.name} href={pr.url} target="_blank" rel="noopener noreferrer nofollow"
                  className={`${styles.panel} ${styles.project} ${styles.reveal}`} data-reveal>
                  <div className={styles.projHead}>
                    <span className={styles.projName}><FolderGit2 size={15} /> {pr.name}</span>
                    <ArrowUpRight size={15} className={styles.projArrow} />
                  </div>
                  <p className={styles.projDesc}>{pr.desc}</p>
                  <div className={styles.projTags}>{pr.tags.map(tg => <span key={tg} className={styles.chip}>{tg}</span>)}</div>
                </a>
              ))}
            </div>
          </section>

          {/* CREDENTIALS */}
          <section id="credentials" className={styles.section}>
            <SecHead cmd={t.sectionTitle.credentials} tag="05" />
            <div className={styles.cols}>
              <div className={`${styles.panel} ${styles.pad} ${styles.reveal}`} data-reveal>
                <div className={styles.subhead}>{t.certifications}</div>
                <div className={styles.snap}>
                  {cv.certs.map(c => (
                    <div key={c.title} className={styles.snapRow}><ShieldCheck size={16} /><div><div className={styles.snapT}>{c.title}</div><div className={styles.snapS}>{c.sub}</div>{c.cred && <div className={styles.cred}>cred: {c.cred}</div>}</div></div>
                  ))}
                </div>
                <a className={styles.verifyLink} href={P.linkedin} target="_blank" rel="noopener noreferrer nofollow">{t.verify} <ArrowUpRight size={12} /></a>
              </div>
              <div className={`${styles.panel} ${styles.pad} ${styles.reveal}`} data-reveal>
                <div className={styles.subhead}>{t.education}</div>
                <div className={styles.snap}>
                  {cv.edu.map(e => <div key={e.title} className={styles.snapRow}><Server size={16} /><div><div className={styles.snapT}>{e.title}</div><div className={styles.snapS}>{e.sub}</div></div></div>)}
                </div>
              </div>
            </div>
          </section>

          {/* CONTACT */}
          <section id="contact" className={styles.section}>
            <SecHead cmd={t.sectionTitle.contact} tag="06" />
            <div className={styles.contactGrid}>
              <div className={`${styles.panel} ${styles.pad} ${styles.reveal}`} data-reveal>
                {cv.contacts.map(c => (
                  <div key={c.type} className={styles.kvRow}>
                    <span className={styles.kvIc}><Icon name={c.icon} size={17} /></span>
                    <div className={styles.kvMain}>
                      <div className={styles.kvLbl}>{c.label}</div>
                      <div className={styles.kvVal}>{c.href ? <a href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer nofollow">{c.value} {c.href.startsWith('http') && <ExternalLink size={12} style={{ display: 'inline', verticalAlign: '-1px' }} />}</a> : c.value}</div>
                    </div>
                    {c.copy && <button className={`${styles.copyBtn} ${copied === c.type ? styles.copied : ''}`} type="button" onClick={() => doCopy(c.type, c.copy!)}>{copied === c.type ? <><Check size={13} /> {t.ok}</> : <><Copy size={13} /> {t.copy}</>}</button>}
                  </div>
                ))}
              </div>
              <div className={`${styles.panel} ${styles.qrPanel} ${styles.reveal}`} data-reveal>
                <div className={styles.qrBox}><QRCode text={LINKEDIN_QR} size={132} /></div>
                <div className={styles.qrText}><div className={styles.qrT}>{t.qrTitle}</div><div className={styles.qrD}>{t.qrDesc}</div></div>
              </div>
            </div>
          </section>

          <footer className={styles.footer}>
            <div>© {year} NICOLAS MESQUITA FERNANDES</div>
            <div>REACT · VITE · TYPESCRIPT · <span className={styles.footOk}>SYSTEMS OPERATIONAL</span></div>
          </footer>
        </main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} items={cmdItems} ui={t} />
      <ShortcutsHelp open={helpOpen} onClose={() => setHelpOpen(false)} lang={lang} />
    </div>
  )
}
