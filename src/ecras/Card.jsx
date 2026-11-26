import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useEu, topTag } from '../estado.js'
import { Barreira, Topo } from '../ui.jsx'
import { figura } from '../../figura/index.js'
import { MightCard, descarregarPNG } from '../../card/MightCard.jsx'
import { sb } from '../db.js'

// Passo 4: MighT Card (o componente é da Parte B). Tu, pelos olhos dos outros.
export default function Card() {
  const eu = useEu()
  return <Barreira eu={eu}><Conteudo eu={eu} /></Barreira>
}

function Conteudo({ eu }) {
  const ref = useRef(null)
  const [formato, setFormato] = useState('retrato')
  const [publicar, setPublicar] = useState(null)
  const fig = figura(topTag(eu.pesos.personalidade), topTag(eu.pesos.poder), topTag(eu.pesos.caracter))
  const circulos = [...new Set(eu.aceites.map((m) => m.circulo))]

  async function responderPublicar(sim) {
    setPublicar(sim)
    if (sb) await sb.from('pessoas').update({ publico: sim }).eq('id', eu.id)
  }

  return (
    <>
      <Topo passo="4 de 6 · MighT Card" />
      <h1>Apresenta-te com provas</h1>
      <div className="segmentos">
        {[['retrato', 'Retrato'], ['linkedin', 'LinkedIn']].map(([f, t]) => (
          <button key={f} className={formato === f ? 'on' : ''} onClick={() => setFormato(f)}>{t}</button>
        ))}
      </div>
      <div className="card-palco">
        <MightCard ref={ref} formato={formato} pessoa={{ nome: eu.pessoa?.nome, tagline: fig.tagline, figura: fig.src }} pesos={eu.pesos} circulos={circulos} />
      </div>
      <button className="btn" onClick={() => descarregarPNG(ref, eu.pessoa?.nome)}>Descarregar PNG</button>
      <div className="vidro">
        <h2>Publicavas?</h2>
        <p className="nota" style={{ marginTop: 0 }}>O teu MighT só fica público se disseres que sim.</p>
        <div className="lado">
          <button className={'btn peq ' + (publicar === true ? '' : 'fantasma')} onClick={() => responderPublicar(true)}>Sim, publicava</button>
          <button className={'btn peq ' + (publicar === false ? '' : 'fantasma')} onClick={() => responderPublicar(false)}>Agora não</button>
        </div>
      </div>
      <Link className="btn sec" to="/descobrir">Descobrir pessoas como eu</Link>
    </>
  )
}
