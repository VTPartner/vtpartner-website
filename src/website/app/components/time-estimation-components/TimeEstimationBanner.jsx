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

import { toast } from "react-toastify";
import { serverWebsiteEndPoint } from "../../../../dashboard/app/constants";
import axios from "axios";
import LocationTimeForm from "./LocationTimeForm";
import HandyManEstimationForm from "./HandyManEstimationForm";
import DriversEstimationForm from "./DriversEstimationForm";

const TimeEstimationBanner = ({ bgImage, onCitySelect }) => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate hook

  const location = useLocation();
  const { service } = location.state || {};

  const handleRegisterClick = () => {
    navigate("/agents");
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target); // Stop observing once the image is loaded
          }
        });
      },
      { threshold: 0.1 } // Trigger when 10% of the image is visible
    );

    const imageElement = document.getElementById("lazy-bg-image");
    if (imageElement) {
      observer.observe(imageElement);
    }

    return () => {
      if (imageElement) {
        observer.unobserve(imageElement);
      }
    };
  }, []);

  return (
    <>
      <section
        className="relative w-full lg:h-[50rem] h-[30rem] flex items-center justify-center bg-cover bg-center bg-no-repeat lg:mb-[2rem] mb-[25rem]"
        style={{
          backgroundImage: isVisible ? `url(${bgImage})` : "none",
        }}
      >
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        <div className="relative z-10 flex lg:flex-row flex-col lg:justify-between justify-center w-full lg:p-10 p-2 lg:mt-0 mt-[20rem] items-center lg:mb-0 mb-[-8rem]">
          <div className="flex flex-col lg:items-start items-center w-full">
            <h1 className="text-white lg:text-5xl text-lg font-titillium">
              Welcome to KASP
            </h1>
            <p className="text-white lg:text-2xl text-sm mt-4">
              {service.category_id === 3
                ? `Partner with Us for Reliable JCB and Crane Solutions!`
                : service.category_id === 5
                ? ` Partner with Us for Reliable HandyMans!`
                : service.category_id === 4
                ? ` Partner with Us for Reliable Drivers!`
                : null}
            </p>
            <div className="flex w-fit justify-center mt-4">
              <Button
                fullWidth
                variant="contained"
                color="primary"
                size="medium"
                onClick={() => {
                  if (
                    service.category_id === 1 ||
                    service.category_id === 2 ||
                    service.category_id === 3
                  ) {
                    // Send selected category or service details to agent screen
                    console.log("item::", service);
                    navigate(
                      `/agents/${service.category_id}/${service.category_name}/${service.category_type}`,
                      {
                        state: { service: service },
                      }
                    );
                  }
                  // else if (item.category_id === 3) {
                  //   // Send selected category or service details to agent screen
                  //   navigate("/jcb_crane_registration", {
                  //     state: { service: item },
                  //   });
                  // }
                  else if (service.category_id === 4) {
                    // Send selected category or service details to agent screen
                    navigate(
                      `/drivers_registration/${service.category_id}/${service.category_name}/${service.category_type}`,
                      {
                        state: { service: service },
                      }
                    );
                  } else {
                    // Navigate to join as service provider screen
                    navigate(
                      `/handy_man_registration/${service.category_id}/${service.category_name}/${service.category_type}`,
                      {
                        state: { service: service },
                      }
                    ); // replace with your navigation logic
                  }
                }}
              >
                Join as a{" "}
                {service.category_id === 3
                  ? `${service.category_name} Partner`
                  : service.category_id === 5
                  ? `${service.category_name} Partner`
                  : service.category_id === 4
                  ? `${service.category_name}`
                  : null}
              </Button>
            </div>
          </div>

          {service.category_id === 3 ? (
            <LocationTimeForm onCitySelect={onCitySelect} />
          ) : service.category_id === 5 ? (
            <HandyManEstimationForm onCitySelect={onCitySelect} />
          ) : service.category_id === 4 ? (
            <DriversEstimationForm onCitySelect={onCitySelect} />
          ) : null}
        </div>
      </section>
      {/* Placeholder for Intersection Observer */}
      <div id="lazy-bg-image" style={{ height: "1px", visibility: "hidden" }} />
    </>
  );
};

export default TimeEstimationBanner;
