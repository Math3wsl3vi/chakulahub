"use client";

import React, { useState, useEffect } from "react";
import { db, auth } from "@/configs/firebaseConfig";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

interface OrderItem {
  mealName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  userEmail: string;
  totalAmount: number;
  items: OrderItem[];
  timestamp?: { seconds: number; nanoseconds: number };
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log("Fetching orders for:", user.email);

        const ordersRef = collection(db, "orders");
        const q = query(
          ordersRef,
          where("userEmail", "==", user.email),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          console.log("No orders found.");
        } else {
          console.log("Orders retrieved:", snapshot.docs.length);
        }

        const ordersData: Order[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          console.log("Order data:", JSON.stringify(data, null, 2));

          // Ensure `items` is always an array
          const items: OrderItem[] = Array.isArray(data.items)
            ? data.items
            : data.mealName
            ? [{ mealName: data.mealName, quantity: 1, price: data.price || 0 }]
            : [];

          return {
            id: doc.id,
            userEmail: data.userEmail || "Unknown",
            totalAmount: data.totalAmount || data.price || 0, // Fallback to `price`
            items,
            timestamp: data.createdAt || null,
          };
        });

        setOrders(ordersData);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  return (
    <div className="p-5">
      <h1 className="text-2xl text-center text-orange-500">Your Orders</h1>
      {loading ? (
        <p className="text-center mt-5">Loading orders...</p>
      ) : error ? (
        <p className="text-center mt-5 text-red-500">{error}</p>
      ) : orders.length === 0 ? (
        <p className="text-center mt-5">No orders found.</p>
      ) : (
        <div className="mt-5">
          {orders.map((order) => (
            <div key={order.id} className="border p-4 mb-4 rounded-lg shadow">
              <h3 className="font-bold">Order ID: {order.id}</h3>
              <p className="text-gray-600">Email: {order.userEmail}</p>
              <p className="font-bold text-orange-500">
                Total: Ksh {order.totalAmount}
              </p>
              <p className="text-gray-500">
                Date:{" "}
                {order.timestamp
                  ? new Date(order.timestamp.seconds * 1000).toLocaleString()
                  : "N/A"}
              </p>

              {order.items.length > 0 ? (
                <>
                  <h4 className="font-semibold mt-3">Items:</h4>
                  <ul className="list-disc pl-5">
                    {order.items.map((item, index) => (
                      <li key={index} className="text-gray-700">
                        {item.mealName} x{item.quantity} - Ksh{" "}
                        {item.price * item.quantity}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="text-gray-500 mt-2">No items found in this order.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
