// /* eslint-disable no-unused-vars */
// import React, { useEffect, useState } from "react";
// import { Box, Container, Typography, Grid, Button } from "@mui/material";
// import Carousel from "react-material-ui-carousel";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import axios from "axios";
// import { serverWebsiteEndPoint } from "../../../../dashboard/app/constants";

// const HeroBanner = () => {
//   const [services, setServices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   const fetchAllServices = async () => {
//     if (!navigator.onLine) {
//       toast.error("No internet connection. Please check your connection.");
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `${serverWebsiteEndPoint}/all_services`,
//         {},
//         {
//           headers: {
//             Accept: "application/json",
//             "Content-Type": "application/json; charset=UTF-8",
//           },
//         }
//       );
//       setServices(response.data.services_details);
//     } catch (error) {
//       handleError(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleError = (error) => {
//     if (error.response) {
//       if (error.response.status === 404) {
//         toast.error("No Data Found.");
//         setError("No Data Found");
//       } else if (error.response.status === 500) {
//         toast.error("Internal server error. Please try again later.");
//         setError("Internal Server Error");
//       } else {
//         toast.error("An unexpected error occurred. Please try again.");
//         setError("Unexpected Error");
//       }
//     } else {
//       toast.error(
//         "Failed to fetch all allowed cities. Please check your connection."
//       );
//       setError(error);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchAllServices();
//   }, []);

