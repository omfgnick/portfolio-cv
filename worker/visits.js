/**
 * Contador de visitas por país — Cloudflare Worker + KV.
 * Guarda apenas contagens AGREGADAS por país (sem IP, sem PII) — LGPD-friendly.
 *
 * Rotas:
 *   POST /hit    -> incrementa total + país (Cloudflare fornece o país em request.cf.country)
 *   GET  /stats  -> { total, countries: [{ code, count }] }
 *
 * Binding necessário: KV namespace `VISITS` (ver worker/README.md).
 */
const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}
const json = (obj) => new Response(JSON.stringify(obj), { headers: { 'Content-Type': 'application/json', ...cors } })

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors })
    if (!env.VISITS) return json({ error: 'KV namespace VISITS not bound' })

    const url = new URL(request.url)

    if (request.method === 'POST' && url.pathname.endsWith('/hit')) {
      const country = (request.cf && request.cf.country) || 'XX'
      const [t, c] = await Promise.all([env.VISITS.get('total'), env.VISITS.get(`c:${country}`)])
      await Promise.all([
        env.VISITS.put('total', String((parseInt(t, 10) || 0) + 1)),
        env.VISITS.put(`c:${country}`, String((parseInt(c, 10) || 0) + 1)),
      ])
      return json({ ok: true })
    }

    // GET /stats (default)
    const list = await env.VISITS.list({ prefix: 'c:' })
    const countries = await Promise.all(
      list.keys.map(async (k) => ({ code: k.name.slice(2), count: parseInt(await env.VISITS.get(k.name), 10) || 0 })),
    )
    countries.sort((a, b) => b.count - a.count)
    const total = parseInt(await env.VISITS.get('total'), 10) || 0
    return json({ total, countries })
  },
}
