/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Card, CardBody, Row, Col } from "reactstrap";
import {
  Box,
  Chip,
  TextField,
  Button,
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

const ServicePlanUpgrades = () => {
  const { serviceId, subCatId, serviceName, subCatName } = useParams();
  const [loading, setLoading] = useState(true);
  const [upgrades, setUpgrades] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [upgradeToDelete, setUpgradeToDelete] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUpgrade, setSelectedUpgrade] = useState(null);
  const [formData, setFormData] = useState({
    upgrade_name: "",
    price: "",
  });
  const [formErrors, setFormErrors] = useState({
    upgrade_name: false,
    price: false,
  });
  const [btnLoading, setBtnLoading] = useState(false);

  const fetchUpgrades = async () => {
    try {
      const token = Cookies.get("authToken");
      const response = await axios.post(
        `${serverEndPoint}/get_service_plan_upgrades`,
        {
          service_id: serviceId === "-1" ? -1 : serviceId,
          sub_cat_id: subCatId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUpgrades(response.data.upgrades || []);
    } catch (error) {
      console.error("Error fetching upgrades:", error);

      if (error.response) {
        // Server responded with an error
        switch (error.response.status) {
          case 400:
            toast.error(
              error.response.data.message || "Invalid request parameters"
            );
            break;
          case 404:
            toast.info("No upgrade plans found");
            setUpgrades([]);
            break;
          case 500:
            toast.error("Server error. Please try again later");
            break;
          default:
            toast.error("Failed to fetch service plan upgrades");
        }
      } else if (error.request) {
        // Request was made but no response
        toast.error("Unable to reach the server. Please try again later");
      } else {
        // Error in request setup
        toast.error("Error preparing the request. Please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpgrades();
  }, [serviceId, subCatId]);

  const handleAddUpgrade = () => {
    setIsEditing(false);
    setSelectedUpgrade(null);
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

  const handleEditUpgrade = (upgrade) => {
    setIsEditing(true);
    setSelectedUpgrade(upgrade);
    setFormData({
      upgrade_name: upgrade.upgrade_name,
      price: upgrade.price,
    });
    setFormErrors({
      upgrade_name: false,
      price: false,
    });
    setOpenDialog(true);
  };

  const handleDeleteClick = (upgrade) => {
    setUpgradeToDelete(upgrade);
    setDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!upgradeToDelete) return;

    try {
      const token = Cookies.get("authToken");
      const response = await axios.post(
        `${serverEndPoint}/delete_service_plan_upgrade`,
        {
          plan_upgrade_id: upgradeToDelete.plan_upgrade_id,
          service_id: serviceId === "-1" ? -1 : serviceId,
          sub_cat_id: subCatId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.error("Service plan upgrade deleted successfully");
        await fetchUpgrades();
      }
    } catch (error) {
      console.error("Error deleting upgrade:", error);
      toast.error("Failed to delete service plan upgrade");
    } finally {
      setDeleteDialog(false);
      setUpgradeToDelete(null);
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
        ? "update_service_plan_upgrade"
        : "add_service_plan_upgrade";

      const requestData = {
        service_id: serviceId === -1 ? null : serviceId,
        sub_cat_id: subCatId,
        upgrade_name: formData.upgrade_name.trim(),
        price: parseFloat(formData.price),
        ...(isEditing && { plan_upgrade_id: selectedUpgrade.plan_upgrade_id }),
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
            ? "Service plan upgrade updated successfully"
            : "Service plan upgrade added successfully"
        );
        await fetchUpgrades();
        setOpenDialog(false);
      }
    } catch (error) {
      console.error("Error saving upgrade:", error);
      toast.error(
        error.response?.data?.message || "Failed to save service plan upgrade"
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
          <h4 className="main-title">
            Service Plan Upgrades -{" "}
            {serviceName !== "NA" ? `${serviceName} - ` : ""}
            {subCatName}
          </h4>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddUpgrade}
            className="mt-3 mb-3"
          >
            Add Plan Upgrade
          </Button>
        </Col>
      </Row>

      <Card className="shadow-lg border-0 rounded-lg">
        <CardBody>
          <Box display="flex" flexWrap="wrap" gap={2}>
            {upgrades.map((upgrade) => (
              <Chip
                key={upgrade.plan_upgrade_id}
                label={`${upgrade.upgrade_name}: ₹${upgrade.price}`}
                variant="outlined"
                color="primary"
                deleteIcon={
                  <Box display="flex">
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditUpgrade(upgrade);
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
                          handleDeleteClick(upgrade);
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
          {isEditing ? "Edit Plan Upgrade" : "Add Plan Upgrade"}
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
            Are you sure you want to delete the plan upgrade "
            {upgradeToDelete?.upgrade_name}"?
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

export default ServicePlanUpgrades;
