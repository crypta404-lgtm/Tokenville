// Tokenville — o escritório em pixel art (SVG, sem script).
// Personagens chibi 16×24 com contorno e sombra; salas com paredes em 3D,
// piso de tábuas, luz de janela, móveis com sombra; balões que não se
// atropelam (o de menor prioridade vira uma ❗ vermelha); zoom ao clicar
// (CSS :focus); quadro branco com o pedido atual do chat.

import type { Ceo, Worker } from '../types'
import { roleOf, t } from './i18n'
import { EFFORT, MODEL, levelLabel } from './power'
import type { Level } from './power'

const P = 2 // tamanho de cada pixel do sprite na cena
const SW = 16 * P
const SH = 24 * P
const OUT = '#2a1d2e'
const FONT = `'Pixelify Sans', 'Silkscreen', ui-monospace, monospace`
export const LEVEL_COLOR: Record<Level, string> = { baixo: '#6ee7a0', medio: '#ffd166', alto: '#ff7b6b' }

// ---------- layout ----------
type Kind = 'plan' | 'dev' | 'qa' | 'sup'
type SeatKind = 'desk' | 'table' | 'stand'
export type Seat = { x: number; y: number; kind: SeatKind }

const ROOM_W = 400
const WALL = 48
const ROOM_H: Record<Kind, number> = { plan: 206, dev: 270, qa: 178, sup: 270 }
const ROOM_SEATS: Record<Kind, [string, number, number][]> = {
  plan: [['planejador', 52, 66], ['backend-architect', 140, 66], ['database-architect', 228, 66], ['ui-ux-designer', 316, 66]],
  dev: [
    ['typescript-pro', 28, 80], ['javascript-pro', 122, 80], ['python-pro', 216, 80], ['frontend-developer', 310, 80],
    ['sql-pro', 74, 182], ['ai-engineer', 168, 182], ['prompt-engineer', 262, 182],
  ],
  qa: [['code-reviewer', 28, 82], ['test-automator', 122, 82], ['security-auditor', 216, 82], ['performance-engineer', 310, 82]],
  sup: [['debugger', 28, 80], ['error-detective', 122, 80], ['search-specialist', 216, 80], ['deployment-engineer', 52, 182], ['docs-architect', 146, 182]],
}
export const KNOWN = new Set(Object.values(ROOM_SEATS).flat().map(s => s[0]))

export type Layout = {
  W: number
  H: number
  rooms: { kind: Kind; ox: number; oy: number }[]
  seats: Record<string, Seat>
  ceoHome: { x: number; y: number }
}

export function layout(wide: boolean, extras: string[]): Layout {
  const G = 10
  const rooms: Layout['rooms'] = wide
    ? [
        { kind: 'plan', ox: G, oy: G },
        { kind: 'dev', ox: G, oy: G + ROOM_H.plan + G },
        { kind: 'qa', ox: G + ROOM_W + G, oy: G },
        { kind: 'sup', ox: G + ROOM_W + G, oy: G + ROOM_H.qa + G },
      ]
    : (['plan', 'dev', 'qa', 'sup'] as Kind[]).reduce<Layout['rooms']>((acc, kind) => {
        const prev = acc[acc.length - 1]
        acc.push({ kind, ox: G, oy: prev ? prev.oy + ROOM_H[prev.kind] + G : G })
        return acc
      }, [])
  const W = wide ? G * 3 + ROOM_W * 2 : ROOM_W + G * 2
  const H = Math.max(...rooms.map(r => r.oy + ROOM_H[r.kind])) + G
  const seats: Record<string, Seat> = {}
  for (const r of rooms)
    for (const [name, x, y] of ROOM_SEATS[r.kind])
      seats[name] = { x: r.ox + x, y: r.oy + y, kind: r.kind === 'plan' ? 'table' : 'desk' }
  const plan = rooms[0]!
  extras.forEach((tp, i) => {
    seats[tp] = { x: plan.ox + 20 + (i % 9) * 40, y: plan.oy + 150, kind: 'stand' }
  })
  return { W, H, rooms, seats, ceoHome: { x: plan.ox + 184, y: plan.oy + 44 } }
}

// ---------- cores ----------
function hash(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619)
  return h >>> 0
}
function shade(hex: string, f: number): string {
  const n = parseInt(hex.slice(1), 16)
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v * f)))
  return '#' + ((1 << 24) | (c((n >> 16) & 255) << 16) | (c((n >> 8) & 255) << 8) | c(n & 255)).toString(16).slice(1)
}
const r = (x: number, y: number, w: number, h: number, fill: string, extra = '') =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"${extra}/>`
const box = (x: number, y: number, w: number, h: number, fill: string, stroke = OUT) =>
  r(x, y, w, h, fill, ` stroke="${stroke}" stroke-width="1.5"`)
export const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const txt = (x: number, y: number, s: string, size: number, fill: string, extra = '') =>
  `<text x="${x}" y="${y}" font-size="${size}" font-family="${FONT}" fill="${fill}"${extra}>${esc(s)}</text>`

// ---------- personagens ----------
const HAIR = ['#3b2a20', '#6b3e1f', '#e8c15a', '#c4562f', '#1f1b2d', '#a9a9b8', '#6a4ba0', '#efe3c8', '#8a5a32', '#2f5aa0', '#d9709f', '#2c7a6b']
const SKIN = ['#ffe0c2', '#f6c9a0', '#e3a878', '#c68642', '#8d5524', '#ffd7b0']
const SHIRT = ['#4f7cff', '#36b37e', '#ff6b6b', '#ffb84d', '#9b6cff', '#22b8c8', '#ff7fbf', '#7a8b99', '#e04848', '#3a4fa8', '#8fd14f', '#f2f2ee', '#2f3542']
const PANTS = ['#2c3e66', '#3b3b46', '#5c4033', '#22313f', '#4b3b6b', '#3d5a4a']

