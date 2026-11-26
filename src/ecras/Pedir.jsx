import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import QRCode from 'react-qr-code'
import { useEu, jaEnviou, linkPublico } from '../estado.js'
import { Barreira, Progresso, Topo } from '../ui.jsx'

// Passo 2B: Pede MighT. Só depois de dar. Link de convite, sem criar conta.
export default function Pedir() {
  const eu = useEu()
  const [copiado, setCopiado] = useState(false)
  useEffect(() => { if (!copiado) return undefined; const t = setTimeout(() => setCopiado(false), 2000); return () => clearTimeout(t) }, [copiado])
  if (!eu.id) return <Barreira eu={eu} />
  if (!jaEnviou()) {
    return (
      <>
        <Topo />
        <div className="ecra-centro">
        <h1>Primeiro, dá</h1>
        <p className="lead">Os pedidos abrem depois de mandares um MighT a alguém. Quem dá, recebe.</p>
        <Link className="btn" to="/enviar">Mandar um MighT</Link>
        </div>
      </>
    )
  }
  const link = linkPublico(eu.id)
  // Um só botão: partilha nativa se existir; senão copia o link.
  async function partilhar() {
    if (navigator.share) {
      try { await navigator.share({ title: 'Como me vês? Dá-me um MighT', url: link }); return } catch (e) { if (e?.name === 'AbortError') return }
    }
    try { await navigator.clipboard.writeText(link); setCopiado(true) } catch { setCopiado(false) }
  }
  return (
    <>
      <Topo />
      <div className="ecra-centro ecra-pedir">
      <h1>Pede a quem te conhece melhor</h1>
      <p className="lead">Quem ler este código escolhe 3 palavras sobre ti. Não precisa de conta.</p>
      <figure className="qr-bloco">
        <div className="qr"><QRCode value={link} size={208} fgColor="#1c1e28" /></div>
        <Progresso n={eu.aceites.length} />
        <figcaption className="nota">{Math.min(eu.aceites.length, 3)} de 3 MighTs aceites para abrir o teu perfil</figcaption>
      </figure>
      <button className="btn" onClick={partilhar}>{copiado ? 'Link copiado' : 'Partilhar link'}</button>
      <Link className="btn sec" to="/caixa">Ver os MighTs a chegar</Link>
      </div>
    </>
  )
}
