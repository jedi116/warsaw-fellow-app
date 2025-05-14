import { NextRequest, NextResponse } from 'next/server';

// This middleware is simplified to allow client-side auth to handle authentication
export async function middleware(request: NextRequest) {
  // We'll only log requests to protected API routes for debugging purposes
  const { pathname } = request.nextUrl
  
  // Only protect API routes at the middleware level, except for public routes
  if (pathname.startsWith('/api/') && 
      pathname !== '/api/auth' && 
      !pathname.startsWith('/api/content')) {
    // Check for either session cookie or Authorization header
    const session = request.cookies.get('session')?.value
    const authHeader = request.headers.get('Authorization')?.split(' ')[1]
    
    // User is authenticated if either session cookie or auth header exists
    const isAuthenticated = !!session || !!authHeader
    
    if (!isAuthenticated) {
      console.log('Unauthorized access attempt to:', pathname)
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