import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  EmailAuthCredential,
} from 'firebase/auth'
import { getFirestore, query, getDocs, collection, where, addDoc, doc, setDoc } from 'firebase/firestore'
import { toast } from 'react-toastify'
import { parseString } from '../../utils'
import { getDatabase } from 'firebase/database'
import { getStorage } from 'firebase/storage'
import { RegistrationData } from '@/interface/auth'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: parseString(process.env.NEXT_PUBLIC_VITE_API_KEY, ''),
  authDomain: parseString(process.env.NEXT_PUBLIC_VITE_AUTH_DOMAIN, ''),
  projectId: parseString(process.env.NEXT_PUBLIC_VITE_PROJECTID, ''),
  storageBucket: parseString(process.env.NEXT_PUBLIC_VITE_STORAGE_BUCKET, ''),
  messagingSenderId: parseString(process.env.NEXT_PUBLIC_VITE_MESSAGINGSENDERID, ''),
  appId: parseString(process.env.NEXT_PUBLIC_VITE_APP_ID, ''),
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
// const analytics = getAnalytics(app)
const firebaseRealTimeDB = getDatabase(app)

const googleProvider = new GoogleAuthProvider()
const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider)
    const user = res.user
    const q = query(collection(db, 'users'), where('uid', '==', user.uid))
    const docs = await getDocs(q)
    if (docs.docs.length === 0) {
      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        name: user.displayName,
        authProvider: 'google',
        email: user.email,
      })
    }
  } catch (err: any) {
    console.error(err)
    toast.error(err.message)
  }
}

const logInWithEmailAndPassword = async (email: string, password: string) => {
  try {
    await signInWithEmailAndPassword(auth, email, password)
    return true
  } catch (err: any) {
    console.error(err)
    toast.error(err.message)
    return false
  }
}

const registerWithEmailAndPassword = async (data: RegistrationData) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, data.email, data.password)
    const user = res.user
    const dataForSaving: Partial<RegistrationData> = data 
    delete dataForSaving.password
    const docRef = doc(db,'users', user.uid)
    await setDoc(docRef,{
      uid: user.uid,
      authProvider: 'local',
      role: 'user',
      ...dataForSaving
    })
    toast.success('Registered successfully')
  } catch (err: any) {
    toast.error(err.message)
  }
}

const sendPasswordReset = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email)
    toast.success('Password reset link sent!')
  } catch (err: any) {
    toast.error(err.message.split('/')[1].split(')')[0])
  }
}

const logout = () => {
  signOut(auth)
}

const fireBaseStorage = getStorage(app)

const imageStoragePath = '/image/'

export {
  fireBaseStorage,
  imageStoragePath,
  auth,
  db,
  firebaseRealTimeDB,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
}
