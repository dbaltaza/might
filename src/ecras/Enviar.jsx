import { useState } from 'react'
import { Link } from 'react-router-dom'
import { criarPessoa, enviarMight } from '../db.js'
import { useEu, marcarEnviou, linkPublico } from '../estado.js'
import { EscolherTags, EscolherCirculo, tagsCompletas, Barreira } from '../ui.jsx'

// Passo 2A: Manda MighT. Uma pessoa, um círculo e 3 tags.
export default function Enviar() {
  const eu = useEu()
  const [nome, setNome] = useState('')
  const [circulo, setCirculo] = useState('')
  const [tags, setTags] = useState({})
  const [enviado, setEnviado] = useState(null)
  const pronto = nome.trim() && circulo && tagsCompletas(tags)

  if (!eu.id) return <Barreira eu={eu} />

  async function enviar() {
    // Sem multiutilizador real: quem recebe é criado como pessoa nova; o convite é o link dela.
    const para = await criarPessoa(nome.trim().split(' ')[0])
    await enviarMight({ de_id: eu.id, de_nome: eu.pessoa?.nome, para_id: para.id, circulo, ...tags, estado: 'pendente' })
    marcarEnviou()
    setEnviado(para)
  }

  if (enviado) {
    const link = linkPublico(enviado.id)
    return (
      <>
        <div className="passo">Passo 2A · Enviado</div>
        <h1>MighT enviado à {enviado.nome}!</h1>
        <p>A {enviado.nome} recebe um convite para aceitar o teu MighT e retribuir. (Simulado: não enviamos emails.)</p>
        {navigator.share && <button className="btn sec" onClick={() => navigator.share({ title: 'Recebeste um MighT', url: link })}>Partilhar convite</button>}
        <Link className="btn lima" to="/pedir">Agora pede MighTs para ti</Link>
      </>
    )
  }

  return (
    <>
      <div className="passo">Passo 2A · Manda MighT</div>
      <h1>Reconhece quem te é próximo</h1>
      <p>Para receberes, começa por dar. Escolhe alguém que conheces bem e em quem vês potencial.</p>
      <input className="campo" placeholder="Primeiro nome da pessoa" value={nome} onChange={(e) => setNome(e.target.value)} />
      <div className="rotulo">De onde a conheces?</div>
      <EscolherCirculo valor={circulo} onChange={setCirculo} />
      <EscolherTags valor={tags} onChange={setTags} />
      <div className="fixo">
        <button className="btn lima" disabled={!pronto} onClick={enviar}>{pronto ? 'Enviar MighT' : 'Nome, círculo e 3 palavras'}</button>
      </div>
    </>
  )
}
