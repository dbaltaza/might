import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useEu } from '../estado.js'
import { Barreira } from '../ui.jsx'
import { maisParecidos, PESSOAS_FICTICIAS, DIMS, DIM_NOME } from '../../logica/index.js'

// Passo 5: pessoas como tu, por % de peso sobreposto.
export default function Descobrir() {
  const eu = useEu()
  return <Barreira eu={eu}><Conteudo eu={eu} /></Barreira>
}

function Conteudo({ eu }) {
  const [dim, setDim] = useState('todas')
  const dims = dim === 'todas' ? DIMS : [dim]
  const lista = maisParecidos({ pesos: eu.pesos }, PESSOAS_FICTICIAS, dims).slice(0, 8)
  return (
    <>
      <div className="passo">Passo 5 · Descobrir</div>
      <h1>Pessoas como tu</h1>
      <div className="chips">
        {['todas', ...DIMS].map((d) => (
          <button key={d} className={'chip' + (dim === d ? ' on' : '')} onClick={() => setDim(d)}>{d === 'todas' ? 'Todas' : DIM_NOME[d]}</button>
        ))}
      </div>
      {lista.map(({ pessoa, pct, comuns, diferenca }, i) => (
        <div key={pessoa.id} className={'cartao' + (i === 0 ? ' novo' : '')}>
          <div className="lado-txt"><b>{pessoa.nome}</b><span className="pct">{pct}%</span></div>
          <div className="nota">Em comum: {comuns.slice(0, 4).join(', ') || '—'}</div>
          {diferenca && <div className="nota">Maior diferença: {DIM_NOME[diferenca.dim]} · {diferenca.tag}</div>}
        </div>
      ))}
      <p className="nota">Semelhança = % de peso sobreposto nas tags (dados fictícios).</p>
      <Link className="btn lima" to="/funcoes">Ver funções que encaixam em mim</Link>
    </>
  )
}
