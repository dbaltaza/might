// Parte C: o boneco MighT.
// figura(personalidade, poder, caracter) → { src, tagline, svg }
// Um só "artista": uma série de bonecos de vinil com o mesmo traço. Contorno de autocolante,
// volume suave (luz de cima à esquerda) e ornamentos simétricos em camadas.
// Cabeça → Personalidade · Corpo → Poder · Braços → Carácter · Paleta → a combinação.
// A mesma combinação de palavras dá sempre a mesma figura (determinístico, sem aleatório).
import { tagline as taglineDe } from '../logica/index.js'

// ── Silhueta (viewBox 0 0 120 140; src/Silhueta.jsx desenha a mesma forma) ──
export const CABECA = 'M60 6C79 6 92 15.5 94.5 29.5C105.5 28.5 113 37 113 48C113 59 106 66.5 99 67.5C95.5 77.5 81 84 60 84C39 84 24.5 77.5 21 67.5C14 66.5 7 59 7 48C7 37 14.5 28.5 25.5 29.5C28 15.5 41 6 60 6Z'
export const CORPO = 'M40 72H80C87 72 91.5 77 92 85L93.5 122C94 129 89.5 134 83 134H71.5C68 134 66.5 132 66.5 128.5V124.5C66.5 120.5 63.5 117.5 60 117.5C56.5 117.5 53.5 120.5 53.5 124.5V128.5C53.5 132 52 134 48.5 134H37C30.5 134 26 129 26.5 122L28 85C28.5 77 33 72 40 72Z'
export const BRACO_E = 'M27 72C19 72 12.5 78 12 88L10.5 116C10 124.5 15 130 21.5 130C28 130 31.5 125 31 117.5L31.5 80C31.5 75 30 72 27 72Z'
export const BRACO_D = 'M93 72C101 72 107.5 78 108 88L109.5 116C110 124.5 105 130 98.5 130C92 130 88.5 125 89 117.5L88.5 80C88.5 75 90 72 93 72Z'

// ── Paletas: tons da marca, um pouco dessaturados para parecer tinta e não ecrã ──
// cab/cor/bra = fundo de cabeça/corpo/braços · a = acentos · cr = creme · t = tinta (sombras e traço)
const PALETAS = [
  { cab: '#5b9fcd', cor: '#f5efe4', bra: '#f5efe4', cr: '#fbf7ef', t: '#173f6c', a: ['#7a3468', '#c99a4e', '#2f6aa8', '#d9776f'] },
  { cab: '#7c3a6b', cor: '#f4e7dc', bra: '#f4e7dc', cr: '#fbf3ea', t: '#3a1534', a: ['#e39a58', '#8cbfdf', '#2d5f97', '#e8c7b4'] },
  { cab: '#3f8e63', cor: '#f5eedf', bra: '#f5eedf', cr: '#faf5e9', t: '#1b4632', a: ['#e2873f', '#7a3468', '#efcf8d', '#3a78b3'] },
  { cab: '#e38f4a', cor: '#fcefdf', bra: '#fcefdf', cr: '#fff7ec', t: '#6e3317', a: ['#1f5a93', '#7a3468', '#f4d4a3', '#3d9061'] },
  { cab: '#1f4f86', cor: '#eef2f6', bra: '#eef2f6', cr: '#f8f4ea', t: '#0c2643', a: ['#e3913f', '#a9cdee', '#c66879', '#f0dfbd'] },
  { cab: '#a8cbe9', cor: '#fbf6ee', bra: '#fbf6ee', cr: '#ffffff', t: '#1a4776', a: ['#7a3468', '#e08a3e', '#2f6aa8', '#3d9061'] },
  { cab: '#9dcfb3', cor: '#faf5ea', bra: '#faf5ea', cr: '#fdf9f1', t: '#1d5240', a: ['#7a3468', '#e2873f', '#2f74b0', '#f2d39c'] },
  { cab: '#f0bd97', cor: '#fcf3ea', bra: '#fcf3ea', cr: '#fff8f0', t: '#6a2b53', a: ['#2f74b0', '#7a3468', '#3d9061', '#e2873f'] },
]

function hash(s = '') {
  let h = 2166136261
  for (const c of String(s)) h = Math.imul(h ^ c.codePointAt(0), 16777619)
  return h >>> 0
}
const pick = (arr, s, sal = '') => arr[hash(sal + s) % arr.length]

// ── Geometria: números curtos e sem NaN ──
const n1 = (v) => Math.round(v * 10) / 10
const pt = (x, y) => `${n1(x)} ${n1(y)}`
const rad = (g) => (g * Math.PI) / 180
// ponto polar: ângulo em graus, 0 = para cima, sentido horário
const pol = (cx, cy, r, a) => [cx + r * Math.sin(rad(a)), cy - r * Math.cos(rad(a))]
const P = (cx, cy, r, a) => pt(...pol(cx, cy, r, a))

