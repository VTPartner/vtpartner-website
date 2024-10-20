// import React from "react";

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
import { format } from "date-fns";

const StyledTable = styled(Table)(() => ({
  whiteSpace: "pre",
  "& thead": {
    "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } },
  },
  "& tbody": {
    "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } },
  },
}));

const OtherServicesTable = () => {
  const { sub_cat_id } = useParams();
  const [otherServices, setOtherServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openOtherServicesDialog, setOpenOtherServicesDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageError, setImageError] = useState(false);

  const [selectedOtherService, setSelectedOtherServices] = useState({
    service_id: "",
    service_name: "",
    sub_cat_id: "",
    service_image: "",
    time_updated: "",
  });

  const [errorService, setServiceErrors] = useState({
    service_id: false,
    service_name: false,
    sub_cat_id: false,
    service_image: false,
    time_updated: false,
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
        `${serverEndPoint}/all_other_services`,
        {
          sub_cat_id: sub_cat_id,
        }, // Send an empty object as the body if needed
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update state with vehicle details
      setOtherServices(response.data.other_services_details);
    } catch (error) {
      handleError(error); // Handle errors using your existing error handling function
    } finally {
      setLoading(false); // Ensure loading state is reset
    }
  };

  useEffect(() => {
    fetchAllServices();
  }, []);

  // Handle error responses
  const handleError = (error) => {
    if (error.response) {
      if (error.response.status === 404) {
        toast.error("No Data Found.");
        setError("No Data Found");
      } else if (error.response.status === 409) {
        toast.error("Other Service Name already assigned.");
      } else if (error.response.status === 500) {
        toast.error("Internal server error. Please try again later.");
        setError("Internal Server Error");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
        setError("Unexpected Error");
      }
    } else {
      toast.error(
        "Failed to fetch all Sub Services. Please check your connection."
      );
      setError("Network Error");
    }
    setLoading(false);
  };

  const handleOpenDialog = () => {
    setSelectedOtherServices({
      service_id: "",
      service_name: "",
      sub_cat_id: "",
      service_image: "",
      time_updated: "",
    });
    setIsEditMode(false);
    setOpenOtherServicesDialog(true);
  };

  const navigate = useNavigate();

  const handleEditClick = (service) => {
    setSelectedOtherServices(service);
    setIsEditMode(true);
    setOpenOtherServicesDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenOtherServicesDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedOtherServices((prevState) => ({
      ...prevState,
      [name]: value, // Dynamically update the selected field
    }));
  };

  const saveServiceDetails = async () => {
    setBtnLoading(true);

    const newErrors = {
      service_name: !selectedOtherService.service_name,
      service_image: !imageFile && !selectedOtherService.service_image,
    };
    setServiceErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      setBtnLoading(false);
      return;
    }
    let serviceImageUrl = selectedOtherService.service_image;

    //CATEGORY IMAGE UPLOAD
    try {
      if (imageFile) {
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

        serviceImageUrl = uploadResponse.data.imageUrl;
      }
    } catch (error) {
      console.error("Error uploading Other Service Image:", error);
      toast.error("Error uploading Other Service Image");
      setBtnLoading(false);
      return;
    }

    const token = Cookies.get("authToken");
    const endpoint = isEditMode
      ? `${serverEndPoint}/edit_other_service`
      : `${serverEndPoint}/add_other_service`;

    try {
      const formData = new FormData();

      // Append vehicle details to formData
      for (const key in selectedOtherService) {
        formData.append(key, selectedOtherService[key]);
      }

      // Append image file if it exists
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await axios.post(
        endpoint,
        {
          service_id: isEditMode ? selectedOtherService.service_id : "0",
          sub_cat_id: sub_cat_id,
          service_name: selectedOtherService.service_name,
          service_image: serviceImageUrl,
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
            ? selectedOtherService.service_name +
                " Service updated successfully!"
            : selectedOtherService.service_name + " Service added successfully!"
        );
        fetchAllServices();
        handleCloseDialog();
        setImageFile(null);
      } else {
        toast.error(
          "Failed to save service " + selectedOtherService.service_name
        );
      }
    } catch (error) {
      handleError(error);
    } finally {
      setBtnLoading(false);
    }
  };

  const handleImageChangeCategory = (e) => {
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
          "Only .png .jpeg .jpg and .svg file formats are allowed."
        );
        e.target.value = ""; // Clear the selected file input
        return; // Return early without setting the image file
      } else {
        setImageFile(file); // Set the valid image file
        setImageError((prevErrors) => ({
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
          Add New Other Service
        </Button>

        <StyledTable>
          <TableHead>
            <TableRow>
              <TableCell align="left">Service Name</TableCell>
              <TableCell align="left">Last Updated</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {otherServices
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((service) => (
                <TableRow key={service.vehicle_id}>
                  <TableCell align="left">
                    <Box display="flex" alignItems="center">
                      <Avatar
                        src={`${service.service_image}`}
                        alt={service.service_name}
                        sx={{ width: 40, height: 40, marginRight: 1 }}
                      />
                      {service.service_name}
                    </Box>
                  </TableCell>

                  <TableCell align="left">
                    {format(
                      new Date(service.time_updated * 1000),
                      "dd/MM/yyyy, hh:mm:ss a"
                    )}
                  </TableCell>

                  <TableCell align="right">
                    <Tooltip title="Edit Details" arrow>
                      <IconButton onClick={() => handleEditClick(service)}>
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
          count={otherServices.length}
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
        open={openOtherServicesDialog}
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
              {selectedOtherService.service_image ? (
                <img
                  src={selectedOtherService.service_image}
                  alt={selectedOtherService.service_name}
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
                  No Service image selected
                </Typography>
              )}
            </Box>
          ) : (
            <></>
          )}

          <TextField
            label="Service Name"
            fullWidth
            margin="normal"
            name="service_name"
            value={selectedOtherService.service_name}
            onChange={handleInputChange}
            required
            error={errorService.service_name}
            helperText={
              errorService.service_name ? "Service name is required." : ""
            }
          />

          <Typography variant="subtitle2">Service Image</Typography>
          <TextField
            fullWidth
            margin="normal"
            type="file"
            onChange={handleImageChangeCategory}
            required
            error={errorService.service_image} // Set error state for image
            helperText={
              errorService.service_image ? "Service Image is required." : ""
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
              onClick={saveServiceDetails}
            >
              {isEditMode ? "Update" : "Create"}
            </LoadingButton>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default OtherServicesTable;
