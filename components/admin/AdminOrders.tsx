"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/configs/firebaseConfig";
import {
  collection,
  Timestamp,
  onSnapshot,
} from "firebase/firestore";
import { Button } from "../ui/button";

type Order = {
  id: string;
  userEmail: string;
  UserId: string;
  mealName: string;
  price: number;
  status: "pending" | "completed";
  createdAt?: Timestamp;
  receiptUrl?: string;
  quantity: number;
};

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 15; 

  useEffect(() => {
    const ordersRef = collection(db, "orders");
  
    const unsubscribe = onSnapshot(ordersRef, (snapshot) => {
      const updatedOrders: Order[] = snapshot.docs
        .map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            userEmail: data.userEmail,
            UserId: data.userId,
            status: data.status,
            quantity: data.items?.[0]?.quantity || 0,
            createdAt: data.createdAt || Timestamp.now(),
            receiptUrl: data.receiptUrl || "",
            mealName: data.items?.[0]?.mealName || "N/A", // ✅ Extract meal name
            price: data.items?.[0]?.price || 0, // ✅ Extract price
          };
        })
        .sort(
          (a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0)
        );
  
      setOrders(updatedOrders);
    });
  
    return () => unsubscribe();
  }, []);

// Function to download report as CSV
const downloadReport = () => {
  // Apply the same slice logic as used for display
  const reportOrders = orders.slice(3);
  
  // Prepare CSV headers
  const headers = [
    "Meal Name",
    "Quantity",
    "User Email",
    "Price",
    "Booked Time",
    "Status",
    "Receipt URL"
  ].join(",");
  
  // Prepare CSV rows
  const rows = reportOrders.map(order => {
    return [
      `"${order.mealName}"`,
      order.quantity,
      `"${order.userEmail}"`,
      `Ksh ${order.price}`,
      `"${order.createdAt ? new Date(order.createdAt.toDate()).toLocaleString() : "N/A"}"`,
      order.status,
      `"${order.receiptUrl || "N/A"}"`
    ].join(",");
  });
  
  // Combine headers and rows
  const csvContent = [headers, ...rows].join("\n");
  
  // Create download link
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `orders_report_${new Date().toISOString().slice(0, 10)}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
  

  // Pagination logic
  const visibleOrders = orders.slice(3); 
const totalPages = Math.ceil(visibleOrders.length / ordersPerPage);

const indexOfLastOrder = currentPage * ordersPerPage;
const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
const currentOrders = visibleOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  return (
    <div className="p-6 overflow-x-auto font-bab">
      <div className="flex justify-between mb-10">
        <h1 className="text-2xl font-bold mb-4">Orders Dashboard</h1>
      <Button onClick={downloadReport}>Download Receipt</Button>
      </div>
      <table className="w-full border-collapse border border-gray-300 min-w-max">
      <thead>
  <tr className="bg-gray-100">
    <th className="border p-2">Meal</th>
    <th className="border p-2">Quantity</th>
    <th className="border p-2">User Name</th>
    <th className="border p-2">Price</th>
    <th className="border p-2">Booked Time</th>
    <th className="border p-2">Status</th>
    <th className="border p-2">Receipt</th>
  </tr>
</thead>
<tbody>
  {currentOrders.map((order) => (
    <tr key={order.id} className="border">
      <td className="border p-2">{order.mealName}</td>
      <td className="border p-2">{order.quantity}</td>
      <td className="border p-2">{order.userEmail}</td>
      <td className="border p-2">Ksh {order.price}</td>
      <td className="border p-2">
        {order.createdAt
          ? new Date(order.createdAt.toDate()).toLocaleString()
          : "N/A"}
      </td>
      <td className="border p-2">{order.status}</td>
      <td className="border p-2">
        {order.receiptUrl ? (
          <a href={order.receiptUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">
            Download
          </a>
        ) : (
          "N/A"
        )}
      </td>
    </tr>
  ))}
</tbody>


      </table>

      {/* Pagination controls */}
      <div className="flex justify-center mt-4">
        <button
          className="mx-1 px-4 py-2 bg-gray-200 rounded"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="px-4 py-2">{currentPage} of {totalPages}</span>
        <button
          className="mx-1 px-4 py-2 bg-gray-200 rounded"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminOrders;
