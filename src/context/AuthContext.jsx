import { createContext, useContext, useEffect, useState } from 'react';
import { auth, provider } from '../firebase';
import {
  signInWithPopup,
  signOut as firebaseLogout,
  onAuthStateChanged
} from 'firebase/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  // ✅ Gọi backend để tạo/lấy user từ Firebase user
  const syncWithBackend = async (firebaseUser) => {
    try {
      const token = await firebaseUser.getIdToken();

      const res = await fetch('http://localhost:8017/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          avatar: firebaseUser.photoURL
        })
      });

      if (!res.ok) throw new Error('❌ Backend sync failed');

      const data = await res.json();
      setUser(data.user);
      console.log('✅ Synced with backend:', data.user);
    } catch (err) {
      console.error('❌ Error syncing user:', err);
      setUser(null);
    }
  };

  const login = async () => {
    if (isSigningIn) return;
    setIsSigningIn(true);

    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      await syncWithBackend(firebaseUser);
    } catch (error) {
      console.error('❌ Login error:', error);
    } finally {
      setIsSigningIn(false);
    }
  };

  const logout = async () => {
    await firebaseLogout(auth);
    setUser(null);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser && !isSigningIn) {
        syncWithBackend(firebaseUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [isSigningIn]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
