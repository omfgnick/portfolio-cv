/* Conteúdo do currículo — bilíngue (pt/en). getCV(lang) devolve textos planos. */

export type Lang = 'pt' | 'en'
interface L { pt: string; en: string }
const p = (l: L, lang: Lang) => l[lang]
const arr = (a: L[], lang: Lang) => a.map(x => x[lang])

/** `start`/`end` em AAAA-MM alimentam a linha do tempo; `period` é o texto exibido. */
export interface Job { role: string; org: string; loc?: string; start: string; end: string; period: string; open?: boolean; filter: string; desc: string; points: string[]; path: Lifepath }
/** Lifepath do Cyberpunk 2077 usado para marcar COMO o trabalho aconteceu:
  * CORPO dentro da operacao de uma grande corporacao, NOMAD alocado por
  * fornecedor num cliente, STREETKID TI local com mao na massa. E rotulo de
  * cenario sobre um fato real, nao invencao sobre o cargo. */
export type Lifepath = 'CORPO' | 'NOMAD' | 'STREETKID'
export interface Skill { title: string; level: number; icon: string; chips: string[]; attr: Attribute }
/** Atributos do Cyberpunk 2077. Camada decorativa: o nome real da competencia
  * continua sendo o rotulo principal, porque e ele que o recrutador procura. */
export type Attribute = 'BODY' | 'REFLEXES' | 'TECHNICAL' | 'INTELLIGENCE' | 'COOL'
export interface Credential { title: string; sub: string; cred?: string }
export interface Metric { count: number; suffix?: string; label: string }
export interface Contact { type: string; label: string; value: string; href?: string; copy?: string; icon: string }
export interface Project { name: string; desc: string; tags: string[]; url: string }

const PROFILE_L = {
  name: 'Nicolas Mesquita Fernandes',
  role: { pt: '// Analista de Suporte e NOC · Infraestrutura', en: '// IT Support & NOC Analyst · Infrastructure' },
  tagline: {
    pt: '~7 anos em NOC e monitoração de incidentes para a Telefônica/Vivo e suporte recente à operação logística do Mercado Livre. SLA, troubleshooting e automação de rotinas.',
    en: '~7 years of NOC monitoring and incident handling for Telefônica/Vivo, plus recent support for Mercado Livre’s logistics operation. SLA, troubleshooting and routine automation.',
  },
  tags: [
    { pt: 'Suporte N1/N2', en: 'N1/N2 Support' },
    { pt: 'NOC / Monitoração', en: 'NOC / Monitoring' },
    { pt: 'Service Desk e campo', en: 'Service Desk & field' },
    { pt: 'Automação (PowerShell/Bash/Python)', en: 'Automation (PowerShell/Bash/Python)' },
  ],
  linkedin: 'https://www.linkedin.com/in/nicolasmesquita/',
  github: 'https://github.com/omfgnick',
  whatsapp: 'https://wa.me/5511942327967',
}

const METRICS_L: { count: number; suffix?: string; label: L }[] = [
  { count: 7, label: { pt: 'anos em NOC e monitoração', en: 'years in NOC & monitoring' } },
  { count: 3, suffix: '+', label: { pt: 'anos em suporte técnico', en: 'years in technical support' } },
  { count: 9, label: { pt: 'certificações técnicas', en: 'technical certifications' } },
  { count: 3, label: { pt: 'linguagens de automação', en: 'automation languages' } },
]

const TERMINAL_L: L[] = [
  { pt: '$whoami', en: '$whoami' },
  { pt: 'nicolas.mesquita — suporte e NOC · Cajamar/SP', en: 'nicolas.mesquita — IT support & NOC · Cajamar/SP' },
  { pt: '$uptime', en: '$uptime' },
  { pt: 'em TI desde 2012 · foco em SLA', en: 'in IT since 2012 · focused on SLA' },
  { pt: '$monitor --stack', en: '$monitor --stack' },
  { pt: 'SolarWinds · Remedy · Nagios · Check_MK · Grafana · Meraki [ok]', en: 'SolarWinds · Remedy · Nagios · Check_MK · Grafana · Meraki [ok]' },
  { pt: '$status', en: '$status' },
  { pt: '● sistemas operacionais — disponível para oportunidades', en: '● systems operational — open to opportunities' },
]

