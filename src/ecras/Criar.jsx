import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { criarPessoa, definirEu, guardarSelf } from '../db.js'
import { figura } from '../../figura/index.js'
import { TresPalavras, tagsCompletas, Topo } from '../ui.jsx'
import { PreviaFigura } from '../Silhueta.jsx'

// Passo 1: Self MighT. Meta: menos de 2 minutos.
export default function Criar() {
  const nav = useNavigate()
  const [nome, setNome] = useState('')
  const [tags, setTags] = useState({})
  const [aGuardar, setAGuardar] = useState(false)
  const [erro, setErro] = useState('')
  const [ativa, setAtiva] = useState('personalidade')
  const pronto = nome.trim() && tagsCompletas(tags)

  async function guardar() {
    setAGuardar(true)
    setErro('')
    try {
      const fig = figura(tags.personalidade, tags.poder, tags.caracter)
      const eu = await criarPessoa(nome.trim().split(' ')[0], fig.tagline)
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
      <Topo passo="1 de 6 · Como te vês" />
      <div className="duas-colunas ecra-palavras">
        <div className="col-hero"><PreviaFigura tags={tags} ativa={ativa} /></div>
        <div className="col-conteudo">
          <input className="campo" placeholder="O teu primeiro nome" autoComplete="given-name" value={nome} onChange={(e) => setNome(e.target.value)} />
          <div style={{ height: 12 }} />
          <TresPalavras valor={tags} onChange={setTags} onAtiva={setAtiva} />
          {erro && <p className="erro">{erro}</p>}
          <div className="fixo">
            <button className="btn" disabled={!pronto || aGuardar} onClick={guardar}>
              {aGuardar ? 'A criar o teu MighT…' : pronto ? 'Criar o meu MighT' : !nome.trim() ? 'Escreve o teu primeiro nome' : 'Escolhe as 3 palavras'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
