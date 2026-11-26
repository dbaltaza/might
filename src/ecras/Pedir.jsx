import { useState } from 'react'
import { Link } from 'react-router-dom'
import QRCode from 'react-qr-code'
import { useEu, jaEnviou, linkPublico } from '../estado.js'
import { Barreira, Progresso, Topo } from '../ui.jsx'

// Passo 2B: Pede MighT. Só depois de dar. Link de convite, sem criar conta.
export default function Pedir() {
  const eu = useEu()
  const [copiado, setCopiado] = useState(false)
  if (!eu.id) return <Barreira eu={eu} />
  if (!jaEnviou()) {
    return (
      <>
        <Topo passo="2 de 6 · Pedir" />
        <h1>Primeiro, dá</h1>
        <p className="lead">Os pedidos abrem depois de mandares um MighT a alguém. Quem dá, recebe.</p>
        <Link className="btn" to="/enviar">Mandar um MighT</Link>
      </>
    )
  }
  const link = linkPublico(eu.id)
  async function copiar() {
    try { await navigator.clipboard.writeText(link); setCopiado(true) } catch { setCopiado(false) }
  }
  return (
    <>
      <Topo passo="2 de 6 · Pedir" />
      <h1>Pede a quem te conhece melhor</h1>
      <p className="lead">Quem ler este código escolhe 3 palavras sobre ti. Não precisa de conta.</p>
      <div className="qr"><QRCode value={link} size={208} fgColor="#1c1e28" /></div>
      <Progresso n={eu.aceites.length} />
      <p className="nota" style={{ textAlign: 'center' }}>{eu.aceites.length} de 3 MighTs aceites para abrir o teu perfil</p>
      <div className="lado">
        {navigator.share && <button className="btn sec" onClick={() => navigator.share({ title: `Como me vês? Dá-me um MighT`, url: link })}>Partilhar link</button>}
        <button className="btn sec" onClick={copiar}>{copiado ? 'Link copiado' : 'Copiar link'}</button>
      </div>
      <Link className="btn" to="/caixa">Ver os MighTs a chegar</Link>
    </>
  )
}
