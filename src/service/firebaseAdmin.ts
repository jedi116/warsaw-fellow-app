import admin from 'firebase-admin'

try {
  const jsonServiceAccount = JSON.parse(process.env.NEXT_PUBLIC_VITE_FIREBASE_SERVICE_ACCOUNT as string)
  admin.initializeApp({
    credential: admin.credential.cert(jsonServiceAccount),
  })
  console.log('Initialized.')
} catch (error: any) {
  /*
   * We skip the "already exists" message which is
   * not an actual error when we're hot-reloading.
   */
  if (!/already exists/u.test(error.message)) {
    console.error('Firebase admin initialization error', error.stack)
  }
}

export default admin