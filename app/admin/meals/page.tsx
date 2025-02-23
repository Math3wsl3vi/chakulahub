"use client";
import React, { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import Link from "next/link";
import { db } from "@/configs/firebaseConfig";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [newQuantity, setNewQuantity] = useState<number>(0);

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

  const updateQuantity = async () => {
    if (!selectedMeal) return;
    setLoading(true);
    try {
      await updateDoc(doc(db, "meals", selectedMeal.id), { quantity: newQuantity });
      setMeals((prevMeals) =>
        prevMeals.map((meal) =>
          meal.id === selectedMeal.id ? { ...meal, quantity: newQuantity } : meal
        )
      );
      console.log("Quantity updated successfully");
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setLoading(false);
      setSelectedMeal(null);
    }
  };

  const deleteMeal = async (id: string) => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, "meals", id));
      setMeals((prevMeals) => prevMeals.filter((meal) => meal.id !== id));
      console.log("Meal deleted successfully");
    } catch (error) {
      console.error("Error deleting meal:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 overflow-x-auto">
      <h1 className="text-2xl font-bold text-center">Manage Meals</h1>
      <Link href="/admin/meals/add">
        <Button className="bg-orange-1 w-full text-lg rounded-none mt-3 md:w-1/3">
          Add Meal
        </Button>
      </Link>
      <table className="w-full mt-4 border min-w-max">
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
              <td className="border px-4 py-2 flex gap-2">
                <Button
                  className="bg-orange-500 text-white px-4 py-1 rounded"
                  onClick={() => {
                    setSelectedMeal(meal);
                    setNewQuantity(meal.quantity);
                  }}
                >
                  Edit
                </Button>
                <Button
                  className="bg-black text-white px-4 py-1 rounded"
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

      {/* Edit Quantity Dialog */}
      {selectedMeal && (
        <Dialog open={true} onOpenChange={() => setSelectedMeal(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Quantity for {selectedMeal.name}</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <label className="text-lg font-semibold">Quantity:</label>
              <Input
                type="number"
                value={newQuantity}
                onChange={(e) => setNewQuantity(Number(e.target.value))}
                className="text-center"
              />
            </div>
            <DialogFooter className="flex gap-5">
              <Button className="bg-black" onClick={() => setSelectedMeal(null)}>Cancel</Button>
              <Button className="bg-orange-500 text-white" onClick={updateQuantity} disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminMeals;
