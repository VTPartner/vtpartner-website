/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  useMediaQuery,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { LocationForm } from "../components";
import { toast } from "react-toastify";
import { serverWebsiteEndPoint } from "../../../dashboard/app/constants";
import axios from "axios";

const EstimationHeroBanner = ({ bgImage, onCitySelect }) => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleRegisterClick = () => {
    navigate("/agents"); // Navigate to /agents route on click
  };

  const location = useLocation();
  const { service } = location.state || {};
  return (
    <>
      <section
        className="relative w-full lg:h-[40rem] h-[30rem] flex items-center justify-center bg-cover bg-center bg-no-repeat  lg:mb-[2rem] mb-[14rem]"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        <div className="relative z-10 flex lg:flex-row flex-col lg:justify-between justify-center w-full lg:p-10 p-2 lg:mt-0 mt-[10rem] items-center lg:mb-0 mb-[-8rem]">
          <div className="flex flex-col lg:items-start items-center w-full">
            <h1 className="text-white lg:text-5xl text-lg font-bold">
              Welcome to VT Partner
            </h1>
            <p className="text-white lg:text-2xl text-sm mt-4">
              Reliable Transport & Vendor Services
            </p>
            <div className="flex w-fit justify-center mt-4">
              <Button
                fullWidth
                variant="contained"
                color="primary"
                size="medium"
                onClick={handleRegisterClick}
              >
                Register as a{" "}
                {service.category_type === "Delivery"
                  ? `${service.category_name} Driver `
                  : `Service ${service.category_name}`}
              </Button>
            </div>
          </div>
          <LocationForm onCitySelect={onCitySelect} />
        </div>
      </section>
    </>
  );
};

export default EstimationHeroBanner;
