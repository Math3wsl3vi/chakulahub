"use client"
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation";

const LoginPage = () => {
    const [isLogin, setIsLogin ] = useState(false)
    const router = useRouter()
  return (
    <div className="flex justify-center items-center w-full h-screen">
      <Card className="w-[350px]">
      <CardHeader className="flex items-center flex-col">
        <CardTitle>Welcome to Delivery App</CardTitle>
        <CardDescription>{!isLogin && 'Create an Account' || 'Login To Your Account'}</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            {isLogin && (<div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Name" />
            </div>)}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Email</Label>
              <Input id="name" placeholder="Email" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="framework">Password</Label>
              <Input placeholder="password" type="password"/>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between flex-col gap-2">
        <h1>Already Have an Account? <button className="bg-white text-black shadow-none p-0" onClick={()=>setIsLogin(true)}>{isLogin && 'Login' || 'Register'}</button></h1>
        <Button className="w-1/2 bg-green-500" onClick={()=>router.push('/')}>Continue</Button>
      </CardFooter>
    </Card>
    </div>
  );
};

export default LoginPage;
