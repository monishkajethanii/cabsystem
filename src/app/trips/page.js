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
  X,
  Star,
  Edit,
  Send,
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

  // New state variables for modal functionality
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // "cancel", "modify", or "review"
  const [currentTrip, setCurrentTrip] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 0, comment: "" });
  const [modifyData, setModifyData] = useState({
    date: "",
    time: "",
    pickup: "",
    destination: "",
    vehicle: "",
  });
  const [cancelReason, setCancelReason] = useState("");

  // Sample trips data
  const [tripsData, setTripsData] = useState([
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
      review: null,
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
      review: null,
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
      review: null,
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
      cancellationReason: "Meeting rescheduled",
    },
  ]);

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

  // New handler functions for Cancel, Modify, and Review actions
  const handleCancelTrip = (tripId) => {
    const trip = tripsData.find((trip) => trip.id === tripId);
    setCurrentTrip(trip);
    setModalType("cancel");
    setModalOpen(true);
  };

  const handleModifyBooking = (tripId) => {
    const trip = tripsData.find((trip) => trip.id === tripId);
    setCurrentTrip(trip);
    setModifyData({
      date: trip.date,
      time: trip.time,
      pickup: trip.pickup,
      destination: trip.destination,
      vehicle: trip.vehicle,
    });
    setModalType("modify");
    setModalOpen(true);
  };

  const handleWriteReview = (tripId) => {
    const trip = tripsData.find((trip) => trip.id === tripId);
    setCurrentTrip(trip);
    setReviewData({
      rating: trip.review?.rating || 0,
      comment: trip.review?.comment || "",
    });
    setModalType("review");
    setModalOpen(true);
  };

  const submitCancelTrip = () => {
    setTripsData(
      tripsData.map((trip) =>
        trip.id === currentTrip.id
          ? { ...trip, status: "cancelled", cancellationReason: cancelReason }
          : trip
      )
    );
    setModalOpen(false);
    setCancelReason("");
    setCurrentTrip(null);
  };

  const submitModifyBooking = () => {
    setTripsData(
      tripsData.map((trip) =>
        trip.id === currentTrip.id
          ? {
              ...trip,
              date: modifyData.date,
              time: modifyData.time,
              pickup: modifyData.pickup,
              destination: modifyData.destination,
              vehicle: modifyData.vehicle,
            }
          : trip
      )
    );
    setModalOpen(false);
    setCurrentTrip(null);
  };

  const submitReview = () => {
    setTripsData(
      tripsData.map((trip) =>
        trip.id === currentTrip.id
          ? {
              ...trip,
              review: {
                rating: reviewData.rating,
                comment: reviewData.comment,
                date: new Date().toISOString().split("T")[0],
              },
            }
          : trip
      )
    );
    setModalOpen(false);
    setCurrentTrip(null);
  };

  // Modal component to handle all types of actions
  const ActionModal = () => {
    if (!modalOpen || !currentTrip) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-cab-dark">
              {modalType === "cancel"
                ? "Cancel Trip"
                : modalType === "modify"
                ? "Modify Booking"
                : "Write Review"}
            </h3>
            <button
              onClick={() => setModalOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {modalType === "cancel" && (
            <>
              <div className="mb-4">
                <p className="text-gray-600 mb-2">
                  Are you sure you want to cancel your trip from{" "}
                  <span className="font-medium">{currentTrip.pickup}</span> to{" "}
                  <span className="font-medium">{currentTrip.destination}</span>
                  ?
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                  <p>
                    Cancellation fee may apply depending on how close to the
                    scheduled time you are cancelling.
                  </p>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for cancellation (optional)
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cab-blue focus:border-transparent"
                  rows="3"
                  placeholder="Please let us know why you're cancelling..."
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Keep Booking
                </button>
                <button
                  onClick={submitCancelTrip}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Cancel Trip
                </button>
              </div>
            </>
          )}

          {modalType === "modify" && (
            <>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={modifyData.date}
                    onChange={(e) =>
                      setModifyData((prev) => ({
                        ...prev,
                        date: e.target.value,
                      }))
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cab-blue focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={modifyData.time}
                    onChange={(e) =>
                      setModifyData((prev) => ({
                        ...prev,
                        time: e.target.value,
                      }))
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cab-blue focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pickup Location
                  </label>
                  <input
                    type="text"
                    value={modifyData.pickup}
                    onChange={(e) =>
                      setModifyData((prev) => ({
                        ...prev,
                        pickup: e.target.value,
                      }))
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cab-blue focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Destination
                  </label>
                  <input
                    type="text"
                    value={modifyData.destination}
                    onChange={(e) =>
                      setModifyData((prev) => ({
                        ...prev,
                        destination: e.target.value,
                      }))
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cab-blue focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vehicle Type
                  </label>
                  <select
                    value={modifyData.vehicle}
                    onChange={(e) =>
                      setModifyData((prev) => ({
                        ...prev,
                        vehicle: e.target.value,
                      }))
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cab-blue focus:border-transparent bg-white"
                  >
                    <option value="Executive Sedan">Executive Sedan</option>
                    <option value="Premium SUV">Premium SUV</option>
                    <option value="Luxury Van">Luxury Van</option>
                    <option value="Standard Sedan">Standard Sedan</option>
                    <option value="Luxury Limousine">Luxury Limousine</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={submitModifyBooking}
                  className="px-4 py-2 bg-cab-blue text-white rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </>
          )}

          {modalType === "review" && (
            <>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rate your experience with {currentTrip.driver}
                  </label>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() =>
                          setReviewData((prev) => ({ ...prev, rating: star }))
                        }
                        className="focus:outline-none"
                      >
                        <Star
                          className={`h-8 w-8 ${
                            star <= reviewData.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Review
                  </label>
                  <textarea
                    value={reviewData.comment}
                    onChange={(e) =>
                      setReviewData((prev) => ({
                        ...prev,
                        comment: e.target.value,
                      }))
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cab-blue focus:border-transparent"
                    rows="4"
                    placeholder="Tell us about your experience..."
                  ></textarea>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={submitReview}
                  className="px-4 py-2 bg-cab-blue text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Submit Review
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
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
                  onClick={() => {
                    const headers = [
                      "Date",
                      "Time",
                      "Pickup",
                      "Destination",
                      "Driver",
                      "Vehicle",
                      "Status",
                      "Price",
                      "Distance",
                      "Duration",
                      "Payment Method",
                    ];

                    const rows = sortedTrips.map((trip) => [
                      formatDate(trip.date),
                      trip.time,
                      trip.pickup,
                      trip.destination,
                      trip.driver,
                      trip.vehicle,
                      trip.status,
                      trip.price.toFixed(2),
                      trip.distance,
                      trip.duration,
                      trip.paymentMethod,
                    ]);

                    const csvContent = [headers, ...rows]
                      .map((row) =>
                        row
                          .map(
                            (cell) => `"${String(cell).replace(/"/g, '""')}"`
                          )
                          .join(",")
                      )
                      .join("\n");

                    const blob = new Blob([csvContent], {
                      type: "text/csv;charset=utf-8;",
                    });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.setAttribute("href", url);
                    link.setAttribute("download", "trip_history.csv");
                    link.click();
                  }}
                  className="flex items-center text-blue-600 hover:text-blue-900 transition-all-200"
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
                            {trip.status === "cancelled" &&
                              trip.cancellationReason && (
                                <div className="text-xs text-gray-500 mt-1">
                                  Reason: {trip.cancellationReason}
                                </div>
                              )}
                            {trip.status === "completed" && trip.review && (
                              <div className="flex items-center mt-1">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-3 w-3 ${
                                        i < trip.review.rating
                                          ? "text-yellow-400 fill-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            )}
                          </td>
                          <td>
                            {trip.status === "upcoming" && (
                              <>
                                <button
                                  onClick={() => handleModifyBooking(trip.id)}
                                  className="px-4 py-2 text-sm text-yellow-800 rounded-lg font-medium hover:bg-yellow-100 transition-all-200 flex items-center justify-center"
                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  Modify Booking
                                </button>
                                <button
                                  onClick={() => handleCancelTrip(trip.id)}
                                  className="px-4 py-2 text-sm  text-red-800 rounded-lg font-medium hover:bg-red-100 transition-all-200"
                                >
                                  Cancel Booking
                                </button>
                              </>
                            )}
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
                                      <button
                                        onClick={() =>
                                          handleModifyBooking(trip.id)
                                        }
                                        className="px-4 py-2 text-sm bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg font-medium hover:bg-yellow-100 transition-all-200 flex items-center justify-center"
                                      >
                                        <Edit className="h-4 w-4 mr-1" />
                                        Modify Booking
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleCancelTrip(trip.id)
                                        }
                                        className="px-4 py-2 text-sm bg-red-50 border border-red-200 text-red-800 rounded-lg font-medium hover:bg-red-100 transition-all-200"
                                      >
                                        Cancel Booking
                                      </button>
                                    </>
                                  )}

                                  {trip.status === "completed" && (
                                    <button
                                      onClick={() => handleWriteReview(trip.id)}
                                      className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-all-200 flex items-center justify-center"
                                    >
                                      {trip.review ? (
                                        <>
                                          <Edit className="h-4 w-4 mr-1" />
                                          Edit Review
                                        </>
                                      ) : (
                                        <>
                                          <Star className="h-4 w-4 mr-1" />
                                          Write Review
                                        </>
                                      )}
                                    </button>
                                  )}

                                  {trip.status === "cancelled" &&
                                    trip.cancellationReason && (
                                      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                        <p className="text-xs text-gray-500 mb-1">
                                          Cancellation Reason
                                        </p>
                                        <p className="text-sm text-gray-800">
                                          {trip.cancellationReason}
                                        </p>
                                      </div>
                                    )}

                                  {trip.status === "completed" &&
                                    trip.review && (
                                      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                        <div className="flex items-center mb-1">
                                          <p className="text-xs text-gray-500 mr-2">
                                            Your Rating
                                          </p>
                                          <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                              <Star
                                                key={i}
                                                className={`h-3 w-3 ${
                                                  i < trip.review.rating
                                                    ? "text-yellow-400 fill-yellow-400"
                                                    : "text-gray-300"
                                                }`}
                                              />
                                            ))}
                                          </div>
                                        </div>
                                        <p className="text-sm text-gray-800">
                                          {trip.review.comment}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                          Submitted on{" "}
                                          {formatDate(trip.review.date)}
                                        </p>
                                      </div>
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

      {/* Modal for Cancel, Modify, and Review actions */}
      <ActionModal />
    </>
  );
};

export default Trips;
