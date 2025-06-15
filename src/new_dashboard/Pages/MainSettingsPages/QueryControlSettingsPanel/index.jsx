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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import { serverEndPoint } from "../../../../dashboard/app/constants";

const APP_TYPES = [
  "MOB_CUST",
  "MOB_AGENT_GOODS",
  "MOB_AGENT_CAB",
  "MOB_AGENT_JCB",
  "MOB_AGENT_DRIVER",
  "MOB_AGENT_HANDYMAN",
];

const QueryControlSettings = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [selectedAppName, setSelectedAppName] = useState("");

  const [selectedQuery, setSelectedQuery] = useState({
    query_master_id: "",
    app_name: "",
    query_id: "",
    query: "",
    description: "",
    change_logs: "",
    modified_by: "1",
  });

  const [errors, setErrors] = useState({
    app_name: false,
    query_id: false,
    query: false,
    description: false,
    change_logs: false,
  });

  useEffect(() => {
    if (selectedAppName) {
      fetchQueriesByApp(selectedAppName);
    } else {
      setQueries([]);
    }
  }, [selectedAppName]);

  const fetchQueriesByApp = async (appName) => {
    setLoading(true);
    try {
      const token = Cookies.get("authToken");
      const response = await axios.post(
        `${serverEndPoint}/get_all_master_queries`,
        { app_name: appName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setQueries(response.data.control_settings || []);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAppChange = (event) => {
    setSelectedAppName(event.target.value);
  };

  const handleOpenDialog = () => {
    setSelectedQuery({
      query_master_id: "",
      app_name: selectedAppName,
      query_id: "",
      query: "",
      description: "",
      change_logs: "",
      modified_by: "1",
    });
    setIsEditMode(false);
    setOpenDialog(true);
  };

  const handleEditClick = (query) => {
    setSelectedQuery(query);
    setIsEditMode(true);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setErrors({
      app_name: false,
      query_id: false,
      query: false,
      description: false,
      change_logs: false,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedQuery((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setBtnLoading(true);

    const newErrors = {
      app_name: !selectedQuery.app_name,
      query_id: !selectedQuery.query_id,
      query: !selectedQuery.query,
      description: !selectedQuery.description,
      change_logs: !selectedQuery.change_logs,
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      setBtnLoading(false);
      return;
    }

    try {
      const token = Cookies.get("authToken");
      const endpoint = isEditMode ? "edit_master_query" : "add_master_query";

      const response = await axios.post(
        `${serverEndPoint}/${endpoint}`,
        selectedQuery,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      if (response.data.message === "No settings found") {
        queries.length = 0; // Clear the queries if no settings found
      }
      toast.success(response.data.message);
      handleCloseDialog();
      fetchQueriesByApp(selectedAppName);
    } catch (error) {
      handleError(error);
    } finally {
      setBtnLoading(false);
    }
  };

  const handleError = (error) => {
    if (error.response) {
      if (error.response.status === 404) {
        queries.length = 0; // Clear the queries if no settings found
      } else if (error.response.status === 409) {
        toast.error("Query ID already exists");
      } else {
        toast.error(error.response.data.message || "An error occurred");
      }
    } else {
      toast.error("Network error occurred");
    }
  };

  return (
    <div>
      <ToastContainer position="top-right" />
      <Container fluid>
        <Row className="m-1">
          <Col xs={12}>
            <h4 className="main-title">Query Settings</h4>
            <ul className="app-line-breadcrumbs mb-3">
              <li className="">
                <a href="#" className="f-s-14 f-w-500">
                  <span>
                    <i className="ph-duotone ph-database f-s-16"></i> Settings
                  </span>
                </a>
              </li>
              <li className="active mt-2">
                <a href="#" className="f-s-14 f-w-500">
                  Query Control Settings
                </a>
              </li>
            </ul>
          </Col>
        </Row>

        <Row>
          <Col xs={12}>
            <Card className="shadow-lg border-0 rounded-lg">
              <CardBody>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography variant="h6">Query Master List</Typography>
                    <FormControl sx={{ minWidth: 200 }}>
                      <InputLabel>Select App</InputLabel>
                      <Select
                        value={selectedAppName}
                        onChange={handleAppChange}
                        label="Select App"
                      >
                        {APP_TYPES.map((app) => (
                          <MenuItem key={app} value={app}>
                            {app}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpenDialog}
                    disabled={!selectedAppName}
                  >
                    Add New Query
                  </Button>
                </Box>

                {loading ? (
                  <Box display="flex" justifyContent="center" p={3}>
                    <Typography>Loading...</Typography>
                  </Box>
                ) : queries.length === 0 ? (
                  <Box display="flex" justifyContent="center" p={3}>
                    <Typography color="textSecondary">
                      {selectedAppName
                        ? `No queries found for ${selectedAppName}`
                        : "Please select an app to view queries"}
                    </Typography>
                  </Box>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>App Name</th>
                          <th>Query ID</th>
                          <th>Query</th>
                          <th>Description</th>
                          <th>Change Logs</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {queries.map((query) => (
                          <tr key={query.query_master_id}>
                            <td>{query.app_name}</td>
                            <td>{query.query_id}</td>
                            <td>
                              <div
                                style={{
                                  maxWidth: "300px",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {query.query}
                              </div>
                            </td>
                            <td>{query.description}</td>
                            <td>{query.change_logs}</td>
                            <td>
                              <Tooltip title="Edit Query" arrow>
                                <IconButton
                                  onClick={() => handleEditClick(query)}
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
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <Box p={3}>
          <Typography variant="h6" gutterBottom>
            {isEditMode ? "Edit Query" : "Add New Query"}
          </Typography>

          <FormControl fullWidth margin="normal">
            <InputLabel>App Name</InputLabel>
            <Select
              name="app_name"
              value={selectedQuery.app_name}
              onChange={handleInputChange}
              error={errors.app_name}
              disabled={isEditMode}
            >
              {APP_TYPES.map((app) => (
                <MenuItem key={app} value={app}>
                  {app}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Query ID"
            name="query_id"
            value={selectedQuery.query_id}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            error={errors.query_id}
            helperText={errors.query_id ? "Query ID is required" : ""}
            disabled={isEditMode}
          />

          <TextField
            label="Query"
            name="query"
            value={selectedQuery.query}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            multiline
            rows={4}
            error={errors.query}
            helperText={errors.query ? "Query is required" : ""}
          />

          <TextField
            label="Description"
            name="description"
            value={selectedQuery.description}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            error={errors.description}
            helperText={errors.description ? "Description is required" : ""}
          />

          <TextField
            label="Change Logs"
            name="change_logs"
            value={selectedQuery.change_logs}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            multiline
            rows={2}
            error={errors.change_logs}
            helperText={errors.change_logs ? "Change logs are required" : ""}
          />

          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button onClick={handleCloseDialog} sx={{ marginRight: 1 }}>
              Cancel
            </Button>
            <LoadingButton
              loading={btnLoading}
              variant="contained"
              color="primary"
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

export default QueryControlSettings;
