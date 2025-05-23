import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Card, CardBody, Row, Col } from "reactstrap";
import {
  Box,
  Chip,
  TextField,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  DialogContentText,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";
import { serverEndPoint } from "../../../../dashboard/app/constants";
import Loader from "../../../Components/Loader";

const VehicleUpgradePrices = () => {
  const { vehicleId, vehicleName } = useParams();
  const [loading, setLoading] = useState(true);
  const [prices, setPrices] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [priceToDelete, setPriceToDelete] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [formData, setFormData] = useState({
    upgrade_name: "",
    price: "",
  });
  const [formErrors, setFormErrors] = useState({
    upgrade_name: false,
    price: false,
  });
  const [btnLoading, setBtnLoading] = useState(false);

  const fetchUpgradePrices = async () => {
    try {
      const token = Cookies.get("authToken");
      const response = await axios.post(
        `${serverEndPoint}/get_vehicle_upgrade_prices`,
        { vehicle_id: vehicleId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPrices(response.data.upgrade_prices || []);
    } catch (error) {
      console.error("Error fetching prices:", error);
      toast.error("Failed to fetch upgrade prices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpgradePrices();
  }, [vehicleId]);

  const handleAddPrice = () => {
    setIsEditing(false);
    setSelectedPrice(null);
    setFormData({
      upgrade_name: "",
      price: "",
    });
    setFormErrors({
      upgrade_name: false,
      price: false,
    });
    setOpenDialog(true);
  };

  const handleEditPrice = (price) => {
    setIsEditing(true);
    setSelectedPrice(price);
    setFormData({
      upgrade_name: price.upgrade_name,
      price: price.price,
    });
    setFormErrors({
      upgrade_name: false,
      price: false,
    });
    setOpenDialog(true);
  };

  const handleDeleteClick = (price) => {
    setPriceToDelete(price);
    setDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!priceToDelete) return;

    try {
      const token = Cookies.get("authToken");
      const response = await axios.post(
        `${serverEndPoint}/delete_vehicle_upgrade_price`,
        {
          vehicle_id: vehicleId,
          upgrade_price_id: priceToDelete.upgrade_price_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Upgrade price deleted successfully");
        await fetchUpgradePrices();
      }
    } catch (error) {
      console.error("Error deleting price:", error);
      toast.error("Failed to delete upgrade price");
    } finally {
      setDeleteDialog(false);
      setPriceToDelete(null);
    }
  };

  const validateForm = () => {
    const errors = {
      upgrade_name: !formData.upgrade_name.trim(),
      price: !formData.price || formData.price <= 0,
    };
    setFormErrors(errors);
    return !Object.values(errors).some(Boolean);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    setBtnLoading(true);
    try {
      const token = Cookies.get("authToken");
      const endpoint = isEditing
        ? "update_vehicle_upgrade_price"
        : "add_vehicle_upgrade_price";

      const requestData = {
        vehicle_id: vehicleId,
        upgrade_name: formData.upgrade_name.trim(),
        price: parseFloat(formData.price),
        ...(isEditing && { upgrade_price_id: selectedPrice.upgrade_price_id }),
      };

      const response = await axios.post(
        `${serverEndPoint}/${endpoint}`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success(
          isEditing
            ? "Upgrade price updated successfully"
            : "Upgrade price added successfully"
        );
        await fetchUpgradePrices();
        setOpenDialog(false);
      }
    } catch (error) {
      console.error("Error saving price:", error);
      toast.error(
        error.response?.data?.message || "Failed to save upgrade price"
      );
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
      <Row className="m-1">
        <Col xs={12}>
          <h4 className="main-title">Upgrade Ride Prices - {vehicleName}</h4>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddPrice}
            className="mt-3 mb-3"
          >
            Add Upgrade Price
          </Button>
        </Col>
      </Row>

      <Card className="shadow-lg border-0 rounded-lg">
        <CardBody>
          <Box display="flex" flexWrap="wrap" gap={2}>
            {prices.map((price) => (
              <Chip
                key={price.upgrade_price_id}
                label={`${price.upgrade_name}: ₹${price.price}`}
                variant="outlined"
                color="primary"
                deleteIcon={
                  <Box display="flex">
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditPrice(price);
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(price);
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                }
                onDelete={() => {}}
                className="p-3"
              />
            ))}
          </Box>
        </CardBody>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {isEditing ? "Edit Upgrade Price" : "Add Upgrade Price"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Upgrade Name"
            fullWidth
            value={formData.upgrade_name}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                upgrade_name: e.target.value,
              }))
            }
            error={formErrors.upgrade_name}
            helperText={
              formErrors.upgrade_name ? "Upgrade name is required" : ""
            }
            required
          />
          <TextField
            margin="dense"
            label="Price (₹)"
            type="number"
            fullWidth
            value={formData.price}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                price: e.target.value,
              }))
            }
            error={formErrors.price}
            helperText={
              formErrors.price ? "Please enter a valid price amount" : ""
            }
            InputProps={{
              inputProps: { min: 0, step: "0.01" },
            }}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <LoadingButton
            onClick={handleSubmit}
            loading={btnLoading}
            variant="contained"
            color="primary"
          >
            {isEditing ? "Update" : "Add"}
          </LoadingButton>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the upgrade price "
            {priceToDelete?.upgrade_name}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default VehicleUpgradePrices;
