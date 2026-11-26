import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useEu } from '../estado.js'
import { lerPontos, somarPontos } from '../db.js'
import { Barreira, Topo, inicial } from '../ui.jsx'
import { PESSOAS_FICTICIAS, pesos, DIM_NOME } from '../../logica/index.js'
import { palavraComum, desafio } from '../../logica/desafios.js'
import JogoVoo from '../JogoVoo.jsx'

const SEGUNDOS = 60
const VITORIA = 3, EMPATE = 1

// Duelo: tu e alguém como tu provam a palavra que partilham. A sala é o júri.
export default function Duelo() {
  const eu = useEu()
  return <Barreira eu={eu}><Conteudo eu={eu} /></Barreira>
}

function Conteudo({ eu }) {
  const { id } = useParams()
  const outro = PESSOAS_FICTICIAS.find((p) => String(p.id) === id)
  const [n, setN] = useState(0)
  const [falta, setFalta] = useState(null) // null = ainda não começou
  const [vencedor, setVencedor] = useState(null)
  const [jogar, setJogar] = useState(false)
  const [pontos, setPontos] = useState(lerPontos)

  useEffect(() => {
    if (!falta) return undefined
    const t = setTimeout(() => setFalta(falta - 1), 1000)
    return () => clearTimeout(t)
  }, [falta])

  if (!outro) return <><Topo /><h1>Pessoa não encontrada</h1><Link className="btn" to="/descobrir">Voltar</Link></>
  const comum = palavraComum(eu.pesos, pesos(outro.mights))
  if (!comum) return <><Topo /><h1>Ainda não partilham nenhuma palavra</h1><Link className="btn" to="/descobrir">Escolher outra pessoa</Link></>
  const d = desafio(comum.tag, n)
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
      <p className="lead">Os dois são <b>{comum.tag}</b> ({DIM_NOME[comum.dim]}). Provem-no.</p>
      <div className="vidro">
        <h2>O desafio</h2>
        <p className="porque">«{d.texto}»</p>
        {!d.jogo && falta === null && <button className="btn fantasma" onClick={() => setN(n + 1)}>Outro desafio</button>}
      </div>

      {d.jogo && !jogar && !vencedor && <button className="btn" onClick={() => setJogar(true)}>Descolar ✈</button>}
      {jogar && <JogoVoo nomes={nomes} onFim={fim} />}
      {!d.jogo && falta === null && <button className="btn" onClick={() => setFalta(SEGUNDOS)}>Começar ({SEGUNDOS} s)</button>}
      {falta > 0 && <div className="pct" aria-live="polite" style={{ fontSize: 48, textAlign: 'center' }}>{falta}</div>}
      {falta === 0 && !vencedor && (
        <div className="vidro lista">
          <h2>A sala decide: quem provou melhor?</h2>
          {[nome, outro.nome, 'Empate'].map((v) => (
            <button key={v} className="btn sec" onClick={() => fim(v)}>{v === 'Empate' ? v : <>{inicial(v)} · {v}</>}</button>
          ))}
        </div>
      )}
      {vencedor && (
        <div className="vidro">
          <h2>{vencedor === 'Empate' ? 'Empate! Os dois são mesmo ' : `${vencedor} é o mais `}{comum.tag}</h2>
          <p className="lead">{vencedor === 'Empate' ? `+${EMPATE} ponto para cada um` : `+${VITORIA} pontos para ${vencedor}`}</p>
          <div className="lista">
            {nomes.map((p) => (
              <div key={p} className="linha"><div className="meio"><b>{p}</b></div><div className="pct">{pontos[p] || 0} pts</div></div>
            ))}
          </div>
          <button className="btn" onClick={() => { setFalta(null); setVencedor(null); setN(n + 1); setJogar(!!d.jogo) }}>Revanche</button>
        </div>
      )}
      <Link className="btn fantasma" to="/duelos">Voltar aos duelos</Link>
    </>
  )
}
