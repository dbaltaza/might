import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { criarPessoa, definirEu, guardarSelf } from '../db.js'
import { figura } from '../../figura/index.js'
import { TresPalavras, tagsCompletas, Topo } from '../ui.jsx'
import { PreviaFigura } from '../Silhueta.jsx'
import EscolherArtista from '../EscolherArtista.jsx'

// Passo 1: Self MighT. Meta: menos de 2 minutos.
const nFaltam = (tags) => 3 - Object.values(tags).filter(Boolean).length
const palavras = (n) => `${n} palavra${n === 1 ? '' : 's'}`
const faltaCriar = (nome, tags) => {
  const f = []
  if (!nome.trim()) f.push('o teu nome')
  if (nFaltam(tags) > 0) f.push(palavras(nFaltam(tags)))
  return 'Falta: ' + f.join(' e ')
}

export default function Criar() {
  const nav = useNavigate()
  const [nome, setNome] = useState('')
  const [tags, setTags] = useState({})
  const [aGuardar, setAGuardar] = useState(false)
  const [erro, setErro] = useState('')
  const [ativa, setAtiva] = useState('personalidade')
  const [artista, setArtista] = useState('palavras')
  const pronto = nome.trim() && tagsCompletas(tags)

  async function guardar() {
    setAGuardar(true)
    setErro('')
    try {
      const fig = figura(tags.personalidade, tags.poder, tags.caracter)
      const eu = await criarPessoa(nome.trim().split(' ')[0], fig.tagline, artista === 'palavras' ? null : artista)
      definirEu(eu.id)
      await guardarSelf(eu, tags)
      nav('/feito')
    } catch (e) {
      setErro('O MighT não foi guardado: ' + (e.message || 'sem ligação') + '. Toca em Criar outra vez.')
      setAGuardar(false)
    }
  }

  return (
    <>
      <Topo passo="1 de 2" />
      <div className="duas-colunas ecra-palavras">
        <div className="col-hero"><PreviaFigura tags={tags} ativa={ativa} artista={artista} /></div>
        <div className="col-conteudo">
          <h1>Como te vês?</h1>
          <p className="lead">Três palavras. Os teus amigos vão escolher as deles.</p>
          <input className="campo" aria-label="O teu primeiro nome" placeholder="O teu primeiro nome" autoComplete="given-name" value={nome} onChange={(e) => setNome(e.target.value)} />
          <TresPalavras valor={tags} onChange={setTags} onAtiva={setAtiva} />
          {tagsCompletas(tags) && <EscolherArtista valor={artista} onChange={setArtista} tags={tags} />}
          {erro && <p className="erro">{erro}</p>}
          <div className="fixo">
            <p className="nota falta" aria-live="polite">{pronto ? '' : faltaCriar(nome, tags)}</p>
            <button className="btn" disabled={!pronto || aGuardar} aria-busy={aGuardar} onClick={guardar}>
              {aGuardar ? 'A criar o teu MighT…' : 'Criar o meu MighT'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
