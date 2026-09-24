import { NextResponse } from 'next/server';
import {
  ACCESS_COOKIE_MAX_AGE,
  ACCESS_COOKIE_NAME,
  expectedSessionToken,
  getAppPassword,
  isAccessGateEnabled,
  passwordsMatch,
} from '@/utils/accessGate';

export async function POST(request: Request) {
  if (!isAccessGateEnabled()) {
    return NextResponse.json({
      success: true,
      gateEnabled: false,
      message: 'Access gate is off. No password is required on this machine.',
    });
  }

  const body = (await request.json().catch(() => ({}))) as { password?: string };
  const password = body.password?.trim() || '';

  if (!password || !passwordsMatch(password, getAppPassword())) {
    return NextResponse.json(
      { error: 'Wrong password.' },
      { status: 401 }
    );
  }

  const token = await expectedSessionToken();
  const url = new URL(request.url);
  const response = NextResponse.json({ success: true, gateEnabled: true });
  response.cookies.set({
    name: ACCESS_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    secure: url.protocol === 'https:',
    path: '/',
    maxAge: ACCESS_COOKIE_MAX_AGE,
  });
  return response;
}
