/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
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
import {
  formatEpoch,
  serverEndPoint,
} from "../../../../dashboard/app/constants";
import Loader from "../../../Components/Loader";
import { format } from "date-fns";

const PeakHourPricing = () => {
  const [loading, setLoading] = useState(true);
  const [cities, setAllCities] = useState([]);
  const [peakHours, setPeakHours] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const { vehicle_id, vehicle_name } = useParams();
  const [selectedPeakHour, setSelectedPeakHour] = useState({
    peak_price_id: "",
    city_id: "",
    vehicle_id: "",
    price_per_km: "",
    start_time: null,
    end_time: null,
    status: 1,
  });

  const [errors, setErrors] = useState({
    city_id: false,
    price_per_km: false,
    start_time: false,
    end_time: false,
  });

  useEffect(() => {
    fetchAllCities();
    fetchPeakHours();
  }, []);

  const fetchAllCities = async () => {
    try {
      const token = Cookies.get("authToken");
      const response = await axios.post(
        `${serverEndPoint}/all_allowed_cities`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAllCities(response.data.cities);
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error) => {
    if (error.response) {
      if (error.response.status === 404) {
        toast.error("No Data Found.");
      } else if (error.response.status === 409) {
        toast.error("Sub Service Name already assigned.");
      } else if (error.response.status === 500) {
        toast.error("Internal server error. Please try again later.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } else {
      toast.error("Failed to fetch all FAQ's. Please check your connection.");
    }
    setLoading(false);
  };

  const fetchPeakHours = async () => {
    try {
      const token = Cookies.get("authToken");
      const response = await axios.post(
        `${serverEndPoint}/get_peak_hour_prices`,
        { vehicle_id: vehicle_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Peak Hours Response:", response.data);
      setPeakHours(response.data.peak_hours);
      setLoading(false);
    } catch (error) {
      handleError(error);
    }
  };

  const handleOpenDialog = () => {
    setSelectedPeakHour({
      peak_price_id: "",
      city_id: "",
      vehicle_id: "",
      price_per_km: "",
      start_time: null,
      end_time: null,
      status: 1,
    });
    setIsEditMode(false);
    setOpenDialog(true);
  };

  const handleEditClick = (peakHour) => {
    setSelectedPeakHour({
      ...peakHour,
      start_time: peakHour.start_time,
      end_time: peakHour.end_time,
    });
    setIsEditMode(true);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setErrors({
      city_id: false,
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
      city_id: !selectedPeakHour.city_id,
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
        ? `${serverEndPoint}/edit_peak_hour_price`
        : `${serverEndPoint}/add_peak_hour_price`;

      const formData = {
        peak_price_id: isEditMode ? selectedPeakHour.peak_price_id : "0",
        city_id: selectedPeakHour.city_id,
        vehicle_id: vehicle_id,
        price_per_km: selectedPeakHour.price_per_km,
        start_time: selectedPeakHour.start_time,
        end_time: selectedPeakHour.end_time,
        status: selectedPeakHour.status,
      };

      const response = await axios.post(endpoint, formData, {
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
        fetchPeakHours();
        handleCloseDialog();
      }
    } catch (error) {
      handleError(error);
    } finally {
      setBtnLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Container fluid>
      <ToastContainer position="top-right" />
      <Row>
        <Row className="m-1">
          <Col xs={12}>
            <h4 className="main-title">Peak Hour Pricing</h4>
            <ul className="app-line-breadcrumbs mb-3">
              <li className="">
                <a href="#" className="f-s-14 f-w-500">
                  <span>
                    <i className="ph-duotone  ph-stack f-s-16"></i> Vehicle
                  </span>
                </a>
              </li>

              <li className="active mt-2">
                <a href="#" className="f-s-14 f-w-500">
                  {vehicle_name}
                </a>
              </li>
            </ul>
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenDialog}
            >
              Add Peak Hour
            </Button>
          </Col>
        </Row>
        <Col xs={12}>
          <Card>
            <CardBody>
              <table className="table table-bottom-border align-middle mb-0">
                <thead>
                  <tr>
                    <th>City</th>
                    <th>Time Slot</th>
                    <th>Price per KM</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {peakHours.map((peak, index) => (
                    <tr key={index}>
                      <td>
                        <div className="d-flex align-items-center">
                          <img
                            src={peak.bg_image}
                            alt={peak.city_name}
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: 20,
                              marginRight: 10,
                            }}
                          />
                          {peak.city_name}
                        </div>
                      </td>
                      <td>
                        {format(
                          new Date(`2000-01-01T${peak.start_time}`),
                          "hh:mm a"
                        )}{" "}
                        -{" "}
                        {format(
                          new Date(`2000-01-01T${peak.end_time}`),
                          "hh:mm a"
                        )}
                      </td>
                      <td>₹{peak.price_per_km}/-</td>
                      <td>
                        <span
                          className={`badge bg-${
                            peak.status === 1 ? "success" : "danger"
                          }`}
                        >
                          {peak.status === 1 ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <IconButton onClick={() => handleEditClick(peak)}>
                          <Icon color="primary">edit</Icon>
                        </IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <Box p={3}>
          <Typography variant="h6" gutterBottom>
            {isEditMode ? "Edit Peak Hour" : "Add Peak Hour"}
          </Typography>

          <FormControl fullWidth margin="normal">
            <Autocomplete
              options={cities}
              getOptionLabel={(option) => option.city_name}
              value={
                cities.find(
                  (city) => city.city_id === selectedPeakHour.city_id
                ) || null
              }
              onChange={(event, newValue) => {
                handleInputChange({
                  target: {
                    name: "city_id",
                    value: newValue ? newValue.city_id : "",
                  },
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="City"
                  error={errors.city_id}
                  helperText={errors.city_id ? "Please select a city" : ""}
                  required
                />
              )}
            />
          </FormControl>

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
                  defaultHour: 0,
                  defaultMinute: 0,
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
                  defaultHour: 0,
                  defaultMinute: 0,
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

export default PeakHourPricing;
