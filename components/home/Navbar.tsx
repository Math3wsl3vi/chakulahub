"use client"
import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

const Navbar = () => {

  const { toast } = useToast()
  return (
    <div className='w-full flex flex-row items-center justify-between px-5 py-4 border-b-2 shadow-sm'>
      <Link href={'/'} className='cursor-pointer'> <Image src='/images/logo.png' alt='logo' width={40} height={40}/></Link>
      <h1>Food Deliery App</h1>
      <Button className='bg-green-500' onClick={()=>toast({description:"This Button doesn't do anything. Stop clicking it"})}>Order Now</Button>
    </div>
  )
}

export default Navbar