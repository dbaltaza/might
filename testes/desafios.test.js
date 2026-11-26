import { test, expect } from 'vitest'
import { palavraComum, desafio } from '../logica/desafios.js'

test('dois criativos recebem um desafio criativo', () => {
  const a = { personalidade: { Imaginativo: 0.6, Lógico: 0.4 }, poder: {}, caracter: {} }
  const b = { personalidade: { Imaginativo: 0.5, Lógico: 0.9 }, poder: {}, caracter: {} }
  const c = palavraComum(a, b)
  expect(c.tag).toBe('Imaginativo') // min 0.5 > min 0.4
  expect(desafio(c.tag).familia).toBe('Criativo')
  expect(desafio(c.tag, 1).texto).not.toBe(desafio(c.tag, 0).texto)
  expect(palavraComum(a, { personalidade: { Sábio: 1 } })).toBe(null)
  expect(desafio('Sábio').familia).toBe(null)
})

test('dois competitivos vão para o Snake, mesmo com outra palavra mais forte', () => {
  const a = { personalidade: { Competitivo: 0.2, Imaginativo: 0.8 }, poder: {}, caracter: {} }
  const c = palavraComum(a, a)
  expect(c.tag).toBe('Competitivo')
  expect(desafio(c.tag).jogo).toBe('cobra')
})

test('a palavra com jogo só conta se os dois a tiverem', () => {
  const a = { personalidade: { Competitivo: 1 }, poder: {}, caracter: {} }
  const b = { personalidade: { Lógico: 1 }, poder: {}, caracter: {} }
  expect(palavraComum(a, b)).toBe(null)
})

test('snake: comer cresce, bater perde, cabeça contra cabeça empata', async () => {
  const { passo, inicio } = await import('../src/JogoCobra.jsx')
  let e = inicio(() => 0.99)
  e.maca = [5, 5] // mesmo à frente do azul
  e = passo(e)
  expect(e.cobras[0].corpo.length).toBe(4)
  expect(e.fim).toBe(null)
  e.cobras[0].dir = 'cima'
  for (let i = 0; i < 10 && e.fim === null; i++) e = passo(e)
  expect(e.fim).toBe(0) // azul bateu na parede de cima
  const f = { rnd: () => 0, maca: [0, 0], fim: null, cobras: [{ dir: 'dir', corpo: [[4, 9]] }, { dir: 'esq', corpo: [[6, 9]] }] }
  expect(passo(f).fim).toBe('Empate')
})
