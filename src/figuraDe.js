import { figura } from '../figura/index.js'
import { artista } from './artistas.js'

// A figura de uma pessoa: a obra do artista que escolheu, ou a figura gerada pelas palavras.
// A tagline vem sempre das palavras. moldura=true para obras com fundo (mostrar numa moldura escura).
export function figuraDe(pessoa, tags = {}) {
  const f = figura(tags.personalidade, tags.poder, tags.caracter)
  const a = artista(pessoa?.artista)
  if (a.tipo === 'palavras') return { ...f, artista: null, moldura: false }
  return { src: a.src, tagline: f.tagline, artista: a.nome, moldura: a.tipo === 'obra' }
}
