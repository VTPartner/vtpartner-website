/* eslint-disable no-unused-vars */
// import React from 'react'

import {
  Hero,
  Services,
  AllServices,
  Testimonials,
  OurLocations,
  FrequentlyAskedQuestions,
  Contact,
  StarsCanvas,
} from "../components";

const Home = () => {
  return (
    <>
      <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center min-h-screen">
        <Hero />
      </div>
      {/* <Services /> */}
      <AllServices />
      <Testimonials />
      <OurLocations />
      <FrequentlyAskedQuestions />
      <div className="relative z-0">
        <Contact />
        <StarsCanvas />
      </div>
    </>
  );
};

export default Home;
