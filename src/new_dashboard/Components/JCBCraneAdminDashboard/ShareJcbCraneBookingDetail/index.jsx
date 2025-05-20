/* eslint-disable react/no-unknown-property */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
import axios from "axios";
import Cookies from "js-cookie";

import { useParams } from "react-router-dom";
import Loader from "../../Loader";
import {
  mapKey,
  serverEndPoint,
  formatEpoch,
} from "../../../../dashboard/app/constants";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const MobileJcbCraneLocationDetails = () => {
  const { booking_id } = useParams();
  const mapRef = useRef(null);
  const driverMarkerRef = useRef(null);
  const intervalRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState(null);

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
    driver_name: "",
    driver_auth_token: "",
    customer_name: "",
    customer_auth_token: "",
    pickup_address: "",
    customer_mobile_no: "",
    driver_mobile_no: "",
    sub_cat_name: "",
    service_name: "",
    booking_date: "",
    booking_status: "",
  });
  const [driverLocation, setDriverLocation] = useState(null);

  // Map container style
  const mapContainerStyle = {
    width: "100%",
    height: "300px",
    borderRadius: "10px",
  };

  // Map options
  const mapOptions = {
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
    ],
    disableDefaultUI: true,
    zoomControl: true,
    fullscreenControl: true,
    gestureHandling: "greedy",
  };

  // Marker icons
  const markerIcons = {
    pickup: {
      url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
      scaledSize: { width: 40, height: 40 },
    },
    driver: {
      url: "/assets/icon/car.png",
      scaledSize: { width: 40, height: 40 },
      anchor: { x: 20, y: 20 },
      rotation: 0,
    },
  };

  useEffect(() => {
    fetchBookingsDetails();
    fetchBookingHistoryDetails();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Driver tracking function
  const startTrackingDriver = (driverId) => {
    if (!driverId) return;

    const fetchDriverLocation = async () => {
      try {
        const token = Cookies.get("authToken");
        const response = await axios.post(
          `${serverEndPoint}/jcb_crane_driver_current_location`,
          { driver_id: driverId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200 && response.data.results.length > 0) {
          const newLocation = {
            lat: parseFloat(response.data.results[0].current_lat),
            lng: parseFloat(response.data.results[0].current_lng),
          };
          setDriverLocation(newLocation);
        }
      } catch (error) {
        console.error("Error fetching driver location:", error);
      }
    };

    intervalRef.current = setInterval(fetchDriverLocation, 10000);
    fetchDriverLocation(); // Initial fetch
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
      setError(null);
      const response = await axios.post(
        `${serverEndPoint}/get_jcb_crane_driver_booking_detail_with_id`,
        { booking_id },
        config
      );

      if (response.data.results && response.data.results.length > 0) {
        setBookingDetails(response.data.results[0]);
        if (response.data.results[0].driver_id) {
          startTrackingDriver(response.data.results[0].driver_id);
        }
      }
    } catch (error) {
      console.error("Error fetching booking details:", error);
      if (error.response?.status === 404) {
        setError("No booking details found");
      } else {
        setError("An error occurred while fetching booking details");
      }
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
        `${serverEndPoint}/get_jcb_crane_driver_booking_detail_history_with_id`,
        { booking_id },
        config
      );
      setBookingHistory(response.data.results || []);
    } catch (error) {
      console.error("Error fetching history:", error);
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
        return "success";
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="mobile-jcb-crane-location">
        <Container fluid>
          <Row>
            <Col xs={12}>
              <Card className="shadow-lg border-0 rounded-lg">
                <CardBody className="text-center">
                  <i className="ti ti-alert-circle f-s-48 text-danger mb-3"></i>
                  <h5>{error}</h5>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  return (
    <div className="mobile-jcb-crane-location">
      <Container fluid>
        {/* Logo and Category Section */}
        <Row className="mb-3">
          <Col xs={12}>
            <Card className="shadow-lg border-0 rounded-lg">
              <CardBody>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <img
                      src="/logo_new.png"
                      alt="Company Logo"
                      style={{ height: "40px", width: "auto" }}
                    />
                    <div className="ms-3">
                      <h5 className="mb-0">{bookingDetails.sub_cat_name}</h5>
                      <small className="text-muted">Tracking Details</small>
                    </div>
                  </div>
                  <div className="text-end">
                    <span className="badge bg-primary">
                      #{bookingDetails.booking_id}
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Map Section */}
        <Row>
          <Col xs={12}>
            <Card className="shadow-lg border-0 rounded-lg">
              <CardHeader>
                <h5>Live Location</h5>
              </CardHeader>
              <CardBody>
                <LoadScript
                  googleMapsApiKey={mapKey}
                  libraries={["places"]}
                  onLoad={() => setMapLoaded(true)}
                >
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={{
                      lat: parseFloat(bookingDetails.pickup_lat),
                      lng: parseFloat(bookingDetails.pickup_lng),
                    }}
                    zoom={15} // Increased zoom for a single location
                    options={mapOptions}
                    onLoad={(map) => {
                      mapRef.current = map;
                    }}
                  >
                    <Marker
                      position={{
                        lat: parseFloat(bookingDetails.pickup_lat),
                        lng: parseFloat(bookingDetails.pickup_lng),
                      }}
                      icon={markerIcons.pickup}
                    />

                    {driverLocation && (
                      <Marker
                        position={driverLocation}
                        icon={markerIcons.driver}
                        ref={driverMarkerRef}
                        onLoad={(marker) => {
                          driverMarkerRef.current = marker;
                        }}
                      />
                    )}
                  </GoogleMap>
                </LoadScript>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Booking Details */}
        <Row className="mt-3">
          <Col xs={12}>
            <Card className="shadow-lg border-0 rounded-lg">
              <CardHeader>
                <h5>Booking Details</h5>
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
        </Row>

        {/* Driver Details */}
        <Row className="mt-3">
          <Col xs={12}>
            <Card className="shadow-lg border-0 rounded-lg">
              <CardHeader>
                <h5>Driver Details</h5>
              </CardHeader>
              <CardBody>
                <div className="d-flex align-items-center">
                  <img
                    src={
                      bookingDetails.profile_pic ||
                      "/assets/images/default-avatar.png"
                    }
                    alt="Driver"
                    className="rounded-circle"
                    style={{ width: "50px", height: "50px" }}
                  />
                  <div className="ms-3">
                    <h6 className="mb-1">{bookingDetails.driver_name}</h6>
                    <p className="mb-0 text-muted">
                      {bookingDetails.service_name !== "NA"
                        ? bookingDetails.service_name
                        : "General Service"}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Service Details */}
        <Row className="mt-3">
          <Col xs={12}>
            <Card className="shadow-lg border-0 rounded-lg">
              <CardHeader>
                <h5>Service Details</h5>
              </CardHeader>
              <CardBody>
                <div className="mb-3">
                  <h6 className="f-w-600 text-dark">
                    <i className="ti ti-tool f-s-18 me-2 text-secondary"></i>
                    Service Type
                  </h6>
                  <p className="mb-0">
                    {bookingDetails.service_name !== "NA"
                      ? bookingDetails.service_name
                      : "Not Specified"}
                  </p>
                </div>
                <div className="mb-3">
                  <h6 className="f-w-600 text-dark">
                    <i className="ti ti-map-pin f-s-18 me-2 text-secondary"></i>
                    Work Location
                  </h6>
                  <p className="mb-0">{bookingDetails.pickup_address}</p>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      <style jsx>{`
        .mobile-jcb-crane-location {
          padding: 15px;
        }
      `}</style>
    </div>
  );
};

export default MobileJcbCraneLocationDetails;
