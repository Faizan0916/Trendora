import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/frontend_assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const Contact = () => {
  return (
    <div>

      <div className='text-center text-2xl pt-10 border-t'>
        <Title text1={'CONTACT'} text2={' US'} />
        <p className='text-gray-500 text-sm sm:text-base mt-3'>
          Questions about an order, size or delivery? We’re here to help.
        </p>
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        <img className='w-full md:max-w-[480px]' src={assets.contact_img} alt="Trendora store" />

        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-xl text-gray-600'>Our Store</p>
          <p className='text-gray-500'>
            Trendora Store <br /> Jamia Millia Islamia, <br /> New Delhi, 110025
          </p>
          <p className='text-gray-500'>
            Phone: <a href='tel:+917905389916' className='hover:text-black'>+91 79053 89916</a> <br />
            Email: <a href='mailto:hello@trendora.com' className='hover:text-black'>hello@trendora.com</a> <br />
            Support hours: Mon-Sat, 10 AM-7 PM
          </p>
          <p className='text-gray-500 text-sm'>We usually reply within 24 hours.</p>

          <p className='font-semibold text-xl text-gray-600'>Careers at Trendora</p>
          <p className='text-gray-500'>
            Love fashion and want to grow with us? We’re building a brand people love, and we’d like to hear from you.
          </p>
          <a
            href='mailto:hello@trendora.com?subject=Job%20Application'
            className='border border-black px-8 py-4 text-sm cursor-pointer hover:bg-black hover:text-white transition-all duration-500'
          >
            Join Our Team
          </a>
        </div>
      </div>

      <NewsletterBox />
    </div>
  )
}

export default Contact