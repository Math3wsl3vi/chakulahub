"use client"
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/configs/firebaseConfig";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/configs/firebaseConfig";

type CustomUser = FirebaseUser & { isAdmin?: boolean }; // ✅ Extend Firebase User type

type AuthContextType = {
  user: CustomUser | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<CustomUser | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true); // Ensure loading is true at the start
  
      if (firebaseUser) {
        let isAdmin = false;
  
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            isAdmin = userDoc.data().isAdmin || false;
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
  
        setUser({ ...firebaseUser, isAdmin });
      } else {
        setUser(null);
      }
  
      setLoading(false); // Set loading false after state update
    });
  
    return () => unsubscribe();
  }, []);
  

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
