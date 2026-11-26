import { Link } from 'react-router-dom'
import { useEu } from '../estado.js'
import { Barreira } from '../ui.jsx'
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
      <div className="passo">Passo 6 · Funções ideais</div>
      <h1>O teu próximo passo</h1>
      <p>Funções de pessoas com um MighT parecido com o teu. São hipóteses para explorar, não um veredicto.</p>
      {lista.map((f) => (
        <div key={f.funcao} className="cartao">
          <div className="rotulo"><b>{f.funcao}</b></div>
          <div className="percurso">
            <span>Agora<br /><b>{f.agora}</b></span>→<span>Próximo<br /><b>{f.proximo}</b></span>→<span>Desafio<br /><b>{f.desafio}</b></span>
          </div>
          <div className="porque">«{f.porque}»</div>
        </div>
      ))}
      <Link className="btn lima" to="/card">Partilhar o meu MighT Card</Link>
      <Link className="btn sec" to="/pedir">Pedir mais MighTs</Link>
    </>
  )
}
