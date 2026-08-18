/* Conteúdo do currículo — data-driven, como STATS/STEPS/FAQS da landing. */

export interface Job {
  role: string
  org: string
  loc?: string
  period: string
  open?: boolean
  filter: string
  desc: string
  points: string[]
}

export interface Skill {
  title: string
  level: number // 1..5 (ênfase, não porcentagem inventada)
  icon: string  // nome do ícone lucide
  chips: string[]
}

export interface Credential { title: string; sub: string; cred?: string }
export interface Metric { count: number; suffix?: string; label: string }
export interface Contact { type: string; label: string; value: string; href?: string; copy?: string; icon: string }

export const PROFILE = {
  name: 'Nicolas Mesquita Fernandes',
  role: '// Infrastructure & Incident Operations Specialist',
  tagline:
    'Especialista em operação de infraestrutura crítica, monitoração NOC e gestão de incidentes. Foco em SLA/MTTR, padronização (runbooks) e automação para reduzir esforço manual e erro humano.',
  tags: ['Suporte N1/N2/N3', 'NOC / SLA', 'Segurança da Informação', 'Automação (PowerShell/Bash/Python)'],
  linkedin: 'https://www.linkedin.com/in/nicolasmesquita/',
  github: 'https://github.com/omfgnick',
  whatsapp: 'https://wa.me/5511942327967',
}

export const METRICS: Metric[] = [
  { count: 12, suffix: '+', label: 'anos em operações de TI' },
  { count: 10, label: 'projetos & experiências' },
  { count: 9, label: 'certificações técnicas' },
  { count: 3, label: 'linguagens de automação' },
]

export const TERMINAL: string[] = [
  '$whoami',
  'nicolas.mesquita — infrastructure & incident operations',
  '$uptime',
  'online desde 2014 · foco em SLA/MTTR',
  '$monitor --stack',
  'SolarWinds · Remedy · Grafana · Zabbix · Meraki [ok]',
  '$status',
  '● systems operational — disponível para oportunidades',
]

export const CAPS = [
  { icon: 'Headphones', h: 'Suporte N1/N2/N3', d: 'Troubleshooting de hardware/software, redes e incidentes críticos.' },
  { icon: 'Radar', h: 'NOC / Monitoração', d: 'Triagem, escalonamento e acompanhamento orientado a SLA.' },
  { icon: 'ShieldAlert', h: 'Gestão de Incidentes', d: 'Comunicação objetiva e follow-up até a normalização.' },
  { icon: 'ListChecks', h: 'ITSM', d: 'Incident / Problem / Change — conceitos e rotina operacional.' },
  { icon: 'Lock', h: 'Segurança', d: 'Boas práticas, políticas, backups e auditoria básica.' },
  { icon: 'Terminal', h: 'Automação', d: 'Scripts e rotinas em PowerShell/Bash/Python para consistência.' },
]

