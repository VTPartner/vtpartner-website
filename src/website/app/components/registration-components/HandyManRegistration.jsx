/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
// import React from "react";
/* eslint-disable no-unused-vars */
// import React from "react";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  useMediaQuery,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { serverWebsiteEndPoint } from "../../../../dashboard/app/constants";
import { LoadingButton } from "@mui/lab";
import { useParams } from "react-router-dom";

const HandyManRegistrationHeroBanner = ({ attach_image }) => {
  const { category_id, category_name, category_type } = useParams();
  const isMobile = useMediaQuery("(max-width: 600px)");

  // States to store API fetched data
  const [cities, setCities] = useState([]);
  const [services, setServices] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [otherService, setOtherServices] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State to track selected values
  const [serviceType, setServiceType] = useState(""); // Track selected service type
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedOtherService, setSelectedOtherService] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState({
    sub_cat_id: -1,
    sub_cat_name: "",
  });

  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [source, setSource] = useState("");
  // Validation errors
  const [errors, setErrors] = useState({});
  const [btnLoading, setBtnLoading] = useState(false);

  const fetchCities = async () => {
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

  const fetchServices = async () => {
    try {
      const endPoint = `${serverWebsiteEndPoint}/all_services`;
      const response = await axios.post(endPoint);
      setServices(response.data.services_details);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSubCategory = async () => {
    try {
      const endPoint = `${serverWebsiteEndPoint}/all_sub_categories`;
      const response = await axios.post(endPoint, { category_id: category_id });
      setSubCategories(response.data.sub_categories_details);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
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
      } else if (error.response.status === 409) {
        toast.warning(
          "This Service HandyMan Registration has already been sent to us.\nWe Are working on it"
        );
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
    fetchSubCategory();
    // fetchAllVehicles();
    // fetchOtherServices();
  }, []);

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

  const validateForm = () => {
    const newErrors = {};

    // Validate mandatory fields
    if (!fullName) newErrors.fullName = "Full name is required.";
    if (!mobileNumber) {
      newErrors.mobileNumber = "Mobile number is required.";
    } else if (mobileNumber.length !== 10) {
      newErrors.mobileNumber = "Mobile number must be exactly 10 digits.";
    }
    if (!selectedCity) newErrors.city = "City is required.";
    if (category_id === -1) newErrors.service = "Please select a service.";

    // Conditionally check for subcategories or vehicles
    if (category_type === "Service") {
      if (selectedSubcategory.sub_cat_id === -1)
        newErrors.subcategory = "Please select a subcategory.";
      if (selectedOtherService === "")
        newErrors.otherService = "Please select an expertise.";
    }

    if (!source) newErrors.source = "Source is required.";

    setErrors(newErrors);
    setBtnLoading(false);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFullName(""); // Reset full name
    setMobileNumber(""); // Reset mobile number
    setSelectedCity(""); // Reset selected city

    setSelectedSubcategory({ sub_cat_id: -1, sub_cat_name: "" }); // Reset subcategory
    setSelectedOtherService(""); // Reset other service

    setSource(""); // Reset source
    setErrors({}); // Clear any existing errors
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    if (!validateForm()) return;

    const payload = {
      category_id: category_id,
      sub_cat_id: selectedSubcategory.sub_cat_id || -1,
      service_id: selectedOtherService || -1,
      city_id: selectedCity,
      name: fullName,
      mobile_no: mobileNumber,
      source_type: source,
    };

    try {
      const response = await axios.post(
        `${serverWebsiteEndPoint}/add_new_drivers_enquiry`,
        payload
      );

      if (response.status === 200) {
        toast.success("HandyMan Registration successful!");
        resetForm();
      }
    } catch (error) {
      handleError(error);
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className="relative w-full sm:h-full sm:mt-[3rem] mt-[4rem] h-full sm:p-12 p-2  bg-white">
      {/* Background Image */}
      <div className="sm:block absolute inset-0 hidden">
        {/* <img
          src="/assets/registration_bg.jpeg"
          alt="Background"
          className="object-cover bg-center w-[100%] h-full"
        /> */}
        <img
          src={attach_image || ""} // Use service prop
          alt="Background"
          className="object-cover bg-center w-[100%] h-full"
        />
      </div>

      {/* DriversRegistrationHeroBanner Form Card */}
      <div className="relative z-10 flex items-center justify-end h-full w-full sm:pr-10">
        <Box className="bg-white p-8 shadow-lg rounded-sm w-full sm:max-w-[30rem] max-w-[40rem] max-h-[38rem]">
          <h2 className="sm:text-2xl font-titillium mb-4 font-bold">
            Registration as a HandyMan
          </h2>

          <form className="pb-4">
            {/* Full Name */}
            <TextField
              fullWidth
              id="name"
              label="Full Name"
              margin="dense"
              variant="outlined"
              size={isMobile ? "small" : "medium"}
              className="mb-4"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              error={!!errors.fullName}
              helperText={errors.fullName}
              autoComplete="off"
            />

            {/* Mobile Number */}
            <TextField
              fullWidth
              id="mobile"
              label="Mobile Number"
              type="tel"
              margin="dense"
              size={isMobile ? "small" : "medium"}
              variant="outlined"
              className="mb-4"
              value={mobileNumber}
              autoComplete="off"
              onChange={(e) => {
                const input = e.target.value;
                // Allow only digits and limit to 10 characters
                if (/^\d*$/.test(input) && input.length <= 10) {
                  setMobileNumber(input);
                }
              }}
              error={
                (mobileNumber.length !== 10 && mobileNumber.length > 0) ||
                !!errors.mobileNumber
              }
              helperText={
                mobileNumber.length !== 10 && mobileNumber.length > 0
                  ? "Mobile number must be exactly 10 digits"
                  : ""
              }
            />

            {/* Conditionally Render Subcategory Dropdown */}
            {category_type === "Service" && subCategories.length > 0 && (
              <div className="mb-4 mt-3">
                <FormControl
                  fullWidth
                  size={isMobile ? "small" : "medium"}
                  error={!!errors.subcategory}
                >
                  <InputLabel id="subcategory-label">Service Type</InputLabel>
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
            {category_type === "Service" &&
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
                      onChange={(e) => setSelectedOtherService(e.target.value)}
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

            {/* City Dropdown */}
            <div className="mb-4 mt-3">
              <FormControl
                fullWidth
                size={isMobile ? "small" : "medium"}
                error={!!errors.city}
              >
                <InputLabel id="city-label">City</InputLabel>
                <Select
                  labelId="city-label"
                  id="city"
                  label="City"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                >
                  {cities.map((city) => (
                    <MenuItem key={city.city_id} value={city.city_id}>
                      {city.city_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            {/* Source Dropdown */}
            <FormControl
              fullWidth
              className="mb-6"
              size={isMobile ? "small" : "medium"}
              error={!!errors.source}
            >
              <InputLabel id="source-label">Source</InputLabel>
              <Select
                labelId="source-label"
                id="source"
                label="Source"
                value={source} // Bind the value to the source state
                onChange={(e) => setSource(e.target.value)} // Set the source value on change
              >
                <MenuItem value="customer_referral">Customer Referral</MenuItem>
                <MenuItem value="social_media">Social Media</MenuItem>
              </Select>
            </FormControl>

            {/* Register Button */}
            <div className="flex mt-4 mb-5 flex-row w-full">
              <LoadingButton
                type="submit"
                color="primary"
                loading={btnLoading}
                variant="contained"
                onClick={handleRegister}
                className="mb-2"
              >
                Register
              </LoadingButton>
            </div>
          </form>
        </Box>
      </div>
    </div>
  );
};

export default HandyManRegistrationHeroBanner;
