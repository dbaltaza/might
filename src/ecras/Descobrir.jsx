import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useEu } from '../estado.js'
import { Barreira, Topo, inicial } from '../ui.jsx'
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
      <Topo passo="5 de 6 · Pessoas como tu" />
      <h1>Quem é reconhecido como tu</h1>
      <div className="segmentos" style={{ flexWrap: 'wrap' }}>
        {['todas', ...DIMS].map((d) => <button key={d} className={dim === d ? 'on' : ''} onClick={() => setDim(d)}>{d === 'todas' ? 'Tudo' : DIM_NOME[d]}</button>)}
      </div>
      <div className="vidro lista">
        {lista.map(({ pessoa, pct, comuns, diferenca }) => (
          <div key={pessoa.id} className="linha">
            <div className="avatar">{inicial(pessoa.nome)}</div>
            <div className="meio">
              <b>{pessoa.nome}</b>
              <div className="sub">Em comum: {comuns.slice(0, 3).join(', ') || 'nada ainda'}</div>
              {diferenca && <div className="sub">Maior diferença: {diferenca.tag} ({DIM_NOME[diferenca.dim]})</div>}
            </div>
            <div className="pct">{pct}%</div>
          </div>
        ))}
      </div>
      <p className="nota">Semelhança = quanto do peso das palavras de cada pessoa coincide com o teu. Pessoas e palavras fictícias.</p>
      <Link className="btn" to="/funcoes">Ver funções que encaixam em mim</Link>
    </>
  )
}
