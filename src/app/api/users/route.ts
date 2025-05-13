import { NextRequest, NextResponse } from 'next/server';
import UserService from '@/service/User';
import { User } from '@/interface/user';

export async function GET(request: NextRequest) {
  try {
    // In the App Router, we'll use simple authentication for now
    // You might want to implement proper auth later
    const users = await UserService.getUsers();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json() as User;
    console.log(userData);
    await UserService.createUser({
      ...userData,
      password: process.env.NEXT_PUBLIC_DEFAULT_PASSWORD || ''
    });
    return NextResponse.json({ response: 'success' }, { status: 200 });
  } catch (error: any) {
    console.log(error.stack);
    return NextResponse.json({ response: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userData = await request.json() as User;
    console.log(userData);
    await UserService.updateUser({
      ...userData,
    });
    return NextResponse.json({ response: 'success' }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ response: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userData = await request.json() as { uid: string };
    await UserService.deleteUser(userData.uid);
    return NextResponse.json({ response: 'success' }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ response: error.message }, { status: 500 });
  }
}