/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Container,
  Row,
} from "reactstrap";
import axios from "axios";
import Cookies from "js-cookie";

import { useParams } from "react-router-dom";
import Loader from "../../Loader";
import {
  mapKey,
  serverEndPoint,
  formatEpoch,
} from "../../../../dashboard/app/constants";

const HandymanBookingDetails = () => {
  const { booking_id } = useParams();
  const polygonMapRef = useRef();
  const directionsRendererRef = useRef(null);
  const handymanMarkerRef = useRef(null);
  const intervalRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  const [bookingDetails, setBookingDetails] = useState({
    booking_id: 0,
    order_id: 0,
    customer_id: 0,
    city_id: 0,
    driver_id: 0,
    pickup_lat: 0.0,
    pickup_lng: 0.0,
    total_price: 0.0,
    base_price: 0.0,
    booking_timing: 0.0,
    driver_arrival_time: 0.0,
    gst_amount: 0.0,
    igst_amount: 0.0,
    cancel_time: 0.0,
    payment_method: "",
    cancelled_reason: "",
    handyman_name: "",
    handyman_auth_token: "",
    customer_name: "",
    customer_auth_token: "",
    pickup_address: "",
    customer_mobile_no: "",
    handyman_mobile_no: "",
    sub_cat_name: "",
    service_name: "",
    booking_date: "",
    booking_status: "",
  });

  // Map Style
  const mapStyle = [
    {
      featureType: "administrative",
      elementType: "geometry",
      stylers: [{ visibility: "simplified" }],
    },
    {
      featureType: "poi",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "road",
      elementType: "labels.icon",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "transit",
      stylers: [{ visibility: "off" }],
    },
  ];

  // Initialize Map
  const initializeMap = () => {
    if (!window.google || !bookingDetails.pickup_lat) {
      return;
    }

    const workLocation = {
      lat: parseFloat(bookingDetails.pickup_lat),
      lng: parseFloat(bookingDetails.pickup_lng),
    };

    const map = new window.google.maps.Map(polygonMapRef.current, {
      center: workLocation,
      zoom: 15,
      styles: mapStyle,
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
    });

    // Add work location marker
    new window.google.maps.Marker({
      position: workLocation,
      map: map,
      icon: {
        url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
        scaledSize: new window.google.maps.Size(40, 40),
      },
      title: "Work Location",
    });

    // Start tracking handyman if available
    if (bookingDetails.driver_id) {
      startTrackingHandyman(map, bookingDetails.driver_id);
    }
  };

  // Load Google Maps Script
  useEffect(() => {
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${mapKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setMapLoaded(true);
      };
      document.head.appendChild(script);
    } else {
      setMapLoaded(true);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Initialize map when data and script are loaded
  useEffect(() => {
    if (mapLoaded && bookingDetails.pickup_lat) {
      initializeMap();
    }
  }, [mapLoaded, bookingDetails]);

  // Handyman tracking function
  const startTrackingHandyman = (map, handymanId) => {
    if (!handymanId) return;

    const fetchHandymanLocation = async () => {
      try {
        const token = Cookies.get("authToken");
        const response = await axios.post(
          `${serverEndPoint}/handyman_current_location`,
          { handyman_id: handymanId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200 && response.data.results.length > 0) {
          const handymanLocation = {
            lat: parseFloat(response.data.results[0].current_lat),
            lng: parseFloat(response.data.results[0].current_lng),
          };

          if (handymanMarkerRef.current) {
            handymanMarkerRef.current.setPosition(handymanLocation);
          } else {
            handymanMarkerRef.current = new window.google.maps.Marker({
              position: handymanLocation,
              map,
              icon: {
                url: "/assets/icon/handyman.png",
                scaledSize: new window.google.maps.Size(40, 40),
                origin: new window.google.maps.Point(0, 0),
                anchor: new window.google.maps.Point(20, 20),
              },
            });
          }
        }
      } catch (error) {
        console.error("Error fetching handyman location:", error);
      }
    };

    intervalRef.current = setInterval(fetchHandymanLocation, 10000);
    fetchHandymanLocation(); // Initial fetch
  };

  // API calls
  const fetchBookingsDetails = async () => {
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
        `${serverEndPoint}/get_handyman_booking_detail_with_id`,
        { booking_id },
        config
      );

      if (response.data.results && response.data.results.length > 0) {
        setBookingDetails(response.data.results[0]);
      }
    } catch (error) {
      console.error("Error fetching booking details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookingHistoryDetails = async () => {
    const token = Cookies.get("authToken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await axios.post(
        `${serverEndPoint}/get_handyman_booking_detail_history_with_id`,
        { booking_id },
        config
      );
      setBookingHistory(response.data.results || []);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  useEffect(() => {
    fetchBookingsDetails();
    fetchBookingHistoryDetails();
  }, []);

  const getTimeAgo = (epochTime) => {
    const currentTime = Date.now() / 1000;
    const differenceInSeconds = currentTime - epochTime;
    const differenceInMinutes = Math.floor(differenceInSeconds / 60);

    if (differenceInMinutes < 60) {
      return differenceInMinutes === 0
        ? "Just now"
        : `${differenceInMinutes} mins ago`;
    } else {
      const date = new Date(epochTime * 1000);
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Cancelled":
        return "danger";
      case "End Trip":
        return "success";
      case "Driver Arrived":
        return "warning";
      case "Driver Accepted":
        return "info";
      case "Start Trip":
        return "secondary";
      default:
        return "light";
    }
  };

  const statusColors = {
    "Driver Accepted": "primary",
    "Driver Arrived": "secondary",
    "OTP Verified": "dark",
    "Start Trip": "info",
    "Make Payment": "warning",
    "End Trip": "success",
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="m-5">
      <Container fluid>
        {/* Breadcrumb */}
        <Row className="m-1">
          <Col xs={12}>
            <h4 className="main-title">Booking Details</h4>
            <ul className="app-line-breadcrumbs mb-3">
              <li className="">
                <a href="#" className="f-s-14 f-w-500">
                  <span>
                    <i className="ph-duotone ph-users f-s-16"></i> Handyman
                  </span>
                </a>
              </li>
              <li className="active">
                <a href="#" className="f-s-14 f-w-500">
                  Booking Details
                </a>
              </li>
            </ul>
          </Col>
        </Row>

        <Row className="order-details">
          <Col xxl={9}>
            {/* Map Section */}
            <Row>
              <Col lg={12}>
                <Card className="shadow-lg border-0 rounded-lg">
                  <CardHeader>
                    <h5>Live Tracking</h5>
                  </CardHeader>
                  <CardBody>
                    <div
                      className="w-100"
                      style={{ height: "400px" }}
                      ref={polygonMapRef}
                    ></div>
                  </CardBody>
                </Card>
              </Col>
            </Row>

            {/* Booking Details Row */}
            <Row className="mt-4">
              <Col lg={4}>
                <Card className="order-details-card shadow-lg border-0">
                  <CardHeader>
                    <h5 className="text-nowrap">
                      Booking Details (#{bookingDetails.booking_id})
                    </h5>
                  </CardHeader>
                  <CardBody>
                    <div className="d-flex justify-content-between mb-3">
                      <h6 className="f-w-600 text-dark">
                        <i className="ti ti-calendar f-s-18 me-2 text-secondary"></i>
                        Date
                      </h6>
                      <div className="text-end">
                        <p className="mb-0">{bookingDetails.booking_date}</p>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                      <h6 className="f-w-600 text-dark">
                        <i className="ti ti-clock f-s-18 me-2"></i>
                        Time
                      </h6>
                      <div className="text-end">
                        <p className="mb-0">
                          {formatEpoch(bookingDetails.booking_timing)}
                        </p>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                      <h6 className="f-w-600 text-dark">
                        <i className="ti ti-user-check f-s-18 me-2"></i>
                        Status
                      </h6>
                      <div className="text-end">
                        <span
                          className={`badge bg-${getStatusColor(
                            bookingDetails.booking_status
                          )}`}
                        >
                          {bookingDetails.booking_status}
                        </span>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between">
                      <h6 className="f-w-600 text-dark">
                        <i className="ti ti-receipt f-s-18 me-2"></i>
                        Amount
                      </h6>
                      <div className="text-end">
                        <span className="badge bg-primary">
                          ₹{bookingDetails.total_price}/-
                        </span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>

              {/* Customer Details */}
              <Col lg={4}>
                <Card className="order-details-card shadow-lg border-0">
                  <CardHeader>
                    <h5>Customer Details</h5>
                  </CardHeader>
                  <CardBody>
                    <div className="d-flex justify-content-between mb-3">
                      <h6 className="f-w-600 text-dark">
                        <i className="ti ti-user f-s-18 me-2 text-secondary"></i>
                        Name
                      </h6>
                      <div className="text-end">
                        <p className="mb-0">{bookingDetails.customer_name}</p>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between">
                      <h6 className="f-w-600 text-dark">
                        <i className="ti ti-phone f-s-18 me-2 text-secondary"></i>
                        Contact
                      </h6>
                      <div className="text-end">
                        <p className="mb-0">
                          {bookingDetails.customer_mobile_no}
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>

              {/* Handyman Details */}
              <Col lg={4}>
                <Card className="order-details-card shadow-lg border-0">
                  <CardHeader>
                    <h5>Handyman Details</h5>
                  </CardHeader>
                  <CardBody>
                    <div className="d-flex justify-content-between mb-3">
                      <h6 className="f-w-600 text-dark">
                        <i className="ti ti-user-check f-s-18 me-2 text-secondary"></i>
                        Name
                      </h6>
                      <div className="text-end">
                        <p className="mb-0">{bookingDetails.handyman_name}</p>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                      <h6 className="f-w-600 text-dark">
                        <i className="ti ti-phone f-s-18 me-2 text-secondary"></i>
                        Contact
                      </h6>
                      <div className="text-end">
                        <p className="mb-0">
                          {bookingDetails.handyman_mobile_no}
                        </p>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                      <h6 className="f-w-600 text-dark">
                        <i className="ti ti-tool f-s-18 me-2 text-secondary"></i>
                        Service
                      </h6>
                      <div className="text-end">
                        <span className="badge bg-info">
                          {bookingDetails.service_name !== "NA"
                            ? bookingDetails.service_name
                            : "General Service"}
                        </span>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between">
                      <h6 className="f-w-600 text-dark">
                        <i className="ti ti-category f-s-18 me-2 text-secondary"></i>
                        Category
                      </h6>
                      <div className="text-end">
                        <span className="badge bg-secondary">
                          {bookingDetails.sub_cat_name}
                        </span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>

            {/* Service Details */}
            <Row className="mt-4">
              <Col lg={12}>
                <Card className="order-details-card shadow-lg border-0">
                  <CardHeader>
                    <h5>Service Details</h5>
                  </CardHeader>
                  <CardBody>
                    <div className="d-flex justify-content-between mb-3">
                      <h6 className="f-w-600 text-dark">
                        <i className="ti ti-map-pin f-s-18 me-2 text-secondary"></i>
                        Work Location
                      </h6>
                      <div className="text-end">
                        <p className="mb-0">{bookingDetails.pickup_address}</p>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between">
                      <h6 className="f-w-600 text-dark">
                        <i className="ti ti-clock f-s-18 me-2 text-secondary"></i>
                        Service Hours
                      </h6>
                      <div className="text-end">
                        <span className="badge bg-primary">1 Hour</span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Col>

          {/* Right Sidebar */}
          <Col xxl={3}>
            <Card className="equal-card shadow-lg border-0">
              <CardHeader>
                <h5>Booking Timeline</h5>
              </CardHeader>
              <CardBody>
                <ul className="app-timeline-box">
                  {bookingHistory.map((history) => (
                    <li
                      className="timeline-section"
                      key={history.booking_history_id}
                    >
                      <div className="timeline-icon">
                        <span
                          className={`text-light-${
                            statusColors[history.status]
                          } h-35 w-35 d-flex-center b-r-50`}
                        >
                          <i className="ti ti-check f-s-20"></i>
                        </span>
                      </div>
                      <div
                        className={`timeline-content bg-light-${
                          statusColors[history.status]
                        } b-1-${statusColors[history.status]}`}
                      >
                        <div className="d-flex justify-content-between align-items-center timeline-flex">
                          <h6
                            className={`mt-2 text-${
                              statusColors[history.status]
                            }`}
                          >
                            {history.status}
                          </h6>
                          <span
                            className={`badge text-bg-${
                              statusColors[history.status]
                            } ms-2`}
                          >
                            {getTimeAgo(history.time)}
                          </span>
                        </div>
                        <p className="text-secondary mb-0">{history.date}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardBody>

              {/* Price Details */}
              <CardFooter>
                <Card className="shadow-lg border-0 rounded-lg">
                  <CardHeader>
                    <h5>Price Breakdown</h5>
                  </CardHeader>
                  <CardBody>
                    <div className="table-responsive">
                      <table className="table cart-side-table mb-0">
                        <tbody>
                          <tr>
                            <td>Base Fare:</td>
                            <td className="text-end">
                              ₹{bookingDetails.base_price}
                            </td>
                          </tr>
                          <tr>
                            <td>GST:</td>
                            <td className="text-end">
                              ₹{bookingDetails.gst_amount}
                            </td>
                          </tr>
                          <tr>
                            <td>IGST:</td>
                            <td className="text-end">
                              ₹{bookingDetails.igst_amount}
                            </td>
                          </tr>
                          <tr className="total-price">
                            <th>Total Amount:</th>
                            <th className="text-end">
                              ₹{Math.round(bookingDetails.total_price)}/-
                            </th>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardBody>
                </Card>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HandymanBookingDetails;
