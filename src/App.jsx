import { Routes, Route, Link, NavLink, Navigate, useLocation } from 'react-router-dom'
import { MODO, meuId, limparTudo } from './db.js'
import { figura } from '../figura/index.js'
import { Topo } from './ui.jsx'
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
import Duelo from './ecras/Duelo.jsx'

// Figuras de exemplo na entrada: mostram o que três palavras fazem.
const EXEMPLOS = [['Curioso', 'Explorador', 'Liberdade'], ['Empático', 'Conector', 'Generosidade'], ['Lógico', 'Estratega', 'Integridade']]

function Entrada() {
  const tenho = !!meuId()
  return (
    <>
      <Topo />
      <div className="entrada-figs" aria-hidden="true">
        {EXEMPLOS.map((t, i) => <img key={i} src={figura(...t).src} alt="" />)}
      </div>
      <h1>Vê-te pelos olhos de quem te conhece.</h1>
      <p className="lead">Três palavras de quem te conhece constroem a tua figura. Com elas descobres pessoas como tu e funções a explorar.</p>
      <Link className="btn" to={tenho ? '/caixa' : '/criar'}>{tenho ? 'Continuar' : 'Criar o meu MighT'}</Link>
      <p className="nota">Menos de 2 minutos. Sem conta. Só usamos o teu primeiro nome.</p>
      {tenho && <Link className="link-simular" to="/reset">Recomeçar do zero</Link>}
    </>
  )
}

function Reset() {
  limparTudo()
  return <Navigate to="/" replace />
}

// Roxo = o que os outros veem em ti. Azul = como te vês e o que dás.
const ROXO = ['/caixa', '/perfil', '/descobrir', '/funcoes']
const ABAS = [['/caixa', 'Caixa'], ['/perfil', 'All MighT'], ['/card', 'Card'], ['/descobrir', 'Pessoas'], ['/funcoes', 'Funções']]

function Nav({ visivel }) {
  if (!visivel) return null
  return (
    <header className="barra">
      <Link to="/" className="marca barra-marca" aria-label="MighT, início"><span className="marca-logo" /></Link>
      <nav className="nav" aria-label="Secções">
        {ABAS.map(([to, t]) => <NavLink key={to} to={to} className={({ isActive }) => (isActive ? 'ativo' : '')}>{t}</NavLink>)}
      </nav>
    </header>
  )
}

export default function App() {
  const { pathname } = useLocation()
  const comNav = !!meuId() && !['/', '/criar'].includes(pathname) && !pathname.startsWith('/m/')
  return (
    <div className={'app' + (ROXO.includes(pathname) ? ' roxo' : '') + (comNav ? '' : ' sem-nav')}>
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
        <Route path="/duelo/:id" element={<Duelo />} />
        <Route path="/reset" element={<Reset />} />
        <Route path="*" element={<Entrada />} />
      </Routes>
      <Nav visivel={comNav} />
      {MODO === 'local' && <div className="modo">modo local</div>}
    </div>
  )
}
