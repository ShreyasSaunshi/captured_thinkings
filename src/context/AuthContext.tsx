import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { checkSession, signIn, signOut, refreshSession } from '../lib/auth';

interface AuthContextType {
  session: Session | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  isLoading: true,
  error: null,
  login: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSession = async (newSession: Session | null) => {
    setSession(newSession);
    if (newSession && location.pathname === '/login') {
      navigate('/admin');
    } else if (!newSession && location.pathname.startsWith('/admin')) {
      navigate('/login');
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true);
        const currentSession = await checkSession();
        await handleSession(currentSession);
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    const refreshInterval = setInterval(async () => {
      const currentSession = await refreshSession();
      await handleSession(currentSession);
    }, 5 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [navigate, location.pathname]);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      const newSession = await signIn(email, password);
      await handleSession(newSession);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut();
      await handleSession(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        isLoading,
        error,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};