//   return (
//     <Box component="section" sx={{ backgroundColor: "#ffff", py: 1 }}>
//       <Container>
//         <Grid container spacing={6} alignItems="center">
//           {/* Carousel Section */}
//           <Grid item xs={12} md={7}>
//             <Carousel
//               indicators={false}
//               autoPlay={true}
//               animation="slide"
//               navButtonsAlwaysVisible={true}
//               navButtonsProps={{
//                 style: {
//                   backgroundColor: "transparent",
//                   color: "#0072ce",
//                 },
//               }}
//               IndicatorIconButtonProps={{
//                 style: {
//                   width: "120px",
//                   height: "2px",
//                   color: "#0072ce",
//                 },
//               }}
//               activeIndicatorIconButtonProps={{
//                 style: {
//                   color: "#0072ce",
//                 },
//               }}
//               indicatorContainerProps={{
//                 style: {
//                   marginTop: "10px",
//                 },
//               }}
//             >
//               {services.map((item, index) => (
//                 <Box key={index} textAlign="center" p={2}>
//                   <img
//                     src={item.category_image}
//                     alt={`slide-${index}`}
//                     loading="lazy"
//                     style={{
//                       width: "100%",
//                       height: "200px",
//                       maxHeight: "200px",
//                       objectFit: "contain",
//                     }}
//                   />
//                   <Typography
//                     variant="h4"
//                     mt={2}
//                     style={{ color: "#0072ce" }}
//                     sx={{ fontWeight: "bold", fontFamily: "titillium" }}
//                   >
//                     {item.category_name}
//                   </Typography>
//                   <Typography
//                     variant="body1"
//                     mt={5}
//                     sx={{ fontFamily: "titillium" }}
//                   >
//                     {item.description}
//                   </Typography>
//                   <Box display="flex" gap={5} justifyContent="center">
//                     <Button
//                       variant="contained"
//                       color="warning"
//                       sx={{ marginTop: "1rem" }}
//                       onClick={() => {
//                         if (item.category_id === 1 || item.category_id === 2) {
//                           // Navigate to the get_estimation screen
//                           console.log("item::", item);
//                           navigate("/get_estimation", {
//                             state: { service: item },
//                           });
//                         } else if (item.category_id === 3) {
//                           navigate("/get_jcb_estimation", {
//                             state: { service: item },
//                           });
//                         } else if (item.category_id === 4) {
//                           navigate("/get_drivers_estimation", {
//                             state: { service: item },
//                           });
//                         } else {
//                           navigate("/get_handy_man_estimation", {
//                             state: { service: item },
//                           });
//                         }
//                       }}
//                     >
//                       Get Estimation
//                     </Button>
//                     {/* <Button
//                       variant="contained"
//                       sx={{ marginTop: "1rem" }}
//                       onClick={() => {
//                         if (
//                           item.category_id === 1 ||
//                           item.category_id === 2 ||
//                           item.category_id === 3
//                         ) {
//                           // Send selected category or service details to agent screen
//                           console.log("item::", item);
//                           navigate(
//                             `/agents/${item.category_id}/${item.category_name}/${item.category_type}`,
//                             {
//                               state: { service: item },
//                             }
//                           );
//                         }
//                         // else if (item.category_id === 3) {
//                         //   // Send selected category or service details to agent screen
//                         //   navigate("/jcb_crane_registration", {
//                         //     state: { service: item },
//                         //   });
//                         // }
//                         else if (item.category_id === 4) {
//                           // Send selected category or service details to agent screen
//                           navigate(
//                             `/drivers_registration/${item.category_id}/${item.category_name}/${item.category_type}`,
//                             {
//                               state: { service: item },
//                             }
//                           );
//                         } else {
//                           // Navigate to join as service provider screen
//                           navigate(
//                             `/handy_man_registration/${item.category_id}/${item.category_name}/${item.category_type}`,
//                             {
//                               state: { service: item },
//                             }
//                           ); // replace with your navigation logic
//                         }
//                       }}
//                     >
//                       if(item.category_id == 1 || item.category_id == 2) Attach
//                       your vehicle else if(item.category_id == 3) Join as Jcb or
//                       Crane Driver else if(item.category_id == 4) Join as Driver
//                       else if(item.category_id == 5) Join as HandyMan
//                     </Button> */}
//                     <Button
//                       variant="contained"
//                       sx={{ marginTop: "1rem" }}
//                       onClick={() => {
//                         if (item.category_id === 1 || item.category_id === 2) {
//                           // Navigate for vehicle attachment
//                           navigate(
//                             `/agents/${item.category_id}/${item.category_name}/${item.category_type}`,
//                             {
//                               state: { service: item },
//                             }
//                           );
//                         } else if (item.category_id === 3) {
//                           // Navigate for JCB or Crane Driver registration
//                           navigate(
//                             `/jcb_crane_registration/${item.category_id}/${item.category_name}/${item.category_type}`,
//                             {
//                               state: { service: item },
//                             }
//                           );
//                         } else if (item.category_id === 4) {
//                           // Navigate for Driver registration
//                           navigate(
//                             `/drivers_registration/${item.category_id}/${item.category_name}/${item.category_type}`,
//                             {
//                               state: { service: item },
//                             }
//                           );
//                         } else if (item.category_id === 5) {
//                           // Navigate for HandyMan registration
//                           navigate(
//                             `/handy_man_registration/${item.category_id}/${item.category_name}/${item.category_type}`,
//                             {
//                               state: { service: item },
//                             }
//                           );
//                         }
//                       }}
//                     >
//                       {item.category_id === 1 || item.category_id === 2
//                         ? "Attach Your Vehicle"
//                         : item.category_id === 3
//                         ? "Join as JCB or Crane Partner"
//                         : item.category_id === 4
//                         ? "Join as Driver"
//                         : item.category_id === 5
//                         ? "Join as HandyMan"
//                         : "Join as Service Provider"}
//                     </Button>
//                   </Box>
//                 </Box>
//               ))}
//             </Carousel>
//           </Grid>

//           {/* Text and QR Section */}
//           <Grid item xs={12} md={5} spacing={2}>
//             <img
//               src="/logo_new.png"
//               alt="logo"
//               loading="lazy"
//               style={{
//                 // width: "100%",
//                 height: "200px",
//                 marginLeft: "-20px",
//                 maxHeight: "200px",
//                 display: "flex",
//                 alignItems: "start",
//                 justifyContent: "start",
//                 objectFit: "contain",
//               }}
//             />
//             <Typography
//               variant="h6"
//               sx={{ fontWeight: "bold", fontFamily: "titillium" }}
//             >
//               <span
//                 style={{
//                   color: "#0072ce",
//                   fontWeight: "bold",
//                   fontFamily: "titillium",
//                 }}
//               >
//                 Get Ready!
//               </span>{" "}
//               Our App is{" "}
//               <span
//                 style={{
//                   color: "#0072ce",
//                   fontWeight: "bold",
//                   fontFamily: "titillium",
//                 }}
//               >
//                 Coming Soon
//               </span>
//             </Typography>

