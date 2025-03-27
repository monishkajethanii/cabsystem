"use client";
import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function VehicleShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const showcaseRef = useRef(null);

  // Sample vehicles data
  const vehicles = [
    {
      id: 1,
      name: "Executive Sedan",
      description: "Luxury sedan with premium amenities for business travel.",
      details: ["4 passengers", "Leather seats", "WiFi", "Bottled water"],
      price: "$75",
    },
    {
      id: 2,
      name: "Premium SUV",
      description: "Spacious SUV for groups and extra luggage capacity.",
      details: ["6 passengers", "Leather seats", "WiFi", "USB charging"],
      price: "$95",
    },
    {
      id: 3,
      name: "Luxury Van",
      description: "Perfect for larger groups traveling together.",
      details: [
        "10 passengers",
        "Comfortable seating",
        "Extra luggage space",
        "USB charging",
      ],
      price: "$120",
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            showcaseRef.current.classList.remove('opacity-0');
            showcaseRef.current.classList.add('animate-fade-up');
          }
        },
        { threshold: 0.2 }
      );

    if (showcaseRef.current) {
      observer.observe(showcaseRef.current);
    }

    return () => {
      if (showcaseRef.current) {
        observer.unobserve(showcaseRef.current);
      }
    };
  }, []);

  const nextVehicle = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % vehicles.length);
  };

  const prevVehicle = () => {
    setActiveIndex(
      (prevIndex) => (prevIndex - 1 + vehicles.length) % vehicles.length
    );
  };

  return (
    <section className="py-16 px-6 bg-gray-50 text-black">
      <div ref={showcaseRef} className="max-w-7xl mx-auto animate-fade-in">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Premium Fleet
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Choose from our selection of luxury vehicles for your transportation
            needs.
          </p>
        </div>

        <div className="relative">
          <div className="flex justify-between items-center">
            <button
              onClick={prevVehicle}
              className="p-2 rounded-full bg-white shadow-md hover:bg-blue-600 hover:text-white transition-all duration-200 z-10"
              aria-label="Previous vehicle"
            >
              <ChevronLeft size={24} />
            </button>

            <div className="overflow-hidden px-4 md:px-12 py-8 w-full">
              <div
                className="transition-all duration-300 flex"
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              >
                {vehicles.map((vehicle) => (
                  <div key={vehicle.id} className="min-w-full px-4">
                    <div className="bg-white bg-opacity-50 backdrop-blur-md p-8 h-full flex flex-col md:flex-row gap-8 items-center rounded-lg shadow-md">
                      <div className="w-full md:w-1/2 h-[200px] bg-white rounded-xl shadow-inner flex items-center justify-center">
                        <img src="/fleet.jpg" alt="" />
                      </div>

                      <div className="w-full md:w-1/2 space-y-4">
                        <h3 className="text-2xl font-bold text-gray-900">
                          {vehicle.name}
                        </h3>
                        <p className="text-gray-600">{vehicle.description}</p>

                        <ul className="space-y-2">
                          {vehicle.details.map((detail, index) => (
                            <li key={index} className="flex items-center">
                              <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="pt-4">
                          <span className="text-2xl font-bold text-blue-600">
                            {vehicle.price}
                          </span>
                          <span className="text-gray-500 ml-1">/hour</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={nextVehicle}
              className="p-2 rounded-full bg-white shadow-md hover:bg-blue-600 hover:text-white transition-all duration-200 z-10"
              aria-label="Next vehicle"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <div className="flex justify-center space-x-2 mt-6">
            {vehicles.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  activeIndex === index
                    ? "bg-blue-600 scale-110"
                    : "bg-gray-300"
                }`}
                aria-label={`Go to vehicle ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
