// Tokenville — mod do Claude Code.
// Cada chat vira um escritório em pixel art: os subagentes acordam e dizem o
// que fazem, o nível de potência é escolhido sozinho e os modos de economia
// (ULTRA, Econômico, Equilibrado, Máximo) ajustam modelos, esforço e instruções.
// Página (Escritório + Tokenômetro): http://localhost:4747 — no idioma do sistema.
import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type { Ceo, Worker } from '../types'
import { BRAND, pickLang, setLang, t } from './i18n'
import { ECO_RULES, EFFORT, MODEL, ULTRA_AGENT_RULES, ULTRA_LEAD_RULES, isMode, levelLabel, modeLabel, pickLevel } from './power'
import type { Mode } from './power'

const PANE = 'tokenville'
const PORT = '4747'
const URL = `http://localhost:${PORT}/`
// Arquivos da página que o mod instala na pasta de dados.
const WEB_FILES = ['index.html', 'office.js', 'server.mjs', 'start-hidden.vbs']

const workers = atom({ plugin: 'tokenville', key: 'workers' } as const, [], { shape: 'workers-2' })
const ceo = atom({ plugin: 'tokenville', key: 'ceo' } as const, { from: '', at: '', movedAt: 0, say: '' }, { shape: 'ceo-2' })
const pedido = atom({ plugin: 'tokenville', key: 'pedido' } as const, '', { shape: 'pedido-1' })

