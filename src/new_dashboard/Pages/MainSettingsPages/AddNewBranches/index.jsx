/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { Button, Card, CardBody, Container, Row, Col } from "reactstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import {
  Box,
  Dialog,
  TextField,
  Typography,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  InputAdornment,
  InputLabel,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { ToastContainer, toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import "react-toastify/dist/ReactToastify.css";
import { format } from "date-fns";
import { useLoadScript } from "@react-google-maps/api";
import Loader from "../../../Components/Loader";
import { mapKey, serverEndPoint } from "../../../../dashboard/app/constants";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

const libraries = ["places"];

const AllCityBranches = () => {
  const { cityId, cityName } = useParams();
  const [loading, setLoading] = useState(true);
  const [branches, setBranches] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const locationInputRef = useRef(null);
  const [locationPlaceId, setLocationPlaceId] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: mapKey,
    libraries,
  });

  const [formData, setFormData] = useState({
    branch_name: "",
    location: "",
    branch_status: "Active",
    branch_id: null,
    city_id: cityId,
  });

  const validateForm = () => {
    const errors = {};
    if (!formData.branch_name.trim()) {
      errors.branch_name = "Branch name is required";
    }
    if (!formData.location.trim()) {
      errors.location = "Location is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Initialize Google Places Autocomplete
  useEffect(() => {
    if (isLoaded && locationInputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        locationInputRef.current,
        {
          componentRestrictions: { country: "IN" },
          fields: [
            "address_components",
            "geometry",
            "name",
            "formatted_address",
          ],
          types: ["establishment", "geocode"],
        }
      );

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.formatted_address) {
          setFormData((prev) => ({
            ...prev,
            location: place.formatted_address,
          }));
          setLocationPlaceId(place.place_id);
        }
      });
    }
  }, [isLoaded, openDialog]);

  const handleManageAdmins = (branch) => {
    navigate(
      `/dashboard/branch-admins/${cityId}/${branch.branch_id}/${branch.branch_name}`
    );
  };

  const handleLocationSuggestionClick = async (suggestion) => {
    setLocationPlaceId(suggestion.place_id);
    setFormData((prev) => ({
      ...prev,
      location: suggestion.description,
    }));
    setLocationSuggestions([]);

    // Get detailed place information
    if (isLoaded) {
      const geocoder = new window.google.maps.Geocoder();
      try {
        const response = await geocoder.geocode({
          placeId: suggestion.place_id,
        });
        if (response.results?.[0]) {
          const place = response.results[0];
          console.log("Selected place details:", place);
        }
      } catch (error) {
        console.error("Error fetching place details:", error);
      }
    }
  };

  const fetchBranches = async () => {
    const token = Cookies.get("authToken");
    try {
      setLoading(true);
      const response = await axios.post(
        `${serverEndPoint}/get_city_branches`,
        { city_id: cityId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setBranches(response.data.branches);
    } catch (error) {
      console.error("Error fetching branches:", error);
      toast.error("Failed to fetch branches");
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewBranch = () => {
    setIsEditing(false);
    setFormData({
      branch_name: "",
      location: "",
      branch_status: "Active",
      branch_id: null,
      city_id: cityId,
    });
    setFormErrors({});
    setOpenDialog(true);
  };

  const handleEditBranch = (branch) => {
    setIsEditing(true);
    setSelectedBranch(branch);
    setFormData({
      branch_name: branch.branch_name,
      location: branch.location,
      branch_status: branch.branch_status,
      branch_id: branch.branch_id,
      city_id: cityId,
    });
    setFormErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBranch(null);
    setFormErrors({});
    setLocationSuggestions([]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setBtnLoading(true);
    try {
      const token = Cookies.get("authToken");
      const endpoint = isEditing ? "update_branch" : "add_branch";

      const response = await axios.post(
        `${serverEndPoint}/${endpoint}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success(
          isEditing
            ? "Branch updated successfully"
            : "Branch added successfully"
        );
        fetchBranches();
        handleCloseDialog();
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        isEditing ? "Failed to update branch" : "Failed to add branch"
      );
    } finally {
      setBtnLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, [cityId]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <ToastContainer position="top-right" />
      <Container fluid>
        {/* Header Section */}
        <Row className="m-1">
          <Col xs={12}>
            <h4 className="main-title">Branches - {cityName}</h4>
            <Button
              color="primary"
              className="mt-3 mb-3"
              onClick={handleAddNewBranch}
            >
              Add New Branch
            </Button>
          </Col>
        </Row>

        {/* Branches Table */}
        <Row>
          <Col xs={12}>
            <Card className="shadow-lg border-0 rounded-lg">
              <CardBody>
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Branch ID</th>
                        <th>Branch Name</th>
                        <th>Location</th>
                        <th>Status</th>
                        <th>Registration Date</th>
                        <th>Last Updated</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {branches.map((branch) => (
                        <tr key={branch.branch_id}>
                          <td>{branch.branch_id}</td>
                          <td>{branch.branch_name}</td>
                          <td>{branch.location}</td>
                          <td>
                            <span
                              className={`badge bg-${
                                branch.branch_status === "Active"
                                  ? "success"
                                  : "danger"
                              }`}
                            >
                              {branch.branch_status}
                            </span>
                          </td>
                          <td>
                            {format(new Date(branch.reg_date), "dd/MM/yyyy")}
                          </td>
                          <td>
                            {format(
                              new Date(branch.creation_time * 1000),
                              "dd/MM/yyyy HH:mm:ss"
                            )}
                          </td>
                          <td>
                            <Tooltip title="Edit Branch">
                              <IconButton
                                onClick={() => handleEditBranch(branch)}
                                color="primary"
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Manage Admins">
                              <IconButton
                                onClick={() => handleManageAdmins(branch)}
                                color="secondary"
                              >
                                <PersonAddIcon />
                              </IconButton>
                            </Tooltip>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Add/Edit Branch Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <Box p={3}>
          <Typography variant="h6" gutterBottom>
            {isEditing ? "Edit Branch" : "Add New Branch"}
          </Typography>

          <TextField
            label="Branch Name"
            fullWidth
            margin="normal"
            name="branch_name"
            value={formData.branch_name}
            onChange={handleInputChange}
            error={Boolean(formErrors.branch_name)}
            helperText={formErrors.branch_name}
            required
          />

          {/* Location field with Google Places Autocomplete */}
          <div className="relative">
            <TextField
              inputRef={locationInputRef}
              label="Location"
              fullWidth
              margin="normal"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              error={Boolean(formErrors.location)}
              helperText={formErrors.location}
              required
              autoComplete="off"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOnIcon
                      style={{ color: "gray", fontSize: "20px" }}
                    />
                  </InputAdornment>
                ),
              }}
            />

            {/* Location Suggestions Dropdown */}
            {locationSuggestions.length > 0 && (
              <ul className="absolute z-10 w-full bg-white shadow-lg rounded-md mt-1 max-h-60 overflow-auto">
                {locationSuggestions.map((suggestion) => (
                  <li
                    key={suggestion.place_id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => handleLocationSuggestionClick(suggestion)}
                  >
                    {suggestion.description}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Status Select for Edit Mode */}
          {isEditing && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                name="branch_status"
                value={formData.branch_status}
                onChange={handleInputChange}
                label="Status"
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          )}

          {/* Dialog Actions */}
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button
              onClick={handleCloseDialog}
              style={{ marginRight: "8px" }}
              variant="outlined"
              color="secondary"
            >
              Cancel
            </Button>
            <LoadingButton
              onClick={handleSubmit}
              loading={btnLoading}
              variant="contained"
              color="primary"
            >
              {isEditing ? "Update" : "Save"}
            </LoadingButton>
          </Box>
        </Box>
      </Dialog>
    </div>
  );
};

export default AllCityBranches;
