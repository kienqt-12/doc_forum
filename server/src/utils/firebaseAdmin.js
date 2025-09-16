import admin from 'firebase-admin'
import serviceAccount from '../../serviceAccountKey.json' // sửa đúng path

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  })
}

export default admin
