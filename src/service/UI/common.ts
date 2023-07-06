
import { Code } from '@/interface/common';
import { User } from 'firebase/auth';
import { addDoc, collection, doc, where, query, getDocs } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db } from './firebaseUiClient';
import { Timestamp } from 'firebase/firestore';
import UserService from '@/service/UI/user-ui';
import { AttendanceUser, Attendance } from '@/interface/attendance';
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
            const exisitingAttendance = await this.getAttendanceByDate(attendance.date) 
            if (!exisitingAttendance) {
              await addDoc(collection(db, 'attendance'), attendance)
              toast.success('Successfully saved attendance')
            } else {
                toast.warning('attendance for selected period already exists')
            }
        } catch (error: any) {
            toast.error('Error saving attendance' + error.message)
        }
    }
}()