import { ARTISTAS } from './artistas.js'
import { figura } from '../figura/index.js'

// «Escolhe o teu artista»: fila horizontal. A 1.ª opção é a figura gerada pelas tuas palavras.
export default function EscolherArtista({ valor = 'palavras', onChange, tags }) {
  const tuas = figura(tags.personalidade, tags.poder, tags.caracter)
  return (
    <div className="artistas">
      <div className="rotulo">Escolhe o teu artista</div>
      <div className="artistas-fila" role="radiogroup" aria-label="Artista da tua figura">
        {ARTISTAS.map((a) => (
          <button key={a.id} type="button" role="radio" aria-checked={valor === a.id}
            className={'artista ' + a.tipo + (valor === a.id ? ' on' : '')} onClick={() => onChange(a.id)}>
            <span className="artista-img"><img src={a.tipo === 'palavras' ? tuas.src : a.src} alt="" loading="lazy" /></span>
            <span className="artista-nome">{a.nome}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
