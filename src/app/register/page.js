"use client";
import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Lock,
  Car,
  FileText,
  Calendar,
  Check,
  Upload,
} from "lucide-react";
import axios from "axios";
import Header from "../Header";

const DriverRegistration = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: { value: "", error: "" },
    lastName: { value: "", error: "" },
    email: { value: "", error: "" },
    phone: { value: "", error: "" },
    dateOfBirth: { value: "", error: "" },

    // Driver Credentials
    licenseNumber: { value: "", error: "" },
    licenseExpiration: { value: "", error: "" },

    // Vehicle Information
    vehicleType: { value: "sedan", error: "" },
    vehicleModel: { value: "", error: "" },
    vehicleYear: { value: "", error: "" },
    vehiclePlateNumber: { value: "", error: "" },

    // Additional Documents
    licenseFrontImage: { value: null, error: "" },
    licenseBackImage: { value: null, error: "" },
    vehicleRegistrationImage: { value: null, error: "" },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const validateName = (name) => {
    // Trim whitespace and check for empty string
    const trimmedName = name.trim();
    if (trimmedName === "") return "Name is required";
    if (trimmedName.length < 2) return "Name must be at least 2 characters";
    // Optional: Add regex to check for valid name characters
    const nameRegex = /^[a-zA-Z\s'-]+$/;
    if (!nameRegex.test(trimmedName)) return "Invalid characters in name";
    return "";
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Invalid email format";
    return "";
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phone) return "Phone number is required";
    if (!phoneRegex.test(phone.replace(/\D/g, "")))
      return "Invalid phone number (10 digits)";
    return "";
  };

  const validateDateOfBirth = (dob) => {
    if (!dob) return "Date of birth is required";
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (age < 21 || (age === 21 && monthDiff < 0)) {
      return "You must be at least 21 years old";
    }
    return "";
  };

  const validateLicenseNumber = (license) => {
    if (!license) return "License number is required";
    if (license.length < 6) return "Invalid license number";
    return "";
  };

  const validateLicenseExpiration = (expDate) => {
    if (!expDate) return "Expiration date is required";
    const expirationDate = new Date(expDate);
    const today = new Date();
    if (expirationDate <= today) return "License must be valid";
    return "";
  };

  const validateVehicleModel = (model) => {
    if (!model) return "Vehicle model is required";
    if (model.length < 2) return "Invalid vehicle model";
    return "";
  };

  const validateVehicleYear = (year) => {
    if (!year) return "Vehicle year is required";
    const yearNum = parseInt(year);
    if (
      isNaN(yearNum) ||
      yearNum < 2000 ||
      yearNum > new Date().getFullYear() + 1
    ) {
      return "Invalid vehicle year";
    }
    return "";
  };

  const validatePlateNumber = (plate) => {
    if (!plate) return "Plate number is required";
    if (plate.length < 4) return "Invalid plate number";
    return "";
  };

  const validateFileUpload = (file) => {
    if (!file) return "File is required";
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) return "File must be less than 5MB";
    const allowedTypes = ["image/jpeg", "image/png", "image/pdf"];
    if (!allowedTypes.includes(file.type)) return "Invalid file type";
    return "";
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    let error = "";

    // Validation logic
    switch (name) {
      case "firstName":
        error = validateName(value);
        break;
      case "lastName":
        error = validateName(value);
        break;
      case "email":
        error = validateEmail(value);
        break;
      case "phone":
        error = validatePhone(value);
        break;
      case "dateOfBirth":
        error = validateDateOfBirth(value);
        break;
      case "licenseNumber":
        error = validateLicenseNumber(value);
        break;
      case "licenseExpiration":
        error = validateLicenseExpiration(value);
        break;
      case "vehicleModel":
        error = validateVehicleModel(value);
        break;
      case "vehicleYear":
        error = validateVehicleYear(value);
        break;
      case "vehiclePlateNumber":
        error = validatePlateNumber(value);
        break;
      case "licenseFrontImage":
      case "licenseBackImage":
      case "vehicleRegistrationImage":
        error = validateFileUpload(files[0]);
        break;
      default:
        break;
    }

    // Update state with new value and error
    setFormData((prev) => ({
      ...prev,
      [name]: {
        value: files ? files[0] : value,
        error: error,
      },
    }));
  };

  const validateStep = () => {
    let isValid = true;
    const updatedFormData = { ...formData };

    switch (activeStep) {
      case 1:
        ["firstName", "lastName", "phone", "dateOfBirth"].forEach((field) => {
          const error =
            field === "firstName" || field === "lastName"
              ? validateName(formData[field].value)
              : field === "phone"
              ? validatePhone(formData[field].value)
              : field === "dateOfBirth"
              ? validateDateOfBirth(formData[field].value)
              : "";

          updatedFormData[field].error = error;
          if (error) isValid = false;
        });
        break;
      case 2:
        // Validate Vehicle Information
        ["vehicleModel", "vehicleYear", "vehiclePlateNumber"].forEach(
          (field) => {
            const validationFunc = {
              vehicleModel: validateVehicleModel,
              vehicleYear: validateVehicleYear,
              vehiclePlateNumber: validatePlateNumber,
            }[field];

            const error = validationFunc(formData[field].value);
            updatedFormData[field].error = error;
            if (error) isValid = false;
          }
        );
        break;
      case 3:
        [
          "licenseNumber",
          "licenseExpiration",
          "licenseFrontImage",
          "licenseBackImage",
          "vehicleRegistrationImage",
        ].forEach((field) => {
          let error = "";
          switch (field) {
            case "licenseNumber":
              error = validateLicenseNumber(formData[field].value);
              break;
            case "licenseExpiration":
              error = validateLicenseExpiration(formData[field].value);
              break;
            case "licenseFrontImage":
            case "licenseBackImage":
            case "vehicleRegistrationImage":
              error = validateFileUpload(formData[field].value);
              break;
          }
          updatedFormData[field].error = error;
          if (error) isValid = false;
        });
        break;
    }

    setFormData(updatedFormData);
    return isValid;
  };

  const handleNextStep = () => {
    if (validateStep()) {
      setActiveStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevStep = () => {
    setActiveStep((prev) => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (validateStep()) {
      try {
        const payload = {
          id: Date.now(),
          firstname: formData.firstName.value,
          lastname: formData.lastName.value,
          phoneno: parseInt(formData.phone.value.replace(/\D/g, ""), 10),
          dob: formData.dateOfBirth.value,
          vtype: formData.vehicleType.value,
          vmodel: formData.vehicleModel.value,
          vyear: formData.vehicleYear.value,
          vplate: formData.vehiclePlateNumber.value,
          licenseno: formData.licenseNumber.value,
          license_expiry: formData.licenseExpiration.value,
        };
        console.log(payload);
        const response = await axios.post(
          "http://localhost:5000/api/register",
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              auth: "ZjVGZPUtYW1hX2FuZHJvaWRfMjAyMzY0MjU=",
            },
          }
        );
        if (response.status == 200) {
          setIsSubmitting(false);
          setIsComplete(true);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div className="pt-22 pb-16 px-6 min-h-screen bg-gradient-to-br from-white to-blue-300">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-700 mb-4">
              Driver Registration
            </h1>
            <p className="text-gray-600">
              Join our premium transportation network as a professional driver
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
                              ? "Personal Info"
                              : step === 2
                              ? "Vehicle Details"
                              : "Documents & Account"}
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
                      Personal Information
                    </h2>

                    <form>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              First Name
                            </label>
                            <div className="relative">
                              <User className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                              <input
                                type="text"
                                name="firstName"
                                value={formData.firstName.value}
                                onChange={handleChange}
                                placeholder="Enter your first name"
                                className="pl-10 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all-200"
                                required
                              />
                              {formData.firstName.error && (
                                <p className="text-red-500 text-sm mt-1">
                                  {formData.firstName.error}
                                </p>
                              )}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Last Name
                            </label>
                            <div className="relative">
                              <User className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                              <input
                                type="text"
                                name="lastName"
                                value={formData.lastName.value}
                                onChange={handleChange}
                                placeholder="Enter your last name"
                                className="pl-10 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all-200"
                                required
                              />
                              {formData.lastName.error && (
                                <p className="text-red-500 text-sm mt-1">
                                  {formData.lastName.error}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Phone Number
                            </label>
                            <div className="relative">
                              <Phone className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                              <input
                                type="tel"
                                name="phone"
                                value={formData.phone.value}
                                onChange={handleChange}
                                placeholder="Enter your phone number"
                                className="pl-10 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all-200"
                                required
                              />
                              {formData.phone.error && (
                                <p className="text-red-500 text-sm mt-1">
                                  {formData.phone.error}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date of Birth
                          </label>
                          <div className="relative">
                            <Calendar className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                            <input
                              type="date"
                              name="dateOfBirth"
                              value={formData.dateOfBirth.value}
                              onChange={handleChange}
                              className="pl-10 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all-200"
                              required
                            />
                            {formData.dateOfBirth.error && (
                              <p className="text-red-500 text-sm mt-1">
                                {formData.dateOfBirth.error}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 text-right">
                        <button
                          type="button"
                          onClick={handleNextStep}
                          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium shadow-md hover:shadow-xl hover:bg-blue-200 transition-all-300"
                        >
                          Continue to Vehicle Details
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {activeStep === 2 && (
                  <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-700 mb-6">
                      Vehicle Information
                    </h2>

                    <form>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Vehicle Type
                            </label>
                            <select
                              name="vehicleType"
                              value={formData.vehicleType.value}
                              onChange={handleChange}
                              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all-200 bg-white"
                              required
                            >
                              <option value="sedan">Executive Sedan</option>
                              <option value="suv">Premium SUV</option>
                              <option value="van">Luxury Van</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Vehicle Model
                            </label>
                            <div className="relative">
                              <Car className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                              <input
                                type="text"
                                name="vehicleModel"
                                value={formData.vehicleModel.value}
                                onChange={handleChange}
                                placeholder="Enter vehicle model"
                                className="pl-10 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all-200"
                                required
                              />
                              {formData.vehicleModel.error && (
                                <p className="text-red-500 text-sm mt-1">
                                  {formData.vehicleModel.error}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Vehicle Year
                            </label>
                            <div className="relative">
                              <Calendar className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                              <input
                                type="number"
                                name="vehicleYear"
                                value={formData.vehicleYear.value}
                                onChange={handleChange}
                                placeholder="Enter vehicle year"
                                min="2000"
                                max="2025"
                                className="pl-10 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all-200"
                                required
                              />
                              {formData.vehicleYear.error && (
                                <p className="text-red-500 text-sm mt-1">
                                  {formData.vehicleYear.error}
                                </p>
                              )}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Vehicle Plate Number
                            </label>
                            <div className="relative">
                              <FileText className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                              <input
                                type="text"
                                name="vehiclePlateNumber"
                                value={formData.vehiclePlateNumber.value}
                                onChange={handleChange}
                                placeholder="Enter plate number"
                                className="pl-10 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all-200"
                                required
                              />
                              {formData.vehiclePlateNumber.error && (
                                <p className="text-red-500 text-sm mt-1">
                                  {formData.vehiclePlateNumber.error}
                                </p>
                              )}
                            </div>
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
                          Continue to Documents
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {activeStep === 3 && (
                  <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-700 mb-6">
                      Documents & Account Setup
                    </h2>

                    <form>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Driver's License Number
                            </label>
                            <div className="relative">
                              <FileText className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                              <input
                                type="text"
                                name="licenseNumber"
                                value={formData.licenseNumber.value}
                                onChange={handleChange}
                                placeholder="Enter license number"
                                className="pl-10 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all-200"
                                required
                              />
                              {formData.licenseNumber.error && (
                                <p className="text-red-500 text-sm mt-1">
                                  {formData.licenseNumber.error}
                                </p>
                              )}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              License Expiration
                            </label>
                            <div className="relative">
                              <Calendar className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                              <input
                                type="date"
                                name="licenseExpiration"
                                value={formData.licenseExpiration.value}
                                onChange={handleChange}
                                className="pl-10 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all-200"
                                required
                              />
                              {formData.licenseExpiration.error && (
                                <p className="text-red-500 text-sm mt-1">
                                  {formData.licenseExpiration.error}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Driver's License (Front)
                            </label>
                            <div className="relative">
                              <Upload className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                              <input
                                type="file"
                                name="licenseFrontImage"
                                onChange={handleChange}
                                accept="image/*"
                                className="pl-10 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all-200"
                                required
                              />
                              {formData.licenseFrontImage.error && (
                                <p className="text-red-500 text-sm mt-1">
                                  {formData.licenseFrontImage.error}
                                </p>
                              )}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Driver's License (Back)
                            </label>
                            <div className="relative">
                              <Upload className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                              <input
                                type="file"
                                name="licenseBackImage"
                                onChange={handleChange}
                                accept="image/*"
                                className="pl-10 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all-200"
                                required
                              />
                              {formData.licenseBackImage.error && (
                                <p className="text-red-500 text-sm mt-1">
                                  {formData.licenseBackImage.error}
                                </p>
                              )}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Vehicle Registration
                            </label>
                            <div className="relative">
                              <Upload className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                              <input
                                type="file"
                                name="vehicleRegistrationImage"
                                onChange={handleChange}
                                accept="image/*"
                                className="pl-10 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all-200"
                                required
                              />
                              {formData.vehicleRegistrationImage.error && (
                                <p className="text-red-500 text-sm mt-1">
                                  {formData.vehicleRegistrationImage.error}
                                </p>
                              )}
                            </div>
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
                          onClick={handleSubmit}
                          disabled={isSubmitting}
                          className={`px-6 py-3 bg-blue-500 text-white rounded-lg font-medium shadow-md hover:shadow-xl hover:bg-blue-600 transition-all-300 ${
                            isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                          }`}
                        >
                          {isSubmitting
                            ? "Processing..."
                            : "Complete Registration"}
                        </button>
                      </div>
                    </form>
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
                Registration Successful!
              </h2>
              <p className="text-gray-600 mb-6">
                Your driver application has been received. We will review your
                documents and get back to you soon.
              </p>

              <div className="max-w-sm mx-auto bg-blue-100 p-4 rounded-lg mb-6">
                <div className="text-left mb-3">
                  <p className="text-sm text-gray-500">Application Reference</p>
                  <p className="font-bold text-gray-700">
                    DRV-{Math.floor(100000 + Math.random() * 900000)}
                  </p>
                </div>

                <div className="text-left">
                  <p className="text-sm text-gray-500">Next Steps</p>
                  <p className="font-medium">
                    Document verification and background check
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
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

export default DriverRegistration;
