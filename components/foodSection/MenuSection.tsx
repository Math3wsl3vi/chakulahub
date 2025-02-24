"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/configs/firebaseConfig";
import { addDoc, collection, doc, getDocs, runTransaction, serverTimestamp } from "firebase/firestore";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import Loader from "../Loader";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import { useCartStore } from "@/lib/store/cartStore";
import JsBarcode from "jsbarcode";

type Meal = {
  id: string;
  name: string;
  category: "Breakfast" | "Lunch" | "Supper";
  price: number;
  quantity: number;
};

const MenuSection = () => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<"Breakfast" | "Lunch" | "Supper">("Breakfast");
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false); // Track payment success
  const { user } = useAuth();
  const { toast } = useToast();
  const { addToCart, cart } = useCartStore()
  const [polling, setPolling] = useState(false);  

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const mealsSnapshot = await getDocs(collection(db, "meals"));
        const mealList: Meal[] = mealsSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<Meal, "id">),
          }))
          .filter((meal) => meal.quantity > 0);

        setMeals(mealList);
      } catch (error) {
        console.error("Error fetching meals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  const placeOrder = (meal: Meal) => {
    if (!user) {
      alert("User not found! Please log in.");
      return;
    }

    setSelectedMeal(meal);
    setQuantity(1);
    setIsCheckoutOpen(true);
    setIsPaymentSuccessful(false); // Reset payment status
  };

  
  const startPolling = (checkoutRequestID: string, mealId: string) => {
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
  
          try {
            if (!selectedMeal) {
              toast({ description: "No meal selected. Please try again." });
              return;
            }
  
            await addDoc(collection(db, "orders"), {
              userEmail: user?.email || "Unknown User",
              mealId: selectedMeal.id,
              mealName: selectedMeal.name,
              price: selectedMeal.price * quantity,
              quantity,
              phoneNumber,
              status: "pending",
              createdAt: serverTimestamp(),
            });
  
            // ✅ Reduce meal quantity in Firestore using a transaction
            const mealRef = doc(db, "meals", mealId);
            await runTransaction(db, async (transaction) => {
              const mealDoc = await transaction.get(mealRef);
              if (!mealDoc.exists()) throw "Meal does not exist!";
  
              const newQuantity = mealDoc.data().quantity - quantity;
              if (newQuantity < 0) throw "Not enough stock available!";
  
              transaction.update(mealRef, { quantity: newQuantity });
            });
  
            toast({ description: "Payment confirmed! Order placed successfully." });
          } catch (error) {
            console.error("Error updating meal quantity:", error);
            toast({ description: "Failed to update meal stock. Please contact support." });
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
      toast({ description: "Invalid phone number. Use format 07XXXXXXXX or 01XXXXXXXX." });
      return;
    }
  
    try {
      const response = await fetch("/api/mpesa/stkpush", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: formattedPhone,
          amount: (selectedMeal?.price ?? 1) * quantity,
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        toast({ description: "Payment initiated. Waiting for confirmation..." });
        setPolling(true); // Start polling for confirmation
        startPolling(data.CheckoutRequestID, selectedMeal?.id ?? "");
      } else {
        toast({ description: "Failed to initiate payment." });
        console.error("Error:", data);
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({ description: "Something went wrong. Please try again." });
    }
  };
 
  const downloadReceipt = () => {
    if (!selectedMeal) return;

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
    doc.text(`Meal: ${selectedMeal.name}`, 22, 90);
    doc.text(`Quantity: ${quantity}`, 22, 100);
    doc.text(`Price per meal: Ksh ${selectedMeal.price}`, 22, 110);
    
    // Highlight Total Price
    doc.setFont("helvetica", "bold");
    doc.text(`Total Price: Ksh ${selectedMeal.price * quantity}`, 22, 120);
    doc.setLineWidth(0.3);
    doc.line(20, 125, 190, 125);

    // Centered Barcode
    const barcodeData = canvas.toDataURL("image/png");
    doc.addImage(barcodeData, "PNG", 55, 130, 100, 30); // Adjust position & size

    // Footer
    doc.setFont("helvetica", "italic");
    doc.setFontSize(12);
    doc.text("Thank you for choosing ChakulaHub!", 105, 170, { align: "center" });

    // Save PDF
    doc.save(`Receipt_${selectedMeal.name}_${Date.now()}.pdf`);
};

  return (
    <div>
      <h1 className="font-poppins text-center text-2xl text-orange-1">Browse The Daily Menu</h1>
      <div className="grid grid-cols-3 px-10 mt-10">
        {["Breakfast", "Lunch", "Supper"].map((category) => (
          <div
            key={category}
            className={`border p-2 text-center cursor-pointer ${
              selectedCategory === category ? "bg-orange-1 text-white" : ""
            }`}
            onClick={() => setSelectedCategory(category as "Breakfast" | "Lunch" | "Supper")}
          >
            {category}
          </div>
        ))}
      </div>

      {loading ? (
        <div className="text-center mt-5 flex items-center justify-center"><Loader/> Loading meals...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-10 mt-6 mb-20">
          {meals.filter((meal) => meal.category === selectedCategory).map((meal) => {
            const isInCart = cart.some((item) => item.id === meal.id);
            return (
            <div key={meal.id} className="border p-4 rounded-lg shadow relative">
               {/* ✅ Small Badge on the Meal Item */}
               {isInCart && (
  <span className="absolute top-2 right-2 bg-black text-white text-xs font-bold px-2 py-1 rounded-full">
    {cart.find((item) => item.id === meal.id)?.quantity} {cart.find((item) => item.id === meal.id)?.quantity === 1 ? "item" : "items"} in Cart
  </span>
)}
              
              <div className="flex justify-between items-center">
                <div>
              <h3 className="mt-2 font-semibold capitalize">{meal.name}</h3>
              <p className="mt-2 font-bold text-orange-1">Ksh {meal.price}</p>
                </div>
                <div>
                <h3 className="mt-2 font-semibold">{meal.quantity} Left</h3>
                </div>
              </div>
              <div className="flex gap-5">
              <button className="mt-2 w-full bg-orange-2 text-white p-2 rounded" onClick={() => placeOrder(meal)} >
              Order Now
              </button>
              <button className="mt-2 w-full bg-orange-1 text-white p-2 rounded" onClick={()=>addToCart(meal)}>
                Add To Cart
              </button>
              </div>
            </div>
)})}
        </div>
      )}

      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="p-5">
          <DialogTitle>{isPaymentSuccessful ? "Payment Successful" : "Checkout"}</DialogTitle>
          {selectedMeal && (
            <div className="mt-4">
              {isPaymentSuccessful ? (
                // Payment Successful View
                <>
                  <p><strong>Meal:</strong> {selectedMeal.name}</p>
                  <p><strong>Quantity:</strong> {quantity}</p>
                  <p><strong>Total Price:</strong> Ksh {selectedMeal.price * quantity}</p>
                  <p><strong>Phone Number:</strong> {phoneNumber}</p>
                  <button className="mt-4 w-full bg-orange-1 text-white p-2 rounded" onClick={downloadReceipt}>
                    Download Receipt
                  </button>
                </>
              ) : (
                // Checkout View
                <>
                  <p><strong>Meal:</strong> {selectedMeal.name}</p>
                  <p><strong>Price per Meal:</strong> Ksh {selectedMeal.price}</p>
                  <div className="mt-3 flex items-center gap-3">
                    <label className="font-bold">Quantity:</label>
                    <button className="bg-gray-300 px-3 py-1 rounded" onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}>-</button>
                    <span>{quantity}</span>
                    <button className="bg-gray-300 px-3 py-1 rounded" onClick={() => setQuantity((prev) => prev + 1)}>+</button>
                  </div>
                  <p className="mt-2 font-bold text-orange-1">Total Price: Ksh {selectedMeal.price * quantity}</p>
                  <input type="text" placeholder="Enter phone number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="border p-2 w-full mt-2" />
                  <button className="mt-4 w-full bg-orange-1 text-white p-2 rounded" onClick={handlePayment} disabled={polling}>
            {polling ? "Processing..." : "Confirm & Pay"}
                    
                  </button>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MenuSection;