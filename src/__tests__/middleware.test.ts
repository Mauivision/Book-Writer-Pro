/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server';
import { middleware } from '@/middleware';
import { ACCESS_COOKIE_NAME, expectedSessionToken } from '@/utils/accessGate';

const ORIGINAL_ENV = process.env;

function request(path: string, cookie?: string) {
  const headers = new Headers();
  if (cookie) {
    headers.set('cookie', cookie);
  }
  return new NextRequest(new URL(`http://localhost${path}`), { headers });
}

describe('access-gate middleware', () => {
  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  it('lets every page and API through when APP_PASSWORD is unset', async () => {
    process.env = { ...ORIGINAL_ENV };
    delete process.env.APP_PASSWORD;

    const page = await middleware(request('/settings'));
    const api = await middleware(request('/api/ai/generate-chapter'));

    expect(page.status).toBe(200);
    expect(api.status).toBe(200);
  });

  it('redirects pages and blocks APIs when the password is set and there is no cookie', async () => {
    process.env = { ...ORIGINAL_ENV, APP_PASSWORD: 'only-aaron' };

    const page = await middleware(request('/settings'));
    expect(page.status).toBe(307);
    expect(page.headers.get('location')).toContain('/login');

    const api = await middleware(request('/api/ai/generate-chapter'));
    expect(api.status).toBe(401);
    await expect(api.json()).resolves.toMatchObject({
      error: expect.stringMatching(/Unauthorized/i),
    });
  });

  it('allows the login page and login API without a cookie', async () => {
    process.env = { ...ORIGINAL_ENV, APP_PASSWORD: 'only-aaron' };

    const page = await middleware(request('/login'));
    const api = await middleware(request('/api/auth/login'));

    expect(page.status).toBe(200);
    expect(api.status).toBe(200);
  });

  it('allows the rest of the app with a valid session cookie', async () => {
    process.env = { ...ORIGINAL_ENV, APP_PASSWORD: 'only-aaron' };
    const token = await expectedSessionToken();
    const cookie = `${ACCESS_COOKIE_NAME}=${token}`;

    const page = await middleware(request('/', cookie));
    const api = await middleware(request('/api/ai/status', cookie));

    expect(page.status).toBe(200);
    expect(api.status).toBe(200);
  });
});
