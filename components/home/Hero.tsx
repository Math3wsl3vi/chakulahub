import React from "react";
// import { Button } from "../ui/button";

const Hero = () => {
  return (
    <div className="pt-5 px-5 mt-5">
      <h1 className="text-center text-2xl text-orange-1 font-bab">🍽 Book Your Meals in Seconds, Enjoy Without the Hustle!</h1>
      <p className="text-center text-lg text-gray-500 mb-10 font-bab">Say goodbye to long queues and last-minute meal rushes. With Chakula Hub, you can book your meals in advance, manage your orders, and never miss a meal again.</p>
       {/* <div className="w-full flex items-center justify-center gap-10 my-10">
       <Button className="bg-black text-lg h-12">Book a Meal</Button>
       <Button className="bg-black text-lg h-12">View Menu</Button>
       </div> */}
      <div>
        {/* <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 mb-20">
        {FoodItems.map((item) => (
          <FoodCards key={item.id} item={item} />
        ))}
      </div> */}
      </div>
    </div>
  );
};

export default Hero;
