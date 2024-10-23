/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import { Tilt } from "react-tilt";
import { motion } from "framer-motion";
import LocationSearchingOutlinedIcon from "@mui/icons-material/LocationSearchingOutlined";
import { KeyboardArrowDown } from "@mui/icons-material";
import { toast } from "react-toastify";
import { serverWebsiteEndPoint } from "../../../dashboard/app/constants";
import axios from "axios";

const CitySelectorMobile = ({ onCitySelect }) => {
  // State to store the selected city
  const [selectedCity, setSelectedCity] = useState();
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCities = async () => {
    if (!navigator.onLine) {
      toast.error("No internet connection. Please check your connection.");
      setLoading(false);
      return;
    }

    try {
      const endPoint = `${serverWebsiteEndPoint}/all_allowed_cities`;

      const response = await axios.post(endPoint);

      setCities(response.data.cities);
      const city_name = response.data.cities[0].city_name;
      const city_id = response.data.cities[0].city_id;
      const bg_image = response.data.cities[0].bg_image;
      const covered_distance = response.data.cities[0].covered_distance;
      //setSelectedCity(city_name);
      //onCitySelect(bg_image, covered_distance, city_id);
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
        setError("No Data Found");
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Toggle modal visibility
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  // Handle city click
  const handleCityClick = (city) => {
    setSelectedCity(city.city_name);
    onCitySelect(city.bg_image, city.covered_distance, city.city_id);
    toggleModal(); // Close modal after selection
  };
  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    if (cities.length > 0) {
      const { bg_image, covered_distance, city_id } = cities[0]; // Destructure to get values
      setSelectedCity(cities[0].city_name);
      onCitySelect(bg_image, covered_distance, city_id); // Trigger the onCitySelect callback
    }
  }, [cities]); // Run this after cities are fetched

  return (
    <div>
      {/* City Selector for mobile */}
      <div
        className=" flex justify-start items-center  rounded-md cursor-pointer"
        onClick={toggleModal}
      >
        <div className="flex items-center justify-start mb-1 pb-4">
          <LocationSearchingOutlinedIcon
            style={{ fontSize: "16px", fontWeight: "bold" }}
          />
          <p className="ml-2 font-bold">{selectedCity}</p>
          <KeyboardArrowDown style={{ fontSize: "18px", marginLeft: "5px" }} />
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed bg-white inset-0 bg-opacity-50 flex justify-center shadow-lg items-center z-20 p-6">
          <div className="bg-white p-6 rounded-lg w-full lg:w-1/2 shadow-lg">
            <div className="flex justify-between items-center">
              <h3 className="text-lg text-black text-center mb-4">
                Select your City
              </h3>
              <FiX
                className="text-2xl text-black cursor-pointer"
                onClick={toggleModal}
              />
            </div>
            <ul className="flex gap-4 justify-evenly flex-wrap">
              {cities.map((city, index) => (
                <li
                  key={index}
                  className="flex flex-col justify-center w-fit items-center mb-3 p-2 rounded-md cursor-pointer"
                  onClick={() => handleCityClick(city)}
                >
                  <Tilt className=" w-full">
                    <motion.div
                      variants={{
                        hidden: { opacity: 0 },
                        visible: {
                          opacity: 1,
                          transition: { delay: index * 0.1 },
                        },
                      }}
                      initial="hidden"
                      animate="visible"
                      className="w-full  p-[1px] rounded-[20px] "
                    >
                      <div className="bg-white rounded-[20px] p-1 flex justify-evenly items-center flex-col">
                        <img
                          src={city.bg_image}
                          alt={city.city_name}
                          className="sm:w-14 sm:h-14 w-10 h-10 rounded-md m-1"
                        />
                      </div>
                    </motion.div>
                  </Tilt>
                  <span className="text-gray mt-2 text-[12px]">
                    {city.city_name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default CitySelectorMobile;
