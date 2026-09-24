import {
  ACCESS_COOKIE_NAME,
  accessTokenFromPassword,
  isAccessGateEnabled,
  isPublicPath,
  isValidAccessToken,
  passwordsMatch,
  readAppPassword,
  safeNextPath,
  timingSafeEqual,
} from '@/utils/accessGate';

describe('access gate helpers', () => {
  const originalPassword = process.env.APP_PASSWORD;

  afterEach(() => {
    if (originalPassword === undefined) {
      delete process.env.APP_PASSWORD;
    } else {
      process.env.APP_PASSWORD = originalPassword;
    }
  });

  it('is disabled when APP_PASSWORD is empty', () => {
    delete process.env.APP_PASSWORD;
    expect(isAccessGateEnabled()).toBe(false);
    process.env.APP_PASSWORD = '   ';
    expect(isAccessGateEnabled()).toBe(false);
    expect(readAppPassword()).toBe('');
  });

  it('is enabled when APP_PASSWORD is set', () => {
    process.env.APP_PASSWORD = 'studio-secret';
    expect(isAccessGateEnabled()).toBe(true);
    expect(readAppPassword()).toBe('studio-secret');
  });

  it('only treats login routes as public', () => {
    expect(isPublicPath('/login')).toBe(true);
    expect(isPublicPath('/api/auth/login')).toBe(true);
    expect(isPublicPath('/')).toBe(false);
    expect(isPublicPath('/api/ai/status')).toBe(false);
    expect(isPublicPath('/settings')).toBe(false);
  });

  it('accepts only the hashed access token for the current password', async () => {
    const token = await accessTokenFromPassword('studio-secret');
    await expect(isValidAccessToken(token, 'studio-secret')).resolves.toBe(
      true
    );
    await expect(isValidAccessToken(token, 'other-secret')).resolves.toBe(
      false
    );
    await expect(isValidAccessToken('not-a-hash', 'studio-secret')).resolves.toBe(
      false
    );
    expect(token).not.toBe('studio-secret');
    expect(ACCESS_COOKIE_NAME).toBe('bw_access');
  });

  it('compares passwords without returning the secret', async () => {
    await expect(passwordsMatch('studio-secret', 'studio-secret')).resolves.toBe(
      true
    );
    await expect(passwordsMatch('nope', 'studio-secret')).resolves.toBe(false);
    expect(timingSafeEqual('abcd', 'abce')).toBe(false);
    expect(timingSafeEqual('same', 'same')).toBe(true);
  });

  it('blocks open redirects', () => {
    expect(safeNextPath('/settings')).toBe('/settings');
    expect(safeNextPath('https://evil.example')).toBe('/');
    expect(safeNextPath('//evil.example')).toBe('/');
    expect(safeNextPath(null)).toBe('/');
  });
});
