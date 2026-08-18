/* Conteúdo do currículo — bilíngue (pt/en). getCV(lang) devolve textos planos. */

export type Lang = 'pt' | 'en'
interface L { pt: string; en: string }
const p = (l: L, lang: Lang) => l[lang]
const arr = (a: L[], lang: Lang) => a.map(x => x[lang])

/** `start`/`end` em AAAA-MM alimentam a linha do tempo; `period` é o texto exibido. */
export interface Job { role: string; org: string; loc?: string; start: string; end: string; period: string; open?: boolean; filter: string; desc: string; points: string[] }
export interface Skill { title: string; level: number; icon: string; chips: string[] }
export interface Credential { title: string; sub: string; cred?: string }
export interface Metric { count: number; suffix?: string; label: string }
export interface Contact { type: string; label: string; value: string; href?: string; copy?: string; icon: string }
export interface Project { name: string; desc: string; tags: string[]; url: string }

const PROFILE_L = {
  name: 'Nicolas Mesquita Fernandes',
  role: { pt: '// Infrastructure & Incident Operations Specialist', en: '// Infrastructure & Incident Operations Specialist' },
  tagline: {
    pt: 'Especialista em operação de infraestrutura crítica, monitoração NOC e gestão de incidentes. Foco em SLA/MTTR, padronização (runbooks) e automação para reduzir esforço manual e erro humano.',
    en: 'Specialist in critical-infrastructure operations, NOC monitoring and incident management. Focused on SLA/MTTR, standardization (runbooks) and automation to cut manual effort and human error.',
  },
  tags: [
    { pt: 'Suporte N1/N2/N3', en: 'N1/N2/N3 Support' },
    { pt: 'NOC / SLA', en: 'NOC / SLA' },
    { pt: 'Segurança da Informação', en: 'Information Security' },
    { pt: 'Automação (PowerShell/Bash/Python)', en: 'Automation (PowerShell/Bash/Python)' },
  ],
  linkedin: 'https://www.linkedin.com/in/nicolasmesquita/',
  github: 'https://github.com/omfgnick',
  whatsapp: 'https://wa.me/5511942327967',
}

const METRICS_L: { count: number; suffix?: string; label: L }[] = [
  { count: 12, suffix: '+', label: { pt: 'anos em operações de TI', en: 'years in IT operations' } },
  { count: 10, label: { pt: 'projetos & experiências', en: 'projects & roles' } },
  { count: 9, label: { pt: 'certificações técnicas', en: 'technical certifications' } },
  { count: 3, label: { pt: 'linguagens de automação', en: 'automation languages' } },
]

const TERMINAL_L: L[] = [
  { pt: '$whoami', en: '$whoami' },
  { pt: 'nicolas.mesquita — infrastructure & incident operations', en: 'nicolas.mesquita — infrastructure & incident operations' },
  { pt: '$uptime', en: '$uptime' },
  { pt: 'online desde 2014 · foco em SLA/MTTR', en: 'online since 2014 · focused on SLA/MTTR' },
  { pt: '$monitor --stack', en: '$monitor --stack' },
  { pt: 'SolarWinds · Remedy · Grafana · Zabbix · Meraki [ok]', en: 'SolarWinds · Remedy · Grafana · Zabbix · Meraki [ok]' },
  { pt: '$status', en: '$status' },
  { pt: '● systems operational — disponível para oportunidades', en: '● systems operational — open to opportunities' },
]

const CAPS_L = [
  { icon: 'Headphones', h: { pt: 'Suporte N1/N2/N3', en: 'N1/N2/N3 Support' }, d: { pt: 'Troubleshooting de hardware/software, redes e incidentes críticos.', en: 'Hardware/software, network and critical-incident troubleshooting.' } },
  { icon: 'Radar', h: { pt: 'NOC / Monitoração', en: 'NOC / Monitoring' }, d: { pt: 'Triagem, escalonamento e acompanhamento orientado a SLA.', en: 'SLA-driven triage, escalation and follow-up.' } },
  { icon: 'ShieldAlert', h: { pt: 'Gestão de Incidentes', en: 'Incident Management' }, d: { pt: 'Comunicação objetiva e follow-up até a normalização.', en: 'Clear communication and follow-up until resolution.' } },
  { icon: 'ListChecks', h: { pt: 'ITSM', en: 'ITSM' }, d: { pt: 'Incident / Problem / Change — conceitos e rotina operacional.', en: 'Incident / Problem / Change — concepts and daily practice.' } },
  { icon: 'Lock', h: { pt: 'Segurança', en: 'Security' }, d: { pt: 'Boas práticas, políticas, backups e auditoria básica.', en: 'Best practices, policies, backups and basic auditing.' } },
  { icon: 'Terminal', h: { pt: 'Automação', en: 'Automation' }, d: { pt: 'Scripts e rotinas em PowerShell/Bash/Python para consistência.', en: 'PowerShell/Bash/Python scripts and routines for consistency.' } },
]

