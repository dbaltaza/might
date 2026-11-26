import { useEffect, useRef, useState } from 'react'

// Duelo aéreo para dois no mesmo ecrã. Baixo (azul): A/D mover, W disparar. Cima (roxo): ←/→ mover, ↓ disparar.
// No telemóvel: botões de cada lado. 3 vidas cada; quem fica sem vidas perde.
// ponytail: um só ecrã/teclado; duelo entre dois telemóveis precisaria de tempo real no Supabase.
const L = 360, A = 540, VIDAS = 3, VEL = 4, BALA = 7, ESPERA = 280
const TECLAS = { a: [0, 'esq'], d: [0, 'dir'], w: [0, 'tiro'], ArrowLeft: [1, 'esq'], ArrowRight: [1, 'dir'], ArrowDown: [1, 'tiro'] }
const COR = ['#358ec0', '#c87bce']

export default function JogoVoo({ nomes, onFim }) {
  const tela = useRef(null)
  const input = useRef([{}, {}])
  const [vidas, setVidas] = useState([VIDAS, VIDAS])
  const props = useRef()
  props.current = { nomes, onFim } // o jogo corre uma vez; re-renders do pai não o reiniciam

  useEffect(() => {
    const ctx = tela.current.getContext('2d')
    const naves = [{ x: L / 2, y: A - 50, dir: -1, ultimo: 0 }, { x: L / 2, y: 50, dir: 1, ultimo: 0 }]
    const vid = [VIDAS, VIDAS]
    let balas = [], raf, acabou = false
    const estrelas = Array.from({ length: 40 }, () => [Math.random() * L, Math.random() * A])

    const tecla = (v) => (e) => {
      const k = TECLAS[e.key]
      if (!k) return
      e.preventDefault()
      input.current[k[0]][k[1]] = v
    }
    const baixo = tecla(true), cima = tecla(false)
    addEventListener('keydown', baixo)
    addEventListener('keyup', cima)

    function nave(n, cor) {
      ctx.fillStyle = cor
      ctx.beginPath()
      ctx.moveTo(n.x, n.y + 22 * n.dir) // nariz aponta para o adversário
      ctx.lineTo(n.x - 20, n.y - 12 * n.dir)
      ctx.lineTo(n.x, n.y - 4 * n.dir)
      ctx.lineTo(n.x + 20, n.y - 12 * n.dir)
      ctx.fill()
    }

    function passo(t) {
      naves.forEach((n, i) => {
        const k = input.current[i]
        if (k.esq) n.x = Math.max(20, n.x - VEL)
        if (k.dir) n.x = Math.min(L - 20, n.x + VEL)
        if (k.tiro && t - n.ultimo > ESPERA) { n.ultimo = t; balas.push({ x: n.x, y: n.y + 24 * n.dir, dir: n.dir, de: i }) }
      })
      balas.forEach((b) => { b.y += BALA * b.dir })
      balas = balas.filter((b) => {
        const alvo = naves[1 - b.de], i = 1 - b.de
        if (Math.abs(b.x - alvo.x) < 20 && Math.abs(b.y - alvo.y) < 16) {
          vid[i]--
          setVidas([...vid])
          return false
        }
        return b.y > 0 && b.y < A
      })

      ctx.fillStyle = '#0b1530'
      ctx.fillRect(0, 0, L, A)
      ctx.fillStyle = 'rgba(255,255,255,0.5)'
      estrelas.forEach((s) => { s[1] = (s[1] + 0.6) % A; ctx.fillRect(s[0], s[1], 2, 2) })
      balas.forEach((b) => { ctx.fillStyle = COR[b.de]; ctx.fillRect(b.x - 2, b.y - 6, 4, 12) })
      naves.forEach((n, i) => nave(n, vid[i] > 0 ? COR[i] : '#555'))

      const perdeu = vid.findIndex((v) => v <= 0)
      if (perdeu >= 0 && !acabou) { acabou = true; setTimeout(() => props.current.onFim(props.current.nomes[1 - perdeu]), 700) }
      if (!acabou) raf = requestAnimationFrame(passo)
    }
    raf = requestAnimationFrame(passo)
    return () => { cancelAnimationFrame(raf); removeEventListener('keydown', baixo); removeEventListener('keyup', cima) }
  }, [])

  const botoes = (i) => (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center', margin: '8px 0' }}>
      {[['esq', '◀'], ['tiro', '●'], ['dir', '▶']].map(([k, s]) => (
        <button key={k} type="button" className="btn sec" style={{ flex: 1, margin: 0, touchAction: 'none', borderColor: COR[i] }}
          aria-label={`${nomes[i]}: ${k}`}
          onPointerDown={() => { input.current[i][k] = true }}
          onPointerUp={() => { input.current[i][k] = false }}
          onPointerLeave={() => { input.current[i][k] = false }}>{s}</button>
      ))}
    </div>
  )

  return (
    <div>
      <Placar nome={nomes[1]} v={vidas[1]} cor={COR[1]} teclas="← → mover · ↓ disparar" />
      {botoes(1)}
      <canvas ref={tela} width={L} height={A} style={{ width: '100%', maxWidth: L, display: 'block', margin: '0 auto', borderRadius: 12 }} />
      {botoes(0)}
      <Placar nome={nomes[0]} v={vidas[0]} cor={COR[0]} teclas="A D mover · W disparar" />
    </div>
  )
}

function Placar({ nome, v, cor, teclas }) {
  return (
    <p className="nota" style={{ textAlign: 'center', margin: '4px 0' }}>
      <b style={{ color: cor }}>{nome}</b> {'♥'.repeat(Math.max(0, v))}{'♡'.repeat(VIDAS - Math.max(0, v))} · {teclas}
    </p>
  )
}
