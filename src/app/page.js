import React from 'react'
import Hero from './Hero'
import VehicleShowcase from './VehicleShowcase'
import DriverSection from './DriverSection'
import Header from './Header'
import Footer from './Footer'

export default function page() {
  return (
    <div className='min-h-screen'>
      <Header/>
      <Hero/>
      <VehicleShowcase/>
      <DriverSection/>
      <Footer/>
    </div>
  )
}
