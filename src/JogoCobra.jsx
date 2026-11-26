import { useEffect, useRef, useState } from 'react'

// Snake para dois no mesmo ecrã, ao mesmo tempo. Azul: W A S D. Roxo: setas. No telemóvel: botões de cada lado.
// Comer a maçã faz crescer. Bater na parede, em si ou no outro = perde. Cabeça contra cabeça = empate.
// ponytail: um só ecrã/teclado; dois telemóveis precisariam de tempo real no Supabase.
const N = 20, C = 18, TICK = 120 // grelha N×N, células de C px, ms por passo
const COR = ['#358ec0', '#c87bce']
const DIRS = { cima: [0, -1], baixo: [0, 1], esq: [-1, 0], dir: [1, 0] }
const TECLAS = {
  w: [0, 'cima'], s: [0, 'baixo'], a: [0, 'esq'], d: [0, 'dir'],
  ArrowUp: [1, 'cima'], ArrowDown: [1, 'baixo'], ArrowLeft: [1, 'esq'], ArrowRight: [1, 'dir'],
}

// Um passo do jogo, puro (testável). Devolve o novo estado; `fim` = null | 0 | 1 | 'Empate' (quem perdeu).
export function passo(e) {
  const cobras = e.cobras.map((c) => {
    const [dx, dy] = DIRS[c.dir]
    const cabeca = [c.corpo[0][0] + dx, c.corpo[0][1] + dy]
    const come = cabeca[0] === e.maca[0] && cabeca[1] === e.maca[1]
    return { ...c, corpo: [cabeca, ...(come ? c.corpo : c.corpo.slice(0, -1))], come }
  })
  const ocupado = (x, y, saltar) => cobras.some((c, i) => c.corpo.some((p, j) => !(i === saltar && j === 0) && p[0] === x && p[1] === y))
  const morre = cobras.map((c, i) => {
    const [x, y] = c.corpo[0]
    return x < 0 || y < 0 || x >= N || y >= N || ocupado(x, y, i)
  })
  const fim = morre[0] && morre[1] ? 'Empate' : morre[0] ? 0 : morre[1] ? 1 : null
  let maca = e.maca
  if (cobras.some((c) => c.come)) {
    do maca = [Math.floor(e.rnd() * N), Math.floor(e.rnd() * N)]
    while (ocupado(maca[0], maca[1], -1))
  }
  return { ...e, cobras, maca, fim }
}

export const inicio = (rnd = Math.random) => ({
  rnd,
  maca: [N / 2, N / 2],
  cobras: [
    { dir: 'dir', corpo: [[4, 5], [3, 5], [2, 5]] },
    { dir: 'esq', corpo: [[N - 5, N - 6], [N - 4, N - 6], [N - 3, N - 6]] },
  ],
  fim: null,
})

const oposto = { cima: 'baixo', baixo: 'cima', esq: 'dir', dir: 'esq' }

export default function JogoCobra({ nomes, onFim }) {
  const tela = useRef(null)
  const props = useRef()
  props.current = { nomes, onFim } // o jogo corre uma vez; re-renders do pai não o reiniciam
  const pedido = useRef([null, null]) // próxima direção de cada jogador
  const [tam, setTam] = useState([3, 3])

  useEffect(() => {
    const ctx = tela.current.getContext('2d')
    let e = inicio()
    const tecla = (ev) => {
      const k = TECLAS[ev.key]
      if (!k) return
      ev.preventDefault()
      pedido.current[k[0]] = k[1]
    }
    addEventListener('keydown', tecla)

    function desenhar() {
      ctx.fillStyle = '#0b1530'
      ctx.fillRect(0, 0, N * C, N * C)
      ctx.fillStyle = '#ffd34d'
      ctx.beginPath()
      ctx.arc(e.maca[0] * C + C / 2, e.maca[1] * C + C / 2, C / 2.6, 0, 7)
      ctx.fill()
      e.cobras.forEach((c, i) => c.corpo.forEach(([x, y], j) => {
        ctx.fillStyle = COR[i]
        ctx.globalAlpha = j === 0 ? 1 : 0.75
        ctx.fillRect(x * C + 1, y * C + 1, C - 2, C - 2)
      }))
      ctx.globalAlpha = 1
    }

    desenhar()
    let relogio
    const arranque = setTimeout(() => {
      relogio = setInterval(() => {
        e.cobras.forEach((c, i) => {
          const p = pedido.current[i]
          if (p && p !== oposto[c.dir]) c.dir = p
          pedido.current[i] = null
        })
        e = passo(e)
        setTam(e.cobras.map((c) => c.corpo.length))
        desenhar()
        if (e.fim !== null) {
          clearInterval(relogio)
          const { nomes: ns, onFim: fim } = props.current
          setTimeout(() => fim(e.fim === 'Empate' ? 'Empate' : ns[1 - e.fim]), 700)
        }
      }, TICK)
    }, 1000) // 1 s para os dois verem onde estão
    return () => { clearTimeout(arranque); clearInterval(relogio); removeEventListener('keydown', tecla) }
  }, [])

  const comandos = (i) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, margin: '8px 0' }}>
      {[['esq', '◀'], ['cima', '▲'], ['baixo', '▼'], ['dir', '▶']].map(([k, s]) => (
        <button key={k} type="button" className="btn sec" style={{ margin: 0, touchAction: 'none', borderColor: COR[i] }}
          aria-label={`${nomes[i]}: ${k}`} onPointerDown={() => { pedido.current[i] = k }}>{s}</button>
      ))}
    </div>
  )

  return (
    <div>
      <Placar nome={nomes[1]} n={tam[1]} cor={COR[1]} teclas="setas" />
      {comandos(1)}
      <canvas ref={tela} width={N * C} height={N * C} style={{ width: '100%', maxWidth: N * C, display: 'block', margin: '0 auto', borderRadius: 12 }} />
      {comandos(0)}
      <Placar nome={nomes[0]} n={tam[0]} cor={COR[0]} teclas="W A S D" />
    </div>
  )
}

function Placar({ nome, n, cor, teclas }) {
  return <p className="nota" style={{ textAlign: 'center', margin: '4px 0' }}><b style={{ color: cor }}>{nome}</b> · tamanho {n} · {teclas}</p>
}
