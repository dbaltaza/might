// Parte C: o boneco MighT.
// figura(personalidade, poder, caracter) → { src, tagline, svg }
// Um só "artista" (estilo procedimental coerente): silhueta MighT com contorno de autocolante,
// a cabeça decorada pela Personalidade, o corpo pelo Poder e os braços pelo Carácter.
// A mesma combinação de palavras dá sempre a mesma figura (determinístico).
import { tagline as taglineDe } from '../logica/index.js'

const PALETAS = [
  { nome: 'oceano', base: '#2c6db3', fundo: '#123f73', a1: '#f06a8f', a2: '#d9f26a', luz: '#bfe0ff' },
  { nome: 'ameixa', base: '#7b3a86', fundo: '#4a1652', a1: '#f3b33d', a2: '#9fe0d8', luz: '#f2d2f5' },
  { nome: 'coral', base: '#e2725b', fundo: '#8c2f39', a1: '#2f6fb5', a2: '#ffe08a', luz: '#ffd9cc' },
  { nome: 'musgo', base: '#3d9061', fundo: '#1d5238', a1: '#f0a33c', a2: '#c7b8ff', luz: '#dbf2e5' },
  { nome: 'noite', base: '#353852', fundo: '#1c1e28', a1: '#ef6f8f', a2: '#5fd6b0', luz: '#c9cbe0' },
  { nome: 'areia', base: '#e0a548', fundo: '#8a4f12', a1: '#144b86', a2: '#e94d7b', luz: '#fff1d0' },
]

function hash(s = '') {
  let h = 2166136261
  for (const c of s) h = Math.imul(h ^ c.codePointAt(0), 16777619)
  return h >>> 0
}
const pick = (arr, s, sal = '') => arr[hash(sal + s) % arr.length]

// Formas (mesmas da silhueta do front end, viewBox 0 0 120 140)
const CABECA = 'M60 8c19 0 33 11 36 27 9 1 16 8 16 17s-7 16-16 17c-6 9-20 14-36 14s-30-5-36-14C15 68 8 61 8 52s7-16 16-17C27 19 41 8 60 8z'
const CORPO = 'M36 74h48a8 8 0 0 1 8 8v40a12 12 0 0 1-12 12H68a4 4 0 0 1-4-4v-6a4 4 0 0 0-8 0v6a4 4 0 0 1-4 4H40a12 12 0 0 1-12-12V82a8 8 0 0 1 8-8z'
const BRACOS = '<rect x="14" y="78" width="17" height="46" rx="8.5"/><rect x="89" y="78" width="17" height="46" rx="8.5"/>'

const petalas = (cx, cy, n, r, w, cor) =>
  Array.from({ length: n }, (_, i) => `<ellipse cx="${cx}" cy="${cy - r}" rx="${w}" ry="${r * 0.62}" fill="${cor}" transform="rotate(${(360 / n) * i} ${cx} ${cy})"/>`).join('')
