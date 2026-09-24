import { NextResponse } from 'next/server';
import { ACCESS_COOKIE_NAME, accessCookieOptions } from '@/utils/accessGate';

export async function POST(request: Request) {
  const secure = new URL(request.url).protocol === 'https:';
  const response = NextResponse.json({ success: true });
  response.cookies.set(ACCESS_COOKIE_NAME, '', {
    ...accessCookieOptions(secure),
    maxAge: 0,
  });
  return response;
}
