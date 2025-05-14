/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  orders,
  delivered,
  pickup,
  returns,
  cancelled,
} from "../../../../Data/Orderpage/Orderpage";

import { Card, CardBody, Col, Container, Row } from "reactstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  formatEpoch,
  serverEndPoint,
} from "../../../../../dashboard/app/constants";
import Cookies from "js-cookie";
import Loader from "../../../Loader";

const AllGoodsDriverOrders = () => {
  const [activeTab, setActiveTab] = useState("connect-tab");
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const [loading, setLoading] = useState(true);
  const [allOrders, setAllOrders] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const goToOrderDetailPage = (category) => {
    navigate(`/dashboard/order-details/1`, {});
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

      const [ordersResponse] = await Promise.all([
        axios.post(
          `${serverEndPoint}/get_goods_all_completed_orders_details`,
          {
            key: 1,
          },
          config
        ),
      ]);

      setAllOrders(ordersResponse.data.results || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle search input change
  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
    setCurrentPage(1); // Reset to page 1 when search query changes
  };

  // Filter bookings based on the search query
  const filteredBookings = allOrders.filter((order) => {
    return (
      order.order_id.toString().includes(searchQuery) ||
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
            <h4 className="main-title">Goods Orders</h4>
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
                          placeholder="Search by Order ID, Customer, Driver, or Mobile"
                          value={searchQuery}
                          onChange={handleSearch}
                        />
                      </div>
                      <table className="table table-bottom-border align-middle mb-0">
                        <thead>
                          <tr>
                            <th>Order Id</th>
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
                              <td># {order.order_id}</td>
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
                                {order.multiple_drops > 0 ? (
                                  <div>
                                    <p className="mb-0 f-s-12 text-secondary">
                                      Multiple Drops ({order.multiple_drops})
                                    </p>
                                    {(() => {
                                      try {
                                        // Parse the JSON string from the database
                                        const dropLocations =
                                          typeof order.drop_locations ===
                                          "string"
                                            ? JSON.parse(order.drop_locations)
                                            : order.drop_locations;

                                        // Also parse the contacts if needed
                                        const dropContacts =
                                          typeof order.drop_contacts ===
                                          "string"
                                            ? JSON.parse(order.drop_contacts)
                                            : order.drop_contacts;

                                        return Array.isArray(dropLocations) ? (
                                          dropLocations.map((drop, idx) => (
                                            <div key={idx} className="mb-2">
                                              <p className="mb-0 f-s-12 text-secondary">
                                                <strong>Drop {idx + 1}:</strong>{" "}
                                                {drop.address}
                                              </p>
                                              {dropContacts &&
                                                dropContacts[idx] && (
                                                  <p className="mb-0 f-s-12 text-secondary">
                                                    <strong>Contact:</strong>{" "}
                                                    {dropContacts[idx].name} (
                                                    {dropContacts[idx].mobile})
                                                  </p>
                                                )}
                                            </div>
                                          ))
                                        ) : (
                                          <p className="mb-0 f-s-12 text-secondary">
                                            {order.drop_address}
                                          </p>
                                        );
                                      } catch (error) {
                                        console.error(
                                          "Error parsing drop locations:",
                                          error
                                        );
                                        return (
                                          <p className="mb-0 f-s-12 text-secondary">
                                            {order.drop_address}
                                          </p>
                                        );
                                      }
                                    })()}
                                  </div>
                                ) : (
                                  <p className="mb-0 f-s-12 text-secondary">
                                    {order.drop_address}
                                  </p>
                                )}
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
                                    pathname: `/dashboard/order-details/${order.booking_id}/${order.order_id}`,
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

export default AllGoodsDriverOrders;
