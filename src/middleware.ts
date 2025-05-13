import { NextRequest, NextResponse } from 'next/server';

// This middleware is simplified to allow client-side auth to handle authentication
export async function middleware(request: NextRequest) {
  // We'll only log requests to protected API routes for debugging purposes
  const { pathname } = request.nextUrl
  
  // Only protect API routes at the middleware level
  if (pathname.startsWith('/api/') && pathname !== '/api/auth') {
    const session = request.cookies.get('session')?.value
    const isAuthenticated = !!session
    
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }
  
  return NextResponse.next()
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    '/api/:path*',
  ],
};