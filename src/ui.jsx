import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { TAGS, DIMS, DIM_NOME, CIRCULOS, tagline } from '../logica/index.js'
import Silhueta from './Silhueta.jsx'
import { MODO } from './db.js'

// Links de demo (simular, recomeçar): só em modo local ou com ?demo no endereço (ex.: #/caixa?demo).
export const demo = () => MODO === 'local' || location.hash.includes('demo')

export const PARTE = { personalidade: 'Cabeça', poder: 'Corpo', caracter: 'Braços' }

const de = (n) => (n === 'essa pessoa' ? 'dessa pessoa' : `de ${n}`)
const PERGUNTA = {
  personalidade: (n) => (n ? `Que palavra descreve melhor a personalidade ${de(n)}?` : 'Que palavra descreve melhor a tua personalidade?'),
  poder: (n) => (n ? `Qual é o talento natural ${de(n)}?` : 'Qual é o teu talento natural?'),
  caracter: (n) => (n ? `Que valor marca ${n}?` : 'Que valor te marca?'),
}

// Três palavras, uma de cada vez. Ao tocar numa, passa à seguinte (o 1.º MighT em menos de 2 minutos).
// onAtiva avisa o ecrã da dimensão ativa (para a pré-visualização grande no ecrã largo).
export function TresPalavras({ valor, onChange, sobre, onAtiva }) {
  const primeiraVazia = DIMS.find((d) => !valor[d]) ?? DIMS[2]
  const [ativa, setAtiva] = useState(primeiraVazia)
  useEffect(() => { onAtiva?.(ativa) }, [ativa, onAtiva])
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
            <small><Silhueta tags={{ [d]: true }} tamanho={14} />{DIM_NOME[d]}</small>
            {valor[d] ? <b>{valor[d]}</b> : <b className="vazio">Escolher</b>}
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
            {valor[ativa] === tag && <span className="mosaico-tl">«{tagline(ativa, tag)}»</span>}
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
      <Link to="/" className="marca" aria-label="MighT, início"><span className="marca-logo" /></Link>
      {passo && <span className="passo-n">{passo}</span>}
    </div>
  )
}

// Carregar: nunca um ecrã vazio. Silhueta calma + frase; ao fim de 8 s, erro com nova tentativa.
export function Carregar({ eu }) {
  const [lento, setLento] = useState(false)
  useEffect(() => { const t = setTimeout(() => setLento(true), 8000); return () => clearTimeout(t) }, [])
  return (
    <>
      <Topo />
      <div className="carregar" role="status" aria-live="polite">
        <div className="carregar-fig"><Silhueta tags={{}} tamanho={120} /></div>
        {lento
          ? <>
              <p className="erro">Não conseguimos carregar. Verifica a ligação.</p>
              <button className="btn sec" onClick={() => { setLento(false); eu?.recarregar?.() }}>Tentar outra vez</button>
            </>
          : <p className="lead">A carregar o teu MighT…</p>}
      </div>
    </>
  )
}

// Barreira dos separadores: nunca um beco sem saída. O título diz o que abre. livre = abre sem os 3 MighTs.
export function Barreira({ eu, titulo = 'O teu perfil abre com 3 MighTs', children, livre = false }) {
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
  if (!eu.carregado) return <Carregar eu={eu} />
  if (!eu.desbloqueado && !livre) {
    return (
      <>
        <Topo />
        <h1>{titulo}</h1>
        <p className="lead">Faltam {eu.faltam} MighT{eu.faltam === 1 ? '' : 's'}. Aceita os de quem te conhece e esta parte abre.</p>
        <Progresso n={eu.aceites.length} />
        <Link className="btn" to="/pedir">Pedir MighTs</Link>
        <Link className="btn sec" to="/caixa">Ver a minha caixa</Link>
      </>
    )
  }
  return children
}
