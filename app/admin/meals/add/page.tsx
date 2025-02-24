"use client";
import React, { useState } from "react";
import { db } from "@/configs/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const AddMeal = () => {
  const router = useRouter();
  const storage = getStorage();


  const [meal, setMeal] = useState<{
    name: string;
    category: string;
    price: string;
    quantity: string;
    image: File | null;
  }>({
    name: "",
    category: "Breakfast",
    price: "",
    quantity: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setMeal({ ...meal, [e.target.name]: e.target.value });
  };
  const handleImageUpload = async (file: File) => {
    try {
      const storageRef = ref(storage, `meals/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      let imageUrl = "";
      if (meal.image) {
        imageUrl = await handleImageUpload(meal.image);
      }

      await addDoc(collection(db, "meals"), {
        name: meal.name,
        category: meal.category,
        price: Number(meal.price),
        quantity: Number(meal.quantity), 
        imageUrl, 
      });
      
      setMessage("Meal added successfully!");
      setMeal({
        name: "",
        category: "Breakfast",
        price: "",
        quantity: "",
        image: null,
      });
      router.push("/admin/meals");
    } catch (error) {
      setMessage("Failed to add meal. Check console for errors.");
      console.error("Error adding meal:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-5 border rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Add a Meal</h2>
      {message && (
        <p className="text-sm text-center text-green-600">{message}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium">Meal Name</label>
          <input
            type="text"
            name="name"
            value={meal.name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Category</label>
          <select
            name="category"
            value={meal.category}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Supper">Supper</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={meal.quantity}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Price (KES)</label>
          <input
            type="number"
            name="price"
            value={meal.price}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setMeal({
                ...meal,
                image: e.target.files ? e.target.files[0] : null,
              })
            }
            required
            className="border p-4 mt-5 w-full"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded"
        >
          {loading ? "Adding..." : "Add Meal"}
        </button>
      </form>
    </div>
  );
};

export default AddMeal;
