/**
 * Gera um currículo PDF (texto selecionável, ATS-friendly) por idioma a partir
 * dos dados de src/data/cv.ts. Rode com: npm run gen:pdf
 * Os PDFs vão para public/ e são versionados (não regerados no CI).
 */
import PDFDocument from 'pdfkit'
import { createWriteStream } from 'node:fs'
import { getCV, PROFILE_INFO, type Lang } from '../src/data/cv'
import { TESTIMONIALS, formatDate } from '../src/data/testimonials'

const EMERALD = '#0a7f5f'
const DARK = '#12211c'
const GREY = '#55605a'

function build(lang: Lang, outfile: string): Promise<void> {
  const cv = getCV(lang)
  const doc = new PDFDocument({ size: 'A4', margin: 46, info: { Title: `${PROFILE_INFO.name} — CV`, Author: PROFILE_INFO.name } })
  const stream = createWriteStream(outfile)
  doc.pipe(stream)
  const W = doc.page.width - doc.page.margins.left - doc.page.margins.right

  const rule = () => { const y = doc.y + 2; doc.moveTo(doc.x, y).lineTo(doc.x + W, y).strokeColor(EMERALD).lineWidth(0.8).stroke(); doc.moveDown(0.5) }
  const h = (t: string) => {
    doc.moveDown(0.6).font('Helvetica-Bold').fontSize(10.5).fillColor(EMERALD).text(t.toUpperCase(), { characterSpacing: 0.6 })
    rule()
  }

  // Header
  doc.font('Helvetica-Bold').fontSize(21).fillColor(DARK).text(PROFILE_INFO.name)
  doc.font('Helvetica').fontSize(10.5).fillColor(EMERALD).text('Infrastructure & Incident Operations Specialist')
  doc.font('Helvetica').fontSize(8.5).fillColor(GREY)
    .text(`omfg_nick@hotmail.com   ·   +55 11 94232-7967   ·   São Paulo, ${lang === 'pt' ? 'Brasil' : 'Brazil'}`)
  doc.fillColor(EMERALD).text('linkedin.com/in/nicolasmesquita   ·   github.com/omfgnick   ·   omfgnick.github.io/portfolio-cv')

  // Summary
  h(lang === 'pt' ? 'Resumo' : 'Summary')
  doc.font('Helvetica').fontSize(9.5).fillColor(DARK).text(cv.profile.tagline, { align: 'justify' })

  // Experience
  h(lang === 'pt' ? 'Experiência' : 'Experience')
  for (const j of cv.jobs) {
    doc.font('Helvetica-Bold').fontSize(10).fillColor(DARK).text(j.role, { continued: false })
    doc.font('Helvetica').fontSize(8.5).fillColor(GREY).text(`${j.org}${j.loc ? '  ·  ' + j.loc : ''}   —   ${j.period}`)
    doc.font('Helvetica').fontSize(9).fillColor(DARK)
    for (const p of j.points) doc.text('•  ' + p, { indent: 8, align: 'justify' })
    doc.moveDown(0.35)
  }

  // Skills
  h(lang === 'pt' ? 'Competências' : 'Skills')
  for (const s of cv.skills) {
    doc.font('Helvetica-Bold').fontSize(9).fillColor(DARK).text(s.title + ':  ', { continued: true })
      .font('Helvetica').fillColor(GREY).text(s.chips.join(', '))
  }

  // Certifications
  h(lang === 'pt' ? 'Certificações' : 'Certifications')
  doc.font('Helvetica').fontSize(9).fillColor(DARK)
  for (const c of cv.certs) doc.text('•  ' + c.title + ' — ' + c.sub)

  // Education
  h(lang === 'pt' ? 'Formação' : 'Education')
  doc.font('Helvetica').fontSize(9).fillColor(DARK)
  for (const e of cv.edu) doc.text('•  ' + e.title + ' — ' + e.sub)

  // Recomendações (transcrição literal do LinkedIn)
  h(lang === 'pt' ? 'Recomendações' : 'Recommendations')
  for (const r of TESTIMONIALS) {
    doc.font('Helvetica-Oblique').fontSize(9).fillColor(DARK)
      .text('“' + (lang === 'pt' ? r.quote : r.quoteEn) + '”', { align: 'justify' })
    doc.font('Helvetica').fontSize(8).fillColor(GREY)
      .text(`— ${r.name}, ${r.role} (${r.rel[lang]}, ${formatDate(r.date, lang)})`)
    doc.moveDown(0.3)
  }

  doc.end()
  return new Promise(res => stream.on('finish', () => res()))
}

await build('pt', 'public/cv-nicolas-mesquita-pt.pdf')
await build('en', 'public/cv-nicolas-mesquita-en.pdf')
console.log('PDFs gerados em public/')
