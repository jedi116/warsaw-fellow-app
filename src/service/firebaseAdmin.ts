import admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';

try {
  const jsonServiceAccount = process.env.NEXT_PUBLIC_VITE_FIREBASE_SERVICE_ACCOUNT ? 
    JSON.parse(process.env.NEXT_PUBLIC_VITE_FIREBASE_SERVICE_ACCOUNT) : undefined;
  
  if (jsonServiceAccount && getApps().length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(jsonServiceAccount),
    });
    console.log('Firebase Admin initialized.');
  }
} catch (error: any) {
  /*
   * We skip the "already exists" message which is
   * not an actual error when we're hot-reloading.
   */
  if (!/already exists/u.test(error.message)) {
    console.error('Firebase admin initialization error', error.stack);
  }
}

export function verifyIdToken(token: string) {
  return admin.auth().verifyIdToken(token);
}

export default admin;