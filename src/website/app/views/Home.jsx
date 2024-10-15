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
} from "../components";

import { MatxLoading } from "../../../dashboard/app/components";
const Home = () => {
  const cities = [
    {
      name: "Belgaum",
      imageUrl:
        "https://dom-website-prod-cdn-cms.porter.in/bangalore_city_14a3725848.webp",
    },
    {
      name: "Pune",
      imageUrl:
        "https://dom-website-prod-cdn-cms.porter.in/Pune_22fe0b6cdf.webp",
    },
    {
      name: "Hubli",
      imageUrl:
        "https://dom-website-prod-cdn-cms.porter.in/Ludhiana_51e085bbd8.webp",
    },
    {
      name: "Dharwad",
      imageUrl:
        "https://dom-website-prod-cdn-cms.porter.in/hyderabad_city_banner_052a24d2d6.webp",
    },
  ];
  // State to store the selected city background image
  const [bgImage, setBgImage] = useState(cities[0].imageUrl);

  // Function to handle city selection and update background image
  const handleCitySelect = (imageUrl) => {
    setBgImage(imageUrl);
  };
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
          <div className="bg-gray-100 text-black! lg:mt-[4.5rem] mt-[3.5rem]">
            <EstimationHeroBanner bgImage={bgImage} onCitySelect={handleCitySelect}/>
            {/* <LocationForm onCitySelect={handleCitySelect} /> */}
            {/* <FormSectionDemo /> */}
            <AllServices />
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
