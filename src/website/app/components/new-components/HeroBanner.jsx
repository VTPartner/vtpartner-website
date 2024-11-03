/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Box, Container, Typography, Grid, Button } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { serverWebsiteEndPoint } from "../../../../dashboard/app/constants";

const HeroBanner = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
      toast.error(
        "Failed to fetch all allowed cities. Please check your connection."
      );
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
                  width: "120px",
                  height: "2px",
                  color: "#0072ce",
                },
              }}
              activeIndicatorIconButtonProps={{
                style: {
                  color: "#0072ce",
                },
              }}
              indicatorContainerProps={{
                style: {
                  marginTop: "10px",
                },
              }}
            >
              {services.map((item, index) => (
                <Box key={index} textAlign="center" p={2}>
                  <img
                    src={item.category_image}
                    alt={`slide-${index}`}
                    loading="lazy"
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
                    sx={{ fontWeight: "bold", fontFamily: "titillium" }}
                  >
                    {item.category_name}
                  </Typography>
                  <Typography
                    variant="body1"
                    mt={5}
                    sx={{ fontFamily: "titillium" }}
                  >
                    {item.description}
                  </Typography>
                  <Box display="flex" gap={5} justifyContent="center">
                    <Button
                      variant="contained"
                      color="warning"
                      sx={{ marginTop: "1rem" }}
                      onClick={() => {
                        if (item.category_id === 1 || item.category_id === 2) {
                          // Navigate to the get_estimation screen
                          console.log("item::", item);
                          navigate("/get_estimation", {
                            state: { service: item },
                          });
                        } else if (item.category_id === 3) {
                          navigate("/get_jcb_estimation", {
                            state: { service: item },
                          });
                        } else if (item.category_id === 4) {
                          navigate("/get_drivers_estimation", {
                            state: { service: item },
                          });
                        } else {
                          navigate("/get_handy_man_estimation", {
                            state: { service: item },
                          });
                        }
                      }}
                    >
                      Get Estimation
                    </Button>
                    <Button
                      variant="contained"
                      sx={{ marginTop: "1rem" }}
                      onClick={() => {
                        if (
                          item.category_id === 1 ||
                          item.category_id === 2 ||
                          item.category_id === 3
                        ) {
                          // Send selected category or service details to agent screen
                          console.log("item::", item);
                          navigate(
                            `/agents/${item.category_id}/${item.category_name}/${item.category_type}`,
                            {
                              state: { service: item },
                            }
                          );
                        }
                        // else if (item.category_id === 3) {
                        //   // Send selected category or service details to agent screen
                        //   navigate("/jcb_crane_registration", {
                        //     state: { service: item },
                        //   });
                        // }
                        else if (item.category_id === 4) {
                          // Send selected category or service details to agent screen
                          navigate(
                            `/drivers_registration/${item.category_id}/${item.category_name}/${item.category_type}`,
                            {
                              state: { service: item },
                            }
                          );
                        } else {
                          // Navigate to join as service provider screen
                          navigate(
                            `/handy_man_registration/${item.category_id}/${item.category_name}/${item.category_type}`,
                            {
                              state: { service: item },
                            }
                          ); // replace with your navigation logic
                        }
                      }}
                    >
                      Join Now
                    </Button>
                  </Box>
                </Box>
              ))}
            </Carousel>
          </Grid>

          {/* Text and QR Section */}
          <Grid item xs={12} md={5} spacing={2}>
            <img src="/logo_new.png" alt="logo" loading="lazy" />
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", fontFamily: "titillium" }}
            >
              <span
                style={{
                  color: "#0072ce",
                  fontWeight: "bold",
                  fontFamily: "titillium",
                }}
              >
                Get Ready!
              </span>{" "}
              Our App is{" "}
              <span
                style={{
                  color: "#0072ce",
                  fontWeight: "bold",
                  fontFamily: "titillium",
                }}
              >
                Coming Soon
              </span>
            </Typography>

            <Box display="flex" mt={3}>
              <Button component="a" href="" target="_blank">
                <img
                  src="/assets/images/play_store.png"
                  alt="Play Store"
                  loading="lazy"
                />
              </Button>
              <Button component="a" href="" target="_blank" sx={{ ml: 2 }}>
                <img
                  src="/assets/images/app_store.png"
                  alt="App Store"
                  loading="lazy"
                />
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroBanner;
