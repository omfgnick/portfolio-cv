import type { Lang } from '@/data/cv'

export interface UIStrings {
  available: string
  searchPh: string
  contact: string
  navLabels: Record<string, string>
  sectionTitle: Record<string, string>
  aboutLead: string
  snapshot: string
  focus: string; focusVal: string
  stack: string
  languages: string; languagesVal: string
  presential: string
  certifications: string; education: string
  verify: string
  qrTitle: string; qrDesc: string
  copy: string; ok: string
  emptyExp: string; emptySkill: string
  goTo: string
  palettePh: string; paletteEmpty: string; navHint: string; selectHint: string; closeHint: string
  cmdLinkedin: string; cmdGithub: string; cmdWa: string; cmdEmail: string; cmdPhone: string; cmdVcard: string; cmdPrint: string
  bootSkip: string
  skipToContent: string
  copyLink: string; linkCopied: string
  verifyOn: string; translated: string
  tlYears: string; tlRoles: string; tlHint: string
  rvOpen: string; rvTitle: string; rvNow: string; rvStack: string; rvCerts: string; rvPdf: string; rvEmail: string; rvFull: string
  themeToggle: string; langToggle: string
  lpCorpo: string; lpNomad: string; lpStreetkid: string
  scanToggle: string
  dossier: string; clearance: string; locLbl: string; statusLbl: string; availableTag: string
  installed: string; systemsOk: string; bootHead: string; breachTitle: string
  /* Atributos e caminhos de vida com os nomes oficiais de cada idioma */
  /* Rotulos de acessibilidade: leitor de tela tem de ouvir o idioma da pagina */
  engTitle: string; engActions: string; engDepth: string; engDwell: string
  engSessions: string; engNone: string; engNames: Record<string, string>
  ariaBoot: string; ariaPalette: string; ariaCommand: string; ariaTerminal: string
  ariaVisitors: string; ariaTop: string; ariaHome: string; ariaSections: string; ariaSearch: string
  attrs: Record<'BODY' | 'REFLEXES' | 'TECHNICAL' | 'INTELLIGENCE' | 'COOL', string>
  paths: Record<'CORPO' | 'NOMAD' | 'STREETKID', string>
  // visitor panel
  visits: string; live: string; last14: string; topCountries: string; source: string; waiting: string; visitCount: string; direct: string; noReferrer: string
}