type Look = { pal: Record<string, string>; hair: number; glasses: boolean; beard: boolean; stripes: boolean }
function pal(hair: string, skin: string, shirt: string, pants: string): Record<string, string> {
  return {
    H: hair, h: shade(hair, 0.72), L: shade(hair, 1.35), S: skin, s: shade(skin, 0.86), X: shade(skin, 0.9),
    B: shirt, b: shade(shirt, 0.78), W: shade(shirt, 1.45), P: pants, C: shade(shirt, 0.92),
  }
}
const BOSS: Look = { pal: pal('#4a2f1e', '#ffe0c2', '#d97757', '#3b2a20'), hair: 0, glasses: false, beard: false, stripes: false }
function look(type: string): Look {
  if (type === 'claude') return BOSS
  const h = hash(type)
  return {
    pal: pal(HAIR[h % HAIR.length]!, SKIN[(h >>> 4) % SKIN.length]!, SHIRT[(h >>> 8) % SHIRT.length]!, PANTS[(h >>> 12) % PANTS.length]!),
    hair: (h >>> 16) % 6,
    glasses: ((h >>> 19) & 3) === 0,
    beard: ((h >>> 21) & 7) === 0,
    stripes: ((h >>> 24) & 3) === 0,
  }
}
// pixels fixos (não mudam por personagem)
const FIXED: Record<string, string> = { O: OUT, E: '#1d1424', M: '#b5544f', K: '#2a2230', G: '#3a3346' }

// 16×24: O contorno, H/h/L cabelo, S/s pele, X bochecha, E olho, M boca,
// B/b/W camisa, P calça, K sapato, C boné, G acessório escuro.
const BASE = [
  '................',
  '....OOOOOOOO....',
  '...OHHHHHHHHO...',
  '..OHHLLHHHHHHO..',
  '..OHHHHHHHHHHO..',
  '.OHHHHHHHHHHHhO.',
  '.OHhSSSSSSSShHO.',
  '.OHSSSSSSSSSSHO.',
  '.OSSESSSSSSESSO.',
  '.OSSESSSSSSESSO.',
  '.OSXSSSSSSSSXSO.',
  '..OSSSSMMSSSSO..',
  '...OsSSSSSSsO...',
  '....OOssssOO....',
  '...OBBWWWWBBO...',
  '..OBBBBBBBBBBO..',
  '.OBbBBBBBBBBbBO.',
  '.OSbBBBBBBBBbSO.',
  '.OOOBBBBBBBBOOO.',
  '...OPPPPPPPPO...',
  '...OPPPOOPPPO...',
  '...OPPPOOPPPO...',
  '...OKKKOOKKKO...',
  '....OOO..OOO....',
]

function grid(l: Look): string[][] {
  const g = BASE.map(row => row.split(''))
  const set = (y: number, x: number, c: string) => { g[y]![x] = c }
  switch (l.hair) {
    case 1: // cabelo comprido
      for (let y = 6; y <= 12; y++) { set(y, 2, 'H'); set(y, 13, 'h') }
      for (let y = 11; y <= 13; y++) { set(y, 1, 'O'); set(y, 14, 'O'); set(y, 2, 'H'); set(y, 13, 'h') }
      break
    case 2: // coque
      for (let x = 6; x <= 9; x++) { set(0, x, 'O'); set(1, x, 'H') }
      set(1, 7, 'L')
      break
    case 3: // espetado
      for (const x of [4, 7, 10]) { set(0, x, 'O'); set(1, x, 'H') }
      break
    case 4: // boné
      for (let y = 1; y <= 4; y++) for (let x = 3; x <= 12; x++) if (!'O.'.includes(g[y]![x]!)) set(y, x, 'C')
      g[5] = '.OCCCCCCCCCCCCCO'.split('')
      set(3, 5, 'W')
      break
    case 5: // fone de ouvido
      for (let x = 3; x <= 12; x++) if (g[2]![x] !== 'O') set(2, x, 'G')
      for (let y = 7; y <= 9; y++) { set(y, 1, 'G'); set(y, 14, 'G'); set(y, 0, 'O'); set(y, 15, 'O') }
      break
  }
  if (l.glasses) {
    for (const x of [3, 5, 10, 12]) set(8, x, 'G')
    for (let x = 3; x <= 5; x++) set(7, x, 'G')
    for (let x = 10; x <= 12; x++) set(7, x, 'G')
  }
  if (l.beard) {
    for (let x = 3; x <= 12; x++) set(10, x, 'h')
    for (let x = 3; x <= 12; x++) if (x !== 7 && x !== 8) set(11, x, 'h')
    for (let x = 4; x <= 11; x++) set(12, x, 'h')
  }
  if (l.stripes) for (const y of [16, 18]) for (let x = 0; x < 16; x++) if (g[y]![x] === 'B') set(y, x, 'W')
  return g
}

const shapeId = (l: Look) => `v${l.hair}${l.glasses ? 1 : 0}${l.beard ? 1 : 0}${l.stripes ? 1 : 0}`
function shapeSymbol(l: Look): string {
  const paths: Record<string, string> = {}
  grid(l).forEach((row, y) => {
    let x = 0
    while (x < row.length) {
      const c = row[x]!
      if (c === '.') { x++; continue }
      let n = 1
      while (row[x + n] === c) n++
      paths[c] = (paths[c] ?? '') + `M${x} ${y}h${n}v1h-${n}z`
      x += n
    }
  })
  let out = `<symbol id="${shapeId(l)}" viewBox="0 0 16 24">`
  for (const c of Object.keys(paths))
    out += FIXED[c] ? `<path d="${paths[c]}" fill="${FIXED[c]}"/>` : `<path d="${paths[c]}" style="fill:var(--${c})"/>`
  return out + '</symbol>'
}
const vars = (l: Look) => Object.entries(l.pal).map(([k, v]) => `--${k}:${v}`).join(';')
function symbols(types: string[]): string {
  const seen = new Map<string, string>()
  for (const tp of types) {
    const l = look(tp)
    if (!seen.has(shapeId(l))) seen.set(shapeId(l), shapeSymbol(l))
  }
  return [...seen.values()].join('')
}

