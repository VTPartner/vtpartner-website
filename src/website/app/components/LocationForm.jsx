/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import CitySelection from "./CitySelection"; // Assuming you already have CitySelection component
import { styles } from "../../../styles";
import { FaChevronRight } from "react-icons/fa";
import { useLoadScript } from "@react-google-maps/api";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Tilt } from "react-tilt";
import { motion } from "framer-motion";
import { fadeIn } from "../utils/motion";
import { useNavigate } from "react-router-dom";

const libraries = ["places"]; // Load the places library

const LocationForm = ({ onCitySelect }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyAAlmEtjJOpSaJ7YVkMKwdSuMTbTx39l_o", // Replace with your API key
    libraries,
  });

  // State to manage form inputs
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [userDescription, setUserDescription] = useState("");
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropSuggestions, setDropSuggestions] = useState([]);

  const pickupInputRef = useRef(null); // Reference for pickup input
  const dropInputRef = useRef(null); // Reference for drop input

  useEffect(() => {
    if (isLoaded) {
      const autocompleteService =
        new window.google.maps.places.AutocompleteService();

      const handlePickupInputChange = (e) => {
        const input = e.target.value;
        setPickupLocation(input);

        if (input.length > 0) {
          autocompleteService.getPlacePredictions(
            { input },
            (predictions, status) => {
              if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                setPickupSuggestions(predictions);
              } else {
                setPickupSuggestions([]);
              }
            }
          );
        } else {
          setPickupSuggestions([]); // Clear suggestions if input is empty
        }
      };

      const handleDropInputChange = (e) => {
        const input = e.target.value;
        setDropLocation(input);

        if (input.length > 0) {
          autocompleteService.getPlacePredictions(
            { input },
            (predictions, status) => {
              if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                setDropSuggestions(predictions);
              } else {
                setDropSuggestions([]);
              }
            }
          );
        } else {
          setDropSuggestions([]); // Clear suggestions if input is empty
        }
      };

      const pickupInputElement = pickupInputRef.current;
      const dropInputElement = dropInputRef.current;

      pickupInputElement.addEventListener("input", handlePickupInputChange);
      dropInputElement.addEventListener("input", handleDropInputChange);

      return () => {
        pickupInputElement.removeEventListener(
          "input",
          handlePickupInputChange
        );
        dropInputElement.removeEventListener("input", handleDropInputChange);
      };
    }
  }, [isLoaded]);

  const handlePickupSuggestionClick = (suggestion) => {
    setPickupLocation(suggestion.description);
    setPickupSuggestions([]); // Hide suggestions after selection
  };

  const handleDropSuggestionClick = (suggestion) => {
    setDropLocation(suggestion.description);
    setDropSuggestions([]); // Hide suggestions after selection
  };
  // Handle city selection (This will be passed to CitySelection)
  const handleCitySelect = (imageUrl) => {
    onCitySelect(imageUrl);
  };

  // Error state
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!pickupLocation)
      newErrors.pickupLocation = "Pickup location is required.";
    if (!dropLocation) newErrors.dropLocation = "Drop location is required.";
    if (!contactName) newErrors.contactName = "Name is required.";
    if (!contactNumber) {
      newErrors.contactNumber = "Phone number is required.";
    } else if (!/^[0-9]+$/.test(contactNumber)) {
      newErrors.contactNumber = "Phone number must be numeric.";
    } else if (contactNumber.length < 10 || contactNumber.length > 15) {
      newErrors.contactNumber =
        "Phone number must be between 10 and 15 digits.";
    }
    if (!userDescription)
      newErrors.userDescription = "Please select an option.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    if (validateForm()) {
      console.log("Form submitted:", {
        pickupLocation,
        dropLocation,
        contactName,
        contactNumber,
        userDescription,
      });

      // Create query string from form data
      const queryParams = new URLSearchParams({
        pickupLocation,
        dropLocation,
        contactName,
        contactNumber,
        userDescription,
      }).toString();
      navigate(`/fare_estimation_result?${queryParams}`);
    }
  };

  return (
    <div
      className={` ${styles.padding} mt-[-32rem] relative z-10 p-[3rem 2.4rem 3rem .4rem] flex flex-col items-center`}
    >
      {/* <div className="p-6 flex flex-col items-center mt-[-30rem] relative z-10"> */}
      {/* City Selection Component */}
      <CitySelection onCitySelect={handleCitySelect} />

      {/* Location and User Details Form */}
      {/* <Tilt axis="x" scale={0} className="  cursor-pointer"> */}
      <motion.div
        variants={fadeIn("right", "spring", 0.5, 0.75)}
        className="w-fit green-pink-gradient p-[1px] rounded-[20px] "
      >
        <div
          options={{
            max: 45,
            scale: 1,
            speed: 450,
          }}
          className={`bg-tertiary  p-6 rounded-[20px] shadow-md w-fit flex items-center justify-center `}
        >
          <form
            className="flex flex-col md:flex-wrap md:justify-center sm:flex-row gap-4 sm:m-3 "
            onSubmit={handleSubmit}
          >
            {/* Pickup Location */}
            <div className="relative flex flex-col">
              <label className="text-white text-[12px] px-4 mb-1">
                Pickup Location
              </label>
              <input
                ref={pickupInputRef}
                type="text"
                className={`px-4 py-2 border-none rounded-md focus:outline-none text-white shadow-sm placeholder:text-[12px] bg-tertiary ${
                  errors.pickupLocation ? " border-red-500" : ""
                }`}
                placeholder="Enter Pickup Location"
                value={pickupLocation}
                onChange={(e) => {
                  setPickupLocation(e.target.value);
                  if (e.target.value) {
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      pickupLocation: undefined,
                    }));
                  }
                }}
              />
              {errors.pickupLocation && (
                <div className="text-red-500 text-[10px] mt-2 sm:text-center">
                  {errors.pickupLocation}
                </div>
              )}
              {/* Custom Suggestions List for Pickup Location */}
              {pickupSuggestions.length > 0 && (
                <ul className="absolute bg-white shadow-md mt-20 rounded-md z-20">
                  {pickupSuggestions.map((suggestion) => (
                    <li
                      key={suggestion.place_id}
                      className="p-2 cursor-pointer hover:bg-gray-200"
                      onClick={() => handlePickupSuggestionClick(suggestion)} // Trigger custom suggestion selection
                    >
                      <span className="text-[10px]">
                        {suggestion.description}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* Vertical Divider */}
            <div className="hidden md:block w-[0.1px] bg-white my-1" />
            {/* Drop Location */}
            <div className="relative flex flex-col">
              <label className="text-white text-[12px] px-4 mb-1">
                Drop Location
              </label>
              <input
                ref={dropInputRef}
                type="text"
                className={`px-4 py-2 border-none rounded-md focus:outline-none text-white shadow-sm placeholder:text-[12px] bg-tertiary ${
                  errors.dropLocation ? "border-red-500" : ""
                }`}
                placeholder="Enter Drop Location"
                value={dropLocation}
                onChange={(e) => {
                  setDropLocation(e.target.value);
                  if (e.target.value) {
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      dropLocation: undefined,
                    }));
                  }
                }}
              />
              {errors.dropLocation && (
                <div className="text-red-500 text-[10px] mt-2 sm:text-center">
                  {errors.dropLocation}
                </div>
              )}
              {/* Custom Suggestions List for Drop Location */}
              {dropSuggestions.length > 0 && (
                <ul className="absolute bg-white shadow-md mt-20 rounded-md z-20">
                  {dropSuggestions.map((suggestion) => (
                    <li
                      key={suggestion.place_id}
                      className="p-2 cursor-pointer hover:bg-gray-200"
                      onClick={() => handleDropSuggestionClick(suggestion)} // Trigger custom suggestion selection
                    >
                      <span className="text-[10px]">
                        {suggestion.description}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Vertical Divider */}
            <div className="hidden md:block w-[0.1px] bg-white my-1" />

            {/* Name  */}
            <div className="flex flex-col">
              <label className="text-white text-[12px] px-4 mb-1">Name</label>
              <input
                type="text"
                className={`px-4 py-2 border-none rounded-md focus:outline-none text-white shadow-sm placeholder:text-[12px] bg-tertiary ${
                  errors.contactName ? "border-red-500" : ""
                }`}
                placeholder="Enter your name"
                value={contactName}
                onChange={(e) => {
                  setContactName(e.target.value);
                  if (e.target.value) {
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      contactName: undefined,
                    }));
                  }
                }}
              />
              {errors.contactName && (
                <div className="text-red-500 text-[10px] mt-2 sm:text-center">
                  {errors.contactName}
                </div>
              )}
            </div>

            {/* Vertical Divider */}
            <div className="hidden md:block w-[0.1px] bg-white my-1" />

            {/* Contact Details */}
            <div className="flex flex-col">
              <label className="text-white text-[12px] px-4 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                className={`px-4 py-2 border-none rounded-md focus:outline-none text-white shadow-sm placeholder:text-[12px] bg-tertiary ${
                  errors.contactNumber ? "border-red-500" : ""
                }`}
                placeholder="Enter contact details"
                value={contactNumber}
                onChange={(e) => {
                  setContactNumber(e.target.value);
                  if (e.target.value) {
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      contactNumber: undefined,
                    }));
                  }
                }}
              />
              {errors.contactNumber && (
                <div className="text-red-500 text-[10px] mt-2 sm:text-center">
                  {errors.contactNumber}
                </div>
              )}
            </div>

            {/* Vertical Divider */}
            <div className="hidden md:block w-[0.1px] bg-white my-1" />

            {/* Description Dropdown */}
            <div className="flex flex-col">
              <label className="text-white text-[12px] px-4 mb-1">
                What describes you?
              </label>
              <select
                className={`px-4 py-2 border-none rounded-md focus:outline-none text-white shadow-sm placeholder:text-[12px] bg-tertiary ${
                  errors.userDescription ? "border-red-500" : ""
                }`}
                value={userDescription}
                onChange={(e) => {
                  setUserDescription(e.target.value);
                  if (e.target.value) {
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      userDescription: undefined,
                    }));
                  }
                }}
              >
                <option value="" disabled>
                  Select an option
                </option>
                <option value="personal">Personal Use</option>
                <option value="business">Business Use</option>
              </select>
              {errors.userDescription && (
                <div className="text-red-500 text-[10px] mt-2 sm:text-center">
                  {errors.userDescription}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-center mt-4 ">
              <button
                type="submit" // Change to "submit" if you're handling form submission
                className="flex items-center bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
              >
                <span>Get an Estimation Now</span>
                <FaChevronRight className="ml-2" /> {/* Right arrow icon */}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
      {/* </Tilt> */}
    </div>
  );
};

export default LocationForm;
