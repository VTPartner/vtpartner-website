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
  DialogTitle,
  DialogContent,
  DialogActions,
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

const AllDriversTable = () => {
  const [allDriversDetails, setAllDriversDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSelectedDriverDialog, setOpenSelectedDriverDialog] =
    useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [selectedDriver, setSelectedDriver] = useState({
    other_driver_id: "",
    driver_first_name: "",
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
    category_driver_first_name: "",
    sub_cat_driver_first_name: "",
    service_driver_first_name: "",
  });

  const [errorDriver, setDriverErrors] = useState({
    other_driver_id: false,
    driver_first_name: false,
    profile_pic: false,
    is_online: false,
    ratings: false,
    mobile_no: false,
    registration_date: false,
    time: false,
    r_lat: false,
    owner_driver_first_name: false,
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
    category_driver_first_name: false,
    sub_cat_driver_first_name: false,
    service_driver_first_name: false,
  });

  const [btnLoading, setBtnLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch all vehicles and vehicle types
  const fetchAllDriversDetails = async () => {
    // Check if the user is online
    if (!navigator.onLine) {
      toast.error("No internet connection. Please check your connection.");
      setLoading(false);
      return; // Exit if no internet connection
    }

    const token = Cookies.get("authToken");

    try {
      const response = await axios.post(
        `${serverEndPoint}/all_drivers`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update state with vehicle details
      setAllDriversDetails(response.data.all_drivers_details);
    } catch (error) {
      handleError(error); // Handle errors using your existing error handling function
    } finally {
      setLoading(false); // Ensure loading state is reset
    }
  };

  useEffect(() => {
    fetchAllDriversDetails();
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
    setSelectedSubcategory({ sub_cat_id: "", sub_cat_name: "" });
    setSelectedOtherService("");
    setSelectedDriver({
      other_driver_id: "",
      driver_first_name: "",
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
      category_id: "4",
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
      category_driver_first_name: "",
      sub_cat_driver_first_name: "",
      service_driver_first_name: "",
      category_type: "Service",
    });

    setIsEditMode(false);
    setOpenSelectedDriverDialog(true);
  };

  const navigate = useNavigate();

  const handleEditClick = (service) => {
    setSelectedDriver(service);
    setIsEditMode(true);
    setOpenSelectedDriverDialog(true);
  };

  useEffect(() => {
    console.log("selectedDriverDetails::", selectedDriver);
  }, [selectedDriver]);

  const handleCloseDialog = () => {
    setOpenSelectedDriverDialog(false);
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
    setSelectedDriver((prevData) => {
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
    isEditMode ? selectedDriver.vehicle_id : ""
  );

  const [selectedOtherService, setSelectedOtherService] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState({
    sub_cat_id: -1,
    sub_cat_name: "",
  });

  const [subCategories, setSubCategories] = useState([]);
  const [otherService, setOtherServices] = useState([]);

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

      // Update the selectedDriver profile_pic or any other specified field
      setSelectedDriver((selectedDriver) => ({
        ...selectedDriver,
        [field]: imgUrl, // Update the specific field, e.g., 'profile_pic'
      }));
    }
  };

  // Validate the current step whenever category type or field data changes
  useEffect(() => {
    validateStep();
  }, [selectedDriver]);

  const validateStep = () => {
    if (activeStep === 0) {
      // Step 0: Agent Details
      const isAgentStepValid = !!(
        selectedDriver.driver_first_name &&
        selectedDriver.mobile_no &&
        selectedDriver.profile_pic
      );
      setIsStepValid(isAgentStepValid);
    } else if (activeStep === 1) {
      // Step 1: Documents
      if (selectedDriver?.category_type === "Delivery") {
        const isDocumentStepValid = !!(
          selectedDriver.aadhar_no &&
          selectedDriver.pan_card_no &&
          selectedDriver.aadhar_card_front &&
          selectedDriver.aadhar_card_back &&
          selectedDriver.pan_card_front &&
          selectedDriver.pan_card_back
        );
        setIsStepValid(isDocumentStepValid);
      } else if (selectedDriver?.category_type === "Service") {
        const isServiceStepValid = !!(
          selectedDriver.aadhar_no &&
          selectedDriver.pan_card_no &&
          selectedDriver.profile_pic
        );
        setIsStepValid(isServiceStepValid);
      }
    } else if (activeStep === 2) {
      const agentAddressValid = !!selectedDriver.full_address;
      setIsStepValid(agentAddressValid);
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

  const blobToFile = (blobUrl, filedriver_first_name) => {
    return fetch(blobUrl)
      .then((response) => response.blob())
      .then((blob) => {
        return new File([blob], filedriver_first_name, { type: blob.type });
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
      const filedriver_first_name = "image.jpg"; // or get the filedriver_first_name from your source if available
      imageFile = await blobToFile(imageFile, filedriver_first_name);
    }

    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      // for (const [key, value] of formData.entries()) {
      //   console.log("Image FormData", `${key}: ${value.driver_first_name}`); // Should now log the correct file driver_first_name
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
        selectedDriver.profile_pic = await uploadImage(agentPhoto);
      }
      if (aadharCardFront) {
        selectedDriver.aadhar_card_front = await uploadImage(aadharCardFront);
      }
      if (aadharCardBack) {
        selectedDriver.aadhar_card_back = await uploadImage(aadharCardBack);
      }
      if (panCardFront) {
        selectedDriver.pan_card_front = await uploadImage(panCardFront);
      }
      if (panCardBack) {
        selectedDriver.pan_card_back = await uploadImage(panCardBack);
      }

      let registrationData = {};
      const token = Cookies.get("authToken");
      const city_id = Cookies.get("city_id");
      console.log(
        "selectedSubcategory.sub_cat_id::",
        selectedSubcategory.sub_cat_id
      );
      console.log("selectedOtherService::", selectedOtherService);
      if (
        selectedSubcategory.sub_cat_id === "" ||
        selectedOtherService === ""
      ) {
        toast.error("Please select the Service Type");
        return;
      }

      registrationData = {
        other_driver_id: isEditMode ? selectedDriver.other_driver_id : -1,
        category_id: isEditMode ? selectedDriver.category_id : "4",
        // sub_cat_id: isEditMode ? selectedDriver.sub_cat_id : -1,
        // service_id: isEditMode ? selectedDriver.service_id : -1,
        sub_cat_id: selectedSubcategory.sub_cat_id,
        service_id: selectedOtherService,
        agent_name: selectedDriver.driver_first_name,
        mobile_no: selectedDriver.mobile_no,
        gender: selectedDriver.gender,
        aadhar_no: selectedDriver.aadhar_no,
        pan_no: selectedDriver.pan_card_no,
        address: selectedDriver.full_address,
        house_no: selectedDriver.house_no,
        city_name: selectedDriver.city_name,
        agent_photo_url: selectedDriver.profile_pic,
        aadhar_card_front_url: selectedDriver.aadhar_card_front,
        aadhar_card_back_url: selectedDriver.aadhar_card_back,
        pan_card_front_url: selectedDriver.pan_card_front,
        pan_card_back_url: selectedDriver.pan_card_back,

        city_id: isEditMode ? selectedDriver.city_id : city_id,
      };

      console.log("registrationData->", registrationData);

      // Submit form data to the main endpoint
      const endpoint = isEditMode
        ? `${serverEndPoint}/edit_other_driver_details`
        : `${serverEndPoint}/add_other_driver_details`;

      const response = await axios.post(endpoint, registrationData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Registration submitted successfully:", response.data);
      //Navigating to All Enquiries
      toast.success("Registration submitted successfully!");
      setOpenSelectedDriverDialog(false);
      setActiveStep(0);
      resetForm();
      fetchAllDriversDetails();
    } catch (error) {
      console.error("Error submitting registration:", error);
      toast.error("Error submitting registration.");
    } finally {
      setBtnLoading(false);
    }
  };

  const isMobile = useMediaQuery("(max-width: 600px)");

  // Fetch subcategories based on category ID
  const fetchSubCategory = async () => {
    try {
      const endPoint = `${serverEndPoint}/all_sub_categories`;
      const response = await axios.post(endPoint, { category_id: "4" });
      console.log(
        "Fetched subcategories:",
        response.data.sub_categories_details
      );
      setSubCategories(response.data.sub_categories_details);
    } catch (error) {
      handleError(error);
    }
  };

  // Fetch other services based on selected subcategory ID
  const fetchOtherServices = async (sub_cat_id) => {
    try {
      const endPoint = `${serverEndPoint}/all_other_services`;
      const response = await axios.post(endPoint, { sub_cat_id: sub_cat_id });
      console.log(
        "Fetched other services:",
        response.data.other_services_details
      );
      setOtherServices(response.data.other_services_details);

      // If service_id is available in allDriversDetails, set it as the selected other service
      if (allDriversDetails.service_id) {
        const initialService = response.data.other_services_details.find(
          (service) => service.service_id === allDriversDetails.service_id
        );

        if (initialService) {
          setSelectedOtherService(initialService.service_id);
          console.log("Initial other service selected:", initialService);
        }
      }
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    if (isEditMode) {
      setSelectedOtherService(selectedDriver.service_id);
    }
  }, [isEditMode, selectedDriver.service_id]);

  useEffect(() => {
    if (isEditMode) {
      setSelectedSubcategory({
        sub_cat_id: selectedDriver.sub_cat_id,
        sub_cat_name: selectedDriver.sub_cat_name,
      });
      // Trigger async actions based on sub category
      fetchOtherServices(selectedDriver.sub_cat_id);
    }
  }, [isEditMode, selectedDriver.sub_cat_id]);

  useEffect(() => {
    fetchSubCategory();
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

  // Handle change in Other Services selection
  const handleOtherServiceChange = (event) => {
    setSelectedOtherService(event.target.value);
    console.log("selectedOtherService::", event.target.value);
  };

  const [open, setOpen] = useState(false);

  const handleStatusUpdateClick = (service) => {
    // Set selectedHandyMan details and open modal
    setSelectedDriver(service);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleStatusChange = (event) => {
    setSelectedDriver((prev) => ({
      ...prev,
      status: event.target.value,
    }));
  };

  const handleUpdateStatus = async () => {
    try {
      // Call the API to update status
      await axios.post(`${serverEndPoint}/update_other_driver_status`, {
        other_driver_id: selectedDriver.other_driver_id,
        status: selectedDriver.status,
      });
      // Pass the updated status to the parent component or refresh data
      toast.success(
        `${selectedDriver.driver_first_name} Status Updated Successfully`
      );
      fetchAllDriversDetails();
      setOpen(false);
    } catch (error) {
      toast.error(
        `${selectedDriver.driver_first_name} Status Updated Failed ${error}`
      );
      console.error("Error updating status:", error);
    }
  };

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
          Add New Driver
        </Button>

        <StyledTable>
          <TableHead>
            <TableRow>
              <TableCell align="left">Driver Name</TableCell>
              <TableCell align="left">Driver ID</TableCell>
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
            {allDriversDetails
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((service) => (
                <TableRow key={service.other_driver_id}>
                  <TableCell align="left">
                    <Box display="flex" alignItems="center">
                      <Avatar
                        src={`${service.profile_pic}`}
                        alt={service.driver_first_name}
                        sx={{ width: 40, height: 40, marginRight: 1 }}
                      />
                      {service.driver_first_name}
                    </Box>
                  </TableCell>
                  <TableCell align="left">
                    # {service.other_driver_id}
                  </TableCell>
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

                    <Tooltip title="Update Status" arrow>
                      <IconButton
                        onClick={() => handleStatusUpdateClick(service)}
                      >
                        <Icon color="primary">update</Icon>
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
          count={allDriversDetails.length}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(+event.target.value);
            setPage(0);
          }}
        />
      </Box>

      {/* Update Status Modal */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Update Status</DialogTitle>
        <DialogContent margin={2}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              value={selectedDriver.status}
              onChange={handleStatusChange}
              label="Status"
            >
              <MenuItem value={1}>Verified</MenuItem>
              <MenuItem value={2}>Blocked</MenuItem>
              <MenuItem value={3}>Rejected</MenuItem>
              <MenuItem value={0}>Not Verified</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleUpdateStatus}
            color="primary"
            variant="contained"
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal for Adding or Editing Vehicle */}
      <Dialog
        open={openSelectedDriverDialog}
        onClose={handleCloseDialog}
        maxWidth="xl"
        fullWidth
      >
        <Box p={3}>
          <Typography variant="h6" gutterBottom>
            {isEditMode ? "Edit Driver Details" : "Add New Driver"}
          </Typography>

          <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
            <Box margin={5}>
              <Stepper activeStep={activeStep}>
                {(selectedDriver.category_type === "Delivery"
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
                          src={agentPhoto || selectedDriver.profile_pic}
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

                    {/* Agent driver_first_name TextField */}
                    <TextField
                      label="Driver Name"
                      fullWidth
                      margin="normal"
                      name="driver_first_name"
                      value={selectedDriver.driver_first_name}
                      onChange={handleChange} // Ensure this is connected correctly
                      required
                      error={errorDriver.driver_first_name}
                      helperText={
                        errorDriver.driver_first_name
                          ? "Driver Name is required."
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
                      value={selectedDriver.mobile_no}
                      onChange={handleChange} // Ensure this is connected correctly
                      required
                      error={errorDriver.mobile_no}
                      helperText={
                        errorDriver.mobile_no
                          ? "Driver Mobile Number is required and must be 10 Digits."
                          : ""
                      }
                      inputProps={{
                        autoComplete: "off",
                      }}
                    />

                    {/* Sub Category dropdown  */}
                    <div className="mb-4 mt-3">
                      <FormControl
                        fullWidth
                        size={isMobile ? "small" : "medium"}
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

                    {selectedSubcategory && otherService.length > 0 && (
                      <div className="mb-4 mt-3">
                        <FormControl
                          fullWidth
                          size={isMobile ? "small" : "medium"}
                        >
                          <InputLabel id="other-services-label">
                            Expertise In?
                          </InputLabel>
                          <Select
                            labelId="other-services-label"
                            id="other-services"
                            label="Other Services"
                            value={selectedOtherService}
                            onChange={handleOtherServiceChange}
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

                    <RadioGroup
                      row
                      name="gender"
                      sx={{ mb: 2 }}
                      value={selectedDriver.gender}
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
                      value={selectedDriver.aadhar_no}
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
                      value={selectedDriver.pan_card_no}
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
                              selectedDriver.aadhar_card_front
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
                              aadharCardBack || selectedDriver.aadhar_card_back
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
                            src={panCardFront || selectedDriver.pan_card_front}
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
                            src={panCardBack || selectedDriver.pan_card_back}
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
                      value={selectedDriver.house_no}
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
                      value={selectedDriver.city_name}
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
                        value={selectedDriver.full_address}
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
                    (selectedDriver.category_type === "Delivery" ? 4 : 2)
                      ? submitRegistrationData
                      : handleNext
                  }
                >
                  {activeStep ===
                  (selectedDriver.category_type === "Delivery" ? 4 : 2)
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

export default AllDriversTable;
