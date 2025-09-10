import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Extracts the API key from the authorization header
 * @param authHeader The authorization header value
 * @returns The API key or null if invalid
 */
function extractApiKey(authHeader: string | null): string | null {
  if (!authHeader) return null;
  
  const [scheme, key] = authHeader.split(' ');
  if (!scheme || !key) return null;
  
  if (scheme.toLowerCase() !== 'bearer') return null;
  
  return key;
}

/**
 * Middleware function to handle API authentication
 * @param request The incoming request
 * @returns NextResponse
 */
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/ai')) {
    const authHeader = request.headers.get('authorization');
    const apiKey = extractApiKey(authHeader);
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: ['/api/ai/:path*']
}; 