import { inicial } from './ui.jsx'

// A figura ao centro e, à volta, quem te reconheceu. Os lugares vazios enchem-se quando aceitas um MighT.
// Só os nós novos animam (key = id), por isso o desbloqueio em palco é um único momento.
export default function Orbita({ figura, moldura = false, pessoas = [], minimo = 3, max = 8 }) {
  const nos = pessoas.slice(0, max)
  const vazios = Math.max(0, minimo - nos.length)
  const total = nos.length + vazios
  const pos = (i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / Math.max(total, 1) + (total % 2 ? 0 : Math.PI / total)
    return { x: 50 + 40 * Math.cos(a), y: 50 + 41 * Math.sin(a) }
  }
  const todos = [...nos.map((p) => ({ ...p, vazio: false })), ...Array.from({ length: vazios }, (_, i) => ({ id: 'v' + i, vazio: true }))]
  return (
    <div className="orbita">
      <svg className="fios" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {todos.map((p, i) => {
          const { x, y } = pos(i)
          return <line key={p.id} x1="50" y1="50" x2={x} y2={y} stroke="rgba(255,255,255,0.35)" strokeWidth="0.35" strokeDasharray={p.vazio ? '1 1.2' : undefined} vectorEffect="non-scaling-stroke" />
        })}
      </svg>
      <div className={'centro' + (moldura ? ' com-moldura' : '')}>{moldura ? <div className="moldura"><img src={figura} alt="A tua figura MighT" /></div> : <img src={figura} alt="A tua figura MighT" />}</div>
      {todos.map((p, i) => {
        const { x, y } = pos(i)
        return (
          <div key={p.id} className={'no' + (p.vazio ? ' vazio' : ' chega')} style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${i * 70}ms` }}>
            <div className="disco">{p.vazio ? '?' : inicial(p.nome)}</div>
            <span>{p.vazio ? 'à espera' : p.nome}</span>
          </div>
        )
      })}
    </div>
  )
}
