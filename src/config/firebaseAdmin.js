import admin from 'firebase-admin'
import serviceAccount from './serviceAcount.json' // đường dẫn đến file bạn vừa tải

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  })
}

export default admin
