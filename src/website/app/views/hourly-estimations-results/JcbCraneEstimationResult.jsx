/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { serverWebsiteEndPoint } from "../../../../dashboard/app/constants";
import { FareEstimateQr } from "../../components";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FaCalendarDays } from "react-icons/fa6";

const FareEstimateResultCard = ({
  vehicleImage,
  vehicleName,
  fare,
  hours,
  days,
}) => {
  return (
    <div className="p-4 border border-secondary rounded-lg shadow-lg bg-white m-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          <img
            src={vehicleImage}
            alt={vehicleName}
            className="w-24 h-16 object-contain text-black"
          />
          <div className="ml-6">
            <p className="text-lg text-black font-semibold">{vehicleName}</p>
            <p className="text-lg text-black font-semibold">{hours} Hrs</p>

            <p className="text-black font-sans">
              ₹{fare}- ₹{fare + 100}
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

const JcbCraneEstimationResult = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [error, setError] = useState(null);
  const { category_id, city_id, distance, hours, days, category_name } =
    useParams();
  const fetchFareResults = async () => {
    if (!navigator.onLine) {
      toast.error("No internet connection. Please check your connection.");
      setLoading(false);
      return;
    }

    try {
      const endPoint = `${serverWebsiteEndPoint}/fare_result`;

      const response = await axios.post(endPoint, {
        category_id: category_id,
        city_id: city_id,
      });

      setResults(response.data.fare_result);
    } catch (error) {
      setLoading(false);
      handleError(error);
    } finally {
      setLoading(false);
    }
  };
  // Handle error responses
  const handleError = (error) => {
    if (error.response) {
      if (error.response.status === 404) {
        toast.error("No Data Found.");
        setError("No Details Found");
      } else if (error.response.status === 500) {
        toast.error("Internal server error. Please try again later.");
        setError("Internal Server Error");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
        setError("Unexpected Error");
      }
    } else {
      console.log(error);
      toast.error(
        "Failed to fetch all allowed cities. Please check your connection."
      );
      setError("Network Error");
    }
  };
  useEffect(() => {
    fetchFareResults();
  }, []);

  if (error) {
    return (
      <div className="w-full h-full items-center justify-center">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white mt-[6rem]">
      <h1 className="text-2xl font-titillium mb-6  text-center text-black">
        Results for {category_name}
      </h1>
      <div className="max-w-[120rem] bg-white shadow-lg rounded-md">
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
            {results.map((vehicle, index) => (
              <FareEstimateResultCard
                key={index}
                vehicleImage={vehicle.size_image}
                vehicleName={vehicle.vehicle_name}
                fare={Math.round(vehicle.starting_price_per_km * hours)}
                hours={hours}
                days={days}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JcbCraneEstimationResult;
