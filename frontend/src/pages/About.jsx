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
           <b className=' text-gray-800'>ORIGINALITY</b>
           <p>Being authentic and innovative The pioneering spirit that started in 1873 with the very first pair of blue jeans still permeates all aspects of our business. Through innovative products and practices, we break the mold. </p>
           <b className=' text-gray-800'>COURAGE</b>
           <p>Standing up for what we believe It takes courage to be great. Courage is the willingness to tell the truth and to challenge hierarchy, accepted practice and conventional wisdom. It means standing by our convictions and acting on our beliefs.</p>
           <b className=' text-gray-800'>INTEGRITY</b>
           <p>Doing the right thing Integrity means doing right by our employees, brands, company and society as a whole. Ethical conduct and social responsibility characterize our way of doing business</p>
        </div>
      </div>

      <div className=' text-xl py-4'>
        <Title text1={'WHY'} text2={" CHOOSE US"} />
      </div>

      <div className='flex flex-col md:flex-row text-sm md-20'>
        <div className='border px-10 md:px-18 my-8 sm:py-20 flex flex-col gap-5'>
          <b>Quality Assurance:</b>
          <p className=' text-gray-600'>Walking in other people’s shoes Empathy begins with paying close attention to the world around us. We listen and respond to the needs of our customers, employees and other stakeholders.</p>
        </div>
        <div className='border px-10 md:px-18 my-8 sm:py-20 flex flex-col gap-5'>
          <b>Convenience</b>
          <p className=' text-gray-600'>Walking in other people’s shoes Empathy begins with paying close attention to the world around us. We listen and respond to the needs of our customers, employees and other stakeholders.</p>
        </div>
        <div className='border px-10 md:px-18 my-8 sm:py-20 flex flex-col gap-5'>
          <b>Exceptional Customer Service</b>
          <p className=' text-gray-600'>Walking in other people’s shoes Empathy begins with paying close attention to the world around us. We listen and respond to the needs of our customers, employees and other stakeholders.</p>
        </div>
      </div>
      
      <NewsletterBox />
    </div>
  )
}

export default About
