import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import NotificationSystem from './components/NotificationSystem'
import Home from './pages/Home'
import Cadastro from './pages/Cadastro'
import Mapa from './pages/Mapa'
import Contato from './pages/Contato'
import Solicitações from './pages/Solicitacoes'
import { useAppStore } from './stores/appStore'

function App() {
  const { theme } = useAppStore()

  return (
    <div className={`app ${theme}`} id="main-content">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/mapa" element={<Mapa />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/solicitacoes" element={<Solicitações />} />
        </Routes>
      </main>
      <Footer />
      <NotificationSystem />
    </div>
  )
}

export default App