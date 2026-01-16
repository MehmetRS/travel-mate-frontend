/**
 * Auth API

 * All auth-related API calls.
 * Aligned with backend endpoints.
 */

import { apiClient } from '@/lib/api/api-client';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  MeResponse,
} from '@/lib/types/backend-contracts';

export const authApi = {
  /**
   * POST /login
   * Public endpoint
   */
  login: (credentials: LoginRequest): Promise<LoginResponse> => {
    return apiClient('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
      skipAuth: true
    });
  },

  /**
   * POST /register
   * Public endpoint
   */
  register: (data: RegisterRequest): Promise<LoginResponse> => {
    return apiClient('/register', {
      method: 'POST',
      body: JSON.stringify(data),
      skipAuth: true
    });
  },

  /**
   * GET /me
   * Auth required - validates current session
   */
  me: (): Promise<MeResponse> => {
    return apiClient('/me', {
      method: 'GET'
    });
  },
};
