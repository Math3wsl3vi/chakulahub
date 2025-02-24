"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/configs/firebaseConfig";
import {
  collection,
  updateDoc,
  doc,
  Timestamp,
  onSnapshot,
} from "firebase/firestore";

type Order = {
  id: string;
  userEmail: string;
  UserId: string;
  mealName: string;
  price: number;
  status: "pending" | "completed";
  createdAt?: Timestamp;
};

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 15; // Set the number of orders per page

  useEffect(() => {
    const ordersRef = collection(db, "orders");

    const unsubscribe = onSnapshot(ordersRef, (snapshot) => {
      const updatedOrders: Order[] = snapshot.docs
        .map((doc) => {
          const data = doc.data() as Omit<Order, "id">;
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt || Timestamp.now(), // Ensure it exists
          };
        })
        .sort(
          (a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0)
        ); // Sort by createdAt DESC

      setOrders(updatedOrders);
    });

    return () => unsubscribe();
  }, []);

  const markAsCompleted = async (orderId: string) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: "completed" });

      // Update UI
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: "completed" } : order
        )
      );
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  // Pagination logic
  const visibleOrders = orders.slice(3); // Skip the first three orders
const totalPages = Math.ceil(visibleOrders.length / ordersPerPage);

const indexOfLastOrder = currentPage * ordersPerPage;
const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
const currentOrders = visibleOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  return (
    <div className="p-6 overflow-x-auto">
      <h1 className="text-2xl font-bold mb-4">Orders Dashboard</h1>
      <table className="w-full border-collapse border border-gray-300 min-w-max">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Meal</th>
            <th className="border p-2">User Name</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Booked Time</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.map((order) => (
            <tr key={order.id} className="border">
              <td className="border p-2">{order.mealName}</td>
              <td className="border p-2">{order.userEmail}</td>
              <td className="border p-2">Ksh {order.price}</td>
              <td className="border p-2">
                {order.createdAt
                  ? new Date(order.createdAt.toDate()).toLocaleString()
                  : "N/A"}
              </td>
              <td className="border p-2">{order.status}</td>
              <td className="border p-2">
                {order.status === "pending" && (
                  <button
                    className="bg-green-500 text-white px-4 py-1 rounded"
                    onClick={() => markAsCompleted(order.id)}
                  >
                    Mark as Completed
                  </button>
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
