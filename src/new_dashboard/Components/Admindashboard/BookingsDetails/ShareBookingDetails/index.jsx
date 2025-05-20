/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
import React, { useState, useRef, useEffect } from "react";
import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import Loader from "../../../Loader";
import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectionsRenderer,
  Polyline,
} from "@react-google-maps/api";
import { serverEndPoint, mapKey } from "../../../../../dashboard/app/constants";

const MobileGoodsDriverLocationDetails = () => {
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

  const directionsRendererRef = useRef(null);

  const calculateRoute = () => {
    if (!bookingDetails || !mapRef.current) return;

    const directionsService = new window.google.maps.DirectionsService();
    const pickup = {
      lat: parseFloat(bookingDetails.pickup_lat),
      lng: parseFloat(bookingDetails.pickup_lng),
    };

    // Handle multiple drops
    let dropLocations = [];
    if (bookingDetails.multiple_drops > 0 && bookingDetails.drop_locations) {
      try {
        dropLocations =
          typeof bookingDetails.drop_locations === "string"
            ? JSON.parse(bookingDetails.drop_locations)
            : bookingDetails.drop_locations;
      } catch (e) {
        console.error("Error parsing drop locations:", e);
        dropLocations = [];
      }
    }

    if (dropLocations.length > 0) {
      // Calculate route for multiple drops
      const waypoints = dropLocations.map((location) => ({
        location: new window.google.maps.LatLng(
          parseFloat(location.lat),
          parseFloat(location.lng)
        ),
        stopover: true,
      }));

      directionsService.route(
        {
          origin: pickup,
          destination: waypoints[waypoints.length - 1].location,
          waypoints: waypoints.slice(0, -1),
          travelMode: window.google.maps.TravelMode.DRIVING,
          optimizeWaypoints: true,
        },
        (response, status) => {
          if (status === "OK") {
            setDirections(response);

            // Draw polylines between points
            const path = response.routes[0].overview_path;
            const polyline = new window.google.maps.Polyline({
              path: path,
              strokeColor: "#2A62FF",
              strokeOpacity: 1,
              strokeWeight: 4,
              map: mapRef.current,
            });
          } else {
            console.error("Directions request failed due to " + status);
          }
        }
      );
    } else {
      // Single drop route
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

            // Draw polyline for single drop
            const path = response.routes[0].overview_path;
            const polyline = new window.google.maps.Polyline({
              path: path,
              strokeColor: "#2A62FF",
              strokeOpacity: 1,
              strokeWeight: 4,
              map: mapRef.current,
            });
          } else {
            console.error("Directions request failed due to " + status);
          }
        }
      );
    }
  };

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
      url: "/assets/icon/car.png", // Update this path to match your project structure
      scaledSize: { width: 40, height: 40 },
      anchor: { x: 20, y: 20 }, // Add anchor point for proper centering
      rotation: 0, // Add rotation property
    },
  };

  // Polyline options
  const polylineOptions = {
    strokeColor: "#2A62FF",
    strokeOpacity: 1,
    strokeWeight: 4,
  };

  useEffect(() => {
    fetchBookingDetails();
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
        `${serverEndPoint}/get_goods_booking_detail_with_id`,
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

  const updateDriverMarker = (newLocation) => {
    if (!driverMarkerRef.current || !driverLocation) return;

    // Calculate bearing between old and new location
    const bearing = calculateBearing(
      driverLocation.lat,
      driverLocation.lng,
      newLocation.lat,
      newLocation.lng
    );

    // Update marker rotation
    driverMarkerRef.current.setIcon({
      ...markerIcons.driver,
      rotation: bearing,
    });
  };

  // Helper function to calculate bearing between two points
  const calculateBearing = (lat1, lon1, lat2, lon2) => {
    const toRad = (deg) => (deg * Math.PI) / 180;
    const toDeg = (rad) => (rad * 180) / Math.PI;

    const dLon = toRad(lon2 - lon1);
    const lat1Rad = toRad(lat1);
    const lat2Rad = toRad(lat2);

    const y = Math.sin(dLon) * Math.cos(lat2Rad);
    const x =
      Math.cos(lat1Rad) * Math.sin(lat2Rad) -
      Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);
    let bearing = toDeg(Math.atan2(y, x));
    bearing = (bearing + 360) % 360;

    return bearing;
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
          `${serverEndPoint}/goods_driver_current_location`,
          { driver_id: driverId },
          config
        );

        if (response.status === 200 && response.data.results.length > 0) {
          const newLocation = {
            lat: parseFloat(response.data.results[0].current_lat),
            lng: parseFloat(response.data.results[0].current_lng),
          };

          // Update driver marker rotation if we have a previous location
          if (driverLocation) {
            updateDriverMarker(newLocation);
          }

          setDriverLocation(newLocation);
        }
      } catch (error) {
        console.error("Error fetching driver location:", error);
      }
    };

    intervalRef.current = setInterval(fetchDriverLocation, 10000);
    fetchDriverLocation(); // Initial fetch
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

  const pickup = {
    lat: parseFloat(bookingDetails.pickup_lat),
    lng: parseFloat(bookingDetails.pickup_lng),
  };

  // Parse drop locations
  let dropLocations = [];
  if (bookingDetails.multiple_drops > 0 && bookingDetails.drop_locations) {
    try {
      dropLocations =
        typeof bookingDetails.drop_locations === "string"
          ? JSON.parse(bookingDetails.drop_locations)
          : bookingDetails.drop_locations;
    } catch (e) {
      console.error("Error parsing drop locations:", e);
    }
  }

  return (
    <div className="mobile-driver-location">
      <Container fluid>
        <Row className="mb-3">
          <Col xs={12}>
            <Card className="shadow-lg border-0 rounded-lg">
              <CardBody>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <img
                      src="/logo_new.png" // Update this path to your logo
                      alt="Company Logo"
                      style={{ height: "40px", width: "auto" }}
                    />
                    <div className="ms-3">
                      <h5 className="mb-0">Goods Delivery</h5>
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
                    center={pickup}
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

                    <Marker position={pickup} icon={markerIcons.pickup} />

                    {dropLocations.length > 0 ? (
                      dropLocations.map((location, index) => (
                        <Marker
                          key={index}
                          position={{
                            lat: parseFloat(location.lat),
                            lng: parseFloat(location.lng),
                          }}
                          icon={markerIcons.drop}
                        />
                      ))
                    ) : (
                      <Marker
                        position={{
                          lat: parseFloat(bookingDetails.destination_lat),
                          lng: parseFloat(bookingDetails.destination_lng),
                        }}
                        icon={markerIcons.drop}
                      />
                    )}

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
        <Row className="mt-3">
          <Col xs={12}>
            <Card className="shadow-lg border-0 rounded-lg">
              <CardHeader>
                <h5>Route Details</h5>
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

                  {dropLocations.length > 0 ? (
                    dropLocations.map((location, index) => (
                      <div
                        key={index}
                        className="d-flex align-items-center mb-3"
                      >
                        <div className="drop-dot me-2"></div>
                        <div>
                          <small className="text-muted">Drop {index + 1}</small>
                          <p className="mb-0">{location.address}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="d-flex align-items-center">
                      <div className="drop-dot me-2"></div>
                      <div>
                        <small className="text-muted">Drop</small>
                        <p className="mb-0">{bookingDetails.drop_address}</p>
                      </div>
                    </div>
                  )}
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

export default MobileGoodsDriverLocationDetails;
