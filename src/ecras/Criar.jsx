import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { figura } from '../../figura/index.js'
import { criarPessoa, definirEu, guardarSelf } from '../db.js'
import { EscolherTags, tagsCompletas } from '../ui.jsx'

// Passo 1: Self MighT. Meta: menos de 2 minutos.
export default function Criar() {
  const nav = useNavigate()
  const [nome, setNome] = useState('')
  const [tags, setTags] = useState({})
  const [aGuardar, setAGuardar] = useState(false)
  const [erro, setErro] = useState('')
  const fig = figura(tags.personalidade, tags.poder, tags.caracter)
  const pronto = nome.trim() && tagsCompletas(tags)

  async function guardar() {
    setAGuardar(true)
    setErro('')
    try {
      const eu = await criarPessoa(nome.trim().split(' ')[0], fig.tagline)
      definirEu(eu.id)
      await guardarSelf(eu, tags)
      nav('/feito')
    } catch (e) {
      setErro('Não deu para guardar. Tenta outra vez. (' + (e.message || e) + ')')
      setAGuardar(false)
    }
  }

  return (
    <>
      <div className="passo">Passo 1 · Self MighT</div>
      <h1>Como te vês?</h1>
      <div className="fig">
        <img src={fig.src} alt="A tua figura MighT" />
        <div className="tl-grande">“{fig.tagline}”</div>
      </div>
      <input className="campo" placeholder="O teu primeiro nome" value={nome} onChange={(e) => setNome(e.target.value)} />
      <EscolherTags valor={tags} onChange={setTags} />
      {erro && <p className="erro">{erro}</p>}
      <div className="fixo">
        <button className="btn lima" disabled={!pronto || aGuardar} onClick={guardar}>
          {aGuardar ? 'A criar…' : pronto ? 'Criar o meu MighT' : 'Escolhe nome e 3 palavras'}
        </button>
      </div>
    </>
  )
}
