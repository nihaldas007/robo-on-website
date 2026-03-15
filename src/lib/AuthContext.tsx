"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

interface AuthContextType {
  user: User | null;
  userData: any | null;
  role: 'admin' | 'moderator' | 'student' | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  role: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [role, setRole] = useState<'admin' | 'moderator' | 'student' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      const ADMIN_EMAILS = ["admin@roboonbd.com", "roboonbd@gmail.com"];
      
      if (currentUser && !currentUser.emailVerified && !ADMIN_EMAILS.includes(currentUser.email || "")) {
        setUser(null);
        setUserData(null);
        setRole(null);
        setLoading(false);
      } else {
        setUser(currentUser);
        if (currentUser) {
          // Listen for real-time updates to user data
          import("./firebase").then(({ db }) => {
            import("firebase/firestore").then(({ doc, onSnapshot }) => {
              const userDocRef = doc(db, "users", currentUser.uid);
              const unsubDoc = onSnapshot(userDocRef, (docSnap) => {
                if (docSnap.exists()) {
                  const data = docSnap.data();
                  setUserData(data);
                  setRole(data.role || 'student');
                } else if (ADMIN_EMAILS.includes(currentUser.email || "")) {
                  setRole('admin');
                } else {
                  setRole('student');
                }
                setLoading(false);
              }, (err) => {
                console.error("Error fetching real-time user role:", err);
                setRole('student');
                setLoading(false);
              });

              // Since we're inside a callback, we can't return the cleanup directly
              // but we can store it or handle it. For now, onSnapshot stays active
              // as long as the auth state is valid.
            });
          });
        } else {
          setUserData(null);
          setRole(null);
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
