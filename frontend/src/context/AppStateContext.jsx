import React, { createContext, useContext, useState, useCallback } from 'react';

const AppStateContext = createContext(null);

export const AppStateProvider = ({ children }) => {
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [globalSearch, setGlobalSearch] = useState('');

  const triggerNotification = useCallback((message, type = 'success') => {
    setNotification({ show: true, message, type });
    
    // Clear notification after 4 seconds
    setTimeout(() => {
      setNotification(prev => {
        // Only clear if it is the same message
        if (prev.message === message) {
          return { ...prev, show: false };
        }
        return prev;
      });
    }, 4000);
  }, []);

  const closeNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, show: false }));
  }, []);

  const value = {
    notification,
    triggerNotification,
    closeNotification,
    globalSearch,
    setGlobalSearch
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};
