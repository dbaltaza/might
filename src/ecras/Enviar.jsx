import { useState } from 'react'
import { Link } from 'react-router-dom'
import { criarPessoa, enviarMight } from '../db.js'
import { useEu, marcarEnviou, linkPublico } from '../estado.js'
import { figura } from '../../figura/index.js'
import { TresPalavras, EscolherCirculo, tagsCompletas, Barreira, Topo } from '../ui.jsx'

// Passo 2A: Manda MighT. Uma pessoa, um círculo e 3 palavras.
export default function Enviar() {
  const eu = useEu()
  const [nome, setNome] = useState('')
  const [circulo, setCirculo] = useState('')
  const [tags, setTags] = useState({})
  const [enviado, setEnviado] = useState(null)
  const [aEnviar, setAEnviar] = useState(false)
  const n = nome.trim().split(' ')[0]
  const pronto = n && circulo && tagsCompletas(tags)

  if (!eu.id) return <Barreira eu={eu} />

  async function enviar() {
    setAEnviar(true)
    // Sem multiutilizador real: quem recebe é criado como pessoa nova; o convite é o link dela.
    const para = await criarPessoa(n)
    await enviarMight({ de_id: eu.id, de_nome: eu.pessoa?.nome, para_id: para.id, circulo, ...tags, estado: 'pendente' })
    marcarEnviou()
    setEnviado(para)
    setAEnviar(false)
  }

  if (enviado) {
    const fig = figura(tags.personalidade, tags.poder, tags.caracter)
    const link = linkPublico(enviado.id)
    return (
      <>
        <Topo passo="2 de 6 · Enviado" />
        <h1>Mandaste um MighT a {enviado.nome}</h1>
        <div className="figura"><img src={fig.src} alt="" /></div>
        <div className="tagline">“{fig.tagline}”</div>
        <div className="vidro">
          <p className="nota" style={{ margin: 0 }}>{enviado.nome} recebe um convite para aceitar e retribuir. Nesta versão o convite é um link: partilha-o tu.</p>
          {navigator.share && <button className="btn fantasma" onClick={() => navigator.share({ title: `${eu.pessoa?.nome} mandou-te um MighT`, url: link })}>Partilhar o convite</button>}
        </div>
        <Link className="btn" to="/pedir">Pedir MighTs para mim</Link>
      </>
    )
  }

  return (
    <>
      <Topo passo="2 de 6 · Dar" />
      <h1>Reconhece alguém próximo</h1>
      <p className="lead">Alguém que conheces bem e em quem vês potencial.</p>
      <input className="campo" placeholder="Primeiro nome dessa pessoa" value={nome} onChange={(e) => setNome(e.target.value)} />
      <div className="rotulo">De onde se conhecem?</div>
      <EscolherCirculo valor={circulo} onChange={setCirculo} />
      <div style={{ height: 14 }} />
      <TresPalavras valor={tags} onChange={setTags} sobre={n || 'essa pessoa'} />
      <div className="fixo">
        <button className="btn" disabled={!pronto || aEnviar} onClick={enviar}>
          {aEnviar ? 'A enviar…' : pronto ? `Mandar MighT a ${n}` : !n ? 'Escreve o nome' : !circulo ? 'Escolhe o círculo' : 'Escolhe as 3 palavras'}
        </button>
      </div>
    </>
  )
}
