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
      </div>{" "}
      {/* bottom bar */}
      
    </div>
    </ProtectedRoute>
  );
}
