"use client"
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function Hero() {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const animateElement = (element, delay) => {
      if (element) {
        setTimeout(() => {
          element.classList.add('opacity-100');
          element.classList.remove('opacity-0');
        }, delay);
      }
    };

    animateElement(titleRef.current, 0);
    animateElement(subtitleRef.current, 300);
    animateElement(ctaRef.current, 600);
    animateElement(imageRef.current, 900);
  }, []);

  return (
    <div className="pt-32 pb-16 px-6 md:min-h-[90vh] flex flex-col justify-center bg-gradient-to-br from-white to-gray-100">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <h1 
            ref={titleRef}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight opacity-0 transition-opacity duration-1000"
          >
            Premium Cab <span className="text-blue-600">Management</span> System
          </h1>
          
          <p 
            ref={subtitleRef}
            className="text-xl text-gray-600 max-w-xl opacity-0 transition-opacity duration-1000"
          >
            Streamline your fleet operations with our intuitive dashboard. Track vehicles, manage drivers, and optimize bookings all in one place.
          </p>
          
          <div ref={ctaRef} className="pt-4 opacity-0 transition-opacity duration-1000">
            <Link 
              href="/booking" 
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg text-lg font-medium shadow-lg hover:shadow-xl hover:bg-blue-700 transform hover:-translate-y-1 transition-all duration-300"
            >
              Book a Ride
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
        
        <div 
          ref={imageRef}
          className="relative h-[300px] md:h-[400px] lg:h-[500px] opacity-0 transition-opacity duration-1000"
        >
          <div className="absolute inset-0 bg-white bg-opacity-50 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-blue-100/10 rounded-2xl"></div>
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-blue-100/20 to-transparent"></div>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-blue-50 rounded-lg shadow-inner">
                <img src="/fleet.jpg" alt="" className='h-100 w-120' />
              </div>
            </div>
            
            <div className="absolute bottom-6 left-0 right-0 text-center text-gray-600">
              <p className="font-medium">Fleet Management Made Simple</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}