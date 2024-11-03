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
  LandingPage,
  NavbarNew,
  HeroBanner,
  FareEstimationForm,
  WhatWeOffer,
} from "../components";

import { MatxLoading } from "../../../dashboard/app/components";
import { toast } from "react-toastify";
import { serverWebsiteEndPoint } from "../../../dashboard/app/constants";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Home = () => {
  return (
    <>
      <div className="bg-white text-black! lg:mt-[4.5rem] mt-[2.5rem]">
        {/* <NavbarNew /> */}
        <HeroBanner />
        <ShowcaseNumbers />
        <SliderCarousal />
        <WhyChooseUs />
        <OurLocations />
        <HowItWorks />

        {/* <OurServices /> */}
        <div className="relative z-0 bg-primary">
          <Contact />
          <StarsCanvas />
        </div>
        {/* <WhatWeOffer /> */}
        {/* <FareEstimationForm /> */}

        {/* <div className="bg-white-100"> */}
        {/* <LandingPage /> */}
        {/* <HeroNew />
        <HowItWorks />
        <DownloadSection />
        <SliderCarousal />
        <ShowcaseNumbers />
        <OurServices />
        <RegionShowcase />
        <FrequentlyAskedQuestions />
        <div className="relative z-0 bg-primary">
          <Contact />
          <StarsCanvas />
        </div> */}

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
