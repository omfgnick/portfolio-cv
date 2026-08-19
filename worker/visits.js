/**
 * Contador de visitas — Cloudflare Worker + KV.
 * Guarda apenas agregados (país, dia, referrer, minuto) — sem IP, sem PII.
 *
 * Rotas:
 *   POST /hit?ref=<host>  -> incrementa total, país, dia, referrer e "minuto" (p/ ao vivo)
 *   POST /events          -> resumo de engajamento de UMA sessão (corpo JSON)
 *   GET  /stats           -> { total, countries[], days[], referrers[], live, engagement }
 *
 * Sobre o /events: o navegador acumula os eventos durante a visita e envia um
 * resumo só, no fim. O plano grátis do KV dá 1.000 operações de escrita, exclusão
 * e listagem por dia — somadas num único balde —, então gravar evento a evento
 * consumiria a cota depressa e derrubaria o contador de visitas junto.
 *
 * Binding necessário: KV namespace `VISITS`.
 */
const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}
const json = (obj, status = 200) => new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json', ...cors } })
// Conjuntos fixos: o /events só aceita estes nomes (um cliente adulterado não
// pode inflar o KV com chaves arbitrárias) e o /stats lê exatamente eles.
const ACTIONS = ['pdf', 'linkedin', 'github', 'whatsapp', 'email', 'vcard', 'recruiter', 'terminal']
const SECTIONS = ['about', 'experience', 'skills', 'projects', 'credentials', 'praise', 'contact']

const dayKey = (d) => `d:${d.toISOString().slice(0, 10)}`
const inc = async (env, key, opts) => {
  const cur = parseInt(await env.VISITS.get(key), 10) || 0
  await env.VISITS.put(key, String(cur + 1), opts)
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors })
    if (!env.VISITS) return json({ error: 'KV namespace VISITS not bound' })
    const url = new URL(request.url)

    if (request.method === 'POST' && url.pathname.endsWith('/hit')) {
      const now = new Date()
      const country = (request.cf && request.cf.country) || 'XX'
      const minute = Math.floor(now.getTime() / 60000)
      let ref = (url.searchParams.get('ref') || '').toLowerCase().replace(/^www\./, '').slice(0, 60)
      if (ref.includes('omfgnick.github.io') || !/^[a-z0-9.\-]+\.[a-z]{2,}$/.test(ref)) ref = '' // ignora próprio host e lixo
      await Promise.all([
        inc(env, 'total'),
        inc(env, `c:${country}`),
        inc(env, dayKey(now), { expirationTtl: 60 * 60 * 24 * 40 }),      // dias: TTL 40d
        inc(env, `m:${minute}`, { expirationTtl: 60 * 20 }),               // minutos: TTL 20min (ao vivo)
        ref ? inc(env, `r:${ref}`, { expirationTtl: 60 * 60 * 24 * 90 }) : Promise.resolve(),
      ])
      return json({ ok: true })
    }

    // POST /events — resumo de engajamento de UMA sessão, agregado no cliente
    if (request.method === 'POST' && url.pathname.endsWith('/events')) {
      let body = {}
      try { body = await request.json() } catch { return json({ error: 'invalid json' }, 400) }

      const actions = Array.isArray(body.actions) ? body.actions : []
      const sections = Array.isArray(body.sections) ? body.sections : []
      const depth = Number(body.depth)
      const seconds = Number(body.seconds)

      // Tudo num registro só, com uma gravação por sessão em vez de uma por
      // contador. Com chave separada por item seriam ~7 gravações; o KV grátis
      // dá 1.000/dia somando escrita, exclusão e listagem, e estourar isso
      // derrubaria o contador de visitas junto, que divide o mesmo balde.
      //
      // O custo é uma corrida entre sessões simultâneas (ler-somar-gravar não é
      // atômico): duas visitas no mesmo instante podem perder um incremento.
      // Para métrica de tendência isso é aceitável; o total de visitas, que
      // precisa ser exato, continua em contadores próprios no /hit.
      const cur = (await env.VISITS.get('eng', { type: 'json' })) || {}
      const bump = (group, key) => {
        cur[group] = cur[group] || {}
        cur[group][key] = (cur[group][key] || 0) + 1
      }

      for (const a of new Set(actions.filter((x) => ACTIONS.includes(x)))) bump('actions', a)
      for (const sec of new Set(sections.filter((x) => SECTIONS.includes(x)))) bump('sections', sec)
      if (Number.isFinite(depth) && depth >= 0 && depth <= 100) {
        bump('depth', String(Math.min(100, Math.floor(depth / 25) * 25)))
      }
      if (Number.isFinite(seconds) && seconds >= 0) {
        bump('dwell', seconds < 10 ? '0' : seconds < 30 ? '10' : seconds < 120 ? '30' : '120')
      }
      cur.sessions = (cur.sessions || 0) + 1

      await env.VISITS.put('eng', JSON.stringify(cur))
      return json({ ok: true, sessions: cur.sessions })
    }

    // GET /stats
    const total = parseInt(await env.VISITS.get('total'), 10) || 0

    const cList = await env.VISITS.list({ prefix: 'c:' })
    const countries = (await Promise.all(cList.keys.map(async (k) =>
      ({ code: k.name.slice(2), count: parseInt(await env.VISITS.get(k.name), 10) || 0 }))))
      .sort((a, b) => b.count - a.count)

    // últimos 14 dias (inclui zeros para um sparkline contínuo)
    const days = []
    for (let i = 13; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000)
      const c = parseInt(await env.VISITS.get(dayKey(d)), 10) || 0
      days.push({ date: d.toISOString().slice(5, 10), count: c })
    }

    // ao vivo: soma dos minutos não expirados (~últimos 20 min)
    const mList = await env.VISITS.list({ prefix: 'm:' })
    const live = (await Promise.all(mList.keys.map(async (k) => parseInt(await env.VISITS.get(k.name), 10) || 0)))
      .reduce((a, b) => a + b, 0)

    const rList = await env.VISITS.list({ prefix: 'r:' })
    const referrers = (await Promise.all(rList.keys.map(async (k) =>
      ({ host: k.name.slice(2), count: parseInt(await env.VISITS.get(k.name), 10) || 0 }))))
      .sort((a, b) => b.count - a.count).slice(0, 5)

    // Uma leitura só: o engajamento inteiro vive num registro único.
    const engagement = (await env.VISITS.get('eng', { type: 'json' })) || {}

    return json({ total, countries, days, referrers, live, engagement })
  },
}
