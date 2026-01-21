import { useSession, signIn, signOut } from 'next-auth/react';

export const useAuth = () => {
  const { data: session, status, update } = useSession();

  return {
    user: session?.user || null,
    token: session?.accessToken || null,
    isAuthenticated: !!session?.user,
    status,
    login: signIn,
    logout: () => signOut({ callbackUrl: '/login' }),
    updateUser: update,
  };
};