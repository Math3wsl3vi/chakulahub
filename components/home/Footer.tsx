import React from 'react'
import Reviews from './Review'

const Footer = () => {
  return (
    <div className='w-full min-h-44 bg-orange-1 fixed bottom-0 mt-20'>
        <div>
            <Reviews/>
        </div>
        <div></div>
    </div>
  )
}

export default Footer