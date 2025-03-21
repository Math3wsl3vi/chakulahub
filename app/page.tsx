"use client";
import { useEffect } from "react";
import MenuSection from "@/components/foodSection/MenuSection";
import Footer from "@/components/home/Footer";
import Hero from "@/components/home/Hero";
import Reviews from "@/components/home/Review";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Home() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(console.error);
    }
  }, []);


  return (
    <ProtectedRoute>
      <div className="flex flex-col relative h-screen w-full font-bab">
        {/* navbar */}
        {/* main page */}
        <div>
          <Hero />
        </div>
        {/* breakfast */}
        <MenuSection />
        {/* lunch */}
        {/* dinner */}
        {/* bottom bar */}
        <div className="mt-10 p-4">
          <Reviews />
        </div>
        <div className="mt-10">
          <Footer />
        </div>
      </div>
    </ProtectedRoute>
  );
}
