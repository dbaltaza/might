import { Link } from 'react-router-dom'
import { responder, enviarMight } from '../db.js'
import { useEu, topTag } from '../estado.js'
import { figuraDe } from '../figuraDe.js'
import Orbita from '../Orbita.jsx'
import { Barreira, Topo, Carregar, Progresso, demo } from '../ui.jsx'
import { figura } from '../../figura/index.js'
import { PESSOAS_FICTICIAS, CIRCULOS, DIMS } from '../../logica/index.js'

// Passo 3: quem recebe aceita ou recusa. A órbita enche-se; com 3 aceites o perfil abre.
export default function Caixa() {
  const eu = useEu()
  if (!eu.id) return <Barreira eu={eu} />
  if (!eu.carregado) return <Carregar eu={eu} />
  const pendentes = eu.recebidos.filter((m) => m.estado === 'pendente')
  const s = eu.self || {}
  // Antes de desbloquear: a tua figura. Depois: a figura como os outros te veem.
  const fig = eu.desbloqueado
    ? figuraDe(eu.pessoa, { personalidade: topTag(eu.pesos.personalidade), poder: topTag(eu.pesos.poder), caracter: topTag(eu.pesos.caracter) })
    : figuraDe(eu.pessoa, s)

  // Plano B para o palco: 3 MighTs com palavras tiradas do social graph fictício.
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
      <Topo />
      <div className="duas-colunas ecra-caixa">
      <div className="col-hero">
      <Orbita figura={fig.src} moldura={fig.moldura} pessoas={eu.aceites.map((m) => ({ id: m.id, nome: m.de_nome || 'Alguém' }))} />
      </div>
      <div className="col-conteudo">
      <h1>{eu.desbloqueado ? 'A tua caixa' : `Faltam ${eu.faltam} MighT${eu.faltam === 1 ? '' : 's'}`}</h1>
      <p className="lead">{eu.desbloqueado
        ? `${eu.aceites.length} pessoas reconhecem-te. O teu All MighT está aberto.`
        : 'Aceita os que te reconhecem. Com 3, o teu perfil abre.'}</p>
      {!eu.desbloqueado && <Progresso n={eu.aceites.length} />}
      {pendentes.length > 0 && (
        <div className="vidro lista">
          {pendentes.map((m) => (
            <div key={m.id} className="linha" style={{ flexWrap: 'wrap' }}>
              <img className="avatar" src={figura(m.personalidade, m.poder, m.caracter).src} alt="" />
              <div className="meio">
                <div><b>{m.de_nome || 'Alguém'}</b> <span className="sub">· {m.circulo}</span></div>
                <div className="sub">{m.personalidade}, {m.poder}, {m.caracter}</div>
              </div>
              <div className="lado" style={{ width: '100%' }}>
                <button className="btn peq" onClick={() => responder(m.id, 'aceite').then(eu.recarregar)}>Aceitar</button>
                <button className="btn peq fantasma" onClick={() => responder(m.id, 'recusado').then(eu.recarregar)}>Recusar</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {pendentes.length === 0 && !eu.desbloqueado && (
        <p className="nota">Ainda não chegaram MighTs. Mostra o teu código a quem te conhece.</p>
      )}

      {eu.desbloqueado
        ? <Link className="btn" to="/perfil">Ver o meu All MighT</Link>
        : <Link className="btn" to="/pedir">Mostrar o meu código</Link>}
      {demo() && <button className="link-simular" onClick={simular}>Simular 3 MighTs da sala</button>}
      </div>
      </div>
    </>
  )
}
