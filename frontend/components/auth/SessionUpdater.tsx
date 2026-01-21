'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

export const SessionUpdater = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated' && session?.accessToken) {
      // Store the access token in localStorage for API calls
      localStorage.setItem('auth_token', session.accessToken);
    } else if (status === 'unauthenticated') {
      // Remove the token when user logs out
      localStorage.removeItem('auth_token');
    }
  }, [session, status]);

  return null; // This component doesn't render anything
};