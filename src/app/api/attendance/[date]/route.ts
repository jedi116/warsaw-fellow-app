import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/service/firebaseAdmin';
import { db } from '@/service/firebaseAdmin';
import { 
  collection, 
  query, 
  where, 
  getDocs
} from 'firebase/firestore';
import { Attendance } from '@/interface/attendance';

// Get attendance for a specific date
export async function GET(
  request: NextRequest,
  { params }: { params: { date: string } }
) {
  try {
    const date = params.date;
    
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