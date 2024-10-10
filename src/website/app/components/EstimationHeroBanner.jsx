/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

const EstimationHeroBanner = ({ bgImage }) => {
  return (
    <section
      className="relative w-full sm:h-[40rem] h-[20rem] flex items-center justify-center bg-cover bg-center bg-no-repeat  mb-[20rem]"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Text Block - Hidden on mobile screens */}
      <div className="relative z-10 text-center hidden md:block">
        <h1 className="text-white text-5xl font-bold">Welcome to VT Partner</h1>
        <p className="text-white text-2xl mt-4">
          Reliable Transport & Vendor Services
        </p>
        <p className="text-white text-lg mt-2">We get the job done!</p>
      </div>
    </section>
  );
};

export default EstimationHeroBanner;
