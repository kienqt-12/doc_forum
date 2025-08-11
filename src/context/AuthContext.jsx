  import { createContext, useContext, useEffect, useState } from 'react';
  import { auth, provider } from '../firebase';
  import {
    signInWithPopup,
    signOut as firebaseLogout,
    onAuthStateChanged
  } from 'firebase/auth';

  const AuthContext = createContext();

  export function AuthProvider({ children }) {
    const [firebaseUser, setFirebaseUser] = useState(null);   // ✅ Firebase user
    const [backendUser, setBackendUser] = useState(null);     // ✅ Backend user
    const [isSigningIn, setIsSigningIn] = useState(false);

    const syncWithBackend = async (firebaseUserRaw) => {
      try {
        const token = await firebaseUserRaw.getIdToken();
        localStorage.setItem('accessToken', token); // optional

        const res = await fetch('http://localhost:8017/v1/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            name: firebaseUserRaw.displayName,
            email: firebaseUserRaw.email,
            avatar: firebaseUserRaw.photoURL
          })
        });

        if (!res.ok) throw new Error('❌ Backend sync failed');

        const data = await res.json();
        setBackendUser(data.user);
        setFirebaseUser(firebaseUserRaw); // <-- raw Firebase user!
      } catch (err) {
        console.error('❌ Error syncing user:', err);
        setBackendUser(null);
        setFirebaseUser(null);
      }
    };


    const login = async () => {
      if (isSigningIn) return;
      setIsSigningIn(true);

      try {
        const result = await signInWithPopup(auth, provider);
        await syncWithBackend(result.user);
      } catch (error) {
        console.error('❌ Login error:', error);
      } finally {
        setIsSigningIn(false);
      }
    };

    const logout = async () => {
      await firebaseLogout(auth);
      setBackendUser(null);
      setFirebaseUser(null);
      localStorage.removeItem('accessToken');
    };

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user && !isSigningIn) {
          syncWithBackend(user);
        } else {
          setBackendUser(null);
          setFirebaseUser(null);
          localStorage.removeItem('accessToken');
        }
      });

      return () => unsubscribe();
    }, [isSigningIn]);

    return (
      <AuthContext.Provider value={{ user: backendUser, firebaseUser, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
  }

  export const useAuth = () => useContext(AuthContext);
