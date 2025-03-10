import Image from "next/image";
import { Button } from "../ui/button";

interface Meal {
    id: string;
    name: string;
    category: "Breakfast" | "Lunch" | "Supper";
    price: number;
    imageUrl: string;
    quantity?: number;
  }
  
  interface MealCardProps {
    meal: Meal;
    placeOrder: (meal: Meal) => void;
  }
  
  const MealCard: React.FC<MealCardProps> = ({ meal, placeOrder }) => {
    return (
        <div className="w-full flex items-center justify-center mt-5 px-10">
      <div className="p-4 border rounded-md shadow-md w-full md:w-1/3 ">
      <div className="flex justify-between items-center">
      <Image src={meal.imageUrl} alt={meal.name} width={100} height={100} />
      <div>
      <h3 className="text-lg font-semibold capitalize">{meal.name}</h3>
        <p className="text-sm">{meal.category}</p>
        <p className="text-md font-bold">Ksh {meal.price}</p>
      </div>
      </div>
        <Button
          className="mt-2 bg-orange-1 text-white p-2 rounded-md w-full"
          onClick={() =>{
            console.log(meal)
            placeOrder(meal)
          }}
        >
          Order
        </Button>
      </div>
      </div>
    );
  };
  
  export default MealCard;
  