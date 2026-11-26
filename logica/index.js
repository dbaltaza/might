// Parte A: lógica. Substituam o corpo das funções, NÃO as assinaturas (o front end já as usa).
import TAGS_JSON from './tags.json'
import PESSOAS_JSON from './pessoas_ficticias.json'
import FUNCOES_JSON from './funcoes.json'

export const DIMS = ['personalidade', 'poder', 'caracter']
export const DIM_NOME = { personalidade: 'Personalidade', poder: 'Poder', caracter: 'Carácter' }
export const CIRCULOS = ['Família', 'Amigos', 'Colegas', 'Escola', 'Comunidade', 'Clientes']

// { personalidade: [{tag, tagline}], poder: [...], caracter: [...] }
export const TAGS = TAGS_JSON

// [{ id, nome, self: {personalidade, poder, caracter}, mights: [{de, circulo, personalidade, poder, caracter, estado}] }]
export const PESSOAS_FICTICIAS = PESSOAS_JSON.pessoas

// [{ funcao, tags, agora, proximo, desafio, porque }]. Hipóteses, não conselhos.
export const FUNCOES = FUNCOES_JSON.funcoes

export function tagline(dim, tag) {
  return TAGS[dim]?.find((t) => t.tag === tag)?.tagline ?? ''
}

const aceites = (mights) => mights.filter((m) => m.estado === 'aceite')

// Peso = contagem ÷ total na dimensão. Devolve { personalidade: {tag: peso}, ... }
export function pesos(mights) {
  const out = {}
  const ok = aceites(mights)
  for (const d of DIMS) {
    const c = {}
    for (const m of ok) c[m[d]] = (c[m[d]] || 0) + 1
    const total = ok.length || 1
    out[d] = Object.fromEntries(Object.entries(c).map(([t, n]) => [t, n / total]))
  }
  return out
}

// Desbloqueio = 3 MighTs aceites
export const MIN_DESBLOQUEIO = 3
export function desbloqueado(mights) {
  return aceites(mights).length >= MIN_DESBLOQUEIO
}

// Semelhança = % de peso sobreposto: média das 3 dimensões de Σ min(wA, wB). 0–100.
export function semelhanca(pesosA, pesosB, dims = DIMS) {
  let s = 0
  for (const d of dims) {
    const a = pesosA[d] || {}
    const b = pesosB[d] || {}
    for (const t of Object.keys(a)) s += Math.min(a[t], b[t] || 0)
  }
  return Math.round((s / dims.length) * 100)
}

// eu = { pesos }, todos = PESSOAS_FICTICIAS. Devolve [{ pessoa, pct, comuns: [tags], diferenca: {dim, tag} }]
export function maisParecidos(eu, todos = PESSOAS_FICTICIAS, dims = DIMS) {
  return todos
    .map((p) => {
      const pp = pesos(p.mights)
      const comuns = []
      let diferenca = null
      let maior = -1
      for (const d of dims) {
        for (const t of new Set([...Object.keys(eu.pesos[d] || {}), ...Object.keys(pp[d] || {})])) {
          const a = eu.pesos[d]?.[t] || 0
          const b = pp[d]?.[t] || 0
          if (a > 0 && b > 0) comuns.push(t)
          if (Math.abs(a - b) > maior) { maior = Math.abs(a - b); diferenca = { dim: d, tag: t } }
        }
      }
      return { pessoa: p, pct: semelhanca(eu.pesos, pp, dims), comuns, diferenca }
    })
    .sort((x, y) => y.pct - x.pct)
}

// Encaixe de uma função num perfil: soma dos pesos das tags da função.
const encaixe = (f, p) => f.tags.reduce((s, t) => s + DIMS.reduce((x, d) => x + (p[d]?.[t] || 0), 0), 0)

// Funções de pessoas como tu: o teu encaixe + o encaixe médio das 3 pessoas mais parecidas.
// Devolve as 3 melhores: [{ funcao, agora, proximo, desafio, porque }]. Só hipóteses.
export function funcoesIdeais(eu, todos = PESSOAS_FICTICIAS, funcoes = FUNCOES, n = 3) {
  const parecidos = maisParecidos(eu, todos).slice(0, 3).map((x) => pesos(x.pessoa.mights))
  const nota = (f) => encaixe(f, eu.pesos) + parecidos.reduce((s, p) => s + encaixe(f, p), 0) / (parecidos.length || 1)
  return [...funcoes]
    .sort((a, b) => nota(b) - nota(a))
    .slice(0, n)
    .map((f) => {
      const tuas = f.tags.filter((t) => DIMS.some((d) => eu.pesos[d]?.[t]))
      const lista = tuas.length > 1 ? `${tuas.slice(0, -1).join(', ')} e ${tuas.at(-1)}` : tuas[0]
      const visto = tuas.length ? `Quem te conhece diz ${lista}: ` : 'Pessoas como tu seguem este caminho: '
      return { funcao: f.funcao, agora: f.agora, proximo: f.proximo, desafio: f.desafio, porque: visto + f.porque }
    })
}
