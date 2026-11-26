// Parte B: MighT Card. Substituam o corpo, NÃO a assinatura.
// <MightCard ref={ref} pessoa={{nome, tagline, figura}} pesos={pesos} circulos={['Colegas', ...]} formato="retrato"|"linkedin" />
// descarregarPNG(ref, nome) → descarrega o PNG do cartão.
//
// Visual: segue o card oficial do kit (CASE ASSETS/08. MighT Card Visual): gradiente azul,
// figura ao centro, nome centrado, 3 tags com ícone (cabeça · corpo · braços), tagline em baixo.
// O cartão tem tamanho fixo (para o PNG sair sempre igual) e é encolhido no ecrã para caber no telemóvel.
import { forwardRef, useLayoutEffect, useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import { DIMS } from '../logica/index.js'

const TAM = { retrato: [360, 488], linkedin: [600, 314] }
const AZUL_1 = '#2360C7'
const AZUL_2 = '#0A295C'
const LINHA = 'rgba(255,255,255,.22)'

// Ícone MighT do canto (do card oficial)
const Logo = ({ size = 22 }) => (
  <svg width={size} height={size * 1.4} viewBox="304 24 25 35" fill="white" fillOpacity=".6" aria-hidden>
    <path d="M318.095 46.0593H314.905C312.616 46.0593 310.462 45.0724 308.812 43.3587L310.095 56.3607C310.234 57.7756 311.265 58.8442 312.49 58.8442H313.256C314.049 58.8442 314.692 58.0966 314.692 57.1752C314.692 56.2537 315.335 55.5061 316.128 55.5061H316.876C317.669 55.5061 318.312 56.2537 318.312 57.1752C318.312 58.0966 318.955 58.8442 319.748 58.8442H320.514C321.739 58.8442 322.77 57.7756 322.909 56.3607L324.192 43.3587C322.542 45.0709 320.386 46.0593 318.098 46.0593H318.095Z" />
    <path d="M329 34.4351C329 31.7836 327.404 29.5661 325.269 29.0043C323.902 26.0273 321.202 24 318.095 24H314.905C311.798 24 309.1 26.0273 307.731 29.0043C305.596 29.5661 304 31.7836 304 34.4351C304 37.0867 305.596 39.3042 307.731 39.866C309.1 42.843 311.798 44.8703 314.905 44.8703H318.095C321.202 44.8703 323.9 42.843 325.269 39.866C327.404 39.3042 329 37.0867 329 34.4351Z" />
    <path d="M307.701 42.5428L305.71 55.0201C305.513 56.2581 306.33 57.4011 307.413 57.4011C308.11 57.4011 309.011 56.5688 309.011 55.8345L307.701 42.5428Z" />
    <path d="M325.299 42.5428L327.29 55.0201C327.487 56.2581 326.67 57.4011 325.587 57.4011C324.89 57.4011 323.988 56.5688 323.988 55.8345L325.299 42.5428Z" />
  </svg>
)

// Ícones simples para cada parte da figura
const ICONE = {
  personalidade: <svg width="14" height="12" viewBox="0 0 14 12" fill="white" aria-hidden><ellipse cx="7" cy="6" rx="7" ry="5.5" /></svg>,
  poder: <svg width="11" height="13" viewBox="0 0 11 13" fill="white" aria-hidden><rect x="1" y="0" width="9" height="13" rx="3" /></svg>,
  caracter: <svg width="14" height="13" viewBox="0 0 14 13" fill="none" stroke="white" strokeWidth="2.6" strokeLinecap="round" aria-hidden><path d="M4 1.5 L1.8 11.5 M10 1.5 L12.2 11.5" /></svg>,
}
const PARTE = { personalidade: 'Cabeça', poder: 'Corpo', caracter: 'Braços' }

const topo = (pesos, d) => Object.entries(pesos?.[d] || {}).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'

export const MightCard = forwardRef(function MightCard({ pessoa, pesos, circulos = [], formato = 'retrato' }, ref) {
  const [w, h] = TAM[formato] ?? TAM.retrato
  const ret = formato !== 'linkedin'
  const caixa = useRef(null)
  const [escala, setEscala] = useState(1)

  // Encolhe o cartão para caber na largura disponível (o PNG sai sempre no tamanho real).
  useLayoutEffect(() => {
    const el = caixa.current?.parentElement
    if (!el) return undefined
    const medir = () => {
      const cs = getComputedStyle(el)
      const livre = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
      setEscala(Math.min(1, livre / w))
    }
    medir()
    const ro = new ResizeObserver(medir)
    ro.observe(el)
    return () => ro.disconnect()
  }, [w])

  const tags = (
    <div style={{ borderTop: `1px solid ${LINHA}`, borderBottom: `1px solid ${LINHA}`, padding: ret ? '10px 0' : '8px 0', display: 'flex', flexWrap: 'wrap', justifyContent: ret ? 'center' : 'flex-start', columnGap: 16, rowGap: 6 }}>
      {DIMS.map((d) => (
        <div key={d} title={PARTE[d]} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: ret ? 14 : 13, whiteSpace: 'nowrap' }}>
          {ICONE[d]} {topo(pesos, d)}
        </div>
      ))}
    </div>
  )

  const rodape = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div title="Círculos" style={{ flex: 'none', width: 34, height: 34, borderRadius: 999, background: 'rgba(255,255,255,.15)', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 700 }}>
        {circulos.length}
      </div>
      <div style={{ flex: 1, textAlign: 'right', fontSize: ret ? 13 : 12.5, lineHeight: 1.35 }}>
        {pessoa?.tagline && <div style={{ fontWeight: 600 }}>{pessoa.tagline}</div>}
        {circulos.length > 0 && <div style={{ opacity: 0.7, fontSize: 11 }}>Pelos olhos de: {circulos.join(' · ')}</div>}
      </div>
    </div>
  )

  return (
    <div ref={caixa} style={{ width: w * escala, height: h * escala, flex: 'none' }}>
      <div
        ref={ref}
        style={{
          width: w, height: h, transform: `scale(${escala})`, transformOrigin: 'top left',
          background: `linear-gradient(180deg, ${AZUL_1}, ${AZUL_2})`, color: '#fff',
          borderRadius: 10, boxSizing: 'border-box', padding: ret ? '18px 22px 20px' : 20,
          fontFamily: "'Mona Sans', system-ui, sans-serif", position: 'relative', overflow: 'hidden',
          display: 'flex', flexDirection: ret ? 'column' : 'row', gap: ret ? 10 : 22,
        }}
      >
        <div style={{ position: 'absolute', top: 16, right: 18 }}><Logo /></div>
        {pessoa?.figura && (
          <img src={pessoa.figura} alt="" style={ret
            ? { height: 230, margin: '14px auto 0', display: 'block' }
            : { height: 260, alignSelf: 'center', flex: 'none' }} />
        )}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: ret ? 'flex-end' : 'center', gap: 14, minWidth: 0 }}>
          <div style={{ fontSize: 34, fontWeight: 800, textAlign: ret ? 'center' : 'left', letterSpacing: '-0.01em', lineHeight: 1.1 }}>
            {pessoa?.nome}
          </div>
          {tags}
          {rodape}
        </div>
      </div>
    </div>
  )
})

export async function descarregarPNG(ref, nome = 'might') {
  const el = ref.current
  // O cartão no ecrã pode estar encolhido: exporta-o no tamanho real, em alta resolução.
  const url = await toPng(el, {
    pixelRatio: 3,
    width: el.offsetWidth,
    height: el.offsetHeight,
    style: { transform: 'none' },
  })
  const a = document.createElement('a')
  a.href = url
  a.download = `MighT-${nome}.png`
  a.click()
}
