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
  Autocomplete,
  Icon,
  MenuItem,
  Pagination,
} from "@mui/material";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.css";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoadingButton } from "@mui/lab";
import { useParams } from "react-router-dom";
import { serverEndPoint } from "../../../../dashboard/app/constants";
import Loader from "../../../Components/Loader";
import { format } from "date-fns";

const PeakHourPincodeWisePricing = () => {
  // State declarations
  const [loading, setLoading] = useState(true);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [pincodes, setPincodes] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const { vehicle_id, vehicle_name } = useParams();

  // Pagination and Search states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;

  const [selectedPincode, setSelectedPincode] = useState(null);
  const [selectedPeakHour, setSelectedPeakHour] = useState({
    peak_price_id: "",
    pincode_id: "",
    vehicle_id: "",
    price_per_km: "",
    start_time: null,
    end_time: null,
    status: 1,
  });

  const [errors, setErrors] = useState({
    price_per_km: false,
    start_time: false,
    end_time: false,
  });

  // Effects
  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    if (selectedCity) {
      fetchPincodesByCity();
    }
  }, [selectedCity, page, searchQuery]);

  // API Calls
  const fetchCities = async () => {
    try {
      const token = Cookies.get("authToken");
      const response = await axios.post(
        `${serverEndPoint}/all_allowed_cities`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCities(response.data.cities);
      setLoading(false);
    } catch (error) {
      handleError(error);
    }
  };

  const fetchPincodesByCity = async () => {
    try {
      const token = Cookies.get("authToken");
      const response = await axios.post(
        `${serverEndPoint}/get_pincodes_with_peak_hours`,
        {
          city_id: selectedCity.city_id,
          vehicle_id: vehicle_id,
          page: page,
          limit: itemsPerPage,
          search: searchQuery,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPincodes(response.data.pincodes);
      setTotalPages(Math.ceil(response.data.total / itemsPerPage));
    } catch (error) {
      handleError(error);
    }
  };

  // Event Handlers
  const handleError = (error) => {
    if (error.response) {
      if (error.response.status === 404) {
        toast.error("No Data Found");
      } else if (error.response.status === 409) {
        toast.error("Time slot overlaps with existing peak hours");
      } else {
        toast.error("An unexpected error occurred");
      }
    } else {
      toast.error("Network error occurred");
    }
    setLoading(false);
  };

  const handleCityChange = (event, newValue) => {
    setSelectedCity(newValue);
    setPage(1);
    setSearchQuery("");
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    if (!value) {
      // If search is cleared, reload current page
      fetchPincodesByCity();
    } else {
      setPage(1);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleOpenDialog = (pincode, peakHour = null) => {
    setSelectedPincode(pincode);
    if (peakHour) {
      setSelectedPeakHour({
        ...peakHour,
        pincode_id: pincode.pincode_id,
        vehicle_id: vehicle_id,
      });
      setIsEditMode(true);
    } else {
      setSelectedPeakHour({
        peak_price_id: "",
        pincode_id: pincode.pincode_id,
        vehicle_id: vehicle_id,
        price_per_km: "",
        start_time: null,
        end_time: null,
        status: 1,
      });
      setIsEditMode(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPincode(null);
    setErrors({
      price_per_km: false,
      start_time: false,
      end_time: false,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedPeakHour((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTimeChange = (dates, field) => {
    if (dates && dates[0]) {
      setSelectedPeakHour((prev) => ({
        ...prev,
        [field]: format(dates[0], "HH:mm:ss"),
      }));
    }
  };

  const savePeakHourDetails = async () => {
    setBtnLoading(true);

    const newErrors = {
      price_per_km: !selectedPeakHour.price_per_km,
      start_time: !selectedPeakHour.start_time,
      end_time: !selectedPeakHour.end_time,
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      setBtnLoading(false);
      return;
    }

    try {
      const token = Cookies.get("authToken");
      const endpoint = isEditMode
        ? `${serverEndPoint}/edit_peak_hour_pincodewise_price`
        : `${serverEndPoint}/add_peak_hour_pincodewise_price`;

      const response = await axios.post(endpoint, selectedPeakHour, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        toast.success(
          isEditMode
            ? "Peak hour price updated successfully!"
            : "Peak hour price added successfully!"
        );
        fetchPincodesByCity();
        handleCloseDialog();
      }
    } catch (error) {
      handleError(error);
    } finally {
      setBtnLoading(false);
    }
  };

  // Render Methods
  const renderPeakHours = (pincode) => {
    if (!pincode.peak_hours?.length) {
      return <span className="text-muted">No peak hours set</span>;
    }

    return pincode.peak_hours.map((ph) => (
      <div key={ph.peak_price_id} className="d-flex align-items-center mb-2">
        <div>
          {format(new Date(`2000-01-01T${ph.start_time}`), "hh:mm a")} -{" "}
          {format(new Date(`2000-01-01T${ph.end_time}`), "hh:mm a")}
          <br />
          <small>₹{ph.price_per_km}/-</small>
        </div>
        <span
          className={`badge bg-${ph.status === 1 ? "success" : "danger"} ms-2`}
        >
          {ph.status === 1 ? "Active" : "Inactive"}
        </span>
        <IconButton size="small" onClick={() => handleOpenDialog(pincode, ph)}>
          <Icon fontSize="small" color="primary">
            edit
          </Icon>
        </IconButton>
      </div>
    ));
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Container fluid>
      <ToastContainer position="top-right" />

      {/* Header Section */}
      <Row className="mb-3">
        <Col xs={12}>
          <h4 className="main-title">Peak Hour Pricing</h4>
          <ul className="app-line-breadcrumbs mb-3">
            <li>
              <a href="#" className="f-s-14 f-w-500">
                <span>
                  <i className="ph-duotone ph-stack f-s-16"></i> Vehicle
                </span>
              </a>
            </li>
            <li className="active mt-2">
              <a href="#" className="f-s-14 f-w-500">
                {vehicle_name}
              </a>
            </li>
          </ul>
        </Col>
      </Row>

      {/* Search and Filter Section */}
      <Row className="mb-3">
        <Col md={6}>
          <Autocomplete
            options={cities}
            getOptionLabel={(option) => option.city_name}
            value={selectedCity}
            onChange={handleCityChange}
            renderInput={(params) => (
              <TextField {...params} label="Select City" fullWidth />
            )}
          />
        </Col>
        <Col md={6}>
          <TextField
            fullWidth
            label="Search Pincode"
            value={searchQuery}
            onChange={handleSearchChange}
            disabled={!selectedCity}
          />
        </Col>
      </Row>

      {/* Pincodes Table */}
      <Row>
        <Col xs={12}>
          <Card>
            <CardBody>
              <table className="table table-bottom-border align-middle mb-0">
                <thead>
                  <tr>
                    <th>Pincode</th>
                    <th>Peak Hours</th>
                    <th style={{ width: "100px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pincodes.map((pincode) => (
                    <tr key={pincode.pincode_id}>
                      <td>{pincode.pincode}</td>
                      <td>{renderPeakHours(pincode)}</td>
                      <td>
                        <IconButton
                          onClick={() => handleOpenDialog(pincode)}
                          color="primary"
                        >
                          <Icon>add</Icon>
                        </IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="pagination-controls d-flex justify-content-center align-items-center mt-3">
                {totalPages > 1 && (
                  <div className="card-footer bg-white border-top">
                    <Row className="align-items-center">
                      <Row className="text-end">
                        <Pagination
                          count={totalPages}
                          page={page}
                          onChange={handlePageChange}
                          color="primary"
                          variant="outlined"
                          shape="rounded"
                          size="large"
                          showFirstButton
                          showLastButton
                          siblingCount={1}
                          boundaryCount={1}
                        />
                      </Row>
                    </Row>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Peak Hour Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <Box p={3}>
          <Typography variant="h6" gutterBottom>
            {isEditMode ? "Edit Peak Hour" : "Add Peak Hour"}
            {selectedPincode && ` - ${selectedPincode.pincode}`}
          </Typography>

          <Box display="flex" gap={2} mt={2}>
            <FormControl fullWidth>
              <label>Start Time</label>
              <Flatpickr
                className="form-control"
                options={{
                  enableTime: true,
                  noCalendar: true,
                  dateFormat: "H:i",
                  time_24hr: true,
                }}
                value={selectedPeakHour.start_time}
                onChange={(dates) => handleTimeChange(dates, "start_time")}
              />
              {errors.start_time && (
                <small className="text-danger">Start time is required</small>
              )}
            </FormControl>

            <FormControl fullWidth>
              <label>End Time</label>
              <Flatpickr
                className="form-control"
                options={{
                  enableTime: true,
                  noCalendar: true,
                  dateFormat: "H:i",
                  time_24hr: true,
                }}
                value={selectedPeakHour.end_time}
                onChange={(dates) => handleTimeChange(dates, "end_time")}
              />
              {errors.end_time && (
                <small className="text-danger">End time is required</small>
              )}
            </FormControl>
          </Box>

          <TextField
            label="Price per KM"
            fullWidth
            margin="normal"
            name="price_per_km"
            type="number"
            value={selectedPeakHour.price_per_km}
            onChange={handleInputChange}
            error={errors.price_per_km}
            helperText={errors.price_per_km ? "Price per KM is required" : ""}
            inputProps={{ step: "0.01" }}
          />

          {isEditMode && (
            <FormControl fullWidth margin="normal">
              <TextField
                select
                label="Status"
                name="status"
                value={selectedPeakHour.status}
                onChange={handleInputChange}
              >
                <MenuItem value={1}>Active</MenuItem>
                <MenuItem value={0}>Inactive</MenuItem>
              </TextField>
            </FormControl>
          )}

          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button onClick={handleCloseDialog} sx={{ marginRight: 1 }}>
              Cancel
            </Button>
            <LoadingButton
              loading={btnLoading}
              variant="contained"
              color="primary"
              onClick={savePeakHourDetails}
            >
              {isEditMode ? "Update" : "Save"}
            </LoadingButton>
          </Box>
        </Box>
      </Dialog>
    </Container>
  );
};

export default PeakHourPincodeWisePricing;