const circ = (cx, cy, r, cor) => `<circle cx="${n1(cx)}" cy="${n1(cy)}" r="${n1(r)}" fill="${cor}"/>`
const path = (d, cor) => `<path d="${d}" fill="${cor}"/>`
const traco = (d, cor, w, extra = '') =>
  `<path d="${d}" fill="none" stroke="${cor}" stroke-width="${w}"${extra.includes('linecap') ? '' : ' stroke-linecap="round"'}${extra.includes('linejoin') ? '' : ' stroke-linejoin="round"'}${extra}/>`
const anel = (cx, cy, r, cor, w, extra = '') => `<circle cx="${n1(cx)}" cy="${n1(cy)}" r="${n1(r)}" fill="none" stroke="${cor}" stroke-width="${w}"${extra}/>`

// Transforma um caminho unitário (só M L C Q Z, coordenadas absolutas) para (cx, cy) com escala sx, sy
function tf(d, cx, cy, sx, sy = sx) {
  return d.replace(/([MLCQ])([^MLCQZ]*)/g, (_, cmd, nums) => {
    const v = nums.trim().split(/[\s,]+/).map(Number)
    let o = ''
    for (let i = 0; i + 1 < v.length; i += 2) o += (i ? ' ' : '') + pt(cx + v[i] * sx, cy + v[i + 1] * sy)
    return cmd + o
  })
}

// flor de n pétalas redondas (rIn = raiz das pétalas, rOut ≈ ponta)
function roseta(cx, cy, n, rIn, rOut, rot = 0) {
  const s = 360 / n
  const k = rOut + (rOut - rIn) * 0.35
  let d = 'M' + P(cx, cy, rIn, rot)
  for (let i = 0; i < n; i++) {
    const a = rot + i * s
    d += 'C' + P(cx, cy, k, a + s * 0.06) + ' ' + P(cx, cy, k, a + s * 0.94) + ' ' + P(cx, cy, rIn, a + s)
  }
  return d + 'Z'
}
// n pétalas em amêndoa (pontiagudas), do raio r0 ao r1, largura w
function petalas(cx, cy, n, r0, r1, w, rot = 0) {
  let d = ''
  for (let i = 0; i < n; i++) {
    const a = rot + (360 / n) * i
    const [mx, my] = pol(cx, cy, (r0 + r1) / 2, a)
    const px = Math.cos(rad(a)) * w
    const py = Math.sin(rad(a)) * w
    d += 'M' + P(cx, cy, r0, a) + 'Q' + pt(mx + px, my + py) + ' ' + P(cx, cy, r1, a) + 'Q' + pt(mx - px, my - py) + ' ' + P(cx, cy, r0, a) + 'Z'
  }
  return d
}
// raios afilados (triângulos) alternando comprimento
function raios(cx, cy, n, rb, rt, meia, rot = 0) {
  let d = ''
  for (let i = 0; i < n; i++) {
    const a = rot + (360 / n) * i
    d += 'M' + P(cx, cy, rb, a - meia) + 'L' + P(cx, cy, rt, a) + ' ' + P(cx, cy, rb, a + meia) + 'Z'
  }
  return d
}
// pontos em anel
const pontos = (cx, cy, n, r, rp, cor, rot = 0) => Array.from({ length: n }, (_, i) => circ(...pol(cx, cy, r, rot + (360 / n) * i), rp, cor)).join('')
// estrela de 4 pontas com lados côncavos
const brilho = (cx, cy, r, k = 0.16) => {
  const q = r * k
  return `M${pt(cx, cy - r)}Q${pt(cx + q, cy - q)} ${pt(cx + r, cy)}Q${pt(cx + q, cy + q)} ${pt(cx, cy + r)}Q${pt(cx - q, cy + q)} ${pt(cx - r, cy)}Q${pt(cx - q, cy - q)} ${pt(cx, cy - r)}Z`
}
// amêndoa/folha entre dois pontos
function folha(x1, y1, x2, y2, w) {
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2
  const L = Math.hypot(x2 - x1, y2 - y1) || 1
  const nx = (-(y2 - y1) / L) * w
  const ny = ((x2 - x1) / L) * w
  return `M${pt(x1, y1)}Q${pt(mx + nx, my + ny)} ${pt(x2, y2)}Q${pt(mx - nx, my - ny)} ${pt(x1, y1)}Z`
}
// formas unitárias
const CORACAO = 'M0 1C-.42 .7 -1 .25 -1 -.3C-1 -.76 -.66 -1 -.34 -1C-.14 -1 0 -.86 0 -.66C0 -.86 .14 -1 .34 -1C.66 -1 1 -.76 1 -.3C1 .25 .42 .7 0 1Z'
const LENTE = 'M-1 0C-.62 -.78 .62 -.78 1 0C.62 .78 -.62 .78 -1 0Z'

