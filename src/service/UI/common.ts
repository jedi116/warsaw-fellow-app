
import { Code } from '@/interface/common';
import { User, getAuth } from 'firebase/auth';
import { addDoc, collection, doc, where, query, getDocs } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db } from './firebaseUiClient';
import { Timestamp } from 'firebase/firestore';
import UserService from '@/service/UI/user-ui';
import { AttendanceUser, Attendance } from '@/interface/attendance';
import { User as AppUser } from '@/interface/user';
import dayjs from "dayjs";
// import { sortCodesOnCreateTime } from '@/helpers';
export default new class CommonService {
    getAdminCodes = async (user:User | undefined | null) => {
        try {
            const data = (await fetch(`${window.location.origin}/api/codes/admin`, {
                headers: {
                  Authorization: `Bearer ${await user?.getIdToken()}` 
                }  
              }))
            return await data.json() as Code []    
        } catch (error) {
            console.log(error)
        }
    }

    getRegistrationCodes = async (user:User | undefined | null) => {
        try {
            const data = (await fetch(`${window.location.origin}/api/codes/registration`, {
              headers: {
                Authorization: `Bearer ${await user?.getIdToken()}` 
              }  
            }))
            return await data.json() as Code []    
        } catch (error) {
            console.log(error)
        }
    }

    getRegistrationCodesWCilent = async () => {
        try {
            const fireBaseQuery = query(collection(db, 'codes'), where('type','==','register'))
            const codeDocs = await getDocs(fireBaseQuery)
            const codes = codeDocs.docs.map(doc => {
                return {
                    createTime: doc.get('createTime'),
                    type: doc.get('type'),
                    value: doc.get('value')
                }
            }) as Code []
            /*
                can not use sortCodesOnCreateTime(codes) because it in helper/index.js which is used by server
                some how importing functions used both on server and ui side cause issue with firebase 
                decided to use sort directly
            */ 
            return codes.sort((a, b) => {
                if (a.createTime.seconds > b.createTime.seconds) {
                  return -1
                }
                if (a.createTime.seconds < b.createTime.seconds) {
                    return 1
                }
                return 0
            }) 
        } catch (error) {
            console.log(error)
        }
    }
    updateCode = async (code: string, type: 'admin' | 'register') => {
        try {
            await addDoc(collection(db, 'codes'),{
                type,
                value: code,
                createTime: Timestamp.now()
            })
            toast.success('Updated Code Successfully')
        } catch (error) {
            toast.error('Error updating code')
            console.log(error)
        }
    }

    getNewAttendance = async () => {
        const users = await UserService.getUsers()
        if (users) {
            const attendanceUserList: AttendanceUser [] = users.map(user => {
                return {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    present: false,
                    uid: user.uid
                } as AttendanceUser
            })

            const attendance: Attendance = {
                date: dayjs().format("MM-DD-YYYY"),
                users: attendanceUserList
            }

            return attendance
        }
    }

    getAttendanceByDate = async (date: string) => {
        try {
            // First try with the new API route
            if (typeof window !== 'undefined') {
                try {
                    const response = await fetch(`/api/attendance?date=${date}`, {
                        headers: {
                            'Authorization': `Bearer ${await auth.currentUser?.getIdToken()}`
                        }
                    });
                    
                    if (response.ok) {
                        return await response.json() as Attendance;
                    }
                    
                    // If API returns 404, continue with Firestore query
                    if (response.status !== 404) {
                        throw new Error(`API error: ${response.status}`);
                    }
                } catch (apiError) {
                    console.log('API error, falling back to direct Firestore query:', apiError);
                    // Continue with the existing implementation as fallback
                }
            }
            
            // Fallback to direct Firestore query
            const q = query(collection(db, 'attendance'), where('date','==',date))
            const docs = await getDocs(q)
            const attendanceList = docs.docs.map((doc) => {
                const data = {
                    date: doc.get('date'),
                    users: doc.get('users')
                }
                return data as Attendance
            })
            return attendanceList[0]
        } catch (error: any) {
            console.log(error)
        }
    }

    saveAttendance = async (attendance: Attendance) => {
        try {
            // First try with the new API endpoint
            if (typeof window !== 'undefined') {
                try {
                    const response = await fetch('/api/attendance', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${await auth.currentUser?.getIdToken()}`
                        },
                        body: JSON.stringify(attendance)
                    });
                    
                    if (response.ok) {
                        toast.success('Successfully saved attendance');
                        return;
                    }
                    
                    if (response.status === 409) {
                        toast.warning('Attendance for selected period already exists');
                        return;
                    }
                    
                    // For other errors, throw and fall back to direct Firestore
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'API error');
                } catch (apiError) {
                    console.log('API error, falling back to direct Firestore:', apiError);
                    // Continue with existing implementation as fallback
                }
            }
            
            // Fallback to direct Firestore
            const existingAttendance = await this.getAttendanceByDate(attendance.date) 
            if (!existingAttendance) {
                await addDoc(collection(db, 'attendance'), attendance)
                toast.success('Successfully saved attendance')
            } else {
                toast.warning('Attendance for selected period already exists')
            }
        } catch (error: any) {
            toast.error('Error saving attendance: ' + error.message)
        }
    }

    getUsers = async (): Promise<AppUser[]> => {
        try {
            // Get the current user's ID token for authentication
            const auth = getAuth();
            const currentUser = auth.currentUser;
            
            if (!currentUser) {
                console.log('Waiting for authentication...');
                // Wait for a moment to give Firebase auth time to initialize
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Try again
                if (!auth.currentUser) {
                    throw new Error('User not authenticated');
                }
            }
            
            const token = await auth.currentUser!.getIdToken();
            
            // Use AbortController to set a timeout for the fetch
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
            
            const response = await fetch('/api/users', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.error('Error fetching users:', error);
            
            // Don't show timeout errors to the user, as they may be common during page transitions
            if (errorMessage.includes('The operation was aborted') || 
                errorMessage.includes('AbortError')) {
                console.log('Request was aborted - likely due to page navigation or timeout');
            } else {
                toast.error('Failed to load members. Please try again later.');
            }
            
            return [];
        }
    }

    getAdminCodesWClient = async () => {
        try {
            const fireBaseQuery = query(collection(db, 'codes'), where('type','==','admin'))
            const codeDocs = await getDocs(fireBaseQuery)
            const codes = codeDocs.docs.map(doc => {
                return {
                    createTime: doc.get('createTime'),
                    type: doc.get('type'),
                    value: doc.get('value')
                }
            }) as Code []
            
            return codes.sort((a, b) => {
                if (a.createTime.seconds > b.createTime.seconds) {
                  return -1
                }
                if (a.createTime.seconds < b.createTime.seconds) {
                    return 1
                }
                return 0
            }) 
        } catch (error) {
            console.log(error)
            return null;
        }
    }
}()