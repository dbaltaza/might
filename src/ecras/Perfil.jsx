import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useEu, topTag } from '../estado.js'
import { Barreira } from '../ui.jsx'
import { pesos, DIMS, DIM_NOME } from '../../logica/index.js'

// Passo 3: All MighT. Nuvem por dimensão, filtro por círculo, comparar com o Self MighT.
export default function Perfil() {
  const eu = useEu()
  const [circulo, setCirculo] = useState('Todos')
  return (
    <Barreira eu={eu}>
      <Conteudo eu={eu} circulo={circulo} setCirculo={setCirculo} />
    </Barreira>
  )
}

function Conteudo({ eu, circulo, setCirculo }) {
  const circulos = ['Todos', ...new Set(eu.aceites.map((m) => m.circulo))]
  const base = circulo === 'Todos' ? eu.recebidos : eu.recebidos.filter((m) => m.circulo === circulo)
  const w = pesos(base)
  const n = base.filter((m) => m.estado === 'aceite').length
  return (
    <>
      <div className="passo">Passo 3 · All MighT</div>
      <h1>{eu.pessoa?.nome}, pelos olhos de {n} pessoa{n === 1 ? '' : 's'}</h1>
      <div className="chips">
        {circulos.map((c) => <button key={c} className={'chip' + (c === circulo ? ' on' : '')} onClick={() => setCirculo(c)}>{c}</button>)}
      </div>
      {DIMS.map((d) => {
        const lista = Object.entries(w[d] || {}).sort((a, b) => b[1] - a[1])
        const meu = eu.self?.[d]
        const topo = topTag(w[d])
        const estado = !meu ? null : (w[d]?.[meu] ? 'confirma' : 'so-tu')
        return (
          <div key={d} className="cartao">
            <div className="rotulo"><b>{DIM_NOME[d]}</b></div>
            <div className="nuvem">
              {lista.map(([t, p]) => (
                <span key={t} className={t === meu ? 'meu' : ''} style={{ fontSize: 13 + p * 26 }} title={`${t}: ${Math.round(p * 100)}%`}>
                  {t} <small>{Math.round(p * 100)}%</small>
                </span>
              ))}
            </div>
            {meu && (
              <div className={'compara ' + estado}>
                {estado === 'confirma'
                  ? <>✓ Tu disseste <b>{meu}</b> e os outros confirmam ({Math.round(w[d][meu] * 100)}%).</>
                  : <>Tu disseste <b>{meu}</b>; os outros veem mais <b>{topo}</b>. Ponto cego?</>}
              </div>
            )}
          </div>
        )
      })}
      <p className="nota">Peso = vezes que a palavra foi escolhida ÷ total de MighTs aceites nesta dimensão.</p>
      <Link className="btn lima" to="/card">Criar o meu MighT Card</Link>
    </>
  )
}