// espelho em torno do eixo x = 60
const espelho = (ctx, nome, metade) => `<g id="${ctx.id}e${nome}">${metade}</g><use href="#${ctx.id}e${nome}" transform="matrix(-1 0 0 1 120 0)"/>`

// Pormenores das orelhas (lado esquerdo; o espelho faz o direito)
const ORELHA = {
  arcos: (p, c) => [6.5, 9.5, 12.5].map((r) => traco(`M${P(21, 48, r, 222)}A${r} ${r} 0 0 1 ${P(21, 48, r, 318)}`, p.cr, 1.3)).join(''),
  olhinho: (p, c) => circ(15.5, 49, 5, c[0]) + circ(15.5, 49, 3.3, p.cr) + circ(15.5, 49, 1.6, p.t),
  trio: (p, c) => circ(14, 45, 1.9, p.cr) + circ(18.5, 49.5, 1.9, c[1]) + circ(13.5, 53, 1.9, p.cr),
  riscas: (p, c) => [0, 1, 2].map((i) => traco(`M${pt(11 + i * 3.4, 43 + i * 0.6)}Q${pt(9.6 + i * 3.4, 49)} ${pt(11 + i * 3.4, 55 - i * 0.6)}`, p.cr, 1.3)).join(''),
}

// ── Cabeça · Personalidade: medalhão central + pormenores simétricos ──
const CX = 60
const CY = 46
const CABECAS = {
  flor: (p, c, ctx) =>
    espelho(ctx, 'h', path(folha(31.5, 33.5, 23, 27.5, 3.3), p.cr) + path(brilho(37, 19.5, 3.4), p.cr) + circ(28, 64.5, 5.2, c[0]) + circ(28, 64.5, 3.5, p.cr) + circ(28, 64.5, 1.7, p.t) + circ(46.5, 13.5, 1.5, c[1]) + circ(50.5, 11.5, 1.5, p.cr) + ORELHA.arcos(p, c)) +
    path(roseta(CX, CY, 6, 19.5, 30.5), c[0]) + path(roseta(CX, CY, 6, 15.5, 24.5), p.cr) + path(roseta(CX, CY, 6, 11.5, 18.5), c[2]) +
    anel(CX, CY, 7.6, c[1], 3) + circ(CX, CY, 3.6, p.cr) + circ(CX, 13, 1.8, p.t) + path(brilho(CX, 76.5, 3), p.cr),

  mandala: (p, c, ctx) =>
    espelho(ctx, 'h', ORELHA.olhinho(p, c) + path(brilho(28, 22, 3), p.cr) + circ(24, 70, 1.6, p.cr)) +
    pontos(CX, CY, 24, 31, 1.15, p.cr) +
    path(petalas(CX, CY, 12, 11, 28.5, 4.6), c[1]) + path(petalas(CX, CY, 12, 11, 22, 3.6, 15), c[0]) +
    circ(CX, CY, 13.2, p.cr) + pontos(CX, CY, 12, 10.6, 1.25, c[2], 15) + circ(CX, CY, 7.6, c[2]) + path(roseta(CX, CY, 8, 3, 5.6), p.cr) + circ(CX, CY, 1.8, c[1]),

  sol: (p, c, ctx) =>
    espelho(ctx, 'h', ORELHA.riscas(p, c) + circ(29, 66, 2.2, c[1]) + circ(34.5, 70.5, 1.5, p.cr) + path(brilho(30.5, 21, 3.2), p.cr)) +
    path(raios(CX, CY, 12, 14, 31, 8), c[1]) + path(raios(CX, CY, 12, 14, 24.5, 6.5, 15), p.cr) +
    circ(CX, CY, 15.5, c[0]) + pontos(CX, CY, 16, 12.6, 1.05, p.cr) + circ(CX, CY, 9.6, p.cr) + path(roseta(CX, CY, 8, 4.4, 8), c[1]) + circ(CX, CY, 2.6, c[0]),

  olho: (p, c, ctx) =>
    espelho(ctx, 'h', ORELHA.trio(p, c) + path(folha(36, 64, 28.5, 68.5, 2.4), p.cr) + path(brilho(32, 24, 2.6), p.cr) + traco(`M${pt(40, 26.5)}Q${pt(48, 22.5)} ${pt(55, 24.5)}`, c[1], 2.6)) +
    path(Array.from({ length: 7 }, (_, i) => -51 + i * 17).map((a) => `M${P(CX, CY + 12, 25.5, a - 2.4)}L${P(CX, CY + 12, 32.5 - Math.abs(a) * 0.06, a)} ${P(CX, CY + 12, 25.5, a + 2.4)}Z`).join(''), c[1]) +
    path(tf(LENTE, CX, CY, 25, 25), c[0]) + path(tf(LENTE, CX, CY, 21, 20), p.cr) +
    circ(CX, CY, 10.2, c[2]) + anel(CX, CY, 7.6, c[1], 1.6) + circ(CX, CY, 5, p.t) + circ(CX - 2.2, CY - 2.4, 1.7, p.cr) +
    [-2, -1, 0, 1, 2].map((i) => circ(CX + i * 6.5, CY + 21 - Math.abs(i) * 1.6, i ? 1.4 : 1.9, i % 2 ? c[1] : p.cr)).join(''),

  coracao: (p, c, ctx) =>
    espelho(ctx, 'h', path(folha(52, 63, 33, 55, 4.2), c[2]) + path(folha(46.5, 58, 37, 41, 3.4), c[2]) + traco(`M${pt(52, 63)}Q${pt(41, 60)} ${pt(33, 55)}`, p.t, 0.9, ' opacity=".5"') +
      path(tf(CORACAO, 16, 49, 3.6), p.cr) + circ(33.5, 30, 1.6, p.cr) + circ(39, 25.5, 1.6, c[1]) + circ(45.5, 22.5, 1.6, p.cr)) +
    path(tf(CORACAO, CX, CY, 23, 22), c[0]) + path(tf(CORACAO, CX, CY + 0.5, 18, 17), p.cr) + path(tf(CORACAO, CX, CY + 0.8, 13.2, 12.4), c[3]) +
    path(tf(CORACAO, CX, CY + 0.5, 6.2, 5.8), p.cr) + path(brilho(CX, 16.5, 3.4), p.cr),

  noite: (p, c, ctx) =>
    espelho(ctx, 'h', circ(32, 47, 10.5, c[1]) + circ(27.5, 44, 9.6, p.cab) + path(brilho(34.5, 25, 2.6), p.cr) + circ(24.5, 66, 1.5, p.cr) + circ(41, 70, 1.3, c[1]) + circ(44, 20, 1.2, p.cr) + ORELHA.olhinho(p, c)) +
    pontos(CX, CY, 10, 22, 1.25, p.cr, 18) +
    path(brilho(CX, CY, 21, 0.12), c[0]) + path(brilho(CX, CY, 14.5, 0.12), p.cr) +
    path(brilho(CX, CY, 10.5, 0.2), c[2]) + circ(CX, CY, 2.4, p.cr) + path(brilho(CX, 14, 3.6), p.cr),

  tulipa: (p, c, ctx) => {
    const tul = (x, y, s, ca, cb) =>
      path(tf('M0 .5C-.62 .5 -.98 .1 -1 -.62C-.66 -.42 -.36 -.36 -.18 -.3C-.2 -.7 -.08 -1 0 -1.18C.08 -1 .2 -.7 .18 -.3C.36 -.36 .66 -.42 1 -.62C.98 .1 .62 .5 0 .5Z', x, y, s), ca) +
      path(tf('M0 .32C-.36 .3 -.5 .06 -.5 -.2C-.3 -.12 -.12 -.04 0 .1C.12 -.04 .3 -.12 .5 -.2C.5 .06 .36 .3 0 .32Z', x, y, s), cb)
    return espelho(ctx, 'h',
      traco(`M${pt(CX, 64)}Q${pt(45, 60)} ${pt(36, 50)}`, c[2], 1.6) + path(folha(48, 61.5, 40, 66, 2.6), c[2]) + tul(33.5, 46, 7.5, c[1], p.cr) +
      ORELHA.trio(p, c) + circ(40, 27, 1.6, p.cr) + circ(44, 22, 1.6, c[0]) + circ(49.5, 19, 1.6, p.cr) + path(brilho(26, 30, 2.6), p.cr)) +
      traco(`M${pt(CX, 70)}V${n1(52)}`, c[2], 2) + path(folha(CX, 66, 50.5, 60, 3.2), c[2]) + path(folha(CX, 66, 69.5, 60, 3.2), c[2]) +
      tul(CX, 40, 14.5, c[0], p.cr) + circ(CX, 41.5, 2.3, c[1]) +
      [-36, -18, 0, 18, 36].map((a) => circ(...pol(CX, 41, 22.5, a), a ? 1.5 : 2, a % 36 ? c[1] : p.cr)).join('')
  },

  azulejo: (p, c, ctx) =>
    espelho(ctx, 'h', path(`M${pt(27, 47)}L${pt(31.5, 41.5)} ${pt(36, 47)} ${pt(31.5, 52.5)}Z`, c[1]) + circ(31.5, 47, 1.4, p.cr) + ORELHA.arcos(p, c) +
      circ(36, 25, 1.5, p.cr) + circ(30, 68, 1.5, p.cr) + path(`M${pt(40, 71)}L${pt(42.5, 68)} ${pt(45, 71)} ${pt(42.5, 74)}Z`, p.cr)) +
    path(`M${P(CX, CY, 26, 0)}L${P(CX, CY, 26, 90)} ${P(CX, CY, 26, 180)} ${P(CX, CY, 26, 270)}Z`, c[0]) +
    path(`M${P(CX, CY, 26, 45)}L${P(CX, CY, 26, 135)} ${P(CX, CY, 26, 225)} ${P(CX, CY, 26, 315)}Z`, c[0]) +
    path(`M${P(CX, CY, 21, 0)}L${P(CX, CY, 21, 90)} ${P(CX, CY, 21, 180)} ${P(CX, CY, 21, 270)}Z`, p.cr) +
    path(`M${P(CX, CY, 21, 45)}L${P(CX, CY, 21, 135)} ${P(CX, CY, 21, 225)} ${P(CX, CY, 21, 315)}Z`, p.cr) +
    circ(CX, CY, 14.5, c[2]) + path(roseta(CX, CY, 4, 3.4, 11.5, 45), p.cr) + path(roseta(CX, CY, 4, 2.4, 7.2, 45), c[1]) + circ(CX, CY, 2.2, p.cr) +
    pontos(CX, CY, 8, 23.5, 1.3, c[2], 22.5),
}

