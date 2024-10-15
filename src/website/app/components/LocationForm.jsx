/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { CitySelectorMobile } from "../components";

import { useLoadScript } from "@react-google-maps/api";
import { Formik } from "formik";
import * as Yup from "yup";

import { useNavigate } from "react-router-dom";
import {
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  useMediaQuery,
  FormHelperText,
} from "@mui/material";
import {  toast } from "react-toastify";
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
const libraries = ["places"]; // Load the places library

// eslint-disable-next-line react/prop-types
const LocationForm = ({ onCitySelect }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyAAlmEtjJOpSaJ7YVkMKwdSuMTbTx39l_o", // Replace with your API key
    libraries,
  });

  // State to manage form inputs
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropSuggestions, setDropSuggestions] = useState([]);

  const pickupInputRef = useRef(null); // Reference for pickup input
  const dropInputRef = useRef(null); // Reference for drop input

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

      const handleDropInputChange = (e) => {
        const input = e.target.value;
        setDropLocation(input);

        if (input.length > 0) {
          autocompleteService.getPlacePredictions(
            { input },
            (predictions, status) => {
              if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                setDropSuggestions(predictions);
              } else {
                setDropSuggestions([]);
              }
            }
          );
        } else {
          setDropSuggestions([]); // Clear suggestions if input is empty
        }
      };

      const pickupInputElement = pickupInputRef.current;
      const dropInputElement = dropInputRef.current;

      pickupInputElement.addEventListener("input", handlePickupInputChange);
      dropInputElement.addEventListener("input", handleDropInputChange);

      return () => {
        pickupInputElement.removeEventListener(
          "input",
          handlePickupInputChange
        );
        dropInputElement.removeEventListener("input", handleDropInputChange);
      };
    }
  }, [isLoaded]);

  const handlePickupSuggestionClick = (suggestion) => {
    setPickupLocation(suggestion.description);
    setPickupSuggestions([]); // Hide suggestions after selection
  };

  const handleDropSuggestionClick = (suggestion) => {
    setDropLocation(suggestion.description);
    setDropSuggestions([]); // Hide suggestions after selection
  };
  // Handle city selection (This will be passed to CitySelection)
  const handleCitySelect = (imageUrl) => {
    onCitySelect(imageUrl);
  };

  const isMobile = useMediaQuery("(max-width: 600px)");

  const [hover, setHover] = useState(false);
  const [loading, setLoading] = useState(false);

  // initial login credentials
  const initialValues = {
    pickupLocation: "",
    dropLocation: "",
    contactName: "",
    contactNumber: "",
    purpose: "",
  };

  const [purpose, setPurpose] = useState("");
  const handleFormSubmit = async (values, { resetForm }) => {
    setLoading(true);
    toast.warning("This Feature is still under development");

    
    // Clear form fields after submission
    setPickupLocation('');
    setDropLocation('');
    setContactName('');
    setContactNumber('');
    setPurpose('');
    setLoading(false);
  };

  // form field validation schema
  const validationSchema = Yup.object().shape({
    pickupLocation: Yup.string().required("Pickup Location is required!"),
    dropLocation: Yup.string().required("Drop Location is required!"),
    contactName: Yup.string().required("Full Name is required!"),
    contactNumber: Yup.string()
      .required("Phone Number is required!")
      .matches(/^[0-9]+$/, "Phone number must contain only digits") // Allow only digits
      .min(9, "Phone number must be at least 10 digits") // Adjust the length requirement as needed
      .max(15, "Phone number must be no more than 15 digits"),
    purpose: Yup.string().required("Please select the Purpose ?"),
  });

  return (
    <>
    
      <div className=" relative flex items-center justify-center h-full w-full lg:mt-0 mt-[0rem]">
        <Box className="bg-white p-8 shadow-lg rounded-sm w-full lg:max-w-[30rem] max-w-[30rem] max-h-[38rem] lg:mt-0 mt-5">
          <CitySelectorMobile onCitySelect={handleCitySelect} />
          
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
                    label="Pickup Location"
                    margin="dense"
                    variant="outlined"
                    autoComplete="off"
                    placeholder="Enter your Pickup Location"
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
                {/* Drop Location */}
                <div className="relative flex flex-col">
                  <TextField
                    fullWidth
                    ref={dropInputRef}
                    id="mobile"
                    label="Drop Location"
                    placeholder="Enter your Drop Location"
                    type="text"
                    margin="dense"
                    autoComplete="off"
                    size={isMobile ? "small" : "medium"}
                    value={dropLocation}
                    onChange={(e) => {
                      setDropLocation(e.target.value);
                      if (e.target.value) {
                        values.dropLocation = dropLocation;
                      }
                    }}
                    variant="outlined"
                    className="mb-4"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationCity
                            style={{ color: "gray", fontSize: "14px" }}
                          />
                        </InputAdornment>
                      ),
                    }}
                    onBlur={handleBlur}
                    helperText={touched.dropLocation && errors.dropLocation}
                    error={Boolean(errors.dropLocation && touched.dropLocation)}
                  />

                  {/* Custom Suggestions List for Drop Location */}
                  {dropSuggestions.length > 0 && (
                    <ul className="absolute bg-white shadow-md mt-[3rem] rounded-md z-20">
                      {dropSuggestions.map((suggestion) => (
                        <li
                          key={suggestion.place_id}
                          className="p-2 cursor-pointer hover:bg-gray-200"
                          onClick={() => handleDropSuggestionClick(suggestion)} // Trigger custom suggestion selection
                        >
                          <span className="text-[10px]">
                            {suggestion.description}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
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
                {
                  /* Customer Contact Number */
                }
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
                      setContactNumber(e.target.value);
                      if (e.target.value) {
                        values.contactNumber = contactNumber;
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
            console.log("selectedPurpose::",selectedValue)
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
                    Get An Estimation
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

export default LocationForm;