export const JOBS: Job[] = [
  {
    role: 'Técnico de Suporte — Mercado Livre', org: 'Randstad Brasil · Tempo integral', loc: 'Presencial',
    period: 'nov/2024 – jan/2026 · 1 ano 3 meses', open: true,
    filter: 'tecnico suporte mercado livre randstad presencial impressoras zebra mdm jira 5s inventario n1 n2 n3 windows',
    desc: 'Assistência presencial e disponibilidade de equipamentos; manutenção preventiva; tickets; MDM; 5S; inventário; Jira.',
    points: ['Suporte aos usuários e disponibilidade de equipamentos (bancadas, baterias, handhelds).', 'Manutenção preventiva e suporte em impressoras Zebra.', 'Gestão de chamados e acompanhamento via Jira.', 'MDM para dispositivos móveis; configuração de hardware (ex.: leitores 3D).', 'Aplicação de 5S e padronização de postos.', 'Guias de boas práticas; gestão e controle de inventário.'],
  },
  {
    role: 'Operador de Suporte Datacenter — NOC Mc Donald’s', org: 'Telefónica Ingeniería de Seguridad',
    period: 'out/2019 – abr/2022 · 2 anos 7 meses',
    filter: 'operador suporte datacenter noc mcdonalds telefonica ingenieria seguridad solarwinds remedy meraki links operadoras ping switches access-point pos sat kvs quiosque sla',
    desc: 'Monitoração de links via SolarWinds; incidentes via BMC Remedy; validação de conectividade; acionamento de operadoras; Cisco Meraki.',
    points: ['Monitoração e abertura/acompanhamento de incidentes (SolarWinds + Remedy).', 'Validação de conectividade em lojas (Ping): switches, APs, POS, SAT, KVS, quiosques e Meraki.', 'Acionamento e acompanhamento com operadoras até normalização.'],
  },
  {
    role: 'Analista de Suporte — Projeto TDATA Telefônica | VIVO', org: 'Tech Mahindra – Brasil',
    period: 'mai/2019 – set/2019 · 5 meses',
    filter: 'analista suporte projeto tdata telefonica vivo tech mahindra noc n1 sla relatorios emails solarwinds dashboard remedy servidores infraestrutura redes escalonamento',
    desc: 'NOC Telefônica (Tdata): monitoramento de incidentes, N1, SLA, relatórios, acionamentos e escalonamentos.',
    points: ['Monitoramento e tratamento de incidentes no primeiro nível; acompanhamento de chamados.', 'Acompanhamento de SLA; relatórios e comunicação com o cliente via e-mail.', 'Monitoração de servidores (virtuais e físicos), infraestrutura e redes.'],
  },
  {
    role: 'Analista de Suporte — Projeto NOC Mc Donald’s Telefônica | VIVO', org: 'Tech Mahindra – Brasil',
    period: 'nov/2017 – set/2019 · 1 ano 11 meses',
    filter: 'analista suporte noc mcdonalds telefonica vivo tech mahindra solarwinds remedy links ping switches access-point pos sat kvs quiosque operadoras',
    desc: 'Monitoração de links via SolarWinds; incidentes via BMC Remedy; validação de conectividade e indisponibilidade; operadoras.',
    points: ['Monitoração e incidentes (SolarWinds + Remedy).', 'Validação de conectividade em loja e diagnóstico de indisponibilidade.', 'Acionamento de operadoras e acompanhamento.'],
  },
  {
    role: 'Analista de Suporte — Projeto NOC Mc Donald’s Telefônica | VIVO', org: 'SONDA Brasil',
    period: 'fev/2017 – out/2017 · 9 meses',
    filter: 'analista suporte noc mcdonalds telefonica vivo sonda solarwinds remedy links ping indisponibilidade operadoras',
    desc: 'Monitoração de links; incidentes Remedy; validação e acionamento de operadoras.',
    points: ['Monitoração (SolarWinds) e abertura/acompanhamento de incidentes (Remedy).', 'Validação de conectividade e indisponibilidade; acionamento de operadoras.'],
  },
  {
    role: 'Analista de Produção — Projeto NDC Telefônica | VIVO', org: 'end-to-end technology',
    period: 'jun/2016 – set/2016 · 4 meses',
    filter: 'analista producao ndc telefonica vivo end-to-end technology control-m schedules remedy restore netbackup batch jobs',
    desc: 'Control-M (rerun/hold/free/force ok/kill/run now/confirm/ordenação), schedules, Remedy, restores e NetBackup.',
    points: ['Operação de rotinas no Control-M e acompanhamento de schedules em produção.', 'Chamados em Remedy e atividades de restore/backup (NetBackup).'],
  },
  {
    role: 'Analista de Monitoração / Ponto Focal — Projeto NDC Telefônica | VIVO', org: 'end-to-end technology',
    period: 'abr/2016 – set/2016 · 6 meses',
    filter: 'analista monitoracao ponto focal ndc telefonica vivo end-to-end technology netcool omnibus sitescope remedy incidentes acionamento comunicacao diretoria grafana zabbix nagios',
    desc: 'Netcool/Omnibus + SiteScope; incidentes Remedy; acionamento técnico; comunicação com diretoria/gestores.',
    points: ['Monitoração de infraestrutura e análise de alarmes (Netcool/Omnibus + SiteScope).', 'Incidentes Remedy, acionamento técnico e acompanhamento de resolução.', 'Comunicação com liderança conforme plano e tempos definidos.'],
  },
  {
    role: 'Analista de Monitoração / Ponto Focal — Projeto NDC Telefônica | VIVO', org: 'Stefanini', loc: 'São Paulo e Região, Brasil',
    period: 'nov/2014 – mar/2016 · 1 ano 5 meses',
    filter: 'analista monitoracao ponto focal ndc telefonica vivo stefanini netcool omnibus sitescope remedy incidentes acionamento comunicacao lideranca',
    desc: 'Monitoração de infraestrutura crítica; alarmes; Remedy; acionamentos; acompanhamento e comunicação com liderança.',
    points: ['Monitoração e análise de alarmes em sistemas/servidores críticos.', 'Incidentes Remedy, acionamento técnico e follow-up de resolução.', 'Comunicação com liderança conforme plano.'],
  },
  {
    role: 'Técnico de Informática Sênior', org: 'Lojas Marabraz', loc: 'São Paulo e Região, Brasil',
    period: 'ago/2013 – mai/2014 · 10 meses',
    filter: 'tecnico informatica senior marabraz monitoramento open-source mapas scripts bash powershell backup hp data protector vmware nagios zabbix grafana',
    desc: 'Monitoramento open-source + mapas; scripts Bash/PowerShell; jobs de backup HP Data Protector; VMware.',
    points: ['Monitoramento com ferramentas open-source e mapas de visualização.', 'Scripts em Bash e PowerShell para demandas de monitoração.', 'Operação e criação de jobs de backup (HP Data Protector).'],
  },
  {
    role: 'Estagiário', org: 'XMM Tecnologia da Informação', loc: 'Cajamar – SP',
    period: 'mar/2012 – mai/2013 · 1 ano 3 meses',
    filter: 'estagiario xmm tecnologia informacao cajamar glpi servicedesk suporte usuarios redes servidores microinformatica cabeamento roteadores switches',
    desc: 'ServiceDesk GLPI; suporte a usuários; redes e servidores; microinformática; cabeamento; roteadores/switches.',
    points: ['Atendimento de chamados via GLPI e suporte a usuários.', 'Vivência em redes, servidores e microinformática.', 'Cabeamento e suporte em roteadores/switches.'],
  },
]

