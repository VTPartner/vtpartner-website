/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Col,
  Row,
  Card,
  CardBody,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Table,
} from "reactstrap";
import Cleave from "cleave.js/react";
import {
  ordersData,
  orders1,
  orders2,
  orders3,
  orders4,
} from "../../Data/Dashboards/EcommerceData";
import DataTable from "datatables.net";
import "datatables.net-dt/css/dataTables.dataTables.css";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import { projectData } from "../../Data/Datatable/advancedDatatable";
import Loader from "../Loader";

import axios from "axios";
import Cookies from "js-cookie";
import { formatEpoch, serverEndPoint } from "../../../dashboard/app/constants";
import { Link } from "react-router-dom";

const OrdersCards = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [activeOrdersTab, setActiveOrdersTab] = useState("1");

  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
    // if (activeTab == "3") {
    //   fetchBlockedDriversData();
    // } else if (activeTab == "2") {
    //   fetchRejectedDriversData();
    // } else if (activeTab == "4") {
    //   fetchUnVerifiedDriversData();
    // } else {
    //   fetchVerifiedDriversData();
    // }
  };

  // Use useEffect to fetch data when activeTab changes
  useEffect(() => {
    switch (activeTab) {
      case "3":
        fetchBlockedDriversData();
        break;
      case "2":
        fetchRejectedDriversData();
        break;
      case "4":
        fetchUnVerifiedDriversData();
        break;
      case "5":
        fetchOnlineDriversData();
        break;
      default:
        fetchVerifiedDriversData();
        break;
    }
  }, [activeTab]); // Runs whenever activeTab changes

  const toggleTabOrders = (tab) => {
    if (activeOrdersTab !== tab) setActiveOrdersTab(tab);
    // if (activeOrdersTab == "2") {
    //   fetchAllCompletedOrdersData();
    // } else if (activeOrdersTab == "3") {
    //   fetchAllCancelledBookingsData();
    // } else {
    //   fetchAllOngoingBookingsData();
    // }
  };

  // Use useEffect to fetch data when activeTab changes
  useEffect(() => {
    switch (activeOrdersTab) {
      case "3":
        fetchAllCancelledBookingsData();
        break;
      case "2":
        fetchAllCompletedOrdersData();
        break;

      default:
        fetchAllOngoingBookingsData();
        break;
    }
  }, [activeOrdersTab]); // Runs whenever activeTab changes

  const [loading, setLoading] = useState(true);
  const [allDrivers, setAllDrivers] = useState([]);
  const [allRejectedDrivers, setAllRejectedDrivers] = useState([]);
  const [allOnlineDrivers, setAllOnlineDrivers] = useState([]);
  const [allBlockedDrivers, setAllBlockedDrivers] = useState([]);
  const [allNewDrivers, setAllNewDrivers] = useState([]);
  const [allOngoingBookings, setAllOngoingBookings] = useState([]);
  const [allCancelledBookings, setAllCancelledBookings] = useState([]);
  const [allCompletedOrders, setAllCompletedOrders] = useState([]);

  const fetchVerifiedDriversData = async () => {
    const token = Cookies.get("authToken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    try {
      setLoading(true);

      const [verifiedDriversRes] = await Promise.all([
        axios.post(
          `${serverEndPoint}/get_total_goods_drivers_verified_with_count`,
          {
            key: 1,
          },
          config
        ),
      ]);
      console.log("All Verified Drivers::" + verifiedDriversRes.data.drivers);

      setAllDrivers(verifiedDriversRes.data.drivers || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchBlockedDriversData = async () => {
    const token = Cookies.get("authToken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    try {
      setLoading(true);

      const [blockedDriversRes] = await Promise.all([
        axios.post(
          `${serverEndPoint}/get_total_goods_drivers_blocked_with_count`,
          {
            key: 1,
          },
          config
        ),
      ]);

      console.log("All blocked Drivers::" + blockedDriversRes.data.drivers);

      setAllBlockedDrivers(blockedDriversRes.data.drivers || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRejectedDriversData = async () => {
    const token = Cookies.get("authToken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    try {
      setLoading(true);

      const [rejectedDriversRes] = await Promise.all([
        axios.post(
          `${serverEndPoint}/get_total_goods_drivers_rejected_with_count`,
          {
            key: 1,
          },
          config
        ),
      ]);

      console.log("All rejected Drivers::" + rejectedDriversRes.data.drivers);

      setAllRejectedDrivers(rejectedDriversRes.data.drivers || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOnlineDriversData = async () => {
    const token = Cookies.get("authToken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    try {
      setLoading(true);

      const [rejectedDriversRes] = await Promise.all([
        axios.post(
          `${serverEndPoint}/get_all_goods_driver_online_current_location`,
          {},
          config
        ),
      ]);

      setAllOnlineDrivers(rejectedDriversRes.data.results || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnVerifiedDriversData = async () => {
    const token = Cookies.get("authToken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    try {
      setLoading(true);

      const [unVerifiedDriversRes] = await Promise.all([
        axios.post(
          `${serverEndPoint}/get_total_goods_drivers_un_verified_with_count`,
          {
            key: 1,
          },
          config
        ),
      ]);

      console.log(
        "All unVerifiedDriversRes Drivers::" + unVerifiedDriversRes.data.drivers
      );

      setAllNewDrivers(unVerifiedDriversRes.data.drivers || []);
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
          {
            key: 1,
          },
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

      const [cancelledBookingResponse] = await Promise.all([
        axios.post(
          `${serverEndPoint}/get_goods_all_cancelled_bookings_details`,
          {
            key: 1,
          },
          config
        ),
      ]);

      setAllCancelledBookings(cancelledBookingResponse.data.results || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchAllCompletedOrdersData = async () => {
    const token = Cookies.get("authToken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    try {
      setLoading(true);

      const [completedOrdersResponse] = await Promise.all([
        axios.post(
          `${serverEndPoint}/get_goods_all_completed_orders_details`,
          {
            key: 1,
          },
          config
        ),
      ]);

      setAllCompletedOrders(completedOrdersResponse.data.results || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifiedDriversData();
    fetchAllOngoingBookingsData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Col lg="12" xxl="6" className="order-2-l">
        <Card className="shadow-lg border-0 rounded">
          <CardBody>
            {/* Header Section */}
            <div>
              <h5 className="header-title-text">
                Recent Goods Drivers Details
              </h5>
              {/* <p className="fs-16 text-secondary mb-0">Latest 2H Update</p> */}
            </div>
            <div className="recent-order-table">
              <Nav
                tabs
                className="app-tabs-primary pb-0 mb-3"
                id="Basic"
                role="tablist"
              >
                {/* All Verified Tab */}
                <NavItem>
                  <NavLink
                    className={activeTab === "1" ? "active" : ""}
                    onClick={() => toggleTab("1")}
                    id="tshirt-tab"
                    role="tab"
                  >
                    <span> Verified</span>
                  </NavLink>
                </NavItem>

                {/* Rejected Tab */}
                <NavItem>
                  <NavLink
                    className={activeTab === "2" ? "active" : ""}
                    onClick={() => toggleTab("2")}
                    id="watch-tab"
                    role="tab"
                  >
                    <span>Rejected</span>
                  </NavLink>
                </NavItem>

                {/* Banned Tab */}
                <NavItem>
                  <NavLink
                    className={activeTab === "3" ? "active" : ""}
                    onClick={() => toggleTab("3")}
                    id="bag-tab"
                    role="tab"
                  >
                    <span>Blocked</span>
                  </NavLink>
                </NavItem>
                {/* Banned Tab */}
                <NavItem>
                  <NavLink
                    className={activeTab === "4" ? "active" : ""}
                    onClick={() => toggleTab("4")}
                    id="bag-tab"
                    role="tab"
                  >
                    <span>New</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={activeTab === "5" ? "active" : ""}
                    onClick={() => toggleTab("5")}
                    id="bag-tab"
                    role="tab"
                  >
                    <span>Online Drivers</span>
                  </NavLink>
                </NavItem>
              </Nav>

              <TabContent activeTab={activeTab}>
                {/* All drivers  */}
                <TabPane tabId="1">
                  <Row>
                    <Col sm="12">
                      <div className="app-scroll table-responsive app-datatable-default project-table">
                        <Table
                          id="projectTable"
                          className="w-100 display  align-middle"
                        >
                          <thead>
                            <tr>
                              <th>Driver ID</th>
                              <th>Driver Name</th>
                              <th>Registration Date</th>
                              <th>Action</th>
                            </tr>
                          </thead>

                          <tbody>
                            {allDrivers.map((driver) => (
                              <tr key={driver.goods_driver_id}>
                                <td># {driver.goods_driver_id}</td>
                                <td>
                                  <div className="position-relative">
                                    <div className="h-40 w-40 d-flex-center b-r-15 overflow-hidden p-1 position-absolute">
                                      <img
                                        src={driver.profile_pic}
                                        alt={driver.driver_first_name}
                                        className="img-fluid"
                                      />
                                    </div>
                                    <div className="ms-5">
                                      <h6 className="mb-0 f-s-16">
                                        {driver.driver_first_name}
                                      </h6>
                                      <p className="mb-0 f-s-14 text-secondary">
                                        {driver.mobile_no}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  {new Date(
                                    driver.registration_date
                                  ).toLocaleDateString()}
                                </td>
                                <td>
                                  <Link
                                    to={{
                                      pathname: `/dashboard/goods-driver-profile-details/${driver.goods_driver_id}`,
                                      state: { driverDetails: driver }, // Pass additional data
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
                        </Table>
                      </div>
                    </Col>
                  </Row>
                </TabPane>

                {/* Rejected Drivers Pane */}
                <TabPane tabId="2">
                  <Row>
                    <Col sm="12">
                      <div className="app-scroll table-responsive app-datatable-default project-table">
                        <Table
                          id="projectTable"
                          className="w-100 display  align-middle"
                        >
                          <thead>
                            <tr>
                              <th>Driver ID</th>
                              <th>Driver Name</th>
                              <th>Registration Date</th>
                              <th>Action</th>
                            </tr>
                          </thead>

                          <tbody>
                            {allRejectedDrivers.map((driver) => (
                              <tr key={driver.goods_driver_id}>
                                <td># {driver.goods_driver_id}</td>
                                <td>
                                  <div className="position-relative">
                                    <div className="h-40 w-40 d-flex-center b-r-15 overflow-hidden p-1 position-absolute">
                                      <img
                                        src={driver.profile_pic}
                                        alt={driver.driver_first_name}
                                        className="img-fluid"
                                      />
                                    </div>
                                    <div className="ms-5">
                                      <h6 className="mb-0 f-s-16">
                                        {driver.driver_first_name}
                                      </h6>
                                      <p className="mb-0 f-s-14 text-secondary">
                                        {driver.mobile_no}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  {new Date(
                                    driver.registration_date
                                  ).toLocaleDateString()}
                                </td>
                                <td>
                                  <Link
                                    to={{
                                      pathname: `/dashboard/goods-driver-profile-details/${driver.goods_driver_id}`,
                                      state: { driverDetails: driver }, // Pass additional data
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
                        </Table>
                      </div>
                    </Col>
                  </Row>
                </TabPane>

                {/* Banned Drivers Pane */}
                <TabPane tabId="3">
                  <Row>
                    <Col sm="12">
                      <div className="app-scroll table-responsive app-datatable-default project-table">
                        <Table
                          id="projectTable"
                          className="w-100 display  align-middle"
                        >
                          <thead>
                            <tr>
                              <th>Driver ID</th>
                              <th>Driver Details</th>
                              <th>Registration Date</th>
                              <th>Action</th>
                            </tr>
                          </thead>

                          <tbody>
                            {allBlockedDrivers.map((driver) => (
                              <tr key={driver.goods_driver_id}>
                                <td># {driver.goods_driver_id}</td>
                                <td>
                                  <div className="position-relative">
                                    <div className="h-40 w-40 d-flex-center b-r-15 overflow-hidden p-1 position-absolute">
                                      <img
                                        src={driver.profile_pic}
                                        alt={driver.driver_first_name}
                                        className="img-fluid"
                                      />
                                    </div>
                                    <div className="ms-5">
                                      <h6 className="mb-0 f-s-16">
                                        {driver.driver_first_name}
                                      </h6>
                                      <p className="mb-0 f-s-14 text-secondary">
                                        {driver.mobile_no}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  {new Date(
                                    driver.registration_date
                                  ).toLocaleDateString()}
                                </td>
                                <td>
                                  <Link
                                    to={{
                                      pathname: `/dashboard/goods-driver-profile-details/${driver.goods_driver_id}`,
                                      state: { driverDetails: driver }, // Pass additional data
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
                        </Table>
                      </div>
                    </Col>
                  </Row>
                </TabPane>

                {/* New Drivers Pane */}
                <TabPane tabId="4">
                  <Row>
                    <Col sm="12">
                      <div className="app-scroll table-responsive app-datatable-default project-table">
                        <Table
                          id="projectTable"
                          className="w-100 display  align-middle"
                        >
                          <thead>
                            <tr>
                              <th>Driver ID</th>
                              <th>Driver Details</th>
                              <th>Registration Date</th>
                              <th>Action</th>
                            </tr>
                          </thead>

                          <tbody>
                            {allNewDrivers.map((driver) => (
                              <tr key={driver.goods_driver_id}>
                                <td># {driver.goods_driver_id}</td>
                                <td>
                                  <div className="position-relative">
                                    <div className="h-40 w-40 d-flex-center b-r-15 overflow-hidden p-1 position-absolute">
                                      <img
                                        src={driver.profile_pic}
                                        alt={driver.driver_first_name}
                                        className="img-fluid"
                                      />
                                    </div>
                                    <div className="ms-5">
                                      <h6 className="mb-0 f-s-16">
                                        {driver.driver_first_name}
                                      </h6>
                                      <p className="mb-0 f-s-14 text-secondary">
                                        {driver.mobile_no}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  {new Date(
                                    driver.registration_date
                                  ).toLocaleDateString()}
                                </td>
                                <td>
                                  <Link
                                    to={{
                                      pathname: `/dashboard/goods-driver-profile-details/${driver.goods_driver_id}`,
                                      state: { driverDetails: driver }, // Pass additional data
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
                        </Table>
                      </div>
                    </Col>
                  </Row>
                </TabPane>

                {/* Online Drivers Pane */}
                <TabPane tabId="5">
                  <Row>
                    <Col sm="12">
                      <div className="app-scroll table-responsive app-datatable-default project-table">
                        <Table
                          id="projectTable"
                          className="w-100 display  align-middle"
                        >
                          <thead>
                            <tr>
                              <th>Driver ID</th>
                              <th>Driver Details</th>
                              <th>Status</th>
                              <th>Action</th>
                            </tr>
                          </thead>

                          <tbody>
                            {allOnlineDrivers.map((driver) => (
                              <tr key={driver.goods_driver_id}>
                                <td># {driver.goods_driver_id}</td>
                                <td>
                                  <div className="position-relative">
                                    <div className="h-40 w-40 d-flex-center b-r-15 overflow-hidden p-1 position-absolute">
                                      <img
                                        src={driver.profile_pic}
                                        alt={driver.driver_first_name}
                                        className="img-fluid"
                                      />
                                    </div>
                                    <div className="ms-5">
                                      <h6 className="mb-0 f-s-16">
                                        {driver.driver_first_name}
                                      </h6>
                                      <p className="mb-0 f-s-14 text-secondary">
                                        {driver.mobile_no}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <span
                                    className={`badge bg-${
                                      driver.current_status === 1
                                        ? "success"
                                        : driver.current_status === 2
                                        ? "primary"
                                        : driver.current_status === 0
                                        ? "success"
                                        : "danger"
                                    }`}
                                  >
                                    {driver.current_status === 1
                                      ? "Online"
                                      : "Busy"}
                                  </span>
                                </td>

                                <td>
                                  <Link
                                    to={{
                                      pathname: `/dashboard/goods-driver-profile-details/${driver.goods_driver_id}`,
                                      state: { driverDetails: driver }, // Pass additional data
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
                        </Table>
                      </div>
                    </Col>
                  </Row>
                </TabPane>
              </TabContent>
            </div>
          </CardBody>
        </Card>
      </Col>

      <Col lg="12" xxl="6" className="order-2-l">
        <Card className="shadow-lg border-0 rounded">
          <CardBody>
            {/* Header Section */}
            <div>
              <h5 className="header-title-text">Recent Bookings & Orders </h5>
              {/* <p className="fs-16 text-secondary mb-0">Latest 2H Update</p> */}
            </div>
            <div className="recent-order-table">
              <Nav
                tabs
                className="app-tabs-primary pb-0 mb-3"
                id="Basic"
                role="tablist"
              >
                {/* OnGoing Orders Tab */}
                <NavItem>
                  <NavLink
                    className={activeOrdersTab === "1" ? "active" : ""}
                    onClick={() => toggleTabOrders("1")}
                    id="tshirt-tab"
                    role="tab"
                  >
                    <span> OnGoing</span>
                  </NavLink>
                </NavItem>

                {/* Completed Tab */}
                <NavItem>
                  <NavLink
                    className={activeOrdersTab === "2" ? "active" : ""}
                    onClick={() => toggleTabOrders("2")}
                    id="watch-tab"
                    role="tab"
                  >
                    <span>Completed</span>
                  </NavLink>
                </NavItem>

                {/* Bag Tab */}
                <NavItem>
                  <NavLink
                    className={activeOrdersTab === "3" ? "active" : ""}
                    onClick={() => toggleTabOrders("3")}
                    id="bag-tab"
                    role="tab"
                  >
                    <span>Cancelled</span>
                  </NavLink>
                </NavItem>
              </Nav>

              <TabContent activeTab={activeOrdersTab}>
                {/* OnGoing Orders Tab Pane */}
                <TabPane tabId="1">
                  <Row>
                    <Col sm="12">
                      <div className="app-scroll table-responsive app-datatable-default project-table">
                        <Table
                          id="projectTable"
                          className="w-100 display  align-middle"
                        >
                          <thead>
                            <tr>
                              <th>Booking ID</th>
                              <th>Customer Details</th>
                              <th>Driver Details</th>
                              <th>Pickup</th>
                              <th>Drop</th>
                              <th>Amount</th>
                              <th>Status</th>
                              <th>Booking </th>

                              <th>Action</th>
                            </tr>
                          </thead>

                          <tbody>
                            {allOngoingBookings.map((item) => (
                              <tr key={item.booking_id}>
                                <td># {item.booking_id}</td>
                                <td>
                                  <div className="d-flex justify-content-left align-items-center">
                                    <div>
                                      <h6 className="f-s-13 mb-0">
                                        {item.customer_name}
                                      </h6>
                                      <p className="text-secondary f-s-13 mb-0">
                                        {item.customer_mobile_no}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className="d-flex justify-content-left align-items-center">
                                    <div className="h-30 w-30 d-flex-center b-r-50 overflow-hidden me-2">
                                      <img
                                        src={item.vehicle_image}
                                        alt={item.vehicle_name}
                                        className="img-fluid"
                                      />
                                    </div>
                                    <div>
                                      <h6 className="f-s-13 mb-0">
                                        {item.driver_first_name}
                                      </h6>
                                      <p className="text-secondary f-s-13 mb-0">
                                        {item.driver_mobile_no}
                                      </p>
                                      <p className="text-secondary f-s-13 mb-0">
                                        {item.vehicle_name}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className="d-flex justify-content-left align-items-center">
                                    <div>
                                      <p className="text-secondary f-s-10 mb-0">
                                        {item.pickup_address}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className="d-flex justify-content-left align-items-center">
                                    <div>
                                      <p className="text-secondary f-s-10 mb-0">
                                        {item.drop_address}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <span
                                    className={`badge bg-${
                                      item.booking_status === "Driver Arrived"
                                        ? "primary"
                                        : item.booking_status ===
                                          "Driver Accepted"
                                        ? "black"
                                        : item.booking_status === "Start Trip"
                                        ? "success"
                                        : "danger"
                                    }`}
                                  >
                                    {item.total_price}
                                  </span>
                                </td>
                                <td>
                                  <span
                                    className={`badge bg-${
                                      item.booking_status === "Driver Arrived"
                                        ? "primary"
                                        : item.booking_status ===
                                          "Driver Accepted"
                                        ? "black"
                                        : item.booking_status === "Start Trip"
                                        ? "success"
                                        : "danger"
                                    }`}
                                  >
                                    {item.booking_status}
                                  </span>
                                </td>

                                <td className="text-secondary ">
                                  <p>{formatEpoch(item.booking_timing)}</p>
                                </td>

                                <td>
                                  <Link
                                    to={{
                                      pathname: `/dashboard/booking-details/${item.booking_id}`,
                                      state: { orderDetails: item }, // Pass additional data
                                    }}
                                    role="button"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-outline-primary icon-btn w-30 h-30 b-r-22 me-2"
                                  >
                                    <i className="ti ti-eye"></i>
                                  </Link>
                                  {/* <button
                                    type="button"
                                    className="btn btn-primary icon-btn"
                                    onClick={() =>
                                      //   navigate("/driver-details", {
                                      //     state: {
                                      //       driverId: driver.goods_driver_id,
                                      //     },
                                      //   })
                                      console.log(
                                        "Selected booking ID :" +
                                          item.booking_id
                                      )
                                    }
                                  >
                                    <i className="ti ti-eye"></i>
                                  </button> */}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    </Col>
                  </Row>
                </TabPane>

                {/* Completed Orders Tab Pane */}
                <TabPane tabId="2">
                  <Row>
                    <Col sm="12">
                      <div className="app-scroll table-responsive app-datatable-default project-table">
                        <Table
                          id="projectTable"
                          className="w-100 display  align-middle"
                        >
                          <thead>
                            <tr>
                              <th>Order ID</th>
                              <th>Customer Details</th>
                              <th>Driver Details</th>
                              <th>Pickup</th>
                              <th>Drop</th>
                              <th>Amount</th>
                              <th>Time </th>
                              <th>Action</th>
                            </tr>
                          </thead>

                          <tbody>
                            {allCompletedOrders.map((item) => (
                              <tr key={item.order_id}>
                                <td># {item.order_id}</td>
                                <td>
                                  <div className="d-flex justify-content-left align-items-center">
                                    <div>
                                      <h6 className="f-s-13 mb-0">
                                        {item.customer_name}
                                      </h6>
                                      <p className="text-secondary f-s-13 mb-0">
                                        {item.customer_mobile_no}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className="d-flex justify-content-left align-items-center">
                                    <div className="h-30 w-30 d-flex-center b-r-50 overflow-hidden me-2">
                                      <img
                                        src={item.vehicle_image}
                                        alt={item.vehicle_name}
                                        className="img-fluid"
                                      />
                                    </div>
                                    <div>
                                      <h6 className="f-s-13 mb-0">
                                        {item.driver_first_name}
                                      </h6>
                                      <p className="text-secondary f-s-13 mb-0">
                                        {item.driver_mobile_no}
                                      </p>
                                      <p className="text-secondary f-s-13 mb-0">
                                        {item.vehicle_name}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className="d-flex justify-content-left align-items-center">
                                    <div>
                                      <p className="text-secondary f-s-10 mb-0">
                                        {item.pickup_address}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className="d-flex justify-content-left align-items-center">
                                    <div>
                                      <p className="text-secondary f-s-10 mb-0">
                                        {item.drop_address}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <span
                                    className={`badge bg-${
                                      item.booking_status === "Driver Arrived"
                                        ? "primary"
                                        : item.booking_status === "Inprogress"
                                        ? "warning"
                                        : item.booking_status ===
                                          "Driver Accepted"
                                        ? "success"
                                        : "success"
                                    }`}
                                  >
                                    {item.total_price}
                                  </span>
                                </td>

                                <td className="text-secondary ">
                                  <p>{formatEpoch(item.booking_timing)}</p>
                                </td>

                                <td>
                                  <Link
                                    to={{
                                      pathname: `/dashboard/order-details/${item.booking_id}/${item.order_id}`,
                                      state: { orderDetails: item }, // Pass additional data
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
                        </Table>
                      </div>
                    </Col>
                  </Row>
                </TabPane>

                {/* Cancelled Booking Tab Pane */}
                <TabPane tabId="3">
                  <Row>
                    <Col sm="12">
                      <div className="app-scroll table-responsive app-datatable-default project-table">
                        <Table
                          id="projectTable"
                          className="w-100 display  align-middle"
                        >
                          <thead>
                            <tr>
                              <th>Booking ID</th>
                              <th>Customer Details</th>
                              <th>Driver Details</th>
                              <th>Pickup</th>
                              <th>Drop</th>
                              <th>Status</th>
                              <th>Booking </th>

                              <th>Action</th>
                            </tr>
                          </thead>

                          <tbody>
                            {allCancelledBookings.map((item) => (
                              <tr key={item.booking_id}>
                                <td># {item.booking_id}</td>
                                <td>
                                  <div className="d-flex justify-content-left align-items-center">
                                    <div>
                                      <h6 className="f-s-13 mb-0">
                                        {item.customer_name}
                                      </h6>
                                      <p className="text-secondary f-s-13 mb-0">
                                        {item.customer_mobile_no}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className="d-flex justify-content-left align-items-center">
                                    <div className="h-30 w-30 d-flex-center b-r-50 overflow-hidden me-2">
                                      <img
                                        src={item.vehicle_image}
                                        alt={item.vehicle_name}
                                        className="img-fluid"
                                      />
                                    </div>
                                    <div>
                                      <h6 className="f-s-13 mb-0">
                                        {item.driver_first_name}
                                      </h6>
                                      <p className="text-secondary f-s-13 mb-0">
                                        {item.driver_mobile_no}
                                      </p>
                                      <p className="text-secondary f-s-13 mb-0">
                                        {item.vehicle_name}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className="d-flex justify-content-left align-items-center">
                                    <div>
                                      <p className="text-secondary f-s-10 mb-0">
                                        {item.pickup_address}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className="d-flex justify-content-left align-items-center">
                                    <div>
                                      <p className="text-secondary f-s-10 mb-0">
                                        {item.drop_address}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <span
                                    className={`badge bg-${
                                      item.booking_status === "Driver Arrived"
                                        ? "primary"
                                        : item.booking_status === "Inprogress"
                                        ? "warning"
                                        : item.booking_status === "Completed"
                                        ? "success"
                                        : "danger"
                                    }`}
                                  >
                                    {item.booking_status}
                                  </span>
                                </td>

                                <td className="text-secondary ">
                                  <p>{formatEpoch(item.booking_timing)}</p>
                                </td>

                                <td>
                                  {/* <button
                                    type="button"
                                    className="btn btn-primary icon-btn"
                                    onClick={() =>
                                      //   navigate("/driver-details", {
                                      //     state: {
                                      //       driverId: driver.goods_driver_id,
                                      //     },
                                      //   })
                                      console.log(
                                        "Selected booking ID :" +
                                          item.booking_id
                                      )
                                    }
                                  >
                                    <i className="ti ti-eye"></i>
                                  </button> */}
                                  <Link
                                    to={{
                                      pathname: `/dashboard/booking-details/${item.booking_id}`,
                                      state: { orderDetails: item }, // Pass additional data
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
                        </Table>
                      </div>
                    </Col>
                  </Row>
                </TabPane>
              </TabContent>
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  );
};

export default OrdersCards;