// ── Corpo · Poder ──
const contas = (p, c, y0 = 89, y1 = 112) => {
  let s = ''
  let i = 0
  for (let y = y0; y <= y1; y += 7.5, i++) s += i % 2 ? path(brilho(CX, y, 3.4), p.t) : circ(CX, y, i % 4 ? 2.5 : 3.1, c[i % 4 ? 1 : 0])
  return s
}
const CORPOS = {
  ondas: (p, c, ctx) => {
    const D = [7.5, 13, 18.5, 24]
    const curva = (x) => `M${pt(x, 66)}C${pt(x + 9, 90)} ${pt(x - 8, 111)} ${pt(x + 3, 140)}`
    return espelho(ctx, 'b', D.map((d, k) => path(curva(60 + d) + 'L100 140 100 66Z', c[k])).join('') + D.map((d) => traco(curva(60 + d), p.cr, 1.2)).join('')) + contas(p, c)
  },
  arcos: (p, c, ctx) => {
    const cores = [c[0], p.cr, c[1], c[2], p.cr, c[3], c[0], p.cr, c[1], c[2]]
    let s = ''
    for (let i = 0; i < 10; i++) s += circ(60, 140, 76 - i * 6.6, cores[i])
    return s + anel(60, 140, 76 - 4 * 6.6 - 3.3, c[1], 2.2, ' stroke-dasharray="0 4.4" stroke-linecap="round"') + anel(60, 140, 76 - 7 * 6.6 - 3.3, c[3], 2, ' stroke-dasharray="0 4" stroke-linecap="round"')
  },
  escamas: (p, c, ctx) => {
    let t = ''
    for (const [x, y, k] of [[0, 21, 0], [14, 21, 0], [7, 14, 1], [0, 7, 0], [14, 7, 0], [7, 0, 1], [0, -7, 0], [14, -7, 0]]) t += circ(x, y, 7.6, k ? c[0] : c[2]) + circ(x, y + 1, 4.6, p.cr) + circ(x, y + 2, 1.7, c[1])
    ctx.defs.push(`<pattern id="${ctx.id}pb" width="14" height="14" patternUnits="userSpaceOnUse" x="53" y="0">${t}</pattern>`)
    return `<rect x="20" y="66" width="80" height="74" fill="url(#${ctx.id}pb)"/>`
  },
  losangos: (p, c, ctx) => {
    const t = path('M7 0L14 8 7 16 0 8Z', c[0]) + path('M7 4L10.5 8 7 12 3.5 8Z', p.cr) + circ(7, 8, 1.2, c[1]) +
      path('M0 -8L7 0 0 8 -7 0ZM14 -8L21 0 14 8 7 0ZM0 8L7 16 0 24 -7 16ZM14 8L21 16 14 24 7 16Z', c[2]) +
      circ(0, 0, 1.6, p.cr) + circ(14, 0, 1.6, p.cr) + circ(0, 16, 1.6, p.cr) + circ(14, 16, 1.6, p.cr) +
      traco('M0 8L7 0 14 8 7 16Z', p.cr, 0.8)
    ctx.defs.push(`<pattern id="${ctx.id}pb" width="14" height="16" patternUnits="userSpaceOnUse" x="53" y="2">${t}</pattern>`)
    return `<rect x="20" y="66" width="80" height="74" fill="url(#${ctx.id}pb)"/>`
  },
  chevron: (p, c, ctx) => {
    const cores = [c[0], p.cr, c[1], c[2], p.cr]
    let s = ''
    for (let i = 0, y = 54; y < 146; y += 6.4, i++) s += traco(`M16 ${n1(y)}L60 ${n1(y + 15)} 104 ${n1(y)}`, cores[i % 5], 6.6, ' stroke-linecap="butt" stroke-linejoin="miter"')
    return s + path(brilho(60, 97, 4.6), p.t) + path(brilho(60, 97, 2.2), p.cr)
  },
  medalhao: (p, c, ctx) =>
    espelho(ctx, 'b', `<rect x="78" y="66" width="3.4" height="74" fill="${c[1]}"/><rect x="83.4" y="66" width="1.4" height="74" fill="${c[0]}"/>` + traco('M88.5 70V136', c[2], 2.2, ' stroke-dasharray="0 4.6"') +
      path(folha(72.5, 82, 75.5, 93, 2), c[0]) + path(folha(72.5, 112, 75.5, 101, 2), c[0])) +
    path(roseta(CX, 99, 8, 9.5, 15.5), c[0]) + circ(CX, 99, 9.5, p.cr) + pontos(CX, 99, 8, 7.4, 1.1, c[2], 22.5) + path(roseta(CX, 99, 8, 2.8, 5.4), c[1]) + circ(CX, 99, 1.8, p.t) +
    path(brilho(CX, 80.5, 2.6), c[2]),
  faixas: (p, c, ctx) =>
    espelho(ctx, 'b', `<rect x="64.5" y="66" width="5" height="74" fill="${c[1]}"/><rect x="72" y="66" width="1.6" height="74" fill="${c[0]}"/><rect x="76" y="66" width="7.5" height="74" fill="${c[2]}"/><rect x="86" y="66" width="20" height="74" fill="${c[0]}"/>` +
      traco('M79.7 68' + Array.from({ length: 12 }, (_, i) => `L${i % 2 ? 77.6 : 81.8} ${70 + i * 6}`).join(''), p.cr, 1.1) + traco('M90 70V136', p.cr, 2, ' stroke-dasharray="0 5"')) +
    `<rect x="55.5" y="66" width="9" height="74" fill="${c[3]}"/>` + contas(p, c, 86, 110),
  flores: (p, c, ctx) => {
    const t = path(roseta(8, 4.5, 5, 1.6, 4.4), c[0]) + circ(8, 4.5, 1.3, p.cr) + path(roseta(0, 13.5, 5, 1.6, 4.4, 36), c[2]) + path(roseta(16, 13.5, 5, 1.6, 4.4, 36), c[2]) +
      circ(0, 13.5, 1.3, c[1]) + circ(16, 13.5, 1.3, c[1]) + path(roseta(8, 22.5, 5, 1.6, 4.4), c[0]) + circ(8, 22.5, 1.3, p.cr) +
      circ(0, 4.5, 0.9, p.t) + circ(16, 4.5, 0.9, p.t) + circ(8, 13.5, 0.9, p.t)
    ctx.defs.push(`<pattern id="${ctx.id}pb" width="16" height="18" patternUnits="userSpaceOnUse" x="52" y="0">${t}</pattern>`)
    return `<rect x="20" y="66" width="80" height="74" fill="url(#${ctx.id}pb)"/>`
  },
}