export const UI: Record<Lang, UIStrings> = {
  pt: {
    available: 'DISPONÍVEL PARA NOVAS OPORTUNIDADES',
    searchPh: 'filter --experiencia --skill --ferramenta',
    contact: 'Falar comigo',
    navLabels: { about: 'PERFIL', experience: 'EXP', skills: 'SKILLS', projects: 'PROJ', credentials: 'CRED', praise: 'REFS', contact: 'LINK' },
    sectionTitle: { about: '~/profile $ whoami', experience: '~/logs $ cat operational_history', skills: '~/sys $ ls tooling_matrix', projects: '~/repos $ git log --oneline', credentials: '~/creds $ verify --all', praise: '~/refs $ cat recommendations', contact: '~/net $ connect --secure' },
    aboutLead: 'Atuo em escalonamento e continuidade do serviço em ambientes de missão crítica, unindo monitoração proativa, gestão de incidentes orientada a SLA e automação de rotinas operacionais.',
    snapshot: '// SNAPSHOT',
    focus: 'Foco', focusVal: 'Operação estável · Incidentes · SLA · Automação',
    stack: 'Stack principal',
    languages: 'Idiomas', languagesVal: 'Português (nativo) · Technical English',
    presential: 'Presencial / híbrido',
    certifications: '// CERTIFICAÇÕES', education: '// FORMAÇÃO',
    verify: 'verificar credenciais no LinkedIn',
    qrTitle: 'QR // LINKEDIN', qrDesc: 'Aponte a câmera para abrir o perfil — ideal para currículo impresso.',
    copy: 'copy', ok: 'ok',
    emptyExp: 'Nenhuma experiência corresponde ao filtro.', emptySkill: 'Nenhuma skill corresponde ao filtro.',
    goTo: 'Ir para',
    palettePh: 'Digite um comando ou seção…', paletteEmpty: 'Nenhum comando encontrado.', navHint: '↑↓ navegar', selectHint: '↵ selecionar', closeHint: 'esc fechar',
    cmdLinkedin: 'Abrir LinkedIn', cmdGithub: 'Abrir GitHub', cmdWa: 'Falar no WhatsApp', cmdEmail: 'Copiar e-mail', cmdPhone: 'Copiar telefone', cmdVcard: 'Baixar vCard (.vcf)', cmdPrint: 'Imprimir / PDF',
    bootSkip: 'clique ou tecle para pular',
    skipToContent: 'Pular para o conteúdo',
    copyLink: 'Copiar link desta seção', linkCopied: 'link copiado',
    verifyOn: 'ver as recomendações no LinkedIn', translated: '',
    tlYears: 'anos de trajetória', tlRoles: 'posições', tlHint: 'clique numa barra para abrir a experiência',
    rvOpen: 'Resumo rápido (30s)', rvTitle: 'RESUMO EXECUTIVO // 30 SEGUNDOS', rvNow: '// POSIÇÃO MAIS RECENTE',
    rvStack: '// STACK PRINCIPAL', rvCerts: '// CERTIFICAÇÕES', rvPdf: 'Baixar CV (PDF)', rvEmail: 'E-mail', rvFull: 'ver o currículo completo →',
    themeToggle: 'Tema claro/escuro', langToggle: 'Idioma PT/EN',
    lpCorpo: 'CORPORATIVO · dentro da operação de uma grande corporação',
    lpNomad: 'NÔMADE · alocado por fornecedor num cliente',
    lpStreetkid: 'FILHO DAS RUAS · TI local, mão na massa',
    scanToggle: 'Modo scanner (tecla S)',
    dossier: 'DOSSIÊ', clearance: 'CREDENCIAL', locLbl: 'LOCAL', statusLbl: 'SITUAÇÃO',
    availableTag: 'DISPONÍVEL', installed: 'INSTALADO',
    systemsOk: 'SISTEMAS OPERACIONAIS',
    bootHead: 'NIGHT CITY // TERMINAL DE OPS',
    breachTitle: 'PROTOCOLO DE INVASÃO',
    engTitle: 'O QUE AS PESSOAS FAZEM', engActions: 'AÇÕES', engDepth: 'ROLAGEM', engDwell: 'PERMANÊNCIA',
    engSessions: 'sessões', engNone: 'ainda sem dados',
    engNames: {
      pdf: 'Baixou o CV', linkedin: 'Abriu o LinkedIn', github: 'Abriu o GitHub',
      whatsapp: 'Chamou no WhatsApp', email: 'Copiou o e-mail', vcard: 'Salvou o contato',
      recruiter: 'Abriu o resumo', terminal: 'Usou o terminal',
    },
    ariaBoot: 'Inicializando o sistema', ariaPalette: 'Paleta de comandos', ariaCommand: 'Comando',
    ariaTerminal: 'Terminal interativo', ariaVisitors: 'Tráfego de visitantes', ariaTop: 'Voltar ao topo',
    ariaHome: 'Início', ariaSections: 'Seções', ariaSearch: 'Buscar',
    attrs: { BODY: 'CORPO', REFLEXES: 'REFLEXOS', TECHNICAL: 'HABILIDADE TÉCNICA', INTELLIGENCE: 'INTELIGÊNCIA', COOL: 'FRIEZA' },
    paths: { CORPO: 'CORPORATIVO', NOMAD: 'NÔMADE', STREETKID: 'FILHO DAS RUAS' },
    visits: 'visitas', live: 'ao vivo', last14: 'ÚLTIMOS 14 DIAS', topCountries: 'TOP PAÍSES', source: 'ORIGEM', waiting: 'aguardando…', visitCount: 'visita(s)', direct: 'direto', noReferrer: 'sem referrer',
  },
  en: {
    available: 'OPEN TO NEW OPPORTUNITIES',
    searchPh: 'filter --experience --skill --tool',
    contact: 'Contact me',
    navLabels: { about: 'PROFILE', experience: 'EXP', skills: 'SKILLS', projects: 'PROJ', credentials: 'CRED', praise: 'REFS', contact: 'LINK' },
    sectionTitle: { about: '~/profile $ whoami', experience: '~/logs $ cat operational_history', skills: '~/sys $ ls tooling_matrix', projects: '~/repos $ git log --oneline', credentials: '~/creds $ verify --all', praise: '~/refs $ cat recommendations', contact: '~/net $ connect --secure' },
    aboutLead: 'I work on escalation and service continuity in mission-critical environments, combining proactive monitoring, SLA-driven incident management and automation of operational routines.',
    snapshot: '// SNAPSHOT',
    focus: 'Focus', focusVal: 'Stable ops · Incidents · SLA · Automation',
    stack: 'Core stack',
    languages: 'Languages', languagesVal: 'Portuguese (native) · Technical English',
    presential: 'On-site / hybrid',
    certifications: '// CERTIFICATIONS', education: '// EDUCATION',
    verify: 'verify credentials on LinkedIn',
    qrTitle: 'QR // LINKEDIN', qrDesc: 'Point your camera to open the profile — great for a printed résumé.',
    copy: 'copy', ok: 'ok',
    emptyExp: 'No experience matches the filter.', emptySkill: 'No skill matches the filter.',
    goTo: 'Go to',
    palettePh: 'Type a command or section…', paletteEmpty: 'No command found.', navHint: '↑↓ navigate', selectHint: '↵ select', closeHint: 'esc close',
    cmdLinkedin: 'Open LinkedIn', cmdGithub: 'Open GitHub', cmdWa: 'Chat on WhatsApp', cmdEmail: 'Copy e-mail', cmdPhone: 'Copy phone', cmdVcard: 'Download vCard (.vcf)', cmdPrint: 'Print / PDF',
    bootSkip: 'click or press any key to skip',
    skipToContent: 'Skip to content',
    copyLink: 'Copy link to this section', linkCopied: 'link copied',
    verifyOn: 'see the recommendations on LinkedIn', translated: 'translated from Portuguese',
    tlYears: 'years of career', tlRoles: 'roles', tlHint: 'click a bar to open that role',
    rvOpen: 'Quick summary (30s)', rvTitle: 'EXECUTIVE SUMMARY // 30 SECONDS', rvNow: '// MOST RECENT ROLE',
    rvStack: '// CORE STACK', rvCerts: '// CERTIFICATIONS', rvPdf: 'Download CV (PDF)', rvEmail: 'E-mail', rvFull: 'see the full résumé →',
    themeToggle: 'Light/dark theme', langToggle: 'Language PT/EN',
    lpCorpo: 'CORPO · inside a large corporation’s operation',
    lpNomad: 'NOMAD · placed at a client through a vendor',
    lpStreetkid: 'STREETKID · hands-on local IT',
    scanToggle: 'Scanner mode (press S)',
    dossier: 'DOSSIER', clearance: 'CLEARANCE', locLbl: 'LOC', statusLbl: 'STATUS',
    availableTag: 'AVAILABLE', installed: 'INSTALLED',
    systemsOk: 'SYSTEMS OPERATIONAL',
    bootHead: 'NIGHT CITY // OPS TERMINAL',
    breachTitle: 'BREACH PROTOCOL',
    engTitle: 'WHAT PEOPLE DO', engActions: 'ACTIONS', engDepth: 'SCROLL DEPTH', engDwell: 'TIME ON PAGE',
    engSessions: 'sessions', engNone: 'no data yet',
    engNames: {
      pdf: 'Downloaded the CV', linkedin: 'Opened LinkedIn', github: 'Opened GitHub',
      whatsapp: 'Messaged on WhatsApp', email: 'Copied the e-mail', vcard: 'Saved the contact',
      recruiter: 'Opened the summary', terminal: 'Used the terminal',
    },
    ariaBoot: 'Booting system', ariaPalette: 'Command palette', ariaCommand: 'Command',
    ariaTerminal: 'Interactive terminal', ariaVisitors: 'Visitor traffic', ariaTop: 'Back to top',
    ariaHome: 'Home', ariaSections: 'Sections', ariaSearch: 'Search',
    attrs: { BODY: 'BODY', REFLEXES: 'REFLEXES', TECHNICAL: 'TECHNICAL ABILITY', INTELLIGENCE: 'INTELLIGENCE', COOL: 'COOL' },
    paths: { CORPO: 'CORPO', NOMAD: 'NOMAD', STREETKID: 'STREETKID' },
    visits: 'visits', live: 'live', last14: 'LAST 14 DAYS', topCountries: 'TOP COUNTRIES', source: 'SOURCE', waiting: 'waiting…', visitCount: 'visit(s)', direct: 'direct', noReferrer: 'no referrer',
  },
}
