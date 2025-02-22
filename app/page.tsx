"use client"
import MenuSection from "@/components/foodSection/MenuSection";
import Hero from "@/components/home/Hero";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Home() {

  return (
    <ProtectedRoute>
      <div className="flex flex-col relative h-screen w-full">
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
      </div>
    </ProtectedRoute>
  );
}
