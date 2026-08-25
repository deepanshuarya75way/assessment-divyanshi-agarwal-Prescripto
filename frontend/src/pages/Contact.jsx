import React from 'react'
import { assets } from '../assets/assets'

const Contact = () => {
  return (
    <div>
      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>CONTACT<span className='text-gray-700 font-semibold'> US</span></p>
      </div>
      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm'>
        <img className='w-full md:max-w-[360px]' src={assets.contact_image}alt=""/>
        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-lg text-gray-600'>OUR OFFICE</p>
          <p className='text-gray-500'>Prescripto Healthcare Pvt. Ltd.<br />
4th Floor, DLF Cyber City, Tower C
Gurugram, Haryana - 122002
</p>
          <p className='text-gray-500'>Email: support@prescripto.com</p>
          <p className='text-gray-500'>Business Hours: <br/>Mon - Sat: 9:00 AM - 8:00 PM <br/>Sunday: 10:00 AM - 2:00 PM</p>
          <p className='font-semibold text-lg text-gray-600'>Careers At Prescripto</p>
          <p  className='text-gray-500'>Learn more about our teams and job Openings.</p>
          <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500'>Explore Jobs</button>
        </div>
      </div>
 </div>
  )
}

export default Contact
//Interviewer agar sawaal kare: "Contact page pe phone number kyun nahi hai?"
//Tum confidently jawab doge: "Maine deliberately phone number nahi rakha kyunki aajkal real health-tech companies jaise Practo, DocPrime, 1mg primarily email aur chat support use karti hain — phone support outdated ho raha hai digital platforms mein. Isliye maine email-first approach choose kiya."

//Ye "thoughtful product decision" kyun lagta hai:
//Matlab ye hai ki tum sirf "code banana wala developer" nahi ho — tum "soch ke product banana wala developer" ho. Interviewer ko ye dikhta hai ki:

//Tumne real-world research ki (Practo, 1mg jaisi companies dekhi)
//Tumne ek conscious design choice liya (number nahi, email rakha)
//Tum apne decision ka reason explain kar sakte ho confidently