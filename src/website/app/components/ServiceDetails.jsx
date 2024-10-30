/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-refresh/only-export-components */
import { useLocation } from "react-router-dom";
import { SectionWrapper } from "../hoc";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { serverWebsiteEndPoint } from "../../../dashboard/app/constants";
import axios from "axios";
import { Tabs, Tab, useMediaQuery } from "@mui/material";

const ServiceDetails = () => {
  const location = useLocation(); // Access location state
  const { service } = location.state || {}; // Destructure the service object

  if (!service) {
    return <p>No service details available.</p>;
  }

  const [vehicles, setVehicles] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMobile = useMediaQuery("(max-width: 640px)"); // Media query for mobile view

  const fetchAllVehicles = async (category_id) => {
    try {
      const endPoint = `${serverWebsiteEndPoint}/all_vehicles`;
      console.log("selectedService.category_id:", category_id);
      const response = await axios.post(endPoint, {
        category_id: service.category_id,
      });
      setVehicles(response.data.vehicle_details);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle error responses
  const handleError = (error) => {
    if (error.response) {
      if (error.response.status === 404) {
        toast.error("No Data Found.");
        setError("No Data Found");
      } else if (error.response.status === 500) {
        toast.error("Internal server error. Please try again later.");
        setError("Internal Server Error");
      } else if (error.response.status === 409) {
        toast.error(
          "This Service Registration has already been sent to us.\nWe Are working on it"
        );
        setError("Internal Server Error");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
        setError("Unexpected Error");
      }
    } else {
      toast.error(
        "Failed to fetch all allowed cities. Please check your connection."
      );
      setError("Network Error");
    }
  };

  useEffect(() => {
    fetchAllVehicles();
  }, []);

  // Group vehicles by vehicle type
  const vehicleTypes = vehicles.reduce((acc, vehicle) => {
    const type = vehicle.vehicle_type_name;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(vehicle);
    return acc;
  }, {});

  const vehicleTypeNames = Object.keys(vehicleTypes);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <div className="container mx-auto mt-10">
      {/* Section Heading */}
      <div className="text-center mb-8">
        <h2 className="sm:text-2xl text-lg font-semibold text-black">
          {service.category_name} Service from VT Partner
        </h2>
      </div>

      {/* Tabs Section */}
      <div className="p-4  flex items-center justify-center ">
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons="auto"
          indicatorColor="primary"
          textColor="primary"
        >
          {vehicleTypeNames.map((type, index) => (
            <Tab key={index} label={type} />
          ))}
        </Tabs>
      </div>

      {/* Display Vehicles based on selected Tab */}
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="mt-10 text-center">{error}</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {vehicleTypes[vehicleTypeNames[selectedTab]]?.map((vehicle) => (
            <div
              key={vehicle.vehicle_id}
              className="bg-white text-black rounded-lg shadow-lg p-6"
            >
              {/* Image */}
              <div className="relative w-full h-48 rounded-lg">
                <img
                  src={vehicle.size_image}
                  alt={vehicle.vehicle_name}
                  className="object-contain w-full h-full "
                />
              </div>

              {/* Card Content */}
              <div className="mt-4">
                <h2 className="text-lg font-semibold mb-2">
                  {vehicle.vehicle_name}
                </h2>
                {vehicle.weight > 0 && (
                  <div className="flex items-center gap-2 mb-2">
                    {/* Capacity Icon */}
                    <img
                      src="/assets/weight.svg"
                      alt="Capacity Icon"
                      className="w-4 h-4"
                    />
                    <p className="text-sm">{vehicle.weight} kg</p>
                  </div>
                )}

                <div className="text-gray-600">
                  {/* <p>
                    Starting from{" "}
                    <strong>₹ {vehicle.starting_price_per_km}/-</strong>
                  </p> */}
                  <p className="text-xs mt-2">{vehicle.description}</p>
                </div>
                {/* Know More Button */}
                {/* <div className="mt-4 text-blue-500 hover:text-blue-600 cursor-pointer">
                  <p>Know more</p>
                </div> */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SectionWrapper(ServiceDetails, "");
