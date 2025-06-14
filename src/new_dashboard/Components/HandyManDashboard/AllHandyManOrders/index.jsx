/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import { Link } from "react-router-dom";
import axios from "axios";

import Cookies from "js-cookie";
import {
  formatEpoch,
  serverEndPoint,
} from "../../../../dashboard/app/constants";
import Loader from "../../Loader";

const AllHandymansOrders = () => {
  const [activeTab, setActiveTab] = useState("connect-tab");
  const [loading, setLoading] = useState(true);
  const [allOrders, setAllOrders] = useState([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const [searchQuery, setSearchQuery] = useState("");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const fetchAllOrdersData = async () => {
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
        `${serverEndPoint}/get_handyman_all_completed_orders_details`,
        { key: 1 },
        config
      );
      setAllOrders(response.data.results || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
    setCurrentPage(1);
  };

  // Filter orders
  const filteredOrders = allOrders.filter((order) => {
    return (
      order.order_id.toString().includes(searchQuery) ||
      order.customer_name.toLowerCase().includes(searchQuery) ||
      order.handyman_name.toLowerCase().includes(searchQuery) ||
      order.customer_mobile_no.toLowerCase().includes(searchQuery)
    );
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    fetchAllOrdersData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <Container fluid>
        <Row className="m-1">
          <Col xs={12}>
            <h4 className="main-title">Handyman Orders</h4>
            <ul className="app-line-breadcrumbs mb-3">
              <li className="">
                <a href="#" className="f-s-14 f-w-500">
                  <span>
                    <i className="ph-duotone ph-tool f-s-16"></i> Handyman
                  </span>
                </a>
              </li>
              <li className="active mt-2">
                <a href="#" className="f-s-14 f-w-500">
                  Orders
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
                      className={`nav-link d-flex align-items-center gap-1 ${
                        activeTab === "connect-tab" ? "active" : ""
                      }`}
                      onClick={() => handleTabClick("connect-tab")}
                    >
                      <i className="ti ti-sort-descending-2 f-s-18 mg-b-3"></i>
                      All Orders
                    </button>
                  </li>
                </ul>
              </CardBody>

              <div className="card-body order-tab-content p-0">
                <div className="tab-content" id="OutlineContent">
                  <div
                    className={`tab-pane fade ${
                      activeTab === "connect-tab" ? "active show" : ""
                    }`}
                  >
                    <div className="order-list-table table-responsive app-scroll">
                      {/* Search Input */}
                      <div className="mb-3">
                        <input
                          type="text"
                          className="form-control m-4 align-middle"
                          placeholder="Search by Order ID, Customer, Handyman, or Mobile"
                          value={searchQuery}
                          onChange={handleSearch}
                        />
                      </div>

                      {/* Orders Table */}
                      <table className="table table-bottom-border align-middle mb-0">
                        <thead>
                          <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Handyman</th>
                            <th>Work Location</th>
                            <th>Status</th>
                            <th>Booking Time</th>
                            <th>Distance</th>
                            <th>Amount</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentItems.map((order, index) => (
                            <tr key={index}>
                              <td>#{order.order_id}</td>
                              <td>
                                <div className="position-relative">
                                  <div>
                                    <h6 className="mb-0 f-s-16">
                                      {order.customer_name}
                                    </h6>
                                    <p className="mb-0 f-s-14 text-secondary">
                                      {order.customer_mobile_no}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="position-relative">
                                  <div className="h-40 w-40 d-flex-center b-r-15 overflow-hidden p-1 position-absolute">
                                    <img
                                      src={order.profile_pic}
                                      alt={order.handyman_name}
                                      className="img-fluid"
                                    />
                                  </div>
                                  <div className="ms-5">
                                    <h6 className="mb-0 f-s-16">
                                      {order.handyman_name}
                                    </h6>
                                    <p className="mb-0 f-s-14 text-secondary">
                                      {order.handyman_mobile_no}
                                    </p>
                                    <p className="mb-0 f-s-14 text-secondary">
                                      {order.sub_cat_name} -{" "}
                                      {order.service_name}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <p className="mb-0 f-s-12 text-secondary">
                                  {order.pickup_address}
                                </p>
                              </td>
                              <td>
                                <span
                                  className={`badge bg-${
                                    order.booking_status === "End Trip"
                                      ? "success"
                                      : "secondary"
                                  }`}
                                >
                                  {order.booking_status === "End Trip"
                                    ? "Completed"
                                    : order.booking_status}
                                </span>
                              </td>
                              <td>{formatEpoch(order.booking_timing)}</td>
                              <td>
                                <span className="badge bg-info">
                                  {order.distance} Km
                                </span>
                              </td>
                              <td>
                                <span className="badge bg-primary">
                                  Rs.{order.total_price}
                                </span>
                              </td>
                              <td>
                                <Link
                                  to={`/dashboard/handyman-order-details/${order.booking_id}/${order.order_id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-outline-primary icon-btn w-30 h-30 b-r-22 me-2"
                                >
                                  <i className="ti ti-eye"></i>
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {/* Pagination Controls */}
                      <div className="pagination-controls d-flex justify-content-end align-items-center mt-3 p-4">
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </button>
                        <span className="mx-2">
                          Page {currentPage} of {totalPages}
                        </span>
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AllHandymansOrders;
