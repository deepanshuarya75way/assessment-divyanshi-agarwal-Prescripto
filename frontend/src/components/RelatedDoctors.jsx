import React, { useEffect, useState, useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const RelatedDoctors = ({ speciality, docID }) => {

    const { doctors } = useContext(AppContext)
    const navigate = useNavigate()
    const [relDoc, setRelDocs] = useState([])

    useEffect(() => {

        if (doctors.length > 0 && speciality) {

            const doctorsData = doctors.filter(
                (doc) =>
                    doc.speciality === speciality &&
                    doc._id !== docID
            )

            setRelDocs(doctorsData)
        }

    }, [doctors, speciality, docID])

    return (

        <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>

            <h1 className='text-3xl font-medium'>
                Top Doctors to Book
            </h1>

            <p className='sm:w-1/3 text-center text-sm'>
                Simply browse through our extensive list of trusted doctors
            </p>

            <div className='w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0'>

                {relDoc.slice(0, 5).map((item, index) => (

                    <div
                        key={index}
                        onClick={() => {
                            navigate(`/appointment/${item._id}`)
                            window.scrollTo({
                                top: 0,
                                behavior: 'smooth'
                            })
                        }}
                        className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-500'
                    >
<div className="w-full h-[260px] bg-blue-50 overflow-hidden flex items-center justify-center">
    <img
        src={item.image}
        alt={item.name}
        className={`h-full object-contain ${
            item.name === "Dr. Karan Suri" ? "w-[85%]" : "w-full"
        }`}
    />
</div>

                        <div className='p-4'>

                            <div className='flex items-center gap-2 text-sm text-green-500'>
                                <p className='w-2 h-2 bg-green-500 rounded-full'></p>
                                <p>Available</p>
                            </div>

                            <p className='text-gray-900 text-lg font-medium'>
                                {item.name}
                            </p>

                            <p className='text-gray-600 text-sm'>
                                {item.speciality}
                            </p>

                        </div>

                    </div>

                ))}

            </div>

            <button
                onClick={() => {
                    navigate('/doctors')
                    scrollTo(0, 0)
                }}
                className='bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10'
            >
                More
            </button>

        </div>
    )
}

export default RelatedDoctors