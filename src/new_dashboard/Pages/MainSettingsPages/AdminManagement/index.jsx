import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Card, CardBody, Row, Col } from "reactstrap";
import {
  Button,
  Dialog,
  TextField,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControlLabel,
  Checkbox,
  DialogActions,
  DialogContentText,
  DialogContent,
  DialogTitle,
  Dialog as MuiDialog,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";
import { serverEndPoint } from "../../../../dashboard/app/constants";
import Loader from "../../../Components/Loader";

const BranchAdmins = () => {
  const { cityId, branchId, branchName } = useParams();
  const [loading, setLoading] = useState(true);
  const [admins, setAdmins] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);

  const handleDeleteClick = (admin) => {
    setAdminToDelete(admin);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setAdminToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = Cookies.get("authToken");
      const response = await axios.post(
        `${serverEndPoint}/delete_admin`,
        { admin_id: adminToDelete.admin_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Admin deleted successfully");
        fetchAdmins();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete admin");
    } finally {
      setDeleteDialogOpen(false);
      setAdminToDelete(null);
    }
  };

  const [formData, setFormData] = useState({
    admin_id: null,
    admin_name: "",
    email: "",
    mobile_no: "",
    admin_role: "Manager",
    password: "",
    can_read: true,
    can_write: false,
    can_delete: false,
  });

  const roles = ["Super Admin", "Admin", "Manager"];

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("authToken");
      const response = await axios.post(
        `${serverEndPoint}/get_branch_admins`,
        { branch_id: branchId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAdmins(response.data.admins);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch admins");
    } finally {
      setLoading(false);
    }
  };

  const handleEditAdmin = (admin) => {
    setIsEditing(true);
    setFormData({
      ...admin,
      password: "", // Don't set password when editing
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setIsEditing(false);
    setFormData({
      admin_id: null,
      admin_name: "",
      email: "",
      mobile_no: "",
      admin_role: "Manager",
      password: "",
      can_read: true,
      can_write: false,
      can_delete: false,
    });
  };

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: e.target.type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    if (!formData.admin_name.trim()) return "Admin name is required";
    if (!formData.email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      return "Invalid email format";
    if (!formData.mobile_no.trim()) return "Mobile number is required";
    if (!/^\+?[\d-]{10,}$/.test(formData.mobile_no))
      return "Invalid mobile number";
    if (!formData.password && !isEditing)
      return "Password is required for new admin";
    return null;
  };

  const handleSubmit = async () => {
    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }

    setBtnLoading(true);
    try {
      const token = Cookies.get("authToken");
      const endpoint = isEditing ? "update_admin" : "add_branch_admin";

      const response = await axios.post(
        `${serverEndPoint}/${endpoint}`,
        {
          ...formData,
          branch_id: branchId,
          city_id: cityId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success(
          isEditing ? "Admin updated successfully" : "Admin added successfully"
        );
        fetchAdmins();
        handleCloseDialog();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setBtnLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, [branchId]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <ToastContainer position="top-right" />
      <Container fluid>
        <Row className="m-1">
          <Col xs={12}>
            <h4 className="main-title">Branch Admins - {branchName}</h4>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenDialog(true)}
              className="mt-3 mb-3"
            >
              Add New Admin
            </Button>
          </Col>
        </Row>

        <Card className="shadow-lg border-0 rounded-lg">
          <CardBody>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Mobile</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Permissions</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {admins.map((admin) => (
                    <TableRow key={admin.admin_id}>
                      <TableCell>{admin.admin_name}</TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell>{admin.mobile_no}</TableCell>
                      <TableCell>{admin.admin_role}</TableCell>
                      <TableCell>
                        {[
                          admin.can_read && "Read",
                          admin.can_write && "Write",
                          admin.can_delete && "Delete",
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Edit Admin">
                          <IconButton
                            color="primary"
                            onClick={() => handleEditAdmin(admin)}
                            className="me-2"
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        {admin.admin_role !== "Super Admin" && (
                          <Tooltip title="Delete Admin">
                            <IconButton
                              color="error"
                              onClick={() => handleDeleteClick(admin)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardBody>
        </Card>

        {/* Admin Form Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <Box p={3}>
            <Typography variant="h6" gutterBottom>
              {isEditing ? "Edit Admin" : "Add New Admin"}
            </Typography>

            <TextField
              label="Admin Name"
              fullWidth
              margin="normal"
              name="admin_name"
              value={formData.admin_name}
              onChange={handleInputChange}
              required
            />

            <TextField
              label="Email"
              fullWidth
              margin="normal"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />

            <TextField
              label="Mobile Number"
              fullWidth
              margin="normal"
              name="mobile_no"
              value={formData.mobile_no}
              onChange={handleInputChange}
              required
            />

            {!isEditing && (
              <TextField
                label="Password"
                fullWidth
                margin="normal"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            )}

            <FormControl fullWidth margin="normal">
              <InputLabel>Role</InputLabel>
              <Select
                name="admin_role"
                value={formData.admin_role}
                onChange={handleInputChange}
                label="Role"
              >
                {roles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography variant="subtitle1" className="mt-3 mb-2">
              Permissions
            </Typography>

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.can_read}
                  onChange={handleInputChange}
                  name="can_read"
                />
              }
              label="Can Read"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.can_write}
                  onChange={handleInputChange}
                  name="can_write"
                />
              }
              label="Can Write"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.can_delete}
                  onChange={handleInputChange}
                  name="can_delete"
                />
              }
              label="Can Delete"
            />

            <Box mt={3} display="flex" justifyContent="flex-end">
              <Button
                onClick={handleCloseDialog}
                variant="outlined"
                color="secondary"
                className="me-2"
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

        <MuiDialog
          open={deleteDialogOpen}
          onClose={handleDeleteCancel}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete admin {adminToDelete?.admin_name}?
              This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleDeleteCancel}
              color="primary"
              variant="outlined"
            >
              Cancel
            </Button>
            <LoadingButton
              onClick={handleDeleteConfirm}
              color="error"
              variant="contained"
              autoFocus
            >
              Delete
            </LoadingButton>
          </DialogActions>
        </MuiDialog>
      </Container>
    </div>
  );
};

export default BranchAdmins;
