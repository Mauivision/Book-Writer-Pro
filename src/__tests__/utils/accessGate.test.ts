/**
 * @jest-environment node
 */

import {
  expectedSessionToken,
  isAccessGateEnabled,
  isPublicPath,
  isValidSessionToken,
  passwordsMatch,
  timingSafeEqual,
} from '@/utils/accessGate';

const ORIGINAL_ENV = process.env;

describe('access gate', () => {
  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  it('is disabled when APP_PASSWORD is empty', () => {
    process.env = { ...ORIGINAL_ENV };
    delete process.env.APP_PASSWORD;
    expect(isAccessGateEnabled()).toBe(false);
  });

  it('is enabled when APP_PASSWORD is set', () => {
    process.env = { ...ORIGINAL_ENV, APP_PASSWORD: 'only-aaron' };
    expect(isAccessGateEnabled()).toBe(true);
  });

  it('allows login and static paths without a session', () => {
    expect(isPublicPath('/login')).toBe(true);
    expect(isPublicPath('/api/auth/login')).toBe(true);
    expect(isPublicPath('/api/auth/session')).toBe(true);
    expect(isPublicPath('/_next/static/chunk.js')).toBe(true);
    expect(isPublicPath('/')).toBe(false);
    expect(isPublicPath('/api/ai/generate-chapter')).toBe(false);
    expect(isPublicPath('/settings')).toBe(false);
  });

  it('accepts only the exact site password', () => {
    process.env = { ...ORIGINAL_ENV, APP_PASSWORD: 'only-aaron' };
    expect(passwordsMatch('only-aaron')).toBe(true);
    expect(passwordsMatch('wrong')).toBe(false);
  });

  it('accepts a hashed session token and rejects a raw password cookie', async () => {
    process.env = { ...ORIGINAL_ENV, APP_PASSWORD: 'only-aaron' };
    const token = await expectedSessionToken();
    await expect(isValidSessionToken(token)).resolves.toBe(true);
    await expect(isValidSessionToken('only-aaron')).resolves.toBe(false);
    await expect(isValidSessionToken('')).resolves.toBe(false);
  });

  it('compares tokens in constant time', () => {
    expect(timingSafeEqual('abcd', 'abcd')).toBe(true);
    expect(timingSafeEqual('abcd', 'abce')).toBe(false);
    expect(timingSafeEqual('abc', 'abcd')).toBe(false);
  });
});
