import { User } from "@/interface/user"
import {
    query,
    getDocs,
    collection
  } from 'firebase/firestore'
  import { db } from "./firebaseUiClient"
import { toast } from "react-toastify"
import { CreateUserFormDataType } from "@/interface/auth"
import { User as FirebaseUser } from 'firebase/auth';
export default new class UserService {

    async getUsers (): Promise<User [] | undefined> {
        try {
          const q = query(collection(db, 'users'))
          const docs = await getDocs(q)
          const users = docs.docs.map((doc) => {
            const data = {
              uid: doc.get('uid'),
              email: doc.get('email'),
              firstName: doc.get('firstName'),
              lastName: doc.get('lastName'),
              phonenumber: doc.get('phonenumber'),
              birthday: doc.get('birthday'),
              team: doc.get('team'),
              telegram: doc.get('telegram'),
              role: doc.get('role'),
              authProvider: doc.get('authProvider')
              
            }
            return data
          })
          return users as User []
        } catch (error: any) {
            console.log(error)
        }
    }

    async createUser (data: CreateUserFormDataType, user: FirebaseUser | undefined | null) {
        try {
            const idToken = await user?.getIdToken()
            
            // Create a cookie with the session token to pass to middleware
            document.cookie = `session=${idToken}; path=/; max-age=3600; SameSite=Strict`;
            
            const response= await fetch(`${window.location.origin}/api/users`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${idToken}` 
                },
                body: JSON.stringify(data)  
              })
              
              if (response.status === 200) {
                toast.success('Successfully Created User')
                return true
              } else {
                const responseMessage = await response.json() as {response: string, error?: string}
                const errorMsg = responseMessage.error || responseMessage.response || 'Unknown error'
                toast.error('Error creating user: ' + errorMsg)
                return false
              }
        } catch (error: any) {
            console.log(error)
            toast.error('Error creating user: '+ error.message)
            return false
        }
    }
    async updateUser (userData: Partial<User>, user: FirebaseUser | undefined | null) {
      try {
        const idToken = await user?.getIdToken()
        
        // Create a cookie with the session token to pass to middleware
        document.cookie = `session=${idToken}; path=/; max-age=3600; SameSite=Strict`;
        
        const response= await fetch(`${window.location.origin}/api/users`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${idToken}` 
            },
            body: JSON.stringify(userData)  
          })
          
          if (response.status === 200) {
            toast.success('Successfully Modified User')
            return true
          } else {
            const responseMessage = await response.json() as {response: string, error?: string}
            const errorMsg = responseMessage.error || responseMessage.response || 'Unknown error'
            toast.error('Error modifying user: ' + errorMsg)
            return false
          }
      } catch (error: any) {
        console.log(error)
        toast.error('Error modifying user: '+ error.message)
        return false
      }
    }

    async deleteUser (uid: string, user:FirebaseUser | undefined | null) {
      try {
        const idToken = await user?.getIdToken()
        
        // Create a cookie with the session token to pass to middleware
        document.cookie = `session=${idToken}; path=/; max-age=3600; SameSite=Strict`;
        
        const response = await fetch(`${window.location.origin}/api/users`,{
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
          },
          body: JSON.stringify({uid})
        })
        
        if (response.status === 200) {
          toast.success('Successfully Deleted User')
          return true
        } else {
          const responseMessage = await response.json() as {response: string, error?: string}
          const errorMsg = responseMessage.error || responseMessage.response || 'Unknown error'
          toast.error('Error deleting user: ' + errorMsg)
          return false
        }
      } catch (error: any) {
        console.log(error)
        toast.error('Error deleting user: ' + error.message)
        return false
      }
    }
}()