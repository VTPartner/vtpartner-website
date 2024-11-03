/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { serverWebsiteEndPoint } from "../../../../dashboard/app/constants";
import { FareEstimateQr } from "../../components";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FaCalendarDays, FaCar } from "react-icons/fa6";
import {
  AddToDriveRounded,
  CarRental,
  Person2Rounded,
} from "@mui/icons-material";

const FareEstimateResultCard = ({ distance, fare, days }) => {
  return (
    <div className="p-4 border border-secondary rounded-lg shadow-lg bg-white m-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          <Person2Rounded />

          <div className="ml-6">
            <p className="text-lg text-black font-semibold">Driver</p>
            <p className="text-lg text-black font-semibold">{distance} Km</p>
            <p className="text-black font-sans">
              ₹{fare}- ₹{1000 * days}
            </p>
          </div>
        </div>

        <div className="mt-2">
          {days > 0 && ( // Only render if capacity is greater than 0
            <div className="flex items-center">
              <FaCalendarDays />
              <p className="ml-2 text-sm text-black">{days} Days</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DriverEstimationResult = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [error, setError] = useState(null);
  const { category_id, city_id, distance, days, hours, category_name } =
    useParams();

  if (error) {
    return (
      <div className="w-full h-full items-center justify-center">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white mt-[6rem]">
      <h1 className="text-2xl font-titillium mb-6 text-center text-black">
        Results for {category_name}
      </h1>
      <div className="max-w-[120rem] bg-white shadow-lg rounded-md mt-2">
        <div className="grid sm:grid-cols-custom grid-cols-1 gap-4">
          <div className="flex flex-col h-fit bg-gray">
            {/* Pickup Location card  */}
            {/* <div className="w-[90%] flex items-center justify-between px-[.8rem] py-[.1rem] gap-1 border m-4 border-secondary">
                <GoDotFill className="text-green-600" />
                <input type="text" className="w-full hidden" />
                <h3 className="text-black overflow-clip line-clamp-1">
                  New Vaibhav Nagar Belgaum jgkjgkjgkjkjjkgh
                </h3>
  
                <CiEdit className="text-black w-[1.5rem] h-[2rem]" />
              </div> */}

            {/* Drop Location Card  */}
            {/* <div className="w-[90%] flex items-center justify-between px-[.8rem] py-[.1rem] gap-1 border m-4 border-secondary">
                <GoDotFill className="text-red-600" />
                <input type="text" className="w-full hidden" />
                <h3 className="text-black overflow-clip line-clamp-1">
                  New Vaibhav Nagar Belgaum jgkjgkjgkjkjjkgh
                </h3>
  
                <CiEdit className="text-black w-[1.5rem] h-[2rem]" />
              </div> */}
            <FareEstimateQr />
          </div>

          <div className="sm:h-[94%] border-l border-gray-300 mx-4 my-4 sm:block hidden"></div>
          <div className="block">
            <FareEstimateResultCard
              key={1}
              distance={distance}
              fare={Math.round(700 * days)}
              days={days}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverEstimationResult;