const cut = (s: string, n: number) => {
  const one = s.replace(/\s+/g, ' ').trim()
  return one.length > n ? one.slice(0, n - 1) + '…' : one
}
const base = (p: unknown) => (typeof p === 'string' ? p.split(/[\\/]/).pop() ?? p : '')
const quiet = () => {}
const slash = (p: string) => p.replace(/\\/g, '/').replace(/\/+$/, '')
// Texto de sistema que não é um pedido do usuário (lembretes, notificações, comandos).
const isNoise = (s: string) => /^\s*<|^\s*\[|^\s*\//.test(s)

// ---------- caminhos e idioma (nada fixo: tudo vem do ambiente) ----------
type Paths = { claude: string; data: string; caveman: string; windows: boolean }
let paths: Paths | undefined
async function getPaths($: EngineInterface): Promise<Paths> {
  if (paths) return paths
  const home = slash((await $.env.get('USERPROFILE')) ?? (await $.env.get('HOME')) ?? '.')
  const claude = slash((await $.env.get('CLAUDE_CONFIG_DIR')) ?? `${home}/.claude`)
  const appdata = await $.env.get('APPDATA')
  const windows = (await $.env.get('OS')) === 'Windows_NT'
  paths = {
    claude,
    data: `${claude}/tokenville`,
    caveman: appdata ? `${slash(appdata)}/caveman/config.json` : `${home}/.config/caveman/config.json`,
    windows,
  }
  return paths
}
// Idioma do sistema: LANG/LC_ALL (Linux/macOS) ou o locale que o servidor grava (Windows).
let langFound = false
async function loadLang($: EngineInterface): Promise<void> {
  if (langFound) return
  const env = (await $.env.get('LC_ALL')) ?? (await $.env.get('LANG'))
  if (env && !/^(C|POSIX)/.test(env)) {
    setLang(pickLang(env))
    langFound = true
    return
  }
  try {
    const loc = JSON.parse(await $.fs.read(`${(await getPaths($)).data}/locale.json`)).locale
    if (loc) {
      setLang(pickLang(loc))
      langFound = true
    }
  } catch {
    /* servidor ainda não gravou: tenta de novo depois */
  }
}
let sessionId: string | undefined
async function sid($: EngineInterface): Promise<string> {
  sessionId ??= await $.session.id()
  return sessionId
}

// Traduz uma chamada de ferramenta em uma frase do que está sendo feito.
function describe(tool: string, input: Record<string, unknown>): string {
  const s = (k: string) => (typeof input[k] === 'string' ? (input[k] as string) : '')
  switch (tool) {
    case 'Read': return t('say.reading', { x: base(s('file_path')) })
    case 'Write': return t('say.writing', { x: base(s('file_path')) })
    case 'Edit': return t('say.editing', { x: base(s('file_path')) })
    case 'Glob': return t('say.glob', { x: s('pattern') })
    case 'Grep': return t('say.grep', { x: cut(s('pattern'), 40) })
    case 'Bash':
    case 'PowerShell': return s('description') || t('say.running', { x: cut(s('command'), 60) })
    case 'WebSearch': return t('say.search', { x: cut(s('query'), 60) })
    case 'WebFetch': return t('say.fetch', { x: cut(s('url'), 60) })
    case 'Agent': return t('say.agent', { who: s('subagent_type') || 'agent', x: cut(s('description'), 50) })
    case 'Skill': {
      const sk = s('skill')
      const [pkg, name] = sk.includes(':') ? sk.split(':') : ['', sk]
      return pkg === 'superpowers' ? `🦸 Superpowers: ${name}` : t('say.skill', { x: name || sk })
    }
    default: {
      const name = tool.replace(/^mcp__(plugin_)?/, '')
      const last = name.split('__').pop() ?? name
      if (/context-mode/.test(name)) return t('say.ctx', { x: last })
      if (/serena|codebase-memory/.test(name)) return t('say.map', { x: last })
      if (/claude-mem/.test(name)) return t('say.mem', { x: last })
      if (/headroom/.test(name)) return t('say.headroom', { x: last })
      return t('say.tool', { x: last })
    }
  }
}

// ---------- modo, caveman ----------
async function readMode($: EngineInterface): Promise<Mode> {
  try {
    const m = JSON.parse(await $.fs.read(`${(await getPaths($)).data}/mode.json`)).mode
    return isMode(m) ? m : 'equilibrado'
  } catch {
    return 'equilibrado'
  }
}
// caveman: ultracave como padrão só no ULTRA (vale da próxima sessão em diante;
// nesta sessão o mod injeta as regras direto no prompt).
let cavemanApplied: string | undefined
async function applyCaveman($: EngineInterface, mode: Mode): Promise<void> {
  const want = mode === 'ultra' ? 'ultracave' : 'off'
  if (cavemanApplied === want) return
  try {
    await $.fs.write((await getPaths($)).caveman, JSON.stringify({ defaultMode: want }, null, 2))
    cavemanApplied = want
  } catch {
    quiet()
  }
}
let ultracaveText: string | undefined
async function ultracaveRules($: EngineInterface): Promise<string> {
  if (ultracaveText !== undefined) return ultracaveText || ULTRA_AGENT_RULES
  ultracaveText = ''
  try {
    const dir = `${(await getPaths($)).claude}/plugins/cache/caveman/caveman`
    const versions = (await $.fs.list(dir)).map(e => e.name).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    const latest = versions[versions.length - 1]
    if (latest) {
      ultracaveText = (await $.fs.read(`${dir}/${latest}/skills/ultracave/SKILL.md`))
        .replace(/^---[\s\S]*?---\s*/, '')
        .replace(/## Persistence[\s\S]*?(?=## Floor)/, '')
    }
  } catch {
    ultracaveText = ''
  }
  return ultracaveText || ULTRA_AGENT_RULES
}

// ---------- página: instalar arquivos e ligar o servidor (sem janela) ----------
async function installWeb($: EngineInterface): Promise<void> {
  const { data } = await getPaths($)
  for (const name of WEB_FILES) {
    try {
      const src = await $.fs.read(`${slash($.plugin.root)}/web/${name}`)
      let cur = ''
      try {
        cur = await $.fs.read(`${data}/${name}`)
      } catch {
        cur = ''
      }
      if (cur !== src) await $.fs.write(`${data}/${name}`, src)
    } catch {
      quiet()
    }
  }
}
async function startServer($: EngineInterface): Promise<void> {
  const { data, windows } = await getPaths($)
  try {
    // wscript é um programa de janela (sem console) e roda o node escondido.
    // Se o servidor já estiver no ar, o novo sai sozinho (porta em uso).
    if (windows) await $.process.run(['wscript.exe', '//B', '//NoLogo', `${data}/start-hidden.vbs`], { timeoutMs: 8000 })
    else await $.process.run(['sh', '-c', `nohup node "${data}/server.mjs" ${PORT} >/dev/null 2>&1 &`], { timeoutMs: 8000 })
  } catch {
    quiet()
  }
}

// Grava o escritório deste chat para a página (instantâneo, sem custo).
async function sync($: EngineInterface): Promise<void> {
  try {
    await loadLang($)
    const mode = await readMode($)
    await applyCaveman($, mode)
    const state = {
      workers: await read($, workers),
      ceo: await read($, ceo),
      pedido: await read($, pedido),
      mode,
      at: Date.now(),
    }
    await $.fs.write(`${(await getPaths($)).data}/sessions/${await sid($)}.json`, JSON.stringify(state))
  } catch {
    quiet()
  }
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const started = await next(e)
    await loadLang($)
    await $.command.register({ name: 'tokenville', description: t('cmd.desc') })
    await installWeb($)
    void startServer($)
    // Chat já em andamento: pega o último pedido para o quadro branco.
    try {
      if (!(await read($, pedido))) {
        const msgs = await $.session.messages()
        const lastUser = [...msgs].reverse().find(m => m.role === 'user' && m.text.trim() && !isNoise(m.text))
        if (lastUser) await update($, pedido, () => cut(lastUser.text, 160))
      }
    } catch {
      quiet()
    }
    await sync($)
    void $.ui.open({ id: PANE, title: BRAND, placement: 'widget' })
    return started
  })

  on('command.run', { command: 'tokenville' }, async $ => {
    await installWeb($)
    await startServer($)
    await sync($)
    await $.ui.open({ id: PANE, title: BRAND })
    return { text: t('cmd.done', { url: `${URL}?s=${await sid($)}` }) }
  })

  // Um subagente foi chamado: escolhe o nível de potência, ele acorda e o Claude vai até ele.
  on('agent.spawn', async ($, e, next) => {
    const type = e.subagentType || 'general-purpose'
    let power: ReturnType<typeof pickLevel> | undefined
    let mode: Mode = 'equilibrado'
    // Retomadas e teammates mantêm o modelo que já têm.
    if (!e.resume && !e.isTeammate) {
      try {
        await loadLang($)
        mode = await readMode($)
        power = pickLevel(type, e.description ?? '', e.prompt ?? '', mode)
      } catch {
        power = undefined
      }
    }
    const rules = mode === 'ultra' ? ULTRA_AGENT_RULES : mode === 'economico' ? ECO_RULES : ''
    const rewritten = power ? { ...e, model: MODEL[power.level], ...(rules ? { prompt: `${rules}\n\n${e.prompt}` } : {}) } : e
    const res = await next(rewritten)
    if (!('agentId' in res) || !res.agentId) return res
    try {
      const task = cut(e.description ?? '', 100)
      const list = await read($, workers)
      const parent = e.parentAgentId ? list.find(w => w.id === e.parentAgentId) : undefined
      const w: Worker = {
        id: res.agentId,
        type,
        task,
        action: parent ? t('say.askedBy', { who: parent.type, x: task }) : t('say.waking'),
        isAwake: true,
        startedAt: Date.now(),
        ...(parent ? { parentType: parent.type } : {}),
        ...(power ? { level: power.level, reason: power.reason } : {}),
      }
      await update($, workers, l => [...l.filter(x => x.id !== w.id).map(x => ({ ...x, justDone: false })), w].slice(-60))
      if (!parent) {
        await update($, ceo, c => ({ from: c.at, at: type, movedAt: Date.now(), say: t('say.call', { who: type, x: task || t('say.needYou') }) }))
      }
      await sync($)
    } catch {
      quiet()
    }
    return res
  })

  // Esforço por nível nos subagentes; no ULTRA, o chefe (este chat) também no baixo.
  on('turn.step', async function* ($, e, next) {
    let effort: 'low' | 'medium' | 'high' | undefined
    try {
      if (!e.agentId) {
        if ((await readMode($)) === 'ultra') effort = 'low'
      } else {
        const w = (await read($, workers)).find(x => x.id === e.agentId)
        if (w?.level) effort = EFFORT[w.level]
      }
    } catch {
      effort = undefined
    }
    return yield* next(effort ? { ...e, effort } : e)
  })

  // Regras de economia nas instruções deste chat, na hora.
  on('prompt.compose', async ($, e, next) => {
    const res = await next(e)
    try {
      const mode = await readMode($)
      if (mode === 'economico') {
        return { ...res, sections: [...res.sections, { id: 'tokenville:saver', text: `# SAVER MODE (Tokenville)\n${ECO_RULES}`, scope: 'session' as const }] }
      }
      if (mode !== 'ultra') return res
      const text = `${ULTRA_LEAD_RULES}\n\n${await ultracaveRules($)}`
      return { ...res, sections: [...res.sections, { id: 'tokenville:ultra', text, scope: 'session' as const }] }
    } catch {
      return res
    }
  })

  // Cada ferramenta vira a fala de quem a usa (agente ou o próprio Claude).
  on('tool.call', async ($, e, next) => {
    try {
      await loadLang($)
      const text = describe(e.tool, ((e as { input?: unknown }).input ?? {}) as Record<string, unknown>)
      if (e.agentId) {
        const id = e.agentId
        await update($, workers, list => list.map(w => (w.id === id ? { ...w, action: text } : w)))
      } else if (e.tool !== 'Agent') {
        await update($, ceo, c => ({ ...c, say: text }))
      }
      await sync($)
    } catch {
      quiet()
    }
    return next(e)
  })

  on('turn.complete', async ($, e, next) => {
    const res = await next(e)
    try {
      if (e.agentId) {
        const id = e.agentId
        const answer = (res.text || e.answer || '').trim()
        const last = e.isAborted ? t('say.interrupted') : t('say.finished', { x: cut(answer, 140) })
        const list = await update($, workers, l =>
          l.map(w => (w.id === id ? { ...w, isAwake: false, justDone: true, action: last } : w)),
        )
        const done = list.find(w => w.id === id)
        if (!list.some(w => w.isAwake)) {
          await update($, ceo, c => ({ from: c.at, at: '', movedAt: Date.now(), say: done ? t('say.thanks', { who: done.type }) : t('say.goodJob') }))
        }
      } else {
        await update($, ceo, c => ({ ...c, say: e.isAborted ? t('say.stopped') : t('say.answered') }))
      }
      await sync($)
    } catch {
      quiet()
    }
    return res
  })

  // O pedido do usuário neste chat vai para o quadro branco.
  on('prompt.submit', async ($, e, next) => {
    try {
      const text = e.text.trim()
      if (!e.isMeta && !e.command && text && !isNoise(text)) {
        await update($, pedido, () => cut(text, 160))
        await update($, ceo, c => ({ ...c, say: t('say.newRequest') }))
        await sync($)
      }
    } catch {
      quiet()
    }
    return next(e)
  })

  // O painel do app é só um atalho: o escritório mora na página em tela cheia.
  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Text, Link } = $.ui.resolve(e)
    await loadLang($)
    const list: Worker[] = await read($, workers)
    const boss: Ceo = await read($, ceo)
    const awake = new Set(list.filter(w => w.isAwake).map(w => w.type)).size
    const mode = modeLabel(await readMode($))
    const busy = list.filter(w => w.isAwake && w.level).map(w => `${w.type} (${levelLabel(w.level!)})`)
    const status = `${awake > 0 ? t('pane.working', { n: awake }) : t('pane.sleeping')} · ${t('pane.mode', { mode })}`
    const href = `${URL}?s=${await sid($)}`
    if (e.props.placement === 'widget') {
      return (
        <Box flexDirection="column">
          <Text bold>🏙️ {BRAND} · {status}</Text>
          <Link href={href} label={t('pane.open')} />
        </Box>
      )
    }
    return (
      <Box flexDirection="column" gap={1} padding={1}>
        <Text bold>🏙️ {BRAND} · {status}</Text>
        <Text dimColor>👑 Claude: {cut(boss.say || t('pane.idle'), 120)}</Text>
        {busy.length ? <Text>⚡ {busy.join(' · ')}</Text> : null}
        <Link href={href} label={t('pane.openLong')} />
        <Text dimColor>{t('pane.hint')}</Text>
      </Box>
    )
  })
}
