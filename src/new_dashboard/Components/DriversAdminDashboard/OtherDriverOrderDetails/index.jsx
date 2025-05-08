import { useState, useRef, useEffect } from "react";
import {
  Button,
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

import { useNavigate, useParams } from "react-router-dom";

import {
  DirectionsRenderer,
  GoogleMap,
  LoadScript,
  Marker,
} from "@react-google-maps/api";
import {
  formatEpoch,
  mapKey,
  serverEndPoint,
} from "../../../../dashboard/app/constants";
import Loader from "../../Loader";

// Define libraries to load
const libraries = ["places", "geometry", "drawing"];

// Custom map style for better performance
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

const mapContainerStyle = {
  width: "100%",
  height: "500px",
  borderRadius: "10px",
};

const OtherDriverOrderDetails = () => {
  const { booking_id, order_id } = useParams();
  const [loading, setLoading] = useState(true);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [bookingDetails, setBookingDetails] = useState({
    booking_id: "",
    order_id: "",
    customer_id: "",
    city_id: "",
    driver_id: "",
    pickup_lat: "",
    pickup_lng: "",
    destination_lat: "",
    destination_lng: "",
    total_price: "",
    base_price: "",
    booking_timing: "",
    driver_arrival_time: "",
    gst_amount: "",
    igst_amount: "",
    payment_method: "",
    driver_first_name: "",
    driver_auth_token: "",
    customer_name: "",
    customer_auth_token: "",
    pickup_address: "",
    drop_address: "",
    customer_mobile_no: "",
    driver_mobile_no: "",
    sub_cat_name: "",
    service_name: "",
    booking_date: "",
    booking_status: "",
    distance: "",
    total_time: "",
  });

  const intervalRef = useRef(null);
  const [pickup, setPickup] = useState(null);
  const [drop, setDrop] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);

  // Set pickup & drop locations when bookingDetails is available
  useEffect(() => {
    if (bookingDetails?.pickup_lat && bookingDetails?.destination_lat) {
      setPickup({
        lat: parseFloat(bookingDetails.pickup_lat),
        lng: parseFloat(bookingDetails.pickup_lng),
      });
      setDrop({
        lat: parseFloat(bookingDetails.destination_lat),
        lng: parseFloat(bookingDetails.destination_lng),
      });
    }
  }, [bookingDetails]);

  // Fetch driver location at regular intervals
  useEffect(() => {
    if (bookingDetails?.driver_id) {
      fetchDriverLocation();
      intervalRef.current = setInterval(fetchDriverLocation, 10000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [bookingDetails?.driver_id]);

  const fetchDriverLocation = async () => {
    try {
      const token = Cookies.get("authToken");
      const response = await axios.post(
        `${serverEndPoint}/other_driver_current_location`,
        { driver_id: bookingDetails.driver_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 && response.data.results.length > 0) {
        setDriverLocation({
          lat: parseFloat(response.data.results[0].current_lat),
          lng: parseFloat(response.data.results[0].current_lng),
        });
      }
    } catch (error) {
      console.error("Error fetching driver location:", error);
    }
  };

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
        `${serverEndPoint}/get_other_driver_order_detail_with_id`,
        { order_id },
        config
      );
      setBookingDetails(response.data.results[0] || {});
    } catch (error) {
      console.error("Error fetching data:", error);
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
        `${serverEndPoint}/get_other_driver_booking_detail_history_with_id`,
        { booking_id },
        config
      );
      setBookingHistory(response.data.results || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchBookingsDetails();
  }, []);

  useEffect(() => {
    if (bookingDetails.booking_id) {
      fetchBookingHistoryDetails();
    }
  }, [bookingDetails]);

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

  const navigate = useNavigate();

  const handleGenerateInvoice = () => {
    navigate(`/other-driver-invoice/${bookingDetails.order_id}`, {
      state: { bookingDetails },
    });
  };

  const statusColors = {
    "Driver Accepted": "primary",
    "Driver Arrived": "secondary",
    "OTP Verified": "dark",
    "Start Trip": "info",
    "Make Payment": "warning",
    "End Trip": "success",
  };

  const [directions, setDirections] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef(null);

  // Function to calculate route
  const calculateRoute = () => {
    if (!pickup || !drop) return;

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: pickup,
        destination: drop,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  };

  // Calculate route when pickup and drop points are available
  useEffect(() => {
    if (pickup && drop && mapLoaded) {
      calculateRoute();
    }
  }, [pickup, drop, mapLoaded]);

  // Initialize map options
  const mapOptions = {
    styles: mapStyle,
    disableDefaultUI: true,
    zoomControl: true,
    fullscreenControl: true,
    gestureHandling: "greedy",
  };

  // Custom marker icons
  const markerIcons = {
    pickup: {
      url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
      scaledSize: mapLoaded
        ? new window.google.maps.Size(40, 40)
        : { width: 40, height: 40 },
    },
    drop: {
      url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
      scaledSize: mapLoaded
        ? new window.google.maps.Size(40, 40)
        : { width: 40, height: 40 },
    },
    driver: {
      url: "/assets/icon/car.png",
      scaledSize: mapLoaded
        ? new window.google.maps.Size(32, 32)
        : { width: 32, height: 32 },
    },
  };

  if (loading) {
    return <Loader />;
  }

  // Map component
  const renderMap = () => {
    return (
      <Card className="shadow-lg border-0 rounded-lg">
        <CardHeader>
          <h5>Route</h5>
        </CardHeader>
        <CardBody>
          <LoadScript
            googleMapsApiKey={mapKey}
            libraries={libraries}
            onLoad={() => setMapLoaded(true)}
          >
            {pickup && drop ? (
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={pickup}
                zoom={12}
                options={mapOptions}
                onLoad={(map) => {
                  mapRef.current = map;
                }}
              >
                {/* Render directions if available */}
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

                {/* Pickup Marker */}
                <Marker position={pickup} icon={markerIcons.pickup} />

                {/* Drop Marker */}
                <Marker position={drop} icon={markerIcons.drop} />

                {/* Driver Marker */}
                {driverLocation && (
                  <Marker position={driverLocation} icon={markerIcons.driver} />
                )}
              </GoogleMap>
            ) : (
              <div
                style={mapContainerStyle}
                className="d-flex align-items-center justify-content-center bg-light"
              >
                <div className="text-center">
                  <i className="ti ti-map-pin f-s-48 text-secondary mb-2"></i>
                  <p>Loading map...</p>
                </div>
              </div>
            )}
          </LoadScript>
        </CardBody>
      </Card>
    );
  };

  return (
    <div className="m-5">
      <Container fluid>
        {/* Breadcrumb */}
        <Row className="m-1">
          <Col xs={12}>
            <h4 className="main-title">Order Details</h4>
            <ul className="app-line-breadcrumbs mb-3">
              <li className="">
                <a href="#" className="f-s-14 f-w-500">
                  <span>
                    <i className="ph-duotone ph-users f-s-16"></i> Other Driver
                  </span>
                </a>
              </li>
              <li className="active">
                <a href="#" className="f-s-14 f-w-500">
                  Order Details
                </a>
              </li>
            </ul>
          </Col>
        </Row>

        <Row className="order-details">
          <Col xxl={9}>
            {/* Map Section */}
            <Row>
              <Col lg={12}>{renderMap()}</Col>
            </Row>

            {/* Order, Customer, Driver Details Row */}
            <Row>
              <Col lg={4}>
                <Card className="order-details-card shadow-lg border-0">
                  <CardHeader>
                    <h5 className="text-nowrap">Order Details (#{order_id})</h5>
                  </CardHeader>
                  <CardBody>
                    <div className="d-flex justify-content-between">
                      <h6 className="f-w-600 text-dark">
                        <i className="ti ti-calendar f-s-18 me-2 text-secondary"></i>
                        Date
                      </h6>
                      <div className="text-end">
                        <p>{bookingDetails.booking_date}</p>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between mt-3">
                      <h6 className="f-w-600 text-dark">
                        <i className="ti ti-credit-card f-s-18 me-2"></i>Time
                      </h6>
                      <div className="text-end">
                        <p>{formatEpoch(bookingDetails.booking_timing)}</p>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between mt-3">
                      <h6 className="f-w-600 text-dark">
                        <i className="ti ti-car f-s-18 me-2"></i>
                        Current Status
                      </h6>
                      <div className="text-end">
                        <p
                          className={`badge bg-${(() => {
                            if (bookingDetails.booking_status === "Cancelled")
                              return "danger";
                            if (bookingDetails.booking_status === "End Trip")
                              return "success";
                            if (
                              bookingDetails.booking_status === "Driver Arrived"
                            )
                              return "warning";
                            if (
                              bookingDetails.booking_status ===
                              "Driver Accepted"
                            )
                              return "info";
                            if (bookingDetails.booking_status === "Start Trip")
                              return "secondary";
                            return "light";
                          })()}`}
                        >
                          {bookingDetails.booking_status}
                        </p>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between mt-3">
                      <h6 className="f-w-600 text-dark">
                        <i className="ti ti-moneybag f-s-18 me-2"></i>
                        Estimated Amount
                      </h6>
                      <div className="text-end">
                        <p className="badge bg-primary">
                          Rs.{bookingDetails.total_price} /-
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>

              <Col lg={4}>
                <Card className="order-details-card shadow-lg border-0">
                  <CardHeader>
                    <h5>Customer Details</h5>
                  </CardHeader>
                  <CardBody>
                    <div className="d-flex justify-content-between">
                      <h6 className="f-w-600 text-dark">
                        <i className="ti ti-user f-s-18 me-2 text-secondary"></i>
                        Customer
                      </h6>
                      <div className="text-end">
                        <p>{bookingDetails.customer_name}</p>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between mt-3">
                      <h6 className="f-w-600 text-dark">
                        <i className="ti ti-device-mobile f-s-18 text-secondary me-2"></i>
                        Contact
                      </h6>
                      <div className="text-end">
                        <p>{bookingDetails.customer_mobile_no}</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>

              <Col lg={4}>
                <Card className="order-details-card shadow-lg border-0">
                  <CardHeader>
                    <h5>Driver Details</h5>
                  </CardHeader>
                  <CardBody>
                    <div className="d-flex justify-content-between">
                      <h6 className="f-w-600 text-dark">
                        <i className="ti ti-user-check f-s-18 text-secondary me-2"></i>
                        Driver
                      </h6>
                      <div className="text-end">
                        <p>{bookingDetails.driver_first_name}</p>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between mt-3">
                      <h6 className="f-w-600 text-dark">
                        <i className="ti ti-phone f-s-18 text-secondary me-2"></i>
                        Contact
                      </h6>
                      <div className="text-end">
                        <p>{bookingDetails.driver_mobile_no}</p>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between mt-3">
                      <h6 className="f-w-600 text-dark">
                        <i className="ti ti-tool f-s-18 text-secondary me-2"></i>
                        Service Type
                      </h6>
                      <div className="text-end badge bg-info">
                        <p>{bookingDetails.service_name || "N/A"}</p>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between mt-3">
                      <h6 className="f-w-600 text-dark">
                        <i className="ti ti-category f-s-18 text-secondary me-2"></i>
                        Category
                      </h6>
                      <div className="text-end badge bg-primary">
                        <p>{bookingDetails.sub_cat_name || "N/A"}</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>

            {/* Journey Details */}
            <Row>
              <Col lg={12}>
                <Card className="order-details-card shadow-lg border-0">
                  <CardHeader>
                    <h5 className="text-nowrap">Journey Details</h5>
                  </CardHeader>
                  <CardBody>
                    <div className="d-flex justify-content-between">
                      <h6 className="f-w-600 text-dark">
                        <i className="ti ti-map-pin f-s-18 me-2 text-secondary"></i>
                        Pickup
                      </h6>
                      <div className="text-end">
                        <p>{bookingDetails.pickup_address}</p>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between mt-3">
                      <h6 className="f-w-600 text-dark">
                        <i className="ti ti-map-2 f-s-18 me-2"></i>Drop
                      </h6>
                      <div className="text-end">
                        <p>{bookingDetails.drop_address}</p>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between mt-3">
                      <h6 className="f-w-600 text-dark">
                        <i className="ti ti-map-pins f-s-18 me-2"></i>
                        Total Distance
                      </h6>
                      <div className="text-end badge bg-primary">
                        <p>{bookingDetails.distance} KM</p>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between mt-3">
                      <h6 className="f-w-600 text-dark">
                        <i className="ti ti-clock f-s-18 me-2"></i>
                        Total Time
                      </h6>
                      <div className="text-end badge bg-primary">
                        <p>{bookingDetails.total_time}</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Col>

          {/* Right Side Column */}
          <Col xxl={3}>
            <Card className="equal-card shadow-lg border-0">
              <CardHeader>
                <h5>Order Status</h5>
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
                          <i className="ti ti-checks f-s-20"></i>
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
                            {history.status === "End Trip"
                              ? "Completed"
                              : history.status}
                          </h6>
                          <span
                            className={`badge text-bg-${
                              statusColors[history.status]
                            } ms-2`}
                          >
                            {getTimeAgo(history.time)}
                          </span>
                        </div>
                        <p className="text-secondary">{history.date}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardBody>
              <CardFooter>
                <Card className="shadow-lg border-0 rounded-lg">
                  <CardHeader>
                    <h5>Price Details</h5>
                  </CardHeader>
                  <CardBody>
                    <div className="table-responsive">
                      <table className="table cart-side-table mb-0">
                        <tbody>
                          <tr className="total-price">
                            <th>Sub Total :</th>
                            <th className="text-end">
                              <span>₹ {bookingDetails.total_price}</span>
                            </th>
                          </tr>
                          <tr>
                            <td>GST Amount :</td>
                            <td className="text-end">
                              ₹ {bookingDetails.gst_amount}
                            </td>
                          </tr>
                          <tr>
                            <td>IGST Amount :</td>
                            <td className="text-end">
                              ₹ {bookingDetails.igst_amount}
                            </td>
                          </tr>
                          <tr className="total-price">
                            <th>Payment Method :</th>
                            <th className="text-end">
                              <div className="badge bg-green-700">
                                <span>{bookingDetails.payment_method}</span>
                              </div>
                            </th>
                          </tr>
                          <tr className="total-price">
                            <th>Total (INR) :</th>
                            <th className="text-end">
                              <div className="badge bg-primary">
                                <span>
                                  ₹ {Math.round(bookingDetails.total_price)}/-
                                </span>
                              </div>
                            </th>
                          </tr>
                          <tr>
                            <td colSpan="2">
                              <Button
                                type="button"
                                color="primary"
                                className="w-100 mt-3"
                                onClick={handleGenerateInvoice}
                              >
                                <i className="ti ti-printer me-2"></i>
                                Generate Invoice
                              </Button>
                            </td>
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

export default OtherDriverOrderDetails;
