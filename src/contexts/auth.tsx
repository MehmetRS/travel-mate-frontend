'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { get, post } from '@/lib/api/api-client';

interface User {
  id: string;
  email: string;
  name: string | null;
  isVerified: boolean;
  rating: number;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

interface LoginResponse {
  accessToken: string;
  user: User;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Restore auth state on mount
  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      setAuth({ user: null, isAuthenticated: false, isLoading: false });
      return;
    }

    // Verify token and get user info
    get<User>('/auth/me')
      .then(user => {
        console.log('Session restored', user);
        setAuth({ user, isAuthenticated: true, isLoading: false });
      })
      .catch(error => {
        console.error('Failed to restore session:', error);
        localStorage.removeItem('accessToken');
        setAuth({ user: null, isAuthenticated: false, isLoading: false });
      });
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await post<LoginResponse>('/auth/login', {
        email,
        password,
      });

      console.log('LOGIN SUCCESS', response);

      // Store token
      localStorage.setItem('accessToken', response.accessToken);

      // Update auth state
      setAuth({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      });

      console.log('AUTH STATE UPDATED', {
        user: response.user,
        isAuthenticated: true,
      });

      // Redirect to trips page
      console.log('ROUTE CHANGE -> /trips');
      router.replace('/trips');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setAuth({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    router.replace('/');
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
