/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";

import { Card, CardBody, Col, Container, Row } from "reactstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Cookies from "js-cookie";
import {
  formatEpoch,
  serverEndPoint,
} from "../../../../dashboard/app/constants";
import Loader from "../../../Components/Loader";

import { toast } from "react-toastify";
import { styled } from "@mui/system";
import { useParams } from "react-router-dom";
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
  Autocomplete,
} from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format } from "date-fns";
import { LoadingButton } from "@mui/lab";

const AddVehiclePricesPage = () => {
  const [activeTab, setActiveTab] = useState("connect-tab");
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const [loading, setLoading] = useState(true);
  const { vehicle_id, vehicle_name } = useParams();
  const [vehiclePrices, setVehiclePrices] = useState([]);
  const [error, setError] = useState(null);
  const [btnLoading, setBtnLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [cities, setAllCities] = useState([]);
  const [priceTypes, setPriceTypes] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState({
    price_id: "",
    city_id: "",
    vehicle_id: "",
    starting_price_per_km: "",
    minimum_time: "",
    price_type_id: "",
    city_name: "",
    price_type: "", //Local or Outstation
    outstation_distance: "", // Added outstation distance field
  });

  const [openVehiclePriceDialog, setOpenVehiclePriceDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLocalPriceType, setIsLocalPriceType] = useState(false);

  const [errorVehicle, setVehicleErrors] = useState({
    price_id: false,
    city_id: false,
    vehicle_id: false,
    starting_price_per_km: false,
    minimum_time: false,
    price_type_id: false,
    city_name: false,
    price_type: false, //Local or Outstation
    outstation_distance: false, // Added outstation distance validation
  });

  // Fetch all vehiclePrices and vehicle types
  const fetchVehiclePrices = async () => {
    // Check if the user is online
    if (!navigator.onLine) {
      toast.error("No internet connection. Please check your connection.");
      setLoading(false);
      return; // Exit if no internet connection
    }

    const token = Cookies.get("authToken");

    try {
      const response = await axios.post(
        `${serverEndPoint}/vehicle_prices`,
        { vehicle_id: vehicle_id }, // Send an empty object as the body if needed
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update state with vehicle details
      setVehiclePrices(response.data.vehicle_price_details);
    } catch (error) {
      handleError(error); // Handle errors using your existing error handling function
    } finally {
      setLoading(false); // Ensure loading state is reset
    }
  };

  const fetchAllCities = async () => {
    // Check if the user is online
    if (!navigator.onLine) {
      toast.error("No internet connection. Please check your connection.");
      setLoading(false);
      return; // Exit if no internet connection
    }

    const token = Cookies.get("authToken");

    try {
      const response = await axios.post(
        `${serverEndPoint}/all_allowed_cities`,
        {}, // Send an empty object as the body if needed
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update state with cities details
      setAllCities(response.data.cities);
    } catch (error) {
      handleError(error); // Handle errors using your existing error handling function
    } finally {
      setLoading(false); // Ensure loading state is reset
    }
  };

  const fetchPriceTypes = async () => {
    // Check if the user is online
    if (!navigator.onLine) {
      toast.error("No internet connection. Please check your connection.");
      setLoading(false);
      return; // Exit if no internet connection
    }

    const token = Cookies.get("authToken");

    try {
      const response = await axios.post(
        `${serverEndPoint}/vehicle_price_types`,
        {}, // Send an empty object as the body if needed
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update state with cities details
      setPriceTypes(response.data.vehicle_price_types);
    } catch (error) {
      handleError(error); // Handle errors using your existing error handling function
    } finally {
      setLoading(false); // Ensure loading state is reset
    }
  };

  useEffect(() => {
    fetchVehiclePrices();
    fetchAllCities();
    fetchPriceTypes();
  }, []);

  // Handle error responses
  const handleError = (error) => {
    if (error.response) {
      if (error.response.status === 404) {
        toast.error("No Data Found.");
        setError("No Data Found");
      } else if (error.response.status === 409) {
        // Handle case where pincode already exists
        toast.error("This City price has already been added to this vehicle.");
      } else if (error.response.status === 500) {
        toast.error("Internal server error. Please try again later.");
        setError("Internal Server Error");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
        setError("Unexpected Error");
      }
    } else {
      toast.error(
        "Failed to fetch all price details. Please check your connection."
      );
      setError("Network Error");
    }
    setLoading(false);
  };

  const handleOpenDialog = () => {
    setSelectedPrice({
      price_id: "",
      city_id: "",
      vehicle_id: "",
      starting_price_per_km: "",
      minimum_time: "",
      price_type_id: "",
      city_name: "",
      price_type: "", //Local or Outstation
      outstation_distance: "", // Reset outstation distance
    });
    setIsLocalPriceType(false);
    setIsEditMode(false);
    setOpenVehiclePriceDialog(true);
  };

  const handleEditClick = (vehicle) => {
    setSelectedPrice(vehicle);
    // Check if the price type is "Local"
    const selectedPriceType = priceTypes.find(
      (pt) => pt.price_type_id === vehicle.price_type_id
    );
    setIsLocalPriceType(
      selectedPriceType && selectedPriceType.price_type === "Local"
    );
    setIsEditMode(true);
    setOpenVehiclePriceDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenVehiclePriceDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedPrice((prevState) => ({
      ...prevState,
      [name]: value, // Dynamically update the selected field
    }));
  };

  const handlePriceTypeChange = (event, newValue) => {
    // Check if the price type is "Local"
    const isLocal = newValue && newValue.price_type === "Local";
    setIsLocalPriceType(isLocal);

    handleInputChange({
      target: {
        name: "price_type_id",
        value: newValue ? newValue.price_type_id : "",
      },
    });

    // If not local, clear the outstation distance
    if (!isLocal) {
      handleInputChange({
        target: {
          name: "outstation_distance",
          value: "",
        },
      });
    }
  };

  const saveVehiclePriceDetails = async () => {
    setBtnLoading(true);

    const newErrors = {
      starting_price_per_km: !selectedPrice.starting_price_per_km,
      city_id: !selectedPrice.city_id,
      price_type_id: !selectedPrice.price_type_id,
      minimum_time: !selectedPrice.minimum_time,
      outstation_distance:
        isLocalPriceType && !selectedPrice.outstation_distance,
    };
    setVehicleErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      setBtnLoading(false);
      return;
    }

    const token = Cookies.get("authToken");
    const endpoint = isEditMode
      ? `${serverEndPoint}/edit_vehicle_price`
      : `${serverEndPoint}/add_vehicle_price`;

    try {
      const formData = new FormData();

      // Append vehicle details to formData
      for (const key in selectedPrice) {
        formData.append(key, selectedPrice[key]);
      }

      const requestData = {
        price_id: isEditMode ? selectedPrice.price_id : "0",
        city_id: selectedPrice.city_id,
        vehicle_id: vehicle_id,
        starting_price_km: selectedPrice.starting_price_per_km,
        minimum_time: selectedPrice.minimum_time,
        price_type_id: selectedPrice.price_type_id,
      };

      // Add outstation_distance only if the price type is Local
      if (isLocalPriceType) {
        requestData.outstation_distance = selectedPrice.outstation_distance;
      }

      const response = await axios.post(endpoint, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        toast.success(
          isEditMode
            ? "Vehicle Price updated successfully!"
            : "Vehicle Price added successfully!"
        );
        fetchVehiclePrices();
        handleCloseDialog();
      } else {
        toast.error("Failed to save vehicle price.");
      }
    } catch (error) {
      handleError(error);
    } finally {
      setBtnLoading(false);
    }
  };

  const [searchTerm, setSearchTerm] = useState(""); // Search term state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const filteredVehiclePrices = vehiclePrices.filter((vehicle) =>
    vehicle.city_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                    <i className="ph-duotone  ph-stack f-s-16"></i> For Vehicle
                  </span>
                </a>
              </li>

              <li className="active mt-2">
                <a href="#" className="f-s-14 f-w-500">
                  {vehicle_name}
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
                      onClick={handleOpenDialog}
                    >
                      Add Price
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
                      <table className="table table-bottom-border align-middle mb-0">
                        <thead>
                          <tr>
                            <th>Sl No</th>
                            <th scope="col">City Name</th>
                            <th scope="col">Price</th>
                            <th scope="col">Price Type</th>
                            {/* Add outstation distance column */}
                            <th scope="col">Outstation Distance (km)</th>
                            <th scope="col">Last Updated</th>
                            <th scope="col">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredVehiclePrices.map((vehicle, index) => (
                            <tr key={index}>
                              <td># {index + 1}</td>

                              <td>
                                <div className="position-relative">
                                  <div className="h-40 w-40 d-flex-center b-r-15 overflow-hidden p-1 position-absolute">
                                    <img
                                      src={vehicle.bg_image}
                                      alt={vehicle.city_name}
                                      className="img-fluid"
                                      onError={(e) => {
                                        e.target.src =
                                          "https://via.placeholder.com/40";
                                      }}
                                    />
                                  </div>
                                  <div className="ms-5">
                                    <h6 className="mb-0 f-s-16">
                                      {vehicle.city_name}
                                    </h6>
                                  </div>
                                </div>
                              </td>

                              <td>
                                <p className="mb-0 f-s-12 text-secondary">
                                  ₹ {vehicle.starting_price_per_km}/-
                                </p>
                              </td>
                              <td>
                                <p className="mb-0 f-s-12 text-secondary">
                                  {vehicle.price_type}
                                </p>
                              </td>
                              {/* Display outstation distance */}
                              <td>
                                <p className="mb-0 f-s-12 text-secondary">
                                  {vehicle.price_type === "Local"
                                    ? vehicle.outstation_distance || "Not Set"
                                    : "N/A"}
                                </p>
                              </td>
                              <td>
                                <p className="mb-0 f-s-12 text-secondary">
                                  {format(
                                    new Date(vehicle.time_created_at * 1000),
                                    "dd/MM/yyyy, hh:mm:ss a"
                                  )}
                                </p>
                              </td>
                              <td>
                                <Tooltip title="Edit Price Details" arrow>
                                  <IconButton
                                    onClick={() => handleEditClick(vehicle)}
                                  >
                                    <Icon color="primary">edit</Icon>
                                  </IconButton>
                                </Tooltip>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
        {/* Modal for Adding or Editing Vehicle */}
        <Dialog
          open={openVehiclePriceDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <Box p={3}>
            <Typography variant="h6" gutterBottom>
              {isEditMode
                ? "Edit Vehicle Price"
                : "Add New Price For " + vehicle_name}
            </Typography>

            <FormControl fullWidth margin="normal" variant="outlined">
              <Autocomplete
                options={cities} // The array of city options
                getOptionLabel={(option) => option.city_name} // The label for each option
                value={
                  cities.find(
                    (city) => city.city_id === selectedPrice.city_id
                  ) || null
                } // Find the currently selected city
                onChange={(event, newValue) => {
                  handleInputChange({
                    target: {
                      name: "city_id", // Update the name based on the input
                      value: newValue ? newValue.city_id : "", // Get the city_id of the selected city
                    },
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="City"
                    variant="outlined"
                    error={errorVehicle.city_id} // Handle error state
                    helperText={
                      errorVehicle.city_id ? "Please select the city." : ""
                    }
                    required
                  />
                )}
              />
            </FormControl>

            <TextField
              label="Price Per Km"
              fullWidth
              margin="normal"
              name="starting_price_per_km"
              type="number"
              value={selectedPrice.starting_price_per_km}
              onChange={handleInputChange}
              error={errorVehicle.starting_price_per_km}
              helperText={
                errorVehicle.starting_price_per_km
                  ? "Please Provide Price Per Km."
                  : ""
              }
              inputProps={{
                step: "0.01", // Allows for double precision values
              }}
            />

            <FormControl fullWidth margin="normal" variant="outlined">
              <Autocomplete
                options={priceTypes} // The array of city options
                getOptionLabel={(option) => option.price_type} // The label for each option
                value={
                  priceTypes.find(
                    (price) =>
                      price.price_type_id === selectedPrice.price_type_id
                  ) || null
                } // Find the currently selected city
                onChange={handlePriceTypeChange} // Use the new handler to check if type is Local
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Price Type"
                    variant="outlined"
                    error={errorVehicle.price_type_id} // Handle error state
                    helperText={
                      errorVehicle.price_type_id
                        ? "Please select the Price Type."
                        : ""
                    }
                    required
                  />
                )}
              />
            </FormControl>

            {/* Show outstation distance field only if price type is "Local" */}
            {isLocalPriceType && (
              <TextField
                label="Outstation Distance (km)"
                fullWidth
                margin="normal"
                name="outstation_distance"
                type="number"
                value={selectedPrice.outstation_distance}
                onChange={handleInputChange}
                error={errorVehicle.outstation_distance}
                helperText={
                  errorVehicle.outstation_distance
                    ? "Outstation distance is required for Local price type."
                    : ""
                }
                required
              />
            )}

            <TextField
              label="Minimum Time In Minutes [Ex: 15]"
              fullWidth
              margin="normal"
              name="minimum_time"
              type="number"
              value={selectedPrice.minimum_time}
              onChange={handleInputChange}
              error={errorVehicle.minimum_time}
              helperText={
                errorVehicle.minimum_time
                  ? "Minimum Time in Minutes is required."
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
                onClick={saveVehiclePriceDetails}
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

export default AddVehiclePricesPage;
