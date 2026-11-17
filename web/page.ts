// Tokenville — página: Escritório (por chat) + Tokenômetro (uso real, ao vivo),
// no idioma do sistema de quem instalou.
import { scene } from '../hooks/scene'
import { BRAND, pickLang, setLang, t } from '../hooks/i18n'
import { MODE_LIST, isMode, modeHint, modeLabel, modeShort } from '../hooks/power'
import type { Mode } from '../hooks/power'

type Session = { id: string; title: string; lastPrompt: string; project: string; updatedAt: number; live: boolean; awake: number }
type Acc = { real: number; opus: number; normal: number; tokens: number; input: number; output: number; cacheRead: number; cacheWrite: number; msgs: number }
type Usage = {
  now: number; today: Acc; totals: Acc; days: Record<string, Acc>; byModel: Record<string, Acc>
  topSessions: (Acc & { id: string; title: string })[]; minutes: Acc[]; rate: number
  rtk: { summary?: { total_saved?: number } } | null
}

const $ = (id: string) => document.getElementById(id)!
const esc = (s: string) => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!)
const usd = (v: number) => (v >= 100 ? '$' + v.toFixed(0) : v >= 1 ? '$' + v.toFixed(2) : v >= 0.01 ? '$' + v.toFixed(3) : '$' + v.toFixed(4))
const k = (n: number) => (n >= 1e9 ? (n / 1e9).toFixed(2) + 'B' : n >= 1e6 ? (n / 1e6).toFixed(1) + 'M' : n >= 1e3 ? (n / 1e3).toFixed(1) + 'k' : String(Math.round(n)))
const ago = (ts: number) => {
  const s = Math.max(0, (Date.now() - ts) / 1000)
  return s < 60 ? t('ago.now') : s < 3600 ? t('ago.min', { n: Math.floor(s / 60) }) : s < 86400 ? t('ago.h', { n: Math.floor(s / 3600) }) : t('ago.d', { n: Math.floor(s / 86400) })
}
const pct = (real: number, base: number) => (base > 0 ? Math.max(0, (1 - real / base) * 100) : 0)

// ---------- estado ----------
let view: 'office' | 'tokens' = 'office'
const fromUrl = new URLSearchParams(location.search).get('s') || ''
let current = fromUrl
let sessions: Session[] = []
let mode: Mode = 'equilibrado'
let lastStateText = ''
let lastKey = ''
let usage: Usage | null = null
let langSet = false

// Textos fixos da página (aplicados de novo quando o idioma chega do servidor).
function applyStatic() {
  document.documentElement.lang = t('ago.now') === 'agora' ? 'pt-BR' : t('ago.now') === 'ahora' ? 'es' : 'en'
  document.title = BRAND
  $('brand').textContent = `🏙️ ${BRAND}`
  $('tabOffice').textContent = t('tab.office')
  $('tabTokens').textContent = t('tab.tokens')
  $('chatsTitle').textContent = t('chats.title')
  $('modesTitle').textContent = t('modes.title')
  $('modeToggle').title = t('modes.collapse')
  drawModes()
  drawChats()
}
setLang(pickLang(navigator.language)) // provisório, até o servidor dizer o idioma do sistema

// ---------- abas ----------
document.querySelectorAll<HTMLButtonElement>('.tab').forEach(b =>
  b.addEventListener('click', () => {
    view = b.dataset.view === 'tokens' ? 'tokens' : 'office'
    document.querySelectorAll('.tab').forEach(x => x.classList.toggle('on', x === b))
    $('view-office').classList.toggle('on', view === 'office')
    $('view-tokens').classList.toggle('on', view === 'tokens')
    if (view === 'tokens') void loadUsage()
    else { lastKey = ''; redrawOffice() }
  }),
)

// ---------- modos (canto inferior direito) ----------
function drawModes() {
  $('modeButtons').innerHTML = MODE_LIST.map(
    m => `<button class="mode${m === mode ? ' on' : ''}" data-mode="${m}"><b>${esc(modeLabel(m))}</b><span>${esc(modeShort(m))}</span></button>`,
  ).join('')
  $('modeHint').textContent = modeHint(mode)
}
$('modeButtons').addEventListener('click', async ev => {
  const m = (ev.target as HTMLElement).closest('button')?.getAttribute('data-mode')
  if (!isMode(m)) return
  mode = m
  drawModes()
  try {
    await fetch('/mode', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ mode: m }) })
  } catch {
    $('status').textContent = t('err.mode')
  }
})
$('modeToggle').addEventListener('click', () => {
  const min = $('modes').classList.toggle('min')
  $('modeToggle').textContent = min ? '▴' : '▾'
})

