import admin from "./firebaseAdmin"
import { RegistrationData } from "@/interface/auth"
import { User } from "@/interface/user"
export default new class UserManagment {
    auth = admin.auth()
    firestore = admin.firestore()
    async createUser (userData: RegistrationData) {
        try {
            const user = await this.auth.createUser({
                email: userData.email,
                password: userData.password
            })
            const profileData: Partial<RegistrationData> = userData
            delete profileData.password
            const doc = this.firestore.collection('users').doc(user.uid)
            await doc.create({
                uid: user.uid,
                ...profileData,
                authProvider: 'local',
                role: 'user'
            })         
        } catch (error: any) {
            throw error
        }
    }

    async isTokenValid(token: string) {
        try {
            const data = await this.auth.verifyIdToken(token)
            if (data.email) {
                return true
            }
            return false
        } catch (error: any) {
            console.log(new Date() ,'error inside UserManagment.isTokenValid',error.message)
            return false
        }
    }

    async  getUsers (): Promise<User[] | undefined> {
        try {
            const collection = this.firestore.collection('users')
            const docs = await collection.get()
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
                return data as User
              })
            return users
        } catch (error: any) {
            console.log(error)
        }
    }

    async updateUser (data: Partial<User>): Promise<string | void> {
        try {
            const doc =  this.firestore.collection('users').doc(data.uid as string)
            await doc.update({
                ...data
            })
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async deleteUser (uid: string): Promise<void> {
        try {
            const doc =  this.firestore.collection('users').doc(uid)
            await this.auth.deleteUser(uid)
            await doc.delete()
        } catch (error) {
            console.log(error)
            throw error
        }
    }
}()