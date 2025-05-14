import { collection, query, getDocs, where, doc, updateDoc } from "firebase/firestore"
import { db } from "./firebaseUiClient"
import { User, UserWithPic } from "@/interface/user"
import { toast } from "react-toastify"
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import {fireBaseStorage, imageStoragePath} from './firebaseUiClient'
export default new class Profile {
    getProfile = async (uid: string) => {
        try {
          const q = query(collection(db, 'users'), where('uid','==',uid))
          const docs = await getDocs(q)
          const userProfile = docs.docs.map((doc) => {
            const data = {
              uid: doc.get('uid'),
              email: doc.get('email'),
              firstName: doc.get('firstName'),
              lastName: doc.get('lastName'),
              phonenumber: doc.get('phonenumber'),
              birthday: doc.get('birthday'),
              team: doc.get('team'),
              telegram: doc.get('telegram'),
              role: doc.get('role') || 'member', // Default to member if role is not set
              authProvider: doc.get('authProvider')
              
            }
            return data as User
          })
            const profile = userProfile[0]
            const profilePicture = await this.getProfilePicture(profile.uid)
            if (profilePicture) {
                return {...profile, profilePicture} as UserWithPic
            }
            return profile
        } catch (error) {
            console.log(error)
            toast.error('error getting user account data')
        }
    }
    updateProfile = async (userData: Partial<User>) => {
        console.log(userData)
        try {    
            const q = query(collection(db, 'users'), where('uid', '==', userData.uid))
            const userDoc = await getDocs(q)
            const docRef = doc(db, 'users', userDoc.docs[0].id)
            await updateDoc(docRef, {
                ...userData
            })
            toast.success('Updated Profile Successfully')
        } catch (error) {
            console.log(error)
            toast.error('Error Updating Profile')
        }
    }

    getProfilePicture = async (uid: string): Promise<string| null> => {
        try {
            const profilePictureRef = ref(fireBaseStorage, `${imageStoragePath}${uid}`)
            const profilePicture = await getDownloadURL(profilePictureRef)
            return profilePicture
        } catch (error: any) {
            // Do not log common errors for missing pictures
            // This prevents console log pollution
            return null
        }
    }
    updateProfilePicture = async (profilePicture: any, uid: string, deletePic: boolean) => {
        try {

            const PPRef = ref(fireBaseStorage, `${imageStoragePath}${uid}`)
            if (!deletePic) {
                await uploadBytes(PPRef, profilePicture)
            }  else {
                await deleteObject(PPRef)
            }
        } catch (error) {
            console.log(error)
        }
            
    }
}()