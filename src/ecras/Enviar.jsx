import { useState } from 'react'
import { Link } from 'react-router-dom'
import { criarPessoa, enviarMight } from '../db.js'
import { useEu, marcarEnviou, linkPublico } from '../estado.js'
import { figura } from '../../figura/index.js'
import { TresPalavras, EscolherCirculo, tagsCompletas, Barreira, Topo } from '../ui.jsx'
import { PreviaFigura } from '../Silhueta.jsx'

// Passo 2A: Manda MighT. Uma pessoa, um círculo e 3 palavras.
export default function Enviar() {
  const eu = useEu()
  const [nome, setNome] = useState('')
  const [circulo, setCirculo] = useState('')
  const [tags, setTags] = useState({})
  const [enviado, setEnviado] = useState(null)
  const [aEnviar, setAEnviar] = useState(false)
  const [ativa, setAtiva] = useState('personalidade')
  const n = nome.trim().split(' ')[0]
  const pronto = n && circulo && tagsCompletas(tags)
  const faltam = 3 - Object.values(tags).filter(Boolean).length

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
        <Topo passo="2 de 2" />
        <div className="ecra-centro">
          <h1>Mandaste um MighT a {enviado.nome}</h1>
          <div className="figura"><img src={fig.src} alt="" /></div>
          <div className="tagline">«{fig.tagline}»</div>
          <div className="vidro">
            <p className="nota" style={{ margin: 0 }}>{enviado.nome} recebe um convite para aceitar e retribuir. Nesta versão o convite é um link: partilha-o tu.</p>
            {navigator.share && <button className="btn fantasma" onClick={() => navigator.share({ title: `${eu.pessoa?.nome} mandou-te um MighT`, url: link })}>Partilhar o convite</button>}
          </div>
          <Link className="btn" to="/pedir">Pedir MighTs para mim</Link>
        </div>
      </>
    )
  }

  return (
    <>
      <Topo passo="2 de 2" />
      <div className="duas-colunas ecra-palavras">
        <div className="col-hero"><PreviaFigura tags={tags} ativa={ativa} /></div>
        <div className="col-conteudo">
          <h1>Reconhece alguém próximo</h1>
          <p className="lead">Alguém que conheces bem e em quem vês potencial.</p>
          <input className="campo" aria-label="Primeiro nome dessa pessoa" placeholder="Primeiro nome dessa pessoa" value={nome} onChange={(e) => setNome(e.target.value)} />
          <div className="rotulo">De onde se conhecem?</div>
          <EscolherCirculo valor={circulo} onChange={setCirculo} />
          <div className="rotulo">Três palavras</div>
          <TresPalavras valor={tags} onChange={setTags} sobre={n || 'essa pessoa'} onAtiva={setAtiva} />
          <div className="fixo">
            <p className="nota falta" aria-live="polite">{pronto ? '' : 'Falta: ' + [!n && 'o nome', !circulo && 'o círculo', faltam > 0 && `${faltam} palavra${faltam === 1 ? '' : 's'}`].filter(Boolean).join(', ')}</p>
            <button className="btn" disabled={!pronto || aEnviar} aria-busy={aEnviar} onClick={enviar}>
              {aEnviar ? 'A enviar…' : 'Enviar MighT'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
