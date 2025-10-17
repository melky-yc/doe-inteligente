import React from 'react'
import { useAppStore } from '../stores/appStore'
import type { Notification } from '@/types'

const NotificationSystem: React.FC = () => {
  const { notifications, removeNotification } = useAppStore()

  if (notifications.length === 0) return null

  return (
    <div className="notification-container">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`notification notification-${notification.type}`}
          role="alert"
          aria-live="polite"
        >
          <div className="notification-icon">
            <i className={getNotificationIcon(notification.type)}></i>
          </div>
          
          <div className="notification-content">
            <h4 className="notification-title">{notification.title}</h4>
            {notification.message && (
              <p className="notification-message">{notification.message}</p>
            )}
          </div>
          
          <button
            className="notification-close"
            onClick={() => removeNotification(notification.id)}
            aria-label="Fechar notificação"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      ))}
      
      <style>{`
        .notification-container {
          position: fixed;
          top: 100px;
          right: 1rem;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
          max-width: 400px;
          width: 100%;
        }
        
        .notification {
          display: flex;
          align-items: flex-start;
          gap: var(--space-md);
          padding: var(--space-lg);
          background-color: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          box-shadow: 0 8px 32px var(--shadow-lg);
          animation: slideInRight 0.3s ease-out;
          backdrop-filter: blur(10px);
        }
        
        .notification-success {
          border-left: 4px solid var(--success);
        }
        
        .notification-error {
          border-left: 4px solid var(--error);
        }
        
        .notification-warning {
          border-left: 4px solid var(--warning);
        }
        
        .notification-info {
          border-left: 4px solid var(--info);
        }
        
        .notification-icon {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.875rem;
          color: white;
          flex-shrink: 0;
        }
        
        .notification-success .notification-icon {
          background-color: var(--success);
        }
        
        .notification-error .notification-icon {
          background-color: var(--error);
        }
        
        .notification-warning .notification-icon {
          background-color: var(--warning);
        }
        
        .notification-info .notification-icon {
          background-color: var(--info);
        }
        
        .notification-content {
          flex: 1;
          min-width: 0;
        }
        
        .notification-title {
          margin: 0 0 var(--space-xs) 0;
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.2;
        }
        
        .notification-message {
          margin: 0;
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }
        
        .notification-close {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: var(--space-xs);
          border-radius: var(--radius-sm);
          transition: var(--transition);
          flex-shrink: 0;
        }
        
        .notification-close:hover {
          color: var(--text-primary);
          background-color: var(--bg-secondary);
        }
        
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @media (max-width: 768px) {
          .notification-container {
            top: 90px;
            left: 1rem;
            right: 1rem;
            max-width: none;
          }
          
          .notification {
            padding: var(--space-md);
          }
          
          .notification-title {
            font-size: 0.875rem;
          }
          
          .notification-message {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  )
}

const getNotificationIcon = (type: Notification['type']): string => {
  switch (type) {
    case 'success':
      return 'fa-solid fa-check'
    case 'error':
      return 'fa-solid fa-triangle-exclamation'
    case 'warning':
      return 'fa-solid fa-exclamation'
    case 'info':
      return 'fa-solid fa-info'
    default:
      return 'fa-solid fa-bell'
  }
}

export default NotificationSystem