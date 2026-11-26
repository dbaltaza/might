import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useEu, topTag } from '../estado.js'
import { Barreira } from '../ui.jsx'
import { figura } from '../../figura/index.js'
import { MightCard, descarregarPNG } from '../../card/MightCard.jsx'
import { sb } from '../db.js'

// Passo 4: MighT Card. Tu, pelos olhos dos outros. Download em PNG.
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
      <div className="passo">Passo 4 · MighT Card</div>
      <h1>Apresenta-te com provas</h1>
      <div className="chips">
        {[['retrato', 'Retrato'], ['linkedin', 'LinkedIn']].map(([f, t]) => (
          <button key={f} className={'chip' + (formato === f ? ' on' : '')} onClick={() => setFormato(f)}>{t}</button>
        ))}
      </div>
      <div className="card-wrap">
        <MightCard ref={ref} formato={formato} pessoa={{ nome: eu.pessoa?.nome, tagline: fig.tagline, figura: fig.src }} pesos={eu.pesos} circulos={circulos} />
      </div>
      <button className="btn lima" onClick={() => descarregarPNG(ref, eu.pessoa?.nome)}>Descarregar PNG</button>
      <div className="cartao">
        <b>Publicavas?</b> Nada fica público sem o teu consentimento.
        <div className="lado">
          <button className={'btn ' + (publicar === true ? '' : 'sec')} onClick={() => responderPublicar(true)}>Sim</button>
          <button className={'btn ' + (publicar === false ? '' : 'sec')} onClick={() => responderPublicar(false)}>Agora não</button>
        </div>
      </div>
      <Link className="btn" to="/descobrir">Descobrir pessoas como eu</Link>
    </>
  )
}
