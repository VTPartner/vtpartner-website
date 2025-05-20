/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
import React, { useState, useRef, useEffect } from "react";
import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";

import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";
import {
  serverEndPoint,
  mapKey,
  formatEpoch,
} from "../../../../dashboard/app/constants";
import Loader from "../../Loader";
// import {
//   serverEndPoint,
//   mapKey,
//   formatEpoch,
// } from "../../../../../dashboard/app/constants";

const MobileCabDriverLocationDetails = () => {
  const { booking_id } = useParams();
  const mapRef = useRef(null);
  const driverMarkerRef = useRef(null);
  const intervalRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [directions, setDirections] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [bookingHistory, setBookingHistory] = useState([]);

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
      url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
      scaledSize: { width: 40, height: 40 },
    },
    drop: {
      url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
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
    fetchBookingDetails();
    fetchBookingHistoryDetails();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const fetchBookingDetails = async () => {
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
        `${serverEndPoint}/get_cab_booking_detail_with_id`,
        { booking_id },
        config
      );

      if (response.status === 200 && response.data.results.length > 0) {
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
        `${serverEndPoint}/get_cab_booking_detail_history_with_id`,
        { booking_id },
        config
      );
      setBookingHistory(response.data.results || []);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  const calculateRoute = () => {
    if (!bookingDetails || !mapRef.current) return;

    const directionsService = new window.google.maps.DirectionsService();
    const pickup = {
      lat: parseFloat(bookingDetails.pickup_lat),
      lng: parseFloat(bookingDetails.pickup_lng),
    };

    const drop = {
      lat: parseFloat(bookingDetails.destination_lat),
      lng: parseFloat(bookingDetails.destination_lng),
    };

    directionsService.route(
      {
        origin: pickup,
        destination: drop,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === "OK") {
          setDirections(response);
        } else {
          console.error("Directions request failed due to " + status);
        }
      }
    );
  };

  const startTrackingDriver = (driverId) => {
    if (!driverId) return;

    const fetchDriverLocation = async () => {
      const token = Cookies.get("authToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      try {
        const response = await axios.post(
          `${serverEndPoint}/cab_driver_current_location`,
          { driver_id: driverId },
          config
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

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="mobile-driver-location">
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

  if (!bookingDetails || bookingDetails.booking_status === "End Trip") {
    return null;
  }

  return (
    <div className="mobile-driver-location">
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
                      <h5 className="mb-0">Cab Service</h5>
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
                  onLoad={() => {
                    setMapLoaded(true);
                    calculateRoute();
                  }}
                >
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={{
                      lat: parseFloat(bookingDetails.pickup_lat),
                      lng: parseFloat(bookingDetails.pickup_lng),
                    }}
                    zoom={12}
                    options={mapOptions}
                    onLoad={(map) => {
                      mapRef.current = map;
                      calculateRoute();
                    }}
                  >
                    {directions && (
                      <DirectionsRenderer
                        directions={directions}
                        options={{
                          suppressMarkers: true,
                          polylineOptions: {
                            strokeColor: "#2A62FF",
                            strokeOpacity: 1,
                            strokeWeight: 4,
                          },
                        }}
                      />
                    )}

                    <Marker
                      position={{
                        lat: parseFloat(bookingDetails.pickup_lat),
                        lng: parseFloat(bookingDetails.pickup_lng),
                      }}
                      icon={markerIcons.pickup}
                    />

                    <Marker
                      position={{
                        lat: parseFloat(bookingDetails.destination_lat),
                        lng: parseFloat(bookingDetails.destination_lng),
                      }}
                      icon={markerIcons.drop}
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
                    <i className="ti ti-car f-s-18 me-2"></i>
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
                    <h6 className="mb-1">{bookingDetails.driver_first_name}</h6>
                    <p className="mb-0 text-muted">
                      {bookingDetails.vehicle_name} -{" "}
                      {bookingDetails.vehicle_plate_no}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Journey Details */}
        <Row className="mt-3">
          <Col xs={12}>
            <Card className="shadow-lg border-0 rounded-lg">
              <CardHeader>
                <h5>Journey Details</h5>
              </CardHeader>
              <CardBody>
                <div className="route-details">
                  <div className="d-flex align-items-center mb-3">
                    <div className="pickup-dot me-2"></div>
                    <div>
                      <small className="text-muted">Pickup</small>
                      <p className="mb-0">{bookingDetails.pickup_address}</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="drop-dot me-2"></div>
                    <div>
                      <small className="text-muted">Drop</small>
                      <p className="mb-0">{bookingDetails.drop_address}</p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      <style jsx>{`
        .mobile-driver-location {
          padding: 15px;
        }
        .pickup-dot {
          width: 10px;
          height: 10px;
          background-color: #4caf50;
          border-radius: 50%;
        }
        .drop-dot {
          width: 10px;
          height: 10px;
          background-color: #f44336;
          border-radius: 50%;
        }
        .route-details {
          position: relative;
        }
        .route-details::before {
          content: "";
          position: absolute;
          left: 4px;
          top: 25px;
          bottom: 25px;
          width: 2px;
          background-color: #e0e0e0;
        }
      `}</style>
    </div>
  );
};

export default MobileCabDriverLocationDetails;
