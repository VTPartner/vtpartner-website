/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import { useState } from "react";
import { FiMapPin } from "react-icons/fi";
import { FiX } from "react-icons/fi";
import { Tilt } from "react-tilt";
import { motion } from "framer-motion";
// import { styles } from "../../../styles";
import { fadeIn } from "../utils/motion";

const CitySelection = ({ onCitySelect }) => {
  // List of cities (you can replace this with API data in the future)
  const cities = [
    {
      name: "Belgaum",
      imageUrl:
        "https://dom-website-prod-cdn-cms.porter.in/bangalore_city_14a3725848.webp",
    },
    {
      name: "Pune",
      imageUrl:
        "https://dom-website-prod-cdn-cms.porter.in/Pune_22fe0b6cdf.webp",
    },
    {
      name: "Hubli",
      imageUrl:
        "https://dom-website-prod-cdn-cms.porter.in/Ludhiana_51e085bbd8.webp",
    },
    {
      name: "Dharwad",
      imageUrl:
        "https://dom-website-prod-cdn-cms.porter.in/hyderabad_city_banner_052a24d2d6.webp",
    },
  ];

  // State to handle modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State to store the selected city
  const [selectedCity, setSelectedCity] = useState(cities[0].name);

  // Toggle modal visibility
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Handle city selection
  const handleCityClick = (city) => {
    setSelectedCity(city.name);
    onCitySelect(city.imageUrl);
    toggleModal(); // Close modal after selection
  };

  return (
    <div className="sm:relative mt-[-2rem] mb-[1rem]">
      {/* City Selection Box */}
      <Tilt className="hidden sm:block cursor-pointer">
        <motion.div
          variants={fadeIn("right", "spring", 0.5, 0.75)}
          className="w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card"
        >
          <div
            options={{
              max: 45,
              scale: 1,
              speed: 450,
            }}
            className="bg-tertiary rounded-[20px] py-5 px-6 flex  items-center"
            onClick={toggleModal}
          >
            <FiMapPin className="text-white mr-4 text-xl" />
            <span className="text-white sm:font-medium text-[-10px]">
              {selectedCity}
            </span>
          </div>
        </motion.div>
      </Tilt>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed bg-white inset-0 bg-opacity-50 flex justify-center items-center z-20 p-6">
          <div className="bg-white p-6 rounded-lg w-full lg:w-1/2">
            <div className="flex justify-between items-center">
              <h3 className="text-lg text-black text-center mb-4">
                Select your City
              </h3>
              <FiX
                className="text-2xl text-black cursor-pointer"
                onClick={toggleModal}
              />
            </div>
            <ul className="flex gap-4 justify-evenly flex-wrap ">
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
                          src={city.imageUrl}
                          alt={city.name}
                          className="sm:w-14 sm:h-14 w-10 h-10 rounded-md m-1"
                        />
                      </div>
                    </motion.div>
                  </Tilt>
                  <span className="text-gray mt-2 text-[12px]">
                    {city.name}
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

export default CitySelection;
