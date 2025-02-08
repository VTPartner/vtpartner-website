/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  TextField,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  Icon,
  Avatar,
  Tooltip,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";
import { styled } from "@mui/system";

import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";

import { Card, CardBody, Col, Container, Row } from "reactstrap";
import { Link } from "react-router-dom";
import Loader from "../../../Components/Loader";
import { serverEndPoint } from "../../../../dashboard/app/constants";

const AddFAQQuestionsPage = () => {
  const [activeTab, setActiveTab] = useState("connect-tab");
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const [loading, setLoading] = useState(true);

  const { category_id, category_name } = useParams();
  const [allFaqs, setFAQs] = useState([]);
  const [error, setError] = useState(null);
  const [openFAQDialog, setOpenFAQDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [selectedFAQ, setSelectedFAQ] = useState({
    faq_id: "",
    question: "",
    answer: "",
    epoch_time: "",
  });

  const [errorFAQ, setFaqErrors] = useState({
    faq_id: false,
    question: false,
    answer: false,
    epoch_time: false,
  });

  const [btnLoading, setBtnLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch all vehicles and vehicle types
  const fetchAllFAQs = async () => {
    // Check if the user is online
    if (!navigator.onLine) {
      toast.error("No internet connection. Please check your connection.");
      setLoading(false);
      return; // Exit if no internet connection
    }

    const token = Cookies.get("authToken");

    try {
      const response = await axios.post(
        `${serverEndPoint}/all_faqs`,
        {
          category_id: category_id,
        }, // Send an empty object as the body if needed
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update state with vehicle details
      setFAQs(response.data.all_faqs_details);
    } catch (error) {
      handleError(error); // Handle errors using your existing error handling function
    } finally {
      setLoading(false); // Ensure loading state is reset
    }
  };

  useEffect(() => {
    fetchAllFAQs();
  }, []);

  // Handle error responses
  const handleError = (error) => {
    if (error.response) {
      if (error.response.status === 404) {
        toast.error("No Data Found.");
        setError("No Data Found");
      } else if (error.response.status === 409) {
        toast.error("Sub Service Name already assigned.");
      } else if (error.response.status === 500) {
        toast.error("Internal server error. Please try again later.");
        setError("Internal Server Error");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
        setError("Unexpected Error");
      }
    } else {
      toast.error("Failed to fetch all FAQ's. Please check your connection.");
      setError("Network Error");
    }
    setLoading(false);
  };

  const handleOpenDialog = () => {
    setSelectedFAQ({
      faq_id: "",
      question: "",
      answer: "",
      epoch_time: "",
    });
    setIsEditMode(false);
    setOpenFAQDialog(true);
  };

  const navigate = useNavigate();

  const handleEditClick = (service) => {
    setSelectedFAQ(service);
    setIsEditMode(true);
    setOpenFAQDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenFAQDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedFAQ((prevState) => ({
      ...prevState,
      [name]: value, // Dynamically update the selected field
    }));
  };

  const saveFaqDetails = async () => {
    setBtnLoading(true);

    const newErrors = {
      question: !selectedFAQ.question,
      answer: !selectedFAQ.answer,
    };
    setFaqErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      setBtnLoading(false);
      return;
    }
    let serviceImageUrl = selectedFAQ.image;

    const token = Cookies.get("authToken");
    const endpoint = isEditMode
      ? `${serverEndPoint}/edit_new_faq`
      : `${serverEndPoint}/add_new_faq`;

    try {
      const formData = new FormData();

      // Append vehicle details to formData
      for (const key in selectedFAQ) {
        formData.append(key, selectedFAQ[key]);
      }

      const response = await axios.post(
        endpoint,
        {
          faq_id: isEditMode ? selectedFAQ.faq_id : "0",
          category_id: category_id,
          question: selectedFAQ.question,
          answer: selectedFAQ.answer,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success(
          isEditMode
            ? selectedFAQ.sub_cat_name + " FAQ updated successfully!"
            : selectedFAQ.sub_cat_name + " FAQ added successfully!"
        );
        fetchAllFAQs();
        handleCloseDialog();
      } else {
        toast.error("Failed to save Category.");
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
    <div>
      <Container fluid>
        <Row className="m-1">
          <Col xs={12}>
            <h4 className="main-title">Service Settings</h4>
            <ul className="app-line-breadcrumbs mb-3">
              <li className="">
                <a href="#" className="f-s-14 f-w-500">
                  <span>
                    <i className="ph-duotone  ph-stack f-s-16"></i> Service
                  </span>
                </a>
              </li>

              <li className="active mt-2">
                <a href="#" className="f-s-14 f-w-500">
                  {category_name}
                </a>
              </li>
            </ul>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Card className="shadow-lg border-0 rounded-lg">
              <CardBody>
                <ul
                  className="nav nav-tabs app-tabs-primary order-tabs d-flex justify-content-start border-0 mb-0 pb-0"
                  id="Outline"
                  role="tablist"
                >
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link d-flex align-items-center gap-1 ${
                        activeTab === "connect-tab" ? "active" : ""
                      }`}
                      id="connect-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#connect-tab-pane"
                      type="button"
                      role="tab"
                      aria-controls="connect-tab-pane"
                      aria-selected={activeTab === "connect-tab"}
                      onClick={() => handleTabClick("connect-tab")}
                    >
                      <i className="ti ti-sort-descending-2 f-s-18 mg-b-3"></i>{" "}
                      All FAQS
                    </button>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ mb: 2 }}
                      className="mt-3"
                      onClick={handleOpenDialog}
                    >
                      Add New FAQ
                    </Button>
                  </li>
                </ul>
              </CardBody>

              <div className="card-body order-tab-content p-0">
                <div className="tab-content" id="OutlineContent">
                  <div
                    className={`tab-pane fade ${
                      activeTab === "connect-tab" ? "active show" : ""
                    }`}
                    id="connect-tab-pane"
                    role="tabpanel"
                    aria-labelledby="connect-tab"
                    tabIndex="0"
                  >
                    <div className="order-list-table table-responsive app-scroll">
                      {/* Search Input */}
                      {/* <div className="mb-3">
                        <input
                          type="text"
                          className="form-control m-4 align-middle"
                          placeholder="Search by Order ID, Customer, Driver, or Mobile"
                          value={searchQuery}
                          onChange={handleSearch}
                        />
                      </div> */}
                      <table className="table table-bottom-border align-middle mb-0">
                        <thead>
                          <tr>
                            <th scope="col">Question</th>
                            <th scope="col">Last Updated</th>
                            <th scope="col">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {allFaqs.map((service, index) => (
                            <tr key={index}>
                              <td>
                                <div className="position-relative">
                                  <div>
                                    <p className="mb-0 f-s-12">
                                      {service.question}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              <td>
                                <p className="mb-0 f-s-12 text-secondary">
                                  {format(
                                    new Date(service.time_at * 1000),
                                    "dd/MM/yyyy, hh:mm:ss a"
                                  )}
                                </p>
                              </td>

                              <td>
                                <Tooltip title="Edit Details" arrow>
                                  <IconButton
                                    onClick={() => handleEditClick(service)}
                                  >
                                    <Icon color="primary">edit</Icon>
                                  </IconButton>
                                </Tooltip>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {/* Pagination Controls */}
                      {/* <div className="pagination-controls d-flex justify-content-end align-items-center mt-3 p-4">
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </button>
                        <span className="mx-2">
                          Page {currentPage} of {totalPages}
                        </span>
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </button>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
        {/* Modal for Adding or Editing Vehicle */}
        <Dialog
          open={openFAQDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <Box p={3}>
            <Typography variant="h6" gutterBottom>
              {isEditMode ? "Edit FAQ" : "Add New FAQ"}
            </Typography>

            <TextField
              label="Question"
              fullWidth
              margin="normal"
              name="question"
              value={selectedFAQ.question}
              onChange={handleInputChange}
              required
              error={errorFAQ.question}
              helperText={errorFAQ.question ? "Question is required." : ""}
            />
            <TextField
              label="Answer"
              fullWidth
              multiline
              rows={4} // You can change the number of rows based on your preference
              margin="normal"
              name="answer"
              value={selectedFAQ.answer}
              onChange={handleInputChange}
              required
              error={errorFAQ.answer}
              helperText={errorFAQ.answer ? "Answer is required." : ""}
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
                onClick={saveFaqDetails}
              >
                {isEditMode ? "Update" : "Create"}
              </LoadingButton>
            </Box>
          </Box>
        </Dialog>
      </Container>
    </div>
  );
};

export default AddFAQQuestionsPage;
