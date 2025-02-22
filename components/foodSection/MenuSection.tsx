"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/configs/firebaseConfig";
import { collection, addDoc, serverTimestamp, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import Loader from "../Loader";
import { useToast } from "@/hooks/use-toast";

type Meal = {
  id: string;
  name: string;
  category: "Breakfast" | "Lunch" | "Supper";
  price: number;
};

const MenuSection = () => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<"Breakfast" | "Lunch" | "Supper">("Breakfast");
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast()
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const mealsSnapshot = await getDocs(collection(db, "meals"));
        const mealList: Meal[] = mealsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Meal, "id">),
        }));
        setMeals(mealList);
      } catch (error) {
        console.error("Error fetching meals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);
  const placeOrder = async (meal: Meal) => {
    try {
      if (!user) {
        alert("User not found! Please log in.");
        return;
      }
  
      if (!meal.id) {
        alert("Meal ID is missing!");
        return;
      }
  
      const mealRef = doc(db, "meals", meal.id);
      const mealSnapshot = await getDoc(mealRef);
  
      if (!mealSnapshot.exists()) {
        alert("Meal not found.");
        return;
      }
  
      const currentQuantity = mealSnapshot.data()?.quantity ?? 0;
  
      if (currentQuantity <= 0) {
        alert("Sorry, this meal is out of stock.");
        return;
      }
  
      // Add the order
      await addDoc(collection(db, "orders"), {
        userEmail: user.email || "Unknown User",
        mealName: meal.name,
        price: meal.price,
        status: "pending",
        createdAt: serverTimestamp(),
      });
  
      // Decrease meal quantity
      await updateDoc(mealRef, { quantity: currentQuantity - 1 });
  
      setSelectedMeal(meal);
      setIsCheckoutOpen(true);
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order.");
    }
  };
  

  const handlePayment = async () => {
    try {
      const response = await fetch("/api/mpesa/stkpush", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: "254717271815", // Replace with the actual phone number
          amount: 1, // Replace with the actual amount
        }),
      });
  
      const data = await response.json();
      
      if (response.ok) {
        toast({description:"Payment request sent. Please check your phone."});
        console.log("STK Push Response:", data);
      } else {
        toast({description:"Failed to initiate payment."});
        console.error("Error:", data);
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({description:"Something went wrong. Please try again."});
    }
  };
  
  
  

  return (
    <div className="">
      <h1 className="font-poppins text-center text-2xl text-orange-500">Browse The Daily Menu</h1>

      {/* Category Selection */}
      <div className="grid grid-cols-3 px-10 mt-10">
        {["Breakfast", "Lunch", "Supper"].map((category) => (
          <div
            key={category}
            className={`border p-2 text-center cursor-pointer ${
              selectedCategory === category ? "bg-orange-500 text-white" : ""
            }`}
            onClick={() => setSelectedCategory(category as "Breakfast" | "Lunch" | "Supper")}
          >
            {category}
          </div>
        ))}
      </div>

      {/* Meals Display */}
      {loading ? (
        <div className="text-center mt-5 flex items-center justify-center"><Loader/> Loading meals...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-10 mt-6 mb-20">
          {meals
            .filter((meal) => meal.category === selectedCategory)
            .map((meal) => (
              <div key={meal.id} className="border p-4 rounded-lg shadow">
                <h3 className="mt-2 font-semibold">{meal.name}</h3>
                <p className="mt-2 font-bold text-orange-500">Ksh {meal.price}</p>
                <button
                  className="mt-2 w-full bg-black text-white p-2 rounded"
                  onClick={() => {
                    handlePayment()
                    placeOrder(meal)
                  }}
                >
                  Order Meal
                </button>
              </div>
            ))}
        </div>
      )}

      {/* Checkout Dialog */}
      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="p-5 mx-4">
          <DialogTitle>Checkout</DialogTitle>
          {selectedMeal && (
            <div className="mt-4">
              <p><strong>Meal:</strong> {selectedMeal.name}</p>
              <p><strong>Price:</strong> Ksh {selectedMeal.price}</p>
              <button 
                className="mt-4 w-full bg-orange-500 text-white p-2 rounded" 
                onClick={() => setIsCheckoutOpen(false)}
              >
                Confirm & Pay
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MenuSection;
