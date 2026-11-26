import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useEu, topTag } from '../estado.js'
import { figuraDe } from '../figuraDe.js'
import FiguraVista from '../FiguraVista.jsx'
import { Barreira, Topo, PARTE } from '../ui.jsx'
import { pesos, DIMS, DIM_NOME } from '../../logica/index.js'

// Passo 3: All MighT. Self vs outros nas três cores da marca, nuvem com pesos, filtro por círculo.
export default function Perfil() {
  const eu = useEu()
  return <Barreira eu={eu}><Conteudo eu={eu} /></Barreira>
}

function Conteudo({ eu }) {
  const [circulo, setCirculo] = useState('Todos')
  const circulos = ['Todos', ...new Set(eu.aceites.map((m) => m.circulo))]
  const base = circulo === 'Todos' ? eu.recebidos : eu.recebidos.filter((m) => m.circulo === circulo)
  const w = pesos(base)
  const n = base.filter((m) => m.estado === 'aceite').length
  const fig = figuraDe(eu.pessoa, { personalidade: topTag(w.personalidade), poder: topTag(w.poder), caracter: topTag(w.caracter) })
  const s = eu.self || {}

  // Confirmado: tu e os outros. Superpoderes: os outros veem, tu não disseste. Talento escondido: só tu vês.
  const conf = [], sup = [], oculto = []
  for (const d of DIMS) {
    const lista = Object.entries(w[d] || {}).sort((a, b) => b[1] - a[1])
    if (s[d] && w[d]?.[s[d]]) conf.push({ d, t: s[d], p: w[d][s[d]] })
    else if (s[d]) oculto.push({ d, t: s[d] })
    lista.filter(([t]) => t !== s[d]).slice(0, 2).forEach(([t, p]) => sup.push({ d, t, p }))
  }
  const pct = (p) => `${Math.round(p * 100)}%`

  return (
    <>
      <Topo passo="3 de 6 · All MighT" />
      <div className="duas-colunas">
      <div className="col-hero">
      <div className="segmentos" style={{ marginBottom: 8, flexWrap: 'wrap' }}>
        {circulos.map((c) => <button key={c} className={c === circulo ? 'on' : ''} onClick={() => setCirculo(c)}>{c}</button>)}
      </div>
      <FiguraVista fig={fig} alt="A tua figura vista pelos outros" />
      <h1 style={{ textAlign: 'center', marginTop: 0 }}>{eu.pessoa?.nome}, por {n} pessoa{n === 1 ? '' : 's'}</h1>
      <div className="tres">
        {DIMS.map((d) => <div key={d}><small>{PARTE[d]}</small>{topTag(w[d]) || '—'}</div>)}
      </div>
      </div>
      <div className="col-conteudo">
      <div className="vidro">
        <h2>Tu e os outros</h2>
        {conf.length > 0 && (
          <div className="grupo-cmp cmp-conf">
            <h3>Confirmado</h3>
            <p>Tu disseste e os outros concordam.</p>
            <div className="etiquetas">{conf.map((x) => <span key={x.t} className="etiqueta">{x.t}<small>{pct(x.p)}</small></span>)}</div>
          </div>
        )}
        {sup.length > 0 && (
          <div className="grupo-cmp cmp-super">
            <h3>Superpoderes</h3>
            <p>Os outros veem em ti e tu não disseste.</p>
            <div className="etiquetas">{sup.map((x) => <span key={x.d + x.t} className="etiqueta">{x.t}<small>{pct(x.p)}</small></span>)}</div>
          </div>
        )}
        {oculto.length > 0 && (
          <div className="grupo-cmp cmp-oculto">
            <h3>Talentos escondidos</h3>
            <p>Tu vês em ti; quem te reconheceu ainda não.</p>
            <div className="etiquetas">{oculto.map((x) => <span key={x.t} className="etiqueta">{x.t}</span>)}</div>
          </div>
        )}
      </div>

      <div className="vidro">
        <h2>A tua nuvem</h2>
        {DIMS.map((d) => (
          <div key={d}>
            <p className="nuvem-dim">{DIM_NOME[d]}</p>
            <div className="nuvem">
              {Object.entries(w[d] || {}).sort((a, b) => b[1] - a[1]).map(([t, p]) => (
                <span key={t} style={{ fontSize: `${14 + p * 22}px` }}>{t}<small>{pct(p)}</small></span>
              ))}
            </div>
          </div>
        ))}
        <p className="nota">Peso de uma palavra = vezes que foi escolhida ÷ MighTs aceites nessa dimensão.</p>
      </div>
      <Link className="btn" to="/card">Criar o meu MighT Card</Link>
      </div>
      </div>
    </>
  )
}
