"use client";
import React, { useState, useRef, useEffect } from "react";
import { Calendar, Clock, MapPin, User } from "lucide-react";

const BookingSection = () => {
  const [formData, setFormData] = useState({
    pickup: "",
    destination: "",
    date: "",
    time: "",
    passengers: "1",
    vehicleType: "sedan",
  });

  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          sectionRef.current.classList.add("animate-fade-up");
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Booking data:", formData);
    alert("Booking request submitted successfully!");
  };

  return (
    <section className="py-16 px-6 bg-white">
      <div ref={sectionRef} className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Book Your Ride
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Schedule a premium transportation service tailored to your needs.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 lg:p-12 space-y-8">
              <h3 className="text-2xl font-bold text-gray-900">
                Reservation Details
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pickup Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="pickup"
                        value={formData.pickup}
                        onChange={handleChange}
                        placeholder="Enter pickup address"
                        className="pl-10 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Destination
                    </label>
                    <div className="relative">
                      <MapPin className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="destination"
                        value={formData.destination}
                        onChange={handleChange}
                        placeholder="Enter destination address"
                        className="pl-10 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="pl-10 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time
                    </label>
                    <div className="relative">
                      <Clock className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                      <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        className="pl-10 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Passengers
                    </label>
                    <div className="relative">
                      <User className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                      <select
                        name="passengers"
                        value={formData.passengers}
                        onChange={handleChange}
                        className="pl-10 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                        required
                      >
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? "passenger" : "passengers"}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vehicle Type
                    </label>
                    <select
                      name="vehicleType"
                      value={formData.vehicleType}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                      required
                    >
                      <option value="sedan">Executive Sedan</option>
                      <option value="suv">Premium SUV</option>
                      <option value="van">Luxury Van</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium shadow-md hover:shadow-xl hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-1"
                >
                  Book Now
                </button>
              </form>
            </div>

            <div className="relative min-h-[300px] lg:min-h-[500px] overflow-hidden">
              {/* Background Layers */}
              <div className="absolute inset-0 bg-blue-500/10">
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-blue-500/30"></div>
              </div>

              {/* Content Container */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 py-8 lg:py-12">
                {/* Title */}
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 max-w-xl mx-auto">
                  Premium Experience
                </h3>

                {/* Subtitle */}
                <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto mb-8 px-4">
                  Our professional drivers and luxury vehicles ensure a
                  comfortable and reliable transportation service.
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 w-full max-w-xl px-4">
                  <div className="bg-white rounded-lg p-3 sm:p-4 shadow-md transform transition-all hover:scale-105 hover:shadow-lg">
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                      24/7
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">Service</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 sm:p-4 shadow-md transform transition-all hover:scale-105 hover:shadow-lg">
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                      100%
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Satisfaction
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3 sm:p-4 shadow-md transform transition-all hover:scale-105 hover:shadow-lg">
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                      15 min
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Response Time
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3 sm:p-4 shadow-md transform transition-all hover:scale-105 hover:shadow-lg">
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                      50+
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">Vehicles</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingSection;
