import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAppState } from '../context/AppStateContext';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

const Layout = ({ children }) => {
  const { notification, closeNotification } = useAppState();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      
      <main style={{ flex: 1, padding: '32px 0' }}>
        {children}
      </main>

      <Footer />

      {/* Floating Notification Toast */}
      {notification.show && (
        <div 
          className="animate-fade-in"
          style={{
            position: 'fixed',
            bottom: '32px',
            right: '32px',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 20px',
            borderRadius: 'var(--radius-md)',
            background: notification.type === 'error' ? 'rgba(244, 63, 94, 0.95)' : 'rgba(16, 185, 129, 0.95)',
            color: '#fff',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            maxWidth: '400px'
          }}
        >
          {notification.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
          <span style={{ fontSize: '14px', fontWeight: 600, flex: 1 }}>{notification.message}</span>
          <button 
            onClick={closeNotification} 
            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', padding: '2px' }}
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Layout;
