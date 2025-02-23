"use client";

import React, { useState} from "react";
import { useCartStore } from "@/lib/store/cartStore";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

const CartPage = () => {
  const { cart, removeFromCart,updateQuantity } = useCartStore();
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [polling, setPolling] = useState(false);
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const startPolling = (checkoutRequestID: string) => {
    if (polling) return; 
    setPolling(true);
  
    const interval = setInterval(async () => {
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
          toast({ description: "Payment confirmed! You can now download your receipt." });
        } else if (data.status === "FAILED") {
          clearInterval(interval);
          setPolling(false);
          setIsPaymentSuccessful(false);
          toast({ description: "Payment failed. Please try again." });
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    }, 5000);
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
      <h1 className="text-2xl font-bold">Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
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
