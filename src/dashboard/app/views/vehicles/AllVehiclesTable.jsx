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
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";
import { styled } from "@mui/system";
import { serverEndPoint, serverEndPointImage } from "../../constants";
import { useNavigate, useParams } from "react-router-dom";

const StyledTable = styled(Table)(() => ({
  whiteSpace: "pre",
  "& thead": {
    "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } },
  },
  "& tbody": {
    "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } },
  },
}));

const AllVehiclesTable = () => {
  const { category_id, category_name } = useParams();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openVehicleDialog, setOpenVehicleDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileSizeImage, setImageFileSizeImage] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [imageErrorSizeImage, setImageErrorSizeImage] = useState(false);

  const [selectedVehicle, setSelectedVehicle] = useState({
    vehicle_id: "",
    vehicle_name: "",
    weight: "",
    vehicle_type_id: "",
    description: "",
    image: "",
    size_image: "",
  });

  const [errorVehicle, setVehicleErrors] = useState({
    vehicle_name: false,
    weight: false,
    vehicle_type_id: false,
    description: false,
    image: false,
    size_image: false,
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
    });
    setIsEditMode(false);
    setOpenVehicleDialog(true);
  };

  const navigate = useNavigate();
  const goToAddPricePage = (vehicle) => {
    navigate(
      `/vehicle-price/${vehicle.vehicle_id}/${encodeURIComponent(
        vehicle.vehicle_name
      )}`
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
    };
    setVehicleErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      setBtnLoading(false);
      return;
    }
    let vehicleImageUrl = selectedVehicle.image;
    let vehicleSizeImageUrl = selectedVehicle.size_image;

    //VEHICLE IMAGE UPLOAD
    try {
      if (imageFile) {
        console.log("imageFile::", imageFile);
        const formData = new FormData();
        formData.append("vtPartnerImage", imageFile);
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

        vehicleImageUrl = uploadResponse.data.imageUrl;
      }
    } catch (error) {
      console.error("Error uploading Vehicle Image:", error);
      toast.error("Error uploading Vehicle Image");
      setBtnLoading(false);
      return;
    }

    //VEHICLE SIZE IMAGE UPLOAD
    try {
      if (imageFileSizeImage) {
        const formData2 = new FormData();
        formData2.append("vtPartnerImage", imageFileSizeImage);

        const uploadResponse = await axios.post(
          `${serverEndPointImage}/upload`,
          formData2,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        vehicleSizeImageUrl = uploadResponse.data.imageUrl;
      }
    } catch (error) {
      console.error("Error uploading Vehicle Size Image:", error);
      toast.error("Error uploading Vehicle Size Image");
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
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
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
          Add New Vehicle
        </Button>

        <StyledTable>
          <TableHead>
            <TableRow>
              <TableCell align="left">Vehicle Name</TableCell>
              <TableCell align="left">Weight (kg)</TableCell>
              <TableCell align="left">Vehicle Type</TableCell>
              <TableCell align="left">Description</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vehicles
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((vehicle) => (
                <TableRow key={vehicle.vehicle_id}>
                  <TableCell align="left">
                    <Box display="flex" alignItems="center">
                      <Avatar
                        src={`${vehicle.image}`}
                        alt={vehicle.vehicle_name}
                        sx={{ width: 40, height: 40, marginRight: 1 }}
                      />
                      {vehicle.vehicle_name}
                    </Box>
                  </TableCell>

                  <TableCell align="left">{vehicle.weight} kg</TableCell>
                  <TableCell align="left">
                    {vehicle.vehicle_type_name}
                  </TableCell>
                  <TableCell align="left">{vehicle.description}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit Vehicle Details" arrow>
                      <IconButton onClick={() => handleEditClick(vehicle)}>
                        <Icon color="primary">edit</Icon>
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Add Price" arrow>
                      <IconButton onClick={() => goToAddPricePage(vehicle)}>
                        <Icon color="gray">arrow_forward</Icon>
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
          count={vehicles.length}
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
        open={openVehicleDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <Box p={3}>
          <Typography variant="h6" gutterBottom>
            {isEditMode ? "Edit Vehicle" : "Add New Vehicle"}
          </Typography>

          {isEditMode ? (
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
          )}

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
            helperText={errorVehicle.image ? "Vehicle Image is required." : ""}
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
    </>
  );
};

export default AllVehiclesTable;