const CAPS_L = [
  { icon: 'Headphones', h: { pt: 'Suporte N1/N2', en: 'N1/N2 Support' }, d: { pt: 'Troubleshooting de hardware, software, rede e usuários (AD, senhas e acessos).', en: 'Hardware, software, network and user troubleshooting (AD, passwords and access).' } },
  { icon: 'Radar', h: { pt: 'NOC / Monitoração', en: 'NOC / Monitoring' }, d: { pt: 'Triagem, escalonamento e acompanhamento orientado a SLA.', en: 'SLA-driven triage, escalation and follow-up.' } },
  { icon: 'ShieldAlert', h: { pt: 'Gestão de Incidentes', en: 'Incident Management' }, d: { pt: 'Comunicação objetiva e follow-up até a normalização.', en: 'Clear communication and follow-up until resolution.' } },
  { icon: 'ListChecks', h: { pt: 'Chamados (ITSM)', en: 'Ticketing (ITSM)' }, d: { pt: 'Incidentes e requisições dentro do SLA no Remedy, Jira e GLPI.', en: 'Incidents and requests within SLA in Remedy, Jira and GLPI.' } },
  { icon: 'Server', h: { pt: 'Campo e logística', en: 'Field & logistics' }, d: { pt: 'Impressoras Zebra, handhelds, leitores 3D, MDM e inventário em centro de distribuição.', en: 'Zebra printers, handhelds, 3D scanners, MDM and inventory in a distribution center.' } },
  { icon: 'Terminal', h: { pt: 'Automação', en: 'Automation' }, d: { pt: 'Scripts e rotinas em PowerShell/Bash/Python para consistência.', en: 'PowerShell/Bash/Python scripts and routines for consistency.' } },
]

