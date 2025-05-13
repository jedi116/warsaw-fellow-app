import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/service/firebaseAdmin';
import { db } from '@/service/firebaseAdmin';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  Timestamp 
} from 'firebase/firestore';
import { Attendance } from '@/interface/attendance';

// Get attendance for a specific date
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date');
    
    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }
    
    // Authenticate the request
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const token = authHeader.split('Bearer ')[1];
    try {
      await auth.verifyIdToken(token);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    // Query the attendance records for the specific date
    const q = query(collection(db, 'attendance'), where('date', '==', date));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return NextResponse.json({ message: 'No attendance record found for this date' }, { status: 404 });
    }
    
    // Get the first matching attendance record
    const attendanceData = querySnapshot.docs[0].data() as Attendance;
    
    return NextResponse.json(attendanceData);
  } catch (error) {
    console.error('Error getting attendance:', error);
    return NextResponse.json({ error: 'Failed to get attendance record' }, { status: 500 });
  }
}

// Create a new attendance record
export async function POST(request: NextRequest) {
  try {
    // Authenticate the request
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const token = authHeader.split('Bearer ')[1];
    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(token);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    // Check if the user has admin role
    const userRecord = await auth.getUser(decodedToken.uid);
    const customClaims = userRecord.customClaims || {};
    if (customClaims.role !== 'admin') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }
    
    // Parse the attendance data from the request body
    const attendanceData: Attendance = await request.json();
    
    if (!attendanceData.date || !attendanceData.users || !Array.isArray(attendanceData.users)) {
      return NextResponse.json({ error: 'Invalid attendance data' }, { status: 400 });
    }
    
    // Check if attendance for this date already exists
    const q = query(collection(db, 'attendance'), where('date', '==', attendanceData.date));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      return NextResponse.json({ error: 'Attendance for this date already exists' }, { status: 409 });
    }
    
    // Save the new attendance record
    await addDoc(collection(db, 'attendance'), {
      ...attendanceData,
      createdAt: Timestamp.now(),
      createdBy: decodedToken.uid
    });
    
    return NextResponse.json({ success: true, message: 'Attendance saved successfully' });
  } catch (error) {
    console.error('Error saving attendance:', error);
    return NextResponse.json({ error: 'Failed to save attendance record' }, { status: 500 });
  }
}