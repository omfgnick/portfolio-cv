import { PROFILE_INFO as PROFILE } from '@/data/cv'

/** Gera e baixa um vCard (.vcf) com os dados de contato do perfil. */
export function downloadVCard(): void {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'N:Fernandes;Nicolas Mesquita;;;',
    `FN:${PROFILE.name}`,
    'TITLE:Infrastructure & Incident Operations Specialist',
    'EMAIL;TYPE=INTERNET:omfg_nick@hotmail.com',
    'TEL;TYPE=CELL:+5511942327967',
    `URL:${PROFILE.linkedin}`,
    `URL:${PROFILE.github}`,
    'ADR;TYPE=HOME:;;;São Paulo;;;Brasil',
    'END:VCARD',
  ]
  const blob = new Blob([lines.join('\r\n')], { type: 'text/vcard;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'nicolas-mesquita-fernandes.vcf'
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
