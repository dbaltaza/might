import { useState } from 'react'
import { Link } from 'react-router-dom'
import { TAGS, DIMS, DIM_NOME, CIRCULOS, tagline } from '../logica/index.js'
import Silhueta from './Silhueta.jsx'

export const PARTE = { personalidade: 'Cabeça', poder: 'Corpo', caracter: 'Braços' }

const PERGUNTA = {
  personalidade: (n) => (n ? `Que palavra descreve melhor a personalidade de ${n}?` : 'Que palavra descreve melhor a tua personalidade?'),
  poder: (n) => (n ? `Em que é que ${n} é naturalmente bom?` : 'Em que és naturalmente bom?'),
  caracter: (n) => (n ? `Que valor marca ${n}?` : 'Que valor te marca?'),
}

// Três palavras, uma de cada vez. Ao tocar numa, passa à seguinte (o 1.º MighT em menos de 2 minutos).
export function TresPalavras({ valor, onChange, sobre }) {
  const primeiraVazia = DIMS.find((d) => !valor[d]) ?? DIMS[2]
  const [ativa, setAtiva] = useState(primeiraVazia)
  function escolher(tag) {
    const novo = { ...valor, [ativa]: tag }
    onChange(novo)
    const seguinte = DIMS.find((d) => !novo[d])
    if (seguinte) setAtiva(seguinte)
  }
  return (
    <>
      <div className="dims" role="tablist">
        {DIMS.map((d) => (
          <button key={d} role="tab" aria-selected={ativa === d} className={'dim' + (ativa === d ? ' ativa' : '')} onClick={() => setAtiva(d)}>
            <small>{PARTE[d]} · {DIM_NOME[d]}</small>
            <b>{valor[d] || '—'}</b>
          </button>
        ))}
      </div>
      <div className="pergunta">
        <p>{PERGUNTA[ativa](sobre)}</p>
        <Silhueta tags={valor} ativa={ativa} />
      </div>
      <div className="mosaicos">
        {TAGS[ativa].map(({ tag }) => (
          <button type="button" key={tag} className={'mosaico' + (valor[ativa] === tag ? ' on' : '')} onClick={() => escolher(tag)}>
            {tag}
            {valor[ativa] === tag && <span className="mosaico-tl">“{tagline(ativa, tag)}”</span>}
          </button>
        ))}
      </div>
    </>
  )
}

export function EscolherCirculo({ valor, onChange }) {
  return (
    <div className="circulos">
      {CIRCULOS.map((c) => (
        <button type="button" key={c} className={'circulo' + (valor === c ? ' on' : '')} onClick={() => onChange(c)}>{c}</button>
      ))}
    </div>
  )
}

export const tagsCompletas = (t) => DIMS.every((d) => t[d])
export const inicial = (nome) => (nome || '?').trim().charAt(0).toUpperCase()

export function Progresso({ n, total = 3 }) {
  return (
    <div className="progresso" aria-label={`${Math.min(n, total)} de ${total} MighTs aceites`}>
      {Array.from({ length: total }, (_, i) => <i key={i} className={i < n ? 'on' : ''} />)}
    </div>
  )
}

export function Topo({ passo }) {
  return (
    <div className="topo">
      <Link to="/" className="marca" aria-label="MighT, início">MighT<i>.</i></Link>
      {passo && <span className="passo-n">{passo}</span>}
    </div>
  )
}

// Barreira dos passos 3–6: nunca um beco sem saída.
export function Barreira({ eu, children }) {
  if (!eu.id) {
    return (
      <>
        <Topo />
        <h1>Começa pelo teu MighT</h1>
        <p className="lead">Três palavras sobre ti. Demora menos de 2 minutos.</p>
        <Link className="btn" to="/criar">Criar o meu MighT</Link>
      </>
    )
  }
  if (!eu.carregado) return <Topo />
  if (!eu.desbloqueado) {
    return (
      <>
        <Topo passo="Perfil bloqueado" />
        <h1>Faltam {eu.faltam} MighT{eu.faltam === 1 ? '' : 's'}</h1>
        <p className="lead">O teu perfil abre quando aceitares 3 MighTs de quem te conhece.</p>
        <Progresso n={eu.aceites.length} />
        <Link className="btn" to="/pedir">Pedir MighTs</Link>
        <Link className="btn sec" to="/caixa">Ver a minha caixa</Link>
      </>
    )
  }
  return children
}
