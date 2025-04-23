"use client";
import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Check,
  AlertCircle,
  Loader,
} from "lucide-react";
import Header from "../Header";

const Booking = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [isCalculating, setIsCalculating] = useState(false);
  const [routeError, setRouteError] = useState("");
  const [suggestedPickups, setSuggestedPickups] = useState([]);
  const [suggestedDestinations, setSuggestedDestinations] = useState([]);
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);
  const [estimatedDuration, setEstimatedDuration] = useState(0);
  const [formData, setFormData] = useState({
    pickup: "",
    destination: "",
    date: "",
    time: "",
    passengers: "1",
    vehicleType: "sedan",
    name: "",
    email: "",
    phone: "",
    specialRequests: "",
    paymentMethod: "card",
    distance: 0,
  });
  const api = "03d3f35736664301b06dd430650afda5"

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const getAddressSuggestions = async (query, isPickup) => {
    if (!query || query.length < 3) {
      isPickup ? setSuggestedPickups([]) : setSuggestedDestinations([]);
      return;
    }

    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
          query
        )}&format=json&limit=5&apiKey=${
          api
        }`
      );
      const data = await response.json();

      if (data.results) {
        const suggestions = data.results.map((result) => ({
          address: result.formatted,
          lat: result.lat,
          lon: result.lon,
        }));

        if (isPickup) {
          setSuggestedPickups(suggestions);
          setShowPickupSuggestions(true);
        } else {
          setSuggestedDestinations(suggestions);
          setShowDestSuggestions(true);
        }
      }
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
    }
  };

  // Function to calculate route distance and duration
  const calculateRoute = async (pickupLat, pickupLon, destLat, destLon) => {
    setIsCalculating(true);
    setRouteError("");

    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/routing?waypoints=${pickupLat},${pickupLon}|${destLat},${destLon}&mode=drive&apiKey=${api}`
      );
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const route = data.features[0].properties;
        const distanceInKm = route.distance / 1000; // Convert meters to kilometers
        const durationInMinutes = Math.ceil(route.time / 60); // Convert seconds to minutes

        setFormData((prev) => ({
          ...prev,
          distance: distanceInKm.toFixed(1),
          duration: durationInMinutes,
        }));

        setEstimatedDuration(durationInMinutes);
        return true;
      } else {
        setRouteError("Could not calculate route between these locations");
        return false;
      }
    } catch (error) {
      console.error("Error calculating route:", error);
      setRouteError("Error calculating route. Please try again.");
      return false;
    } finally {
      setIsCalculating(false);
    }
  };

  // Updated estimation function for Indian cities
  const estimateFare = (distance, duration, vehicleType, passengers) => {
    const baseRates = {
      sedan: 15, // ₹15 per km for sedan
      suv: 18, // ₹18 per km for SUV
      van: 22, // ₹22 per km for van
    };

    const waitingRates = {
      sedan: 2, // ₹2 per minute for sedan
      suv: 3, // ₹3 per minute for SUV
      van: 4, // ₹4 per minute for van
    };

    const perPassengerRate = 50; // Additional ₹50 per extra passenger
    const baseFare = 100; // Base booking charge
    const serviceCharge = 100; // Service fee

    const distanceCharge = 300
    const durationCharge = 350
    const passengerCharge = (parseInt(passengers) - 1) * perPassengerRate;

    const totalFare =
      baseFare +
      durationCharge +
      serviceCharge;

    return {
      baseFare: baseFare,
      distanceCharge: Math.round(distanceCharge),
      durationCharge: Math.round(durationCharge),
      passengerCharge: passengerCharge,
      serviceCharge: serviceCharge,
      total: Math.round(totalFare),
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "pickup") {
      getAddressSuggestions(value, true);
    } else if (name === "destination") {
      getAddressSuggestions(value, false);
    }
  };

  const calculateDistance = (pickup, destination) => {
    const cityDistances = {
      mumbai: { pune: 150, delhi: 1400, bangalore: 1000 },
      delhi: { mumbai: 1400, bangalore: 1700, chennai: 2200 },
      bangalore: { mumbai: 1000, delhi: 1700, chennai: 350 },
      chennai: { delhi: 2200, bangalore: 350, mumbai: 1300 },
      pune: { mumbai: 150, bangalore: 850 },
    };

    const normalizeName = (name) => name.toLowerCase().split(" ")[0];
    const normalizedPickup = normalizeName(pickup);
    const normalizedDestination = normalizeName(destination);

    return cityDistances[normalizedPickup]?.[normalizedDestination] || 200;
  };

  const selectAddress = (suggestion, isPickup) => {
    if (isPickup) {
      setFormData((prev) => ({
        ...prev,
        pickup: suggestion.address,
        pickupLat: suggestion.lat,
        pickupLon: suggestion.lon,
      }));
      setShowPickupSuggestions(false);
    } else {
      setFormData((prev) => ({
        ...prev,
        destination: suggestion.address,
        destLat: suggestion.lat,
        destLon: suggestion.lon,
      }));
      setShowDestSuggestions(false);
    }
  };

  const handleNextStep = async () => {
      setActiveStep((prev) => prev + 1);
      window.scrollTo(0, 0);
  };

  const handlePrevStep = () => {
    setActiveStep((prev) => prev - 1);
    window.scrollTo(0, 0);
  };

  // Function to send email to driver
  const sendDriverNotification = async (bookingDetails) => {
    try {
      // In a real application, this would be an API call to your backend
      // For demonstration purposes, we'll simulate this with a timeout
      console.log("Sending driver notification email...");
      
      // Simulate API call
      const driverEmail = "abc@gmail.com"; // In a real app, this would be fetched from your driver database
      
      // This would be your actual API endpoint
      // const response = await fetch('/api/notify-driver', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     driverEmail,
      //     bookingDetails
      //   }),
      // });
      
      // Simulate API response
      await new Promise(resolve => setTimeout(resolve, 800));
      
      console.log("Driver notification email sent successfully!");
      setEmailSent(true);
      return true;
    } catch (error) {
      console.error("Error sending driver notification:", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Generate a booking reference
    const bookingReference = `CAB-${Math.floor(100000 + Math.random() * 900000)}`;
    
    // Create booking details object for driver notification
    const bookingDetails = {
      reference: bookingReference,
      customer: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      },
      trip: {
        pickup: formData.pickup,
        destination: formData.destination,
        date: formData.date,
        time: formData.time,
        passengers: formData.passengers,
        vehicleType: formData.vehicleType === "sedan" 
          ? "Executive Sedan" 
          : formData.vehicleType === "suv" 
            ? "Premium SUV" 
            : "Luxury Van",
        specialRequests: formData.specialRequests || "None"
      },
      payment: {
        method: formData.paymentMethod === "card"
          ? "Credit/Debit Card"
          : formData.paymentMethod === "paypal"
            ? "PayPal"
            : "Cash (Pay to driver)",
        fare: estimateFare(
          formData.distance,
          formData.vehicleType,
          formData.passengers
        ).total
      }
    };

    try {
      // First, process the booking in your system
      console.log("Processing booking:", bookingDetails);
      
      // Then send notification to driver
      await sendDriverNotification(bookingDetails);
      
      // Complete the booking process
      setTimeout(() => {
        setIsSubmitting(false);
        setIsComplete(true);
        console.log("Booking completed:", {
          ...formData,
          bookingReference
        });
      }, 700);
    } catch (error) {
      console.error("Error during booking process:", error);
      setIsSubmitting(false);
      // Handle error - show error message to user
    }
  };

  const fareEstimate = estimateFare(
    formData.distance,
    formData.vehicleType,
    formData.passengers
  );

  return (
    <>
      <Header />
      <div className="pt-22 pb-16 px-6 min-h-screen bg-gradient-to-br from-white to-blue-300">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-700 mb-4">
              Book Your Premium Ride
            </h1>
            <p className="text-gray-600">
              Complete the form below to request your transportation service.
            </p>
          </div>

          {!isComplete ? (
            <>
              <div className="mb-8">
                <div className="max-w-3xl mx-auto">
                  <div className="relative">
                    <div
                      className="absolute inset-0 flex items-center"
                      aria-hidden="true"
                    >
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-between">
                      {[1, 2, 3].map((step) => (
                        <div key={step} className="flex items-center">
                          <button
                            type="button"
                            className={`relative w-10 h-10 flex items-center justify-center rounded-full ${
                              activeStep >= step
                                ? "bg-blue-500 text-white"
                                : "bg-white border-2 border-gray-300 text-gray-500"
                            } transition-all-300`}
                            disabled={activeStep < step}
                          >
                            {activeStep > step ? (
                              <Check className="w-5 h-5" />
                            ) : (
                              <span>{step}</span>
                            )}
                          </button>
                          <span
                            className={`ml-2 text-sm font-medium ${
                              activeStep >= step
                                ? "text-gray-700"
                                : "text-gray-500"
                            }`}
                          >
                            {step === 1
                              ? "Trip Details"
                              : step === 2
                              ? "Personal Info"
                              : "Confirmation"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow-xl rounded-2xl overflow-hidden animate-scale-up">
                {activeStep === 1 && (
                  <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-700 mb-6">
                      Trip Details
                    </h2>

                    <form className="space-y-6">
                        <div className="grid grid-cols-1 gap-6">
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
                                className="pl-10 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all-200"
                                required
                              />
                            </div>
                            {showPickupSuggestions &&
                              suggestedPickups.length > 0 && (
                                <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-lg border border-gray-200 max-h-60 overflow-y-auto">
                                  {suggestedPickups.map((suggestion, index) => (
                                    <div
                                      key={index}
                                      className="p-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-0"
                                      onClick={() =>
                                        selectAddress(suggestion, true)
                                      }
                                    >
                                      {suggestion.address}
                                    </div>
                                  ))}
                                </div>
                              )}
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
                                className="pl-10 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all-200"
                                required
                              />
                            </div>
                            {showDestSuggestions &&
                              suggestedDestinations.length > 0 && (
                                <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-lg border border-gray-200 max-h-60 overflow-y-auto">
                                  {suggestedDestinations.map((suggestion, index) => (
                                    <div
                                      key={index}
                                      className="p-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-0"
                                      onClick={() =>
                                        selectAddress(suggestion, false)
                                      }
                                    >
                                      {suggestion.address}
                                    </div>
                                  ))}
                                </div>
                              )}
                          </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                className="pl-10 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all-200"
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
                                className="pl-10 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all-200"
                                required
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                className="pl-10 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all-200 bg-white"
                                required
                              >
                                {[1, 2, 3, 4, 5, 6].map((num) => (
                                  <option key={num} value={num}>
                                    {num}{" "}
                                    {num === 1 ? "passenger" : "passengers"}
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
                              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all-200 bg-white"
                              required
                            >
                              <option value="sedan">Executive Sedan</option>
                              <option value="suv">Premium SUV</option>
                              <option value="van">Luxury Van</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 text-right">
                        <button
                          type="button"
                          onClick={handleNextStep}
                          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium shadow-md hover:shadow-xl hover:bg-blue-200 transition-all-300"
                        >
                          Continue to Personal Info
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {activeStep === 2 && (
                  <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-700 mb-6">
                      Personal Information
                    </h2>

                    <form>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Full Name
                            </label>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              placeholder="Enter your full name"
                              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all-200"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Email Address
                            </label>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="Enter your email"
                              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all-200"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter your phone number"
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focusLring-blue-500 focus:border-transparent transition-all-200"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Special Requests (optional)
                          </label>
                          <textarea
                            name="specialRequests"
                            value={formData.specialRequests}
                            onChange={handleChange}
                            placeholder="Any special requirements or notes for your trip"
                            rows={3}
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focusLring-blue-500 focus:border-transparent transition-all-200"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Payment Method
                          </label>
                          <div className="space-y-3">
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="paymentMethod"
                                value="card"
                                checked={formData.paymentMethod === "card"}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-500 focusLring-blue-500 border-gray-300"
                              />
                              <span className="ml-2 text-gray-700">
                                Credit/Debit Card
                              </span>
                            </label>

                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="paymentMethod"
                                value="paypal"
                                checked={formData.paymentMethod === "paypal"}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-500 focusLring-blue-500 border-gray-300"
                              />
                              <span className="ml-2 text-gray-700">PayPal</span>
                            </label>

                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="paymentMethod"
                                value="cash"
                                checked={formData.paymentMethod === "cash"}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-500 focusLring-blue-500 border-gray-300"
                              />
                              <span className="ml-2 text-gray-700">
                                Cash (Pay to driver)
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 flex justify-between">
                        <button
                          type="button"
                          onClick={handlePrevStep}
                          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all-200"
                        >
                          Back
                        </button>

                        <button
                          type="button"
                          onClick={handleNextStep}
                          className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium shadow-md hover:shadow-xl hover:bg-blue-600 transition-all-300"
                        >
                          Review Booking
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {activeStep === 3 && (
                  <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-700 mb-6">
                      Review Your Booking
                    </h2>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-4">
                        Estimated Price Breakdown
                      </h3>

                      <div className="bg-blue-100 p-4 rounded-lg">
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">
                            Duration charge:
                          </span>
                          <span className="font-medium">
                            ₹{fareEstimate.durationCharge}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            Estimated Travel Time
                          </p>
                          <p className="font-medium">
                            {formData.duration} minutes
                          </p>
                        </div>
                        {formData.passengers > 1 && (
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600">
                              Additional passenger charge:
                            </span>
                            <span className="font-medium">
                              ₹{fareEstimate.passengerCharge}
                            </span>
                          </div>
                        )}
                        {isCalculating && (
                          <div className="flex items-center justify-center my-4">
                            <Loader className="h-6 w-6 text-blue-500 animate-spin mr-2" />
                            <span>Calculating route...</span>
                          </div>
                        )}

                        {routeError && (
                          <div className="flex items-center bg-red-50 text-red-700 p-3 rounded-lg my-4">
                            <AlertCircle className="h-5 w-5 mr-2" />
                            <span>{routeError}</span>
                          </div>
                        )}
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Service fee:</span>
                          <span className="font-medium">
                            ₹{fareEstimate.serviceCharge}
                          </span>
                        </div>
                        <div className="border-t border-gray-300 my-2 pt-2 flex justify-between">
                          <span className="font-semibold">Total:</span>
                          <span className="font-bold text-gray-700">
                            ₹{fareEstimate.total}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          *Final price may vary based on actual route and
                          traffic conditions.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-8 pt-4">
                      <div className="border-b border-gray-200 pb-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">
                          Trip Details
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              Pickup Location
                            </p>
                            <p className="font-medium">
                              {formData.pickup || "Not specified"}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm text-gray-500">Destination</p>
                            <p className="font-medium">
                              {formData.destination || "Not specified"}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm text-gray-500">Date</p>
                            <p className="font-medium">
                              {formData.date || "Not specified"}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm text-gray-500">Time</p>
                            <p className="font-medium">
                              {formData.time || "Not specified"}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm text-gray-500">Passengers</p>
                            <p className="font-medium">{formData.passengers}</p>
                          </div>

                          <div>
                            <p className="text-sm text-gray-500">
                              Vehicle Type
                            </p>
                            <p className="font-medium">
                              {formData.vehicleType === "sedan"
                                ? "Executive Sedan"
                                : formData.vehicleType === "suv"
                                ? "Premium SUV"
                                : "Luxury Van"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="border-b border-gray-200 pb-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">
                          Personal Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                          <div>
                            <p className="text-sm text-gray-500">Full Name</p>
                            <p className="font-medium">
                              {formData.name || "Not specified"}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm text-gray-500">
                              Email Address
                            </p>
                            <p className="font-medium">
                              {formData.email || "Not specified"}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm text-gray-500">
                              Phone Number
                            </p>
                            <p className="font-medium">
                              {formData.phone || "Not specified"}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm text-gray-500">
                              Payment Method
                            </p>
                            <p className="font-medium">
                              {formData.paymentMethod === "card"
                                ? "Credit/Debit Card"
                                : formData.paymentMethod === "paypal"
                                ? "PayPal"
                                : "Cash (Pay to driver)"}
                            </p>
                          </div>
                        </div>

                        {formData.specialRequests && (
                          <div className="mt-4">
                            <p className="text-sm text-gray-500">
                              Special Requests
                            </p>
                            <p className="font-medium">
                              {formData.specialRequests}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-8 flex justify-between">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all-200"
                      >
                        Back
                      </button>

                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className={`px-6 py-3 bg-blue-500 text-white rounded-lg font-medium shadow-md hover:shadow-xl hover:bg-blue-600 transition-all-300 ${
                          isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                      >
                        {isSubmitting ? "Processing..." : "Confirm Booking"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-white p-8 shadow-xl rounded-2xl text-center animate-scale-up">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="h-10 w-10 text-green-600" />
              </div>

              <h2 className="text-2xl font-bold text-gray-700 mb-3">
                Booking Confirmed!
              </h2>
              <p className="text-gray-600 mb-6">
                Your ride has been successfully booked. A confirmation email has
                been sent to your email address.
              </p>

              <div className="max-w-sm mx-auto bg-blue-100 p-4 rounded-lg mb-6">
                <div className="text-left mb-3">
                  <p className="text-sm text-gray-500">Booking Reference</p>
                  <p className="font-bold text-gray-700">
                    CAB-{Math.floor(100000 + Math.random() * 900000)}
                  </p>
                </div>

                <div className="text-left">
                  <p className="text-sm text-gray-500">Driver will arrive at</p>
                  <p className="font-medium">
                    {formData.date} • {formData.time}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/trips"
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium shadow-md hover:shadow-xl hover:bg-blue-600 transition-all-300"
                >
                  View My Trips
                </a>
                <a
                  href="/"
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all-200"
                >
                  Return to Home
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Booking;