// Personagem com pose: acordado balança e pisca; dormindo fecha os olhos e cochila.
function person(type: string, x: number, y: number, awake: boolean, scale = P, still = false): string {
  const s = scale
  const l = look(type)
  const dy = awake ? 0 : s
  const ey = y + dy + 8 * s
  const e1 = x + 4 * s, e2 = x + 11 * s
  const skin = l.pal.S!
  const eyes = awake
    ? `<g opacity="0">${r(e1, ey, s, 2 * s, skin)}${r(e2, ey, s, 2 * s, skin)}` +
      `<animate attributeName="opacity" values="0;0;1;0" keyTimes="0;0.92;0.96;1" dur="${3 + (hash(type) % 7) / 3}s" repeatCount="indefinite"/></g>`
    : `${r(e1 - s, ey, 3 * s, 2 * s, skin)}${r(e2 - s, ey, 3 * s, 2 * s, skin)}${r(e1 - s, ey + s, 3 * s, s / 2 + 0.5, '#1d1424')}${r(e2 - s, ey + s, 3 * s, s / 2 + 0.5, '#1d1424')}`
  const motion = still
    ? ''
    : awake
      ? `<animateTransform attributeName="transform" type="translate" values="0 0;0 -1;0 0" dur="0.7s" repeatCount="indefinite"/>`
      : `<animateTransform attributeName="transform" type="translate" values="0 0;0 1;0 0" dur="3s" repeatCount="indefinite"/>`
  return `<g>${motion}<use href="#${shapeId(l)}" x="${x}" y="${y + dy}" width="${16 * s}" height="${24 * s}" style="${vars(l)}"/>${eyes}</g>`
}

// ---------- defs: padrões, móveis, zzz ----------
const PATTERNS =
  `<pattern id="p-wood" width="64" height="12" patternUnits="userSpaceOnUse">${r(0, 0, 64, 12, '#d9b483')}${r(0, 0, 64, 1, '#e6c494')}${r(0, 11, 64, 1, '#b8915f')}${r(20, 0, 1, 12, '#c09a68')}${r(52, 0, 1, 12, '#c09a68')}${r(4, 5, 10, 1, '#d0aa78')}${r(30, 7, 14, 1, '#d0aa78')}</pattern>` +
  `<pattern id="p-wood2" width="64" height="24" patternUnits="userSpaceOnUse"><rect width="64" height="24" fill="url(#p-wood)"/>${r(0, 12, 64, 12, '#00000006')}${r(40, 12, 1, 12, '#c09a68')}</pattern>` +
  `<pattern id="p-carpet" width="8" height="8" patternUnits="userSpaceOnUse">${r(0, 0, 8, 8, '#55617e')}${r(0, 0, 1, 1, '#5f6c8b')}${r(4, 4, 1, 1, '#5f6c8b')}</pattern>` +
  `<pattern id="p-tile" width="24" height="24" patternUnits="userSpaceOnUse">${r(0, 0, 24, 24, '#d7dfe2')}${r(0, 0, 24, 1, '#c2cdd1')}${r(0, 0, 1, 24, '#c2cdd1')}${r(2, 2, 6, 1, '#e4eaec')}</pattern>` +
  `<pattern id="p-check" width="32" height="32" patternUnits="userSpaceOnUse">${r(0, 0, 32, 32, '#efe4cf')}${r(0, 0, 16, 16, '#e3d4b8')}${r(16, 16, 16, 16, '#e3d4b8')}</pattern>` +
  `<pattern id="p-rug" width="12" height="12" patternUnits="userSpaceOnUse">${r(0, 0, 12, 12, '#a3534a')}${r(0, 0, 6, 6, '#b1625a')}${r(6, 6, 6, 6, '#b1625a')}</pattern>`

const ZZZ = [0, 1, 2]
  .map(v =>
    `<g id="zz${v}">` +
    [0, 1, 2]
      .map(i => {
        const b = (i * 0.8 + v * 0.45).toFixed(2)
        return `<text x="${24 + i * 6}" y="0" font-size="${8 + i * 3}" font-family="${FONT}" font-weight="700" fill="#eef2ff" stroke="#3a3560" stroke-width="2" paint-order="stroke" opacity="0">z` +
          `<animate attributeName="opacity" values="0;1;0" dur="3s" begin="${b}s" repeatCount="indefinite"/>` +
          `<animateTransform attributeName="transform" type="translate" values="0 0;6 -14" dur="3s" begin="${b}s" repeatCount="indefinite"/></text>`
      })
      .join('') +
    `</g>`,
  )
  .join('')

