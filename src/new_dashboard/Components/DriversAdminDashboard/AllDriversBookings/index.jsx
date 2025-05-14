/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import {
  formatEpoch,
  serverEndPoint,
} from "../../../../dashboard/app/constants";
import Loader from "../../Loader";

const AllDriversBookings = () => {
  const [activeTab, setActiveTab] = useState("connect-tab");
  const [allOngoingBookings, setAllOngoingBookings] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [allCancelledBookings, setAllCancelledBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [currentOngoingPage, setCurrentOngoingPage] = useState(1);
  const [currentAllPage, setCurrentAllPage] = useState(1);
  const itemsPerPage = 7;

  // Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOngoingQuery, setSearchOngoingQuery] = useState("");
  const [searchAllQuery, setSearchAllQuery] = useState("");

  // Search handlers
  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
    setCurrentPage(1);
  };

  const handleOngoingSearch = (e) => {
    setSearchOngoingQuery(e.target.value.toLowerCase());
    setCurrentOngoingPage(1);
  };

  const handleAllSearch = (e) => {
    setSearchAllQuery(e.target.value.toLowerCase());
    setCurrentAllPage(1);
  };

  // Filter functions
  const filterBookings = (bookings, query) => {
    return bookings.filter((order) => {
      return (
        order.booking_id.toString().includes(query) ||
        order.customer_name.toLowerCase().includes(query) ||
        order.driver_first_name.toLowerCase().includes(query) ||
        order.customer_mobile_no.toLowerCase().includes(query)
      );
    });
  };

  // Get current items for each tab
  const getCurrentItems = (items, currentPage, searchQuery) => {
    const filtered = filterBookings(items, searchQuery);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return {
      currentItems: filtered.slice(indexOfFirstItem, indexOfLastItem),
      totalPages: Math.ceil(filtered.length / itemsPerPage),
    };
  };

  // Page change handlers
  const handleScheduledPageChange = (pageNumber) =>
    setCurrentScheduledPage(pageNumber);
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const handleOngoingPageChange = (pageNumber) =>
    setCurrentOngoingPage(pageNumber);
  const handleAllPageChange = (pageNumber) => setCurrentAllPage(pageNumber);

  const [allScheduledBookings, setAllScheduledBookings] = useState([]);
  const [currentScheduledPage, setCurrentScheduledPage] = useState(1);
  const [searchScheduledQuery, setSearchScheduledQuery] = useState("");

  // Add new search handler
  const handleScheduledSearch = (e) => {
    setSearchScheduledQuery(e.target.value.toLowerCase());
    setCurrentScheduledPage(1);
  };

  // Add new fetch function
  const fetchAllScheduledBookingsData = async () => {
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
        `${serverEndPoint}/get_other_driver_scheduled_bookings_details`,
        {},
        config
      );
      setAllScheduledBookings(response.data.results || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "cancelled-bookings-tab") {
      fetchAllCancelledBookingsData();
    } else if (tab === "ongoing-bookings-tabs") {
      fetchAllOngoingBookingsData();
    } else if (tab === "scheduled-bookings-tab") {
      fetchAllScheduledBookingsData();
    } else {
      fetchAllBookingsData();
    }
  };

  // API calls
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
      const response = await axios.post(
        `${serverEndPoint}/get_other_driver_all_ongoing_bookings_details`,
        { allBookings: 1 },
        config
      );
      setAllBookings(response.data.results || []);
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
      const response = await axios.post(
        `${serverEndPoint}/get_other_driver_all_ongoing_bookings_details`,
        {},
        config
      );
      setAllOngoingBookings(response.data.results || []);
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
      const response = await axios.post(
        `${serverEndPoint}/get_other_driver_all_cancelled_bookings_details`,
        {},
        config
      );
      setAllCancelledBookings(response.data.results || []);
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

  // Get current items and total pages for each tab
  const { currentItems: currentAllItems, totalPages: totalAllPages } =
    getCurrentItems(allBookings, currentAllPage, searchAllQuery);
  const { currentItems: currentOngoingItems, totalPages: totalOngoingPages } =
    getCurrentItems(allOngoingBookings, currentOngoingPage, searchOngoingQuery);
  const { currentItems: currentCancelledItems, totalPages: totalPages } =
    getCurrentItems(allCancelledBookings, currentPage, searchQuery);

  const renderBookingTable = (
    items,
    currentPage,
    totalPages,
    handlePageChange,
    searchQuery,
    handleSearch
  ) => (
    <div className="order-list-table table-responsive app-scroll">
      <input
        type="text"
        className="form-control m-4"
        placeholder="Search by Booking ID, Customer, Driver, or Mobile"
        value={searchQuery}
        onChange={handleSearch}
      />
      <table className="table table-bottom-border align-middle mb-0">
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Customer</th>
            <th>Driver</th>
            <th>Pickup</th>
            <th>Drop</th>
            <th>Status</th>
            <th>Booking Time</th>
            <th>Distance</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((order, index) => (
            <tr key={index}>
              <td>#{order.booking_id}</td>
              <td>
                <div>
                  <h6 className="mb-0 f-s-16">{order.customer_name}</h6>
                  <p className="mb-0 f-s-14 text-secondary">
                    {order.customer_mobile_no}
                  </p>
                </div>
              </td>
              <td>
                <div className="position-relative">
                  <div className="h-40 w-40 d-flex-center b-r-15 overflow-hidden p-1 position-absolute">
                    <img
                      src={order.profile_pic}
                      alt={order.driver_first_name}
                      className="img-fluid"
                    />
                  </div>
                  <div className="ms-5">
                    <h6 className="mb-0 f-s-16">{order.driver_first_name}</h6>
                    <p className="mb-0 f-s-14 text-secondary">
                      {order.driver_mobile_no}
                    </p>
                    <p className="mb-0 f-s-14 text-secondary">
                      {order.sub_cat_name} - {order.service_name}
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
                  className={`badge bg-${
                    order.booking_status === "Cancelled"
                      ? "danger"
                      : order.booking_status === "End Trip"
                      ? "success"
                      : order.booking_status === "Driver Arrived"
                      ? "warning"
                      : order.booking_status === "Driver Accepted"
                      ? "info"
                      : order.booking_status === "Start Trip"
                      ? "secondary"
                      : "light"
                  }`}
                >
                  {order.booking_status === "End Trip"
                    ? "Completed"
                    : order.booking_status}
                </span>
              </td>
              <td>{formatEpoch(order.booking_timing)}</td>
              <td>
                <span className="badge bg-info">{order.distance} Km</span>
              </td>
              <td>
                <span className="badge bg-primary">Rs.{order.total_price}</span>
              </td>
              <td>
                {order.driver_first_name != "Driver Not Assigned" && (
                  <Link
                    to={`/dashboard/other-driver-booking-details/${order.booking_id}`}
                    role="button"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary icon-btn w-30 h-30 b-r-22 me-2"
                  >
                    <i className="ti ti-eye"></i>
                  </Link>
                )}
              </td>
              {/* <td>
                <Link
                  to={`/dashboard/other-driver-booking-details/${order.booking_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-primary icon-btn w-30 h-30 b-r-22 me-2"
                >
                  <i className="ti ti-eye"></i>
                </Link>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
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
  );

  return (
    <div>
      <Container fluid>
        <Row className="m-1">
          <Col xs={12}>
            <h4 className="main-title">Driver Bookings</h4>
            <ul className="app-line-breadcrumbs mb-3">
              <li className="">
                <a href="#" className="f-s-14 f-w-500">
                  <span>
                    <i className="ph-duotone ph-car f-s-16"></i> Driver
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
                <ul className="nav nav-tabs app-tabs-primary order-tabs d-flex justify-content-start border-0 mb-0 pb-0">
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link d-flex align-items-center gap-1 ${
                        activeTab === "connect-tab" ? "active" : ""
                      }`}
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
                      onClick={() => handleTabClick("ongoing-bookings-tabs")}
                    >
                      <i className="ti ti-car f-s-18 mg-b-3"></i> Ongoing
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link d-flex align-items-center gap-1 ${
                        activeTab === "cancelled-bookings-tab" ? "active" : ""
                      }`}
                      onClick={() => handleTabClick("cancelled-bookings-tab")}
                    >
                      <i className="ti ti-square-rounded-x f-s-18 mg-b-3"></i>{" "}
                      Cancelled
                    </button>
                  </li>

                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link d-flex align-items-center gap-1 ${
                        activeTab === "scheduled-bookings-tab" ? "active" : ""
                      }`}
                      onClick={() => handleTabClick("scheduled-bookings-tab")}
                    >
                      <i className="ti ti-calendar f-s-18 mg-b-3"></i> Scheduled
                    </button>
                  </li>
                </ul>
              </CardBody>

              <div className="card-body order-tab-content p-0">
                <div className="tab-content" id="OutlineContent">
                  {/* All Bookings Tab */}
                  <div
                    className={`tab-pane fade ${
                      activeTab === "connect-tab" ? "active show" : ""
                    }`}
                  >
                    {renderBookingTable(
                      currentAllItems,
                      currentAllPage,
                      totalAllPages,
                      handleAllPageChange,
                      searchAllQuery,
                      handleAllSearch
                    )}
                  </div>

                  {/* Ongoing Bookings Tab */}
                  <div
                    className={`tab-pane fade ${
                      activeTab === "ongoing-bookings-tabs" ? "active show" : ""
                    }`}
                  >
                    {renderBookingTable(
                      currentOngoingItems,
                      currentOngoingPage,
                      totalOngoingPages,
                      handleOngoingPageChange,
                      searchOngoingQuery,
                      handleOngoingSearch
                    )}
                  </div>

                  {/* Cancelled Bookings Tab */}
                  <div
                    className={`tab-pane fade ${
                      activeTab === "cancelled-bookings-tab"
                        ? "active show"
                        : ""
                    }`}
                  >
                    {renderBookingTable(
                      currentCancelledItems,
                      currentPage,
                      totalPages,
                      handlePageChange,
                      searchQuery,
                      handleSearch
                    )}
                  </div>

                  {/* Scheduled bookings */}
                  <div
                    className={`tab-pane fade ${
                      activeTab === "scheduled-bookings-tab"
                        ? "active show"
                        : ""
                    }`}
                  >
                    {renderBookingTable(
                      allScheduledBookings,
                      currentScheduledPage,
                      Math.ceil(allScheduledBookings.length / itemsPerPage),
                      handleScheduledPageChange,
                      searchScheduledQuery,
                      handleScheduledSearch
                    )}
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

export default AllDriversBookings;
