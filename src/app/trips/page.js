"use client";
import React, { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Filter,
  Download,
  Search,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Header from "../Header";

const Trips = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [expandedTrip, setExpandedTrip] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });

  // Sample trips data
  const tripsData = [
    {
      id: 1,
      date: "2023-08-15",
      time: "14:30",
      pickup: "123 Business Ave., San Francisco",
      destination: "SFO Airport Terminal 2",
      driver: "Alex Johnson",
      vehicle: "Executive Sedan",
      status: "completed",
      price: 75.8,
      distance: 14.2,
      duration: 38,
      paymentMethod: "Credit Card",
    },
    {
      id: 2,
      date: "2023-08-22",
      time: "09:15",
      pickup: "Grand Hotel, Union Square",
      destination: "Moscone Convention Center",
      driver: "Samantha Lee",
      vehicle: "Premium SUV",
      status: "completed",
      price: 92.5,
      distance: 2.8,
      duration: 15,
      paymentMethod: "PayPal",
    },
    {
      id: 3,
      date: "2023-09-03",
      time: "18:45",
      pickup: "Office Park Tower, Financial District",
      destination: "Residential Heights, Nob Hill",
      driver: "Michael Brown",
      vehicle: "Executive Sedan",
      status: "completed",
      price: 65.2,
      distance: 3.5,
      duration: 22,
      paymentMethod: "Credit Card",
    },
    {
      id: 4,
      date: "2023-09-10",
      time: "11:00",
      pickup: "Downtown Plaza, Market Street",
      destination: "Riverfront Restaurant, Embarcadero",
      driver: "Olivia Wilson",
      vehicle: "Luxury Van",
      status: "upcoming",
      price: 110.0,
      distance: 1.8,
      duration: 12,
      paymentMethod: "Cash",
    },
    {
      id: 5,
      date: "2023-09-18",
      time: "15:30",
      pickup: "Tech Campus, South Bay",
      destination: "Luxury Hotel, Nob Hill",
      driver: "David Chen",
      vehicle: "Premium SUV",
      status: "upcoming",
      price: 135.75,
      distance: 18.5,
      duration: 45,
      paymentMethod: "Credit Card",
    },
    {
      id: 6,
      date: "2023-08-05",
      time: "08:00",
      pickup: "Residential Apartment, Marina District",
      destination: "Corporate Office, Financial District",
      driver: "Emily Rodriguez",
      vehicle: "Executive Sedan",
      status: "cancelled",
      price: 48.25,
      distance: 4.2,
      duration: 18,
      paymentMethod: "PayPal",
    },
  ];

  // Format date to MM/DD/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  // Filter trips based on search term, status, and date range
  const filteredTrips = tripsData.filter((trip) => {
    // Search term filter
    const searchMatch =
      trip.pickup.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.driver.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const statusMatch = filterStatus === "all" || trip.status === filterStatus;

    // Date range filter
    let dateMatch = true;
    if (dateRange.from) {
      dateMatch = dateMatch && trip.date >= dateRange.from;
    }
    if (dateRange.to) {
      dateMatch = dateMatch && trip.date <= dateRange.to;
    }

    return searchMatch && statusMatch && dateMatch;
  });

  // Sort trips based on sortConfig
  const sortedTrips = [...filteredTrips].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  // Toggle trip details expansion
  const toggleExpand = (tripId) => {
    if (expandedTrip === tripId) {
      setExpandedTrip(null);
    } else {
      setExpandedTrip(tripId);
    }
  };

  // Handle sorting
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Get status color and label
  const getStatusInfo = (status) => {
    switch (status) {
      case "completed":
        return { color: "bg-green-100 text-green-800", label: "Completed" };
      case "upcoming":
        return { color: "bg-blue-100 text-blue-800", label: "Upcoming" };
      case "cancelled":
        return { color: "bg-red-100 text-red-800", label: "Cancelled" };
      case "inprogress":
        return { color: "bg-yellow-100 text-yellow-800", label: "In Progress" };
      default:
        return { color: "bg-gray-100 text-gray-800", label: status };
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setFilterStatus("all");
    setDateRange({ from: "", to: "" });
  };

  return (
    <>
      <Header />
      <div className="pt-22 pb-16 px-6 min-h-screen bg-gradient-to-br from-white to-blue-300">
        <div className="max-w-7xl mx-auto animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-cab-dark mb-4">
              Trip History
            </h1>
            <p className="text-gray-600 max-w-3xl mx-auto">
              View, search, and manage your past and upcoming trips.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-cab-dark mb-4 flex items-center">
                <Filter className="mr-2 h-5 w-5 text-cab-blue" />
                Search & Filter
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search trips..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cab-blue focus:border-transparent transition-all-200"
                  />
                </div>

                <div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cab-blue focus:border-transparent transition-all-200 bg-white"
                  >
                    <option value="all">All Statuses</option>
                    <option value="completed">Completed</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="inprogress">In Progress</option>
                  </select>
                </div>

                <div className="relative">
                  <Calendar className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    placeholder="From Date"
                    value={dateRange.from}
                    onChange={(e) =>
                      setDateRange((prev) => ({
                        ...prev,
                        from: e.target.value,
                      }))
                    }
                    className="pl-10 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cab-blue focus:border-transparent transition-all-200"
                  />
                </div>

                <div className="relative">
                  <Calendar className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    placeholder="To Date"
                    value={dateRange.to}
                    onChange={(e) =>
                      setDateRange((prev) => ({ ...prev, to: e.target.value }))
                    }
                    className="pl-10 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cab-blue focus:border-transparent transition-all-200"
                  />
                </div>
              </div>

              <div className="flex justify-between mt-4">
                <button
                  onClick={clearFilters}
                  className="text-cab-blue hover:text-cab-dark transition-all-200"
                >
                  Clear Filters
                </button>

                <button
                  onClick={() => {}}
                  className="flex items-center text-cab-blue hover:text-cab-dark transition-all-200"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Export Trips
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <button
                        className="flex items-center"
                        onClick={() => requestSort("date")}
                      >
                        Date & Time
                        {sortConfig.key === "date" &&
                          (sortConfig.direction === "asc" ? (
                            <ChevronUp className="h-4 w-4 ml-1" />
                          ) : (
                            <ChevronDown className="h-4 w-4 ml-1" />
                          ))}
                      </button>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Route
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <button
                        className="flex items-center"
                        onClick={() => requestSort("driver")}
                      >
                        Driver
                        {sortConfig.key === "driver" &&
                          (sortConfig.direction === "asc" ? (
                            <ChevronUp className="h-4 w-4 ml-1" />
                          ) : (
                            <ChevronDown className="h-4 w-4 ml-1" />
                          ))}
                      </button>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <button
                        className="flex items-center"
                        onClick={() => requestSort("price")}
                      >
                        Price
                        {sortConfig.key === "price" &&
                          (sortConfig.direction === "asc" ? (
                            <ChevronUp className="h-4 w-4 ml-1" />
                          ) : (
                            <ChevronDown className="h-4 w-4 ml-1" />
                          ))}
                      </button>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <button
                        className="flex items-center"
                        onClick={() => requestSort("status")}
                      >
                        Status
                        {sortConfig.key === "status" &&
                          (sortConfig.direction === "asc" ? (
                            <ChevronUp className="h-4 w-4 ml-1" />
                          ) : (
                            <ChevronDown className="h-4 w-4 ml-1" />
                          ))}
                      </button>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedTrips.length > 0 ? (
                    sortedTrips.map((trip) => (
                      <React.Fragment key={trip.id}>
                        <tr
                          className={`hover:bg-gray-50 transition-all-200 ${
                            expandedTrip === trip.id ? "bg-gray-50" : ""
                          }`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-900">
                                {formatDate(trip.date)}
                              </span>
                            </div>
                            <div className="flex items-center mt-1">
                              <Clock className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-500">
                                {trip.time}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-start">
                              <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                              <div>
                                <div className="text-sm text-gray-900 line-clamp-1">
                                  {trip.pickup}
                                </div>
                                <div className="text-sm text-gray-500 mt-1 line-clamp-1">
                                  {trip.destination}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {trip.driver}
                            </div>
                            <div className="text-sm text-gray-500">
                              {trip.vehicle}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              ${trip.price.toFixed(2)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 text-xs rounded-full ${
                                getStatusInfo(trip.status).color
                              }`}
                            >
                              {getStatusInfo(trip.status).label}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                            <button
                              className="text-cab-blue hover:text-cab-dark font-medium transition-all-200"
                              onClick={() => toggleExpand(trip.id)}
                            >
                              {expandedTrip === trip.id
                                ? "Hide Details"
                                : "View Details"}
                            </button>
                          </td>
                        </tr>

                        {expandedTrip === trip.id && (
                          <tr className="bg-gray-50">
                            <td colSpan="6" className="px-6 py-4">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                                    Trip Details
                                  </h4>
                                  <div className="space-y-3">
                                    <div>
                                      <p className="text-xs text-gray-500">
                                        Distance
                                      </p>
                                      <p className="text-sm font-medium text-gray-900">
                                        {trip.distance} miles
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500">
                                        Duration
                                      </p>
                                      <p className="text-sm font-medium text-gray-900">
                                        {trip.duration} minutes
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                                    Payment Information
                                  </h4>
                                  <div className="space-y-3">
                                    <div>
                                      <p className="text-xs text-gray-500">
                                        Payment Method
                                      </p>
                                      <p className="text-sm font-medium text-gray-900">
                                        {trip.paymentMethod}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500">
                                        Total Cost
                                      </p>
                                      <p className="text-sm font-medium text-gray-900">
                                        ${trip.price.toFixed(2)}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex flex-col space-y-3">
                                  <button className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-all-200">
                                    Download Receipt
                                  </button>

                                  {trip.status === "upcoming" && (
                                    <>
                                      <button className="px-4 py-2 text-sm bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg font-medium hover:bg-yellow-100 transition-all-200">
                                        Modify Booking
                                      </button>
                                      <button className="px-4 py-2 text-sm bg-red-50 border border-red-200 text-red-800 rounded-lg font-medium hover:bg-red-100 transition-all-200">
                                        Cancel Booking
                                      </button>
                                    </>
                                  )}

                                  {trip.status === "completed" && (
                                    <button className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-all-200">
                                      Write Review
                                    </button>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        No trips found matching your search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Trips;
