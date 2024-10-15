import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom';

const RealtedDoctors = ({ docId, speciality }) => {
    const { doctors } = useContext(AppContext);

    const navigate = useNavigate()


    const [relDoc, setRelDoc] = useState([])

    useEffect(() => {
        if (doctors.length > 0 && speciality) {
            const doctorData = doctors.filter((doctor, index) => doctor.speciality === speciality && doctor._id !== docId)
            setRelDoc(doctorData)
        }
    }, [doctors, speciality, docId])
    return (
        <div className="flex flex-col items-center gap-4 my-16 text-[#262626] md:mx-10">
            <h1 className='text-3xl font-medium'>Related Doctors</h1>
            <p className='sm:w-1/3 text-center text-sm'>Simply browse through our extensive list of trusted doctors.</p>
            <div className='w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3  sm:px-0'>
                {relDoc.slice(0, 5).map((doctor, index) => (
                    <div onClick={() => { navigate(`/appointment/${doctor._id}`); window.scrollTo(0, 0) }} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-300' key={index}>
                        <img className='bg-blue-50' src={doctor.image} alt="" />
                        <div className='p-4'>
                            <div className={`flex items-center gap-2 text-sm text-center ${doctor.available ? 'text-green-500' : 'text-gray-500'} `}>
                                <p className={`w-2 h-2 rounded-full ${doctor.available ? 'bg-green-500 ' : 'bg-gray-500'}`}></p><p>{doctor.available ? "Available" : "Not Available"}</p>
                            </div>
                            <p className='text-gray-900 text-lg font-medium'>{doctor.name}</p>
                            <p className='text-gray-600 text-sm'>{doctor.speciality}</p>
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={() => { navigate('/doctors'); window.scrollTo(0, 0) }} className='bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10'>more</button>
        </div>
    )
}

export default RealtedDoctors