// ── Braços · Carácter (desenhados no braço esquerdo; o espelho faz o direito) ──
const AX = 20.5 // eixo visível do braço esquerdo
const BRACOS = {
  quadrados: (p, c, ctx) => {
    const q = (x, y, k) => `<rect x="${x + 0.7}" y="${y + 0.7}" width="7.1" height="7.1" rx="2.3" fill="${k}"/><rect x="${x + 2.4}" y="${y + 2.4}" width="3.7" height="3.7" rx="1.2" fill="${p.cr}"/>` + circ(x + 4.25, y + 4.25, 0.9, k)
    ctx.defs.push(`<pattern id="${ctx.id}pa" width="17" height="17" patternUnits="userSpaceOnUse" x="${AX - 4.25}" y="70">${q(0, 0, c[0]) + q(8.5, 0, c[1]) + q(0, 8.5, c[1]) + q(8.5, 8.5, c[0])}</pattern>`)
    return `<rect x="6" y="68" width="30" height="66" fill="url(#${ctx.id}pa)"/>`
  },
  ondas: (p, c, ctx) => {
    const cores = [c[0], c[1], p.cr, c[2]]
    let s = ''
    for (let i = 0, y = 70; y < 134; y += 5.2, i++) s += traco(`M6 ${n1(y)}q3.5 -2.6 7 0t7 0 7 0 7 0 7 0`, cores[i % 4], 4.6, ' stroke-linecap="butt"')
    return s
  },
  aneis: (p, c, ctx) => {
    let s = ''
    for (let i = 0, y = 80; y < 132; y += 13, i++) {
      s += `<rect x="6" y="${y}" width="30" height="5.6" fill="${c[i % 2 ? 2 : 0]}"/>` + traco(`M6 ${y + 1.2}H36`, p.cr, 0.8, ' opacity=".7"')
      s += circ(AX - 5, y + 9.4, 1.4, c[1]) + circ(AX, y + 9.4, 1.8, c[1]) + circ(AX + 5, y + 9.4, 1.4, c[1])
    }
    return s
  },
  pontos: (p, c, ctx) => {
    const d = (x, y, k) => circ(x, y, 2.5, k) + circ(x, y, 1, p.cr)
    ctx.defs.push(`<pattern id="${ctx.id}pa" width="8" height="12" patternUnits="userSpaceOnUse" x="${AX - 4}" y="72">${d(4, 3, c[0]) + d(0, 9, c[2]) + d(8, 9, c[2])}</pattern>`)
    return `<rect x="6" y="68" width="30" height="66" fill="url(#${ctx.id}pa)"/>`
  },
  chevron: (p, c, ctx) => {
    const cores = [c[0], p.cr, c[2], p.cr]
    let s = ''
    for (let i = 0, y = 66; y < 136; y += 4.2, i++) s += traco(`M6 ${n1(y)}L${AX} ${n1(y + 6)} 36 ${n1(y)}`, cores[i % 4], 4.4, ' stroke-linecap="butt" stroke-linejoin="miter"')
    return s
  },
  folhas: (p, c, ctx) => {
    let s = traco(`M${AX} 70Q${AX + 2.5} 82 ${AX} 94T${AX} 118T${AX} 142`, c[2], 1.4)
    for (let i = 0, y = 80; y < 130; y += 8, i++) {
      const lado = i % 2 ? 1 : -1
      s += path(folha(AX, y, AX + lado * 8, y - 5, 2.4), c[i % 4 === 1 ? 1 : 0]) + circ(AX - lado * 5, y - 1, 1.1, c[1])
    }
    return s
  },
  escamas: (p, c, ctx) => {
    let t = ''
    for (const [x, y, k] of [[0, 15, 0], [10, 15, 0], [5, 10, 1], [0, 5, 0], [10, 5, 0], [5, 0, 1], [0, -5, 0], [10, -5, 0]]) t += circ(x, y, 5.4, k ? c[2] : c[0]) + circ(x, y + 0.8, 3.1, p.cr) + circ(x, y + 1.6, 1.1, c[1])
    ctx.defs.push(`<pattern id="${ctx.id}pa" width="10" height="10" patternUnits="userSpaceOnUse" x="${AX - 5}" y="70">${t}</pattern>`)
    return `<rect x="6" y="68" width="30" height="66" fill="url(#${ctx.id}pa)"/>`
  },
}

