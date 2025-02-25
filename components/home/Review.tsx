"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/configs/firebaseConfig";
import { 
    collection, addDoc, getDocs, serverTimestamp, Timestamp, 
    doc as firestoreDoc, updateDoc, getDoc, 
    doc,
    onSnapshot
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { Star } from "lucide-react"; // Import star icon for rating

type Meal = {
  id: string;
  name: string;
};

type Review = {
  id: string;
  userId: string;
  userEmail?: string;
  mealId: string;
  mealName?: string;
  reviewText: string;
  rating: number;
  adminResponse?: string;
  createdAt?: Timestamp;
};

const Reviews = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState<number>(5); // Default rating
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [adminResponses, setAdminResponses] = useState<{ [key: string]: string }>({});
  const [showAll, setShowAll] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkIfAdmin = async () => {
      if (!user) return;
  
      try {
        const adminDoc = await getDoc(firestoreDoc(db, "admins", user.uid));
        setIsAdmin(adminDoc.exists());
      } catch (error) {
        console.error("Error checking admin status:", error);
      }
    };
  
    checkIfAdmin();
  }, [user]);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const mealsSnapshot = await getDocs(collection(db, "meals"));
        const mealsData = mealsSnapshot.docs.map((doc) => ({ id: doc.id, name: doc.data().name }));
        setMeals(mealsData);
      } catch (error) {
        console.error("Error fetching meals:", error);
      }
    };
  
    fetchMeals();
  }, []);

  useEffect(() => {
    if (meals.length === 0) return; // Ensure meals are loaded before fetching reviews
  
    const reviewsRef = collection(db, "reviews");
  
    // Set up real-time listener
    const unsubscribe = onSnapshot(reviewsRef, (snapshot) => {
      const reviewList: Review[] = snapshot.docs.map((doc) => {
        const reviewData = doc.data() as Review;
        const mealName = meals.find((meal) => meal.id === reviewData.mealId)?.name || "Unknown Meal"; // Use meals state
  
        return {
          ...reviewData,
          id: doc.id,
          mealName, // Attach meal name
        };
      });
  
      setReviews(reviewList); // Update state in real-time
    });
  
    return () => unsubscribe(); // Clean up the listener when the component unmounts
  }, [meals]); // Depend on meals so it's loaded first
  const submitReview = async () => {
    if (!user || !selectedMeal || !reviewText) {
      toast({ description: "Please fill in all fields." });
      return;
    }
    try {
      await addDoc(collection(db, "reviews"), {
        userId: user.uid,
        userEmail: user.email,
        mealId: selectedMeal.id,
        reviewText,
        rating,
        adminResponse: "",
        createdAt: serverTimestamp(),
      });
      setReviewText("");
      setRating(5);
      setSelectedMeal(null);
      toast({ description: "Review submitted!" });
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const handleAdminResponseChange = (reviewId: string, response: string) => {
    setAdminResponses((prev) => ({ ...prev, [reviewId]: response }));
  };

  const submitAdminResponse = async (reviewId: string) => {
    if (!isAdmin) {
      toast({ description: "You are not authorized to respond to reviews." });
      return;
    }
  
    if (!adminResponses[reviewId]) {
      toast({ description: "Response cannot be empty." });
      return;
    }
  
    try {
      await updateDoc(doc(db, "reviews", reviewId), {
        adminResponse: adminResponses[reviewId],
      });
  
      setReviews((prev) =>
        prev.map((r) =>
          r.id === reviewId ? { ...r, adminResponse: adminResponses[reviewId] } : r
        )
      );
  
      setAdminResponses((prev) => ({ ...prev, [reviewId]: "" }));
  
      toast({ description: "Response submitted!" });
    } catch (error) {
      console.error("Error updating response:", error);
      toast({ description: "Failed to submit response.", variant: "destructive" });
    }
  };

  return (
    <div className="md:flex md:justify-center md:items-center">
      <div className="p-6 border rounded-md md:w-1/3">
        <h1 className="text-2xl font-bold mb-4">Meal Reviews</h1>
        <div className="mb-6">
          <DropdownMenu>
            <DropdownMenuTrigger className="border p-2 w-full bg-white text-left">
              {selectedMeal ? selectedMeal.name : "Choose a meal to review"}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full">
              {meals.map((meal) => (
                <DropdownMenuItem key={meal.id} onClick={() => setSelectedMeal(meal)} className="cursor-pointer">
                  {meal.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                onClick={() => setRating(star)}
                className={`w-6 h-6 cursor-pointer ${star <= rating ? "text-yellow-500" : "text-gray-400"}`}
              />
            ))}
          </div>

          <Textarea
            placeholder="Write your review..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="border p-2 w-full mt-2 bg-white"
          />
          <Button className="bg-orange-1 text-white px-4 py-2 rounded mt-2 w-full md:w-1/3" onClick={submitReview}>
            Submit Review
          </Button>
        </div>

        {reviews.length > 0 ? (
          <>
            {reviews.slice(0, showAll ? reviews.length : 2).map((review) => (
              <div key={review.id} className="border p-4 mb-4 rounded">
                <p><strong>User:</strong> {review.userEmail}</p>
                <p><strong>Meal:</strong> {review.mealName}</p>
                <p><strong>Review:</strong> {review.reviewText}</p>
                <p><strong>Rating:</strong> {"⭐".repeat(review.rating)}</p>
                <p><strong>Response:</strong> {review.adminResponse || "No response yet"}</p>
                {isAdmin && (
                <div className="mt-2">
                  <Textarea
                    placeholder="Write a response..."
                    value={adminResponses[review.id] || ""}
                    onChange={(e) => handleAdminResponseChange(review.id, e.target.value)}
                    className="border p-2 w-full bg-white"
                  />
                  <Button className="bg-orange-1 text-white px-4 py-2 rounded mt-2" 
                    onClick={() => submitAdminResponse(review.id)}>
                    Submit Response
                  </Button>
                </div>
              )}
              </div>
            ))}
            <Button className="bg-orange-1 text-white px-4 py-2 rounded mt-2 w-full" 
              onClick={() => setShowAll(!showAll)}>
              {showAll ? "Show Less" : "View More"}
            </Button>
          </>
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default Reviews;