const JOBS_L: { role: L; org: string; loc?: L; start: string; end: string; period: L; open?: boolean; filter: string; desc: L; points: L[]; path: Lifepath }[] = [
  {
    role: { pt: 'Técnico de Suporte — Mercado Livre', en: 'Support Technician — Mercado Livre' }, org: 'Randstad Brasil · Tempo integral', path: 'NOMAD',
    loc: { pt: 'Presencial', en: 'On-site' }, start: '2024-11', end: '2026-01', period: { pt: 'nov/2024 – jan/2026 · 1 ano 3 meses', en: 'Nov 2024 – Jan 2026 · 1 yr 3 mos' }, open: true,
    filter: 'tecnico suporte mercado livre randstad presencial impressoras zebra mdm jira 5s inventario n1 n2 n3 windows',
    desc: { pt: 'Assistência presencial e disponibilidade de equipamentos; manutenção preventiva; tickets; MDM; 5S; inventário; Jira.', en: 'On-site support and equipment availability; preventive maintenance; tickets; MDM; 5S; inventory; Jira.' },
    points: [
      { pt: 'Suporte aos usuários e disponibilidade de equipamentos (bancadas, baterias, handhelds).', en: 'User support and equipment availability (workstations, batteries, handhelds).' },
      { pt: 'Manutenção preventiva e suporte em impressoras Zebra.', en: 'Preventive maintenance and support for Zebra printers.' },
      { pt: 'Gestão de chamados e acompanhamento via Jira.', en: 'Ticket handling and tracking via Jira.' },
      { pt: 'MDM para dispositivos móveis; configuração de hardware (ex.: leitores 3D).', en: 'MDM for mobile devices; hardware setup (e.g. 3D scanners).' },
      { pt: 'Aplicação de 5S e padronização de postos.', en: '5S application and workstation standardization.' },
      { pt: 'Guias de boas práticas; gestão e controle de inventário.', en: 'Best-practice guides; inventory management and control.' },
      { pt: 'Active Directory (desbloqueio de contas e redefinição de senhas); Grafana para visualização de indicadores.', en: 'Active Directory (account unlocks and password resets); Grafana for KPI visualization.' },
    ],
  },
  {
    role: { pt: 'Recolocação e estudos', en: 'Job search & studies' }, org: 'Pausa na carreira', path: 'STREETKID',
    start: '2022-05', end: '2024-10', period: { pt: 'mai/2022 – out/2024', en: 'May 2022 – Oct 2024' },
    filter: 'recolocacao estudos pausa carreira defesa cibernetica estacio cisco aws pentest desec',
    desc: { pt: 'Busca de recolocação; a partir de 2024, Tecnólogo em Defesa Cibernética (Estácio) e cursos de Cisco e AWS.', en: 'Job search; from 2024 on, Associate Degree in Cyber Defense (Estácio) plus Cisco and AWS courses.' },
    points: [
      { pt: 'Entre 2022 e 2023, dedicação à recolocação no mercado.', en: '2022–2023: focused on returning to the job market.' },
      { pt: 'Jan/2024: início do Tecnólogo em Defesa Cibernética (Estácio), concluído em jul/2026.', en: 'Jan 2024: started the Associate Degree in Cyber Defense (Estácio), completed Jul 2026.' },
      { pt: 'Cursos: Introdução à Cibersegurança (Cisco), Pentest na Prática (Desec) e AWS Cloud Practitioner Essentials.', en: 'Courses: Introduction to Cybersecurity (Cisco), Hands-on Pentesting (Desec) and AWS Cloud Practitioner Essentials.' },
    ],
  },
  {
    role: { pt: 'Analista de Suporte / Operador NOC — Projeto NOC McDonald’s (Telefônica | Vivo)', en: 'Support Analyst / NOC Operator — McDonald’s NOC Project (Telefônica | Vivo)' }, org: 'SONDA → Tech Mahindra → Telefónica Ingeniería de Seguridad', path: 'CORPO',
    loc: { pt: 'Mesmo projeto, com troca de prestadora', en: 'Same project, across contractor changes' }, start: '2017-02', end: '2022-04', period: { pt: 'fev/2017 – abr/2022 · 5 anos 3 meses', en: 'Feb 2017 – Apr 2022 · 5 yrs 3 mos' },
    filter: 'analista suporte operador noc mcdonalds telefonica vivo sonda tech mahindra ingenieria seguridad tdata solarwinds remedy meraki links operadoras ping switches access-point pos sat kvs quiosque sla servidores relatorios',
    desc: { pt: 'NOC de lojas McDonald’s para a Telefônica/Vivo: SolarWinds, BMC Remedy, validação de conectividade, acionamento de operadoras e Cisco Meraki.', en: 'McDonald’s store NOC for Telefônica/Vivo: SolarWinds, BMC Remedy, connectivity checks, carrier escalation and Cisco Meraki.' },
    points: [
      { pt: 'Monitoração de links e abertura/acompanhamento de incidentes (SolarWinds + BMC Remedy) dentro do SLA.', en: 'Link monitoring and incident opening/tracking (SolarWinds + BMC Remedy) within SLA.' },
      { pt: 'Validação de conectividade nas lojas (ping): switches, APs, POS, SAT, KVS, quiosques e Cisco Meraki.', en: 'Store connectivity checks (ping): switches, APs, POS, SAT, KVS, kiosks and Cisco Meraki.' },
      { pt: 'Contato com a loja (modem, reinício de equipamentos) e acionamento de operadoras até a normalização.', en: 'Store contact (modem checks, equipment restarts) and carrier escalation until resolution.' },
      { pt: 'Em 2019, apoio também ao NOC TDATA: servidores físicos e virtuais, SLA e relatórios ao cliente.', en: 'In 2019, also supported the TDATA NOC: physical and virtual servers, SLA and client reporting.' },
    ],
  },
  {
    role: { pt: 'Analista de Monitoração e Produção — Projeto NDC (Telefônica | Vivo)', en: 'Monitoring & Production Analyst — NDC Project (Telefônica | Vivo)' }, org: 'Stefanini → end-to-end technology', path: 'CORPO',
    loc: { pt: 'São Paulo · mesmo projeto, com troca de prestadora', en: 'São Paulo · same project, across contractor changes' }, start: '2014-11', end: '2016-09', period: { pt: 'nov/2014 – set/2016 · 1 ano 11 meses', en: 'Nov 2014 – Sep 2016 · 1 yr 11 mos' },
    filter: 'analista monitoracao producao ponto focal ndc telefonica vivo stefanini end-to-end technology netcool omnibus sitescope remedy control-m netbackup restore incidentes acionamento comunicacao lideranca',
    desc: { pt: 'Monitoração de infraestrutura crítica (Netcool/Omnibus + SiteScope), incidentes no Remedy, Control-M e NetBackup.', en: 'Critical-infrastructure monitoring (Netcool/Omnibus + SiteScope), Remedy incidents, Control-M and NetBackup.' },
    points: [
      { pt: 'Monitoração e análise de alarmes de sistemas e servidores críticos (Netcool/Omnibus + SiteScope).', en: 'Alarm monitoring and analysis for critical systems and servers (Netcool/Omnibus + SiteScope).' },
      { pt: 'Incidentes no BMC Remedy, acionamento técnico e comunicação com a liderança conforme o plano.', en: 'BMC Remedy incidents, technical escalation and leadership communication per the plan.' },
      { pt: 'Produção: operação de jobs no Control-M e restores/backups no NetBackup.', en: 'Production: Control-M job operation and NetBackup restores/backups.' },
    ],
  },
  {
    role: { pt: 'Técnico de Informática Sênior', en: 'Senior IT Technician' }, org: 'Lojas Marabraz', path: 'STREETKID',
    loc: { pt: 'São Paulo e Região, Brasil', en: 'São Paulo Area, Brazil' }, start: '2013-08', end: '2014-05', period: { pt: 'ago/2013 – mai/2014 · 10 meses', en: 'Aug 2013 – May 2014 · 10 mos' },
    filter: 'tecnico informatica senior marabraz monitoramento nagios check_mk checkmk mapas scripts bash powershell backup hp data protector vmware',
    desc: { pt: 'Monitoramento com Nagios e Check_MK + mapas; scripts Bash/PowerShell; jobs de backup HP Data Protector; VMware.', en: 'Monitoring with Nagios and Check_MK + maps; Bash/PowerShell scripts; HP Data Protector backup jobs; VMware.' },
    points: [
      { pt: 'Monitoramento com Nagios e Check_MK e mapas de visualização da saúde do ambiente.', en: 'Monitoring with Nagios and Check_MK, with maps showing environment health.' },
      { pt: 'Scripts em Bash e PowerShell para demandas de monitoração.', en: 'Bash and PowerShell scripts for monitoring needs.' },
      { pt: 'Operação e criação de jobs de backup (HP Data Protector).', en: 'Operating and building backup jobs (HP Data Protector).' },
    ],
  },
  {
    role: { pt: 'Estagiário', en: 'Intern' }, org: 'XMM Tecnologia da Informação', path: 'STREETKID',
    loc: { pt: 'Cajamar – SP', en: 'Cajamar – SP, Brazil' }, start: '2012-03', end: '2013-05', period: { pt: 'mar/2012 – mai/2013 · 1 ano 3 meses', en: 'Mar 2012 – May 2013 · 1 yr 3 mos' },
    filter: 'estagiario xmm tecnologia informacao cajamar glpi servicedesk suporte usuarios redes servidores microinformatica cabeamento roteadores switches',
    desc: { pt: 'ServiceDesk GLPI; suporte a usuários; redes e servidores; microinformática; cabeamento; roteadores/switches.', en: 'GLPI ServiceDesk; user support; networks and servers; desktop support; cabling; routers/switches.' },
    points: [
      { pt: 'Atendimento de chamados via GLPI e suporte a usuários.', en: 'Ticket handling via GLPI and user support.' },
      { pt: 'Vivência em redes, servidores e microinformática.', en: 'Hands-on with networks, servers and desktop support.' },
      { pt: 'Cabeamento e suporte em roteadores/switches.', en: 'Cabling and router/switch support.' },
    ],
  },
]

