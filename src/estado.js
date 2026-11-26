import { useEffect, useState, useCallback, useRef } from 'react'
import { meuId, lerPessoa, listarMights, ouvirMights, limparTudo } from './db.js'
import { desbloqueado, pesos, MIN_DESBLOQUEIO } from '../logica/index.js'

// Estado do utilizador deste telemóvel: pessoa, Self MighT, MighTs recebidos (tempo real).
// Cache em memória: ao mudar de ecrã mostra logo o último estado conhecido e atualiza por trás (sem flash).
const cache = new Map()
export function useEu() {
  const [perdido, setPerdido] = useState(false)
  const id = perdido ? null : meuId()
  const guardado = id ? cache.get(id) : null
  const [pessoa, setPessoa] = useState(guardado?.pessoa ?? null)
  const [mights, setMights] = useState(guardado?.mights ?? [])
  const [carregado, setCarregado] = useState(!id || !!guardado)
  const ultimo = useRef(guardado ? JSON.stringify(guardado) : null) // por instância: a cache é partilhada com o App

  const recarregar = useCallback(async () => {
    if (!id) return
    let p, ms
    try {
      ;[p, ms] = await Promise.all([lerPessoa(id), listarMights(id)])
    } catch {
      setCarregado(true) // sem rede: mantém o que já tinha
      return
    }
    if (p === null) {
      limparTudo() // este telemóvel guardava um "eu" que não existe nesta base de dados
      setPerdido(true)
      setCarregado(true)
      return
    }
    const novo = { pessoa: p, mights: ms }
    const json = JSON.stringify(novo)
    if (json === ultimo.current) return setCarregado(true) // polling sem novidades
    ultimo.current = json
    cache.set(id, novo)
    setPessoa(p)
    setMights(ms)
    setCarregado(true)
  }, [id])

  useEffect(() => {
    if (!id) return undefined
    recarregar()
    return ouvirMights(id, recarregar)
  }, [id, recarregar])

  const self = mights.find((m) => m.circulo === 'Self') ?? null
  const recebidos = mights.filter((m) => m.circulo !== 'Self')
  const aceites = recebidos.filter((m) => m.estado === 'aceite')
  return {
    id,
    pessoa,
    self,
    recebidos,
    aceites,
    carregado,
    recarregar,
    desbloqueado: desbloqueado(recebidos),
    faltam: Math.max(0, MIN_DESBLOQUEIO - aceites.length),
    pesos: pesos(recebidos),
  }
}

const k = 'might.enviou'
export const jaEnviou = () => { try { return localStorage.getItem(k) === '1' } catch { return false } }
export const marcarEnviou = () => { try { localStorage.setItem(k, '1') } catch { /* sem storage */ } }

export const topTag = (pesosDim) => Object.entries(pesosDim || {}).sort((a, b) => b[1] - a[1])[0]?.[0]
export const linkPublico = (id) => `${location.origin}${location.pathname}#/m/${id}`

// Duelos abertos já, sem os 3 MighTs: até desbloquear, usa as palavras do Self MighT.
// ponytail: atalho para a demo; tirem `livre` nos ecrãs de duelo para voltar a exigir 3.
export const pesosDuelo = (eu) =>
  eu.desbloqueado || !eu.self ? eu.pesos : { personalidade: { [eu.self.personalidade]: 1 }, poder: { [eu.self.poder]: 1 }, caracter: { [eu.self.caracter]: 1 } }
