// Parte A: lógica. Substituam o corpo das funções, NÃO as assinaturas (o front end já as usa).
import TAGS_JSON from './tags.json'
import PESSOAS_JSON from './pessoas_ficticias.json'
import FUNCOES_JSON from './funcoes.json'
import DESCRICOES from './descricoes.json'

export const DIMS = ['personalidade', 'poder', 'caracter']
export const DIM_NOME = { personalidade: 'Personalidade', poder: 'Poder', caracter: 'Carácter' }
export const CIRCULOS = ['Família', 'Amigos', 'Colegas', 'Escola', 'Comunidade', 'Clientes']

// { personalidade: [{tag, tagline}], poder: [...], caracter: [...] }
export const TAGS = TAGS_JSON

// [{ id, nome, self: {personalidade, poder, caracter}, mights: [{de, circulo, personalidade, poder, caracter, estado}] }]
export const PESSOAS_FICTICIAS = PESSOAS_JSON.pessoas

// Descrição curta de cada palavra (escrita com IA, ver descricoes.json)
export const descricao = (dim, tag) => DESCRICOES[dim]?.[tag] ?? ''

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

// Funções e percursos (algoritmo e funções da Parte A, em logica/logica.js e funcoes.json).
// Encaixe de uma função = soma dos teus pesos nas palavras dessa função.
// Agora = a que mais encaixa em ti. Próximo = a mais comum entre as 3 pessoas mais parecidas contigo.
// Desafio = a que mais encaixa na pessoa mais parecida, entre as que ainda não tens. Só hipóteses.
export const FUNCOES = FUNCOES_JSON.funcoes
const encaixe = (f, w) => DIMS.reduce((s, d) => s + f.tags.reduce((t, tag) => t + (w[d]?.[tag] || 0), 0), 0)
const melhores = (w) => [...FUNCOES].sort((a, b) => encaixe(b, w) - encaixe(a, w) || a.funcao.localeCompare(b.funcao))
const emComum = (f, w) => f.tags.filter((t) => DIMS.some((d) => w[d]?.[t]))

// eu = { pesos }. Devolve { agora, proximo, desafio, comoTu: [{nome, pct, funcao}] }; cada função traz tagsEmComum.
export function funcoesIdeais(eu, todos = PESSOAS_FICTICIAS) {
  const parecidos = maisParecidos(eu, todos).slice(0, 3)
  const minhas = melhores(eu.pesos)
  const agora = minhas[0]
  const comoTu = parecidos.map((x) => ({ nome: x.pessoa.nome, pct: x.pct, funcao: melhores(pesos(x.pessoa.mights))[0].funcao }))
  const conta = {}
  for (const c of comoTu) if (c.funcao !== agora.funcao) conta[c.funcao] = (conta[c.funcao] || 0) + 1
  const topo = Object.keys(conta).sort((a, b) => conta[b] - conta[a])[0]
  const proximo = FUNCOES.find((f) => f.funcao === topo) || minhas[1]
  const usadas = [agora.funcao, proximo.funcao]
  const base = parecidos[0] ? melhores(pesos(parecidos[0].pessoa.mights)) : minhas
  const desafio = base.find((f) => !usadas.includes(f.funcao)) || minhas.find((f) => !usadas.includes(f.funcao))
  const com = (f) => ({ ...f, tagsEmComum: emComum(f, eu.pesos) })
  return { agora: com(agora), proximo: com(proximo), desafio: com(desafio), comoTu }
}
