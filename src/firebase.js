// firebase.js
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  GoogleAuthProvider
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC8r6_Woe2Od0EB8VUFY9Y1kxIdpqb3JQk",
  authDomain: "doc-forum.firebaseapp.com",
  projectId: "doc-forum",
  storageBucket: "doc-forum.firebasestorage.app",
  messagingSenderId: "311199372831",
  appId: "1:311199372831:web:04cb860940ff73c144672a",
  measurementId: "G-1X3ZHTEJP2"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

// ✅ Giữ đăng nhập sau reload
setPersistence(auth, browserLocalPersistence).catch(console.error);

const provider = new GoogleAuthProvider();

export { auth, provider };
