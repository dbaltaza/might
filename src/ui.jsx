import { Link } from 'react-router-dom'
import { TAGS, DIMS, DIM_NOME, CIRCULOS, tagline } from '../logica/index.js'

const PARTE = { personalidade: 'Cabeça', poder: 'Braço', caracter: 'Mão' }

export function EscolherTags({ valor, onChange }) {
  return DIMS.map((d) => (
    <div key={d} className="grupo">
      <div className="rotulo">{PARTE[d]} · <b>{DIM_NOME[d]}</b>{valor[d] && <span className="tl"> “{tagline(d, valor[d])}”</span>}</div>
      <div className="chips">
        {TAGS[d].map(({ tag }) => (
          <button type="button" key={tag} className={'chip' + (valor[d] === tag ? ' on' : '')} onClick={() => onChange({ ...valor, [d]: tag })}>
            {tag}
          </button>
        ))}
      </div>
    </div>
  ))
}

export function EscolherCirculo({ valor, onChange }) {
  return (
    <div className="chips">
      {CIRCULOS.map((c) => (
        <button type="button" key={c} className={'chip' + (valor === c ? ' on' : '')} onClick={() => onChange(c)}>{c}</button>
      ))}
    </div>
  )
}

export const tagsCompletas = (t) => DIMS.every((d) => t[d])

// Barreira dos passos 3–6: nunca um beco sem saída.
export function Barreira({ eu, children }) {
  if (!eu.id) {
    return (
      <>
        <h1>Primeiro, o teu MighT</h1>
        <p>Demora menos de 2 minutos.</p>
        <Link className="btn" to="/criar">Criar o meu MighT</Link>
      </>
    )
  }
  if (!eu.carregado) return <p>A carregar…</p>
  if (!eu.desbloqueado) {
    return (
      <>
        <div className="passo">Perfil bloqueado</div>
        <h1>Faltam {eu.faltam} MighT{eu.faltam === 1 ? '' : 's'}</h1>
        <p>O teu perfil abre com 3 MighTs aceites. Pede a quem te conhece bem.</p>
        <Progresso n={eu.aceites.length} />
        <Link className="btn" to="/pedir">Pedir MighTs</Link>
        <Link className="btn sec" to="/caixa">Ver a minha caixa</Link>
      </>
    )
  }
  return children
}

export const Progresso = ({ n, total = 3 }) => (
  <div className="prog"><div style={{ width: `${Math.min(100, (n / total) * 100)}%` }} /><span>{Math.min(n, total)}/{total} aceites</span></div>
)
