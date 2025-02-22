"use client";
import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { db } from "@/configs/firebaseConfig";

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
              ...(doc.data() as Omit<Meal, "id">), 
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
      <h1 className="text-2xl font-bold text-center">Manage Meals</h1>
      <Link href="/admin/meals/add">
        <Button className="bg-orange-1 w-full text-lg rounded-none mt-3 md:w-1/3">Add Meal</Button>
      </Link>
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