const JOBS_L: { role: L; org: string; loc?: L; start: string; end: string; period: L; open?: boolean; filter: string; desc: L; points: L[] }[] = [
  {
    role: { pt: 'Técnico de Suporte — Mercado Livre', en: 'Support Technician — Mercado Livre' }, org: 'Randstad Brasil · Tempo integral',
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
    ],
  },
  {
    role: { pt: 'Operador de Suporte Datacenter — NOC Mc Donald’s', en: 'Datacenter Support Operator — NOC McDonald’s' }, org: 'Telefónica Ingeniería de Seguridad',
    start: '2019-10', end: '2022-04', period: { pt: 'out/2019 – abr/2022 · 2 anos 7 meses', en: 'Oct 2019 – Apr 2022 · 2 yrs 7 mos' },
    filter: 'operador suporte datacenter noc mcdonalds telefonica ingenieria seguridad solarwinds remedy meraki links operadoras ping switches access-point pos sat kvs quiosque sla',
    desc: { pt: 'Monitoração de links via SolarWinds; incidentes via BMC Remedy; validação de conectividade; acionamento de operadoras; Cisco Meraki.', en: 'Link monitoring with SolarWinds; incidents in BMC Remedy; connectivity validation; carrier escalation; Cisco Meraki.' },
    points: [
      { pt: 'Monitoração e abertura/acompanhamento de incidentes (SolarWinds + Remedy).', en: 'Monitoring and incident opening/tracking (SolarWinds + Remedy).' },
      { pt: 'Validação de conectividade em lojas (Ping): switches, APs, POS, SAT, KVS, quiosques e Meraki.', en: 'Store connectivity checks (ping): switches, APs, POS, SAT, KVS, kiosks and Meraki.' },
      { pt: 'Acionamento e acompanhamento com operadoras até normalização.', en: 'Carrier engagement and follow-up until resolution.' },
    ],
  },
  {
    role: { pt: 'Analista de Suporte — Projeto TDATA Telefônica | VIVO', en: 'Support Analyst — TDATA Telefônica | VIVO Project' }, org: 'Tech Mahindra – Brasil',
    start: '2019-05', end: '2019-09', period: { pt: 'mai/2019 – set/2019 · 5 meses', en: 'May 2019 – Sep 2019 · 5 mos' },
    filter: 'analista suporte projeto tdata telefonica vivo tech mahindra noc n1 sla relatorios emails solarwinds dashboard remedy servidores infraestrutura redes escalonamento',
    desc: { pt: 'NOC Telefônica (Tdata): monitoramento de incidentes, N1, SLA, relatórios, acionamentos e escalonamentos.', en: 'Telefônica NOC (Tdata): incident monitoring, N1, SLA, reporting, escalations.' },
    points: [
      { pt: 'Monitoramento e tratamento de incidentes no primeiro nível; acompanhamento de chamados.', en: 'First-level incident monitoring and handling; ticket follow-up.' },
      { pt: 'Acompanhamento de SLA; relatórios e comunicação com o cliente via e-mail.', en: 'SLA tracking; reporting and client communication by e-mail.' },
      { pt: 'Monitoração de servidores (virtuais e físicos), infraestrutura e redes.', en: 'Monitoring of servers (virtual and physical), infrastructure and networks.' },
    ],
  },
  {
    role: { pt: 'Analista de Suporte — Projeto NOC Mc Donald’s Telefônica | VIVO', en: 'Support Analyst — NOC McDonald’s Telefônica | VIVO Project' }, org: 'Tech Mahindra – Brasil',
    start: '2017-11', end: '2019-09', period: { pt: 'nov/2017 – set/2019 · 1 ano 11 meses', en: 'Nov 2017 – Sep 2019 · 1 yr 11 mos' },
    filter: 'analista suporte noc mcdonalds telefonica vivo tech mahindra solarwinds remedy links ping switches access-point pos sat kvs quiosque operadoras',
    desc: { pt: 'Monitoração de links via SolarWinds; incidentes via BMC Remedy; validação de conectividade e indisponibilidade; operadoras.', en: 'Link monitoring with SolarWinds; incidents in BMC Remedy; connectivity/outage validation; carriers.' },
    points: [
      { pt: 'Monitoração e incidentes (SolarWinds + Remedy).', en: 'Monitoring and incidents (SolarWinds + Remedy).' },
      { pt: 'Validação de conectividade em loja e diagnóstico de indisponibilidade.', en: 'In-store connectivity validation and outage diagnosis.' },
      { pt: 'Acionamento de operadoras e acompanhamento.', en: 'Carrier engagement and follow-up.' },
    ],
  },
  {
    role: { pt: 'Analista de Suporte — Projeto NOC Mc Donald’s Telefônica | VIVO', en: 'Support Analyst — NOC McDonald’s Telefônica | VIVO Project' }, org: 'SONDA Brasil',
    start: '2017-02', end: '2017-10', period: { pt: 'fev/2017 – out/2017 · 9 meses', en: 'Feb 2017 – Oct 2017 · 9 mos' },
    filter: 'analista suporte noc mcdonalds telefonica vivo sonda solarwinds remedy links ping indisponibilidade operadoras',
    desc: { pt: 'Monitoração de links; incidentes Remedy; validação e acionamento de operadoras.', en: 'Link monitoring; Remedy incidents; validation and carrier escalation.' },
    points: [
      { pt: 'Monitoração (SolarWinds) e abertura/acompanhamento de incidentes (Remedy).', en: 'Monitoring (SolarWinds) and incident opening/tracking (Remedy).' },
      { pt: 'Validação de conectividade e indisponibilidade; acionamento de operadoras.', en: 'Connectivity/outage validation; carrier escalation.' },
    ],
  },
  {
    role: { pt: 'Analista de Produção — Projeto NDC Telefônica | VIVO', en: 'Production Analyst — NDC Telefônica | VIVO Project' }, org: 'end-to-end technology',
    start: '2016-06', end: '2016-09', period: { pt: 'jun/2016 – set/2016 · 4 meses', en: 'Jun 2016 – Sep 2016 · 4 mos' },
    filter: 'analista producao ndc telefonica vivo end-to-end technology control-m schedules remedy restore netbackup batch jobs',
    desc: { pt: 'Control-M (rerun/hold/free/force ok/kill/run now/confirm/ordenação), schedules, Remedy, restores e NetBackup.', en: 'Control-M (rerun/hold/free/force ok/kill/run now/confirm/ordering), schedules, Remedy, restores and NetBackup.' },
    points: [
      { pt: 'Operação de rotinas no Control-M e acompanhamento de schedules em produção.', en: 'Control-M job operation and production schedule monitoring.' },
      { pt: 'Chamados em Remedy e atividades de restore/backup (NetBackup).', en: 'Remedy tickets and restore/backup activities (NetBackup).' },
    ],
  },
  {
    role: { pt: 'Analista de Monitoração / Ponto Focal — Projeto NDC Telefônica | VIVO', en: 'Monitoring Analyst / Focal Point — NDC Telefônica | VIVO Project' }, org: 'end-to-end technology',
    start: '2016-04', end: '2016-09', period: { pt: 'abr/2016 – set/2016 · 6 meses', en: 'Apr 2016 – Sep 2016 · 6 mos' },
    filter: 'analista monitoracao ponto focal ndc telefonica vivo end-to-end technology netcool omnibus sitescope remedy incidentes acionamento comunicacao diretoria grafana zabbix nagios',
    desc: { pt: 'Netcool/Omnibus + SiteScope; incidentes Remedy; acionamento técnico; comunicação com diretoria/gestores.', en: 'Netcool/Omnibus + SiteScope; Remedy incidents; technical escalation; communication with leadership/managers.' },
    points: [
      { pt: 'Monitoração de infraestrutura e análise de alarmes (Netcool/Omnibus + SiteScope).', en: 'Infrastructure monitoring and alarm analysis (Netcool/Omnibus + SiteScope).' },
      { pt: 'Incidentes Remedy, acionamento técnico e acompanhamento de resolução.', en: 'Remedy incidents, technical escalation and resolution follow-up.' },
      { pt: 'Comunicação com liderança conforme plano e tempos definidos.', en: 'Communication with leadership per the defined plan and timelines.' },
    ],
  },
  {
    role: { pt: 'Analista de Monitoração / Ponto Focal — Projeto NDC Telefônica | VIVO', en: 'Monitoring Analyst / Focal Point — NDC Telefônica | VIVO Project' }, org: 'Stefanini',
    loc: { pt: 'São Paulo e Região, Brasil', en: 'São Paulo Area, Brazil' }, start: '2014-11', end: '2016-03', period: { pt: 'nov/2014 – mar/2016 · 1 ano 5 meses', en: 'Nov 2014 – Mar 2016 · 1 yr 5 mos' },
    filter: 'analista monitoracao ponto focal ndc telefonica vivo stefanini netcool omnibus sitescope remedy incidentes acionamento comunicacao lideranca',
    desc: { pt: 'Monitoração de infraestrutura crítica; alarmes; Remedy; acionamentos; acompanhamento e comunicação com liderança.', en: 'Critical-infrastructure monitoring; alarms; Remedy; escalations; follow-up and leadership communication.' },
    points: [
      { pt: 'Monitoração e análise de alarmes em sistemas/servidores críticos.', en: 'Monitoring and alarm analysis on critical systems/servers.' },
      { pt: 'Incidentes Remedy, acionamento técnico e follow-up de resolução.', en: 'Remedy incidents, technical escalation and resolution follow-up.' },
      { pt: 'Comunicação com liderança conforme plano.', en: 'Communication with leadership per the plan.' },
    ],
  },
  {
    role: { pt: 'Técnico de Informática Sênior', en: 'Senior IT Technician' }, org: 'Lojas Marabraz',
    loc: { pt: 'São Paulo e Região, Brasil', en: 'São Paulo Area, Brazil' }, start: '2013-08', end: '2014-05', period: { pt: 'ago/2013 – mai/2014 · 10 meses', en: 'Aug 2013 – May 2014 · 10 mos' },
    filter: 'tecnico informatica senior marabraz monitoramento open-source mapas scripts bash powershell backup hp data protector vmware nagios zabbix grafana',
    desc: { pt: 'Monitoramento open-source + mapas; scripts Bash/PowerShell; jobs de backup HP Data Protector; VMware.', en: 'Open-source monitoring + maps; Bash/PowerShell scripts; HP Data Protector backup jobs; VMware.' },
    points: [
      { pt: 'Monitoramento com ferramentas open-source e mapas de visualização.', en: 'Monitoring with open-source tools and visualization maps.' },
      { pt: 'Scripts em Bash e PowerShell para demandas de monitoração.', en: 'Bash and PowerShell scripts for monitoring needs.' },
      { pt: 'Operação e criação de jobs de backup (HP Data Protector).', en: 'Operating and building backup jobs (HP Data Protector).' },
    ],
  },
  {
    role: { pt: 'Estagiário', en: 'Intern' }, org: 'XMM Tecnologia da Informação',
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

const SKILLS_L: { title: L; level: number; icon: string; chips: string[] }[] = [
  { title: { pt: 'Monitoramento / NOC', en: 'Monitoring / NOC' }, level: 5, icon: 'Activity', chips: ['SolarWinds', 'Netcool/Omnibus', 'HP SiteScope', 'Zabbix', 'Nagios', 'Grafana'] },
  { title: { pt: 'ITSM / Incidentes', en: 'ITSM / Incidents' }, level: 5, icon: 'ListChecks', chips: ['BMC Remedy', 'Jira', 'GLPI', 'ITIL', 'SLA', 'Incident Mgmt', 'Escalation', 'Problem/Change', 'RCA', 'Runbooks'] },
  { title: { pt: 'Redes', en: 'Networking' }, level: 4, icon: 'Network', chips: ['TCP/IP', 'LAN/WAN', 'DNS', 'Wi-Fi', 'VPN', 'Switching/Routing', 'Cisco Meraki'] },
  { title: { pt: 'Automação / Scripting', en: 'Automation / Scripting' }, level: 4, icon: 'Terminal', chips: ['PowerShell', 'Bash', 'Python', 'Git/GitHub', 'Routine automation'] },
  { title: { pt: 'Backup / Continuidade', en: 'Backup / Continuity' }, level: 4, icon: 'DatabaseBackup', chips: ['Symantec NetBackup', 'HP Data Protector', 'Backup/Restore', 'Disaster Recovery', 'Restore validation'] },
  { title: { pt: 'Segurança', en: 'Security' }, level: 3, icon: 'ShieldCheck', chips: ['Information Security', 'Cybersecurity', 'Pentest (fundamentals)', 'Vulnerability Assessment', 'Hardening', 'Security Awareness'] },
  { title: { pt: 'Sistemas', en: 'Systems' }, level: 4, icon: 'Server', chips: ['Windows', 'Linux', 'Active Directory', 'IAM basics', 'SQL/SQL Server', 'Microsoft Office'] },
  { title: { pt: 'Produção · MDM · Cloud', en: 'Production · MDM · Cloud' }, level: 3, icon: 'Cloud', chips: ['BMC Control-M', 'MDM', 'Workspace ONE', 'AWS (fundamentals)', 'Cloud Computing'] },
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
  { title: { pt: 'Defesa Cibernética', en: 'Cyber Defense' }, sub: { pt: 'Estácio · jan/2024', en: 'Estácio · Jan 2024' } },
  { title: { pt: 'Bacharelado em Sistemas de Informação', en: 'BSc in Information Systems' }, sub: { pt: 'FACCAMP · 2011 – 2015', en: 'FACCAMP · 2011 – 2015' } },
  { title: { pt: 'Formação Técnica', en: 'Technical Diploma' }, sub: { pt: 'ETEC Gino Rezaghi · 2009 – 2010', en: 'ETEC Gino Rezaghi · 2009 – 2010' } },
]

const CONTACTS_L: { type: string; label: L; value: string; href?: string; copy?: string; icon: string }[] = [
  { type: 'email', label: { pt: 'Email', en: 'Email' }, value: 'omfg_nick@hotmail.com', href: 'mailto:omfg_nick@hotmail.com', copy: 'omfg_nick@hotmail.com', icon: 'Mail' },
  { type: 'phone', label: { pt: 'Telefone', en: 'Phone' }, value: '+55 11 94232-7967', href: 'tel:+5511942327967', copy: '+5511942327967', icon: 'Phone' },
  { type: 'linkedin', label: { pt: 'LinkedIn', en: 'LinkedIn' }, value: 'linkedin.com/in/nicolasmesquita', href: 'https://www.linkedin.com/in/nicolasmesquita/', copy: 'https://www.linkedin.com/in/nicolasmesquita/', icon: 'Linkedin' },
  { type: 'github', label: { pt: 'GitHub', en: 'GitHub' }, value: 'github.com/omfgnick', href: 'https://github.com/omfgnick', copy: 'https://github.com/omfgnick', icon: 'Github' },
  { type: 'location', label: { pt: 'Localização', en: 'Location' }, value: 'São Paulo, Brasil', icon: 'MapPin' },
]

const PROJECTS_L: { name: string; desc: L; tags: string[]; url: string }[] = [
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
    jobs: JOBS_L.map(j => ({ role: p(j.role, lang), org: j.org, loc: j.loc ? p(j.loc, lang) : undefined, start: j.start, end: j.end, period: p(j.period, lang), open: j.open, filter: j.filter, desc: p(j.desc, lang), points: arr(j.points, lang) })),
    skills: SKILLS_L.map(s => ({ title: p(s.title, lang), level: s.level, icon: s.icon, chips: s.chips })),
    certs: CERTS_L.map(c => ({ title: p(c.title, lang), sub: p(c.sub, lang), cred: c.cred })),
    edu: EDU_L.map(e => ({ title: p(e.title, lang), sub: p(e.sub, lang) })),
    contacts: CONTACTS_L.map(c => ({ type: c.type, label: p(c.label, lang), value: c.value, href: c.href, copy: c.copy, icon: c.icon })),
    projects: PROJECTS_L.map(pr => ({ name: pr.name, desc: p(pr.desc, lang), tags: pr.tags, url: pr.url })),
  }
}