// ---------- lista de chats ----------
function drawChats() {
  if (!sessions.length) {
    $('chats').innerHTML = `<div class="note">${esc(langSet ? t('chats.none') : t('chats.loading'))}</div>`
    return
  }
  $('chats').innerHTML = sessions
    .map(s => {
      const badges = (s.live ? `<span class="badge">${esc(t('chats.live'))}</span>` : '') + (s.awake ? `<span class="badge busy">${esc(t('chats.busy', { n: s.awake }))}</span>` : '')
      return `<button class="chat${s.id === current ? ' on' : ''}" data-id="${esc(s.id)}"><span class="t">${esc(s.title || t('chats.untitled'))}${badges}</span>` +
        `<span class="m">${esc(s.project || t('chats.noFolder'))} · ${ago(s.updatedAt)}</span></button>`
    })
    .join('')
}
$('chats').addEventListener('click', ev => {
  const id = (ev.target as HTMLElement).closest('button')?.getAttribute('data-id')
  if (id) selectChat(id)
})
function selectChat(id: string) {
  current = id
  history.replaceState(null, '', `?s=${encodeURIComponent(id)}`)
  lastStateText = ''
  drawChats()
  void loadState()
  if (view !== 'office') (document.querySelector('.tab[data-view="office"]') as HTMLButtonElement).click()
}

async function loadSessions() {
  try {
    const r = await (await fetch('/api/sessions', { cache: 'no-store' })).json()
    if (!langSet && r.locale) {
      setLang(pickLang(r.locale))
      langSet = true
      lastKey = ''
      applyStatic()
      redrawOffice()
    }
    sessions = r.sessions ?? []
    if (isMode(r.mode) && r.mode !== mode) { mode = r.mode; drawModes() }
    if (!current || (!sessions.some(s => s.id === current) && current !== fromUrl)) current = (sessions.find(s => s.live) ?? sessions[0])?.id ?? ''
    drawChats()
    const live = sessions.filter(s => s.live).length
    const base = usage ? usage.today.opus + ((usage.rtk?.summary?.total_saved ?? 0) * 4) / 1e6 : 0
    $('liveHead').innerHTML = `<span class="dot"></span>${esc(live === 1 ? t('head.live1') : t('head.live', { n: live }))}` +
      (usage ? ` · ${esc(t('head.saving'))} <b>−${pct(usage.today.real, base).toFixed(1)}%</b>` : '')
    $('status').textContent = ''
  } catch {
    $('status').textContent = t('err.server')
  }
}

// ---------- escritório ----------
async function loadState() {
  if (!current || view !== 'office') return
  try {
    const text = await (await fetch(`/api/state?s=${encodeURIComponent(current)}`, { cache: 'no-store' })).text()
    if (text !== lastStateText) { lastStateText = text; redrawOffice() }
  } catch {
    /* tenta de novo no próximo ciclo */
  }
}
function redrawOffice() {
  if (!lastStateText) return
  const box = $('office').getBoundingClientRect()
  const wide = box.width / Math.max(1, box.height) > 1
  const key = lastStateText + '|' + wide
  if (key === lastKey) return
  lastKey = key
  const st = JSON.parse(lastStateText)
  const focused = document.activeElement?.id
  $('office').innerHTML = scene({
    workers: st.workers ?? [],
    ceo: st.ceo ?? { from: '', at: '', movedAt: 0, say: '' },
    pedido: st.pedido ?? '',
    now: Date.now(),
    wide,
  })
  const svg = $('office').querySelector('svg')
  if (svg) { svg.setAttribute('width', '100%'); svg.setAttribute('height', '100%') }
  if (focused) (document.getElementById(focused) as unknown as SVGElement | null)?.focus?.()
}
window.addEventListener('resize', () => { lastKey = ''; redrawOffice() })

// ---------- tokenômetro ----------
async function loadUsage() {
  try {
    usage = await (await fetch('/api/usage', { cache: 'no-store' })).json()
    if (view === 'tokens') drawTokens()
  } catch {
    /* servidor fora do ar */
  }
}

