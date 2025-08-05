import admin from 'firebase-admin'
import serviceAccount from './serviceAcount.json' // đường dẫn đến file bạn vừa tải

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'doc-forum.firebasestorage.app' // ✅ Bổ sung dòng này
  })
}

const bucket = admin.storage().bucket() // Dùng để upload ảnh

export { admin, bucket }