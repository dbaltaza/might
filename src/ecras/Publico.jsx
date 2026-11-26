import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { lerPessoa, enviarMight } from '../db.js'
import { figura } from '../../figura/index.js'
import { TresPalavras, EscolherCirculo, tagsCompletas, Topo } from '../ui.jsx'
import { PreviaFigura } from '../Silhueta.jsx'

// Página pública do convite (QR). Sem conta: primeiro nome, círculo e 3 palavras.
export default function Publico() {
  const { id } = useParams()
  const [pessoa, setPessoa] = useState(undefined)
  const [nome, setNome] = useState('')
  const [circulo, setCirculo] = useState('')
  const [tags, setTags] = useState({})
  const [feito, setFeito] = useState(false)
  const [aEnviar, setAEnviar] = useState(false)
  const [erro, setErro] = useState('')
  const [ativa, setAtiva] = useState('personalidade')
  useEffect(() => { lerPessoa(id).then(setPessoa).catch(() => setPessoa(null)) }, [id])
  const pronto = nome.trim() && circulo && tagsCompletas(tags)

  if (pessoa === undefined) return <Topo />
  if (pessoa === null) {
    return (
      <>
        <Topo />
        <div className="ecra-centro">
          <h1>Este convite já não está ativo</h1>
          <p className="lead">Pede um link novo a quem to enviou. Entretanto, podes criar o teu.</p>
          <Link className="btn" to="/criar">Criar o meu MighT</Link>
        </div>
      </>
    )
  }
  if (feito) {
    const fig = figura(tags.personalidade, tags.poder, tags.caracter)
    return (
      <>
        <Topo />
        <div className="ecra-centro">
          <h1>{pessoa.nome} vai ver como a vês</h1>
          <div className="figura revela"><img src={fig.src} alt="" /></div>
          <div className="tagline">“{fig.tagline}”</div>
          <div className="vidro"><h2>E tu, como te veem?</h2><p className="nota" style={{ margin: 0 }}>Cria o teu MighT e pede a quem te conhece.</p></div>
          <Link className="btn" to="/criar">Criar o meu MighT</Link>
        </div>
      </>
    )
  }
  async function enviar() {
    setErro('')
    setAEnviar(true)
    try {
      await enviarMight({ de_id: null, de_nome: nome.trim().split(' ')[0], para_id: pessoa.id, circulo, ...tags, estado: 'pendente' })
      setFeito(true)
    } catch (e) {
      setErro('O MighT não foi enviado: ' + (e.message || 'sem ligação') + '. Toca em Mandar outra vez.')
    }
    setAEnviar(false)
  }
  return (
    <>
      <Topo passo="Pedido de MighT" />
      <div className="duas-colunas ecra-palavras">
        <div className="col-hero"><PreviaFigura tags={tags} ativa={ativa} /></div>
        <div className="col-conteudo">
          <h1>Como vês {pessoa.nome}?</h1>
          <p className="lead">Uma palavra para a cabeça, o corpo e os braços da figura. Só mostramos o teu primeiro nome.</p>
          <input className="campo" placeholder="O teu primeiro nome" autoComplete="given-name" value={nome} onChange={(e) => setNome(e.target.value)} />
          <div className="rotulo">De onde se conhecem?</div>
          <EscolherCirculo valor={circulo} onChange={setCirculo} />
          <div style={{ height: 14 }} />
          <TresPalavras valor={tags} onChange={setTags} sobre={pessoa.nome} onAtiva={setAtiva} />
          {erro && <p className="erro">{erro}</p>}
          <div className="fixo">
            <button className="btn" disabled={!pronto || aEnviar} onClick={enviar}>
              {aEnviar ? 'A enviar…' : pronto ? `Mandar MighT a ${pessoa.nome}` : !nome.trim() ? 'Escreve o teu nome' : !circulo ? 'Escolhe o círculo' : 'Escolhe as 3 palavras'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
