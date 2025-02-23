"use client";
import React, { useEffect, useState } from "react";
import { auth } from "@/configs/firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";
import OrdersPage from "../orders/page";

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      {user ? (
        <div className="flex flex-col gap-2">
        <div className="border p-3 rounded-full shadow text-center">
          <p><strong>Email:</strong> {user.email}</p>
        </div>
        <div>
          </div>
       <div className="border rounded-md p-2">
        <OrdersPage/>
       </div>
      </div>
      ) : (
        <p className="text-red-500">No user is logged in.</p>
      )}
    </div>
  );
};
export default ProfilePage;
