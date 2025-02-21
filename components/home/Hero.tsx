import React from "react";
import FoodCards from "./FoodCards";
import Image from "next/image";
import { FoodItems } from "@/lib/data";

const Hero = () => {
  return (
    <div className="pt-5 px-5 mt-5">
      <h1 className="text-center font-poppins text-2xl text-green-500">Ready made meals brought right to your doorstep!</h1>
      <p className="text-center font-poppins text-lg text-gray-500">Order from a variety of local restaurants and groceries we have partnered with and enjoy hassle-free delivery.</p>
       <div className="w-full flex items-center justify-center">
       <Image src='/images/delivery.png' alt="delivery" width={500} height={500}/>
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
