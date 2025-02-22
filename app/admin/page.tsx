"use client";
import React from "react";
import Link from "next/link";

const AdminDashboard = () => {
  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 mt-5">
        <Link href="/admin/meals">
          <div className="border p-4 text-center cursor-pointer">Manage Meals</div>
        </Link>
        <Link href="/admin/orders">
          <div className="border p-4 text-center cursor-pointer">{"Today's"} Orders</div>
        </Link>
        
      </div>
    </div>
  );
};

export default AdminDashboard;