// Peças desenhadas uma vez (na origem do assento) e reusadas com <use>.
const FURNITURE =
  `<g id="chair">${r(4, 34, 24, 4, '#00000022')}${box(5, 16, 22, 22, '#3f7f78')}${r(7, 18, 18, 3, '#58a199')}${r(7, 30, 18, 6, '#356b65')}</g>` +
  `<g id="desk">` +
  r(-14, 60, 62, 4, '#00000026') +
  box(-12, 38, 58, 7, '#d6a76f') + r(-11, 39, 56, 2, '#e7bd88') +
  box(-12, 45, 58, 16, '#a06d42') + r(-11, 58, 56, 2, '#875a35') +
  box(-8, 48, 22, 9, '#b07b4d') + r(1, 52, 4, 1.5, '#ecc996') + box(22, 48, 22, 9, '#b07b4d') + r(31, 52, 4, 1.5, '#ecc996') +
  box(27, 12, 21, 18, '#2e3245') + r(29, 14, 17, 13, '#1b2233') + r(34, 30, 7, 6, '#4b5066') + box(31, 35, 13, 3, '#5a5f78') +
  box(3, 36, 20, 4, '#e9edf1') + r(5, 37, 16, 1, '#c4ccd4') +
  `</g>` +
  `<g id="screen">${r(29, 14, 17, 13, '#7fd8ff')}${r(31, 16, 9, 1.5, '#2c7aa8')}${r(31, 19, 12, 1.5, '#2c7aa8')}${r(31, 22, 7, 1.5, '#2c7aa8')}` +
  `<rect x="29" y="14" width="17" height="1.5" fill="#ffffff" opacity="0.7"><animate attributeName="y" values="14;26" dur="1.6s" repeatCount="indefinite"/></rect></g>` +
  `<g id="plant">${r(0, 30, 20, 4, '#00000025')}${box(3, 18, 14, 13, '#c0703f')}${r(3, 18, 14, 3, '#d98a52')}` +
  `${box(8, 4, 4, 15, '#2f8f46')}${box(0, 8, 9, 6, '#3fae5a')}${box(11, 6, 9, 6, '#3fae5a')}${box(4, -1, 12, 6, '#5cc777')}${r(2, 9, 3, 1, '#8be3a0')}${r(14, 7, 3, 1, '#8be3a0')}${r(7, 0, 4, 1, '#8be3a0')}</g>` +
  `<g id="shelf">${box(0, 0, 46, 36, '#7a4e2b')}${r(3, 3, 40, 13, '#4a2f19')}${r(3, 20, 40, 13, '#4a2f19')}${r(0, 16, 46, 4, '#8f5d35')}` +
  [0, 1, 2, 3, 4, 5, 6, 7, 8]
    .map(i => {
      const c = ['#e04848', '#4f7cff', '#36b37e', '#ffb84d', '#9b6cff', '#22b8c8', '#f2f2ee', '#ff7fbf', '#8fd14f'][i]!
      return r(4 + i * 4.3, 5 + (i % 3), 3.6, 11 - (i % 3), c) + r(4 + i * 4.3, 22 + ((i + 1) % 2), 3.6, 11 - ((i + 1) % 2), shade(c, 0.85))
    })
    .join('') +
  `</g>` +
  `<g id="cabinet">${r(0, 40, 24, 3, '#00000025')}${box(0, 0, 24, 40, '#8e9aa6')}${box(3, 3, 18, 10, '#a3aeb9')}${box(3, 15, 18, 10, '#a3aeb9')}${box(3, 27, 18, 10, '#a3aeb9')}${r(10, 7, 4, 1.5, '#5d6874')}${r(10, 19, 4, 1.5, '#5d6874')}${r(10, 31, 4, 1.5, '#5d6874')}</g>`

function windowAt(x: number, y: number, w: number, h: number): string {
  return box(x - 2, y - 2, w + 4, h + 4, '#e8e2d6') + r(x, y, w, h, '#8fd0ff') + r(x, y, w, h / 2, '#b3e0ff') +
    `<g>${r(x + w - 30, y + 6, 14, 4, '#ffffff')}${r(x + w - 26, y + 4, 8, 3, '#ffffff')}<animateTransform attributeName="transform" type="translate" values="0 0;-${w - 34} 0;0 0" dur="50s" repeatCount="indefinite"/></g>` +
    r(x + w / 2 - 1, y, 2, h, '#e8e2d6') + r(x - 3, y + h + 2, w + 6, 3, '#d3cbbb')
}
function clock(x: number, y: number): string {
  return `<circle cx="${x}" cy="${y}" r="9" fill="#fbf8f1" stroke="${OUT}" stroke-width="2"/>` +
    `<rect x="${x - 0.75}" y="${y - 6}" width="1.5" height="6" fill="${OUT}"><animateTransform attributeName="transform" type="rotate" values="0 ${x} ${y};360 ${x} ${y}" dur="60s" repeatCount="indefinite"/></rect>` +
    r(x, y - 0.75, 4, 1.5, OUT)
}
function poster(x: number, y: number, a: string, b: string): string {
  return box(x, y, 22, 28, '#fbf8f1') + r(x + 3, y + 3, 16, 13, a) + `<circle cx="${x + 11}" cy="${y + 9}" r="4" fill="${b}"/>` + r(x + 4, y + 20, 14, 2, '#c4bcae') + r(x + 4, y + 24, 9, 2, '#c4bcae')
}
// luz da janela no chão
const light = (x: number, y: number, w: number, h: number) =>
  `<polygon points="${x},${y} ${x + w},${y} ${x + w + 26},${y + h} ${x + 26},${y + h}" fill="#fff6d8" opacity="0.13"/>`

// ---------- salas ----------
const ROOM_STYLE: Record<Kind, { wall: string; trim: string; floor: string; tag: string }> = {
  plan: { wall: '#8d7fb0', trim: '#6f6293', floor: 'url(#p-carpet)', tag: '#5b4d8a' },
  dev: { wall: '#e9dcc4', trim: '#c9b694', floor: 'url(#p-wood2)', tag: '#a8673a' },
  qa: { wall: '#9cc6b4', trim: '#78a593', floor: 'url(#p-tile)', tag: '#2f7a5f' },
  sup: { wall: '#e8b4a8', trim: '#c98f84', floor: 'url(#p-check)', tag: '#a5485f' },
}

