/**
 * Contador de visitas — Cloudflare Worker + KV.
 * Guarda apenas agregados (país, dia, referrer, minuto) — sem IP, sem PII.
 *
 * Rotas:
 *   POST /hit?ref=<host>  -> incrementa total, país, dia, referrer e "minuto" (p/ ao vivo)
 *   POST /events          -> resumo de engajamento de UMA sessão (corpo JSON)
 *   GET  /stats           -> { total, countries[], days[], referrers[], live, engagement }
 *
 * ── Sobre a cota, que já derrubou este Worker em produção ──────────────
 *
 * O plano grátis do KV dá 1.000 operações de ESCRITA, EXCLUSÃO e LISTAGEM por
 * dia, somadas num balde só. Leitura é outro balde, com 100.000/dia.
 *
 * A versão anterior gastava, por visitante:
 *   /hit    5 escritas (total, país, dia, minuto, referrer)
 *   /stats  3 listagens (c:, m:, r:)
 * ou seja ~8 operações do balde pequeno por visita. Umas 125 visitas/dia já
 * zeravam a cota — e, estourada a cota, `list()` e `put()` PASSAM A LANÇAR.
 * Sem try/catch, isso virava exceção não tratada: a Cloudflare respondia
 * "error code: 1101" com uma página de erro que não tem cabeçalho CORS, e o
 * navegador reportava como falha de CORS. O sintoma escondia a causa.
 *
 * Agora:
 *   /hit    2 escritas (total + um único registro agregado)
 *   /stats  3 leituras, ZERO listagens
 *
 * E todo acesso ao KV está sob try/catch: se falhar, a resposta continua sendo
 * JSON válido com CORS. O site perde o contador e segue funcionando, em vez de
 * sujar o console de todo visitante.
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

const DAY_MS = 86400000
const LIVE_MINUTES = 20
const KEEP_DAYS = 40

const dayStr = (d) => d.toISOString().slice(0, 10)
const readJson = async (env, key) => (await env.VISITS.get(key, { type: 'json' })) || {}

/** Descarta o que envelheceu, para o registro agregado não crescer sem limite. */
function prune(agg, now) {
  const minMinute = Math.floor(now.getTime() / 60000) - LIVE_MINUTES
  const minDay = dayStr(new Date(now.getTime() - KEEP_DAYS * DAY_MS))

  for (const m of Object.keys(agg.live || {})) {
    if (Number(m) < minMinute) delete agg.live[m]
  }
  for (const d of Object.keys(agg.days || {})) {
    if (d < minDay) delete agg.days[d]
  }
  return agg
}

/**
 * Traz o histórico das chaves antigas (c:, d:, r:) para o registro agregado.
 * Roda UMA vez, no primeiro acesso depois do deploy: sem isso a mudança de
 * formato jogaria fora o histórico de países, dias e referrers.
 * Custa 3 listagens nessa única vez, e nunca mais.
 */
async function migrate(env, agg) {
  if (agg.migrated) return agg
  agg.countries = agg.countries || {}
  agg.days = agg.days || {}
  agg.referrers = agg.referrers || {}

  // A migração é a ÚNICA coisa aqui que ainda depende de list(), e list() é
  // exatamente o que a cota derruba primeiro. Se ela falhar, não pode levar o
  // resto junto: o total de visitas não precisa de listagem nenhuma e tem de
  // continuar aparecendo.
  //
  // Sem a flag 'migrated', a tentativa se repete no próximo dia, quando a cota
  // reseta. Somar depois não duplica nada: as chaves antigas e o registro novo
  // são conjuntos separados.
  try {
    for (const [prefix, bucket] of [['c:', 'countries'], ['d:', 'days'], ['r:', 'referrers']]) {
      const list = await env.VISITS.list({ prefix })
      for (const k of list.keys) {
        const v = parseInt(await env.VISITS.get(k.name), 10) || 0
        const name = k.name.slice(prefix.length)
        agg[bucket][name] = (agg[bucket][name] || 0) + v
      }
    }
    agg.migrated = true
  } catch (err) {
    agg.migrationPending = String((err && err.message) || err)
  }
  return agg
}

