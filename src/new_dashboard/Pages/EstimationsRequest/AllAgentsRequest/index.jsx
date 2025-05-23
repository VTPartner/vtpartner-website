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

const Enquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEnquiryId, setSelectedEnquiryId] = useState(null);
  const [itemsPerPage] = useState(10);

  const fetchEnquiries = async () => {
    const token = Cookies.get("authToken");
    try {
      setLoading(true);
      const response = await axios.post(
        `${serverEndPoint}/enquiries_all`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.all_enquiries_details) {
        setEnquiries(response.data.all_enquiries_details);
      } else {
        setEnquiries([]);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setEnquiries([]);
      } else {
        toast.error("Failed to fetch enquiries");
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const filteredEnquiries = enquiries.filter((enquiry) => {
    const searchFields = [
      enquiry.name,
      enquiry.mobile_no,
      enquiry.category_name,
      enquiry.sub_cat_name,
      enquiry.service_name,
      enquiry.city_name,
      enquiry.source_type,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchFields.includes(searchQuery.toLowerCase());
  });

  const pageCount = Math.ceil(filteredEnquiries.length / itemsPerPage);
  const offset = (currentPage - 1) * itemsPerPage;
  const paginatedEnquiries = filteredEnquiries.slice(
    offset,
    offset + itemsPerPage
  );

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      setCurrentPage(1);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Delete dialog handlers
  const handleDeleteClick = (enquiryId) => {
    setSelectedEnquiryId(enquiryId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedEnquiryId(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedEnquiryId) return;

    try {
      setDeleteLoading(true);
      const token = Cookies.get("authToken");
      const response = await axios.post(
        `${serverEndPoint}/delete_enquiry`,
        { enquiry_id: selectedEnquiryId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Enquiry deleted successfully");
        fetchEnquiries();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete enquiry");
    } finally {
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
      setSelectedEnquiryId(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <Container fluid>
      <Row className="m-1">
        <Col xs={12}>
          <h4 className="main-title">Enquiries</h4>
          <Card className="shadow-lg border-0 rounded-lg">
            <CardBody>
              <div className="mb-3 d-flex">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by Name, Mobile, Category or Service"
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
                      <th>Customer Details</th>
                      <th>Category</th>
                      <th>Vehicle</th>
                      {/* <th>Service Details</th> */}
                      <th>Location</th>
                      <th>Source</th>
                      <th>Time</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedEnquiries.map((enquiry) => (
                      <tr key={enquiry.enquiry_id}>
                        <td>#{enquiry.enquiry_id}</td>
                        <td>
                          <div>
                            <h6 className="mb-0">{enquiry.name}</h6>
                            <small>{enquiry.mobile_no}</small>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-primary">
                            {enquiry.category_name}
                          </span>
                        </td>
                        <td>{enquiry.vehicle_name}</td>
                        {/* <td>
                          {enquiry.sub_cat_name && (
                            <span className="badge bg-info me-1">
                              {enquiry.sub_cat_name}
                            </span>
                          )}
                          {enquiry.service_name && (
                            <span className="badge bg-secondary">
                              {enquiry.service_name}
                            </span>
                          )}
                        </td> */}
                        <td>{enquiry.city_name}</td>
                        <td>
                          <span className="badge bg-warning">
                            {enquiry.source_type}
                          </span>
                        </td>
                        <td>
                          {format(
                            new Date(enquiry.time_at * 1000),
                            "dd/MM/yyyy HH:mm"
                          )}
                        </td>
                        <td>
                          <Tooltip title="Delete Enquiry">
                            <IconButton
                              onClick={() =>
                                handleDeleteClick(enquiry.enquiry_id)
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
                    Are you sure you want to delete this enquiry? This action
                    cannot be undone.
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

export default Enquiries;
