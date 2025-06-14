/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa6";
import { FaMessage } from "react-icons/fa6";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import { SlideRight } from "../../utils/animation";
import { toast } from "react-toastify";
import axios from "axios";
import {
  Box,
  CircularProgress,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { serverWebsiteEndPoint } from "../../../../dashboard/app/constants";

const HeroNew = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isSmUp = useMediaQuery("(min-width: 640px)");

  const fetchAllServices = async () => {
    if (!navigator.onLine) {
      toast.error("No internet connection. Please check your connection.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${serverWebsiteEndPoint}/all_services`,
        {}
      );
      setServices(response.data.services_details);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

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
      toast.error(
        "Failed to fetch all allowed cities. Please check your connection."
      );
      setError("Network Error");
    }
    setLoading(false);
  };

  // Function to generate random light colors
  const generateRandomLightColor = () => {
    const letters = "BCDEF"; // Limit to light colors
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
  };

  useEffect(() => {
    fetchAllServices();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % services.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [services]);

  const currentService = services[currentIndex];

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!currentService) return null;

  return (
    <main className="overflow-x-hidden">
      <motion.section
        style={{ backgroundColor: generateRandomLightColor() }} // Apply random light color
        transition={{ duration: 0.8 }}
        className="text-white"
      >
        <div className="container grid grid-cols-1 md:grid-cols-2 h-screen md:h-[700px] relative">
          {/* Info Section */}
          <div className="flex flex-col justify-center py-14 md:py-0 xl:max-w-[500px] order-2 md:order-1">
            <div className="space-y-5 md:space-y-7 text-center md:text-left">
              <AnimatePresence mode="wait">
                <motion.h1
                  key={currentService.category_id}
                  variants={SlideRight(0.2)}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="text-3xl lg:text-4xl xl:text-5xl font-titillium"
                >
                  {currentService.category_name}
                </motion.h1>
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.p
                  key={currentService.category_id}
                  variants={SlideRight(0.4)}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="text-sm leading-loose text-white/80"
                >
                  {/* {currentService.category_description} */}
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint
                  aperiam exercitationem recusandae delectus necessitatibus
                  architecto repellendus minus, iure repudiandae voluptas?
                  Tempore eum beatae accusantium aliquam dolorem, odit sit esse
                  quaerat illum at possimus. Aperiam?
                </motion.p>
              </AnimatePresence>

              <motion.p
                key={currentService.category_id}
                variants={SlideRight(0.4)}
                initial="hidden"
                animate="show"
                exit="exit"
                className="text-3xl lg:text-4xl xl:text-5xl font-titillium"
              >
                {currentService.category_name}
              </motion.p>

              {/* Social Icons Section */}
              <div className="flex items-center justify-center md:justify-start gap-4 text-3xl">
                <FaInstagram className="cursor-pointer border rounded-full p-[6px]" />
                <FaFacebook className="cursor-pointer border rounded-full p-[6px]" />
                <FaTwitter className="cursor-pointer border rounded-full p-[6px]" />
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className="flex flex-col items-center justify-center order-1 md:order-2 relative">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentService.category_id}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: easeInOut, delay: 0 }}
                exit={{ opacity: 0, x: -100 }}
                src={currentService.category_image || "/assets/about.svg"}
                alt={currentService.category_name}
                className="w-[300px] md:w-[500px] xl:w-[800px] relative z-10"
              />
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentService.category_id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, ease: easeInOut, delay: 0 }}
                exit={{ opacity: 0 }}
                className="text-[300px] absolute top-0 left-1/2 -translate-x-1/3 -translate-y-1/4 z-0 text-white/5 font-poppins font-extrabold"
              >
                {currentService.category_name}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Chat Icon */}
          <div className="absolute bottom-10 right-10 z-[999]">
            <FaMessage className="text-2xl cursor-pointer" />
          </div>
        </div>
      </motion.section>
    </main>
  );
};

export default HeroNew;
