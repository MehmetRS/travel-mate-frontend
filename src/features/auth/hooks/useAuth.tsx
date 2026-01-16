/**
 * useAuth Hook
 * 
 * Core auth hook - single source of truth for authentication state.
 * 
 * RULES:
 * - Fetches /me ONCE on mount if token exists
 * - NEVER blocks public content
 * - Only actions require auth
 * - Exposes clear loading state
 */

'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '../api';
import type { MeResponse } from '@/lib/types/backend-contracts';

// ============================================================================
// Types
// ============================================================================

interface AuthUser {
  id: string;
  email: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

// ============================================================================
// Context
// ============================================================================

const AuthContext = createContext<AuthContextValue | null>(null);

// ============================================================================
// Provider
// ============================================================================

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true, // Start loading
  });

  // Check auth on mount (ONCE)
  useEffect(() => {
    checkAuthStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - run once

  const checkAuthStatus = async () => {
    const token = getToken();

    if (!token) {
      // No token - not authenticated
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      return;
    }

    // Token exists - verify with backend
    try {
      const meResponse = await authApi.me();
      
      // Success - user is authenticated
      setState({
        user: {
          id: meResponse.sub,
          email: meResponse.email,
        },
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      // /me failed - clear token
      console.error('Session validation failed:', error);
      clearToken();
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });

      // Save token
      saveToken(response.accessToken);

      // Verify session immediately with /me
      const meResponse = await authApi.me();

      // Update state
      setState({
        user: {
          id: meResponse.sub,
          email: meResponse.email,
        },
        isAuthenticated: true,
        isLoading: false,
      });

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      // Clear any partial state
      clearToken();
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      throw error; // Re-throw for component to handle
    }
  };

  const register = async (email: string, name: string, password: string) => {
    try {
      await authApi.register({ email, name, password });
      
      // Registration successful - redirect to login
      // DO NOT auto-login per requirements
      router.push('/login');
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    clearToken();
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    router.push('/');
  };

  const value: AuthContextValue = {
    ...state,
    login,
    register,
    logout,
    checkAuth: checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ============================================================================
// Hook
// ============================================================================

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// ============================================================================
// Token Management (localStorage)
// ============================================================================

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
}

function saveToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('accessToken', token);
}

function clearToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('accessToken');
}
