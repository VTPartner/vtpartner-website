/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";

import { Card, CardBody, Col, Container, Row } from "reactstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import {
  formatEpoch,
  serverEndPoint,
} from "../../../../../dashboard/app/constants";
import Loader from "../../../Loader";

const AllGoodsDriverBookings = () => {
  const [activeTab, setActiveTab] = useState("connect-tab");
  const [allOngoingBookings, setAllOngoingBookings] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [allCancelledBookings, setAllCancelledBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const [searchQuery, setSearchQuery] = useState("");

  const [currentOngoingPage, setCurrentOngoingPage] = useState(1);
  const itemsOngoingPerPage = 7;
  const [searchOngoingQuery, setSearchOngoingQuery] = useState("");

  const [currentAllPage, setCurrentAllPage] = useState(1);
  const itemsAllPerPage = 7;
  const [searchAllQuery, setSearchAllQuery] = useState("");

  // Handle search input change
  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
    setCurrentPage(1); // Reset to page 1 when search query changes
  };

  // Filter bookings based on the search query
  const filteredBookings = allCancelledBookings.filter((order) => {
    return (
      order.booking_id.toString().includes(searchQuery) ||
      order.customer_name.toLowerCase().includes(searchQuery) ||
      order.driver_first_name.toLowerCase().includes(searchQuery) ||
      order.customer_mobile_no.toLowerCase().includes(searchQuery)
    );
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBookings.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle search input change
  const handleOngoingSearch = (e) => {
    setSearchOngoingQuery(e.target.value.toLowerCase());
    setCurrentOngoingPage(1); // Reset to page 1 when search query changes
  };

  // Filter bookings based on the search query
  const filteredOngoingBookings = allOngoingBookings.filter((order) => {
    return (
      order.booking_id.toString().includes(searchOngoingQuery) ||
      order.customer_name.toLowerCase().includes(searchOngoingQuery) ||
      order.driver_first_name.toLowerCase().includes(searchOngoingQuery) ||
      order.customer_mobile_no.toLowerCase().includes(searchOngoingQuery)
    );
  });

  // Pagination logic
  const indexOfOngoingLastItem = currentOngoingPage * itemsOngoingPerPage;
  const indexOfOngoingFirstItem = indexOfOngoingLastItem - itemsOngoingPerPage;
  const currentOngoingItems = filteredOngoingBookings.slice(
    indexOfOngoingFirstItem,
    indexOfOngoingLastItem
  );
  const totalOngoingPages = Math.ceil(
    filteredOngoingBookings.length / itemsOngoingPerPage
  );

  const handleOngoingPageChange = (pageNumber) => {
    setCurrentOngoingPage(pageNumber);
  };

  // Handle search input change
  const handleAllSearch = (e) => {
    setSearchAllQuery(e.target.value.toLowerCase());
    setCurrentAllPage(1); // Reset to page 1 when search query changes
  };

  // Filter bookings based on the search query
  const filteredAllBookings = allBookings.filter((order) => {
    return (
      order.booking_id.toString().includes(searchAllQuery) ||
      order.customer_name.toLowerCase().includes(searchAllQuery) ||
      order.driver_first_name.toLowerCase().includes(searchAllQuery) ||
      order.customer_mobile_no.toLowerCase().includes(searchAllQuery)
    );
  });

  // Pagination logic
  const indexOfAllLastItem = currentAllPage * itemsAllPerPage;
  const indexOfAllFirstItem = indexOfAllLastItem - itemsAllPerPage;
  const currentAllItems = filteredAllBookings.slice(
    indexOfAllFirstItem,
    indexOfAllLastItem
  );
  const totalAllPages = Math.ceil(filteredAllBookings.length / itemsAllPerPage);

  const handleAllPageChange = (pageNumber) => {
    setCurrentAllPage(pageNumber);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "cancelled-bookings-tab") {
      fetchAllCancelledBookingsData();
    } else if (tab == "ongoing-bookings-tabs") {
      fetchAllOngoingBookingsData();
    } else {
      fetchAllBookingsData();
    }
  };
  //   const navigate = useNavigate();

  //   const goToOrderDetailPage = (category) => {
  //     navigate(`/dashboard/order-details/1`, {});
  //   };

  const fetchAllBookingsData = async () => {
    const token = Cookies.get("authToken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    try {
      setLoading(true);

      const [ongoingBookingResponse] = await Promise.all([
        axios.post(
          `${serverEndPoint}/get_goods_all_ongoing_bookings_details`,
          {
            allBookings: 1,
          },
          config
        ),
      ]);

      setAllBookings(ongoingBookingResponse.data.results || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllOngoingBookingsData = async () => {
    const token = Cookies.get("authToken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    try {
      setLoading(true);

      const [ongoingBookingResponse] = await Promise.all([
        axios.post(
          `${serverEndPoint}/get_goods_all_ongoing_bookings_details`,
          {},
          config
        ),
      ]);

      setAllOngoingBookings(ongoingBookingResponse.data.results || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCancelledBookingsData = async () => {
    const token = Cookies.get("authToken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    try {
      setLoading(true);

      const [ongoingBookingResponse] = await Promise.all([
        axios.post(
          `${serverEndPoint}/get_goods_all_cancelled_bookings_details`,
          {},
          config
        ),
      ]);

      setAllCancelledBookings(ongoingBookingResponse.data.results || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBookingsData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <Container fluid>
        <Row className="m-1">
          <Col xs={12}>
            <h4 className="main-title">Goods Bookings</h4>
            <ul className="app-line-breadcrumbs mb-3">
              <li className="">
                <a href="#" className="f-s-14 f-w-500">
                  <span>
                    <i className="ph-duotone  ph-stack f-s-16"></i> Goods
                  </span>
                </a>
              </li>

              <li className="active mt-2">
                <a href="#" className="f-s-14 f-w-500">
                  Bookings
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
                      All Bookings
                    </button>
                  </li>

                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link d-flex align-items-center gap-1 ${
                        activeTab === "ongoing-bookings-tabs" ? "active" : ""
                      }`}
                      id="ongoing-bookings-tabs"
                      data-bs-toggle="tab"
                      data-bs-target="#ongoing-bookings-tab-returns"
                      type="button"
                      role="tab"
                      aria-controls="ongoing-bookings-tab-returns"
                      aria-selected={activeTab === "ongoing-bookings-tabs"}
                      onClick={() => handleTabClick("ongoing-bookings-tabs")}
                    >
                      <i className="ti ti-truck-loading f-s-18 mg-b-3"></i>{" "}
                      Ongoing
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link d-flex align-items-center gap-1 ${
                        activeTab === "cancelled-bookings-tab" ? "active" : ""
                      }`}
                      id="cancelled-bookings-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#cancelled-bookings-tab"
                      type="button"
                      role="tab"
                      aria-controls="cancelled-bookings-tab"
                      aria-selected={activeTab === "cancelled-bookings-tab"}
                      onClick={() => handleTabClick("cancelled-bookings-tab")}
                    >
                      <i className="ti ti-square-rounded-x f-s-18 mg-b-3"></i>{" "}
                      Cancelled
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
                    id="connect-tab-pane"
                    role="tabpanel"
                    aria-labelledby="connect-tab"
                    tabIndex="0"
                  >
                    <div className="order-list-table table-responsive app-scroll">
                      {/* Search Input */}
                      <div className="mb-3">
                        <input
                          type="text"
                          className="form-control m-4 align-middle"
                          placeholder="Search by Booking ID, Customer, Driver, or Mobile"
                          value={searchAllQuery}
                          onChange={handleAllSearch}
                        />
                      </div>
                      <table className="table table-bottom-border align-middle mb-0">
                        <thead>
                          <tr>
                            <th>Booking ID</th>
                            <th scope="col">Customer</th>
                            <th scope="col">Driver</th>
                            <th scope="col">Pickup</th>
                            <th scope="col">Drop</th>
                            <th scope="col">Status</th>
                            <th scope="col">Booking Details</th>
                            <th scope="col">Distance</th>
                            <th scope="col">Amount</th>
                            <th scope="col">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentAllItems.map((order, index) => (
                            <tr key={index}>
                              <td># {order.booking_id}</td>
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
                                      src={order.vehicle_image}
                                      alt={order.driver_first_name}
                                      className="img-fluid"
                                    />
                                  </div>
                                  <div className="ms-5">
                                    <h6 className="mb-0 f-s-16">
                                      {order.driver_first_name}
                                    </h6>
                                    <p className="mb-0 f-s-14 text-secondary">
                                      {order.driver_mobile_no}
                                    </p>
                                    <p className="mb-0 f-s-14 text-secondary">
                                      {order.vehicle_name}
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
                                <p className="mb-0 f-s-12 text-secondary">
                                  {order.drop_address}
                                </p>
                              </td>
                              <td>
                                <span
                                  className={`badge bg-${(() => {
                                    if (order.booking_status === "Cancelled")
                                      return "danger";
                                    if (order.booking_status === "End Trip")
                                      return "success";
                                    if (
                                      order.booking_status === "Driver Arrived"
                                    )
                                      return "warning";
                                    if (
                                      order.booking_status === "Driver Accepted"
                                    )
                                      return "info";
                                    if (order.booking_status === "Start Trip")
                                      return "secondary";
                                    return "light";
                                  })()}`}
                                >
                                  {order.booking_status === "End Trip"
                                    ? "Completed"
                                    : order.booking_status}
                                </span>
                              </td>

                              <td>{formatEpoch(order.booking_timing)}</td>
                              <td>
                                <span className={`badge bg-info`}>
                                  {order.distance} Km
                                </span>
                              </td>
                              <td>
                                <span className={`badge bg-primary`}>
                                  Rs.{order.total_price}
                                </span>
                              </td>
                              <td>
                                <Link
                                  to={{
                                    pathname: `/dashboard/booking-details/${order.booking_id}`,
                                    state: { orderDetails: order }, // Pass additional data
                                  }}
                                  role="button"
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
                          onClick={() =>
                            handleAllPageChange(currentAllPage - 1)
                          }
                          disabled={currentAllPage === 1}
                        >
                          Previous
                        </button>
                        <span className="mx-2">
                          Page {currentAllPage} of {totalAllPages}
                        </span>
                        <button
                          className="btn btn-outline-primary"
                          onClick={() =>
                            handleAllPageChange(currentAllPage + 1)
                          }
                          disabled={currentAllPage === totalAllPages}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Ongoing bookings  */}
                  <div
                    className={`tab-pane fade ${
                      activeTab === "ongoing-bookings-tabs" ? "active show" : ""
                    }`}
                    id="ongoing-bookings-tabs"
                    role="tabpanel"
                    aria-labelledby="ongoing-bookings-tabs"
                    tabIndex="0"
                  >
                    <div className=" order-list-table table-responsive app-scroll">
                      {/* Search Input */}
                      <div className="mb-3">
                        <input
                          type="text"
                          className="form-control m-4 align-middle"
                          placeholder="Search by Booking ID, Customer, Driver, or Mobile"
                          value={searchOngoingQuery}
                          onChange={handleOngoingSearch}
                        />
                      </div>
                      <table className="table table-bottom-border align-middle mb-0">
                        <thead>
                          <tr>
                            <th>Booking ID</th>
                            <th scope="col">Customer</th>
                            <th scope="col">Driver</th>
                            <th scope="col">Pickup</th>
                            <th scope="col">Drop</th>
                            <th scope="col">Status</th>
                            <th scope="col">Booking Details</th>
                            <th scope="col">Distance</th>
                            <th scope="col">Amount</th>
                            <th scope="col">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentOngoingItems.map((order, index) => (
                            <tr key={index}>
                              <td># {order.booking_id}</td>
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
                                      src={order.vehicle_image}
                                      alt={order.driver_first_name}
                                      className="img-fluid"
                                    />
                                  </div>
                                  <div className="ms-5">
                                    <h6 className="mb-0 f-s-16">
                                      {order.driver_first_name}
                                    </h6>
                                    <p className="mb-0 f-s-14 text-secondary">
                                      {order.driver_mobile_no}
                                    </p>
                                    <p className="mb-0 f-s-14 text-secondary">
                                      {order.vehicle_name}
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
                                <p className="mb-0 f-s-12 text-secondary">
                                  {order.drop_address}
                                </p>
                              </td>
                              <td>
                                <span
                                  className={`badge bg-${(() => {
                                    if (order.booking_status === "Cancelled")
                                      return "danger";
                                    if (order.booking_status === "End Trip")
                                      return "success";
                                    if (
                                      order.booking_status === "Driver Arrived"
                                    )
                                      return "warning";
                                    if (
                                      order.booking_status === "Driver Accepted"
                                    )
                                      return "info";
                                    if (order.booking_status === "Start Trip")
                                      return "secondary";
                                    return "light";
                                  })()}`}
                                >
                                  {order.booking_status}
                                </span>
                              </td>
                              <td>{formatEpoch(order.booking_timing)}</td>
                              <td>
                                <span className={`badge bg-info`}>
                                  {order.distance} Km
                                </span>
                              </td>
                              <td>
                                <span className={`badge bg-primary`}>
                                  Rs.{order.total_price}
                                </span>
                              </td>
                              <td>
                                <Link
                                  to={{
                                    pathname: `/dashboard/booking-details/${order.booking_id}`,
                                    state: { orderDetails: order }, // Pass additional data
                                  }}
                                  role="button"
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
                          className="btn btn-outline-secondary"
                          onClick={() =>
                            handleOngoingPageChange(currentOngoingPage - 1)
                          }
                          disabled={currentOngoingPage === 1}
                        >
                          Previous
                        </button>
                        <span className="mx-2">
                          Page {currentOngoingPage} of {totalOngoingPages}
                        </span>
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() =>
                            handleOngoingPageChange(currentOngoingPage + 1)
                          }
                          disabled={currentOngoingPage === totalOngoingPages}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Cancelled Bookings  */}
                  <div
                    className={`tab-pane fade ${
                      activeTab === "cancelled-bookings-tab"
                        ? "active show"
                        : ""
                    }`}
                    id="cancelled-bookings-tab"
                    role="tabpanel"
                    aria-labelledby="cancelled-bookings-tab"
                    tabIndex="0"
                  >
                    <div className=" order-list-table table-responsive app-scroll">
                      {/* Search Input */}
                      <div className="mb-3">
                        <input
                          type="text"
                          className="form-control m-4 align-middle"
                          placeholder="Search by Booking ID, Customer, Driver, or Mobile"
                          value={searchQuery}
                          onChange={handleSearch}
                        />
                      </div>
                      <table className="table table-bottom-border align-middle mb-0">
                        <thead>
                          <tr>
                            <th>Booking ID</th>
                            <th scope="col">Customer</th>
                            <th scope="col">Driver</th>
                            <th scope="col">Pickup</th>
                            <th scope="col">Drop</th>
                            <th scope="col">Status</th>
                            <th scope="col">Booking Details</th>
                            <th scope="col">Distance</th>
                            <th scope="col">Amount</th>
                            <th scope="col">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentItems.map((order, index) => (
                            <tr key={index}>
                              <td># {order.booking_id}</td>
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
                                      src={order.vehicle_image}
                                      alt={order.driver_first_name}
                                      className="img-fluid"
                                    />
                                  </div>
                                  <div className="ms-5">
                                    <h6 className="mb-0 f-s-16">
                                      {order.driver_first_name}
                                    </h6>
                                    <p className="mb-0 f-s-14 text-secondary">
                                      {order.driver_mobile_no}
                                    </p>
                                    <p className="mb-0 f-s-14 text-secondary">
                                      {order.vehicle_name}
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
                                <p className="mb-0 f-s-12 text-secondary">
                                  {order.drop_address}
                                </p>
                              </td>
                              <td>
                                <span
                                  className={`badge bg-${(() => {
                                    if (order.booking_status === "Cancelled")
                                      return "danger";
                                    if (order.booking_status === "End Trip")
                                      return "success";
                                    if (
                                      order.booking_status === "Driver Arrived"
                                    )
                                      return "warning";
                                    if (
                                      order.booking_status === "Driver Accepted"
                                    )
                                      return "info";
                                    if (order.booking_status === "Start Trip")
                                      return "secondary";
                                    return "light";
                                  })()}`}
                                >
                                  {order.booking_status}
                                </span>
                              </td>
                              <td>{formatEpoch(order.booking_timing)}</td>
                              <td>
                                <span className={`badge bg-info`}>
                                  {order.distance} Km
                                </span>
                              </td>
                              <td>
                                <span className={`badge bg-primary`}>
                                  Rs.{order.total_price}
                                </span>
                              </td>
                              <td>
                                <Link
                                  to={{
                                    pathname: `/dashboard/booking-details/${order.booking_id}`,
                                    state: { orderDetails: order }, // Pass additional data
                                  }}
                                  role="button"
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

export default AllGoodsDriverBookings;