function lineChart(mins: Acc[]): string {
  const W = 640, H = 200, L = 46, B = 22, T = 10
  let r = 0, n = 0
  const real = mins.map(m => (r += m.real))
  const norm = mins.map(m => (n += m.opus))
  const max = Math.max(n, 0.0001)
  const x = (i: number) => L + (i / (mins.length - 1)) * (W - L - 8)
  const y = (v: number) => T + (1 - v / max) * (H - T - B)
  const path = (arr: number[]) => arr.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join('')
  const area = (arr: number[]) => `${path(arr)}L${x(arr.length - 1)},${y(0)}L${x(0)},${y(0)}Z`
  let grid = ''
  for (let g = 0; g <= 4; g++) {
    const v = (max * g) / 4
    grid += `<line x1="${L}" x2="${W - 8}" y1="${y(v)}" y2="${y(v)}" stroke="#ffffff10"/><text x="${L - 6}" y="${y(v) + 3}" font-size="10" fill="#8f88ad" text-anchor="end">${usd(v)}</text>`
  }
  for (const m of [0, 15, 30, 45, 59]) grid += `<text x="${x(m)}" y="${H - 6}" font-size="10" fill="#8f88ad" text-anchor="middle">${m === 59 ? esc(t('c.now')) : `-${59 - m}m`}</text>`
  return `<svg viewBox="0 0 ${W} ${H}" shape-rendering="geometricPrecision">${grid}` +
    `<path d="${area(norm)}" fill="#5b547055"/><path d="${path(norm)}" fill="none" stroke="#8f88ad" stroke-width="2"/>` +
    `<path d="${area(real)}" fill="#7CFC9A33"/><path d="${path(real)}" fill="none" stroke="#7CFC9A" stroke-width="2.5"/>` +
    `<circle cx="${x(mins.length - 1)}" cy="${y(r)}" r="4" fill="#7CFC9A"><animate attributeName="r" values="3;6;3" dur="1.4s" repeatCount="indefinite"/></circle></svg>`
}

function barChart(days: [string, Acc][]): string {
  const W = 640, H = 200, L = 46, B = 22, T = 10
  const max = Math.max(...days.map(([, d]) => d.opus), 0.0001)
  const bw = (W - L - 8) / days.length
  const y = (v: number) => T + (1 - v / max) * (H - T - B)
  let g = ''
  for (let i = 0; i <= 4; i++) {
    const v = (max * i) / 4
    g += `<line x1="${L}" x2="${W - 8}" y1="${y(v)}" y2="${y(v)}" stroke="#ffffff10"/><text x="${L - 6}" y="${y(v) + 3}" font-size="10" fill="#8f88ad" text-anchor="end">${usd(v)}</text>`
  }
  days.forEach(([key, d], i) => {
    const x0 = L + i * bw
    g += `<rect x="${x0 + 3}" y="${y(d.opus)}" width="${bw / 2 - 3}" height="${y(0) - y(d.opus)}" fill="#5b5470"><title>${key} · ${esc(t('c.normal'))} ${usd(d.opus)}</title></rect>`
    g += `<rect x="${x0 + bw / 2}" y="${y(d.real)}" width="${bw / 2 - 3}" height="${y(0) - y(d.real)}" fill="#7CFC9A"><title>${key} · ${esc(t('c.real'))} ${usd(d.real)} (−${pct(d.real, d.opus).toFixed(1)}%)</title></rect>`
    g += `<text x="${x0 + bw / 2}" y="${H - 6}" font-size="10" fill="#8f88ad" text-anchor="middle">${key.slice(8)}/${key.slice(5, 7)}</text>`
  })
  return `<svg viewBox="0 0 ${W} ${H}" shape-rendering="crispEdges">${g}</svg>`
}

