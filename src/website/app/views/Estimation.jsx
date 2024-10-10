// import React from 'react'
import {
  EstimationHeroBanner,
  LocationForm,
  ServiceDetails,
  WhyChooseUs,
  OurLocations,
  QRCode,
  FrequentlyAskedQuestions,
} from "../components";
import { useState } from "react";

const Estimation = () => {
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
    <>
      <EstimationHeroBanner bgImage={bgImage} />
      <LocationForm onCitySelect={handleCitySelect} />
      <ServiceDetails />
      <WhyChooseUs />
      <OurLocations />
      <QRCode />
      <FrequentlyAskedQuestions />
    </>
  );
};

export default Estimation;
