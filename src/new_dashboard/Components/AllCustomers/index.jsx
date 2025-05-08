import { useEffect, useState } from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";

import axios from "axios";

import Cookies from "js-cookie";
import { serverEndPoint, formatEpoch } from "../../../dashboard/app/constants";
import Loader from "../Loader";
import { Link } from "react-router-dom";

const AllCustomers = () => {
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCustomers = async () => {
    const token = Cookies.get("authToken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    try {
      setLoading(true);
      const response = await axios.post(
        `${serverEndPoint}/get_all_customers`,
        {
          page: currentPage,
          limit: 10,
          search: searchTerm,
        },
        config
      );

      setCustomers(response.data.customers);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [currentPage, searchTerm]);

  // const handleSearch = (e) => {
  //   setSearchQuery(e.target.value);
  //   setCurrentPage(1);
  // };
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

  if (loading) {
    return <Loader />;
  }

  return (
    <Container fluid>
      <Row className="m-1">
        <Col xs={12}>
          <h4 className="main-title">Customers</h4>
          <Card className="shadow-lg border-0 rounded-lg">
            <CardBody>
              <div className="mb-3 d-flex">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by Name, Mobile, Email or GST No"
                  value={searchQuery}
                  onChange={handleSearch}
                  onKeyPress={handleKeyPress}
                />
                <button
                  className="btn btn-primary ms-2"
                  onClick={handleSearchSubmit}
                >
                  Search
                </button>
              </div>

              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Customer Details</th>
                      <th>Contact Info</th>
                      <th>Address</th>
                      <th>GST Details</th>
                      <th>Registration</th>
                      <th>Purpose</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((customer) => (
                      <tr key={customer.customer_id}>
                        <td>#{customer.customer_id}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            {/* <div className="flex-shrink-0">
                              <img
                                src={customer.profile_pic}
                                alt={customer.customer_name}
                                className="rounded-circle"
                                width="40"
                                height="40"
                              />
                            </div> */}
                            <div className="ms-3">
                              <h6 className="mb-0">{customer.customer_name}</h6>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>
                            <p className="mb-0">{customer.mobile_no}</p>
                            <small>{customer.email}</small>
                          </div>
                        </td>
                        <td>
                          <p
                            className="mb-0 text-wrap"
                            style={{ maxWidth: "200px" }}
                          >
                            {customer.full_address}
                          </p>
                          <small>PIN: {customer.pincode}</small>
                        </td>
                        <td>
                          {customer.gst_no !== "NA" ? (
                            <div>
                              <p className="mb-0">{customer.gst_no}</p>
                              <small>{customer.gst_address}</small>
                            </div>
                          ) : (
                            <span className="text-muted">Not Available</span>
                          )}
                        </td>
                        <td>{formatEpoch(customer.time_created_at)}</td>
                        <td>
                          <span
                            className={`badge bg-${
                              customer.purpose === "Business"
                                ? "primary"
                                : "info"
                            }`}
                          >
                            {customer.purpose}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge bg-${
                              customer.status === 1 ? "success" : "danger"
                            }`}
                          >
                            {customer.status === 1 ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td>
                          <Link
                            to={`/dashboard/customer-wallet-details/${customer.customer_id}/${customer.customer_name}`}
                            role="button"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline-primary icon-btn w-30 h-30 b-r-22 ms-2 me-2"
                          >
                            <i className="ti ti-wallet"></i>
                          </Link>
                        </td>
                        {/* <td>
                          <Link
                            to={`/dashboard/customer-details/${customer.customer_id}`}
                            className="btn btn-outline-primary icon-btn w-30 h-30 b-r-22 me-2"
                          >
                            <i className="ti ti-eye"></i>
                          </Link>
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pagination-controls d-flex justify-content-end align-items-center mt-3">
                <button
                  className="btn btn-outline-secondary me-2"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span className="mx-2">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="btn btn-outline-secondary ms-2"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
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

export default AllCustomers;
