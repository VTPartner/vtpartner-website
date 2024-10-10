/* eslint-disable react-refresh/only-export-components */
// import React from "react";
import { useLocation } from "react-router-dom";
import { SectionWrapper } from "../hoc";

const ServiceDetails = () => {
  const location = useLocation();
  const { serviceName, description, image, weight, price } =
    location.state || {};
  return (
    <div className="container mx-auto py-8">
      {/* Section Heading */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-white">
          {serviceName} from VT Partner
        </h2>
      </div>

      {/* Details Section - Desktop */}
      <div className="hidden sm:flex items-center justify-center gap-8">
        <div className="bg-tertiary text-white rounded-lg shadow-lg p-8 w-fit flex flex-row">
          {/* Image */}
          <div className="relative  h-48">
            <img
              src={image}
              alt={serviceName}
              className="object-contain w-fit h-full rounded-lg"
            />
          </div>

          {/* Card Content */}
          <div className="w-1/2 max-w-[400px] flex flex-col justify-center pl-6">
            <h2 className="text-lg font-semibold mb-2">{serviceName}</h2>
            <div className="flex items-center gap-2 mb-2">
              {/* Capacity Icon */}
              <img
                src="https://dom-website-prod-cdn-web.porter.in/public/images/fare-estimate-result/weight.svg"
                alt="Capacity Icon"
                className="w-4 h-4 bg-white"
              />
              <p className="text-sm">{weight}</p>
            </div>
            <div className="text-secondary">
              <p>
                Starting from <strong>₹ {price}/-</strong>
              </p>
              <p className="text-xs mt-2">{description}</p>
            </div>
            {/* Know More Button */}
            <div className="mt-4 text-blue-500 hover:text-blue-600 cursor-pointer">
              <p>Know more</p>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section - Mobile */}
      <div className="lg:hidden grid grid-cols-1 gap-8">
        <div className="bg-tertiary text-white rounded-lg shadow-lg p-6">
          <div className="relative w-full h-48">
            {/* Image */}
            <img
              src={image}
              alt={serviceName}
              className="object-contain w-full h-full"
            />
          </div>
          {/* Card Content */}
          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">{serviceName}</h2>
            <div className="flex items-center gap-2 mb-2">
              {/* Capacity Icon */}
              <img
                src="https://dom-website-prod-cdn-web.porter.in/public/images/fare-estimate-result/weight.svg"
                alt="Capacity Icon"
                className="w-4 h-4 rounded-lg"
              />
              <p className="text-sm">{weight} kg</p>
            </div>
            <div className="text-gray-600">
              <p>
                Starting from <strong>₹ {price}/-</strong>
              </p>
              <p className="text-xs mt-2">{description}</p>
            </div>
            {/* Know More Button */}
            <div className="mt-4 text-blue-500 hover:text-blue-600 cursor-pointer">
              <p>Know more</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionWrapper(ServiceDetails, "");
