import { createContext, useContext, useEffect, useState } from 'react';
import { auth, provider } from '../firebase';
import { signInWithPopup, signOut as firebaseLogout, onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isSigningIn, setIsSigningIn] = useState(false); // ✅ kiểm soát popup

  const login = async () => {
    if (isSigningIn) return; // ⛔ chặn gọi lại khi đang đăng nhập
    setIsSigningIn(true);
    try {
      const res = await signInWithPopup(auth, provider);
      const user = res.user;
      setUser({
        name: user.displayName,
        email: user.email,
        avatar: user.photoURL,
      });
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsSigningIn(false);
    }
  };

  const logout = async () => {
    await firebaseLogout(auth);
    setUser(null);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          name: user.displayName,
          email: user.email,
          avatar: user.photoURL,
        });
      } else {
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