function roomArt(kind: Kind, ox: number, oy: number, pedido: string): { back: string; front: string } {
  const h = ROOM_H[kind]
  const st = ROOM_STYLE[kind]
  let back =
    r(ox, oy, ROOM_W, h, st.floor) +
    r(ox, oy, ROOM_W, 6, '#3a3150') +
    r(ox, oy + 6, ROOM_W, WALL - 6, st.wall) +
    r(ox, oy + 30, ROOM_W, WALL - 30, st.trim) + r(ox, oy + 30, ROOM_W, 1.5, shade(st.trim, 1.15)) +
    r(ox, oy + WALL - 3, ROOM_W, 3, '#5a4434') +
    r(ox, oy + WALL, ROOM_W, 6, '#000000', ' opacity="0.12"') +
    r(ox, oy, 4, h, '#3a3150') + r(ox + ROOM_W - 4, oy, 4, h, '#3a3150')
  let front = ''
  const plaque = (label: string) => {
    const w = Math.max(48, label.length * 5.6 + 12)
    return box(ox + 8, oy + 10, w, 14, st.tag, '#1f1830') + txt(ox + 14, oy + 20.5, label, 8.5, '#fff', ' font-weight="700"')
  }
  if (kind === 'plan') {
    const lines = wrap(pedido || t('board.empty'), 34, 2)
    back +=
      light(ox + 300, oy + WALL, 60, 40) +
      box(ox + 112, oy + 7, 176, 34, '#fbfbf7') + r(ox + 114, oy + 37, 172, 2, '#d8d6cc') + r(ox + 200, oy + 41, 14, 3, '#b9b6aa') +
      txt(ox + 118, oy + 16, t('board.title'), 6.5, '#d97757', ' font-weight="700"') +
      lines.map((l, i) => txt(ox + 118, oy + 26 + i * 8.5, l, 7.5, '#2a3550')).join('') +
      r(ox + 268, oy + 35, 8, 2.5, '#e04848') + r(ox + 278, oy + 35, 5, 2.5, '#4f7cff') +
      `<use href="#shelf" x="${ox + 300}" y="${oy + 8}"/>` + `<use href="#shelf" x="${ox + 350}" y="${oy + 8}"/>` +
      r(ox + 30, oy + 92, 340, 66, 'url(#p-rug)', ' rx="3"') + r(ox + 34, oy + 96, 332, 58, 'none', ' stroke="#e8c39b" stroke-width="2" rx="2"') +
      `<use href="#plant" x="${ox + 10}" y="${oy + h - 40}"/>` + `<use href="#plant" x="${ox + ROOM_W - 32}" y="${oy + h - 40}"/>`
    front +=
      r(ox + 26, oy + 140, 348, 5, '#00000026') +
      box(ox + 26, oy + 104, 348, 10, '#d6a76f') + r(ox + 27, oy + 105, 346, 2.5, '#e7bd88') +
      box(ox + 26, oy + 114, 348, 26, '#a06d42') + r(ox + 27, oy + 136, 346, 3, '#875a35')
    back += plaque(t('room.plan'))
  } else if (kind === 'dev') {
    back +=
      windowAt(ox + 150, oy + 9, 104, 26) + light(ox + 150, oy + WALL, 104, 70) +
      poster(ox + 270, oy + 9, '#4f7cff', '#ffb84d') + poster(ox + 298, oy + 9, '#36b37e', '#fbf8f1') + clock(ox + 372, oy + 22) +
      `<use href="#shelf" x="${ox + 96}" y="${oy + 8}"/>` +
      `<use href="#plant" x="${ox + 10}" y="${oy + h - 40}"/>` + `<use href="#plant" x="${ox + ROOM_W - 32}" y="${oy + h - 40}"/>` +
      `<use href="#cabinet" x="${ox + 356}" y="${oy + 150}"/>`
    back += plaque(t('room.dev'))
  } else if (kind === 'qa') {
    back +=
      windowAt(ox + 120, oy + 9, 76, 26) + light(ox + 120, oy + WALL, 76, 60) +
      box(ox + 214, oy + 9, 62, 28, '#2e3245') + r(ox + 217, oy + 12, 56, 22, '#15281f') +
      `<polyline points="${ox + 219},${oy + 30} ${ox + 228},${oy + 22} ${ox + 238},${oy + 26} ${ox + 248},${oy + 16} ${ox + 258},${oy + 20} ${ox + 270},${oy + 13}" fill="none" stroke="#6ee7a0" stroke-width="1.5"/>` +
      `<use href="#shelf" x="${ox + 300}" y="${oy + 8}"/>` + `<use href="#shelf" x="${ox + 350}" y="${oy + 8}"/>` +
      `<use href="#plant" x="${ox + ROOM_W - 32}" y="${oy + h - 40}"/>`
    back += plaque(t('room.qa'))
  } else {
    back +=
      windowAt(ox + 120, oy + 9, 70, 26) + light(ox + 120, oy + WALL, 70, 60) + poster(ox + 206, oy + 9, '#ff7fbf', '#ffb84d') + clock(ox + 246, oy + 22) +
      r(ox + 296, oy + 82, 96, 4, '#00000026') +
      box(ox + 296, oy + 52, 96, 8, '#d6a76f') + r(ox + 297, oy + 53, 94, 2, '#e7bd88') + box(ox + 296, oy + 60, 96, 24, '#a06d42') +
      box(ox + 306, oy + 36, 18, 17, '#3a3f58') + r(ox + 310, oy + 40, 10, 5, '#e04848') + box(ox + 330, oy + 44, 8, 9, '#fbf8f1') +
      `<g>${r(ox + 314, oy + 30, 2, 5, '#ffffff', ' opacity="0.8"')}<animateTransform attributeName="transform" type="translate" values="0 0;2 -10" dur="1.6s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0" dur="1.6s" repeatCount="indefinite"/></g>` +
      box(ox + 350, oy + 36, 14, 17, '#bfe6ff') + r(ox + 353, oy + 30, 8, 7, '#8fd0ff') +
      r(ox + 362, oy + 176, 30, 4, '#00000026') + box(ox + 364, oy + 120, 26, 58, '#dfe4e9') + r(ox + 365, oy + 140, 24, 1.5, '#a3aeb9') + r(ox + 385, oy + 126, 2, 10, '#a3aeb9') + r(ox + 385, oy + 146, 2, 14, '#a3aeb9') +
      r(ox + 244, oy + 252, 100, 5, '#00000026') +
      box(ox + 244, oy + 222, 100, 16, '#5f86c6') + box(ox + 244, oy + 236, 100, 18, '#4c6fae') + box(ox + 238, oy + 228, 10, 26, '#5f86c6') + box(ox + 340, oy + 228, 10, 26, '#5f86c6') +
      `<ellipse cx="${ox + 294}" cy="${oy + 210}" rx="22" ry="8" fill="#d6a76f" stroke="${OUT}" stroke-width="1.5"/>` + box(ox + 285, oy + 205, 7, 5, '#fbf8f1') + box(ox + 297, oy + 206, 9, 4, '#ffb84d') +
      `<use href="#plant" x="${ox + 10}" y="${oy + h - 40}"/>`
    back += plaque(t('room.sup'))
  }
  back += r(ox, oy, ROOM_W, h, 'none', ` stroke="#1f1830" stroke-width="3"`)
  return { back, front }
}

