/**
 * Contador de visitas — Cloudflare Worker + KV.
 * Guarda apenas agregados (país, dia, referrer, minuto) — sem IP, sem PII.
 *
 * Rotas:
 *   POST /hit?ref=<host>  -> incrementa total, país, dia, referrer e "minuto" (p/ ao vivo)
 *   GET  /stats           -> { total, countries[], days[], referrers[], live }
 *
 * Binding necessário: KV namespace `VISITS`.
 */
const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}
const json = (obj) => new Response(JSON.stringify(obj), { headers: { 'Content-Type': 'application/json', ...cors } })
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

    return json({ total, countries, days, referrers, live })
  },
}
