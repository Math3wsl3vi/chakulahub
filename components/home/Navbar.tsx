"use client"
import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const Navbar = () => {
  const router = useRouter()
  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login"); // Redirect to login page
  };
  

  return (
    <div className='w-full flex flex-row items-center justify-between px-5 py-4 border-b-2 shadow-sm'>
      <Link href={'/'} className='cursor-pointer'> <Image src='/images/logo.png' alt='logo' width={40} height={40}/></Link>
      <h1 className='text-xl uppercase font-poppins font-semibold'>Chakula Hub</h1>
      <Button className='bg-orange-1' onClick={handleLogout}>Log out</Button>
    </div>
  )
}

export default Navbar