const SKILLS_L: { title: L; level: number; icon: string; chips: string[]; attr: Attribute }[] = [
  { title: { pt: 'Monitoramento / NOC', en: 'Monitoring / NOC' }, level: 5, icon: 'Activity', chips: ['SolarWinds', 'Netcool/Omnibus', 'HP SiteScope', 'Nagios', 'Check_MK', 'Grafana'], attr: 'REFLEXES' },
  { title: { pt: 'ITSM / Incidentes', en: 'ITSM / Incidents' }, level: 5, icon: 'ListChecks', chips: ['BMC Remedy', 'Jira', 'GLPI', 'ITIL', 'SLA', 'Incident Mgmt', 'Escalation'], attr: 'COOL' },
  { title: { pt: 'Suporte de campo / Logística', en: 'Field support / Logistics' }, level: 4, icon: 'Headphones', chips: ['Zebra printers', 'Handhelds', '3D scanners', 'MDM', 'IT asset inventory', '5S'], attr: 'BODY' },
  { title: { pt: 'Redes', en: 'Networking' }, level: 4, icon: 'Network', chips: ['TCP/IP', 'LAN/WAN', 'DNS', 'Wi-Fi', 'VPN', 'Switching/Routing', 'Cisco Meraki'], attr: 'TECHNICAL' },
  { title: { pt: 'Automação / Scripting', en: 'Automation / Scripting' }, level: 4, icon: 'Terminal', chips: ['PowerShell', 'Bash', 'Python', 'Git/GitHub', 'Routine automation'], attr: 'INTELLIGENCE' },
  { title: { pt: 'Backup / Continuidade', en: 'Backup / Continuity' }, level: 4, icon: 'DatabaseBackup', chips: ['Symantec NetBackup', 'HP Data Protector', 'Backup/Restore'], attr: 'BODY' },
  { title: { pt: 'Sistemas', en: 'Systems' }, level: 4, icon: 'Server', chips: ['Windows', 'Linux', 'Active Directory', 'Microsoft 365', 'SQL/SQL Server', 'Microsoft Office'], attr: 'BODY' },
  { title: { pt: 'Produção · MDM · Cloud', en: 'Production · MDM · Cloud' }, level: 3, icon: 'Cloud', chips: ['BMC Control-M', 'MDM', 'Workspace ONE', 'AWS (fundamentals)'], attr: 'TECHNICAL' },
  { title: { pt: 'Segurança (formação)', en: 'Security (education)' }, level: 2, icon: 'ShieldCheck', chips: ['Cybersecurity fundamentals', 'Pentest (intro)', 'Security best practices'], attr: 'INTELLIGENCE' },
]

