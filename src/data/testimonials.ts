import type { Lang } from './cv'

/**
 * Recomendações reais recebidas no LinkedIn (linkedin.com/in/nicolasmesquita).
 *
 * REGRA: `quote` é a transcrição LITERAL do que a pessoa escreveu, em português.
 * Nunca editar, resumir ou "melhorar" o texto de outra pessoa. `quoteEn` é uma
 * tradução exibida só no modo inglês, sinalizada como tradução na interface.
 * Para adicionar uma nova, copie o texto exato da recomendação no LinkedIn.
 */
export interface Testimonial {
  name: string
  /** Headline da pessoa no LinkedIn, encurtada para caber no card. */
  role: string
  /** Vínculo profissional, como o LinkedIn descreve. */
  rel: { pt: string; en: string }
  /** Data da recomendação (ISO) e rótulo exibido. */
  date: string
  quote: string
  quoteEn: string
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Alexsandro Romão Dias',
    role: 'Network Analyst · NSE3-FCA · ECMS1 · CMNA · CCNA R/S',
    rel: { pt: 'trabalhou na mesma equipe', en: 'worked on the same team' },
    date: '2023-10-31',
    quote: 'Excelente profissional!',
    quoteEn: 'Excellent professional!',
  },
  {
    name: 'Lafaiete Rodrigues Machado',
    role: 'QA Pleno · Engenharia de Software · Automação de Testes',
    rel: { pt: 'trabalhou com Nicolas em outra equipe', en: 'worked with Nicolas on a different team' },
    date: '2015-11-25',
    quote: 'Recomendo o Nicolas sem restrições, profissional dedicado, participativo com ótimo conhecimento técnico, e excelente relacionamento interpessoal.',
    quoteEn: 'I recommend Nicolas without reservation — a dedicated, engaged professional with great technical knowledge and excellent interpersonal skills.',
  },
]

/** Iniciais para o avatar (não usamos as fotos do LinkedIn: privacidade e hotlink). */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? '') + (parts[parts.length - 1]?.[0] ?? '')).toUpperCase()
}

export function formatDate(iso: string, lang: Lang): string {
  const d = new Date(iso + 'T12:00:00')
  return d.toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-GB', { month: 'short', year: 'numeric' })
}
