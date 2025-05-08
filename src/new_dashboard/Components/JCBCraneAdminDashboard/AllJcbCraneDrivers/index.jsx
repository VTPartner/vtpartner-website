/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import axios from "axios";
import Cookies from "js-cookie";
import {
  formatEpoch,
  mapKey,
  serverEndPoint,
} from "../../../../dashboard/app/constants";
import Loader from "../../Loader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import DriverTable from "../DriverTable";

const AllJCBCraneDrivers = () => {
  // State declarations
  const [activeTab, setActiveTab] = useState("connect-tab");
  const [allDrivers, setAllDrivers] = useState([]);
  const [allRejectedDrivers, setAllRejectedDrivers] = useState([]);
  const [allOnlineDrivers, setAllOnlineDrivers] = useState([]);
  const [allBlockedDrivers, setAllBlockedDrivers] = useState([]);
  const [allNewDrivers, setAllNewDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search and pagination states for verified drivers
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Search and pagination states for unverified drivers
  const [filterQuery, setFilterQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  // Search and pagination states for rejected drivers
  const [searchQueryRejected, setSearchQueryRejected] = useState("");
  const [currentPageRejected, setCurrentPageRejected] = useState(1);

  // Search and pagination states for blocked drivers
  const [searchBlockedQuery, setSearchBlockedQuery] = useState("");
  const [currentBlockedPage, setCurrentBlockedPage] = useState(1);

  // Search and pagination states for online drivers
  const [searchQueryOnlineDrivers, setSearchQueryOnlineDrivers] = useState("");
  const [currentPageOnlineDrivers, setCurrentPageOnlineDrivers] = useState(1);

  // Search and pagination states for offline drivers
  const [offlineDrivers, setOfflineDrivers] = useState([]);
  const [searchQueryOfflineDrivers, setSearchQueryOfflineDrivers] =
    useState("");
  const [currentPageOfflineDrivers, setCurrentPageOfflineDrivers] = useState(1);
  const [totalPagesOfflineDrivers, setTotalPagesOfflineDrivers] = useState(1);
  const [displayedOfflineDrivers, setDisplayedOfflineDrivers] = useState([]);

  const [togglingDrivers, setTogglingDrivers] = useState({});
  const driversPerPage = 10;

  // Filter functions
  const filterDrivers = (drivers, query, idField = "jcb_crane_driver_id") => {
    return drivers.filter((driver) =>
      [driver[idField], driver.driver_name, driver.mobile_no]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase())
    );
  };

  // Filtered data for each tab
  const filteredVerifiedDrivers = filterDrivers(allDrivers, searchQuery);
  const filteredUnverifiedDrivers = filterDrivers(allNewDrivers, filterQuery);
  const filteredRejectedDrivers = filterDrivers(
    allRejectedDrivers,
    searchQueryRejected
  );
  const filteredBlockedDrivers = filterDrivers(
    allBlockedDrivers,
    searchBlockedQuery
  );
  const filteredOnlineDrivers = filterDrivers(
    allOnlineDrivers,
    searchQueryOnlineDrivers
  );

  // Pagination calculations
  const calculatePagination = (filteredData, currentPage) => {
    const totalPages = Math.ceil(filteredData.length / driversPerPage);
    const paginatedData = filteredData.slice(
      (currentPage - 1) * driversPerPage,
      currentPage * driversPerPage
    );
    return { totalPages, paginatedData };
  };

  // API fetch functions
  // Common error handler function
  const handleApiError = (error, customMessage) => {
    if (!navigator.onLine) {
      toast.error("Please check your internet connection");
      return;
    }

    if (error.response) {
      // Server responded with a status code outside the 2xx range
      switch (error.response.status) {
        case 404:
          toast.info(customMessage || "No drivers found");
          break;
        case 401:
          toast.error("Unauthorized access. Please login again");
          // Optional: Redirect to login page
          break;
        case 403:
          toast.error("You don't have permission to access this resource");
          break;
        case 500:
          toast.error("Internal server error. Please try again later");
          break;
        default:
          toast.error(error.response.data?.message || "Something went wrong");
      }
    } else if (error.request) {
      // Request was made but no response received
      toast.error("Unable to reach the server. Please try again later");
    } else {
      // Something happened in setting up the request
      toast.error("An error occurred. Please try again");
    }
  };

  // Enhanced API fetch functions
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
      const response = await axios.post(
        `${serverEndPoint}/get_total_jcb_crane_drivers_with_count`,
        { status: 1 },
        config
      );
      setAllDrivers(response.data.drivers || []);
      if (response.data.drivers?.length === 0) {
        toast.info("No verified drivers found");
      }
    } catch (error) {
      console.error("Error fetching verified drivers:", error);
      handleApiError(error, "No verified drivers found");
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
      const response = await axios.post(
        `${serverEndPoint}/get_total_jcb_crane_drivers_with_count`,
        { status: 2 },
        config
      );
      setAllBlockedDrivers(response.data.drivers || []);
      if (response.data.drivers?.length === 0) {
        toast.info("No blocked drivers found");
      }
    } catch (error) {
      console.error("Error fetching blocked drivers:", error);
      handleApiError(error, "No blocked drivers found");
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
      const response = await axios.post(
        `${serverEndPoint}/get_total_jcb_crane_drivers_with_count`,
        { status: 3 },
        config
      );
      setAllRejectedDrivers(response.data.drivers || []);
      if (response.data.drivers?.length === 0) {
        toast.info("No rejected drivers found");
      }
    } catch (error) {
      console.error("Error fetching rejected drivers:", error);
      handleApiError(error, "No rejected drivers found");
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
      const response = await axios.post(
        `${serverEndPoint}/get_total_jcb_crane_drivers_with_count`,
        { status: 0 },
        config
      );
      setAllNewDrivers(response.data.drivers || []);
      if (response.data.drivers?.length === 0) {
        toast.info("No unverified drivers found");
      }
    } catch (error) {
      console.error("Error fetching unverified drivers:", error);
      handleApiError(error, "No unverified drivers found");
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
      const response = await axios.post(
        `${serverEndPoint}/get_all_jcb_crane_driver_online_current_location`,
        {},
        config
      );

      let drivers = response.data.results || [];
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
      console.error("Error fetching online drivers:", error);
      handleApiError(error, "No Online drivers found");
    } finally {
      setLoading(false);
    }
  };

  const fetchOfflineDriversData = async () => {
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
        `${serverEndPoint}/get_offline_jcb_crane_drivers`,
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
        setDisplayedOfflineDrivers(
          filterDrivers(response.data.drivers, searchQueryOfflineDrivers)
        );
      }
    } catch (error) {
      console.error("Error fetching offline drivers:", error);
      handleApiError(error, "No Offline drivers found");
    } finally {
      setLoading(false);
    }
  };
  // Helper functions
  const getAddressFromLatLng = async (lat, lng) => {
    const apiKey = mapKey;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

    try {
      const response = await axios.get(url);
      if (response.data.status === "OK") {
        return response.data.results[0].formatted_address;
      }
      return "Address not found";
    } catch (error) {
      return "Error fetching address";
    }
  };

  const handleOnlineStatusToggle = async (driver) => {
    try {
      setTogglingDrivers((prev) => ({
        ...prev,
        [driver.jcb_crane_driver_id]: true,
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
          `${serverEndPoint}/check_jcb_crane_driver_status`,
          { driver_id: driver.jcb_crane_driver_id },
          config
        );

        if (!checkResponse.data.is_free) {
          toast.error("Agent has active bookings and cannot go offline");
          return;
        }
      }

      const response = await axios.post(
        `${serverEndPoint}/toggle_jcb_crane_driver_online_status`,
        {
          driver_id: driver.jcb_crane_driver_id,
          online_status: driver.is_online === 1 ? 0 : 1,
          current_lat: driver.current_lat || 0,
          current_lng: driver.current_lng || 0,
        },
        config
      );

      if (response.status === 200) {
        toast.success(driver.driver_name + " " + response.data.message);

        // Refresh appropriate data based on active tab
        if (activeTab === "connect-tab") {
          await fetchVerifiedDriversData();
        } else if (activeTab === "offline-driver-tab") {
          await fetchOfflineDriversData();
        } else if (activeTab === "online-driver-tab") {
          await fetchOnlineDriversData();
        }

        // Update offline/online lists
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
        [driver.jcb_crane_driver_id]: false,
      }));
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    switch (tab) {
      case "blocked-driver-tab":
        fetchBlockedDriversData();
        break;
      case "rejected-driver-tab":
        fetchRejectedDriversData();
        break;
      case "new-driver-tab":
        fetchUnVerifiedDriversData();
        break;
      case "online-driver-tab":
        fetchOnlineDriversData();
        break;
      case "offline-driver-tab":
        fetchOfflineDriversData();
        break;
      default:
        fetchVerifiedDriversData();
    }
  };

  // Effects
  useEffect(() => {
    fetchVerifiedDriversData();
  }, []);

  useEffect(() => {
    if (offlineDrivers.length > 0) {
      const filtered = filterDrivers(offlineDrivers, searchQueryOfflineDrivers);
      setDisplayedOfflineDrivers(filtered);
    }
  }, [searchQueryOfflineDrivers, offlineDrivers]);

  if (loading) {
    return <Loader />;
  }

  // Calculate pagination for each tab
  const {
    totalPages: verifiedTotalPages,
    paginatedData: paginatedVerifiedDrivers,
  } = calculatePagination(filteredVerifiedDrivers, currentPage);

  const {
    totalPages: unverifiedTotalPages,
    paginatedData: paginatedUnverifiedDrivers,
  } = calculatePagination(filteredUnverifiedDrivers, pageNumber);

  const {
    totalPages: rejectedTotalPages,
    paginatedData: paginatedRejectedDrivers,
  } = calculatePagination(filteredRejectedDrivers, currentPageRejected);

  const {
    totalPages: blockedTotalPages,
    paginatedData: paginatedBlockedDrivers,
  } = calculatePagination(filteredBlockedDrivers, currentBlockedPage);

  const {
    totalPages: onlineTotalPages,
    paginatedData: paginatedOnlineDrivers,
  } = calculatePagination(filteredOnlineDrivers, currentPageOnlineDrivers);

  return (
    <div>
      <ToastContainer position="top-right" />
      <Container fluid>
        {/* Header */}
        <Row className="m-1">
          <Col xs={12}>
            <h4 className="main-title">All JCB/Crane Drivers</h4>
            <ul className="app-line-breadcrumbs mb-3">
              <li className="">
                <a href="#" className="f-s-14 f-w-500">
                  <span>
                    <i className="ph-duotone ph-truck f-s-16"></i> JCB/Crane
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

        {/* Main Content */}
        <Row>
          <Col xs={12}>
            <Card className="shadow-lg border-0 rounded-lg">
              {/* Tabs */}
              <CardBody>
                <ul className="nav nav-tabs app-tabs-primary order-tabs d-flex justify-content-start border-0 mb-0 pb-0">
                  {/* Verified Tab */}
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link d-flex align-items-center gap-1 ${
                        activeTab === "connect-tab" ? "active" : ""
                      }`}
                      onClick={() => handleTabClick("connect-tab")}
                    >
                      <i className="ti ti-sort-descending-2 f-s-18 mg-b-3"></i>{" "}
                      Verified
                    </button>
                  </li>

                  {/* Unverified Tab */}
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link d-flex align-items-center gap-1 ${
                        activeTab === "new-driver-tab" ? "active" : ""
                      }`}
                      onClick={() => handleTabClick("new-driver-tab")}
                    >
                      <i className="ti ti-truck-delivery f-s-18 mg-b-3"></i>{" "}
                      Un-Verified
                    </button>
                  </li>

                  {/* Rejected Tab */}
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link d-flex align-items-center gap-1 ${
                        activeTab === "rejected-driver-tab" ? "active" : ""
                      }`}
                      onClick={() => handleTabClick("rejected-driver-tab")}
                    >
                      <i className="ti ti-zoom-cancel f-s-18 mg-b-3"></i>{" "}
                      Rejected
                    </button>
                  </li>

                  {/* Blocked Tab */}
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link d-flex align-items-center gap-1 ${
                        activeTab === "blocked-driver-tab" ? "active" : ""
                      }`}
                      onClick={() => handleTabClick("blocked-driver-tab")}
                    >
                      <i className="ti ti-square-rounded-x f-s-18 mg-b-3"></i>{" "}
                      Blocked
                    </button>
                  </li>

                  {/* Offline Tab */}
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link d-flex align-items-center gap-1 ${
                        activeTab === "offline-driver-tab" ? "active" : ""
                      }`}
                      onClick={() => handleTabClick("offline-driver-tab")}
                    >
                      <i className="ti ti-power f-s-18 mg-b-3"></i> Offline
                    </button>
                  </li>

                  {/* Online Tab */}
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link d-flex align-items-center gap-1 ${
                        activeTab === "online-driver-tab" ? "active" : ""
                      }`}
                      onClick={() => handleTabClick("online-driver-tab")}
                    >
                      <i className="ti ti-live-view f-s-18 mg-b-3"></i> Online
                    </button>
                  </li>
                </ul>
              </CardBody>

              {/* Tab Contents */}
              <div className="card-body driver-tab-content p-0">
                <div className="tab-content" id="OutlineContent">
                  {/* Verified Drivers Tab */}
                  <div
                    className={`tab-pane fade ${
                      activeTab === "connect-tab" ? "active show" : ""
                    }`}
                  >
                    <DriverTable
                      drivers={paginatedVerifiedDrivers}
                      tableType="verified"
                      handleOnlineStatusToggle={handleOnlineStatusToggle}
                      togglingDrivers={togglingDrivers}
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                      currentPage={currentPage}
                      totalPages={verifiedTotalPages}
                      setCurrentPage={setCurrentPage}
                      isHandyman={false}
                    />
                  </div>

                  {/* Unverified Drivers Tab */}
                  <div
                    className={`tab-pane fade ${
                      activeTab === "new-driver-tab" ? "active show" : ""
                    }`}
                  >
                    <DriverTable
                      drivers={paginatedUnverifiedDrivers}
                      tableType="unverified"
                      handleOnlineStatusToggle={handleOnlineStatusToggle}
                      togglingDrivers={togglingDrivers}
                      searchQuery={filterQuery}
                      setSearchQuery={setFilterQuery}
                      currentPage={pageNumber}
                      totalPages={unverifiedTotalPages}
                      setCurrentPage={setPageNumber}
                      showOnlineStatus={false}
                      isHandyman={false}
                    />
                  </div>

                  {/* Rejected Drivers Tab */}
                  <div
                    className={`tab-pane fade ${
                      activeTab === "rejected-driver-tab" ? "active show" : ""
                    }`}
                  >
                    <DriverTable
                      drivers={paginatedRejectedDrivers}
                      tableType="rejected"
                      handleOnlineStatusToggle={handleOnlineStatusToggle}
                      togglingDrivers={togglingDrivers}
                      searchQuery={searchQueryRejected}
                      setSearchQuery={setSearchQueryRejected}
                      currentPage={currentPageRejected}
                      totalPages={rejectedTotalPages}
                      setCurrentPage={setCurrentPageRejected}
                      showOnlineStatus={false}
                      isHandyman={false}
                    />
                  </div>

                  {/* Blocked Drivers Tab */}
                  <div
                    className={`tab-pane fade ${
                      activeTab === "blocked-driver-tab" ? "active show" : ""
                    }`}
                  >
                    <DriverTable
                      drivers={paginatedBlockedDrivers}
                      tableType="blocked"
                      handleOnlineStatusToggle={handleOnlineStatusToggle}
                      togglingDrivers={togglingDrivers}
                      searchQuery={searchBlockedQuery}
                      setSearchQuery={setSearchBlockedQuery}
                      currentPage={currentBlockedPage}
                      totalPages={blockedTotalPages}
                      setCurrentPage={setCurrentBlockedPage}
                      showOnlineStatus={false}
                      isHandyman={false}
                    />
                  </div>

                  {/* Online Drivers Tab */}
                  <div
                    className={`tab-pane fade ${
                      activeTab === "online-driver-tab" ? "active show" : ""
                    }`}
                  >
                    <DriverTable
                      drivers={paginatedOnlineDrivers}
                      tableType="online"
                      handleOnlineStatusToggle={handleOnlineStatusToggle}
                      togglingDrivers={togglingDrivers}
                      searchQuery={searchQueryOnlineDrivers}
                      setSearchQuery={setSearchQueryOnlineDrivers}
                      currentPage={currentPageOnlineDrivers}
                      totalPages={onlineTotalPages}
                      setCurrentPage={setCurrentPageOnlineDrivers}
                      showRegistrationDate={false}
                      isHandyman={false}
                    />
                  </div>

                  {/* Offline Drivers Tab */}
                  <div
                    className={`tab-pane fade ${
                      activeTab === "offline-driver-tab" ? "active show" : ""
                    }`}
                  >
                    <DriverTable
                      drivers={displayedOfflineDrivers}
                      tableType="offline"
                      handleOnlineStatusToggle={handleOnlineStatusToggle}
                      togglingDrivers={togglingDrivers}
                      searchQuery={searchQueryOfflineDrivers}
                      setSearchQuery={setSearchQueryOfflineDrivers}
                      currentPage={currentPageOfflineDrivers}
                      totalPages={totalPagesOfflineDrivers}
                      setCurrentPage={setCurrentPageOfflineDrivers}
                      isHandyman={false}
                    />
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

export default AllJCBCraneDrivers;
