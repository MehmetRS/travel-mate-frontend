import { ApiError, UnauthorizedError, ForbiddenError, NotFoundError, ConflictError } from './api/errors';

export async function apiFetch<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  // Get the API base URL from environment variables
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_API_URL is not defined in environment variables');
  }

  // Construct the full URL
  const url = `${baseUrl}${path}`;

  // Set default headers if not provided
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // Add auth token if available
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  try {
    // Make the request
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // Required for cookies if used
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

    // Handle network errors or other issues
    if (error instanceof Error) {
      throw new ApiError(500, error.message, error);
    }

    throw new ApiError(500, 'An unexpected error occurred', error);
  }
}

// Helper methods for common HTTP methods
export const get = <T>(path: string, options?: RequestInit) =>
  apiFetch<T>(path, { ...options, method: 'GET' });

export const post = <T>(path: string, data?: any, options?: RequestInit) =>
  apiFetch<T>(path, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data),
  });

export const put = <T>(path: string, data?: any, options?: RequestInit) =>
  apiFetch<T>(path, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const del = <T>(path: string, options?: RequestInit) =>
  apiFetch<T>(path, { ...options, method: 'DELETE' });
