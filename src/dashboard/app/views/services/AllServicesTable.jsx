/* eslint-disable no-unused-vars */
import { FcGallery } from "react-icons/fc";
import { MdOutlineFileOpen } from "react-icons/md";
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
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { FaQ } from "react-icons/fa6";

const StyledTable = styled(Table)(() => ({
  whiteSpace: "pre",
  "& thead": {
    "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } },
  },
  "& tbody": {
    "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } },
  },
}));

const AllServicesTable = () => {
  const [services, setServices] = useState([]);
  const [servicesTypes, setServicesType] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openServicesDialog, setOpenServicesDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageError, setImageError] = useState(false);

  const [selectedService, setSelectedService] = useState({
    category_id: "",
    category_name: "",
    category_type_id: "",
    category_image: "",
    category_type: "",
    epoch: "",
    description: "",
  });

  const [errorService, setServiceErrors] = useState({
    category_id: false,
    category_name: false,
    category_type_id: false,
    category_image: false,
    category_type: false,
    epoch: false,
    description: false,
  });

  const [btnLoading, setBtnLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch all vehicles and vehicle types
  const fetchAllServices = async () => {
    // Check if the user is online
    if (!navigator.onLine) {
      toast.error("No internet connection. Please check your connection.");
      setLoading(false);
      return; // Exit if no internet connection
    }

    const token = Cookies.get("authToken");

    try {
      const response = await axios.post(
        `${serverEndPoint}/all_services`,
        {}, // Send an empty object as the body if needed
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update state with vehicle details
      setServices(response.data.services_details);
    } catch (error) {
      handleError(error); // Handle errors using your existing error handling function
    } finally {
      setLoading(false); // Ensure loading state is reset
    }
  };

  const fetchServiceType = async () => {
    // Check if the user is online
    if (!navigator.onLine) {
      toast.error("No internet connection. Please check your connection.");
      setLoading(false);
      return; // Exit if no internet connection
    }

    const token = Cookies.get("authToken");

    try {
      const response = await axios.post(
        `${serverEndPoint}/service_types`,
        {}, // Send an empty object as the body if needed
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update state with vehicle type details
      setServicesType(response.data.services_type_details);
    } catch (error) {
      handleError(error); // Handle errors using your existing error handling function
    } finally {
      setLoading(false); // Ensure loading state is reset
    }
  };

  useEffect(() => {
    fetchAllServices();
    fetchServiceType();
  }, []);

  // Handle error responses
  const handleError = (error) => {
    if (error.response) {
      if (error.response.status === 404) {
        toast.error("No Data Found.");
        setError("No Data Found");
      } else if (error.response.status === 409) {
        // Handle case where pincode already exists
        toast.error("Service Name already exists.");
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
    setSelectedService({
      category_id: "",
      category_name: "",
      category_type_id: "",
      category_image: "",
      category_type: "",
      epoch: "",
      description: "",
    });
    setIsEditMode(false);
    setOpenServicesDialog(true);
  };

  const navigate = useNavigate();
  const goToAddPricePage = (category) => {
    navigate(
      `/all_vehicles/${category.category_id}/${category.category_name}`,
      {}
    );
  };

  const goToSubCategory = (category) => {
    navigate(
      `/all_sub_categories/${category.category_id}/${category.category_name}`,
      {}
    );
  };

  const goToEnquiry = (category) => {
    navigate(
      `/all_enquiries/${category.category_id}/${category.category_name}`,
      {}
    );
  };
  const goToFAQ = (category) => {
    navigate(
      `/all_faqs/${category.category_id}/${category.category_name}`,
      {}
    );
  };

  const goToGallery = (category) => {
    navigate(
      `/gallery/${category.category_id}/${category.category_name}/${category.category_type_id}`,
      {}
    );
  };

  const handleEditClick = (service) => {
    setSelectedService(service);
    setIsEditMode(true);
    setOpenServicesDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenServicesDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setSelectedService((prevState) => ({
      ...prevState,
      [name]: value, // Dynamically update the selected field
    }));
  };

  const saveCategoryDetails = async () => {
    setBtnLoading(true);
    console.log("selectedService::", selectedService);
    const newErrors = {
      category_name: !selectedService.category_name,
      category_type_id: !selectedService.category_type_id,
      category_image: !imageFile && !selectedService.category_image,
    };
    setServiceErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      setBtnLoading(false);
      return;
    }
    let serviceImageUrl = selectedService.category_image;

    //CATEGORY IMAGE UPLOAD
    try {
      if (imageFile) {
        console.log("Image File:", imageFile); // Log the image file for debugging
        const formData = new FormData();
        formData.append("image", imageFile);

        // Log form data content
        for (const [key, value] of formData.entries()) {
          console.log(`${key}: ${value.name}`); // Will log the file name
        }
        console.log("formData:", formData);
        const uploadResponse = await axios.post(
          `${serverEndPointImage}/upload`,
          formData, // No headers,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        serviceImageUrl = uploadResponse.data.image_url; // Ensure correct key
      }
    } catch (error) {
      console.error("Error uploading Vehicle Image:", error);
      toast.error(
        "Error uploading Vehicle Image or file size too large than 2 MB"
      );
      setBtnLoading(false);
      return;
    }

    const token = Cookies.get("authToken");
    const endpoint = isEditMode
      ? `${serverEndPoint}/edit_service`
      : `${serverEndPoint}/add_service`;

    try {
      const formData = new FormData();

      // Append vehicle details to formData
      for (const key in selectedService) {
        formData.append(key, selectedService[key]);
      }

      // Append image file if it exists
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await axios.post(
        endpoint,
        {
          category_id: isEditMode ? selectedService.category_id : "0",
          category_name: selectedService.category_name,
          category_type_id: selectedService.category_type_id,
          category_image: serviceImageUrl,
          description: selectedService.description,
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
            ? "Service updated successfully!"
            : "Service added successfully!"
        );
        fetchAllServices();
        handleCloseDialog();
        setImageFile(null);
      } else {
        toast.error("Failed to save Category.");
      }
    } catch (error) {
      handleError(error);
    } finally {
      setBtnLoading(false);
    }
  };

  const handleImageChangeCategory = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    // const reader = new FileReader();
    // reader.onload = () => {
    //   setImageFile(reader.result);
    //   // this.setState({file : reader.result})
    //   setImageError((prevErrors) => ({
    //     ...prevErrors,
    //     image: false,
    //   }));
    // };

    // if (file) {
    //   reader.readAsDataURL(file);
    // }
    // const file = e.target.files[0];
    // if (file) {
    //   const validImageTypes = [
    //     "image/png",
    //     // "image/jpeg",
    //     // "image/jpg",
    //     "image/svg+xml",
    //   ];

    //   if (!validImageTypes.includes(file.type)) {
    //     setImageError((prevErrors) => ({
    //       ...prevErrors,
    //       image: true,
    //     }));
    //     toast.warning("Only .png and .svg file formats are allowed.");
    //     e.target.value = ""; // Clear the selected file input
    //     return; // Return early without setting the image file
    //   } else {
    //     setImageFile(file); // Set the valid image file
    //     setImageError((prevErrors) => ({
    //       ...prevErrors,
    //       image: false,
    //     }));
    //   }
    // }
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
          Add New Service
        </Button>

        <StyledTable>
          <TableHead>
            <TableRow>
              <TableCell align="left">Category Name</TableCell>
              <TableCell align="left">Category Type</TableCell>
              <TableCell align="left">Last Updated</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {services
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((service) => (
                <TableRow key={service.vehicle_id}>
                  <TableCell align="left">
                    <Box display="flex" alignItems="center">
                      <Avatar
                        src={`${service.category_image}`}
                        alt={service.category_name}
                        sx={{ width: 40, height: 40, marginRight: 1 }}
                      />
                      {service.category_name}
                    </Box>
                  </TableCell>

                  <TableCell align="left">{service.category_type}</TableCell>
                  <TableCell align="left">
                    {format(
                      new Date(service.epoch * 1000),
                      "dd/MM/yyyy, hh:mm:ss a"
                    )}
                  </TableCell>

                  <TableCell align="center">
                    <Tooltip title="Edit Vehicle Details" arrow>
                      <IconButton onClick={() => handleEditClick(service)}>
                        <Icon color="primary">edit</Icon>
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Gallery" arrow>
                      <IconButton onClick={() => goToGallery(service)}>
                        <Icon color="primary">
                          <FcGallery />
                        </Icon>
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Add FAQ" arrow>
                      <IconButton onClick={() => goToFAQ(service)}>
                        <Icon color="gray">
                          <FaQ/>
                        </Icon>
                      </IconButton>
                    </Tooltip>
                    {service.category_type !== "Service" && (
                      <Tooltip title="Add Vehicles" arrow>
                        <IconButton onClick={() => goToAddPricePage(service)}>
                          <Icon color="gray">arrow_forward</Icon>
                        </IconButton>
                      </Tooltip>
                    )}

                    {service.category_type === "Service" && (
                      <Tooltip title="Add Sub Category" arrow>
                        <IconButton onClick={() => goToSubCategory(service)}>
                          <Icon color="gray">arrow_forward</Icon>
                        </IconButton>
                      </Tooltip>
                    )}
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
          count={services.length}
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
        open={openServicesDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <Box p={3}>
          <Typography variant="h6" gutterBottom>
            {isEditMode ? "Edit Service" : "Add New Service"}
          </Typography>

          {isEditMode ? (
            <Box display="flex" alignItems="center" mb={2} width="100%">
              {selectedService.category_image ? (
                <img
                  src={selectedService.category_image}
                  alt={selectedService.category_name}
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
                  No Category image selected
                </Typography>
              )}
            </Box>
          ) : (
            <></>
          )}

          <TextField
            label="Service Category Name"
            fullWidth
            margin="normal"
            name="category_name"
            value={selectedService.category_name}
            onChange={handleInputChange}
            required
            error={errorService.category_name}
            helperText={
              errorService.category_name ? "Category name is required." : ""
            }
          />

          <TextField
            label="Description"
            fullWidth
            margin="normal"
            multiline
            rows={4} // You can change the number of rows based on your preference
            name="description"
            value={selectedService.description}
            onChange={handleInputChange}
            required
            error={errorService.description}
            helperText={
              errorService.description ? "Description is required." : ""
            }
          />

          <FormControl fullWidth margin="normal" variant="outlined">
            <InputLabel>Category Type</InputLabel>
            <Select
              name="category_type_id"
              value={selectedService.category_type_id}
              onChange={handleInputChange}
              required
              label="Category Type"
              error={errorService.category_type_id}
            >
              {servicesTypes.map((type) => (
                <MenuItem key={type.cat_type_id} value={type.cat_type_id}>
                  {type.category_type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography variant="subtitle2">Category Image</Typography>
          <TextField
            fullWidth
            margin="normal"
            type="file"
            onChange={(e) => setImageFile(e.target.files[0])}
            required
            error={errorService.category_image} // Set error state for image
            helperText={
              errorService.category_image ? "Category Image is required." : ""
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
              onClick={saveCategoryDetails}
            >
              {isEditMode ? "Update" : "Create"}
            </LoadingButton>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default AllServicesTable;
