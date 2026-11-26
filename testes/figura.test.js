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

describe('figura: robustez do SVG', () => {
  it('todas as combinações têm SVG sem undefined/NaN, ids únicos por figura e tamanho contido', () => {
    for (const { tag: a } of TAGS.personalidade) for (const { tag: b } of TAGS.poder) {
      const c = TAGS.caracter[(a.length + b.length) % TAGS.caracter.length].tag
      const svg = figuraSVG(a, b, c)
      expect(svg).not.toMatch(/undefined|NaN/)
      expect(svg.length).toBeLessThan(25000)
      const ids = [...svg.matchAll(/ id="([^"]+)"/g)].map((m) => m[1])
      expect(new Set(ids).size).toBe(ids.length)
    }
  })
  it('cada carácter e palavras desconhecidas também geram SVG válido', () => {
    for (const { tag } of TAGS.caracter) expect(figuraSVG('Curioso', 'Líder', tag)).not.toMatch(/undefined|NaN/)
    expect(figuraSVG('xpto', '', undefined)).not.toMatch(/undefined|NaN/)
  })
})
