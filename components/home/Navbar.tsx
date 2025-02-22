"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth, db } from "@/configs/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const Navbar = () => {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async (userId: string) => {
      try {
        const adminRef = doc(db, "admins", userId);
        const adminSnap = await getDoc(adminRef);
        if (adminSnap.exists()) {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
      } finally {
        setLoading(false);
      }
    };

    // Ensure we track authentication changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        checkAdmin(user.uid);
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    auth.signOut();
    localStorage.removeItem("user");
    router.push("/login"); // Redirect to login page
  };

  return (
    <div className="w-full flex flex-row items-center justify-between px-5 py-4 border-b-2 shadow-sm">
      <Link href={"/"} className="cursor-pointer">
        <Image src="/images/logo.png" alt="logo" width={40} height={40} />
      </Link>
      <h1 className="text-xl uppercase font-poppins font-semibold">Chakula Hub</h1>
      <div className="flex gap-2">
        {!loading && isAdmin && (
          <Button className="bg-orange-1" onClick={() => router.push("/admin")}>
            Admin
          </Button>
        )}
        <Button className="bg-orange-1" onClick={handleLogout}>
          Log out
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
