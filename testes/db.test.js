import { describe, it, expect, beforeEach, vi } from 'vitest'

// localStorage e window mínimos: testamos o modo local (plano B), sem Supabase.
const mem = new Map()
globalThis.localStorage = {
  getItem: (k) => (mem.has(k) ? mem.get(k) : null),
  setItem: (k, v) => mem.set(k, String(v)),
  removeItem: (k) => mem.delete(k),
  clear: () => mem.clear(),
}
globalThis.window = { addEventListener() {}, removeEventListener() {} }
vi.stubEnv('VITE_SUPABASE_URL', '')
vi.stubEnv('VITE_SUPABASE_ANON_KEY', '')

const db = await import('../src/db.js')
const { desbloqueado } = await import('../logica/index.js')

// Object.keys(localStorage) tem de devolver as chaves guardadas (usado em limparTudo)
const chaves = () => [...mem.keys()]
beforeEach(() => mem.clear())

describe('db em modo local', () => {
  it('sem variáveis do Supabase corre em modo local', () => expect(db.MODO).toBe('local'))

  it('fluxo 1→3: criar, Self, receber 3 pela sala, aceitar e desbloquear', async () => {
    const eu = await db.criarPessoa('Dinis', 'Deixa Ver!')
    db.definirEu(eu.id)
    expect(db.meuId()).toBe(eu.id)
    await db.guardarSelf(eu, { personalidade: 'Curioso', poder: 'Explorador', caracter: 'Liberdade' })

    const ouvido = vi.fn()
    const parar = db.ouvirMights(eu.id, ouvido)
    for (const de of ['Ana', 'Rui', 'Marta']) {
      await db.enviarMight({ de_id: null, de_nome: de, para_id: eu.id, circulo: 'Amigos', personalidade: 'Curioso', poder: 'Inovador', caracter: 'Coragem' })
    }
    expect(ouvido).toHaveBeenCalledTimes(3) // a caixa atualiza sem recarregar
    parar()

    let ms = await db.listarMights(eu.id)
    const recebidos = () => ms.filter((m) => m.circulo !== 'Self')
    expect(recebidos().every((m) => m.estado === 'pendente')).toBe(true)
    expect(desbloqueado(recebidos())).toBe(false)

    for (const m of recebidos()) await db.responder(m.id, 'aceite')
    ms = await db.listarMights(eu.id)
    expect(desbloqueado(recebidos())).toBe(true)
    expect(ms.find((m) => m.circulo === 'Self').estado).toBe('aceite')
  })

  it('recusar não conta para o desbloqueio', async () => {
    const eu = await db.criarPessoa('Ana')
    for (let i = 0; i < 3; i++) await db.enviarMight({ de_nome: 'X', para_id: eu.id, circulo: 'Colegas', personalidade: 'a', poder: 'b', caracter: 'c' })
    const [m1] = await db.listarMights(eu.id)
    await db.responder(m1.id, 'recusado')
    for (const m of (await db.listarMights(eu.id)).filter((x) => x.estado === 'pendente')) await db.responder(m.id, 'aceite')
    expect(desbloqueado(await db.listarMights(eu.id))).toBe(false)
  })

  it('lerPessoa devolve null para um convite que não existe', async () => {
    expect(await db.lerPessoa('nao-existe')).toBeNull()
  })

  it('limparTudo apaga só as chaves do MighT', async () => {
    mem.set('outra.app', '1')
    const eu = await db.criarPessoa('Rui')
    db.definirEu(eu.id)
    const keysOrig = Object.keys
    Object.keys = (o) => (o === globalThis.localStorage ? chaves() : keysOrig(o))
    db.limparTudo()
    Object.keys = keysOrig
    expect(db.meuId()).toBeNull()
    expect(chaves()).toEqual(['outra.app'])
  })
})
