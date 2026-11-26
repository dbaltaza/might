import { useState } from 'react'
import { Link } from 'react-router-dom'
import QRCode from 'react-qr-code'
import { useEu, jaEnviou, linkPublico } from '../estado.js'
import { Barreira, Progresso } from '../ui.jsx'

// Passo 2B: Pede MighT. Só depois de enviar. Link de convite, sem criar conta.
export default function Pedir() {
  const eu = useEu()
  const [copiado, setCopiado] = useState(false)
  if (!eu.id) return <Barreira eu={eu} />
  if (!jaEnviou()) {
    return (
      <>
        <div className="passo">Passo 2B · Pede MighT</div>
        <h1>Primeiro, dá</h1>
        <p>Para pedires MighTs, envia primeiro um MighT a alguém.</p>
        <Link className="btn lima" to="/enviar">Mandar um MighT</Link>
      </>
    )
  }
  const link = linkPublico(eu.id)
  async function copiar() {
    try { await navigator.clipboard.writeText(link); setCopiado(true) } catch { /* sem clipboard */ }
  }
  return (
    <>
      <div className="passo">Passo 2B · Pede MighT</div>
      <h1>Pede a quem te conhece melhor</h1>
      <p>Aponta a câmara ao código ou partilha o link. Quem responde não precisa de conta.</p>
      <div className="qr"><QRCode value={link} size={220} /></div>
      <Progresso n={eu.aceites.length} />
      {navigator.share
        ? <button className="btn" onClick={() => navigator.share({ title: `Como vês ${eu.pessoa?.nome || 'me'}? Dá-me um MighT`, url: link })}>Partilhar link</button>
        : <button className="btn" onClick={copiar}>{copiado ? 'Link copiado ✓' : 'Copiar link'}</button>}
      <Link className="btn lima" to="/caixa">Ver os MighTs a chegar</Link>
    </>
  )
}
