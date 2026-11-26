import { Routes, Route, Link, NavLink } from 'react-router-dom'
import { MODO } from './db.js'

// Esqueleto: cada ecrã vai para src/ecras/<Nome>.jsx. Todos têm um "seguinte" (sem becos sem saída).
const Ecra = ({ passo, titulo, texto, seguinte, rotulo = 'Seguinte' }) => (
  <>
    {passo && <div className="passo">Passo {passo}</div>}
    <h1>{titulo}</h1>
    <p>{texto}</p>
    {seguinte && <Link className="btn" to={seguinte}>{rotulo}</Link>}
  </>
)

const Nav = () => (
  <nav className="nav">
    {[['/perfil', 'Perfil'], ['/card', 'Card'], ['/descobrir', 'Descobrir'], ['/funcoes', 'Funções'], ['/pedir', 'Pedir']].map(([to, t]) => (
      <NavLink key={to} to={to} className={({ isActive }) => (isActive ? 'ativo' : '')}>{t}</NavLink>
    ))}
  </nav>
)

export default function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Ecra titulo="Vê-te pelos olhos de quem te conhece." texto="Três palavras constroem o teu MighT e mostram-te funções que encaixam em ti." seguinte="/criar" rotulo="Cria o teu MighT" />} />
        <Route path="/criar" element={<Ecra passo={1} titulo="Cria o teu MighT" texto="Uma palavra para Personalidade, Poder e Carácter." seguinte="/enviar" />} />
        <Route path="/enviar" element={<Ecra passo="2A" titulo="Manda um MighT" texto="Para receberes, começa por dar." seguinte="/pedir" />} />
        <Route path="/pedir" element={<Ecra passo="2B" titulo="Pede MighTs" texto="Partilha o teu link ou o QR." seguinte="/caixa" />} />
        <Route path="/m/:id" element={<Ecra passo="2B" titulo="Reconhece esta pessoa" texto="Escolhe 3 palavras. Não precisas de conta." seguinte="/" rotulo="Cria também o teu" />} />
        <Route path="/caixa" element={<Ecra passo={3} titulo="MighTs a chegar" texto="Aceita ou recusa. Com 3 aceites, o perfil desbloqueia." seguinte="/perfil" />} />
        <Route path="/perfil" element={<Ecra passo={3} titulo="O teu All MighT" texto="Tu, pelos olhos dos outros." seguinte="/card" />} />
        <Route path="/card" element={<Ecra passo={4} titulo="O teu MighT Card" texto="Descarrega em PNG." seguinte="/descobrir" />} />
        <Route path="/descobrir" element={<Ecra passo={5} titulo="Pessoas como tu" texto="Ordenadas por % de semelhança." seguinte="/funcoes" />} />
        <Route path="/funcoes" element={<Ecra passo={6} titulo="Funções ideais" texto="Agora → Próximo → Desafio. Só hipóteses." seguinte="/perfil" rotulo="Voltar ao perfil" />} />
      </Routes>
      <Nav />
      <div style={{ fontSize: 10, color: '#999', textAlign: 'center', marginTop: 24 }}>modo: {MODO}</div>
    </div>
  )
}
