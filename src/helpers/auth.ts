import { NextRequest, NextResponse } from 'next/server';
import { verifyIdToken } from '@/service/firebaseAdmin';

export async function authenticate(
  request: NextRequest, 
  handler: (req: NextRequest, userId: string) => Promise<NextResponse>
) {
  try {
    const token = request.headers.get('Authorization')?.split('Bearer ')[1];
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication token is required' },
        { status: 401 }
      );
    }

    try {
      const decodedToken = await verifyIdToken(token);
      return handler(request, decodedToken.uid);
    } catch (error) {
      console.error('Auth error:', error);
      return NextResponse.json(
        { error: 'Invalid authentication token' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Server error during authentication' },
      { status: 500 }
    );
  }
}