const estrela = (cx, cy, r1, r2, n) =>
  Array.from({ length: n * 2 }, (_, i) => {
    const r = i % 2 ? r2 : r1
    const a = (Math.PI / n) * i - Math.PI / 2
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`
  }).join(' ')
const olho = (cx, cy, p) => `<circle cx="${cx}" cy="${cy}" r="12" fill="${p.luz}"/><circle cx="${cx}" cy="${cy}" r="7.5" fill="${p.a1}"/><circle cx="${cx}" cy="${cy}" r="3.2" fill="${p.fundo}"/><circle cx="${cx - 3}" cy="${cy - 4}" r="2" fill="#fff"/>`
const coracao = (cx, cy, s, cor) => `<path transform="translate(${cx} ${cy}) scale(${s})" d="M0 6C-9-2-6-11 0-6C6-11 9-2 0 6z" fill="${cor}"/>`

// Cabeça · Personalidade
const MOTIVOS_CABECA = {
  olhos: (p) => olho(42, 46, p) + olho(78, 46, p) + `<circle cx="60" cy="22" r="4" fill="${p.a2}"/><circle cx="50" cy="26" r="2" fill="${p.luz}"/><circle cx="70" cy="26" r="2" fill="${p.luz}"/>`,
  flor: (p) => petalas(60, 46, 8, 20, 6.5, p.a1) + `<circle cx="60" cy="46" r="9" fill="${p.a2}"/><circle cx="60" cy="46" r="4" fill="${p.fundo}"/>`,
  estrela: (p) => `<polygon points="${estrela(60, 46, 24, 10, 8)}" fill="${p.a2}"/><circle cx="60" cy="46" r="7" fill="${p.a1}"/>` + [20, 100].map((x) => `<circle cx="${x}" cy="52" r="4" fill="${p.luz}"/>`).join(''),
  mandala: (p) => `<circle cx="60" cy="46" r="30" fill="none" stroke="${p.luz}" stroke-width="2.5" stroke-dasharray="3 4"/><circle cx="60" cy="46" r="21" fill="${p.a1}"/><circle cx="60" cy="46" r="13" fill="${p.luz}"/><circle cx="60" cy="46" r="6" fill="${p.fundo}"/>`,
  coracoes: (p) => coracao(42, 42, 1.5, p.a1) + coracao(78, 42, 1.5, p.a1) + coracao(60, 60, 1.9, p.a2),
  luas: (p) => [36, 60, 84].map((x, i) => `<circle cx="${x}" cy="${46 + (i === 1 ? -6 : 0)}" r="10" fill="${p.a2}"/><circle cx="${x + 4}" cy="${42 + (i === 1 ? -6 : 0)}" r="9" fill="${p.base}"/>`).join(''),
}

// Corpo · Poder
const linhas = (fn, de, ate, passo) => { let s = ''; for (let v = de; v <= ate; v += passo) s += fn(v); return s }
const MOTIVOS_CORPO = {
  ondas: (p) => linhas((y) => `<path d="M24 ${y}q9-7 18 0t18 0 18 0 18 0" fill="none" stroke="${y % 20 ? p.a2 : p.a1}" stroke-width="3.5"/>`, 82, 134, 10),
  chevron: (p) => linhas((y) => `<path d="M24 ${y}l36 14 36-14" fill="none" stroke="${y % 24 ? p.luz : p.a1}" stroke-width="4"/>`, 72, 130, 12),
  pontos: (p) => linhas((y) => linhas((x) => `<circle cx="${x + ((y / 9) % 2 ? 4.5 : 0)}" cy="${y}" r="2.6" fill="${p.a2}"/>`, 30, 92, 9), 82, 132, 9),
  raios: (p) => Array.from({ length: 9 }, (_, i) => `<path d="M60 76L${22 + i * 9.5} 140" stroke="${i % 2 ? p.a1 : p.luz}" stroke-width="4"/>`).join(''),
  escamas: (p) => linhas((y) => linhas((x) => `<path d="M${x - 7} ${y}a7 7 0 0 1 14 0" fill="none" stroke="${p.luz}" stroke-width="2.2"/>`, (y / 8) % 2 ? 30 : 37, 92, 14), 80, 134, 8),
  losangos: (p) => linhas((y) => linhas((x) => `<path d="M${x} ${y - 6}l6 6-6 6-6-6z" fill="${(x + y) % 3 ? p.a2 : p.a1}"/>`, 34, 90, 14), 84, 132, 14),
}

// Braços · Carácter
const MOTIVOS_BRACOS = {
  aneis: (p) => [88, 102, 116].map((y) => `<rect x="10" y="${y - 2}" width="100" height="4" fill="${p.a1}"/>`).join(''),
  riscas: (p) => linhas((y) => `<path d="M8 ${y}l100 -14" stroke="${p.a2}" stroke-width="3"/>`, 84, 136, 8),
  gotas: (p) => [[22.5, 90], [22.5, 108], [97.5, 90], [97.5, 108]].map(([x, y]) => `<path d="M${x} ${y - 6}c4 5 4 8 0 10c-4-2-4-5 0-10z" fill="${p.a2}"/>`).join(''),
  pontos: (p) => linhas((y) => `<circle cx="22.5" cy="${y}" r="2.8" fill="${p.luz}"/><circle cx="97.5" cy="${y}" r="2.8" fill="${p.luz}"/>`, 86, 120, 8),
}

export function figuraSVG(personalidade = '', poder = '', caracter = '') {
  const p = pick(PALETAS, personalidade + '|' + caracter, 'pal')
  const mc = MOTIVOS_CABECA[pick(Object.keys(MOTIVOS_CABECA), personalidade, 'c')]
  const mb = MOTIVOS_CORPO[pick(Object.keys(MOTIVOS_CORPO), poder, 'b')]
  const mr = MOTIVOS_BRACOS[pick(Object.keys(MOTIVOS_BRACOS), caracter, 'r')]
  const id = 'f' + hash(personalidade + poder + caracter).toString(36)
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-6 -4 132 152">
  <defs>
    <clipPath id="${id}c"><path d="${CABECA}"/></clipPath>
    <clipPath id="${id}b"><path d="${CORPO}"/></clipPath>
    <clipPath id="${id}r">${BRACOS}</clipPath>
    <radialGradient id="${id}v" cx="0.35" cy="0.25" r="0.9"><stop offset="0" stop-color="#fff" stop-opacity="0.28"/><stop offset="0.6" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.22"/></radialGradient>
  </defs>
  <ellipse cx="60" cy="140" rx="40" ry="4" fill="#000" opacity="0.18"/>
  <g fill="#fff" stroke="#fff" stroke-width="9" stroke-linejoin="round">${BRACOS}<path d="${CORPO}"/><path d="${CABECA}"/></g>
  <g fill="${p.fundo}">${BRACOS}</g>
  <g clip-path="url(#${id}r)">${mr(p)}</g>
  <g fill="none" stroke="${p.fundo}" stroke-width="1.6" opacity="0.6">${BRACOS}</g>
  <path d="${CORPO}" fill="${p.base}"/>
  <g clip-path="url(#${id}b)">${mb(p)}<rect x="0" y="70" width="120" height="70" fill="url(#${id}v)"/></g>
  <path d="${CORPO}" fill="none" stroke="${p.fundo}" stroke-width="1.6" opacity="0.6"/>
  <path d="${CABECA}" fill="${p.base}"/>
  <g clip-path="url(#${id}c)">${mc(p)}<rect x="0" y="0" width="120" height="90" fill="url(#${id}v)"/></g>
  <path d="${CABECA}" fill="none" stroke="${p.fundo}" stroke-width="1.6" opacity="0.6"/>
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