const CERTS_L: { title: L; sub: L; cred?: string }[] = [
  { title: { pt: 'Programação para Internet', en: 'Web Programming' }, sub: { pt: 'Estácio · jul/2025', en: 'Estácio · Jul 2025' }, cred: 'db67f5df491f166a9630ba5' },
  { title: { pt: 'Desenvolvimento de Aplicações em Python', en: 'Application Development in Python' }, sub: { pt: 'Estácio · dez/2024', en: 'Estácio · Dec 2024' }, cred: '8641f2465a0d1ac13b5067f' },
  { title: { pt: 'AWS Cloud Practitioner Essentials', en: 'AWS Cloud Practitioner Essentials' }, sub: { pt: 'Estácio · abr/2024', en: 'Estácio · Apr 2024' } },
  { title: { pt: 'Fase 2 | Capacitação - Computação em Nuvem', en: 'Phase 2 | Training - Cloud Computing' }, sub: { pt: 'Ka Solution · abr/2024', en: 'Ka Solution · Apr 2024' } },
  { title: { pt: 'Computação em Nuvem | AWS Discovery Day', en: 'Cloud Computing | AWS Discovery Day' }, sub: { pt: 'Ka Solution · mar/2024', en: 'Ka Solution · Mar 2024' } },
  { title: { pt: 'Introdução ao Pentest na Prática', en: 'Hands-on Introduction to Pentesting' }, sub: { pt: 'Desec Security · jan/2024', en: 'Desec Security · Jan 2024' }, cred: 'RWXO-JGIXJ-LYLFC' },
  { title: { pt: 'Introdução à Cibersegurança', en: 'Introduction to Cybersecurity' }, sub: { pt: 'Cisco · jan/2024', en: 'Cisco · Jan 2024' } },
  { title: { pt: 'ECMS1 — Engineering Cisco Meraki Solutions 1', en: 'ECMS1 — Engineering Cisco Meraki Solutions 1' }, sub: { pt: 'Cisco Meraki · jun/2021', en: 'Cisco Meraki · Jun 2021' } },
  { title: { pt: 'BOOTCAMP Cisco - Meraki', en: 'Cisco - Meraki Bootcamp' }, sub: { pt: 'FASTPATH University · abr/2020', en: 'FASTPATH University · Apr 2020' } },
]

