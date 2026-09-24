export const ACCESS_COOKIE_NAME = 'bw_access';

const TOKEN_SALT = 'book-writer-pro-access-v1';

export function readAppPassword(
  env: NodeJS.ProcessEnv = process.env
): string {
  return env.APP_PASSWORD?.trim() ?? '';
}

export function isAccessGateEnabled(
  env: NodeJS.ProcessEnv = process.env
): boolean {
  return readAppPassword(env).length > 0;
}

export function isPublicPath(pathname: string): boolean {
  return (
    pathname === '/login' ||
    pathname.startsWith('/login/') ||
    pathname === '/api/auth/login'
  );
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

export async function sha256Hex(value: string): Promise<string> {
  const encoded = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', encoded);
  return toHex(digest);
}

export async function accessTokenFromPassword(
  password: string
): Promise<string> {
  return sha256Hex(`${TOKEN_SALT}:${password}`);
}

export function timingSafeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) {
    return false;
  }

  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return mismatch === 0;
}

export async function passwordsMatch(
  submitted: string,
  expected: string
): Promise<boolean> {
  const [left, right] = await Promise.all([
    sha256Hex(submitted),
    sha256Hex(expected),
  ]);
  return timingSafeEqual(left, right);
}

export async function isValidAccessToken(
  token: string | undefined | null,
  password = readAppPassword()
): Promise<boolean> {
  if (!token || !password) {
    return false;
  }
  const expected = await accessTokenFromPassword(password);
  return timingSafeEqual(token, expected);
}

export function accessCookieOptions(secure: boolean) {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure,
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  };
}

export function safeNextPath(next: string | null | undefined): string {
  if (!next || !next.startsWith('/') || next.startsWith('//')) {
    return '/';
  }
  return next;
}
