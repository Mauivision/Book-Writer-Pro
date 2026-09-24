export const ACCESS_COOKIE_NAME = 'bw_access';
export const ACCESS_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export function getAppPassword(): string {
  return process.env.APP_PASSWORD?.trim() || '';
}

export function isAccessGateEnabled(): boolean {
  return getAppPassword().length > 0;
}

export function isPublicPath(pathname: string): boolean {
  return (
    pathname === '/login' ||
    pathname === '/api/auth/login' ||
    pathname === '/api/auth/session' ||
    pathname.startsWith('/_next/') ||
    pathname === '/favicon.ico'
  );
}

function byteToHex(byte: number): string {
  return byte.toString(16).padStart(2, '0');
}

export async function hashSecret(value: string): Promise<string> {
  const encoded = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(digest)).map(byteToHex).join('');
}

export async function expectedSessionToken(password = getAppPassword()): Promise<string> {
  return hashSecret(`book-writer-access:${password}`);
}

export function timingSafeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) return false;
  let mismatch = 0;
  for (let i = 0; i < left.length; i += 1) {
    mismatch |= left.charCodeAt(i) ^ right.charCodeAt(i);
  }
  return mismatch === 0;
}

export async function isValidSessionToken(token: string | undefined | null): Promise<boolean> {
  if (!isAccessGateEnabled()) return true;
  if (!token) return false;
  const expected = await expectedSessionToken();
  return timingSafeEqual(token, expected);
}

export function passwordsMatch(submitted: string, expected = getAppPassword()): boolean {
  return timingSafeEqual(submitted, expected);
}
