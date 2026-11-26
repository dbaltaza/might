import { Link } from 'react-router-dom'
import { useEu } from '../estado.js'
import { Barreira, Topo } from '../ui.jsx'
import { funcoesIdeais } from '../../logica/index.js'

// Passo 6: funções e percursos (algoritmo e funções da Parte A). Só hipóteses.
export default function Funcoes() {
  const eu = useEu()
  return <Barreira eu={eu}><Conteudo eu={eu} /></Barreira>
}

const PASSOS = [['agora', 'Agora'], ['proximo', 'Próximo'], ['desafio', 'Desafio']]

function Conteudo({ eu }) {
  const r = funcoesIdeais({ pesos: eu.pesos })
  const porque = r.agora.tagsEmComum.length
    ? `Quem te conhece diz que és ${lista(r.agora.tagsEmComum.slice(0, 3))}. ${r.agora.porque}`
    : r.agora.porque
  return (
    <>
      <Topo passo="6 de 6 · Próximo passo" />
      <div className="duas-colunas">
        <div className="col-hero">
          <h1>Onde pessoas como tu prosperam</h1>
          <p className="lead">Hipóteses para explorar, não um veredicto. Vêm das palavras que te deram e das funções de quem é reconhecido como tu.</p>
          <div className="vidro">
            <h2>Porque é que isto encaixa em ti</h2>
            <p className="porque">«{porque}»</p>
          </div>
        </div>
        <div className="col-conteudo">
          <div className="vidro">
            <h2>O teu percurso</h2>
            <div className="percurso">
              {PASSOS.map(([k, t]) => <div key={k}><small>{t}</small>{r[k].funcao}</div>)}
            </div>
            {PASSOS.slice(1).map(([k, t]) => (
              <p key={k} className="nota" style={{ margin: '6px 0 0' }}><b>{t}:</b> {r[k].porque}</p>
            ))}
          </div>
          {r.comoTu.length > 0 && (
            <div className="vidro lista">
              <h2>Pessoas como tu trabalham como</h2>
              {r.comoTu.map((c) => (
                <div key={c.nome + c.pct} className="linha">
                  <div className="meio"><b>{c.funcao}</b><div className="sub">{c.nome}, {c.pct}% parecido contigo</div></div>
                </div>
              ))}
            </div>
          )}
          <Link className="btn" to="/card">Partilhar o meu MighT Card</Link>
          <Link className="btn fantasma" to="/pedir">Pedir mais MighTs</Link>
        </div>
      </div>
    </>
  )
}

const lista = (xs) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} e ${xs[xs.length - 1]}`).toLowerCase()
