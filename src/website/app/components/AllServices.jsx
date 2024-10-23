/* eslint-disable react/no-unknown-property */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Tilt } from "react-tilt";
import { motion } from "framer-motion";

import { styles } from "../../../styles";
import { github } from "../../../assets";
import { SectionWrapper } from "../hoc";
import { projects } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import { Link, NavLink } from "react-router-dom";
import { Box, Typography, useMediaQuery } from "@mui/material";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import axios from "axios";
import { serverWebsiteEndPoint } from "../../../dashboard/app/constants";

const AllServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isSmUp = useMediaQuery("(min-width: 640px)");
  const fetchAllServices = async () => {
    // Check if the user is online
    if (!navigator.onLine) {
      toast.error("No internet connection. Please check your connection.");
      setLoading(false);
      return; // Exit if no internet connection
    }

    try {
      const response = await axios.post(
        `${serverWebsiteEndPoint}/all_services`,
        {} // Send an empty object as the body if needed
      );

      // Update state with vehicle details
      setServices(response.data.services_details);
    } catch (error) {
      handleError(error); // Handle errors using your existing error handling function
    } finally {
      setLoading(false); // Ensure loading state is reset
    }
  };

  // Handle error responses
  const handleError = (error) => {
    if (error.response) {
      if (error.response.status === 404) {
        toast.error("No Data Found.");
        setError("No Data Found");
      } else if (error.response.status === 409) {
        // Handle case where pincode already exists
        toast.error("Service Name already exists.");
      } else if (error.response.status === 500) {
        toast.error("Internal server error. Please try again later.");
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
    setLoading(false);
  };

  useEffect(() => {
    fetchAllServices();
  }, []);
  return (
    <>
      <motion.div
        initial="hidden"
        whileInView="show"
        variants={isSmUp ? textVariant() : {}}
      >
        <Typography
          variant="h2"
          sx={{
            color: "text.primary",
            fontSize: { xs: "16px", md: "36px" },
            fontWeight: "bold",

            mb: 4,
          }}
        >
          Our <span style={{ color: "#4087e1" }}>Services</span>
        </Typography>
      </motion.div>

      {/* sm:flex */}
      <div className="w-full  hidden">
        <motion.p
          initial="hidden"
          whileInView="show"
          variants={fadeIn("", "", 0.1, 0.25)}
          className="mt-0 text-secondary text-[17px] max-w-3xl leading-[30px]"
        >
          At VT Partner, we are committed to providing a wide range of reliable
          and efficient services to meet your everyday needs. Whether you're
          looking for Goods Delivery, Cab Booking, or heavy machinery like JCB
          and Crane Booking, we’ve got you covered. Our services also extend to
          expert Vendor Services, offering skilled professionals for tasks like
          plumbing, electrical work, mechanic services, car wash, laundry, and
          more – all available right at your doorstep.
        </motion.p>
      </div>

      <div className="sm:mt-1 flex flex-wrap justify-evenly items-start gap-2">
        {services.map((service, index) => (
          <ServiceCard key={`service-${index}`} index={index} {...service} />
        ))}
      </div>
    </>
  );
};

const ServiceCard = ({
  index,
  category_id,
  category_type,
  category_name,
  category_image,
}) => {
  return (
    <Box
      textAlign="center"
      sx={{
        backgroundColor: "#EEF2FF", // Light gray background
        borderRadius: 2,
        p: 5,
        marginTop: 2,
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "scale(1.05)", // Slight scale-up on hover
          boxShadow: 3, // Add a soft shadow on hover
        },
      }}
    >
      <Tilt className="max-w-[30rem]">
        <img
          src={category_image}
          alt={category_name}
          className="sm:w-[10rem] sm:h-[5rem] w-20 h-10 object-contain cursor-pointer"
        />
        <motion.div
          variants={fadeIn("right", "spring", 0.5 * index, 0.75)}
          className="  p-[1px] rounded-[20px]"
        >
          <div
            options={{
              max: 45,
              scale: 1,
              speed: 450,
            }}
            className="bg-white rounded-[20px]  flex justify-evenly items-center flex-col"
          ></div>
        </motion.div>
        <h1 className="text-gray sm:mt-4 mt-2 sm:text-[20px] text-[10px] font-bold text-center overflow-clip">
          {category_name}
        </h1>
      </Tilt>
    </Box>
  );
};

const AllServicesCard = ({
  index,
  name,
  description,
  tags,
  image,
  weight,
  price,
  source_code_link,
}) => {
  const isSmUp = useMediaQuery("(min-width: 640px)");
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      variants={isSmUp ? fadeIn("up", "spring", index * 0.5, 0.75) : {}}
    >
      <Tilt
        options={{
          max: 45,
          scale: 1,
          speed: 450,
        }}
        className="bg-white shadow-xl mt-[1px] p-5 rounded-2xl sm:w-[360px] w-full cursor-pointer"
      >
        <div className="relative w-full h-[230px]">
          <img
            src={image}
            alt="project_image"
            className="w-full h-full object-cover rounded-2xl"
          />
          {weight ? (
            <div className="absolute inset-0 flex justify-end m-3 card-img_hover">
              <div
                onClick={() => window.open(source_code_link, "_blank")}
                className="black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer"
              >
                <p className="text-white font-bold text-[8px] text-center">
                  {weight}
                </p>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>

        <div className="mt-5">
          <h3 className="text-black font-bold text-[24px]">{name}</h3>
          <p className="mt-2 text-gray-500 text-[14px]">{description}</p>
        </div>

        <div className="mt-4 flex hidden flex-wrap gap-2">
          {tags.map((tag) => (
            <NavLink
              to="/get_estimation"
              state={{
                serviceName: name,
                description,
                tags,
                image,
                weight,
                price,
                source_code_link,
              }} // sending details to next screen
              key={`${name}-${tag.name}`}
              className={`text-[14px] ${tag.color} cursor-pointer`}
            >
              {tag.name}
            </NavLink>
          ))}
        </div>
      </Tilt>
    </motion.div>
  );
};
// export default AllServices;
export default SectionWrapper(AllServices, "all-services");