// itens pessoais variados em cada mesa (por hash)
function deskItems(type: string, x: number, y: number): string {
  switch (hash(type + 'items') % 5) {
    case 0: return box(x - 8, y + 30, 7, 8, '#fbf8f1') + r(x - 1, y + 32, 2, 4, '#fbf8f1', ` stroke="${OUT}" stroke-width="1"`) + r(x - 7, y + 31, 5, 2, '#6b3e1f')
    case 1: return box(x - 9, y + 30, 8, 8, '#c0703f') + box(x - 8, y + 24, 6, 7, '#3fae5a')
    case 2: return box(x - 10, y + 33, 12, 5, '#fbf8f1') + r(x - 9, y + 31, 10, 2, '#e9e4d6')
    case 3: return box(x - 9, y + 22, 3, 16, '#3a3f58') + box(x - 10, y + 20, 10, 4, '#ffd166') + r(x - 9, y + 36, 8, 2, '#3a3f58')
    default: return box(x - 10, y + 32, 10, 6, '#4f7cff') + box(x - 9, y + 28, 9, 4, '#e04848')
  }
}

// ---------- texto ----------
export function wrap(text: string, width: number, maxLines: number): string[] {
  const words = text.replace(/\s+/g, ' ').trim().split(' ').filter(Boolean)
  const lines: string[] = []
  let cur = ''
  let cutOff = false
  for (const w of words) {
    const next = cur ? cur + ' ' + w : w
    if (next.length <= width) { cur = next; continue }
    if (cur) lines.push(cur)
    if (lines.length === maxLines) { cutOff = true; cur = ''; break }
    cur = w.length > width ? w.slice(0, width - 1) + '…' : w
  }
  if (cur && lines.length < maxLines) lines.push(cur)
  else if (cur) cutOff = true
  if (cutOff && lines.length) {
    const last = lines[lines.length - 1]!
    lines[lines.length - 1] = (last.length >= width ? last.slice(0, width - 1) : last) + '…'
  }
  return lines
}

// ---------- balões sem conflito ----------
type Rect = { x: number; y: number; w: number; h: number }
type Cand = { cx: number; headY: number; text: string; fill: string; border: string; prio: number; lines: number }
const hits = (a: Rect, b: Rect) => a.x < b.x + b.w + 4 && b.x < a.x + a.w + 4 && a.y < b.y + b.h + 4 && b.y < a.y + a.h + 4

function bubbleGeom(W: number, c: Cand): { rect: Rect; lines: string[] } {
  const lines = wrap(c.text, 26, c.lines)
  const longest = Math.max(1, ...lines.map(l => l.length))
  const w = Math.round(longest * 5.9 + 16)
  const h = lines.length * 10 + 9
  const x = Math.round(Math.min(Math.max(4, c.cx - w / 2), W - w - 4))
  const y = Math.max(2, c.headY - h - 10)
  return { rect: { x, y, w, h }, lines }
}
function bubbleSvg(rc: Rect, lines: string[], c: Cand): string {
  const { x, y, w, h } = rc
  const tx = Math.round(Math.min(Math.max(x + 8, c.cx - 4), x + w - 14))
  return `<g class="bubble">` +
    r(x + 2, y + 3, w, h, '#000000', ' opacity="0.18" rx="4"') +
    r(x, y, w, h, c.fill, ` stroke="${c.border}" stroke-width="2" rx="4"`) +
    `<path d="M${tx} ${y + h - 1} l8 0 l-6 7 z" fill="${c.fill}" stroke="${c.border}" stroke-width="2" stroke-linejoin="round"/>` +
    r(tx + 1, y + h - 2.5, 7, 3, c.fill) +
    lines.map((l, i) => txt(x + 7, y + 13 + i * 10, l, 8.5, '#241b2f')).join('') +
    `</g>`
}
function alertSvg(cx: number, headY: number): string {
  const x = cx - 30, y = headY + 2
  return `<g class="bubble"><g>` +
    r(x + 1, y + 2, 14, 16, '#000000', ' opacity="0.2" rx="3"') +
    r(x, y, 14, 16, '#ff3b3b', ' stroke="#7a0e16" stroke-width="2" rx="3"') +
    txt(x + 7, y + 12.5, '!', 12, '#ffffff', ' font-weight="900" text-anchor="middle"') +
    `<animateTransform attributeName="transform" type="translate" values="0 0;0 -3;0 0" dur="0.9s" repeatCount="indefinite"/></g></g>`
}

