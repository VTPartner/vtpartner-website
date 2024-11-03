// import React from "react";

const OwnMultipleVehicles = () => {
  return (
    <div className="relative py-10 bg-white">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-titillium">OWN MULTIPLE VEHICLES?</h1>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-center mx-20 p-20">
        <div className="flex-shrink-0 w-full md:w-1/2">
          <img
            src="https://dom-website-prod-cdn-cms.porter.in/owner_banner_7f7c5fb1ac.jpg"
            alt="Enterprise Banner"
            className="object-contain w-full h-full "
          />
        </div>
        <div className="flex flex-col w-full md:w-1/2 p-6">
          <h3 className="text-xl font-semibold mb-4">
            If you are a fleet owner and own multiple vehicles.
          </h3>
          <p className="text-gray-700 mb-6 mr-10">
            Keeping track of your vehicle fleet and optimizing their efficiency
            can be a huge challenge. Partner with VT Partner to boost your
            earnings and manage your vehicles easily.
          </p>
          <a
            href="#contact"
            className="flex px-6 py-3 text-white w-fit bg-gradient-to-r from-blue-500 to-violet-500 rounded-lg text-center font-semibold transition duration-300 hover:bg-blue-600"
          >
            CONTACT US
          </a>
        </div>
      </div>
    </div>
  );
};

export default OwnMultipleVehicles;
