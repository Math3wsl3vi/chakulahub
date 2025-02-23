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

  useEffect(() => {
    const ordersRef = collection(db, "orders");

    const unsubscribe = onSnapshot(ordersRef, (snapshot) => {
      const updatedOrders: Order[] = snapshot.docs.map((doc) => {
        const data = doc.data() as Omit<Order, "id">;
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt || Timestamp.now(), // Ensure it exists
        };
      });
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

  return (
    <div className="p-6 overflow-x-auto">
      <h1 className="text-2xl font-bold mb-4">Orders Dashboard</h1>
      <table className="w-full border-collapse border border-gray-300 min-w-max">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Meal</th>
            <th className="border p-2">User Name</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Booked Time</th> {/* New Column */}
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
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
    </div>
  );
};

export default AdminOrders;
