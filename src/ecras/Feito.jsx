import { Link } from 'react-router-dom'
import { figura } from '../../figura/index.js'
import { useEu } from '../estado.js'

// Depois do passo 1: celebrar e empurrar para "dar para receber".
export default function Feito() {
  const eu = useEu()
  const s = eu.self
  const fig = s ? figura(s.personalidade, s.poder, s.caracter) : null
  return (
    <>
      <div className="passo">MighT criado</div>
      <h1>Boa, {eu.pessoa?.nome || ''}! Já tens o teu MighT.</h1>
      {fig && (
        <div className="fig">
          <img src={fig.src} alt="" />
          <div className="tl-grande">“{fig.tagline}”</div>
          <div className="tags3">{s.personalidade} · {s.poder} · {s.caracter}</div>
        </div>
      )}
      <p>Não seria bestial descobrir o que os outros veem em ti? Para receberes, começa por dar. Vais ver que essa pessoa vai retribuir.</p>
      <Link className="btn lima" to="/enviar">Mandar um MighT a alguém</Link>
    </>
  )
}