// ── Que palavra dá que ornamento (as não previstas caem por hash, de forma estável) ──
const MAPA = {
  cabeca: {
    flor: ['Sensível', 'Optimista', 'Adaptável'], mandala: ['Sábio', 'Inteligente'], sol: ['Confiante', 'Competitivo', 'Extrovertido'],
    olho: ['Curioso', 'Esperto'], coracao: ['Apaixonado', 'Empático'], noite: ['Imaginativo', 'Intuitivo'], tulipa: ['Divertido', 'Persuasivo'],
    azulejo: ['Lógico', 'Objectivo', 'Prático'],
  },
  corpo: {
    ondas: ['Comunicador', 'Influenciador', 'Tradutor', 'Escritor'], arcos: ['Energizador', 'Motivador', 'Animador'],
    escamas: ['Explorador', 'Investigador', 'Aprendiz'], losangos: ['Analisador', 'Organizador', 'Planeador', 'Estratega'],
    chevron: ['Vencedor', 'Líder', 'Concretizador', 'Empreendedor'], medalhao: ['Conselheiro', 'Moderador', 'Conector'],
    faixas: ['Solucionador', 'Conceptualizador'], flores: ['Compositor', 'Criador', 'Ilustrador', 'Inovador'],
  },
  bracos: {
    quadrados: ['Disciplina', 'Responsabilidade', 'Integridade'], ondas: ['Liberdade', 'Tolerância'], aneis: ['Persistência', 'Maturidade'],
    pontos: ['Generosidade', 'Sinceridade'], chevron: ['Coragem'], folhas: ['Compaixão', 'Altruísmo', 'Humildade'], escamas: ['Colaboração', 'Solidariedade'],
  },
}
function escolhe(tipo, familias, palavra) {
  const w = String(palavra ?? '')
  for (const [nome, lista] of Object.entries(MAPA[tipo])) if (lista.includes(w)) return familias[nome]
  return familias[pick(Object.keys(familias), w, tipo)]
}
// roda a ordem dos acentos conforme a palavra, para a mesma família não sair sempre igual
const roda = (a, palavra, sal) => {
  const k = hash(sal + String(palavra ?? '')) % a.length
  return a.slice(k).concat(a.slice(0, k))
}

