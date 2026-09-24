/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { middleware } from '@/middleware';
import { ACCESS_COOKIE_NAME, accessTokenFromPassword } from '@/utils/accessGate';

function createMockRequest(
  path: string,
  options: { cookie?: string; host?: string } = {}
) {
  const headers = new Headers();
  if (options.cookie) {
    headers.set('cookie', options.cookie);
  }
  const url = new URL(`http://localhost${path}`);
  return new NextRequest(url, { headers });
}

describe('Access-gate middleware', () => {
  const originalPassword = process.env.APP_PASSWORD;

  afterEach(() => {
    if (originalPassword === undefined) {
      delete process.env.APP_PASSWORD;
    } else {
      process.env.APP_PASSWORD = originalPassword;
    }
  });

  it('lets every page and API through when APP_PASSWORD is unset', async () => {
    delete process.env.APP_PASSWORD;
    const home = await middleware(createMockRequest('/'));
    const api = await middleware(createMockRequest('/api/ai/status'));
    expect(home.status).toBe(200);
    expect(api.status).toBe(200);
    expect(home.headers.get('location')).toBeNull();
  });

  it('redirects pages to login when the gate is on and there is no cookie', async () => {
    process.env.APP_PASSWORD = 'studio-secret';
    const response = await middleware(createMockRequest('/settings'));
    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toContain('/login?next=%2Fsettings');
  });

  it('rejects API calls without a cookie when the gate is on', async () => {
    process.env.APP_PASSWORD = 'studio-secret';
    const response = await middleware(createMockRequest('/api/ai/status'));
    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      error: 'Sign in required. This hosted copy is private.',
    });
  });

  it('leaves the login routes public', async () => {
    process.env.APP_PASSWORD = 'studio-secret';
    const page = await middleware(createMockRequest('/login'));
    const api = await middleware(createMockRequest('/api/auth/login'));
    expect(page.status).toBe(200);
    expect(api.status).toBe(200);
  });

  it('allows a valid access cookie through', async () => {
    process.env.APP_PASSWORD = 'studio-secret';
    const token = await accessTokenFromPassword('studio-secret');
    const response = await middleware(
      createMockRequest('/api/ai/generate-chapter', {
        cookie: `${ACCESS_COOKIE_NAME}=${token}`,
      })
    );
    expect(response.status).toBe(200);
  });

  it('rejects a cookie minted for a different password', async () => {
    process.env.APP_PASSWORD = 'studio-secret';
    const token = await accessTokenFromPassword('old-password');
    const response = await middleware(
      createMockRequest('/', {
        cookie: `${ACCESS_COOKIE_NAME}=${token}`,
      })
    );
    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toContain('/login');
  });
});
