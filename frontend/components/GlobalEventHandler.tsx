'use client';

import { useEffect } from 'react';
import { signOut } from 'next-auth/react';

const GlobalEventHandler = () => {
  useEffect(() => {
    const handleLogout = () => {
      // Use NextAuth's signOut function to properly handle logout
      signOut({ callbackUrl: '/login' });
    };

    window.addEventListener('LOGOUT_USER', handleLogout);

    return () => {
      window.removeEventListener('LOGOUT_USER', handleLogout);
    };
  }, []);

  return null;
};

export default GlobalEventHandler;