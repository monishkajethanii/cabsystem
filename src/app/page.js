import React from 'react'
import Hero from './Hero'
import VehicleShowcase from './VehicleShowcase'
import BookingSection from './BookingSection'
import DriverSection from './DriverSection'
import TripHistory from './TripHistory'
import Header from './Header'
import Footer from './Footer'

export default function page() {
  return (
    <div className='min-h-screen'>
      <Header/>
      <Hero/>
      <VehicleShowcase/>
      <BookingSection/>
      <DriverSection/>
      <TripHistory/>
      <Footer/>
    </div>
  )
}
