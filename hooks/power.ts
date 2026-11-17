// Nível de potência de cada agente: escolhido sozinho pela função do agente e
// pela tarefa, e limitado pelo modo escolhido no canto da página.
import { t } from './i18n'

export type Level = 'baixo' | 'medio' | 'alto'
export type Mode = 'ultra' | 'economico' | 'equilibrado' | 'maximo'

export const MODE_LIST: Mode[] = ['ultra', 'economico', 'equilibrado', 'maximo']
const ALLOWED: Record<Mode, Level[]> = {
  ultra: ['baixo'],
  economico: ['baixo', 'medio'],
  equilibrado: ['baixo', 'medio', 'alto'],
  maximo: ['medio', 'alto'],
}
export const modeLabel = (m: Mode) => t(`mode.${m}`)
export const modeHint = (m: Mode) => t(`mode.${m}.hint`)
export const modeShort = (m: Mode) => t(`mode.${m}.short`)
export const levelLabel = (l: Level) => t(`lv.${l}`)
export const isMode = (m: unknown): m is Mode => m === 'ultra' || m === 'economico' || m === 'equilibrado' || m === 'maximo'

// O que cada nível usa de verdade.
export const MODEL: Record<Level, string> = { baixo: 'haiku', medio: 'sonnet', alto: 'opus' }
export const EFFORT: Record<Level, 'low' | 'medium' | 'high'> = { baixo: 'low', medio: 'medium', alto: 'high' }

const ORDER: Level[] = ['baixo', 'medio', 'alto']

// Ponto de partida pela função: quem decide arquitetura/segurança pensa mais.
const BASE: Record<string, Level> = {
  planejador: 'alto',
  'backend-architect': 'alto',
  'database-architect': 'alto',
  'security-auditor': 'alto',
  'code-reviewer': 'alto',
  'ai-engineer': 'alto',
  'typescript-pro': 'medio',
  'javascript-pro': 'medio',
  'python-pro': 'medio',
  'frontend-developer': 'medio',
  'sql-pro': 'medio',
  'prompt-engineer': 'medio',
  'ui-ux-designer': 'medio',
  'test-automator': 'medio',
  'performance-engineer': 'medio',
  debugger: 'medio',
  'error-detective': 'medio',
  'search-specialist': 'baixo',
  'docs-architect': 'baixo',
  'deployment-engineer': 'baixo',
  Explore: 'baixo',
  'general-purpose': 'medio',
}

// Palavras de tarefa difícil / simples em pt, en e es.
const HARD = /arquitet|architect|complex|seguran|security|segurid|vulnerab|refator|refactor|migra|concorr|concurren|race|crític|critic|produç|producao|production|producci|escal|scal|otimiz|optimi|algoritm|algorithm|plano|plan |planej|planific|debug|investig|causa raiz|root cause|causa raíz/i
const EASY = /simples|simple|rápid|rapid|quick|listar|list |renome|rename|resum|summar|buscar|procurar|achar|find |search|ler |leia|read |formatar|format|typo|coment|comment|docstring|traduz|translat|traduc|pequen|small|trivial/i

export function pickLevel(type: string, task: string, prompt: string, mode: Mode): { level: Level; reason: string } {
  let i = ORDER.indexOf(BASE[type] ?? 'medio')
  const why: string[] = [t('why.role', { level: levelLabel(ORDER[i]!).toLowerCase() })]
  const text = `${task} ${prompt}`
  if (HARD.test(text)) { i++; why.push(t('why.hard')) }
  else if (EASY.test(text)) { i--; why.push(t('why.easy')) }
  if (prompt.length > 2500) { i++; why.push(t('why.long')) }
  i = Math.max(0, Math.min(2, i))
  let level = ORDER[i]!
  const allowed = ALLOWED[mode]
  if (!allowed.includes(level)) {
    const top = allowed[allowed.length - 1]!
    level = i > ORDER.indexOf(top) ? top : allowed[0]!
    why.push(t('why.mode', { mode: modeLabel(mode) }))
  }
  return { level, reason: why.join(' · ') }
}

// Instruções para o modelo: em inglês (neutro e mais curto); as respostas ao
// usuário continuam no idioma dele.
export const ECO_RULES =
  'SAVER MODE: be direct, never repeat what was already said. Grep before Read, read only the needed ranges. ' +
  'Large outputs go through context-mode (ctx_*); navigate code with Serena or codebase-memory; ' +
  'check claude-mem memory before re-exploring a project. Reply in the user\'s language.'

export const ULTRA_AGENT_RULES =
  'ULTRA SAVER MODE: answer in ultracave style — fragments, each fact once, no preamble, no summary. ' +
  'Never cut code, commands, paths, literal errors, numbers. Read only the file ranges you need ' +
  '(offset/limit, Grep before Read); for code prefer Serena/codebase-memory (symbols) over reading whole files; ' +
  'large outputs through context-mode (ctx_*); check claude-mem memory before re-exploring. Reply in the user\'s language.'

export const ULTRA_LEAD_RULES =
  '# ULTRA SAVER MODE (Tokenville)\n' +
  'The user turned on ULTRA SAVER. Spend as few tokens as possible without losing correctness: read only ranges (Grep before Read, offset/limit), ' +
  'large outputs through context-mode (ctx_*), navigate code with Serena/codebase-memory, check claude-mem memory before re-exploring, ' +
  'use headroom_compress for large pasted content, never re-read what is already in context, delegate to subagents only when it saves tokens. ' +
  'Reply in the user\'s language.'
