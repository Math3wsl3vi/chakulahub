"use client";
import React, { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { db } from "@/configs/firebaseConfig";

type Meal = {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
};

const AdminMeals = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMeals();
  }, []);

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

  const deleteMeal = async (id: string) => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, "meals", id));
      setMeals((prevMeals) => prevMeals.filter((meal) => meal.id !== id)); // Remove from state
      console.log("Meal deleted successfully");
    } catch (error) {
      console.error("Error deleting meal:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold text-center">Manage Meals</h1>
      <Link href="/admin/meals/add">
        <Button className="bg-orange-1 w-full text-lg rounded-none mt-3 md:w-1/3">
          Add Meal
        </Button>
      </Link>
      <table className="w-full mt-4 border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Meal</th>
            <th className="border px-4 py-2">Category</th>
            <th className="border px-4 py-2">Quantity</th>
            <th className="border px-4 py-2">Price</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {meals.map((meal) => (
            <tr key={meal.id}>
              <td className="border px-4 py-2">{meal.name}</td>
              <td className="border px-4 py-2">{meal.category}</td>
              <td className="border px-4 py-2">{meal.quantity}</td>
              <td className="border px-4 py-2">Ksh {meal.price}</td>
              <td className="border px-4 py-2">
                <Button
                  className="bg-red-600 text-white px-4 py-1 rounded"
                  onClick={() => deleteMeal(meal.id)}
                  disabled={loading}
                >
                  {loading ? "Deleting..." : "Delete"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminMeals;
