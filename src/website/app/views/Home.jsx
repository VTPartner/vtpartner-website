/* eslint-disable no-unused-vars */
// import React from 'react'
import { useState } from "react";
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
} from "../components";

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
  return (
    <div className="bg-gray-100 text-black!">
      <EstimationHeroBanner bgImage={bgImage} />
      <LocationForm onCitySelect={handleCitySelect} />
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
  );
};

export default Home;
