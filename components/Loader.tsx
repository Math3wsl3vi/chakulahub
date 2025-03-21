import Image from 'next/image'
import React from 'react'

const Loader = () => {
  return (
    <div className='flex justify-center items-center'>
         <Image 
                src='/images/loader.svg'
                alt='loader'
                width={24}
                height={24}
                className='animate-spin'
                />
                Loading...
    </div>
  )
}

export default Loader