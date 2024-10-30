/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import {
  AiOutlineCheck,
  AiOutlineStop,
  AiOutlineClose,
  AiOutlineQuestionCircle,
} from "react-icons/ai";
import {
  Box,
  Button,
  Dialog,
  TextField,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  Icon,
  Avatar,
  Tooltip,
  Stepper,
  Step,
  StepLabel,
  FormControlLabel,
  Radio,
  Grid,
  RadioGroup,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";
import { styled, useMediaQuery } from "@mui/system";
import { mapKey, serverEndPoint, serverEndPointImage } from "../../constants";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { Pending, PhotoCamera, Verified } from "@mui/icons-material";
import { GoVerified } from "react-icons/go";
import { ValidatorForm } from "react-material-ui-form-validator";
import { useLoadScript } from "@react-google-maps/api";

const StyledTable = styled(Table)(() => ({
  whiteSpace: "pre",
  "& thead": {
    "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } },
  },
  "& tbody": {
    "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } },
  },
}));

const libraries = ["places"]; // Load the places library

const AllCraneDriversTable = () => {
  const [allJcbCraneDrivers, setAllJcbCraneDriver] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [
    openSelectedJcbCraneDriverDialog,
    setOpenSelectedJcbCraneDriverDialog,
  ] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [selectedJcbCraneDriver, setSelectedSelectedJcbCraneDriver] = useState({
    jcb_crane_driver_id: "",
    driver_name: "",
    profile_pic: "",
    is_online: "",
    ratings: "",
    mobile_no: "",
    registration_date: "",
    time: "",
    r_lat: "",
    r_lng: "",
    current_lat: "",
    current_lng: "",
    status: "",
    recent_online_pic: "",
    is_verified: "",
    category_id: "",
    vehicle_id: "",
    city_id: "",
    aadhar_no: "",
    pan_card_no: "",
    house_no: "",
    city_name: "",
    full_address: "",
    gender: "",
    owner_id: "",
    aadhar_card_front: "",
    aadhar_card_back: "",
    pan_card_front: "",
    pan_card_back: "",
    license_front: "",
    license_back: "",
    insurance_image: "",
    noc_image: "",
    pollution_certificate_image: "",
    rc_image: "",
    vehicle_image: "",
    vehicle_plate_image: "",
    category_name: "",
    vehicle_name: "",
    category_type: "",
    owner_photo: "",
    owner_name: "",
    owner_mobile_no: "",
    owner_house_no: "",
    owner_city_name: "",
    owner_address: "",
    driving_license_no: "",
    vehicle_plate_no: "",
    rc_no: "",
    insurance_no: "",
    noc_no: "",
  });

  const [errorDriver, setDriverErrors] = useState({
    jcb_crane_driver_id: false,
    driver_name: false,
    profile_pic: false,
    is_online: false,
    ratings: false,
    mobile_no: false,
    registration_date: false,
    time: false,
    r_lat: false,
    owner_name: false,
    r_lng: false,
    current_lat: false,
    current_lng: false,
    status: false,
    recent_online_pic: false,
    is_verified: false,
    category_id: false,
    vehicle_id: false,
    city_id: false,
    aadhar_no: false,
    pan_card_no: false,
    house_no: false,
    city_name: false,
    full_address: false,
    gender: false,
    owner_id: false,
    aadhar_card_front: false,
    aadhar_card_back: false,
    pan_card_front: false,
    pan_card_back: false,
    license_front: false,
    license_back: false,
    insurance_image: false,
    noc_image: false,
    pollution_certificate_image: false,
    rc_image: false,
    vehicle_image: false,
    vehicle_plate_image: false,
    category_name: false,
    vehicle_name: false,
    category_type: false,
    owner_photo: false,
    owner_mobile_no: false,
    owner_house_no: false,
    owner_city_name: false,
    owner_address: false,
    driving_license_no: false,
    vehicle_plate_no: false,
    rc_no: false,
    insurance_no: false,
    noc_no: false,
  });

  const [btnLoading, setBtnLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch all vehicles and vehicle types
  const fetchAllJcbCraneDriver = async () => {
    // Check if the user is online
    if (!navigator.onLine) {
      toast.error("No internet connection. Please check your connection.");
      setLoading(false);
      return; // Exit if no internet connection
    }

    const token = Cookies.get("authToken");

    try {
      const response = await axios.post(
        `${serverEndPoint}/all_jcb_crane_drivers`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update state with vehicle details
      setAllJcbCraneDriver(response.data.all_jcb_crane_drivers);
    } catch (error) {
      handleError(error); // Handle errors using your existing error handling function
    } finally {
      setLoading(false); // Ensure loading state is reset
    }
  };

  useEffect(() => {
    fetchAllJcbCraneDriver();
    fetchAllVehicles();
  }, []);

  // Handle error responses
  const handleError = (error) => {
    if (error.response) {
      if (error.response.status === 404) {
        toast.error("No Data Found.");
        setError("No Data Found");
      } else if (error.response.status === 409) {
        toast.error("Driver Details already assigned.");
      } else if (error.response.status === 500) {
        toast.error("Internal server error. Please try again later.");
        setError("Internal Server Error");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
        setError("Unexpected Error");
      }
    } else {
      toast.error(
        "Failed to fetch All Goods Drivers. Please check your connection."
      );
      setError("Network Error");
    }
    setLoading(false);
  };

  const handleOpenDialog = () => {
    setActiveStep(0);
    setSelectedSelectedJcbCraneDriver({
      jcb_crane_driver_id: "",
      driver_name: "",
      profile_pic: "",
      is_online: "",
      ratings: "",
      mobile_no: "",
      registration_date: "",
      time: "",
      r_lat: "",
      r_lng: "",
      current_lat: "",
      current_lng: "",
      status: "",
      recent_online_pic: "",
      is_verified: "",
      category_id: "",
      vehicle_id: "",
      city_id: "",
      aadhar_no: "",
      pan_card_no: "",
      house_no: "",
      city_name: "",
      full_address: "",
      gender: "",
      owner_id: "",
      owner_name: "",
      aadhar_card_front: "",
      aadhar_card_back: "",
      pan_card_front: "",
      pan_card_back: "",
      license_front: "",
      license_back: "",
      insurance_image: "",
      noc_image: "",
      pollution_certificate_image: "",
      rc_image: "",
      vehicle_image: "",
      vehicle_plate_image: "",
      category_name: "",
      vehicle_name: "",
      category_type: "Delivery",
      owner_photo: "",
      owner_mobile_no: "",
      owner_house_no: "",
      owner_city_name: "",
      owner_address: "",
      driving_license_no: "",
      vehicle_plate_no: "",
      rc_no: "",
      insurance_no: "",
      noc_no: "",
    });

    setIsEditMode(false);
    setOpenSelectedJcbCraneDriverDialog(true);
  };

  const navigate = useNavigate();

  const handleEditClick = (service) => {
    setSelectedSelectedJcbCraneDriver(service);
    setIsEditMode(true);
    setOpenSelectedJcbCraneDriverDialog(true);
  };

  useEffect(() => {
    console.log("selectedDriverDetails::", selectedJcbCraneDriver);
  }, [selectedJcbCraneDriver]);

  const handleCloseDialog = () => {
    setOpenSelectedJcbCraneDriverDialog(false);
  };

  const [activeStep, setActiveStep] = useState(0);
  const stepsService = ["Agent Details", "Documents", "Address Details"];
  const stepsDelivery = [
    "Agent Details",
    "Documents",
    "Address Details",
    "Owner Details",
    "Vehicle Details",
  ];

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
    setSelectedSelectedJcbCraneDriver((prevData) => {
      const newData = {
        ...prevData,
        [name]: value,
      };
      console.log("Updated State:", newData); // Check updated state
      return newData;
    });

    if (name === "mobile_no") {
      const isValid = validateAgentMobileNo(value);
      setDriverErrors({ ...errorDriver, [name]: !isValid });
    }

    if (name === "owner_mobile_no") {
      const isValid = validateOwnerMobileNo(value);
      setDriverErrors({
        ...errorDriver,
        [name]: !isValid,
      });
    }
  };

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

  const [services, setServices] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(
    isEditMode ? selectedJcbCraneDriver.vehicle_id : ""
  );

  const resetForm = () => {
    setRCImage(null);
    setInsuranceImage(null);
    setNOCImage(null);
    setPollutionCertificateImage(null);
    setLicenseFront(null);
    setLicenseBack(null);
    setVehicleImage(null);
    setVehiclePlateNoImage(null);
    setAadharCardFront(null);
    setAadharCardBack(null);
    setPanCardFront(null);
    setPanCardBack(null);
    setAgentPhoto(null);
    setOwnerPhoto(null);
  };

  // Load selectedJcbCraneDriver data into form fields when in Edit Mode
  useEffect(() => {
    if (isEditMode) {
      setSelectedVehicle(selectedJcbCraneDriver.vehicle_id);
    }
  }, [isEditMode, selectedJcbCraneDriver.vehicle_id]);

  const fetchAllVehicles = async () => {
    const token = Cookies.get("authToken");

    try {
      const endPoint = `${serverEndPoint}/all_vehicles`;

      const response = await axios.post(
        endPoint,
        {
          category_id: "3",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setVehicles(response.data.vehicle_details);
    } catch (error) {
      handleError(error);
    }
  };

  const handleVehicleChange = (e) => {
    const vehicleId = e.target.value;
    setSelectedVehicle(vehicleId);
    setSelectedSelectedJcbCraneDriver((prevState) => ({
      ...prevState,
      vehicle_id: vehicleId,
    }));
  };

  const addressInputRef = useRef(null); // Reference to the input element
  const addressInputAgentRef = useRef(null); // Reference to the input element

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: mapKey, // Replace with your API key
    libraries,
  });

  const [isStepValid, setIsStepValid] = useState(false);

  const handleImageChange = (event, setImage, field) => {
    console.log("field::", field);
    const file = event.target.files[0];
    if (file) {
      const imgUrl = URL.createObjectURL(file);
      setImage(imgUrl);

      // Update the selectedJcbCraneDriver profile_pic or any other specified field
      setSelectedSelectedJcbCraneDriver((selectedDriver) => ({
        ...selectedDriver,
        [field]: imgUrl, // Update the specific field, e.g., 'profile_pic'
      }));
    }
  };

  // Validate the current step whenever category type or field data changes
  useEffect(() => {
    validateStep();
  }, [selectedJcbCraneDriver]);

  const validateStep = () => {
    if (activeStep === 0) {
      // Step 0: Agent Details
      const isAgentStepValid = !!(
        selectedJcbCraneDriver.driver_name &&
        selectedJcbCraneDriver.mobile_no &&
        selectedJcbCraneDriver.profile_pic
      );
      setIsStepValid(isAgentStepValid);
    } else if (activeStep === 1) {
      // Step 1: Documents
      if (selectedJcbCraneDriver?.category_type === "Delivery") {
        const isDocumentStepValid = !!(
          selectedJcbCraneDriver.aadhar_no &&
          selectedJcbCraneDriver.pan_card_no &&
          selectedJcbCraneDriver.aadhar_card_front &&
          selectedJcbCraneDriver.aadhar_card_back &&
          selectedJcbCraneDriver.pan_card_front &&
          selectedJcbCraneDriver.pan_card_back
        );
        setIsStepValid(isDocumentStepValid);
      } else if (selectedJcbCraneDriver?.category_type === "Service") {
        const isServiceStepValid = !!(
          selectedJcbCraneDriver.aadhar_no &&
          selectedJcbCraneDriver.pan_card_no &&
          selectedJcbCraneDriver.profile_pic
        );
        setIsStepValid(isServiceStepValid);
      }
    } else if (activeStep === 2) {
      const agentAddressValid = !!selectedJcbCraneDriver.full_address;
      setIsStepValid(agentAddressValid);
    } else if (selectedJcbCraneDriver?.category_type === "Delivery") {
      if (activeStep === 3) {
        // Step 3: Owner Details
        const isOwnerStepValid = !!(
          ownerPhoto &&
          selectedJcbCraneDriver.owner_name &&
          selectedJcbCraneDriver.owner_address
        );
        setIsStepValid(isOwnerStepValid);
      } else if (activeStep === 4) {
        // Step 4: Vehicle Details
        const isVehicleStepValid = !!(
          selectedJcbCraneDriver.driving_license_no &&
          selectedJcbCraneDriver.vehicle_plate_no &&
          selectedJcbCraneDriver.rc_no &&
          selectedJcbCraneDriver.insurance_no &&
          selectedJcbCraneDriver.noc_no &&
          selectedJcbCraneDriver.license_front &&
          selectedJcbCraneDriver.license_back &&
          selectedJcbCraneDriver.vehicle_image &&
          selectedJcbCraneDriver.rc_image &&
          selectedJcbCraneDriver.insurance_image &&
          selectedJcbCraneDriver.noc_image &&
          selectedJcbCraneDriver.pollution_certificate_image
        );
        setIsStepValid(isVehicleStepValid);
      }
    } else {
      setIsStepValid(true); // Default for other steps
    }
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const blobToFile = (blobUrl, fileName) => {
    return fetch(blobUrl)
      .then((response) => response.blob())
      .then((blob) => {
        return new File([blob], fileName, { type: blob.type });
      });
  };

  const uploadImage = async (imageFile) => {
    // console.log("imageFile::", imageFile);
    if (!imageFile) return null;

    // Check if the imageFile is a Blob URL
    //const isBlobUrl = (url) => url.startsWith("blob:");
    const isBlobUrl = (url) =>
      typeof url === "string" && url.startsWith("blob:");

    if (isBlobUrl(imageFile)) {
      const fileName = "image.jpg"; // or get the filename from your source if available
      imageFile = await blobToFile(imageFile, fileName);
    }

    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      // for (const [key, value] of formData.entries()) {
      //   console.log("Image FormData", `${key}: ${value.name}`); // Should now log the correct file name
      // }
      const uploadResponse = await axios.post(
        `${serverEndPointImage}/upload`,
        formData // Removed Content-Type header
      );
      return uploadResponse.data.image_url; // Assuming API returns the image URL
    } catch (error) {
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      } else {
        console.error("Error uploading image:", error);
      }
      toast.error("Error uploading image or file size too large (2 MB max).");
      return null;
    }
  };

  const submitRegistrationData = async () => {
    try {
      setBtnLoading(true);

      if (agentPhoto) {
        selectedJcbCraneDriver.profile_pic = await uploadImage(agentPhoto);
      }
      if (aadharCardFront) {
        selectedJcbCraneDriver.aadhar_card_front = await uploadImage(
          aadharCardFront
        );
      }
      if (aadharCardBack) {
        selectedJcbCraneDriver.aadhar_card_back = await uploadImage(
          aadharCardBack
        );
      }
      if (panCardFront) {
        selectedJcbCraneDriver.pan_card_front = await uploadImage(panCardFront);
      }
      if (panCardBack) {
        selectedJcbCraneDriver.pan_card_back = await uploadImage(panCardBack);
      }

      let registrationData = {};
      const token = Cookies.get("authToken");
      const city_id = Cookies.get("city_id");

      if (selectedJcbCraneDriver.category_type === "Delivery") {
        if (ownerPhoto) {
          selectedJcbCraneDriver.owner_photo = await uploadImage(ownerPhoto);
        }
        if (licenseFront) {
          selectedJcbCraneDriver.license_front = await uploadImage(
            licenseFront
          );
        }
        if (licenseBack) {
          selectedJcbCraneDriver.license_back = await uploadImage(licenseBack);
        }
        if (vehicleImage) {
          selectedJcbCraneDriver.vehicle_image = await uploadImage(
            vehicleImage
          );
        }
        if (vehiclePlateNoImage) {
          selectedJcbCraneDriver.vehicle_plate_image = await uploadImage(
            vehiclePlateNoImage
          );
        }
        if (rcImage) {
          selectedJcbCraneDriver.rc_image = await uploadImage(rcImage);
        }
        if (insuranceImage) {
          selectedJcbCraneDriver.insurance_image = await uploadImage(
            insuranceImage
          );
        }
        if (nocImage) {
          selectedJcbCraneDriver.noc_image = await uploadImage(nocImage);
        }
        if (pollutionCertificateImage) {
          selectedJcbCraneDriver.pollution_certificate_image =
            await uploadImage(pollutionCertificateImage);
        }

        console.log("selectedJcbCraneDriver:::::", selectedJcbCraneDriver);

        registrationData = {
          owner_id: isEditMode ? selectedJcbCraneDriver.owner_id : -1,
          driver_id: isEditMode
            ? selectedJcbCraneDriver.jcb_crane_driver_id
            : -1,
          category_id: isEditMode ? selectedJcbCraneDriver.category_id : "3",
          vehicle_id: selectedJcbCraneDriver.vehicle_id,
          agent_name: selectedJcbCraneDriver.driver_name,
          mobile_no: selectedJcbCraneDriver.mobile_no,
          gender: selectedJcbCraneDriver.gender,
          aadhar_no: selectedJcbCraneDriver.aadhar_no,
          pan_no: selectedJcbCraneDriver.pan_card_no,
          address: selectedJcbCraneDriver.full_address,
          house_no: selectedJcbCraneDriver.house_no,
          city_name: selectedJcbCraneDriver.city_name,
          owner_name: selectedJcbCraneDriver.owner_name,
          owner_mobile_no: selectedJcbCraneDriver.owner_mobile_no,
          owner_house_no: selectedJcbCraneDriver.owner_house_no,
          owner_city_name: selectedJcbCraneDriver.owner_city_name,
          owner_address: selectedJcbCraneDriver.owner_address,
          driving_license_no: selectedJcbCraneDriver.driving_license_no,
          vehicle_plate_no: selectedJcbCraneDriver.vehicle_plate_no,
          rc_no: selectedJcbCraneDriver.rc_no,
          insurance_no: selectedJcbCraneDriver.insurance_no,
          noc_no: selectedJcbCraneDriver.noc_no,
          agent_photo_url: selectedJcbCraneDriver.profile_pic,
          aadhar_card_front_url: selectedJcbCraneDriver.aadhar_card_front,
          aadhar_card_back_url: selectedJcbCraneDriver.aadhar_card_back,
          pan_card_front_url: selectedJcbCraneDriver.pan_card_front,
          pan_card_back_url: selectedJcbCraneDriver.pan_card_back,
          owner_photo_url: selectedJcbCraneDriver.owner_photo,
          license_front_url: selectedJcbCraneDriver.license_front,
          license_back_url: selectedJcbCraneDriver.license_back,
          vehicle_image_url: selectedJcbCraneDriver.vehicle_image,
          rc_image_url: selectedJcbCraneDriver.rc_image,
          insurance_image_url: selectedJcbCraneDriver.insurance_image,
          noc_image_url: selectedJcbCraneDriver.noc_image,
          city_id: isEditMode ? selectedJcbCraneDriver.city_id : city_id,
          pollution_certificate_image_url:
            selectedJcbCraneDriver.pollution_certificate_image,
          vehicle_plate_image: selectedJcbCraneDriver.vehicle_plate_image,
        };
      }

      console.log("registrationData->", registrationData);

      // Submit form data to the main endpoint
      const endpoint = isEditMode
        ? `${serverEndPoint}/edit_driver_details`
        : `${serverEndPoint}/add_driver_details`;

      const response = await axios.post(endpoint, registrationData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Registration submitted successfully:", response.data);
      //Navigating to All Enquiries
      toast.success("Registration submitted successfully!");
      setOpenSelectedJcbCraneDriverDialog(false);
      setActiveStep(0);
      resetForm();
      fetchAllJcbCraneDriver();
    } catch (error) {
      console.error("Error submitting registration:", error);
      toast.error("Error submitting registration.");
    } finally {
      setBtnLoading(false);
    }
  };

  const isMobile = useMediaQuery("(max-width: 600px)");

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

  return (
    <>
      <Box width="100%" overflow="auto">
        <Button
          variant="contained"
          color="primary"
          sx={{ mb: 2 }}
          onClick={handleOpenDialog}
        >
          Add New Cab Driver
        </Button>

        <StyledTable>
          <TableHead>
            <TableRow>
              <TableCell align="left">Driver Name</TableCell>
              <TableCell align="left">Mobile No</TableCell>
              <TableCell align="left">Address</TableCell>
              <TableCell align="left">Vehicle Details</TableCell>
              <TableCell align="left">Status</TableCell>
              <TableCell align="left">Last Updated</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allJcbCraneDrivers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((service) => (
                <TableRow key={service.jcb_crane_driver_id}>
                  <TableCell align="left">
                    <Box display="flex" alignItems="center">
                      <Avatar
                        src={`${service.profile_pic}`}
                        alt={service.driver_name}
                        sx={{ width: 40, height: 40, marginRight: 1 }}
                      />
                      {service.driver_name}
                    </Box>
                  </TableCell>
                  <TableCell align="left">{service.mobile_no}</TableCell>
                  <TableCell align="left">{service.full_address}</TableCell>
                  <TableCell align="left">
                    <Box display="flex" alignItems="center">
                      <Avatar
                        src={`${service.vehicle_image}`}
                        alt={service.vehicle_name}
                        sx={{ width: 40, height: 40, marginRight: 1 }}
                      />
                      {service.vehicle_name}
                    </Box>
                  </TableCell>
                  <TableCell align="left">
                    {service.status === 1 ? (
                      <Box display="flex" alignItems="center">
                        <Verified
                          style={{
                            color: "green",
                            marginRight: "5px",
                            width: "20px",
                          }}
                        />
                        Verified
                      </Box>
                    ) : service.status === 2 ? (
                      <>
                        <AiOutlineStop
                          style={{ color: "red", marginRight: "5px" }}
                        />
                        Blocked
                      </>
                    ) : service.status === 3 ? (
                      <>
                        <AiOutlineClose
                          style={{ color: "orange", marginRight: "5px" }}
                        />
                        Rejected
                      </>
                    ) : (
                      <Box display="flex">
                        <Pending
                          style={{ color: "gray", marginRight: "5px" }}
                        />
                        Not Verified
                      </Box>
                    )}
                  </TableCell>

                  <TableCell align="left">
                    {format(
                      new Date(service.time * 1000),
                      "dd/MM/yyyy, hh:mm:ss a"
                    )}
                  </TableCell>

                  <TableCell align="right">
                    <Tooltip title="Edit Details" arrow>
                      <IconButton onClick={() => handleEditClick(service)}>
                        <Icon color="primary">edit</Icon>
                      </IconButton>
                    </Tooltip>

                    {/* <Tooltip title="Add Other Services" arrow>
                      <IconButton onClick={() => goToOtherServices(service)}>
                        <Icon color="gray">arrow_forward</Icon>
                      </IconButton>
                    </Tooltip> */}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </StyledTable>

        <TablePagination
          sx={{ px: 2 }}
          page={page}
          component="div"
          rowsPerPage={rowsPerPage}
          count={allJcbCraneDrivers.length}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(+event.target.value);
            setPage(0);
          }}
        />
      </Box>

      {/* Modal for Adding or Editing Vehicle */}
      <Dialog
        open={openSelectedJcbCraneDriverDialog}
        onClose={handleCloseDialog}
        maxWidth="xl"
        fullWidth
      >
        <Box p={3}>
          <Typography variant="h6" gutterBottom>
            {isEditMode
              ? "Edit Jcb Crane Driver Details"
              : "Add New Jcb Crane Driver"}
          </Typography>

          <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
            <Box margin={5}>
              <Stepper activeStep={activeStep}>
                {(selectedJcbCraneDriver.category_type === "Delivery"
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
                        onChange={(e) =>
                          handleImageChange(e, setAgentPhoto, "profile_pic")
                        }
                      />
                      <label htmlFor="agentPhoto">
                        {" "}
                        <Avatar
                          src={agentPhoto || selectedJcbCraneDriver.profile_pic}
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
                      name="driver_name"
                      value={selectedJcbCraneDriver.driver_name || ""}
                      onChange={handleChange} // Ensure this is connected correctly
                      required
                      error={errorDriver.driver_name}
                      helperText={
                        errorDriver.driver_name ? "Agent name is required." : ""
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
                      value={selectedJcbCraneDriver.mobile_no || ""}
                      onChange={handleChange} // Ensure this is connected correctly
                      required
                      error={errorDriver.mobile_no}
                      helperText={
                        errorDriver.mobile_no
                          ? "Agent Mobile Number is required and must be 10 Digits."
                          : ""
                      }
                      inputProps={{
                        autoComplete: "off",
                      }}
                    />

                    <div className="mb-4 mt-3">
                      <FormControl
                        fullWidth
                        size={isMobile ? "small" : "medium"}
                        error={!!errorDriver.vehicle_id}
                      >
                        <InputLabel id="vehicle-label">Vehicle</InputLabel>
                        <Select
                          labelId="vehicle-label"
                          id="vehicle"
                          label="Vehicle"
                          value={selectedVehicle}
                          onChange={handleVehicleChange}
                        >
                          {vehicles.map((vehicle) => (
                            <MenuItem
                              key={vehicle.vehicle_id}
                              value={vehicle.vehicle_id}
                            >
                              {vehicle.vehicle_name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>

                    <RadioGroup
                      row
                      name="gender"
                      sx={{ mb: 2 }}
                      value={selectedJcbCraneDriver.gender || ""}
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
                      value={selectedJcbCraneDriver.aadhar_no || ""}
                      onChange={handleChange} // Ensure this is connected correctly
                      required
                      error={errorDriver.aadhar_no}
                      helperText={
                        errorDriver.aadhar_no ? "Aadhar No is required." : ""
                      }
                      inputProps={{
                        autoComplete: "off",
                      }}
                    />
                    <TextField
                      label="PAN Card Number"
                      fullWidth
                      margin="normal"
                      name="pan_card_no"
                      value={selectedJcbCraneDriver.pan_card_no || ""}
                      onChange={handleChange} // Ensure this is connected correctly
                      required
                      error={errorDriver.pan_card_no}
                      helperText={
                        errorDriver.pan_card_no
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
                            handleImageChange(
                              e,
                              setAadharCardFront,
                              "aadhar_card_front"
                            )
                          }
                        />
                        <label htmlFor="aadharCardFront">
                          {" "}
                          {/* Changed from licenseBack to agentPhoto */}
                          <Avatar
                            src={
                              aadharCardFront ||
                              selectedJcbCraneDriver.aadhar_card_front
                            }
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
                            handleImageChange(
                              e,
                              setAadharCardBack,
                              "aadhar_card_back"
                            )
                          }
                        />
                        <label htmlFor="aadharCardBack">
                          {" "}
                          {/* Changed from licenseBack to agentPhoto */}
                          <Avatar
                            src={
                              aadharCardBack ||
                              selectedJcbCraneDriver.aadhar_card_back
                            }
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
                          onChange={(e) =>
                            handleImageChange(
                              e,
                              setPanCardFront,
                              "pan_card_front"
                            )
                          }
                        />
                        <label htmlFor="panCardFront">
                          {" "}
                          {/* Changed from licenseBack to agentPhoto */}
                          <Avatar
                            src={
                              panCardFront ||
                              selectedJcbCraneDriver.pan_card_front
                            }
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
                          onChange={(e) =>
                            handleImageChange(
                              e,
                              setPanCardBack,
                              "pan_card_back"
                            )
                          }
                        />
                        <label htmlFor="panCardBack">
                          {" "}
                          {/* Changed from licenseBack to agentPhoto */}
                          <Avatar
                            src={
                              panCardBack ||
                              selectedJcbCraneDriver.pan_card_back
                            }
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
                      value={selectedJcbCraneDriver.house_no || ""}
                      onChange={handleChange}
                      required
                      error={errorDriver.house_no}
                      helperText={
                        errorDriver.house_no ? "House No is required." : ""
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
                      value={selectedJcbCraneDriver.city_name || ""}
                      onChange={handleChange}
                      required
                      error={errorDriver.city_name}
                      helperText={
                        errorDriver.city_name ? "City Name is required." : ""
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
                        name="full_address"
                        inputRef={addressInputAgentRef}
                        value={selectedJcbCraneDriver.full_address || ""}
                        onChange={handleChange}
                        required
                        error={errorDriver.full_address}
                        helperText={
                          errorDriver.full_address
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
              {selectedJcbCraneDriver.category_type === "Delivery" &&
                activeStep === 3 && (
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
                          onChange={(e) =>
                            handleImageChange(e, setOwnerPhoto, "owner_photo")
                          }
                        />
                        <label htmlFor="ownerPhoto">
                          {" "}
                          <Avatar
                            src={
                              ownerPhoto || selectedJcbCraneDriver.owner_photo
                            }
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
                            value={selectedJcbCraneDriver.owner_name || ""}
                            onChange={handleChange} // Ensure this is connected correctly
                            required
                            error={errorDriver.owner_name}
                            helperText={
                              errorDriver.owner_name
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
                            value={selectedJcbCraneDriver.owner_mobile_no || ""}
                            onChange={handleChange} // Ensure this is connected correctly
                            required
                            error={errorDriver.owner_mobile_no}
                            helperText={
                              errorDriver.owner_mobile_no
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
                            value={selectedJcbCraneDriver.owner_house_no || ""}
                            onChange={handleChange}
                            required
                            error={errorDriver.owner_house_no}
                            helperText={
                              errorDriver.owner_house_no
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
                            value={selectedJcbCraneDriver.owner_city_name || ""}
                            onChange={handleChange}
                            required
                            error={errorDriver.owner_city_name}
                            helperText={
                              errorDriver.owner_city_name
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
                          value={selectedJcbCraneDriver.owner_address || ""}
                          onChange={handleChange} // Ensure this is connected correctly
                          required
                          error={errorDriver.owner_address}
                          helperText={
                            errorDriver.owner_address
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

              {selectedJcbCraneDriver.category_type === "Delivery" &&
                activeStep === 4 && (
                  <Grid container spacing={6} padding={5}>
                    <Grid item xs={12}>
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <TextField
                            label="Driving License Number "
                            fullWidth
                            margin="normal"
                            name="driving_license_no"
                            value={
                              selectedJcbCraneDriver.driving_license_no || ""
                            }
                            onChange={handleChange} // Ensure this is connected correctly
                            required
                            error={errorDriver.driving_license_no}
                            helperText={
                              errorDriver.driving_license_no
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
                            name="vehicle_plate_no"
                            value={
                              selectedJcbCraneDriver.vehicle_plate_no || ""
                            }
                            onChange={handleChange} // Ensure this is connected correctly
                            required
                            error={errorDriver.vehicle_plate_no}
                            helperText={
                              errorDriver.vehicle_plate_no
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
                            value={selectedJcbCraneDriver.rc_no || ""}
                            onChange={handleChange} // Ensure this is connected correctly
                            required
                            error={errorDriver.rc_no}
                            helperText={
                              errorDriver.rc_no ? "RC Number is required." : ""
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
                            value={selectedJcbCraneDriver.insurance_no || ""}
                            onChange={handleChange} // Ensure this is connected correctly
                            required
                            error={errorDriver.insurance_no}
                            helperText={
                              errorDriver.insurance_no
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
                            value={selectedJcbCraneDriver.noc_no || ""}
                            onChange={handleChange} // Ensure this is connected correctly
                            required
                            error={errorDriver.noc_no}
                            helperText={
                              errorDriver.noc_no
                                ? "NOC Number is required."
                                : ""
                            }
                            inputProps={{
                              autoComplete: "off",
                            }}
                          />
                        </Grid>
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
                            onChange={(e) =>
                              handleImageChange(
                                e,
                                setLicenseFront,
                                "license_front"
                              )
                            }
                          />
                          <label htmlFor="licenseFront">
                            {" "}
                            <Avatar
                              src={
                                licenseFront ||
                                selectedJcbCraneDriver.license_front
                              }
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
                            onChange={(e) =>
                              handleImageChange(
                                e,
                                setLicenseBack,
                                "license_back"
                              )
                            }
                          />
                          <label htmlFor="licenseBack">
                            {" "}
                            {/* Changed from licenseBack to agentPhoto */}
                            <Avatar
                              src={
                                licenseBack ||
                                selectedJcbCraneDriver.license_back
                              }
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
                            onChange={(e) =>
                              handleImageChange(
                                e,
                                setVehicleImage,
                                "vehicle_image"
                              )
                            }
                          />
                          <label htmlFor="vehicleImage">
                            {" "}
                            {/* Changed from licenseBack to agentPhoto */}
                            <Avatar
                              src={
                                vehicleImage ||
                                selectedJcbCraneDriver.vehicle_image
                              }
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
                              handleImageChange(
                                e,
                                setVehiclePlateNoImage,
                                "vehicle_plate_image"
                              )
                            }
                          />
                          <label htmlFor="vehiclePlateNoImage">
                            {" "}
                            {/* Changed from licenseBack to agentPhoto */}
                            <Avatar
                              src={
                                vehiclePlateNoImage ||
                                selectedJcbCraneDriver.vehicle_plate_image
                              }
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
                            onChange={(e) =>
                              handleImageChange(e, setRCImage, "rc_image")
                            }
                          />
                          <label htmlFor="rcImage">
                            {" "}
                            {/* Changed from licenseBack to agentPhoto */}
                            <Avatar
                              src={rcImage || selectedJcbCraneDriver.rc_image}
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
                              handleImageChange(
                                e,
                                setInsuranceImage,
                                "insurance_image"
                              )
                            }
                          />
                          <label htmlFor="insuranceImage">
                            {" "}
                            {/* Changed from licenseBack to agentPhoto */}
                            <Avatar
                              src={
                                insuranceImage ||
                                selectedJcbCraneDriver.insurance_image
                              }
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
                            onChange={(e) =>
                              handleImageChange(e, setNOCImage, "noc_image")
                            }
                          />
                          <label htmlFor="nocImage">
                            {" "}
                            {/* Changed from licenseBack to agentPhoto */}
                            <Avatar
                              src={nocImage || selectedJcbCraneDriver.noc_image}
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
                              handleImageChange(
                                e,
                                setPollutionCertificateImage,
                                "pollution_certificate_image"
                              )
                            }
                          />
                          <label htmlFor="pollutionCertificateImage">
                            {" "}
                            {/* Changed from licenseBack to agentPhoto */}
                            <Avatar
                              src={
                                pollutionCertificateImage ||
                                selectedJcbCraneDriver.pollution_certificate_image
                              }
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
                    activeStep ===
                    (selectedJcbCraneDriver.category_type === "Delivery"
                      ? 4
                      : 2)
                      ? submitRegistrationData
                      : handleNext
                  }
                >
                  {activeStep ===
                  (selectedJcbCraneDriver.category_type === "Delivery" ? 4 : 2)
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

          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button onClick={handleCloseDialog} sx={{ marginRight: 1 }}>
              Cancel
            </Button>
            {/* <LoadingButton
              type="submit"
              color="primary"
              loading={btnLoading}
              variant="contained"
              onClick={saveDriverDetails}
            >
              {isEditMode ? "Update" : "Create"}
            </LoadingButton> */}
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default AllCraneDriversTable;
