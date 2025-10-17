import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAppStore } from '../stores/appStore'

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const { theme, setTheme } = useAppStore()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Close menu when route changes
    setIsMenuOpen(false)
  }, [location])

  useEffect(() => {
    // Close menu when clicking outside on mobile
    const handleResize = () => {
      if (window.innerWidth > 900) {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  const navItems = [
    { path: '/', label: 'Início' },
    { path: '/solicitacoes', label: 'Solicitações' },
    { path: '/cadastro', label: 'Cadastro' },
    { path: '/mapa', label: 'Mapa' },
    { path: '/contato', label: 'Contato' },
  ]

  return (
    <header 
      className={`site-header ${isScrolled ? 'scrolled' : ''}`} 
      role="banner"
    >
      <div className="container header-inner">
        <Link className="brand" to="/">
          <i className="fa-solid fa-heart" aria-hidden="true"></i>
          Plataforma de Doação Inteligente
        </Link>
        
        <div className="header-actions">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Alternar para tema ${theme === 'light' ? 'escuro' : 'claro'}`}
          >
            <i className={`fa-solid ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`}></i>
          </button>
          
          <button
            className="nav-toggle"
            onClick={toggleMenu}
            aria-label="Abrir menu"
            aria-controls="primary-nav"
            aria-expanded={isMenuOpen}
          >
            <span className="hamburger" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
        
        <nav 
          id="primary-nav" 
          className={`primary-nav ${isMenuOpen ? 'open' : ''}`}
          aria-label="Navegação principal"
        >
          <ul>
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={location.pathname === item.path ? 'active' : ''}
                  aria-current={location.pathname === item.path ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      
      <style>{`
        .site-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background-color: var(--bg-primary);
          border-bottom: 1px solid var(--border);
          transition: var(--transition);
        }
        
        .site-header.scrolled {
          box-shadow: 0 2px 12px var(--shadow-lg);
        }
        
        .header-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-md) var(--space-md);
          min-height: 80px;
        }
        
        .brand {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--primary);
          text-decoration: none;
          transition: var(--transition);
        }
        
        .brand:hover {
          color: var(--primary-dark);
        }
        
        .header-actions {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }
        
        .theme-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border: none;
          border-radius: var(--radius-md);
          background-color: var(--bg-secondary);
          color: var(--text-secondary);
          cursor: pointer;
          transition: var(--transition);
        }
        
        .theme-toggle:hover {
          background-color: var(--bg-tertiary);
          color: var(--primary);
        }
        
        .nav-toggle {
          display: none;
          flex-direction: column;
          justify-content: center;
          width: 40px;
          height: 40px;
          border: none;
          background: transparent;
          cursor: pointer;
          padding: 0;
        }
        
        .hamburger {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .hamburger span {
          width: 24px;
          height: 2px;
          background-color: var(--text-primary);
          transition: var(--transition);
        }
        
        .nav-toggle[aria-expanded="true"] .hamburger span:nth-child(1) {
          transform: rotate(45deg) translate(6px, 6px);
        }
        
        .nav-toggle[aria-expanded="true"] .hamburger span:nth-child(2) {
          opacity: 0;
        }
        
        .nav-toggle[aria-expanded="true"] .hamburger span:nth-child(3) {
          transform: rotate(-45deg) translate(6px, -6px);
        }
        
        .primary-nav ul {
          display: flex;
          list-style: none;
          gap: var(--space-lg);
          margin: 0;
          padding: 0;
        }
        
        .primary-nav a {
          display: block;
          padding: var(--space-sm) var(--space-md);
          color: var(--text-secondary);
          text-decoration: none;
          font-weight: 500;
          border-radius: var(--radius-md);
          transition: var(--transition);
        }
        
        .primary-nav a:hover,
        .primary-nav a.active {
          color: var(--primary);
          background-color: var(--bg-secondary);
        }
        
        @media (max-width: 900px) {
          .nav-toggle {
            display: flex;
          }
          
          .primary-nav {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background-color: var(--bg-primary);
            border-top: 1px solid var(--border);
            box-shadow: 0 4px 12px var(--shadow-lg);
            transform: translateY(-100%);
            opacity: 0;
            visibility: hidden;
            transition: var(--transition);
          }
          
          .primary-nav.open {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
          }
          
          .primary-nav ul {
            flex-direction: column;
            padding: var(--space-md);
            gap: 0;
          }
          
          .primary-nav a {
            padding: var(--space-md);
            border-bottom: 1px solid var(--border-light);
          }
          
          .primary-nav li:last-child a {
            border-bottom: none;
          }
        }
        
        @media (max-width: 480px) {
          .brand {
            font-size: 1rem;
          }
          
          .header-inner {
            padding: var(--space-sm);
          }
        }
      `}</style>
    </header>
  )
}

export default Header