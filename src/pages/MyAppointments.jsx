import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const MyAppointments = () => {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext)

  const [appointments, setAppointments] = useState([]);
  
  const navigate = useNavigate()

  const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const slotDateFormate = (slotDate) => {
    const dateArray = slotDate.split("_");
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2];
  }

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })

      if (data.success) {
        setAppointments(data.appointments.reverse())
        console.log(data.appointments)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }


  const cancelAppointment = async (appointmentId) => {
    try {
      console.log(appointmentId)

      const { data } = await axios.post(backendUrl + "/api/user/cancel-appointment", { appointmentId }, { headers: { token } })
      if (data.success) {
        toast.success(data.message);
        getUserAppointments()
        getDoctorsData()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  // Payment - step - 2
  const initPay = (order) => {
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Appointment Payment",
      description: 'Appointment Payment',
      order_id: order.id,
      recept: order.receipt,
      handler: async (response) => {

        try {

          console.log(response)
          // console.log(response.razorpay_order_id)
          const { data } = await axios.post(backendUrl + '/api/user/verify-razorpay', response, { headers: { token } })
          if (data.success) {
            getUserAppointments()
            navigate('/my-appointments')
          }

        } catch (error) {
          console.log(error)
          toast.error(error.message)
        }
      }
    }

    // Payment - step - 4
    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  // Payment - step - 1
  const appointmentRazorpay = async (appointmentId) => {

    try {

      const { data } = await axios.post(backendUrl + '/api/user/payment-razorpay', { appointmentId }, { headers: { token } })
      if (data.success) {
        console.log(data.order)
        // Payment - step - 3
        initPay(data.order)

      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }

  }

  useEffect(() => {
    if (token) {
      getUserAppointments()
    }
  }, [token])

  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My Appointments</p>
      <div>
        {appointments.map((appointment, index) => (
          <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b' key={index}>
            <div>
              <img className='w-32 bg-indigo-50 ' src={appointment.docData.image} alt="" />
            </div>
            <div className='flex-1 text-sm text-zinc-600'>
              <p className='text-neutral-800 font-semibold'>{appointment.docData.name}</p>
              <p>{appointment.docData.speciality}</p>
              <p className='text-zinc-700 font-medium mt-1'>Address: </p>
              <p className='text-xs'>{appointment.docData.address.line1}</p>
              <p className='text-xs'>{appointment.docData.address.line2}</p>
              <p className='text-xs mt-1'><span className='text-sm text-neutral-700  font-medium'>Date & Time </span>{slotDateFormate(appointment.slotDate)} | {appointment.slotTime}</p>
            </div>
            <div></div>
            <div className='flex flex-col gap-2 justify-end'>
              {!appointment.cancelled && appointment.payment && !appointment.isCompleted && <button className='sm:min-w-48 py-2 border rounded text-stone-500 bg-indigo-50'>Paid</button>}
              {!appointment.cancelled && !appointment.payment && !appointment.isCompleted && <button onClick={() => { appointmentRazorpay(appointment._id) }} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer'>Pay Online</button>}
              {!appointment.cancelled && !appointment.isCompleted && <button onClick={() => cancelAppointment(appointment._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300 cursor-pointer'>Cancel Appointment</button>}
              {appointment.cancelled && !appointment.isCompleted && <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500'>Appointment Cancelled</button>}
              {appointment.isCompleted && <button className='sm:min-w-48 py-2 border border-green-500 text-green-500 rounded' >Completed</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyAppointments