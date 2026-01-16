/**
 * API Client
 * 
 * Single source for all HTTP requests to the backend.
 * All responses are parsed and typed according to backend contracts.
 * All errors are thrown as typed ApiError instances.
 */

import {
  ApiError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  NetworkError,
} from './api-errors';

const getBaseUrl = (): string => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_API_URL is not defined in environment variables');
  }
  return baseUrl;
};

const getAuthToken = (): string | null => {
  // Client-side only
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem('accessToken');
};

interface ApiClientOptions extends RequestInit {
  skipAuth?: boolean;
}

/**
 * Core API client
 * 
 * - Automatically adds auth token
 * - Parses JSON responses
 * - Throws typed errors
 * - Never returns undefined
 */
export async function apiClient<T = unknown>(
  path: string,
  options: ApiClientOptions = {}
): Promise<T> {
  const { skipAuth = false, ...fetchOptions } = options;
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${path}`;

  // Setup headers
  const headers = new Headers(fetchOptions.headers || {});
  
  // Set Content-Type if not already set and not FormData
  if (!headers.has('Content-Type') && !(fetchOptions.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // Add auth token unless explicitly skipped
  if (!skipAuth) {
    const token = getAuthToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    // Try to parse JSON
    let data: any;
    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      // Non-JSON response from backend is unexpected
      throw new ApiError(
        response.status,
        'Invalid response format: expected JSON',
        null
      );
    }

    // Handle error responses
    if (!response.ok) {
      const message = data?.message || `HTTP ${response.status}`;
      
      switch (response.status) {
        case 401:
          throw new UnauthorizedError(message);
        case 403:
          throw new ForbiddenError(message);
        case 404:
          throw new NotFoundError(message);
        case 409:
          throw new ConflictError(message);
        default:
          throw new ApiError(response.status, message, data);
      }
    }

    return data as T;
    
  } catch (error) {
    // Already an ApiError, re-throw
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network error (fetch failed)
    if (error instanceof TypeError) {
      throw new NetworkError('Network request failed. Check your connection.');
    }
    
    // Unknown error
    throw new ApiError(500, 'An unexpected error occurred', error);
  }
}

// ============================================================================
// Helper methods for common HTTP verbs
// ============================================================================

export const get = <T>(path: string, options?: ApiClientOptions): Promise<T> =>
  apiClient<T>(path, { ...options, method: 'GET' });

export const post = <T>(
  path: string,
  data?: unknown,
  options?: ApiClientOptions
): Promise<T> =>
  apiClient<T>(path, {
    ...options,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });

export const put = <T>(
  path: string,
  data?: unknown,
  options?: ApiClientOptions
): Promise<T> =>
  apiClient<T>(path, {
    ...options,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });

export const patch = <T>(
  path: string,
  data?: unknown,
  options?: ApiClientOptions
): Promise<T> =>
  apiClient<T>(path, {
    ...options,
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  });

export const del = <T>(path: string, options?: ApiClientOptions): Promise<T> =>
  apiClient<T>(path, { ...options, method: 'DELETE' });
