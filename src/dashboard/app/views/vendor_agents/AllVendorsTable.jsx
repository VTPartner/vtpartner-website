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

const AllVendorsTable = () => {
  const [allJcbCraneDrivers, setAllHandyManDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSelectedHandyManDialog, setOpenSelectedHandyManDialog] =
    useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [selectedHandyMan, setSelectedSelectedHandyMan] = useState({
    handyman_id: "",
    name: "",
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
    sub_cat_id: "",
    service_id: "",
    vehicle_id: "",
    city_id: "",
    aadhar_no: "",
    pan_card_no: "",
    house_no: "",
    city_name: "",
    full_address: "",
    gender: "",
    category_type: "Service",
    aadhar_card_front: "",
    aadhar_card_back: "",
    pan_card_front: "",
    pan_card_back: "",
    category_name: "",
    sub_cat_name: "",
    service_name: "",
  });

  const [errorDriver, setDriverErrors] = useState({
    handyman_id: false,
    name: false,
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
    sub_cat_id: false,
    service_id: false,
    vehicle_id: false,
    city_id: false,
    aadhar_no: false,
    pan_card_no: false,
    house_no: false,
    city_name: false,
    full_address: false,
    gender: false,
    aadhar_card_front: false,
    aadhar_card_back: false,
    pan_card_front: false,
    pan_card_back: false,
    category_name: false,
    sub_cat_name: false,
    service_name: false,
  });

  const [btnLoading, setBtnLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch all vehicles and vehicle types
  const fetchAllHandyManDetails = async () => {
    // Check if the user is online
    if (!navigator.onLine) {
      toast.error("No internet connection. Please check your connection.");
      setLoading(false);
      return; // Exit if no internet connection
    }

    const token = Cookies.get("authToken");

    try {
      const response = await axios.post(
        `${serverEndPoint}/all_handy_man`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update state with vehicle details
      setAllHandyManDetails(response.data.all_handy_man_details);
    } catch (error) {
      handleError(error); // Handle errors using your existing error handling function
    } finally {
      setLoading(false); // Ensure loading state is reset
    }
  };

  useEffect(() => {
    fetchAllHandyManDetails();
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
    setSelectedSelectedHandyMan({
      handyman_id: "",
      name: "",
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
      sub_cat_id: "",
      service_id: "",
      vehicle_id: "",
      city_id: "",
      aadhar_no: "",
      pan_card_no: "",
      house_no: "",
      city_name: "",
      full_address: "",
      gender: "",
      aadhar_card_front: "",
      aadhar_card_back: "",
      pan_card_front: "",
      pan_card_back: "",
      category_name: "",
      sub_cat_name: "",
      service_name: "",
      category_type: "Service",
    });

    setIsEditMode(false);
    setOpenSelectedHandyManDialog(true);
  };

  const navigate = useNavigate();

  const handleEditClick = (service) => {
    setSelectedSelectedHandyMan(service);
    setIsEditMode(true);
    setOpenSelectedHandyManDialog(true);
  };

  useEffect(() => {
    console.log("selectedDriverDetails::", selectedHandyMan);
  }, [selectedHandyMan]);

  const handleCloseDialog = () => {
    setOpenSelectedHandyManDialog(false);
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
    setSelectedSelectedHandyMan((prevData) => {
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
    isEditMode ? selectedHandyMan.vehicle_id : ""
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

      // Update the selectedHandyMan profile_pic or any other specified field
      setSelectedSelectedHandyMan((selectedDriver) => ({
        ...selectedDriver,
        [field]: imgUrl, // Update the specific field, e.g., 'profile_pic'
      }));
    }
  };

  // Validate the current step whenever category type or field data changes
  useEffect(() => {
    validateStep();
  }, [selectedHandyMan]);

  const validateStep = () => {
    if (activeStep === 0) {
      // Step 0: Agent Details
      const isAgentStepValid = !!(
        selectedHandyMan.name &&
        selectedHandyMan.mobile_no &&
        selectedHandyMan.profile_pic
      );
      setIsStepValid(isAgentStepValid);
    } else if (activeStep === 1) {
      // Step 1: Documents
      if (selectedHandyMan?.category_type === "Delivery") {
        const isDocumentStepValid = !!(
          selectedHandyMan.aadhar_no &&
          selectedHandyMan.pan_card_no &&
          selectedHandyMan.aadhar_card_front &&
          selectedHandyMan.aadhar_card_back &&
          selectedHandyMan.pan_card_front &&
          selectedHandyMan.pan_card_back
        );
        setIsStepValid(isDocumentStepValid);
      } else if (selectedHandyMan?.category_type === "Service") {
        const isServiceStepValid = !!(
          selectedHandyMan.aadhar_no &&
          selectedHandyMan.pan_card_no &&
          selectedHandyMan.profile_pic
        );
        setIsStepValid(isServiceStepValid);
      }
    } else if (activeStep === 2) {
      const agentAddressValid = !!selectedHandyMan.full_address;
      setIsStepValid(agentAddressValid);
    } else if (selectedHandyMan?.category_type === "Delivery") {
      if (activeStep === 3) {
        // Step 3: Owner Details
        const isOwnerStepValid = !!(
          ownerPhoto &&
          selectedHandyMan.owner_name &&
          selectedHandyMan.owner_address
        );
        setIsStepValid(isOwnerStepValid);
      } else if (activeStep === 4) {
        // Step 4: Vehicle Details
        const isVehicleStepValid = !!(
          selectedHandyMan.driving_license_no &&
          selectedHandyMan.vehicle_plate_no &&
          selectedHandyMan.rc_no &&
          selectedHandyMan.insurance_no &&
          selectedHandyMan.noc_no &&
          selectedHandyMan.license_front &&
          selectedHandyMan.license_back &&
          selectedHandyMan.vehicle_image &&
          selectedHandyMan.rc_image &&
          selectedHandyMan.insurance_image &&
          selectedHandyMan.noc_image &&
          selectedHandyMan.pollution_certificate_image
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
        selectedHandyMan.profile_pic = await uploadImage(agentPhoto);
      }
      if (aadharCardFront) {
        selectedHandyMan.aadhar_card_front = await uploadImage(aadharCardFront);
      }
      if (aadharCardBack) {
        selectedHandyMan.aadhar_card_back = await uploadImage(aadharCardBack);
      }
      if (panCardFront) {
        selectedHandyMan.pan_card_front = await uploadImage(panCardFront);
      }
      if (panCardBack) {
        selectedHandyMan.pan_card_back = await uploadImage(panCardBack);
      }

      let registrationData = {};
      const token = Cookies.get("authToken");
      const city_id = Cookies.get("city_id");

      registrationData = {
        handyman_id: isEditMode ? selectedHandyMan.handyman_id : -1,
        category_id: isEditMode ? selectedHandyMan.category_id : "5",
        sub_cat_id: isEditMode ? selectedHandyMan.sub_cat_id : -1,
        service_id: isEditMode ? selectedHandyMan.service_id : -1,
        agent_name: selectedHandyMan.name,
        mobile_no: selectedHandyMan.mobile_no,
        gender: selectedHandyMan.gender,
        aadhar_no: selectedHandyMan.aadhar_no,
        pan_no: selectedHandyMan.pan_card_no,
        address: selectedHandyMan.full_address,
        house_no: selectedHandyMan.house_no,
        city_name: selectedHandyMan.city_name,
        agent_photo_url: selectedHandyMan.profile_pic,
        aadhar_card_front_url: selectedHandyMan.aadhar_card_front,
        aadhar_card_back_url: selectedHandyMan.aadhar_card_back,
        pan_card_front_url: selectedHandyMan.pan_card_front,
        pan_card_back_url: selectedHandyMan.pan_card_back,

        city_id: isEditMode ? selectedHandyMan.city_id : city_id,
      };

      console.log("registrationData->", registrationData);

      // Submit form data to the main endpoint
      const endpoint = isEditMode
        ? `${serverEndPoint}/edit_handyman_details`
        : `${serverEndPoint}/add_driver_details`;

      const response = await axios.post(endpoint, registrationData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Registration submitted successfully:", response.data);
      //Navigating to All Enquiries
      toast.success("Registration submitted successfully!");
      setOpenSelectedHandyManDialog(false);
      setActiveStep(0);
      resetForm();
      fetchAllHandyManDetails();
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
        {/* <Button
          variant="contained"
          color="primary"
          sx={{ mb: 2 }}
          onClick={handleOpenDialog}
        >
          Add New Cab Driver
        </Button> */}

        <StyledTable>
          <TableHead>
            <TableRow>
              <TableCell align="left">Agent Name</TableCell>
              <TableCell align="left">Agent ID</TableCell>
              <TableCell align="left">Service Type</TableCell>
              <TableCell align="left">Mobile No</TableCell>
              <TableCell align="left">Joining Date</TableCell>
              <TableCell align="left">Address</TableCell>

              <TableCell align="left">Status</TableCell>
              <TableCell align="left">Last Updated</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allJcbCraneDrivers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((service) => (
                <TableRow key={service.handyman_id}>
                  <TableCell align="left">
                    <Box display="flex" alignItems="center">
                      <Avatar
                        src={`${service.profile_pic}`}
                        alt={service.name}
                        sx={{ width: 40, height: 40, marginRight: 1 }}
                      />
                      {service.name}
                    </Box>
                  </TableCell>
                  <TableCell align="left"># {service.handyman_id}</TableCell>
                  <TableCell align="left">
                    {service.sub_cat_name} / {service.service_name}
                  </TableCell>
                  <TableCell align="left">{service.mobile_no}</TableCell>
                  <TableCell align="left">
                    {service.registration_date}
                  </TableCell>
                  <TableCell align="left">{service.full_address}</TableCell>

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
        open={openSelectedHandyManDialog}
        onClose={handleCloseDialog}
        maxWidth="xl"
        fullWidth
      >
        <Box p={3}>
          <Typography variant="h6" gutterBottom>
            {isEditMode ? "Edit Details" : "Add New Jcb Crane Driver"}
          </Typography>

          <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
            <Box margin={5}>
              <Stepper activeStep={activeStep}>
                {(selectedHandyMan.category_type === "Delivery"
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
                          src={agentPhoto || selectedHandyMan.profile_pic}
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
                      name="name"
                      value={selectedHandyMan.name || ""}
                      onChange={handleChange} // Ensure this is connected correctly
                      required
                      error={errorDriver.name}
                      helperText={
                        errorDriver.name ? "Agent name is required." : ""
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
                      value={selectedHandyMan.mobile_no || ""}
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

                    <RadioGroup
                      row
                      name="gender"
                      sx={{ mb: 2 }}
                      value={selectedHandyMan.gender || ""}
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
                      value={selectedHandyMan.aadhar_no || ""}
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
                      value={selectedHandyMan.pan_card_no || ""}
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
                              selectedHandyMan.aadhar_card_front
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
                              selectedHandyMan.aadhar_card_back
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
                              panCardFront || selectedHandyMan.pan_card_front
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
                            src={panCardBack || selectedHandyMan.pan_card_back}
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
                      value={selectedHandyMan.house_no || ""}
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
                      value={selectedHandyMan.city_name || ""}
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
                        value={selectedHandyMan.full_address || ""}
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
                    (selectedHandyMan.category_type === "Delivery" ? 4 : 2)
                      ? submitRegistrationData
                      : handleNext
                  }
                >
                  {activeStep ===
                  (selectedHandyMan.category_type === "Delivery" ? 4 : 2)
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

export default AllVendorsTable;
