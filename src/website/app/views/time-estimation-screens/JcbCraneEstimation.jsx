/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
// import React from 'react'
import {
  TimeEstimationBanner,
  FrequentlyAskedQuestions,
  OurLocations,
  WhyChooseUs,
} from "../../components";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { serverWebsiteEndPoint } from "../../../../dashboard/app/constants";
import axios from "axios";
import { useLocation } from "react-router-dom";

const JcbCraneEstimation = () => {
  const location = useLocation(); // Access location state
  const { service } = location.state || {}; // Destructure the service object

  if (!service) {
    return <p>No service details available.</p>;
  }

  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState(null);

  // State to store the selected city background image
  const [bgImage, setBgImage] = useState();

  const fetchCities = async () => {
    if (!navigator.onLine) {
      toast.error("No internet connection. Please check your connection.");
      // setIsLoading(false);
      return;
    }

    try {
      const endPoint = `${serverWebsiteEndPoint}/all_allowed_cities`;

      const response = await axios.post(endPoint);
      setBgImage(response.data.cities[0].bg_image);
      setCities(response.data.cities);
      // console.log(response.data.cities);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle error responses
  const handleError = (error) => {
    if (error.response) {
      if (error.response.status === 404) {
        toast.error("No Data Found.");
        setError("No Data Found");
      } else if (error.response.status === 500) {
        toast.error("Internal server error. Please try again later.");
        setError("Internal Server Error");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
        setError("Unexpected Error");
      }
    } else {
      console.log(error);
      toast.error(
        "Failed to fetch all allowed cities. Please check your connection."
      );
      setError("Network Error");
    }
  };
  // Function to handle city selection and update background image
  const handleCitySelect = (imageUrl) => {
    setBgImage(imageUrl);
  };

  useEffect(() => {
    fetchCities();
  }, []);

  return (
    <>
      <div className="bg-white text-black! lg:mt-[4.5rem] mt-[2.8rem]">
        <TimeEstimationBanner
          bgImage={bgImage}
          onCitySelect={handleCitySelect}
        />
        <WhyChooseUs />
        <OurLocations />
        <FrequentlyAskedQuestions />
      </div>
    </>
  );
};

export default JcbCraneEstimation;
