import { Link } from 'react-router-dom'
import { useEu } from '../estado.js'
import { Barreira, Topo } from '../ui.jsx'
import { funcoesIdeais } from '../../logica/index.js'

// Passo 6: funções e percursos. Só hipóteses.
export default function Funcoes() {
  const eu = useEu()
  return <Barreira eu={eu}><Conteudo eu={eu} /></Barreira>
}

function Conteudo({ eu }) {
  const lista = funcoesIdeais({ pesos: eu.pesos })
  return (
    <>
      <Topo passo="6 de 6 · Próximo passo" />
      <h1>Funções onde pessoas como tu prosperam</h1>
      <p className="lead">Hipóteses para explorar, não um veredicto.</p>
      {lista.map((f) => (
        <div key={f.funcao} className="vidro">
          <h2>{f.funcao}</h2>
          <div className="percurso">
            <div><small>Agora</small>{f.agora}</div>
            <div><small>Próximo</small>{f.proximo}</div>
            <div><small>Desafio</small>{f.desafio}</div>
          </div>
          <p className="porque">«{f.porque}»</p>
        </div>
      ))}
      <Link className="btn" to="/card">Partilhar o meu MighT Card</Link>
      <Link className="btn fantasma" to="/pedir">Pedir mais MighTs</Link>
    </>
  )
}
