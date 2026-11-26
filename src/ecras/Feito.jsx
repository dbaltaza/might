import { Link } from 'react-router-dom'
import { figura } from '../../figura/index.js'
import { useEu } from '../estado.js'
import { Topo, PARTE } from '../ui.jsx'
import { DIMS } from '../../logica/index.js'

// Revelação do Self MighT, e o empurrão para dar antes de pedir.
export default function Feito() {
  const eu = useEu()
  const s = eu.self
  if (!s) return <Topo />
  const fig = figura(s.personalidade, s.poder, s.caracter)
  return (
    <>
      <Topo passo="O teu MighT" />
      <h1 style={{ textAlign: 'center' }}>Olá, {eu.pessoa?.nome}</h1>
      <div className="figura revela"><img src={fig.src} alt={`Figura MighT: ${s.personalidade}, ${s.poder}, ${s.caracter}`} /></div>
      <div className="tagline">“{fig.tagline}”</div>
      <div className="tres">
        {DIMS.map((d) => <div key={d}><small>{PARTE[d]}</small>{s[d]}</div>)}
      </div>
      <div className="vidro">
        <h2>É assim que te vês.</h2>
        <p className="nota" style={{ margin: 0 }}>E os outros? Para receberes, começa por dar: manda um MighT a alguém em quem vês potencial. Essa pessoa costuma retribuir.</p>
      </div>
      <Link className="btn" to="/enviar">Mandar um MighT</Link>
    </>
  )
}
