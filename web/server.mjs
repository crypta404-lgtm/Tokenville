// Tokenville — servidor local (só 127.0.0.1, sem dependências).
//
// • Serve a página (index.html + office.js) desta pasta.
// • /api/sessions  → seus chats reais do Claude Code (de ~/.claude/projects).
// • /api/state     → o escritório de um chat (gravado pelo mod) ou um estado ocioso.
// • /api/usage     → uso real de tokens, lido dos transcripts, ao vivo.
// • POST /mode     → modo de economia escolhido nos botões.
//
// Nada aqui abre janela: o rtk roda com windowsHide e o próprio servidor é
// iniciado escondido (start-hidden.vbs no Windows).
import { createServer } from 'node:http'
import { execFile } from 'node:child_process'
import { open, readFile, readdir, stat, writeFile, mkdir } from 'node:fs/promises'
import { homedir } from 'node:os'
import { basename, dirname, extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

const APP = dirname(fileURLToPath(import.meta.url))
const HOME = homedir()
const CLAUDE = process.env.CLAUDE_CONFIG_DIR || join(HOME, '.claude')
const DATA = join(CLAUDE, 'tokenville')
// Idioma do sistema (o ICU do Node segue o locale do SO; LANG vale no Linux/macOS).
const LOCALE = process.env.LC_ALL || process.env.LANG || Intl.DateTimeFormat().resolvedOptions().locale || 'en'
const PROJECTS = join(CLAUDE, 'projects')
const PORT = Number(process.argv[2] || process.env.TOKENVILLE_PORT || 4747)
const HISTORY_DAYS = 14
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml' }
const MODES = new Set(['ultra', 'economico', 'equilibrado', 'maximo'])

// ---------- preços (por milhão de tokens, API Anthropic, nov/2026) ----------
const PRICES = {
  fable: { in: 8, out: 40, cr: 0.2, cw: 10 },
  opus: { in: 4, out: 20, cr: 0.2, cw: 5 },
  sonnet: { in: 2, out: 10, cr: 0.1, cw: 2.5 },
  haiku: { in: 0.1, out: 0.5, cr: 0.01, cw: 0.125 },
}
const family = m => ['fable', 'haiku', 'sonnet', 'opus'].find(k => String(m).toLowerCase().includes(k)) || 'opus'
const cost = (u, fam) => {
  const p = PRICES[fam]
  return (u.i * p.in + u.o * p.out + u.cr * p.cr + u.cw * p.cw) / 1e6
}

// ---------- leitura incremental dos transcripts ----------
// Por arquivo: até onde já lemos, ids de mensagem já contados e metadados.
const files = new Map() // path -> { pos, rest, seen:Set, session, title, lastPrompt, cwd, mtime, isMain }
const entries = [] // { t, s, fam, model, i, o, cr, cw, side }

async function walk(dir, depth, out) {
  let list
  try { list = await readdir(dir, { withFileTypes: true }) } catch { return }
  for (const d of list) {
    const p = join(dir, d.name)
    if (d.isDirectory()) { if (depth < 3 && d.name !== 'tool-results') await walk(p, depth + 1, out) }
    else if (d.name.endsWith('.jsonl')) out.push(p)
  }
}

async function scan() {
  const paths = []
  await walk(PROJECTS, 0, paths)
  const cutoff = Date.now() - HISTORY_DAYS * 864e5
  for (const p of paths) {
    let st
    try { st = await stat(p) } catch { continue }
    if (st.mtimeMs < cutoff) continue
    let f = files.get(p)
    if (!f) {
      f = { pos: 0, rest: '', seen: new Set(), session: basename(p, '.jsonl'), title: '', lastPrompt: '', cwd: '', mtime: 0, isMain: basename(dirname(p)) !== 'subagents' }
      files.set(p, f)
    }
    f.mtime = st.mtimeMs
    if (st.size < f.pos) { f.pos = 0; f.rest = '' } // arquivo reescrito
    if (st.size === f.pos) continue
    const fh = await open(p, 'r')
    try {
      const len = Math.min(st.size - f.pos, 64 * 1024 * 1024)
      const buf = Buffer.alloc(len)
      await fh.read(buf, 0, len, f.pos)
      f.pos += len
      const text = f.rest + buf.toString('utf8')
      const lines = text.split('\n')
      f.rest = lines.pop() ?? ''
      for (const line of lines) parseLine(f, line)
    } finally {
      await fh.close()
    }
  }
}

function parseLine(f, line) {
  if (!line) return
  let o
  try { o = JSON.parse(line) } catch { return }
  if (o.sessionId && f.isMain) f.session = o.sessionId
  if (o.type === 'custom-title' && o.customTitle) f.title = String(o.customTitle)
  else if (o.type === 'last-prompt' && o.lastPrompt) f.lastPrompt = String(o.lastPrompt)
  if (o.cwd) f.cwd = o.cwd
  if (o.type !== 'assistant') return
  const m = o.message
  const u = m && m.usage
  if (!u || !m.model || m.model === '<synthetic>') return
  const id = m.id || o.requestId
  if (id) { if (f.seen.has(id)) return; f.seen.add(id) }
  entries.push({
    t: Date.parse(o.timestamp) || Date.now(),
    s: o.sessionId || f.session,
    fam: family(m.model),
    model: m.model,
    i: u.input_tokens || 0,
    o: u.output_tokens || 0,
    cr: u.cache_read_input_tokens || 0,
    cw: u.cache_creation_input_tokens || 0,
    side: !f.isMain || !!o.isSidechain,
  })
}

let scanning = null
let lastScan = 0
function fresh() {
  if (Date.now() - lastScan < 1500) return scanning || Promise.resolve()
  lastScan = Date.now()
  scanning = scan().catch(() => {}).finally(() => { scanning = null })
  return scanning
}

// ---------- rtk (economia medida por ele) ----------
const RTK_CANDIDATES = [
  process.env.RTK_PATH,
  process.env.LOCALAPPDATA && join(process.env.LOCALAPPDATA, 'Microsoft/WinGet/Links/rtk.exe'),
  process.env.LOCALAPPDATA && join(process.env.LOCALAPPDATA, 'Microsoft/WinGet/Packages/rtk-ai.rtk_Microsoft.Winget.Source_8wekyb3d8bbwe/rtk.exe'),
  join(HOME, '.local/bin/rtk'),
  join(HOME, '.cargo/bin/rtk'),
  'rtk',
].filter(Boolean)
let rtkCache = { at: 0, data: null }
async function rtkGain() {
  if (Date.now() - rtkCache.at < 20000) return rtkCache.data
  rtkCache.at = Date.now()
  for (const bin of RTK_CANDIDATES) {
    const data = await new Promise(resolve => {
      execFile(bin, ['gain', '-f', 'json'], { windowsHide: true, timeout: 8000 }, (err, out) => {
        if (err) return resolve(null)
        try { resolve(JSON.parse(out)) } catch { resolve(null) }
      })
    })
    if (data) { rtkCache.data = data; break }
  }
  return rtkCache.data
}

// ---------- agregações ----------
const dayKey = t => { const d = new Date(t); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` }
const blank = () => ({ real: 0, opus: 0, normal: 0, tokens: 0, input: 0, output: 0, cacheRead: 0, cacheWrite: 0, msgs: 0 })
function add(acc, e) {
  const real = cost(e, e.fam)
  const opus = cost(e, 'opus')
  // "normal" = tudo em Opus e sem cache (todo token de entrada pago cheio)
  const normal = cost({ i: e.i + e.cr + e.cw, o: e.o, cr: 0, cw: 0 }, 'opus')
  acc.real += real; acc.opus += opus; acc.normal += normal
  acc.tokens += e.i + e.o + e.cr + e.cw
  acc.input += e.i; acc.output += e.o; acc.cacheRead += e.cr; acc.cacheWrite += e.cw
  acc.msgs += 1
  return acc
}

async function usage() {
  await fresh()
  const now = Date.now()
  const today = dayKey(now)
  const days = {}
  for (let k = HISTORY_DAYS - 1; k >= 0; k--) days[dayKey(now - k * 864e5)] = blank()
  const totals = blank()
  const todayAcc = blank()
  const byModel = {}
  const bySession = {}
  const minutes = Array.from({ length: 60 }, () => blank())
  for (const e of entries) {
    const k = dayKey(e.t)
    if (!days[k]) continue
    add(days[k], e)
    add(totals, e)
    if (k === today) {
      add(todayAcc, e)
      const key = e.fam + (e.side ? ' · agentes' : ' · chefe')
      add((byModel[key] ||= blank()), e)
      add((bySession[e.s] ||= blank()), e)
    }
    const ago = Math.floor((now - e.t) / 60000)
    if (ago >= 0 && ago < 60) add(minutes[59 - ago], e)
  }
  const last5 = minutes.slice(-5).reduce((a, m) => a + m.tokens, 0) / 5
  const titles = sessionTitles()
  const topSessions = Object.entries(bySession)
    .map(([id, a]) => ({ id, title: titles.get(id) || id.slice(0, 8), ...a }))
    .sort((a, b) => b.real - a.real)
    .slice(0, 8)
  return { now, today: todayAcc, totals, days, byModel, topSessions, minutes, rate: last5, rtk: await rtkGain() }
}

function sessionTitles() {
  const m = new Map()
  for (const f of files.values()) if (f.isMain) m.set(f.session, f.title || f.lastPrompt.slice(0, 60))
  return m
}

async function sessions() {
  await fresh()
  const live = new Map()
  try {
    for (const n of await readdir(join(DATA, 'sessions'))) {
      if (!n.endsWith('.json')) continue
      try {
        const st = await stat(join(DATA, 'sessions', n))
        const s = JSON.parse(await readFile(join(DATA, 'sessions', n), 'utf8'))
        live.set(basename(n, '.json'), { at: st.mtimeMs, awake: (s.workers || []).filter(w => w.isAwake).length })
      } catch { /* ignora */ }
    }
  } catch { /* sem sessões do mod ainda */ }
  const list = []
  for (const f of files.values()) {
    if (!f.isMain) continue
    const l = live.get(f.session)
    const project = f.cwd ? basename(f.cwd.replace(/[\\/]+$/, '')) : ''
    list.push({
      id: f.session,
      title: f.title || f.lastPrompt.slice(0, 60),
      lastPrompt: f.lastPrompt.slice(0, 200),
      project,
      updatedAt: Math.max(f.mtime, l?.at ?? 0),
      live: !!l && Date.now() - l.at < 15 * 60000,
      awake: l?.awake ?? 0,
    })
  }
  const seen = new Set()
  return list
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .filter(s => (seen.has(s.id) ? false : (seen.add(s.id), true)))
    .slice(0, 40)
}

async function sessionState(id) {
  if (!/^[A-Za-z0-9-]{8,64}$/.test(id || '')) return null
  try { return JSON.parse(await readFile(join(DATA, 'sessions', id + '.json'), 'utf8')) } catch { /* sem estado */ }
  const f = [...files.values()].find(x => x.isMain && x.session === id)
  return { workers: [], ceo: { from: '', at: '', movedAt: 0, say: '' }, pedido: f?.lastPrompt?.slice(0, 160) || '', idle: true }
}

async function readMode() {
  try { const m = JSON.parse(await readFile(join(DATA, 'mode.json'), 'utf8')).mode; return MODES.has(m) ? m : 'equilibrado' } catch { return 'equilibrado' }
}

// ---------- HTTP ----------
const json = (res, code, body) => { res.writeHead(code, { 'content-type': TYPES['.json'], 'cache-control': 'no-store' }); res.end(JSON.stringify(body)) }

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', 'http://127.0.0.1')
    const path = url.pathname
    if (path === '/api/sessions') return json(res, 200, { sessions: await sessions(), mode: await readMode(), locale: LOCALE })
    if (path === '/api/state') return json(res, 200, (await sessionState(url.searchParams.get('s'))) || {})
    if (path === '/api/usage') return json(res, 200, await usage())
    if (path === '/mode' && req.method === 'POST') {
      let body = ''
      for await (const chunk of req) { body += chunk; if (body.length > 200) break }
      const mode = JSON.parse(body || '{}').mode
      if (!MODES.has(mode)) return json(res, 400, { error: 'modo inválido' })
      await mkdir(DATA, { recursive: true })
      await writeFile(join(DATA, 'mode.json'), JSON.stringify({ mode, at: Date.now() }))
      return json(res, 200, { mode })
    }
    if (path === '/mode.json') return json(res, 200, { mode: await readMode() })
    // arquivos estáticos da página (só desta pasta)
    const rel = normalize(path === '/' ? 'index.html' : path).replace(/^([\\/])+/, '')
    const file = join(APP, rel)
    const ext = extname(file)
    if (!file.startsWith(APP) || !['.html', '.js', '.svg'].includes(ext) || /server\.mjs$/.test(file)) { res.writeHead(404).end(); return }
    const data = await readFile(file)
    res.writeHead(200, { 'content-type': TYPES[extname(file)], 'cache-control': 'no-store' })
    res.end(data)
  } catch {
    res.writeHead(404).end()
  }
})
server.on('error', e => process.exit(e.code === 'EADDRINUSE' ? 0 : 1)) // outra instância já serve
server.listen(PORT, '127.0.0.1', () => {
  void fresh()
  // o mod lê o idioma daqui (no Windows não há LANG)
  void mkdir(DATA, { recursive: true }).then(() => writeFile(join(DATA, 'locale.json'), JSON.stringify({ locale: LOCALE }))).catch(() => {})
})
setInterval(() => void fresh(), 3000).unref()
