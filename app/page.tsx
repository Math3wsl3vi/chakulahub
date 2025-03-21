"use client"
import MenuSection from "@/components/foodSection/MenuSection";
import Footer from "@/components/home/Footer";
// import Footer from "@/components/home/Footer";
import Hero from "@/components/home/Hero";
import Reviews from "@/components/home/Review";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Home() {

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
        {/* <Footer/> */}
        <div className="mt-10 p-4">
        <Reviews/>
        </div>
        <div className="mt-10">
          <Footer/>
        </div>
      </div>
    </ProtectedRoute>
  );
}
