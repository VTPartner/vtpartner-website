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
  Chip,
  FormControlLabel,
  Switch,
} from "@mui/material";
import PriceChangeIcon from "@mui/icons-material/PriceChange";
import { LoadingButton } from "@mui/lab";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";
import { styled } from "@mui/system";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import Loader from "../../../Components/Loader";
import {
  serverEndPoint,
  serverEndPointImage,
} from "../../../../dashboard/app/constants";
import { Card, CardBody, Col, Container, Row } from "reactstrap";

const AddSubCategoryPage = () => {
  const [activeTab, setActiveTab] = useState("connect-tab");
  const { category_id, category_name } = useParams();
  const [subServices, setSubServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openSubServicesDialog, setOpenSubServicesDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageError, setImageError] = useState(false);

  const [selectedSubService, setSelectedSubServices] = useState({
    sub_cat_id: "",
    sub_cat_name: "",
    cat_id: "",
    image: "",
    epoch_time: "",
    service_base_price: "",
    penalty_charges_amount: "",
    is_active: 1,
  });

  const [errorService, setServiceErrors] = useState({
    sub_cat_name: false,
    image: false,
    service_base_price: false,
    penalty_charges_amount: false,
  });

  const [btnLoading, setBtnLoading] = useState(false);

  const fetchAllSubServices = async () => {
    if (!navigator.onLine) {
      toast.error("No internet connection. Please check your connection.");
      setLoading(false);
      return;
    }

    try {
      const token = Cookies.get("authToken");

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        navigate("/login");
        return;
      }

      const response = await axios.post(
        `${serverEndPoint}/all_sub_categories`,
        { category_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSubServices(response.data.sub_categories_details);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllSubServices();
  }, []);

  const handleError = (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 404:
          toast.error("No Data Found.");
          setError("No Data Found");
          break;
        case 409:
          toast.error("Sub Service Name already exists.");
          break;
        case 500:
          toast.error("Internal server error. Please try again later.");
          setError("Internal Server Error");
          break;
        default:
          toast.error("An unexpected error occurred. Please try again.");
          setError("Unexpected Error");
      }
    } else {
      toast.error("Network error. Please check your connection.");
      setError("Network Error");
    }
  };

  const handleStatusChange = async (service) => {
    try {
      setStatusLoading(true);
      const token = Cookies.get("authToken");

      const response = await axios.post(
        `${serverEndPoint}/edit_sub_category`,
        {
          sub_cat_id: service.sub_cat_id,
          category_id,
          sub_cat_name: service.sub_cat_name,
          image: service.image,
          service_base_price: service.service_base_price,
          penalty_charges_amount: service.penalty_charges_amount,
          is_active: service.is_active === 1 ? 0 : 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success(`${service.sub_cat_name} status updated successfully!`);
        await fetchAllSubServices();
      }
    } catch (error) {
      handleError(error);
    } finally {
      setStatusLoading(false);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleOpenDialog = () => {
    setSelectedSubServices({
      sub_cat_id: "",
      sub_cat_name: "",
      cat_id: "",
      image: "",
      epoch_time: "",
      service_base_price: "",
      penalty_charges_amount: "",
      is_active: 1,
    });
    setIsEditMode(false);
    setOpenSubServicesDialog(true);
  };

  const navigate = useNavigate();
  const goToAddPricePage = (category) => {
    navigate(
      `/dashboard/all_vehicles/${category.category_id}/${category.category_name}`,
      {}
    );
  };

  const goToOtherServices = (category) => {
    navigate(
      `/dashboard/all_other_services/${category.sub_cat_id}/${category.sub_cat_name}`,
      {}
    );
  };

  const handleEditClick = (service) => {
    // setSelectedSubServices(service);
    setSelectedSubServices({
      sub_cat_id: service.sub_cat_id,
      sub_cat_name: service.sub_cat_name,
      cat_id: service.cat_id,
      image: service.image,
      epoch_time: service.epoch_time,
      service_base_price: service.service_base_price,
      penalty_charges_amount: service.penalty_charges_amount,
      is_active: service.is_active,
    });
    setIsEditMode(true);
    setOpenSubServicesDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenSubServicesDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedSubServices((prevState) => ({
      ...prevState,
      [name]: value, // Dynamically update the selected field
    }));
  };

  const saveSubCategoryDetails = async () => {
    setBtnLoading(true);

    const newErrors = {
      sub_cat_name: !selectedSubService.sub_cat_name,
      image: !imageFile && !selectedSubService.image,
      service_base_price: !selectedSubService.service_base_price,
      penalty_charges_amount: !selectedSubService.penalty_charges_amount,
    };
    setServiceErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      setBtnLoading(false);
      return;
    }

    let serviceImageUrl = selectedSubService.image;

    try {
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

        serviceImageUrl = uploadResponse.data.image_url;
      }

      const token = Cookies.get("authToken");
      const endpoint = isEditMode
        ? `${serverEndPoint}/edit_sub_category`
        : `${serverEndPoint}/add_sub_category`;

      const isActive = selectedSubService.is_active ? "1" : "0";

      const response = await axios.post(
        endpoint,
        {
          sub_cat_id: isEditMode ? selectedSubService.sub_cat_id : "0",
          category_id,
          sub_cat_name: selectedSubService.sub_cat_name,
          image: serviceImageUrl,
          service_base_price: selectedSubService.service_base_price,
          penalty_charges_amount: selectedSubService.penalty_charges_amount,
          is_active: isActive,
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
          `${selectedSubService.sub_cat_name} ${
            isEditMode ? "updated" : "added"
          } successfully!`
        );
        await fetchAllSubServices();
        handleCloseDialog();
        setImageFile(null);
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
    return <Loader />;
  }

  return (
    <div>
      <Container fluid>
        <ToastContainer position="top-right" />
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
                      All Sub Services
                    </button>

                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ mb: 2 }}
                      className="mt-3"
                      onClick={handleOpenDialog}
                    >
                      Add New Sub Service
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
                            <th scope="col">Sl No</th>
                            <th>Sub Category Name</th>
                            <th scope="col">Base Price</th>
                            <th scope="col">Penalty Charges</th>
                            <th scope="col">Status</th>
                            <th scope="col">Last Updated</th>
                            <th scope="col">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {subServices.map((service, index) => (
                            <tr key={index}>
                              <td># {index}</td>

                              <td>
                                <div className="position-relative">
                                  <div className="h-40 w-40 d-flex-center b-r-15 overflow-hidden p-1 position-absolute">
                                    <Avatar
                                      src={`${service.image}`}
                                      alt={service.sub_cat_name}
                                      sx={{
                                        width: 40,
                                        height: 40,
                                        marginRight: 1,
                                      }}
                                    />
                                  </div>
                                  <div className="ms-5">
                                    <h6 className="mb-0 f-s-16">
                                      {service.sub_cat_name}
                                      {service.is_active === 0 && (
                                        <Chip
                                          label="Inactive"
                                          size="small"
                                          color="error"
                                          sx={{ ml: 1 }}
                                        />
                                      )}
                                    </h6>
                                  </div>
                                </div>
                              </td>

                              <td>₹{service.service_base_price}</td>
                              <td>₹{service.penalty_charges_amount}</td>
                              <td>
                                {service.is_active === 1
                                  ? "Active"
                                  : "Inactive"}
                              </td>
                              <td>
                                <p className="mb-0 f-s-12 text-secondary">
                                  {format(
                                    new Date(service.epoch_time * 1000),
                                    "dd/MM/yyyy, hh:mm:ss a"
                                  )}
                                </p>
                              </td>
                              <td>
                                <Tooltip title="Edit Details" arrow>
                                  <IconButton
                                    onClick={() => handleEditClick(service)}
                                  >
                                    <Icon color="primary">edit</Icon>
                                  </IconButton>
                                </Tooltip>

                                <Tooltip title="Add Other Services" arrow>
                                  <IconButton
                                    onClick={() => goToOtherServices(service)}
                                  >
                                    <Icon color="gray">arrow_forward</Icon>
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Service Plan Upgrades" arrow>
                                  <IconButton
                                    onClick={() =>
                                      navigate(
                                        `/dashboard/service-plan-upgrades/${-1}/${
                                          service.sub_cat_id
                                        }/${encodeURIComponent(
                                          "NA"
                                        )}/${encodeURIComponent(
                                          service.sub_cat_name
                                        )}`
                                      )
                                    }
                                  >
                                    <PriceChangeIcon color="primary" />
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
          open={openSubServicesDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <Box p={3}>
            <Typography variant="h6" gutterBottom>
              {isEditMode ? "Edit Sub Category" : "Add New Sub Category"}
            </Typography>

            {isEditMode ? (
              <Box display="flex" alignItems="center" mb={2} width="100%">
                {selectedSubService.image ? (
                  <img
                    src={selectedSubService.image}
                    alt={selectedSubService.sub_cat_name}
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
                    No Sub Category image selected
                  </Typography>
                )}
              </Box>
            ) : (
              <></>
            )}

            <TextField
              label="Sub Category Name"
              fullWidth
              margin="normal"
              name="sub_cat_name"
              value={selectedSubService.sub_cat_name}
              onChange={handleInputChange}
              required
              error={errorService.sub_cat_name}
              helperText={
                errorService.sub_cat_name
                  ? "Sub Category name is required."
                  : ""
              }
            />

            <Typography variant="subtitle2">Sub Category Image</Typography>
            <TextField
              fullWidth
              margin="normal"
              type="file"
              onChange={handleImageChangeCategory}
              required
              error={errorService.image} // Set error state for image
              helperText={
                errorService.image ? "Sub Category Image is required." : ""
              }
            />

            <TextField
              label="Service Base Price"
              fullWidth
              margin="normal"
              name="service_base_price"
              type="number"
              value={selectedSubService.service_base_price}
              onChange={handleInputChange}
              required
              error={errorService.service_base_price}
              helperText={
                errorService.service_base_price
                  ? "Service base price is required."
                  : ""
              }
            />

            <TextField
              label="Penalty Charges Amount"
              fullWidth
              margin="normal"
              name="penalty_charges_amount"
              type="number"
              value={selectedSubService.penalty_charges_amount}
              onChange={handleInputChange}
              required
              error={errorService.penalty_charges_amount}
              helperText={
                errorService.penalty_charges_amount
                  ? "Penalty charges amount is required."
                  : ""
              }
            />

            <FormControlLabel
              control={
                <Switch
                  checked={selectedSubService.is_active === 1}
                  onChange={(e) =>
                    setSelectedSubServices((prev) => ({
                      ...prev,
                      is_active: e.target.checked ? 1 : 0,
                    }))
                  }
                  color="primary"
                />
              }
              label={selectedSubService.is_active === 1 ? "Active" : "Inactive"}
              sx={{ mt: 2, mb: 1 }}
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
                onClick={saveSubCategoryDetails}
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

export default AddSubCategoryPage;
