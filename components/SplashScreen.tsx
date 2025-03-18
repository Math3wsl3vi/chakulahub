"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

const SplashScreen = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000); // Hide after 3 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null; // Hide splash screen after timeout

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#017023]">
      <Image
        src="/images/newlogo.jpg"
        alt="Splash Logo"
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default SplashScreen;
