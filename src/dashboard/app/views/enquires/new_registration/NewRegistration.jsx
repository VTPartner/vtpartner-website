/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { DatePicker, LoadingButton } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import Cookies from "js-cookie";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  Icon,
  IconButton,
  InputLabel,
  Radio,
  RadioGroup,
  Step,
  StepLabel,
  Stepper,
  styled,
  Typography,
} from "@mui/material";

import React, { useEffect, useRef, useState } from "react";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { Span } from "../../../components/Typography";
import { Breadcrumb, SimpleCard } from "../../../components";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Add, PhotoCamera, Remove } from "@mui/icons-material";
import { useLoadScript } from "@react-google-maps/api";
import {
  mapKey,
  serverEndPoint,
  serverEndPointImage,
} from "../../../constants";
import { toast } from "react-toastify";
import axios from "axios";

const TextField = styled(TextValidator)(() => ({
  width: "100%",
  marginBottom: "16px",
}));

const libraries = ["places"]; // Load the places library

const NewRegistration = () => {
  const [state, setState] = useState({ date: new Date() });
  const [activeStep, setActiveStep] = useState(0);
  const [errorNewRegistration, setNewRegistrationError] = useState({
    agent_name: false,
    mobile_no: false,
    gender: false,
    aadhar_no: false,
    pan_no: false,
    address: false,
    house_no: false,
    city_name: false,
  });

  const [errorNewRegistrationDelivery, setNewRegistrationDelivery] = useState({
    owner_name: false,
    owner_mobile_no: false,
    owner_house_no: false,
    owner_city_name: false,
    owner_address: false,
    vehicle_no: false,
    driving_license_no: false,
    rc_no: false,
    insurance_no: false,
    noc_no: false,
  });

  const [editedData, setEditedData] = useState({
    agent_name: "",
    mobile_no: "",
    gender: "",
    aadhar_no: "",
    pan_no: "",
    address: "",
    house_no: "",
    city_name: "",
  });

  const [editedDataDelivery, setEditedDelivery] = useState({
    owner_name: "",
    owner_mobile_no: "",
    owner_house_no: "",
    owner_city_name: "",
    owner_address: "",
    vehicle_no: "",
    driving_license_no: "",
    rc_no: "",
    insurance_no: "",
    noc_no: "",
  });

  const [rcImage, setRCImage] = useState(null);
  const [insuranceImage, setInsuranceImage] = useState(null);
  const [nocImage, setNOCImage] = useState(null);
  const [pollutionCertificateImage, setPollutionCertificateImage] =
    useState(null);

  const [licenseFront, setLicenseFront] = useState(null);
  const [licenseBack, setLicenseBack] = useState(null);
  const [vehicleImage, setVehicleImage] = useState(null);
  const [vehiclePlateNoImage, setVehiclePlateNoImage] = useState(null);
  const [aadharCardFront, setAadharCardFront] = useState(null);
  const [aadharCardBack, setAadharCardBack] = useState(null);
  const [panCardFront, setPanCardFront] = useState(null);
  const [panCardBack, setPanCardBack] = useState(null);
  const [agentPhoto, setAgentPhoto] = useState(null);
  const [ownerPhoto, setOwnerPhoto] = useState(null);

  const handleImageChange = (event, setImage) => {
    const file = event.target.files[0];
    if (file) {
      const imgUrl = URL.createObjectURL(file);
      setImage(imgUrl);
    }
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = (event) => {
    // console.log("submitted");
    // console.log(event);
  };

  const agentMobileNoRegex = /^[0-9]{10}$/;
  const ownerMobileNoRegex = /^[0-9]{10}$/;

  const validateAgentMobileNo = (mobile_no) => {
    return agentMobileNoRegex.test(mobile_no);
  };
  const validateOwnerMobileNo = (mobile_no) => {
    return ownerMobileNoRegex.test(mobile_no);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prevData) => {
      const newData = {
        ...prevData,
        [name]: value,
      };
      console.log("Updated State:", newData); // Check updated state
      return newData;
    });

    if (name === "mobile_no") {
      const isValid = validateAgentMobileNo(value);
      setNewRegistrationError({ ...errorNewRegistration, [name]: !isValid });
    }
  };

  const handleDeliveryChange = (e) => {
    const { name, value } = e.target;
    setEditedDelivery((prevData) => {
      const newData = {
        ...prevData,
        [name]: value,
      };
      console.log("Updated Delivery State:", newData); // Check updated state
      return newData;
    });

    if (name === "owner_mobile_no") {
      const isValid = validateOwnerMobileNo(value);
      setNewRegistrationDelivery({
        ...errorNewRegistrationDelivery,
        [name]: !isValid,
      });
    }
  };

  // STYLED COMPONENTS
  const Container = styled("div")(({ theme }) => ({
    margin: "30px",
    [theme.breakpoints.down("sm")]: { margin: "16px" },
    "& .breadcrumb": {
      marginBottom: "30px",
      [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
    },
  }));
  const { enquiry_id, category_id, category_name } = useParams();
  const location = useLocation();
  const { category } = location.state || {};
  const handleFileChange = (event) => {
    // Your existing handleChange logic
    console.log(event.target.name, event.target.files[0]);
  };

  const stepsService = ["Agent Details", "Documents", "Address Details"];
  const stepsDelivery = [
    "Agent Details",
    "Documents",
    "Address Details",
    "Owner Details",
    "Vehicle Details",
  ];

  useEffect(() => {
    setEditedData({
      agent_name: category.name,
      mobile_no: category.mobile_no,
      gender: "",
      aadhar_no: "",
      pan_no: "",
      address: "",
      house_no: "",
      city_name: "",
    });
  }, []);

  const [isStepValid, setIsStepValid] = useState(false);

  // Validate the current step whenever category type or field data changes
  useEffect(() => {
    validateStep();
  }, [
    editedData,
    editedDataDelivery,
    agentPhoto,
    aadharCardFront,
    aadharCardBack,
    panCardFront,
    panCardBack,
    ownerPhoto,
    licenseFront,
    licenseBack,
    vehicleImage,
    rcImage,
    insuranceImage,
    nocImage,
    pollutionCertificateImage,
    activeStep,
    category?.category_type,
  ]);

  const validateStep = () => {
    if (activeStep === 0) {
      // Step 0: Agent Details
      const isAgentStepValid = !!(
        editedData.agent_name &&
        editedData.mobile_no &&
        agentPhoto
      );
      setIsStepValid(isAgentStepValid);
    } else if (activeStep === 1) {
      // Step 1: Documents
      if (category?.category_type === "Delivery") {
        const isDocumentStepValid = !!(
          editedData.aadhar_no &&
          editedData.pan_no &&
          aadharCardFront &&
          aadharCardBack &&
          panCardFront &&
          panCardBack
        );
        setIsStepValid(isDocumentStepValid);
      } else if (category?.category_type === "Service") {
        const isServiceStepValid = !!(
          editedData.aadhar_no &&
          editedData.pan_no &&
          agentPhoto
        );
        setIsStepValid(isServiceStepValid);
      }
    } else if (activeStep === 2) {
      const agentAddressValid = !!editedData.address;
      setIsStepValid(agentAddressValid);
    } else if (category?.category_type === "Delivery") {
      if (activeStep === 3) {
        // Step 3: Owner Details
        const isOwnerStepValid = !!(
          ownerPhoto &&
          editedDataDelivery.owner_name &&
          editedDataDelivery.owner_address
        );
        setIsStepValid(isOwnerStepValid);
      } else if (activeStep === 4) {
        // Step 4: Vehicle Details
        const isVehicleStepValid = !!(
          editedDataDelivery.driving_license_no &&
          editedDataDelivery.vehicle_no &&
          editedDataDelivery.rc_no &&
          editedDataDelivery.insurance_no &&
          editedDataDelivery.noc_no &&
          licenseFront &&
          licenseBack &&
          vehicleImage &&
          rcImage &&
          insuranceImage &&
          nocImage &&
          pollutionCertificateImage
        );
        setIsStepValid(isVehicleStepValid);
      }
    } else {
      setIsStepValid(true); // Default for other steps
    }
  };

  const addressInputRef = useRef(null); // Reference to the input element
  const addressInputAgentRef = useRef(null); // Reference to the input element

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: mapKey, // Replace with your API key
    libraries,
  });

  useEffect(() => {
    if (isLoaded && window.google) {
      try {
        // Attach the Google Autocomplete to the input
        const autocomplete = new window.google.maps.places.Autocomplete(
          addressInputRef.current,
          { types: ["address"] }
        );

        // Listen for the place selection event
        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();

          if (place && place.formatted_address) {
            handleDeliveryChange({
              target: {
                name: "owner_address",
                value: place.formatted_address,
              },
            });
          } else {
            throw new Error("Address could not be retrieved.");
          }
        });
      } catch (error) {
        console.error("Autocomplete error:", error);
        // Display the error as a toast message
        toast.error(`Autocomplete Error: ${error.message}`);
      }
    }
  }, [isLoaded, handleDeliveryChange]);

  useEffect(() => {
    if (isLoaded && window.google) {
      try {
        // Attach the Google Autocomplete to the input
        const autocomplete = new window.google.maps.places.Autocomplete(
          addressInputAgentRef.current,
          { types: ["address"] }
        );

        // Listen for the place selection event
        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (place && place.formatted_address) {
            handleChange({
              target: {
                name: "address",
                value: place.formatted_address,
              },
            });
            // Update the location in state
          } else {
            throw new Error("Address could not be retrieved.");
          }
        });
      } catch (error) {
        console.error("Autocomplete error:", error);
        // Display the error as a toast message
        toast.error(`Autocomplete Error: ${error.message}`);
      }
    }
  }, [isLoaded, handleChange]);

  const [optionalFields, setOptionalFields] = useState([
    { other: "", file: null },
  ]);

  const handleAddField = () => {
    setOptionalFields([...optionalFields, { other: "", file: null }]);
  };
  const handleRemoveField = (index) => {
    const newDocuments = optionalFields.filter((_, i) => i !== index);
    setOptionalFields(newDocuments);
  };

  const handleFieldChange = (index, field, value) => {
    const updatedFields = [...optionalFields];
    updatedFields[index][field] = value;
    setOptionalFields(updatedFields);
  };

  const [btnLoading, setBtnLoading] = useState(false);

  // const blobToFile = (blobUrl, fileName) => {
  //   return fetch(blobUrl)
  //     .then((response) => response.blob())
  //     .then((blob) => {
  //       return new File([blob], fileName, { type: blob.type });
  //     });
  // };

  // const uploadImage = async (imageFile) => {
  //   // console.log("imageFile::", imageFile);
  //   if (!imageFile) return null;

  //   // Check if the imageFile is a Blob URL
  //   //const isBlobUrl = (url) => url.startsWith("blob:");
  //   const isBlobUrl = (url) =>
  //     typeof url === "string" && url.startsWith("blob:");

  //   if (isBlobUrl(imageFile)) {
  //     const fileName = "image.jpg"; // or get the filename from your source if available
  //     imageFile = await blobToFile(imageFile, fileName);
  //   }

  //   try {
  //     const formData = new FormData();
  //     formData.append("image", imageFile);
  //     // for (const [key, value] of formData.entries()) {
  //     //   console.log("Image FormData", `${key}: ${value.name}`); // Should now log the correct file name
  //     // }
  //     const uploadResponse = await axios.post(
  //       `${serverEndPointImage}/upload`,
  //       formData // Removed Content-Type header
  //     );
  //     return uploadResponse.data.image_url; // Assuming API returns the image URL
  //   } catch (error) {
  //     if (error.response) {
  //       console.error("Response data:", error.response.data);
  //       console.error("Response status:", error.response.status);
  //     } else {
  //       console.error("Error uploading image:", error);
  //     }
  //     toast.error("Error uploading image or file size too large (2 MB max).");
  //     return null;
  //   }
  // };

  const blobToFile = (blobUrl, fileName) => {
    return fetch(blobUrl)
      .then((response) => response.blob())
      .then((blob) => {
        return new File([blob], fileName, { type: blob.type });
      });
  };

  const uploadImage = async (imageFile) => {
    if (!imageFile) return null;

    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const uploadResponse = await axios.post(
        `${serverEndPointImage}/upload`,
        formData
      );
      return uploadResponse.data.image_url; // Assuming API returns the image URL
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error uploading image or file size too large (2 MB max).");
      return null;
    }
  };

  const uploadOptionalImages = async () => {
    const uploadedImages = []; // To store uploaded image URLs

    for (const field of optionalFields) {
      if (field.file) {
        const imageUrl = await uploadImage(field.file); // Use the existing uploadImage function
        if (imageUrl) {
          uploadedImages.push({
            other: field.other,
            imageUrl: imageUrl,
          });
        }
      }
    }

    // You can now send uploadedImages to your API if needed
    console.log("Uploaded images data:", uploadedImages);
    return uploadedImages;
    // If you want to send it to another endpoint, you can do so here
    // await sendToApi(uploadedImages);
  };

  const [driverExists, setDriverExists] = useState(true);
  const [handyManExists, setHandyManExists] = useState(true);
  const navigate = useNavigate();

  //Check if Driver Exists
  const checkIsDriverExists = async () => {
    try {
      setBtnLoading(true);

      const token = Cookies.get("authToken");

      const endpoint = `${serverEndPoint}/check_driver_existence`;

      const response = await axios.post(
        endpoint,
        {
          mobile_no: editedData.mobile_no,
          enquiry_id: category.enquiry_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const exists = response.data.exists;
      setDriverExists(exists);
      console.log("Already Exists", response.data);

      // Directly use exists here
      if (exists) {
        toast.warning("Already Exists!");
        setTimeout(() => {
          navigate(`/all_full_enquiries`);
        }, 2000); // Delay of 2 seconds
      }
    } catch (error) {
      console.error("Error submitting Driver Exists:", error);
      toast.error("Error submitting Driver Exists.");
    } finally {
      setBtnLoading(false);
    }
  };

  const checkIsHandyManExists = async () => {
    try {
      setBtnLoading(true);

      const token = Cookies.get("authToken");

      const endpoint = `${serverEndPoint}/check_handyman_existence`;

      const response = await axios.post(
        endpoint,
        {
          mobile_no: editedData.mobile_no,
          category_id: category.category_id,
          enquiry_id: category.enquiry_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const exists = response.data.exists;
      console.log("Already Exists", response.data);
      setHandyManExists(exists);
      // Directly use exists here
      if (exists) {
        toast.warning("Already Exists!");
        setTimeout(() => {
          navigate(`/all_full_enquiries`);
        }, 2000); // Delay of 2 seconds
      }
    } catch (error) {
      console.error("Error submitting HandyMan Exists:", error);
      toast.error("Error submitting HandyMan Exists.");
    } finally {
      setBtnLoading(false);
    }
  };

  const submitRegistrationData = async () => {
    try {
      setBtnLoading(true);
      if (category.category_type === "Delivery") {
        await checkIsDriverExists();
        console.log("driverExists::", driverExists);
      } else {
        await checkIsHandyManExists();
        console.log("handyManExists::", handyManExists);
      }

      if (driverExists === true && category.category_type === "Delivery") {
        return;
      } else if (
        handyManExists === true &&
        category.category_type === "Service"
      ) {
        return;
      } else {
        setBtnLoading(true);
        const agentPhotoUrl = await uploadImage(agentPhoto);
        const aadharCardFrontUrl = await uploadImage(aadharCardFront);
        const aadharCardBackUrl = await uploadImage(aadharCardBack);
        const panCardFrontUrl = await uploadImage(panCardFront);
        const panCardBackUrl = await uploadImage(panCardBack);

        let registrationData = {};
        const token = Cookies.get("authToken");

        if (category.category_type === "Delivery") {
          const ownerPhotoUrl = await uploadImage(ownerPhoto);
          const licenseFrontUrl = await uploadImage(licenseFront);
          const licenseBackUrl = await uploadImage(licenseBack);
          const vehicleImageUrl = await uploadImage(vehicleImage);
          const vehiclePlateImageUrl = await uploadImage(vehiclePlateNoImage);
          const rcImageUrl = await uploadImage(rcImage);
          const insuranceImageUrl = await uploadImage(insuranceImage);
          const nocImageUrl = await uploadImage(nocImage);
          const pollutionCertificateImageUrl = await uploadImage(
            pollutionCertificateImage
          );
          const optionalDocuments = await uploadOptionalImages();
          registrationData = {
            enquiry_id: category.enquiry_id, //To Update Status to Active from Pending
            category_id: category.category_id,
            vehicle_id: category.vehicle_id,
            agent_name: editedData.agent_name,
            mobile_no: editedData.mobile_no,
            gender: editedData.gender,
            aadhar_no: editedData.aadhar_no,
            pan_no: editedData.pan_no,
            address: editedData.address,
            house_no: editedData.house_no,
            city_name: editedData.city_name,
            owner_name: editedDataDelivery.owner_name,
            owner_mobile_no: editedDataDelivery.owner_mobile_no,
            owner_house_no: editedDataDelivery.owner_house_no,
            owner_city_name: editedDataDelivery.owner_city_name,
            owner_address: editedDataDelivery.owner_address,
            driving_license_no: editedDataDelivery.driving_license_no,
            vehicle_plate_no: editedDataDelivery.vehicle_no,
            rc_no: editedDataDelivery.rc_no,
            insurance_no: editedDataDelivery.insurance_no,
            noc_no: editedDataDelivery.noc_no,
            agent_photo_url: agentPhotoUrl,
            aadhar_card_front_url: aadharCardFrontUrl,
            aadhar_card_back_url: aadharCardBackUrl,
            pan_card_front_url: panCardFrontUrl,
            pan_card_back_url: panCardBackUrl,
            owner_photo_url: ownerPhotoUrl,
            license_front_url: licenseFrontUrl,
            license_back_url: licenseBackUrl,
            vehicle_image_url: vehicleImageUrl,
            rc_image_url: rcImageUrl,
            insurance_image_url: insuranceImageUrl,
            noc_image_url: nocImageUrl,
            city_id: category.city_id,
            pollution_certificate_image_url: pollutionCertificateImageUrl,
            vehicle_plate_image: vehiclePlateImageUrl,
            optionalDocuments: optionalDocuments,
          };
        } else {
          registrationData = {
            enquiry_id: category.enquiry_id,
            category_id: category.category_id,
            sub_cat_id: category.sub_cat_id,
            service_id: category.service_id,
            agent_name: editedData.agent_name,
            mobile_no: editedData.mobile_no,
            gender: editedData.gender,
            aadhar_no: editedData.aadhar_no,
            pan_no: editedData.pan_no,
            address: editedData.address,
            house_no: editedData.house_no,
            city_name: editedData.city_name,
            city_id: category.city_id,
            agent_photo_url: agentPhotoUrl,
            aadhar_card_front_url: aadharCardFrontUrl,
            aadhar_card_back_url: aadharCardBackUrl,
            pan_card_front_url: panCardFrontUrl,
            pan_card_back_url: panCardBackUrl,
          };
        }
        // Prepare data object to send to the API

        console.log("registrationData->", registrationData);

        // Submit form data to the main endpoint
        const endpoint = `${serverEndPoint}/register_agent`;

        const response = await axios.post(endpoint, registrationData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        console.log("Registration submitted successfully:", response.data);
        //Navigating to All Enquiries
        toast.success("Registration submitted successfully!");
        setTimeout(() => {
          navigate(`/all_full_enquiries`);
        }, 2000); // Delay of 2 seconds
      }
    } catch (error) {
      console.error("Error submitting registration:", error);
      toast.error("Error submitting registration.");
    } finally {
      setBtnLoading(false);
    }
  };

  useEffect(() => {
    console.log("handyManExists has changed to:", handyManExists);
  }, [handyManExists]);

  return (
    <>
      <SimpleCard
        title={`Add New [ ${category.category_name} ] ${
          category.category_type === "Delivery"
            ? `Driver Agent For [Vehicle Name : ${category.vehicle_name} ]`
            : `Service Agent For [${category.sub_cat_name} ] / [${category.service_name}]`
        }`}
      >
        <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
          <Box margin={5}>
            <Stepper activeStep={activeStep}>
              {(category.category_type === "Delivery"
                ? stepsDelivery
                : stepsService
              ).map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            {activeStep === 0 && (
              <Grid container spacing={6} padding={5}>
                <Grid item xs={12}>
                  {/* Agent Photo */}
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    padding={4}
                  >
                    <input
                      accept="image/*"
                      style={{ display: "none" }}
                      id="agentPhoto"
                      type="file"
                      onChange={(e) => handleImageChange(e, setAgentPhoto)}
                    />
                    <label htmlFor="agentPhoto">
                      {" "}
                      {/* Changed from licenseBack to agentPhoto */}
                      <Avatar
                        src={agentPhoto || ""}
                        alt="Agent Photo"
                        sx={{
                          width: 100,
                          height: 100,
                          mb: 2,
                          border: "2px solid #ccc",
                          cursor: "pointer",
                        }}
                      >
                        <PhotoCamera />
                      </Avatar>
                      <Typography variant="caption" textAlign={"center"}>
                        Agent Photo
                      </Typography>
                    </label>
                  </Box>

                  {/* Agent Name TextField */}
                  <TextField
                    label="Agent Name"
                    fullWidth
                    margin="normal"
                    name="agent_name"
                    value={editedData.agent_name || ""}
                    onChange={handleChange} // Ensure this is connected correctly
                    required
                    error={errorNewRegistration.agent_name}
                    helperText={
                      errorNewRegistration.agent_name
                        ? "Agent name is required."
                        : ""
                    }
                    inputProps={{
                      autoComplete: "off",
                    }}
                  />
                  <TextField
                    label="Mobile Number"
                    fullWidth
                    type="number"
                    margin="normal"
                    name="mobile_no"
                    value={editedData.mobile_no || ""}
                    onChange={handleChange} // Ensure this is connected correctly
                    required
                    error={errorNewRegistration.mobile_no}
                    helperText={
                      errorNewRegistration.mobile_no
                        ? "Agent Mobile Number is required and must be 10 Digits."
                        : ""
                    }
                    inputProps={{
                      autoComplete: "off",
                    }}
                  />
                  <RadioGroup
                    row
                    name="gender"
                    sx={{ mb: 2 }}
                    value={editedData.gender || ""}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      value="Male"
                      label="Male"
                      labelPlacement="end"
                      control={<Radio color="secondary" />}
                    />

                    <FormControlLabel
                      value="Female"
                      label="Female"
                      labelPlacement="end"
                      control={<Radio color="secondary" />}
                    />

                    <FormControlLabel
                      value="Others"
                      label="Others"
                      labelPlacement="end"
                      control={<Radio color="secondary" />}
                    />
                  </RadioGroup>
                </Grid>
              </Grid>
            )}
            {activeStep === 1 && (
              <Grid container spacing={6} padding={5}>
                <Grid item xs={12}>
                  <TextField
                    label="Aadhar Card Number"
                    fullWidth
                    margin="normal"
                    name="aadhar_no"
                    value={editedData.aadhar_no || ""}
                    onChange={handleChange} // Ensure this is connected correctly
                    required
                    error={errorNewRegistration.aadhar_no}
                    helperText={
                      errorNewRegistration.aadhar_no
                        ? "Aadhar No is required."
                        : ""
                    }
                    inputProps={{
                      autoComplete: "off",
                    }}
                  />
                  <TextField
                    label="PAN Card Number"
                    fullWidth
                    margin="normal"
                    name="pan_no"
                    value={editedData.pan_no || ""}
                    onChange={handleChange} // Ensure this is connected correctly
                    required
                    error={errorNewRegistration.pan_no}
                    helperText={
                      errorNewRegistration.pan_no
                        ? "PAN Card No is required."
                        : ""
                    }
                    inputProps={{
                      autoComplete: "off",
                    }}
                  />
                  <Box display={"flex"} justifyContent={"space-between"}>
                    {/* Aadhar Card Front Photo */}
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      padding={4}
                    >
                      <input
                        accept="image/*"
                        style={{ display: "none" }}
                        id="aadharCardFront"
                        type="file"
                        onChange={(e) =>
                          handleImageChange(e, setAadharCardFront)
                        }
                      />
                      <label htmlFor="aadharCardFront">
                        {" "}
                        {/* Changed from licenseBack to agentPhoto */}
                        <Avatar
                          src={aadharCardFront || ""}
                          alt="Aadhar Card Photo"
                          sx={{
                            width: 250, // Adjust the width as needed
                            height: 200, // Adjust the height as needed
                            mb: 2,
                            border: "2px solid #ccc",
                            cursor: "pointer",
                            borderRadius: 1, // Set to 1 (or 0) to remove circular shape
                          }}
                        >
                          <PhotoCamera />
                        </Avatar>
                        <Typography variant="caption" textAlign={"center"}>
                          Aadhar Card Front Image
                        </Typography>
                      </label>
                    </Box>
                    {/* Aadhar Card Back Photo */}
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      padding={4}
                    >
                      <input
                        accept="image/*"
                        style={{ display: "none" }}
                        id="aadharCardBack"
                        type="file"
                        onChange={(e) =>
                          handleImageChange(e, setAadharCardBack)
                        }
                      />
                      <label htmlFor="aadharCardBack">
                        {" "}
                        {/* Changed from licenseBack to agentPhoto */}
                        <Avatar
                          src={aadharCardBack || ""}
                          alt="Aadhar Card Photo"
                          sx={{
                            width: 250, // Adjust the width as needed
                            height: 200, // Adjust the height as needed
                            mb: 2,
                            border: "2px solid #ccc",
                            cursor: "pointer",
                            borderRadius: 1, // Set to 1 (or 0) to remove circular shape
                          }}
                        >
                          <PhotoCamera />
                        </Avatar>
                        <Typography variant="caption" textAlign={"center"}>
                          Aadhar Card Back Image
                        </Typography>
                      </label>
                    </Box>
                    {/* Pan  Card Front Photo */}
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      padding={4}
                    >
                      <input
                        accept="image/*"
                        style={{ display: "none" }}
                        id="panCardFront"
                        type="file"
                        onChange={(e) => handleImageChange(e, setPanCardFront)}
                      />
                      <label htmlFor="panCardFront">
                        {" "}
                        {/* Changed from licenseBack to agentPhoto */}
                        <Avatar
                          src={panCardFront || ""}
                          alt="Pan Card Photo"
                          sx={{
                            width: 250, // Adjust the width as needed
                            height: 200, // Adjust the height as needed
                            mb: 2,
                            border: "2px solid #ccc",
                            cursor: "pointer",
                            borderRadius: 1, // Set to 1 (or 0) to remove circular shape
                          }}
                        >
                          <PhotoCamera />
                        </Avatar>
                        <Typography variant="caption" textAlign={"center"}>
                          PAN Card Front Image
                        </Typography>
                      </label>
                    </Box>
                    {/* Pan  Card Back Photo */}
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      padding={4}
                    >
                      <input
                        accept="image/*"
                        style={{ display: "none" }}
                        id="panCardBack"
                        type="file"
                        onChange={(e) => handleImageChange(e, setPanCardBack)}
                      />
                      <label htmlFor="panCardBack">
                        {" "}
                        {/* Changed from licenseBack to agentPhoto */}
                        <Avatar
                          src={panCardBack || ""}
                          alt="Pan Card Photo"
                          sx={{
                            width: 250, // Adjust the width as needed
                            height: 200, // Adjust the height as needed
                            mb: 2,
                            border: "2px solid #ccc",
                            cursor: "pointer",
                            borderRadius: 1, // Set to 1 (or 0) to remove circular shape
                          }}
                        >
                          <PhotoCamera />
                        </Avatar>
                        <Typography variant="caption" textAlign={"center"}>
                          PAN Card Back Image
                        </Typography>
                      </label>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            )}

            {activeStep === 2 && (
              <Grid container spacing={1} padding={5}>
                <Grid item xs={6}>
                  <TextField
                    label="House No"
                    fullWidth
                    margin="normal"
                    name="house_no"
                    value={editedData.house_no || ""}
                    onChange={handleChange}
                    required
                    error={errorNewRegistration.house_no}
                    helperText={
                      errorNewRegistration.house_no
                        ? "House No is required."
                        : ""
                    }
                    inputProps={{
                      autoComplete: "off",
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="City Name"
                    fullWidth
                    margin="normal"
                    name="city_name"
                    value={editedData.city_name || ""}
                    onChange={handleChange}
                    required
                    error={errorNewRegistration.city_name}
                    helperText={
                      errorNewRegistration.city_name
                        ? "City Name is required."
                        : ""
                    }
                    inputProps={{
                      autoComplete: "off",
                    }}
                  />
                </Grid>
                {/* Row 2: Full Address */}
                {isLoaded ? (
                  <Grid item xs={12}>
                    <TextField
                      label="Full Address"
                      fullWidth
                      margin="normal"
                      name="address"
                      inputRef={addressInputAgentRef}
                      value={editedData.address || ""}
                      onChange={handleChange}
                      required
                      error={errorNewRegistration.address}
                      helperText={
                        errorNewRegistration.address
                          ? "Full Address is required."
                          : ""
                      }
                      inputProps={{
                        autoComplete: "off",
                      }}
                    />
                  </Grid>
                ) : (
                  <p>Loading...</p>
                )}
              </Grid>
            )}

            {category.category_type === "Delivery" && activeStep === 3 && (
              <Grid container spacing={6} padding={5}>
                <Grid item xs={12}>
                  {/* Owner Photo */}
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    padding={4}
                  >
                    <input
                      accept="image/*"
                      style={{ display: "none" }}
                      id="ownerPhoto"
                      type="file"
                      onChange={(e) => handleImageChange(e, setOwnerPhoto)}
                    />
                    <label htmlFor="ownerPhoto">
                      {" "}
                      <Avatar
                        src={ownerPhoto || ""}
                        alt="owner Photo"
                        sx={{
                          width: 100,
                          height: 100,
                          mb: 2,
                          border: "2px solid #ccc",
                          cursor: "pointer",
                        }}
                      >
                        <PhotoCamera />
                      </Avatar>
                      <Typography variant="caption" textAlign={"center"}>
                        Owner Photo
                      </Typography>
                    </label>
                  </Box>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <TextField
                        label="Owner Name"
                        fullWidth
                        margin="normal"
                        name="owner_name"
                        value={editedDataDelivery.owner_name || ""}
                        onChange={handleDeliveryChange} // Ensure this is connected correctly
                        required
                        error={errorNewRegistrationDelivery.owner_name}
                        helperText={
                          errorNewRegistrationDelivery.owner_name
                            ? "Owner Name is required."
                            : ""
                        }
                        inputProps={{
                          autoComplete: "off",
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        type="number"
                        label="Owner Mobile Number"
                        fullWidth
                        margin="normal"
                        name="owner_mobile_no"
                        value={editedDataDelivery.owner_mobile_no || ""}
                        onChange={handleDeliveryChange} // Ensure this is connected correctly
                        required
                        error={errorNewRegistrationDelivery.owner_mobile_no}
                        helperText={
                          errorNewRegistrationDelivery.owner_mobile_no
                            ? "Owner Mobile Number is required & must be 10 digits."
                            : ""
                        }
                        inputProps={{
                          autoComplete: "off",
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={1}>
                    {/* Row 1: House No and City Name */}
                    <Grid item xs={6}>
                      <TextField
                        label="House No"
                        fullWidth
                        margin="normal"
                        name="owner_house_no"
                        value={editedDataDelivery.owner_house_no || ""}
                        onChange={handleDeliveryChange}
                        required
                        error={errorNewRegistrationDelivery.owner_house_no}
                        helperText={
                          errorNewRegistrationDelivery.owner_house_no
                            ? "Owner House No is required."
                            : ""
                        }
                        inputProps={{
                          autoComplete: "off",
                        }}
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <TextField
                        label="City Name"
                        fullWidth
                        margin="normal"
                        name="owner_city_name"
                        value={editedDataDelivery.owner_city_name || ""}
                        onChange={handleDeliveryChange}
                        required
                        error={errorNewRegistrationDelivery.owner_city_name}
                        helperText={
                          errorNewRegistrationDelivery.owner_city_name
                            ? "Owner City Name is required."
                            : ""
                        }
                        inputProps={{
                          autoComplete: "off",
                        }}
                      />
                    </Grid>
                  </Grid>
                  {isLoaded ? (
                    <TextField
                      label="Owner Full Address "
                      fullWidth
                      margin="normal"
                      inputRef={addressInputRef}
                      name="owner_address"
                      value={editedDataDelivery.owner_address || ""}
                      onChange={handleDeliveryChange} // Ensure this is connected correctly
                      required
                      error={errorNewRegistrationDelivery.owner_address}
                      helperText={
                        errorNewRegistrationDelivery.owner_address
                          ? "Owner Address is required."
                          : ""
                      }
                      inputProps={{
                        autoComplete: "off",
                      }}
                    />
                  ) : (
                    <p>Loading...</p>
                  )}
                </Grid>
              </Grid>
            )}

            {category.category_type === "Delivery" && activeStep === 4 && (
              <Grid container spacing={6} padding={5}>
                <Grid item xs={12}>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <TextField
                        label="Driving License Number "
                        fullWidth
                        margin="normal"
                        name="driving_license_no"
                        value={editedDataDelivery.driving_license_no || ""}
                        onChange={handleDeliveryChange} // Ensure this is connected correctly
                        required
                        error={errorNewRegistrationDelivery.driving_license_no}
                        helperText={
                          errorNewRegistrationDelivery.driving_license_no
                            ? "Driving License Number is required."
                            : ""
                        }
                        inputProps={{
                          autoComplete: "off",
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Vehicle Number"
                        fullWidth
                        margin="normal"
                        name="vehicle_no"
                        value={editedDataDelivery.vehicle_no || ""}
                        onChange={handleDeliveryChange} // Ensure this is connected correctly
                        required
                        error={errorNewRegistrationDelivery.vehicle_no}
                        helperText={
                          errorNewRegistrationDelivery.vehicle_no
                            ? "Vehicle Number is required."
                            : ""
                        }
                        inputProps={{
                          autoComplete: "off",
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <TextField
                        label="RC No"
                        fullWidth
                        margin="normal"
                        name="rc_no"
                        value={editedDataDelivery.rc_no || ""}
                        onChange={handleDeliveryChange} // Ensure this is connected correctly
                        required
                        error={errorNewRegistrationDelivery.rc_no}
                        helperText={
                          errorNewRegistrationDelivery.rc_no
                            ? "RC Number is required."
                            : ""
                        }
                        inputProps={{
                          autoComplete: "off",
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Insurance Number"
                        fullWidth
                        margin="normal"
                        name="insurance_no"
                        value={editedDataDelivery.insurance_no || ""}
                        onChange={handleDeliveryChange} // Ensure this is connected correctly
                        required
                        error={errorNewRegistrationDelivery.insurance_no}
                        helperText={
                          errorNewRegistrationDelivery.insurance_no
                            ? "Insurance Number is required."
                            : ""
                        }
                        inputProps={{
                          autoComplete: "off",
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <TextField
                        label="NOC Certificate Number"
                        fullWidth
                        margin="normal"
                        name="noc_no"
                        value={editedDataDelivery.noc_no || ""}
                        onChange={handleDeliveryChange} // Ensure this is connected correctly
                        required
                        error={errorNewRegistrationDelivery.noc_no}
                        helperText={
                          errorNewRegistrationDelivery.noc_no
                            ? "NOC Number is required."
                            : ""
                        }
                        inputProps={{
                          autoComplete: "off",
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    {optionalFields.map((field, index) => (
                      <React.Fragment key={index}>
                        <Grid item xs={6}>
                          <TextField
                            label="Other Documents Name [Optional]"
                            fullWidth
                            margin="normal"
                            name={`other_${index}`}
                            value={field.other || ""}
                            onChange={(e) =>
                              handleFieldChange(index, "other", e.target.value)
                            }
                            required
                            error={
                              !!errorNewRegistrationDelivery?.[`other_${index}`]
                            }
                            helperText={
                              errorNewRegistrationDelivery?.[`other_${index}`]
                                ? "Other is required."
                                : ""
                            }
                            inputProps={{
                              autoComplete: "off",
                            }}
                          />
                        </Grid>

                        <Grid item xs={4}>
                          <TextField
                            fullWidth
                            margin="normal"
                            type="file"
                            name={`file_${index}`}
                            onChange={(e) =>
                              handleFieldChange(
                                index,
                                "file",
                                e.target.files[0]
                              )
                            }
                            inputProps={{
                              accept: "image/*",
                            }}
                          />
                        </Grid>

                        {index === optionalFields.length - 1 && (
                          <Grid item xs={2} display="flex" alignItems="center">
                            <IconButton onClick={handleAddField}>
                              <Add />
                            </IconButton>
                            {index > 0 && (
                              <IconButton
                                onClick={() => handleRemoveField(index)}
                              >
                                <Remove />
                              </IconButton>
                            )}
                          </Grid>
                        )}
                      </React.Fragment>
                    ))}
                  </Grid>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)", // Four items per row
                      gap: 3, // Adjust gap as needed
                    }}
                  >
                    {/* Driving License Front Image */}
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      padding={4}
                    >
                      <input
                        accept="image/*"
                        style={{ display: "none" }}
                        id="licenseFront"
                        type="file"
                        onChange={(e) => handleImageChange(e, setLicenseFront)}
                      />
                      <label htmlFor="licenseFront">
                        {" "}
                        <Avatar
                          src={licenseFront || ""}
                          alt="licenseFront Photo"
                          sx={{
                            width: 250, // Adjust the width as needed
                            height: 200, // Adjust the height as needed
                            mb: 2,
                            border: "2px solid #ccc",
                            cursor: "pointer",
                            borderRadius: 1, // Set to 1 (or 0) to remove circular shape
                          }}
                        >
                          <PhotoCamera />
                        </Avatar>
                        <Typography variant="caption" textAlign={"center"}>
                          Driving License Front Image
                        </Typography>
                      </label>
                    </Box>
                    {/* Driving License Back Image  */}
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      padding={4}
                    >
                      <input
                        accept="image/*"
                        style={{ display: "none" }}
                        id="licenseBack"
                        type="file"
                        onChange={(e) => handleImageChange(e, setLicenseBack)}
                      />
                      <label htmlFor="licenseBack">
                        {" "}
                        {/* Changed from licenseBack to agentPhoto */}
                        <Avatar
                          src={licenseBack || ""}
                          alt="licenseBack Photo"
                          sx={{
                            width: 250, // Adjust the width as needed
                            height: 200, // Adjust the height as needed
                            mb: 2,
                            border: "2px solid #ccc",
                            cursor: "pointer",
                            borderRadius: 1, // Set to 1 (or 0) to remove circular shape
                          }}
                        >
                          <PhotoCamera />
                        </Avatar>
                        <Typography variant="caption" textAlign={"center"}>
                          Driving License Back Image
                        </Typography>
                      </label>
                    </Box>

                    {/* Vehicle Image */}
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      padding={4}
                    >
                      <input
                        accept="image/*"
                        style={{ display: "none" }}
                        id="vehicleImage"
                        type="file"
                        onChange={(e) => handleImageChange(e, setVehicleImage)}
                      />
                      <label htmlFor="vehicleImage">
                        {" "}
                        {/* Changed from licenseBack to agentPhoto */}
                        <Avatar
                          src={vehicleImage || ""}
                          alt="vehicleImage Photo"
                          sx={{
                            width: 250, // Adjust the width as needed
                            height: 200, // Adjust the height as needed
                            mb: 2,
                            border: "2px solid #ccc",
                            cursor: "pointer",
                            borderRadius: 1, // Set to 1 (or 0) to remove circular shape
                          }}
                        >
                          <PhotoCamera />
                        </Avatar>
                        <Typography variant="caption" textAlign={"center"}>
                          Vehicle Image
                        </Typography>
                      </label>
                    </Box>
                    {/* Vehicle Plate Image */}
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      padding={4}
                    >
                      <input
                        accept="image/*"
                        style={{ display: "none" }}
                        id="vehiclePlateNoImage"
                        type="file"
                        onChange={(e) =>
                          handleImageChange(e, setVehiclePlateNoImage)
                        }
                      />
                      <label htmlFor="vehiclePlateNoImage">
                        {" "}
                        {/* Changed from licenseBack to agentPhoto */}
                        <Avatar
                          src={vehiclePlateNoImage || ""}
                          alt="vehiclePlateNoImage Photo"
                          sx={{
                            width: 250, // Adjust the width as needed
                            height: 200, // Adjust the height as needed
                            mb: 2,
                            border: "2px solid #ccc",
                            cursor: "pointer",
                            borderRadius: 1, // Set to 1 (or 0) to remove circular shape
                          }}
                        >
                          <PhotoCamera />
                        </Avatar>
                        <Typography variant="caption" textAlign={"center"}>
                          Vehicle Plate No Image
                        </Typography>
                      </label>
                    </Box>

                    {/* RC Book Image */}
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      padding={4}
                    >
                      <input
                        accept="image/*"
                        style={{ display: "none" }}
                        id="rcImage"
                        type="file"
                        onChange={(e) => handleImageChange(e, setRCImage)}
                      />
                      <label htmlFor="rcImage">
                        {" "}
                        {/* Changed from licenseBack to agentPhoto */}
                        <Avatar
                          src={rcImage || ""}
                          alt="rcImage Photo"
                          sx={{
                            width: 250, // Adjust the width as needed
                            height: 200, // Adjust the height as needed
                            mb: 2,
                            border: "2px solid #ccc",
                            cursor: "pointer",
                            borderRadius: 1, // Set to 1 (or 0) to remove circular shape
                          }}
                        >
                          <PhotoCamera />
                        </Avatar>
                        <Typography variant="caption" textAlign={"center"}>
                          Rc Book Image
                        </Typography>
                      </label>
                    </Box>

                    {/* Insurance Image */}
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      padding={4}
                    >
                      <input
                        accept="image/*"
                        style={{ display: "none" }}
                        id="insuranceImage"
                        type="file"
                        onChange={(e) =>
                          handleImageChange(e, setInsuranceImage)
                        }
                      />
                      <label htmlFor="insuranceImage">
                        {" "}
                        {/* Changed from licenseBack to agentPhoto */}
                        <Avatar
                          src={insuranceImage || ""}
                          alt="insuranceImage Photo"
                          sx={{
                            width: 250, // Adjust the width as needed
                            height: 200, // Adjust the height as needed
                            mb: 2,
                            border: "2px solid #ccc",
                            cursor: "pointer",
                            borderRadius: 1, // Set to 1 (or 0) to remove circular shape
                          }}
                        >
                          <PhotoCamera />
                        </Avatar>
                        <Typography variant="caption" textAlign={"center"}>
                          Insurance Certificate Image
                        </Typography>
                      </label>
                    </Box>

                    {/* NOC Image */}
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      padding={4}
                    >
                      <input
                        accept="image/*"
                        style={{ display: "none" }}
                        id="nocImage"
                        type="file"
                        onChange={(e) => handleImageChange(e, setNOCImage)}
                      />
                      <label htmlFor="nocImage">
                        {" "}
                        {/* Changed from licenseBack to agentPhoto */}
                        <Avatar
                          src={nocImage || ""}
                          alt="nocImage Photo"
                          sx={{
                            width: 250, // Adjust the width as needed
                            height: 200, // Adjust the height as needed
                            mb: 2,
                            border: "2px solid #ccc",
                            cursor: "pointer",
                            borderRadius: 1, // Set to 1 (or 0) to remove circular shape
                          }}
                        >
                          <PhotoCamera />
                        </Avatar>
                        <Typography variant="caption" textAlign={"center"}>
                          NOC Image
                        </Typography>
                      </label>
                    </Box>

                    {/* Pollution Certificate Image */}
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      padding={4}
                    >
                      <input
                        accept="image/*"
                        style={{ display: "none" }}
                        id="pollutionCertificateImage"
                        type="file"
                        onChange={(e) =>
                          handleImageChange(e, setPollutionCertificateImage)
                        }
                      />
                      <label htmlFor="pollutionCertificateImage">
                        {" "}
                        {/* Changed from licenseBack to agentPhoto */}
                        <Avatar
                          src={pollutionCertificateImage || ""}
                          alt="pollutionCertificateImage Photo"
                          sx={{
                            width: 250, // Adjust the width as needed
                            height: 200, // Adjust the height as needed
                            mb: 2,
                            border: "2px solid #ccc",
                            cursor: "pointer",
                            borderRadius: 1, // Set to 1 (or 0) to remove circular shape
                          }}
                        >
                          <PhotoCamera />
                        </Avatar>
                        <Typography variant="caption" textAlign={"center"}>
                          Pollution Certificate Image
                        </Typography>
                      </label>
                    </Box>
                  </Box>
                  {/* <TextField
                      type="file"
                      name="vehicleImage"
                      label="Upload Vehicle Image"
                      onChange={handleChange}
                      validators={["required"]}
                      errorMessages={["this field is required"]}
                    /> */}
                </Grid>
              </Grid>
            )}

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
            >
              <Button
                variant="contained"
                disabled={activeStep === 0}
                onClick={handleBack}
              >
                Back
              </Button>
              <LoadingButton
                type="submit"
                color="primary"
                loading={btnLoading}
                variant="contained"
                disabled={!isStepValid}
                onClick={
                  activeStep === (category.category_type === "Delivery" ? 4 : 2)
                    ? submitRegistrationData
                    : handleNext
                }
              >
                {activeStep === (category.category_type === "Delivery" ? 4 : 2)
                  ? "Submit"
                  : "Next"}
              </LoadingButton>
              {/* <Button
                variant="contained"
                disabled={!isStepValid}
                onClick={
                  activeStep === (category.category_type === "Delivery" ? 4 : 2)
                    ? submitRegistrationData
                    : handleNext
                }
              >
                {activeStep === (category.category_type === "Delivery" ? 4 : 2)
                  ? "Submit"
                  : "Next"}
              </Button> */}
            </Box>
          </Box>
        </ValidatorForm>
      </SimpleCard>
    </>
  );
};

export default NewRegistration;
