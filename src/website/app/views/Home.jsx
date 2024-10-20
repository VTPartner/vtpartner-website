/* eslint-disable no-unused-vars */
// import React from 'react'
import { useState, useEffect } from "react";
import {
  Hero,
  Services,
  AllServices,
  Testimonials,
  OurLocations,
  FrequentlyAskedQuestions,
  Contact,
  StarsCanvas,
  WhyChooseUs,
  QRCode,
  EstimationHeroBanner,
  LocationForm,
  FormSectionDemo,
  CitySelectorMobile,
  GrowingNetwork,
  VTPartnerAdvantages,
  Gallery,
  LeftSideImage,
  RightSideImage,
  BannerMoreDetails,
} from "../components";

import { MatxLoading } from "../../../dashboard/app/components";
import { toast } from "react-toastify";
import { serverWebsiteEndPoint } from "../../../dashboard/app/constants";
import axios from "axios";
const Home = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [error, setError] = useState(null);

  // State to store the selected city background image
  const [bgImage, setBgImage] = useState();

  const fetchCities = async () => {
    if (!navigator.onLine) {
      toast.error("No internet connection. Please check your connection.");
      setLoading(false);
      return;
    }

    try {
      const endPoint = `${serverWebsiteEndPoint}/all_allowed_cities`;

      const response = await axios.post(endPoint);
      setBgImage(response.data.cities[0].bg_image);
      setCities(response.data.cities);
    } catch (error) {
      setLoading(false);
      handleError(error);
    } finally {
      setLoading(false);
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCities();
    // Simulate a loading time for all components
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100); // Adjust timing as needed

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading ? (
        // Show shimmer effect while loading
        <div className="h-screen bg-gray flex flex-col items-center justify-center">
          <MatxLoading />
        </div>
      ) : (
        <>
          <div className="bg-white text-black! lg:mt-[4.5rem] mt-[2.9rem]">
            <EstimationHeroBanner
              bgImage={bgImage}
              onCitySelect={handleCitySelect}
            />

            {/* <LocationForm onCitySelect={handleCitySelect} /> */}
            {/* <FormSectionDemo /> */}
            <AllServices />

            <OurLocations />
            <WhyChooseUs />
            <FrequentlyAskedQuestions />
            <div className="relative z-0 bg-primary">
              <Contact />
              <StarsCanvas />
            </div>
            {/* <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center min-h-screen">
        <Hero />
      </div>
      
      <AllServices />
      <Testimonials />
      <OurLocations />
      <WhyChooseUs />
      <QRCode />
      <FrequentlyAskedQuestions />
      <div className="relative z-0">
        <Contact />
        <StarsCanvas />
      </div> */}
          </div>
        </>
      )}
    </>
  );
};

export default Home;
