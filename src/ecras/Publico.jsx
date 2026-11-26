import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { lerPessoa, enviarMight } from '../db.js'
import { EscolherTags, EscolherCirculo, tagsCompletas } from '../ui.jsx'

// Página pública do convite (QR). Sem conta: primeiro nome, círculo e 3 palavras.
export default function Publico() {
  const { id } = useParams()
  const [pessoa, setPessoa] = useState(undefined)
  const [nome, setNome] = useState('')
  const [circulo, setCirculo] = useState('')
  const [tags, setTags] = useState({})
  const [feito, setFeito] = useState(false)
  const [erro, setErro] = useState('')
  useEffect(() => { lerPessoa(id).then(setPessoa).catch(() => setPessoa(null)) }, [id])
  const pronto = nome.trim() && circulo && tagsCompletas(tags)

  if (pessoa === undefined) return <p>A carregar…</p>
  if (pessoa === null) {
    return (
      <>
        <h1>Este convite já não existe</h1>
        <Link className="btn lima" to="/criar">Criar o meu MighT</Link>
      </>
    )
  }
  if (feito) {
    return (
      <>
        <div className="passo">Enviado</div>
        <h1>Obrigado! A {pessoa.nome} vai ver como a vês.</h1>
        <p>E tu? Descobre como os outros te veem.</p>
        <Link className="btn lima" to="/criar">Criar o meu MighT</Link>
      </>
    )
  }
  async function enviar() {
    setErro('')
    try {
      await enviarMight({ de_id: null, de_nome: nome.trim().split(' ')[0], para_id: pessoa.id, circulo, ...tags, estado: 'pendente' })
      setFeito(true)
    } catch (e) {
      setErro('Não deu para enviar. Tenta outra vez.')
      console.error(e)
    }
  }
  return (
    <>
      <div className="passo">Pedido de MighT</div>
      <h1>Como vês a {pessoa.nome}?</h1>
      <p>Escolhe uma palavra para cada parte. Não precisas de conta. Só mostramos o teu primeiro nome.</p>
      <input className="campo" placeholder="O teu primeiro nome" value={nome} onChange={(e) => setNome(e.target.value)} />
      <div className="rotulo">De onde a conheces?</div>
      <EscolherCirculo valor={circulo} onChange={setCirculo} />
      <EscolherTags valor={tags} onChange={setTags} />
      {erro && <p className="erro">{erro}</p>}
      <div className="fixo">
        <button className="btn lima" disabled={!pronto} onClick={enviar}>{pronto ? `Enviar MighT à ${pessoa.nome}` : 'Nome, círculo e 3 palavras'}</button>
      </div>
    </>
  )
}
