/**
 * @jest-environment node
 */

import { POST } from '@/app/api/auth/login/route';
import { ACCESS_COOKIE_NAME } from '@/utils/accessGate';

const ORIGINAL_ENV = process.env;

describe('login API', () => {
  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  it('sets a session cookie for the correct password', async () => {
    process.env = { ...ORIGINAL_ENV, APP_PASSWORD: 'only-aaron' };
    const response = await POST(
      new Request('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: 'only-aaron' }),
      })
    );

    expect(response.status).toBe(200);
    const cookie = response.headers.get('set-cookie') || '';
    expect(cookie).toContain(`${ACCESS_COOKIE_NAME}=`);
    expect(cookie).toContain('HttpOnly');
    expect(cookie).not.toContain('only-aaron');
  });

  it('rejects the wrong password', async () => {
    process.env = { ...ORIGINAL_ENV, APP_PASSWORD: 'only-aaron' };
    const response = await POST(
      new Request('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: 'nope' }),
      })
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toMatchObject({ error: 'Wrong password.' });
  });

  it('does nothing when the gate is disabled', async () => {
    process.env = { ...ORIGINAL_ENV };
    delete process.env.APP_PASSWORD;
    const response = await POST(
      new Request('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: 'anything' }),
      })
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ gateEnabled: false });
  });
});
