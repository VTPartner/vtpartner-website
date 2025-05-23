import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  TextField,
  Typography,
  IconButton,
  Tooltip,
  Icon,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { toast, ToastContainer } from "react-toastify";

import { format } from "date-fns";
import axios from "axios";
import Cookies from "js-cookie";
import { serverEndPoint } from "../../../../dashboard/app/constants";
import { Card, CardBody, Col, Container, Row } from "reactstrap";

const ControlSettings = () => {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const [selectedSetting, setSelectedSetting] = useState({
    control_id: "",
    controller_name: "",
    values: "",
    admin_id: "1", // Default admin ID
  });

  const [errors, setErrors] = useState({
    controller_name: false,
    values: false,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = Cookies.get("authToken");
      const response = await axios.post(
        `${serverEndPoint}/get_all_control_settings`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setSettings(response.data.control_settings);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setSelectedSetting({
      control_id: "",
      controller_name: "",
      values: "",
      admin_id: "1",
    });
    setIsEditMode(false);
    setOpenDialog(true);
  };

  const handleEditClick = (setting) => {
    setSelectedSetting(setting);
    setIsEditMode(true);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setErrors({
      controller_name: false,
      values: false,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedSetting((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setBtnLoading(true);

    const newErrors = {
      controller_name: !selectedSetting.controller_name,
      values: !selectedSetting.values,
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      setBtnLoading(false);
      return;
    }

    try {
      const token = Cookies.get("authToken");
      const endpoint = isEditMode
        ? "edit_control_setting"
        : "add_control_setting";

      const response = await axios.post(
        `${serverEndPoint}/${endpoint}`,
        selectedSetting,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(response.data.message);
      handleCloseDialog();
      fetchSettings();
    } catch (error) {
      handleError(error);
    } finally {
      setBtnLoading(false);
    }
  };

  const handleError = (error) => {
    if (error.response) {
      if (error.response.status === 409) {
        toast.error("Controller name already exists");
      } else {
        toast.error(error.response.data.message || "An error occurred");
      }
    } else {
      toast.error("Network error occurred");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <ToastContainer position="top-right" />
      <Container fluid>
        <Row className="m-1">
          <Col xs={12}>
            <h4 className="main-title">Main Settings</h4>
            <ul className="app-line-breadcrumbs mb-3">
              <li className="">
                <a href="#" className="f-s-14 f-w-500">
                  <span>
                    <i className="ph-duotone ph-stack f-s-16"></i> Settings
                  </span>
                </a>
              </li>
              <li className="active mt-2">
                <a href="#" className="f-s-14 f-w-500">
                  Control Settings
                </a>
              </li>
            </ul>
          </Col>
        </Row>

        <Row>
          <Col xs={12}>
            <Card className="shadow-lg border-0 rounded-lg">
              <CardBody>
                <ul className="nav nav-tabs app-tabs-primary order-tabs d-flex justify-content-start border-0 mb-0 pb-0">
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link d-flex align-items-center gap-1 active"
                      role="tab"
                    >
                      <i className="ti ti-sort-descending-2 f-s-18 mg-b-3"></i>
                      All Settings
                    </button>

                    <Button
                      variant="contained"
                      color="primary"
                      className="mt-3"
                      sx={{ mb: 2 }}
                      onClick={handleOpenDialog}
                    >
                      Add New Setting
                    </Button>
                  </li>
                </ul>
              </CardBody>

              <div className="card-body order-tab-content p-0">
                <div className="order-list-table table-responsive app-scroll">
                  <table className="table table-bottom-border align-middle mb-0">
                    <thead>
                      <tr>
                        <th scope="col">Controller Name</th>
                        <th scope="col">Values</th>
                        <th scope="col">Last Updated</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {settings.map((setting) => (
                        <tr key={setting.control_id}>
                          <td>
                            <div className="ms-2">
                              <h6 className="mb-0 f-s-16">
                                {setting.controller_name}
                              </h6>
                            </div>
                          </td>
                          <td>
                            <p className="mb-0 f-s-12 text-secondary">
                              {setting.values}
                            </p>
                          </td>
                          <td>
                            <p className="mb-0 f-s-12 text-secondary">
                              {format(
                                new Date(setting.last_updated_time * 1000),
                                "dd/MM/yyyy, hh:mm:ss a"
                              )}
                            </p>
                          </td>
                          <td>
                            <Tooltip title="Edit Setting" arrow>
                              <IconButton
                                onClick={() => handleEditClick(setting)}
                              >
                                <Icon color="primary">edit</Icon>
                              </IconButton>
                            </Tooltip>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Dialog remains the same */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <Box p={3}>
          <Typography variant="h6" gutterBottom>
            {isEditMode ? "Edit Setting" : "Add New Setting"}
          </Typography>

          <TextField
            label="Controller Name"
            name="controller_name"
            value={selectedSetting.controller_name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            error={errors.controller_name}
            helperText={
              errors.controller_name ? "Controller name is required" : ""
            }
          />

          <TextField
            label="Values"
            name="values"
            value={selectedSetting.values}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            multiline
            rows={4}
            error={errors.values}
            helperText={errors.values ? "Values are required" : ""}
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
              onClick={handleSubmit}
            >
              {isEditMode ? "Update" : "Save"}
            </LoadingButton>
          </Box>
        </Box>
      </Dialog>
    </div>
  );
};

export default ControlSettings;
