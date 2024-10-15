import React from 'react'
import Header from '../components/Header'
import SpecilaityMenu from '../components/SpecilaityMenu'
import TopDoctors from '../components/TopDoctors'
import Banner from '../components/Banner'
 
const Home = () => {
  return (
    <div> 
      <Header />
      <SpecilaityMenu />
      <TopDoctors />
      <Banner />
    </div>
  )
}

export default Home