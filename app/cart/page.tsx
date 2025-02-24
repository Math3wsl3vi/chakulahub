"use client";

import React, { useState} from "react";
import { useCartStore } from "@/lib/store/cartStore";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import Image from "next/image";
// import { addDoc, collection, doc, getDocs, query, runTransaction, serverTimestamp, where } from "firebase/firestore";
import { db } from "@/configs/firebaseConfig";
import { useAuth } from "@/context/AuthContext";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const CartPage = () => {
  const { cart, removeFromCart,updateQuantity, clearCart } = useCartStore();
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [polling, setPolling] = useState(false);
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);
const { user } = useAuth()
  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const startPolling = (checkoutRequestID: string) => {
    if (polling) return;
    setPolling(true);
  
    let retries = 0;
    const maxRetries = 10;
    let orderSaved = false; // ✅ Prevent duplicate saves
  
    const interval = setInterval(async () => {
      if (retries >= maxRetries) {
        clearInterval(interval);
        setPolling(false);
        toast({ description: "Payment verification timed out. Try again." });
        return;
      }
  
      try {
        const response = await fetch("/api/mpesa/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ checkoutRequestID }),
        });
  
        const data = await response.json();
  
        if (data.status === "COMPLETED") {
          clearInterval(interval);
          setPolling(false);
          setIsPaymentSuccessful(true);
  
          // ✅ Ensure order is saved only once after payment confirmation
          if (!orderSaved) {
            orderSaved = true;
            await saveOrderToFirestore();
          }
        } else if (data.status === "FAILED") {
          clearInterval(interval);
          setPolling(false);
          setIsPaymentSuccessful(false);
          toast({ description: "Payment failed. Please try again." });
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
  
      retries++;
    }, 5000);
  };
  
  // 🔹 Function to save order after payment confirmation
  const saveOrderToFirestore = async () => {
    if (cart.length === 0) {
      toast({ description: "Cart is empty. Please try again." });
      return;
    }
  
    try {
      await Promise.all(
        cart.map(async (item) => {
          const orderRef = await addDoc(collection(db, "orders"), {
            userEmail: user?.email || "Unknown User",
            mealId: item.id,
            mealName: item.name,
            price: item.price * item.quantity,
            quantity: item.quantity,
            phoneNumber,
            status: "pending",
            createdAt: serverTimestamp(),
          });
  
          console.log(`✅ Order ${orderRef.id} placed for ${item.name}`);
        })
      );
  
      toast({ description: "Payment confirmed! Orders placed successfully." });
  
      setTimeout(() => {
        setIsPaymentSuccessful(false);
        clearCart();
      }, 20000);
    } catch (error) {
      console.error("❌ Error saving order:", error);
      toast({ description: "Failed to save order. Please contact support." });
    }
  };
  
  const handlePayment = async () => {
    if (!phoneNumber) {
      toast({ description: "Please enter your phone number." });
      return;
    }
    
    let formattedPhone = phoneNumber.trim();
    if (formattedPhone.startsWith("07") || formattedPhone.startsWith("01")) {
      formattedPhone = "254" + formattedPhone.slice(1);
    }
    if (!/^254(7|1)\d{8}$/.test(formattedPhone)) {
      toast({ description: "Invalid phone number format." });
      return;
    }
    
    try {
      const response = await fetch("/api/mpesa/stkpush", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formattedPhone, amount: totalAmount }),
      });
      
      const data = await response.json();
      if (response.ok) {
        toast({ description: "Payment initiated. Waiting for confirmation..." });
        startPolling(data.CheckoutRequestID);
      } else {
        toast({ description: "Failed to initiate payment." });
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({ description: "Something went wrong. Try again." });
    }
  };

  const downloadReceipt = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Cart Receipt", 105, 20, { align: "center" });
    doc.line(20, 25, 190, 25);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Date: ${new Date().toLocaleString()}`, 20, 35);

    cart.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.name} x${item.quantity} - Ksh ${item.price * item.quantity}`, 20, 45 + index * 10);
    });

    doc.text(`Total: Ksh ${totalAmount}`, 20, 45 + cart.length * 10);
    doc.text("Thank you for your purchase!", 105, 80, { align: "center" });
    doc.save(`Receipt_${Date.now()}.pdf`);
  };

  return (
    <div className="p-5">
      {cart.length === 0 ? (
        <div>
          <p className="text-2xl text-center">No items in your cart</p>
         <div className="flex justify-center items-center">
         <Image src={'/images/emptycart2.png'} alt="cart" width={500} height={500} className=""/>
         </div>
        </div>
      ) : (
        <div>
      <h1 className="text-2xl font-bold">Your Cart</h1>
          {cart.map((item) => (
            <div key={item.id} className="border p-4 mb-2 flex justify-between">
              <div>
                <h3>{item.name}</h3>
                <p>Ksh {item.price} x {item.quantity}</p>
              </div>
              <div className="flex items-center border p-1 rounded-md">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="px-2 py-1 text-lg"
                >
                  −
                </button>
                <span className="mx-3 text-lg">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="px-2 py-1 text-lg"
                >
                  +
                </button>
              </div>
              <button onClick={() => removeFromCart(item.id)} className="text-red-500">Remove</button>
            </div>
          ))}
          <p className="font-bold">Total: Ksh {totalAmount}</p>
          <input type="text" placeholder="Enter phone number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="border p-2 w-full mt-2" />
          <button onClick={handlePayment} className="bg-orange-500 text-white p-2 w-full mt-4" disabled={polling}>
            {polling ? "Processing..." : "Confirm & Pay"}
          </button>
          {isPaymentSuccessful && (
            <button onClick={downloadReceipt} className="bg-green-500 text-white p-2 w-full mt-4">
              Download Receipt
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CartPage;
