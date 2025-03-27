"use client"
import React, { useState } from 'react';
import { Search, MapPin, Phone, Calendar, Users, ArrowUpDown } from 'lucide-react';
import Header from '../Header';

const Drivers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  
  // Sample drivers data
  const driversData = [
    {
      id: 1,
      name: 'Alex Johnson',
      photo: '/driver.jpg',
      rating: 4.9,
      trips: 583,
      experience: '5 years',
      location: 'San Francisco',
      languages: ['English', 'Spanish'],
      phone: '+1 (555) 123-4567',
      email: 'alex.j@cabfleet.com',
      availability: 'Available',
      vehicleType: 'Executive Sedan',
      licensePlate: 'CA-1234',
    },
    {
      id: 2,
      name: 'Samantha Lee',
      photo: 'driver2.jpg',
      rating: 4.8,
      trips: 472,
      experience: '4 years',
      location: 'Los Angeles',
      languages: ['English', 'Chinese'],
      phone: '+1 (555) 234-5678',
      email: 'samantha.l@cabfleet.com',
      availability: 'On Trip',
      vehicleType: 'Premium SUV',
      licensePlate: 'CA-5678',
    },
    {
      id: 3,
      name: 'Michael Brown',
      photo: '/driver.jpg',
      rating: 4.7,
      trips: 621,
      experience: '6 years',
      location: 'San Diego',
      languages: ['English', 'French'],
      phone: '+1 (555) 345-6789',
      email: 'michael.b@cabfleet.com',
      availability: 'Available',
      vehicleType: 'Executive Sedan',
      licensePlate: 'CA-9012',
    },
    {
      id: 4,
      name: 'Olivia Wilson',
      photo: '/driver3.jpg',
      rating: 4.9,
      trips: 389,
      experience: '3 years',
      location: 'San Jose',
      languages: ['English', 'Italian'],
      phone: '+1 (555) 456-7890',
      email: 'olivia.w@cabfleet.com',
      availability: 'Off Duty',
      vehicleType: 'Luxury Van',
      licensePlate: 'CA-3456',
    },
    {
      id: 5,
      name: 'David Chen',
      photo: '/driver4.jpg',
      rating: 4.8,
      trips: 512,
      experience: '7 years',
      location: 'Oakland',
      languages: ['English', 'Mandarin'],
      phone: '+1 (555) 567-8901',
      email: 'david.c@cabfleet.com',
      availability: 'Available',
      vehicleType: 'Premium SUV',
      licensePlate: 'CA-7890',
    },
    {
      id: 6,
      name: 'Emily Rodriguez',
      photo: '/driver3.jpg',
      rating: 4.7,
      trips: 347,
      experience: '2 years',
      location: 'Sacramento',
      languages: ['English', 'Spanish'],
      phone: '+1 (555) 678-9012',
      email: 'emily.r@cabfleet.com',
      availability: 'On Trip',
      vehicleType: 'Executive Sedan',
      licensePlate: 'CA-1357',
    },
  ];
  
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
  
  // Filter drivers based on search term
  const filteredDrivers = driversData.filter(driver => 
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.vehicleType.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Sort drivers based on sortBy and sortDirection
  const sortedDrivers = [...filteredDrivers].sort((a, b) => {
    if (sortBy === 'name') {
      return sortDirection === 'asc' 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    } else if (sortBy === 'rating') {
      return sortDirection === 'asc' 
        ? a.rating - b.rating 
        : b.rating - a.rating;
    } else if (sortBy === 'trips') {
      return sortDirection === 'asc' 
        ? a.trips - b.trips 
        : b.trips - a.trips;
    } else if (sortBy === 'experience') {
      const expA = parseInt(a.experience);
      const expB = parseInt(b.experience);
      return sortDirection === 'asc' 
        ? expA - expB 
        : expB - expA;
    }
    return 0;
  });
  
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };
  
  // Get availability status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'On Trip':
        return 'bg-blue-100 text-blue-800';
      case 'Off Duty':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Header/>
    <div className="pt-22 pb-16 px-6 min-h-screen bg-gradient-to-br from-white to-blue-300">
      <div className="max-w-7xl mx-auto animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Professional Drivers</h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Meet our team of experienced and highly-rated professional drivers, dedicated to providing exceptional service.
          </p>
        </div>
        
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-auto">
            <Search className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, location, vehicle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full md:w-80 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all-200"
            />
          </div>
          
          <div className="flex gap-2 self-end">
            <span className="text-gray-500 self-center">Sort by:</span>
            <button
              onClick={() => handleSort('name')}
              className={`flex items-center px-3 py-2 rounded-md text-sm ${
                sortBy === 'name' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Name
              {sortBy === 'name' && (
                <ArrowUpDown className="h-3 w-3 ml-1" />
              )}
            </button>
            <button
              onClick={() => handleSort('rating')}
              className={`flex items-center px-3 py-2 rounded-md text-sm ${
                sortBy === 'rating' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Rating
              {sortBy === 'rating' && (
                <ArrowUpDown className="h-3 w-3 ml-1" />
              )}
            </button>
            <button
              onClick={() => handleSort('trips')}
              className={`flex items-center px-3 py-2 rounded-md text-sm ${
                sortBy === 'trips' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Trips
              {sortBy === 'trips' && (
                <ArrowUpDown className="h-3 w-3 ml-1" />
              )}
            </button>
            <button
              onClick={() => handleSort('experience')}
              className={`flex items-center px-3 py-2 rounded-md text-sm ${
                sortBy === 'experience' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Experience
              {sortBy === 'experience' && (
                <ArrowUpDown className="h-3 w-3 ml-1" />
              )}
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedDrivers.map((driver) => (
            <div 
              key={driver.id} 
              className="bg-white rounded-xl shadow-lg overflow-hidden animate-scale-up transition-all-300 hover:shadow-xl"
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="bg-gray-100 rounded-full mr-4 flex items-center justify-center text-gray-400">
                    <img src={driver.photo} alt=""  className='w-18 h-18 rounded-full'/>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{driver.name}</h2>
                    <div className="flex items-center mt-1">
                      {renderStars(driver.rating)}
                      <span className="ml-1 text-gray-600 text-sm">{driver.rating}</span>
                    </div>
                  </div>
                  
                  <div className="ml-auto">
                    <span className={`px-3 py-1 text-xs rounded-full ${getStatusColor(driver.availability)}`}>
                      {driver.availability}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Experience</p>
                    <div className="flex items-center mt-1">
                      <Calendar className="h-4 w-4 text-blue-500 mr-2" />
                      <p className="font-medium">{driver.experience}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Trips Completed</p>
                    <div className="flex items-center mt-1">
                      <Users className="h-4 w-4 text-blue-500 mr-2" />
                      <p className="font-medium">{driver.trips}+</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <div className="flex items-center mt-1">
                    <MapPin className="h-4 w-4 text-blue-500 mr-2" />
                    <p className="font-medium">{driver.location}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Vehicle</p>
                  <p className="font-medium">{driver.vehicleType} • {driver.licensePlate}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Languages</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {driver.languages.map((lang, index) => (
                      <span 
                        key={index} 
                        className="px-2 py-1 bg-blue-100 text-cab-dark text-xs rounded-full"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="pt-2 flex items-center justify-between">
                  <a 
                    href={`tel:${driver.phone}`} 
                    className="flex items-center text-blue-500 hover:text-gray-800 transition-all-200"
                  >
                    <Phone className="h-4 w-4 mr-1" />
                    <span>Contact</span>
                  </a>
                  
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all-200">
                    Book This Driver
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {sortedDrivers.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <p className="text-gray-500">No drivers found matching your search criteria.</p>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default Drivers;
