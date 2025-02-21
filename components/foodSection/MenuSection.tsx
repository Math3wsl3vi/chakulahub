"use client"
import React, { useState } from "react";
import meals from "@/lib/data"; // Import the meals array

const MenuSection = () => {
  const [selectedCategory, setSelectedCategory] = useState<"breakfast" | "lunch" | "supper">("breakfast");

  return (
    <div>
      <h1 className="font-poppins text-center text-2xl text-orange-1">Browse The Daily Menu</h1>

      {/* Category Selection */}
      <div className="grid grid-cols-3 px-10 mt-10">
        {["breakfast", "lunch", "supper"].map((category) => (
          <div
            key={category}
            className={`border p-2 text-center cursor-pointer ${
              selectedCategory === category ? "bg-orange-500 text-white" : ""
            }`}
            onClick={() => setSelectedCategory(category as "breakfast" | "lunch" | "supper")}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </div>
        ))}
      </div>

      {/* Meals Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-10 mt-6 mb-20">
        {meals[selectedCategory].map((meal) => (
          <div key={meal.id} className="border p-4 rounded-lg shadow">
            {/* <img src={meal.image} alt={meal.name} className="w-full h-40 object-cover rounded" /> */}
            <h3 className="mt-2 font-semibold">{meal.name}</h3>
            <p className="text-sm text-gray-600">{meal.description}</p>
            <p className="mt-2 font-bold text-orange-500">Ksh {meal.price}</p>
            <button className="mt-2 w-full bg-black text-white p-2 rounded">Order Meal</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuSection;
