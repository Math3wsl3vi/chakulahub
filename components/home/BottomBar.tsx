import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const BottomBar = () => {
  return (
    <div className='bg-orange-100 w-full flex justify-between px-5 py-3 rounded-md'>
      <Link href={'/'} className='flex flex-row gap-2 items-center'><Image src='/images/home.png' alt='home' width={30} height={30}/>Home </Link>
      <Link href={'/cart'} className='flex flex-row gap-2 items-center'><Image src='/images/cart.png' alt='home' width={30} height={30}/>Cart </Link>

    </div>
  )
}

export default BottomBar