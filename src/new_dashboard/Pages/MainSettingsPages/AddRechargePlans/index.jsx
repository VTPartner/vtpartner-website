import { useEffect, useState } from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import {
  Box,
  Button,
  Dialog,
  FormControl,
  IconButton,
  TextField,
  Typography,
  Select,
  MenuItem,
  Icon,
  InputLabel,
  InputAdornment,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";

import { format } from "date-fns";
import { serverEndPoint } from "../../../../dashboard/app/constants";
import Loader from "../../../Components/Loader";

const RechargePlans = () => {
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedPlan, setSelectedPlan] = useState({
    recharge_plan_id: "",
    plan_title: "",
    plan_description: "",
    plan_days: "",
    expiry_days: "",
    plan_price: "",
    category_id: "",
    vehicle_id: "1",
  });

  const [errors, setErrors] = useState({
    plan_title: false,
    plan_description: false,
    plan_days: false,
    expiry_days: false,
    plan_price: false,
  });

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchPlans();
    }
  }, [selectedCategory, currentPage, searchTerm]);

  const fetchServices = async () => {
    try {
      const token = Cookies.get("authToken");
      const response = await axios.post(
        `${serverEndPoint}/all_services`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setServices(response.data.services_details);
      setLoading(false);
    } catch (error) {
      handleError(error);
    }
  };

  const fetchPlans = async () => {
    if (!selectedCategory) return;

    const token = Cookies.get("authToken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    try {
      setLoading(true);
      const response = await axios.post(
        `${serverEndPoint}/get_recharge_plans`,
        {
          category_id: selectedCategory,
          page: currentPage,
          limit: 10,
          search: searchTerm,
        },
        config
      );

      setPlans(response.data.plans);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error("Error fetching plans:", error);
      toast.error("Failed to fetch plans");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = () => {
    setSearchTerm(searchQuery);
    setCurrentPage(1);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  const handleError = (error) => {
    toast.error(error.response?.data?.message || "An error occurred");
    setLoading(false);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleOpenDialog = () => {
    if (!selectedCategory) {
      toast.error("Please select a service first");
      return;
    }

    setSelectedPlan({
      recharge_plan_id: "",
      plan_title: "",
      plan_description: "",
      plan_days: "",
      expiry_days: "",
      plan_price: "",
      category_id: selectedCategory, // Make sure this is set
      vehicle_id: "1",
    });
    setIsEditMode(false);
    setOpenDialog(true);
  };

  const handleEditClick = (plan) => {
    setSelectedPlan(plan);
    setIsEditMode(true);
    setOpenDialog(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedPlan((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const savePlanDetails = async () => {
    setBtnLoading(true);

    const newErrors = {
      plan_title: !selectedPlan.plan_title,
      plan_description: !selectedPlan.plan_description,
      plan_days: !selectedPlan.plan_days,
      expiry_days: !selectedPlan.expiry_days,
      plan_price: !selectedPlan.plan_price,
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      toast.error("Please fill all required fields");
      setBtnLoading(false);
      return;
    }

    try {
      const token = Cookies.get("authToken");
      const endpoint = isEditMode
        ? `${serverEndPoint}/update_recharge_plan`
        : `${serverEndPoint}/add_recharge_plan`;

      const response = await axios.post(endpoint, selectedPlan, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        toast.success(
          isEditMode ? "Plan updated successfully!" : "Plan added successfully!"
        );
        fetchPlans();
        setOpenDialog(false);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setBtnLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <Container fluid>
      <Row className="m-1">
        <Col xs={12}>
          <h4 className="main-title">Recharge Plans Management</h4>
          <Card className="shadow-lg border-0 rounded-lg">
            <CardBody>
              <div className="d-flex justify-content-between mb-3">
                <FormControl style={{ minWidth: 200 }}>
                  <InputLabel>Select Service</InputLabel>
                  <Select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    label="Select Service"
                  >
                    {services.map((service) => (
                      <MenuItem
                        key={service.category_id}
                        value={service.category_id}
                      >
                        {service.category_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOpenDialog} // Change this from the inline function
                  disabled={!selectedCategory} // Add this to prevent clicking without selection
                >
                  Add New Plan
                </Button>
              </div>

              <div className="mb-3 d-flex">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by Plan Title or Description"
                  value={searchQuery}
                  onChange={handleSearch}
                  onKeyPress={handleKeyPress}
                />
                <button
                  className="btn btn-primary ms-2"
                  onClick={handleSearchSubmit}
                >
                  Search
                </button>
              </div>

              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Days</th>
                      <th>Price</th>
                      <th>Last Updated</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plans.map((plan) => (
                      <tr key={plan.recharge_plan_id}>
                        <td>{plan.plan_title}</td>
                        <td>{plan.plan_description}</td>
                        <td>{plan.plan_days} days</td>
                        <td>₹{plan.plan_price}</td>
                        <td>
                          {format(
                            new Date(plan.plan_epoch * 1000),
                            "dd MMM yyyy"
                          )}
                        </td>
                        <td>
                          <IconButton onClick={() => handleEditClick(plan)}>
                            <Icon color="primary">edit</Icon>
                          </IconButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pagination-controls d-flex justify-content-end align-items-center mt-3">
                <button
                  className="btn btn-outline-secondary me-2"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span className="mx-2">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="btn btn-outline-secondary ms-2"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <Box p={3}>
          <Typography variant="h6" gutterBottom>
            {isEditMode ? "Edit Plan" : "Add New Plan"}
          </Typography>

          <TextField
            label="Plan Title"
            fullWidth
            margin="normal"
            name="plan_title"
            value={selectedPlan.plan_title}
            onChange={handleInputChange}
            error={errors.plan_title}
            helperText={errors.plan_title ? "Plan title is required" : ""}
          />

          <TextField
            label="Description"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            name="plan_description"
            value={selectedPlan.plan_description}
            onChange={handleInputChange}
            error={errors.plan_description}
            helperText={
              errors.plan_description ? "Description is required" : ""
            }
          />

          <TextField
            label="Plan Days"
            fullWidth
            margin="normal"
            type="number"
            name="plan_days"
            value={selectedPlan.plan_days}
            onChange={handleInputChange}
            error={errors.plan_days}
            helperText={errors.plan_days ? "Plan days is required" : ""}
          />

          <TextField
            label="Expiry Days"
            fullWidth
            margin="normal"
            type="number"
            name="expiry_days"
            value={selectedPlan.expiry_days}
            onChange={handleInputChange}
            error={errors.expiry_days}
            helperText={errors.expiry_days ? "Expiry days is required" : ""}
          />

          <TextField
            label="Plan Price"
            fullWidth
            margin="normal"
            type="number"
            name="plan_price"
            value={selectedPlan.plan_price}
            onChange={handleInputChange}
            error={errors.plan_price}
            helperText={errors.plan_price ? "Plan price is required" : ""}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">₹</InputAdornment>
              ),
            }}
          />

          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button
              onClick={() => setOpenDialog(false)}
              sx={{ marginRight: 1 }}
            >
              Cancel
            </Button>
            <LoadingButton
              loading={btnLoading}
              variant="contained"
              color="primary"
              onClick={savePlanDetails}
            >
              {isEditMode ? "Update" : "Save"}
            </LoadingButton>
          </Box>
        </Box>
      </Dialog>
    </Container>
  );
};

export default RechargePlans;
