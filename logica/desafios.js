// Duelo MighT: duas pessoas com a mesma palavra provam-na num desafio desse tipo.
// ponytail: famílias de palavras em vez de 61 desafios, um por tag; acrescentem tags/desafios à vontade.
export const FAMILIAS = [
  { nome: 'Competitivo', tags: ['Competitivo', 'Vencedor'], jogo: 'cobra',
    desafios: ['Snake a dois, ao mesmo tempo: comam as maçãs e cresçam. Quem bater primeiro perde.'] },
  { nome: 'Criativo', tags: ['Imaginativo', 'Criador', 'Inovador', 'Ilustrador', 'Compositor', 'Escritor', 'Conceptualizador', 'Liberdade'],
    desafios: ['Inventem um produto que não existe: nome + slogan.', 'Desenhem um animal que ainda ninguém viu. A sala escolhe.', 'Contem uma história com 3 palavras dadas pela sala.'] },
  { nome: 'Lógico', tags: ['Lógico', 'Esperto', 'Inteligente', 'Analisador', 'Investigador', 'Estratega', 'Solucionador', 'Planeador'],
    desafios: ['Quantas bolas de ténis cabem nesta sala? Ganha quem explicar melhor o raciocínio.', 'Planeiem a demo de amanhã em 5 passos. A sala vota no plano mais claro.'] },
  { nome: 'Social', tags: ['Extrovertido', 'Divertido', 'Comunicador', 'Animador', 'Conector', 'Persuasivo', 'Influenciador', 'Motivador', 'Energizador'],
    desafios: ['Vendam a ideia da vossa equipa à sala.', 'Ponham a sala a rir sem dizer uma palavra.'] },
  { nome: 'Empático', tags: ['Empático', 'Sensível', 'Intuitivo', 'Conselheiro', 'Compaixão', 'Altruísmo', 'Generosidade', 'Solidariedade', 'Tolerância'],
    desafios: ['Adivinhem como alguém da sala se sente hoje. Essa pessoa decide.', 'Deem o melhor conselho a um problema que a sala inventar.'] },
  { nome: 'Líder', tags: ['Líder', 'Confiante', 'Objectivo', 'Organizador', 'Moderador', 'Empreendedor', 'Coragem'],
    desafios: ['Ponham 4 pessoas da sala em fila por altura sem tocar nelas. Ganha o mais rápido.', 'Convençam a sala a decidir o almoço de amanhã.'] },
]
// Duelo aéreo: sempre disponível na aba Duelos, contra qualquer pessoa, com ou sem palavra em comum.
export const AVIAO = { familia: 'Aéreo', jogo: 'voo', texto: 'Duelo aéreo: os dois ao mesmo tempo, 3 vidas cada. Quem abate o outro ganha.' }
const GERAL = ['Provem a palavra que partilham. A sala decide quem a mostrou melhor.']

const temJogo = (t) => FAMILIAS.some((f) => f.jogo && f.tags.includes(t))

// Palavra partilhada: uma com jogo ganha sempre (competitivos jogam); senão, a de maior peso mínimo.
export function palavraComum(pa, pb, dims = ['personalidade', 'poder', 'caracter']) {
  let melhor = null
  for (const d of dims) for (const t in pa[d] || {}) {
    const min = Math.min(pa[d][t], pb[d]?.[t] || 0)
    const w = min + (min > 0 && temJogo(t) ? 1 : 0)
    if (min > 0 && (!melhor || w > melhor.w)) melhor = { tag: t, dim: d, w }
  }
  return melhor
}

// Desafio para a palavra: da família dela, ou geral. `n` roda entre desafios ("outro desafio").
export function desafio(tag, n = 0) {
  const f = FAMILIAS.find((x) => x.tags.includes(tag))
  const lista = f ? f.desafios : GERAL
  return { familia: f?.nome ?? null, jogo: f?.jogo ?? null, texto: lista[n % lista.length] }
}
