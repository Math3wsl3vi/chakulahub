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
import JsBarcode from "jsbarcode";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

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
  
    const orderID = `ORD-${Date.now()}`;
    const storage = getStorage(); // Get Firebase Storage instance
    const storageRef = ref(storage, `receipts/${orderID}.pdf`); // Storage path
  
    // 1️⃣ Generate Receipt PDF
    const doc = new jsPDF();
    const date = new Date().toLocaleString();
    
    const canvas = document.createElement("canvas");
    JsBarcode(canvas, orderID, { format: "CODE128" });
    
    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("ChakulaHub Receipt", 105, 20, { align: "center" });

    // Line separator
    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25);

    // Section: Order Details (Encased in a box)
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.rect(18, 30, 174, 40); // Draw box

    doc.text(`Date:`, 22, 40);
    doc.setFont("helvetica", "normal");
    doc.text(`${date}`, 50, 40);

    doc.setFont("helvetica", "bold");
    doc.text(`Order ID:`, 22, 50);
    doc.setFont("helvetica", "normal");
    doc.text(`${orderID}`, 50, 50);

    doc.setFont("helvetica", "bold");
    doc.text(`Phone Number:`, 22, 60);
    doc.setFont("helvetica", "normal");
    doc.text(`${phoneNumber}`, 60, 60);

    // Section: Meal Details
    doc.setFont("helvetica", "bold");
    doc.text("Meal Details:", 22, 80);
    doc.setFont("helvetica", "normal");
    
    cart.forEach((item, index) => {
        const yOffset = 90 + index * 10;
        doc.text(`${index + 1}. ${item.name} x${item.quantity} - Ksh ${item.price * item.quantity}`, 22, yOffset);
    });
    
    // Highlight Total Price
    doc.setFont("helvetica", "bold");
    doc.text(`Total Price: Ksh ${totalAmount}`, 22, 90 + cart.length * 10);
    doc.setLineWidth(0.3);
    doc.line(20, 95 + cart.length * 10, 190, 95 + cart.length * 10);

    // Centered Barcode
    const barcodeData = canvas.toDataURL("image/png");
    doc.addImage(barcodeData, "PNG", 55, 100 + cart.length * 10, 100, 30); // Adjust position & size

    // Footer
    doc.setFont("helvetica", "italic");
    doc.setFontSize(12);
    doc.text("Thank you for choosing ChakulaHub!", 105, 140 + cart.length * 10, { align: "center" });
  
    // 2️⃣ Convert PDF to Blob for Upload
    const pdfBlob = new Blob([doc.output("blob")], { type: "application/pdf" });
  
    try {
      // 3️⃣ Upload PDF to Firebase Storage
      await uploadBytes(storageRef, pdfBlob);
      const receiptUrl = await getDownloadURL(storageRef); // Get the file URL
  
      // 4️⃣ Save Order Data to Firestore with Receipt URL
      const orderData = {
        userEmail: user?.email || "Unknown User",
        userId: user?.uid || "N/A",
        phoneNumber,
        totalAmount,
        status: "completed",
        createdAt: serverTimestamp(),
        orderID,
        receiptUrl, // ✅ Store actual receipt URL
        items: cart.map((item) => ({
          mealId: item.id,
          mealName: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      };
  
      await addDoc(collection(db, "orders"), orderData);
      toast({ description: "Order and receipt saved successfully!" });
  
      setTimeout(() => {
        setIsPaymentSuccessful(false);
        clearCart();
      }, 20000);
    } catch (error) {
      console.error("❌ Error saving order or receipt:", error);
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
    if (cart.length === 0) return;

    const doc = new jsPDF();
    const date = new Date().toLocaleString();
    const orderID = `ORD-${Date.now()}`; // Unique Order ID

    // Generate barcode as Base64 image
    const canvas = document.createElement("canvas");
    JsBarcode(canvas, orderID, { format: "CODE128" });

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("ChakulaHub Receipt", 105, 20, { align: "center" });

    // Line separator
    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25);

    // Section: Order Details (Encased in a box)
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.rect(18, 30, 174, 40); // Draw box

    doc.text(`Date:`, 22, 40);
    doc.setFont("helvetica", "normal");
    doc.text(`${date}`, 50, 40);

    doc.setFont("helvetica", "bold");
    doc.text(`Order ID:`, 22, 50);
    doc.setFont("helvetica", "normal");
    doc.text(`${orderID}`, 50, 50);

    doc.setFont("helvetica", "bold");
    doc.text(`Phone Number:`, 22, 60);
    doc.setFont("helvetica", "normal");
    doc.text(`${phoneNumber}`, 60, 60);

    // Section: Meal Details
    doc.setFont("helvetica", "bold");
    doc.text("Meal Details:", 22, 80);
    doc.setFont("helvetica", "normal");
    
    cart.forEach((item, index) => {
        const yOffset = 90 + index * 10;
        doc.text(`${index + 1}. ${item.name} x${item.quantity} - Ksh ${item.price * item.quantity}`, 22, yOffset);
    });
    
    // Highlight Total Price
    doc.setFont("helvetica", "bold");
    doc.text(`Total Price: Ksh ${totalAmount}`, 22, 90 + cart.length * 10);
    doc.setLineWidth(0.3);
    doc.line(20, 95 + cart.length * 10, 190, 95 + cart.length * 10);

    // Centered Barcode
    const barcodeData = canvas.toDataURL("image/png");
    doc.addImage(barcodeData, "PNG", 55, 100 + cart.length * 10, 100, 30); // Adjust position & size

    // Footer
    doc.setFont("helvetica", "italic");
    doc.setFontSize(12);
    doc.text("Thank you for choosing ChakulaHub!", 105, 140 + cart.length * 10, { align: "center" });

    // Save PDF
    doc.save(`Receipt_${orderID}.pdf`);
};


  return (
    <div className="p-5">
      {cart.length === 0 ? (
        <div>
          <p className="text-2xl text-center">No items in your cart</p>
         <div className="flex justify-center items-center">
         <Image src={'/images/emptyCart.png'} alt="cart" width={500} height={500} className=""/>
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
          <button onClick={handlePayment} className="bg-orange-1 text-white p-2 w-full mt-4" disabled={polling}>
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
