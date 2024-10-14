/* eslint-disable react/prop-types */
// import React from "react";
import { GoDotFill } from "react-icons/go";
import { CiEdit } from "react-icons/ci";
import { FareEstimateQr } from "../components";

const FareEstimateResultCard = ({
  vehicleImage,
  vehicleName,
  fare,
  capacity,
}) => {
  return (
    <div className="p-4 border border-white rounded-lg shadow-lg bg-tertiary m-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          <img
            src={vehicleImage}
            alt={vehicleName}
            className="w-24 h-16 object-contain text-white"
          />
          <div className="ml-6">
            <p className="text-lg text-white font-semibold">{vehicleName}</p>
            <p className="text-white">{fare}</p>
          </div>
        </div>

        <div className="mt-2">
          <div className="flex items-center">
            <img
              src="https://dom-website-prod-cdn-web.porter.in/public/images/fare-estimate-result/weight.svg"
              alt="Capacity Icon"
              className="w-4 h-4 text-white bg-white rounded-full"
            />
            <p className="ml-2 text-sm text-white">{capacity}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const FareEstimateResults = () => {
  const vehicles = [
    {
      vehicleImage:
        "https://dom-website-prod-cdn-cms.porter.in/3_wheeler_update_68e76971bd.svg",
      vehicleName: "3 Wheeler",
      fare: "₹725 - ₹755",
      capacity: "500 kg",
    },
    {
      vehicleImage:
        "https://dom-website-prod-cdn-cms.porter.in/8ft_3f900fa091.svg",
      vehicleName: "Pickup 8ft",
      fare: "₹995 - ₹1025",
      capacity: "1200 kg",
    },
    {
      vehicleImage:
        "https://dom-website-prod-cdn-cms.porter.in/tata_ace_2deb9441fd.svg",
      vehicleName: "Tata Ace",
      fare: "₹790 - ₹820",
      capacity: "750 kg",
    },
    {
      vehicleImage:
        "https://dom-website-prod-cdn-web.porter.in/public/images/fare-estimate-result/default-truck-icon.svg",
      vehicleName: "1.7 Ton Truck",
      fare: "₹1230 - ₹1260",
      capacity: "1700 kg",
    },
    {
      vehicleImage:
        "https://dom-website-prod-cdn-cms.porter.in/tata_407_6bd888bb79.svg",
      vehicleName: "Tata 407",
      fare: "₹1850 - ₹1880",
      capacity: "2500 kg",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 mt-20 text-center text-white">
        Results
      </h1>
      <div className="max-w-[120rem] bg-tertiary shadow-lg rounded-md min-h-[70vh]">
        <div className="grid sm:grid-cols-custom grid-cols-1 gap-4">
          <div className="flex flex-col h-fit bg-gray">
            {/* Pickup Location card  */}
            <div className="w-[90%] flex items-center justify-between px-[.8rem] py-[.1rem] gap-1 border m-4 border-white">
              <GoDotFill className="text-green-600" />
              <input type="text" className="w-full hidden" />
              <h3 className="text-white overflow-clip line-clamp-1">
                New Vaibhav Nagar Belgaum jgkjgkjgkjkjjkgh
              </h3>

              <CiEdit className="text-white w-[1.5rem] h-[2rem]" />
            </div>

            {/* Drop Location Card  */}
            <div className="w-[90%] flex items-center justify-between px-[.8rem] py-[.1rem] gap-1 border m-4 border-white">
              <GoDotFill className="text-red-600" />
              <input type="text" className="w-full hidden" />
              <h3 className="text-white overflow-clip line-clamp-1">
                New Vaibhav Nagar Belgaum jgkjgkjgkjkjjkgh
              </h3>

              <CiEdit className="text-white w-[1.5rem] h-[2rem]" />
            </div>
            <FareEstimateQr />
          </div>

          <div className="sm:h-[96%] border-l border-gray-300 mx-4 my-4 sm:block hidden"></div>
          <div className="block">
            {vehicles.map((vehicle, index) => (
              <FareEstimateResultCard
                key={index}
                vehicleImage={vehicle.vehicleImage}
                vehicleName={vehicle.vehicleName}
                fare={vehicle.fare}
                capacity={vehicle.capacity}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FareEstimateResults;

/*
return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 mt-20 text-center text-white">
        Results - Trucks
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle, index) => (
          <FareEstimateResultCard
            key={index}
            vehicleImage={vehicle.vehicleImage}
            vehicleName={vehicle.vehicleName}
            fare={vehicle.fare}
            capacity={vehicle.capacity}
          />
        ))}
      </div>
    </div>
  );
*/
