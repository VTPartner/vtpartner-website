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
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";
import { format } from "date-fns";

import { serverEndPoint } from "../../../../dashboard/app/constants";
import Loader from "../../../Components/Loader";

const CancelReasons = () => {
  const [loading, setLoading] = useState(true);
  const [reasons, setReasons] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedReason, setSelectedReason] = useState({
    reason_id: "",
    reason: "",
    category_id: "",
  });

  const [errors, setErrors] = useState({
    reason: false,
  });

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchReasons();
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

  const fetchReasons = async () => {
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
        `${serverEndPoint}/get_cancel_reasons`,
        {
          category_id: selectedCategory,
          page: currentPage,
          limit: 10,
          search: searchTerm,
        },
        config
      );

      setReasons(response.data.reasons);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error("Error fetching reasons:", error);
      toast.error("Failed to fetch cancel reasons");
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

    setSelectedReason({
      reason_id: "",
      reason: "",
      category_id: selectedCategory,
    });
    setIsEditMode(false);
    setOpenDialog(true);
  };

  const handleEditClick = (reason) => {
    setSelectedReason(reason);
    setIsEditMode(true);
    setOpenDialog(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedReason((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveReasonDetails = async () => {
    setBtnLoading(true);

    const newErrors = {
      reason: !selectedReason.reason,
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
        ? `${serverEndPoint}/update_cancel_reason`
        : `${serverEndPoint}/add_cancel_reason`;

      const response = await axios.post(endpoint, selectedReason, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        toast.success(
          isEditMode
            ? "Reason updated successfully!"
            : "Reason added successfully!"
        );
        fetchReasons();
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
          <h4 className="main-title">Cancel Reasons Management</h4>
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
                  onClick={handleOpenDialog}
                  disabled={!selectedCategory}
                >
                  Add New Reason
                </Button>
              </div>

              <div className="mb-3 d-flex">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search reasons"
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
                      <th>Reason</th>
                      <th>Last Updated</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reasons.map((reason) => (
                      <tr key={reason.reason_id}>
                        <td>{reason.reason}</td>
                        <td>
                          {format(
                            new Date(reason.last_updated_epoch * 1000),
                            "dd MMM yyyy"
                          )}
                        </td>
                        <td>
                          <IconButton onClick={() => handleEditClick(reason)}>
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
            {isEditMode ? "Edit Cancel Reason" : "Add New Cancel Reason"}
          </Typography>

          <TextField
            label="Reason"
            fullWidth
            margin="normal"
            name="reason"
            value={selectedReason.reason}
            onChange={handleInputChange}
            error={errors.reason}
            helperText={errors.reason ? "Reason is required" : ""}
            multiline
            rows={3}
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
              onClick={saveReasonDetails}
            >
              {isEditMode ? "Update" : "Save"}
            </LoadingButton>
          </Box>
        </Box>
      </Dialog>
    </Container>
  );
};

export default CancelReasons;
