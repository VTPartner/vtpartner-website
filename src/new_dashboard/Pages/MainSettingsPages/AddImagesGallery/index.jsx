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

import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";

import { Card, CardBody, Col, Container, Row } from "reactstrap";
import { Link } from "react-router-dom";

import Loader from "../../../Components/Loader";
import {
  serverEndPoint,
  serverEndPointImage,
} from "../../../../dashboard/app/constants";

const AddGalleryImages = () => {
  const [activeTab, setActiveTab] = useState("connect-tab");
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const [loading, setLoading] = useState(true);
  const { category_id, category_name, category_type_id } = useParams();
  const [galleryImages, setGalleryData] = useState([]);
  const [error, setError] = useState(null);
  const [openGalleryImagesDialog, setOpenGalleryImagesDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageError, setImageError] = useState(false);

  const [selectedImage, setSelectedImage] = useState({
    gallery_id: "",
    category_type_id: "",
    image: "",
  });

  const [errorService, setServiceErrors] = useState({
    gallery_id: false,
    category_type_id: false,
    image: false,
  });

  const [btnLoading, setBtnLoading] = useState(false);

  // Fetch all vehicles and vehicle types
  const fetchAllGalleryImages = async () => {
    // Check if the user is online
    if (!navigator.onLine) {
      toast.error("No internet connection. Please check your connection.");
      setLoading(false);
      return; // Exit if no internet connection
    }

    const token = Cookies.get("authToken");

    try {
      const response = await axios.post(
        `${serverEndPoint}/all_gallery_images`,
        {
          category_type_id: category_type_id,
        }, // Send an empty object as the body if needed
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update state with vehicle details
      setGalleryData(response.data.gallery_images_data);
    } catch (error) {
      handleError(error); // Handle errors using your existing error handling function
    } finally {
      setLoading(false); // Ensure loading state is reset
    }
  };

  useEffect(() => {
    fetchAllGalleryImages();
  }, []);

  // Handle error responses
  const handleError = (error) => {
    if (error.response) {
      if (error.response.status === 404) {
        toast.error("No Gallery Images Data Found.");
        setError("No Data Found");
      } else if (error.response.status === 409) {
        toast.error("Sub Service Name already assigned.");
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
    setSelectedImage({
      gallery_id: "",
      category_type_id: "",
      image: "",
    });
    setIsEditMode(false);
    setOpenGalleryImagesDialog(true);
  };

  const handleEditClick = (service) => {
    setSelectedImage(service);
    setIsEditMode(true);
    setOpenGalleryImagesDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenGalleryImagesDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedImage((prevState) => ({
      ...prevState,
      [name]: value, // Dynamically update the selected field
    }));
  };

  const saveGalleryImage = async () => {
    setBtnLoading(true);

    const newErrors = {
      image: !imageFile && !selectedImage.image_url,
    };
    setServiceErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      setBtnLoading(false);
      return;
    }
    let serviceImageUrl = selectedImage.image_url;

    //CATEGORY IMAGE UPLOAD
    try {
      if (imageFile) {
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

        serviceImageUrl = uploadResponse.data.image_url;
      }
    } catch (error) {
      console.error("Error uploading Sub category Image:", error);
      toast.error(
        "Error uploading Sub category Image or file size too large then 2 Mb"
      );
      setBtnLoading(false);
      return;
    }

    const token = Cookies.get("authToken");
    const endpoint = isEditMode
      ? `${serverEndPoint}/edit_gallery_image`
      : `${serverEndPoint}/add_gallery_image`;

    try {
      const formData = new FormData();

      // Append vehicle details to formData
      for (const key in selectedImage) {
        formData.append(key, selectedImage[key]);
      }

      // Append image file if it exists
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await axios.post(
        endpoint,
        {
          gallery_id: isEditMode ? selectedImage.gallery_id : "-1",
          category_type_id: category_type_id,
          image_url: serviceImageUrl,
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
            ? " Gallery Image updated successfully!"
            : " Gallery Image added successfully!"
        );
        fetchAllGalleryImages();
        handleCloseDialog();
        setImageFile(null);
      } else {
        toast.error("Failed to save gallery Image.");
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
        // "image/jpeg",
        // "image/jpg",
        "image/svg+xml",
      ];

      if (!validImageTypes.includes(file.type)) {
        setImageError((prevErrors) => ({
          ...prevErrors,
          image: true,
        }));
        toast.warning("Only .png  and .svg file formats are allowed.");
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
    return <Loader />;
  }

  return (
    <div>
      <Container fluid>
        <Row className="m-1">
          <Col xs={12}>
            <h4 className="main-title">Service Settings</h4>
            <ul className="app-line-breadcrumbs mb-3">
              <li className="">
                <a href="#" className="f-s-14 f-w-500">
                  <span>
                    <i className="ph-duotone  ph-stack f-s-16"></i> Service
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
                      All Gallery Images
                    </button>

                    <Button
                      variant="contained"
                      className="mt-3"
                      color="primary"
                      sx={{ mb: 2 }}
                      onClick={handleOpenDialog}
                    >
                      Add New Gallery Image
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
                            <th scope="col">Image</th>
                            <th scope="col">Last Updated</th>
                            <th scope="col">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {galleryImages.map((service, index) => (
                            <tr key={index}>
                              <td>
                                {" "}
                                <Avatar
                                  src={`${service.image_url}`}
                                  alt={service.category_type}
                                  sx={{
                                    width: 100,
                                    height: 100,
                                    marginRight: 1,
                                    objectFit: "contain",
                                  }}
                                />
                              </td>
                              <td>
                                {format(
                                  new Date(service.epoch * 1000),
                                  "dd/MM/yyyy, hh:mm:ss a"
                                )}
                              </td>

                              <td>
                                <Tooltip title="Change Image" arrow>
                                  <IconButton
                                    onClick={() => handleEditClick(service)}
                                  >
                                    <Icon color="primary">edit</Icon>
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
          open={openGalleryImagesDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <Box p={3}>
            <Typography variant="h6" gutterBottom>
              {isEditMode ? "Edit Gallery Image" : "Add New Gallery Image"}
            </Typography>

            {isEditMode ? (
              <Box display="flex" alignItems="center" mb={2} width="100%">
                {selectedImage.image_url ? (
                  <img
                    src={selectedImage.image_url}
                    alt={selectedImage.sub_cat_name}
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
                    Sub Gallery Image selected
                  </Typography>
                )}
              </Box>
            ) : (
              <></>
            )}

            <Typography variant="subtitle2">Gallery Image</Typography>
            <TextField
              fullWidth
              margin="normal"
              type="file"
              onChange={handleImageChangeCategory}
              required
              error={errorService.image} // Set error state for image
              helperText={
                errorService.image ? "Gallery Image is required." : ""
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
                onClick={saveGalleryImage}
              >
                {isEditMode ? "Update" : "Add"}
              </LoadingButton>
            </Box>
          </Box>
        </Dialog>
      </Container>
    </div>
  );
};

export default AddGalleryImages;
