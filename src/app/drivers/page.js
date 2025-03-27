"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Phone,
  Calendar,
  Users,
  ArrowUpDown,
} from "lucide-react";
import Header from "../Header";
import axios from "axios";

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  // Fetch drivers from API
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/getDrivers",
          {
            headers: {
              "Content-Type": "application/json",
              auth: "ZjVGZPUtYW1hX2FuZHJvaWRfMjAyMzY0MjU=",
            },
          }
        );
        setDrivers(response.data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch drivers");
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  // Function to render stars (kept from previous implementation)
  const renderStars = (rating) => {
    // Assign a random rating between 4.5 and 5 since we don't have ratings in the new data
    const randomRating = Math.random() * 0.5 + 4.5;
    return [...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(randomRating) ? "text-yellow-400" : "text-gray-300"
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  // Filter drivers based on search term
  const filteredDrivers = drivers.filter(
    (driver) =>
      `${driver.firstname} ${driver.lastname}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      driver.vtype.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort drivers based on sortBy and sortDirection
  const sortedDrivers = [...filteredDrivers].sort((a, b) => {
    if (sortBy === "name") {
      return sortDirection === "asc"
        ? a.firstname.localeCompare(b.firstname)
        : b.firstname.localeCompare(a.firstname);
    } else if (sortBy === "vtype") {
      return sortDirection === "asc"
        ? a.vtype.localeCompare(b.vtype)
        : b.vtype.localeCompare(a.vtype);
    }
    return 0;
  });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  // Get availability status color (simulated)
  const getStatusColor = () => {
    const statuses = ["Available", "On Trip", "Off Duty"];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    switch (randomStatus) {
      case "Available":
        return "bg-green-100 text-green-800";
      case "On Trip":
        return "bg-blue-100 text-blue-800";
      case "Off Duty":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Calculate years of experience based on vehicle year
  const calculateExperience = (vyear) => {
    const currentYear = new Date().getFullYear();
    return `${currentYear - parseInt(vyear)} years`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading drivers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="pt-22 pb-16 px-6 min-h-screen bg-gradient-to-br from-white to-blue-300">
        <div className="max-w-7xl mx-auto animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Our Professional Drivers
            </h1>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Meet our team of experienced and highly-rated professional
              drivers, dedicated to providing exceptional service.
            </p>
          </div>

          <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-auto">
              <Search className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, vehicle type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full md:w-80 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all-200"
              />
            </div>

            <div className="flex gap-2 self-end">
              <span className="text-gray-500 self-center">Sort by:</span>
              <button
                onClick={() => handleSort("name")}
                className={`flex items-center px-3 py-2 rounded-md text-sm ${
                  sortBy === "name"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                Name
                {sortBy === "name" && <ArrowUpDown className="h-3 w-3 ml-1" />}
              </button>
              <button
                onClick={() => handleSort("vtype")}
                className={`flex items-center px-3 py-2 rounded-md text-sm ${
                  sortBy === "vtype"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                Vehicle Type
                {sortBy === "vtype" && <ArrowUpDown className="h-3 w-3 ml-1" />}
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
                      <img
                        src="/driver4.jpg"
                        alt={`${driver.firstname} ${driver.lastname}`}
                        className="w-18 h-18 rounded-full"
                      />
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-gray-800">
                        {driver.firstname} {driver.lastname}
                      </h2>
                      <div className="flex items-center mt-1">
                        {renderStars()}
                        <span className="ml-1 text-gray-600 text-sm">4.8</span>
                      </div>
                    </div>

                    <div className="ml-auto">
                      <span
                        className={`px-3 py-1 text-xs rounded-full ${getStatusColor()}`}
                      >
                        Available
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
                        <p className="font-medium">
                          {calculateExperience(driver.vyear)}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Birth Date</p>
                      <div className="flex items-center mt-1">
                        <Users className="h-4 w-4 text-blue-500 mr-2" />
                        <p className="font-medium">{driver.dob}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Vehicle Details</p>
                    <p className="font-medium">
                      {driver.vtype} • {driver.vmodel} • {driver.vplate}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">License Details</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="px-2 py-1 bg-blue-100 text-cab-dark text-xs rounded-full">
                        {driver.licenseno}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-cab-dark text-xs rounded-full">
                        Expires: {driver.license_expiry}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <a
                      href={`tel:${driver.phoneno}`}
                      className="flex items-center text-blue-500 hover:text-gray-800 transition-all-200"
                    >
                      <Phone className="h-4 w-4 mr-1" />
                      <span>Contact</span>
                    </a>

                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all-200">
                      <a href="/booking">Book This Driver</a>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {sortedDrivers.length === 0 && (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <p className="text-gray-500">
                No drivers found matching your search criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Drivers;
