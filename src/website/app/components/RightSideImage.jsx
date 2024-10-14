/* eslint-disable react/prop-types */
// import React from 'react';

const RightSideImage = ({ title, description, imgSrc }) => {
  return (
    <section className="bg-white py-8">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 p-4">
            <img
              src={imgSrc}
              alt={title}
              className="w-full h-auto object-cover rounded-lg shadow-lg"
            />
          </div>
          <div className="md:w-1/2 p-4">
            <h2 className="text-2xl font-semibold mb-4">{title}</h2>
            <p className="text-gray-700 mb-6">{description}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RightSideImage;
