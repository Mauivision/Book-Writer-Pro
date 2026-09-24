interface RetryConfig {
  maxRetries?: number;
  retryDelay?: number;
  onRetry?: (error: Error, attempt: number) => void;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public code: string | number = 'UNKNOWN_ERROR',
    public details?: unknown
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
      const response = await fetch(url, {
        ...options,
        credentials: 'same-origin',
        headers: {
          ...options.headers,
          'Content-Type': 'application/json',
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
  throw new ApiError(
    'API keys stay on the server. Set XAI_API_KEY or OPENAI_API_KEY in the environment instead of the browser.'
  );
}

export async function makeApiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  config: RetryConfig = {}
): Promise<T> {
  const response = await fetchWithRetry(endpoint, options, config);
  return response.json();
} 