const toSorted = (obj, keyName) =>
  Object.entries(obj || {})
    .map(([k, count]) => ({ [keyName]: k, count }))
    .sort((a, b) => b.count - a.count)

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors })
    if (!env.VISITS) return json({ error: 'KV namespace VISITS not bound' })

    const url = new URL(request.url)

    try {
      if (request.method === 'POST' && url.pathname.endsWith('/hit')) {
        const now = new Date()
        const country = (request.cf && request.cf.country) || 'XX'
        const minute = String(Math.floor(now.getTime() / 60000))
        let ref = (url.searchParams.get('ref') || '').toLowerCase().replace(/^www\./, '').slice(0, 60)
        // ignora o próprio host e qualquer coisa que não pareça domínio
        if (ref.includes('omfgnick.github.io') || !/^[a-z0-9.\-]+\.[a-z]{2,}$/.test(ref)) ref = ''

        const total = (parseInt(await env.VISITS.get('total'), 10) || 0) + 1

        let agg = await readJson(env, 'agg')
        agg = await migrate(env, agg)
        agg.countries = agg.countries || {}
        agg.days = agg.days || {}
        agg.referrers = agg.referrers || {}
        agg.live = agg.live || {}

        agg.countries[country] = (agg.countries[country] || 0) + 1
        agg.days[dayStr(now)] = (agg.days[dayStr(now)] || 0) + 1
        agg.live[minute] = (agg.live[minute] || 0) + 1
        if (ref) agg.referrers[ref] = (agg.referrers[ref] || 0) + 1
        prune(agg, now)

        // Duas escritas por visita, não cinco.
        await Promise.all([
          env.VISITS.put('total', String(total)),
          env.VISITS.put('agg', JSON.stringify(agg)),
        ])
        return json({ ok: true })
      }

      // POST /events — resumo de engajamento de UMA sessão, agregado no cliente
      if (request.method === 'POST' && url.pathname.endsWith('/events')) {
        let body = {}
        try { body = await request.json() } catch { body = {} }

        const actions = Array.isArray(body.actions) ? body.actions : []
        const sections = Array.isArray(body.sections) ? body.sections : []
        const depth = Number(body.depth)
        const seconds = Number(body.seconds)

        // Um registro só, uma gravação por sessão. Com chave separada por item
        // seriam ~7 gravações, e o balde de escrita é o que estoura primeiro.
        //
        // O custo é uma corrida entre sessões simultâneas (ler-somar-gravar não
        // é atômico): duas visitas no mesmo instante podem perder um
        // incremento. Para métrica de tendência isso é aceitável; o total de
        // visitas, que precisa ser exato, tem contador próprio no /hit.
        const cur = await readJson(env, 'eng')
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

      // GET /stats — três leituras, nenhuma listagem
      const total = parseInt(await env.VISITS.get('total'), 10) || 0
      let agg = await readJson(env, 'agg')
      agg = await migrate(env, agg)
      const engagement = await readJson(env, 'eng')

      const now = new Date()
      const minMinute = Math.floor(now.getTime() / 60000) - LIVE_MINUTES
      const live = Object.entries(agg.live || {})
        .filter(([m]) => Number(m) >= minMinute)
        .reduce((a, [, n]) => a + n, 0)

      // Últimos 14 dias, com zeros, para o sparkline não ter buracos
      const days = []
      for (let i = 13; i >= 0; i--) {
        const d = new Date(now.getTime() - i * DAY_MS)
        days.push({ date: dayStr(d).slice(5), count: (agg.days || {})[dayStr(d)] || 0 })
      }

      return json({
        total,
        countries: toSorted(agg.countries, 'code'),
        days,
        referrers: toSorted(agg.referrers, 'host').slice(0, 5),
        live,
        engagement,
      })
    } catch (err) {
      // Cota do KV estourada, KV indisponível, JSON corrompido: seja o que for,
      // a resposta continua válida e com CORS. O site esconde o contador em
      // silêncio, em vez de estourar erro no console de todo visitante.
      return json({ total: 0, countries: [], days: [], referrers: [], live: 0, engagement: {}, degraded: String(err && err.message || err) }, 200)
    }
  },
}
