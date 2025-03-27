"use client"
import React, { useRef, useEffect } from 'react';

const DriverSection = () => {
  const sectionRef = useRef(null);
  
  // Sample drivers data
  const drivers = [
    {
      id: 1,
      name: 'Alex Johnson',
      image: '/driver.jpg',
      rating: 4.9,
      trips: 583,
      experience: '5 years',
      languages: ['English', 'Spanish'],
    },
    {
      id: 2,
      name: 'Samantha Lee',
      image: '/driver2.jpg',
      rating: 4.8,
      trips: 472,
      experience: '4 years',
      languages: ['English', 'Chinese'],
    },
    {
      id: 3,
      name: 'Michael Brown',
      image: '/driver4.jpg',
      rating: 4.7,
      trips: 621,
      experience: '6 years',
      languages: ['English', 'French'],
    },
    {
      id: 4,
      name: 'Olivia Wilson',
      image: '/driver3.jpg',
      rating: 4.9,
      trips: 389,
      experience: '3 years',
      languages: ['English', 'Italian'],
    },
  ];
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          sectionRef.current.classList.add('animate-fade-up');
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Function to render stars
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <section className="py-16 px-6 bg-gradient-to-br from-white to-blue-300">
      <div 
        ref={sectionRef}
        className="max-w-7xl mx-auto"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Professional Drivers</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">Meet our experienced and highly-rated professional drivers.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {drivers.map((driver) => (
            <div 
              key={driver.id} 
              className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-all duration-300"
            >
              <div className="p-1 bg-gradient-to-r from-blue-500/20 to-blue-500/5">
                <div className="bg-white rounded-lg p-4 flex flex-col items-center">
                  <div className="bg-gray-200 rounded-full mb-4 flex items-center justify-center">
                    <img src={driver.image} alt="" className='rounded-full w-24 h-24'/>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900">{driver.name}</h3>
                  
                  <div className="flex items-center mt-2">
                    {renderStars(driver.rating)}
                    <span className="ml-1 text-gray-600 text-sm">{driver.rating}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Experience</p>
                    <p className="font-medium text-gray-900">{driver.experience}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Trips</p>
                    <p className="font-medium text-gray-900">{driver.trips}+</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Languages</p>
                  <div className="flex flex-wrap gap-2">
                    {driver.languages.map((lang, index) => (
                      <span 
                        key={index} 
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
                
                <button className="w-full py-2 mt-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-200">
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DriverSection;