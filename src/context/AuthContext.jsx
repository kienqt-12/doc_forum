import { createContext, useContext, useEffect, useState } from 'react';
import { auth, provider } from '../firebase';
import { signInWithPopup, signOut as firebaseLogout, onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const login = async () => {
    if (isSigningIn) return;
    setIsSigningIn(true);

    try {
      const res = await signInWithPopup(auth, provider);
      const user = res.user;

      const userData = {
        name: user.displayName,
        email: user.email,
        avatar: user.photoURL,
      };

      // ✅ Gửi lên backend để tạo / tìm user
      const response = await fetch('http://localhost:8017/v1/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      if (!response.ok) throw new Error('Backend error');

      const result = await response.json();
      setUser(result.user); // ✅ Dùng user từ backend (có _id)

      console.log('✅ Logged in user:', result.user);
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

  // ✅ Sync lại user khi reload trang (nếu còn session Firebase)
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
