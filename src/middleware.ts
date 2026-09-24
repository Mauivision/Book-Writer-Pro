import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  ACCESS_COOKIE_NAME,
  isAccessGateEnabled,
  isPublicPath,
  isValidSessionToken,
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
  if (await isValidSessionToken(token)) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/api/')) {
    return NextResponse.json(
      { error: 'Unauthorized. Sign in with the site password first.' },
      { status: 401 }
    );
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = '/login';
  loginUrl.search = '';
  const redirectTo = `${pathname}${request.nextUrl.search}`;
  if (redirectTo && redirectTo !== '/login') {
    loginUrl.searchParams.set('next', redirectTo);
  }
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
