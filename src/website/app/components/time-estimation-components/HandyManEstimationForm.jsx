/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";

import { Tilt } from "react-tilt";
import LocationSearchingOutlinedIcon from "@mui/icons-material/LocationSearchingOutlined";
import { KeyboardArrowDown } from "@mui/icons-material";
import { motion } from "framer-motion";
import { FiX } from "react-icons/fi";
import { useLoadScript } from "@react-google-maps/api";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import {
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  useMediaQuery,
  FormHelperText,
} from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Box } from "@mui/system";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import {
  Person2Rounded,
  Phone,
  LocationCity,
  ArrowForward,
} from "@mui/icons-material";
import InputAdornment from "@mui/material/InputAdornment";
import { LoadingButton } from "@mui/lab";
import {
  mapKey,
  serverWebsiteEndPoint,
} from "../../../../dashboard/app/constants";
import { FaClock } from "react-icons/fa6";
const libraries = ["places"]; // Load the places library

// eslint-disable-next-line react/prop-types
const HandyManEstimationForm = ({ onCitySelect }) => {
  const location = useLocation();
  const { service } = location.state || {};
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: mapKey, // Replace with your API key
    libraries,
  });

  // State to manage form inputs
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");
  const [workDescription, setWorkDescription] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [requiredHours, setRequiredHours] = useState("");
  const [cities, setCities] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Toggle modal visibility
  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropSuggestions, setDropSuggestions] = useState([]);

  const pickupInputRef = useRef(null); // Reference for pickup input
  const dropInputRef = useRef(null); // Reference for drop input
  const [pickupPlaceId, setPickupPlaceId] = useState(null);
  const [dropPlaceId, setDropPlaceId] = useState(null);

  // State to store the selected city's data
  // const [selectedCity, setSelectedCity] = useState({
  //   bgImage: null,
  //   coveredDistance: null,
  //   city_id: -1,
  // });
  const [selectedCity, setSelectedCity] = useState();
  const [selectedCityId, setSelectedCityId] = useState();
  const [selectedCityCoveredDistance, setSelectedCityCoveredDistance] =
    useState();
  const [selectedOtherService, setSelectedOtherService] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState({
    sub_cat_id: -1,
    sub_cat_name: "",
  });
  const [otherService, setOtherServices] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const fetchCities = async () => {
    if (!navigator.onLine) {
      toast.error("No internet connection. Please check your connection.");
      setLoading(false);
      return;
    }

    try {
      const endPoint = `${serverWebsiteEndPoint}/all_allowed_cities`;

      const response = await axios.post(endPoint);

      setCities(response.data.cities);
      const city_name = response.data.cities[0].city_name;
      const city_id = response.data.cities[0].city_id;
      const bg_image = response.data.cities[0].bg_image;
      const covered_distance = response.data.cities[0].covered_distance;
      //setSelectedCity(city_name);
      //onCitySelect(bg_image, covered_distance, city_id);
    } catch (error) {
      setLoading(false);
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle city selection (This will be passed to CitySelection)
  const handleCitySelect = (imageUrl, coveredDistance, city_id) => {
    onCitySelect(imageUrl, coveredDistance, city_id);
    console.log("selectedCity Details", imageUrl, coveredDistance, city_id);
    setSelectedCity({
      bgImage: imageUrl,
      coveredDistance: coveredDistance,
      city_id: city_id,
    });
  };
  // Handle when a pickup location is selected
  const handlePickupSelect = (placeId) => {
    setPickupPlaceId(placeId); // Save the selected placeId for pickup
  };

  // Handle when a drop location is selected
  const handleDropSelect = (placeId) => {
    setDropPlaceId(placeId); // Save the selected placeId for drop
  };
  const navigate = useNavigate();
  // Function to calculate the distance between the two locations
  const fetchDistance = async (pickupPlaceId, dropPlaceId) => {
    try {
      const response = await fetch(
        `${serverWebsiteEndPoint}/distance?origins=${pickupPlaceId}&destinations=${dropPlaceId}`
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();

      if (data && data.rows && data.rows.length > 0) {
        const distance = data.rows[0].elements[0].distance.text;
        console.log("distance_Details::", distance);

        console.log("City ID:", selectedCityId);
        console.log("City Distance:", selectedCityCoveredDistance);

        // Remove "Km" from the distance and convert it to a number
        const numericDistance = parseFloat(distance.replace(" km", ""));
        // Compare the numeric distance with the city's covered distance
        if (numericDistance > selectedCityCoveredDistance) {
          toast.warning(
            `The distance (${numericDistance} km) exceeds the covered distance (${selectedCityCoveredDistance} km) for this city.`
          );
        } else {
          toast.success(`Distance is ${numericDistance} km`);
          navigate(
            "/fare_estimation_result/" +
              selectedCityId +
              "/" +
              service.category_id +
              "/" +
              numericDistance +
              "/" +
              service.category_name
          );
        }
      } else {
        toast.error("Unable to calculate the distance.");
      }
    } catch (error) {
      console.error("Error fetching distance:", error);
      toast.error("Error fetching distance data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubCategoryChange = async (event) => {
    const selectedSubCategory = subCategories.find(
      (sub_cat) => sub_cat.sub_cat_id === event.target.value
    );
    console.log("selectedSubCategory:", selectedSubCategory);
    // Update selected service in state
    setSelectedSubcategory({
      sub_cat_id: selectedSubCategory.sub_cat_id,
      sub_cat_name: selectedSubCategory.sub_cat_name,
    });

    // Trigger async actions based on sub category
    await fetchOtherServices(selectedSubCategory.sub_cat_id);
  };

  useEffect(() => {
    if (isLoaded) {
      const autocompleteService =
        new window.google.maps.places.AutocompleteService();

      const handlePickupInputChange = (e) => {
        const input = e.target.value;
        setPickupLocation(input);

        if (input.length > 0) {
          autocompleteService.getPlacePredictions(
            { input },
            (predictions, status) => {
              if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                setPickupSuggestions(predictions);
              } else {
                setPickupSuggestions([]);
              }
            }
          );
        } else {
          setPickupSuggestions([]); // Clear suggestions if input is empty
        }
      };

      //   const handleDropInputChange = (e) => {
      //     const input = e.target.value;
      //     setDropLocation(input);

      //     if (input.length > 0) {
      //       autocompleteService.getPlacePredictions(
      //         { input },
      //         (predictions, status) => {
      //           if (status === window.google.maps.places.PlacesServiceStatus.OK) {
      //             setDropSuggestions(predictions);
      //           } else {
      //             setDropSuggestions([]);
      //           }
      //         }
      //       );
      //     } else {
      //       setDropSuggestions([]); // Clear suggestions if input is empty
      //     }
      //   };

      const pickupInputElement = pickupInputRef.current;
      //   const dropInputElement = dropInputRef.current;

      pickupInputElement.addEventListener("input", handlePickupInputChange);
      //   dropInputElement.addEventListener("input", handleDropInputChange);

      return () => {
        pickupInputElement.removeEventListener(
          "input",
          handlePickupInputChange
        );
        // dropInputElement.removeEventListener("input", handleDropInputChange);
      };
    }
  }, [isLoaded]);

  const fetchSubCategory = async () => {
    try {
      const endPoint = `${serverWebsiteEndPoint}/all_sub_categories`;
      const response = await axios.post(endPoint, {
        category_id: service.category_id,
      });
      setSubCategories(response.data.sub_categories_details);
    } catch (error) {
      handleError(error);
    } finally {
      //setIsLoading(false);
    }
  };

  const fetchOtherServices = async (sub_cat_id) => {
    try {
      const endPoint = `${serverWebsiteEndPoint}/all_other_services`;
      const response = await axios.post(endPoint, { sub_cat_id: sub_cat_id });
      setOtherServices(response.data.other_services_details);
    } catch (error) {
      handleError(error);
    } finally {
      //setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
    fetchSubCategory();
  }, []);

  useEffect(() => {
    if (cities.length > 0) {
      const { bg_image, covered_distance, city_id } = cities[0]; // Destructure to get values
      setSelectedCity(cities[0].city_name);
      setSelectedCityId(cities[0].city_id);
      setSelectedCityCoveredDistance(cities[0].covered_distance);
      onCitySelect(bg_image, covered_distance, city_id); // Trigger the onCitySelect callback
    }
  }, [cities]);

  const handlePickupSuggestionClick = (suggestion) => {
    handlePickupSelect(suggestion.place_id);
    setPickupLocation(suggestion.description);
    setPickupSuggestions([]); // Hide suggestions after selection
  };

  const handleDropSuggestionClick = (suggestion) => {
    handleDropSelect(suggestion.place_id);
    setDropLocation(suggestion.description);
    setDropSuggestions([]); // Hide suggestions after selection
  };

  const isMobile = useMediaQuery("(max-width: 600px)");

  const [hover, setHover] = useState(false);
  const [loading, setLoading] = useState(false);

  // initial login credentials
  const initialValues = {
    pickupLocation: "",
    workDescription: "",
    contactName: "",
    contactNumber: "",
    requiredHours: "",
    sub_cat_id: "",
    service_id: "-1",
    purpose: "",
  };

  const [purpose, setPurpose] = useState("");
  const handleFormSubmit = async (values, { resetForm }) => {
    setLoading(true);
    handleRegister("local");
    //fetchDistance(pickupPlaceId, dropPlaceId); //doing async to get the distance
  };

  // form field validation schema
  //   const validationSchema = Yup.object().shape({
  //     pickupLocation: Yup.string().required("Pickup Location is required!"),
  //     dropLocation: Yup.string().required("Drop Location is required!"),
  //     requiredHours: Yup.string().required("Hours is required!"),
  //     contactName: Yup.string().required("Full Name is required!"),
  //     contactNumber: Yup.string()
  //       .required("Phone Number is required!")
  //       .matches(/^[0-9]+$/, "Phone number must contain only digits") // Allow only digits
  //       .min(9, "Phone number must be at least 10 digits") // Adjust the length requirement as needed
  //       .max(10, "Phone number must be no more than 10 digits"),
  //     purpose: Yup.string().required("Please select the Purpose ?"),
  //   });

  const validationSchema = Yup.object().shape({
    pickupLocation: Yup.string().required("Work Location is required!"),
    workDescription: Yup.string().required("Work Description is required!"),
    // dropLocation: Yup.string().required("Drop Location is required!"),
    requiredHours: Yup.number()
      .typeError("Hours must be a number")
      .required("Hours is required!")
      .min(1, "Minimum of 1 hour is required"), // Add a minimum if necessary
    contactName: Yup.string().required("Full Name is required!"),
    contactNumber: Yup.string()
      .required("Phone Number is required!")
      .matches(/^[0-9]+$/, "Phone number must contain only digits") // Allow only digits
      .min(9, "Phone number must be at least 10 digits") // Adjust the length requirement as needed
      .max(10, "Phone number must be no more than 10 digits"),
    purpose: Yup.string().required("Please select the Purpose ?"),
  });

  // Handle city click
  const handleCityClick = (city) => {
    setSelectedCity(city.city_name);
    onCitySelect(city.bg_image, city.covered_distance, city.city_id);
    setSelectedCityId(city.city_id);
    setSelectedCityCoveredDistance(city.covered_distance);
    toggleModal(); // Close modal after selection
  };

  useEffect(() => {
    console.log("selectedCityId:", selectedCityId);
    console.log("selectedCityId:", selectedCityCoveredDistance);
  }, [selectedCityId, selectedCityCoveredDistance]);

  const handleRegister = async (request_type) => {
    // e.preventDefault();
    // setBtnLoading(true);
    // if (!validateForm()) return;

    const payload = {
      category_id: service.category_id,
      start_address: pickupLocation,
      work_description: workDescription,
      sub_cat_id: selectedSubcategory.sub_cat_id || -1,
      service_id: selectedOtherService || -1,
      hours: requiredHours,
      //   days: requiredDays,
      name: contactName,
      mobile_no: contactNumber,
      purpose: purpose,
      city_id: selectedCityId,
      request_type: request_type,
    };

    try {
      const response = await axios.post(
        `${serverWebsiteEndPoint}/add_new_estimation_request`,
        payload
      );

      if (response.status === 200) {
        toast.success("Estimation Request Sent Successful!");
        navigate(
          "/handy_man_estimation_result/" +
            selectedCityId +
            "/" +
            service.category_id +
            "/" +
            requiredHours +
            "/" +
            service.category_name +
            "/" +
            selectedSubcategory.sub_cat_name
        );
      }
    } catch (error) {
      // handleError(error);
      console.log("error::" + error);
    } finally {
      // setBtnLoading(false);
    }
  };

  const handleError = (error) => {
    if (error.response) {
      if (error.response.status === 404) {
        toast.error("No Data Found.");
        // setError("No Data Found");
      } else if (error.response.status === 500) {
        toast.error("Internal server error. Please try again later.");
        // setError("Internal Server Error");
      } else if (error.response.status === 409) {
        toast.warning(
          "This Service HandyMan Registration has already been sent to us.\nWe Are working on it"
        );
        // setError("Internal Server Error");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
        // setError("Unexpected Error");
      }
    } else {
      toast.error(
        "Failed to fetch all allowed cities. Please check your connection."
      );
      //   // setError("Network Error");
    }
  };

  return (
    <>
      <div className=" relative flex items-center justify-center h-full w-full lg:mt-0 mt-[0rem]">
        <Box className="bg-white p-8 shadow-lg rounded-sm w-full lg:max-w-[30rem] max-w-[30rem] max-h-[55rem] lg:mt-0 mt-5">
          {/* <CitySelectorMobile onCitySelect={handleCitySelect} /> */}
          <div>
            {/* City Selector for mobile */}
            <div
              className=" flex justify-start items-center  rounded-md cursor-pointer"
              onClick={toggleModal}
            >
              <div className="flex items-center justify-start mb-1 pb-4">
                <LocationSearchingOutlinedIcon
                  style={{ fontSize: "16px", fontWeight: "bold" }}
                />
                <p className="ml-2 font-titillium font-bold">{selectedCity}</p>
                <KeyboardArrowDown
                  style={{ fontSize: "18px", marginLeft: "5px" }}
                />
              </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
              <div className="fixed bg-white inset-0 bg-opacity-50 flex justify-center shadow-lg items-center z-20 p-6">
                <div className="bg-white p-6 rounded-lg w-full lg:w-1/2 shadow-lg">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg text-black text-center mb-4">
                      Select your City
                    </h3>
                    <FiX
                      className="text-2xl text-black cursor-pointer"
                      onClick={toggleModal}
                    />
                  </div>
                  <ul className="flex gap-4 justify-evenly flex-wrap">
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
                                src={city.bg_image}
                                alt={city.city_name}
                                className="sm:w-14 sm:h-14 w-10 h-10 rounded-md m-1"
                              />
                            </div>
                          </motion.div>
                        </Tilt>
                        <span className="text-gray mt-2 text-[12px]">
                          {city.city_name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          <Formik
            onSubmit={handleFormSubmit}
            validationSchema={validationSchema}
            initialValues={initialValues}
          >
            {/* Pickup Location */}
            {({ values, errors, touched, handleBlur, handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                {/* Pickup Location Search  */}
                <div className="relative flex flex-col">
                  <TextField
                    fullWidth
                    ref={pickupInputRef}
                    id="pickup_location"
                    label="Work Location"
                    margin="dense"
                    variant="outlined"
                    autoComplete="off"
                    placeholder="Enter your Work Location"
                    value={pickupLocation}
                    onChange={(e) => {
                      setPickupLocation(e.target.value);
                      if (e.target.value) {
                        values.pickupLocation = pickupLocation;
                      }
                    }}
                    size={isMobile ? "small" : "medium"}
                    className="mb-4"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOnIcon
                            style={{ color: "gray", fontSize: "14px" }}
                          />
                        </InputAdornment>
                      ),
                    }}
                    onBlur={handleBlur}
                    helperText={touched.pickupLocation && errors.pickupLocation}
                    error={Boolean(
                      errors.pickupLocation && touched.pickupLocation
                    )}
                  />

                  {/* Custom Suggestions List for Pickup Location */}
                  {pickupSuggestions.length > 0 && (
                    <ul className="absolute bg-white shadow-md mt-[3rem] rounded-md z-20">
                      {pickupSuggestions.map((suggestion) => (
                        <li
                          key={suggestion.place_id}
                          className="p-2 cursor-pointer hover:bg-gray-200"
                          onClick={() =>
                            handlePickupSuggestionClick(suggestion)
                          } // Trigger custom suggestion selection
                        >
                          <span className="text-[10px]">
                            {suggestion.description}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Work Description */}
                <TextField
                  fullWidth
                  id="mobile"
                  label="Work Description"
                  placeholder="Enter your work Description"
                  type="text"
                  margin="dense"
                  multiline
                  rows={4}
                  size={isMobile ? "small" : "medium"}
                  value={workDescription}
                  onChange={(e) => {
                    setWorkDescription(e.target.value);
                    if (e.target.value) {
                      values.workDescription = e.target.value;
                    }
                  }}
                  variant="outlined"
                  autoComplete="off"
                  className="mb-4"
                  onBlur={handleBlur}
                  helperText={touched.workDescription && errors.workDescription}
                  error={Boolean(
                    errors.workDescription && touched.workDescription
                  )}
                />

                {/* Customer Name */}
                <TextField
                  fullWidth
                  id="mobile"
                  label="Full Name"
                  placeholder="Enter your Full Name"
                  type="text"
                  margin="dense"
                  size={isMobile ? "small" : "medium"}
                  value={contactName}
                  onChange={(e) => {
                    setContactName(e.target.value);
                    if (e.target.value) {
                      values.contactName = contactName;
                    }
                  }}
                  variant="outlined"
                  autoComplete="off"
                  className="mb-4"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person2Rounded
                          style={{ color: "gray", fontSize: "14px" }}
                        />
                      </InputAdornment>
                    ),
                  }}
                  onBlur={handleBlur}
                  helperText={touched.contactName && errors.contactName}
                  error={Boolean(errors.contactName && touched.contactName)}
                />

                {/* Minimum Hours  */}
                <TextField
                  fullWidth
                  id="mobile"
                  label="Minimum Hours"
                  autoComplete="off"
                  placeholder="Enter time needed in hours [Ex : 1]"
                  type="tel"
                  margin="dense"
                  size={isMobile ? "small" : "medium"}
                  value={requiredHours}
                  onChange={(e) => {
                    const hours = e.target.value;
                    setRequiredHours(hours);
                    values.requiredHours = hours; // Set the new value directly
                    console.log("requiredHours::", values.requiredHours);
                  }}
                  variant="outlined"
                  className="mb-4"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FaClock style={{ color: "gray", fontSize: "14px" }} />
                      </InputAdornment>
                    ),
                  }}
                  onBlur={handleBlur}
                  helperText={touched.requiredHours && errors.requiredHours}
                  error={Boolean(errors.requiredHours && touched.requiredHours)}
                />

                {/* Customer Contact Number */}
                <div className="block mb-2">
                  <TextField
                    fullWidth
                    id="mobile"
                    label="Phone Number"
                    autoComplete="off"
                    placeholder="Enter your phone number"
                    type="tel"
                    margin="dense"
                    size={isMobile ? "small" : "medium"}
                    value={contactNumber}
                    onChange={(e) => {
                      const number = e.target.value;
                      setContactNumber(number);
                      if (number) {
                        values.contactNumber = number;
                      }
                    }}
                    variant="outlined"
                    className="mb-4"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone style={{ color: "gray", fontSize: "14px" }} />
                        </InputAdornment>
                      ),
                    }}
                    onBlur={handleBlur}
                    helperText={touched.contactNumber && errors.contactNumber}
                    error={Boolean(
                      errors.contactNumber && touched.contactNumber
                    )}
                  />
                </div>

                {/* Conditionally Render Subcategory Dropdown */}
                {service.category_type === "Service" &&
                  subCategories.length > 0 && (
                    <div className="mb-4 mt-3">
                      <FormControl
                        fullWidth
                        size={isMobile ? "small" : "medium"}
                        error={!!errors.sub_cat_id}
                      >
                        <InputLabel id="subcategory-label">
                          Service Type
                        </InputLabel>
                        <Select
                          labelId="subcategory-label"
                          id="subcategory"
                          label="Service Type"
                          value={selectedSubcategory.sub_cat_id}
                          onChange={handleSubCategoryChange}
                        >
                          {subCategories.map((subcategory) => (
                            <MenuItem
                              key={subcategory.sub_cat_id}
                              value={subcategory.sub_cat_id}
                            >
                              {subcategory.sub_cat_name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                  )}

                {/* Conditionally Render Other Services Dropdown */}
                {service.category_type === "Service" &&
                  selectedSubcategory &&
                  otherService.length > 0 && (
                    <div className="mb-4 mt-3">
                      <FormControl
                        fullWidth
                        size={isMobile ? "small" : "medium"}
                        error={!!errors.otherService}
                      >
                        <InputLabel id="other-services-label">
                          Expertise In?
                        </InputLabel>
                        <Select
                          labelId="other-services-label"
                          id="other-services"
                          label="Other Services"
                          value={selectedOtherService}
                          onChange={(e) =>
                            setSelectedOtherService(e.target.value)
                          }
                        >
                          {otherService.map((service) => (
                            <MenuItem
                              key={service.service_id}
                              value={service.service_id}
                            >
                              {service.service_name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                  )}

                {/* Purpose Dropdown */}
                <FormControl
                  fullWidth
                  className="mb-6"
                  size={isMobile ? "small" : "medium"}
                  error={Boolean(errors.purpose && touched.purpose)} // Set error prop
                >
                  <InputLabel id="purpose-label">Purpose</InputLabel>
                  <Select
                    labelId="purpose-label"
                    id="purpose"
                    label="Purpose"
                    value={purpose} // Bind to Formik value
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      console.log("selectedPurpose::", selectedValue);
                      values.purpose = selectedValue;
                      setPurpose(selectedValue); // Update local state
                    }}
                    onBlur={handleBlur}
                  >
                    <MenuItem value="personal">Personal</MenuItem>
                    <MenuItem value="business">Business</MenuItem>
                  </Select>
                  {touched.purpose && errors.purpose && (
                    <FormHelperText>{errors.purpose}</FormHelperText> // Show helper text
                  )}
                </FormControl>

                {/* Register Button */}
                <div className="flex items-center justify-center mt-4">
                  <LoadingButton
                    type="submit"
                    color="primary"
                    loading={loading}
                    variant="contained"
                    sx={{ my: 2 }}
                    onMouseEnter={() => setHover(true)} // On hover start
                    onMouseLeave={() => setHover(false)} // On hover end
                    style={{
                      display: "flex",
                      justifyContent: "space-between", // Align arrow to the right
                      alignItems: "center",
                      transition: "transform 0.2s ease", // Smooth scaling transition
                    }}
                  >
                    Get An Estimation For {service.category_name}
                    {/* {service.service.category_type === "Delivery"
                      ? `${service.category_name} Driver `
                      : `Service ${service.category_name}`} */}
                    <ArrowForward
                      style={{
                        fontSize: hover ? "28px" : "20px", // Scale the icon on hover
                        marginLeft: "8px", // Space between text and icon
                        transition: "font-size 0.2s ease", // Smooth transition for scaling
                      }}
                    />
                  </LoadingButton>
                </div>
              </form>
            )}
          </Formik>
        </Box>
      </div>
    </>
  );
};

export default HandyManEstimationForm;
