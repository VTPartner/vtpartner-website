/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";

import Cookies from "js-cookie";
import {
  formatEpoch,
  serverEndPoint,
  serverEndPointImage,
} from "../../../../dashboard/app/constants";
import Loader from "../../../Components/Loader";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Dialog,
  FormControl,
  Icon,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

const AllRegionsCovered = () => {
  const [activeTab, setActiveTab] = useState("connect-tab");
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const [searchQuery, setSearchQuery] = useState("");

  const [cities, setCities] = useState([]);
  const [btnLoading, setBtnLoading] = useState(false);
  const [errorNewCity, setAddNewCityErrors] = useState({
    city_name: false,
    pincode: false,
    pincode_until: false,
    description: false,
    bg_image: false,
  });
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

  const showEditDialog = (city) => {
    Cookies.set("city_id", city.city_id);
    setSelectedCity(city);
    setEditedCity({
      city_name: city.city_name,
      pincode: city.pincode,
      pincode_until: city.pincode_until,
      description: city.description || "",
      bg_image: city.bg_image || "", // Set the initial image URL
      status: parseInt(city.status) || 0,
    });
    setOpenDialog(true);
  };

  const navigate = useNavigate();
  const goToAddPincodes = (city) => {
    navigate(
      `/dashboard/all-allowed-pincodes/${city.city_id}/${city.city_name}`,
      {
        state: { cities, currentPage }, // Pass cities and current page state
      }
    );
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
        formData.append("image", imageFile);

        const uploadResponse = await axios.post(
          `${serverEndPointImage}/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        imageUrl = uploadResponse.data.image_url; // Get the uploaded image URL
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
            "Content-Type": "application/json",
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
        formData.append("image", imageFile);

        const uploadResponse = await axios.post(
          `${serverEndPointImage}/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        imageUrl = uploadResponse.data.image_url;
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
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        // setError(null);
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
        "image/webp",
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

  const fetchCities = async () => {
    const token = Cookies.get("authToken");
    // const city_id = Cookies.get("city_id");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    try {
      setLoading(true);

      const [response] = await Promise.all([
        axios.post(
          `${serverEndPoint}/all_allowed_cities`,
          { city_id: 1, page: 1 },
          config
        ),
      ]);

      setCities(response.data.cities);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  //   // Handle search input change
  //   const handleSearch = (e) => {
  //     setSearchQuery(e.target.value.toLowerCase());
  //     setCurrentPage(1); // Reset to page 1 when search query changes
  //   };

  //   // Filter bookings based on the search query
  //   const filteredBookings = allOrders.filter((order) => {
  //     return (
  //       order.order_id.toString().includes(searchQuery) ||
  //       order.customer_name.toLowerCase().includes(searchQuery) ||
  //       order.driver_first_name.toLowerCase().includes(searchQuery) ||
  //       order.customer_mobile_no.toLowerCase().includes(searchQuery)
  //     );
  //   });

  //   // Pagination logic
  //   const indexOfLastItem = currentPage * itemsPerPage;
  //   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  //   const currentItems = filteredBookings.slice(
  //     indexOfFirstItem,
  //     indexOfLastItem
  //   );
  //   const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  //   const handlePageChange = (pageNumber) => {
  //     setCurrentPage(pageNumber);
  //   };

  const handleStatusInputChange = (e) => {
    const { name, value } = e.target;
    setEditedCity((prevCity) => ({
      ...prevCity,
      [name]: name === "status" ? parseInt(value) : value,
    }));
  };

  useEffect(() => {
    fetchCities();
  }, []);

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
                    <i className="ph-duotone  ph-stack f-s-16"></i> All Regions
                  </span>
                </a>
              </li>

              <li className="active mt-2">
                <a href="#" className="f-s-14 f-w-500">
                  Cities
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
                      All Regions
                    </button>

                    {/* Add City Button */}
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ mb: 2 }}
                      onClick={handleAddCity}
                      className="mt-3"
                    >
                      Add New City
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
                            <th scope="col">City Name</th>
                            <th scope="col">Pincode</th>
                            <th scope="col">Last Updated</th>
                            <th scope="col">Status</th>
                            <th scope="col">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cities.map((city, index) => (
                            <tr key={index}>
                              <td>
                                <div className="position-relative">
                                  <div className="h-40 w-40 d-flex-center b-r-15 overflow-hidden p-1 position-absolute">
                                    <img
                                      src={city.bg_image}
                                      alt={city.city_name}
                                      className="img-fluid"
                                    />
                                  </div>
                                  <div className="ms-5">
                                    <h6 className="mb-0 f-s-16">
                                      {city.city_name}
                                    </h6>
                                  </div>
                                </div>
                              </td>
                              <td>
                                {city.pincode}-{city.pincode_until}
                              </td>
                              <td>
                                <p className="mb-0 f-s-12 text-secondary">
                                  {format(
                                    new Date(city.time * 1000),
                                    "dd/MM/yyyy, hh:mm:ss a"
                                  )}
                                </p>
                              </td>
                              <td>
                                <span
                                  className={`badge bg-${(() => {
                                    if (city.status == 0) return "danger";

                                    return "dark";
                                  })()}`}
                                >
                                  {city.status == 0 ? "Not Active" : "Active"}
                                </span>
                              </td>

                              <td>
                                <Link
                                  onClick={() => showEditDialog(city)}
                                  role="button"
                                  rel="noopener noreferrer"
                                  className="btn btn-outline-primary icon-btn w-30 h-30 b-r-22 me-2"
                                >
                                  <i className="ti ti-edit"></i>
                                </Link>
                                {city.status !== 0 ? ( // Check if the city is active
                                  <Tooltip title="Add Pincode" arrow>
                                    <IconButton
                                      onClick={() => goToAddPincodes(city)}
                                    >
                                      <Icon color="gray">arrow_forward</Icon>
                                    </IconButton>
                                  </Tooltip>
                                ) : null}{" "}
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
      </Container>

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
                  value={editedCity.status || 0}
                  onChange={handleStatusInputChange}
                  required
                  error={errors.status}
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
    </div>
  );
};

export default AllRegionsCovered;
