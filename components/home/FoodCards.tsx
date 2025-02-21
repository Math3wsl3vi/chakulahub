"use client"
import React from 'react'
import { Button } from '../ui/button'
import { useCartStore } from '@/lib/store/cartStore';

type FoodItem = {
  id: string;
  name: string;
  price: number;
  currency: string;
  description: string;
  image?: string;
  quantity: number;
};

const FoodCards = ({item}:{item:FoodItem}) => {
  const {addToCart } = useCartStore()
  return (
    <div className="h-32">
       <div className="border p-4 rounded-lg shadow-md items-center flex flex-col h-full">
          <h2 className="text-lg font-semibold">{item.name}</h2>
          <p className="text-gray-500">Price: KES {item.price}</p>
          <Button className='bg-orange-1 my-4' onClick={()=>addToCart(item)}>Add to cart</Button>
        </div>
    </div>
  )
}

export default FoodCards
