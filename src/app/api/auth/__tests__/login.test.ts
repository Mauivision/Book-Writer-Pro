/**
 * @jest-environment node
 */
import { POST } from '@/app/api/auth/login/route';
import { ACCESS_COOKIE_NAME, accessTokenFromPassword } from '@/utils/accessGate';

describe('login route', () => {
  const originalPassword = process.env.APP_PASSWORD;

  afterEach(() => {
    if (originalPassword === undefined) {
      delete process.env.APP_PASSWORD;
    } else {
      process.env.APP_PASSWORD = originalPassword;
    }
  });

  it('sets the access cookie for the correct password', async () => {
    process.env.APP_PASSWORD = 'studio-secret';
    const request = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'studio-secret' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const token = await accessTokenFromPassword('studio-secret');
    expect(response.cookies.get(ACCESS_COOKIE_NAME)?.value).toBe(token);
  });

  it('rejects the wrong password', async () => {
    process.env.APP_PASSWORD = 'studio-secret';
    const request = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'nope' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: 'Wrong password.' });
  });

  it('is a no-op when the gate is disabled', async () => {
    delete process.env.APP_PASSWORD;
    const request = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'anything' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      gateEnabled: false,
    });
  });
});
