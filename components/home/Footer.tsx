import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <div className='w-full min-h-32 border-t shadow-sm rounded-t-md px-4 md:flex md:flex-col md:items-center md:justify-center'>
      <div className='flex flex-row justify-between items-center md:gap-20 mt-5'>
        <div>
          <h1 className='font-semibold text-xl'>CHAKULAHUB</h1>
          <p className='text-sm'>Contact us</p>
          <div className='text-sm md:text-lg flex gap-2'>
            <p>Email us:</p>
            <Link href={'/'}>chakulahub@gmail.com</Link>
            </div>
            <div className='text-smmd:text-lg  flex gap-2'>
            <p>Call us:</p>
            <Link href={'/'}>071234567890</Link>
            </div>
        </div>
        <div>
          <h1 className='text-xl font-semibold'>Links</h1>
          <ul>
            <li><Link href={'/faqs'} className='text-sm md:text-lg'>FAQS</Link></li>
            <li><Link href={'/'} className='text-sm md:text-lg'>About us</Link></li>
            <li><Link href={'/'} className='text-sm md:text-lg'>Terms and conditions</Link></li>
          </ul>
        </div>
        </div>
        <div className='pb-5 mt-5'>
          <ul className='flex flex-row gap-5 justify-center items-center'>
            <li className='border p-2 rounded-md flex justify-center items-center cursor-pointer'><Image src='/images/twitter.png' alt='twitter' width={17} height={17}/></li>
            <li className='border p-2 rounded-md flex justify-center items-center cursor-pointer'><Image src='/images/facebook.png' alt='twitter' width={17} height={17}/></li>
            <li className='border p-2 rounded-md flex justify-center items-center cursor-pointer'><Image src='/images/insta.png' alt='twitter' width={17} height={17}/></li>

          </ul>
        </div>
    </div>
  )
}

export default Footer