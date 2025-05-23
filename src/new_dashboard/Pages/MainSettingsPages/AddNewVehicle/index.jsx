/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
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
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { toast, ToastContainer } from "react-toastify";
import { styled } from "@mui/system";

import { useNavigate, useParams } from "react-router-dom";

import { Card, CardBody, Col, Container, Row } from "reactstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import Cookies from "js-cookie";
import {
  formatEpoch,
  serverEndPoint,
  serverEndPointImage,
} from "../../../../dashboard/app/constants";
import Loader from "../../../Components/Loader";

const AddNewVehiclePage = () => {
  const [activeTab, setActiveTab] = useState("connect-tab");
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const [loading, setLoading] = useState(true);
  const { category_id, category_name } = useParams();
  const [vehicles, setVehicles] = useState([]);

  const [error, setError] = useState(null);
  const [openVehicleDialog, setOpenVehicleDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileSizeImage, setImageFileSizeImage] = useState(null);
  const [imageMapFileSizeImage, setImageMapFileSizeImage] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [imageErrorSizeImage, setImageErrorSizeImage] = useState(false);
  const [imageErrorMapImage, setImageErrorMapImage] = useState(false);

  const goToUpgradeRidePricePage = (vehicle) => {
    navigate(
      `/dashboard/vehicle-upgrade-prices/${
        vehicle.vehicle_id
      }/${encodeURIComponent(vehicle.vehicle_name)}`
    );
  };

  const [selectedVehicle, setSelectedVehicle] = useState({
    vehicle_id: "",
    vehicle_name: "",
    weight: "",
    vehicle_type_id: "",
    description: "",
    image: "",
    size_image: "",
    minimum_waiting_time: "", // Default value
    penalty_charge: "", // Default value
    vehicle_map_image: "",
  });

  const [errorVehicle, setVehicleErrors] = useState({
    vehicle_name: false,
    weight: false,
    vehicle_type_id: false,
    description: false,
    image: false,
    size_image: false,
    minimum_waiting_time: false,
    penalty_charge: false,
    vehicle_map_image: false,
  });
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [btnLoading, setBtnLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch all vehicles and vehicle types
  const fetchVehicles = async () => {
    // Check if the user is online
    if (!navigator.onLine) {
      toast.error("No internet connection. Please check your connection.");
      setLoading(false);
      return; // Exit if no internet connection
    }

    const token = Cookies.get("authToken");

    try {
      const response = await axios.post(
        `${serverEndPoint}/all_vehicles`,
        {
          category_id: category_id,
        }, // Send an empty object as the body if needed
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update state with vehicle details
      setVehicles(response.data.vehicle_details);
    } catch (error) {
      handleError(error); // Handle errors using your existing error handling function
    } finally {
      setLoading(false); // Ensure loading state is reset
    }
  };

  const fetchVehicleTypes = async () => {
    // Check if the user is online
    if (!navigator.onLine) {
      toast.error("No internet connection. Please check your connection.");
      setLoading(false);
      return; // Exit if no internet connection
    }

    const token = Cookies.get("authToken");

    try {
      const response = await axios.post(
        `${serverEndPoint}/vehicle_types`,
        {}, // Send an empty object as the body if needed
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update state with vehicle type details
      setVehicleTypes(response.data.vehicle_type_details);
    } catch (error) {
      handleError(error); // Handle errors using your existing error handling function
    } finally {
      setLoading(false); // Ensure loading state is reset
    }
  };

  useEffect(() => {
    fetchVehicles();
    fetchVehicleTypes();
  }, []);

  // Handle error responses
  const handleError = (error) => {
    if (error.response) {
      if (error.response.status === 404) {
        toast.error("No Data Found.");
        setError("No Data Found");
      } else if (error.response.status === 409) {
        // Handle case where pincode already exists
        toast.error("Vehicle Name already exists.");
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
      setError("Network Error");
    }
    setLoading(false);
  };

  const handleOpenDialog = () => {
    setSelectedVehicle({
      vehicle_id: "",
      vehicle_name: "",
      weight: "",
      vehicle_type_id: "",
      description: "",
      image: "",
      size_image: "",
      minimum_waiting_time: "", // Default value
      penalty_charge: "", // Default value
      vehicle_map_image: "",
    });
    setIsEditMode(false);
    setOpenVehicleDialog(true);
  };

  const navigate = useNavigate();
  const goToAddPricePage = (vehicle) => {
    navigate(
      `/dashboard/vehicle-price/${vehicle.vehicle_id}/${encodeURIComponent(
        vehicle.vehicle_name
      )}`
    );
  };
  const goToAddPeakHourPricePage = (vehicle) => {
    navigate(
      `/dashboard/vehicle-peak-hours-price/${
        vehicle.vehicle_id
      }/${encodeURIComponent(vehicle.vehicle_name)}`
    );
  };

  const handleEditClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsEditMode(true);
    setOpenVehicleDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenVehicleDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Convert only the vehicle_name to uppercase, leave other fields as is
    const formattedValue =
      name === "vehicle_name" ? value.toUpperCase() : value;

    setSelectedVehicle((prevState) => ({
      ...prevState,
      [name]: formattedValue, // Dynamically update the selected field
    }));
  };

  const saveVehicleDetails = async () => {
    setBtnLoading(true);

    const newErrors = {
      vehicle_name: !selectedVehicle.vehicle_name,
      weight: !selectedVehicle.weight,
      vehicle_type_id: !selectedVehicle.vehicle_type_id,
      description: !selectedVehicle.description,
      image: !imageFile && !selectedVehicle.image,
      size_image: !imageFileSizeImage && !selectedVehicle.size_image,
      minimum_waiting_time: !selectedVehicle.minimum_waiting_time,
      penalty_charge: !selectedVehicle.penalty_charge,
      vehicle_map_image:
        !imageMapFileSizeImage && !selectedVehicle.vehicle_map_image,
    };
    setVehicleErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      setBtnLoading(false);
      return;
    }
    let vehicleImageUrl = selectedVehicle.image;
    let vehicleSizeImageUrl = selectedVehicle.size_image;
    let vehicleMapImageUrl = selectedVehicle.vehicle_map_image;

    //VEHICLE IMAGE UPLOAD
    try {
      if (imageFile) {
        console.log("imageFile::", imageFile);
        const formData = new FormData();
        formData.append("image", imageFile);
        // Log form data content
        for (const [key, value] of formData.entries()) {
          console.log(`${key}: ${value.name}`); // Will log 'vehicleImage: lal-mahal.jpg'
        }
        console.log(formData);
        const uploadResponse = await axios.post(
          `${serverEndPointImage}/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        vehicleImageUrl = uploadResponse.data.image_url;
      }
    } catch (error) {
      console.error("Error uploading Vehicle Image:", error);
      toast.error(
        "Error uploading Vehicle Image or file size too large then 2 Mb"
      );
      setBtnLoading(false);
      return;
    }

    //VEHICLE SIZE IMAGE UPLOAD
    try {
      if (imageFileSizeImage) {
        const formData2 = new FormData();
        formData2.append("image", imageFileSizeImage);

        const uploadResponse = await axios.post(
          `${serverEndPointImage}/upload`,
          formData2,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        vehicleSizeImageUrl = uploadResponse.data.image_url;
      }
    } catch (error) {
      console.error("Error uploading Vehicle Size Image:", error);
      toast.error(
        "Error uploading Vehicle Size Image or file size too large then 2 Mb"
      );
      setBtnLoading(false);
      return;
    }
    //VEHICLE MAP IMAGE UPLOAD
    try {
      if (imageMapFileSizeImage) {
        const formData2 = new FormData();
        formData2.append("image", imageMapFileSizeImage);

        const uploadResponse = await axios.post(
          `${serverEndPointImage}/upload`,
          formData2,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        vehicleMapImageUrl = uploadResponse.data.image_url;
      }
    } catch (error) {
      console.error("Error uploading Vehicle Size Image:", error);
      toast.error(
        "Error uploading Vehicle Size Image or file size too large then 2 Mb"
      );
      setBtnLoading(false);
      return;
    }

    const token = Cookies.get("authToken");
    const endpoint = isEditMode
      ? `${serverEndPoint}/edit_vehicle`
      : `${serverEndPoint}/add_vehicle`;

    try {
      const formData = new FormData();

      // Append vehicle details to formData
      for (const key in selectedVehicle) {
        formData.append(key, selectedVehicle[key]);
      }

      // Append image file if it exists
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await axios.post(
        endpoint,
        {
          category_id: category_id,
          vehicle_id: isEditMode ? selectedVehicle.vehicle_id : "0",
          vehicle_name: selectedVehicle.vehicle_name,
          weight: selectedVehicle.weight,
          vehicle_type_id: selectedVehicle.vehicle_type_id,
          description: selectedVehicle.description,
          image: vehicleImageUrl,
          size_image: vehicleSizeImageUrl,
          minimum_waiting_time: selectedVehicle.minimum_waiting_time,
          penalty_charge: selectedVehicle.penalty_charge,
          vehicle_map_image: vehicleMapImageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success(
          isEditMode
            ? "Vehicle updated successfully!"
            : "Vehicle added successfully!"
        );
        fetchVehicles();
        handleCloseDialog();
        setImageFile(null);
        setImageFileSizeImage(null);
      } else {
        toast.error("Failed to save vehicle.");
      }
    } catch (error) {
      handleError(error);
    } finally {
      setBtnLoading(false);
    }
  };

  // const saveVehicleDetails = async () => {
  //   setBtnLoading(true);
  //   const token = Cookies.get("authToken");
  //   const endpoint = isEditMode
  //     ? `${serverEndPoint}/edit_vehicle`
  //     : `${serverEndPoint}/add_vehicle`;

  //   try {
  //     const response = await axios.post(endpoint, selectedVehicle, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     if (response.status === 200) {
  //       toast.success(
  //         isEditMode
  //           ? "Vehicle updated successfully!"
  //           : "Vehicle added successfully!"
  //       );
  //       fetchVehicles();
  //       handleCloseDialog();
  //     } else {
  //       toast.error("Failed to save vehicle.");
  //     }
  //   } catch (error) {
  //     handleError(error);
  //   } finally {
  //     setBtnLoading(false);
  //   }
  // };

  const handleImageChangeVehicle = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validImageTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/svg+xml",
      ];

      if (!validImageTypes.includes(file.type)) {
        setImageError((prevErrors) => ({
          ...prevErrors,
          image: true,
        }));
        toast.warning(
          "Only .png, .jpeg, .jpg, and .svg file formats are allowed."
        );
        e.target.value = ""; // Clear the selected file input
        return; // Return early without setting the image file
      } else {
        setImageFile(file); // Set the valid image file
        console.log("Vehicle Image File:", file);
        setImageError((prevErrors) => ({
          ...prevErrors,
          image: false,
        }));
      }
    }
  };

  const handleChangeVehicleSizeImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validImageTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/svg+xml",
      ];

      if (!validImageTypes.includes(file.type)) {
        setImageErrorSizeImage((prevErrors) => ({
          ...prevErrors,
          image: true,
        }));
        toast.warning(
          "Only .png, .jpeg, .jpg, and .svg file formats are allowed."
        );
        e.target.value = ""; // Clear the selected file input
        return; // Return early without setting the image file
      } else {
        setImageFileSizeImage(file); // Set the valid image file
        setImageErrorSizeImage((prevErrors) => ({
          ...prevErrors,
          image: false,
        }));
      }
    }
  };
  const handleChangeVehicleMapImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validImageTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/svg+xml",
      ];

      if (!validImageTypes.includes(file.type)) {
        setImageErrorMapImage((prevErrors) => ({
          ...prevErrors,
          image: true,
        }));
        toast.warning(
          "Only .png, .jpeg, .jpg, and .svg file formats are allowed."
        );
        e.target.value = ""; // Clear the selected file input
        return; // Return early without setting the image file
      } else {
        setImageMapFileSizeImage(file); // Set the valid image file
        setImageErrorMapImage((prevErrors) => ({
          ...prevErrors,
          image: false,
        }));
      }
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <ToastContainer position="top-right" />
      <Container fluid>
        <Row className="m-1">
          <Col xs={12}>
            <h4 className="main-title">Service Settings</h4>
            <ul className="app-line-breadcrumbs mb-3">
              <li className="">
                <a href="#" className="f-s-14 f-w-500">
                  <span>
                    <i className="ph-duotone  ph-stack f-s-16"></i> For Service
                  </span>
                </a>
              </li>

              <li className="active mt-2">
                <a href="#" className="f-s-14 f-w-500">
                  {category_name}
                </a>
              </li>
            </ul>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Card className="shadow-lg border-0 rounded-lg">
              <CardBody>
                <ul
                  className="nav nav-tabs app-tabs-primary order-tabs d-flex justify-content-start border-0 mb-0 pb-0"
                  id="Outline"
                  role="tablist"
                >
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link d-flex align-items-center gap-1 ${
                        activeTab === "connect-tab" ? "active" : ""
                      }`}
                      id="connect-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#connect-tab-pane"
                      type="button"
                      role="tab"
                      aria-controls="connect-tab-pane"
                      aria-selected={activeTab === "connect-tab"}
                      onClick={() => handleTabClick("connect-tab")}
                    >
                      <i className="ti ti-sort-descending-2 f-s-18 mg-b-3"></i>{" "}
                      All Vehicles
                    </button>

                    <Button
                      variant="contained"
                      color="primary"
                      className="mt-3"
                      sx={{ mb: 2 }}
                      onClick={handleOpenDialog}
                    >
                      Add New Vehicle
                    </Button>
                  </li>
                </ul>
              </CardBody>

              <div className="card-body order-tab-content p-0">
                <div className="tab-content" id="OutlineContent">
                  <div
                    className={`tab-pane fade ${
                      activeTab === "connect-tab" ? "active show" : ""
                    }`}
                    id="connect-tab-pane"
                    role="tabpanel"
                    aria-labelledby="connect-tab"
                    tabIndex="0"
                  >
                    <div className="order-list-table table-responsive app-scroll">
                      {/* Search Input */}
                      {/* <div className="mb-3">
                        <input
                          type="text"
                          className="form-control m-4 align-middle"
                          placeholder="Search by Order ID, Customer, Driver, or Mobile"
                          value={searchQuery}
                          onChange={handleSearch}
                        />
                      </div> */}
                      <table className="table table-bottom-border align-middle mb-0">
                        <thead>
                          <tr>
                            <th>Sl No</th>
                            <th scope="col">Vehicle Name</th>
                            <th scope="col">Weight (kg)</th>
                            <th scope="col">Vehicle Type</th>
                            <th scope="col">Waiting Time</th>
                            <th scope="col">Penalty Charge</th>
                            <th scope="col">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {vehicles.map((vehicle, index) => (
                            <tr key={index}>
                              <td># {index}</td>

                              <td>
                                <div className="position-relative">
                                  <div className="h-40 w-40 d-flex-center b-r-15 overflow-hidden p-1 position-absolute">
                                    <img
                                      src={vehicle.image}
                                      alt={vehicle.vehicle_name}
                                      className="img-fluid"
                                    />
                                  </div>
                                  <div className="ms-5">
                                    <h6 className="mb-0 f-s-16">
                                      {vehicle.vehicle_name}
                                    </h6>
                                  </div>
                                </div>
                              </td>

                              <td>
                                <p className="mb-0 f-s-12 text-secondary">
                                  {vehicle.weight} kg
                                </p>
                              </td>
                              <td>
                                <p className="mb-0 f-s-12 text-secondary">
                                  {vehicle.vehicle_type_name}
                                </p>
                              </td>
                              <td>
                                <p className="mb-0 f-s-12 text-secondary">
                                  {vehicle.minimum_waiting_time} mins
                                </p>
                              </td>
                              <td>
                                <p className="mb-0 f-s-12 text-secondary">
                                  ₹{vehicle.penalty_charge}/min
                                </p>
                              </td>

                              <td>
                                <Tooltip title="Edit Vehicle Details" arrow>
                                  <IconButton
                                    onClick={() => handleEditClick(vehicle)}
                                  >
                                    <Icon color="primary">edit</Icon>
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Add Price" arrow>
                                  <IconButton
                                    onClick={() => goToAddPricePage(vehicle)}
                                  >
                                    <Icon color="gray">currency_rupee</Icon>
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Add Peak Hours Price" arrow>
                                  <IconButton
                                    onClick={() =>
                                      goToAddPeakHourPricePage(vehicle)
                                    }
                                  >
                                    <Icon color="gray">access_time</Icon>
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Add Upgrade Ride Prices" arrow>
                                  <IconButton
                                    onClick={() =>
                                      goToUpgradeRidePricePage(vehicle)
                                    }
                                  >
                                    <UpgradeIcon color="gray" />
                                  </IconButton>
                                </Tooltip>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {/* Pagination Controls */}
                      {/* <div className="pagination-controls d-flex justify-content-end align-items-center mt-3 p-4">
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </button>
                        <span className="mx-2">
                          Page {currentPage} of {totalPages}
                        </span>
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </button>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
        {/* Modal for Adding or Editing Vehicle */}
        <Dialog
          open={openVehicleDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <Box p={3}>
            <Typography variant="h6" gutterBottom>
              {isEditMode ? "Edit Vehicle" : "Add New Vehicle"}
            </Typography>
            {/* {isEditMode ? (
              <Box display="flex" alignItems="center" mb={2} width="100%">
                <img
                  src={selectedVehicle.size_image}
                  alt="Size"
                  style={{
                    width: "100%",
                    height: "auto",
                    maxHeight: "100px",
                    objectFit: "contain",
                    borderRadius: "26px",
                  }}
                />
                {selectedVehicle.image ? (
                  <img
                    src={selectedVehicle.image}
                    alt={selectedVehicle.vehicle_name}
                    style={{
                      width: "100%",
                      height: "auto",
                      maxHeight: "100px",
                      objectFit: "contain",
                      borderRadius: "26px",
                    }}
                  />
                ) : (
                  <Typography variant="body2">
                    No vehicle image selected
                  </Typography>
                )}
              </Box>
            ) : (
              <></>
            )} */}

            {isEditMode ? (
              <Box
                display="flex"
                alignItems="center"
                mb={2}
                width="100%"
                gap={2}
              >
                <img
                  src={selectedVehicle.size_image}
                  alt="Size"
                  style={{
                    width: "33%",
                    height: "auto",
                    maxHeight: "100px",
                    objectFit: "contain",
                    borderRadius: "8px",
                  }}
                />
                <img
                  src={selectedVehicle.image}
                  alt={selectedVehicle.vehicle_name}
                  style={{
                    width: "33%",
                    height: "auto",
                    maxHeight: "100px",
                    objectFit: "contain",
                    borderRadius: "8px",
                  }}
                />
                <img
                  src={selectedVehicle.vehicle_map_image}
                  alt="Map"
                  style={{
                    width: "33%",
                    height: "auto",
                    maxHeight: "100px",
                    objectFit: "contain",
                    borderRadius: "8px",
                  }}
                />
              </Box>
            ) : null}
            <TextField
              label="Vehicle Name"
              fullWidth
              margin="normal"
              name="vehicle_name"
              value={selectedVehicle.vehicle_name}
              onChange={handleInputChange}
              required
              error={errorVehicle.vehicle_name}
              helperText={
                errorVehicle.vehicle_name ? "Vehicle name is required." : ""
              }
            />
            <TextField
              label="Minimum Waiting Time (minutes)"
              fullWidth
              margin="normal"
              name="minimum_waiting_time"
              type="number"
              value={selectedVehicle.minimum_waiting_time}
              onChange={handleInputChange}
              InputProps={{
                inputProps: { min: 0 },
              }}
              error={errorVehicle.minimum_waiting_time}
              helperText={
                errorVehicle.minimum_waiting_time
                  ? "Minimum waiting time is required."
                  : ""
              }
            />
            <TextField
              label="Penalty Charge (per minute)"
              fullWidth
              margin="normal"
              name="penalty_charge"
              type="number"
              value={selectedVehicle.penalty_charge}
              onChange={handleInputChange}
              InputProps={{
                inputProps: { min: 0, step: "0.01" },
              }}
              error={errorVehicle.penalty_charge}
              helperText={
                errorVehicle.penalty_charge ? "Penalty charge is required." : ""
              }
            />
            <TextField
              label="Weight (kg)"
              fullWidth
              margin="normal"
              name="weight"
              type="number"
              value={selectedVehicle.weight}
              onChange={handleInputChange}
              required
              error={errorVehicle.weight}
              helperText={
                errorVehicle.weight ? "Vehicle Weight in Kgs is required." : ""
              }
            />
            <FormControl fullWidth margin="normal" variant="outlined">
              <InputLabel>Vehicle Type</InputLabel>
              <Select
                name="vehicle_type_id"
                value={selectedVehicle.vehicle_type_id}
                onChange={handleInputChange}
                required
                label="Vehicle Type"
                error={errorVehicle.vehicle_type_id}
              >
                {vehicleTypes.map((type) => (
                  <MenuItem
                    key={type.vehicle_type_id}
                    value={type.vehicle_type_id}
                  >
                    {type.vehicle_type_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Description"
              fullWidth
              margin="normal"
              name="description"
              value={selectedVehicle.description}
              onChange={handleInputChange}
              error={errorVehicle.description}
              helperText={
                errorVehicle.description
                  ? "Vehicle short description is required."
                  : ""
              }
            />
            <Typography variant="subtitle1">Vehicle Image</Typography>
            <TextField
              fullWidth
              margin="normal"
              type="file"
              onChange={handleImageChangeVehicle}
              required
              error={errorVehicle.image} // Set error state for image
              helperText={
                errorVehicle.image ? "Vehicle Image is required." : ""
              }
            />
            <Typography variant="subtitle1">
              Vehicle Size Guideline Image
            </Typography>
            <TextField
              fullWidth
              margin="normal"
              type="file"
              onChange={handleChangeVehicleSizeImage}
              required
              error={errorVehicle.size_image} // Set error state for image
              helperText={
                errorVehicle.size_image ? "Vehicle Size Image is required." : ""
              }
            />
            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Vehicle Map Image
            </Typography>
            <TextField
              fullWidth
              margin="normal"
              type="file"
              onChange={handleChangeVehicleMapImage}
              required
              error={errorVehicle.vehicle_map_image}
              helperText={
                errorVehicle.vehicle_map_image
                  ? "Vehicle Map Image is required."
                  : ""
              }
            />
            <Box mt={2} display="flex" justifyContent="flex-end">
              <Button onClick={handleCloseDialog} sx={{ marginRight: 1 }}>
                Cancel
              </Button>
              <LoadingButton
                type="submit"
                color="primary"
                loading={btnLoading}
                variant="contained"
                onClick={saveVehicleDetails}
              >
                {isEditMode ? "Update" : "Create"}
              </LoadingButton>
            </Box>
          </Box>
        </Dialog>
      </Container>
    </div>
  );
};

export default AddNewVehiclePage;
