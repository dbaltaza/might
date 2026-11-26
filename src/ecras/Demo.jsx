import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { criarPessoa, definirEu, guardarSelf, enviarMight, limparTudo } from '../db.js'
import { marcarEnviou } from '../estado.js'
import { figura } from '../../figura/index.js'

// Cenário de teste: #/demo cria um utilizador com o MighT feito e 3 pessoas com MighTs por aceitar (vai para a Caixa).
// #/demo?aceites já os traz aceites (vai para o All MighT). Funciona em modo Supabase e local.
const SELF = { personalidade: 'Curioso', poder: 'Explorador', caracter: 'Liberdade' }
const TRES = [
  ['Ana', 'Amigos', 'Curioso', 'Inovador', 'Coragem'],
  ['Rui', 'Colegas', 'Lógico', 'Inovador', 'Persistência'],
  ['Marta', 'Família', 'Curioso', 'Solucionador', 'Coragem'],
]
let aCorrer = false // o StrictMode corre o efeito duas vezes em desenvolvimento

export default function Demo() {
  const nav = useNavigate()
  const [params] = useSearchParams()
  const [erro, setErro] = useState('')
  const aceites = params.has('aceites')
  const nome = params.get('nome') || 'Dinis'

  useEffect(() => {
    if (aCorrer) return
    aCorrer = true
    ;(async () => {
      limparTudo()
      const eu = await criarPessoa(nome, figura(SELF.personalidade, SELF.poder, SELF.caracter).tagline, params.get('artista'))
      definirEu(eu.id)
      await guardarSelf(eu, SELF)
      marcarEnviou()
      for (const [de, circulo, personalidade, poder, caracter] of TRES) {
        await enviarMight({ de_id: null, de_nome: de, para_id: eu.id, circulo, personalidade, poder, caracter, estado: aceites ? 'aceite' : 'pendente' })
      }
      nav(aceites ? '/perfil' : '/caixa', { replace: true })
    })()
      .catch((e) => setErro(e.message || 'sem ligação'))
      .finally(() => { aCorrer = false })
  }, [aceites, nav, nome, params])

  return erro
    ? <><h1>O cenário de teste falhou</h1><p className="erro">{erro}</p><Link className="btn" to="/">Voltar ao início</Link></>
    : <p className="lead">A preparar o cenário de teste…</p>
}