// ---------- cartão de zoom ----------
function cardBox(L: Layout) {
  const pw = Math.min(L.W - 24, 420)
  const ph = 300
  const px = Math.round((L.W - pw) / 2)
  const py = Math.round(Math.min(Math.max(12, L.H / 2 - ph / 2), L.H - ph - 12))
  return { px, py, pw, ph, sc: 7 }
}
function cardBg(L: Layout): string {
  const { px, py, pw, ph, sc } = cardBox(L)
  return `<g id="cbg">` +
    r(0, 0, L.W, L.H, '#0d0a14', ' opacity="0.7"') +
    r(px + 3, py + 4, pw, ph, '#000', ' opacity="0.3" rx="8"') +
    r(px, py, pw, ph, '#1f1b2e', ' stroke="#4a4166" stroke-width="2" rx="8"') +
    r(px + 14, py + 18, 16 * sc + 8, 24 * sc - 8, '#2c3b5e', ' rx="6"') + r(px + 14, py + 18 + 24 * sc - 30, 16 * sc + 8, 22, '#24314f') +
    txt(px + pw - 12, py + ph - 10, t('card.close'), 8, '#8a83a8', ' text-anchor="end"') +
    `</g>`
}
const aid = (s: string) => 'a-' + s.replace(/[^a-z0-9-]/gi, '_')
const cid = (s: string) => 'c-' + s.replace(/[^a-z0-9-]/gi, '_')
function card(L: Layout, type: string, w: Worker | undefined): string {
  const awake = !!w?.isAwake
  const isCeo = type === 'claude'
  const status = isCeo ? t('status.boss') : awake ? t('status.working') : w?.justDone ? t('status.done') : t('status.sleeping')
  const role = roleOf(type) || (isCeo ? t('role.boss') : t('role.extra'))
  const body = [
    ...wrap(role, 34, 3),
    ...(w?.level ? ['', ...wrap(t('card.power', { level: levelLabel(w.level), model: MODEL[w.level], effort: EFFORT[w.level] }), 34, 2), ...wrap(t('card.why', { reason: w.reason ?? '' }), 34, 2)] : []),
    '',
    ...wrap(t('card.now', { action: w?.action || (awake ? '…' : 'Zzz…') }), 34, 5),
    ...(w?.task ? ['', ...wrap(t('card.task', { task: w.task }), 34, 4)] : []),
  ]
  const { px, py, sc } = cardBox(L)
  const tx = px + 16 * sc + 36
  return `<g id="${cid(type)}" class="card"><use href="#cbg"/>` +
    person(type, px + 18, py + 14, awake || isCeo, sc, true) +
    txt(tx, py + 34, isCeo ? 'Claude' : type, 15, '#ffffff', ' font-weight="700"') +
    txt(tx, py + 50, status, 9.5, awake || isCeo ? '#6ee7a0' : '#c9c3e0') +
    body.map((l, i) => txt(tx, py + 70 + i * 11.5, l, 9, '#e9e6f5')).join('') +
    `</g>`
}

