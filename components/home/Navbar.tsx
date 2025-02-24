"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth, db } from "@/configs/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useCartStore } from "@/lib/store/cartStore"; // Import cart store

const Navbar = () => {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Get cart items from Zustand store
  const { cart } = useCartStore();

  useEffect(() => {
    const checkAdmin = async (userId: string) => {
      try {
        console.log("Checking admin status for:", userId);
        const adminRef = doc(db, "admins", userId);
        const adminSnap = await getDoc(adminRef);

        if (adminSnap.exists()) {
          setIsAdmin(true);
          console.log("✅ User is an admin");
        } else {
          console.log("❌ User is NOT an admin");
        }
      } catch (error) {
        console.error("⚠️ Error checking admin status:", error);
      } finally {
        setLoading(false);
      }
    };

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
    router.push("/login");
    setSidebarOpen(false)
  };
  const cartItemCount = cart.length
  return (
    <>
      {/* Navbar */}
      <div className="w-full flex flex-row items-center justify-between px-5 py-4 border-b-2 shadow-sm">
        <Link href={"/"} className="cursor-pointer">
          <Image src="/images/logo.png" alt="logo" width={40} height={40} />
        </Link>
        <h1 className="text-xl uppercase font-poppins font-semibold">ChakulaHub</h1>

        <div className="flex gap-5 items-center">
          {/* Cart Icon with Orange Dot */}
          <Link href={'/cart'} className="relative">
              <Image src="/images/cart.png" alt="cart" width={25} height={25} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-1 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {cartItemCount}
                </span>
              )}
            </Link>

          {/* Sidebar Menu Icon */}
          <Image
            src="/images/menu.png"
            alt="menu"
            width={25}
            height={25}
            className="cursor-pointer"
            onClick={() => setSidebarOpen(true)}
          />
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 w-full h-full bg-white shadow-lg transform z-50 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-gray-700 text-lg"
          onClick={() => setSidebarOpen(false)}
        >
          ✖
        </button>

        {/* Sidebar Links */}
        <div className="flex flex-col mt-10 px-6">
          <Link href="/" className="py-2 text-lg border-b" onClick={() => setSidebarOpen(false)}>
            Home
          </Link>
          <Link href="/profile" className="py-2 text-lg border-b" onClick={() => setSidebarOpen(false)}>
            Profile
          </Link>
          {!loading && isAdmin && (
            <Link href="/admin" className="py-2 text-lg border-b" onClick={() => setSidebarOpen(false)}>
              Admin Dashboard
            </Link>
          )}
          <button className="mt-4 w-full text-center bg-orange-1 text-white py-2 rounded" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
