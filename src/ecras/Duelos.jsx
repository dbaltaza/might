import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useEu, pesosDuelo } from '../estado.js'
import { lerPontos } from '../db.js'
import { Barreira, Topo, inicial } from '../ui.jsx'
import { PESSOAS_FICTICIAS, pesos } from '../../logica/index.js'
import { palavraComum, desafio } from '../../logica/desafios.js'

// Duelos: quem partilha uma palavra contigo, o tipo de desafio e o ranking de pontos.
export default function Duelos() {
  const eu = useEu()
  return <Barreira eu={eu} livre><Conteudo eu={eu} /></Barreira>
}

function Conteudo({ eu }) {
  // Palavras com jogo vêm primeiro (palavraComum já lhes dá +1 no peso).
  const rivais = PESSOAS_FICTICIAS
    .map((p) => ({ pessoa: p, comum: palavraComum(pesosDuelo(eu), pesos(p.mights)) }))
    .filter((r) => r.comum)
    .sort((a, b) => b.comum.w - a.comum.w)
    .slice(0, 8)
  const [rival, setRival] = useState(PESSOAS_FICTICIAS[0]?.id)
  const ranking = Object.entries(lerPontos()).sort((a, b) => b[1] - a[1]).slice(0, 5)

  return (
    <>
      <Topo passo="Duelos" />
      <h1>Prova a tua palavra</h1>
      <p className="lead">Quem partilha uma palavra contigo pode desafiar-te. Competitivos jogam Snake 🐍; os outros, um desafio ao vivo que a sala decide.</p>

      <div className="vidro">
        <h2>✈ Duelo aéreo · sempre disponível</h2>
        <p className="nota">Contra qualquer pessoa, com ou sem palavra em comum. Os dois jogam ao mesmo tempo.</p>
        <select value={rival} onChange={(e) => setRival(e.target.value)} aria-label="Adversário" style={{ width: '100%', padding: 10, borderRadius: 10, margin: '8px 0' }}>
          {PESSOAS_FICTICIAS.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
        </select>
        <Link className="btn" to={`/duelo/${rival}?jogo=voo`}>Descolar ✈</Link>
      </div>

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
                <div className="sub">Os dois: {comum.tag} · {d.jogo ? 'Snake a dois' : `Desafio ${d.familia ?? 'livre'}`}</div>
              </div>
              <div className="pct">{d.jogo ? '🐍' : '⚡'}</div>
            </Link>
          )
        })}
      </div>
      <p className="nota">Vitória 3 pontos, empate 1 para cada. Os pontos ficam neste dispositivo.</p>
    </>
  )
}
