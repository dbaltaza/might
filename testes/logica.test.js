import { describe, it, expect } from 'vitest'
import { pesos, desbloqueado, semelhanca, maisParecidos, funcoesIdeais, FUNCOES, TAGS, PESSOAS_FICTICIAS, DIMS, tagline } from '../logica/index.js'

const m = (personalidade, poder, caracter, estado = 'aceite', circulo = 'Amigos') => ({ personalidade, poder, caracter, estado, circulo })

describe('pesos: contagem ÷ total na dimensão', () => {
  it('calcula à mão um caso simples', () => {
    const w = pesos([m('Curioso', 'Líder', 'Coragem'), m('Curioso', 'Inovador', 'Coragem'), m('Lógico', 'Líder', 'Liberdade'), m('Curioso', 'Líder', 'Coragem')])
    expect(w.personalidade).toEqual({ Curioso: 0.75, Lógico: 0.25 })
    expect(w.poder).toEqual({ Líder: 0.75, Inovador: 0.25 })
    expect(w.caracter.Coragem).toBe(0.75)
  })
  it('ignora pendentes e recusados', () => {
    const w = pesos([m('Curioso', 'Líder', 'Coragem'), m('Lógico', 'Líder', 'Coragem', 'pendente'), m('Sábio', 'Líder', 'Coragem', 'recusado')])
    expect(w.personalidade).toEqual({ Curioso: 1 })
  })
  it('os pesos de cada dimensão somam 1', () => {
    const w = pesos(PESSOAS_FICTICIAS[5].mights)
    for (const d of DIMS) expect(Object.values(w[d]).reduce((a, b) => a + b, 0)).toBeCloseTo(1)
  })
  it('sem MighTs devolve dimensões vazias, sem dividir por zero', () => {
    expect(pesos([])).toEqual({ personalidade: {}, poder: {}, caracter: {} })
  })
})

describe('desbloqueio: 3 MighTs aceites', () => {
  it('2 aceites não chegam', () => expect(desbloqueado([m('a', 'b', 'c'), m('a', 'b', 'c')])).toBe(false))
  it('3 aceites chegam', () => expect(desbloqueado([m('a', 'b', 'c'), m('a', 'b', 'c'), m('a', 'b', 'c')])).toBe(true))
  it('pendentes não contam', () => expect(desbloqueado([m('a', 'b', 'c'), m('a', 'b', 'c'), m('a', 'b', 'c', 'pendente')])).toBe(false))
})

describe('semelhança: % de peso sobreposto', () => {
  const a = pesos([m('Curioso', 'Líder', 'Coragem'), m('Lógico', 'Líder', 'Coragem')])
  it('uma pessoa é 100% igual a si própria', () => expect(semelhanca(a, a)).toBe(100))
  it('sem palavras em comum dá 0%', () => expect(semelhanca(a, pesos([m('Sábio', 'Escritor', 'Humildade')]))).toBe(0))
  it('caso à mão: (0,5 + 1 + 0) / 3 = 50%', () => {
    const b = pesos([m('Curioso', 'Líder', 'Liberdade')])
    expect(semelhanca(a, b)).toBe(50)
  })
  it('é simétrica', () => {
    const b = pesos([m('Curioso', 'Inovador', 'Coragem')])
    expect(semelhanca(a, b)).toBe(semelhanca(b, a))
  })
  it('filtra por dimensão', () => {
    const b = pesos([m('Sábio', 'Líder', 'Humildade')])
    expect(semelhanca(a, b, ['poder'])).toBe(100)
  })
})

describe('mais parecidos', () => {
  it('ordena por % descendente e mostra tags em comum', () => {
    const eu = { pesos: pesos(PESSOAS_FICTICIAS[0].mights) }
    const lista = maisParecidos(eu, PESSOAS_FICTICIAS)
    for (let i = 1; i < lista.length; i++) expect(lista[i - 1].pct).toBeGreaterThanOrEqual(lista[i].pct)
    expect(lista[0].pct).toBe(100) // a própria pessoa está nos dados
    expect(lista[1].comuns.length).toBeGreaterThan(0)
  })
})

describe('dados fictícios', () => {
  it('biblioteca de tags tem as contagens do ficheiro (19/27/15) e taglines', () => {
    expect([TAGS.personalidade.length, TAGS.poder.length, TAGS.caracter.length]).toEqual([19, 27, 15])
    expect(tagline('personalidade', 'Curioso')).toBe('Deixa Ver!')
  })
  it('só primeiros nomes (sem apelidos)', () => {
    for (const p of PESSOAS_FICTICIAS) expect(p.nome).not.toMatch(/\s/)
  })
  it('todas as palavras dos MighTs existem na biblioteca', () => {
    const existe = (d, t) => TAGS[d].some((x) => x.tag === t)
    for (const p of PESSOAS_FICTICIAS) for (const mi of p.mights) for (const d of DIMS) expect(existe(d, mi[d])).toBe(true)
  })
})

describe('funções ideais (hipóteses)', () => {
  it('todas as tags das funções existem na biblioteca', () => {
    for (const f of FUNCOES) for (const t of f.tags) expect(DIMS.some((d) => TAGS[d].some((x) => x.tag === t)), t).toBe(true)
  })
  it('devolve 3 funções com percurso e porquê', () => {
    const lista = funcoesIdeais({ pesos: pesos(PESSOAS_FICTICIAS[0].mights) })
    expect(lista).toHaveLength(3)
    for (const f of lista) for (const k of ['funcao', 'agora', 'proximo', 'desafio', 'porque']) expect(f[k]).toBeTruthy()
  })
  it('um perfil analítico recebe primeiro Analista de dados', () => {
    const eu = { pesos: pesos([m('Lógico', 'Analisador', 'Disciplina'), m('Curioso', 'Investigador', 'Disciplina'), m('Lógico', 'Analisador', 'Disciplina')]) }
    expect(funcoesIdeais(eu)[0].funcao).toBe('Analista de dados')
  })
})
