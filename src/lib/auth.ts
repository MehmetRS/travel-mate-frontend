import { post } from './api/api-client';

interface AuthResponse {
  accessToken: string;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

interface LoginData {
  email: string;
  password: string;
}

export async function register(email: string, password: string, name: string): Promise<AuthResponse> {
  const response = await post<AuthResponse>('/register', {
    email,
    password,
    name,
  });

  // Store the access token in localStorage
  localStorage.setItem('accessToken', response.accessToken);

  return response;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await post<AuthResponse>('/login', {
    email,
    password,
  });

  // Store the access token in localStorage
  localStorage.setItem('accessToken', response.accessToken);

  return response;
}

export function getAccessToken(): string | null {
  return localStorage.getItem('accessToken');
}

export function clearAccessToken(): void {
  localStorage.removeItem('accessToken');
}
