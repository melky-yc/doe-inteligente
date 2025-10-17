import React from 'react'

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  const contactInfo = [
    {
      icon: 'fa-phone',
      label: 'Telefone',
      value: '(+55 86) 99999-9999',
      href: 'tel:+5586999999999'
    },
    {
      icon: 'fa-envelope',
      label: 'E-mail',
      value: 'contato@doeinteligente.org',
      href: 'mailto:contato@doeinteligente.org'
    },
    {
      icon: 'fa-brands fa-whatsapp',
      label: 'WhatsApp',
      value: 'WhatsApp',
      href: 'https://wa.me/5586999999999'
    },
    {
      icon: 'fa-brands fa-instagram',
      label: 'Instagram',
      value: '@doeinteligente',
      href: 'https://instagram.com/doeinteligente'
    }
  ]

  const socialLinks = [
    {
      icon: 'fa-brands fa-instagram',
      label: 'Instagram',
      href: 'https://instagram.com/doeinteligente'
    },
    {
      icon: 'fa-brands fa-whatsapp',
      label: 'WhatsApp',
      href: 'https://wa.me/5586999999999'
    },
    {
      icon: 'fa-brands fa-linkedin-in',
      label: 'LinkedIn',
      href: 'https://linkedin.com/company/doeinteligente'
    }
  ]

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <address className="footer-contact">
          <h3>Contato</h3>
          <ul className="contact-list">
            {contactInfo.map((contact, index) => (
              <li key={index}>
                <a 
                  href={contact.href}
                  target={contact.href.startsWith('http') ? '_blank' : undefined}
                  rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  <i className={contact.icon} aria-hidden="true"></i>
                  <span>{contact.value}</span>
                </a>
              </li>
            ))}
          </ul>
        </address>
        
        <div className="footer-social">
          <h3>Redes Sociais</h3>
          <div className="social-links">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                aria-label={social.label}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className={social.icon} aria-hidden="true"></i>
              </a>
            ))}
          </div>
        </div>
        
        <div className="footer-info">
          <p>
            © {currentYear} Plataforma de Doação Inteligente. 
            Todos os direitos reservados.
          </p>
          <p className="footer-description">
            Conectando doadores e ONGs para construir um mundo melhor.
          </p>
        </div>
      </div>
      
      <style>{`
        .site-footer {
          background-color: var(--bg-secondary);
          border-top: 1px solid var(--border);
          padding: var(--space-2xl) 0 var(--space-lg);
          margin-top: auto;
        }
        
        .footer-inner {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--space-2xl);
          align-items: start;
        }
        
        .footer-contact h3,
        .footer-social h3 {
          color: var(--text-primary);
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: var(--space-md);
        }
        
        .contact-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .contact-list li {
          margin-bottom: var(--space-sm);
        }
        
        .contact-list a {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          color: var(--text-secondary);
          text-decoration: none;
          padding: var(--space-xs) 0;
          transition: var(--transition);
        }
        
        .contact-list a:hover {
          color: var(--primary);
        }
        
        .contact-list i {
          width: 20px;
          text-align: center;
          color: var(--primary);
        }
        
        .social-links {
          display: flex;
          gap: var(--space-md);
        }
        
        .social-links a {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          background-color: var(--bg-primary);
          color: var(--text-secondary);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          text-decoration: none;
          transition: var(--transition);
        }
        
        .social-links a:hover {
          background-color: var(--primary);
          color: white;
          border-color: var(--primary);
          transform: translateY(-2px);
        }
        
        .footer-info {
          text-align: center;
        }
        
        .footer-info p {
          color: var(--text-secondary);
          margin-bottom: var(--space-sm);
          font-size: 0.875rem;
        }
        
        .footer-description {
          font-style: italic;
          opacity: 0.8;
        }
        
        @media (max-width: 768px) {
          .footer-inner {
            grid-template-columns: 1fr;
            gap: var(--space-lg);
            text-align: center;
          }
          
          .contact-list a {
            justify-content: center;
          }
          
          .social-links {
            justify-content: center;
          }
        }
        
        @media (max-width: 480px) {
          .site-footer {
            padding: var(--space-lg) 0;
          }
          
          .footer-inner {
            gap: var(--space-md);
          }
          
          .social-links a {
            width: 40px;
            height: 40px;
          }
        }
      `}</style>
    </footer>
  )
}

export default Footer