function drawTokens() {
  const u = usage
  if (!u) return
  const td = u.today
  // "Normal" = o uso de sempre: tudo no Opus, COM o cache que o Claude Code já
  // faz. A economia aqui é só o que o Tokenville poupou de verdade.
  const rtkSaved = u.rtk?.summary?.total_saved ?? 0
  const rtkValue = (rtkSaved * 4) / 1e6 // tokens que o rtk tirou, a preço de entrada do Opus
  const modelSave = Math.max(0, td.opus - td.real)
  const saved = modelSave + rtkValue
  const baseline = td.opus + rtkValue
  const cacheSave = Math.max(0, td.normal - td.opus)
  const inTotal = td.input + td.cacheRead + td.cacheWrite
  const hit = inTotal > 0 ? (td.cacheRead / inTotal) * 100 : 0
  const days = Object.entries(u.days)
  const models = Object.entries(u.byModel).sort((a, b) => b[1].real - a[1].real)
  const who = (key: string) => key.replace(' · chefe', ` · ${t('who.lead')}`).replace(' · agentes', ` · ${t('who.agents')}`)
  const kpi = (title: string, v: string, s: string, color = 'var(--ink)') =>
    `<div class="tile kpi"><h2>${esc(title)}</h2><div class="v" style="color:${color}">${v}</div><div class="s">${esc(s)}</div></div>`
  const none = (cols: number) => `<tr><td colspan="${cols}" class="note">${esc(t('c.nothing'))}</td></tr>`
  $('view-tokens').innerHTML =
    kpi(t('k.saving'), `−${pct(td.real, baseline).toFixed(1)}%`, t('k.savingSub', { x: usd(saved) }), 'var(--good)') +
    kpi(t('k.real'), usd(td.real), t('k.realSub', { n: td.msgs })) +
    kpi(t('k.normal'), usd(baseline), t('k.normalSub'), 'var(--dim)') +
    kpi(t('k.tokens'), k(td.tokens), t('k.tokensSub', { o: k(td.output), i: k(td.input) })) +
    kpi(t('k.rate'), `${k(u.rate)}/min`, t('k.rateSub'), 'var(--warn)') +
    kpi(t('k.cache'), `${hit.toFixed(0)}%`, t('k.cacheSub', { x: k(td.cacheRead) })) +
    `<div class="tile wide"><h2>${esc(t('c.live'))}</h2>${lineChart(u.minutes)}` +
    `<div class="legend"><span><i style="background:#8f88ad"></i>${esc(t('c.normal'))}</span><span><i style="background:#7CFC9A"></i>${esc(t('c.real'))}</span><span>${esc(t('c.every'))}</span></div></div>` +
    `<div class="tile side"><h2>${esc(t('c.where'))}</h2>` +
    `<div class="split"><div style="width:${saved > 0 ? (modelSave / saved) * 100 : 0}%;background:#7CFC9A"></div><div style="width:${saved > 0 ? (rtkValue / saved) * 100 : 0}%;background:#ffd34d"></div></div>` +
    `<table><tr><td><span class="badge" style="margin:0 6px 0 0"></span>${esc(t('c.model'))}</td><td class="n">${usd(modelSave)}</td></tr>` +
    `<tr><td><span class="badge busy" style="margin:0 6px 0 0"></span>${esc(t('c.rtk', { x: k(rtkSaved) }))}</td><td class="n">${usd(rtkValue)}</td></tr>` +
    `<tr><td style="color:var(--dim)">${esc(t('c.cache'))}</td><td class="n" style="color:var(--dim)">${usd(cacheSave)}</td></tr></table>` +
    `<div class="note">${esc(t('c.whereNote'))}</div></div>` +
    `<div class="tile half"><h2>${esc(t('c.days', { n: days.length }))}</h2>${barChart(days)}<div class="legend"><span><i style="background:#5b5470"></i>${esc(t('c.normal'))}</span><span><i style="background:#7CFC9A"></i>${esc(t('c.real'))}</span></div></div>` +
    `<div class="tile half"><h2>${esc(t('c.byModel'))}</h2><table><tr><th>${esc(t('c.modelWho'))}</th><th class="n">${esc(t('c.tokens'))}</th><th class="n">${esc(t('c.real'))}</th><th class="n">${esc(t('c.normal'))}</th></tr>` +
    (models.length ? models.map(([m, a]) => `<tr><td>${esc(who(m))}</td><td class="n">${k(a.tokens)}</td><td class="n">${usd(a.real)}</td><td class="n">${usd(a.opus)}</td></tr>`).join('') : none(4)) +
    `</table></div>` +
    `<div class="tile full"><h2>${esc(t('c.topChats'))}</h2><table><tr><th>${esc(t('c.chat'))}</th><th class="n">${esc(t('c.tokens'))}</th><th class="n">${esc(t('c.real'))}</th><th class="n">${esc(t('c.normal'))}</th><th class="n">${esc(t('c.saving'))}</th></tr>` +
    (u.topSessions.length
      ? u.topSessions.map(s => `<tr class="link" data-id="${esc(s.id)}"><td>${esc(s.title || t('chats.untitled'))}</td><td class="n">${k(s.tokens)}</td><td class="n">${usd(s.real)}</td><td class="n">${usd(s.opus)}</td><td class="n" style="color:var(--good)">−${pct(s.real, s.opus).toFixed(1)}%</td></tr>`).join('')
      : none(5)) +
    `</table><div class="note">${esc(t('c.foot'))}</div></div>`
}
$('view-tokens').addEventListener('click', ev => {
  const id = (ev.target as HTMLElement).closest('tr.link')?.getAttribute('data-id')
  if (id) selectChat(id)
})

// ---------- teclas ----------
window.addEventListener('keydown', e => {
  if ((e.target as HTMLElement).closest('input,textarea')) return
  if (e.key === 'f' || e.key === 'F') {
    if (document.fullscreenElement) void document.exitFullscreen()
    else void document.documentElement.requestFullscreen()
  }
})

// ---------- ciclos ----------
applyStatic()
void loadSessions().then(loadState)
setInterval(loadSessions, 3000)
setInterval(loadState, 700)
setInterval(() => void loadUsage(), 2000)
void loadUsage()
