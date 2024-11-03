/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import { SectionWrapper } from "../hoc";
import { textVariant } from "../utils/motion";
import { motion } from "framer-motion";
import { Typography, Box, Card, CardMedia, CardContent } from "@mui/material";
import { serverWebsiteEndPoint } from "../../../dashboard/app/constants";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";

const OurLocations = () => {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCities = async () => {
    if (!navigator.onLine) {
      toast.error("No internet connection. Please check your connection.");
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
  };

  useEffect(() => {
    fetchCities();
  }, []);

  return (
    <div className=" mb-20">
      <motion.div
        initial="hidden"
        whileInView="show"
        variants={textVariant()}
        className="mt-10 mb-10"
      >
        <Typography
          variant="h6"
          sx={{
            color: "text.primary",
            fontSize: { xs: "26px", md: "35px" },
            fontWeight: "bold",
            textAlign: "center",
            fontFamily: "titillium",
            mb: 4,
          }}
        >
          We proudly extend our services across the{" "}
          <span
            style={{
              color: "#4087e1",
              fontFamily: "titillium",
              fontWeight: "bold",
            }}
          >
            following areas
          </span>
        </Typography>
      </motion.div>

      <Carousel
        indicators={false}
        autoPlay={true}
        animation="slide"
        interval={3000}
        navButtonsAlwaysVisible={true}
      >
        {cities.map((area, index) => (
          <Box key={index} sx={{ width: "100%" }}>
            <Card sx={{ height: "100%", position: "relative" }}>
              <CardMedia
                component="div"
                sx={{
                  height: "200px",
                  backgroundImage: `url(${area.bg_image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  filter: "brightness(0.5)", // Darken entire image
                }}
              />
              <CardContent
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  color: "#fff",
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", fontFamily: "titillium" }}
                >
                  {area.city_name}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Carousel>
    </div>
  );
};

export default SectionWrapper(OurLocations, "/");