export const SKILLS: Skill[] = [
  { title: 'Monitoramento / NOC', level: 5, icon: 'Activity', chips: ['SolarWinds', 'Netcool/Omnibus', 'HP SiteScope', 'Zabbix', 'Nagios', 'Grafana'] },
  { title: 'ITSM / Incidentes', level: 5, icon: 'ListChecks', chips: ['BMC Remedy', 'Jira', 'GLPI', 'ITIL', 'SLA', 'Incident Mgmt', 'Escalation', 'Problem/Change', 'RCA', 'Runbooks'] },
  { title: 'Redes', level: 4, icon: 'Network', chips: ['TCP/IP', 'LAN/WAN', 'DNS', 'Wi-Fi', 'VPN', 'Switching/Roteamento', 'Cisco Meraki'] },
  { title: 'Automação / Scripting', level: 4, icon: 'Terminal', chips: ['PowerShell', 'Bash', 'Python', 'Git/GitHub', 'Automação de rotinas'] },
  { title: 'Backup / Continuidade', level: 4, icon: 'DatabaseBackup', chips: ['Symantec NetBackup', 'HP Data Protector', 'Backup/Restore', 'Disaster Recovery', 'Validação de Restore'] },
  { title: 'Segurança', level: 3, icon: 'ShieldCheck', chips: ['Segurança da Informação', 'Cibersegurança', 'Pentest (fundamentos)', 'Vulnerability Assessment', 'Hardening', 'Security Awareness'] },
  { title: 'Sistemas', level: 4, icon: 'Server', chips: ['Windows', 'Linux', 'Active Directory', 'IAM básico', 'SQL/SQL Server', 'Microsoft Office'] },
  { title: 'Produção · MDM · Cloud', level: 3, icon: 'Cloud', chips: ['BMC Control-M', 'MDM', 'Workspace ONE', 'AWS (Fundamentos)', 'Cloud Computing'] },
]

