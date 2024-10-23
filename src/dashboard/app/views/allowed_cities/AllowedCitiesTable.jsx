/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { format } from "date-fns";
import { serverEndPoint, serverEndPointImage } from "../../constants";
import {
  Box,
  Icon,
  Table,
  Avatar,
  Dialog,
  Button,
  TextField,
  styled,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  IconButton,
  TablePagination,
  CircularProgress,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import axios from "axios";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// STYLED COMPONENT
const StyledTable = styled(Table)(() => ({
  whiteSpace: "pre",
  "& thead": {
    "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } },
  },
  "& tbody": {
    "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } },
  },
}));

const AllowedCitiesTable = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errorNewCity, setAddNewCityErrors] = useState({
    city_name: false,
    pincode: false,
    pincode_until: false,
    description: false,
    bg_image: false,
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [editedCity, setEditedCity] = useState({
    city_name: "",
    pincode: "",
    pincode_until: "",
    description: "",
    bg_image: "", // To store the image URL
    status: "",
  });
  const [isAddingNewCity, setIsAddingNewCity] = useState(false); // For differentiating between add/edit mode
  const [openNewCityDialog, setOpenNewCityDialog] = useState(false); // For controlling the Add City dialog

  const [imageFile, setImageFile] = useState(null); // For the selected image
  const [errors, setErrors] = useState({
    city_name: false,
    pincode: false,
    pincode_until: false,
    description: false,
  });
  const cityNameRegex = /^[a-zA-Z\s]+$/; // Only letters and spaces
  const pincodeRegex = /^[0-9]+$/; // Only numbers
  const descriptionRegex = /^[a-zA-Z0-9\s,.'-]+$/; // Letters, numbers, and common punctuation
  const [currentPage, setCurrentPage] = useState(1);

  const handleAddCity = () => {
    setEditedCity({
      city_name: "",
      pincode: "",
      pincode_until: "",
      description: "",
      bg_image: "", // Empty initial values
    });
    setImageFile(null); // Reset image
    setIsAddingNewCity(true); // Set add mode
    setOpenNewCityDialog(true); // Open add city dialog
  };

  const handleNewCity = async () => {
    setBtnLoading(true);
    const newErrors = {
      city_name: !cityNameRegex.test(editedCity.city_name),
      pincode: !pincodeRegex.test(editedCity.pincode),
      pincode_until: !pincodeRegex.test(editedCity.pincode_until),
      description: !descriptionRegex.test(editedCity.description),
      bg_image: !imageFile && !editedCity.bg_image,
    };

    setAddNewCityErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      setBtnLoading(false);
      return;
    }

    try {
      let imageUrl = editedCity.bg_image;

      if (imageFile) {
        const formData = new FormData();
        formData.append("vtPartnerImage", imageFile);

        const uploadResponse = await axios.post(
          `${serverEndPointImage}/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        imageUrl = uploadResponse.data.imageUrl;
      }

      const token = Cookies.get("authToken");
      const endPoint = serverEndPoint + "/add_new_allowed_city";

      const response = await axios.post(
        endPoint,
        {
          city_name: editedCity.city_name,
          pincode: editedCity.pincode,
          pincode_until: editedCity.pincode_until,
          description: editedCity.description,
          bg_image: imageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setError(null);
        toast.success(`${editedCity.city_name} City Added Successfully`);

        // Reload cities while maintaining pagination
        fetchCities(currentPage); // Fetch cities again with the current page
      } else {
        toast.error("Failed to add the city");
      }

      setOpenNewCityDialog(false);
    } catch (error) {
      console.error("Error saving city:", error);
      toast.error("Error saving city");
    } finally {
      setBtnLoading(false);
    }
  };

  const fetchCities = async (page = 1) => {
    if (!navigator.onLine) {
      toast.error("No internet connection. Please check your connection.");
      setLoading(false);
      return;
    }

    try {
      const token = Cookies.get("authToken");
      const city_id = Cookies.get("city_id");
      const endPoint = `${serverEndPoint}/all_allowed_cities`;

      const response = await axios.post(
        endPoint,
        { city_id, page },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCities(response.data.cities);
      setCurrentPage(page); // Update the current page
    } catch (error) {
      setLoading(false);
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  // Handle error responses
  const handleError = (error) => {
    if (error.response) {
      if (error.response.status === 404) {
        toast.error("No Data Found.");
        setError("No Data Found");
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
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const showEditDialog = (city) => {
    Cookies.set("city_id", city.city_id);
    setSelectedCity(city);
    setEditedCity({
      city_name: city.city_name,
      pincode: city.pincode,
      pincode_until: city.pincode_until,
      description: city.description || "",
      bg_image: city.bg_image || "", // Set the initial image URL
      status: city.status || "",
    });
    setOpenDialog(true);
  };

  const navigate = useNavigate();
  const goToAddPincodes = (city) => {
    navigate(`/all-allowed-pincodes/${city.city_id}/${city.city_name}`, {
      state: { cities, currentPage }, // Pass cities and current page state
    });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setOpenNewCityDialog(false);
    // Reset error states when closing the dialog
    setErrors({
      city_name: false,
      pincode: false,
      pincode_until: false,
      description: false,
    });
  };

  const handleSaveCity = async () => {
    setBtnLoading(true);
    const newErrors = {
      city_name: !cityNameRegex.test(editedCity.city_name), // Invalid if not matching regex
      pincode: !pincodeRegex.test(editedCity.pincode), // Invalid if not numbers only
      pincode_until: !pincodeRegex.test(editedCity.pincode_until), // Invalid if not numbers only
      description: !descriptionRegex.test(editedCity.description), // Validate description content
      bg_image: !imageFile && !editedCity.bg_image, // Validate if image is selected
      status: !editedCity.status && editedCity.status !== 0,
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      setBtnLoading(false);
      return; // Exit if any field is invalid
    }

    try {
      let imageUrl = editedCity.bg_image; // Default to the existing image URL

      if (imageFile) {
        // Only upload the new image if one is selected
        const formData = new FormData();
        formData.append("cityImage", imageFile);

        const uploadResponse = await axios.post(
          `${serverEndPointImage}/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        imageUrl = uploadResponse.data.imageUrl; // Get the uploaded image URL
        console.log("imageUrl::", imageUrl);
      }

      const token = Cookies.get("authToken");

      // API call to update the city details
      const endPoint = serverEndPoint + "/update_allowed_city";
      const response = await axios.post(
        endPoint,
        {
          city_id: selectedCity.city_id,
          city_name: editedCity.city_name,
          pincode: editedCity.pincode,
          pincode_until: editedCity.pincode_until,
          description: editedCity.description,
          bg_image: imageUrl, // Use the uploaded or existing image URL
          status: editedCity.status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Update city in the table
        // Reload cities while maintaining pagination
        fetchCities(currentPage); // Fetch cities again with the current page
        setOpenDialog(false);
        setBtnLoading(false);
        toast.success(
          editedCity.city_name + " City Details Updated Successfully"
        );
        setImageFile(null);
      } else {
        console.error("Failed to update the city");
        toast.error("Failed to update the city");
        setBtnLoading(false);
      }
    } catch (error) {
      console.error("Error updating city:", error);
      toast.error("Error updating city");
      setBtnLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedCity((prevCity) => ({
      ...prevCity,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validImageTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/svg+xml",
      ];

      if (!validImageTypes.includes(file.type)) {
        setAddNewCityErrors((prevErrors) => ({
          ...prevErrors,
          bg_image: true,
        }));
        toast.warning(
          "Only .png, .jpeg, .jpg, and .svg file formats are allowed."
        );
        e.target.value = ""; // Clear the selected file input
        return; // Return early without setting the image file
      } else {
        setImageFile(file); // Set the valid image file
        setAddNewCityErrors((prevErrors) => ({
          ...prevErrors,
          bg_image: false,
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
    <Box width="100%" overflow="auto">
      {/* Add City Button */}
      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 2 }}
        onClick={handleAddCity}
      >
        Add New City
      </Button>
      <StyledTable>
        <TableHead>
          <TableRow>
            <TableCell align="left">City Name</TableCell>
            <TableCell align="left">Pincode</TableCell>
            <TableCell align="left">Last Updated</TableCell>
            <TableCell align="left">Status</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cities
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((city, index) => (
              <TableRow key={index}>
                <TableCell align="left">
                  <Box display="flex" alignItems="center">
                    <Avatar
                      src={`${city.bg_image}`}
                      alt={city.city_name}
                      sx={{ width: 40, height: 40, marginRight: 1 }}
                    />
                    {city.city_name}
                  </Box>
                </TableCell>
                <TableCell align="left">
                  {city.pincode}-{city.pincode_until}
                </TableCell>
                <TableCell align="left">
                  {format(new Date(city.time * 1000), "dd/MM/yyyy, hh:mm:ss a")}
                </TableCell>
                <TableCell
                  align="left"
                  color={city.status == 0 ? "red" : "black"}
                >
                  {city.status == 0 ? "Not Active" : "Active"}
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => showEditDialog(city)}>
                    <Icon color="primary">edit</Icon>
                  </IconButton>
                  {city.status !== 0 ? ( // Check if the city is active
                    <IconButton onClick={() => goToAddPincodes(city)}>
                      <Icon>arrow_forward</Icon>
                    </IconButton>
                  ) : null}{" "}
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
        count={cities.length}
        onPageChange={handleChangePage}
        rowsPerPageOptions={[5, 10, 25]}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Modal for Editing City */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <Box p={3}>
          <Typography variant="h6" gutterBottom>
            Edit City
          </Typography>
          {selectedCity && (
            <>
              {/* Display the currently selected image */}
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                mb={2}
                width="100%"
              >
                {editedCity.bg_image ? (
                  <img
                    src={editedCity.bg_image}
                    alt={editedCity.city_name}
                    style={{
                      width: "100%",
                      height: "auto",
                      maxHeight: "100px",
                      objectFit: "contain",
                      borderRadius: "12px",
                    }}
                  />
                ) : (
                  <Typography variant="body2">No image selected</Typography>
                )}
              </Box>

              <TextField
                label="City Name"
                fullWidth
                margin="normal"
                name="city_name"
                value={editedCity.city_name}
                onChange={handleInputChange}
                required // Make this field mandatory
                error={errors.city_name} // Set error state
                helperText={errors.city_name ? "City name is required." : ""}
              />
              <TextField
                label="Pincode"
                fullWidth
                margin="normal"
                name="pincode"
                value={editedCity.pincode}
                onChange={handleInputChange}
                required // Make this field mandatory
                error={errors.pincode} // Set error state
                helperText={errors.pincode ? "Pincode is required." : ""}
              />
              <TextField
                label="Pincode Until"
                fullWidth
                margin="normal"
                name="pincode_until"
                value={editedCity.pincode_until}
                onChange={handleInputChange}
                required // Make this field mandatory
                error={errors.pincode_until} // Set error state
                helperText={
                  errors.pincode_until ? "Pincode until is required." : ""
                }
              />
              <TextField
                label="Description"
                fullWidth
                margin="normal"
                multiline
                rows={3}
                name="description"
                value={editedCity.description}
                onChange={handleInputChange}
                required // Make this field mandatory
                error={errors.description} // Set error state
                helperText={
                  errors.description ? "Description is required." : ""
                }
              />

              {/*  Status dropdown */}
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  name="status"
                  value={editedCity.status}
                  onChange={handleInputChange}
                  required // Make this field mandatory
                  error={errors.status} // Set error state if needed
                >
                  <MenuItem value={1}>Active</MenuItem>
                  <MenuItem value={0}>Not Active</MenuItem>
                </Select>
              </FormControl>

              {/* Image Upload */}
              <TextField
                fullWidth
                margin="normal"
                type="file"
                onChange={handleImageChange}
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
                  sx={{ my: 2 }}
                  onClick={handleSaveCity}
                >
                  Save
                </LoadingButton>
              </Box>
            </>
          )}
        </Box>
      </Dialog>

      {/* Modal to add new City  */}
      <Dialog
        open={openNewCityDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <Box p={3}>
          <Typography variant="h6" gutterBottom>
            {isAddingNewCity ? "Add New City" : "Edit City"}
          </Typography>
          {/* Form fields same as edit form */}
          <TextField
            label="City Name"
            fullWidth
            margin="normal"
            name="city_name"
            value={editedCity.city_name}
            onChange={handleInputChange}
            required
            error={errorNewCity.city_name}
            helperText={errorNewCity.city_name ? "City name is required." : ""}
          />
          <TextField
            label="Pincode Start"
            fullWidth
            type="tel"
            margin="normal"
            name="pincode"
            value={editedCity.pincode}
            onChange={handleInputChange}
            required
            error={errorNewCity.pincode}
            helperText={
              errorNewCity.pincode ? "Pincode Start is required." : ""
            }
          />
          <TextField
            label="Pincode Until"
            fullWidth
            type="tel"
            margin="normal"
            name="pincode_until"
            value={editedCity.pincode_until}
            onChange={handleInputChange}
            required
            error={errorNewCity.pincode_until}
            helperText={
              errorNewCity.pincode_until ? "Pincode until is required." : ""
            }
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            name="description"
            value={editedCity.description}
            onChange={handleInputChange}
            required
            error={errorNewCity.description}
            helperText={
              errorNewCity.description ? "Description is required." : ""
            }
          />

          {/* Image Upload */}
          <TextField
            fullWidth
            margin="normal"
            type="file"
            onChange={handleImageChange}
            error={errorNewCity.bg_image} // Set error state for image
            helperText={errorNewCity.bg_image ? "Image is required." : ""}
            inputProps={{ accept: ".png, .jpg, .jpeg, .svg" }}
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
              sx={{ my: 2 }}
              onClick={handleNewCity}
            >
              {isAddingNewCity ? "Create" : "Save"}
            </LoadingButton>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
};

export default AllowedCitiesTable;
