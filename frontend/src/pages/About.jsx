import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/frontend_assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const About = () => {
  return (
    <div>

      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'ABOUT'} text2={' US'} />
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
           <b className=' text-gray-800'>OUR STORY</b>
           <p>Trendora started with a simple idea: great style should be easy to find and easy to wear. We bring together modern, versatile pieces for every day, so you can look good without overthinking it.</p>
           <b className=' text-gray-800'>OUR MISSION</b>
           <p>To make everyday fashion simple, affordable and enjoyable. We choose each piece for its quality, comfort and style, so you can shop with confidence.</p>
           <b className=' text-gray-800'>OUR PROMISE</b>
           <p>Honest prices, quality you can feel, and service that treats you like family. If something isn’t right, we’ll make it right</p>
        </div>
      </div>

      <div className=' text-xl py-4'>
        <Title text1={'WHY'} text2={" CHOOSE US"} />
      </div>

      <div className='flex flex-col md:flex-row text-sm md-20'>
        <div className='border px-10 md:px-18 my-8 sm:py-20 flex flex-col gap-5'>
          <b>Quality Assurance</b>
          <p className=' text-gray-600'>Every product is checked for fabric, stitching and fit before it reaches you. We stand behind what we sell.</p>
        </div>
        <div className='border px-10 md:px-18 my-8 sm:py-20 flex flex-col gap-5'>
          <b>Convenience</b>
          <p className=' text-gray-600'>Browse, order and track from anywhere. Enjoy easy payments, cash on delivery and a simple 7-day return and exchange.</p>
        </div>
        <div className='border px-10 md:px-18 my-8 sm:py-20 flex flex-col gap-5'>
          <b>Exceptional Customer Service</b>
          <p className=' text-gray-600'>Our support team is here Monday to Saturday, 10 AM to 7 PM. Questions about sizes, orders or delivery? We’re happy to help.</p>
        </div>
      </div>
      
      <NewsletterBox />
    </div>
  )
}

export default About
