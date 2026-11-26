import { describe, it, expect } from 'vitest'
import { figura, figuraSVG } from '../figura/index.js'
import { TAGS } from '../logica/index.js'

describe('figura (Parte C)', () => {
  it('é determinística: as mesmas palavras dão a mesma figura', () => {
    expect(figuraSVG('Curioso', 'Líder', 'Coragem')).toBe(figuraSVG('Curioso', 'Líder', 'Coragem'))
  })
  it('palavras diferentes dão figuras diferentes', () => {
    expect(figuraSVG('Curioso', 'Líder', 'Coragem')).not.toBe(figuraSVG('Lógico', 'Escritor', 'Humildade'))
  })
  it('devolve src (data URL SVG) e a tagline da biblioteca', () => {
    const f = figura('Curioso', 'Líder', 'Coragem')
    expect(f.src.startsWith('data:image/svg+xml')).toBe(true)
    expect(f.tagline).toBe('Deixa Ver!')
  })
  it('gera SVG bem formado para todas as palavras', () => {
    for (const { tag } of TAGS.personalidade) {
      const svg = figuraSVG(tag, TAGS.poder[0].tag, TAGS.caracter[0].tag)
      expect(svg.startsWith('<svg')).toBe(true)
      expect(svg.trim().endsWith('</svg>')).toBe(true)
      expect(svg).not.toMatch(/undefined|NaN/)
    }
  })
  it('não rebenta sem palavras (ecrã ainda vazio)', () => {
    expect(() => figura(undefined, undefined, undefined)).not.toThrow()
  })
})
