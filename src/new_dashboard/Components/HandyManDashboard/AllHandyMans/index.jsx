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
import DriverTable from "../../JCBCraneAdminDashboard/DriverTable";

const AllHandyman = () => {
  // State declarations
  const [activeTab, setActiveTab] = useState("connect-tab");
  const [allHandyman, setAllHandyman] = useState([]);
  const [allRejectedHandymen, setAllRejectedHandymen] = useState([]);
  const [allOnlineHandymen, setAllOnlineHandymen] = useState([]);
  const [allBlockedHandymen, setAllBlockedHandymen] = useState([]);
  const [allNewHandymen, setAllNewHandymen] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search and pagination states for verified handymen
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Search and pagination states for unverified handymen
  const [filterQuery, setFilterQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  // Search and pagination states for rejected handymen
  const [searchQueryRejected, setSearchQueryRejected] = useState("");
  const [currentPageRejected, setCurrentPageRejected] = useState(1);

  // Search and pagination states for blocked handymen
  const [searchBlockedQuery, setSearchBlockedQuery] = useState("");
  const [currentBlockedPage, setCurrentBlockedPage] = useState(1);

  // Search and pagination states for online handymen
  const [searchQueryOnlineHandymen, setSearchQueryOnlineHandymen] =
    useState("");
  const [currentPageOnlineHandymen, setCurrentPageOnlineHandymen] = useState(1);

  // Search and pagination states for offline handymen
  const [offlineHandymen, setOfflineHandymen] = useState([]);
  const [searchQueryOfflineHandymen, setSearchQueryOfflineHandymen] =
    useState("");
  const [currentPageOfflineHandymen, setCurrentPageOfflineHandymen] =
    useState(1);
  const [totalPagesOfflineHandymen, setTotalPagesOfflineHandymen] = useState(1);
  const [displayedOfflineHandymen, setDisplayedOfflineHandymen] = useState([]);

  const [togglingHandymen, setTogglingHandymen] = useState({});
  const handymenPerPage = 10;

  // Common error handler function
  const handleApiError = (error, customMessage) => {
    if (!navigator.onLine) {
      toast.error("Please check your internet connection");
      return;
    }

    if (error.response) {
      switch (error.response.status) {
        case 404:
          toast.info(customMessage || "No handymen found");
          break;
        case 401:
          toast.error("Unauthorized access. Please login again");
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
      toast.error("Unable to reach the server. Please try again later");
    } else {
      toast.error("An error occurred. Please try again");
    }
  };

  // Filter functions
  const filterHandymen = (handymen, query, idField = "handyman_id") => {
    return handymen.filter((handyman) =>
      [handyman[idField], handyman.name, handyman.mobile_no]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase())
    );
  };

  // Pagination calculations
  const calculatePagination = (filteredData, currentPage) => {
    const totalPages = Math.ceil(filteredData.length / handymenPerPage);
    const paginatedData = filteredData.slice(
      (currentPage - 1) * handymenPerPage,
      currentPage * handymenPerPage
    );
    return { totalPages, paginatedData };
  };

  // API fetch functions
  const fetchVerifiedHandymenData = async () => {
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
        `${serverEndPoint}/get_total_handyman_verified_with_count`,
        {},
        config
      );
      console.log("response.data.handymen::", response.data.handymen);
      setAllHandyman(response.data.handymen || []);
      if (response.data.handymen?.length === 0) {
        toast.info("No verified handymen found");
      }
    } catch (error) {
      console.error("Error fetching verified handymen:", error);
      handleApiError(error, "No verified handymen found");
    } finally {
      setLoading(false);
    }
  };

  const fetchUnVerifiedHandymenData = async () => {
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
        `${serverEndPoint}/get_total_handyman_un_verified_with_count`,
        {},
        config
      );
      setAllNewHandymen(response.data.handymen || []);
      if (response.data.handymen?.length === 0) {
        toast.info("No unverified handymen found");
      }
    } catch (error) {
      console.error("Error fetching unverified handymen:", error);
      handleApiError(error, "No unverified handymen found");
    } finally {
      setLoading(false);
    }
  };

  const fetchBlockedHandymenData = async () => {
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
        `${serverEndPoint}/get_total_handyman_blocked_with_count`,
        {},
        config
      );
      setAllBlockedHandymen(response.data.handymen || []);
      if (response.data.handymen?.length === 0) {
        toast.info("No blocked handymen found");
      }
    } catch (error) {
      console.error("Error fetching blocked handymen:", error);
      handleApiError(error, "No blocked handymen found");
    } finally {
      setLoading(false);
    }
  };

  const fetchRejectedHandymenData = async () => {
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
        `${serverEndPoint}/get_total_handyman_rejected_with_count`,
        {},
        config
      );
      setAllRejectedHandymen(response.data.handymen || []);
      if (response.data.handymen?.length === 0) {
        toast.info("No rejected handymen found");
      }
    } catch (error) {
      console.error("Error fetching rejected handymen:", error);
      handleApiError(error, "No rejected handymen found");
    } finally {
      setLoading(false);
    }
  };

  const fetchOnlineHandymenData = async () => {
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
        `${serverEndPoint}/get_all_handyman_online_current_location`,
        {},
        config
      );

      let handymen = response.data.results || [];
      if (handymen.length === 0) {
        toast.info("No online handymen found");
        setAllOnlineHandymen([]);
        return;
      }

      const updatedHandymen = await Promise.all(
        handymen.map(async (handyman) => {
          try {
            const address = await getAddressFromLatLng(
              handyman.current_lat,
              handyman.current_lng
            );
            return { ...handyman, address };
          } catch (error) {
            return { ...handyman, address: "Location not available" };
          }
        })
      );
      setAllOnlineHandymen(updatedHandymen);
    } catch (error) {
      console.error("Error fetching online handymen:", error);
      handleApiError(error, "No online handymen found");
    } finally {
      setLoading(false);
    }
  };

  const fetchOfflineHandymenData = async () => {
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
        `${serverEndPoint}/get_offline_handymen`,
        {
          page: currentPageOfflineHandymen,
          limit: handymenPerPage,
          search: searchQueryOfflineHandymen,
        },
        config
      );

      if (response.data.handymen) {
        setOfflineHandymen(response.data.handymen);
        setTotalPagesOfflineHandymen(
          Math.ceil(response.data.total_count / handymenPerPage)
        );
        setDisplayedOfflineHandymen(
          filterHandymen(response.data.handymen, searchQueryOfflineHandymen)
        );
      }
    } catch (error) {
      console.error("Error fetching offline handymen:", error);
      handleApiError(error, "No offline handymen found");
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

  const handleOnlineStatusToggle = async (handyman) => {
    try {
      setTogglingHandymen((prev) => ({
        ...prev,
        [handyman.handyman_id]: true,
      }));

      const token = Cookies.get("authToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      if (handyman.is_online === 1) {
        const checkResponse = await axios.post(
          `${serverEndPoint}/check_handyman_status`,
          { handyman_id: handyman.handyman_id },
          config
        );

        if (!checkResponse.data.is_free) {
          toast.error("Handyman has active bookings and cannot go offline");
          return;
        }
      }

      const response = await axios.post(
        `${serverEndPoint}/toggle_handyman_online_status`,
        {
          handyman_id: handyman.handyman_id,
          online_status: handyman.is_online === 1 ? 0 : 1,
          current_lat: handyman.current_lat || 0,
          current_lng: handyman.current_lng || 0,
        },
        config
      );

      if (response.status === 200) {
        toast.success(handyman.name + " " + response.data.message);

        // Refresh appropriate data based on active tab
        if (activeTab === "connect-tab") {
          await fetchVerifiedHandymenData();
        } else if (activeTab === "offline-handyman-tab") {
          await fetchOfflineHandymenData();
        } else if (activeTab === "online-handyman-tab") {
          await fetchOnlineHandymenData();
        }

        // Update offline/online lists
        if (handyman.is_online === 1) {
          await fetchOfflineHandymenData();
        } else {
          await fetchOnlineHandymenData();
        }
      }
    } catch (error) {
      console.error("Toggle error:", error);
      handleApiError(error, "Error updating handyman status");
    } finally {
      setTogglingHandymen((prev) => ({
        ...prev,
        [handyman.handyman_id]: false,
      }));
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    switch (tab) {
      case "blocked-handyman-tab":
        fetchBlockedHandymenData();
        break;
      case "rejected-handyman-tab":
        fetchRejectedHandymenData();
        break;
      case "new-handyman-tab":
        fetchUnVerifiedHandymenData();
        break;
      case "online-handyman-tab":
        fetchOnlineHandymenData();
        break;
      case "offline-handyman-tab":
        fetchOfflineHandymenData();
        break;
      default:
        fetchVerifiedHandymenData();
    }
  };

  // Effects
  useEffect(() => {
    fetchVerifiedHandymenData();
  }, []);

  useEffect(() => {
    if (offlineHandymen.length > 0) {
      const filtered = filterHandymen(
        offlineHandymen,
        searchQueryOfflineHandymen
      );
      setDisplayedOfflineHandymen(filtered);
    }
  }, [searchQueryOfflineHandymen, offlineHandymen]);

  if (loading) {
    return <Loader />;
  }

  // Calculate pagination for each tab
  const {
    totalPages: verifiedTotalPages,
    paginatedData: paginatedVerifiedHandymen,
  } = calculatePagination(
    filterHandymen(allHandyman, searchQuery),
    currentPage
  );

  const {
    totalPages: unverifiedTotalPages,
    paginatedData: paginatedUnverifiedHandymen,
  } = calculatePagination(
    filterHandymen(allNewHandymen, filterQuery),
    pageNumber
  );

  const {
    totalPages: rejectedTotalPages,
    paginatedData: paginatedRejectedHandymen,
  } = calculatePagination(
    filterHandymen(allRejectedHandymen, searchQueryRejected),
    currentPageRejected
  );

  const {
    totalPages: blockedTotalPages,
    paginatedData: paginatedBlockedHandymen,
  } = calculatePagination(
    filterHandymen(allBlockedHandymen, searchBlockedQuery),
    currentBlockedPage
  );

  const {
    totalPages: onlineTotalPages,
    paginatedData: paginatedOnlineHandymen,
  } = calculatePagination(
    filterHandymen(allOnlineHandymen, searchQueryOnlineHandymen),
    currentPageOnlineHandymen
  );

  return (
    <div>
      <ToastContainer position="top-right" />
      <Container fluid>
        <Row className="m-1">
          <Col xs={12}>
            <h4 className="main-title">All Handymen</h4>
            <ul className="app-line-breadcrumbs mb-3">
              <li className="">
                <a href="#" className="f-s-14 f-w-500">
                  <span>
                    <i className="ph-duotone ph-wrench f-s-16"></i> Handyman
                    Services
                  </span>
                </a>
              </li>
              <li className="active mt-2">
                <a href="#" className="f-s-14 f-w-500">
                  Handymen
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
                      Verified
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link d-flex align-items-center gap-1 ${
                        activeTab === "new-handyman-tab" ? "active" : ""
                      }`}
                      onClick={() => handleTabClick("new-handyman-tab")}
                    >
                      <i className="ti ti-user-plus f-s-18 mg-b-3"></i>{" "}
                      Un-Verified
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link d-flex align-items-center gap-1 ${
                        activeTab === "rejected-handyman-tab" ? "active" : ""
                      }`}
                      onClick={() => handleTabClick("rejected-handyman-tab")}
                    >
                      <i className="ti ti-zoom-cancel f-s-18 mg-b-3"></i>{" "}
                      Rejected
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link d-flex align-items-center gap-1 ${
                        activeTab === "blocked-handyman-tab" ? "active" : ""
                      }`}
                      onClick={() => handleTabClick("blocked-handyman-tab")}
                    >
                      <i className="ti ti-square-rounded-x f-s-18 mg-b-3"></i>{" "}
                      Blocked
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link d-flex align-items-center gap-1 ${
                        activeTab === "offline-handyman-tab" ? "active" : ""
                      }`}
                      onClick={() => handleTabClick("offline-handyman-tab")}
                    >
                      <i className="ti ti-power f-s-18 mg-b-3"></i> Offline
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link d-flex align-items-center gap-1 ${
                        activeTab === "online-handyman-tab" ? "active" : ""
                      }`}
                      onClick={() => handleTabClick("online-handyman-tab")}
                    >
                      <i className="ti ti-live-view f-s-18 mg-b-3"></i> Online
                    </button>
                  </li>
                </ul>
              </CardBody>

              <div className="card-body handyman-tab-content p-0">
                <div className="tab-content" id="OutlineContent">
                  {/* Verified Handymen Tab */}
                  <div
                    className={`tab-pane fade ${
                      activeTab === "connect-tab" ? "active show" : ""
                    }`}
                  >
                    <DriverTable
                      drivers={paginatedVerifiedHandymen}
                      tableType="verified"
                      handleOnlineStatusToggle={handleOnlineStatusToggle}
                      togglingDrivers={togglingHandymen}
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                      currentPage={currentPage}
                      totalPages={verifiedTotalPages}
                      setCurrentPage={setCurrentPage}
                      driverIdPrefix="handyman_id"
                      routePrefix="handyman"
                      isHandyman={true}
                    />
                  </div>

                  {/* Unverified Handymen Tab */}
                  <div
                    className={`tab-pane fade ${
                      activeTab === "new-handyman-tab" ? "active show" : ""
                    }`}
                  >
                    <DriverTable
                      drivers={paginatedUnverifiedHandymen}
                      tableType="unverified"
                      handleOnlineStatusToggle={handleOnlineStatusToggle}
                      togglingDrivers={togglingHandymen}
                      searchQuery={filterQuery}
                      setSearchQuery={setFilterQuery}
                      currentPage={pageNumber}
                      totalPages={unverifiedTotalPages}
                      setCurrentPage={setPageNumber}
                      driverIdPrefix="handyman_id"
                      routePrefix="handyman"
                      isHandyman={true}
                      showOnlineStatus={false}
                    />
                  </div>

                  {/* Rejected Handymen Tab */}
                  <div
                    className={`tab-pane fade ${
                      activeTab === "rejected-handyman-tab" ? "active show" : ""
                    }`}
                  >
                    <DriverTable
                      drivers={paginatedRejectedHandymen}
                      tableType="rejected"
                      handleOnlineStatusToggle={handleOnlineStatusToggle}
                      togglingDrivers={togglingHandymen}
                      searchQuery={searchQueryRejected}
                      setSearchQuery={setSearchQueryRejected}
                      currentPage={currentPageRejected}
                      totalPages={rejectedTotalPages}
                      setCurrentPage={setCurrentPageRejected}
                      driverIdPrefix="handyman_id"
                      routePrefix="handyman"
                      isHandyman={true}
                      showOnlineStatus={false}
                    />
                  </div>

                  {/* Blocked Handymen Tab */}
                  <div
                    className={`tab-pane fade ${
                      activeTab === "blocked-handyman-tab" ? "active show" : ""
                    }`}
                  >
                    <DriverTable
                      drivers={paginatedBlockedHandymen}
                      tableType="blocked"
                      handleOnlineStatusToggle={handleOnlineStatusToggle}
                      togglingDrivers={togglingHandymen}
                      searchQuery={searchBlockedQuery}
                      setSearchQuery={setSearchBlockedQuery}
                      currentPage={currentBlockedPage}
                      totalPages={blockedTotalPages}
                      setCurrentPage={setCurrentBlockedPage}
                      driverIdPrefix="handyman_id"
                      routePrefix="handyman"
                      isHandyman={true}
                      showOnlineStatus={false}
                    />
                  </div>

                  {/* Online Handymen Tab */}
                  <div
                    className={`tab-pane fade ${
                      activeTab === "online-handyman-tab" ? "active show" : ""
                    }`}
                  >
                    <DriverTable
                      drivers={paginatedOnlineHandymen}
                      tableType="online"
                      handleOnlineStatusToggle={handleOnlineStatusToggle}
                      togglingDrivers={togglingHandymen}
                      searchQuery={searchQueryOnlineHandymen}
                      setSearchQuery={setSearchQueryOnlineHandymen}
                      currentPage={currentPageOnlineHandymen}
                      totalPages={onlineTotalPages}
                      setCurrentPage={setCurrentPageOnlineHandymen}
                      driverIdPrefix="handyman_id"
                      routePrefix="handyman"
                      isHandyman={true}
                      showRegistrationDate={false}
                    />
                  </div>

                  {/* Offline Handymen Tab */}
                  <div
                    className={`tab-pane fade ${
                      activeTab === "offline-handyman-tab" ? "active show" : ""
                    }`}
                  >
                    <DriverTable
                      drivers={displayedOfflineHandymen}
                      tableType="offline"
                      handleOnlineStatusToggle={handleOnlineStatusToggle}
                      togglingDrivers={togglingHandymen}
                      searchQuery={searchQueryOfflineHandymen}
                      setSearchQuery={setSearchQueryOfflineHandymen}
                      currentPage={currentPageOfflineHandymen}
                      totalPages={totalPagesOfflineHandymen}
                      setCurrentPage={setCurrentPageOfflineHandymen}
                      driverIdPrefix="handyman_id"
                      routePrefix="handyman"
                      isHandyman={true}
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

export default AllHandyman;
