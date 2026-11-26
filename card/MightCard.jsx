// Parte B: MighT Card. Substituam o corpo, NÃO a assinatura.
// <MightCard ref={ref} pessoa={{nome, tagline, figura}} pesos={pesos} circulos={['Colegas', ...]} formato="retrato"|"linkedin" />
// descarregarPNG(ref, nome) → descarrega o PNG do cartão.
import { forwardRef } from 'react'
import { toPng } from 'html-to-image'
import { DIMS, DIM_NOME } from '../logica/index.js'

export const MightCard = forwardRef(function MightCard({ pessoa, pesos, circulos = [], formato = 'retrato' }, ref) {
  const w = formato === 'linkedin' ? 600 : 360
  const h = formato === 'linkedin' ? 314 : 480
  const top = (d) => Object.entries(pesos?.[d] || {}).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([t]) => t)
  return (
    <div ref={ref} style={{ width: w, height: h, background: '#0f1a3a', color: '#fff', borderRadius: 16, padding: 20, boxSizing: 'border-box', display: 'flex', flexDirection: formato === 'linkedin' ? 'row' : 'column', gap: 12, alignItems: 'center' }}>
      <img src={pessoa?.figura} alt="" style={{ height: formato === 'linkedin' ? 220 : 200 }} />
      <div>
        <div style={{ fontSize: 24, fontWeight: 800 }}>{pessoa?.nome}</div>
        <div style={{ color: '#c4f000', fontStyle: 'italic', marginBottom: 8 }}>“{pessoa?.tagline}”</div>
        {DIMS.map((d) => (
          <div key={d} style={{ fontSize: 13 }}><b>{DIM_NOME[d]}:</b> {top(d).join(' · ')}</div>
        ))}
        <div style={{ fontSize: 11, opacity: 0.7, marginTop: 8 }}>Pelos olhos de: {circulos.join(', ')}</div>
      </div>
    </div>
  )
})

export async function descarregarPNG(ref, nome = 'might') {
  const url = await toPng(ref.current, { pixelRatio: 2 })
  const a = document.createElement('a')
  a.href = url
  a.download = `MighT-${nome}.png`
  a.click()
}
