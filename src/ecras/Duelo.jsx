import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useEu, pesosDuelo } from '../estado.js'
import { lerPontos, somarPontos } from '../db.js'
import { Barreira, Topo, inicial } from '../ui.jsx'
import { PESSOAS_FICTICIAS, pesos, DIM_NOME } from '../../logica/index.js'
import { palavraComum, desafio, AVIAO } from '../../logica/desafios.js'
import JogoVoo from '../JogoVoo.jsx'
import JogoCobra from '../JogoCobra.jsx'

const JOGOS = { voo: [JogoVoo, 'Descolar ✈'], cobra: [JogoCobra, 'Começar 🐍'] }

const VITORIA = 3, EMPATE = 1

// Duelo: tu e alguém como tu provam a palavra que partilham. A sala é o júri.
export default function Duelo() {
  const eu = useEu()
  return <Barreira eu={eu} livre><Conteudo eu={eu} /></Barreira>
}

function Conteudo({ eu }) {
  const { id } = useParams()
  const aviao = useSearchParams()[0].get('jogo') === 'voo' // ?jogo=voo: duelo aéreo livre
  const outro = PESSOAS_FICTICIAS.find((p) => String(p.id) === id)
  const [n, setN] = useState(0)
  const [vencedor, setVencedor] = useState(null)
  const [jogar, setJogar] = useState(false)
  const [pontos, setPontos] = useState(lerPontos)

  if (!outro) return <><Topo /><h1>Pessoa não encontrada</h1><Link className="btn" to="/descobrir">Voltar</Link></>
  const comum = palavraComum(pesosDuelo(eu), pesos(outro.mights))
  if (!comum && !aviao) return <><Topo /><h1>Ainda não partilham nenhuma palavra</h1><Link className="btn" to="/descobrir">Escolher outra pessoa</Link></>
  const d = aviao ? AVIAO : desafio(comum.tag, n)
  const [Jogo, arrancar] = JOGOS[d.jogo] || []
  const nome = eu.pessoa?.nome || 'Tu'
  const nomes = [nome, outro.nome]
  // Uma só porta para o fim do duelo (jogo ou voto da sala): vitória 3 pontos, empate 1 a cada.
  const fim = (v) => {
    setJogar(false)
    setVencedor(v)
    setPontos(somarPontos(v === 'Empate' ? { [nome]: EMPATE, [outro.nome]: EMPATE } : { [v]: VITORIA }))
  }

  return (
    <>
      <Topo passo={`Duelo${d.familia ? ' ' + d.familia : ''}`} />
      <h1>{nome} vs {outro.nome}</h1>
      <p className="lead">{aviao ? 'Duelo aéreo livre: qualquer um contra qualquer um.' : <>Os dois são <b>{comum.tag}</b> ({DIM_NOME[comum.dim]}). Provem-no.</>}</p>
      <div className="vidro">
        <h2>O desafio</h2>
        <p className="porque">«{d.texto}»</p>
        {!d.jogo && !vencedor && <button className="btn fantasma" onClick={() => setN(n + 1)}>Outro desafio</button>}
      </div>

      {Jogo && !jogar && !vencedor && <button className="btn" onClick={() => setJogar(true)}>{arrancar}</button>}
      {jogar && <Jogo nomes={nomes} onFim={fim} />}
      {!d.jogo && !vencedor && (
        <div className="vidro lista">
          <h2>A sala decide: quem provou melhor?</h2>
          {[nome, outro.nome, 'Empate'].map((v) => (
            <button key={v} className="btn sec" onClick={() => fim(v)}>{v === 'Empate' ? v : <>{inicial(v)} · {v}</>}</button>
          ))}
        </div>
      )}
      {vencedor && (
        <div className="vidro">
          <h2>{aviao ? (vencedor === 'Empate' ? 'Empate no ar!' : `${vencedor} domina os céus`) : <>{vencedor === 'Empate' ? 'Empate! Os dois são mesmo ' : `${vencedor} é o mais `}{comum.tag}</>}</h2>
          <p className="lead">{vencedor === 'Empate' ? `+${EMPATE} ponto para cada um` : `+${VITORIA} pontos para ${vencedor}`}</p>
          <div className="lista">
            {nomes.map((p) => (
              <div key={p} className="linha"><div className="meio"><b>{p}</b></div><div className="pct">{pontos[p] || 0} pts</div></div>
            ))}
          </div>
          <button className="btn" onClick={() => { setVencedor(null); setN(n + 1); setJogar(!!d.jogo) }}>Revanche</button>
        </div>
      )}
      <Link className="btn fantasma" to="/duelos">Voltar aos duelos</Link>
    </>
  )
}
