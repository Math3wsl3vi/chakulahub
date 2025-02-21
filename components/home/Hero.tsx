import React from "react";
import FoodCards from "./FoodCards";
import { FoodItems } from "@/lib/data";
import { Button } from "../ui/button";

const Hero = () => {
  return (
    <div className="pt-5 px-5 mt-5">
      <h1 className="text-center font-poppins text-2xl text-orange-1">🍽 Book Your Meals in Seconds, Enjoy Without the Hassle!</h1>
      <p className="text-center font-poppins text-lg text-gray-500">Say goodbye to long queues and last-minute meal rushes. With Chakula Hub, you can book your meals in advance, manage your orders, and never miss a meal again.</p>
       <div className="w-full flex items-center justify-center gap-10 my-10">
       <Button className="bg-black text-lg h-12">Book a Meal</Button>
       <Button className="bg-black text-lg h-12">View Menu</Button>
       </div>
      <div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 mb-20">
        {FoodItems.map((item) => (
          <FoodCards key={item.id} item={item} />
        ))}
      </div>
      </div>
    </div>
  );
};

export default Hero;
