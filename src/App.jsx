import { Routes, Route, Link, NavLink, Navigate, useLocation } from 'react-router-dom'
import { useEu } from './estado.js'
import { MODO, meuId, limparTudo } from './db.js'
import { figura } from '../figura/index.js'
import { Topo, demo } from './ui.jsx'
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
import Demo from './ecras/Demo.jsx'

// Figuras de exemplo na entrada: mostram o que três palavras fazem.
const EXEMPLOS = [['Curioso', 'Explorador', 'Liberdade'], ['Empático', 'Conector', 'Generosidade'], ['Lógico', 'Estratega', 'Integridade']]

function Entrada() {
  const tenho = !!meuId()
  return (
    <>
      <Topo />
      <div className="duas-colunas iguais ecra-entrada">
        <div className="col-hero">
          <div className="entrada-figs" aria-hidden="true">
            {EXEMPLOS.map((t, i) => <img key={i} src={figura(...t).src} alt="" />)}
          </div>
        </div>
        <div className="col-conteudo">
          <h1>Vê-te pelos olhos de quem te conhece.</h1>
          <p className="lead">Três palavras de quem te conhece constroem a tua figura. Com elas descobres pessoas como tu e funções a explorar.</p>
          <Link className="btn" to={tenho ? '/caixa' : '/criar'}>{tenho ? 'Continuar' : 'Criar o meu MighT'}</Link>
          <p className="nota">Menos de 2 minutos. Sem conta. Só usamos o teu primeiro nome.</p>
          {tenho && demo() && <Link className="link-simular" to="/reset">Recomeçar do zero</Link>}
        </div>
      </div>
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

const Cadeado = () => (
  <svg className="cadeado" viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
    <rect x="2" y="5.5" width="8" height="5.5" rx="1.5" fill="currentColor" />
    <path d="M4 5.5V4a2 2 0 0 1 4 0v1.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
  </svg>
)

// Antes de 3 MighTs aceites, só a Caixa abre; os outros separadores mostram um cadeado em vez de um beco.
function Nav({ visivel }) {
  if (!visivel) return null
  return <NavAbas />
}
function NavAbas() {
  const eu = useEu()
  const aberto = eu.desbloqueado || !eu.carregado
  return (
    <header className="barra">
      <Link to="/" className="marca barra-marca" aria-label="MighT, início"><span className="marca-logo" /></Link>
      <nav className="nav" aria-label="Secções">
        {ABAS.map(([to, t]) => (aberto || to === '/caixa'
          ? <NavLink key={to} to={to} className={({ isActive }) => (isActive ? 'ativo' : '')}>{t}</NavLink>
          : <span key={to} className="bloq" aria-disabled="true" title={`${t} abre com 3 MighTs`}><Cadeado />{t}</span>))}
      </nav>
    </header>
  )
}

export default function App() {
  const { pathname } = useLocation()
  // /feito e /enviar são passos de fluxo: um só botão em baixo, sem a nav por cima.
  const FLUXO = ['/', '/criar', '/feito', '/enviar']
  const comNav = !!meuId() && !FLUXO.includes(pathname) && !pathname.startsWith('/m/')
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
        <Route path="/demo" element={<Demo />} />
        <Route path="*" element={<Entrada />} />
      </Routes>
      <Nav visivel={comNav} />
      {MODO === 'local' && <div className="modo">modo local</div>}
    </div>
  )
}
