import { NextRequest, NextResponse } from 'next/server';
import common from '@/service/codes';
import { Code } from '@/interface/common';

export async function GET(request: NextRequest) {
  try {
    const data = await common.getAdminCodes();
    return NextResponse.json(data || [], { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}