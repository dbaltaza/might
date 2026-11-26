import { figura, CABECA, CORPO, BRACO_E, BRACO_D } from '../figura/index.js'
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
      {/* braços: Carácter · corpo: Poder · cabeça: Personalidade (mesmas formas da figura) */}
      <g fill={cor('caracter')} {...contorno('caracter')}><path d={BRACO_E} /><path d={BRACO_D} /></g>
      <path d={CORPO} fill={cor('poder')} {...contorno('poder')} />
      <path d={CABECA} fill={cor('personalidade')} {...contorno('personalidade')} />
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
