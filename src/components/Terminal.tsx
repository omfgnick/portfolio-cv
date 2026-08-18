import { useEffect, useRef, useState } from 'react'
import type { Lang } from '@/data/cv'
import styles from './Terminal.module.css'

type Line = { t: string; c: 'p' | 'ok' | 'out' | 'err' | 'echo' }

export interface TermCtx {
  lang: Lang
  goto: (id: string) => void
  toggleTheme: () => void
  toggleLang: () => void
  print: () => void
  vcard: () => void
  links: { linkedin: string; github: string; wa: string }
}

const SECTIONS = ['about', 'experience', 'skills', 'projects', 'credentials', 'contact']
const ALIAS: Record<string, string> = {
  perfil: 'about', profile: 'about', experiencia: 'experience', exp: 'experience',
  projetos: 'projects', proj: 'projects', credenciais: 'credentials', cred: 'credentials',
  contato: 'contact', link: 'contact', skill: 'skills',
}

export default function Terminal({ boot, ctx }: { boot: string[]; ctx: TermCtx }) {
  const [lines, setLines] = useState<Line[]>([])
  const [booted, setBooted] = useState(false)
  const [input, setInput] = useState('')
  const bodyRef = useRef<HTMLDivElement>(null)
  const pt = ctx.lang === 'pt'

  // boot sequence
  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const toLine = (l: string): Line => l.startsWith('$') ? { t: l.slice(1), c: 'p' } : { t: l, c: l.includes('operational') ? 'ok' : 'out' }
    if (reduce) { setLines(boot.map(toLine)); setBooted(true); return }
    let i = 0
    const iv = setInterval(() => {
      const cur = boot[i]        // captura AGORA (o updater do setState roda diferido)
      i++
      if (cur !== undefined) setLines(prev => [...prev, toLine(cur)])
      if (i >= boot.length) { clearInterval(iv); setBooted(true) }
    }, 220)
    return () => clearInterval(iv)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => { const el = bodyRef.current; if (el) el.scrollTop = el.scrollHeight }, [lines])

  const push = (t: string, c: Line['c'] = 'out') => setLines(prev => [...prev, { t, c }])

  const run = (raw: string) => {
    const cmd = raw.trim()
    push(cmd, 'echo')
    if (!cmd) return
    const [name, arg] = cmd.toLowerCase().split(/\s+/)
    const target = ALIAS[arg] || arg
    switch (name) {
      case 'help': case '?':
        push(pt ? 'comandos disponíveis:' : 'available commands:', 'ok')
        push('help · ls · cd <' + (pt ? 'seção' : 'section') + '> · open <linkedin|github|whatsapp>')
        push('theme · lang · pdf · vcard · whoami · clear'); break
      case 'ls': case 'dir':
        push(SECTIONS.join('   '), 'ok'); break
      case 'cd': case 'goto': case 'go':
        if (SECTIONS.includes(target)) { ctx.goto(target); push((pt ? '→ indo para ' : '→ going to ') + target, 'ok') }
        else push((pt ? 'seção desconhecida: ' : 'unknown section: ') + (arg || ''), 'err'); break
      case 'open':
        if (arg === 'linkedin') { window.open(ctx.links.linkedin, '_blank', 'noopener'); push('→ linkedin', 'ok') }
        else if (arg === 'github') { window.open(ctx.links.github, '_blank', 'noopener'); push('→ github', 'ok') }
        else if (arg === 'whatsapp' || arg === 'wa') { window.open(ctx.links.wa, '_blank', 'noopener'); push('→ whatsapp', 'ok') }
        else if (SECTIONS.includes(target)) { ctx.goto(target); push('→ ' + target, 'ok') }
        else push((pt ? 'não sei abrir: ' : "can't open: ") + (arg || ''), 'err'); break
      case 'theme': ctx.toggleTheme(); push(pt ? '✓ tema alternado' : '✓ theme toggled', 'ok'); break
      case 'lang': case 'language': ctx.toggleLang(); push('✓ pt/en', 'ok'); break
      case 'pdf': case 'print': ctx.print(); push('✓ print', 'ok'); break
      case 'vcard': ctx.vcard(); push('✓ vcard.vcf', 'ok'); break
      case 'whoami': push('nicolas.mesquita — infrastructure & incident operations', 'ok'); break
      case 'clear': case 'cls': setLines([]); break
      case 'sudo': push(pt ? 'nice try 😏' : 'nice try 😏', 'err'); break
      default: push((pt ? 'comando não encontrado: ' : 'command not found: ') + name + (pt ? " — digite 'help'" : " — type 'help'"), 'err')
    }
  }

  return (
    <div className={styles.body} ref={bodyRef} onClick={() => { const el = document.getElementById('nm-term-input'); el?.focus() }}>
      {lines.map((l, i) => (
        <div key={i} className={styles.line}>
          {l.c === 'p' && <span className={styles.prompt}>noc@vivo:~$</span>}
          {l.c === 'echo' && <span className={styles.prompt}>noc@vivo:~$</span>}
          <span className={l.c === 'ok' ? styles.ok : l.c === 'err' ? styles.err : l.c === 'echo' ? styles.echo : styles.out}>{l.t}</span>
        </div>
      ))}
      {booted && (
        <form className={styles.inputRow} onSubmit={e => { e.preventDefault(); run(input); setInput('') }}>
          <span className={styles.prompt}>noc@vivo:~$</span>
          <input id="nm-term-input" className={styles.input} value={input} onChange={e => setInput(e.target.value)}
            spellCheck={false} autoComplete="off" aria-label="terminal" placeholder={pt ? "digite 'help'" : "type 'help'"} />
          <span className={styles.caret} />
        </form>
      )}
    </div>
  )
}
