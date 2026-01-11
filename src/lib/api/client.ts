import { ApiError, UnauthorizedError, ForbiddenError, NotFoundError, ConflictError } from './errors';

const getBaseUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_API_URL is not defined in environment variables');
  }
  return baseUrl;
};

const getAuthToken = (): string | null => {
  // Client-side: Get token from localStorage
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken');
  }
  // Server-side: No token access
  return null;
};

interface ApiClientOptions extends RequestInit {
  isServer?: boolean;
}

export async function apiClient<T = any>(
  path: string,
  options: ApiClientOptions = {}
): Promise<T> {
  const { isServer = false, ...fetchOptions } = options;
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${path}`;

  // Set up headers
  const headers = new Headers(fetchOptions.headers || {});
  if (!headers.has('Content-Type') && !(fetchOptions.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // Add auth token if available
  const token = getAuthToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    // Try to parse JSON response
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      throw new Error('Invalid response format');
    }

    // Handle error responses
    if (!response.ok) {
      switch (response.status) {
        case 401:
          throw new UnauthorizedError(data?.message);
        case 403:
          throw new ForbiddenError(data?.message);
        case 404:
          throw new NotFoundError(data?.message);
        case 409:
          throw new ConflictError(data?.message);
        default:
          throw new ApiError(
            response.status,
            data?.message || `HTTP error! status: ${response.status}`,
            data
          );
      }
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'An unexpected error occurred', error);
  }
}

// Helper methods for common HTTP methods
export const get = <T>(path: string, options?: ApiClientOptions) =>
  apiClient<T>(path, { ...options, method: 'GET' });

export const post = <T>(path: string, data?: any, options?: ApiClientOptions) =>
  apiClient<T>(path, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data),
  });

export const put = <T>(path: string, data?: any, options?: ApiClientOptions) =>
  apiClient<T>(path, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const del = <T>(path: string, options?: ApiClientOptions) =>
  apiClient<T>(path, { ...options, method: 'DELETE' });
