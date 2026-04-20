'use client';

import { Provider } from 'react-redux';
import { store } from './store';
import { useEffect } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Sync localStorage to cookies for middleware on hydration
    const token = localStorage.getItem('builder_token');
    if (token) {
      document.cookie = `builder_token=${token}; path=/; max-age=86400; SameSite=Lax`;
    }
  }, []);

  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
}
