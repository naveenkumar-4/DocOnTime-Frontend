import React, { useEffect, useState } from 'react'
import { createContext } from "react";
// import { doctors } from "../assets/assets_frontend/assets";
import axios from 'axios'
import { toast } from 'react-toastify'

export const AppContext = createContext()


const AppContextProvider = (props) => {

    const currencySymbol = '$';
    const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:4000"

    const [doctors, setDoctors] = useState([])
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : false);
    const [userData, setUserData] = useState(false)


    const getDoctorsData = async () => {
        try {
            console.log(backendUrl)

            const { data } = await axios.get(backendUrl + '/api/doctor/list')
            if (data.success) {
                setDoctors(data.doctors)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error.message)
            toast.error(error.message)
        }
    }


    const loadUserProfileData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/get-profile', { headers: { token } })
            // console.log(data)
            if (data.success) {
                setUserData(data.userData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error.message)
            toast.error(error.message)
        }
    }
    // console.log(userData)

    const contextValues = {
        doctors,
        currencySymbol,
        getDoctorsData,
        token, setToken,
        backendUrl,
        userData, setUserData,
        loadUserProfileData
    }

    useEffect(() => {
        getDoctorsData()
    }, [])

    useEffect(() => {
        if (token) {
            loadUserProfileData()
        } else {
            setUserData(false)
        }
    }, [token])

    return (
        <AppContext.Provider value={contextValues}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider