import { Link } from 'react-router-dom'
import { useEu } from '../estado.js'
import { lerPontos } from '../db.js'
import { Barreira, Topo, inicial } from '../ui.jsx'
import { PESSOAS_FICTICIAS, pesos } from '../../logica/index.js'
import { palavraComum, desafio } from '../../logica/desafios.js'

// Duelos: quem partilha uma palavra contigo, o tipo de desafio e o ranking de pontos.
export default function Duelos() {
  const eu = useEu()
  return <Barreira eu={eu}><Conteudo eu={eu} /></Barreira>
}

function Conteudo({ eu }) {
  // Palavras com jogo vêm primeiro (palavraComum já lhes dá +1 no peso).
  const rivais = PESSOAS_FICTICIAS
    .map((p) => ({ pessoa: p, comum: palavraComum(eu.pesos, pesos(p.mights)) }))
    .filter((r) => r.comum)
    .sort((a, b) => b.comum.w - a.comum.w)
    .slice(0, 8)
  const ranking = Object.entries(lerPontos()).sort((a, b) => b[1] - a[1]).slice(0, 5)

  return (
    <>
      <Topo passo="Duelos" />
      <h1>Prova a tua palavra</h1>
      <p className="lead">Quem partilha uma palavra contigo pode desafiar-te. Competitivos jogam o duelo aéreo ✈; os outros, um desafio ao vivo que a sala decide.</p>

      {ranking.length > 0 && (
        <div className="vidro lista">
          <h2>Ranking</h2>
          {ranking.map(([nome, pts], i) => (
            <div key={nome} className="linha">
              <div className="avatar">{i + 1}</div>
              <div className="meio"><b>{nome}</b></div>
              <div className="pct">{pts} pts</div>
            </div>
          ))}
        </div>
      )}

      <div className="vidro lista">
        <h2>Desafia alguém como tu</h2>
        {rivais.length === 0 && <p className="nota">Ainda ninguém partilha uma palavra contigo. Pede mais MighTs.</p>}
        {rivais.map(({ pessoa, comum }) => {
          const d = desafio(comum.tag)
          return (
            <Link key={pessoa.id} to={`/duelo/${pessoa.id}`} className="linha" style={{ color: 'inherit', textDecoration: 'none' }}>
              <div className="avatar">{inicial(pessoa.nome)}</div>
              <div className="meio">
                <b>{pessoa.nome}</b>
                <div className="sub">Os dois: {comum.tag} · {d.jogo ? 'Duelo aéreo' : `Desafio ${d.familia ?? 'livre'}`}</div>
              </div>
              <div className="pct">{d.jogo ? '✈' : '⚡'}</div>
            </Link>
          )
        })}
      </div>
      <p className="nota">Vitória 3 pontos, empate 1 para cada. Os pontos ficam neste dispositivo.</p>
    </>
  )
}
