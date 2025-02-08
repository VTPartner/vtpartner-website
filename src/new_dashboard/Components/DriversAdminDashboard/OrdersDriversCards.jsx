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

const OrdersDriversCards = () => {
  const [cardBalance, setCardBalance] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiration, setExpiration] = useState("");

  const [displayBalance, setDisplayBalance] = useState("$8,625.00");
  const [displayCardNumber, setDisplayCardNumber] = useState(
    "**** **** **** 7894"
  );
  const [displayExpiration, setDisplayExpiration] = useState("07/24");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mask card number to show only the last 4 digits
    const maskedCardNumber = `**** **** **** ${cardNumber.slice(-4)}`;

    // Update the displayed values
    setDisplayBalance(cardBalance);
    setDisplayCardNumber(maskedCardNumber);
    setDisplayExpiration(expiration);

    // Clear the form inputs
    setCardBalance("");
    setCardNumber("");
    setExpiration("");
  };

  const [activeTab, setActiveTab] = useState("1");

  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  useEffect(() => {
    setTimeout(() => {
      const props = {
        searching: false, // Disable the search field
        ordering: false, // Disable sorting functionality
        paging: false, // Disable pagination
      };
      new DataTable("#recentOrders", props);
      new DataTable("#recentOrders1", props);
      new DataTable("#recentOrders2", props);
      new DataTable("#recentOrders3", props);
      new DataTable("#recentOrders4", props);

      return () => {
        new DataTable("#recentOrders").destroy();
        new DataTable("#recentOrders1").destroy();
        new DataTable("#recentOrders2").destroy();
        new DataTable("#recentOrders3").destroy();
        new DataTable("#recentOrders4").destroy();
      };
    }, 2000);
  }, []);

  return (
    <>
      <Col lg="6" xxl="6" className="order-2-l">
        <Card className="shadow-lg border-0 rounded-lg">
          <CardBody>
            {/* Header Section */}
            <div>
              <h5 className="header-title-text">All Drivers </h5>
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
                    className={activeTab === "1" ? "active" : ""}
                    onClick={() => toggleTab("1")}
                    id="tshirt-tab"
                    role="tab"
                  >
                    <span> All</span>
                  </NavLink>
                </NavItem>

                {/* Watch Tab */}
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

                {/* Bag Tab */}
                <NavItem>
                  <NavLink
                    className={activeTab === "3" ? "active" : ""}
                    onClick={() => toggleTab("3")}
                    id="bag-tab"
                    role="tab"
                  >
                    <span>Banned</span>
                  </NavLink>
                </NavItem>
              </Nav>

              <TabContent activeTab={activeTab}>
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
                              <th>
                                <label className="check-box">
                                  <input type="checkbox" id="select-all" />
                                  <span className="checkmark outline-secondary ms-2"></span>
                                </label>
                              </th>
                              <th>Name</th>
                              <th>Leader</th>
                              <th>Status</th>
                              <th>Client</th>
                              <th>Start Date</th>
                              <th>End Date</th>
                              <th>Action</th>
                            </tr>
                          </thead>

                          <tbody>
                            {projectData.map((item) => (
                              <tr key={item.id}>
                                <td>
                                  <label className="check-box">
                                    <input type="checkbox" />
                                    <span className="checkmark outline-secondary ms-2"></span>
                                  </label>
                                </td>
                                <td>
                                  <div className="d-flex justify-content-left align-items-center">
                                    <div className="h-30 w-30 d-flex-center b-r-50 overflow-hidden me-2">
                                      <img
                                        src={item.logo}
                                        alt={item.title}
                                        className="img-fluid"
                                      />
                                    </div>
                                    <div>
                                      <h6 className="f-s-15 mb-0">
                                        {item.title}
                                      </h6>
                                      <p className="text-secondary f-s-13 mb-0">
                                        {item.date}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td className="text-dark f-w-500">
                                  {item.creator}
                                </td>
                                <td>
                                  <span
                                    className={`badge bg-${
                                      item.status === "New"
                                        ? "primary"
                                        : item.status === "Inprogress"
                                        ? "warning"
                                        : item.status === "Completed"
                                        ? "success"
                                        : "danger"
                                    }`}
                                  >
                                    {item.status}
                                  </span>
                                </td>
                                <td>{item.manager}</td>
                                <td className="text-success f-w-500">
                                  {item.startDate}
                                </td>
                                <td className="text-danger f-w-500">
                                  {item.endDate}
                                </td>
                                <td>
                                  <button
                                    type="button"
                                    className="btn btn-danger icon-btn b-r-4 delete-btn"
                                  >
                                    <i className="ti ti-trash"></i>
                                  </button>{" "}
                                  <button
                                    type="button"
                                    className="btn btn-success icon-btn b-r-4"
                                    data-bs-toggle="modal"
                                    data-bs-target="#editCardModal"
                                  >
                                    <i className="ti ti-edit"></i>
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    </Col>
                  </Row>
                </TabPane>

                {/* Watch Tab Pane */}
                <TabPane tabId="2">
                  <Row>
                    <Col sm="12">
                      <div className="table-responsive app-scroll app-datatable-default">
                        <Table
                          striped
                          responsive
                          id="recentOrders1"
                          className="display"
                        >
                          <thead>
                            <tr>
                              <th>Id</th>
                              <th>Order</th>
                              <th>Qty</th>
                              <th>Status</th>
                              <th>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orders1.map((order, index) => (
                              <tr key={index}>
                                <td>{order.id}</td>
                                <td>
                                  <div className="position-relative">
                                    <div className="h-40 w-40 d-flex-center b-r-15 overflow-hidden p-1 position-absolute">
                                      <img
                                        src={order.order.img}
                                        alt={order.order.name}
                                        className="img-fluid"
                                      />
                                    </div>
                                    <div className="ms-5">
                                      <h6 className="mb-0 f-s-16">
                                        {order.order.name}
                                      </h6>
                                      <p className="mb-0 f-s-14 text-secondary">
                                        {order.order.quantity}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td>{order.qty}</td>
                                <td>
                                  <span
                                    className="badge"
                                    color={order.statusClass}
                                  >
                                    {order.status}
                                  </span>
                                </td>
                                <td>{order.date}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    </Col>
                  </Row>
                </TabPane>

                {/* Bag Tab Pane */}
                <TabPane tabId="3">
                  <Row>
                    <Col sm="12">
                      <div className="table-responsive app-scroll app-datatable-default">
                        <Table id="recentOrders2" striped bordered hover>
                          <thead>
                            <tr>
                              <th>Id</th>
                              <th>Order</th>
                              <th>Qty</th>
                              <th>Status</th>
                              <th>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orders2.map((order, index) => (
                              <tr key={index}>
                                <td>{order.id}</td>
                                <td>
                                  <div className="position-relative">
                                    <div className="h-40 w-40 d-flex-center b-r-15 overflow-hidden p-1 position-absolute">
                                      <img
                                        src={order.order.imageUrl}
                                        alt=""
                                        className="img-fluid"
                                      />
                                    </div>
                                    <div className="ms-5">
                                      <h6 className="mb-0 f-s-16">
                                        {order.order.title}
                                      </h6>
                                      <p className="mb-0 f-s-14 text-secondary">
                                        {order.order.description}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td>{order.qty}</td>
                                <td>
                                  <span
                                    className={`badge text-light-${
                                      order.status === "DELIVERED"
                                        ? "success"
                                        : "primary"
                                    }`}
                                  >
                                    {order.status}
                                  </span>
                                </td>
                                <td>{order.date}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    </Col>
                  </Row>
                </TabPane>

                {/* Shoes Tab Pane */}
                <TabPane tabId="4">
                  <Row>
                    <Col sm="12">
                      <div className="table-responsive app-scroll app-datatable-default">
                        <Table id="recentOrders3" className="display">
                          <thead>
                            <tr>
                              <th>Id</th>
                              <th>Order</th>
                              <th>Qty</th>
                              <th>Status</th>
                              <th>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orders3.map((order, index) => (
                              <tr key={index}>
                                <td>{order.id}</td>
                                <td>
                                  <div className="position-relative">
                                    <div className="h-40 w-40 d-flex-center b-r-15 overflow-hidden p-1 position-absolute">
                                      <img
                                        src={order.image}
                                        alt={order.order}
                                        className="img-fluid"
                                      />
                                    </div>
                                    <div className="ms-5">
                                      <h6 className="mb-0 f-s-16">
                                        {order.order}
                                      </h6>
                                      <p className="mb-0 f-s-14 text-secondary">
                                        {order.productCount}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td>{order.qty}</td>
                                <td>
                                  <span
                                    className={`badge text-light-${
                                      order.status === "PICKUPS"
                                        ? "primary"
                                        : order.status === "DELIVERED"
                                        ? "success"
                                        : "dark"
                                    }`}
                                  >
                                    {order.status}
                                  </span>
                                </td>
                                <td>{order.date}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    </Col>
                  </Row>
                </TabPane>

                {/* Sunglasses Tab Pane */}
                <TabPane tabId="5">
                  <Row>
                    <Col sm="12">
                      <div className="table-responsive app-scroll app-datatable-default">
                        <Table id="recentOrders4" className="display">
                          <thead>
                            <tr>
                              <th>Id</th>
                              <th>Order</th>
                              <th>Qty</th>
                              <th>Status</th>
                              <th>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orders4.map((order, index) => (
                              <tr key={index}>
                                <td>{order.id}</td>
                                <td>
                                  <div className="position-relative">
                                    <div className="h-40 w-40 d-flex-center b-r-15 overflow-hidden bg-light-secondary p-1 position-absolute">
                                      <img
                                        src={order.image}
                                        alt={order.order}
                                        className="img-fluid"
                                      />
                                    </div>
                                    <div className="ms-5">
                                      <h6 className="mb-0 f-s-16">
                                        {order.order}
                                      </h6>
                                      <p className="mb-0 f-s-14 text-secondary">
                                        {order.productCount}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td>{order.qty}</td>
                                <td>
                                  <span
                                    className={`badge text-light-${
                                      order.status === "PICKUPS"
                                        ? "primary"
                                        : "secondary"
                                    }`}
                                  >
                                    {order.status}
                                  </span>
                                </td>
                                <td>{order.date}</td>
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

      <Col lg="6" xxl="6" className="order-2-l">
        <Card className="shadow-lg border-0 rounded-lg">
          <CardBody>
            {/* Header Section */}
            <div>
              <h5 className="header-title-text">Driver Bookings & Orders </h5>
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
                    className={activeTab === "1" ? "active" : ""}
                    onClick={() => toggleTab("1")}
                    id="tshirt-tab"
                    role="tab"
                  >
                    <span> OnGoing</span>
                  </NavLink>
                </NavItem>

                {/* Watch Tab */}
                <NavItem>
                  <NavLink
                    className={activeTab === "2" ? "active" : ""}
                    onClick={() => toggleTab("2")}
                    id="watch-tab"
                    role="tab"
                  >
                    <span>Completed</span>
                  </NavLink>
                </NavItem>

                {/* Bag Tab */}
                <NavItem>
                  <NavLink
                    className={activeTab === "3" ? "active" : ""}
                    onClick={() => toggleTab("3")}
                    id="bag-tab"
                    role="tab"
                  >
                    <span>Cancelled</span>
                  </NavLink>
                </NavItem>
              </Nav>

              <TabContent activeTab={activeTab}>
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
                              <th>
                                <label className="check-box">
                                  <input type="checkbox" id="select-all" />
                                  <span className="checkmark outline-secondary ms-2"></span>
                                </label>
                              </th>
                              <th>Name</th>
                              <th>Leader</th>
                              <th>Status</th>
                              <th>Client</th>
                              <th>Start Date</th>
                              <th>End Date</th>
                              <th>Action</th>
                            </tr>
                          </thead>

                          <tbody>
                            {projectData.map((item) => (
                              <tr key={item.id}>
                                <td>
                                  <label className="check-box">
                                    <input type="checkbox" />
                                    <span className="checkmark outline-secondary ms-2"></span>
                                  </label>
                                </td>
                                <td>
                                  <div className="d-flex justify-content-left align-items-center">
                                    <div className="h-30 w-30 d-flex-center b-r-50 overflow-hidden me-2">
                                      <img
                                        src={item.logo}
                                        alt={item.title}
                                        className="img-fluid"
                                      />
                                    </div>
                                    <div>
                                      <h6 className="f-s-15 mb-0">
                                        {item.title}
                                      </h6>
                                      <p className="text-secondary f-s-13 mb-0">
                                        {item.date}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td className="text-dark f-w-500">
                                  {item.creator}
                                </td>
                                <td>
                                  <span
                                    className={`badge bg-${
                                      item.status === "New"
                                        ? "primary"
                                        : item.status === "Inprogress"
                                        ? "warning"
                                        : item.status === "Completed"
                                        ? "success"
                                        : "danger"
                                    }`}
                                  >
                                    {item.status}
                                  </span>
                                </td>
                                <td>{item.manager}</td>
                                <td className="text-success f-w-500">
                                  {item.startDate}
                                </td>
                                <td className="text-danger f-w-500">
                                  {item.endDate}
                                </td>
                                <td>
                                  <button
                                    type="button"
                                    className="btn btn-danger icon-btn b-r-4 delete-btn"
                                  >
                                    <i className="ti ti-trash"></i>
                                  </button>{" "}
                                  <button
                                    type="button"
                                    className="btn btn-success icon-btn b-r-4"
                                    data-bs-toggle="modal"
                                    data-bs-target="#editCardModal"
                                  >
                                    <i className="ti ti-edit"></i>
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    </Col>
                  </Row>
                </TabPane>

                {/* Watch Tab Pane */}
                <TabPane tabId="2">
                  <Row>
                    <Col sm="12">
                      <div className="table-responsive app-scroll app-datatable-default">
                        <Table
                          striped
                          responsive
                          id="recentOrders1"
                          className="display"
                        >
                          <thead>
                            <tr>
                              <th>Id</th>
                              <th>Order</th>
                              <th>Qty</th>
                              <th>Status</th>
                              <th>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orders1.map((order, index) => (
                              <tr key={index}>
                                <td>{order.id}</td>
                                <td>
                                  <div className="position-relative">
                                    <div className="h-40 w-40 d-flex-center b-r-15 overflow-hidden p-1 position-absolute">
                                      <img
                                        src={order.order.img}
                                        alt={order.order.name}
                                        className="img-fluid"
                                      />
                                    </div>
                                    <div className="ms-5">
                                      <h6 className="mb-0 f-s-16">
                                        {order.order.name}
                                      </h6>
                                      <p className="mb-0 f-s-14 text-secondary">
                                        {order.order.quantity}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td>{order.qty}</td>
                                <td>
                                  <span
                                    className="badge"
                                    color={order.statusClass}
                                  >
                                    {order.status}
                                  </span>
                                </td>
                                <td>{order.date}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    </Col>
                  </Row>
                </TabPane>

                {/* Bag Tab Pane */}
                <TabPane tabId="3">
                  <Row>
                    <Col sm="12">
                      <div className="table-responsive app-scroll app-datatable-default">
                        <Table id="recentOrders2" striped bordered hover>
                          <thead>
                            <tr>
                              <th>Id</th>
                              <th>Order</th>
                              <th>Qty</th>
                              <th>Status</th>
                              <th>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orders2.map((order, index) => (
                              <tr key={index}>
                                <td>{order.id}</td>
                                <td>
                                  <div className="position-relative">
                                    <div className="h-40 w-40 d-flex-center b-r-15 overflow-hidden p-1 position-absolute">
                                      <img
                                        src={order.order.imageUrl}
                                        alt=""
                                        className="img-fluid"
                                      />
                                    </div>
                                    <div className="ms-5">
                                      <h6 className="mb-0 f-s-16">
                                        {order.order.title}
                                      </h6>
                                      <p className="mb-0 f-s-14 text-secondary">
                                        {order.order.description}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td>{order.qty}</td>
                                <td>
                                  <span
                                    className={`badge text-light-${
                                      order.status === "DELIVERED"
                                        ? "success"
                                        : "primary"
                                    }`}
                                  >
                                    {order.status}
                                  </span>
                                </td>
                                <td>{order.date}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    </Col>
                  </Row>
                </TabPane>

                {/* Shoes Tab Pane */}
                <TabPane tabId="4">
                  <Row>
                    <Col sm="12">
                      <div className="table-responsive app-scroll app-datatable-default">
                        <Table id="recentOrders3" className="display">
                          <thead>
                            <tr>
                              <th>Id</th>
                              <th>Order</th>
                              <th>Qty</th>
                              <th>Status</th>
                              <th>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orders3.map((order, index) => (
                              <tr key={index}>
                                <td>{order.id}</td>
                                <td>
                                  <div className="position-relative">
                                    <div className="h-40 w-40 d-flex-center b-r-15 overflow-hidden p-1 position-absolute">
                                      <img
                                        src={order.image}
                                        alt={order.order}
                                        className="img-fluid"
                                      />
                                    </div>
                                    <div className="ms-5">
                                      <h6 className="mb-0 f-s-16">
                                        {order.order}
                                      </h6>
                                      <p className="mb-0 f-s-14 text-secondary">
                                        {order.productCount}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td>{order.qty}</td>
                                <td>
                                  <span
                                    className={`badge text-light-${
                                      order.status === "PICKUPS"
                                        ? "primary"
                                        : order.status === "DELIVERED"
                                        ? "success"
                                        : "dark"
                                    }`}
                                  >
                                    {order.status}
                                  </span>
                                </td>
                                <td>{order.date}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    </Col>
                  </Row>
                </TabPane>

                {/* Sunglasses Tab Pane */}
                <TabPane tabId="5">
                  <Row>
                    <Col sm="12">
                      <div className="table-responsive app-scroll app-datatable-default">
                        <Table id="recentOrders4" className="display">
                          <thead>
                            <tr>
                              <th>Id</th>
                              <th>Order</th>
                              <th>Qty</th>
                              <th>Status</th>
                              <th>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orders4.map((order, index) => (
                              <tr key={index}>
                                <td>{order.id}</td>
                                <td>
                                  <div className="position-relative">
                                    <div className="h-40 w-40 d-flex-center b-r-15 overflow-hidden bg-light-secondary p-1 position-absolute">
                                      <img
                                        src={order.image}
                                        alt={order.order}
                                        className="img-fluid"
                                      />
                                    </div>
                                    <div className="ms-5">
                                      <h6 className="mb-0 f-s-16">
                                        {order.order}
                                      </h6>
                                      <p className="mb-0 f-s-14 text-secondary">
                                        {order.productCount}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td>{order.qty}</td>
                                <td>
                                  <span
                                    className={`badge text-light-${
                                      order.status === "PICKUPS"
                                        ? "primary"
                                        : "secondary"
                                    }`}
                                  >
                                    {order.status}
                                  </span>
                                </td>
                                <td>{order.date}</td>
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

export default OrdersDriversCards;
