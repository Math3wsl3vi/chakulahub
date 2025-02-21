"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useCartStore } from "@/lib/store/cartStore";
import Image from "next/image";
import React, { useState } from "react";

const CartPage = () => {
  const [ phone, setPhone ] = useState('')
  const [ address,setAddress ] = useState('')
  const { toast } = useToast()

   const handleOrder = async () => {

    if (!phone || !address) {
      toast({description:"Please enter your phone number and address!"});
      return;
    }

    const orderData = {
      orderId: Date.now().toString(),
      items: cart,
      total: getTotalPrice() + 200,
      phone, 
      address
    };
  
    const response = await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });
  
    const result = await response.json();
    if (result.success) {
      toast({
        description: "Order Sent Successfully. Kindly prepare payment as it is being delivered.",
      })
      clearCart(); // Clear cart after ordering
    } else {
      console.log("Failed to send order: " + result.error);
      toast({
        description: "Failed to send Order.",
      })
    }
  };
  const { cart, removeFromCart, updateQuantity, clearCart } = useCartStore();

  const getTotalPrice = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);

 
  return (
    <div className="py-5 h-screen w-full px-2">
      {cart.length === 0 ? (
        <div>
          <h1 className="text-center font-poppins text-2xl">YOUR CART</h1>
          <Image src="/images/emptyCart.png" alt="cart" width={500} height={500} />
          <p className="font-poppins text-xl text-center">You have nothing yet! Continue Shopping</p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <div className="border p-2 rounded-md">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center border-b p-2">
                <div>
                  <h1 className="texl-xl font-semibold font-poppins">{item.name}</h1>
                  <h1 className="text-gray-500">Ksh {item.price}</h1>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="flex items-center space-x-5 border p-1 rounded-md px-3">
                    <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <div>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-500">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex justify-center items-center">
              <Button
                onClick={clearCart}
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md w-1/2"
              >
                Clear Cart
              </Button>
            </div>
          </div>
          <div className="border p-2 rounded-md">
            <h1 className="text-xl font-poppins text-center">Order Summary</h1>
            <div className="flex flex-col gap-5">
              <div className="flex justify-between items-center">
                <h1 className="text-lg font-semibold font-poppins">SubTotal</h1>
                <h1 className="text-gray-500">Ksh {getTotalPrice()}</h1>
              </div>
              <div className="flex justify-between items-center">
                <h1 className="text-lg font-semibold font-poppins">Delivery Fee</h1>
                <h1 className="text-gray-500">Ksh 200</h1>
              </div>
              <hr />
              <div className="flex justify-between items-center">
                <h1 className="text-lg font-semibold font-poppins">Total</h1>
                <h1 className="text-green-500 text-xl">Ksh {getTotalPrice() + 200}</h1>
              </div>
            </div>
          </div>
          <div className="border p-2 rounded-md">
            <h1 className="text-xl font-semibold font-poppins text-center">Delivery Details</h1>
            <div className="flex flex-col gap-5">
                    <div>
                    <Label>Delivery Address</Label>
                    <Input
                      value={address}
                      onChange={(e)=>setAddress(e.target.value)}
                    placeholder="Where should we deliver the food?" className=""/>
                    </div>
                    <div>
                    <Label>Phone Number</Label>
                    <Input 
                    value={phone}
                    onChange={(e)=>setPhone(e.target.value)}
                    placeholder="0712345678" className=""/>
                    </div>
                    <div className="w-full flex justify-center">
                        <Button className="bg-green-500 w-1/2" onClick={handleOrder}>Order Now</Button>
                    </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
