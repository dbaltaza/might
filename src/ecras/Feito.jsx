import { Link } from 'react-router-dom'
import { figuraDe } from '../figuraDe.js'
import FiguraVista from '../FiguraVista.jsx'
import { useEu } from '../estado.js'
import { Topo, PARTE, Carregar } from '../ui.jsx'
import { DIMS, DIM_NOME, descricao } from '../../logica/index.js'

// Revelação do Self MighT, e o empurrão para dar antes de pedir.
export default function Feito() {
  const eu = useEu()
  const s = eu.self
  if (!eu.carregado) return <Carregar eu={eu} />
  if (!s) {
    return (
      <>
        <Topo />
        <div className="ecra-centro">
          <h1>Ainda não tens um MighT</h1>
          <p className="lead">Escolhe três palavras sobre ti. Demora menos de 2 minutos.</p>
          <Link className="btn" to="/criar">Criar o meu MighT</Link>
        </div>
      </>
    )
  }
  const fig = figuraDe(eu.pessoa, s)
  return (
    <>
      <Topo />
      <div className="ecra-centro">
      <h1 style={{ textAlign: 'center' }}>Olá, {eu.pessoa?.nome}</h1>
      <FiguraVista fig={fig} className="revela" alt={`Figura MighT: ${s.personalidade}, ${s.poder}, ${s.caracter}`} />
      <div className="tagline">«{fig.tagline}»</div>
      <div className="tres">
        {DIMS.map((d) => <div key={d}><small>{PARTE[d]}</small>{s[d]}</div>)}
      </div>
      <div className="vidro lista descricoes">
        {DIMS.map((d) => <div key={d} className="linha"><div className="meio"><b>{DIM_NOME[d]}</b> {s[d]}<div className="sub">{descricao(d, s[d])}</div></div></div>)}
      </div>
      <div className="vidro">
        <h2>É assim que te vês.</h2>
        <p className="nota" style={{ margin: 0 }}>E os outros? Para receberes, começa por dar: manda um MighT a alguém em quem vês potencial. Essa pessoa costuma retribuir.</p>
      </div>
      <Link className="btn" to="/enviar">Mandar um MighT</Link>
      </div>
    </>
  )
}
