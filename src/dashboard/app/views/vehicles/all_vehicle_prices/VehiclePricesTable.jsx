/* eslint-disable no-unused-vars */
// import React from "react";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";
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
import { serverEndPoint } from "../../../constants";
import { format } from "date-fns";
import { LoadingButton } from "@mui/lab";
const StyledTable = styled(Table)(() => ({
  whiteSpace: "pre",
  "& thead": {
    "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } },
  },
  "& tbody": {
    "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } },
  },
}));

const VehiclePricesTable = () => {
  const { vehicle_id, vehicle_name } = useParams();
  const [vehiclePrices, setVehiclePrices] = useState([]);
  const [loading, setLoading] = useState(true);
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
  });

  const [openVehiclePriceDialog, setOpenVehiclePriceDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [errorVehicle, setVehicleErrors] = useState({
    price_id: false,
    city_id: false,
    vehicle_id: false,
    starting_price_per_km: false,
    minimum_time: false,
    price_type_id: false,
    city_name: false,
    price_type: false, //Local or Outstation
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
    });
    setIsEditMode(false);
    setOpenVehiclePriceDialog(true);
  };

  const handleEditClick = (vehicle) => {
    setSelectedPrice(vehicle);
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

  const saveVehiclePriceDetails = async () => {
    setBtnLoading(true);

    const newErrors = {
      starting_price_per_km: !selectedPrice.starting_price_per_km,
      city_id: !selectedPrice.city_id,
      price_type_id: !selectedPrice.price_type_id,
      minimum_time: !selectedPrice.minimum_time,
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

      const response = await axios.post(
        endpoint,
        {
          price_id: isEditMode ? selectedPrice.price_id : "0",
          city_id: selectedPrice.city_id,
          vehicle_id: vehicle_id,
          starting_price_km: selectedPrice.starting_price_per_km,
          minimum_time: selectedPrice.minimum_time,
          price_type_id: selectedPrice.price_type_id,
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
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenDialog}
          >
            Add Price
          </Button>

          {isSearchOpen ? (
            <TextField
              size="small"
              label="Search by City Name"
              variant="outlined"
              margin="normal"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                width: "200px", // Adjust width to make it smaller
                transition: "width 0.3s", // Smooth transition when textfield appears
              }}
              InputProps={{
                startAdornment: (
                  <Icon
                    position="start"
                    sx={{ cursor: "pointer" }}
                    onClick={() => setIsSearchOpen(false)}
                  >
                    search
                  </Icon>
                ),
              }}
            />
          ) : (
            <IconButton sx={{ mb: 2 }} onClick={() => setIsSearchOpen(true)}>
              <Icon>search</Icon>
            </IconButton>
          )}
        </Box>

        <StyledTable>
          <TableHead>
            <TableRow>
              <TableCell align="left">City Name</TableCell>
              <TableCell align="left">Price</TableCell>
              <TableCell align="left">Price Type</TableCell>
              <TableCell align="left">Last Updated</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredVehiclePrices
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((vehicle) => (
                <TableRow key={vehicle.price_id}>
                  <TableCell align="left">
                    <Box display="flex" alignItems="center">
                      <Avatar
                        src={`${vehicle.bg_image}`}
                        alt={vehicle.city_name}
                        sx={{ width: 40, height: 40, marginRight: 1 }}
                      />
                      {vehicle.city_name}
                    </Box>
                  </TableCell>

                  <TableCell align="left">
                    ₹ {vehicle.starting_price_per_km}/-
                  </TableCell>
                  <TableCell align="left">{vehicle.price_type}</TableCell>
                  <TableCell align="left">
                    {format(
                      new Date(vehicle.time_created_at * 1000),
                      "dd/MM/yyyy, hh:mm:ss a"
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit Price Details" arrow>
                      <IconButton onClick={() => handleEditClick(vehicle)}>
                        <Icon color="primary">edit</Icon>
                      </IconButton>
                    </Tooltip>
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
          count={vehiclePrices.length}
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
        open={openVehiclePriceDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <Box p={3}>
          <Typography variant="h6" gutterBottom>
            {isEditMode ? "Edit Vehicle" : "Add New Price For " + vehicle_name}
          </Typography>

          <FormControl fullWidth margin="normal" variant="outlined">
            <Autocomplete
              options={cities} // The array of city options
              getOptionLabel={(option) => option.city_name} // The label for each option
              value={
                cities.find((city) => city.city_id === selectedPrice.city_id) ||
                null
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
                  (price) => price.price_type_id === selectedPrice.price_type_id
                ) || null
              } // Find the currently selected city
              onChange={(event, newValue) => {
                handleInputChange({
                  target: {
                    name: "price_type_id", // Update the name based on the input
                    value: newValue ? newValue.price_type_id : "", // Get the price_type_id of the selected Price
                  },
                });
              }}
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
    </>
  );
};

export default VehiclePricesTable;