export function figuraSVG(personalidade = '', poder = '', caracter = '') {
  const [w1, w2, w3] = [personalidade, poder, caracter].map((w) => String(w ?? ''))
  const p = pick(PALETAS, `${w1}|${w2}|${w3}`, 'pal')
  const id = 'm' + hash(`${w1}|${w2}|${w3}`).toString(36)
  const ctx = { id, defs: [] }
  const head = escolhe('cabeca', CABECAS, w1)(p, roda(p.a, w1, 'c'), ctx)
  const body = escolhe('corpo', CORPOS, w2)(p, roda(p.a, w2, 'b'), ctx)
  const arms = escolhe('bracos', BRACOS, w3)(p, roda(p.a, w3, 'r'), ctx)
  const t = p.t
  // volume: luz de cima à esquerda + sombra para as bordas, recortadas por cada parte
  const linha = (d) => `<path d="${d}" fill="none" stroke="${t}" stroke-width="1.5" stroke-opacity=".3"/>`
  const volume = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${id}S)"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${id}L)"/>`
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-4 -2 128 148">
<defs>
<g id="${id}s"><path d="${BRACO_E}"/><path d="${BRACO_D}"/><path d="${CORPO}"/><path d="${CABECA}"/></g>
<clipPath id="${id}c"><path d="${CABECA}"/></clipPath>
<clipPath id="${id}b"><path d="${CORPO}"/></clipPath>
<clipPath id="${id}a"><path d="${BRACO_E}"/><path d="${BRACO_D}"/></clipPath>
<radialGradient id="${id}L" cx=".3" cy=".16" r=".7"><stop offset="0" stop-color="#fff" stop-opacity=".42"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/></radialGradient>
<radialGradient id="${id}S" cx=".42" cy=".32" r=".8"><stop offset=".45" stop-color="${t}" stop-opacity="0"/><stop offset="1" stop-color="${t}" stop-opacity=".5"/></radialGradient>
<linearGradient id="${id}V"><stop offset="0" stop-color="${t}" stop-opacity=".22"/><stop offset=".22" stop-color="${t}" stop-opacity="0"/><stop offset=".68" stop-color="${t}" stop-opacity="0"/><stop offset="1" stop-color="${t}" stop-opacity=".34"/></linearGradient>
<radialGradient id="${id}h"><stop offset="0" stop-color="${t}" stop-opacity=".55"/><stop offset="1" stop-color="${t}" stop-opacity="0"/></radialGradient>
<radialGradient id="${id}g"><stop offset="0" stop-color="#0b1e3a" stop-opacity=".38"/><stop offset="1" stop-color="#0b1e3a" stop-opacity="0"/></radialGradient>
${ctx.defs.join('')}
</defs>
<ellipse cx="60" cy="138" rx="46" ry="5.5" fill="url(#${id}g)"/>
<use href="#${id}s" transform="translate(1 2.6)" fill="${t}" stroke="${t}" stroke-width="9" stroke-linejoin="round" opacity=".22"/>
<use href="#${id}s" fill="#fff" stroke="#fff" stroke-width="9" stroke-linejoin="round"/>
<g clip-path="url(#${id}a)"><rect x="6" y="66" width="108" height="70" fill="${p.bra}"/>${espelho(ctx, 'r', arms)}<rect x="10" y="72" width="22" height="58" fill="url(#${id}V)"/><rect x="88" y="72" width="22" height="58" fill="url(#${id}V)"/><ellipse cx="60" cy="74" rx="52" ry="13" fill="url(#${id}h)"/></g>${linha(BRACO_E)}${linha(BRACO_D)}
<g clip-path="url(#${id}b)"><rect x="20" y="66" width="80" height="74" fill="${p.cor}"/>${body}<rect x="26" y="72" width="68" height="62" fill="url(#${id}V)"/>${volume(26, 72, 68, 62)}<ellipse cx="60" cy="80" rx="42" ry="12" fill="url(#${id}h)"/></g>${linha(CORPO)}
<g clip-path="url(#${id}c)"><rect x="0" y="0" width="120" height="90" fill="${p.cab}"/>${head}${volume(7, 6, 106, 78)}</g>${linha(CABECA)}
</svg>`
}

export function figura(personalidade, poder, caracter) {
  const svg = figuraSVG(personalidade, poder, caracter)
  return {
    svg,
    src: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg),
    tagline: taglineDe('personalidade', personalidade) || taglineDe('poder', poder) || 'O teu MighT',
  }
}
