import { useState, useEffect } from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  Button,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";
import { format } from "date-fns";
import { serverEndPoint } from "../../../../dashboard/app/constants";
import Loader from "../../../Components/Loader";

const EstimationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [itemsPerPage] = useState(10);

  const fetchEstimations = async () => {
    const token = Cookies.get("authToken");
    try {
      setLoading(true);
      const response = await axios.post(
        `${serverEndPoint}/all_estimations`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.all_estimations_details) {
        setRequests(response.data.all_estimations_details);
      } else {
        setRequests([]);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setRequests([]);
      } else {
        toast.error("Failed to fetch estimation requests");
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstimations();
  }, [currentPage, searchTerm]);

  const filteredRequests = requests.filter((request) => {
    const searchFields = [
      request.name,
      request.mobile_no,
      request.start_address,
      request.end_address,
      request.purpose,
      request.request_type,
      request.category_name,
      request.sub_cat_name,
      request.service_name,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchFields.includes(searchQuery.toLowerCase());
  });

  const pageCount = Math.ceil(filteredRequests.length / itemsPerPage);
  const offset = (currentPage - 1) * itemsPerPage;
  const paginatedRequests = filteredRequests.slice(
    offset,
    offset + itemsPerPage
  );

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

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Delete dialog handlers
  const handleDeleteClick = (requestId) => {
    setSelectedRequestId(requestId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedRequestId(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedRequestId) return;

    try {
      setDeleteLoading(true);
      const token = Cookies.get("authToken");
      const response = await axios.post(
        `${serverEndPoint}/delete_estimation`,
        { request_id: selectedRequestId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Estimation request deleted successfully");
        fetchEstimations();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete estimation request"
      );
    } finally {
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
      setSelectedRequestId(null);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Container fluid>
      <Row className="m-1">
        <Col xs={12}>
          <h4 className="main-title">Estimation Requests</h4>
          <Card className="shadow-lg border-0 rounded-lg">
            <CardBody>
              <div className="mb-3 d-flex">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by Name, Mobile, Address or Category"
                  value={searchQuery}
                  onChange={handleSearch}
                  onKeyPress={handleKeyPress}
                />
              </div>

              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Category</th>
                      <th>Customer Details</th>
                      <th>Location</th>
                      {/* <th>Service Details</th> */}
                      <th>Request Info</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedRequests.map((request) => (
                      <tr key={request.request_id}>
                        <td>#{request.request_id}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="flex-shrink-0">
                              <img
                                src={request.category_image}
                                alt={request.category_name}
                                className="rounded-circle"
                                width="40"
                                height="40"
                              />
                            </div>
                            <div className="ms-3">
                              <h6 className="mb-0">{request.category_name}</h6>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>
                            <h6 className="mb-0">{request.name}</h6>
                            <small>{request.mobile_no}</small>
                          </div>
                        </td>
                        <td>
                          <p
                            className="mb-0 text-wrap"
                            style={{ maxWidth: "200px" }}
                          >
                            {request.end_address === "NA"
                              ? "Work Location: "
                              : "From: "}
                            {request.start_address}
                          </p>
                          {request.end_address !== "NA" && (
                            <p
                              className="mb-0 text-wrap"
                              style={{ maxWidth: "200px" }}
                            >
                              To: {request.end_address}
                            </p>
                          )}
                        </td>
                        {/* <td>
                          {request.sub_cat_name && (
                            <span className="badge bg-info me-1">
                              {request.sub_cat_name}
                            </span>
                          )}
                          {request.service_name && (
                            <span className="badge bg-primary">
                              {request.service_name}
                            </span>
                          )}
                        </td> */}
                        <td>
                          <div>
                            <p className="mb-0">
                              {format(
                                new Date(request.request_date),
                                "dd/MM/yyyy"
                              )}
                            </p>
                            <span className="badge bg-secondary me-1">
                              {request.request_type}
                            </span>
                            <small>{request.purpose}</small>
                          </div>
                        </td>
                        <td>
                          <Tooltip title="Delete Request">
                            <IconButton
                              onClick={() =>
                                handleDeleteClick(request.request_id)
                              }
                              disabled={deleteLoading}
                              className="btn btn-outline-danger icon-btn w-30 h-30 b-r-22"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Delete Confirmation Dialog */}
              <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
                aria-labelledby="delete-dialog-title"
              >
                <DialogTitle id="delete-dialog-title">
                  Confirm Delete
                </DialogTitle>
                <DialogContent>
                  <Typography>
                    Are you sure you want to delete this estimation request?
                    This action cannot be undone.
                  </Typography>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleDeleteCancel} color="primary">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDeleteConfirm}
                    color="error"
                    variant="contained"
                    disabled={deleteLoading}
                  >
                    Delete
                  </Button>
                </DialogActions>
              </Dialog>

              {/* Pagination Controls */}
              <div className="pagination-controls d-flex justify-content-end align-items-center mt-3">
                <button
                  className="btn btn-outline-secondary me-2"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span className="mx-2">
                  Page {currentPage} of {pageCount}
                </span>
                <button
                  className="btn btn-outline-secondary ms-2"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pageCount}
                >
                  Next
                </button>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EstimationRequests;
