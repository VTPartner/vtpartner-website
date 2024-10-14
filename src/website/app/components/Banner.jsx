/* eslint-disable react/prop-types */
// import React from "react";

const Banner = ({ backgroundImage, heading }) => {
  return (
    <section
      className="relative w-full sm:h-[25rem] h-[10rem] flex items-center justify-center text-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <h1 className="relative text-white text-3xl font-bold z-10">{heading}</h1>
    </section>
  );
};

export default Banner;
