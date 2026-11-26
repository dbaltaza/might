import { Routes, Route, Link, NavLink, useLocation } from 'react-router-dom'
import { MODO, meuId } from './db.js'
import Criar from './ecras/Criar.jsx'
import Feito from './ecras/Feito.jsx'
import Enviar from './ecras/Enviar.jsx'
import Pedir from './ecras/Pedir.jsx'
import Publico from './ecras/Publico.jsx'
import Caixa from './ecras/Caixa.jsx'
import Perfil from './ecras/Perfil.jsx'
import Card from './ecras/Card.jsx'
import Descobrir from './ecras/Descobrir.jsx'
import Funcoes from './ecras/Funcoes.jsx'

function Entrada() {
  const tenho = !!meuId()
  return (
    <>
      <div className="logo">MighT<span>.</span></div>
      <h1>Vê-te pelos olhos de quem te conhece.</h1>
      <p>O MighT é um sistema de reconhecimento de talento: três palavras de quem te conhece constroem a tua figura e mostram-te funções e carreiras a explorar.</p>
      <Link className="btn lima" to={tenho ? '/caixa' : '/criar'}>{tenho ? 'Continuar' : 'Cria o teu MighT'}</Link>
      <p className="nota">Menos de 2 minutos. Sem conta. Só o teu primeiro nome.</p>
    </>
  )
}

const ABAS = [['/caixa', 'Caixa'], ['/perfil', 'Perfil'], ['/card', 'Card'], ['/descobrir', 'Descobrir'], ['/funcoes', 'Funções']]

function Nav() {
  const { pathname } = useLocation()
  if (!meuId() || pathname === '/' || pathname === '/criar' || pathname.startsWith('/m/')) return null
  return (
    <nav className="nav">
      {ABAS.map(([to, t]) => (
        <NavLink key={to} to={to} className={({ isActive }) => (isActive ? 'ativo' : '')}>{t}</NavLink>
      ))}
    </nav>
  )
}

export default function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Entrada />} />
        <Route path="/criar" element={<Criar />} />
        <Route path="/feito" element={<Feito />} />
        <Route path="/enviar" element={<Enviar />} />
        <Route path="/pedir" element={<Pedir />} />
        <Route path="/m/:id" element={<Publico />} />
        <Route path="/caixa" element={<Caixa />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/card" element={<Card />} />
        <Route path="/descobrir" element={<Descobrir />} />
        <Route path="/funcoes" element={<Funcoes />} />
        <Route path="*" element={<Entrada />} />
      </Routes>
      <Nav />
      <div className="modo">modo: {MODO}</div>
    </div>
  )
}
