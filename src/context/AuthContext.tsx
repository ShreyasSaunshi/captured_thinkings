import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
};

// Mock admin user for demonstration
const ADMIN_USER: User = {
  id: '1',
  username: 'admin',
  isAdmin: true
};

const AuthContext = createContext<AuthContextType>({
  ...initialState,
  login: () => Promise.resolve(false),
  logout: () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      return {
        user: JSON.parse(savedUser),
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
    }
    return initialState;
  });

  const login = async (username: string, password: string): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    // Simulate API call
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        // Mock validation - in a real app, this would be a secure API call
        if (username === 'admin' && password === 'password') {
          const authData = {
            user: ADMIN_USER,
            isAuthenticated: true,
            isLoading: false,
            error: null
          };
          setAuthState(authData);
          localStorage.setItem('user', JSON.stringify(ADMIN_USER));
          resolve(true);
        } else {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: 'Invalid credentials'
          });
          resolve(false);
        }
      }, 800);
    });
  };

  const logout = () => {
    localStorage.removeItem('user');
    setAuthState(initialState);
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};