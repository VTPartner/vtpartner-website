/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import {
  formatEpoch,
  mapKey,
  serverEndPoint,
} from "../../../../dashboard/app/constants";
import Loader from "../../Loader";
import { Switch } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

const AllCabDrivers = () => {
  const [activeTab, setActiveTab] = useState("connect-tab");
  const [allDrivers, setAllDrivers] = useState([]);
  const [allRejectedDrivers, setAllRejectedDrivers] = useState([]);
  const [allOnlineDrivers, setAllOnlineDrivers] = useState([]);
  const [allBlockedDrivers, setAllBlockedDrivers] = useState([]);
  const [allNewDrivers, setAllNewDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterQuery, setFilterQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [searchQueryRejected, setSearchQueryRejected] = useState("");
  const [currentPageRejected, setCurrentPageRejected] = useState(1);
  const [searchBlockedQuery, setSearchBlockedQuery] = useState("");
  const [currentBlockedPage, setCurrentBlockedPage] = useState(1);
  const [searchQueryOnlineDrivers, setSearchQueryOnlineDrivers] = useState("");
  const [currentPageOnlineDrivers, setCurrentPageOnlineDrivers] = useState(1);
  const driversPerPage = 10;
  const [offlineDrivers, setOfflineDrivers] = useState([]);
  const [searchQueryOfflineDrivers, setSearchQueryOfflineDrivers] =
    useState("");
  const [currentPageOfflineDrivers, setCurrentPageOfflineDrivers] = useState(1);
  const [totalPagesOfflineDrivers, setTotalPagesOfflineDrivers] = useState(1);
  const [isRechargeHistoryOpen, setIsRechargeHistoryOpen] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState(null);
  const [selectedDriverName, setSelectedDriverName] = useState("");
  const [togglingDrivers, setTogglingDrivers] = useState({});

  const handleViewRechargeHistory = (driver) => {
    setSelectedDriverId(driver.cab_driver_id);
    setSelectedDriverName(driver.driver_first_name);
    setIsRechargeHistoryOpen(true);
  };

  const filteredDrivers = allDrivers.filter((driver) =>
    [driver.cab_driver_id, driver.driver_first_name, driver.mobile_no]
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredDrivers.length / driversPerPage);
  const paginatedDrivers = filteredDrivers.slice(
    (currentPage - 1) * driversPerPage,
    currentPage * driversPerPage
  );

  const searchedDrivers = allNewDrivers.filter(
    (driver) =>
      driver.cab_driver_id.toString().includes(filterQuery) ||
      driver.driver_first_name
        .toLowerCase()
        .includes(filterQuery.toLowerCase()) ||
      driver.mobile_no.includes(filterQuery)
  );

  const lastDriverIndex = pageNumber * driversPerPage;
  const firstDriverIndex = lastDriverIndex - driversPerPage;
  const currentDriverList = searchedDrivers.slice(
    firstDriverIndex,
    lastDriverIndex
  );
  const totalDriverPages = Math.ceil(searchedDrivers.length / driversPerPage);

  const filteredDriversRejected = allRejectedDrivers.filter(
    (driver) =>
      driver.cab_driver_id.toString().includes(searchQueryRejected) ||
      driver.driver_first_name
        .toLowerCase()
        .includes(searchQueryRejected.toLowerCase()) ||
      driver.mobile_no.includes(searchQueryRejected)
  );

  const indexOfLastDriverRejected = currentPageRejected * driversPerPage;
  const indexOfFirstDriverRejected = indexOfLastDriverRejected - driversPerPage;
  const currentDriversRejected = filteredDriversRejected.slice(
    indexOfFirstDriverRejected,
    indexOfLastDriverRejected
  );
  const totalPagesRejected = Math.ceil(
    filteredDriversRejected.length / driversPerPage
  );

  const handleBlockedSearch = (event) => {
    setSearchBlockedQuery(event.target.value.toLowerCase());
  };

  const filteredBlockedDrivers = allBlockedDrivers.filter(
    (driver) =>
      driver.cab_driver_id.toString().includes(searchBlockedQuery) ||
      driver.driver_first_name.toLowerCase().includes(searchBlockedQuery) ||
      driver.mobile_no.includes(searchBlockedQuery)
  );

  const totalBlockedPages = Math.ceil(
    filteredBlockedDrivers.length / driversPerPage
  );
  const indexOfLastBlockedDriver = currentBlockedPage * driversPerPage;
  const indexOfFirstBlockedDriver = indexOfLastBlockedDriver - driversPerPage;
  const currentBlockedDrivers = filteredBlockedDrivers.slice(
    indexOfFirstBlockedDriver,
    indexOfLastBlockedDriver
  );

  const filteredOnlineDrivers = allOnlineDrivers.filter(
    (driver) =>
      driver.cab_driver_id.toString().includes(searchQueryOnlineDrivers) ||
      driver.driver_first_name
        .toLowerCase()
        .includes(searchQueryOnlineDrivers.toLowerCase()) ||
      driver.mobile_no.includes(searchQueryOnlineDrivers)
  );

  const totalPagesOnlineDrivers = Math.ceil(
    filteredOnlineDrivers.length / driversPerPage
  );
  const displayedOnlineDrivers = filteredOnlineDrivers.slice(
    (currentPageOnlineDrivers - 1) * driversPerPage,
    currentPageOnlineDrivers * driversPerPage
  );

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "blocked-driver-tab") {
      fetchBlockedDriversData();
    } else if (tab === "rejected-driver-tab") {
      fetchRejectedDriversData();
    } else if (tab === "new-driver-tab") {
      fetchUnVerifiedDriversData();
    } else if (tab === "online-driver-tab") {
      fetchOnlineDriversData();
    } else if (tab === "offline-driver-tab") {
      fetchOfflineDriversData();
    } else {
      fetchVerifiedDriversData();
    }
  };

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
      setAllDrivers([]);
      const [verifiedDriversRes] = await Promise.all([
        axios.post(
          `${serverEndPoint}/get_total_cab_drivers_with_count`,
          {
            status: 1,
          },
          config
        ),
      ]);
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
      setAllBlockedDrivers([]);
      const [blockedDriversRes] = await Promise.all([
        axios.post(
          `${serverEndPoint}/get_total_cab_drivers_with_count`,
          {
            status: 2,
          },
          config
        ),
      ]);
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
      setAllRejectedDrivers([]);
      const [rejectedDriversRes] = await Promise.all([
        axios.post(
          `${serverEndPoint}/get_total_cab_drivers_with_count`,
          {
            status: 3,
          },
          config
        ),
      ]);
      setAllRejectedDrivers(rejectedDriversRes.data.drivers || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const [displayedOfflineDrivers, setDisplayedOfflineDrivers] = useState([]);

  const filteredOfflineDrivers = offlineDrivers.filter(
    (driver) =>
      driver.cab_driver_id.toString().includes(searchQueryOfflineDrivers) ||
      driver.driver_first_name
        .toLowerCase()
        .includes(searchQueryOfflineDrivers.toLowerCase()) ||
      driver.mobile_no.includes(searchQueryOfflineDrivers)
  );

  const fetchOfflineDriversData = async () => {
    setDisplayedOfflineDrivers([]);
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
        `${serverEndPoint}/get_offline_cab_drivers`,
        {
          page: currentPageOfflineDrivers,
          limit: driversPerPage,
          search: searchQueryOfflineDrivers,
        },
        config
      );

      if (response.data.drivers) {
        setOfflineDrivers(response.data.drivers);
        setTotalPagesOfflineDrivers(
          Math.ceil(response.data.total_count / driversPerPage)
        );
        const filtered = response.data.drivers.filter(
          (driver) =>
            driver.cab_driver_id
              .toString()
              .includes(searchQueryOfflineDrivers) ||
            driver.driver_first_name
              .toLowerCase()
              .includes(searchQueryOfflineDrivers.toLowerCase()) ||
            driver.mobile_no.includes(searchQueryOfflineDrivers)
        );
        setDisplayedOfflineDrivers(filtered);
      }
    } catch (error) {
      console.error("Error fetching offline drivers:", error);
      toast.error("No offline drivers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (offlineDrivers.length > 0) {
      const filtered = offlineDrivers.filter(
        (driver) =>
          driver.cab_driver_id.toString().includes(searchQueryOfflineDrivers) ||
          driver.driver_first_name
            .toLowerCase()
            .includes(searchQueryOfflineDrivers.toLowerCase()) ||
          driver.mobile_no.includes(searchQueryOfflineDrivers)
      );
      setDisplayedOfflineDrivers(filtered);
    }
  }, [searchQueryOfflineDrivers, offlineDrivers]);

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
      setAllOnlineDrivers([]);
      const [onlineDriversRes] = await Promise.all([
        axios.post(
          `${serverEndPoint}/get_all_cab_driver_online_current_location`,
          {},
          config
        ),
      ]);

      let drivers = onlineDriversRes.data.results || [];
      const updatedDrivers = await Promise.all(
        drivers.map(async (driver) => {
          const address = await getAddressFromLatLng(
            driver.current_lat,
            driver.current_lng
          );
          return { ...driver, address };
        })
      );
      setAllOnlineDrivers(updatedDrivers);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAddressFromLatLng = async (lat, lng) => {
    const apiKey = mapKey;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

    try {
      const response = await axios.get(url);
      if (response.data.status === "OK") {
        return response.data.results[0].formatted_address;
      } else {
        console.error("Geocode API Error:", response.data.status);
        return "Address not found";
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      return "Error fetching address";
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
      setAllNewDrivers([]);
      const [unVerifiedDriversRes] = await Promise.all([
        axios.post(
          `${serverEndPoint}/get_total_cab_drivers_with_count`,
          {
            status: 0,
          },
          config
        ),
      ]);
      setAllNewDrivers(unVerifiedDriversRes.data.drivers || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifiedDriversData();
  }, []);

  const handleOnlineStatusToggle = async (driver) => {
    try {
      setTogglingDrivers((prev) => ({
        ...prev,
        [driver.cab_driver_id]: true,
      }));

      const token = Cookies.get("authToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      if (driver.is_online === 1) {
        const checkResponse = await axios.post(
          `${serverEndPoint}/check_cab_driver_status`,
          { driver_id: driver.cab_driver_id },
          config
        );

        if (!checkResponse.data.is_free) {
          toast.error("Driver has active bookings and cannot go offline");
          return;
        }
      }

      const response = await axios.post(
        `${serverEndPoint}/toggle_cab_driver_online_status`,
        {
          driver_id: driver.cab_driver_id,
          online_status: driver.is_online === 1 ? 0 : 1,
          current_lat: driver.current_lat || 0,
          current_lng: driver.current_lng || 0,
        },
        config
      );

      if (response.status === 200) {
        toast.success(driver.driver_first_name + " " + response.data.message);

        if (activeTab === "connect-tab") {
          await fetchVerifiedDriversData();
        } else if (activeTab === "offline-driver-tab") {
          await fetchOfflineDriversData();
        } else if (activeTab === "online-driver-tab") {
          await fetchOnlineDriversData();
        }

        if (driver.is_online === 1) {
          await fetchOfflineDriversData();
        } else {
          await fetchOnlineDriversData();
        }
      }
    } catch (error) {
      console.error("Toggle error:", error);
      toast.error(
        error.response?.data?.message || "Error updating driver status"
      );
    } finally {
      setTogglingDrivers((prev) => ({
        ...prev,
        [driver.cab_driver_id]: false,
      }));
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <ToastContainer position="top-right" />
      <Container fluid>
        <Row className="m-1">
          <Col xs={12}>
            <h4 className="main-title">All Cab Drivers</h4>
            <ul className="app-line-breadcrumbs mb-3">
              <li className="">
                <a href="#" className="f-s-14 f-w-500">
                  <span>
                    <i className="ph-duotone ph-car f-s-16"></i> Cab
                  </span>
                </a>
              </li>
              <li className="active mt-2">
                <a href="#" className="f-s-14 f-w-500">
                  Drivers
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
                      Verified
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link d-flex align-items-center gap-1 ${
                        activeTab === "new-driver-tab" ? "active" : ""
                      }`}
                      id="new-driver-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#new-driver-tab"
                      type="button"
                      role="tab"
                      aria-controls="new-driver-tab"
                      aria-selected={activeTab === "new-driver-tab"}
                      onClick={() => handleTabClick("new-driver-tab")}
                    >
                      <i className="ti ti-truck-delivery f-s-18 mg-b-3"></i>{" "}
                      Un-Verified
                    </button>
                  </li>

                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link d-flex align-items-center gap-1 ${
                        activeTab === "rejected-driver-tab" ? "active" : ""
                      }`}
                      id="rejected-driver-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#rejected-driver-tab-returns"
                      type="button"
                      role="tab"
                      aria-controls="rejected-driver-tab-returns"
                      aria-selected={activeTab === "rejected-driver-tab"}
                      onClick={() => handleTabClick("rejected-driver-tab")}
                    >
                      <i className="ti ti-zoom-cancel f-s-18 mg-b-3"></i>{" "}
                      Rejected
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link d-flex align-items-center gap-1 ${
                        activeTab === "blocked-driver-tab" ? "active" : ""
                      }`}
                      id="blocked-driver-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#blocked-driver-tab"
                      type="button"
                      role="tab"
                      aria-controls="blocked-driver-tab"
                      aria-selected={activeTab === "blocked-driver-tab"}
                      onClick={() => handleTabClick("blocked-driver-tab")}
                    >
                      <i className="ti ti-square-rounded-x f-s-18 mg-b-3"></i>{" "}
                      Blocked
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link d-flex align-items-center gap-1 ${
                        activeTab === "offline-driver-tab" ? "active" : ""
                      }`}
                      id="offline-driver-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#offline-driver-tab"
                      type="button"
                      role="tab"
                      aria-controls="offline-driver-tab"
                      aria-selected={activeTab === "offline-driver-tab"}
                      onClick={() => handleTabClick("offline-driver-tab")}
                    >
                      <i className="ti ti-power f-s-18 mg-b-3"></i> Offline
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link d-flex align-items-center gap-1 ${
                        activeTab === "online-driver-tab" ? "active" : ""
                      }`}
                      id="online-driver-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#online-driver-tab"
                      type="button"
                      role="tab"
                      aria-controls="online-driver-tab"
                      aria-selected={activeTab === "online-driver-tab"}
                      onClick={() => handleTabClick("online-driver-tab")}
                    >
                      <i className="ti ti-live-view f-s-18 mg-b-3"></i> Online
                    </button>
                  </li>
                </ul>
              </CardBody>

              {/* Verified Drivers  */}
              <div className="card-body driver-tab-content p-0">
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
                    <div className="driver-list-table table-responsive app-scroll">
                      {/* Search Input */}
                      <div className="mb-3">
                        <input
                          type="text"
                          className="form-control m-4 align-middle"
                          placeholder="Search by Driver Name or Mobile"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <table className="table table-bottom-bdriver align-middle mb-0">
                        <thead>
                          <tr>
                            <th>Driver ID</th>
                            <th scope="col">Driver Name</th>
                            <th scope="col">Address</th>
                            <th scope="col">Vehicle Details</th>
                            <th scope="col">Status</th>
                            <th scope="col">Online Status</th>
                            <th scope="col">Registration Date</th>
                            <th scope="col">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedDrivers.map((driver, index) => (
                            <tr key={index}>
                              <td># {driver.cab_driver_id}</td>

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
                                <p className="mb-0 f-s-12 text-secondary">
                                  {driver.full_address}
                                </p>
                              </td>
                              <td>
                                <div className="position-relative">
                                  <div className="h-40 w-40 d-flex-center b-r-15 overflow-hidden p-1 position-absolute">
                                    <img
                                      src={driver.driver_vehicle_image}
                                      alt={driver.vehicle_name}
                                      className="img-fluid"
                                    />
                                  </div>
                                  <div className="ms-5">
                                    <h6 className="mb-0 f-s-16">
                                      {driver.vehicle_name} {" | "}{" "}
                                      {driver.vehicle_plate_no}
                                    </h6>
                                    <p className="mb-0 f-s-14 text-secondary">
                                      {driver.vehicle_fuel_type}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <span
                                  className={`badge bg-${(() => {
                                    if (driver.status === 1) return "success"; // Verified
                                    if (driver.status === 2) return "danger"; // Blocked
                                    if (driver.status === 3) return "warning"; // Rejected
                                    if (driver.status === 4) return "secondary"; // Not Verified
                                    return "light"; // Default
                                  })()}`}
                                >
                                  {(() => {
                                    if (driver.status === 1) return "Verified";
                                    if (driver.status === 2) return "Blocked";
                                    if (driver.status === 3) return "Rejected";
                                    if (driver.status === 4)
                                      return "Not Verified";
                                    return "Unknown";
                                  })()}
                                </span>
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <Switch
                                    checked={driver.is_online === 1}
                                    onChange={() =>
                                      handleOnlineStatusToggle(driver)
                                    }
                                    disabled={
                                      togglingDrivers[driver.cab_driver_id]
                                    }
                                    color="success"
                                    size="small"
                                  />
                                  <span
                                    className={`ms-2 badge bg-${
                                      driver.is_online === 1
                                        ? "success"
                                        : "secondary"
                                    }`}
                                  >
                                    {driver.is_online === 1
                                      ? "Online"
                                      : "Offline"}
                                  </span>
                                </div>
                              </td>
                              <td>{driver.registration_date}</td>

                              {/* <td>
                                <Link
                                  to={{
                                    pathname: `/dashboard/cab-driver-profile-details/${driver.cab_driver_id}`,
                                    state: { driverDetails: driver }, // Pass additional data
                                  }}
                                  role="button"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-outline-primary icon-btn w-30 h-30 b-r-22 me-2"
                                >
                                  <i className="ti ti-eye"></i>
                                </Link>
                              </td> */}
                              <td>
                                <Link
                                  to={`/dashboard/cab-driver-profile-details/${driver.cab_driver_id}`}
                                  role="button"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-outline-primary icon-btn w-30 h-30 b-r-22 me-2"
                                >
                                  <i className="ti ti-eye"></i>
                                </Link>
                                {/* <button
                                  onClick={() =>
                                    handleViewRechargeHistory(driver)
                                  }
                                  className="btn btn-outline-info icon-btn w-30 h-30 b-r-22"
                                >
                                  <i className="ti ti-history"></i>
                                </button> */}
                                <Link
                                  to={`/dashboard/cab-driver-recharge/${driver.cab_driver_id}/${driver.driver_first_name}`}
                                  role="button"
                                  className="btn btn-outline-info icon-btn w-30 h-30 b-r-22"
                                  rel="noopener noreferrer"
                                  target="_blank"
                                >
                                  <i className="ti ti-history"></i>
                                </Link>
                                <Link
                                  to={`/dashboard/cab-driver-wallet-details/${driver.cab_driver_id}/${driver.driver_first_name}`}
                                  role="button"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-outline-primary icon-btn w-30 h-30 b-r-22 ms-2 me-2"
                                >
                                  <i className="ti ti-wallet"></i>
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
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                          disabled={currentPage === 1}
                        >
                          Previous
                        </button>
                        <span className="mx-2">
                          Page {currentPage} of {totalPages}
                        </span>
                        <button
                          className="btn btn-outline-primary"
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, totalPages)
                            )
                          }
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Un-Verified Drivers  */}
              <div className="card-body driver-tab-content p-0">
                <div className="tab-content" id="OutlineContent">
                  <div
                    className={`tab-pane fade ${
                      activeTab === "new-driver-tab" ? "active show" : ""
                    }`}
                    id="new-driver-pane"
                    role="tabpanel"
                    aria-labelledby="new-driver-tab"
                    tabIndex="1"
                  >
                    <div className="driver-list-table table-responsive app-scroll">
                      {/* Search Input */}
                      <div className="mb-3">
                        <input
                          type="text"
                          className="form-control m-4 align-middle"
                          placeholder="Search by Driver Name or Mobile"
                          value={filterQuery}
                          onChange={(e) => setFilterQuery(e.target.value)}
                        />
                      </div>
                      <table className="table table-bottom-bdriver align-middle mb-0">
                        <thead>
                          <tr>
                            <th>Driver ID</th>
                            <th scope="col">Driver Name</th>
                            <th scope="col">Address</th>
                            <th scope="col">Vehicle Details</th>
                            <th scope="col">Status</th>
                            <th scope="col">Registration Date</th>
                            <th scope="col">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentDriverList.map((driver, index) => (
                            <tr key={index}>
                              <td># {driver.cab_driver_id}</td>

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
                                <p className="mb-0 f-s-12 text-secondary">
                                  {driver.full_address}
                                </p>
                              </td>
                              <td>
                                <div className="position-relative">
                                  <div className="h-40 w-40 d-flex-center b-r-15 overflow-hidden p-1 position-absolute">
                                    <img
                                      src={driver.driver_vehicle_image}
                                      alt={driver.vehicle_name}
                                      className="img-fluid"
                                    />
                                  </div>
                                  <div className="ms-5">
                                    <h6 className="mb-0 f-s-16">
                                      {driver.vehicle_name} {" | "}{" "}
                                      {driver.vehicle_plate_no}
                                    </h6>
                                    <p className="mb-0 f-s-14 text-secondary">
                                      {driver.vehicle_fuel_type}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <span
                                  className={`badge bg-${(() => {
                                    if (driver.status === 1) return "success"; // Verified
                                    if (driver.status === 2) return "danger"; // Blocked
                                    if (driver.status === 3) return "warning"; // Rejected
                                    if (driver.status === 4) return "secondary"; // Not Verified
                                    return "light"; // Default
                                  })()}`}
                                >
                                  {(() => {
                                    if (driver.status === 1) return "Verified";
                                    if (driver.status === 2) return "Blocked";
                                    if (driver.status === 3) return "Rejected";
                                    if (driver.status === 4)
                                      return "Not Verified";
                                    return "Unknown";
                                  })()}
                                </span>
                              </td>

                              <td>{driver.registration_date}</td>

                              <td>
                                <Link
                                  to={{
                                    pathname: `/dashboard/cab-driver-profile-details/${driver.cab_driver_id}`,
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
                      </table>
                      {/* Pagination Controls */}
                      <div className="pagination-controls d-flex justify-content-end align-items-center mt-3 p-4">
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => setPageNumber(pageNumber - 1)}
                          disabled={pageNumber === 1}
                        >
                          Previous
                        </button>
                        <span className="mx-2">
                          Page {pageNumber} of {totalDriverPages}
                        </span>
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => setPageNumber(pageNumber + 1)}
                          disabled={pageNumber === totalDriverPages}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rejected Drivers  */}
              <div className="card-body rejected-driver-tab-content p-0">
                <div className="tab-content" id="OutlineContent">
                  <div
                    className={`tab-pane fade ${
                      activeTab === "rejected-driver-tab" ? "active show" : ""
                    }`}
                    id="rejected-driver-pane"
                    role="tabpanel"
                    aria-labelledby="rejected-driver-tab"
                    tabIndex="2"
                  >
                    <div className="driver-list-table table-responsive app-scroll">
                      {/* Search Input */}
                      <div className="mb-3">
                        <input
                          type="text"
                          className="form-control m-4 align-middle"
                          placeholder="Search by Driver Name or Mobile"
                          value={searchQueryRejected}
                          onChange={(e) =>
                            setSearchQueryRejected(e.target.value)
                          }
                        />
                      </div>
                      <table className="table table-bottom-bdriver align-middle mb-0">
                        <thead>
                          <tr>
                            <th>Driver ID</th>
                            <th scope="col">Driver Name</th>
                            <th scope="col">Address</th>
                            <th scope="col">Vehicle Details</th>
                            <th scope="col">Status</th>
                            <th scope="col">Registration Date</th>
                            <th scope="col">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentDriversRejected.map((driver, index) => (
                            <tr key={index}>
                              <td># {driver.cab_driver_id}</td>

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
                                <p className="mb-0 f-s-12 text-secondary">
                                  {driver.full_address}
                                </p>
                              </td>
                              <td>
                                <div className="position-relative">
                                  <div className="h-40 w-40 d-flex-center b-r-15 overflow-hidden p-1 position-absolute">
                                    <img
                                      src={driver.driver_vehicle_image}
                                      alt={driver.vehicle_name}
                                      className="img-fluid"
                                    />
                                  </div>
                                  <div className="ms-5">
                                    <h6 className="mb-0 f-s-16">
                                      {driver.vehicle_name} {" | "}{" "}
                                      {driver.vehicle_plate_no}
                                    </h6>
                                    <p className="mb-0 f-s-14 text-secondary">
                                      {driver.vehicle_fuel_type}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <span
                                  className={`badge bg-${(() => {
                                    if (driver.status === 1) return "success"; // Verified
                                    if (driver.status === 2) return "danger"; // Blocked
                                    if (driver.status === 3) return "warning"; // Rejected
                                    if (driver.status === 4) return "secondary"; // Not Verified
                                    return "light"; // Default
                                  })()}`}
                                >
                                  {(() => {
                                    if (driver.status === 1) return "Verified";
                                    if (driver.status === 2) return "Blocked";
                                    if (driver.status === 3) return "Rejected";
                                    if (driver.status === 4)
                                      return "Not Verified";
                                    return "Unknown";
                                  })()}
                                </span>
                              </td>

                              <td>{driver.registration_date}</td>

                              <td>
                                <Link
                                  to={{
                                    pathname: `/dashboard/cab-driver-profile-details/${driver.cab_driver_id}`,
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
                      </table>
                      {/* Pagination Controls */}
                      <div className="pagination-controls d-flex justify-content-end align-items-center mt-3 p-4">
                        <button
                          className="btn btn-outline-primary"
                          onClick={() =>
                            setCurrentPageRejected(currentPageRejected - 1)
                          }
                          disabled={currentPageRejected === 1}
                        >
                          Previous
                        </button>
                        <span className="mx-2">
                          Page {currentPageRejected} of {totalPagesRejected}
                        </span>
                        <button
                          className="btn btn-outline-primary"
                          onClick={() =>
                            setCurrentPageRejected(currentPageRejected + 1)
                          }
                          disabled={currentPageRejected === totalPagesRejected}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Blocked Drivers  */}
              <div className="card-body blocked-driver-tab-content p-0">
                <div className="tab-content" id="OutlineContent">
                  <div
                    className={`tab-pane fade ${
                      activeTab === "blocked-driver-tab" ? "active show" : ""
                    }`}
                    id="blocked-driver-pane"
                    role="tabpanel"
                    aria-labelledby="blocked-driver-tab"
                    tabIndex="3"
                  >
                    <div className="driver-list-table table-responsive app-scroll">
                      {/* Search Input */}
                      <div className="mb-3">
                        <input
                          type="text"
                          className="form-control m-4 align-middle"
                          placeholder="Search by Driver Name or Mobile"
                          value={searchBlockedQuery}
                          onChange={handleBlockedSearch}
                        />
                      </div>
                      <table className="table table-bottom-bdriver align-middle mb-0">
                        <thead>
                          <tr>
                            <th>Driver ID</th>
                            <th scope="col">Driver Name</th>
                            <th scope="col">Address</th>
                            <th scope="col">Vehicle Details</th>
                            <th scope="col">Status</th>
                            <th scope="col">Registration Date</th>
                            <th scope="col">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentBlockedDrivers.map((driver, index) => (
                            <tr key={index}>
                              <td># {driver.cab_driver_id}</td>

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
                                <p className="mb-0 f-s-12 text-secondary">
                                  {driver.full_address}
                                </p>
                              </td>
                              <td>
                                <div className="position-relative">
                                  <div className="h-40 w-40 d-flex-center b-r-15 overflow-hidden p-1 position-absolute">
                                    <img
                                      src={driver.driver_vehicle_image}
                                      alt={driver.vehicle_name}
                                      className="img-fluid"
                                    />
                                  </div>
                                  <div className="ms-5">
                                    <h6 className="mb-0 f-s-16">
                                      {driver.vehicle_name} {" | "}{" "}
                                      {driver.vehicle_plate_no}
                                    </h6>
                                    <p className="mb-0 f-s-14 text-secondary">
                                      {driver.vehicle_fuel_type}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <span
                                  className={`badge bg-${(() => {
                                    if (driver.status === 1) return "success"; // Verified
                                    if (driver.status === 2) return "danger"; // Blocked
                                    if (driver.status === 3) return "warning"; // Rejected
                                    if (driver.status === 4) return "secondary"; // Not Verified
                                    return "light"; // Default
                                  })()}`}
                                >
                                  {(() => {
                                    if (driver.status === 1) return "Verified";
                                    if (driver.status === 2) return "Blocked";
                                    if (driver.status === 3) return "Rejected";
                                    if (driver.status === 4)
                                      return "Not Verified";
                                    return "Unknown";
                                  })()}
                                </span>
                              </td>

                              <td>{driver.registration_date}</td>

                              <td>
                                <Link
                                  to={{
                                    pathname: `/dashboard/cab-driver-profile-details/${driver.cab_driver_id}`,
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
                      </table>
                      {/* Pagination Controls */}
                      <div className="pagination-controls d-flex justify-content-end align-items-center mt-3 p-4">
                        <button
                          className="btn btn-outline-primary"
                          onClick={() =>
                            setCurrentBlockedPage(currentBlockedPage - 1)
                          }
                          disabled={currentBlockedPage === 1}
                        >
                          Previous
                        </button>
                        <span className="mx-2">
                          Page {currentBlockedPage} of {totalBlockedPages}
                        </span>
                        <button
                          className="btn btn-outline-primary"
                          onClick={() =>
                            setCurrentBlockedPage(currentBlockedPage + 1)
                          }
                          disabled={currentBlockedPage === totalBlockedPages}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Offline Drivers  */}
              <div className="card-body offline-driver-tab-content p-0">
                <div className="tab-content" id="OutlineContent">
                  <div
                    className={`tab-pane fade ${
                      activeTab === "offline-driver-tab" ? "active show" : ""
                    }`}
                    id="offline-driver-pane"
                    role="tabpanel"
                    aria-labelledby="offline-driver-tab"
                    tabIndex="5"
                  >
                    <div className="driver-list-table table-responsive app-scroll">
                      {/* Search Input */}
                      <div className="mb-3">
                        <input
                          type="text"
                          className="form-control m-4 align-middle"
                          placeholder="Search by Driver Name or Mobile"
                          value={searchQueryOfflineDrivers}
                          onChange={(e) =>
                            setSearchQueryOfflineDrivers(e.target.value)
                          }
                        />
                      </div>
                      {/* Offline Drivers Table */}
                      <table className="table table-bottom-bdriver align-middle mb-0">
                        <thead>
                          <tr>
                            <th>Driver ID</th>
                            <th scope="col">Driver Name</th>
                            <th scope="col">Address</th>
                            <th scope="col">Vehicle Details</th>

                            <th scope="col">Online Status</th>
                            <th scope="col">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {displayedOfflineDrivers.map((driver, index) => (
                            <tr key={index}>
                              <td># {driver.cab_driver_id}</td>
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
                                <p className="mb-0 f-s-12 text-secondary">
                                  {driver.full_address}
                                </p>
                              </td>
                              <td>
                                <div className="position-relative">
                                  <div className="h-40 w-40 d-flex-center b-r-15 overflow-hidden p-1 position-absolute">
                                    <img
                                      src={driver.driver_vehicle_image}
                                      alt={driver.vehicle_name}
                                      className="img-fluid"
                                    />
                                  </div>
                                  <div className="ms-5">
                                    <h6 className="mb-0 f-s-16">
                                      {driver.vehicle_name} {" | "}{" "}
                                      {driver.vehicle_plate_no}
                                    </h6>
                                    <p className="mb-0 f-s-14 text-secondary">
                                      {driver.vehicle_fuel_type}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              <td>
                                <div className="d-flex align-items-center">
                                  <Switch
                                    checked={false}
                                    onChange={() =>
                                      handleOnlineStatusToggle(driver)
                                    }
                                    disabled={
                                      togglingDrivers[driver.cab_driver_id]
                                    }
                                    color="success"
                                    size="small"
                                  />
                                  <span className="ms-2 badge bg-secondary">
                                    Offline
                                  </span>
                                </div>
                              </td>
                              <td>
                                <Link
                                  to={`/dashboard/cab-driver-profile-details/${driver.cab_driver_id}`}
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
                            setCurrentPageOfflineDrivers(
                              currentPageOfflineDrivers - 1
                            )
                          }
                          disabled={currentPageOfflineDrivers === 1}
                        >
                          Previous
                        </button>
                        <span className="mx-2">
                          Page {currentPageOfflineDrivers} of{" "}
                          {totalPagesOfflineDrivers}
                        </span>
                        <button
                          className="btn btn-outline-primary"
                          onClick={() =>
                            setCurrentPageOfflineDrivers(
                              currentPageOfflineDrivers + 1
                            )
                          }
                          disabled={
                            currentPageOfflineDrivers ===
                            totalPagesOfflineDrivers
                          }
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Online Drivers  */}
              <div className="card-body online-driver-tab-content p-0">
                <div className="tab-content" id="OutlineContent">
                  <div
                    className={`tab-pane fade ${
                      activeTab === "online-driver-tab" ? "active show" : ""
                    }`}
                    id="online-driver-pane"
                    role="tabpanel"
                    aria-labelledby="online-driver-tab"
                    tabIndex="4"
                  >
                    <div className="driver-list-table table-responsive app-scroll">
                      {/* Search Input */}
                      <div className="mb-3">
                        <input
                          type="text"
                          className="form-control m-4 align-middle"
                          placeholder="Search by Driver Name or Mobile"
                          value={searchQueryOnlineDrivers}
                          onChange={(e) =>
                            setSearchQueryOnlineDrivers(e.target.value)
                          }
                        />
                      </div>
                      <table className="table table-bottom-bdriver align-middle mb-0">
                        <thead>
                          <tr>
                            <th>Driver ID</th>
                            <th scope="col">Driver Name</th>
                            <th scope="col">Last Location Address</th>
                            <th scope="col">Status</th>
                            <th scope="col">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {displayedOnlineDrivers.map((driver, index) => (
                            <tr key={index}>
                              <td># {driver.cab_driver_id}</td>

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
                                <p className="mb-0 f-s-12 text-secondary">
                                  {driver.address
                                    ? driver.address
                                    : "Fetching..."}
                                </p>
                              </td>

                              <td>
                                <span
                                  className={`badge bg-${(() => {
                                    if (driver.current_status === 1)
                                      return "success"; // Verified
                                    if (driver.current_status === 2)
                                      return "danger"; // Blocked

                                    return "light"; // Default
                                  })()}`}
                                >
                                  {(() => {
                                    if (driver.current_status === 1)
                                      return "Free";
                                    if (driver.current_status === 2)
                                      return "Occupied";

                                    return "Unknown";
                                  })()}
                                </span>
                              </td>

                              <td>
                                <Link
                                  to={{
                                    pathname: `/dashboard/cab-driver-profile-details/${driver.cab_driver_id}`,
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
                      </table>
                      {/* Pagination Controls */}
                      <div className="pagination-controls d-flex justify-content-end align-items-center mt-3 p-4">
                        <button
                          className="btn btn-outline-primary"
                          onClick={() =>
                            setCurrentPageOnlineDrivers(
                              currentPageOnlineDrivers - 1
                            )
                          }
                          disabled={currentPageOnlineDrivers === 1}
                        >
                          Previous
                        </button>
                        <span className="mx-2">
                          Page {currentPageOnlineDrivers} of{" "}
                          {totalPagesOnlineDrivers}
                        </span>
                        <button
                          className="btn btn-outline-primary"
                          onClick={() =>
                            setCurrentPageOnlineDrivers(
                              currentPageOnlineDrivers + 1
                            )
                          }
                          disabled={
                            currentPageOnlineDrivers === totalPagesOnlineDrivers
                          }
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

export default AllCabDrivers;
