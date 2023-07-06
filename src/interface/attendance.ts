export interface Attendance {
    date: string,
    users: AttendanceUser []
}

export interface AttendanceUser {
    uid: string;
    firstName: string;
    lastName: string;
    present: boolean;
}