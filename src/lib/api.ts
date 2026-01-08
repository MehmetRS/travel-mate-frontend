export async function apiFetch(path: string, options: RequestInit = {}): Promise<any> {
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

  // Make the request
  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Parse JSON response if content type is JSON
  let data;
  try {
    data = await response.json();
  } catch (error) {
    // If response is not JSON, throw a generic error
    throw new Error(`Request failed with status ${response.status}`);
  }

  // Check for successful response
  if (!response.ok) {
    // Extract error message from response or use default
    const errorMessage = data?.message || `HTTP error! status: ${response.status}`;
    throw new Error(errorMessage);
  }

  return data;
}