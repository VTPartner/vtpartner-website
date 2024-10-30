/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Box, Container, Typography, Grid, Button } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { serverWebsiteEndPoint } from "../../../../dashboard/app/constants";

const HeroBanner = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllServices = async () => {
    if (!navigator.onLine) {
      toast.error("No internet connection. Please check your connection.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${serverWebsiteEndPoint}/all_services`,
        {},
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json; charset=UTF-8",
          },
        }
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
      // toast.error(
      //   "Failed to fetch all allowed cities. Please check your connection."
      // );
      toast.error("error:", error.response);
      setError(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAllServices();
  }, []);

  return (
    <Box component="section" sx={{ backgroundColor: "#ffff", py: 4 }}>
      <Container>
        <Grid container spacing={6} alignItems="center">
          {/* Carousel Section */}
          <Grid item xs={12} md={7}>
            <Carousel
              indicators={false}
              autoPlay={true}
              animation="slide"
              navButtonsAlwaysVisible={true}
              navButtonsProps={{
                style: {
                  backgroundColor: "transparent",
                  color: "#0072ce",
                },
              }}
              IndicatorIconButtonProps={{
                style: {
                  width: "120px", // Adjust this value to make the dots wider
                  height: "2px", // Optional: adjust height to make them more rectangular
                  color: "#0072ce", // Inactive color
                },
              }}
              activeIndicatorIconButtonProps={{
                style: {
                  color: "#0072ce", // Active dot color
                },
              }}
              indicatorContainerProps={{
                style: {
                  marginTop: "10px", // Adjust spacing below carousel if needed
                },
              }}
            >
              {services.map((item, index) => (
                <Box key={index} textAlign="center" p={2}>
                  <img
                    src={item.category_image}
                    alt={`slide-${index}`}
                    style={{
                      width: "100%",
                      height: "400px",
                      maxHeight: "400px",
                      objectFit: "contain",
                    }}
                  />
                  <Typography
                    variant="h4"
                    mt={2}
                    style={{ color: "#0072ce" }}
                    sx={{ fontWeight: "bold" }}
                  >
                    {item.category_name}
                  </Typography>
                  <Typography variant="p" mt={5}>
                    {item.description}
                  </Typography>
                </Box>
              ))}
            </Carousel>
          </Grid>

          {/* Text and QR Section */}
          <Grid item xs={12} md={5}>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              <span style={{ color: "#0072ce" }}>Get Ready!</span> Our App is{" "}
              <span style={{ color: "#0072ce" }}>Coming Soon</span>
            </Typography>

            <Box display="flex" mt={3}>
              <Button component="a" href="" target="_blank">
                <img src="/assets/images/play_store.png" alt="Play Store" />
              </Button>
              <Button component="a" href="" target="_blank" sx={{ ml: 2 }}>
                <img src="/assets/images/app_store.png" alt="App Store" />
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroBanner;