export const CERTS: Credential[] = [
  { title: 'Programação para Internet', sub: 'Estácio · jul/2025', cred: 'db67f5df491f166a9630ba5' },
  { title: 'Desenvolvimento de Aplicações em Python', sub: 'Estácio · dez/2024', cred: '8641f2465a0d1ac13b5067f' },
  { title: 'AWS Cloud Practitioner Essentials', sub: 'Estácio · abr/2024' },
  { title: 'Fase 2 | Capacitação - Computação em Nuvem', sub: 'Ka Solution · abr/2024' },
  { title: 'Computação em Nuvem | AWS Discovery Day', sub: 'Ka Solution · mar/2024' },
  { title: 'Introdução ao Pentest na Prática', sub: 'Desec Security · jan/2024', cred: 'RWXO-JGIXJ-LYLFC' },
  { title: 'Introdução à Cibersegurança', sub: 'Cisco · jan/2024' },
  { title: 'ECMS1 — Engineering Cisco Meraki Solutions 1', sub: 'Cisco Meraki · jun/2021' },
  { title: 'BOOTCAMP Cisco - Meraki', sub: 'FASTPATH University · abr/2020' },
]

export const EDU: Credential[] = [
  { title: 'Defesa Cibernética', sub: 'Estácio · jan/2024' },
  { title: 'Bacharelado em Sistemas de Informação', sub: 'FACCAMP · 2011 – 2015' },
  { title: 'Formação Técnica', sub: 'ETEC Gino Rezaghi · 2009 – 2010' },
]

export const CONTACTS: Contact[] = [
  { type: 'email', label: 'Email', value: 'omfg_nick@hotmail.com', href: 'mailto:omfg_nick@hotmail.com', copy: 'omfg_nick@hotmail.com', icon: 'Mail' },
  { type: 'phone', label: 'Telefone', value: '+55 11 94232-7967', href: 'tel:+5511942327967', copy: '+5511942327967', icon: 'Phone' },
  { type: 'linkedin', label: 'LinkedIn', value: 'linkedin.com/in/nicolasmesquita', href: 'https://www.linkedin.com/in/nicolasmesquita/', copy: 'https://www.linkedin.com/in/nicolasmesquita/', icon: 'Linkedin' },
  { type: 'github', label: 'GitHub', value: 'github.com/omfgnick', href: 'https://github.com/omfgnick', copy: 'https://github.com/omfgnick', icon: 'Github' },
  { type: 'location', label: 'Localização', value: 'São Paulo, Brasil', icon: 'MapPin' },
]

export interface Project { name: string; desc: string; tags: string[]; url: string }
export const PROJECTS: Project[] = [
  {
    name: 'Powershell-Scripts',
    desc: 'Utilitários de automação para infra Windows: backup + retenção, health-checks (disco, serviços, endpoints), triagem de eventos, expiração de TLS e auditoria de contas locais — com CI de lint (PSScriptAnalyzer).',
    tags: ['PowerShell', 'Automação', 'NOC/Ops'],
    url: 'https://github.com/omfgnick/Powershell-Scripts',
  },
  {
    name: 'Bash-Scripts',
    desc: 'Scripts Bash para infraestrutura e segurança: backup compactado com verificação de integridade e port-scan com classificação de vulnerabilidade.',
    tags: ['Bash', 'Segurança', 'Backup'],
    url: 'https://github.com/omfgnick/Bash-Scripts',
  },
  {
    name: 'portfolio-cv',
    desc: 'Este currículo — Vite + React + TypeScript, HUD cyberpunk, QR real gerado do zero e contador de visitas por país (Cloudflare Worker + KV).',
    tags: ['React', 'TypeScript', 'Vite'],
    url: 'https://github.com/omfgnick/portfolio-cv',
  },
]

export const LINKEDIN_QR = 'https://www.linkedin.com/in/nicolasmesquita/'
