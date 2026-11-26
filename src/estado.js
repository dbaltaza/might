import { useEffect, useState, useCallback } from 'react'
import { meuId, lerPessoa, listarMights, ouvirMights } from './db.js'
import { desbloqueado, pesos, MIN_DESBLOQUEIO } from '../logica/index.js'

// Estado do utilizador deste telemóvel: pessoa, Self MighT, MighTs recebidos (tempo real).
export function useEu() {
  const id = meuId()
  const [pessoa, setPessoa] = useState(null)
  const [mights, setMights] = useState([])
  const [carregado, setCarregado] = useState(!id)

  const recarregar = useCallback(async () => {
    if (!id) return
    const [p, ms] = await Promise.all([lerPessoa(id), listarMights(id)])
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
