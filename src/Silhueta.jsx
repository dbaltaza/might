import { figura } from '../figura/index.js'
import { DIMS } from '../logica/index.js'

// Silhueta MighT (cabeça · corpo · braços) que se preenche à medida que escolhes as palavras.
// Forma tirada dos wireframes da marca; a arte final vem de figura() (Parte C).
const CHEIO = '#144b86'
const VAZIO = '#dce9f5'

export default function Silhueta({ tags = {}, ativa, tamanho = 96 }) {
  const cor = (d) => (tags[d] ? CHEIO : VAZIO)
  const contorno = (d) => (ativa === d ? { stroke: '#ffffff', strokeWidth: 2.5 } : {})
  return (
    <svg viewBox="0 0 120 140" width={tamanho} height={(tamanho * 140) / 120} aria-hidden="true">
      {/* braços: Carácter */}
      <g fill={cor('caracter')} {...contorno('caracter')}>
        <rect x="14" y="78" width="17" height="46" rx="8.5" />
        <rect x="89" y="78" width="17" height="46" rx="8.5" />
      </g>
      {/* corpo: Poder (com o recorte entre as pernas) */}
      <path fill={cor('poder')} {...contorno('poder')}
        d="M36 74h48a8 8 0 0 1 8 8v40a12 12 0 0 1-12 12H68a4 4 0 0 1-4-4v-6a4 4 0 0 0-8 0v6a4 4 0 0 1-4 4H40a12 12 0 0 1-12-12V82a8 8 0 0 1 8-8z" />
      {/* cabeça: Personalidade (nuvem com orelhas) */}
      <path fill={cor('personalidade')} {...contorno('personalidade')}
        d="M60 8c19 0 33 11 36 27 9 1 16 8 16 17s-7 16-16 17c-6 9-20 14-36 14s-30-5-36-14C15 68 8 61 8 52s7-16 16-17C27 19 41 8 60 8z" />
    </svg>
  )
}

// Pré-visualização grande para o ecrã largo (Criar, Enviar, Publico): a silhueta enche-se
// e, com as 3 palavras escolhidas, dá lugar à figura real com a sua frase.
export function PreviaFigura({ tags = {}, ativa }) {
  const n = DIMS.filter((d) => tags[d]).length
  if (n === DIMS.length) {
    const fig = figura(tags.personalidade, tags.poder, tags.caracter)
    return (
      <div className="previa">
        <div className="figura revela" key={fig.src}>
          <img src={fig.src} alt={`Figura MighT: ${tags.personalidade}, ${tags.poder}, ${tags.caracter}`} />
        </div>
        <div className="tagline">“{fig.tagline}”</div>
      </div>
    )
  }
  return (
    <div className="previa">
      <Silhueta tags={tags} ativa={ativa} tamanho={240} />
      <p className="previa-n">{n} de 3 palavras</p>
    </div>
  )
}
