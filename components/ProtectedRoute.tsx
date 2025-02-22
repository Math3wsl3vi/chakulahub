"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth(); // ✅ Now loading is correctly defined
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>; // Prevent flickering
  if (!user) return null; // Prevents UI from rendering before redirect

  return <>{children}</>;
}
