// Única porta para a base de dados. Supabase se houver .env.local; senão localStorage (plano B, mesma API).
import { createClient } from '@supabase/supabase-js'

const URL = import.meta.env.VITE_SUPABASE_URL
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
export const sb = URL && KEY ? createClient(URL, KEY) : null
export const MODO = sb ? 'supabase' : 'local'

const uid = () => crypto.randomUUID()
const ler = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d } catch { return d } }
const gravar = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch { /* sem storage */ } }

// Quem sou eu neste telemóvel
export const meuId = () => ler('might.eu', null)
export const definirEu = (id) => gravar('might.eu', id)

// Pontos dos duelos, por nome, neste dispositivo (o duelo joga-se num só ecrã).
// ponytail: localStorage; coluna `pontos` em pessoas se tiverem de aparecer noutros telemóveis.
export const lerPontos = () => ler('might.pontos', {})
export function somarPontos(ganhos) {
  const p = lerPontos()
  for (const [nome, n] of Object.entries(ganhos)) p[nome] = (p[nome] || 0) + n
  gravar('might.pontos', p)
  return p
}

export async function criarPessoa(nome, tagline = '', artista = null) {
  const p = { id: uid(), nome, tagline, artista, publico: false }
  if (sb) {
    // Sem .select(): a anon key não lê a tabela (ver db/schema.sql), por isso o id nasce aqui.
    const { error } = await sb.from('pessoas').insert(p)
    if (error) throw error
    return p
  }
  gravar('might.pessoas', { ...ler('might.pessoas', {}), [p.id]: p })
  return p
}

export async function escolherArtista(id, artista) {
  if (sb) {
    const { error } = await sb.rpc('editar_pessoa', { p: id, novo_artista: artista })
    if (error) throw error
    return
  }
  const ps = ler('might.pessoas', {})
  if (ps[id]) gravar('might.pessoas', { ...ps, [id]: { ...ps[id], artista } })
}

export async function lerPessoa(id) {
  if (sb) {
    const { data, error } = await sb.rpc('ler_pessoa', { p: id })
    if (error?.code === '22P02') return null // id que não é uuid (ex.: vindo do modo local)
    if (error) throw error
    return data?.[0] ?? null
  }
  return ler('might.pessoas', {})[id] ?? null
}

// might = { de_id, de_nome, para_id, circulo, personalidade, poder, caracter, estado? }
export async function enviarMight(might) {
  const novo = { id: uid(), criado_em: new Date().toISOString(), estado: 'pendente', ...might }
  if (sb) {
    const { error } = await sb.from('mights').insert(novo)
    if (error) throw error
    return novo
  }
  gravar('might.mights', [...ler('might.mights', []), novo])
  avisar()
  return novo
}

// Self MighT = de_id === para_id, já aceite
export const guardarSelf = (eu, tags) =>
  enviarMight({ de_id: eu.id, de_nome: eu.nome, para_id: eu.id, circulo: 'Self', estado: 'aceite', ...tags })

export async function listarMights(paraId) {
  if (sb) {
    const { data } = await sb.rpc('mights_para', { p: paraId })
    return data ?? []
  }
  return ler('might.mights', []).filter((m) => m.para_id === paraId)
}

export async function responder(id, estado) {
  if (sb) {
    await sb.rpc('responder_might', { m: id, eu: meuId(), novo: estado })
    return
  }
  gravar('might.mights', ler('might.mights', []).map((m) => (m.id === id ? { ...m, estado } : m)))
  avisar()
}

export async function publicar(id, sim) {
  if (sb) await sb.rpc('editar_pessoa', { p: id, novo_publico: sim })
}

// Chama cb() sempre que mudar um MighT desta pessoa. Devolve a função para parar.
const ouvintes = new Set()
function avisar() { ouvintes.forEach((f) => f()) }
export function ouvirMights(paraId, cb) {
  if (sb) {
    // ponytail: polling de 3 s; o realtime precisava de SELECT aberto na tabela.
    const t = setInterval(cb, 3000)
    return () => clearInterval(t)
  }
  ouvintes.add(cb)
  const onStorage = (e) => e.key === 'might.mights' && cb()
  window.addEventListener('storage', onStorage)
  return () => { ouvintes.delete(cb); window.removeEventListener('storage', onStorage) }
}

// Recomeçar a demo: apaga o que este browser guardou (identidade e, em modo local, todos os dados).
// Em modo Supabase os dados na nuvem ficam; este telemóvel só deixa de ser "eu".
export function limparTudo() {
  try {
    Object.keys(localStorage).filter((k) => k.startsWith('might.')).forEach((k) => localStorage.removeItem(k))
  } catch { /* sem storage */ }
}