const EDU_L: { title: L; sub: L }[] = [
  { title: { pt: 'Tecnólogo em Defesa Cibernética (superior completo)', en: 'Associate Degree in Technology — Cyber Defense (completed)' }, sub: { pt: 'Estácio · jan/2024 – jul/2026', en: 'Estácio · Jan 2024 – Jul 2026' } },
  { title: { pt: 'Sistemas de Informação — 3 anos cursados (trancado)', en: 'Information Systems — 3 years completed (on hold)' }, sub: { pt: 'FACCAMP · 2011 – 2013', en: 'FACCAMP · 2011 – 2013' } },
  { title: { pt: 'Formação Técnica', en: 'Technical Diploma' }, sub: { pt: 'ETEC Gino Rezaghi · 2009 – 2010', en: 'ETEC Gino Rezaghi · 2009 – 2010' } },
]

const CONTACTS_L: { type: string; label: L; value: string; href?: string; copy?: string; icon: string }[] = [
  { type: 'email', label: { pt: 'Email', en: 'Email' }, value: 'omfg_nick@hotmail.com', href: 'mailto:omfg_nick@hotmail.com', copy: 'omfg_nick@hotmail.com', icon: 'Mail' },
  { type: 'phone', label: { pt: 'Telefone', en: 'Phone' }, value: '+55 11 94232-7967', href: 'tel:+5511942327967', copy: '+5511942327967', icon: 'Phone' },
  { type: 'linkedin', label: { pt: 'LinkedIn', en: 'LinkedIn' }, value: 'linkedin.com/in/nicolasmesquita', href: 'https://www.linkedin.com/in/nicolasmesquita/', copy: 'https://www.linkedin.com/in/nicolasmesquita/', icon: 'Linkedin' },
  { type: 'github', label: { pt: 'GitHub', en: 'GitHub' }, value: 'github.com/omfgnick', href: 'https://github.com/omfgnick', copy: 'https://github.com/omfgnick', icon: 'Github' },
  { type: 'location', label: { pt: 'Localização', en: 'Location' }, value: 'Cajamar – SP (Grande São Paulo)', icon: 'MapPin' },
]

const PROJECTS_L: { name: string; desc: L; tags: string[]; url: string }[] = [
  { name: 'ripper-tech-toolkit', tags: ['Python', 'PySide6', 'Windows', 'Win32'], url: 'https://github.com/omfgnick/ripper-tech-toolkit',
    desc: { pt: 'Utilitário de bancada para Windows em PySide6: um roteiro executa diagnóstico, limpeza e reparo na ordem certa e termina em PDF assinável, com antes/depois e histórico por número de série da placa. I/O sem cache para medir disco de verdade, consultas por CIM em vez de texto traduzido do console, limpeza por lista branca com dupla verificação e 62 testes sobre as funções de consequência.', en: 'Windows bench utility in PySide6: one routine runs diagnostics, cleanup and repair in the right order and ends in a signable PDF, with before/after and history keyed to the motherboard serial. Cache-bypassing I/O for honest disk measurement, CIM queries instead of localized console text, whitelist-based cleanup double-checked before every deletion, and 62 tests over the functions that carry consequences.' } },
  { name: 'ops-toolkit', tags: ['Bash', 'PowerShell', 'NOC/Ops', 'CI'], url: 'https://github.com/omfgnick/ops-toolkit',
    desc: { pt: '25 scripts de operação em Bash e PowerShell: triagem de incidente, saúde de serviços, disco, endpoints, validade de TLS, backup verificado por restore e auditoria de hardening. Contrato único (--json, --dry-run, códigos de saída) e 10 jobs de CI — testes em Ubuntu/Debian/Rocky, schemas da saída JSON e análise estática.', en: '25 operations scripts in Bash and PowerShell: incident triage, service health, disk, endpoints, TLS expiry, restore-verified backup and hardening audit. One contract across all of them (--json, --dry-run, exit codes) and 10 CI jobs — tests on Ubuntu/Debian/Rocky, JSON output schemas and static analysis.' } },
  { name: 'portfolio-cv', tags: ['React', 'TypeScript', 'Vite'], url: 'https://github.com/omfgnick/portfolio-cv',
    desc: { pt: 'Este currículo — Vite + React + TypeScript, HUD cyberpunk, QR real gerado do zero e contador de visitas por país (Cloudflare Worker + KV).', en: 'This résumé — Vite + React + TypeScript, cyberpunk HUD, a from-scratch scannable QR and a per-country visitor counter (Cloudflare Worker + KV).' } },
]