//             <Box display="flex" mt={3}>
//               <Button component="a" href="" target="_blank">
//                 <img
//                   src="/assets/images/play_store.png"
//                   alt="Play Store"
//                   loading="lazy"
//                 />
//               </Button>
//               <Button component="a" href="" target="_blank" sx={{ ml: 2 }}>
//                 <img
//                   src="/assets/images/app_store.png"
//                   alt="App Store"
//                   loading="lazy"
//                 />
//               </Button>
//             </Box>
//           </Grid>
//         </Grid>
//       </Container>
//     </Box>
//   );
// };

// export default HeroBanner;

/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  CircularProgress,
} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import ContentLoader from "react-content-loader";
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
    <Box component="section" sx={{ backgroundColor: "#ffff", py: 1 }}>
      <Container>
        <Grid container spacing={6} alignItems="center">
          {/* Carousel Section */}
          <Grid item xs={12} md={7}>
            {loading ? (
              <ContentLoader
                speed={2}
                width="100%"
                height={300}
                backgroundColor="#f3f3f3"
                foregroundColor="#ecebeb"
              >
                {/* Shimmer boxes */}
                <rect x="0" y="0" rx="5" ry="5" width="100%" height="200" />
                <rect x="0" y="210" rx="5" ry="5" width="60%" height="20" />
                <rect x="0" y="240" rx="5" ry="5" width="80%" height="15" />
              </ContentLoader>
            ) : (
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
                        height: "200px",
                        maxHeight: "200px",
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
                          if (
                            item.category_id === 1 ||
                            item.category_id === 2
                          ) {
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
                            item.category_id === 2
                          ) {
                            navigate(
                              `/agents/${item.category_id}/${item.category_name}/${item.category_type}`,
                              {
                                state: { service: item },
                              }
                            );
                          } else if (item.category_id === 3) {
                            navigate(
                              `/jcb_crane_registration/${item.category_id}/${item.category_name}/${item.category_type}`,
                              {
                                state: { service: item },
                              }
                            );
                          } else if (item.category_id === 4) {
                            navigate(
                              `/drivers_registration/${item.category_id}/${item.category_name}/${item.category_type}`,
                              {
                                state: { service: item },
                              }
                            );
                          } else {
                            navigate(
                              `/handy_man_registration/${item.category_id}/${item.category_name}/${item.category_type}`,
                              {
                                state: { service: item },
                              }
                            );
                          }
                        }}
                      >
                        {item.category_id === 1 || item.category_id === 2
                          ? "Attach Your Vehicle"
                          : item.category_id === 3
                          ? "Join as JCB or Crane Partner"
                          : item.category_id === 4
                          ? "Join as Driver"
                          : item.category_id === 5
                          ? "Join as HandyMan"
                          : "Join as Service Provider"}
                      </Button>
                    </Box>
                  </Box>
                ))}
              </Carousel>
            )}
          </Grid>
          {/* Text and QR Section */}
          <Grid item xs={12} md={5} spacing={2}>
            <img
              src="/logo_new.png"
              alt="logo"
              loading="lazy"
              style={{
                height: "200px",
                marginLeft: "-20px",
                maxHeight: "200px",
                display: "flex",
                alignItems: "start",
                justifyContent: "start",
                objectFit: "contain",
              }}
            />
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", fontFamily: "titillium" }}
            >
              <span style={{ color: "#0072ce" }}>Get Ready!</span> Our App is{" "}
              <span style={{ color: "#0072ce" }}>Coming Soon</span>
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
