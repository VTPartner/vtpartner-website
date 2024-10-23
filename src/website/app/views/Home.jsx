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
  ResponsiveSlider,
  VideoHeroBanner,
  HeroNew,
  SliderCarousal,
  HowItWorks,
  DownloadSection,
  ShowcaseNumbers,
  RegionShowcase,
  OurServices,
} from "../components";

import { MatxLoading } from "../../../dashboard/app/components";
import { toast } from "react-toastify";
import { serverWebsiteEndPoint } from "../../../dashboard/app/constants";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Home = () => {
  return (
    <>
      <div className="bg-white text-black! lg:mt-[4.5rem] mt-[2.8rem]">
        <HeroNew />
        <DownloadSection />
        <SliderCarousal />
        <ShowcaseNumbers />
        <OurServices />
        <HowItWorks />

        {/* <EstimationHeroBanner
              bgImage={bgImage}
              onCitySelect={handleCitySelect}
            /> */}

        {/* <LocationForm onCitySelect={handleCitySelect} /> */}
        {/* <FormSectionDemo /> */}
        {/* <AllServices /> */}
        {/* <Testimonials /> */}
        {/* <WhyChooseUs /> */}

        {/* <OurLocations /> */}
        <RegionShowcase />
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
  );
};

export default Home;
