import { Link } from 'react-router-dom'
import { responder, enviarMight } from '../db.js'
import { useEu } from '../estado.js'
import { Barreira, Progresso } from '../ui.jsx'
import { PESSOAS_FICTICIAS, CIRCULOS, DIMS } from '../../logica/index.js'

// Passo 3: quem recebe aceita ou recusa. Desbloqueia com 3 aceites.
export default function Caixa() {
  const eu = useEu()
  if (!eu.id) return <Barreira eu={eu} />
  const pendentes = eu.recebidos.filter((m) => m.estado === 'pendente')

  // Plano B para o palco: 3 MighTs fictícios, com tags tiradas de pessoas do social graph.
  async function simular() {
    const pool = [...PESSOAS_FICTICIAS].sort(() => Math.random() - 0.5).slice(0, 3)
    for (const p of pool) {
      const m = p.mights[Math.floor(Math.random() * p.mights.length)]
      await enviarMight({
        de_id: null, de_nome: p.nome, para_id: eu.id, estado: 'pendente',
        circulo: CIRCULOS[Math.floor(Math.random() * CIRCULOS.length)],
        ...Object.fromEntries(DIMS.map((d) => [d, m[d]])),
      })
    }
    eu.recarregar()
  }

  return (
    <>
      <div className="passo">Passo 3 · A tua caixa</div>
      <h1>{eu.desbloqueado ? 'Perfil desbloqueado!' : 'Agora é uma questão de tempo'}</h1>
      <Progresso n={eu.aceites.length} />
      {pendentes.length === 0 && <p>Ainda não chegaram MighTs novos. Partilha o teu QR.</p>}
      {pendentes.map((m) => (
        <div key={m.id} className="cartao novo">
          <div><b>{m.de_nome || 'Alguém'}</b> · {m.circulo}</div>
          <div className="tags3">{m.personalidade} · {m.poder} · {m.caracter}</div>
          <div className="lado">
            <button className="btn lima" onClick={() => responder(m.id, 'aceite').then(eu.recarregar)}>Aceitar</button>
            <button className="btn sec" onClick={() => responder(m.id, 'recusado').then(eu.recarregar)}>Recusar</button>
          </div>
        </div>
      ))}
      {eu.aceites.length > 0 && <div className="rotulo">Aceites ({eu.aceites.length})</div>}
      {eu.aceites.map((m) => (
        <div key={m.id} className="cartao">
          <b>{m.de_nome || 'Alguém'}</b> · {m.circulo}<div className="tags3">{m.personalidade} · {m.poder} · {m.caracter}</div>
        </div>
      ))}
      {eu.desbloqueado
        ? <Link className="btn lima" to="/perfil">Ver o meu All MighT</Link>
        : <Link className="btn" to="/pedir">Pedir mais MighTs</Link>}
      <button className="link-simular" onClick={simular}>Simular 3 MighTs da sala (demo)</button>
    </>
  )
}
