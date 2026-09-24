import { NextResponse } from 'next/server';
import { ACCESS_COOKIE_NAME } from '@/utils/accessGate';

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: ACCESS_COOKIE_NAME,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return response;
}
