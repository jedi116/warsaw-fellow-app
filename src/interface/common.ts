import { Timestamp } from 'firebase/firestore'
export interface Code {
    createTime: Timestamp
    type: CodeTypes
    value: string
}

type CodeTypes = 'admin' | 'register'

export interface CodesType {
    admin: string
    registration: string
} 