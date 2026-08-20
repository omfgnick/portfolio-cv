import worker from '../visits.js'

function fakeKV({ fail = false, seed = {} } = {}) {
  const store = new Map(Object.entries(seed))
  const ops = { get: 0, put: 0, list: 0 }
  return {
    ops,
    async get(k, o) {
      if (fail) throw new Error('KV quota exceeded')
      ops.get++
      const v = store.get(k)
      if (v === undefined) return null
      return o && o.type === 'json' ? JSON.parse(v) : v
    },
    async put(k, v) { if (fail) throw new Error('KV quota exceeded'); ops.put++; store.set(k, v) },
    async list({ prefix }) {
      if (fail) throw new Error('KV quota exceeded')
      ops.list++
      return { keys: [...store.keys()].filter(k => k.startsWith(prefix)).map(name => ({ name })) }
    },
  }
}
const req = (url, method = 'GET', cf = { country: 'BR' }) =>
  new Request(url, { method, cf })

let fails = 0
const check = (label, cond, extra = '') => {
  console.log(`  ${cond ? 'ok  ' : 'FALHOU'} ${label}${extra ? '  ' + extra : ''}`)
  if (!cond) fails++
}

// 1. /hit grava exatamente 2 chaves (era 5)
{
  const VISITS = fakeKV({ seed: { agg: JSON.stringify({ migrated: true }) } })
  await worker.fetch(req('https://x/hit?ref=github.com', 'POST'), { VISITS })
  check('/hit faz 2 escritas', VISITS.ops.put === 2, `put=${VISITS.ops.put}`)
  check('/hit nao lista', VISITS.ops.list === 0, `list=${VISITS.ops.list}`)
}

// 2. /stats nao lista nada (depois de migrado)
{
  const VISITS = fakeKV({ seed: { total: '42', agg: JSON.stringify({ migrated: true, countries: { BR: 40, US: 2 }, days: {}, referrers: {}, live: {} }) } })
  const r = await worker.fetch(req('https://x/stats'), { VISITS })
  const j = await r.json()
  check('/stats nao lista', VISITS.ops.list === 0, `list=${VISITS.ops.list}`)
  check('/stats nao escreve', VISITS.ops.put === 0, `put=${VISITS.ops.put}`)
  check('total preservado', j.total === 42, `total=${j.total}`)
  check('paises ordenados', j.countries[0].code === 'BR' && j.countries[0].count === 40)
  check('14 dias no sparkline', j.days.length === 14)
}

// 3. migracao traz o historico das chaves antigas, uma unica vez
{
  const VISITS = fakeKV({ seed: { total: '100', 'c:BR': '80', 'c:US': '20', 'r:github.com': '15', 'd:2026-08-19': '7' } })
  const r = await worker.fetch(req('https://x/stats'), { VISITS })
  const j = await r.json()
  check('migracao lista 3 vezes (so agora)', VISITS.ops.list === 3, `list=${VISITS.ops.list}`)
  check('historico de paises preservado', j.countries.find(c => c.code === 'BR')?.count === 80)
  check('historico de referrers preservado', j.referrers.find(x => x.host === 'github.com')?.count === 15)
}

// 4. KV quebrado -> 200 com CORS, e nao 1101 sem cabecalho
{
  const VISITS = fakeKV({ fail: true })
  const r = await worker.fetch(req('https://x/stats'), { VISITS })
  const j = await r.json()
  check('KV falhando devolve 200', r.status === 200, `status=${r.status}`)
  check('resposta tem CORS', r.headers.get('access-control-allow-origin') === '*')
  check('marca degradado', typeof j.degraded === 'string')
  // Zero seria exibido pelo cliente e pareceria perda de visitas; nulo faz o
  // contador sumir, que e a leitura honesta de "nao sei".
  check('total degradado e NULO, nao zero', j.total === null, `total=${JSON.stringify(j.total)}`)
}

// 5. "ao vivo" ignora minutos velhos
{
  const nowMin = Math.floor(Date.now() / 60000)
  const live = { [String(nowMin)]: 3, [String(nowMin - 5)]: 2, [String(nowMin - 90)]: 99 }
  const VISITS = fakeKV({ seed: { total: '1', agg: JSON.stringify({ migrated: true, live }) } })
  const j = await (await worker.fetch(req('https://x/stats'), { VISITS })).json()
  check('ao vivo soma so os 20 min recentes', j.live === 5, `live=${j.live}`)
}

// 6. list() bloqueado pela cota nao pode derrubar o total
{
  const base = fakeKV({ seed: { total: '615' } })
  const VISITS = {
    ops: base.ops,
    get: base.get.bind(base),
    put: base.put.bind(base),
    async list() { throw new Error('KV list() limit exceeded for the day.') },
  }
  const j = await (await worker.fetch(req('https://x/stats'), { VISITS })).json()
  check('cota de list() nao zera o total', j.total === 615, `total=${j.total}`)
  check('resposta segue valida', Array.isArray(j.countries) && j.days.length === 14)
}

// 7. /hit continua contando mesmo sem poder migrar
{
  const base = fakeKV({ seed: { total: '615' } })
  const VISITS = { ops: base.ops, get: base.get.bind(base), put: base.put.bind(base), async list() { throw new Error('limit') } }
  await worker.fetch(req('https://x/hit', 'POST'), { VISITS })
  check('/hit grava mesmo com list() bloqueado', VISITS.ops.put === 2, `put=${VISITS.ops.put}`)
  const j2 = await (await worker.fetch(req('https://x/stats'), { VISITS })).json()
  check('total incrementou', j2.total === 616, `total=${j2.total}`)
}

console.log(fails === 0 ? '\nTUDO OK' : `\n${fails} FALHA(S)`)
process.exit(fails ? 1 : 0)
