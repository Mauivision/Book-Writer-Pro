import { NextResponse } from 'next/server';
import {
  ACCESS_COOKIE_NAME,
  accessCookieOptions,
  accessTokenFromPassword,
  isAccessGateEnabled,
  passwordsMatch,
  readAppPassword,
  safeNextPath,
} from '@/utils/accessGate';

async function readSubmittedPassword(request: Request): Promise<string> {
  const contentType = request.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const body = (await request.json().catch(() => ({}))) as {
      password?: string;
    };
    return typeof body.password === 'string' ? body.password : '';
  }

  const form = await request.formData().catch(() => null);
  const value = form?.get('password');
  return typeof value === 'string' ? value : '';
}

export async function POST(request: Request) {
  if (!isAccessGateEnabled()) {
    return NextResponse.json({
      success: true,
      gateEnabled: false,
      message: 'Access gate is off for this instance.',
    });
  }

  const password = await readSubmittedPassword(request);
  const expected = readAppPassword();
  if (!password || !(await passwordsMatch(password, expected))) {
    return NextResponse.json(
      { error: 'Wrong password.' },
      { status: 401 }
    );
  }

  const nextPath = safeNextPath(new URL(request.url).searchParams.get('next'));
  const token = await accessTokenFromPassword(expected);
  const secure = new URL(request.url).protocol === 'https:';
  const response = NextResponse.json({
    success: true,
    gateEnabled: true,
    next: nextPath,
  });
  response.cookies.set(
    ACCESS_COOKIE_NAME,
    token,
    accessCookieOptions(secure)
  );
  return response;
}
