import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  ACCESS_COOKIE_NAME,
  isAccessGateEnabled,
  isPublicPath,
  isValidAccessToken,
  safeNextPath,
} from '@/utils/accessGate';

export async function middleware(request: NextRequest) {
  if (!isAccessGateEnabled()) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ACCESS_COOKIE_NAME)?.value;
  if (await isValidAccessToken(token)) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/api/')) {
    return NextResponse.json(
      { error: 'Sign in required. This hosted copy is private.' },
      { status: 401 }
    );
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = '/login';
  loginUrl.search = '';
  loginUrl.searchParams.set('next', safeNextPath(pathname));
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
