"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/store/cartStore";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const CheckoutPage = () => {
  const { cart, clearCart } = useCartStore();
  const { toast } = useToast();
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");

  const handlePayment = async () => {
    const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    if (!phoneNumber) {
      toast({ description: "Please enter a valid phone number." });
      return;
    }

    try {
      const response = await fetch("/api/mpesa/stkpush", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneNumber, amount: totalAmount }),
      });

      if (response.ok) {
        toast({ description: "Payment successful! Order placed." });
        clearCart();
        router.push("/");
      } else {
        toast({ description: "Payment failed. Try again." });
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({ description: "Something went wrong. Try again." });
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">Checkout</h1>

      <input
        type="text"
        placeholder="Enter phone number"
        className="w-full p-2 border rounded"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />

      <p className="mt-4 font-bold">
        Total: Ksh {cart.reduce((acc, item) => acc + item.price * item.quantity, 0)}
      </p>

      <button className="mt-4 bg-orange-500 text-white p-2 w-full rounded" onClick={handlePayment}>
        Pay Now
      </button>
    </div>
  );
};

export default CheckoutPage;
