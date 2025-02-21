"use client";
import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/configs/firebaseConfig";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Meal ={
    id:string;
    name:string;
    category:string;
    price:number;
}

const AdminMeals = () => {
    const [meals, setMeals] = useState<Meal[]>([]);

    useEffect(() => {
        const fetchMeals = async () => {
          try {
            const mealsCollection = collection(db, "meals");
            const mealSnapshot = await getDocs(mealsCollection);
            const mealList: Meal[] = mealSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...(doc.data() as Omit<Meal, "id">), // Ensure correct type
            }));
            setMeals(mealList);
          } catch (error) {
            console.error("Error fetching meals:", error);
          }
        };
    
        fetchMeals();
      }, []);

  return (
    <div className="p-5">
        <Link href="/admin/meals/add">
  <Button className="bg-orange-1 h-12 text-lg">Add Meal</Button>
</Link>
      <h1 className="text-2xl font-bold">Manage Meals</h1>
      <table className="w-full mt-4 border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Meal</th>
            <th className="border px-4 py-2">Category</th>
            <th className="border px-4 py-2">Price</th>
          </tr>
        </thead>
        <tbody>
          {meals.map((meal) => (
            <tr key={meal.id}>
              <td className="border px-4 py-2">{meal.name}</td>
              <td className="border px-4 py-2">{meal.category}</td>
              <td className="border px-4 py-2">Ksh {meal.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminMeals;