/**
 * Selo de disponibilidade — ÚNICO lugar a editar.
 *   open: false            → o selo some do site
 *   note: null             → usa o texto padrão ("aberto a propostas")
 *   note: { pt, en }       → texto custom (ex.: "disponível a partir de março")
 */
export const AVAILABILITY: { open: boolean; note: L | null } = {
  open: true,
  note: null,
}

/** Texto do selo no idioma ativo, ou null quando desligado. */
export function getAvailabilityNote(lang: Lang): string | null {
  if (!AVAILABILITY.open) return null
  return AVAILABILITY.note ? p(AVAILABILITY.note, lang) : null
}

export const LINKEDIN_QR = 'https://www.linkedin.com/in/nicolasmesquita/'
export const PROFILE_INFO = { name: PROFILE_L.name, linkedin: PROFILE_L.linkedin, github: PROFILE_L.github }

export interface CVData {
  profile: { name: string; role: string; tagline: string; tags: string[]; linkedin: string; github: string; whatsapp: string }
  metrics: Metric[]
  terminal: string[]
  caps: { icon: string; h: string; d: string }[]
  jobs: Job[]
  skills: Skill[]
  certs: Credential[]
  edu: Credential[]
  contacts: Contact[]
  projects: Project[]
}

export function getCV(lang: Lang): CVData {
  return {
    profile: { name: PROFILE_L.name, role: p(PROFILE_L.role, lang), tagline: p(PROFILE_L.tagline, lang), tags: arr(PROFILE_L.tags, lang), linkedin: PROFILE_L.linkedin, github: PROFILE_L.github, whatsapp: PROFILE_L.whatsapp },
    metrics: METRICS_L.map(m => ({ count: m.count, suffix: m.suffix, label: p(m.label, lang) })),
    terminal: arr(TERMINAL_L, lang),
    caps: CAPS_L.map(c => ({ icon: c.icon, h: p(c.h, lang), d: p(c.d, lang) })),
    jobs: JOBS_L.map(j => ({ role: p(j.role, lang), org: j.org, loc: j.loc ? p(j.loc, lang) : undefined, start: j.start, end: j.end, period: p(j.period, lang), open: j.open, filter: j.filter, desc: p(j.desc, lang), points: arr(j.points, lang), path: j.path })),
    skills: SKILLS_L.map(s => ({ title: p(s.title, lang), level: s.level, icon: s.icon, chips: s.chips, attr: s.attr })),
    certs: CERTS_L.map(c => ({ title: p(c.title, lang), sub: p(c.sub, lang), cred: c.cred })),
    edu: EDU_L.map(e => ({ title: p(e.title, lang), sub: p(e.sub, lang) })),
    contacts: CONTACTS_L.map(c => ({ type: c.type, label: p(c.label, lang), value: c.value, href: c.href, copy: c.copy, icon: c.icon })),
    projects: PROJECTS_L.map(pr => ({ name: pr.name, desc: p(pr.desc, lang), tags: pr.tags, url: pr.url })),
  }
}
