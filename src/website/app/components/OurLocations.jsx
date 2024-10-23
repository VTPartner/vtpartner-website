/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
// import React from "react";

import { GoDotFill } from "react-icons/go";
import { SectionWrapper } from "../hoc";
import { areas } from "../constants";
import { textVariant } from "../utils/motion";
// import { styles } from "../../../styles";
import { motion } from "framer-motion";
import { Typography } from "@mui/material";
import { serverWebsiteEndPoint } from "../../../dashboard/app/constants";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

const OurLocations = () => {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState(null);

  const fetchCities = async () => {
    if (!navigator.onLine) {
      toast.error("No internet connection. Please check your connection.");
      // setIsLoading(false);
      return;
    }

    try {
      const endPoint = `${serverWebsiteEndPoint}/all_allowed_cities`;

      const response = await axios.post(endPoint);
      setCities(response.data.cities);
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
    fetchCities();
  }, []);

  return (
    <>
      <motion.div
        initial="hidden"
        whileInView="show"
        variants={textVariant()}
        className="mt-10"
      >
        <Typography
          variant="h6"
          sx={{
            color: "text.primary",
            fontSize: { xs: "16px", md: "24px" },
            fontWeight: "bold",
            textAlign: "center",
            mb: 4,
          }}
        >
          We proudly extend our services across the{" "}
          <span style={{ color: "#4087e1" }}>following areas</span>
        </Typography>
      </motion.div>

      <div className="flex flex-row flex-wrap justify-center gap-1">
        {cities.map((area) => (
          <div className="h-8" key={area.city_id}>
            <span className="flex items-center justify-center text-black flex-wrap">
              <GoDotFill className="w-2 h-2  m-1 text-black" />
              {`${area.city_name}`}
            </span>
          </div>
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(OurLocations, "/");
