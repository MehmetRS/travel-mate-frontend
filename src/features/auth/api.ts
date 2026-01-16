/**
 * Auth API
 * 
 * All auth-related API calls.
 * Aligned with backend /auth endpoints.
 */

import { get, post } from '@/lib/api/api-client';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  MeResponse,
} from '@/lib/types/backend-contracts';

export const authApi = {
  /**
   * POST /auth/login
   * Public endpoint
   */
  login: (credentials: LoginRequest): Promise<LoginResponse> => {
    return post<LoginResponse>('/auth/login', credentials, { skipAuth: true });
  },

  /**
   * POST /auth/register
   * Public endpoint
   */
  register: (data: RegisterRequest): Promise<LoginResponse> => {
    return post<LoginResponse>('/auth/register', data, { skipAuth: true });
  },

  /**
   * GET /auth/me
   * Auth required - validates current session
   */
  me: (): Promise<MeResponse> => {
    return get<MeResponse>('/auth/me');
  },
};
