/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { middleware } from '@/middleware';
import { middlewareConfig } from '@/config/middleware';

// Mock the Next.js request environment
const createMockRequest = (path: string, authHeader?: string | string[]) => {
  const headers = new Headers();
  if (authHeader) {
    if (Array.isArray(authHeader)) {
      authHeader.forEach(header => headers.append('authorization', header));
    } else {
      headers.set('authorization', authHeader);
    }
  }

  const url = new URL(`http://localhost${path}`);
  return new NextRequest(url, {
    headers,
  });
};

describe('Middleware', () => {
  it('should allow requests with valid API key', async () => {
    const request = createMockRequest(
      `${middlewareConfig.api.routes.prefix}/test`,
      `${middlewareConfig.api.routes.authScheme} valid-api-key`
    );
    const response = await middleware(request);
    expect(response.status).toBe(200);
  });

  it('should reject requests without API key', async () => {
    const request = createMockRequest(
      `${middlewareConfig.api.routes.prefix}/test`
    );
    const response = await middleware(request);
    expect(response.status).toBe(
      middlewareConfig.api.errors.unauthorized.status
    );

    const data = await response.json();
    expect(data).toEqual({ error: 'Unauthorized' });
  });

  it('should reject requests with invalid authorization format', async () => {
    const request = createMockRequest(
      `${middlewareConfig.api.routes.prefix}/test`,
      'InvalidFormat'
    );
    const response = await middleware(request);
    expect(response.status).toBe(
      middlewareConfig.api.errors.unauthorized.status
    );

    const data = await response.json();
    expect(data).toEqual({ error: 'Unauthorized' });
  });

  it('should not intercept non-API routes', async () => {
    const request = createMockRequest('/some-other-route');
    const response = await middleware(request);
    expect(response.status).toBe(200);
  });

  it('should handle empty authorization header', async () => {
    const request = createMockRequest(
      `${middlewareConfig.api.routes.prefix}/test`,
      ''
    );
    const response = await middleware(request);
    expect(response.status).toBe(
      middlewareConfig.api.errors.unauthorized.status
    );
  });

  it('should handle malformed authorization header', async () => {
    const request = createMockRequest(
      `${middlewareConfig.api.routes.prefix}/test`,
      'Bearer'
    );
    const response = await middleware(request);
    expect(response.status).toBe(
      middlewareConfig.api.errors.unauthorized.status
    );
  });

  // Test cases for API key formats
  describe('API Key Formats', () => {
    it('should accept standard API key format', async () => {
      const request = createMockRequest(
        `${middlewareConfig.api.routes.prefix}/test`,
        `${middlewareConfig.api.routes.authScheme} sk-1234567890abcdef`
      );
      const response = await middleware(request);
      expect(response.status).toBe(200);
    });

    it('should accept API key with special characters', async () => {
      const request = createMockRequest(
        `${middlewareConfig.api.routes.prefix}/test`,
        `${middlewareConfig.api.routes.authScheme} sk-123!@#$%^&*()_+`
      );
      const response = await middleware(request);
      expect(response.status).toBe(200);
    });

    it('should accept API key with spaces', async () => {
      const request = createMockRequest(
        `${middlewareConfig.api.routes.prefix}/test`,
        `${middlewareConfig.api.routes.authScheme} sk-123 456 789`
      );
      const response = await middleware(request);
      expect(response.status).toBe(200);
    });
  });

  // Test cases for case sensitivity
  describe('Case Sensitivity', () => {
    it('should accept lowercase bearer scheme', async () => {
      const request = createMockRequest(
        `${middlewareConfig.api.routes.prefix}/test`,
        'bearer valid-api-key'
      );
      const response = await middleware(request);
      expect(response.status).toBe(200);
    });

    it('should accept uppercase bearer scheme', async () => {
      const request = createMockRequest(
        `${middlewareConfig.api.routes.prefix}/test`,
        'BEARER valid-api-key'
      );
      const response = await middleware(request);
      expect(response.status).toBe(200);
    });

    it('should accept mixed case bearer scheme', async () => {
      const request = createMockRequest(
        `${middlewareConfig.api.routes.prefix}/test`,
        'BeArEr valid-api-key'
      );
      const response = await middleware(request);
      expect(response.status).toBe(200);
    });
  });

  // New test cases for multiple authorization headers
  describe('Multiple Authorization Headers', () => {
    it('should use the first authorization header', async () => {
      const request = createMockRequest(
        `${middlewareConfig.api.routes.prefix}/test`,
        [
          `${middlewareConfig.api.routes.authScheme} valid-api-key`,
          `${middlewareConfig.api.routes.authScheme} invalid-api-key`,
        ]
      );
      const response = await middleware(request);
      expect(response.status).toBe(200);
    });

    it('should handle multiple invalid headers', async () => {
      const request = createMockRequest(
        `${middlewareConfig.api.routes.prefix}/test`,
        ['InvalidFormat1', 'InvalidFormat2']
      );
      const response = await middleware(request);
      expect(response.status).toBe(
        middlewareConfig.api.errors.unauthorized.status
      );
    });

    it('should handle mix of valid and invalid headers', async () => {
      const request = createMockRequest(
        `${middlewareConfig.api.routes.prefix}/test`,
        [
          'InvalidFormat',
          `${middlewareConfig.api.routes.authScheme} valid-api-key`,
        ]
      );
      const response = await middleware(request);
      expect(response.status).toBe(200);
    });
  });
});
