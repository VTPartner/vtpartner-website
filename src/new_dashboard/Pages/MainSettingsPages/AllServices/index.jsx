/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { FcGallery } from "react-icons/fc";
import { MdOutlineFileOpen } from "react-icons/md";

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
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { FaQ } from "react-icons/fa6";

import { Card, CardBody, Col, Container, Row } from "reactstrap";
import { Link } from "react-router-dom";

import axios from "axios";

import Cookies from "js-cookie";
import {
  formatEpoch,
  serverEndPoint,
  serverEndPointImage,
} from "../../../../dashboard/app/constants";
import Loader from "../../../Components/Loader";

const AllServicesPage = () => {
  const [activeTab, setActiveTab] = useState("connect-tab");
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

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
      `/dashboard/all_vehicles/${category.category_id}/${category.category_name}`,
      {}
    );
  };

  const goToSubCategory = (category) => {
    navigate(
      `/dashboard/all_sub_categories/${category.category_id}/${category.category_name}`,
      {}
    );
  };

  const goToFAQ = (category) => {
    navigate(
      `/dashboard/all_faqs/${category.category_id}/${category.category_name}`,
      {}
    );
  };

  const goToGallery = (category) => {
    navigate(
      `/dashboard/gallery/${category.category_id}/${category.category_name}/${category.category_type_id}`,
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
    return <Loader />;
  }

  return (
    <div>
      <Container fluid>
        <Row className="m-1">
          <Col xs={12}>
            <h4 className="main-title">Main Settings</h4>
            <ul className="app-line-breadcrumbs mb-3">
              <li className="">
                <a href="#" className="f-s-14 f-w-500">
                  <span>
                    <i className="ph-duotone  ph-stack f-s-16"></i> Services
                  </span>
                </a>
              </li>

              <li className="active mt-2">
                <a href="#" className="f-s-14 f-w-500">
                  All Services
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
                      All Services
                    </button>
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
                            <th>Service ID</th>
                            <th scope="col">Service Name</th>
                            <th scope="col">Category Type</th>
                            <th scope="col">Last Updated</th>
                            <th scope="col">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {services.map((service, index) => (
                            <tr key={index}>
                              <td># {service.category_id}</td>

                              <td>
                                <div className="position-relative">
                                  <div className="h-40 w-40 d-flex-center b-r-15 overflow-hidden p-1 position-absolute">
                                    <img
                                      src={service.category_image}
                                      alt={service.category_name}
                                      className="img-fluid"
                                    />
                                  </div>
                                  <div className="ms-5">
                                    <h6 className="mb-0 f-s-16">
                                      {service.category_name}
                                    </h6>
                                  </div>
                                </div>
                              </td>

                              <td>
                                <p className="mb-0 f-s-12 text-secondary">
                                  {service.category_type}
                                </p>
                              </td>
                              <td>
                                <p className="mb-0 f-s-12 text-secondary">
                                  {format(
                                    new Date(service.epoch * 1000),
                                    "dd/MM/yyyy, hh:mm:ss a"
                                  )}
                                </p>
                              </td>

                              <td>
                                <Tooltip title="Edit Service Details" arrow>
                                  <IconButton
                                    onClick={() => handleEditClick(service)}
                                  >
                                    <Icon color="primary">edit</Icon>
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Gallery" arrow>
                                  <IconButton
                                    onClick={() => goToGallery(service)}
                                  >
                                    <Icon color="primary">
                                      <FcGallery />
                                    </Icon>
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Add FAQ" arrow>
                                  <IconButton onClick={() => goToFAQ(service)}>
                                    <Icon color="gray">
                                      <FaQ />
                                    </Icon>
                                  </IconButton>
                                </Tooltip>
                                {service.category_type !== "Service" && (
                                  <Tooltip title="Add Vehicles" arrow>
                                    <IconButton
                                      onClick={() => goToAddPricePage(service)}
                                    >
                                      <Icon color="gray">arrow_forward</Icon>
                                    </IconButton>
                                  </Tooltip>
                                )}

                                {service.category_type === "Service" && (
                                  <Tooltip title="Add Sub Category" arrow>
                                    <IconButton
                                      onClick={() => goToSubCategory(service)}
                                    >
                                      <Icon color="gray">arrow_forward</Icon>
                                    </IconButton>
                                  </Tooltip>
                                )}
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
      </Container>
    </div>
  );
};

export default AllServicesPage;