// ---------- cena ----------
export function scene(input: { workers: Worker[]; ceo: Ceo; now: number; wide: boolean; pedido: string }): string {
  const { ceo, now, pedido } = input
  const byType = new Map<string, Worker>()
  for (const w of input.workers) {
    const cur = byType.get(w.type)
    if (!cur || w.isAwake || (!cur.isAwake && w.startedAt >= cur.startedAt)) byType.set(w.type, w)
  }
  const extras = [...byType.keys()].filter(tp => !KNOWN.has(tp))
  const L = layout(input.wide, extras)
  const all = Object.keys(L.seats)

  // Chefe: ao lado da mesa de quem chamou, no vão entre mesas (sem invadir a vizinha).
  const ceoPos = (at: string) => {
    const s = at ? L.seats[at] : undefined
    if (!s) return L.ceoHome
    const right = s.x + 48
    return { x: right + SW <= L.W - 14 ? right : s.x - 46, y: s.y + 4 }
  }

  const css =
    `<style>` +
    `.ag{cursor:pointer;outline:none}.ag .hl{opacity:0;transition:opacity .15s}.ag:hover .hl,.ag:focus .hl{opacity:1}` +
    `.ag .nm{opacity:0;transition:opacity .15s}.ag:hover .nm,.ag:focus .nm,.ag.on .nm{opacity:1}` +
    `.card{display:none}.bubble,.links,.fronts{pointer-events:none}` +
    [...all, 'claude'].map(tp => `#${aid(tp)}:focus~.cards #${cid(tp)}`).join(',') + `{display:inline}</style>`

  let back = ''
  let roomFronts = ''
  for (const room of L.rooms) {
    const a = roomArt(room.kind, room.ox, room.oy, pedido)
    back += a.back
    roomFronts += a.front
  }

  const people: string[] = []
  const fronts: string[] = [roomFronts]
  const links: string[] = []
  const overlay: string[] = []
  const cands: Cand[] = []

  for (const tp of all) {
    const sp = L.seats[tp]!
    const w = byType.get(tp)
    const awake = !!w?.isAwake
    const lk = look(tp)
    if (sp.kind !== 'stand') back += `<use href="#chair" x="${sp.x}" y="${sp.y}"/>`
    const plateY = sp.y + (sp.kind === 'desk' ? 72 : sp.kind === 'table' ? 84 : SH + 12)
    const plateW = tp.length * 4.6 + 10
    people.push(
      `<g id="${aid(tp)}" class="ag${awake ? ' on' : ''}" tabindex="0"><title>${esc(tp)}</title>` +
        r(sp.x - 5, sp.y - 5, SW + 10, SH + 10, 'none', ` class="hl" stroke="#ffd166" stroke-width="2" stroke-dasharray="4 2" rx="4"`) +
        (sp.kind === 'stand' ? `<ellipse cx="${sp.x + 16}" cy="${sp.y + SH}" rx="12" ry="3" fill="#00000030"/>` : '') +
        person(tp, sp.x, sp.y, awake) +
        `<g class="nm">${r(sp.x + 16 - plateW / 2, plateY - 9, plateW, 12, '#1f1830', ' opacity="0.85" rx="3"')}${txt(sp.x + 16, plateY, tp, 7.5, awake ? '#ffd166' : '#ffffff', ' text-anchor="middle"')}</g>` +
        `</g>`,
    )
    if (sp.kind === 'desk') {
      fronts.push(`<use href="#desk" x="${sp.x}" y="${sp.y}"/>` + (awake ? `<use href="#screen" x="${sp.x}" y="${sp.y}"/>` : '') + deskItems(tp, sp.x, sp.y))
      if (awake) {
        fronts.push(`<g>${r(sp.x + 6, sp.y + 32, 5, 4, lk.pal.S!)}<animateTransform attributeName="transform" type="translate" values="0 0;0 -2;0 0" dur="0.25s" repeatCount="indefinite"/></g>`)
        fronts.push(`<g>${r(sp.x + 15, sp.y + 32, 5, 4, lk.pal.S!)}<animateTransform attributeName="transform" type="translate" values="0 -2;0 0;0 -2" dur="0.25s" repeatCount="indefinite"/></g>`)
      } else {
        fronts.push(box(sp.x + 3, sp.y + 33, 26, 5, lk.pal.B!) + r(sp.x + 12, sp.y + 34, 8, 3, lk.pal.S!))
      }
    } else if (sp.kind === 'table') {
      fronts.push(box(sp.x + 5, sp.y + 41, 22, 9, '#fbf8f1') + r(sp.x + 8, sp.y + 44, 14, 1, '#b8b2a4') + r(sp.x + 8, sp.y + 47, 10, 1, '#b8b2a4'))
      if (awake) fronts.push(box(sp.x + 6, sp.y + 30, 20, 12, '#9aa3ad') + r(sp.x + 8, sp.y + 32, 16, 8, '#7fd8ff'))
    }
    const headY = sp.y + (awake ? 0 : 3)
    if (awake && w) cands.push({ cx: sp.x + 16, headY, text: w.action, fill: '#ffffff', border: '#241b2f', prio: 2 + w.startedAt / 1e14, lines: 2 })
    else if (w?.justDone) cands.push({ cx: sp.x + 16, headY, text: w.action, fill: '#e3ffec', border: '#1f6b34', prio: 1, lines: 2 })
    else overlay.push(`<use href="#zz${hash(tp) % 3}" x="${sp.x}" y="${sp.y + 12}"/>`)
    if ((awake || w?.justDone) && w?.level) {
      overlay.push(`<g class="bubble">${r(sp.x + 26, sp.y + 2, 12, 12, LEVEL_COLOR[w.level], ` stroke="${OUT}" stroke-width="1.5" rx="3"`)}${txt(sp.x + 32, sp.y + 11, levelLabel(w.level)[0]!, 8, OUT, ' font-weight="700" text-anchor="middle"')}</g>`)
    }
    const f0 = w?.parentType ? L.seats[w.parentType] : undefined
    if (awake && f0 && Math.hypot(f0.x - sp.x, f0.y - sp.y) < 230) {
      const f = f0
      links.push(`<line x1="${f.x + 16}" y1="${f.y + 26}" x2="${sp.x + 16}" y2="${sp.y + 26}" stroke="#ffd166" stroke-width="2" stroke-dasharray="4 4" opacity="0.8"><animate attributeName="stroke-dashoffset" values="16;0" dur="0.6s" repeatCount="indefinite"/></line>`)
    }
  }

  // Chefe (Claude)
  const to = ceoPos(ceo.at)
  const from = ceoPos(ceo.from)
  const walking = now - ceo.movedAt < 1800 && (from.x !== to.x || from.y !== to.y)
  const walk = walking ? `<animateTransform attributeName="transform" type="translate" from="${from.x - to.x} ${from.y - to.y}" to="0 0" dur="1.5s" fill="freeze"/>` : ''
  people.push(
    `<g id="${aid('claude')}" class="ag on" tabindex="0"><title>${esc(t('boss.title'))}</title><g>${walk}` +
      r(to.x - 5, to.y - 14, SW + 10, SH + 20, 'none', ` class="hl" stroke="#ffd166" stroke-width="2" stroke-dasharray="4 2" rx="4"`) +
      `<ellipse cx="${to.x + 16}" cy="${to.y + SH}" rx="12" ry="3" fill="#00000030"/>` +
      person('claude', to.x, to.y, true) +
      r(to.x + 9, to.y - 5, 14, 5, '#ffd166', ` stroke="${OUT}" stroke-width="1"`) + r(to.x + 9, to.y - 9, 3, 4, '#ffd166') + r(to.x + 14.5, to.y - 10, 3, 5, '#ffd166') + r(to.x + 20, to.y - 9, 3, 4, '#ffd166') + r(to.x + 15, to.y - 3.5, 2, 2, '#e04848') +
      `<g class="nm">${r(to.x + 16 - 18, to.y + SH + 3, 36, 12, '#1f1830', ' opacity="0.85" rx="3"')}${txt(to.x + 16, to.y + SH + 12, 'claude', 7.5, '#ffb08a', ' text-anchor="middle"')}</g>` +
      `</g></g>`,
  )
  if (ceo.say) cands.push({ cx: to.x + 16, headY: to.y - 8, text: ceo.say, fill: '#fff1e8', border: '#a8462a', prio: 9, lines: 3 })

  // Balões: o de maior prioridade fica; quem bater em outro vira uma ! vermelha.
  const placed: Rect[] = []
  const bubbles: string[] = []
  for (const c of cands.sort((a, b) => b.prio - a.prio)) {
    const g = bubbleGeom(L.W, c)
    if (placed.some(p => hits(p, g.rect))) { bubbles.push(alertSvg(c.cx, c.headY)); continue }
    placed.push(g.rect)
    bubbles.push(bubbleSvg(g.rect, g.lines, c))
  }

  const cards =
    `<g class="cards">` +
    all.map(tp => card(L, tp, byType.get(tp))).join('') +
    card(L, 'claude', { id: 'ceo', type: 'claude', task: pedido, action: ceo.say || '…', isAwake: true, startedAt: 0 }) +
    `</g>`

  const defs = `<defs>${PATTERNS}${ZZZ}${FURNITURE}${cardBg(L)}${symbols(['claude', ...all])}</defs>`

  // .ag e .cards precisam ser irmãos para o seletor ~ funcionar.
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${L.W} ${L.H}" width="${L.W * 3}" height="${L.H * 3}" shape-rendering="crispEdges" text-rendering="geometricPrecision">` +
    defs + css +
    r(0, 0, L.W, L.H, '#17131f') +
    back +
    `<g class="links">${links.join('')}</g>` +
    people.join('') +
    `<g class="fronts">${fronts.join('')}</g>` +
    `<g>${overlay.join('')}${bubbles.join('')}</g>` +
    cards +
    `</svg>`
  )
}

export function portrait(type: string, awake: boolean): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 192" width="128" height="192" shape-rendering="crispEdges"><defs>${symbols([type])}</defs>${r(0, 0, 128, 192, '#2c3b5e')}${person(type, 0, 0, awake, 8, true)}</svg>`
}
