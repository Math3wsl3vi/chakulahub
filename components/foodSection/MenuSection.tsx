"use client";
import React, { useState, useEffect } from "react";
import { db } from "@/configs/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

type Meal = {
  id: string;
  name: string;
  category: "Breakfast" | "Lunch" | "Supper";
  price: number;
};

const MenuSection = () => {
  const [selectedCategory, setSelectedCategory] = useState<"Breakfast" | "Lunch" | "Supper">("Breakfast");
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div>
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
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </div>
        ))}
      </div>

      {/* Loading state */}
      {loading ? (
        <p className="text-center mt-5">Loading meals...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-10 mt-6 mb-20">
          {meals.filter((meal) => meal.category === selectedCategory).map((meal) => (
            <div key={meal.id} className="border p-4 rounded-lg shadow">
              <h3 className="mt-2 font-semibold capitalize">{meal.name}</h3>
              <p className="mt-2 font-bold text-orange-500 text-xl">Ksh {meal.price}</p>
              <button className="mt-2 w-full bg-black text-white p-2 rounded">Order Meal</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuSection;
