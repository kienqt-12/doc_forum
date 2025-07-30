import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // ✅ THÊM DÒNG NÀY

const firebaseConfig = {
  apiKey: "AIzaSyC8r6_Woe2Od0EB8VUFY9Y1kxIdpqb3JQk",
  authDomain: "doc-forum.firebaseapp.com",
  projectId: "doc-forum",
  storageBucket: "doc-forum.appspot.com", // ✅ SỬA đuôi thành `appspot.com`
  messagingSenderId: "311199372831",
  appId: "1:311199372831:web:04cb860940ff73c144672a",
  measurementId: "G-1X3ZHTEJP2"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // ✅ THÊM DÒNG NÀY
export const provider = new GoogleAuthProvider();
export { signInWithPopup, signOut };
