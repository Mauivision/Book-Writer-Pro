interface RetryConfig {
  maxRetries?: number;
  retryDelay?: number;
  onRetry?: (error: Error, attempt: number) => void;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public code: string = 'UNKNOWN_ERROR'
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  config: RetryConfig = {}
): Promise<Response> {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    onRetry = () => {}
  } = config;

  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const apiKey = localStorage.getItem('openai_api_key');
      if (!apiKey) {
        throw new ApiError('API key not found. Please configure it in settings.', 401);
      }

      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.error || 'API request failed',
          response.status,
          errorData
        );
      }

      return response;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt < maxRetries) {
        onRetry(lastError, attempt + 1);
        await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempt)));
      }
    }
  }

  throw lastError!;
}

export async function getApiKey(): Promise<string> {
  const apiKey = localStorage.getItem('openai_api_key');
  if (!apiKey) {
    throw new ApiError('API key not found. Please configure it in settings.');
  }
  return apiKey;
}

export async function makeApiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  config: RetryConfig = {}
): Promise<T> {
  const response = await fetchWithRetry(endpoint, options, config);
  return response.json();
} 