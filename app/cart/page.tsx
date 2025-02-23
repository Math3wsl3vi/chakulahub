"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import { useCartStore } from "@/lib/store/cartStore";

const CartPage = () => {
  const { cart, clearCart, getTotalPrice } = useCartStore();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [checkoutId, setCheckoutId] = useState<string | null>(null);

  const { toast } = useToast();

  // Generate Receipt PDF
  const downloadReceipt = useCallback(() => {
    const doc = new jsPDF();
    const date = new Date().toLocaleString();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Meal Receipt", 105, 20, { align: "center" });
    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Date: ${date}`, 20, 35);
    doc.text(`Phone Number: ${phoneNumber}`, 20, 45);

    let y = 55;
    cart.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.name} - ${item.quantity} x Ksh ${item.price} = Ksh ${item.quantity * item.price}`, 20, y);
      y += 10;
    });

    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    doc.text(`Total: Ksh ${totalAmount}`, 20, y + 10);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.text("Thank you for your order!", 105, y + 20, { align: "center" });

    doc.save(`Receipt_${Date.now()}.pdf`);
  }, [cart, phoneNumber]);

  // Poll for Payment Confirmation
  useEffect(() => {
    if (!checkoutId) return;
  
    console.log("Starting payment polling for checkoutId:", checkoutId);
  
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/mpesa/status?checkoutId=${checkoutId}`);
        const data = await response.json();
  
        console.log("Payment status response:", data);
  
        if (response.ok && data.status === "CONFIRMED") {
          console.log("Payment confirmed!");
          setPaymentConfirmed(true);
          toast({ description: "Payment received! Generating receipt..." });
          clearInterval(interval);
          setTimeout(() => downloadReceipt(), 2000);
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
      }
    }, 5000); // Poll every 5 seconds
  
    return () => clearInterval(interval);
  }, [checkoutId, toast, downloadReceipt]);

  // Handle Payment Request
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
      toast({ description: "Invalid phone number. Use format 07XXXXXXXX or 01XXXXXXXX." });
      return;
    }

    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    try {
      const response = await fetch("/api/mpesa/stkpush", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formattedPhone, amount: totalAmount }),
      });

      const data = await response.json();
      if (response.ok) {
        setCheckoutId(data.checkoutId); 
        toast({ description: "Payment initiated. Waiting for confirmation..." });
      } else {
        toast({ description: "Failed to initiate payment." });
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({ description: "Something went wrong. Please try again." });
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl text-center text-orange-500">Your Cart</h1>
      {cart.length === 0 ? (
        <p className="text-center mt-5">Your cart is empty.</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div key={item.id} className="border p-4 mt-2 rounded">
              <h3>{item.name} x{item.quantity}</h3>
              <p>Price: Ksh {item.price * item.quantity}</p>
            </div>
          ))}
          <p className="mt-2 font-bold text-orange-500">Total Price: Ksh {getTotalPrice()}</p>

          <button
            className="mt-2 w-full bg-gray-500 text-white p-2 rounded"
            onClick={() => {
              clearCart();
              toast({ description: "Cart cleared successfully." });
            }}
          >
            Clear Cart
          </button>
          <input
            type="text"
            placeholder="Enter phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="border p-2 w-full mt-2"
          />
          {!paymentConfirmed ? (
            <button className="mt-4 w-full bg-orange-500 text-white p-2 rounded" onClick={handlePayment}>
              Confirm & Pay
            </button>
          ) : (
            <button className="mt-4 w-full bg-green-500 text-white p-2 rounded" onClick={downloadReceipt}>
              Download Receipt
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CartPage;
