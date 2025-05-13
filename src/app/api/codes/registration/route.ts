import { NextRequest, NextResponse } from 'next/server';
import common from '@/service/codes';
import { Code } from '@/interface/common';

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching registration codes');
    const data = await common.getRegistrationCodes();
    // Log the data to help with debugging
    console.log('Registration codes retrieved:', data ? data.length : 0);
    return NextResponse.json(data || [], { status: 200 });
  } catch (error) {
    console.error('Error fetching registration codes:', error);
    return NextResponse.json({ error: 'Failed to fetch registration codes' }, { status: 500 });
  }
}